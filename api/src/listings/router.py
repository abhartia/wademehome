"""Public listing browse endpoints (same auth rules as /listings/chat via ASGI middleware)."""

from __future__ import annotations

import math
import time
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import inspect, text

from auth.router import get_current_user_or_none
from core.config import Config
from core.logger import get_logger
from db.models import Users
from listings.mapbox_client import driving_durations_minutes, forward_geocode, search_category_nearby
from listings.listing_amenities_concessions import merge_concession_snippets_from_listing_amenities
from listings.listings_table_cache import cached_execute_all, cached_execute_first
from listings.market_snapshot import build_market_snapshot_sql, extract_zip_from_address, normalize_us_zip_query
from listings.market_snapshot import _rent_sql_expr
from listings.price_histogram import BUCKET_COUNT, build_price_histogram_sql
from listings.nearby_mapper import row_to_property_data_item
from listings.property_key import item_matches_property_key, parse_property_key, property_key_from_item
from listings.schemas import (
    CommuteLegResult,
    CommuteMatrixResponse,
    GeocodeResponse,
    MarketSnapshotResponse,
    NearbyListingsResponse,
    NearestTransitResponse,
    NearestTransitStation,
    PoiHit,
    PoiNearbyResponse,
    PriceHistogramBucket,
    PriceHistogramResponse,
    SitemapKeysResponse,
    TransitStationPoint,
    TransitStationsResponse,
)
from workflow.events import PropertyDataItem
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

router = APIRouter(prefix="/listings", tags=["listings"])


def _visibility_where(cols: set[str], alias: str | None = None) -> str:
    """Restrict /listings/nearby to public rows. User-contributed private rows are tracked
    via the user's Saved tab, not surfaced on the map. Defensive against NULLs in case
    any legacy rows slipped through the migration default."""
    if "visibility" not in cols:
        return "TRUE"
    p = f"{alias}." if alias else ""
    return f"({p}visibility = 'public' OR {p}visibility IS NULL)"


