"""
Corcoran rental listing scraper.

Corcoran.com is a JS-heavy SPA (React) with Cloudflare protection.
Uses Playwright to render pages and intercept the underlying search API.

Modes:
  scrape   — launch headless browser, crawl rental search pages, save raw JSON + HTML
  process_local — reprocess saved raw files into units.parquet + images.parquet

Usage:
  python corcoran_scraper.py --env local --mode scrape --max_pages 10
  python corcoran_scraper.py --env local --mode process_local --scrape_date 2026-04-02
"""
from __future__ import annotations

import argparse
import gzip
import json
import logging
import os
import re
import sys
import time
from datetime import datetime, timezone
from glob import glob
from pathlib import Path
from urllib.parse import urlencode, urlparse

import pandas as pd
import requests

_REPO_ROOT = Path(__file__).resolve().parents[1]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

GCS_BUCKET = "scrapers-v2"
COMPANY = "Corcoran"
SOURCE = "corcoran"

# NYC metro bounding box for geo-filtering
NYC_BBOX = {"south": 40.25, "north": 41.12, "west": -74.45, "east": -73.55}

# Search entry points for NYC rental pages
NYC_SEARCH_URLS = [
    "https://www.corcoran.com/search/for-rent/location/nyc-new-york-ny-10001/regionId/1",
    "https://www.corcoran.com/search/for-rent/location/brooklyn-ny/regionId/2",
    "https://www.corcoran.com/search/for-rent/location/queens-ny/regionId/7",
    "https://www.corcoran.com/search/for-rent/location/bronx-ny/regionId/8",
    "https://www.corcoran.com/search/for-rent/location/hoboken-nj/regionId/50",
    "https://www.corcoran.com/search/for-rent/location/jersey-city-nj/regionId/51",
]

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/corcoran_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("corcoran_scraper")


# ── Helpers ──────────────────────────────────────────────────────────────────


def _parse_float(v) -> float | None:
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip().replace(",", "")
    m = re.search(r"[\d]+(?:\.\d+)?", s)
    return float(m.group(0)) if m else None


def _parse_int(v) -> int | None:
    f = _parse_float(v)
    return int(f) if f is not None else None


def in_nyc_bbox(lat: float | None, lon: float | None) -> bool:
    if lat is None or lon is None:
        return False
    return (NYC_BBOX["south"] <= lat <= NYC_BBOX["north"]
            and NYC_BBOX["west"] <= lon <= NYC_BBOX["east"])


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError("google-cloud-storage required for non-local envs") from e
    return storage.Client()


# ── Raw save / load ─────────────────────────────────────────────────────────


def save_raw_gz(env: str, data: dict | str, listing_id: str, scraped_at: str):
    """Save raw listing data as gzipped JSON."""
    text = data if isinstance(data, str) else json.dumps(data, ensure_ascii=False)
    path = (
        f"env={env}/source={SOURCE}/stage=raw/entity=property/"
        f"property_id={listing_id}/scraped_at={scraped_at}/listing.json.gz"
    )
    if env == "local":
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            f.write(text)
    else:
        client = _gcs_client()
        client.bucket(GCS_BUCKET).blob(path).upload_from_string(
            gzip.compress(text.encode("utf-8")), content_type="application/gzip"
        )


def load_raw_files(env: str, scrape_date: str) -> list[dict]:
    """Load previously saved raw JSON files for reprocessing."""
    pattern = f"env={env}/source={SOURCE}/stage=raw/entity=property/*/scraped_at={scrape_date}/*.json.gz"
    files = sorted(glob(pattern))
    logger.info("Found %d raw files for %s", len(files), scrape_date)
    out = []
    for fp in files:
        try:
            with gzip.open(fp, "rt", encoding="utf-8") as f:
                out.append(json.loads(f.read()))
        except Exception as exc:
            logger.warning("Failed to read %s: %s", fp, exc)
    return out


# ── Parsing ──────────────────────────────────────────────────────────────────


