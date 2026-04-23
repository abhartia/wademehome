"""NYC-metro inventory aggregations over the dynamic listings table (read-only)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.engine import Connection

from listings.listings_table_cache import cached_execute_all
from listings.location_columns import quote_ident, resolve_zip_column
from listings.market_snapshot import _bedroom_label_sql, _rent_sql_expr

# Default: NYC metro + inner NJ / Long Island / lower Hudson (see plan).
NYC_METRO_BBOX_DEFAULT = {
    "west": -74.45,
    "south": 40.25,
    "east": -73.55,
    "north": 41.12,
}

_MAX_BBOX_LAT_SPAN = 4.0
_MAX_BBOX_LNG_SPAN = 6.0


class SourceSliceRow(BaseModel):
    label: str
    listing_rows: int
    distinct_buildings: int


class StalenessSummary(BaseModel):
    rows_with_timestamp: int
    rows_parse_failed: int
    age_hours_min: float | None = None
    age_hours_max: float | None = None
    age_hours_mean: float | None = None
    age_hours_p50: float | None = None
    age_hours_p90: float | None = None
    pct_older_than_7d: float | None = None
    pct_older_than_30d: float | None = None


class StalenessByBucket(BaseModel):
    bucket: str
    listing_rows: int
    age_hours_mean: float | None = None


class ZipBucketRow(BaseModel):
    zip5: str
    listing_rows: int
    distinct_buildings: int


class TargetCoverageRow(BaseModel):
    seed_url: str
    normalized_prefix: str
    covered: bool
    matched_listing_sample: str | None = None


class TargetCoverageSummary(BaseModel):
    total_targets: int
    covered_count: int
    uncovered_count: int
    targets: list[TargetCoverageRow]


class MetroCoveragePieSlice(BaseModel):
    """Buildings count per slice for market vs platform donut."""

    label: str
    buildings: int


class MetroCoverageEstimate(BaseModel):
    """
    Metro-wide total is not knowable from inventory DB alone; set
    `estimated_metro_rental_buildings` in nyc_metro_coverage_context.json (your benchmark).
    """

    configured: bool = False
    estimated_metro_buildings: int | None = None
    estimated_market_listing_rows: int | None = None
    on_platform_buildings: int = 0
    gap_buildings: int | None = None
    inventory_meets_or_exceeds_estimate: bool = False
    methodology_note: str | None = None
    cms_market_pie_warning: str | None = None


class ListingRowPeek(BaseModel):
    """Up to a few concrete rows for a building_key — use to validate giant property_id buckets."""

    listing_url: str | None = None
    property_name: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ListingsPerBuildingSample(BaseModel):
    building_key: str
    listing_count: int
    sample_rows: list[ListingRowPeek] = Field(default_factory=list)


class ListingsPerBuildingProof(BaseModel):
    """SQL proof that row count ÷ distinct buildings matches unit/listing density per property."""

    total_listing_rows_attributed: int
    buildings_in_distribution: int
    mean_listings_per_building: float
    median_listings_per_building: float | None = None
    max_listings_single_building: int = 0
    buildings_with_count_1: int = 0
    buildings_with_count_2_to_5: int = 0
    buildings_with_count_6_to_15: int = 0
    buildings_with_count_16_plus: int = 0
    top_buildings_by_listing_count: list[ListingsPerBuildingSample]
    rows_without_building_key: int = 0


class CmsMarketShareSlice(BaseModel):
    label: str
    listing_rows: int
    segment: str  # on_platform | scrape_next | not_scrapable
    citation_url: str | None = None
    assumption_note: str | None = None


class QualityMetrics(BaseModel):
    rent_present_pct: float | None = None
    image_present_pct: float | None = None
    listing_id_null_pct: float | None = None
    duplicate_listing_id_rows: int | None = None
    top5_priority_share_pct: float | None = None
    availability_stale_rows: int | None = None


class InventoryAnalyticsResponse(BaseModel):
    computed_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    bbox: dict[str, float]
    listings_table: str
    available_only: bool = True
    availability_filter_description: str | None = None
    total_listing_rows: int
    distinct_buildings: int
    company_slices: list[SourceSliceRow]
    staleness: StalenessSummary
    staleness_by_company: list[StalenessByBucket]
    staleness_by_priority: list[StalenessByBucket]
    zip_buckets: list[ZipBucketRow]
    bedroom_mix: dict[str, int]
    quality: QualityMetrics
    target_coverage: TargetCoverageSummary
    metro_coverage_pie: list[MetroCoveragePieSlice]
    metro_coverage_estimate: MetroCoverageEstimate
    listings_per_building_proof: ListingsPerBuildingProof
    cms_market_share_pie: list[CmsMarketShareSlice]


def _table_columns_lower(conn: Connection, schema: str, tname: str) -> set[str]:
    rows = conn.execute(
        text("""
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = :schema AND table_name = :tname
            """),
        {"schema": schema, "tname": tname},
    ).fetchall()
    return {str(r[0]).lower() for r in rows}


def validate_bbox(west: float, south: float, east: float, north: float) -> None:
    if south >= north:
        raise ValueError("Bounding box invalid: south must be less than north")
    if west >= east:
        raise ValueError("Bounding box invalid: west must be less than east (antimeridian not supported)")
    if (north - south) > _MAX_BBOX_LAT_SPAN or (east - west) > _MAX_BBOX_LNG_SPAN:
        raise ValueError("Bounding box too large")


def repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def load_target_seeds() -> list[str]:
    path = repo_root() / "data" / "inventory_targets" / "nyc_metro_seeds.json"
    if not path.is_file():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    out: list[str] = []
    if isinstance(raw, dict) and isinstance(raw.get("urls"), list):
        raw = raw["urls"]
    if isinstance(raw, list):
        for item in raw:
            if isinstance(item, str):
                out.append(item)
            elif isinstance(item, dict) and isinstance(item.get("url"), str):
                out.append(item["url"])
    return [u for u in out if isinstance(u, str) and u.strip().startswith("http")]


@dataclass(frozen=True)
class OffPlatformSourceRow:
    label: str
    listing_rows: int
    scrape_status: str | None = None  # scrape_next | not_scrapable
    note: str | None = None
    citation_url: str | None = None


@dataclass(frozen=True)
class MetroCoverageContextFile:
    metro_buildings: int | None
    market_listing_rows: int | None
    off_platform_sources: list[OffPlatformSourceRow]
    note: str | None


def _positive_int(v: Any) -> int | None:
    if isinstance(v, int) and v > 0:
        return v
    if isinstance(v, float) and v > 0:
        return int(v)
    return None


def load_metro_coverage_context_file() -> MetroCoverageContextFile:
    path = repo_root() / "data" / "inventory_targets" / "nyc_metro_coverage_context.json"
    if not path.is_file():
        return MetroCoverageContextFile(None, None, [], None)
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        return MetroCoverageContextFile(None, None, [], None)
    b_est = _positive_int(raw.get("estimated_metro_rental_buildings"))
    l_est = _positive_int(raw.get("estimated_total_available_units") or raw.get("estimated_market_listing_rows"))
    note_raw = raw.get("methodology_note") or raw.get("description")
    note = note_raw.strip() if isinstance(note_raw, str) and note_raw.strip() else None

    off: list[OffPlatformSourceRow] = []
    raw_off = raw.get("off_platform_listing_sources")
    if isinstance(raw_off, list):
        for item in raw_off:
            if not isinstance(item, dict):
                continue
            lab = item.get("label")
            cnt = _positive_int(item.get("listing_rows"))
            if isinstance(lab, str) and lab.strip() and cnt is not None:
                n_raw = item.get("note")
                c_raw = item.get("citation_url")
                ss_raw = item.get("scrape_status")
                note = n_raw.strip() if isinstance(n_raw, str) and n_raw.strip() else None
                cit = c_raw.strip() if isinstance(c_raw, str) and c_raw.strip() else None
                ss = ss_raw.strip() if isinstance(ss_raw, str) and ss_raw.strip() else None
                off.append(
                    OffPlatformSourceRow(
                        label=lab.strip(),
                        listing_rows=cnt,
                        scrape_status=ss,
                        note=note,
                        citation_url=cit,
                    )
                )

    return MetroCoverageContextFile(
        metro_buildings=b_est,
        market_listing_rows=l_est,
        off_platform_sources=off,
        note=note,
    )


def build_cms_market_share_pie(
    *,
    company_slices: list[SourceSliceRow],
    total_listing_rows: int,
    market_total_listings: int | None,
    off_platform: list[OffPlatformSourceRow],
) -> tuple[list[CmsMarketShareSlice], str | None]:
    """
    Pie of listing-row counts scaled to estimated metro market total.
    On-platform = real counts per CMS; off-platform = configured estimates + unallocated gap.
    """
    warn: str | None = None
    out: list[CmsMarketShareSlice] = []
    for s in company_slices:
        if s.listing_rows <= 0:
            continue
        out.append(
            CmsMarketShareSlice(
                label=str(s.label or "(unknown)"),
                listing_rows=s.listing_rows,
                segment="on_platform",
            )
        )
    cms_sum = sum(x.listing_rows for x in out)
    orphan = total_listing_rows - cms_sum
    if orphan != 0:
        out.append(
            CmsMarketShareSlice(
                label="On-platform (not in CMS group sum)",
                listing_rows=orphan,
                segment="on_platform",
            )
        )
    if market_total_listings is None or market_total_listings <= 0:
        return out, (
            "Set estimated_market_listing_rows in nyc_metro_coverage_context.json "
            "to show off-platform slices vs. your total market listing estimate."
        )
    if total_listing_rows > market_total_listings:
        return out, (
            f"estimated_market_listing_rows ({market_total_listings}) is below on-platform "
            f"rows ({total_listing_rows}); raise the market estimate."
        )
    remainder = market_total_listings - total_listing_rows
    configured = sum(n.listing_rows for n in off_platform)
    scale = remainder / configured if configured > remainder and configured > 0 else 1.0
    scaled_total = 0
    for row in off_platform:
        if row.listing_rows > 0:
            seg = row.scrape_status if row.scrape_status in ("scrape_next", "not_scrapable") else "not_scrapable"
            scaled = max(1, int(row.listing_rows * scale))
            scaled_total += scaled
            out.append(
                CmsMarketShareSlice(
                    label=row.label,
                    listing_rows=scaled,
                    segment=seg,
                    citation_url=row.citation_url,
                    assumption_note=row.note,
                )
            )
    unalloc = remainder - scaled_total
    if unalloc > 0:
        out.append(
            CmsMarketShareSlice(
                label="Other / unallocated (estimate)",
                listing_rows=unalloc,
                segment="not_scrapable",
            )
        )
    return out, warn


def normalize_seed_prefix(url: str) -> str:
    p = urlparse(url.strip())
    if not p.scheme or not p.netloc:
        return url.strip().rstrip("/").lower()
    path = (p.path or "").rstrip("/")
    return f"{p.scheme.lower()}://{p.netloc.lower()}{path}".lower()


@dataclass(frozen=True)
class ColumnSql:
    qtable: str
    geo_where: str
    building_expr: str
    priority_key_expr: str
    company_expr: str
    listing_url_col: str | None
    scraped_raw_text_sql: str | None
    scraped_ts_sql: str | None
    zip_expr: str | None
    bed_label_expr: str
    rent_expr: str | None
    image_present_expr: str | None
    listing_id_expr: str | None
    available_at_sql: str | None


def _first_col(cols: set[str], candidates: tuple[str, ...]) -> str | None:
    for c in candidates:
        if c in cols:
            return c
    return None


def _availability_where_sql(cols: set[str], cs: ColumnSql, *, active: bool) -> tuple[str, str | None]:
    """
    SQL fragment AND (...) for “available” listings, or ("", None) when inactive / no filter.
    Returns (fragment, human-readable description for API clients).
    """
    if not active:
        return "", "All rows in bbox (availability filter off)."

    av = _first_col(cols, ("availability_status", "availabilitystatus"))
    rent_ok: str | None = None
    if cs.rent_expr:
        rent_ok = f"(({cs.rent_expr}) IS NOT NULL AND ({cs.rent_expr}) > 0)"

    if av:
        aiq = quote_ident(av)
        trimmed = f"NULLIF(TRIM(CAST({aiq} AS text)), '')"
        low = f"LOWER({trimmed})"
        bad = (
            f"({trimmed} IS NOT NULL AND {low} IN ("
            f"'unavailable', 'no', 'false', '0', 'inactive', 'leased', 'rented'"
            f"))"
        )
        good = f"{low} IN ('available', 'yes', 'true', '1', 'active')"
        if rent_ok:
            pred = f"(NOT ({bad}) AND (({trimmed} IS NULL AND {rent_ok}) OR ({good})))"
            desc = (
                f"Rows where {av} is available (or null/empty with positive rent from COALESCE rent columns), "
                f"excluding explicit unavailable statuses."
            )
        else:
            pred = f"(NOT ({bad}) AND (({trimmed} IS NULL) OR ({good})))"
            desc = f"Rows where {av} is available or unset (no rent column to infer availability when unset)."
        return f" AND ({pred})", desc

    if rent_ok:
        return f" AND ({rent_ok})", "Rows with positive rent (no availability_status column)."

    return "", "No availability_status or rent columns; all bbox rows included."


def build_column_sql(qtable: str, cols: set[str]) -> ColumnSql:
    if "latitude" not in cols or "longitude" not in cols:
        raise ValueError("Listings table must have latitude and longitude for NYC metro bbox analytics")

    geo_where = (
        "latitude::double precision BETWEEN :south AND :north "
        "AND longitude::double precision BETWEEN :west AND :east"
    )

    if "property_id" in cols:
        building_expr = "NULLIF(TRIM(CAST(property_id AS text)), '')"
    else:
        building_expr = "CONCAT(ROUND(latitude::numeric, 5)::text, ':', ROUND(longitude::numeric, 5)::text)"

    lu = _first_col(cols, ("listing_url", "listingurl", "url"))
    listing_url_col: str | None = lu
    pn = _first_col(cols, ("property_name", "propertyname"))
    co = _first_col(cols, ("company",))

    host_parts: list[str] = []
    if lu:
        host_parts.append(
            f"NULLIF(LOWER(TRIM(substring(CAST({quote_ident(lu)} AS text) from " f"'^https?://([^/]+)'))), '')"
        )
    host_parts[0] if host_parts else "NULL::text"

    pk_parts: list[str] = []
    if host_parts:
        pk_parts.append(host_parts[0])
    if pn:
        pk_parts.append(f"NULLIF(LOWER(TRIM(CAST({quote_ident(pn)} AS text))), '')")
    if co:
        pk_parts.append(f"NULLIF(LOWER(TRIM(CAST({quote_ident(co)} AS text))), '')")
    if pk_parts:
        priority_key_expr = "COALESCE(" + ", ".join(pk_parts) + ", '(unknown)')"
    else:
        priority_key_expr = "'(unknown)'"

    company_expr = f"COALESCE(NULLIF(TRIM(CAST({quote_ident(co)} AS text)), ''), '(unknown)')" if co else "'(unknown)'"

    st = _first_col(cols, ("scraped_timestamp", "scraped_ts", "scrapedat"))
    scraped_raw_text_sql: str | None = None
    scraped_ts_sql: str | None = None
    if st:
        qi = quote_ident(st)
        scraped_raw_text_sql = f"NULLIF(TRIM(CAST({qi} AS text)), '')"
        scraped_ts_sql = f"{scraped_raw_text_sql}::timestamptz"

    zc = resolve_zip_column(cols)
    zip_expr = f"LEFT(REGEXP_REPLACE(TRIM(CAST({quote_ident(zc)} AS text)), '[^0-9]', '', 'g'), 5)" if zc else None

    rent_expr = _rent_sql_expr(cols)
    bed_label_expr = _bedroom_label_sql(cols)

    image_col = _first_col(cols, ("image_url", "images_urls", "primary_image_url"))
    image_present_expr: str | None = None
    if image_col == "images_urls":
        image_present_expr = (
            f"(NULLIF(TRIM(CAST({quote_ident(image_col)} AS text)), '') IS NOT NULL "
            f"AND NULLIF(TRIM(CAST({quote_ident(image_col)} AS text)), '') != '[]')"
        )
    elif image_col:
        image_present_expr = f"NULLIF(TRIM(CAST({quote_ident(image_col)} AS text)), '') IS NOT NULL"

    li = _first_col(cols, ("listing_id",))
    listing_id_expr = f"CAST({quote_ident(li)} AS text)" if li else None

    aa = _first_col(cols, ("available_at", "availableat"))
    available_at_sql: str | None = None
    if aa:
        aiq = quote_ident(aa)
        available_at_sql = f"NULLIF(TRIM(CAST({aiq} AS text)), '')::timestamptz"

    return ColumnSql(
        qtable=qtable,
        geo_where=geo_where,
        building_expr=building_expr,
        priority_key_expr=priority_key_expr,
        company_expr=company_expr,
        listing_url_col=listing_url_col,
        scraped_raw_text_sql=scraped_raw_text_sql,
        scraped_ts_sql=scraped_ts_sql,
        zip_expr=zip_expr,
        bed_label_expr=bed_label_expr,
        rent_expr=rent_expr,
        image_present_expr=image_present_expr,
        listing_id_expr=listing_id_expr,
        available_at_sql=available_at_sql,
    )


def _execute_map(conn: Connection, sql: str, params: dict[str, Any]) -> list[dict[str, Any]]:
    return cached_execute_all(conn, sql, params)


def _in_clause_placeholders(keys: list[str]) -> tuple[str, dict[str, Any]]:
    """Bind many building_key strings safely for SQL IN (...)."""
    bind: dict[str, Any] = {}
    parts: list[str] = []
    for i, k in enumerate(keys):
        name = f"top_bk_{i}"
        parts.append(f":{name}")
        bind[name] = k
    return ", ".join(parts), bind


def run_inventory_analytics(
    conn: Connection,
    *,
    qtable: str,
    tname: str,
    schema_for_info: str,
    west: float,
    south: float,
    east: float,
    north: float,
    available_only: bool = True,
) -> InventoryAnalyticsResponse:
    cols = _table_columns_lower(conn, schema_for_info, tname)
    params: dict[str, Any] = {"west": west, "south": south, "east": east, "north": north}
    cs = build_column_sql(qtable, cols)

    avail_frag, avail_desc = _availability_where_sql(cols, cs, active=available_only)
    base_from = f"FROM {cs.qtable} WHERE {cs.geo_where}{avail_frag}"

    totals_sql = f"""
