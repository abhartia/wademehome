#!/usr/bin/env python3
"""Copy amenity_embedding onto NULL rows that share the same amenity_text_norm + model.

**Important:** The old approach recomputed ``DISTINCT amenity_text_norm`` over every NULL row
*on each batch*, which rescans ~1M+ rows per batch and can take an hour on batch 1 alone.

This version:

1. **Discovers target norms once** (two GROUP BY / DISTINCT queries — one scan each).
2. **Updates in small batches** with ``WHERE amenity_text_norm = ANY(%s)`` so each statement
   only touches rows for those norms (fast if ``amenity_text_norm`` is indexed).

**No OpenAI/Azure calls:** this job copies existing vectors in Postgres only. Batch logs show
``embedding_api_calls=0``. Use ``scripts/backfill_listing_amenity_embeddings.py`` when you need
real API embeddings for norms that have no donor row.

Avoids duplicate embedding API work: reuse vectors already stored for that norm.

Respects ``LISTING_AMENITIES_TABLE_NAME`` / ``LISTING_AMENITIES_TABLE_SCHEMA``.

Usage (from repo root):
  ./api/.venv/bin/python scripts/propagate_listing_amenity_embeddings_by_norm.py
  ./api/.venv/bin/python scripts/propagate_listing_amenity_embeddings_by_norm.py --batch-norms 40
"""
from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"


def _dsn(raw: str) -> str:
    u = raw.strip()
    for prefix in ("postgresql+psycopg2://", "postgresql+asyncpg://"):
        if u.startswith(prefix):
            return "postgresql://" + u[len(prefix) :]
    return u