def parse_listing_from_api(item: dict, scraped_ts: str) -> tuple[dict | None, list[dict]]:
    """
    Parse a single listing from Corcoran's backendapi.corcoranlabs.com/api/search/listings.

    API item keys include: listingId, propertyId, totalBathrooms, totalBedrooms,
    maximumLeaseRate, minimumLeaseRate, location, squareFootage, agents,
    floorplans, isBuilding, unitType, neighborhoodId, sourceId, sourceKey
    """
    listing_id_raw = item.get("listingId") or item.get("id") or item.get("mlsId")
    if not listing_id_raw:
        return None, []

    listing_id = f"corcoran_{listing_id_raw}"

    # Location is nested: location.address, location.city, etc.
    loc = item.get("location") or {}
    address = loc.get("address") or loc.get("streetAddress") or ""
    city = loc.get("city") or loc.get("addressLocality")
    state = loc.get("state") or loc.get("addressRegion")
    zipcode = loc.get("zipCode") or loc.get("postalCode")
    neighborhood = loc.get("neighborhood") or item.get("neighborhood")

    lat = _parse_float(loc.get("latitude") or item.get("latitude") or item.get("lat"))
    lon = _parse_float(loc.get("longitude") or item.get("longitude") or item.get("lng"))

    # Price: maximumLeaseRate / minimumLeaseRate
    price = _parse_float(item.get("maximumLeaseRate") or item.get("minimumLeaseRate")
                         or item.get("price") or item.get("listPrice"))
    price_min = _parse_float(item.get("minimumLeaseRate"))

    beds = _parse_float(item.get("totalBedrooms") or item.get("bedrooms") or item.get("beds"))
    baths = _parse_float(item.get("totalBathrooms") or item.get("bathrooms") or item.get("baths"))
    sqft = _parse_float(item.get("squareFootage") or item.get("squareFeet") or item.get("sqft"))

    property_name = (loc.get("buildingName") or item.get("buildingName")
                     or item.get("propertyName") or "")
    description = item.get("description") or item.get("remarks") or ""

    # Build listing URL from sourceKey or listingId
    source_key = item.get("sourceKey") or ""
    listing_url = item.get("url") or item.get("listingUrl") or ""
    if not listing_url and source_key:
        listing_url = f"https://www.corcoran.com/listing/{source_key}"
    elif not listing_url:
        listing_url = f"https://www.corcoran.com/listing/{listing_id_raw}"
    elif listing_url and not listing_url.startswith("http"):
        listing_url = f"https://www.corcoran.com{listing_url}"

    # Images from floorplans or images array
    photos: list[dict] = []
    image_urls = []
    raw_images = item.get("images") or item.get("photos") or item.get("media") or []
    for img in raw_images:
        url = img if isinstance(img, str) else (img.get("url") or img.get("uri") or "")
        if url:
            image_urls.append(url)
            photos.append({
                "listing_id": listing_id,
                "property_id": str(listing_id_raw),
                "image_url": url,
                "image_alt": img.get("caption", "") if isinstance(img, dict) else "",
            })

    # Also check for photo in the item's imageUrl or primaryImage
    primary_img = item.get("imageUrl") or item.get("primaryImage") or item.get("thumbnailUrl")
    if primary_img and primary_img not in image_urls:
        image_urls.append(primary_img)
        photos.append({
            "listing_id": listing_id,
            "property_id": str(listing_id_raw),
            "image_url": primary_img,
            "image_alt": "",
        })

    unit_type = item.get("unitType") or item.get("propertyType") or "apartment"

    row = {
        "listing_id": listing_id,
        "property_id": str(item.get("propertyId") or listing_id_raw),
        "alternate_property_id": item.get("sourceId") or item.get("mlsId"),
        "property_name": property_name[:500] if property_name else None,
        "address": address,
        "city": city,
        "state": state,
        "zipcode": zipcode,
        "latitude": lat,
        "longitude": lon,
        "floor_plan": None,
        "unit_name": item.get("unitNumber") or item.get("unit"),
        "unit_id": str(listing_id_raw),
        "beds": beds,
        "baths": baths,
        "sqft": sqft,
        "rent_price": price,
        "rent_max": price,
        "deposit": None,
        "availability_status": "available",
        "available_at": item.get("availableDate") or item.get("dateAvailable"),
        "lease_url": None,
        "lease_term": None,
        "listing_url": listing_url,
        "email": None,
        "phone": None,
        "description": description[:2000] if description else None,
        "images": json.dumps(image_urls),
        "website": "www.corcoran.com",
        "company": COMPANY,
        "building_type": unit_type,
        "building_subtype": item.get("propertySubType"),
        "floor_number": _parse_float(item.get("floor")),
        "fees": json.dumps([]),
        "year_built": item.get("yearBuilt"),
        "total_units": None,
        "stories": None,
        "scraped_timestamp": scraped_ts,
    }
    return row, photos