SELECT
  COUNT(*)::bigint AS total_listing_rows,
  COUNT(DISTINCT {cs.building_expr})::bigint AS distinct_buildings
{base_from}
"""
    totals = _execute_map(conn, totals_sql, params)[0]
    total_rows = int(totals["total_listing_rows"] or 0)
    distinct_b = int(totals["distinct_buildings"] or 0)

    proof_sql = f"""
WITH per_b AS (
  SELECT ({cs.building_expr}) AS bk, COUNT(*)::bigint AS cnt
  {base_from}
  GROUP BY 1
),
non_null AS (
  SELECT * FROM per_b WHERE bk IS NOT NULL
)
SELECT
  COALESCE((SELECT SUM(cnt) FROM non_null), 0)::bigint AS attributed_rows,
  COALESCE((SELECT COUNT(*) FROM non_null), 0)::bigint AS n_buildings,
  COALESCE((SELECT MAX(cnt) FROM non_null), 0)::bigint AS max_cnt,
  (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY cnt::double precision) FROM non_null) AS median_cnt,
  COALESCE((SELECT COUNT(*) FROM non_null WHERE cnt = 1), 0)::bigint AS b1,
  COALESCE((SELECT COUNT(*) FROM non_null WHERE cnt BETWEEN 2 AND 5), 0)::bigint AS b2_5,
  COALESCE((SELECT COUNT(*) FROM non_null WHERE cnt BETWEEN 6 AND 15), 0)::bigint AS b6_15,
  COALESCE((SELECT COUNT(*) FROM non_null WHERE cnt >= 16), 0)::bigint AS b16p
