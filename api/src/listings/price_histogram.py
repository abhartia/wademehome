"""Price (rent) distribution histogram for a bbox or city/state filter.

Used by the shared PriceRangeFilter UI so the slider has a visual guide to
what ranges are actually populated before the user commits to a filter.
"""

from __future__ import annotations

from typing import Any

from listings.location_columns import quote_ident, resolve_city_column, resolve_state_column
from listings.market_snapshot import _rent_sql_expr

# 40 equal-width buckets between the 1st and 99th percentile of observed rent.
# width_bucket returns 0 for below-range and BUCKET_COUNT+1 for above-range,
# so callers get two overflow bins "for free" when rendering "+" ends.
BUCKET_COUNT = 40


def build_price_histogram_sql(
    qtable: str,
    cols: set[str],
    *,
    west: float | None = None,
    south: float | None = None,
    east: float | None = None,
    north: float | None = None,
    city: str | None = None,
    state: str | None = None,
    min_beds: int | None = None,
    max_beds: int | None = None,
) -> tuple[str, dict[str, Any]] | None:
    """Build the histogram query. Returns (sql, params) or None if the table
    lacks a usable rent column or the caller didn't narrow the scope enough.
    """
    rent = _rent_sql_expr(cols)
    if rent is None:
        return None

    params: dict[str, Any] = {"bucket_count": BUCKET_COUNT}
    wheres: list[str] = [f"({rent}) IS NOT NULL", f"({rent}) > 0"]

    # Public visibility (mirrors /listings/nearby).
    if "visibility" in cols:
        wheres.append("(visibility = 'public' OR visibility IS NULL)")

    bbox_supplied = all(v is not None for v in (west, south, east, north))
    if bbox_supplied:
        wheres.append("latitude BETWEEN :south AND :north")
        wheres.append("longitude BETWEEN :west AND :east")
        params.update({"west": west, "south": south, "east": east, "north": north})
    else:
        c = (city or "").strip()
        s = (state or "").strip()
        if c:
            ccol = resolve_city_column(cols)
            if ccol:
                wheres.append(f"LOWER(TRIM(CAST({quote_ident(ccol)} AS text))) = LOWER(TRIM(:city_q))")
                params["city_q"] = c
        if s:
            scol = resolve_state_column(cols)
            if scol:
                wheres.append(f"LOWER(TRIM(CAST({quote_ident(scol)} AS text))) = LOWER(TRIM(:state_q))")
                params["state_q"] = s

    # Bedroom filter when corresponding columns are present.
    bed_col: str | None = None
    for candidate in ("bedrooms", "beds", "num_bedrooms", "n_bedrooms"):
        if candidate in cols:
            bed_col = candidate
            break
    if bed_col is not None:
        if min_beds is not None:
            wheres.append(f"{quote_ident(bed_col)}::numeric >= :min_beds")
            params["min_beds"] = min_beds
        if max_beds is not None:
            wheres.append(f"{quote_ident(bed_col)}::numeric <= :max_beds")
            params["max_beds"] = max_beds

    where_sql = " AND ".join(wheres) if wheres else "TRUE"

    sql = f"""
WITH base AS (
  SELECT ({rent})::double precision AS rent
  FROM {qtable}
  WHERE {where_sql}
),
bounds AS (
  SELECT
    MIN(rent) AS min_rent,
    MAX(rent) AS max_rent,
    percentile_cont(0.01) WITHIN GROUP (ORDER BY rent) AS p01,
    percentile_cont(0.25) WITHIN GROUP (ORDER BY rent) AS p25,
    percentile_cont(0.50) WITHIN GROUP (ORDER BY rent) AS p50,
    percentile_cont(0.75) WITHIN GROUP (ORDER BY rent) AS p75,
    percentile_cont(0.99) WITHIN GROUP (ORDER BY rent) AS p99,
    COUNT(*)::bigint AS sample_size
  FROM base
),
bucketed AS (
  SELECT
    CASE
      WHEN (SELECT p99 FROM bounds) IS NULL
           OR (SELECT p01 FROM bounds) IS NULL
           OR (SELECT p99 FROM bounds) <= (SELECT p01 FROM bounds)
        THEN 1
      ELSE width_bucket(
        rent,
        (SELECT p01 FROM bounds)::double precision,
        (SELECT p99 FROM bounds)::double precision,
        :bucket_count
      )
    END AS bucket,
    COUNT(*)::bigint AS c
  FROM base
  GROUP BY 1
)
SELECT
  (SELECT min_rent FROM bounds) AS min_rent,
  (SELECT max_rent FROM bounds) AS max_rent,
  (SELECT p01 FROM bounds) AS p01,
  (SELECT p25 FROM bounds) AS p25,
  (SELECT p50 FROM bounds) AS p50,
  (SELECT p75 FROM bounds) AS p75,
  (SELECT p99 FROM bounds) AS p99,
  (SELECT sample_size FROM bounds) AS sample_size,
  COALESCE(
    (SELECT jsonb_agg(jsonb_build_object('bucket', bucket, 'count', c) ORDER BY bucket)
     FROM bucketed),
    '[]'::jsonb
  ) AS buckets
"""
    return sql, params
