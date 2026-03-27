#!/usr/bin/env python3
"""
Sync a single Greystar property against live __NEXT_DATA__ and tombstone missing units.

Why:
- Greystar loads are upsert-only by listing_id. When a unit disappears from the current site feed,
  the old row remains in Postgres unless we explicitly mark it unavailable.

What this does:
- Fetch property HTML
- Parse __NEXT_DATA__ -> PropertyDetailsFloorPlans.availableUnits
- Upsert those rows (company='Greystar', availability_status='available')
- Mark any other existing rows for (company='Greystar', property_id=...) whose listing_id is not in
  the current set as availability_status='unavailable'

Run (from repo root):
  cd api && uv run python ../scripts/sync_greystar_property_availability.py --url https://www.greystar.com/the-greyson-jersey-city/p_23045
"""

from __future__ import annotations

import argparse
import json
import os
import re
from datetime import datetime, timezone
from typing import Any

import requests
from dotenv import load_dotenv
from sqlalchemy import bindparam, create_engine, text


def _extract_next_data(html: str) -> dict[str, Any]:
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if not m:
        raise ValueError("__NEXT_DATA__ not found")
    return json.loads(m.group(1))


def _extract_floorplans_component(next_data: dict[str, Any]) -> dict[str, Any]:
    comp_props = next_data.get("props", {}).get("pageProps", {}).get("componentProps", {})
    if not isinstance(comp_props, dict):
        raise ValueError("componentProps missing/unexpected")
    for comp in comp_props.values():
        if not isinstance(comp, dict):
            continue
        if comp.get("componentName") == "PropertyDetailsFloorPlans":
            data = comp.get("data", {}) or {}
            if not isinstance(data, dict):
                raise ValueError("FloorPlans data missing/unexpected")
            return data
    raise ValueError("PropertyDetailsFloorPlans component not found")


def _extract_property_location(floorplans_data: dict[str, Any]) -> dict[str, Any]:
    loc = floorplans_data.get("propertyLocation") or {}
    return loc if isinstance(loc, dict) else {}


def _listing_id(prop_id: str, unit: dict[str, Any]) -> str:
    # Mirror greystar_scraper/flatten_units listing_id behavior (including _u{unitId}).
    floorplan = unit.get("floorplan") if isinstance(unit.get("floorplan"), dict) else {}
    beds = floorplan.get("bedroomCount")
    baths = floorplan.get("bathroomCount")
    sqft = unit.get("area")
    unit_num = unit.get("unitNumber")
    unit_id = unit.get("unitId")
    base = f"{prop_id}_{beds}_{baths}_{sqft}_{unit_num or 'NA'}"
    if unit_id is not None and str(unit_id).strip() != "":
        return f"{base}_u{unit_id}"
    return base


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True, help="Greystar property URL like .../p_23045")
    ap.add_argument("--env-file", default="api/.env", help="Path to api/.env (default: api/.env)")
    args = ap.parse_args()

    load_dotenv(args.env_file, override=True)
    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not db_url:
        raise SystemExit("DATABASE_URL missing")
    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or None
    qtable = f'"{schema}"."{table}"' if schema else f'"{table}"'

    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    html = requests.get(args.url, timeout=45).text
    next_data = _extract_next_data(html)
    data = _extract_floorplans_component(next_data)
    loc = _extract_property_location(data)
    units = data.get("availableUnits") or []
    if not isinstance(units, list):
        raise ValueError("availableUnits is not a list")
    prop_id = str(data.get("propertyId") or "").strip()
    prop_name = str(data.get("propertyName") or "").strip()
    if not prop_id:
        raise ValueError("propertyId missing")

    # Build rows to upsert.
    rows: list[dict[str, Any]] = []
    for u in units:
        if not isinstance(u, dict):
            continue
        lid = _listing_id(prop_id, u)
        floorplan = u.get("floorplan") if isinstance(u.get("floorplan"), dict) else {}
        rows.append(
            {
                "listing_id": lid,
                "property_id": prop_id,
                "property_name": prop_name or None,
                "unit_id": u.get("unitId"),
                "unit_name": u.get("unitNumber"),
                "floor_plan": u.get("floorPlanLabel") or floorplan.get("label"),
                "beds": floorplan.get("bedroomCount"),
                "baths": floorplan.get("bathroomCount"),
                "sqft": u.get("area"),
                "rent_price": u.get("minPrice"),
                "rent_max": u.get("maxPrice"),
                "available_at": u.get("availableOn"),
                "availability_status": "available",
                "listing_url": args.url,
                "company": "Greystar",
                "scraped_timestamp": scraped_at,
                "latitude": loc.get("latitude"),
                "longitude": loc.get("longitude"),
                "address": loc.get("address"),
                "city": (loc.get("city") or None),
                "state": (loc.get("state") or None),
                "zipcode": (loc.get("postalCode") or loc.get("zipcode") or None),
            }
        )

    listing_ids = [r["listing_id"] for r in rows]
    engine = create_engine(db_url)

    with engine.begin() as conn:
        # Upsert each row (small N: one property).
        for r in rows:
            cols = list(r.keys())
            cols_sql = ", ".join(f'"{c}"' for c in cols)
            vals_sql = ", ".join(f":{c}" for c in cols)
            update_cols = [c for c in cols if c != "listing_id"]
            set_sql = ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in update_cols)
            conn.execute(
                text(
                    f"INSERT INTO {qtable} ({cols_sql}) VALUES ({vals_sql}) "
                    f'ON CONFLICT ("listing_id") DO UPDATE SET {set_sql}'
                ),
                r,
            )

        # Tombstone anything else for this property_id.
        if listing_ids:
            stmt = text(
                f"""
UPDATE {qtable}
SET availability_status = 'unavailable'
WHERE company = 'Greystar'
  AND property_id = :pid
  AND listing_id NOT IN :ids
"""
            ).bindparams(bindparam("ids", expanding=True))
            conn.execute(stmt, {"pid": prop_id, "ids": listing_ids})
        else:
            conn.execute(
                text(
                    f"""
UPDATE {qtable}
SET availability_status = 'unavailable'
WHERE company = 'Greystar'
  AND property_id = :pid
"""
                ),
                {"pid": prop_id},
            )

    print(f"Synced Greystar property_id={prop_id} rows_now={len(rows)} url={args.url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