"""
    proof_row = _execute_map(conn, proof_sql, params)[0]
    attributed = int(proof_row.get("attributed_rows") or 0)
    n_b = int(proof_row.get("n_buildings") or 0)
    max_cnt = int(proof_row.get("max_cnt") or 0)
    med_v = proof_row.get("median_cnt")
    median_cnt: float | None = None
    if med_v is not None:
        try:
            median_cnt = float(med_v)
        except (TypeError, ValueError):
            median_cnt = None
    sample_sql = f"""
SELECT bk::text AS building_key, cnt::bigint AS listing_count
FROM (
  SELECT ({cs.building_expr}) AS bk, COUNT(*)::bigint AS cnt
  {base_from}
  GROUP BY 1
) x
WHERE bk IS NOT NULL
ORDER BY cnt DESC
LIMIT 12
"""
    top_rows = _execute_map(conn, sample_sql, params)
    keys = [str(r["building_key"]) for r in top_rows]
    peeks_by_key: dict[str, list[ListingRowPeek]] = {}
    if keys:
        in_ph, in_extra = _in_clause_placeholders(keys)
        pn_col = _first_col(cols, ("property_name", "propertyname"))
        url_peek_sql = (
            f"NULLIF(TRIM(CAST({quote_ident(cs.listing_url_col)} AS text)), '')" if cs.listing_url_col else "NULL::text"
        )
        name_peek_sql = f"NULLIF(TRIM(CAST({quote_ident(pn_col)} AS text)), '')" if pn_col else "NULL::text"
        peek_sql = f"""
