"""
AppFolio scraper — discovers subdomains via crt.sh, then scrapes listing pages.

URL pattern: {subdomain}.appfolio.com/listings/listings
Detail page:  {subdomain}.appfolio.com/listings/detail/{uuid}

Flow:
  1) crt.sh query for *.appfolio.com → unique subdomains
  2) Probe each {sub}.appfolio.com/listings/listings for valid listing pages
  3) Optionally geo-filter to NYC metro by checking addresses on the page
  4) Parse listing cards: rent, beds, baths, sqft, availability, address
  5) Output units.parquet + images.parquet
"""
from __future__ import annotations

import argparse
import gzip
import json
import logging
import os
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import cloudscraper
import pandas as pd
import requests
from bs4 import BeautifulSoup, Tag

from proxy_manager import ProxyManager

GCS_BUCKET = "scrapers-v2"
COMPANY = "AppFolio"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

NYC_METRO_STATES = {"ny", "nj", "ct"}
NYC_METRO_CITIES_LOWER = {
    "new york", "brooklyn", "manhattan", "queens", "bronx", "staten island",
    "jersey city", "hoboken", "newark", "bayonne", "weehawken", "union city",
    "west new york", "north bergen", "edgewater", "fort lee", "cliffside park",
    "palisades park", "hackensack", "east rutherford", "harrison", "kearny",
    "elizabeth", "new brunswick", "yonkers", "white plains", "stamford",
    "long island city", "astoria", "flushing", "jamaica",
}

proxy_manager = ProxyManager(["IP_1:3128", "IP_1:3128", "IP_1:3128", "IP_1:3128"])

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/appfolio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("appfolio_scraper")
thread_local = threading.local()


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError("google-cloud-storage required for non-local envs") from e
    return storage.Client()


