#!/usr/bin/env python3
"""
Platform-wide data hygiene for the listings table.

Includes:
1) Dedupe on listing_id (keep one row per listing_id) + enforce unique index.
2) Tombstone stale "available" rows for all companies by source snapshot key:
   only the latest scraped_timestamp per (company, source_key) remains available.

Run (from repo root):
  cd api && uv run python ../scripts/platform_data_hygiene.py --env-file .env
"""

from __future__ import annotations

import argparse
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


def _qualified_table(table: str, schema: str | None) -> str:
    return f'"{schema}"."{table}"' if schema else f'"{table}"'


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--env-file", default="api/.env", help="Path to api/.env (default: api/.env)")
    ap.add_argument("--skip-dedupe", action="store_true", help="Skip dedupe + unique index")
    ap.add_argument(
        "--skip-snapshot-tombstone",
        action="store_true",
        help="Skip source-snapshot tombstoning (all companies).",
    )
    args = ap.parse_args()

    load_dotenv(args.env_file, override=True)
    db_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not db_url:
        raise SystemExit("DATABASE_URL missing")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or None
    qtable = _qualified_table(table, schema)

    engine = create_engine(db_url)

    with engine.begin() as conn:
        if not args.skip_dedupe:
            # 1) Dedupe listing_id rows, keep lowest ctid (matches load_listings_from_parquet behavior).
            deleted = conn.execute(
                text(
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
            ).rowcount

            # 2) Ensure unique index for ongoing upserts.
            idx_name = f"uq_{table}_listing_id"
            conn.execute(text(f'CREATE UNIQUE INDEX IF NOT EXISTS "{idx_name}" ON {qtable} ("listing_id")'))

            print(f"dedupe_listing_id_deleted={deleted}")

        if not args.skip_snapshot_tombstone:
            # Tombstone stale "available" rows across all companies:
            # keep only latest snapshot per (company, source_key).
            #
            # source_key preference:
            #   1) property_id (strongest stable ID when present)
            #   2) listing_url (fallback for feeds without property_id)
            #   3) property_name (last resort)
            # Rows without scraped_timestamp or source_key are ignored.
            updated = conn.execute(
                text(
                    f"""
WITH base AS (
  SELECT
    ctid,
    company,
    COALESCE(
      NULLIF(TRIM(CAST(property_id AS text)), ''),
      NULLIF(TRIM(CAST(listing_url AS text)), ''),
      NULLIF(TRIM(CAST(property_name AS text)), '')
    ) AS source_key,
    NULLIF(TRIM(CAST(scraped_timestamp AS text)), '')::timestamptz AS scraped_ts
  FROM {qtable}
  WHERE company IS NOT NULL
),
latest AS (
  SELECT
    company,
    source_key,
    MAX(scraped_ts) AS max_ts
  FROM base
  WHERE source_key IS NOT NULL
    AND scraped_ts IS NOT NULL
  GROUP BY company, source_key
),
stale AS (
  SELECT b.ctid
  FROM base b
  JOIN latest x
    ON x.company = b.company
   AND x.source_key = b.source_key
  JOIN {qtable} l ON l.ctid = b.ctid
  WHERE b.scraped_ts IS NOT NULL
    AND b.source_key IS NOT NULL
    AND LOWER(COALESCE(NULLIF(TRIM(CAST(l.availability_status AS text)), ''), '')) = 'available'
    AND b.scraped_ts IS DISTINCT FROM x.max_ts
)
UPDATE {qtable} t
SET availability_status = 'unavailable'
FROM stale s
WHERE t.ctid = s.ctid
"""
                )
            ).rowcount
            print(f"snapshot_tombstoned={updated}")

        # AppFolio scraper historically left property_id NULL (each listing got a unique listing_id
        # but no building-level grouping key). Derive a stable property_id from
        # `appfolio_<subdomain>_<md5(street_sans_unit + zip)[:16]>`. This mirrors the
        # logic in appfolio_scraper.parse_listings_page and lets COUNT(DISTINCT property_id)
        # actually count buildings.
        appfolio_filled = conn.execute(
            text(
                f"""
UPDATE {qtable}
SET property_id =
    'appfolio_'
    || (regexp_match(listing_id, '^appfolio_([^_]+)_'))[1]
    || '_'
    || left(md5(
        lower(regexp_replace(
            split_part(address, ',', 1),
            '\\s*[-,]?\\s*(unit|apt|#|ste|suite)\\s*\\S+.*$',
            '',
            'i'
        )) || '|' || COALESCE(zipcode, '')
    ), 16)
WHERE company = 'AppFolio'
  AND property_id IS NULL
  AND address IS NOT NULL
  AND listing_id ~ '^appfolio_[^_]+_'
"""
            )
        ).rowcount
        print(f"appfolio_property_id_backfilled={appfolio_filled}")

        # Backfill missing geo/address fields for rows that share the same (company, property_id),
        # using the best available donor row (prefer latest non-null latitude/longitude).
        # This fixes cases where a sync/upsert inserted new listing_ids without location data.
        filled = conn.execute(
            text(
                f"""
WITH donors AS (
  SELECT
    company,
    property_id,
    latitude,
    longitude,
    address,
    city,
    state,
    zipcode,
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
    AND (latitude IS NOT NULL OR longitude IS NOT NULL OR city IS NOT NULL OR state IS NOT NULL OR zipcode IS NOT NULL)
),
best AS (
  SELECT * FROM donors WHERE rn = 1
)
UPDATE {qtable} t
SET
  latitude = COALESCE(t.latitude, b.latitude),
  longitude = COALESCE(t.longitude, b.longitude),
  address = COALESCE(t.address, b.address),
  city = COALESCE(t.city, b.city),
  state = COALESCE(t.state, b.state),
  zipcode = COALESCE(t.zipcode, b.zipcode)
FROM best b
WHERE t.company = b.company
  AND t.property_id = b.property_id
  AND (
    t.latitude IS NULL OR t.longitude IS NULL OR t.city IS NULL OR t.state IS NULL OR t.zipcode IS NULL OR t.address IS NULL
  )
"""
            )
        ).rowcount
        print(f"geo_backfilled={filled}")

    print("done")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