WITH numbered AS (
  SELECT
    ({cs.building_expr})::text AS bk,
    SUBSTRING(COALESCE({url_peek_sql}, '') FROM 1 FOR 2000) AS listing_url_s,
    SUBSTRING(COALESCE({name_peek_sql}, '') FROM 1 FOR 500) AS property_name_s,
    latitude::double precision AS lat,
    longitude::double precision AS lng,
    ROW_NUMBER() OVER (
      PARTITION BY ({cs.building_expr})
      ORDER BY COALESCE({url_peek_sql}, ''), COALESCE({name_peek_sql}, '')
    ) AS rn
  {base_from}
  AND ({cs.building_expr})::text IN ({in_ph})
)
SELECT bk, listing_url_s, property_name_s, lat, lng, rn
FROM numbered
WHERE rn <= 3
"""
        for pr in _execute_map(conn, peek_sql, {**params, **in_extra}):
            bk = str(pr["bk"])
            url_raw = pr.get("listing_url_s")
            name_raw = pr.get("property_name_s")
            lat_v = pr.get("lat")
            lng_v = pr.get("lng")
            u = str(url_raw).strip() if url_raw is not None and str(url_raw).strip() else None
            n = str(name_raw).strip() if name_raw is not None and str(name_raw).strip() else None
            peek = ListingRowPeek(
                listing_url=u,
                property_name=n,
                latitude=float(lat_v) if lat_v is not None else None,
                longitude=float(lng_v) if lng_v is not None else None,
            )
            peeks_by_key.setdefault(bk, []).append(peek)
    samples = [
        ListingsPerBuildingSample(
            building_key=str(r["building_key"])[:500],
            listing_count=int(r["listing_count"] or 0),
            sample_rows=peeks_by_key.get(str(r["building_key"]), []),
        )
        for r in top_rows
    ]
    mean_lpb = round(attributed / n_b, 4) if n_b > 0 else 0.0
    listings_proof = ListingsPerBuildingProof(
        total_listing_rows_attributed=attributed,
        buildings_in_distribution=n_b,
        mean_listings_per_building=mean_lpb,
        median_listings_per_building=median_cnt,
        max_listings_single_building=max_cnt,
        buildings_with_count_1=int(proof_row.get("b1") or 0),
        buildings_with_count_2_to_5=int(proof_row.get("b2_5") or 0),
        buildings_with_count_6_to_15=int(proof_row.get("b6_15") or 0),
        buildings_with_count_16_plus=int(proof_row.get("b16p") or 0),
        top_buildings_by_listing_count=samples,
        rows_without_building_key=max(0, total_rows - attributed),
    )

    company_sql = f"""
