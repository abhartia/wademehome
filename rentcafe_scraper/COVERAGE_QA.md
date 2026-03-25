# RentCafe coverage QA

## What “full” means

The scraper discovers properties by following **RentCafe homepage → city index pages → property `default.aspx` links**. That is **link-graph coverage**, not a provably complete catalog. Listings that are never linked from crawled city pages may still be missing.

## Full-coverage run

From `rentcafe_scraper/`:

```bash
python3 rentcafe_scraper.py --env local --mode scrape --expand_city_graph --max_workers 10
```

Omit `--max_cities` and `--max_properties` for the broadest run. Expect a long job; use residential proxies if Cloudflare or rate limits appear.

## Artifacts

Each processed partition includes:

- `discovery_manifest.json` — `city_count`, `property_count`, `expand_city_graph`, optional caps, and a `cities_sample` of up to 20 URLs.
- `quality_summary.json` — null rates and geography histograms.

## Comparing runs

From repo root (two `units.parquet` paths):

```bash
./api/.venv/bin/python scripts/compare_listing_parquets.py \
  rentcafe_scraper/env=local/.../load_date=OLD/units.parquet \
  rentcafe_scraper/env=local/.../load_date=NEW/units.parquet
```

## Postgres sanity

```sql
SELECT company, COUNT(*) FROM listings WHERE company = 'RentCafe' GROUP BY 1;
SELECT 100.0 * AVG(CASE WHEN zipcode IS NULL THEN 1 ELSE 0 END) AS zip_null_pct
  FROM listings WHERE company = 'RentCafe';
```
