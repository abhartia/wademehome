"""Seed `transit_stations` with NJ Transit rail stations and Hudson
County-area bus stops from OpenStreetMap via the Overpass API.

Two systems are populated:
- `nj_transit_rail` — all NJT rail stations statewide (~165)
- `nj_transit_bus` — bus stops inside a Hudson-Bergen bbox relevant to
  the JC commute. We cannot take *every* NJT bus stop statewide
  (>18,000) without cluttering the map, so we bound to the densest
  commuter corridor that actually matters for renters browsing JC.

No external auth required. The Overpass instance is rate-limited
(~10,000 queries/day across all users), which is plenty for a one-time
seed + occasional refresh.
"""
from __future__ import annotations

import os
import sys
import time
import uuid

import psycopg2
import requests
from dotenv import load_dotenv


OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Rail: statewide NJ bbox (NJ: roughly 38.9,-75.6 to 41.4,-73.8)
RAIL_QUERY = """
[out:json][timeout:90];
(
  node["railway"="station"]["network"~"NJ Transit",i](38.9,-75.6,41.4,-73.8);
  node["railway"="station"]["operator"~"NJ Transit",i](38.9,-75.6,41.4,-73.8);
  node["railway"="station"]["network"~"NJT",i](38.9,-75.6,41.4,-73.8);
  node["railway"="halt"]["network"~"NJ Transit",i](38.9,-75.6,41.4,-73.8);
);
out tags center;
"""

# Bus: Hudson + eastern Bergen + Essex commuter corridors — the slice
# JC renters would use. Box corners cover Bayonne (south) through
# Fort Lee (north), Newark (west) through Weehawken (east).
BUS_QUERY = """
[out:json][timeout:90];
(
  node["highway"="bus_stop"](40.6400,-74.2700,40.8800,-74.0000);
);
out tags center;
"""

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


def _run_overpass(query: str, *, label: str) -> list[dict]:
    headers = {
        # Overpass rejects requests without a distinct User-Agent (406).
        "User-Agent": "wademehome-transit-seed/1.0 (bhartta@gmail.com)",
        "Accept": "application/json",
    }
    for attempt in range(3):
        try:
            r = requests.post(
                OVERPASS_URL,
                data={"data": query},
                headers=headers,
                timeout=180,
            )
            r.raise_for_status()
            return r.json().get("elements") or []
        except Exception as exc:
            print(f"[{label}] attempt {attempt + 1} failed: {exc}", file=sys.stderr)
            time.sleep(3 * (attempt + 1))
    return []


def _parse_lines(tags: dict) -> list[str]:
    """Rail: 'line' or 'route_ref' carries route names. Bus: 'route_ref'."""
    for key in ("route_ref", "line", "ref"):
        v = tags.get(key)
        if v:
            return [p.strip() for p in v.replace(";", ",").split(",") if p.strip()]
    return []


def _rail_city(tags: dict) -> str | None:
    return tags.get("addr:city") or tags.get("city")


def seed() -> int:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "api", ".env"))
    url = os.environ["DATABASE_URL"].replace("postgresql+psycopg2://", "postgresql://")

    # ── Rail ─────────────────────────────────────────────────────────
    print("fetching NJ Transit rail stations from OSM…")
    rail_elems = _run_overpass(RAIL_QUERY, label="rail")
    rail_by_name: dict[str, dict] = {}
    for el in rail_elems:
        tags = el.get("tags") or {}
        name = (tags.get("name") or "").strip()
        lat = el.get("lat") or (el.get("center") or {}).get("lat")
        lon = el.get("lon") or (el.get("center") or {}).get("lon")
        if not name or lat is None or lon is None:
            continue
        key = name
        prev = rail_by_name.get(key)
        if prev is None:
            rail_by_name[key] = {
                "name": name,
                "lat": float(lat),
                "lng": float(lon),
                "lines": _parse_lines(tags),
                "city": _rail_city(tags),
                "osm_id": str(el.get("id") or ""),
            }
        else:
            prev["lines"] = sorted({*prev["lines"], *_parse_lines(tags)})
    print(f"  rail: {len(rail_by_name)} deduped stations")

    # ── Bus ──────────────────────────────────────────────────────────
    print("fetching Hudson-area bus stops from OSM…")
    bus_elems = _run_overpass(BUS_QUERY, label="bus")
    bus_rows: list[dict] = []
    seen_bus_keys: set[str] = set()
    for el in bus_elems:
        tags = el.get("tags") or {}
        lat = el.get("lat")
        lon = el.get("lon")
        if lat is None or lon is None:
            continue
        name = (tags.get("name") or "").strip()
        ref = (tags.get("ref") or "").strip()
        if not name and not ref:
            continue
        if not name:
            name = f"Bus stop {ref}"
        osm_id = str(el.get("id") or "")
        # Disambiguate: many stops share names. Use OSM id in the unique
        # station_name so the (system, name) unique constraint holds.
        station_name = f"{name} (stop {osm_id})"
        key = station_name
        if key in seen_bus_keys:
            continue
        seen_bus_keys.add(key)
        bus_rows.append(
            {
                "name": station_name,
                "lat": float(lat),
                "lng": float(lon),
                "lines": _parse_lines(tags),
                "city": tags.get("addr:city"),
                "osm_id": osm_id,
            }
        )
    print(f"  bus: {len(bus_rows)} stops in Hudson-area bbox")

    # ── Upsert ───────────────────────────────────────────────────────
    with psycopg2.connect(url) as conn:
        with conn.cursor() as cur:
            # Rail
            rail_inserted = 0
            for rec in rail_by_name.values():
                cur.execute(
                    UPSERT_SQL,
                    (
                        str(uuid.uuid4()),
                        "nj_transit_rail",
                        rec["name"],
                        rec["lines"],
                        rec["lat"],
                        rec["lng"],
                        rec["city"],
                        "NJ",
                        None,
                        rec["osm_id"] or None,
                    ),
                )
                rail_inserted += 1

            # Bus
            bus_inserted = 0
            for rec in bus_rows:
                cur.execute(
                    UPSERT_SQL,
                    (
                        str(uuid.uuid4()),
                        "nj_transit_bus",
                        rec["name"],
                        rec["lines"],
                        rec["lat"],
                        rec["lng"],
                        rec["city"],
                        "NJ",
                        None,
                        rec["osm_id"] or None,
                    ),
                )
                bus_inserted += 1

            cur.execute(
                "SELECT system::text, COUNT(*) FROM transit_stations "
                "WHERE system::text IN ('nj_transit_rail','nj_transit_bus') "
                "GROUP BY 1"
            )
            counts = dict(cur.fetchall())
        conn.commit()

    print(
        f"upserted {rail_inserted} rail + {bus_inserted} bus rows · "
        f"totals now: nj_transit_rail={counts.get('nj_transit_rail', 0)}, "
        f"nj_transit_bus={counts.get('nj_transit_bus', 0)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(seed())
