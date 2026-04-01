"""Attach promo-like snippets from `listing_amenities` when listing rows lack other special-offer fields."""

from __future__ import annotations

from typing import Any

from sqlalchemy import inspect, text

from core.config import Config
from core.logger import get_logger
from workflow.utils import engine

logger = get_logger(__name__)

# PostgreSQL ~* ; keep bounded false positives vs missing everything after amenities ETL split.
_CONCESSION_AMENITY_RE = (
    r"(month|week|weeks|mos|mo)s?.{0,8}free"
    r"|free.{0,8}(month|rent)"
    r"|concession|special.{0,12}offer|move-?in|look.{0,6}lease"
    r"|waived|no.{0,4}deposit|\$.{0,6}off|rent.{0,8}credit"
)


def _listing_ids_from_rows(rows: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for row in rows:
        lid = row.get("listing_id")
        if lid is None or lid == "":
            continue
        s = str(lid).strip()
        if s and s not in seen:
            seen.add(s)
            out.append(s)
    return out


def _row_has_nonempty_concession(row: dict[str, Any]) -> bool:
    row_l = {str(k).lower(): v for k, v in row.items()}
    for key in (
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
    ):
        v = row_l.get(key)
        if v is None or v == "":
            continue
        if isinstance(v, str) and v.strip() and v.strip().lower() not in ("nan", "none", "null"):
            return True
        if isinstance(v, (int, float)) and str(v).strip():
            return True
    return False


def merge_concession_snippets_from_listing_amenities(deduped_rows: list[dict[str, Any]]) -> None:
    """Mutate rows in place: set `concessions` key from listing_amenities when no other special-offer text."""
    if not deduped_rows or engine.dialect.name != "postgresql":
        return
    ids = _listing_ids_from_rows(deduped_rows)
    if not ids:
        return

    table = (Config.get("LISTING_AMENITIES_TABLE_NAME", "") or "listing_amenities").strip() or "listing_amenities"
    # Amenities bridge table is usually in `public` even when LISTINGS_TABLE_NAME lives in another schema.
    la_schema = (Config.get("LISTING_AMENITIES_TABLE_SCHEMA", "") or "").strip()
    qtable = f'"{la_schema}"."{table}"' if la_schema else f'"{table}"'

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(table, schema=la_schema if la_schema else None):
                return

            placeholders = ",".join([f":lid{i}" for i in range(len(ids))])
            bind: dict[str, Any] = {f"lid{i}": ids[i] for i in range(len(ids))}
            bind["rx"] = _CONCESSION_AMENITY_RE
            sql = text(
                f"""
                SELECT listing_id,
                  string_agg(DISTINCT amenity_text_raw, '; ' ORDER BY amenity_text_raw) AS snippet
                FROM {qtable}
                WHERE listing_id IN ({placeholders})
                  AND amenity_text_norm ~ :rx
                GROUP BY listing_id
                """
            )
            rows_out = conn.execute(sql, bind).mappings().all()
    except Exception:
        logger.exception("listing_amenities concession merge failed")
        return

    by_id = {str(r["listing_id"]): str(r["snippet"]).strip() for r in rows_out if r.get("snippet")}
    if not by_id:
        return

    for row in deduped_rows:
        if _row_has_nonempty_concession(row):
            continue
        lid = row.get("listing_id")
        if lid is None:
            continue
        snippet = by_id.get(str(lid).strip())
        if snippet:
            row["concessions"] = snippet