SELECT
  {cs.company_expr} AS label,
  COUNT(*)::bigint AS listing_rows,
  COUNT(DISTINCT {cs.building_expr})::bigint AS distinct_buildings
{base_from}
GROUP BY 1
ORDER BY listing_rows DESC
"""
    company_slices = [
        SourceSliceRow(
            label=str(r["label"] or "(unknown)"),
            listing_rows=int(r["listing_rows"] or 0),
            distinct_buildings=int(r["distinct_buildings"] or 0),
        )
        for r in _execute_map(conn, company_sql, params)
    ]

    top5_share: float | None = None
    if total_rows > 0 and company_slices:
        top5 = sum(s.listing_rows for s in company_slices[:5])
        top5_share = round(100.0 * top5 / total_rows, 2)

    staleness = StalenessSummary(
        rows_with_timestamp=0,
        rows_parse_failed=0,
    )
    staleness_by_company: list[StalenessByBucket] = []
    staleness_by_priority: list[StalenessByBucket] = []

    if cs.scraped_ts_sql and cs.scraped_raw_text_sql:
        stale_full = f"""
WITH scoped AS (
  SELECT
    {cs.priority_key_expr} AS priority_key,
    {cs.company_expr} AS company_l,
    {cs.scraped_raw_text_sql} AS scraped_raw,
    {cs.scraped_ts_sql} AS scraped_ts
  {base_from}
),
ages AS (
  SELECT priority_key, company_l,
    EXTRACT(EPOCH FROM (NOW() AT TIME ZONE 'utc' - scraped_ts)) / 3600.0 AS age_h
  FROM scoped
  WHERE scraped_ts IS NOT NULL
)
SELECT
  (SELECT COUNT(*) FROM ages) AS ok_rows,
  (SELECT COUNT(*) FROM scoped WHERE scraped_raw IS NOT NULL AND scraped_ts IS NULL) AS parse_failed,
  (SELECT MIN(age_h) FROM ages) AS age_min,
  (SELECT MAX(age_h) FROM ages) AS age_max,
  (SELECT AVG(age_h) FROM ages) AS age_mean,
  (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY age_h) FROM ages) AS age_p50,
  (SELECT percentile_cont(0.9) WITHIN GROUP (ORDER BY age_h) FROM ages) AS age_p90,
  (SELECT 100.0 * COUNT(*) FILTER (WHERE age_h > 168) / NULLIF(COUNT(*), 0) FROM ages) AS pct_7d,
  (SELECT 100.0 * COUNT(*) FILTER (WHERE age_h > 720) / NULLIF(COUNT(*), 0) FROM ages) AS pct_30d
