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


def _pick(cols: set[str], *candidates: str) -> str | None:
    for c in candidates:
        if c.lower() in cols:
            return c.lower()
    return None


def main() -> int:
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

    geog_col = "geog" if "geog" in cols else None
    lat_col = _pick(cols, "latitude", "lat")
    lon_col = _pick(cols, "longitude", "lng", "lon")
    if not (geog_col and lat_col and lon_col):
        print("Missing geog/lat/lon columns; aborting.")
        return 1

    sql = f"""
    UPDATE {qtable}
    SET {geog_col} = CASE
        WHEN "{lat_col}" IS NOT NULL AND "{lon_col}" IS NOT NULL
        THEN ST_SetSRID(ST_MakePoint("{lon_col}"::double precision, "{lat_col}"::double precision), 4326)::geography
        ELSE NULL
    END
    """

    with engine.begin() as conn:
        print("Refreshing geog (latitude/longitude -> geography)...", flush=True)
        conn.execute(text(sql))

    print("geog refresh complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