def _qualified_table(schema: str | None, table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _set_statement_timeout(cur, seconds: int) -> None:
    if seconds <= 0:
        cur.execute("SET statement_timeout = 0")
    else:
        cur.execute("SET statement_timeout = %s", (f"{int(seconds)}s",))


def main() -> int:
    parser = argparse.ArgumentParser(description="Propagate listing_amenities embeddings by amenity_text_norm")
    parser.add_argument(
        "--batch-norms",
        type=int,
        default=40,
        help="How many distinct norms per UPDATE (keep small so each batch stays fast)",
    )
    parser.add_argument(
        "--statement-timeout-s",
        type=int,
        default=600,
        metavar="SEC",
        help="PostgreSQL statement_timeout for each UPDATE batch (0 = disable)",
    )
    parser.add_argument(
        "--discover-timeout-s",
        type=int,
        default=0,
        metavar="SEC",
        help="Statement timeout for the one-time norm discovery queries (0 = disable; use if COUNT/DISTINCT is slow)",
    )
    parser.add_argument(
        "--skip-count",
        action="store_true",
        help="Skip the initial COUNT(*) (can be slow on huge tables)",
    )
    args = parser.parse_args()

    load_dotenv(ENV_FILE, override=True)
    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not db_url:
        print("DATABASE_URL missing", flush=True)
        return 1
    model = (os.environ.get("OPENAI_EMBEDDING_MODEL") or "text-embedding-3-small").strip()

    table_name = (os.environ.get("LISTING_AMENITIES_TABLE_NAME") or "listing_amenities").strip() or "listing_amenities"
    schema = (os.environ.get("LISTING_AMENITIES_TABLE_SCHEMA") or "").strip() or None
    qtable = _qualified_table(schema, table_name)

    print("propagate_amenity_embeddings_by_norm: connecting…", flush=True)
    conn = psycopg2.connect(
        _dsn(db_url),
        connect_timeout=120,
        options="-c application_name=propagate_amenity_embeddings_by_norm",
    )
    conn.autocommit = False
    cur = conn.cursor()
    cur.execute("SET lock_timeout = '0'")

    before = None
    if not args.skip_count:
        _set_statement_timeout(cur, args.discover_timeout_s)
        t0 = time.monotonic()
        cur.execute(
            f"""
            SELECT COUNT(*) FROM {qtable}
            WHERE amenity_embedding IS NULL
              AND amenity_text_norm IS NOT NULL
              AND LENGTH(TRIM(amenity_text_norm)) > 0
            """
        )
        before = cur.fetchone()[0]
        conn.commit()
        print(f"null_embedding_rows_before={before}  (count took {time.monotonic()-t0:.1f}s)", flush=True)

    print(f"table={qtable} model={model!r}", flush=True)
    print("phase=discover  fetching distinct norms (NULL embeddings)…", flush=True)
    _set_statement_timeout(cur, args.discover_timeout_s)
    t0 = time.monotonic()
    cur.execute(
        f"""
        SELECT amenity_text_norm
        FROM {qtable}
        WHERE amenity_embedding IS NULL
          AND amenity_text_norm IS NOT NULL
          AND LENGTH(TRIM(amenity_text_norm)) > 0
        GROUP BY amenity_text_norm
        """
    )
    pending_norms = {str(r[0]) for r in cur.fetchall() if r[0] is not None}
    conn.commit()
    print(f"  distinct_norms_pending={len(pending_norms)}  ({time.monotonic()-t0:.1f}s)", flush=True)

    print("phase=discover  fetching distinct norms (have donor embedding for model)…", flush=True)
    t0 = time.monotonic()
    cur.execute(
        f"""
        SELECT amenity_text_norm
        FROM {qtable}
        WHERE amenity_embedding IS NOT NULL
          AND amenity_embedding_model = %s
          AND amenity_text_norm IS NOT NULL
          AND LENGTH(TRIM(amenity_text_norm)) > 0
        GROUP BY amenity_text_norm
        """,
        (model,),
    )
    donor_norms = {str(r[0]) for r in cur.fetchall() if r[0] is not None}
    conn.commit()
    print(f"  distinct_norms_with_donor={len(donor_norms)}  ({time.monotonic()-t0:.1f}s)", flush=True)

    targets = sorted(pending_norms & donor_norms)
    print(f"phase=discover  norms_to_propagate={len(targets)}  (intersection)", flush=True)
    if not targets:
        print("Nothing to do (no NULL rows share a norm with an embedded row for this model).", flush=True)
        cur.close()
        conn.close()
        return 0

    update_sql = f"""
    UPDATE {qtable} AS la
    SET
      amenity_embedding = d.amenity_embedding,
      amenity_embedding_model = d.amenity_embedding_model,
      amenity_embedding_updated_at = NOW()
    FROM (
      SELECT DISTINCT ON (src.amenity_text_norm)
        src.amenity_text_norm,
        src.amenity_embedding,
        src.amenity_embedding_model
      FROM {qtable} AS src
      WHERE src.amenity_text_norm = ANY(%s)
        AND src.amenity_embedding IS NOT NULL
        AND src.amenity_embedding_model = %s
      ORDER BY src.amenity_text_norm, src.id
    ) AS d
    WHERE la.amenity_embedding IS NULL
      AND la.amenity_text_norm = d.amenity_text_norm
    """

    batch_size = max(1, int(args.batch_norms))
    total = 0
    n_batches = (len(targets) + batch_size - 1) // batch_size
    print(
        f"phase=update  {n_batches} batch(es) of up to {batch_size} norms…  "
        "(embedding_api_calls=0 every batch; SQL copy only)",
        flush=True,
    )
    _set_statement_timeout(cur, args.statement_timeout_s)

    for bi in range(n_batches):
        chunk = targets[bi * batch_size : (bi + 1) * batch_size]
        t_batch = time.monotonic()
        cur.execute(update_sql, (chunk, model))
        n = cur.rowcount
        conn.commit()
        total += n
        elapsed = time.monotonic() - t_batch
        print(
            f"batch {bi + 1}/{n_batches}  norms={len(chunk)}  rows_updated={n}  "
            f"cumulative_rows={total}  embedding_api_calls=0  ({elapsed:.1f}s)",
            flush=True,
        )

    _set_statement_timeout(cur, args.discover_timeout_s if args.discover_timeout_s > 0 else 120)
    cur.execute(
        f"""
        SELECT COUNT(*) FROM {qtable}
        WHERE amenity_embedding IS NULL
          AND amenity_text_norm IS NOT NULL
          AND LENGTH(TRIM(amenity_text_norm)) > 0
        """
    )
    after = cur.fetchone()[0]
    conn.commit()
    print(f"rows_updated_total={total}", flush=True)
    print("embedding_api_calls_total=0  (propagate never calls OpenAI/Azure)", flush=True)
    print(f"null_embedding_rows_after={after}", flush=True)
    if before is not None:
        print(f"null_rows_delta={before - after}", flush=True)
    if after > 0:
        print(
            "Note: remaining NULL rows need a donor with the same amenity_text_norm + model, "
            "or run scripts/backfill_listing_amenity_embeddings.py for novel norms.",
            flush=True,
        )
    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
