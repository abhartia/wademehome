"""Seed the `transit_stations` table with PATH, HBLR, and ferry stops.

Coordinates are from public station geometry (PATH: NJ Transit GTFS; HBLR:
NJ Transit GTFS; Ferry: NY Waterway published landings). Rerunnable —
uses INSERT ... ON CONFLICT DO UPDATE so rows can be refreshed by name
edits or coordinate corrections without duplicating.
"""
from __future__ import annotations

import os
import sys
import uuid

import psycopg2
from dotenv import load_dotenv


# (system, station_name, lines, lat, lng, city, state, borough)
STATIONS: list[tuple[str, str, list[str], float, float, str, str, str | None]] = [
    # ── PATH (13 stations) ─────────────────────────────────────────
    ("path", "Newark Penn Station", ["NWK-WTC"], 40.7342, -74.1643, "Newark", "NJ", None),
    ("path", "Harrison", ["NWK-WTC"], 40.7390, -74.1560, "Harrison", "NJ", None),
    ("path", "Journal Square", ["NWK-WTC", "JSQ-33"], 40.7328, -74.0625, "Jersey City", "NJ", None),
    ("path", "Grove Street", ["NWK-WTC", "HOB-WTC"], 40.7197, -74.0434, "Jersey City", "NJ", None),
    ("path", "Exchange Place", ["NWK-WTC", "HOB-WTC"], 40.7163, -74.0334, "Jersey City", "NJ", None),
    ("path", "Newport", ["HOB-33", "JSQ-33"], 40.7270, -74.0338, "Jersey City", "NJ", None),
    ("path", "Hoboken", ["HOB-WTC", "HOB-33"], 40.7354, -74.0290, "Hoboken", "NJ", None),
    ("path", "Christopher Street", ["HOB-WTC"], 40.7339, -74.0067, "New York", "NY", "Manhattan"),
    ("path", "9th Street", ["HOB-33", "JSQ-33"], 40.7344, -73.9998, "New York", "NY", "Manhattan"),
    ("path", "14th Street", ["HOB-33", "JSQ-33"], 40.7377, -73.9997, "New York", "NY", "Manhattan"),
    ("path", "23rd Street", ["HOB-33", "JSQ-33"], 40.7428, -73.9927, "New York", "NY", "Manhattan"),
    ("path", "33rd Street", ["HOB-33", "JSQ-33"], 40.7494, -73.9880, "New York", "NY", "Manhattan"),
    ("path", "World Trade Center", ["NWK-WTC", "HOB-WTC"], 40.7126, -74.0099, "New York", "NY", "Manhattan"),

    # ── Hudson-Bergen Light Rail (23 stations) ─────────────────────
    ("hblr", "Tonnelle Avenue", ["HBLR"], 40.7725, -74.0386, "North Bergen", "NJ", None),
    ("hblr", "Bergenline Avenue", ["HBLR"], 40.7679, -74.0295, "Union City", "NJ", None),
    ("hblr", "Port Imperial", ["HBLR"], 40.7723, -74.0133, "Weehawken", "NJ", None),
    ("hblr", "Lincoln Harbor", ["HBLR"], 40.7594, -74.0244, "Weehawken", "NJ", None),
    ("hblr", "9th Street - Congress Street", ["HBLR"], 40.7468, -74.0321, "Hoboken", "NJ", None),
    ("hblr", "2nd Street", ["HBLR"], 40.7360, -74.0284, "Hoboken", "NJ", None),
    ("hblr", "Hoboken Terminal", ["HBLR"], 40.7353, -74.0275, "Hoboken", "NJ", None),
    ("hblr", "Newport", ["HBLR"], 40.7272, -74.0338, "Jersey City", "NJ", None),
    ("hblr", "Harborside", ["HBLR"], 40.7191, -74.0345, "Jersey City", "NJ", None),
    ("hblr", "Exchange Place", ["HBLR"], 40.7163, -74.0334, "Jersey City", "NJ", None),
    ("hblr", "Essex Street", ["HBLR"], 40.7120, -74.0360, "Jersey City", "NJ", None),
    ("hblr", "Marin Boulevard", ["HBLR"], 40.7142, -74.0393, "Jersey City", "NJ", None),
    ("hblr", "Jersey Avenue", ["HBLR"], 40.7148, -74.0486, "Jersey City", "NJ", None),
    ("hblr", "Liberty State Park", ["HBLR"], 40.7082, -74.0549, "Jersey City", "NJ", None),
    ("hblr", "Garfield Avenue", ["HBLR"], 40.7028, -74.0780, "Jersey City", "NJ", None),
    ("hblr", "Martin Luther King Drive", ["HBLR"], 40.6987, -74.0816, "Jersey City", "NJ", None),
    ("hblr", "West Side Avenue", ["HBLR"], 40.7113, -74.0858, "Jersey City", "NJ", None),
    ("hblr", "Richard Street", ["HBLR"], 40.6856, -74.1017, "Bayonne", "NJ", None),
    ("hblr", "34th Street", ["HBLR"], 40.6787, -74.1075, "Bayonne", "NJ", None),
    ("hblr", "45th Street", ["HBLR"], 40.6702, -74.1136, "Bayonne", "NJ", None),
    ("hblr", "22nd Street", ["HBLR"], 40.6858, -74.1002, "Bayonne", "NJ", None),
    ("hblr", "8th Street", ["HBLR"], 40.6576, -74.1211, "Bayonne", "NJ", None),
    ("hblr", "Danforth Avenue", ["HBLR"], 40.6887, -74.0901, "Jersey City", "NJ", None),

    # ── NY Waterway ferries (Hudson County-relevant) ───────────────
    ("ferry", "Paulus Hook Ferry", ["NYW"], 40.7155, -74.0318, "Jersey City", "NJ", None),
    ("ferry", "Harborside Ferry", ["NYW"], 40.7191, -74.0340, "Jersey City", "NJ", None),
    ("ferry", "Newport Ferry", ["NYW"], 40.7291, -74.0331, "Jersey City", "NJ", None),
    ("ferry", "Hoboken 14th Street Ferry", ["NYW"], 40.7480, -74.0280, "Hoboken", "NJ", None),
    ("ferry", "Hoboken Terminal Ferry", ["NYW"], 40.7353, -74.0275, "Hoboken", "NJ", None),
    ("ferry", "Lincoln Harbor Ferry", ["NYW"], 40.7593, -74.0245, "Weehawken", "NJ", None),
    ("ferry", "Port Imperial Ferry", ["NYW"], 40.7722, -74.0133, "Weehawken", "NJ", None),
    ("ferry", "Brookfield Place Ferry", ["NYW"], 40.7131, -74.0158, "New York", "NY", "Manhattan"),
    ("ferry", "Pier 11 / Wall Street Ferry", ["NYW"], 40.7033, -74.0084, "New York", "NY", "Manhattan"),
    ("ferry", "Midtown / W 39th Street Ferry", ["NYW"], 40.7605, -74.0024, "New York", "NY", "Manhattan"),
]


UPSERT_SQL = """
INSERT INTO transit_stations
    (id, system, station_name, lines, latitude, longitude, city, state, borough, created_at, updated_at)
VALUES (%s, %s::transit_system, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
ON CONFLICT (system, station_name) DO UPDATE SET
    lines      = EXCLUDED.lines,
    latitude   = EXCLUDED.latitude,
    longitude  = EXCLUDED.longitude,
    city       = EXCLUDED.city,
    state      = EXCLUDED.state,
    borough    = EXCLUDED.borough,
    updated_at = NOW();
"""


def main() -> int:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "api", ".env"))
    url = os.environ["DATABASE_URL"].replace("postgresql+psycopg2://", "postgresql://")
    inserted = 0
    with psycopg2.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM transit_stations;")
            before = cur.fetchone()[0]
            for system, name, lines, lat, lng, city, state, borough in STATIONS:
                cur.execute(
                    UPSERT_SQL,
                    (str(uuid.uuid4()), system, name, lines, lat, lng, city, state, borough),
                )
                inserted += 1
            cur.execute("SELECT COUNT(*) FROM transit_stations;")
            after = cur.fetchone()[0]
        conn.commit()
    print(f"transit_stations: {before} → {after} (upserted {inserted})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
