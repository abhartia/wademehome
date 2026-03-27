#!/usr/bin/env python3
"""
Backfill required location columns in Postgres listings table:
  address, city, state, zipcode, latitude, longitude

Strategy (real data, no placeholders):
1) Copy from best donor row per (company, property_id) when possible.
2) For remaining rows:
   - If address/city/state/zip present but lat/lng missing: geocode via Mapbox forward geocode.
   - If address missing but listing_url present: fetch page HTML and extract a mailing-style address string,
     then parse city/state/zip, then geocode.

Run:
  cd api && uv run python ../scripts/backfill_listing_locations.py --env-file .env
"""

from __future__ import annotations

import argparse
import os
import re
from dataclasses import dataclass
from typing import Any

import requests
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

from listings.mapbox_client import forward_geocode


_ADDR_RE = re.compile(
    r"(\\d{2,6}\\s+[A-Za-z0-9#\\.\\-\\s]{3,80}?"
    r"(?:Street|St\\.|Avenue|Ave\\.|Road|Rd\\.|Boulevard|Blvd\\.|Drive|Dr\\.|Lane|Ln\\.|Way)\\b"
    r"[^\\n<]{0,80}?\\b([A-Za-z\\s\\-]{2,40}),\\s*([A-Z]{2})\\s*(\\d{5})\\b)",
    re.IGNORECASE,
)


@dataclass
class ParsedAddress:
    address: str
    city: str
    state: str
    zipcode: str


def parse_address_from_html(html: str) -> ParsedAddress | None:
    raw = html or ""
    # Common pattern: "Street<br/>City, ST ZIP"
    normalized = raw.replace("<br/>", " ").replace("<br>", " ").replace("<br />", " ")
    m = _ADDR_RE.search(normalized)
    if not m:
        return None
    full = m.group(0).strip()
    city = (m.group(1) or "").strip()
    state = (m.group(2) or "").strip().upper()
    zipcode = (m.group(3) or "").strip()
    # Split street vs city/state/zip heuristically (keep it simple).
    street = full
    # Remove trailing city/state/zip from street portion.
    tail = f"{city}, {state} {zipcode}"
    if tail in street:
        street = street.split(tail)[0].strip().rstrip(",")
    return ParsedAddress(address=street, city=city, state=state, zipcode=zipcode)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--env-file", default="api/.env")
    ap.add_argument("--limit", type=int, default=5000, help="Max rows to attempt in one run (safety).")
    args = ap.parse_args()

    load_dotenv(args.env_file, override=True)
    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    token = (os.environ.get("MAPBOX_ACCESS_TOKEN") or "").strip()
    if not db_url:
        raise SystemExit("DATABASE_URL missing")
    if not token:
        raise SystemExit("MAPBOX_ACCESS_TOKEN missing (needed to geocode)")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or None
    qtable = f'"{schema}"."{table}"' if schema else f'"{table}"'

    engine = create_engine(db_url)

    filled_from_donors = 0
    geocoded = 0
    url_parsed = 0

    with engine.begin() as conn:
        # 1) donor copy
        filled_from_donors = conn.execute(
            text(
                f"""
WITH donors AS (
  SELECT
    company,
    property_id,
    address,
    city,
    state,
    zipcode,
    latitude,
    longitude,
    ROW_NUMBER() OVER (
      PARTITION BY company, property_id
      ORDER BY
        (latitude IS NOT NULL AND longitude IS NOT NULL) DESC,
        NULLIF(TRIM(CAST(scraped_timestamp AS text)), '')::timestamptz DESC NULLS LAST,
        ctid
    ) AS rn
  FROM {qtable}
  WHERE company IS NOT NULL
    AND property_id IS NOT NULL
    AND (
      address IS NOT NULL OR city IS NOT NULL OR state IS NOT NULL OR zipcode IS NOT NULL
      OR latitude IS NOT NULL OR longitude IS NOT NULL
    )
),
best AS (
  SELECT * FROM donors WHERE rn = 1
)
UPDATE {qtable} t
SET
  address = COALESCE(t.address, b.address),
  city = COALESCE(t.city, b.city),
  state = COALESCE(t.state, b.state),
  zipcode = COALESCE(t.zipcode, b.zipcode),
  latitude = COALESCE(t.latitude, b.latitude),
  longitude = COALESCE(t.longitude, b.longitude)
FROM best b
WHERE t.company = b.company
  AND t.property_id = b.property_id
  AND (
    t.address IS NULL OR t.city IS NULL OR t.state IS NULL OR t.zipcode IS NULL
    OR t.latitude IS NULL OR t.longitude IS NULL
  )
"""
            )
        ).rowcount

        # 2) Pull remaining candidates (small set expected)
        candidates = conn.execute(
            text(
                f"""
SELECT listing_id, company, property_id, listing_url, address, city, state, zipcode, latitude, longitude
FROM {qtable}
WHERE listing_id IS NOT NULL
  AND (
    address IS NULL OR city IS NULL OR state IS NULL OR zipcode IS NULL OR latitude IS NULL OR longitude IS NULL
  )
ORDER BY company, property_id
LIMIT :lim
"""
            ),
            {"lim": int(args.limit)},
        ).mappings().all()

        for row in candidates:
            lid = row["listing_id"]
            listing_url = row.get("listing_url")
            address = row.get("address")
            city = row.get("city")
            state = row.get("state")
            zipcode = row.get("zipcode")
            lat = row.get("latitude")
            lng = row.get("longitude")

            # Parse from URL if address missing
            if (not address or not city or not state or not zipcode) and isinstance(listing_url, str) and listing_url.startswith(
                "http"
            ):
                try:
                    html = requests.get(listing_url, timeout=25).text
                    parsed = parse_address_from_html(html)
                    if parsed:
                        address = address or parsed.address
                        city = city or parsed.city
                        state = state or parsed.state
                        zipcode = zipcode or parsed.zipcode
                        url_parsed += 1
                except Exception:
                    pass

            # Geocode if lat/lng missing but address is now present
            if (lat is None or lng is None) and all(
                isinstance(x, str) and x.strip() for x in (address, city, state, zipcode)
            ):
                q = f"{address}, {city}, {state} {zipcode}"
                pair = forward_geocode(q, token)
                if pair is not None:
                    lat, lng = pair
                    geocoded += 1

            # Update row if we have all fields
            if all(
                [
                    isinstance(address, str) and address.strip(),
                    isinstance(city, str) and city.strip(),
                    isinstance(state, str) and state.strip(),
                    isinstance(zipcode, str) and zipcode.strip(),
                    lat is not None,
                    lng is not None,
                ]
            ):
                conn.execute(
                    text(
                        f"""
UPDATE {qtable}
SET address=:address, city=:city, state=:state, zipcode=:zipcode,
    latitude=:lat, longitude=:lng
WHERE listing_id=:lid
"""
                    ),
                    {
                        "address": address.strip(),
                        "city": city.strip(),
                        "state": state.strip(),
                        "zipcode": zipcode.strip(),
                        "lat": float(lat),
                        "lng": float(lng),
                        "lid": lid,
                    },
                )

    print(f"filled_from_donors={filled_from_donors}")
    print(f"url_parsed={url_parsed}")
    print(f"geocoded={geocoded}")
    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

