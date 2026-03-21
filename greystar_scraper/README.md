# Greystar Scraper

This Python scraper extracts unit-level rental data from [Greystar.com](https://www.greystar.com/) by crawling all U.S. rental property pages linked from the sitemap and parsing embedded JavaScript data.

## 🚀 Features

- Crawls `https://www.greystar.com/sitemap.xml` to identify U.S. state-level pages
- Extracts all property URLs from each state page
- Scrapes unit-level data (rent, sqft, beds/baths, availability) from embedded `__NEXT_DATA__` JSON
- Captures property metadata, contact info, amenities, images, and fees
- Supports local or Google Cloud Storage output
- Can run in either:
  - `scrape` mode (live fetch + process)
  - `process_local` mode (reprocess downloaded `.json.gz` files)
- Slack alerts for job start, success, and failure
- Output format: `parquet` or `csv`

## 🧰 Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

Dependencies include:
- `requests`
- `pandas`
- `beautifulsoup4`
- `google-cloud-storage`
- `rapidfuzz`
- `lxml`
- `pyarrow` (Parquet engine)
- `tqdm` (optional)
- `playwright` (if browser usage added later)

### 2. Configure environment variables

Set the following environment variables:

- `SLACK_WEBHOOK_URL` — Slack webhook for status alerts (used only when `env != "local"`)
- (Optional) Configure `~/.gcp` credentials for GCS access (only needed when `env != "local"`)

### 3. Proxy setup

When `env != "local"`, HTTP requests are routed through proxies defined in `ProxyManager`. You must supply **real proxy endpoints** there; the repo placeholders are not valid. For development, prefer **`--env=local`** so requests go direct and raw/processed files stay on disk under `env=local/...`.

## 🏃‍♂️ Usage

### Full United States scrape (local disk)

This walks every `/homes-to-rent/us/...` page from the sitemap, then every property. It can take **hours** and uses significant disk under `env=local/source=greystar/`. Logs: `greystar_scraper/logs/greystar_<timestamp>.log`.

```bash
cd greystar_scraper
pip install -r requirements.txt
python greystar_scraper.py --env=local --mode=scrape --format=parquet --max_workers=10
```

After it finishes, load into Postgres from the repo root (see root `README.md`): use `--parquet` pointing at `env=local/source=greystar/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet` and **`--if-exists upsert --fast-postgres`** so re-runs do not duplicate rows.

### Targeted states (optional)

Limit listing pages to specific 2-letter state codes (faster sanity check, e.g. NY only):

```bash
python greystar_scraper.py --env=local --mode=scrape --format=parquet --max_workers=5 --states ny,nj
```

### Quick local smoke test (recommended)

This runs a small scrape locally without proxies, Slack, or GCS:

```bash
python greystar_scraper.py --env=local --mode=scrape --format=parquet --max_workers=5 --max_properties=50
```

After it completes, you should see:

- Raw HTML/JSON under `env=local/source=greystar/stage=raw/entity=property/...`
- Processed units and images under `env=local/source=greystar/stage=processed/entity=property/load_date=<YYYY-MM-DD>/`

To quickly inspect the results:

```bash
python -c "import pandas as pd; df = pd.read_parquet('env=local/source=greystar/stage=processed/entity=property/load_date=$(date +%F)/units.parquet'); print(df.head()); print('Total units:', len(df))"
```

### Scrape live Greystar properties (non-local envs)

```bash
python greystar_scraper.py --env=prod --mode=scrape --format=parquet --max_workers=10
```

### Reprocess raw JSON files

```bash
python greystar_scraper.py --env=prod --mode=process_local --scrape_date=2025-08-01 --format=csv
```

### CLI Arguments

| Argument         | Description                                                |
|------------------|------------------------------------------------------------|
| `--env`          | Required. One of `local`, `dev`, `test`, or `prod`         |
| `--mode`         | `scrape` (default) or `process_local`                      |
| `--format`       | Output format: `parquet` (default) or `csv`                |
| `--max_workers`  | Number of concurrent threads during scraping               |
| `--max_properties` | Optional limit on number of property URLs to scrape (useful for local tests) |
| `--states`       | Comma-separated state codes (e.g. `ny,nj`); omit for full US              |
| `--scrape_date`  | Only for `process_local`; override auto-detected date      |
| `--input`        | (Not currently used)                                       |

## 📁 Output Structure

### Raw

- `env=<env>/source=greystar/stage=raw/entity=property/property_id=<id>/scraped_at=<YYYY-MM-DD>/property.json.gz`
- `env=<env>/source=greystar/stage=raw/entity=property/property_id=<id>/scraped_at=<YYYY-MM-DD>/page.html.gz`

### Processed

- `env=<env>/source=greystar/stage=processed/entity=property/load_date=<YYYY-MM-DD>/units.parquet`
- `env=<env>/source=greystar/stage=processed/entity=photo/load_date=<YYYY-MM-DD>/images.parquet`

## 🧠 Behavior Notes

- Availability is derived from unit-level price presence
- Building type is inferred from subtype fields when available
- All unit and photo data includes a `scraped_timestamp`
- `process_local` will default to latest `scraped_at=` folder if not specified
- Slack alerts show:
  - Total scraped properties
  - Total units and available units
  - Total photo records
  - Alerts on failure

## 🔒 GCS + Local Mode

- When `env="local"`: all files are saved to local disk
- When `env!="local"`: files are also uploaded to Google Cloud Storage and deleted locally after

## 📜 License

MIT License