def _rent_filter_clause(
    cols: set[str], *, min_rent: float | None, max_rent: float | None
) -> tuple[str, dict[str, Any]]:
    """Extra SQL and params for narrowing to a rent range. Rows without a
    usable rent value are excluded whenever a filter is active (same scope
    as the price histogram), so the map and the histogram agree on what's
    filterable."""
    if min_rent is None and max_rent is None:
        return "", {}
    rent = _rent_sql_expr(cols)
    if rent is None:
        return "", {}
    parts: list[str] = [f"({rent}) IS NOT NULL"]
    params: dict[str, Any] = {}
    if min_rent is not None:
        parts.append(f"({rent}) >= :r_min")
        params["r_min"] = float(min_rent)
    if max_rent is not None:
        parts.append(f"({rent}) <= :r_max")
        params["r_max"] = float(max_rent)
    return " AND " + " AND ".join(parts), params


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
    min_rent: float | None = None,
    max_rent: float | None = None,
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
    rent_clause, rent_params = _rent_filter_clause(cols, min_rent=min_rent, max_rent=max_rent)
    params.update(rent_params)
    vis = _visibility_where(cols, "t_inner")
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
              AND {vis}{rent_clause}
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
              AND {vis}{rent_clause}
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
          AND {vis}{rent_clause}
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
    min_rent: float | None = Query(
        default=None, ge=0, le=1_000_000,
        description="Minimum monthly rent (USD). Rows with no rent data are kept.",
    ),
    max_rent: float | None = Query(
        default=None, ge=0, le=1_000_000,
        description="Maximum monthly rent (USD). Rows with no rent data are kept.",
    ),
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
            rent_clause, rent_params = _rent_filter_clause(
                cols, min_rent=min_rent, max_rent=max_rent
            )
            params: dict[str, Any] = {
                "lat": q_lat,
                "lng": q_lng,
                "limit": limit,
                # Need enough candidate rows before per-building dedupe, especially for
                # dense markets where many unit rows belong to the same property.
                "prefetch_limit": min(max(limit * 20, limit), 2500),
            }
            params.update(rent_params)

            if bbox_mode:
                assert west is not None and south is not None and east is not None and north is not None
                params.update({"west": west, "south": south, "east": east, "north": north})
                bbox_where = """
                latitude IS NOT NULL
                  AND longitude IS NOT NULL
                  AND latitude BETWEEN :south AND :north
                  AND longitude BETWEEN :west AND :east
                """
                _vis_inner = _visibility_where(cols, "t_inner")
                bbox_where_inner = f"""
                t_inner.latitude IS NOT NULL
                  AND t_inner.longitude IS NOT NULL
                  AND t_inner.latitude BETWEEN :south AND :north
                  AND t_inner.longitude BETWEEN :west AND :east
                  AND {_vis_inner}{rent_clause}
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
                          AND {_vis_inner}{rent_clause}
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
                          AND {_vis_inner}{rent_clause}
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
                    min_rent=min_rent,
                    max_rent=max_rent,
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


def _resolve_property_by_key(
    key: str, *, current_user_id: str | None = None
) -> PropertyDataItem | None:
    """Resolve a property_key to a listing. Private user-contributed rows are
    only returned to their contributor — public (or legacy NULL-visibility)
    rows are readable by anyone, same as /listings/nearby."""
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
                row_dict = dict(row)
                visibility = row_dict.get("visibility")
                if visibility == "private":
                    contributor = row_dict.get("contributed_by_user_id")
                    if current_user_id is None or str(contributor) != str(current_user_id):
                        continue
                item = row_to_property_data_item(row_dict)
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


@router.get("/sitemap-keys", response_model=SitemapKeysResponse)
def get_sitemap_keys() -> SitemapKeysResponse:
    """Return all distinct property keys for sitemap generation."""
    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return SitemapKeysResponse()
    if engine.dialect.name != "postgresql":
        return SitemapKeysResponse()

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return SitemapKeysResponse()

            cols = _table_columns_lower(conn, schema_for_info, tname)
            distinct_on, order_building = _distinct_on_building(cols)

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
                """
            )
            rows = cached_execute_all(conn, sql, {})

        keys: list[str] = []
        for row in rows:
            try:
                item = row_to_property_data_item(dict(row))
                keys.append(property_key_from_item(item))
            except Exception:
                logger.debug("sitemap-keys: skip row")

        return SitemapKeysResponse(keys=keys)
    except Exception:
        logger.exception("sitemap-keys: query failed")
        return SitemapKeysResponse()


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
    user: Users | None = Depends(get_current_user_or_none),
) -> PropertyDataItem:
    item = _resolve_property_by_key(
        property_key,
        current_user_id=str(user.id) if user else None,
    )
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


def _round_nice(value: float, *, down: bool) -> float:
    """Round to a human-friendly edge for a price axis. Granularity tracks
    magnitude so the histogram x-axis reads as whole-hundred-dollar ticks
    at typical NYC-area rents, whole-thousands for luxury markets, etc."""
    if value <= 0:
        return 0.0
    if value < 1000:
        step = 50.0
    elif value < 5000:
        step = 100.0
    elif value < 20000:
        step = 500.0
    else:
        step = 1000.0
    if down:
        return math.floor(value / step) * step
    return math.ceil(value / step) * step


