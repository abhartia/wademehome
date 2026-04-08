#!/usr/bin/env python3
"""
Load units.parquet into PostgreSQL as LISTINGS_TABLE_NAME (default: listings).

Reads api/.env for DATABASE_URL, LISTINGS_TABLE_NAME, LISTINGS_TABLE_SCHEMA.
Derives image_url (first URL) and images_urls (JSON array string) from the images JSON column.
Run Alembic migrations before loading if the DB uses managed columns (e.g. images_urls).

Usage (from repo root):
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --if-exists append
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --dry-run
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --fast-postgres
  ./api/.venv/bin/python scripts/load_listings_from_parquet.py --parquet env=local/.../units.parquet --fast-postgres --if-exists upsert

--fast-postgres uses batched INSERT (psycopg2 execute_values): much faster than pandas to_sql.
--if-exists upsert requires --fast-postgres; dedupes on listing_id and uses ON CONFLICT DO UPDATE.

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
    urls = all_image_urls_from_images_cell(images_value)
    return urls[0] if urls else None


def all_image_urls_from_images_cell(images_value) -> list[str]:
    """Parse Greystar `images` JSON (strings and/or {url, photoUrl, ...}); dedupe, preserve order."""
    if images_value is None:
        return []
    try:
        if pd.isna(images_value):
            return []
    except (ValueError, TypeError):
        pass
    if not isinstance(images_value, str) or not images_value.strip():
        return []
    try:
        arr = json.loads(images_value)
    except (json.JSONDecodeError, TypeError):
        return []
    if not isinstance(arr, list):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in arr:
        url: str | None = None
        if isinstance(item, str):
            s = item.strip()
            if s.startswith("http"):
                url = s
        elif isinstance(item, dict):
            for key in ("url", "photoUrl", "src", "imageUrl", "image_url"):
                v = item.get(key)
                if isinstance(v, str) and v.strip().startswith("http"):
                    url = v.strip()
                    break
        if url and url not in seen:
            seen.add(url)
            out.append(url)
    return out


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

    with engine.connect() as sa_conn:
        raw = sa_conn.connection.dbapi_connection
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


def _table_exists(engine, table_name: str, schema: str | None) -> bool:
    with engine.connect() as conn:
        if schema:
            return bool(
                conn.execute(
                    text(
                        """
                        SELECT EXISTS (
                          SELECT 1 FROM information_schema.tables
                          WHERE table_schema = :schema AND table_name = :tname
                        )
                        """
                    ),
                    {"schema": schema, "tname": table_name},
                ).scalar()
            )
        return bool(
            conn.execute(
                text(
                    """
                    SELECT EXISTS (
                      SELECT 1 FROM information_schema.tables
                      WHERE table_schema = 'public' AND table_name = :tname
                    )
                    """
                ),
                {"tname": table_name},
            ).scalar()
        )


def _get_table_columns(engine, table_name: str, schema: str | None) -> set[str]:
    schema_name = schema or "public"
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = :schema
                  AND table_name = :tname
                """
            ),
            {"schema": schema_name, "tname": table_name},
        )
        return {str(r[0]).lower() for r in rows}


def _refresh_search_columns(engine, table_name: str, schema: str | None) -> None:
    cols = _get_table_columns(engine, table_name, schema)
    if not cols:
        return

    qtable = f'"{schema}"."{table_name}"' if schema else f'"{table_name}"'

    def pick(*names: str) -> str | None:
        for n in names:
            if n.lower() in cols:
                return n.lower()
        return None

    lat_col = pick("latitude", "lat")
    lon_col = pick("longitude", "lng", "lon")
    search_doc_col = "search_doc" if "search_doc" in cols else None
    geog_col = "geog" if "geog" in cols else None
    if not search_doc_col and not geog_col:
        return

    search_parts: list[str] = []
    for name in (
        pick("property_name", "building_name", "name", "title"),
        pick("address", "street_address", "full_address", "formatted_address"),
        pick("city", "locality"),
        pick("state", "state_code", "region"),
        pick("zipcode", "zip", "postal_code"),
        pick("amenities", "community_amenities", "apartment_amenities", "building_amenities"),
        pick("description", "summary", "about"),
    ):
        if name:
            search_parts.append(f'COALESCE("{name}"::text, \'\')')

    with engine.begin() as conn:
        if geog_col and lat_col and lon_col:
            conn.execute(
                text(
                    f"""
                    UPDATE {qtable}
                    SET geog = ST_SetSRID(ST_MakePoint("{lon_col}"::double precision, "{lat_col}"::double precision), 4326)::geography
                    WHERE geog IS NULL
                      AND "{lat_col}" IS NOT NULL
                      AND "{lon_col}" IS NOT NULL
                    """
                )
            )
        if search_doc_col and search_parts:
            concat_sql = ", ".join(search_parts)
            conn.execute(
                text(
                    f"""
                    UPDATE {qtable}
                    SET search_doc = NULLIF(trim(concat_ws(' ', {concat_sql})), '')
                    WHERE search_doc IS NULL
                    """
                )
            )


def _dedupe_listing_ids_in_table(raw, *, qtable: str) -> int:
    """Remove duplicate listing_id rows, keep one row per listing_id (lowest ctid). Returns rows deleted."""
    cur = raw.cursor()
    cur.execute(
        f"""
        WITH ranked AS (
          SELECT ctid,
                 ROW_NUMBER() OVER (PARTITION BY listing_id ORDER BY ctid) AS rn
          FROM {qtable}
          WHERE listing_id IS NOT NULL
        )
        DELETE FROM {qtable} t
        USING ranked r
        WHERE t.ctid = r.ctid AND r.rn > 1
        """
    )
    deleted = cur.rowcount
    raw.commit()
    cur.close()
    return deleted


