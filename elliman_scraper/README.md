# Douglas Elliman Scraper

Scrapes rental listings from elliman.com for the NYC metro area.

## Architecture

Elliman.com is a Next.js app powered by Purlin.AI. This scraper uses
**Playwright** (headless Chromium) to:
1. Render search result pages
2. Intercept XHR/fetch API responses containing listing JSON
3. Fall back to DOM scraping if API interception yields nothing

## Setup

```bash
pip install -r requirements-local.txt
playwright install chromium
```

## Usage

```bash
# Scrape mode (live crawl)
python elliman_scraper.py --env local --mode scrape --max_pages 20

# Reprocess saved raw files
python elliman_scraper.py --env local --mode process_local --scrape_date 2026-04-02
```

## Load into DB

```bash
cd ..
./api/.venv/bin/python scripts/load_listings_from_parquet.py \
  --parquet elliman_scraper/env=local/source=elliman/stage=processed/entity=property/load_date=2026-04-02/units.parquet \
  --if-exists upsert --fast-postgres
```

## Output

- `env=local/source=elliman/stage=raw/entity=property/` — raw JSON per listing
- `env=local/source=elliman/stage=processed/entity=property/load_date=YYYY-MM-DD/units.parquet`
- `env=local/source=elliman/stage=processed/entity=property/load_date=YYYY-MM-DD/images.parquet`