def get_session(env: str):
    s = getattr(thread_local, "session", None)
    if s is None:
        s = cloudscraper.create_scraper(
            browser={"browser": "chrome", "platform": "darwin", "mobile": False}
        )
        s.headers.update({"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
        thread_local.session = s
    return s


# ── Discovery ──────────────────────────────────────────────────────────────

def fetch_crt_appfolio_subdomains(max_retries: int = 3) -> list[str]:
    """Query crt.sh for *.appfolio.com subdomains."""
    last_err: Exception | None = None
    r = None
    for attempt in range(max_retries):
        try:
            r = requests.get(
                "https://crt.sh/",
                params={"q": "%.appfolio.com", "output": "json"},
                headers={"User-Agent": UA},
                timeout=180,
            )
            if r.status_code == 503:
                last_err = RuntimeError(f"crt.sh 503 attempt {attempt + 1}")
                time.sleep(5 + attempt * 5)
                continue
            r.raise_for_status()
            break
        except Exception as e:
            last_err = e
            time.sleep(3 + attempt * 3)
    else:
        raise last_err or RuntimeError("crt.sh failed")
    if r is None:
        raise last_err or RuntimeError("crt.sh failed")

    rows = r.json()
    subs: set[str] = set()
    for row in rows:
        nv = row.get("name_value") or ""
        for part in nv.splitlines():
            part = part.strip().lower().rstrip(".")
            if part.startswith("*."):
                part = part[2:]
            if part.endswith(".appfolio.com") and part != "appfolio.com":
                sub = part[: -len(".appfolio.com")]
                if sub and "." not in sub and sub not in ("www", "app", "api", "mail", "support", "help", "status", "developer"):
                    subs.add(sub)
    return sorted(subs)


def probe_appfolio_listings(subdomain: str, timeout: int = 30) -> tuple[bool, str]:
    """Check if {subdomain}.appfolio.com/listings/listings returns valid listing HTML."""
    url = f"https://{subdomain}.appfolio.com/listings/listings"
    try:
        session = get_session("local")
        resp = session.get(url, timeout=timeout)
        if resp.status_code != 200:
            return False, f"http_{resp.status_code}"
        html = resp.text
        if "listing__info" in html or "js-listing-address" in html or "listing-item" in html:
            return True, "ok"
        if "No listings" in html or "no results" in html.lower():
            return False, "empty"
        if len(html) < 500:
            return False, "too_short"
        soup = BeautifulSoup(html, "lxml")
        cards = soup.select(".listing-item, .js-listing-card, [data-listing-id]")
        if cards:
            return True, "ok"
        return False, "no_listings_detected"
    except Exception as e:
        return False, str(e)[:80]


def is_nyc_metro_listing(address_text: str) -> bool:
    """Check if an address string is in the NYC metro area."""
    lower = address_text.lower().strip()
    state_match = re.search(r"\b(ny|nj|ct)\b", lower)
    if not state_match:
        return False
    for city in NYC_METRO_CITIES_LOWER:
        if city in lower:
            return True
    zip_match = re.search(r"\b(\d{5})\b", lower)
    if zip_match:
        z = int(zip_match.group(1))
        if 10000 <= z <= 11999 or 7000 <= z <= 7999 or 6800 <= z <= 6899:
            return True
    return state_match is not None


def run_discovery(
    *,
    max_subs: int = 5000,
    max_probe_workers: int = 20,
    nyc_only: bool = True,
    probe_output: str = "seeds_discovered.txt",
) -> list[str]:
    """Full discovery: crt.sh → probe → optional geo-filter → seed file."""
    logger.info("Fetching crt.sh subdomains for appfolio.com...")
    subs = fetch_crt_appfolio_subdomains()
    logger.info("Found %d unique subdomains", len(subs))
    subs = subs[:max_subs]

    logger.info("Probing %d subdomains for valid listing pages...", len(subs))
    valid: list[str] = []
    reasons: dict[str, int] = {}
    with ThreadPoolExecutor(max_workers=max_probe_workers) as ex:
        fut_map = {ex.submit(probe_appfolio_listings, s): s for s in subs}
        for fut in as_completed(fut_map):
            sub = fut_map[fut]
            ok, reason = fut.result()
            reasons[reason] = reasons.get(reason, 0) + 1
            if ok:
                valid.append(sub)
    logger.info("Probe results: %d valid out of %d tried. Reasons: %s", len(valid), len(subs), reasons)

    if nyc_only:
        logger.info("Geo-filtering %d valid subdomains to NYC metro...", len(valid))
        nyc_subs = _geo_filter_subdomains(valid)
        logger.info("NYC metro subdomains: %d (from %d total valid)", len(nyc_subs), len(valid))
        valid = nyc_subs

    urls = [f"https://{sub}.appfolio.com/listings/listings" for sub in sorted(valid)]
    with open(probe_output, "w", encoding="utf-8") as f:
        for u in urls:
            f.write(u + "\n")
    manifest = {"total_crt_subs": len(subs), "valid_probed": len(valid), "nyc_filtered": nyc_only, "reasons": reasons}
    with open(probe_output + ".manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    logger.info("Discovery wrote %d URLs to %s", len(urls), probe_output)
    return urls


def _geo_filter_subdomains(subdomains: list[str], max_workers: int = 10) -> list[str]:
    """Fetch listing pages and keep only those with NYC metro addresses."""
    nyc: list[str] = []

    def _check(sub: str) -> bool:
        url = f"https://{sub}.appfolio.com/listings/listings"
        try:
            session = get_session("local")
            resp = session.get(url, timeout=30)
            if resp.status_code != 200:
                return False
            soup = BeautifulSoup(resp.text, "lxml")
            addresses = soup.select(".js-listing-address, .listing-item__address, .listing__address, address")
            for addr in addresses[:5]:
                if is_nyc_metro_listing(addr.get_text()):
                    return True
            text = soup.get_text()
            for city in list(NYC_METRO_CITIES_LOWER)[:10]:
                if city in text.lower():
                    state_nearby = re.search(rf"{re.escape(city)}.*?\b(ny|nj|ct)\b", text.lower())
                    if state_nearby:
                        return True
            return False
        except Exception:
            return False

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_map = {ex.submit(_check, sub): sub for sub in subdomains}
        for fut in as_completed(fut_map):
            sub = fut_map[fut]
            if fut.result():
                nyc.append(sub)
    return nyc


# ── Scraping ───────────────────────────────────────────────────────────────

def parse_listings_page(html: str, base_url: str, scraped_ts: str) -> tuple[list[dict], list[dict]]:
    """Parse an AppFolio /listings/listings page into unit rows and photo rows."""
    soup = BeautifulSoup(html, "lxml")
    parsed = urlparse(base_url)
    subdomain = parsed.hostname.split(".")[0] if parsed.hostname else "unknown"
    rows: list[dict] = []
    photos: list[dict] = []

    cards = soup.select(".listing-item, .js-listing-card, [data-listing-id]")
    if not cards:
        cards = soup.select("a[href*='/listings/detail/']")

    for card in cards:
        if not isinstance(card, Tag):
            continue
        row: dict = {
            "company": COMPANY,
            "scraped_timestamp": scraped_ts,
            "listing_url": base_url,
            "availability_status": "available",
        }

        detail_link = card.get("href") or ""
        if not detail_link:
            a = card.select_one("a[href*='/listings/detail/']")
            if a:
                detail_link = a.get("href", "")
        if detail_link:
            if detail_link.startswith("/"):
                detail_link = f"https://{parsed.hostname}{detail_link}"
            row["listing_url"] = detail_link

        uuid_match = re.search(r"/detail/([a-f0-9-]{36})", detail_link)
        uid = uuid_match.group(1) if uuid_match else ""
        row["listing_id"] = f"appfolio_{subdomain}_{uid}" if uid else f"appfolio_{subdomain}_{hash(card.get_text())}"

        addr_el = card.select_one(".js-listing-address, .listing-item__address, .listing__address, address, .u-pad-rm")
        if addr_el:
            full_addr = addr_el.get_text(separator=", ", strip=True)
            row["address"] = full_addr
            parts = [p.strip() for p in full_addr.split(",")]
            if len(parts) >= 2:
                row["property_name"] = parts[0]
                city_state_zip = ", ".join(parts[1:])
                city_m = re.match(r"(.+?),?\s+([A-Z]{2})\s+(\d{5})", city_state_zip)
                if city_m:
                    row["city"] = city_m.group(1).strip()
                    row["state"] = city_m.group(2)
                    row["zipcode"] = city_m.group(3)
                elif len(parts) >= 3:
                    row["city"] = parts[1].strip()

        rent_el = card.select_one(".listing-item__price, .js-listing-price, .listing__price")
        if rent_el:
            rent_text = re.sub(r"[^\d.]", "", rent_el.get_text())
            if rent_text:
                try:
                    row["rent_price"] = float(rent_text)
                except ValueError:
                    pass

        beds_el = card.select_one(".listing-item__beds, .js-listing-beds")
        if beds_el:
            beds_text = re.search(r"(\d+)", beds_el.get_text())
            if beds_text:
                row["beds"] = int(beds_text.group(1))

        baths_el = card.select_one(".listing-item__baths, .js-listing-baths")
        if baths_el:
            baths_text = re.search(r"(\d+\.?\d*)", baths_el.get_text())
            if baths_text:
                row["baths"] = float(baths_text.group(1))

        sqft_el = card.select_one(".listing-item__sqft, .js-listing-sqft")
        if sqft_el:
            sqft_text = re.sub(r"[^\d]", "", sqft_el.get_text())
            if sqft_text:
                row["sqft"] = int(sqft_text)

        avail_el = card.select_one(".listing-item__available, .js-listing-available")
        if avail_el:
            avail_text = avail_el.get_text(strip=True)
            date_m = re.search(r"(\d{1,2}/\d{1,2}/\d{2,4})", avail_text)
            if date_m:
                row["available_at"] = date_m.group(1)

        img = card.select_one("img[src]")
        if img:
            src = img.get("src", "")
            if src and src.startswith("http"):
                row["image_url"] = src
                photos.append({
                    "listing_id": row["listing_id"],
                    "image_url": src,
                    "image_index": 0,
                })

        rows.append(row)

    return rows, photos


def scrape_appfolio_url(url: str, env: str, scraped_at: str) -> tuple[list[dict], list[dict]]:
    """Scrape a single AppFolio listings page."""
    session = get_session(env)
    resp = session.get(url, timeout=45)
    resp.raise_for_status()
    html = resp.text

    parsed = urlparse(url)
    subdomain = parsed.hostname.split(".")[0] if parsed.hostname else "unknown"
    raw_dir = f"env={env}/source=appfolio/stage=raw/entity={subdomain}/load_date={scraped_at}"
    Path(raw_dir).mkdir(parents=True, exist_ok=True)
    gz_path = os.path.join(raw_dir, "page.html.gz")
    with gzip.open(gz_path, "wt", encoding="utf-8") as f:
        f.write(html)

    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    return parse_listings_page(html, url, scraped_ts)


# ── Column enforcement ─────────────────────────────────────────────────────

UNIT_COLUMNS = [
    "listing_id", "company", "property_name", "property_id", "listing_url",
    "address", "city", "state", "zipcode", "latitude", "longitude",
    "rent_price", "beds", "baths", "sqft", "unit_id", "unit_name",
    "floor_plan", "available_at", "availability_status",
    "description", "image_url", "images", "scraped_timestamp",
]


def enforce_unit_types(df: pd.DataFrame) -> pd.DataFrame:
    for col in UNIT_COLUMNS:
        if col not in df.columns:
            df[col] = None
    float_cols = {"rent_price", "baths", "sqft", "latitude", "longitude"}
    int_cols = {"beds"}
    for c in float_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    for c in int_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce").astype("Int64")
    return df


def empty_typed_units_dataframe() -> pd.DataFrame:
    return pd.DataFrame({c: pd.Series(dtype="object") for c in UNIT_COLUMNS})


def quality_summary(df: pd.DataFrame) -> dict:
    null_rates = {c: round(float(df[c].isna().mean()), 4) for c in df.columns if c in UNIT_COLUMNS}
    dupes = int(df.duplicated(subset=["listing_id"], keep=False).sum()) if "listing_id" in df.columns else 0
    return {
        "rows": int(len(df)),
        "unique_listing_ids": int(df["listing_id"].nunique(dropna=True)) if "listing_id" in df.columns else 0,
        "duplicate_listing_ids": dupes,
        "null_rates": null_rates,
    }


# ── Loading seeds ──────────────────────────────────────────────────────────

def load_seeds(path: str) -> list[str]:
    out: list[str] = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            out.append(line.split()[0])
    return out


def load_seeds_merged(paths: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for path in paths:
        if not os.path.isfile(path):
            logger.warning("Missing seed file: %s", path)
            continue
        for u in load_seeds(path):
            if u not in seen:
                seen.add(u)
                out.append(u)
    return out


def upload_to_gcs(filepath: str, prefix: str):
    client = _gcs_client()
    blob = client.bucket(GCS_BUCKET).blob(f"{prefix}/{os.path.basename(filepath)}")
    blob.upload_from_filename(filepath)
    os.remove(filepath)


# ── Main run ───────────────────────────────────────────────────────────────

def run_scraper(
    env: str,
    seeds_paths: list[str],
    output_format: str = "parquet",
    max_workers: int = 6,
    max_properties: int | None = None,
):
    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    seeds = load_seeds_merged(seeds_paths)
    if max_properties is not None:
        seeds = seeds[:max_properties]
    logger.info("AppFolio scrape: %d seed URLs", len(seeds))
    if not seeds:
        logger.warning("No seed URLs; run with --mode discover first.")

    output_dir = f"env={env}/source=appfolio/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    all_rows: list[dict] = []
    all_photos: list[dict] = []
    ok = fail = 0

    def _one(u: str):
        return scrape_appfolio_url(u, env, scraped_at)

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_map = {ex.submit(_one, u): u for u in seeds}
        for fut in as_completed(fut_map):
            u = fut_map[fut]
            try:
                unit_rows, photo_rows = fut.result()
                all_rows.extend(unit_rows)
                all_photos.extend(photo_rows)
                ok += 1
                logger.info("Parsed %d rows from %s", len(unit_rows), u)
            except Exception as e:
                fail += 1
                logger.error("Failed %s: %s", u, e)

    logger.info("Scrape done: ok=%d failed=%d total_rows=%d", ok, fail, len(all_rows))

    df = pd.DataFrame(all_rows)
    if df.empty:
        df = empty_typed_units_dataframe()
    else:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    pdf = pd.DataFrame(all_photos)

    ext = "csv" if output_format == "csv" else "parquet"
    units_file = os.path.join(output_dir, f"units.{ext}")
    photos_file = os.path.join(output_dir, f"images.{ext}")
    if output_format == "csv":
        df.to_csv(units_file, index=False)
        pdf.to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        pdf.to_parquet(photos_file, index=False)

    summary = quality_summary(df)
    summary_path = os.path.join(output_dir, "quality_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    logger.info("Quality summary: %s", json.dumps(summary))

    if env != "local":
        prefix = f"source=appfolio/stage=processed/entity=property/load_date={scraped_at}"
        upload_to_gcs(units_file, prefix)
        upload_to_gcs(photos_file, prefix)
        upload_to_gcs(summary_path, prefix)
    return units_file


def process_local(env: str, output_format: str = "parquet", scraped_at: str | None = None):
    from glob import glob as _glob

    pattern = f"env={env}/source=appfolio/stage=raw/entity=*/load_date={scraped_at or '*'}/page.html.gz"
    raw_files = sorted(_glob(pattern))
    if not raw_files:
        logger.warning("No raw files found: %s", pattern)
        return
    logger.info("Reprocessing %d raw files", len(raw_files))
    all_rows: list[dict] = []
    all_photos: list[dict] = []
    for gz in raw_files:
        with gzip.open(gz, "rt", encoding="utf-8") as f:
            html = f.read()
        parts = Path(gz).parts
        entity = [p for p in parts if p.startswith("entity=")]
        sub = entity[0].split("=", 1)[1] if entity else "unknown"
        base_url = f"https://{sub}.appfolio.com/listings/listings"
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        unit_rows, photo_rows = parse_listings_page(html, base_url, ts)
        all_rows.extend(unit_rows)
        all_photos.extend(photo_rows)
    date_str = scraped_at or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    output_dir = f"env={env}/source=appfolio/stage=processed/entity=property/load_date={date_str}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(all_rows)
    if df.empty:
        df = empty_typed_units_dataframe()
    else:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    pdf = pd.DataFrame(all_photos)
    df.to_parquet(os.path.join(output_dir, "units.parquet"), index=False)
    pdf.to_parquet(os.path.join(output_dir, "images.parquet"), index=False)
    summary = quality_summary(df)
    with open(os.path.join(output_dir, "quality_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    logger.info("Reprocessed: %d rows -> %s", len(df), output_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AppFolio scraper + discovery")
    parser.add_argument("--env", required=True, choices=["local", "dev", "test", "prod"])
    parser.add_argument("--mode", default="scrape", choices=["discover", "scrape", "process_local"])
    parser.add_argument("--seeds", nargs="*", default=["seeds_discovered.txt"])
    parser.add_argument("--format", default="parquet", choices=["parquet", "csv"])
    parser.add_argument("--max_workers", type=int, default=6)
    parser.add_argument("--max_properties", type=int, default=None)
    parser.add_argument("--max_subs", type=int, default=5000)
    parser.add_argument("--max_probe_workers", type=int, default=20)
    parser.add_argument("--nyc_only", action="store_true", default=True)
    parser.add_argument("--all_regions", action="store_true")
    parser.add_argument("--probe_output", default="seeds_discovered.txt")
    parser.add_argument("--scrape_date", default=None)
    args = parser.parse_args()

    if args.mode == "discover":
        run_discovery(
            max_subs=args.max_subs,
            max_probe_workers=args.max_probe_workers,
            nyc_only=not args.all_regions,
            probe_output=args.probe_output,
        )
    elif args.mode == "scrape":
        run_scraper(
            env=args.env,
            seeds_paths=args.seeds,
            output_format=args.format,
            max_workers=args.max_workers,
            max_properties=args.max_properties,
        )
    else:
        process_local(env=args.env, output_format=args.format, scraped_at=args.scrape_date)
