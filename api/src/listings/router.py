"""Public listing browse endpoints (same auth rules as /listings/chat via ASGI middleware)."""

from __future__ import annotations

import math
import time
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import inspect, text

from core.config import Config
from core.logger import get_logger
from listings.mapbox_client import driving_durations_minutes, forward_geocode, search_category_nearby
from listings.listing_amenities_concessions import merge_concession_snippets_from_listing_amenities
from listings.listings_table_cache import cached_execute_all, cached_execute_first
from listings.market_snapshot import build_market_snapshot_sql, extract_zip_from_address, normalize_us_zip_query
from listings.nearby_mapper import row_to_property_data_item
from listings.property_key import item_matches_property_key, parse_property_key
from listings.schemas import (
    CommuteLegResult,
    CommuteMatrixResponse,
    GeocodeResponse,
    MarketSnapshotResponse,
    NearbyListingsResponse,
    PoiHit,
    PoiNearbyResponse,
)
from workflow.events import PropertyDataItem
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

router = APIRouter(prefix="/listings", tags=["listings"])


def _haversine_mi_sql(*, table_alias: str | None = None) -> str:
    """Spherical law of cosines, miles. Optional table alias for qualified columns."""
    p = f"{table_alias}." if table_alias else ""
    lat_col = f"{p}latitude"
    lng_col = f"{p}longitude"
    return f"""
(
  3958.8 * acos(
    LEAST(1.0::double precision, GREATEST(-1.0::double precision,
      sin(radians(:lat)) * sin(radians({lat_col}::double precision))
      + cos(radians(:lat)) * cos(radians({lat_col}::double precision))
        * cos(radians({lng_col}::double precision) - radians(:lng))
    ))
  )
)
"""


def _qualified_table() -> str:
    name = (listing_table_name or "").strip()
    if not name:
        return ""
    schema = (listing_table_schema or "").strip()
    if schema:
        return f'"{schema}"."{name}"'
    return f'"{name}"'


def _table_columns_lower(conn, schema: str, tname: str) -> set[str]:
    rows = conn.execute(
        text(
            """
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = :schema AND table_name = :tname
            """
        ),
        {"schema": schema, "tname": tname},
    ).fetchall()
    return {str(r[0]).lower() for r in rows}


def _distinct_on_building(cols: set[str]) -> tuple[str, str]:
    """
    DISTINCT ON (...) and leading ORDER BY expressions (must match).
    Prefer property_id when present; else 5dp lat/lng (matches UI grouping).
    """
    if "property_id" in cols:
        return "t_inner.property_id", "t_inner.property_id"
    return (
        "ROUND(t_inner.latitude::numeric, 5), ROUND(t_inner.longitude::numeric, 5)",
        "ROUND(t_inner.latitude::numeric, 5), ROUND(t_inner.longitude::numeric, 5)",
    )


def _empty_response(
    radius_miles: float,
    limit: int,
    *,
    used_bbox: bool = False,
) -> NearbyListingsResponse:
    return NearbyListingsResponse(
        properties=[],
        total_in_radius=0,
        radius_miles=radius_miles,
        limit=limit,
        used_global_nearest_fallback=False,
        used_bbox=used_bbox,
    )


def _building_key_from_row(row: dict[str, Any]) -> str:
    pid = row.get("property_id")
    if pid not in (None, ""):
        return f"pid:{pid}"
    lat = row.get("latitude")
    lng = row.get("longitude")
    if lat is not None and lng is not None:
        try:
            return f"ll:{round(float(lat), 5)}:{round(float(lng), 5)}"
        except Exception:
            pass
    lid = row.get("listing_id")
    if lid not in (None, ""):
        return f"lid:{lid}"
    return "unknown"


