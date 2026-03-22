from __future__ import annotations

import os
import re
import json
import time
from glob import glob
import argparse
import logging
import requests
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import urlencode
from concurrent.futures import ThreadPoolExecutor, as_completed
from bs4 import BeautifulSoup
import gzip
from proxy_manager import ProxyManager
import threading

# Constants
GCS_BUCKET = "scrapers-v2"


def _gcs_client():
    """Lazy import so `--env local` works without installing google-cloud-storage."""
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError(
            "google-cloud-storage is required when env is not 'local' (GCS upload/list). "
            "For local-only runs use --env local, or install: pip install google-cloud-storage"
        ) from e
    return storage.Client()

proxy_manager = ProxyManager([
    "IP_1:3128",
    "IP_1:3128",
    "IP_1:3128",
    "IP_1:3128",
])

# Setup logging
Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/greystar_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_filename),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("greystar_scraper")
logger.setLevel(logging.DEBUG)

thread_local = threading.local()


def get_state_urls_from_sitemap():
    sitemap_url = "https://www.greystar.com/sitemap.xml"
    response = requests.get(sitemap_url, timeout=20)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "xml")
    loc_tags = soup.find_all("loc")

    pattern = re.compile(r"^https://www\.greystar\.com/homes-to-rent/us/[a-z]{2}(/[a-z0-9\-]+)?$")

    state_urls = [
        tag.text.strip()
        for tag in loc_tags
        if pattern.match(tag.text.strip())
    ]

    return sorted(state_urls)


def filter_state_urls(state_urls: list[str], states: list[str] | None) -> list[str]:
    """Keep only /homes-to-rent/us/{code}/... URLs whose state code is in states (lowercase 2-letter)."""
    if not states:
        return state_urls
    want = {s.strip().lower() for s in states if s and len(s.strip()) == 2}
    if not want:
        return state_urls
    out = []
    for url in state_urls:
        m = re.search(r"/homes-to-rent/us/([a-z]{2})(?:/|$)", url)
        if m and m.group(1) in want:
            out.append(url)
    return out


