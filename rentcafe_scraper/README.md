# RentCafe Scraper

Scrapes Yardi/RentCafe rental listing pages and flattens floorplan-level pricing data
into the existing `units.parquet` schema used by the API loader.

## Setup

Local-only mode:

```bash
cd rentcafe_scraper
python3 -m pip install -r requirements-local.txt
```

Full mode with GCS upload:

```bash
python3 -m pip install -r requirements.txt
```

## Usage

Smoke test:

```bash
python3 rentcafe_scraper.py --env=local --mode=scrape --format=parquet --max_workers=8 --max_cities=20 --max_properties=200
```

US-wide run (link-graph discovery; no city/property caps):

```bash
python3 rentcafe_scraper.py --env=local --mode=scrape --format=parquet --max_workers=10 --expand_city_graph
```

Writes `discovery_manifest.json` next to `units.parquet` (`city_count`, `property_count`, etc.). See [COVERAGE_QA.md](COVERAGE_QA.md) and [scripts/compare_listing_parquets.py](../scripts/compare_listing_parquets.py) for comparing partitions.

Reprocess locally saved raw HTML:

```bash
python3 rentcafe_scraper.py --env=local --mode=process_local --scrape_date=2026-03-24 --format=parquet
```

## Output Paths

Raw:

- `env=<env>/source=rentcafe/stage=raw/entity=property/property_id=<id>/scraped_at=<YYYY-MM-DD>/page.html.gz`
- `env=<env>/source=rentcafe/stage=raw/entity=property/property_id=<id>/scraped_at=<YYYY-MM-DD>/property.json.gz`

Processed:

- `env=<env>/source=rentcafe/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet`
- `env=<env>/source=rentcafe/stage=processed/entity=property/load_date=<YYYY-MM-DD>/images.parquet`

## Load into Postgres

From repo root:

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py \
  --parquet rentcafe_scraper/env=local/source=rentcafe/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet \
  --fast-postgres --if-exists upsert
```
