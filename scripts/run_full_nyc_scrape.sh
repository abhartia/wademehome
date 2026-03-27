#!/usr/bin/env bash
set -euo pipefail

# Full NYC metro scrape pipeline:
#   1. Run each scraper (discovery + scrape)
#   2. Temporarily drop NOT NULL on location columns
#   3. Load all parquet into Postgres via upsert
#   4. Run platform data hygiene (dedupe + tombstone + geo backfill)
#   5. Delete rows with incomplete location data
#   6. Re-enforce NOT NULL constraints
#   7. Print summary

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_VENV="${REPO_ROOT}/api/.venv/bin/python"
LOAD_SCRIPT="${REPO_ROOT}/scripts/load_listings_from_parquet.py"
HYGIENE_SCRIPT="${REPO_ROOT}/scripts/platform_data_hygiene.py"
TODAY=$(date +%Y-%m-%d)

log() { echo "[$(date '+%H:%M:%S')] $*"; }
hr() { echo "────────────────────────────────────────────────────────────"; }

load_parquet() {
    local label="$1"
    local pattern="$2"
    local parquet
    parquet=$(find "$REPO_ROOT" -path "$pattern" -name "units.parquet" 2>/dev/null | sort -r | head -1)
    if [ -z "$parquet" ]; then
        log "SKIP $label — no parquet found matching: $pattern"
        return
    fi
    log "LOAD $label: $parquet"
    "$API_VENV" "$LOAD_SCRIPT" --parquet "$parquet" --fast-postgres --if-exists upsert
}

# ── Phase 1: Scrape ───────────────────────────────────────────────────────

hr
log "=== PHASE 1: SCRAPE ==="
hr

# RentCafe (auto-discovery via homepage crawl — skip expand_city_graph due to Cloudflare throttling)
log "Starting RentCafe full crawl..."
cd "$REPO_ROOT/rentcafe_scraper"
python3 rentcafe_scraper.py --env local --mode scrape --max_workers 10 || log "WARN: RentCafe scraper exited non-zero"

# RealPage/SecureCafe (crt.sh probe then scrape)
log "Starting RealPage crt.sh probe + scrape..."
cd "$REPO_ROOT/realpage_scraper"
python3 realpage_scraper.py --env local --mode probe_seeds --probe-source crt --probe-output nyc_seeds_probed.txt --max_workers 10 || log "WARN: RealPage probe failed"
if [ -s nyc_seeds_probed.txt ]; then
    python3 realpage_scraper.py --env local --mode scrape --seeds nyc_seeds_probed.txt --max_workers 8 || log "WARN: RealPage scraper exited non-zero"
else
    log "SKIP RealPage scrape — no valid seeds from probe"
fi

# Entrata (Bing search + curated site discovery then scrape)
log "Starting Entrata discovery + scrape..."
cd "$REPO_ROOT/entrata_scraper"
python3 discover_entrata_nyc.py --output seeds_nyc.txt || log "WARN: Entrata discovery failed"
if [ -s seeds_nyc.txt ]; then
    python3 entrata_scraper.py --env local --mode scrape --seeds seeds_nyc.txt seeds.txt --max_workers 4 || log "WARN: Entrata scraper exited non-zero"
else
    log "SKIP Entrata scrape — no seeds discovered"
fi

# AppFolio (crt.sh discovery + manual seed probing then scrape)
log "Starting AppFolio discovery + scrape..."
cd "$REPO_ROOT/appfolio_scraper"
python3 appfolio_scraper.py --env local --mode discover --nyc_only --probe_output seeds_discovered.txt || log "WARN: AppFolio discovery failed"
if [ -s seeds_discovered.txt ]; then
    python3 appfolio_scraper.py --env local --mode scrape --seeds seeds_discovered.txt --max_workers 6 || log "WARN: AppFolio scraper exited non-zero"
else
    log "SKIP AppFolio scrape — no seeds discovered"
fi

# ── Phase 2: Load into Postgres ───────────────────────────────────────────

hr
log "=== PHASE 2: LOAD INTO POSTGRES ==="
hr

# Temporarily drop NOT NULL on location columns (new scraper data may lack geo)
log "Dropping NOT NULL on location columns..."
cd "$REPO_ROOT/api"
uv run python -c "
import os; from dotenv import load_dotenv; load_dotenv('.env')
from sqlalchemy import create_engine, text
e = create_engine(os.environ['DATABASE_URL'])
with e.connect() as c:
    for col in ['address', 'city', 'state', 'zipcode', 'latitude', 'longitude']:
        c.execute(text(f'ALTER TABLE listings ALTER COLUMN {col} DROP NOT NULL'))
    c.commit()
    print('NOT NULL constraints dropped')
"

