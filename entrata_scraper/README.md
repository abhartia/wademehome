# Entrata-oriented marketing scraper (v1)

Flattens **embedded JSON** (`__NEXT_DATA__`) and **JSON-LD** from consumer multifamily sites that use Entrata (or similar Next.js stacks) into the shared `units.parquet` schema.

## Spike notes

- **Operator / resident Entrata APIs** (`*.entrata.com` authenticated endpoints) are **not** scraped here; targets are **public marketing / floor plan** pages.
- Before adding a seed, confirm in DevTools **Network** that inventory is present in **document JSON** (Next.js) or **JSON-LD**, not only behind authenticated XHR.
- **Themes differ**: v1 uses generic heuristics (objects with rent + unit/floorplan keys). Tighten per-operator handlers as you validate seeds.
- **Bot friction**: `cloudscraper` + optional proxies (same pattern as RentCafe).
- **Amenities (Jonah Digital)**: same-origin **`/amenities/`** page (linked from the marketing nav). Structure: `div.amenity-c__group` with `h2.amenity-c__title` **“Community Amenities”** or **“Apartment Features”**; list items are non-empty `li` under `ul` in that group. The scraper fetches `/amenities/` once per seed (Referer = seed URL) and applies the same JSON lists to all unit rows when parsing succeeds (`listing_amenities_parsers.parse_entrata_jonah_amenities_html`).

## Setup

```bash
cd entrata_scraper
python3 -m pip install -r requirements-local.txt
```

## Usage

```bash
# Merge multiple seed files (dedupe preserves first occurrence order)
python3 entrata_scraper.py --env local --seeds seeds.txt more_seeds.txt --max_workers 4

# Optional Nominatim when JSON-LD lacks geo but city/state exist
python3 entrata_scraper.py --env local --seeds seeds.txt --geocode

python3 entrata_scraper.py --env local --mode process_local --scrape_date 2026-03-24
```

## Output paths

- Raw: `env=<env>/source=entrata/stage=raw/entity=property/property_id=<hash>/scraped_at=<YYYY-MM-DD>/page.html.gz`
- Processed: `env=<env>/source=entrata/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet`, `images.parquet`, `quality_summary.json`

## Load into Postgres

From repo root:

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py \
  --parquet entrata_scraper/env=local/source=entrata/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet \
  --fast-postgres --if-exists upsert
```

## SQL QA

```sql
SELECT company, COUNT(*) FROM listings WHERE company = 'Entrata' GROUP BY 1;
SELECT 100.0 * AVG(CASE WHEN zipcode IS NULL THEN 1 ELSE 0 END) FROM listings WHERE company = 'Entrata';
SELECT 100.0 * AVG(CASE WHEN latitude IS NULL THEN 1 ELSE 0 END) FROM listings WHERE company = 'Entrata';
```