def _nearby_projection(cols: set[str]) -> str:
    """Project only columns needed by row mapper to avoid loading huge blobs."""
    wanted = (
        "property_id",
        "listing_id",
        "building_name",
        "property_name",
        "name",
        "title",
        "address",
        "street_address",
        "full_address",
        "formatted_address",
        "location",
        "city",
        "locality",
        "state",
        "state_code",
        "region",
        "zipcode",
        "zip",
        "postal_code",
        "latitude",
        "longitude",
        "lat",
        "lng",
        "lon",
        "rent_range",
        "rental_range",
        "price_range",
        "list_price_range",
        "min_rent",
        "max_rent",
        "monthly_rent",
        "rent_price",
        "rent",
        "price",
        "list_price",
        "bedroom_range",
        "bedrooms_display",
        "beds_range",
        "bedrooms",
        "bedroom_count",
        "beds",
        "num_bedrooms",
        "n_bedrooms",
        # Prefer pre-normalized image columns; avoid raw heavy JSON blobs (images/photos).
        "images_urls",
        "image_urls",
        "image_url",
        "primary_image_url",
        "photo_url",
        "thumbnail_url",
        "listing_url",
        "listingurl",
        "source_url",
        "sourceurl",
        "url",
        "concession",
        "specials",
        "move_in_special",
        "special_offer",
        "special_offers",
        "leasing_special",
        "leasing_specials",
        "rent_special",
        "promotion",
        "promotions",
        "incentive",
        "incentives",
        "offer_text",
        "lease_concession",
        "available_date",
        "available_on",
        "available_at",
        "date_available",
        "move_in_date",
        "earliest_move_in",
        "availability",
        "availability_status",
        "unit_availability",
        # Needed for concession inference when dedicated columns are empty (Greystar / many loaders).
        "amenities",
        "amenity_list",
        "features",
        "apartment_amenities",
        "community_amenities",
        "building_amenities",
    )
    chosen = [c for c in wanted if c in cols]
    if not chosen:
        return "t_inner.*"
    return ", ".join(f't_inner."{c}"' for c in chosen)


# Max bbox span per axis (degrees) to limit query cost / abuse (~a few hundred miles at mid-latitudes).
_MAX_BBOX_LAT_SPAN = 4.0
_MAX_BBOX_LNG_SPAN = 6.0


def _validate_bbox(west: float, south: float, east: float, north: float) -> None:
    if south >= north:
        raise HTTPException(status_code=422, detail="Bounding box invalid: south must be less than north")
    if west >= east:
        raise HTTPException(
            status_code=422,
            detail="Bounding box invalid: west must be less than east (antimeridian crossing not supported)",
        )
    if (north - south) > _MAX_BBOX_LAT_SPAN or (east - west) > _MAX_BBOX_LNG_SPAN:
        raise HTTPException(
            status_code=422,
            detail="Map area too large; zoom in further to load listings for the visible region.",
        )


def _run_nearby_radius_query(
    conn: Any,
    *,
    qtable: str,
    cols: set[str],
    select_cols: str,
    hav_inner: str,
    q_lat: float,
    q_lng: float,
    radius_miles: float,
    limit: int,
    include_total: bool,
) -> tuple[list[Any], int, bool]:
    """Radius-mode SQL; returns raw rows, total_in_scope (or 0), used_global_fallback."""
    params: dict[str, Any] = {
        "lat": q_lat,
        "lng": q_lng,
        "limit": limit,
        "prefetch_limit": min(max(limit * 20, limit), 2500),
        "radius": radius_miles,
        "radius_m": float(radius_miles) * 1609.344,
    }
    if "geog" in cols:
        total_value_expr = "COUNT(*) OVER ()::bigint" if include_total else "NULL::bigint"
        select_sql = text(
            f"""
            SELECT
              {select_cols},
              {total_value_expr} AS total_in_scope,
              ST_Distance(
                t_inner.geog,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
              ) / 1609.344 AS d_mi
            FROM {qtable} AS t_inner
            WHERE t_inner.geog IS NOT NULL
              AND ST_DWithin(
                t_inner.geog,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                :radius_m
              )
            ORDER BY t_inner.geog <-> ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
            LIMIT :prefetch_limit
            """
        )
    else:
        total_value_expr = "COUNT(*) OVER ()::bigint" if include_total else "NULL::bigint"
        select_sql = text(
            f"""
            SELECT
              {select_cols},
              {total_value_expr} AS total_in_scope,
              ({hav_inner}) AS d_mi
            FROM {qtable} AS t_inner
            WHERE t_inner.latitude IS NOT NULL
              AND t_inner.longitude IS NOT NULL
              AND ({hav_inner}) <= :radius
            ORDER BY ({hav_inner}) ASC
            LIMIT :prefetch_limit
            """
        )
    rows = cached_execute_all(conn, select_sql, params)
    if rows:
        total = int(rows[0].get("total_in_scope") or 0) if include_total else 0
        used_fallback = False
        return rows, total, used_fallback

    logger.info(
        "listings/nearby: 0 within radius=%s mi of (%s,%s); returning %s nearest buildings",
        radius_miles,
        q_lat,
        q_lng,
        limit,
    )
    fallback_sql = text(
        f"""
        SELECT
          {select_cols},
          ({hav_inner}) AS d_mi
        FROM {qtable} AS t_inner
        WHERE t_inner.latitude IS NOT NULL
          AND t_inner.longitude IS NOT NULL
        ORDER BY ({hav_inner}) ASC
        LIMIT :prefetch_limit
        """
    )
    rows = cached_execute_all(conn, fallback_sql, params)
    return rows, 0, bool(rows)