def parse_listing_from_html(card_el, scraped_ts: str) -> tuple[dict | None, list[dict]]:
    """
    Fallback: parse a listing card from rendered HTML using BeautifulSoup element.
    Called when API interception doesn't capture data.
    """
    from bs4 import Tag
    if not isinstance(card_el, Tag):
        return None, []

    # Try to extract listing URL
    link = card_el.find("a", href=True)
    listing_url = ""
    listing_id_raw = ""
    if link:
        href = link["href"]
        listing_url = href if href.startswith("http") else f"https://www.corcoran.com{href}"
        # Extract ID from URL path
        parts = href.rstrip("/").split("/")
        listing_id_raw = parts[-1] if parts else ""

    if not listing_id_raw:
        return None, []

    listing_id = f"corcoran_{listing_id_raw}"

    # Price
    price_el = card_el.find(string=re.compile(r"\$[\d,]+"))
    price = None
    if price_el:
        price = _parse_float(re.search(r"\$([\d,]+)", str(price_el)).group(1))

    # Address
    address_el = card_el.find(class_=re.compile(r"address|location", re.I))
    address = address_el.get_text(strip=True) if address_el else None

    # Beds/baths
    beds = baths = sqft = None
    detail_text = card_el.get_text(" ", strip=True)
    bed_match = re.search(r"(\d+)\s*(?:bed|br|bedroom)", detail_text, re.I)
    bath_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:bath|ba|bathroom)", detail_text, re.I)
    sqft_match = re.search(r"([\d,]+)\s*(?:sq\.?\s*ft|sqft|sf)", detail_text, re.I)
    if bed_match:
        beds = _parse_float(bed_match.group(1))
    if bath_match:
        baths = _parse_float(bath_match.group(1))
    if sqft_match:
        sqft = _parse_float(sqft_match.group(1))

    # Image
    photos = []
    img_el = card_el.find("img", src=True)
    image_urls = []
    if img_el:
        img_url = img_el["src"]
        if img_url.startswith("//"):
            img_url = f"https:{img_url}"
        image_urls.append(img_url)
        photos.append({
            "listing_id": listing_id,
            "property_id": listing_id_raw,
            "image_url": img_url,
            "image_alt": img_el.get("alt", ""),
        })

    row = {
        "listing_id": listing_id,
        "property_id": listing_id_raw,
        "alternate_property_id": None,
        "property_name": None,
        "address": address,
        "city": None,
        "state": "NY",
        "zipcode": None,
        "latitude": None,
        "longitude": None,
        "floor_plan": None,
        "unit_name": None,
        "unit_id": listing_id_raw,
        "beds": beds,
        "baths": baths,
        "sqft": sqft,
        "rent_price": price,
        "rent_max": price,
        "deposit": None,
        "availability_status": "available" if price else None,
        "available_at": None,
        "lease_url": None,
        "lease_term": None,
        "listing_url": listing_url,
        "email": None,
        "phone": None,
        "description": None,
        "images": json.dumps(image_urls),
        "website": "www.corcoran.com",
        "company": COMPANY,
        "building_type": "apartment",
        "building_subtype": None,
        "floor_number": None,
        "fees": json.dumps([]),
        "year_built": None,
        "total_units": None,
        "stories": None,
        "scraped_timestamp": scraped_ts,
    }
    return row, photos


# ── Direct API scrape ────────────────────────────────────────────────────────

# Region IDs for NYC metro
CORCORAN_REGIONS = {
    "1": "NYC (Manhattan)",
    "2": "Brooklyn",
    "7": "Queens",
    "8": "Bronx",
    "50": "Hoboken",
    "51": "Jersey City",
}


