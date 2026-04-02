#!/usr/bin/env -S python3 -u
"""Legacy: copy amenity *columns* from ``listings`` into ``listing_amenities``.

After migrations drop amenity columns from ``listings``, this script exits with
“No amenity columns found”. Populate ``listing_amenities`` from vendor pages via
``scripts/backfill_listing_amenities.py``. This legacy sync embeds each batch
(reuses vectors from Postgres + embedding API for novel norms; same env as
``scripts/backfill_listing_amenity_embeddings.py``).
"""

from __future__ import annotations

import ast
import json
import os
import sys
from pathlib import Path
from typing import Any

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import execute_values
from sqlalchemy import create_engine, text

REPO_ROOT = Path(__file__).resolve().parent.parent
_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

import listing_amenities_upsert as lau
import listing_amenity_embedding_util as leu

ENV_FILE = REPO_ROOT / "api" / ".env"


def _qtable(schema: str | None, table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _psycopg_dsn(database_url: str) -> str:
    u = database_url.strip()
    for prefix in ("postgresql+psycopg2://", "postgresql+asyncpg://"):
        if u.startswith(prefix):
            return "postgresql://" + u[len(prefix) :]
    return u


def _parse_amenity_blob(raw: Any) -> list[str]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    if not isinstance(raw, str):
        txt = str(raw).strip()
        return [txt] if txt else []
    txt = raw.strip()
    if not txt:
        return []
    if txt.startswith("[") and txt.endswith("]"):
        for parser in (json.loads, ast.literal_eval):
            try:
                parsed = parser(txt)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed if str(x).strip()]
            except Exception:
                continue
    # common delimited fallback
    if "||" in txt:
        return [x.strip() for x in txt.split("||") if x.strip()]
    if "|" in txt:
        return [x.strip() for x in txt.split("|") if x.strip()]
    if ";" in txt:
        return [x.strip() for x in txt.split(";") if x.strip()]
    return [txt]


def _table_columns(engine, schema: str, table: str) -> set[str]:
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = :schema
                  AND table_name = :table
                """
            ),
            {"schema": schema, "table": table},
        ).fetchall()
    return {str(r[0]).lower() for r in rows}


def _pick(cols: set[str], *candidates: str) -> str | None:
    for c in candidates:
        if c.lower() in cols:
            return c.lower()
    return None


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(
        description=(
            "Legacy: sync listings amenity columns into listing_amenities "
            "(no-op if listings amenity columns were dropped)."
        )
    )
    parser.add_argument("--batch-size", type=int, default=800, help="Rows per batched INSERT")
    parser.add_argument("--progress-every", type=int, default=2000, help="Log progress every N listing rows")
    args = parser.parse_args()

    print("listing_amenities sync: loading env and connecting…", flush=True)

    if not ENV_FILE.exists():
        raise RuntimeError(f"Missing env file: {ENV_FILE}")
    load_dotenv(ENV_FILE, override=True)

    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not db_url:
        raise RuntimeError("DATABASE_URL missing")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or "public"
    qtable = _qtable(schema, table)
    amenity_table = (os.environ.get("LISTING_AMENITIES_TABLE_NAME") or "listing_amenities").strip() or "listing_amenities"
    q_amenity = _qtable(schema, amenity_table)
    engine = create_engine(db_url, future=True)

    cols = _table_columns(engine, schema, table)
    listing_id_col = _pick(cols, "listing_id")
    if not listing_id_col:
        raise RuntimeError("listings table must have listing_id")

    amenity_cols = [
        c
        for c in (
            "amenities",
            "community_amenities",
            "apartment_amenities",
            "building_amenities",
            "features",
            "amenity_list",
        )
        if c in cols
    ]
    if not amenity_cols:
        print(
            "No amenity columns found on listings; nothing to sync. "
            "(Amenity data should be scraped into listing_amenities via scripts/backfill_listing_amenities.py.)",
            flush=True,
        )
        return 0

    print(
        f"listing_amenities sync (legacy): scanning {qtable} (columns: {listing_id_col}, {', '.join(amenity_cols)})…",
        flush=True,
    )
    select_cols = ", ".join([f'"{listing_id_col}"'] + [f'"{c}"' for c in amenity_cols])
    upsert_sql = lau.upsert_sql_for_table(q_amenity)

    # One row per (listing, normalized text, source column) so community vs apartment both persist.
    seen_pairs: set[tuple[str, str, str]] = set()
    upserted = 0
    listing_rows_seen = 0
    batch: list[tuple[str, str, str, str, str]] = []

    def flush_batch(upsert_cur) -> None:
        nonlocal upserted, batch
        if not batch:
            return
        rows = leu.materialize_upsert_rows_with_embeddings(upsert_cur, q_amenity, list(batch))
        execute_values(
            upsert_cur,
            upsert_sql,
            rows,
            template=lau.UPSERT_VALUES_TEMPLATE,
        )
        upserted += len(batch)
        batch = []

    col_index = {c: i for i, c in enumerate([listing_id_col] + amenity_cols)}

    dsn = _psycopg_dsn(db_url)
    pg_read = psycopg2.connect(dsn)
    pg_write = psycopg2.connect(dsn)
    try:
        pg_read.autocommit = False
        pg_write.autocommit = False
        scan_cur = pg_read.cursor(name="listing_amenities_scan")
        scan_cur.itersize = min(500, max(50, args.batch_size))
        scan_cur.execute(f"SELECT {select_cols} FROM {qtable}")
        print("listing_amenities sync: query open, streaming rows…", flush=True)
        upsert_cur = pg_write.cursor()
        try:
            first_row = True
            for row in scan_cur:
                if first_row:
                    print("listing_amenities sync: first listing row received", flush=True)
                    first_row = False
                listing_rows_seen += 1
                if args.progress_every and listing_rows_seen % args.progress_every == 0:
                    print(
                        f"sync progress: {listing_rows_seen} listing rows, {upserted} amenity upserts so far",
                        flush=True,
                    )
                listing_id = str(row[col_index[listing_id_col]] or "").strip()
                if not listing_id:
                    continue
                for source_col in amenity_cols:
                    for raw_amenity in _parse_amenity_blob(row[col_index[source_col]]):
                        norm = lau.normalize_amenity_text(raw_amenity)
                        if not norm:
                            continue
                        key = (listing_id, norm, source_col)
                        if key in seen_pairs:
                            continue
                        seen_pairs.add(key)
                        h = lau.source_hash(raw_amenity, norm, source_col)
                        batch.append((listing_id, raw_amenity, norm, source_col, h))
                        if len(batch) >= args.batch_size:
                            flush_batch(upsert_cur)
                            pg_write.commit()
            flush_batch(upsert_cur)
            pg_write.commit()
        finally:
            upsert_cur.close()
            scan_cur.close()
    finally:
        pg_read.close()
        pg_write.close()

    print(f"listing_amenities synced: {upserted} upserts, {len(seen_pairs)} unique rows", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