def fetch_nearby_listings_radius(
    latitude: float,
    longitude: float,
    radius_miles: float,
    limit: int,
) -> NearbyListingsResponse:
    """
    Same behavior as GET /listings/nearby in radius mode (for weekly reports and internal callers).
    """
    t0 = time.perf_counter()
    include_total = (Config.get("LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT", "false") or "false").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return _empty_response(radius_miles, limit, used_bbox=False)

    if engine.dialect.name != "postgresql":
        logger.warning("listings/nearby: unsupported dialect %s", engine.dialect.name)
        return _empty_response(radius_miles, limit, used_bbox=False)

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()
    hav_inner = _haversine_mi_sql(table_alias="t_inner")

    has_geog = False
    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return _empty_response(radius_miles, limit, used_bbox=False)

            cols = _table_columns_lower(conn, schema_for_info, tname)
            has_geog = "geog" in cols
            select_cols = _nearby_projection(cols)
            rows, total, used_fallback = _run_nearby_radius_query(
                conn,
                qtable=qtable,
                cols=cols,
                select_cols=select_cols,
                hav_inner=hav_inner,
                q_lat=latitude,
                q_lng=longitude,
                radius_miles=radius_miles,
                limit=limit,
                include_total=include_total,
            )

        deduped_rows: list[dict[str, Any]] = []
        seen_buildings: set[str] = set()
        for row in rows:
            row_dict = dict(row)
            bkey = _building_key_from_row(row_dict)
            if bkey in seen_buildings:
                continue
            seen_buildings.add(bkey)
            deduped_rows.append(row_dict)
            if len(deduped_rows) >= limit:
                break

        merge_concession_snippets_from_listing_amenities(deduped_rows)

        properties: list[PropertyDataItem] = []
        for row_dict in deduped_rows:
            try:
                row_dict.pop("d_mi", None)
                row_dict.pop("total_in_scope", None)
                properties.append(row_to_property_data_item(row_dict))
            except Exception:
                logger.exception("listings/nearby: skip row that failed to map")

        if not include_total:
            total = len(properties)

        resp = NearbyListingsResponse(
            properties=properties,
            total_in_radius=total,
            radius_miles=radius_miles,
            limit=limit,
            used_global_nearest_fallback=used_fallback,
            used_bbox=False,
        )
        logger.info(
            "listings/nearby radius(fetch) timing: total_ms=%s returned=%s total_in_scope=%s fallback=%s geog=%s",
            int((time.perf_counter() - t0) * 1000),
            len(properties),
            total,
            used_fallback,
            has_geog,
        )
        return resp
    except Exception:
        logger.exception("listings/nearby: fetch radius failed")
        return _empty_response(radius_miles, limit, used_bbox=False)


