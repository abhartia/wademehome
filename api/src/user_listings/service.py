"""Business logic for user-contributed listings: dedupe, create, visibility."""

from __future__ import annotations

import math
import re
import uuid
from dataclasses import dataclass
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import text

from core.config import Config
from core.logger import get_logger
from listings.mapbox_client import forward_geocode
from listings.property_key import build_property_key, slugify
from user_listings.schemas import (
    CreateUserListingRequest,
    DedupeMatch,
)
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

_DEDUPE_BBOX_METERS = 60.0  # ~60 m window — tighter than a block, wider than GPS jitter.
_EXACT_KEY_SCORE = 1.0
_STREET_MATCH_SCORE = 0.8
_BBOX_ONLY_SCORE = 0.4
_DEDUPE_MIN_SCORE = 0.4
_DEDUPE_LIMIT = 5


def _qualified_table() -> str:
    name = (listing_table_name or "").strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Listings table not configured.",
        )
    schema = (listing_table_schema or "").strip()
    if schema:
        return f'"{schema}"."{name}"'
    return f'"{name}"'


def _bbox_around(lat: float, lng: float, meters: float) -> tuple[float, float, float, float]:
    """Return (south, north, west, east) of a square bbox centered at (lat, lng)."""
    dlat = meters / 110_574.0
    cos_lat = math.cos(math.radians(lat))
    # At the equator we'd divide by ~111_320; guard against zero division near poles.
    lng_per_m = 1.0 / (111_320.0 * max(cos_lat, 0.05))
    dlng = meters * lng_per_m
    return lat - dlat, lat + dlat, lng - dlng, lng + dlng


_STREET_NUM_RE = re.compile(r"^\s*(\d+[a-z]?)\s+(.*)$", flags=re.IGNORECASE)


def _street_parts(address: str) -> tuple[str | None, str | None]:
    """(number_slug, street_slug) or (None, None) if un-parseable."""
    m = _STREET_NUM_RE.match(address or "")
    if not m:
        return None, None
    number = slugify(m.group(1))
    # Street name: first comma-separated part, number stripped.
    tail = m.group(2).split(",", 1)[0]
    return number or None, slugify(tail) or None


