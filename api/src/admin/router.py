"""Admin API routes."""

from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict
from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import inspect, text

from admin.inventory_analytics import (
    NYC_METRO_BBOX_DEFAULT,
    InventoryAnalyticsResponse,
    repo_root,
    run_inventory_analytics,
    validate_bbox,
)
from auth.router import get_current_admin_user
from core.config import Config
from core.logger import get_logger
from db.models import Users
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

_SECURECAFE_SITEKEY_RE = re.compile(r"/onlineleasing/([^/]+)/", re.IGNORECASE)


class ScrapeTargetRow(BaseModel):
    platform: str = Field(description="appfolio | realpage | rentcafe | entrata | greystar")
    seed_url: str
    host: str | None = None
    identifier: str | None = None
    notes: str | None = None
    listings_in_postgres: int = 0


class ScrapeTargetsResponse(BaseModel):
    computed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    counts_by_platform: dict[str, int]
    targets: list[ScrapeTargetRow]


def _read_seed_lines(path: Path) -> list[str]:
    if not path.is_file():
        raise HTTPException(status_code=503, detail=f"Missing seed file: {path}")
    out: list[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        s = raw.strip()
        if not s or s.startswith("#"):
            continue
        out.append(s)
    return out


def _normalize_seed_url(url: str) -> str:
    s = url.strip()
    p = urlparse(s)
    if not p.scheme or not p.netloc:
        return s.rstrip("/").lower()
    path = (p.path or "").rstrip("/")
    return f"{p.scheme.lower()}://{p.netloc.lower()}{path}".lower()


def _seed_to_row(platform: str, seed_url: str) -> ScrapeTargetRow:
    p = urlparse(seed_url.strip())
    host = p.netloc.lower().strip() if p.netloc else None
    identifier: str | None = None
    notes: str | None = None

    if platform == "appfolio" and host:
        identifier = host.split(".")[0] if host.endswith(".appfolio.com") else None
    elif platform == "realpage":
        m = _SECURECAFE_SITEKEY_RE.search(p.path or "")
        identifier = m.group(1) if m else None
    elif platform == "rentcafe":
        identifier = (p.path or "").strip("/").lower() or None
    elif platform == "greystar":
        notes = "Discovered via sitemap"

    return ScrapeTargetRow(
        platform=platform,
        seed_url=seed_url.strip(),
        host=host,
        identifier=identifier,
        notes=notes,
    )


def _listings_url_col(conn, schema_for_info: str, tname: str) -> str | None:
    rows = conn.execute(
        text(
            """
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = :schema AND table_name = :tname
            """
        ),
        {"schema": schema_for_info, "tname": tname},
    ).fetchall()
    cols = {str(r[0]).lower() for r in rows}
    for candidate in ("listing_url", "listingurl", "url"):
        if candidate in cols:
            return candidate
    return None


@router.get("/scrape-targets", response_model=ScrapeTargetsResponse)
def get_scrape_targets(
    user: Users = Depends(get_current_admin_user),
) -> ScrapeTargetsResponse:
    _ = user
    root = repo_root()

    # Deterministic, exhaustive, repo-driven seed lists.
    appfolio_seeds = _read_seed_lines(root / "appfolio_scraper" / "seeds_discovered.txt")
    realpage_seeds = _read_seed_lines(root / "realpage_scraper" / "seeds.txt") + _read_seed_lines(
        root / "realpage_scraper" / "nyc_seeds_probed.txt"
    )
    entrata_seeds = _read_seed_lines(root / "entrata_scraper" / "seeds.txt")
    rentcafe_seeds = _read_seed_lines(root / "rentcafe_scraper" / "nyc_metro_property_urls.txt")

    rows: list[ScrapeTargetRow] = []
    rows.extend(_seed_to_row("appfolio", u) for u in appfolio_seeds)
    rows.extend(_seed_to_row("realpage", u) for u in realpage_seeds)
    rows.extend(_seed_to_row("entrata", u) for u in entrata_seeds)
    rows.extend(_seed_to_row("rentcafe", u) for u in rentcafe_seeds)
    rows.append(
        _seed_to_row("greystar", "https://www.greystar.com/sitemap.xml")
    )

    seen: set[str] = set()
    deduped: list[ScrapeTargetRow] = []
    for r in rows:
        key = f"{r.platform}:{_normalize_seed_url(r.seed_url)}"
        if key in seen:
            continue
        seen.add(key)
        deduped.append(r)

    deduped.sort(key=lambda r: (r.platform, (r.host or ""), r.seed_url))
    counts: dict[str, int] = {}
    for r in deduped:
        counts[r.platform] = counts.get(r.platform, 0) + 1

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        raise HTTPException(status_code=503, detail="Listings database not configured")
    if engine.dialect.name != "postgresql":
        raise HTTPException(status_code=503, detail="Unsupported database dialect")

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()
    if not tname:
        raise HTTPException(status_code=503, detail="Listings table not configured")

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                raise HTTPException(status_code=503, detail="Listings table missing")
            url_col = _listings_url_col(conn, schema_for_info=schema_for_info, tname=tname)
            if not url_col:
                raise HTTPException(status_code=503, detail="Listings table URL column missing")
            uq = f'"{url_col}"'
            targets_by_host: dict[str, list[int]] = defaultdict(list)
            for idx, row in enumerate(deduped):
                host = (urlparse(row.seed_url).netloc or "").strip().lower()
                if not host:
                    continue
                targets_by_host[host].append(idx)

            if targets_by_host:
                hosts = sorted(targets_by_host.keys())
                host_counts_sql = text(
                    f"""
                    SELECT
                      LOWER(TRIM(SUBSTRING(CAST({uq} AS text) FROM '^https?://([^/]+)'))) AS host,
                      COUNT(*)::bigint AS c
                    FROM {qtable}
                    WHERE NULLIF(TRIM(CAST({uq} AS text)), '') IS NOT NULL
                      AND LOWER(TRIM(SUBSTRING(CAST({uq} AS text) FROM '^https?://([^/]+)'))) = ANY(:hosts)
                    GROUP BY 1
                    """
                )
                host_rows = conn.execute(host_counts_sql, {"hosts": hosts}).fetchall()
                counts_by_host: dict[str, int] = {
                    str(r[0]): int(r[1] or 0) for r in host_rows if r and r[0]
                }
                counts_by_idx: dict[int, int] = defaultdict(int)
                for host, idxs in targets_by_host.items():
                    c = int(counts_by_host.get(host, 0))
                    for idx in idxs:
                        counts_by_idx[idx] = c

                for idx, row in enumerate(deduped):
                    deduped[idx] = row.model_copy(
                        update={"listings_in_postgres": int(counts_by_idx.get(idx, 0))}
                    )
    except HTTPException:
        raise
    except Exception:
        logger.exception("admin/scrape-targets postgres count failed")
        raise HTTPException(status_code=500, detail="Failed to compute Postgres listing counts")

    return ScrapeTargetsResponse(counts_by_platform=counts, targets=deduped)


def _qualified_table() -> str:
    name = (listing_table_name or "").strip()
    if not name:
        return ""
    schema = (listing_table_schema or "").strip()
    if schema:
        return f'"{schema}"."{name}"'
    return f'"{name}"'


@router.get("/inventory-analytics", response_model=InventoryAnalyticsResponse)
def get_inventory_analytics(
    user: Users = Depends(get_current_admin_user),
    west: float | None = Query(default=None, description="BBox west longitude (default NYC metro)"),
    south: float | None = Query(default=None),
    east: float | None = Query(default=None),
    north: float | None = Query(default=None),
    available_only: bool = Query(
        default=True,
        description="When true, count only rows deemed available (availability_status and/or rent).",
    ),
) -> InventoryAnalyticsResponse:
    _ = user
    w = NYC_METRO_BBOX_DEFAULT["west"] if west is None else west
    so = NYC_METRO_BBOX_DEFAULT["south"] if south is None else south
    e = NYC_METRO_BBOX_DEFAULT["east"] if east is None else east
    n = NYC_METRO_BBOX_DEFAULT["north"] if north is None else north
    try:
        validate_bbox(w, so, e, n)
    except ValueError as ex:
        raise HTTPException(status_code=422, detail=str(ex)) from ex

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        raise HTTPException(status_code=503, detail="Listings database not configured")

    if engine.dialect.name != "postgresql":
        raise HTTPException(status_code=503, detail="Unsupported database dialect")

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                raise HTTPException(status_code=503, detail="Listings table missing")

            try:
                return run_inventory_analytics(
                    conn,
                    qtable=qtable,
                    tname=tname,
                    schema_for_info=schema_for_info,
                    west=w,
                    south=so,
                    east=e,
                    north=n,
                    available_only=available_only,
                )
            except ValueError as ex:
                raise HTTPException(status_code=501, detail=str(ex)) from ex
    except HTTPException:
        raise
    except Exception:
        logger.exception("admin/inventory-analytics failed")
        raise HTTPException(status_code=500, detail="Analytics query failed")