@router.get("/nearby", response_model=NearbyListingsResponse)
def get_nearby_listings(
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    radius_miles: float = Query(15, gt=0, le=500),
    west: float | None = Query(default=None, ge=-180, le=180),
    south: float | None = Query(default=None, ge=-90, le=90),
    east: float | None = Query(default=None, ge=-180, le=180),
    north: float | None = Query(default=None, ge=-90, le=90),
    limit: int = Query(50, ge=1, le=100),
) -> NearbyListingsResponse:
    """
    Up to `limit` map pins: one row per building/property.

    **Bounding box mode:** pass `west`, `south`, `east`, `north` (visible map extent). Listings are
    filtered to points inside the box; results are ordered by distance to the box center.

    **Radius mode (legacy):** pass `latitude`, `longitude`, and `radius_miles`. When any inventory
    exists in that radius, results stay inside the circle; otherwise nearest buildings globally.

    Requires PostgreSQL, DATABASE_URL, LISTINGS_TABLE_NAME, latitude/longitude columns.
    """
    t0 = time.perf_counter()
    bbox_mode = all(v is not None for v in (west, south, east, north))
    include_total = (Config.get("LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT", "false") or "false").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    center_mode = latitude is not None and longitude is not None

    if bbox_mode:
        assert west is not None and south is not None and east is not None and north is not None
        _validate_bbox(west, south, east, north)
        q_lat = (south + north) / 2.0
        q_lng = (west + east) / 2.0
        response_radius = 0.0
    elif center_mode:
        assert latitude is not None and longitude is not None
        q_lat = latitude
        q_lng = longitude
        response_radius = radius_miles
    else:
        raise HTTPException(
            status_code=422,
            detail="Provide either bounding box (west, south, east, north) or latitude and longitude.",
        )

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return _empty_response(response_radius, limit, used_bbox=bbox_mode)

    if engine.dialect.name != "postgresql":
        logger.warning("listings/nearby: unsupported dialect %s", engine.dialect.name)
        return _empty_response(response_radius, limit, used_bbox=bbox_mode)

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()
    hav_inner = _haversine_mi_sql(table_alias="t_inner")

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return _empty_response(response_radius, limit, used_bbox=bbox_mode)

            cols = _table_columns_lower(conn, schema_for_info, tname)
            select_cols = _nearby_projection(cols)
            params: dict[str, Any] = {
                "lat": q_lat,
                "lng": q_lng,
                "limit": limit,
                # Need enough candidate rows before per-building dedupe, especially for
                # dense markets where many unit rows belong to the same property.
                "prefetch_limit": min(max(limit * 20, limit), 2500),
            }

            if bbox_mode:
                assert west is not None and south is not None and east is not None and north is not None
                params.update({"west": west, "south": south, "east": east, "north": north})
                bbox_where = """
                latitude IS NOT NULL
                  AND longitude IS NOT NULL
                  AND latitude BETWEEN :south AND :north
                  AND longitude BETWEEN :west AND :east
                """
                bbox_where_inner = """
                t_inner.latitude IS NOT NULL
                  AND t_inner.longitude IS NOT NULL
                  AND t_inner.latitude BETWEEN :south AND :north
                  AND t_inner.longitude BETWEEN :west AND :east
                """
                # Circle that fully covers the requested bbox for indexed prefiltering.
                params["bbox_radius_m"] = (
                    float(math.hypot((north - south) * 110_574.0, (east - west) * 111_320.0 * max(0.25, math.cos(math.radians(q_lat)))) / 2.0)
                )
                # Use geog+GiST path when available; fall back to haversine for portability.
                if "geog" in cols:
                    total_value_expr = "COUNT(*) OVER ()::bigint" if include_total else "NULL::bigint"
                    select_sql = text(
                        f"""
                        SELECT
                          {select_cols},
                          {total_value_expr} AS total_in_scope,
                          ST_Distance(
                            t_inner.geog,
                            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
                          ) / 1609.344 AS d_mi
                        FROM {qtable} AS t_inner
                        WHERE t_inner.geog IS NOT NULL
                          AND ST_DWithin(
                            t_inner.geog,
                            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                            :bbox_radius_m
                          )
                          AND t_inner.latitude BETWEEN :south AND :north
                          AND t_inner.longitude BETWEEN :west AND :east
                        ORDER BY t_inner.geog <-> ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
                        LIMIT :prefetch_limit
                        """
                    )
                else:
                    # Single-pass scoped query: nearest rows + in-scope total count.
                    total_value_expr = "COUNT(*) OVER ()::bigint" if include_total else "NULL::bigint"
                    select_sql = text(
                        f"""
                        SELECT
                          {select_cols},
                          {total_value_expr} AS total_in_scope,
                          ({hav_inner}) AS d_mi
                        FROM {qtable} AS t_inner
                        WHERE {bbox_where_inner}
                        ORDER BY ({hav_inner}) ASC
                        LIMIT :prefetch_limit
                        """
                    )
                rows = cached_execute_all(conn, select_sql, params)
                if rows:
                    total = int(rows[0].get("total_in_scope") or 0) if include_total else 0
                    used_fallback = False
                else:
                    logger.info(
                        "listings/nearby: 0 within bbox; returning %s nearest buildings",
                        limit,
                    )
                    fallback_sql = text(
                        f"""
                        SELECT
                          {select_cols},
                          ({hav_inner}) AS d_mi
                        FROM {qtable} AS t_inner
                        WHERE t_inner.latitude IS NOT NULL
                          AND t_inner.longitude IS NOT NULL
                        ORDER BY ({hav_inner}) ASC
                        LIMIT :prefetch_limit
                        """
                    )
                    rows = cached_execute_all(conn, fallback_sql, params)
                    total = 0
                    used_fallback = bool(rows)
            else:
                rows, total, used_fallback = _run_nearby_radius_query(
                    conn,
                    qtable=qtable,
                    cols=cols,
                    select_cols=select_cols,
                    hav_inner=hav_inner,
                    q_lat=q_lat,
                    q_lng=q_lng,
                    radius_miles=radius_miles,
                    limit=limit,
                    include_total=include_total,
                )

        # Keep one listing per building while preserving nearest-first ordering.
        deduped_rows: list[dict[str, Any]] = []
        seen_buildings: set[str] = set()
        for row in rows:
            row_dict = dict(row)
            bkey = _building_key_from_row(row_dict)
            if bkey in seen_buildings:
                continue
            seen_buildings.add(bkey)
            deduped_rows.append(row_dict)
            if len(deduped_rows) >= limit:
                break

        merge_concession_snippets_from_listing_amenities(deduped_rows)

        properties: list[PropertyDataItem] = []
        for row_dict in deduped_rows:
            try:
                row_dict.pop("d_mi", None)
                row_dict.pop("total_in_scope", None)
                properties.append(row_to_property_data_item(row_dict))
            except Exception:
                logger.exception("listings/nearby: skip row that failed to map")

        if not include_total:
            total = len(properties)

        resp = NearbyListingsResponse(
            properties=properties,
            total_in_radius=total,
            radius_miles=response_radius,
            limit=limit,
            used_global_nearest_fallback=used_fallback,
            used_bbox=bbox_mode,
        )
        logger.info(
            "listings/nearby timing: mode=%s total_ms=%s returned=%s total_in_scope=%s fallback=%s geog=%s",
            "bbox" if bbox_mode else "radius",
            int((time.perf_counter() - t0) * 1000),
            len(properties),
            total,
            used_fallback,
            "geog" in cols,
        )
        return resp
    except HTTPException:
        raise
    except Exception:
        logger.exception("listings/nearby: query failed")
        return _empty_response(response_radius, limit, used_bbox=bbox_mode)