"""
        try:
            srow = _execute_map(conn, stale_full, params)[0]
            staleness.rows_with_timestamp = int(srow.get("ok_rows") or 0)
            staleness.rows_parse_failed = int(srow.get("parse_failed") or 0)

            def _f(k: str) -> float | None:
                v = srow.get(k)
                if v is None:
                    return None
                try:
                    return float(v)
                except (TypeError, ValueError):
                    return None

            staleness.age_hours_min = _f("age_min")
            staleness.age_hours_max = _f("age_max")
            staleness.age_hours_mean = _f("age_mean")
            staleness.age_hours_p50 = _f("age_p50")
            staleness.age_hours_p90 = _f("age_p90")
            staleness.pct_older_than_7d = _f("pct_7d")
            staleness.pct_older_than_30d = _f("pct_30d")

            by_co_sql = f"""
WITH scoped AS (
  SELECT
    {cs.priority_key_expr} AS priority_key,
    {cs.company_expr} AS company_l,
    {cs.scraped_raw_text_sql} AS scraped_raw,
    {cs.scraped_ts_sql} AS scraped_ts
  {base_from}
),
ages AS (
  SELECT priority_key, company_l,
    EXTRACT(EPOCH FROM (NOW() AT TIME ZONE 'utc' - scraped_ts)) / 3600.0 AS age_h
  FROM scoped
  WHERE scraped_ts IS NOT NULL
)
SELECT company_l AS bucket, COUNT(*)::bigint AS listing_rows, AVG(age_h) AS age_hours_mean
FROM ages
GROUP BY company_l
ORDER BY listing_rows DESC
LIMIT 40
"""
            staleness_by_company = [
                StalenessByBucket(
                    bucket=str(r["bucket"] or "(unknown)"),
                    listing_rows=int(r["listing_rows"] or 0),
                    age_hours_mean=float(r["age_hours_mean"]) if r["age_hours_mean"] is not None else None,
                )
                for r in _execute_map(conn, by_co_sql, params)
            ]

            by_pk_sql = by_co_sql.replace("company_l AS bucket", "priority_key AS bucket").replace(
                "GROUP BY company_l", "GROUP BY priority_key"
            )
            staleness_by_priority = [
                StalenessByBucket(
                    bucket=str(r["bucket"] or "(unknown)"),
                    listing_rows=int(r["listing_rows"] or 0),
                    age_hours_mean=float(r["age_hours_mean"]) if r["age_hours_mean"] is not None else None,
                )
                for r in _execute_map(conn, by_pk_sql, params)
            ]
        except Exception:
            # Invalid timestamps or unsupported formats for scraped_timestamp in some rows
            # can make the whole staleness CTE fail; other sections still return.
            pass

    zip_buckets: list[ZipBucketRow] = []
    if cs.zip_expr:
        zip_sql = f"""
