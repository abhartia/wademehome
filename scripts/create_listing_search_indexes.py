#!/usr/bin/env python3
from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"


def _qtable(schema: Optional[str], table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


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


def _exists(engine, sql: str) -> bool:
    with engine.connect() as conn:
        v = conn.execute(text(sql)).scalar()
    return bool(v)


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Create listings search indexes (geo/vector)")
    parser.add_argument("--with-geo", action="store_true", help="Also create geog GiST index (can be expensive)")
    args = parser.parse_args()

    if not ENV_FILE.exists():
        raise RuntimeError(f"Missing env file: {ENV_FILE}")

    load_dotenv(ENV_FILE, override=True)
    database_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL missing in api/.env")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or "public"
    qtable = _qtable(schema, table)

    engine = create_engine(database_url, future=True)
    cols = _table_columns(engine, schema, table)

    # These names intentionally match the alembic revision for easier ops.
    geog_idx = f"ix_{table}_geog_gist"
    embed_idx = f"ix_{table}_embedding_hnsw"

    if "geog" in cols and not _exists(
        engine,
        f"SELECT 1 FROM pg_indexes WHERE schemaname = '{schema}' AND indexname = '{geog_idx}'",
    ):
        if args.with_geo:
            print(f"Creating geo index {geog_idx} ...", flush=True)
            with engine.begin() as conn:
                conn.execute(text(f'CREATE INDEX {geog_idx} ON {qtable} USING GIST (geog)'))
        else:
            print(f"Skipping geo index {geog_idx} (pass --with-geo to create).", flush=True)

    if "embedding" in cols and not _exists(
        engine,
        f"SELECT 1 FROM pg_indexes WHERE schemaname = '{schema}' AND indexname = '{embed_idx}'",
    ):
        print(f"Creating vector index {embed_idx} ...", flush=True)
        with engine.begin() as conn:
            conn.execute(
                text(
                    f'CREATE INDEX {embed_idx} ON {qtable} USING hnsw (embedding vector_cosine_ops)'
                )
            )

    print("Index creation complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