def _resolve_property_by_key(key: str) -> PropertyDataItem | None:
    parsed = parse_property_key(key)
    if parsed is None:
        return None

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return None
    if engine.dialect.name != "postgresql":
        return None

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return None

            cols = _table_columns_lower(conn, schema_for_info, tname)
            distinct_on, order_building = _distinct_on_building(cols)

            has_coord_tokens = parsed.lat_token != "na" and parsed.lng_token != "na"
            if has_coord_tokens:
                try:
                    lat_k = float(parsed.lat_token)
                    lng_k = float(parsed.lng_token)
                except ValueError:
                    return None
                eps = 0.00012
                params: dict[str, object] = {
                    "lat0": lat_k - eps,
                    "lat1": lat_k + eps,
                    "lng0": lng_k - eps,
                    "lng1": lng_k + eps,
                    "limit": 250,
                }
                sql = text(
                    f"""
                    SELECT * FROM (
                      SELECT DISTINCT ON ({distinct_on})
                        t_inner.*
                      FROM {qtable} AS t_inner
                      WHERE t_inner.latitude IS NOT NULL
                        AND t_inner.longitude IS NOT NULL
                        AND t_inner.latitude BETWEEN :lat0 AND :lat1
                        AND t_inner.longitude BETWEEN :lng0 AND :lng1
                      ORDER BY {order_building}
                    ) sub
                    LIMIT :limit
                    """
                )
                rows = cached_execute_all(conn, sql, params)
            else:
                params = {"limit": 1800}
                if "property_id" in cols:
                    sql = text(
                        f"""
                        SELECT * FROM (
                          SELECT DISTINCT ON (t_inner.property_id)
                            t_inner.*
                          FROM {qtable} AS t_inner
                          ORDER BY t_inner.property_id
                        ) sub
                        LIMIT :limit
                        """
                    )
                else:
                    sql = text(
                        f"""
                        SELECT * FROM (
                          SELECT DISTINCT ON ({distinct_on})
                            t_inner.*
                          FROM {qtable} AS t_inner
                          WHERE t_inner.latitude IS NOT NULL
                            AND t_inner.longitude IS NOT NULL
                          ORDER BY {order_building}
                        ) sub
                        LIMIT :limit
                        """
                    )
                rows = cached_execute_all(conn, sql, params)

        matches: list[PropertyDataItem] = []
        for row in rows:
            try:
                item = row_to_property_data_item(dict(row))
                if item_matches_property_key(key, item):
                    matches.append(item)
            except Exception:
                logger.exception("listings/by-property-key: skip row")

        if len(matches) == 1:
            return matches[0]
        if len(matches) > 1:
            logger.warning("listings/by-property-key: ambiguous key (%s matches)", len(matches))
        return None
    except Exception:
        logger.exception("listings/by-property-key: query failed")
        return None