@router.get("/price-histogram", response_model=PriceHistogramResponse)
def get_price_histogram(
    west: float | None = Query(default=None, ge=-180, le=180),
    south: float | None = Query(default=None, ge=-90, le=90),
    east: float | None = Query(default=None, ge=-180, le=180),
    north: float | None = Query(default=None, ge=-90, le=90),
    city: str | None = Query(default=None, max_length=120),
    state: str | None = Query(default=None, max_length=32),
    min_beds: int | None = Query(default=None, ge=0, le=20),
    max_beds: int | None = Query(default=None, ge=0, le=20),
) -> PriceHistogramResponse:
    """Rent distribution for the listings inside a map bounding box or a
    city/state, shaped so the PriceRangeFilter UI can draw a histogram and
    anchor the dual-handle slider to real data. Buckets are dynamic: the
    scale runs between the 1st and 99th percentile of observed rent so a
    single outlier can't flatten the chart."""
    bbox_mode = all(v is not None for v in (west, south, east, north))
    if bbox_mode:
        assert west is not None and south is not None and east is not None and north is not None
        _validate_bbox(west, south, east, north)

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)
    if engine.dialect.name != "postgresql":
        logger.warning(
            "listings/price-histogram: unsupported dialect %s", engine.dialect.name
        )
        return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)
            cols = _table_columns_lower(conn, schema_for_info, tname)
            built = build_price_histogram_sql(
                qtable,
                cols,
                west=west,
                south=south,
                east=east,
                north=north,
                city=city,
                state=state,
                min_beds=min_beds,
                max_beds=max_beds,
            )
            if built is None:
                return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)
            sql, params = built
            row = cached_execute_first(conn, text(sql), params)
    except Exception:
        logger.exception("listings/price-histogram: query failed")
        return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)

    if not row:
        return PriceHistogramResponse(sample_size=0, bucket_count=BUCKET_COUNT)

    sample_size = int(row.get("sample_size") or 0)
    p01 = row.get("p01")
    p99 = row.get("p99")
    min_observed = row.get("min_rent")
    max_observed = row.get("max_rent")

    if sample_size == 0 or p01 is None or p99 is None or float(p99) <= float(p01):
        return PriceHistogramResponse(
            sample_size=sample_size,
            bucket_count=BUCKET_COUNT,
            min_rent=float(min_observed) if min_observed is not None else None,
            max_rent=float(max_observed) if max_observed is not None else None,
        )

    range_min = _round_nice(float(p01), down=True)
    range_max = _round_nice(float(p99), down=False)
    if range_max <= range_min:
        range_max = range_min + 100.0
    bucket_width = (range_max - range_min) / BUCKET_COUNT

    raw_buckets = row.get("buckets") or []
    counts_by_index: dict[int, int] = {}
    for b in raw_buckets:
        try:
            idx = int(b.get("bucket"))
            cnt = int(b.get("count") or 0)
        except (TypeError, ValueError):
            continue
        counts_by_index[idx] = counts_by_index.get(idx, 0) + cnt

    buckets_out: list[PriceHistogramBucket] = []
    # 0 = below range_min, 1..BUCKET_COUNT = in range, BUCKET_COUNT+1 = above range_max.
    for i in range(0, BUCKET_COUNT + 2):
        count = counts_by_index.get(i, 0)
        if i == 0:
            lo = float(min_observed) if min_observed is not None else range_min
            hi = range_min
        elif i == BUCKET_COUNT + 1:
            lo = range_max
            hi = float(max_observed) if max_observed is not None else range_max
        else:
            lo = range_min + bucket_width * (i - 1)
            hi = range_min + bucket_width * i
        if count == 0 and i != 0 and i != BUCKET_COUNT + 1:
            # Emit the bar anyway (with 0 count) so the UI can draw a continuous axis.
            pass
        buckets_out.append(
            PriceHistogramBucket(index=i, count=count, min_rent=lo, max_rent=hi)
        )

    return PriceHistogramResponse(
        sample_size=sample_size,
        bucket_count=BUCKET_COUNT,
        range_min=range_min,
        range_max=range_max,
        min_rent=float(min_observed) if min_observed is not None else None,
        max_rent=float(max_observed) if max_observed is not None else None,
        p25_rent=float(row.get("p25")) if row.get("p25") is not None else None,
        median_rent=float(row.get("p50")) if row.get("p50") is not None else None,
        p75_rent=float(row.get("p75")) if row.get("p75") is not None else None,
        buckets=buckets_out,
    )


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


# ── Nearest transit ───────────────────────────────────────────────────
# Straight-line haversine distance scaled to walk time at 3 mph, with a
# 20% detour factor to approximate real street-network pathing. This
# undershoots on grid-only neighborhoods (JSQ, Downtown JC) and slightly
# overshoots on blocks with diagonal paths — good enough for "is this
# listing walkable to PATH?" filtering without requiring a routing API.
_WALK_SPEED_MPH = 3.0
_WALK_DETOUR = 1.2


