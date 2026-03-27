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


def _refresh(engine, schema: str, table: str) -> None:
    cols = _table_columns(engine, schema, table)
    if not cols:
        print("No columns found; aborting.")
        return

    qtable = _qtable(schema, table)

    lat_col = _pick(cols, "latitude", "lat")
    lon_col = _pick(cols, "longitude", "lng", "lon")
    geog_col = "geog" if "geog" in cols else None
    search_doc_col = "search_doc" if "search_doc" in cols else None

    updates: list[str] = []

    if geog_col and lat_col and lon_col:
        updates.append(
            f"""
            geog = CASE
                WHEN "{lat_col}" IS NOT NULL AND "{lon_col}" IS NOT NULL
                THEN ST_SetSRID(ST_MakePoint("{lon_col}"::double precision, "{lat_col}"::double precision), 4326)::geography
                ELSE NULL
            END
            """
        )

    if search_doc_col:
        def pick_sql(*names: str) -> str | None:
            n = _pick(cols, *names)
            return n

        search_parts: list[str] = []
        for name in (
            pick_sql("property_name", "building_name", "name", "title"),
            pick_sql("address", "street_address", "full_address", "formatted_address"),
            pick_sql("city", "locality"),
            pick_sql("state", "state_code", "region"),
            pick_sql("zipcode", "zip", "postal_code"),
            pick_sql("amenities", "community_amenities", "apartment_amenities", "building_amenities"),
            pick_sql("description", "summary", "about"),
        ):
            if name:
                search_parts.append(f'COALESCE("{name}"::text, \'\' )')

        if search_parts:
            concat_sql = ", ".join(search_parts)
            updates.append(
                f"""
                search_doc = NULLIF(trim(concat_ws(' ', {concat_sql})), '')
                """
            )

    if not updates:
        print("No geog/search_doc updates applicable (missing columns).")
        return

    set_sql = ",\n".join(updates)
    print("Refreshing geog/search_doc...")
    with engine.begin() as conn:
        conn.execute(text(f"UPDATE {qtable} SET {set_sql}"))


def main() -> int:
    parser_env = ENV_FILE
    if not parser_env.exists():
        raise RuntimeError(f"Missing env file: {parser_env}")

    load_dotenv(parser_env, override=True)
    database_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL missing in api/.env")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or "public"

    engine = create_engine(database_url, future=True)
    _refresh(engine, schema, table)
    print("Refresh complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