class GeocodeBody(BaseModel):
    address: str = Field(..., min_length=3, max_length=500)


class LatLngIn(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class CommuteMatrixBody(BaseModel):
    origin: LatLngIn
    destinations: list[LatLngIn] = Field(..., min_length=1, max_length=12)
    labels: list[str] = Field(default_factory=list)


@router.get("/by-property-key", response_model=PropertyDataItem)
def get_listing_by_property_key(
    property_key: str = Query(..., min_length=5, max_length=600),
) -> PropertyDataItem:
    item = _resolve_property_by_key(property_key)
    if item is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return item


@router.post("/geocode", response_model=GeocodeResponse)
def geocode_address(body: GeocodeBody) -> GeocodeResponse:
    token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not token:
        raise HTTPException(status_code=503, detail="Geocoding unavailable")
    pair = forward_geocode(body.address, token)
    if pair is None:
        raise HTTPException(status_code=404, detail="No coordinates for address")
    lat, lng = pair
    return GeocodeResponse(latitude=lat, longitude=lng)


def fetch_market_snapshot(
    *,
    zip_code: str | None = None,
    city: str | None = None,
    state: str | None = None,
) -> MarketSnapshotResponse:
    """Reusable market-snapshot query.  Importable by other modules."""
    zip_t = normalize_us_zip_query(zip_code or "") if zip_code else None
    city_t = (city or "").strip()
    state_t = (state or "").strip()

    scope: str
    zip_out: str | None = None
    city_out: str | None = None
    state_out: str | None = None
    if zip_t:
        scope = f"ZIP {zip_t}"
        zip_out = zip_t
    elif city_t and state_t:
        scope = f"{city_t}, {state_t}"
        city_out = city_t
        state_out = state_t
    else:
        return MarketSnapshotResponse(scope="Unknown", sample_size=0, bedroom_mix={})

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})

    if engine.dialect.name != "postgresql":
        return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})

            cols = _table_columns_lower(conn, schema_for_info, tname)
            built = build_market_snapshot_sql(
                qtable,
                cols,
                zip_code=zip_t,
                city=city_t if not zip_t else None,
                state=state_t if not zip_t else None,
            )
            if built is None:
                return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})
            sql, params = built
            row = cached_execute_first(conn, sql, params)
            if row is None:
                return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})

            sample = int(row["sample_size"] or 0)
            mix_raw = row["bedroom_mix"]
            bedroom_mix: dict[str, int] = {}
            if isinstance(mix_raw, dict):
                bedroom_mix = {str(k): int(v) for k, v in mix_raw.items() if v is not None}

            def _f(name: str) -> float | None:
                v = row.get(name)
                if v is None:
                    return None
                try:
                    return float(v)
                except (TypeError, ValueError):
                    return None

            return MarketSnapshotResponse(
                scope=scope, zip=zip_out, city=city_out, state=state_out,
                sample_size=sample, median_rent=_f("p50"), p25_rent=_f("p25"), p75_rent=_f("p75"),
                bedroom_mix=bedroom_mix,
            )
    except Exception:
        logger.exception("fetch_market_snapshot failed")
        return MarketSnapshotResponse(scope=scope, zip=zip_out, city=city_out, state=state_out, sample_size=0, bedroom_mix={})