def _haversine_miles(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r_mi = 3958.7613
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r_mi * c


@router.get("/nearest-transit", response_model=NearestTransitResponse)
def nearest_transit(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    systems: str | None = Query(
        default=None,
        description=(
            "Comma-separated list of transit systems to consider "
            "(e.g. 'path,hblr,ferry'). Omit for all systems."
        ),
    ),
    limit: int = Query(default=5, ge=1, le=25),
    max_walk_minutes: int | None = Query(default=None, ge=1, le=60),
) -> NearestTransitResponse:
    """Return the N nearest transit stations to a given point, with straight-line
    walk times at 3 mph + 20% detour overhead. Used for filtering/labeling
    JC listings by PATH/HBLR/ferry proximity."""
    allowed_systems: set[str] | None = None
    if systems:
        allowed_systems = {s.strip() for s in systems.split(",") if s.strip()}
        if not allowed_systems:
            allowed_systems = None

    sql = """
        SELECT system::text, station_name, lines, latitude, longitude
        FROM transit_stations
    """
    params: dict[str, Any] = {}
    if allowed_systems:
        sql += " WHERE system::text = ANY(:systems)"
        params["systems"] = list(allowed_systems)

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()

    scored: list[NearestTransitStation] = []
    for r in rows:
        d_mi = _haversine_miles(
            latitude, longitude, float(r["latitude"]), float(r["longitude"])
        )
        walk_min = int(round((d_mi / _WALK_SPEED_MPH) * 60 * _WALK_DETOUR))
        if max_walk_minutes is not None and walk_min > max_walk_minutes:
            continue
        scored.append(
            NearestTransitStation(
                system=r["system"],
                station_name=r["station_name"],
                lines=list(r["lines"] or []),
                latitude=float(r["latitude"]),
                longitude=float(r["longitude"]),
                distance_miles=round(d_mi, 3),
                walk_minutes=walk_min,
            )
        )

    scored.sort(key=lambda s: (s.walk_minutes, s.distance_miles))
    return NearestTransitResponse(
        latitude=latitude,
        longitude=longitude,
        stations=scored[:limit],
    )


@router.get("/transit-stations", response_model=TransitStationsResponse)
def list_transit_stations(
    systems: str | None = Query(
        default=None,
        description=(
            "Comma-separated systems to include (e.g. 'path,hblr,ferry,nyc_subway'). "
            "Omit for all systems."
        ),
    ),
    west: float | None = Query(default=None, ge=-180, le=180),
    south: float | None = Query(default=None, ge=-90, le=90),
    east: float | None = Query(default=None, ge=-180, le=180),
    north: float | None = Query(default=None, ge=-90, le=90),
    limit: int = Query(default=1000, ge=1, le=2000),
) -> TransitStationsResponse:
    """Return transit stations for map overlays. All four bbox params must
    be provided together or all omitted. With no bbox, returns every
    seeded station (currently ~490 across PATH/HBLR/ferry/NYC subway)."""
    bbox_params = [west, south, east, north]
    has_bbox_any = any(p is not None for p in bbox_params)
    has_bbox_all = all(p is not None for p in bbox_params)
    if has_bbox_any and not has_bbox_all:
        raise HTTPException(
            status_code=422,
            detail="Provide all four of west/south/east/north, or none.",
        )

    allowed_systems: list[str] | None = None
    if systems:
        allowed_systems = [s.strip() for s in systems.split(",") if s.strip()]
        if not allowed_systems:
            allowed_systems = None

    sql = "SELECT system::text, station_name, lines, latitude, longitude, borough FROM transit_stations"
    conditions: list[str] = []
    params: dict[str, Any] = {}
    if allowed_systems:
        conditions.append("system::text = ANY(:systems)")
        params["systems"] = allowed_systems
    if has_bbox_all:
        conditions.append(
            "longitude BETWEEN :west AND :east AND latitude BETWEEN :south AND :north"
        )
        params.update({"west": west, "east": east, "south": south, "north": north})
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY system, station_name LIMIT :limit"
    params["limit"] = limit

    with engine.connect() as conn:
        rows = conn.execute(text(sql), params).mappings().all()

    stations = [
        TransitStationPoint(
            system=r["system"],
            station_name=r["station_name"],
            lines=list(r["lines"] or []),
            latitude=float(r["latitude"]),
            longitude=float(r["longitude"]),
            borough=r["borough"],
        )
        for r in rows
    ]
    return TransitStationsResponse(stations=stations, total=len(stations))
