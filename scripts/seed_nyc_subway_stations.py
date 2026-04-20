"""Fetch MTA subway stations from NY State OpenData (39hk-dx4f) and upsert
into `transit_stations`.

The dataset has one row per station (with gtfs_stop_id). Each station has
`stop_name`, `daytime_routes` (space-separated route letters/numbers),
`gtfs_latitude` + `gtfs_longitude`, and `borough` (1-letter code).

We dedupe by `stop_name` because the dataset emits two rows per complex
(one per platform direction) for most stations — we want one row per
complex.
"""
from __future__ import annotations

import os
import sys
import uuid

import psycopg2
import requests
from dotenv import load_dotenv


DATASET_URL = "https://data.ny.gov/resource/39hk-dx4f.json"

BOROUGH_CODES = {
    "M": "Manhattan",
    "Bk": "Brooklyn",
    "Bx": "Bronx",
    "Q": "Queens",
    "SI": "Staten Island",
}

UPSERT_SQL = """
INSERT INTO transit_stations
    (id, system, station_name, lines, latitude, longitude, city, state, borough, external_id, created_at, updated_at)
VALUES (%s, %s::transit_system, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
ON CONFLICT (system, station_name) DO UPDATE SET
    lines       = EXCLUDED.lines,
    latitude    = EXCLUDED.latitude,
    longitude   = EXCLUDED.longitude,
    city        = EXCLUDED.city,
    state       = EXCLUDED.state,
    borough     = EXCLUDED.borough,
    external_id = EXCLUDED.external_id,
    updated_at  = NOW();
"""


def _parse_lines(raw: str | None) -> list[str]:
    if not raw:
        return []
    # source uses space-separated "N Q R W" or comma-separated in some rows
    cleaned = raw.replace(",", " ").split()
    return [c for c in (s.strip() for s in cleaned) if c]


def main() -> int:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "api", ".env"))
    url = os.environ["DATABASE_URL"].replace("postgresql+psycopg2://", "postgresql://")

    app_token = os.environ.get("SOCRATA_APP_TOKEN")
    headers = {"X-App-Token": app_token} if app_token else {}

    resp = requests.get(
        DATASET_URL,
        params={"$limit": "2000"},
        headers=headers,
        timeout=60,
    )
    resp.raise_for_status()
    rows = resp.json()
    print(f"fetched {len(rows)} subway station rows")

    seen_names: dict[str, dict] = {}
    for r in rows:
        name = (r.get("stop_name") or "").strip()
        lat_raw = r.get("gtfs_latitude")
        lng_raw = r.get("gtfs_longitude")
        if not name or not lat_raw or not lng_raw:
            continue
        try:
            lat = float(lat_raw)
            lng = float(lng_raw)
        except (TypeError, ValueError):
            continue
        lines = _parse_lines(r.get("daytime_routes"))
        complex_id = str(r.get("complex_id") or "")
        borough = BOROUGH_CODES.get((r.get("borough") or "").strip())

        # Dedupe by complex_id (same physical station, multiple platform
        # rows in the source). Fall back to name|borough if complex_id is
        # missing so we still dedupe.
        key = complex_id if complex_id else f"{name}|{borough or ''}"
        prev = seen_names.get(key)
        if prev is None:
            seen_names[key] = {
                "name": name,
                "lines": lines,
                "lat": lat,
                "lng": lng,
                "borough": borough,
                "complex_id": complex_id,
            }
        else:
            prev["lines"] = sorted({*prev["lines"], *lines})

    # `transit_stations` has a UNIQUE (system, station_name) constraint, but the
    # MTA dataset has ~30 station names shared across lines/boroughs (e.g.
    # "86 St" appears on the 1, 4/5/6, N/Q/R, and Q lines). Disambiguate by
    # appending the first line letter + borough abbreviation when a name collides.
    name_to_keys: dict[str, list[str]] = {}
    for key, rec in seen_names.items():
        name_to_keys.setdefault(rec["name"], []).append(key)
    borough_abbr = {
        "Manhattan": "M",
        "Brooklyn": "Bk",
        "Bronx": "Bx",
        "Queens": "Q",
        "Staten Island": "SI",
    }
    for name, keys in name_to_keys.items():
        if len(keys) <= 1:
            continue
        for key in keys:
            rec = seen_names[key]
            first_line = rec["lines"][0] if rec["lines"] else ""
            bb = borough_abbr.get(rec["borough"] or "", "")
            parts = [name]
            if first_line:
                parts.append(f"({first_line})")
            if bb:
                parts.append(f"[{bb}]")
            rec["name"] = " ".join(parts)

    inserted = 0
    with psycopg2.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT COUNT(*) FROM transit_stations WHERE system::text = 'nyc_subway';"
            )
            before = cur.fetchone()[0]
            for key, rec in seen_names.items():
                cur.execute(
                    UPSERT_SQL,
                    (
                        str(uuid.uuid4()),
                        "nyc_subway",
                        rec["name"],
                        rec["lines"],
                        rec["lat"],
                        rec["lng"],
                        "New York",
                        "NY",
                        rec["borough"],
                        rec["complex_id"] or None,
                    ),
                )
                inserted += 1
            cur.execute(
                "SELECT COUNT(*) FROM transit_stations WHERE system::text = 'nyc_subway';"
            )
            after = cur.fetchone()[0]
        conn.commit()
    print(f"nyc_subway rows: {before} → {after} (upserted {inserted})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
