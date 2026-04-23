"""Seed `transit_stations` with NJ Transit rail stations and Hudson
County-area bus stops from OpenStreetMap via the Overpass API.

Two systems are populated:
- `nj_transit_rail` — all NJT rail stations statewide (~165)
- `nj_transit_bus` — bus stops inside a Hudson-Bergen bbox relevant to
  the JC commute. We only keep stops that are actually served by an
  NJ Transit `route=bus` relation (which carries the public route ref
  like "80", "119"), so the `lines` field contains the route numbers
  riders recognize, not OSM internal stop IDs.

  Opposite-direction stops at the same intersection share a name in
  OSM (e.g. two "JFK Blvd at Glenwood Ave" nodes); we collapse them
  into a single row whose `lines` is the union of routes serving
  either side. This lets us store a clean `station_name` without an
  ugly "(stop NNN)" suffix while still satisfying the
  (system, station_name) unique constraint.

No external auth required. The Overpass instance is rate-limited
(~10,000 queries/day across all users), which is plenty for a one-time
seed + occasional refresh.
"""
from __future__ import annotations

import os
import re
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

# Bus route relations within the same bbox. Each relation has a `ref`
# tag carrying the public route number (e.g. "80", "119") and member
# nodes (the bus stops it serves). Mapping member node → route refs
# gives us the real route lists for each stop, which the OSM `ref`
# tag on individual stop nodes does NOT (that's the stop ID).
BUS_ROUTES_QUERY = """
[out:json][timeout:90];
(
  rel["type"="route"]["route"="bus"]["network"~"NJ Transit",i](40.6400,-74.2700,40.8800,-74.0000);
);
out body;
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

    # ── Bus routes (gives us the public route refs per stop) ─────────
    print("fetching NJ Transit bus route relations from OSM…")
    route_elems = _run_overpass(BUS_ROUTES_QUERY, label="bus-routes")
    node_routes: dict[str, set[str]] = {}
    for rel in route_elems:
        if rel.get("type") != "relation":
            continue
        rtags = rel.get("tags") or {}
        ref = (rtags.get("ref") or "").strip()
        if not ref:
            # Some relations encode the route number only in `name`,
            # like "NJTB - 119 - Bayonne to NY". Pull the first number.
            m = re.search(r"\b(\d{1,4}[A-Z]?)\b", rtags.get("name") or "")
            if m:
                ref = m.group(1)
        if not ref:
            continue
        for member in rel.get("members") or []:
            if member.get("type") != "node":
                continue
            node_id = str(member.get("ref") or "")
            if node_id:
                node_routes.setdefault(node_id, set()).add(ref)
    print(
        f"  bus routes: {len(node_routes)} stop nodes covered by NJT route relations"
    )

    # ── Bus stops ────────────────────────────────────────────────────
    print("fetching Hudson-area bus stops from OSM…")
    bus_elems = _run_overpass(BUS_QUERY, label="bus")
    # First pass: collect all stops served by an NJT route, keyed by
    # (system, station_name). Opposite-direction stops at the same
    # intersection share a name in OSM — we collapse them so the row
    # carries the union of routes serving either side.
    by_name: dict[str, dict] = {}
    skipped_no_routes = 0
    for el in bus_elems:
        tags = el.get("tags") or {}
        lat = el.get("lat")
        lon = el.get("lon")
        if lat is None or lon is None:
            continue
        name = (tags.get("name") or "").strip()
        if not name:
            # No human-readable name -> not useful in the UI, skip.
            continue
        osm_id = str(el.get("id") or "")
        routes = sorted(node_routes.get(osm_id, set()))
        if not routes:
            # Stop is in our bbox but not on any NJT route relation
            # (could be NYC bus, school bus, decommissioned, etc.).
            skipped_no_routes += 1
            continue

        existing = by_name.get(name)
        if existing is None:
            by_name[name] = {
                "name": name,
                "lat": float(lat),
                "lng": float(lon),
                "lines": list(routes),
                "city": tags.get("addr:city"),
                "osm_id": osm_id,
            }
        else:
            existing["lines"] = sorted(set(existing["lines"]) | set(routes))
            # Keep the first stop's coords/osm_id; both sides of an
            # intersection are within ~30m — rendering one dot per
            # intersection is the cleaner UX anyway.
    bus_rows = list(by_name.values())
    print(
        f"  bus: {len(bus_rows)} unique stops with NJT routes "
        f"(skipped {skipped_no_routes} stops with no NJT route)"
    )

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

            # Bus: wipe existing rows first so stale entries (the old
            # "(stop NNN)" naming and OSM-stop-id `lines` data) don't
            # linger. The unique constraint is (system, station_name)
            # so rows with the old suffix would never collide with the
            # cleanly-named replacements.
            cur.execute(
                "DELETE FROM transit_stations WHERE system::text = 'nj_transit_bus';"
            )
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