SELECT
  {cs.zip_expr} AS zip5,
  COUNT(*)::bigint AS listing_rows,
  COUNT(DISTINCT {cs.building_expr})::bigint AS distinct_buildings
{base_from}
GROUP BY 1
HAVING LENGTH({cs.zip_expr}) = 5
ORDER BY listing_rows DESC
LIMIT 200
"""
        zip_buckets = [
            ZipBucketRow(
                zip5=str(r["zip5"]),
                listing_rows=int(r["listing_rows"] or 0),
                distinct_buildings=int(r["distinct_buildings"] or 0),
            )
            for r in _execute_map(conn, zip_sql, params)
        ]

    bedroom_mix: dict[str, int] = {}
    bed_sql = f"""
SELECT bed_label, COUNT(*)::int AS c
FROM (
  SELECT {cs.bed_label_expr} AS bed_label
  {base_from}
) t
WHERE bed_label IS NOT NULL
GROUP BY bed_label
ORDER BY c DESC
LIMIT 24
"""
    for r in _execute_map(conn, bed_sql, params):
        bedroom_mix[str(r["bed_label"])] = int(r["c"] or 0)

    rent_pct: float | None = None
    if cs.rent_expr and total_rows > 0:
        rent_sql = f"""
SELECT
  COUNT(*) FILTER (WHERE ({cs.rent_expr}) IS NOT NULL AND ({cs.rent_expr}) > 0)::bigint AS with_rent
{base_from}
"""
        wr = int(_execute_map(conn, rent_sql, params)[0].get("with_rent") or 0)
        rent_pct = round(100.0 * wr / total_rows, 2)

    image_pct: float | None = None
    if cs.image_present_expr and total_rows > 0:
        img_sql = f"""
SELECT COUNT(*) FILTER (WHERE ({cs.image_present_expr}))::bigint AS with_img
{base_from}
"""
        wi = int(_execute_map(conn, img_sql, params)[0].get("with_img") or 0)
        image_pct = round(100.0 * wi / total_rows, 2)

    listing_null_pct: float | None = None
    dup_rows: int | None = None
    if cs.listing_id_expr and total_rows > 0:
        null_sql = f"""
SELECT COUNT(*) FILTER (WHERE NULLIF(TRIM({cs.listing_id_expr}), '') IS NULL)::bigint AS null_ids
{base_from}
"""
        nids = int(_execute_map(conn, null_sql, params)[0].get("null_ids") or 0)
        listing_null_pct = round(100.0 * nids / total_rows, 2)

        dup_sql = f"""
SELECT COALESCE(SUM(c - 1), 0)::bigint AS dup_extra
FROM (
  SELECT COUNT(*)::bigint AS c
  {base_from}
  AND NULLIF(TRIM({cs.listing_id_expr}), '') IS NOT NULL
  GROUP BY TRIM({cs.listing_id_expr})
  HAVING COUNT(*) > 1
) t
"""
        dup_rows = int(_execute_map(conn, dup_sql, params)[0].get("dup_extra") or 0)

    avail_stale: int | None = None
    if cs.scraped_ts_sql and cs.available_at_sql:
        try:
            av_sql = f"""
