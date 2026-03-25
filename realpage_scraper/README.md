# RealPage / OneSite (SecureCafe) scraper

Consumer-facing **Yardi SecureCafe / RealPage online leasing** sites that expose `…/onlineleasing/{sitekey}/floorplans.aspx`. This is v1 discovery: **curated seeds only** — many `*.securecafe.com` hosts redirect or are not public ILS; validate URLs before adding them.

## Spike notes (2026)

- **Inventory**: GET `floorplans.aspx`, read `var propertyid = <digits>` from inline script.
- **Units**: POST `{origin}/onlineleasing/rcLoadContent.ashx?contentclass=availableunits` (path is under `/onlineleasing/`, **not** under `/onlineleasing/{sitekey}/`). Body: repeated `floorPlans` fields with bed-bucket values (`0`–`3`), from `#innerformdiv` checkboxes or defaults.
- **Parse**: `tr.AvailUnitRow`, `th` id = numeric unit id, `.unit-address` text (two spaces between street and city), `td[data-label="Rent"]`.
- **IDs**: `listing_id` = `realpage_{propertyid}_{unit_th_id}`; `company` = `RealPage`.
- **Geo**: Street/city/state/zip from `.unit-address`. Optional **Nominatim** (`--geocode`) uses “City, ST” parsed from meta description (respect [usage policy](https://operations.osmfoundation.org/policies/nominatim/); ~1.1s delay per property).
- **Bot**: Expect Cloudflare; `cloudscraper` is used for session cookies.

## Example seed

```
https://parkmerced.securecafe.com/onlineleasing/parkmerced/floorplans.aspx
```

Edit `seeds.txt` (one URL per line, `#` comments allowed). Pass **multiple** files to merge and dedupe: `--seeds seeds.txt seeds_validated.txt`.

### Bulk discovery (certificate transparency + probe)

Generate validated `floorplans.aspx` URLs from crt.sh `%.securecafe.com` names (best-effort; many hosts redirect or use non-default sitekeys):

```bash
python3 realpage_scraper.py --mode probe_seeds --probe-source crt --probe-output seeds_validated.txt \
  --crt-max-hosts 800 --max-probe 2500 --max_workers 8
```

Or probe a file of hostnames (one per line) or full URLs:

```bash
python3 realpage_scraper.py --mode probe_seeds --probe-source file --probe-input securecafe_hosts.txt \
  --probe-output seeds_validated.txt --max-probe 1000 --max_workers 8
```

Metrics are written to `seeds_validated.txt.probe_manifest.json`.

## Setup

```bash
cd realpage_scraper
python3 -m venv .venv && .venv/bin/pip install -r requirements-local.txt
```

Non-local envs need `requirements.txt` and GCS credentials for bucket `scrapers-v2` (same pattern as RentCafe).

## Run

From **`realpage_scraper/`** (output paths are relative to CWD):

```bash
# Scrape (default: no Nominatim)
.venv/bin/python realpage_scraper.py --env local --seeds seeds.txt --max_properties 50

# With property-level geocode (city centroid from meta — good enough for map pins)
.venv/bin/python realpage_scraper.py --env local --seeds seeds.txt --geocode

# Rebuild parquet from saved raw gzip under env=local/...
.venv/bin/python realpage_scraper.py --env local --mode process_local --scrape_date 2026-03-24
```

Outputs:

- Raw: `env=<env>/source=realpage/stage=raw/entity=property/property_id=<slug>/scraped_at=<YYYY-MM-DD>/`
- Processed: `env=<env>/source=realpage/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet`, `images.parquet`, `quality_summary.json`

## Load into Postgres

From repo root (same as Greystar/RentCafe):

```bash
./api/.venv/bin/python scripts/load_listings_from_parquet.py \
  --parquet realpage_scraper/env=local/source=realpage/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet \
  --fast-postgres --if-exists upsert
```

## SQL QA (after load)

```sql
SELECT company, COUNT(*) FROM listings WHERE company = 'RealPage' GROUP BY 1;
SELECT 100.0 * AVG(CASE WHEN zipcode IS NULL THEN 1 ELSE 0 END) AS zip_null_pct FROM listings WHERE company = 'RealPage';
SELECT 100.0 * AVG(CASE WHEN latitude IS NULL THEN 1 ELSE 0 END) AS lat_null_pct FROM listings WHERE company = 'RealPage';
```