def scrape_via_api(env: str, max_pages: int = 20) -> tuple[list[dict], list[dict]]:
    """
    Directly call Corcoran's backend API (backendapi.corcoranlabs.com/api/search/listings).
    Paginate through all regions using page/pageSize parameters.
    """
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    all_rows: list[dict] = []
    all_photos: list[dict] = []
    seen_ids: set[str] = set()

    API_URL = "https://backendapi.corcoranlabs.com/api/search/listings"
    PAGE_SIZE = 48

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Referer": "https://www.corcoran.com/",
        "Origin": "https://www.corcoran.com",
    }

    for region_id, region_name in CORCORAN_REGIONS.items():
        logger.info("Scraping region %s (%s)...", region_id, region_name)

        for page_num in range(1, max_pages + 1):
            payload = {
                "page": page_num,
                "pageSize": PAGE_SIZE,
                "transactionTypes": ["for-rent"],
                "regionIds": [region_id],
                "sortBy": ["recommended+desc"],
                "locale": {"currency": "USD", "language": "en-US", "measure": "imperial"},
                "address": [],
                "agentNames": [],
                "dateTimeOffset": "-4:0:00",
                "keywordSearch": "",
                "openHouseDays": [],
                "keywords": [],
                "zipcodes": [],
                "citiesOrBoroughs": [],
                "advertiseNoFee": None,
                "cities": [],
                "neighborhoods": [],
                "propertyTypes": [""],
                "features": [""],
                "countries": [],
                "places": [],
            }

            logger.info("  Region %s page %d...", region_id, page_num)
            try:
                resp = requests.post(API_URL, json=payload, headers=headers, timeout=30)
                resp.raise_for_status()
                data = resp.json()
            except Exception as exc:
                logger.error("  API request failed: %s", exc)
                break

            items = data.get("items") or []
            total_pages = data.get("totalPages") or 0
            total_items = data.get("totalItems") or 0
            logger.info("  Got %d items (totalItems=%s, totalPages=%s)", len(items), total_items, total_pages)

            if not items:
                break

            for item in items:
                row, photos = parse_listing_from_api(item, scraped_ts)
                if row and row["listing_id"] not in seen_ids:
                    seen_ids.add(row["listing_id"])
                    all_rows.append(row)
                    all_photos.extend(photos)
                    if env == "local":
                        save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])

            if page_num >= total_pages:
                logger.info("  Reached last page (%d/%d) for region %s", page_num, total_pages, region_id)
                break

            time.sleep(1)

    logger.info("API scrape complete: %d listings, %d photos", len(all_rows), len(all_photos))
    return all_rows, all_photos


# ── Playwright fallback ──────────────────────────────────────────────────────