SELECT COUNT(*)::bigint AS c
{base_from}
AND {cs.available_at_sql} IS NOT NULL
AND {cs.scraped_ts_sql} IS NOT NULL
AND {cs.available_at_sql} < {cs.scraped_ts_sql}
"""
            avail_stale = int(_execute_map(conn, av_sql, params)[0].get("c") or 0)
        except Exception:
            avail_stale = None

    seeds = load_target_seeds()
    target_rows: list[TargetCoverageRow] = []
    covered_n = 0
    if seeds and cs.listing_url_col:
        luq = quote_ident(cs.listing_url_col)
        urls_sql = f"""
SELECT DISTINCT LOWER(TRIM(CAST({luq} AS text))) AS u
{base_from}
AND NULLIF(TRIM(CAST({luq} AS text)), '') IS NOT NULL
LIMIT 50000
"""
        urls = {str(r["u"]) for r in _execute_map(conn, urls_sql, params) if r.get("u")}
        for seed in seeds:
            prefix = normalize_seed_prefix(seed)
            matched: str | None = None
            for u in urls:
                if u.startswith(prefix):
                    matched = u[:120]
                    break
            if matched is None:
                host = urlparse(seed).netloc.lower()
                for u in urls:
                    if host and host in u:
                        matched = u[:120]
                        break
            ok = matched is not None
            if ok:
                covered_n += 1
            target_rows.append(
                TargetCoverageRow(
                    seed_url=seed,
                    normalized_prefix=prefix,
                    covered=ok,
                    matched_listing_sample=matched,
                )
            )
    elif seeds:
        for seed in seeds:
            target_rows.append(
                TargetCoverageRow(
                    seed_url=seed,
                    normalized_prefix=normalize_seed_prefix(seed),
                    covered=False,
                    matched_listing_sample=None,
                )
            )

    target_summary = TargetCoverageSummary(
        total_targets=len(target_rows),
        covered_count=covered_n,
        uncovered_count=len(target_rows) - covered_n,
        targets=target_rows,
    )

    quality = QualityMetrics(
        rent_present_pct=rent_pct,
        image_present_pct=image_pct,
        listing_id_null_pct=listing_null_pct,
        duplicate_listing_id_rows=dup_rows,
        top5_priority_share_pct=top5_share,
        availability_stale_rows=avail_stale,
    )

    cov_ctx = load_metro_coverage_context_file()
    metro_est = cov_ctx.metro_buildings
    metro_note = cov_ctx.note
    exceed = bool(metro_est is not None and distinct_b >= metro_est)
    gap_b = max(0, metro_est - distinct_b) if metro_est is not None else None

    cms_market_pie, cms_warn = build_cms_market_share_pie(
        company_slices=company_slices,
        total_listing_rows=total_rows,
        market_total_listings=cov_ctx.market_listing_rows,
        off_platform=cov_ctx.off_platform_sources,
    )

    metro_pie: list[MetroCoveragePieSlice] = []
    if metro_est is not None:
        if distinct_b > 0:
            metro_pie.append(
                MetroCoveragePieSlice(
                    label="In platform inventory (this bbox)",
                    buildings=distinct_b,
                )
            )
        if gap_b > 0:
            metro_pie.append(
                MetroCoveragePieSlice(
                    label="Not in platform (estimated)",
                    buildings=gap_b,
                )
            )
        if not metro_pie:
            metro_pie.append(MetroCoveragePieSlice("No rows in bbox (vs estimated metro)", buildings=0))
    else:
        metro_pie.append(
            MetroCoveragePieSlice(
                label="In platform (bbox); configure estimated_metro_rental_buildings for gap",
                buildings=distinct_b,
            )
        )

    cov_est = MetroCoverageEstimate(
        configured=metro_est is not None,
        estimated_metro_buildings=metro_est,
        estimated_market_listing_rows=cov_ctx.market_listing_rows,
        on_platform_buildings=distinct_b,
        gap_buildings=gap_b,
        inventory_meets_or_exceeds_estimate=exceed,
        methodology_note=metro_note,
        cms_market_pie_warning=cms_warn,
    )

    return InventoryAnalyticsResponse(
        bbox={"west": west, "south": south, "east": east, "north": north},
        listings_table=tname,
        available_only=available_only,
        availability_filter_description=avail_desc,
        total_listing_rows=total_rows,
        distinct_buildings=distinct_b,
        company_slices=company_slices,
        staleness=staleness,
        staleness_by_company=staleness_by_company,
        staleness_by_priority=staleness_by_priority,
        zip_buckets=zip_buckets,
        bedroom_mix=bedroom_mix,
        quality=quality,
        target_coverage=target_summary,
        metro_coverage_pie=metro_pie,
        metro_coverage_estimate=cov_est,
        listings_per_building_proof=listings_proof,
        cms_market_share_pie=cms_market_pie,
    )