def _ensure_listing_id_unique_index(raw, *, qtable: str, table_name: str) -> None:
    """Create a unique index on listing_id if missing (required for upsert)."""
    cur = raw.cursor()
    idx_name = f"uq_{table_name}_listing_id"
    cur.execute(f'CREATE UNIQUE INDEX IF NOT EXISTS "{idx_name}" ON {qtable} ("listing_id")')
    raw.commit()
    cur.close()


def _load_via_execute_values_upsert(
    *,
    engine,
    df: pd.DataFrame,
    table_name: str,
    schema: str | None,
    dtype: dict,
    chunk_size: int,
) -> None:
    from psycopg2.extras import execute_values

    schema_kw = schema if schema else None
    qtable = f'"{schema}"."{table_name}"' if schema else f'"{table_name}"'

    if "listing_id" not in df.columns:
        raise SystemExit("upsert requires a listing_id column in the parquet")

    before = len(df)
    df = df.dropna(subset=["listing_id"])
    df = df.drop_duplicates(subset=["listing_id"], keep="last")
    dropped = before - len(df)
    if dropped:
        log(f"Deduped / dropped null listing_id: {dropped:,} rows removed, {len(df):,} remain")

    if not _table_exists(engine, table_name, schema):
        log(f"Table {qtable} missing; creating from parquet columns...")
        df.iloc[:0].to_sql(
            name=table_name,
            con=engine,
            schema=schema_kw,
            if_exists="replace",
            index=False,
            dtype=dtype,
        )
    else:
        # Filter parquet columns to only those present in the target table
        db_cols = _get_table_columns(engine, table_name, schema)
        if db_cols:
            extra = set(c.lower() for c in df.columns) - db_cols
            if extra:
                log(f"Dropping {len(extra)} columns not in target table: {sorted(extra)}")
                df = df.drop(columns=[c for c in df.columns if c.lower() in extra])

    cols_sql = ", ".join(f'"{c}"' for c in df.columns)
    update_cols = [c for c in df.columns if c != "listing_id"]
    if not update_cols:
        raise SystemExit("No columns to update besides listing_id")
    set_sql = ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
    insert_sql = (
        f"INSERT INTO {qtable} ({cols_sql}) VALUES %s "
        f'ON CONFLICT ("listing_id") DO UPDATE SET {set_sql}'
    )

    log("Converting rows for PostgreSQL upsert...")
    rows = dataframe_rows_for_psycopg2(df)

    # Use engine.connect() to get a pooled connection, then access underlying dbapi connection
    with engine.connect() as sa_conn:
        raw = sa_conn.connection.dbapi_connection
        try:
            try:
                _ensure_listing_id_unique_index(raw, qtable=qtable, table_name=table_name)
            except Exception as e:
                raw.rollback()
                err = str(e).lower()
                if "duplicate key" in err or "duplicated" in err or "unique" in err:
                    log("Existing table has duplicate listing_id values; deduping in DB (keep one row per listing_id)...")
                    n = _dedupe_listing_ids_in_table(raw, qtable=qtable)
                    log(f"  removed {n:,} duplicate rows")
                    _ensure_listing_id_unique_index(raw, qtable=qtable, table_name=table_name)
                else:
                    raise SystemExit(
                        f"Could not create unique index on listing_id: {e}"
                    ) from e
            cur = raw.cursor()
            total = len(rows)
            for i in range(0, total, chunk_size):
                batch = rows[i : i + chunk_size]
                execute_values(cur, insert_sql, batch, page_size=len(batch))
                log(f"  upserted {min(i + chunk_size, total):,} / {total:,}")
            raw.commit()
            cur.close()
        except SystemExit:
            raise
        except Exception:
            raw.rollback()
            raise


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument(
        "--if-exists",
        choices=("replace", "append", "fail", "upsert"),
        default="replace",
        help="replace|append|fail|upsert (upsert needs --fast-postgres, key listing_id)",
    )
    parser.add_argument(
        "--parquet",
        type=Path,
        default=UNITS_PARQUET,
        help=f"path to units.parquet (default: {UNITS_PARQUET})",
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

    parquet_path = args.parquet.resolve()
    if not parquet_path.exists():
        log(f"ERROR: parquet not found: {parquet_path}")
        return 1

    if args.if_exists == "upsert" and not args.fast_postgres:
        log("ERROR: --if-exists upsert requires --fast-postgres")
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

    log("Reading parquet: " + str(parquet_path))
    df = pd.read_parquet(str(parquet_path))
    log(f"Loaded rows: {len(df):,}")
    log(f"Columns: {len(df.columns)}")

    if "images" in df.columns:
        df["image_url"] = df["images"].apply(first_image_url)
        def _images_urls_json(cell) -> str | None:
            urls = all_image_urls_from_images_cell(cell)
            return json.dumps(urls) if urls else None

        df["images_urls"] = df["images"].apply(_images_urls_json)
    else:
        df["image_url"] = None
        df["images_urls"] = None
        log("No images column; image_url and images_urls set to null")
    with_img = int(df["image_url"].notna().sum())
    log(f"Rows with derived image_url: {with_img:,}")
    with_many = int(df["images_urls"].notna().sum()) if "images_urls" in df.columns else 0
    log(f"Rows with images_urls JSON: {with_many:,}")

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
        if args.if_exists == "upsert":
            _load_via_execute_values_upsert(
                engine=engine,
                df=df,
                table_name=table_name,
                schema=schema,
                dtype=dtype,
                chunk_size=max(100, args.chunk_size),
            )
        else:
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

    _refresh_search_columns(engine, table_name, schema)

    log(f"Rows now in DB: {count:,}")
    log("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