cd "$REPO_ROOT"
load_parquet "RentCafe"  "*/rentcafe_scraper/env=local/source=rentcafe/stage=processed/*"
load_parquet "RealPage"  "*/realpage_scraper/env=local/source=realpage/stage=processed/*"
load_parquet "Entrata"   "*/entrata_scraper/env=local/source=entrata/stage=processed/*"
load_parquet "AppFolio"  "*/appfolio_scraper/env=local/source=appfolio/stage=processed/*"
load_parquet "Greystar"  "*/greystar_scraper/env=local/source=greystar/stage=processed/*"

# ── Phase 3: Hygiene + Geo Backfill ──────────────────────────────────────

hr
log "=== PHASE 3: DATA HYGIENE + GEO BACKFILL ==="
hr

cd "$REPO_ROOT/api"
uv run python "$HYGIENE_SCRIPT" --env-file .env

# Geocode rows that have address but no lat/lng
log "Geocoding rows with addresses but no coordinates..."
uv run python -c "
import os, sys, time
from dotenv import load_dotenv; load_dotenv('.env')
from sqlalchemy import create_engine, text
sys.path.insert(0, 'src')
from listings.mapbox_client import forward_geocode
token = os.environ.get('MAPBOX_ACCESS_TOKEN') or os.environ.get('MAPBOX_TOKEN') or ''
if not token: print('WARN: no MAPBOX token, skipping geocode'); sys.exit(0)
e = create_engine(os.environ['DATABASE_URL'])
with e.connect() as c:
    rows = c.execute(text('SELECT listing_id, address, city, state, zipcode FROM listings WHERE latitude IS NULL AND address IS NOT NULL LIMIT 500')).fetchall()
    updated = 0
    for lid, addr, city, state, zipcode in rows:
        q = addr or ''
        if city: q += f', {city}'
        if state: q += f', {state}'
        if zipcode: q += f' {zipcode}'
        result = forward_geocode(q, token)
        if result:
            c.execute(text('UPDATE listings SET latitude = :lat, longitude = :lng WHERE listing_id = :lid'), {'lat': result[0], 'lng': result[1], 'lid': lid})
            updated += 1
        time.sleep(0.1)
    c.commit()
    print(f'Geocoded {updated}/{len(rows)} rows')
"

# Delete rows with incomplete location data and re-enforce NOT NULL
log "Cleaning up rows with incomplete location data..."
uv run python -c "
import os; from dotenv import load_dotenv; load_dotenv('.env')
from sqlalchemy import create_engine, text
e = create_engine(os.environ['DATABASE_URL'])
with e.connect() as c:
    r = c.execute(text('DELETE FROM listings WHERE address IS NULL OR city IS NULL OR state IS NULL OR zipcode IS NULL OR latitude IS NULL OR longitude IS NULL'))
    print(f'Deleted {r.rowcount} rows with incomplete location')
    for col in ['address', 'city', 'state', 'zipcode', 'latitude', 'longitude']:
        c.execute(text(f'ALTER TABLE listings ALTER COLUMN {col} SET NOT NULL'))
    c.commit()
    print('NOT NULL constraints restored')
"

# ── Summary ───────────────────────────────────────────────────────────────

hr
log "=== SUMMARY ==="
hr

"$API_VENV" -c "
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
load_dotenv('${REPO_ROOT}/api/.env')
engine = create_engine(os.environ['DATABASE_URL'])
with engine.connect() as conn:
    r = conn.execute(text('''
        SELECT company, COUNT(*) AS rows, COUNT(DISTINCT property_id) AS buildings,
               COUNT(*) FILTER (WHERE availability_status = 'available') AS available
        FROM listings
        GROUP BY company
        ORDER BY available DESC
    '''))
    print(f'{\"Company\":<20} {\"Total\":>10} {\"Buildings\":>10} {\"Available\":>10}')
    print('-' * 52)
    total_r = total_b = total_a = 0
    for row in r:
        print(f'{row[0]:<20} {row[1]:>10,} {row[2]:>10,} {row[3]:>10,}')
        total_r += row[1]; total_b += row[2]; total_a += row[3]
    print('-' * 52)
    print(f'{\"TOTAL\":<20} {total_r:>10,} {total_b:>10,} {total_a:>10,}')
    
    print()
    r2 = conn.execute(text('''
        SELECT company, COUNT(*) FILTER (WHERE availability_status = 'available') AS available
        FROM listings
        WHERE latitude BETWEEN 40.4 AND 41.4 AND longitude BETWEEN -74.5 AND -73.5
        GROUP BY company ORDER BY available DESC
    '''))
    print('NYC Metro bbox:')
    total = 0
    for row in r2:
        print(f'  {row[0]:<20} {row[1]:>10,}')
        total += row[1]
    print(f'  {\"TOTAL\":<20} {total:>10,}')
"

hr
log "Done."