@router.get("/market-snapshot", response_model=MarketSnapshotResponse)
def get_market_snapshot(
    zip_q: str | None = Query(
        None,
        alias="zip",
        max_length=12,
        description="US ZIP; first 5 digits used (supports ZIP+4).",
    ),
    city: str | None = Query(None, max_length=120),
    state: str | None = Query(None, max_length=32),
    address: str | None = Query(
        None,
        max_length=500,
        description="Deprecated fallback: extract ZIP from free-text only if zip/city/state are missing.",
    ),
) -> MarketSnapshotResponse:
    city_t = (city or "").strip()
    state_t = (state or "").strip()
    zip_t = normalize_us_zip_query(zip_q or "") if zip_q else None
    if not zip_t and address and not (city_t and state_t):
        zip_t = normalize_us_zip_query(extract_zip_from_address(address or "") or "")

    if not zip_t and not (city_t and state_t):
        raise HTTPException(
            status_code=400,
            detail="Provide zip= (US postal code), or both city= and state=, or address= with a 5-digit ZIP.",
        )

    result = fetch_market_snapshot(zip_code=zip_t, city=city_t, state=state_t)
    if result.sample_size == 0 and not zip_t and not (city_t and state_t):
        raise HTTPException(status_code=400, detail="No data for this location")
    return result


@router.post("/commute-matrix", response_model=CommuteMatrixResponse)
def commute_matrix(body: CommuteMatrixBody) -> CommuteMatrixResponse:
    token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not token:
        raise HTTPException(status_code=503, detail="Commute matrix unavailable")

    dests = [(d.latitude, d.longitude) for d in body.destinations]
    mins = driving_durations_minutes(
        body.origin.latitude,
        body.origin.longitude,
        dests,
        token,
    )
    labels = body.labels
    legs: list[CommuteLegResult] = []
    for i, _dest in enumerate(body.destinations):
        lab = labels[i] if i < len(labels) else f"Stop {i + 1}"
        m = mins[i] if i < len(mins) else None
        legs.append(CommuteLegResult(label=lab, minutes=m, distance_meters=None))

    return CommuteMatrixResponse(
        origin_latitude=body.origin.latitude,
        origin_longitude=body.origin.longitude,
        legs=legs,
    )


# Mapbox Search Box canonical category ids (GET .../search/searchbox/v1/list/category).
_POI_CATEGORIES: tuple[tuple[str, str], ...] = (
    ("supermarket", "supermarket"),
    ("pharmacy", "pharmacy"),
    ("park", "park"),
    ("gym", "gym"),
)


def fetch_poi_nearby(latitude: float, longitude: float) -> PoiNearbyResponse:
    """Reusable POI lookup.  Importable by other modules."""
    token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not token:
        return PoiNearbyResponse(latitude=latitude, longitude=longitude, items=[])

    items: list[PoiHit] = []
    for cat, mapbox_category_id in _POI_CATEGORIES:
        try:
            hits = search_category_nearby(
                latitude, longitude, mapbox_category_id, token, limit=6
            )
        except Exception:
            logger.warning("POI search failed for %s", cat)
            hits = []
        nearest = hits[0] if hits else None
        name = None
        nlat = nlng = ndm = None
        if nearest:
            name = nearest.get("name") or nearest.get("place_name")
            nlat = nearest.get("latitude")
            nlng = nearest.get("longitude")
            raw_dm = nearest.get("distance_meters")
            if (
                isinstance(raw_dm, (int, float))
                and math.isfinite(float(raw_dm))
                and float(raw_dm) >= 0
            ):
                ndm = round(float(raw_dm), 1)
        items.append(
            PoiHit(
                category=cat,
                count=len(hits),
                nearest_name=name if isinstance(name, str) else None,
                nearest_latitude=float(nlat) if isinstance(nlat, (int, float)) else None,
                nearest_longitude=float(nlng) if isinstance(nlng, (int, float)) else None,
                nearest_distance_meters=ndm,
            )
        )

    return PoiNearbyResponse(latitude=latitude, longitude=longitude, items=items)


@router.get("/poi-nearby", response_model=PoiNearbyResponse)
def poi_nearby(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
) -> PoiNearbyResponse:
    result = fetch_poi_nearby(latitude, longitude)
    if not result.items:
        token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
        if not token:
            raise HTTPException(status_code=503, detail="POI search unavailable")
    return result
