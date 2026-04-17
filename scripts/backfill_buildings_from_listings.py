"""Seed `buildings` from distinct (address, zipcode) groups in `listings`.

Mirrors the dedupe key used by buildings.service._normalize_addr:
    regexp_replace(lower(trim(address)), '\\s+', ' ', 'g') || ' ' || trim(zipcode)

BBL/BIN/borough/unit_count stay NULL — Geosupport fills those later.
"""
from __future__ import annotations

import os
import sys

import psycopg2
from dotenv import load_dotenv


SQL = """
WITH src AS (
    SELECT DISTINCT ON (norm)
        regexp_replace(lower(trim(address)), '\\s+', ' ', 'g')
            || ' ' || COALESCE(NULLIF(trim(zipcode), ''), '') AS norm,
        regexp_replace(trim(address), '\\s+', ' ', 'g')         AS street_line1,
        COALESCE(NULLIF(trim(city),  ''), 'New York')           AS city,
        COALESCE(NULLIF(trim(state), ''), 'NY')                 AS state,
        NULLIF(trim(zipcode), '')                               AS postal_code,
        latitude::numeric(10,7)                                 AS latitude,
        longitude::numeric(11,7)                                AS longitude
    FROM listings
    WHERE address   IS NOT NULL
      AND latitude  IS NOT NULL
      AND longitude IS NOT NULL
      AND length(trim(address)) >= 5
      AND trim(address) !~ '^[0-9]+$'
    ORDER BY
        regexp_replace(lower(trim(address)), '\\s+', ' ', 'g')
            || ' ' || COALESCE(NULLIF(trim(zipcode), ''), ''),
        scraped_timestamp DESC NULLS LAST
)
INSERT INTO buildings (
    id, street_line1, city, state, postal_code,
    latitude, longitude, normalized_addr, created_at, updated_at
)
SELECT
    gen_random_uuid(),
    src.street_line1, src.city, src.state, src.postal_code,
    src.latitude, src.longitude, src.norm,
    NOW(), NOW()
FROM src
WHERE NOT EXISTS (
    SELECT 1 FROM buildings b WHERE b.normalized_addr = src.norm
)
RETURNING 1;
"""


def main() -> int:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "api", ".env"))
    url = os.environ["DATABASE_URL"].replace("postgresql+psycopg2://", "postgresql://")
    with psycopg2.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM buildings;")
            before = cur.fetchone()[0]
            cur.execute(SQL)
            inserted = cur.rowcount
            cur.execute("SELECT COUNT(*) FROM buildings;")
            after = cur.fetchone()[0]
        conn.commit()
    print(f"buildings: {before} → {after} (inserted {inserted})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
