"""
Douglas Elliman rental listing scraper.

Elliman.com is a Next.js app (React Server Components) powered by Purlin.AI.
Uses Playwright to render pages and intercept the underlying data API.

Modes:
  scrape   — launch headless browser, crawl rental search pages, save raw JSON + HTML
  process_local — reprocess saved raw files into units.parquet + images.parquet

Usage:
  python elliman_scraper.py --env local --mode scrape --max_pages 10
  python elliman_scraper.py --env local --mode process_local --scrape_date 2026-04-02
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
COMPANY = "Douglas Elliman"
SOURCE = "elliman"

# NYC metro bounding box for geo-filtering
NYC_BBOX = {"south": 40.25, "north": 41.12, "west": -74.45, "east": -73.55}

# Search entry points for NYC rental pages
NYC_SEARCH_URLS = [
    "https://www.elliman.com/rentals/new-york-city",
    "https://www.elliman.com/rentals/brooklyn",
    "https://www.elliman.com/rentals/queens",
    "https://www.elliman.com/rentals/bronx",
    "https://www.elliman.com/rentals/hoboken-nj",
    "https://www.elliman.com/rentals/jersey-city-nj",
]

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/elliman_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("elliman_scraper")


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
    Parse a single listing from Elliman's API/data response.
    Elliman uses Purlin.AI; schema varies — this handles common patterns.
    """
    listing_id_raw = (item.get("listingId") or item.get("coreListingId")
                      or item.get("id") or item.get("webId")
                      or item.get("mlsId") or item.get("listingKey"))
    if not listing_id_raw:
        return None, []

    listing_id = f"elliman_{listing_id_raw}"

    # Address extraction (multiple possible shapes)
    address_obj = item.get("address", {})
    if isinstance(address_obj, str):
        address = address_obj
        city = state = zipcode = None
    else:
        address = (address_obj.get("streetAddress") or address_obj.get("line1")
                   or address_obj.get("fullAddress") or "")
        city = (address_obj.get("city") or address_obj.get("addressLocality")
                or item.get("city"))
        state = (address_obj.get("state") or address_obj.get("addressRegion")
                 or item.get("state"))
        zipcode = (address_obj.get("zipCode") or address_obj.get("postalCode")
                   or item.get("zipCode"))

    loc_obj = item.get("location") or {}
    if isinstance(loc_obj, str):
        loc_obj = {}
    lat = _parse_float(item.get("latitude") or item.get("lat")
                       or loc_obj.get("lat") or loc_obj.get("latitude")
                       or (item.get("geo", {}) or {}).get("latitude")
                       or (item.get("coordinates", {}) or {}).get("lat"))
    lon = _parse_float(item.get("longitude") or item.get("lng") or item.get("lon")
                       or loc_obj.get("lng") or loc_obj.get("longitude")
                       or (item.get("geo", {}) or {}).get("longitude")
                       or (item.get("coordinates", {}) or {}).get("lng"))

    price = _parse_float(item.get("price") or item.get("listPrice")
                         or item.get("rent") or item.get("monthlyRent")
                         or item.get("askingRent"))
    beds = _parse_float(item.get("bedrooms") or item.get("beds") or item.get("bedroomCount"))
    baths = _parse_float(item.get("bathrooms") or item.get("baths") or item.get("bathroomCount"))
    sqft = _parse_float(item.get("squareFeet") or item.get("sqft")
                        or item.get("livingArea") or item.get("interiorSqft"))

    property_name = item.get("buildingName") or item.get("propertyName") or ""
    description = item.get("description") or item.get("remarks") or ""
    listing_url = item.get("url") or item.get("detailUrl") or item.get("listingUrl") or ""
    if listing_url and not listing_url.startswith("http"):
        listing_url = f"https://www.elliman.com{listing_url}"

    # Images
    photos: list[dict] = []
    raw_images = item.get("images") or item.get("photos") or item.get("media") or []
    image_urls = []
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

    row = {
        "listing_id": listing_id,
        "property_id": str(listing_id_raw),
        "alternate_property_id": item.get("mlsId"),
        "property_name": property_name[:500] if property_name else None,
        "address": address,
        "city": city,
        "state": state,
        "zipcode": zipcode,
        "latitude": lat,
        "longitude": lon,
        "floor_plan": None,
        "unit_name": item.get("unitNumber") or item.get("unit") or item.get("aptNumber"),
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
        "phone": item.get("agentPhone") or item.get("contactPhone"),
        "description": description[:2000] if description else None,
        "images": json.dumps(image_urls),
        "website": "www.elliman.com",
        "company": COMPANY,
        "building_type": item.get("propertyType", "apartment"),
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
    """Fallback: parse a listing card from rendered HTML."""
    from bs4 import Tag
    if not isinstance(card_el, Tag):
        return None, []

    link = card_el.find("a", href=True)
    listing_url = ""
    listing_id_raw = ""
    if link:
        href = link["href"]
        listing_url = href if href.startswith("http") else f"https://www.elliman.com{href}"
        parts = href.rstrip("/").split("/")
        listing_id_raw = parts[-1] if parts else ""

    if not listing_id_raw:
        return None, []

    listing_id = f"elliman_{listing_id_raw}"

    # Price
    price = None
    price_el = card_el.find(string=re.compile(r"\$[\d,]+"))
    if price_el:
        m = re.search(r"\$([\d,]+)", str(price_el))
        if m:
            price = _parse_float(m.group(1))

    # Address
    address_el = card_el.find(class_=re.compile(r"address|location|street", re.I))
    address = address_el.get_text(strip=True) if address_el else None

    # Beds/baths/sqft from text
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
        "website": "www.elliman.com",
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


# ── Scrape mode ──────────────────────────────────────────────────────────────


def scrape_via_api(env: str, max_pages: int = 20) -> tuple[list[dict], list[dict]]:
    """
    Directly call the Elliman core API (core.api.elliman.com/listing/filter).
    This is a POST JSON endpoint that accepts filter criteria and a geometry polygon.
    Paginate using skip/take parameters.
    """
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    all_rows: list[dict] = []
    all_photos: list[dict] = []
    seen_ids: set[str] = set()

    TAKE = 50  # listings per page
    API_URL = "https://core.api.elliman.com/listing/filter"

    # NYC metro bounding box as a polygon
    w, s, e, n = NYC_BBOX["west"], NYC_BBOX["south"], NYC_BBOX["east"], NYC_BBOX["north"]
    nyc_polygon = [[[w, s], [e, s], [e, n], [w, n], [w, s]]]

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Referer": "https://www.elliman.com/",
        "Origin": "https://www.elliman.com",
    }

    for page_idx in range(max_pages):
        skip = page_idx * TAKE
        payload = {
            "filter": {
                "styles": None,
                "statuses": ["Active", "ActiveUnderContract", "Pending", "ComingSoon"],
                "features": None,
                "homeTypes": None,
                "timeOnMls": None,
                "isAgencyOnly": False,
                "isPetAllowed": False,
                "hasOpenHouse": False,
                "rentalPeriods": None,
                "bedroomsTotal": None,
                "isPriceReduced": False,
                "hasVirtualTour": False,
                "isNewConstruction": False,
                "onlyInternationalListings": False,
                "listingTypes": ["ResidentialLease"],
                "bathroom": {"queryField": "TotalDecimal", "operator": "Ge", "value": None},
                "listPrice": {"min": None, "max": None},
                "yearBuilt": {"min": None, "max": None},
                "lotSizeSquareFeet": {"min": None, "max": None},
                "livingAreaSquareFeet": {"min": None, "max": None},
                "orderBy": "PriceDesc",
                "parkingTotal": {"min": None, "max": None},
                "schoolFilter": {"score": None, "isPrivate": None},
                "moveIn": {"date": None, "skipNulls": None},
                "skip": skip,
                "take": TAKE,
                "places": [],
            },
            "map": {
                "zoomLevel": 11,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": nyc_polygon,
                },
            },
            "currencyTo": "USD",
        }

        logger.info("API page %d (skip=%d, take=%d)...", page_idx + 1, skip, TAKE)
        try:
            resp = requests.post(API_URL, json=payload, headers=headers, timeout=30)
            resp.raise_for_status()
            data = resp.json()
        except Exception as exc:
            logger.error("API request failed: %s", exc)
            break

        listings = data.get("listings") or []
        total_count = data.get("totalCount")
        logger.info("  Got %d listings (totalCount=%s)", len(listings), total_count)

        if not listings:
            logger.info("  No more listings, stopping pagination.")
            break

        for item in listings:
            row, photos = parse_listing_from_api(item, scraped_ts)
            if row and row["listing_id"] not in seen_ids:
                seen_ids.add(row["listing_id"])
                all_rows.append(row)
                all_photos.extend(photos)
                if env == "local":
                    save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])

        # Stop if we've fetched all
        if total_count is not None and skip + TAKE >= total_count:
            logger.info("  Reached totalCount=%d, done.", total_count)
            break

        time.sleep(1)  # Be polite

    logger.info("API scrape complete: %d listings, %d photos", len(all_rows), len(all_photos))
    return all_rows, all_photos