def _haversine_m(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    r = 6_371_000.0
    p1 = math.radians(a_lat)
    p2 = math.radians(b_lat)
    dlat = math.radians(b_lat - a_lat)
    dlng = math.radians(b_lng - a_lng)
    aa = math.sin(dlat / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlng / 2) ** 2
    return r * 2 * math.asin(min(1.0, math.sqrt(max(0.0, aa))))


@dataclass
class CandidateRow:
    property_key: str
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None
    contributed_by_user_id: uuid.UUID | None
    visibility: str


def _column_set(conn) -> set[str]:
    schema = (listing_table_schema or "").strip() or "public"
    tname = (listing_table_name or "").strip()
    rows = conn.execute(
        text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = :schema AND table_name = :tname
            """),
        {"schema": schema, "tname": tname},
    ).fetchall()
    return {str(r[0]).lower() for r in rows}


def _name_col(cols: set[str]) -> str:
    for candidate in ("property_name", "building_name", "name", "title"):
        if candidate in cols:
            return candidate
    return "address"


def _image_col(cols: set[str]) -> str | None:
    for candidate in ("image_url", "primary_image_url", "photo_url", "thumbnail_url"):
        if candidate in cols:
            return candidate
    return None


def _query_candidates(
    conn: Any,
    *,
    latitude: float,
    longitude: float,
    current_user_id: uuid.UUID | None,
    cols: set[str],
    visibility_scope: str,
) -> list[CandidateRow]:
    """
    visibility_scope:
      - 'private_add': matches against scraped + public user-contributed + this user's own private.
      - 'public_promote': matches against scraped + other users' public (exclude current user's rows).
    """
    qtable = _qualified_table()
    south, north, west, east = _bbox_around(latitude, longitude, _DEDUPE_BBOX_METERS)

    name_col = _name_col(cols)
    image_col = _image_col(cols)
    image_sql = f"t.{image_col}" if image_col else "NULL"
    has_vis = "visibility" in cols
    has_contrib = "contributed_by_user_id" in cols

    vis_where = "TRUE"
    params: dict[str, Any] = {
        "south": south,
        "north": north,
        "west": west,
        "east": east,
    }
    if has_vis and has_contrib:
        if visibility_scope == "private_add":
            vis_where = "(t.visibility = 'public' " "OR (t.visibility = 'private' AND t.contributed_by_user_id = :uid))"
            params["uid"] = current_user_id
        elif visibility_scope == "public_promote":
            vis_where = (
                "t.visibility = 'public' "
                "AND (t.contributed_by_user_id IS NULL "
                "OR t.contributed_by_user_id <> :uid)"
            )
            params["uid"] = current_user_id

    sql = text(f"""
        SELECT
            t.{name_col} AS name_out,
            t.address AS address_out,
            t.latitude AS latitude_out,
            t.longitude AS longitude_out,
            {image_sql} AS image_out,
            {"t.contributed_by_user_id" if has_contrib else "NULL"} AS contrib_uid,
            {"t.visibility" if has_vis else "'public'"} AS vis_out
        FROM {qtable} AS t
        WHERE t.latitude IS NOT NULL AND t.longitude IS NOT NULL
          AND t.latitude BETWEEN :south AND :north
          AND t.longitude BETWEEN :west AND :east
          AND {vis_where}
        LIMIT 50
        """)
    rows = conn.execute(sql, params).mappings().all()
    out: list[CandidateRow] = []
    for r in rows:
        name = str(r.get("name_out") or "").strip() or "Property"
        addr = str(r.get("address_out") or "").strip()
        try:
            lat = float(r.get("latitude_out"))
            lng = float(r.get("longitude_out"))
        except (TypeError, ValueError):
            continue
        if not math.isfinite(lat) or not math.isfinite(lng):
            continue
        out.append(
            CandidateRow(
                property_key=build_property_key(name, addr, lat, lng),
                name=name,
                address=addr,
                latitude=lat,
                longitude=lng,
                image_url=(str(r.get("image_out")).strip() or None) if r.get("image_out") else None,
                contributed_by_user_id=r.get("contrib_uid"),
                visibility=str(r.get("vis_out") or "public"),
            )
        )
    return out


def _score_candidate(
    *,
    candidate: CandidateRow,
    target_lat: float,
    target_lng: float,
    target_address: str,
    target_key: str,
) -> tuple[float, float]:
    """Return (score, distance_meters)."""
    dist = _haversine_m(target_lat, target_lng, candidate.latitude, candidate.longitude)
    if candidate.property_key == target_key:
        return _EXACT_KEY_SCORE, dist
    t_num, t_street = _street_parts(target_address)
    c_num, c_street = _street_parts(candidate.address)
    if t_num and t_street and t_num == c_num and t_street == c_street:
        return _STREET_MATCH_SCORE, dist
    return _BBOX_ONLY_SCORE, dist


def run_dedupe(
    *,
    latitude: float,
    longitude: float,
    address: str,
    current_user_id: uuid.UUID | None,
    visibility_scope: str = "private_add",
) -> list[DedupeMatch]:
    """Return up to 5 likely-duplicate candidates, ordered by score desc then distance asc."""
    target_key = build_property_key("property", address, latitude, longitude)
    with engine.connect() as conn:
        cols = _column_set(conn)
        if not cols:
            return []
        candidates = _query_candidates(
            conn,
            latitude=latitude,
            longitude=longitude,
            current_user_id=current_user_id,
            cols=cols,
            visibility_scope=visibility_scope,
        )
    scored: list[tuple[float, float, CandidateRow]] = []
    for c in candidates:
        score, dist = _score_candidate(
            candidate=c,
            target_lat=latitude,
            target_lng=longitude,
            target_address=address,
            target_key=target_key,
        )
        if score < _DEDUPE_MIN_SCORE:
            continue
        scored.append((score, dist, c))
    scored.sort(key=lambda t: (-t[0], t[1]))
    top = scored[:_DEDUPE_LIMIT]
    return [
        DedupeMatch(
            property_key=c.property_key,
            name=c.name,
            address=c.address,
            latitude=c.latitude,
            longitude=c.longitude,
            image_url=c.image_url,
            distance_meters=round(dist, 1),
            score=round(score, 3),
            is_user_contributed=c.contributed_by_user_id is not None,
        )
        for score, dist, c in top
    ]


def find_exact_duplicate(
    *,
    property_key: str,
    latitude: float,
    longitude: float,
    visibility_filter: str | None = None,
    exclude_user_id: uuid.UUID | None = None,
) -> DedupeMatch | None:
    """
    Strict match by property_key (slugified name+address+4dp lat/lng). Returns the first
    row that matches; None if the key is free.
    visibility_filter: if set, requires row.visibility = <value> (or scraped rows when field absent).
    """
    south, north, west, east = _bbox_around(latitude, longitude, 15.0)
    qtable = _qualified_table()
    with engine.connect() as conn:
        cols = _column_set(conn)
        if not cols:
            return None
        name_col = _name_col(cols)
        image_col = _image_col(cols)
        image_sql = f"t.{image_col}" if image_col else "NULL"
        has_vis = "visibility" in cols
        has_contrib = "contributed_by_user_id" in cols

        conds: list[str] = [
            "t.latitude IS NOT NULL",
            "t.longitude IS NOT NULL",
            "t.latitude BETWEEN :south AND :north",
            "t.longitude BETWEEN :west AND :east",
        ]
        params: dict[str, Any] = {
            "south": south,
            "north": north,
            "west": west,
            "east": east,
        }
        if visibility_filter and has_vis:
            conds.append("t.visibility = :vis_filter")
            params["vis_filter"] = visibility_filter
        if exclude_user_id is not None and has_contrib:
            conds.append("(t.contributed_by_user_id IS NULL " "OR t.contributed_by_user_id <> :exclude_uid)")
            params["exclude_uid"] = exclude_user_id

        sql = text(f"""
            SELECT
                t.{name_col} AS name_out,
                t.address AS address_out,
                t.latitude AS latitude_out,
                t.longitude AS longitude_out,
                {image_sql} AS image_out,
                {"t.contributed_by_user_id" if has_contrib else "NULL"} AS contrib_uid,
                {"t.visibility" if has_vis else "'public'"} AS vis_out
            FROM {qtable} AS t
            WHERE {" AND ".join(conds)}
            LIMIT 50
            """)
        rows = conn.execute(sql, params).mappings().all()
    for r in rows:
        name = str(r.get("name_out") or "").strip() or "Property"
        addr = str(r.get("address_out") or "").strip()
        try:
            lat = float(r.get("latitude_out"))
            lng = float(r.get("longitude_out"))
        except (TypeError, ValueError):
            continue
        key = build_property_key(name, addr, lat, lng)
        if key == property_key:
            return DedupeMatch(
                property_key=key,
                name=name,
                address=addr,
                latitude=lat,
                longitude=lng,
                image_url=(str(r.get("image_out")).strip() or None) if r.get("image_out") else None,
                distance_meters=round(_haversine_m(latitude, longitude, lat, lng), 1),
                score=_EXACT_KEY_SCORE,
                is_user_contributed=r.get("contrib_uid") is not None,
            )
    return None


@dataclass
class CreatedListing:
    property_key: str
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None
    visibility: str


def create_user_listing(payload: CreateUserListingRequest, user_id: uuid.UUID) -> CreatedListing:
    """Geocode (if needed), assemble the row, insert. Raises 409 if property_key already exists."""
    address_full = payload.address
    if payload.unit:
        address_full = f"{address_full} {payload.unit}"

    lat = payload.latitude
    lng = payload.longitude
    if lat is None or lng is None:
        token = (Config.get("MAPBOX_ACCESS_TOKEN") or "").strip()
        if not token:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Geocoding unavailable: MAPBOX_ACCESS_TOKEN not configured.",
            )
        geocoded = forward_geocode(address_full, token)
        if geocoded is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not geocode that address. Check the spelling or provide a more specific address.",
            )
        lat, lng = geocoded

    if not math.isfinite(lat) or not math.isfinite(lng):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid coordinates.",
        )

    property_key = build_property_key(payload.name, address_full, lat, lng)

    # Strict dedup — exact same property_key already present anywhere visible to the user.
    existing = find_exact_duplicate(
        property_key=property_key,
        latitude=lat,
        longitude=lng,
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "duplicate",
                "message": "A listing at this exact address already exists — track it from your Saved tab.",
                "match": existing.model_dump(),
            },
        )

    qtable = _qualified_table()
    with engine.begin() as conn:
        cols = _column_set(conn)
        insert_cols: list[str] = []
        placeholders: list[str] = []
        params: dict[str, Any] = {}

        def _maybe(col: str, value: Any) -> None:
            if col in cols and value is not None:
                insert_cols.append(f'"{col}"')
                placeholders.append(f":{col}")
                params[col] = value

        _maybe("address", address_full)
        _maybe("city", payload.city)
        _maybe("state", payload.state)
        _maybe("zipcode", payload.zipcode)
        _maybe("latitude", lat)
        _maybe("longitude", lng)
        _maybe("property_id", property_key)  # reuse property_key for uniqueness when column exists
        _maybe("listing_id", property_key)
        # Name — pick the first available name column.
        for name_col in ("property_name", "building_name", "name", "title"):
            if name_col in cols:
                insert_cols.append(f'"{name_col}"')
                placeholders.append(f":{name_col}")
                params[name_col] = payload.name
                break
        _maybe("image_url", payload.image_url)
        _maybe("source_url", payload.source_url)
        _maybe("contributed_by_user_id", user_id)
        if "visibility" in cols:
            insert_cols.append('"visibility"')
            placeholders.append(":visibility")
            params["visibility"] = "private"
        # Rent / beds / baths — best-effort, only set columns that exist.
        _maybe("rent", payload.price)
        _maybe("monthly_rent", payload.price)
        _maybe("bedrooms", payload.beds)
        _maybe("beds", payload.beds)
        _maybe("bathrooms", payload.baths)
        _maybe("baths", payload.baths)

        if not insert_cols:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No writable columns on listings table.",
            )

        sql = text(f"INSERT INTO {qtable} ({', '.join(insert_cols)}) VALUES ({', '.join(placeholders)})")
        conn.execute(sql, params)

    return CreatedListing(
        property_key=property_key,
        name=payload.name,
        address=address_full,
        latitude=lat,
        longitude=lng,
        image_url=payload.image_url,
        visibility="private",
    )


def set_visibility(
    *,
    property_key: str,
    user_id: uuid.UUID,
    new_visibility: str,
) -> tuple[str, DedupeMatch | None]:
    """
    Update visibility on a row owned by user_id. When promoting to public, check for
    public duplicates first — if found, raise 409.

    Returns (new_visibility_applied, duplicate_if_any).
    """
    if new_visibility not in {"public", "private"}:
        raise HTTPException(status_code=422, detail="visibility must be 'public' or 'private'")

    qtable = _qualified_table()
    with engine.begin() as conn:
        cols = _column_set(conn)
        if "contributed_by_user_id" not in cols or "visibility" not in cols:
            raise HTTPException(
                status_code=500,
                detail="Listings table missing user-contribution columns — run migrations.",
            )

        row = (
            conn.execute(
                text(f"""
                SELECT t.latitude AS latitude_out, t.longitude AS longitude_out,
                       t.address AS address_out, t.visibility AS vis_out
                FROM {qtable} AS t
                WHERE t.contributed_by_user_id = :uid
                  AND {_property_key_match_sql(cols, "t")}
                LIMIT 1
                """),
                {"uid": user_id, **_property_key_match_params(property_key)},
            )
            .mappings()
            .first()
        )
        if row is None:
            raise HTTPException(status_code=404, detail="Listing not found or not owned by current user.")

        if new_visibility == "public":
            existing_public = find_exact_duplicate(
                property_key=property_key,
                latitude=float(row["latitude_out"]),
                longitude=float(row["longitude_out"]),
                visibility_filter="public",
                exclude_user_id=user_id,
            )
            if existing_public is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail={
                        "code": "public_duplicate",
                        "message": "Another public listing exists at this address.",
                        "match": existing_public.model_dump(),
                    },
                )

        conn.execute(
            text(f"""
                UPDATE {qtable} SET visibility = :vis
                WHERE contributed_by_user_id = :uid
                  AND {_property_key_match_sql(cols, None)}
                """),
            {
                "vis": new_visibility,
                "uid": user_id,
                **_property_key_match_params(property_key),
            },
        )
    return new_visibility, None


def _property_key_match_sql(cols: set[str], alias: str | None) -> str:
    """Prefer matching by listing_id (we store property_key there on insert)."""
    p = f"{alias}." if alias else ""
    if "listing_id" in cols:
        return f"{p}listing_id = :property_key"
    if "property_id" in cols:
        return f"{p}property_id = :property_key"
    raise HTTPException(
        status_code=500,
        detail="Listings table has no listing_id/property_id column to match property_key.",
    )


def _property_key_match_params(property_key: str) -> dict[str, Any]:
    return {"property_key": property_key}


def delete_user_listing(*, property_key: str, user_id: uuid.UUID) -> None:
    qtable = _qualified_table()
    with engine.begin() as conn:
        cols = _column_set(conn)
        if "contributed_by_user_id" not in cols:
            raise HTTPException(status_code=500, detail="Migrations not applied.")
        result = conn.execute(
            text(f"""
                DELETE FROM {qtable}
                WHERE contributed_by_user_id = :uid
                  AND {_property_key_match_sql(cols, None)}
                """),
            {"uid": user_id, **_property_key_match_params(property_key)},
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Listing not found or not owned by current user.")