def extract_property_urls_from_state_page(html: str) -> list:
    soup = BeautifulSoup(html, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__", type="application/json")
    if not script_tag:
        raise ValueError("Could not find __NEXT_DATA__ script tag")

    data = json.loads(script_tag.string)
    component_props = data.get("props", {}).get("pageProps", {}).get("componentProps", {})

    properties = None
    for comp in component_props.values():
        if isinstance(comp, dict) and "properties" in comp:
            properties = comp["properties"]
            break

    if not properties:
        raise ValueError("Could not find 'properties' list in __NEXT_DATA__")

    urls = []
    for item in properties:
        try:
            ec_brand = item.get("ec_brand", "").strip().lower().replace(" ", "-")
            click_uri = item.get("clickUri", "")
            city = item.get("additionalFields", {}).get("city", "").strip().lower().replace(" ", "-")
            prop_id = click_uri.strip("/").split("/")[-1]
            url = f"https://www.greystar.com/{ec_brand}-{city}/p_{prop_id}"
            urls.append(url)
        except Exception as e:
            print(f"⚠️ Failed to parse property: {e}")

    return urls


def flatten_units(prop_meta, units, url, scraped_at, extras=None):
    results = []
    extras = extras or {}

    prop_id = prop_meta.get("propertyId")
    prop_name = prop_meta.get("propertyName") or prop_meta.get("marketingName", "")
    lat = prop_meta.get("latitude")
    lon = prop_meta.get("longitude")

    for unit in units or []:
        sqft = unit.get("area")
        beds = unit.get("floorplan", {}).get("bedroomCount")
        baths = unit.get("floorplan", {}).get("bathroomCount")
        floorplan_name = unit.get("floorPlanLabel") or unit.get("floorplan", {}).get("label")
        # unit_name = unit.get("unitNumber")
        unit_name = f"{unit.get('buildingLabel')}-{unit.get('unitNumber')}" if unit.get("buildingLabel") else unit.get("unitNumber")
        unit_id = unit.get("unitId")
        #lease_url = leaseOnlineUrl
        #tour_url = tourUrl
        available = unit.get("availableOn")
        rent_min = unit.get("minPrice")
        rent_max = unit.get("maxPrice")
        deposit = None  # part of the fees json now
        lease_term = unit.get("leaseLength")
        floor_number = unit.get("floorShortLabel")

        listing_id = f"{prop_id}_{beds}_{baths}_{sqft}_{unit_name or 'NA'}"

        results.append({
            "listing_id": listing_id,
            "property_id": str(prop_id),
            "alternate_property_id": prop_meta.get("Id"),  # for compatibility
            "property_name": prop_name,
            "address": prop_meta.get("address", ""),
            "city": prop_meta.get("city", "").strip(),
            "state": prop_meta.get("state", ""),
            "zipcode": prop_meta.get("postalCode", ""),
            "latitude": lat,
            "longitude": lon,
            "floor_plan": floorplan_name,
            "unit_name": unit_name,
            "unit_id": unit_id,
            "beds": beds,
            "baths": baths,
            "sqft": int(float(sqft)) if sqft else None,
            "rent_price": float(rent_min) if rent_min else None,
            "rent_max": float(rent_max) if rent_max else None,
            "deposit": deposit,
            "availability_status": "available" if rent_min else "unavailable",
            "available_at": available,
            "lease_url": None,
            "lease_term": lease_term,
            "listing_url": url,
            "email": extras.get("email"),
            "phone": extras.get("phone"),
            "description": extras.get("description"),
            "images": json.dumps(extras.get("images", [])),
            "website": extras.get("website"),
            "company": "Greystar",
            "building_type": extras.get("building_type", "apartment"),
            "building_subtype": extras.get("building_subtype"),
            "floor_number": int(floor_number) if floor_number and floor_number.isdigit() else None,
            "community_amenities": json.dumps(extras.get("community_amenities", [])),
            "apartment_amenities": json.dumps(extras.get("apartment_amenities", [])),
            "fees": json.dumps(extras.get("fees", [])),
            "concessions": None,  # no field available in Greystar
            "year_built": None,
            "total_units": None,
            "stories": None,
            "scraped_timestamp": scraped_at,
        })

    return results


def _url_from_gallery_item(item) -> str | None:
    """Normalize Greystar imageGallery / photos entries to an http(s) URL string."""
    if item is None:
        return None
    if isinstance(item, str):
        s = item.strip()
        return s if s.startswith("http") else None
    if isinstance(item, dict):
        for key in (
            "url",
            "photoUrl",
            "src",
            "imageUrl",
            "image_url",
            "large",
            "medium",
            "small",
        ):
            v = item.get(key)
            if isinstance(v, str) and v.strip().startswith("http"):
                return v.strip()
    return None


def collect_image_urls_from_gallery(*iterables) -> list[str]:
    """Merge multiple gallery lists; preserve order; dedupe by URL."""
    seen: set[str] = set()
    out: list[str] = []
    for it in iterables:
        if not it:
            continue
        for raw in it:
            url = _url_from_gallery_item(raw)
            if url and url not in seen:
                seen.add(url)
                out.append(url)
    return out


def extract_photos(prop_meta, gallery_urls: list[str] | None = None):
    results = []
    photos: list = list(prop_meta.get("photos") or [])
    if gallery_urls:
        for u in gallery_urls:
            if isinstance(u, str) and u.strip().startswith("http"):
                photos.append({"url": u.strip()})
    property_id = prop_meta.get("propertyId")
    scraped_timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    for idx, photo in enumerate(photos):
        if isinstance(photo, str) and photo.strip().startswith("http"):
            url = photo.strip()
        elif isinstance(photo, dict):
            url = photo.get("url") or photo.get("photoUrl")
        else:
            continue
        if not url:
            continue
        photo_id = os.path.basename(url.split("?")[0])
        results.append({
            "property_id": property_id,
            "image_id": photo_id,
            "image_index": idx,
            "image_url": url,
            "scraped_timestamp": scraped_timestamp
        })
    return results

def send_slack_alert(message: str, env: str):
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    if webhook_url and env != "local":
        try:
            requests.post(webhook_url, json={"text": message})
        except Exception as e:
            print(f"Slack alert error: {e}")

def save_raw_property_html(env, property_id, html, scraped_at):
    path = f"env={env}/source=greystar/stage=raw/entity=property/property_id={property_id}/scraped_at={scraped_at}/page.html.gz"
    
    if env == "local":
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            f.write(html)
    else:
        client = _gcs_client()
        blob = client.bucket(GCS_BUCKET).blob(path)
        compressed_html = gzip.compress(html.encode("utf-8"))
        blob.upload_from_string(compressed_html, content_type="application/gzip")
        logger.info(f"Uploaded compressed HTML: {path}")

def save_raw_property(env, property_id, full_data, scraped_at):
    path = f"env={env}/source=greystar/stage=raw/entity=property/property_id={property_id}/scraped_at={scraped_at}/property.json.gz"
    
    if env == "local":
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            json.dump(full_data, f)
    else:
        client = _gcs_client()
        blob = client.bucket(GCS_BUCKET).blob(path)
        compressed_json = gzip.compress(json.dumps(full_data).encode("utf-8"))
        blob.upload_from_string(compressed_json, content_type="application/gzip")
        logger.info(f"Uploaded compressed JSON: {path}")

def upload_to_gcs(env, filepath, prefix):
    client = _gcs_client()
    bucket = client.bucket(GCS_BUCKET)
    blob_path = f"{prefix}/{os.path.basename(filepath)}"
    blob = bucket.blob(blob_path)
    blob.upload_from_filename(filepath)
    logger.info(f"Uploaded to GCS: {blob_path}")

    os.remove(filepath)
    logger.info(f"Deleted local file: {filepath}")

def enforce_unit_types(df):
    if df.empty:
        return df

    required_columns = [
        "available_at", "scraped_timestamp", "listing_id", "lease_url",
        "property_id", "property_name", "company", "phone", "building_type",
        "address", "city", "state", "zipcode", "latitude", "longitude",
        "floor_plan", "unit_name", "unit_id", "rent_price", "rent_max", "beds", "baths",
        "sqft", "description", "images", "alternate_property_id", "year_built",
        "total_units", "stories", "lease_term", "concessions", "email", "website",
        "deposit", "community_amenities", "apartment_amenities", "building_subtype",
        "floor_number", "fees"  # if used
    ]

    for col in required_columns:
        if col not in df.columns:
            df[col] = None

    def normalize_available_at(val):
        if not val:
            return None
        val = str(val).strip().lower()
        if val in {"today", "now", "available", "immediately"}:
            return datetime.now().strftime("%Y-%m-%d")
        try:
            # Try parsing various known formats
            dt = pd.to_datetime(val, errors="coerce")
            if pd.isna(dt):
                return None
            return dt.strftime("%Y-%m-%d")
        except:
            return None

    df["available_at"] = df["available_at"].apply(normalize_available_at)
    df["scraped_timestamp"] = pd.to_datetime(df["scraped_timestamp"], errors="coerce").dt.round("s").dt.strftime("%Y-%m-%d %H:%M:%S")
    df["listing_id"] = df["listing_id"].astype("string")
    df["lease_url"] = df["lease_url"].astype("string")
    df["property_id"] = df["property_id"].astype("string")
    df["property_name"] = df["property_name"].astype("string")
    df["company"] = df["company"].astype("string")
    df["phone"] = df["phone"].astype("string")
    df["building_type"] = df["building_type"].astype("string")
    df["address"] = df["address"].astype("string")
    df["city"] = df["city"].astype("string")
    df["state"] = df["state"].astype("string")
    df["zipcode"] = df["zipcode"].astype("string")
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce").astype("float64")
    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce").astype("float64")
    df["floor_plan"] = df["floor_plan"].astype("string")
    df["unit_name"] = df["unit_name"].astype("string")
    df["unit_id"] = df["unit_id"].astype("string")
    df["rent_price"] = pd.to_numeric(df["rent_price"], errors="coerce").astype("float64")
    df["rent_max"] = pd.to_numeric(df["rent_max"], errors="coerce").astype("float64")
    df["beds"] = pd.to_numeric(df["beds"], errors="coerce").astype("float64")
    df["baths"] = pd.to_numeric(df["baths"], errors="coerce").astype("float64")
    df["sqft"] = pd.to_numeric(df["sqft"], errors="coerce").astype("float64")
    df["description"] = df["description"].astype("string")
    df["images"] = df["images"].astype("string")
    df["alternate_property_id"] = df["alternate_property_id"].astype("string")
    df["year_built"] = df["year_built"].astype("string")
    df["total_units"] = df["total_units"].astype("string")
    df["stories"] = df["stories"].astype("string")
    df["lease_term"] = pd.to_numeric(df["lease_term"], errors="coerce").astype("Int64")
    df["concessions"] = df["concessions"].astype("string")
    df["email"] = df["email"].astype("string")
    df["website"] = df["website"].astype("string")
    df["deposit"] = pd.to_numeric(df["deposit"], errors="coerce").astype("float64")
    df["community_amenities"] = df["community_amenities"].astype("string")
    df["apartment_amenities"] = df["apartment_amenities"].astype("string")
    df["building_subtype"] = df["building_subtype"].astype("string")
    df["floor_number"] = pd.to_numeric(df["floor_number"], errors="coerce").astype("Int64")
    df["fees"] = df["fees"].astype("string")
  
    return df

def scrape_property_page(url, env, scraped_at, session, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = session.get(url, timeout=30)
            break  # success
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2)

    soup = BeautifulSoup(response.text, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__", type="application/json")

    if not script_tag:
        raise ValueError(f"__NEXT_DATA__ not found on {url}")

    full_data = json.loads(script_tag.string)  # ✅ Only parse once
    component_props = full_data.get("props", {}).get("pageProps", {}).get("componentProps", {})

    available_units, prop_meta = [], {}
    extras = {
        "description": None,
        "email": None,
        "phone": None,
        "website": None,
        "images": [],
        "community_amenities": [],
        "apartment_amenities": [],
        "fees": [],
        "building_subtype": None,
        "building_type": "apartment",
    }

    for comp in component_props.values():
        if not isinstance(comp, dict):
            continue

        name = comp.get("componentName")
        data = comp.get("data", {})

        if name == "PropertyDetailsFloorPlans":
            available_units = data.get("availableUnits", [])
            fees = data.get("fees", [])
            location = data.get("propertyLocation") or {}
            prop_meta = {
                "propertyId": data.get("propertyId"),
                "propertyName": data.get("propertyName"),
                **location,
            }
            logger.debug(f"✅ Found PropertyDetailsFloorPlans with {len(available_units)} units")

        elif name == "PropertyDetails":
            about = data.get("property", {}).get("about", {})
            contact = data.get("property", {}).get("contact", {})
            extras["description"] = about.get("shortDescription")
            extras["building_subtype"] = about.get("buildingType")
            extras["phone"] = contact.get("phoneNumber")
            extras["email"] = contact.get("email")
            extras["website"] = contact.get("communityWebsiteUrl")
            prop_block = data.get("property") or {}
            extras["images"] = collect_image_urls_from_gallery(
                prop_block.get("imageGallery", []),
                prop_block.get("photos", []),
            )

            subtype = extras["building_subtype"]
            if subtype == "Student":
                extras["building_type"] = "student"
            elif subtype == "Active Adult":
                extras["building_type"] = "senior"
            elif subtype == "Single Family Home":
                extras["building_type"] = "single family"
            else:
                extras["building_type"] = "apartment"

        elif name == "PropertyDetailsAmenities":
            extras["apartment_amenities"] = data.get("features", [])
            extras["community_amenities"] = data.get("amenities", [])

        elif name == "PropertyDetailsFees":
            extras["fees"] = data.get("fees", [])

    property_id = prop_meta.get("propertyId") or extract_id_from_url(url) or "unknown"
    save_raw_property_html(env, property_id, response.text, scraped_at)
    save_raw_property(env, property_id, full_data, scraped_at)  # ✅ Save full __NEXT_DATA__

    units = flatten_units(prop_meta, available_units, url, scraped_at, extras) if available_units else []
    photos = extract_photos(prop_meta, gallery_urls=extras.get("images"))

    return units, photos

def extract_id_from_url(url):
    """Extract the numeric property ID from a URL like .../p_12345"""
    match = re.search(r"/p_(\d+)", url)
    return match.group(1) if match else None


def get_session(env):
    if not hasattr(thread_local, "session"):
        session = requests.Session()
        if env != "local":
            proxy = proxy_manager.get_random_proxy()
            session.proxies = {
                "http": proxy,
                "https": proxy
            }
            logger.debug(f"🛡️ Assigned proxy {proxy} to thread")
        thread_local.session = session
    return thread_local.session


def scrape_with_session(url, env, scraped_at):
    session = get_session(env)
    return scrape_property_page(url, env, scraped_at, session=session)


def run_scraper(
    env,
    output_format="parquet",
    max_workers=10,
    max_properties=None,
    states: list[str] | None = None,
):
    seen_ids = set()
    all_units, all_photos = [], []
    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    output_dir = f"env={env}/source=greystar/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Step 1: Gather all property URLs from state pages
    state_urls = get_state_urls_from_sitemap()
    state_urls = filter_state_urls(state_urls, states)
    if states:
        logger.info(
            "State filter %s → %s Greystar listing pages",
            states,
            len(state_urls),
        )
    all_property_urls = []

    for state_url in state_urls:
        try:
            logger.info(f"🌎 Fetching state page: {state_url}")
            html = requests.get(state_url, timeout=30).text
            prop_urls = extract_property_urls_from_state_page(html)
            new_urls = [u for u in prop_urls if u not in seen_ids]
            all_property_urls.extend(new_urls)
            seen_ids.update(new_urls)
            logger.info(f"✅ Found {len(new_urls)} properties in {state_url}")
        except Exception as e:
            logger.warning(f"⚠️ Failed to extract properties from {state_url}: {e}")

    total_urls = len(all_property_urls)
    if max_properties is not None:
        all_property_urls = all_property_urls[:max_properties]
        logger.info(
            f"Limiting scrape to first {len(all_property_urls)} of {total_urls} "
            f"properties (max_properties={max_properties})"
        )
    else:
        logger.info(f"Collected {total_urls} property URLs to scrape")

    # Step 2: Scrape each property URL in parallel using proxy-aware sessions
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {
            executor.submit(scrape_with_session, url, env, scraped_at): url
            for url in all_property_urls
        }

        for future in as_completed(future_to_url):
            url = future_to_url[future]
            try:
                units, photos = future.result()
                all_units.extend(units)
                all_photos.extend(photos)
                logger.info(f"✅ Parsed {len(units)} units from {url}")
            except Exception as e:
                logger.error(f"❌ Failed to scrape {url}: {e}")

    # Step 3: Save output
    df = pd.DataFrame(all_units)
    if not df.empty:
        df = enforce_unit_types(df)

    units_file = os.path.join(output_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(output_dir, "images." + ("csv" if output_format == "csv" else "parquet"))

    if output_format == "csv":
        df.to_csv(units_file, index=False)
        pd.DataFrame(all_photos).to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        pd.DataFrame(all_photos).to_parquet(photos_file, index=False)

    if env != "local":
        try:
            upload_to_gcs(env, log_filename, f"env={env}/source=greystar/logs/scraped_at={scraped_at}")
        except Exception as e:
            logger.warning(f"⚠️ Failed to upload log file to GCS: {e}")

    try:
        if env != "local":
            upload_to_gcs(env, units_file, f"env={env}/source=greystar/stage=processed/entity=property/property_id=greystar/load_date={scraped_at}")
            upload_to_gcs(env, photos_file, f"env={env}/source=greystar/stage=processed/entity=photo/property_id=greystar/load_date={scraped_at}")

        available_units = df[df["availability_status"] == "available"]
        send_slack_alert(
            f"✅ Greystar scrape complete\n"
            f"• Properties: {len(seen_ids)}\n"
            f"• Total Units: {len(df)}\n"
            f"• Available Units: {len(available_units)}\n"
            f"• Photos: {len(all_photos)}", env
        )

    except Exception as e:
        send_slack_alert(f"❌ Greystar scrape upload failed: {e}", env)

def process_local(env: str, output_format: str = "parquet", scraped_at: str = None):
    seen_ids = set()
    all_units, all_photos = [], []

    # 1) Resolve scrape date (works for both local and GCS)
    if not scraped_at:
        if env == "local":
            base_glob = f"env={env}/source=greystar/stage=raw/entity=property/property_id=*/scraped_at=*"
            scraped_at_dirs = glob(base_glob)
            scraped_at_dates = sorted({Path(p).parts[-1].split("=")[-1] for p in scraped_at_dirs})
        else:
            client = _gcs_client()
            blobs = client.list_blobs(GCS_BUCKET, prefix=f"env={env}/source=greystar/stage=raw/entity=property/")
            scraped_at_dates = sorted({
                part.split("=")[-1]
                for blob in blobs
                for part in blob.name.split("/")
                if part.startswith("scraped_at=")
            })
        if not scraped_at_dates:
            raise ValueError("No scraped_at folders found in raw/entity=property")
        scraped_at = scraped_at_dates[-1]
        logger.info(f"No --scrape_date provided. Using latest scraped_at={scraped_at}")

    output_dir = f"env={env}/source=greystar/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # 2) Collect paths (local) or blobs (GCS) for property.json(.gz)
    local_pattern = f"env={env}/source=greystar/stage=raw/entity=property/property_id=*/scraped_at={scraped_at}/property.json*"
    raw_paths = []
    raw_blobs = None

    if env == "local":
        raw_paths = glob(local_pattern)
        logger.info(f"[PROCESS_LOCAL] Local mode: found {len(raw_paths)} property.json* files")
    else:
        client = _gcs_client()
        prefix = f"env={env}/source=greystar/stage=raw/entity=property/"
        raw_blobs = [
            b for b in client.list_blobs(GCS_BUCKET, prefix=prefix)
            if b.name.endswith(f"/scraped_at={scraped_at}/property.json") or
               b.name.endswith(f"/scraped_at={scraped_at}/property.json.gz")
        ]
        logger.info(f"[PROCESS_LOCAL] GCS mode: found {len(raw_blobs)} property.json* blobs")

    def _read_property_json_local(path: str) -> dict:
        if path.endswith(".gz"):
            with gzip.open(path, "rt", encoding="utf-8") as f:
                return json.load(f)
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _read_property_json_gcs(blob) -> dict:
        data = blob.download_as_bytes()
        # Try gzip first; fall back to plain JSON
        try:
            return json.loads(gzip.decompress(data).decode("utf-8"))
        except Exception:
            return json.loads(data.decode("utf-8"))

    # 3) Parse __NEXT_DATA__ like scrape mode (no separate floorplans.json)
    def _parse_units_from_next_data(next_data: dict, scraped_at_val: str):
        component_props = next_data.get("props", {}).get("pageProps", {}).get("componentProps", {})
        available_units, prop_meta = [], {}
        extras = {
            "description": None,
            "email": None,
            "phone": None,
            "website": None,
            "images": [],
            "community_amenities": [],
            "apartment_amenities": [],
            "fees": [],
            "building_subtype": None,
            "building_type": "apartment",
        }
        for comp in component_props.values():
            if not isinstance(comp, dict):
                continue
            name = comp.get("componentName")
            data = comp.get("data", {})

            if name == "PropertyDetailsFloorPlans":
                available_units = data.get("availableUnits", [])
                location = data.get("propertyLocation") or {}
                prop_meta = {
                    "propertyId": data.get("propertyId"),
                    "propertyName": data.get("propertyName"),
                    **location,
                }
            elif name == "PropertyDetails":
                about = data.get("property", {}).get("about", {})
                contact = data.get("property", {}).get("contact", {})
                extras["description"] = about.get("shortDescription")
                extras["building_subtype"] = about.get("buildingType")
                extras["phone"] = contact.get("phoneNumber")
                extras["email"] = contact.get("email")
                extras["website"] = contact.get("communityWebsiteUrl")
                prop_block = data.get("property") or {}
                extras["images"] = collect_image_urls_from_gallery(
                    prop_block.get("imageGallery", []),
                    prop_block.get("photos", []),
                )
                # interpret subtype -> building_type
                subtype = extras["building_subtype"]
                if subtype == "Student":
                    extras["building_type"] = "student"
                elif subtype == "Active Adult":
                    extras["building_type"] = "senior"
                elif subtype == "Single Family Home":
                    extras["building_type"] = "single family"
                else:
                    extras["building_type"] = "apartment"
            elif name == "PropertyDetailsAmenities":
                extras["apartment_amenities"] = data.get("features", [])
                extras["community_amenities"] = data.get("amenities", [])
            elif name == "PropertyDetailsFees":
                extras["fees"] = data.get("fees", [])

        units = flatten_units(prop_meta, available_units, url=None, scraped_at=scraped_at_val, extras=extras)
        photos = extract_photos(prop_meta, gallery_urls=extras.get("images"))
        return units, photos

    # 4) Iterate and build rows
    if env == "local":
        for path in raw_paths:
            try:
                next_data = _read_property_json_local(path)
                # dedupe on property id if present
                prop_id = (
                    next_data.get("Id")
                    or next_data.get("propertyId")
                    or extract_id_from_url(path)
                )
                if prop_id and prop_id in seen_ids:
                    continue
                if prop_id:
                    seen_ids.add(prop_id)

                units, photos = _parse_units_from_next_data(next_data, scraped_at)
                all_units.extend(units)
                all_photos.extend(photos)
            except Exception as e:
                logger.error(f"[PROCESS_LOCAL] Failed to process {path}: {e}")
    else:
        for blob in raw_blobs:
            try:
                next_data = _read_property_json_gcs(blob)
                prop_id = (
                    next_data.get("Id")
                    or next_data.get("propertyId")
                )
                if prop_id and prop_id in seen_ids:
                    continue
                if prop_id:
                    seen_ids.add(prop_id)

                units, photos = _parse_units_from_next_data(next_data, scraped_at)
                all_units.extend(units)
                all_photos.extend(photos)
            except Exception as e:
                logger.error(f"[PROCESS_LOCAL] Failed to process GCS blob {blob.name}: {e}")

    # 5) Save
    df_units = pd.DataFrame(all_units)
    if not df_units.empty:
        df_units = enforce_unit_types(df_units)
    df_photos = pd.DataFrame(all_photos)

    units_file = os.path.join(output_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(output_dir, "images." + ("csv" if output_format == "csv" else "parquet"))

    try:
        if output_format == "csv":
            df_units.to_csv(units_file, index=False)
            df_photos.to_csv(photos_file, index=False)
        else:
            df_units.to_parquet(units_file, index=False)
            df_photos.to_parquet(photos_file, index=False)

        if env != "local":
            try:
                upload_to_gcs(env, log_filename, f"env={env}/source=greystar/logs/scraped_at={scraped_at}")
            except Exception as e:
                logger.warning(f"⚠️ Failed to upload log file to GCS: {e}")
            upload_to_gcs(env, units_file, f"env={env}/source=greystar/stage=processed/entity=property/property_id=greystar/load_date={scraped_at}")
            upload_to_gcs(env, photos_file, f"env={env}/source=greystar/stage=processed/entity=photo/property_id=greystar/load_date={scraped_at}")

        available_units = df_units[df_units.get("availability_status", "") == "available"]
        send_slack_alert(
            f"✅ Greystar process_local complete\n"
            f"• Properties: {len(seen_ids)}\n"
            f"• Total Units: {len(df_units)}\n"
            f"• Available Units: {len(available_units)}\n"
            f"• Photos: {len(df_photos)}", env
        )
    except Exception as e:
        logger.error(f"[PROCESS_LOCAL] File save/upload failed: {e}")
        send_slack_alert(f"❌ Greystar process_local failed: {e}", env)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--format", default="parquet", choices=["parquet", "csv"], help="Output file format")
    parser.add_argument("--env", required=True, choices=["local", "dev", "test", "prod"])
    parser.add_argument("--max_workers", type=int, default=10)
    parser.add_argument("--max_properties", type=int, default=None, help="Optional limit on number of property URLs to scrape (for testing)")
    parser.add_argument(
        "--states",
        default=None,
        help="Comma-separated 2-letter state codes (e.g. ny,nj). Omit for full US.",
    )
    parser.add_argument("--mode", default="scrape", choices=["scrape", "process_local"])
    parser.add_argument("--scrape_date", default=datetime.now().strftime("%Y-%m-%d"))
    parser.add_argument("--input", help="Optional file of property IDs to process")
    args = parser.parse_args()
    states_filter = None
    if args.states:
        states_filter = [s.strip().lower() for s in args.states.split(",") if s.strip()]

    try:
        send_slack_alert(f"🏢 Greystar {args.mode} started.", args.env)

        if args.mode == "scrape":
            run_scraper(
                env=args.env,
                output_format=args.format,
                max_workers=args.max_workers,
                max_properties=args.max_properties,
                states=states_filter,
            )
        elif args.mode == "process_local":
            process_local(env=args.env, output_format=args.format, scraped_at=args.scrape_date)

    except Exception as e:
        logger.exception(f"❌ Greystar {args.mode} failed: {e}")
        send_slack_alert(f"❌ Greystar {args.mode} failed: {e}", args.env)
        raise  # so it still exits with failure