def scrape_with_playwright(env: str, max_pages: int = 20) -> tuple[list[dict], list[dict]]:
    """Use Playwright to render Elliman search pages and intercept listing API data."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("playwright required for browser fallback")
        return [], []

    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    all_rows: list[dict] = []
    all_photos: list[dict] = []
    seen_ids: set[str] = set()
    captured_api_responses: list[dict] = []

    def on_response(response):
        """Intercept ALL core.api.elliman.com JSON responses."""
        url = response.url
        if response.status != 200:
            return
        content_type = response.headers.get("content-type", "")
        if "json" not in content_type:
            return
        # Capture ALL Elliman API responses (not just listing/filter)
        if "core.api.elliman.com" in url:
            try:
                body = response.json()
                if isinstance(body, (dict, list)):
                    captured_api_responses.append({"url": url, "data": body})
                    logger.info("Captured API: %s", url[:80])
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

        for search_url in NYC_SEARCH_URLS:
            logger.info("Loading: %s", search_url)
            try:
                page.goto(search_url, wait_until="domcontentloaded", timeout=60000)
                # Wait for any Elliman API response
                try:
                    page.wait_for_response(
                        lambda r: "core.api.elliman.com" in r.url and r.status == 200,
                        timeout=15000
                    )
                except Exception:
                    pass
                time.sleep(3)
                # Scroll to trigger more data
                page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
                time.sleep(1)
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                time.sleep(2)
            except Exception as exc:
                logger.warning("Failed: %s: %s", search_url, exc)
                continue

            # Extract __NEXT_DATA__ from rendered HTML (Next.js hydration)
            try:
                next_data_json = page.evaluate("""
                    (() => {
                        const el = document.getElementById('__NEXT_DATA__');
                        return el ? el.textContent : null;
                    })()
                """)
                if next_data_json:
                    next_data = json.loads(next_data_json)
                    captured_api_responses.append({
                        "url": f"__NEXT_DATA__:{search_url}",
                        "data": next_data,
                    })
                    logger.info("  Captured __NEXT_DATA__ from %s", search_url)
            except Exception as exc:
                logger.debug("  __NEXT_DATA__ extraction failed: %s", exc)

        # Process ALL accumulated API responses + __NEXT_DATA__
        logger.info("Processing %d captured responses...", len(captured_api_responses))
        for captured in list(captured_api_responses):
            data = captured["data"]
            url = captured["url"]
            # Direct extraction for known Elliman API format
            if isinstance(data, dict) and "listings" in data and isinstance(data["listings"], list):
                listings = data["listings"]
                logger.info("  Direct 'listings' key from %s: %d items (totalCount=%s)",
                           url[:60], len(listings), data.get("totalCount"))
            # Handle clustered endpoint: groupedListings may contain individual listings
            elif isinstance(data, dict) and "groupedListings" in data:
                listings = []
                for group in (data.get("groupedListings") or []):
                    if isinstance(group, dict) and _looks_like_listing(group):
                        listings.append(group)
                    elif isinstance(group, list):
                        listings.extend(g for g in group if isinstance(g, dict) and _looks_like_listing(g))
                # Also check clusterMarkers for individual listing data
                for marker in (data.get("clusterMarkers") or []):
                    if isinstance(marker, dict) and _looks_like_listing(marker):
                        listings.append(marker)
                logger.info("  Clustered/grouped from %s: %d items", url[:60], len(listings))
            else:
                listings = _extract_listings_from_response(data)
                if listings:
                    logger.info("  Heuristic from %s: %d items", url[:60], len(listings))
            for item in listings:
                row, photos = parse_listing_from_api(item, scraped_ts)
                if row and row["listing_id"] not in seen_ids:
                    seen_ids.add(row["listing_id"])
                    all_rows.append(row)
                    all_photos.extend(photos)
                    if env == "local":
                        save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])

        logger.info("Extracted %d listings from intercepted API responses", len(all_rows))

        browser.close()
    logger.info("Playwright scrape complete: %d listings, %d photos", len(all_rows), len(all_photos))
    return all_rows, all_photos


def _extract_listings_from_response(data) -> list[dict]:
    """Recursively find listing-like objects in an API response."""
    results: list[dict] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and _looks_like_listing(item):
                results.append(item)
            elif isinstance(item, (dict, list)):
                results.extend(_extract_listings_from_response(item))
        return results

    if isinstance(data, dict):
        for key in ("results", "listings", "properties", "data", "items",
                     "searchResults", "rentals", "records", "edges", "nodes"):
            if key in data:
                child = data[key]
                if isinstance(child, list):
                    for item in child:
                        if isinstance(item, dict):
                            # Handle GraphQL edge/node pattern
                            node = item.get("node", item)
                            if isinstance(node, dict) and _looks_like_listing(node):
                                results.append(node)
                            elif isinstance(node, (dict, list)):
                                results.extend(_extract_listings_from_response(node))
                elif isinstance(child, dict):
                    results.extend(_extract_listings_from_response(child))
                if results:
                    return results

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
    has_price = bool(keys_lower & {"price", "listprice", "rent", "monthlyrent",
                                    "rentprice", "askingrent", "currentprice",
                                    "priceint", "closeprice"})
    has_location = bool(keys_lower & {"address", "streetaddress", "latitude", "lat",
                                       "city", "fulladdress", "displayaddress"})
    has_id = bool(keys_lower & {"listingid", "id", "mlsid", "propertyid",
                                 "listingkey", "corelistingid", "webid"})
    # Elliman-specific: check for nested address objects
    if not has_location and "address" in d and isinstance(d["address"], dict):
        has_location = True
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
            "listing_id": "elliman_placeholder",
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
    parser = argparse.ArgumentParser(description="Douglas Elliman rental listing scraper")
    parser.add_argument("--env", choices=("local", "dev", "test", "prod"), default="local")
    parser.add_argument("--mode", choices=("scrape", "process_local"), default="scrape")
    parser.add_argument("--max_pages", type=int, default=20, help="Max search pages to crawl")
    parser.add_argument("--scrape_date", type=str, default=None,
                        help="Date to reprocess (YYYY-MM-DD), for process_local mode")
    parser.add_argument("--format", choices=("parquet", "csv"), default="parquet")
    args = parser.parse_args()

    load_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if args.mode == "scrape":
        logger.info("Starting Elliman scrape (env=%s, max_pages=%d)", args.env, args.max_pages)
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
