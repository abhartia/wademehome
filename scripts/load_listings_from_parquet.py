#!/usr/bin/env python3
"""
Load units.parquet into PostgreSQL as LISTINGS_TABLE_NAME (default: listings).

Reads api/.env for DATABASE_URL, LISTINGS_TABLE_NAME, LISTINGS_TABLE_SCHEMA.
Derives image_url from the images JSON column for text-to-SQL prompts.

Usage (from repo root):
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --if-exists append
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --dry-run
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --fast-postgres

--fast-postgres uses batched INSERT (psycopg2 execute_values): much faster than pandas to_sql.

Requires: pandas, pyarrow, sqlalchemy, python-dotenv, psycopg2-binary (in api venv).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pandas.api.types import is_object_dtype
from sqlalchemy import Float, Text, create_engine, text

REPO_ROOT = Path(__file__).resolve().parent.parent
UNITS_PARQUET = REPO_ROOT / "data" / "stage=processed" / "units.parquet"
ENV_FILE = REPO_ROOT / "api" / ".env"


def log(msg: str) -> None:
    print(msg, flush=True)


def cell_for_psycopg2(v):
    """
    Convert pandas/numpy missing values and scalars to types psycopg2 can bind.
    Fixes: psycopg2.ProgrammingError: can't adapt type 'NAType'
    """
    if v is None:
        return None
    # pd.NA (nullable integer/string dtypes, etc.)
    if v is pd.NA:
        return None
    try:
        if pd.isna(v):
            return None
    except (ValueError, TypeError):
        pass
    if isinstance(v, (np.floating, float)):
        if np.isnan(v):
            return None
        return float(v)
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, np.bool_):
        return bool(v)
    if isinstance(v, bytes):
        return v.decode("utf-8", errors="replace")
    return v


def dataframe_rows_for_psycopg2(df: pd.DataFrame) -> list[tuple]:
    """Build tuples from a DataFrame; every cell is psycopg2-safe."""
    out = []
    for row in df.itertuples(index=False, name=None):
        out.append(tuple(cell_for_psycopg2(v) for v in row))
    return out


def _engine_kwargs(database_url: str) -> dict:
    """Optional connect_args for common drivers."""
    kwargs: dict = {"future": True}
    if database_url.startswith("postgresql"):
        # psycopg2
        kwargs["connect_args"] = {"connect_timeout": int(os.environ.get("DB_CONNECT_TIMEOUT", "60"))}
    return kwargs


def first_image_url(images_value) -> str | None:
    if images_value is None:
        return None
    if pd.isna(images_value):
        return None
    if not isinstance(images_value, str) or not images_value.strip():
        return None
    try:
        arr = json.loads(images_value)
    except (json.JSONDecodeError, TypeError):
        return None
    if isinstance(arr, list) and arr:
        first = arr[0]
        if isinstance(first, dict):
            return first.get("url")
        if isinstance(first, str):
            return first
    return None


def _build_dtype(df: pd.DataFrame) -> dict:
    dtype = {}
    for col, s in df.dtypes.items():
        if is_object_dtype(s):
            dtype[col] = Text()
        elif str(s).startswith("float"):
            dtype[col] = Float()
    return dtype


def _load_via_execute_values(
    *,
    engine,
    df: pd.DataFrame,
    table_name: str,
    schema: str | None,
    dtype: dict,
    if_exists: str,
    chunk_size: int,
) -> None:
    """PostgreSQL-only bulk path using psycopg2.extras.execute_values."""
    from psycopg2.extras import execute_values

    schema_kw = schema if schema else None
    qtable = f'"{schema}"."{table_name}"' if schema else f'"{table_name}"'

    if if_exists == "replace":
        log(f"Fast path: creating empty table {qtable} (replace)...")
        df.iloc[:0].to_sql(
            name=table_name,
            con=engine,
            schema=schema_kw,
            if_exists="replace",
            index=False,
            dtype=dtype,
        )
    elif if_exists == "fail":
        with engine.connect() as conn:
            if schema:
                exists = conn.execute(
                    text(
                        """
                        SELECT EXISTS (
                          SELECT 1 FROM information_schema.tables
                          WHERE table_schema = :schema
                            AND table_name = :tname
                        )
                        """
                    ),
                    {"schema": schema, "tname": table_name},
                ).scalar()
            else:
                exists = conn.execute(
                    text(
                        """
                        SELECT EXISTS (
                          SELECT 1 FROM information_schema.tables
                          WHERE table_schema = 'public'
                            AND table_name = :tname
                        )
                        """
                    ),
                    {"tname": table_name},
                ).scalar()
        if exists:
            raise SystemExit(f'Table already exists: {qtable} (use --if-exists replace or append)')
        log(f"Fast path: creating empty table {qtable} (fail)...")
        df.iloc[:0].to_sql(
            name=table_name,
            con=engine,
            schema=schema_kw,
            if_exists="replace",
            index=False,
            dtype=dtype,
        )
    elif if_exists == "append":
        log(f"Fast path: appending into {qtable} (table must already exist)...")

    cols_sql = ", ".join(f'"{c}"' for c in df.columns)
    insert_sql = f"INSERT INTO {qtable} ({cols_sql}) VALUES %s"

    log("Converting rows for PostgreSQL driver...")
    rows = dataframe_rows_for_psycopg2(df)

    raw = engine.raw_connection()
    try:
        cur = raw.cursor()
        total = len(rows)
        for i in range(0, total, chunk_size):
            batch = rows[i : i + chunk_size]
            execute_values(cur, insert_sql, batch, page_size=len(batch))
            log(f"  inserted {min(i + chunk_size, total):,} / {total:,}")
        raw.commit()
        cur.close()
    except Exception:
        raw.rollback()
        raise
    finally:
        raw.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument(
        "--if-exists",
        choices=("replace", "append", "fail"),
        default="replace",
        help="pandas.DataFrame.to_sql if_exists (default: replace)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Read parquet and print stats only; do not connect or write",
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=ENV_FILE,
        help=f"path to .env (default: {ENV_FILE})",
    )
    parser.add_argument(
        "--fast-postgres",
        action="store_true",
        help="Use batched INSERT for PostgreSQL (requires postgresql* DATABASE_URL)",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=3000,
        help="Rows per batch when using --fast-postgres (default: 3000)",
    )
    args = parser.parse_args()

    if not args.env_file.exists():
        log(f"ERROR: .env not found: {args.env_file}")
        return 1

    if not UNITS_PARQUET.exists():
        log(f"ERROR: parquet not found: {UNITS_PARQUET}")
        return 1

    load_dotenv(args.env_file, override=True)

    database_url = os.environ.get("DATABASE_URL", "").strip()
    if not database_url:
        log("ERROR: DATABASE_URL missing in .env")
        return 1

    table_name = os.environ.get("LISTINGS_TABLE_NAME", "listings").strip() or "listings"
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")
    if schema:
        schema = schema.strip() or None

    log("Reading parquet: " + str(UNITS_PARQUET))
    df = pd.read_parquet(str(UNITS_PARQUET))
    log(f"Loaded rows: {len(df):,}")
    log(f"Columns: {len(df.columns)}")

    df["image_url"] = df["images"].apply(first_image_url)
    with_img = int(df["image_url"].notna().sum())
    log(f"Rows with derived image_url: {with_img:,}")

    if args.dry_run:
        log("Dry run: skipping DB write.")
        return 0

    dtype = _build_dtype(df)
    engine = create_engine(database_url, **_engine_kwargs(database_url))
    schema_kw = schema if schema else None

    qual = f'"{schema}".' if schema else ""
    log(f'Writing to {qual}"{table_name}" (if_exists={args.if_exists}) ...')

    if args.fast_postgres:
        if not database_url.startswith("postgresql"):
            log("ERROR: --fast-postgres only works when DATABASE_URL starts with postgresql")
            return 1
        _load_via_execute_values(
            engine=engine,
            df=df,
            table_name=table_name,
            schema=schema,
            dtype=dtype,
            if_exists=args.if_exists,
            chunk_size=max(100, args.chunk_size),
        )
    else:
        df.to_sql(
            name=table_name,
            con=engine,
            schema=schema_kw,
            if_exists=args.if_exists,
            index=False,
            dtype=dtype,
            chunksize=2000,
            method="multi",
        )

    if schema:
        q = text(f'SELECT COUNT(*) FROM "{schema}"."{table_name}"')
    else:
        q = text(f'SELECT COUNT(*) FROM "{table_name}"')

    with engine.connect() as conn:
        count = conn.execute(q).scalar()

    log(f"Rows now in DB: {count:,}")
    log("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