def scrape_with_playwright(env: str, max_pages: int = 20) -> tuple[list[dict], list[dict]]:
    """
    Use Playwright to render Corcoran search pages and capture listing data.
    Strategy:
      1. Intercept XHR/fetch responses containing listing JSON
      2. Fall back to DOM scraping if API interception yields nothing
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("playwright is required. Install: pip install playwright && playwright install chromium")
        return [], []

    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    all_rows: list[dict] = []
    all_photos: list[dict] = []
    seen_ids: set[str] = set()
    captured_api_responses: list[dict] = []

    def on_response(response):
        """Intercept API responses that contain listing data."""
        url = response.url
        if response.status != 200:
            return
        content_type = response.headers.get("content-type", "")
        if "json" not in content_type and "javascript" not in content_type:
            return
        # Look for search/listing API endpoints
        if any(kw in url.lower() for kw in ("search", "listing", "property", "rental", "result")):
            try:
                body = response.json()
                if isinstance(body, dict):
                    captured_api_responses.append({"url": url, "data": body})
                elif isinstance(body, list) and body:
                    captured_api_responses.append({"url": url, "data": body})
            except Exception:
                pass

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
        )
        page = context.new_page()
        page.on("response", on_response)

        pages_scraped = 0
        for search_url in NYC_SEARCH_URLS:
            if pages_scraped >= max_pages:
                break

            logger.info("Loading search page: %s", search_url)
            try:
                page.goto(search_url, wait_until="domcontentloaded", timeout=60000)
                # Wait for SPA to render
                time.sleep(5)
                # Scroll to trigger lazy loading
                page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
                time.sleep(2)
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(3)
            except Exception as exc:
                logger.warning("Failed to load %s: %s", search_url, exc)
                continue

            # Try extracting from intercepted API responses
            for captured in captured_api_responses:
                listings = _extract_listings_from_response(captured["data"])
                for item in listings:
                    row, photos = parse_listing_from_api(item, scraped_ts)
                    if row and row["listing_id"] not in seen_ids:
                        seen_ids.add(row["listing_id"])
                        all_rows.append(row)
                        all_photos.extend(photos)
                        if env == "local":
                            save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])

            captured_api_responses.clear()

            # Fallback: DOM scraping
            if not all_rows:
                logger.info("No API data captured, falling back to DOM scraping")
                html = page.content()
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(html, "lxml")

                # Look for listing cards by common patterns
                cards = (
                    soup.find_all(attrs={"data-testid": re.compile(r"listing|property|card", re.I)})
                    or soup.find_all(class_=re.compile(r"listing.?card|property.?card|search.?result", re.I))
                    or soup.find_all("article")
                )
                logger.info("Found %d DOM listing cards", len(cards))

                for card in cards:
                    row, photos = parse_listing_from_html(card, scraped_ts)
                    if row and row["listing_id"] not in seen_ids:
                        seen_ids.add(row["listing_id"])
                        all_rows.append(row)
                        all_photos.extend(photos)

            # Try pagination — click "next" or scroll
            for page_num in range(2, max_pages - pages_scraped + 1):
                try:
                    next_btn = page.query_selector(
                        'button:has-text("Next"), a:has-text("Next"), '
                        '[aria-label="Next page"], [data-testid*="next"]'
                    )
                    if not next_btn or not next_btn.is_visible():
                        logger.info("No more pages for %s", search_url)
                        break
                    next_btn.click()
                    page.wait_for_load_state("networkidle", timeout=30000)
                    time.sleep(2)
                    pages_scraped += 1

                    for captured in captured_api_responses:
                        listings = _extract_listings_from_response(captured["data"])
                        for item in listings:
                            row, photos = parse_listing_from_api(item, scraped_ts)
                            if row and row["listing_id"] not in seen_ids:
                                seen_ids.add(row["listing_id"])
                                all_rows.append(row)
                                all_photos.extend(photos)
                                if env == "local":
                                    save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])
                    captured_api_responses.clear()

                except Exception as exc:
                    logger.warning("Pagination failed on page %d: %s", page_num, exc)
                    break

            pages_scraped += 1

        browser.close()

    logger.info("Scrape complete: %d listings, %d photos", len(all_rows), len(all_photos))
    return all_rows, all_photos


def _extract_listings_from_response(data) -> list[dict]:
    """
    Recursively find listing-like objects in an API response.
    Looks for arrays of dicts containing price/address/listing fields.
    """
    results: list[dict] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and _looks_like_listing(item):
                results.append(item)
            elif isinstance(item, (dict, list)):
                results.extend(_extract_listings_from_response(item))
        return results

    if isinstance(data, dict):
        # Check common response wrapper keys
        for key in ("results", "listings", "properties", "data", "items",
                     "searchResults", "rentals", "records"):
            if key in data:
                child = data[key]
                if isinstance(child, list):
                    for item in child:
                        if isinstance(item, dict) and _looks_like_listing(item):
                            results.append(item)
                        elif isinstance(item, (dict, list)):
                            results.extend(_extract_listings_from_response(item))
                elif isinstance(child, dict):
                    results.extend(_extract_listings_from_response(child))
                if results:
                    return results

        # Check if the dict itself is a listing
        if _looks_like_listing(data):
            results.append(data)
        else:
            for v in data.values():
                if isinstance(v, (dict, list)):
                    results.extend(_extract_listings_from_response(v))
    return results


def _looks_like_listing(d: dict) -> bool:
    """Heuristic: does this dict look like a rental listing?"""
    keys_lower = {k.lower() for k in d.keys()}
    has_price = bool(keys_lower & {"price", "listprice", "rent", "monthlyrent", "rentprice"})
    has_location = bool(keys_lower & {"address", "streetaddress", "latitude", "lat", "city"})
    has_id = bool(keys_lower & {"listingid", "id", "mlsid", "propertyid"})
    return has_price and (has_location or has_id)


# ── Output ───────────────────────────────────────────────────────────────────


def enforce_unit_types(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df
    string_cols = [
        "listing_id", "property_id", "alternate_property_id", "property_name",
        "address", "city", "state", "zipcode", "floor_plan", "unit_name",
        "unit_id", "availability_status", "available_at", "lease_url",
        "listing_url", "email", "phone", "description", "images",
        "website", "company", "building_type", "building_subtype",
        "fees", "year_built", "scraped_timestamp",
    ]
    float_cols = ["latitude", "longitude", "beds", "baths", "sqft",
                  "rent_price", "rent_max", "deposit", "floor_number",
                  "total_units", "stories"]
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].astype("string")
    for col in float_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").astype("Float64")
    return df


def empty_typed_units_dataframe() -> pd.DataFrame:
    return enforce_unit_types(
        pd.DataFrame([{
            "listing_id": "corcoran_placeholder",
            "property_id": "0",
            "alternate_property_id": None,
            "property_name": None,
            "address": None,
            "city": None,
            "state": None,
            "zipcode": None,
            "latitude": None,
            "longitude": None,
            "floor_plan": None,
            "unit_name": None,
            "unit_id": "0",
            "beds": None,
            "baths": None,
            "sqft": None,
            "rent_price": None,
            "rent_max": None,
            "deposit": None,
            "availability_status": "unavailable",
            "available_at": None,
            "lease_url": None,
            "lease_term": None,
            "listing_url": None,
            "email": None,
            "phone": None,
            "description": None,
            "images": "[]",
            "website": None,
            "company": COMPANY,
            "building_type": "apartment",
            "building_subtype": None,
            "floor_number": None,
            "fees": "[]",
            "year_built": None,
            "total_units": None,
            "stories": None,
            "scraped_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
        }])
    ).iloc[:0]


def save_parquet(env: str, rows: list[dict], photos: list[dict], load_date: str):
    base = f"env={env}/source={SOURCE}/stage=processed/entity=property/load_date={load_date}"
    os.makedirs(base, exist_ok=True)

    if rows:
        units_df = enforce_unit_types(pd.DataFrame(rows))
    else:
        units_df = empty_typed_units_dataframe()
    units_path = os.path.join(base, "units.parquet")
    units_df.to_parquet(units_path, index=False, engine="pyarrow")
    logger.info("Saved %d units to %s", len(units_df), units_path)

    if photos:
        photos_df = pd.DataFrame(photos)
    else:
        photos_df = pd.DataFrame(columns=["listing_id", "property_id", "image_url", "image_alt"])
    photos_path = os.path.join(base, "images.parquet")
    photos_df.to_parquet(photos_path, index=False, engine="pyarrow")
    logger.info("Saved %d images to %s", len(photos_df), photos_path)

    return units_path, photos_path


# ── Main ─────────────────────────────────────────────────────────────────────


def main() -> int:
    parser = argparse.ArgumentParser(description="Corcoran rental listing scraper")
    parser.add_argument("--env", choices=("local", "dev", "test", "prod"), default="local")
    parser.add_argument("--mode", choices=("scrape", "process_local"), default="scrape")
    parser.add_argument("--max_pages", type=int, default=20, help="Max search pages to crawl")
    parser.add_argument("--scrape_date", type=str, default=None,
                        help="Date to reprocess (YYYY-MM-DD), for process_local mode")
    parser.add_argument("--format", choices=("parquet", "csv"), default="parquet")
    args = parser.parse_args()

    load_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if args.mode == "scrape":
        logger.info("Starting Corcoran scrape (env=%s, max_pages=%d)", args.env, args.max_pages)
        rows, photos = scrape_via_api(args.env, max_pages=args.max_pages)
        if not rows:
            logger.info("Direct API returned 0 listings, falling back to Playwright...")
            rows, photos = scrape_with_playwright(args.env, max_pages=args.max_pages)
        if rows:
            save_parquet(args.env, rows, photos, load_date)
        else:
            logger.warning("No listings scraped")
            save_parquet(args.env, [], [], load_date)

    elif args.mode == "process_local":
        date = args.scrape_date or load_date
        logger.info("Reprocessing raw files for %s", date)
        raw_items = load_raw_files(args.env, date)
        scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        rows = []
        photos = []
        for item in raw_items:
            row, ph = parse_listing_from_api(item, scraped_ts)
            if row:
                rows.append(row)
                photos.extend(ph)
        save_parquet(args.env, rows, photos, date)

    logger.info("Done. %s mode complete.", args.mode)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
