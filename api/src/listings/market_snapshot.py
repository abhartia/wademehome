"""Aggregate rent stats from the listings table using real city/state/ZIP columns (no address regex)."""

from __future__ import annotations

import re
from typing import Any

from sqlalchemy import text

from listings.location_columns import quote_ident, resolve_city_column, resolve_state_column, resolve_zip_column

# Fallback only when callers pass a free-text address without structured fields.
_ZIP_FROM_ADDRESS_RE = re.compile(r"\b(\d{5})\b")


def extract_zip_from_address(address: str) -> str | None:
    """Last-resort ZIP extraction when `zip_code` / `zip` query param is missing."""
    m = _ZIP_FROM_ADDRESS_RE.search(address or "")
    return m.group(1) if m else None


def normalize_us_zip_query(raw: str) -> str | None:
    """Return the first 5 digits of a US ZIP from user/query input (handles ZIP+4)."""
    s = (raw or "").strip()
    if not s:
        return None
    digits = re.sub(r"\D", "", s)
    if len(digits) >= 5:
        return digits[:5]
    return None


def _rent_sql_expr(cols: set[str]) -> str | None:
    parts: list[str] = []
    if "min_rent" in cols and "max_rent" in cols:
        parts.append(
            "CASE WHEN min_rent IS NOT NULL AND max_rent IS NOT NULL "
            "THEN (min_rent::double precision + max_rent::double precision) / 2.0 ELSE NULL END"
        )
    if "min_monthly_rent" in cols and "max_monthly_rent" in cols:
        parts.append(
            "CASE WHEN min_monthly_rent IS NOT NULL AND max_monthly_rent IS NOT NULL "
            "THEN (min_monthly_rent::double precision + max_monthly_rent::double precision) / 2.0 "
            "ELSE NULL END"
        )
    if "monthly_rent" in cols:
        parts.append("monthly_rent::double precision")
    if "rent_price" in cols:
        parts.append("rent_price::double precision")
    if "list_price" in cols:
        parts.append("list_price::double precision")
    if "price" in cols:
        parts.append("price::double precision")
    if not parts:
        return None
    return "COALESCE(" + ", ".join(parts) + ")"


def _bedroom_label_sql(cols: set[str]) -> str:
    if "bedroom_range" in cols:
        return "NULLIF(TRIM(CAST(bedroom_range AS text)), '')"
    if "bedrooms_display" in cols:
        return "NULLIF(TRIM(CAST(bedrooms_display AS text)), '')"
    if "bedrooms" in cols:
        return (
            "CASE WHEN bedrooms IS NULL THEN NULL "
            "WHEN bedrooms::numeric = trunc(bedrooms::numeric) "
            "THEN trunc(bedrooms::numeric)::text || ' BR' "
            "ELSE trim(to_char(bedrooms::numeric, 'FM999999990.99')) || ' BR' END"
        )
    if "beds" in cols:
        return (
            "CASE WHEN beds IS NULL THEN NULL "
            "WHEN beds::numeric = trunc(beds::numeric) "
            "THEN trunc(beds::numeric)::text || ' BR' "
            "ELSE trim(to_char(beds::numeric, 'FM999999990.99')) || ' BR' END"
        )
    return "NULL"


def _location_where_sql(
    cols: set[str],
    *,
    zip_code: str | None,
    city: str | None,
    state: str | None,
) -> tuple[str, dict[str, Any]] | None:
    """
    Build WHERE clause using database columns only.
    Prefer ZIP when provided; otherwise city + state (both required).
    """
    params: dict[str, Any] = {}

    z = normalize_us_zip_query(zip_code) if zip_code else None
    if z:
        zcol = resolve_zip_column(cols)
        if not zcol:
            return None
        qc = quote_ident(zcol)
        # US ZIP: compare first 5 digits (handles ZIP+4, stray punctuation)
        where = f"LEFT(REGEXP_REPLACE(TRIM(CAST({qc} AS text)), '[^0-9]', '', 'g'), 5) = :zip5"
        params["zip5"] = z
        return where, params

    c = (city or "").strip()
    s = (state or "").strip()
    if c and s:
        ccol = resolve_city_column(cols)
        scol = resolve_state_column(cols)
        if not ccol or not scol:
            return None
        where = (
            f"LOWER(TRIM(CAST({quote_ident(ccol)} AS text))) = LOWER(TRIM(:city_q)) "
            f"AND LOWER(TRIM(CAST({quote_ident(scol)} AS text))) = LOWER(TRIM(:state_q))"
        )
        params["city_q"] = c
        params["state_q"] = s
        return where, params

    return None


def build_market_snapshot_sql(
    qtable: str,
    cols: set[str],
    *,
    zip_code: str | None = None,
    city: str | None = None,
    state: str | None = None,
) -> tuple[str, dict[str, Any]] | None:
    rent = _rent_sql_expr(cols)
    if rent is None:
        return None

    loc = _location_where_sql(cols, zip_code=zip_code, city=city, state=state)
    if loc is None:
        return None
    where_loc, params = loc

    bed = _bedroom_label_sql(cols)
    sql = f"""
WITH base AS (
  SELECT
    ({rent}) AS rent_effective,
    ({bed}) AS bed_label
  FROM {qtable}
  WHERE {where_loc}
),
nums AS (
  SELECT rent_effective, bed_label
  FROM base
  WHERE rent_effective IS NOT NULL AND rent_effective > 0
)
SELECT
  (SELECT COUNT(*)::bigint FROM nums) AS sample_size,
  (SELECT percentile_cont(0.25) WITHIN GROUP (ORDER BY rent_effective) FROM nums) AS p25,
  (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY rent_effective) FROM nums) AS p50,
  (SELECT percentile_cont(0.75) WITHIN GROUP (ORDER BY rent_effective) FROM nums) AS p75,
  (SELECT jsonb_object_agg(bed_label, c) FROM (
    SELECT bed_label, COUNT(*)::int AS c FROM nums
    WHERE bed_label IS NOT NULL
    GROUP BY bed_label
    ORDER BY c DESC
    LIMIT 8
  ) t) AS bedroom_mix
"""
    return sql, params
