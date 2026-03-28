#!/usr/bin/env python3
from __future__ import annotations

import ast
import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import execute_values
from sqlalchemy import create_engine, text


REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"
_WHITESPACE_RE = re.compile(r"\s+")
_PUNCT_SPACE_RE = re.compile(r"[^\w]+")


def _qtable(schema: str | None, table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _normalize_amenity_text(value: str) -> str:
    t = value.strip().lower()
    t = _PUNCT_SPACE_RE.sub(" ", t)
    t = _WHITESPACE_RE.sub(" ", t).strip()
    return t


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


def _source_hash(raw: str, norm: str, source_field: str) -> str:
    base = f"{source_field}\x1f{raw}\x1f{norm}"
    return hashlib.sha256(base.encode("utf-8")).hexdigest()


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

    parser = argparse.ArgumentParser(description="Sync listings amenity columns into listing_amenities")
    parser.add_argument("--batch-size", type=int, default=800, help="Rows per batched INSERT")
    parser.add_argument("--progress-every", type=int, default=5000, help="Log progress every N listing rows")
    args = parser.parse_args()

    if not ENV_FILE.exists():
        raise RuntimeError(f"Missing env file: {ENV_FILE}")
    load_dotenv(ENV_FILE, override=True)

    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not db_url:
        raise RuntimeError("DATABASE_URL missing")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or "public"
    qtable = _qtable(schema, table)
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
        print("No amenity columns found; nothing to sync.")
        return 0

    select_cols = ", ".join([f'"{listing_id_col}"'] + [f'"{c}"' for c in amenity_cols])
    upsert_sql = """
        INSERT INTO listing_amenities (
          listing_id,
          amenity_text_raw,
          amenity_text_norm,
          source_field,
          amenity_embedding_source_hash,
          updated_at
        ) VALUES %s
        ON CONFLICT (listing_id, amenity_text_norm)
        DO UPDATE SET
          amenity_text_raw = EXCLUDED.amenity_text_raw,
          source_field = EXCLUDED.source_field,
          updated_at = EXCLUDED.updated_at,
          amenity_embedding_source_hash = EXCLUDED.amenity_embedding_source_hash,
          amenity_embedding = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding
          END,
          amenity_embedding_model = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding_model
          END,
          amenity_embedding_updated_at = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding_updated_at
          END
        """

    seen_pairs: set[tuple[str, str]] = set()
    upserted = 0
    listing_rows_seen = 0
    batch: list[tuple[str, str, str, str, str]] = []

    def flush_batch(upsert_cur) -> None:
        nonlocal upserted, batch
        if not batch:
            return
        execute_values(
            upsert_cur,
            upsert_sql,
            batch,
            template="(%s, %s, %s, %s, %s, NOW())",
        )
        upserted += len(batch)
        batch = []

    col_index = {c: i for i, c in enumerate([listing_id_col] + amenity_cols)}

    pg = psycopg2.connect(db_url)
    try:
        pg.autocommit = False
        scan_cur = pg.cursor(name="listing_amenities_scan")
        scan_cur.itersize = 2000
        scan_cur.execute(f"SELECT {select_cols} FROM {qtable}")
        upsert_cur = pg.cursor()
        try:
            for row in scan_cur:
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
                        norm = _normalize_amenity_text(raw_amenity)
                        if not norm:
                            continue
                        key = (listing_id, norm)
                        if key in seen_pairs:
                            continue
                        seen_pairs.add(key)
                        h = _source_hash(raw_amenity, norm, source_col)
                        batch.append((listing_id, raw_amenity, norm, source_col, h))
                        if len(batch) >= args.batch_size:
                            flush_batch(upsert_cur)
            flush_batch(upsert_cur)
            pg.commit()
        finally:
            upsert_cur.close()
            scan_cur.close()
    finally:
        pg.close()

    print(f"listing_amenities synced: {upserted} upserts, {len(seen_pairs)} unique rows", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
