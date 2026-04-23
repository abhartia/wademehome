"""NYC Open Data (Socrata) client for PLUTO + Property Assessment data."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any

from sqlalchemy import text

from core.logger import get_logger

logger = get_logger(__name__)

_SOCRATA_BASE = "https://data.cityofnewyork.us/resource"
_PLUTO_DATASET = "64uk-42ks"
_ASSESSMENTS_DATASET = "8y4t-faws"
_TIMEOUT = 15.0
_CACHE_TTL_DAYS = 30
_MILES_TO_METERS = 1609.344
_SOCRATA_SAFE_CHARS = ",()>=<!'"


@dataclass
class PlutoBuilding:
    """A single NYC building from PLUTO + optional assessment data."""

    bbl: str
    address: str = ""
    borough: str = ""
    block: str = ""
    lot: str = ""
    units_res: int | None = None
    units_total: int | None = None
    bldg_area: float | None = None
    num_floors: int | None = None
    year_built: int | None = None
    bldg_class: str | None = None
    lot_area: float | None = None
    zone_dist: str | None = None
    owner_name: str | None = None
    assessed_total: float | None = None
    market_value: float | None = None
    market_land_value: float | None = None


def _safe_int(val: Any) -> int | None:
    if val is None:
        return None
    try:
        n = int(float(val))
        return n if n >= 0 else None
    except (TypeError, ValueError):
        return None


def _safe_float(val: Any) -> float | None:
    if val is None:
        return None
    try:
        n = float(val)
        return n if n >= 0 else None
    except (TypeError, ValueError):
        return None


def _socrata_headers() -> dict[str, str]:
    from core.config import Config

    headers: dict[str, str] = {"Accept": "application/json"}
    token = (Config.get("SOCRATA_APP_TOKEN", "") or "").strip()
    if token:
        headers["X-App-Token"] = token
    return headers


def _normalize_bbl(raw: str) -> str:
    """Strip trailing decimals from PLUTO BBL (e.g. '1005880039.00000000' → '1005880039')."""
    raw = raw.strip()
    if "." in raw:
        raw = raw.split(".")[0]
    return raw


def _parse_pluto_row(row: dict[str, Any]) -> PlutoBuilding:
    return PlutoBuilding(
        bbl=_normalize_bbl(str(row.get("bbl", ""))),
        address=str(row.get("address", "")).strip(),
        borough=str(row.get("borough", "")).strip(),
        block=str(row.get("block", "")).strip(),
        lot=str(row.get("lot", "")).strip(),
        units_res=_safe_int(row.get("unitsres")),
        units_total=_safe_int(row.get("unitstotal")),
        bldg_area=_safe_float(row.get("bldgarea")),
        num_floors=_safe_int(row.get("numfloors")),
        year_built=_safe_int(row.get("yearbuilt")),
        bldg_class=str(row.get("bldgclass", "")).strip() or None,
        lot_area=_safe_float(row.get("lotarea")),
        zone_dist=str(row.get("zonedist1", "")).strip() or None,
        owner_name=str(row.get("ownername", "")).strip() or None,
        assessed_total=_safe_float(row.get("assesstot")),
    )


# ── Socrata API calls ──────────────────────────────────────────────────


def _bbox(lat: float, lng: float, radius_miles: float) -> tuple[float, float, float, float]:
    """Return (min_lat, max_lat, min_lng, max_lng) bounding box."""
    # 1 degree lat ≈ 69 miles, 1 degree lng ≈ 69 * cos(lat) miles
    import math

    d_lat = radius_miles / 69.0
    d_lng = radius_miles / (69.0 * math.cos(math.radians(lat)))
    return (lat - d_lat, lat + d_lat, lng - d_lng, lng + d_lng)


def _socrata_get(url: str, params: dict[str, str]) -> list[dict[str, Any]]:
    """Make a GET request to Socrata, keeping $ literal in query params."""
    parts = []
    for k, v in params.items():
        # Encode value (spaces→%20) but keep Socrata operators readable
        parts.append(f"{k}={urllib.parse.quote(v, safe=_SOCRATA_SAFE_CHARS)}")
    full_url = url + "?" + "&".join(parts)
    req = urllib.request.Request(full_url, headers=_socrata_headers())
    with urllib.request.urlopen(
        req, timeout=_TIMEOUT
    ) as resp:  # nosec B310 — url built from constant NYC Socrata https base
        data = json.loads(resp.read())
    return data if isinstance(data, list) else []


def fetch_pluto_in_radius(
    lat: float,
    lng: float,
    radius_miles: float,
    limit: int = 500,
) -> list[PlutoBuilding]:
    """Fetch PLUTO buildings with residential units within a radius."""
    min_lat, max_lat, min_lng, max_lng = _bbox(lat, lng, radius_miles)
    where = (
        f"latitude >= {min_lat} AND latitude <= {max_lat}"
        f" AND longitude >= {min_lng} AND longitude <= {max_lng}"
        " AND unitsres > 0"
    )
    select = (
        "bbl,borough,block,lot,address,unitsres,unitstotal,bldgarea,"
        "numfloors,yearbuilt,bldgclass,lotarea,zonedist1,ownername,assesstot,latitude,longitude"
    )
    url = f"{_SOCRATA_BASE}/{_PLUTO_DATASET}.json"
    params = {"$where": where, "$select": select, "$limit": str(limit)}

    try:
        rows = _socrata_get(url, params)
    except Exception:
        logger.warning("PLUTO Socrata request failed (lat=%s, lng=%s)", lat, lng, exc_info=True)
        return []

    if not isinstance(rows, list):
        return []

    buildings = [_parse_pluto_row(r) for r in rows if r.get("bbl")]
    logger.info("PLUTO: fetched %d residential buildings in %.1f mi radius", len(buildings), radius_miles)
    return buildings


def fetch_assessments_for_bbls(bbls: list[str]) -> dict[str, dict[str, Any]]:
    """Fetch property assessment market values for a list of BBLs.

    Returns dict keyed by BBL string -> assessment fields.
    The assessments dataset uses 'parid' as the BBL identifier, and
    'curmkttot' / 'curmktland' for current market values.
    """
    if not bbls:
        return {}

    url = f"{_SOCRATA_BASE}/{_ASSESSMENTS_DATASET}.json"
    select = "parid,curmkttot,curmktland"
    result: dict[str, dict[str, Any]] = {}

    # Batch into groups of 50 to keep the IN clause reasonable
    batch_size = 50
    for i in range(0, len(bbls), batch_size):
        batch = bbls[i : i + batch_size]
        # parid is a 10-char BBL string
        quoted = ",".join(f"'{b}'" for b in batch)
        conditions = f"parid in({quoted})"
        params = {
            "$where": conditions,
            "$select": select,
            "$limit": str(batch_size),
        }
        try:
            rows = _socrata_get(url, params)
        except Exception:
            logger.warning("Assessment Socrata request failed for batch %d", i)
            continue

        if not isinstance(rows, list):
            continue

        for row in rows:
            parid = str(row.get("parid", "")).strip()
            if parid:
                result[parid] = {
                    "actual_total_market_value": _safe_float(row.get("curmkttot")),
                    "actual_total_land_value": _safe_float(row.get("curmktland")),
                }

    logger.info("Assessments: fetched %d records for %d BBLs", len(result), len(bbls))
    return result


# ── Cache helpers (raw SQL, no ORM) ────────────────────────────────────


def _get_engine():
    from workflow.utils import engine

    return engine


def _cache_get_bbls(bbls: list[str]) -> dict[str, PlutoBuilding]:
    """Return cached PlutoBuilding records that are within the TTL."""
    if not bbls:
        return {}
    try:
        with _get_engine().connect() as conn:
            rows = conn.execute(
                text(
                    "SELECT bbl, data_json FROM pluto_building_cache "
                    "WHERE bbl = ANY(:bbls) "
                    "AND fetched_at > now() - interval ':ttl days'".replace(":ttl days", f"{_CACHE_TTL_DAYS} days")
                ),
                {"bbls": bbls},
            ).fetchall()
        result: dict[str, PlutoBuilding] = {}
        for bbl, data_json in rows:
            d = json.loads(data_json)
            result[bbl] = PlutoBuilding(**d)
        return result
    except Exception:
        logger.debug("pluto cache read failed", exc_info=True)
        return {}


def _cache_set(buildings: list[PlutoBuilding]) -> None:
    """Upsert buildings into the cache."""
    if not buildings:
        return
    try:
        with _get_engine().connect() as conn:
            for b in buildings:
                data = json.dumps(
                    {
                        "bbl": b.bbl,
                        "address": b.address,
                        "borough": b.borough,
                        "block": b.block,
                        "lot": b.lot,
                        "units_res": b.units_res,
                        "units_total": b.units_total,
                        "bldg_area": b.bldg_area,
                        "num_floors": b.num_floors,
                        "year_built": b.year_built,
                        "bldg_class": b.bldg_class,
                        "lot_area": b.lot_area,
                        "zone_dist": b.zone_dist,
                        "owner_name": b.owner_name,
                        "assessed_total": b.assessed_total,
                        "market_value": b.market_value,
                        "market_land_value": b.market_land_value,
                    }
                )
                conn.execute(
                    text(
                        "INSERT INTO pluto_building_cache (bbl, data_json, fetched_at) "
                        "VALUES (:bbl, :data, now()) "
                        "ON CONFLICT (bbl) DO UPDATE SET data_json = :data, fetched_at = now()"
                    ),
                    {"bbl": b.bbl, "data": data},
                )
            conn.commit()
    except Exception:
        logger.debug("pluto cache write failed", exc_info=True)


# ── Orchestrator ───────────────────────────────────────────────────────


def fetch_pluto_with_assessments(
    lat: float,
    lng: float,
    radius_miles: float,
) -> list[PlutoBuilding]:
    """Fetch PLUTO buildings in radius, enrich with assessment data, cache results."""
    # Always query Socrata for the geospatial lookup (need to know which BBLs are in radius)
    buildings = fetch_pluto_in_radius(lat, lng, radius_miles)
    if not buildings:
        return []

    all_bbls = [b.bbl for b in buildings if b.bbl]

    # Check cache for assessment data
    cached = _cache_get_bbls(all_bbls)
    cached_bbls = set(cached.keys())
    missing_bbls = [bbl for bbl in all_bbls if bbl not in cached_bbls]

    # Fetch assessments only for uncached BBLs
    fresh_assessments: dict[str, dict[str, Any]] = {}
    if missing_bbls:
        fresh_assessments = fetch_assessments_for_bbls(missing_bbls)

    # Merge: for each building, apply cached data or fresh assessment
    for b in buildings:
        if b.bbl in cached:
            cb = cached[b.bbl]
            b.market_value = cb.market_value
            b.market_land_value = cb.market_land_value
        elif b.bbl in fresh_assessments:
            a = fresh_assessments[b.bbl]
            b.market_value = a.get("actual_total_market_value")
            b.market_land_value = a.get("actual_total_land_value")

    # Cache the freshly enriched buildings (those that weren't already cached)
    to_cache = [b for b in buildings if b.bbl in fresh_assessments]
    _cache_set(to_cache)

    return buildings
