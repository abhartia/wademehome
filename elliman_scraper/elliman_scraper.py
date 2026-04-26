"""
Douglas Elliman rental listing scraper.

As of 2026-04, Elliman's old `core.api.elliman.com/listing/filter` returns 404.
The working flow is:

1. `/listing/map/clustered` (POST) — returns either cluster markers or, at tight
   bboxes, `groupedListings` containing individual `coreListingId`s.
   This endpoint requires a dynamic `Cookies` header generated client-side, so
   it cannot be called from plain requests. We use Playwright and trigger it by
   navigating to Elliman's `map-view` URL (the page JS signs the request).

2. For each `coreListingId` we fetch `https://www.elliman.com/listing/{id}` as
   plain HTML (no anti-bot on the detail page) and parse the listing object
   out of the Next.js streaming payload in `self.__next_f`.

Modes:
  scrape         — run the full pipeline (map-tile discovery + detail fetch)
  process_local  — reprocess saved raw JSON files into parquet

Usage:
  python elliman_scraper.py --env local --mode scrape
  python elliman_scraper.py --env local --mode process_local --scrape_date 2026-04-17
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
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from glob import glob
from pathlib import Path
from typing import Iterable

import pandas as pd
import requests

_REPO_ROOT = Path(__file__).resolve().parents[1]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

GCS_BUCKET = "scrapers-v2"
COMPANY = "Douglas Elliman"
SOURCE = "elliman"

# Bounding boxes keyed by a human label.
# Format: (north, west, south, east) – matches Elliman's map-view URL order.
REGIONS: dict[str, tuple[float, float, float, float]] = {
    # NYC five boroughs
    "manhattan":      (40.882, -74.020, 40.700, -73.907),
    "brooklyn":       (40.740, -74.045, 40.570, -73.855),
    "queens":         (40.800, -73.960, 40.540, -73.700),
    "bronx":          (40.920, -73.935, 40.785, -73.760),
    "staten-island":  (40.655, -74.260, 40.495, -74.050),
    # Adjacent NJ priority markets
    "jersey-city":    (40.775, -74.095, 40.690, -74.020),
    "hoboken":        (40.760, -74.040, 40.730, -74.010),
}

# Tile size for discovery. Smaller = more requests, but avoids clustered
# responses hiding listings behind cluster markers. 0.03 degrees (~3km) at
# zoom 13 reliably yields `groupedListings` in dense NYC areas.
TILE_SIZE_DEG = 0.03
TILE_ZOOM = 13

# Headers for plain-HTTP listing-detail fetches
_HTML_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
}

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


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError("google-cloud-storage required for non-local envs") from e
    return storage.Client()


# ── Raw save / load ─────────────────────────────────────────────────────────


def save_raw_gz(env: str, data: dict | str, listing_id: str, scraped_at: str) -> None:
    if env == "local":
        return  # Local mode skips raw cache (parquet + DB are sufficient).
    text = data if isinstance(data, str) else json.dumps(data, ensure_ascii=False)
    path = (
        f"env={env}/source={SOURCE}/stage=raw/entity=property/"
        f"property_id={listing_id}/scraped_at={scraped_at}/listing.json.gz"
    )
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


# ── Tile discovery via Playwright ───────────────────────────────────────────


def _tile_bbox(
    region_bbox: tuple[float, float, float, float],
    tile_size: float = TILE_SIZE_DEG,
) -> list[tuple[float, float, float, float]]:
    """Split a region (north,west,south,east) into smaller tiles of roughly
    tile_size degrees each. Returns list of (north, west, south, east)."""
    n, w, s, e = region_bbox
    tiles: list[tuple[float, float, float, float]] = []
    lat = s
    while lat < n:
        lat2 = min(n, lat + tile_size)
        lng = w
        while lng < e:
            lng2 = min(e, lng + tile_size)
            tiles.append((lat2, lng, lat, lng2))
            lng = lng2
        lat = lat2
    return tiles


def _extract_ids_from_clustered(
    data: dict,
) -> tuple[list[int], list[dict], int]:
    """Pull coreListingIds and any summary data from a clustered response.
    Returns (ids, single_unit_summaries, unresolved_clusters).
    unresolved_clusters > 0 means we still have un-split clusters — that
    tile should be subdivided with a higher zoom / smaller tile."""
    ids: list[int] = []
    summaries: list[dict] = []
    cluster_count = len(data.get("clusterMarkers") or [])
    for item in data.get("groupedListings") or []:
        t = item.get("type")
        if t == "singleUnit":
            su = item.get("singleUnit") or {}
            cid = su.get("coreListingId")
            if cid:
                ids.append(int(cid))
                summaries.append(su)
        elif t == "multiUnit":
            mu = item.get("multiUnit") or {}
            for cid in mu.get("coreListingIds") or []:
                ids.append(int(cid))
    return ids, summaries, cluster_count


def discover_listing_ids(
    regions: dict[str, tuple[float, float, float, float]],
    headless: bool = True,
) -> list[int]:
    """Drive Playwright across tiles of each region, capturing
    /listing/map/clustered responses. Returns a deduped list of listing ids."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as e:
        raise ImportError("playwright is required for scraping") from e

    seen_ids: set[int] = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1440, "height": 900},
        )
        page = context.new_page()

        # Shared state for response handler
        latest: dict[str, dict | None] = {"data": None}

        def on_response(response):
            if "core.api.elliman.com/listing/map/clustered" in response.url:
                try:
                    latest["data"] = response.json()
                except Exception:
                    latest["data"] = None

        page.on("response", on_response)

        # Warm-up: load a rentals page so the anti-bot JS initializes
        try:
            page.goto(
                "https://www.elliman.com/rentals/new-york-ny",
                wait_until="domcontentloaded",
                timeout=60000,
            )
            time.sleep(2)
        except Exception as exc:
            logger.warning("Warm-up load failed: %s", exc)

        pending: list[tuple[str, tuple[float, float, float, float], int]] = []
        for region_name, bbox in regions.items():
            for tile in _tile_bbox(bbox):
                pending.append((region_name, tile, TILE_ZOOM))

        logger.info("Planned %d tiles across %d regions", len(pending), len(regions))

        total_tiles = 0
        while pending:
            region_name, (n, w, s, e), zoom = pending.pop(0)
            total_tiles += 1
            latest["data"] = None
            url = f"https://www.elliman.com/rentals/map-view={n},{w},{s},{e}/zoom={zoom}"
            try:
                page.goto(url, wait_until="networkidle", timeout=45000)
            except Exception as exc:
                logger.warning("[%s] tile %s load failed: %s", region_name, url, exc)
                continue

            # Some tiles need extra time for the xhr to land after networkidle
            for _ in range(5):
                if latest["data"] is not None:
                    break
                time.sleep(0.6)

            data = latest["data"]
            if not data:
                logger.debug("[%s] tile returned no data", region_name)
                continue

            ids, _, cluster_count = _extract_ids_from_clustered(data)
            total_in_tile = data.get("totalCount")
            new_ids = [i for i in ids if i not in seen_ids]
            seen_ids.update(new_ids)

            logger.info(
                "[%s] tile tc=%s clusters=%s gl_ids=%d new=%d running=%d",
                region_name, total_in_tile, cluster_count,
                len(ids), len(new_ids), len(seen_ids),
            )

            # If cluster markers present, subdivide the tile and try zoom+1
            if cluster_count > 0 and zoom < 17:
                lat_mid = (n + s) / 2.0
                lng_mid = (w + e) / 2.0
                subs = [
                    (n, w, lat_mid, lng_mid),
                    (n, lng_mid, lat_mid, e),
                    (lat_mid, w, s, lng_mid),
                    (lat_mid, lng_mid, s, e),
                ]
                for sub in subs:
                    pending.append((region_name, sub, zoom + 1))

        browser.close()

    logger.info("Discovery complete: %d unique listing ids across %d tiles",
                len(seen_ids), total_tiles)
    return sorted(seen_ids)


# ── Listing detail fetch & parse ────────────────────────────────────────────


_NEXT_F_CHUNK_RE = re.compile(
    r'self\.__next_f\.push\(\[\s*(\d+)\s*,\s*"((?:[^"\\]|\\.)*)"\s*\]\)'
)


def _assemble_next_f(html: str) -> str:
    """Concatenate all Next.js streaming chunks into a single string."""
    out: list[str] = []
    for kind, content in _NEXT_F_CHUNK_RE.findall(html):
        try:
            out.append(json.loads('"' + content + '"'))
        except Exception:
            out.append(content)
    return "".join(out)


def _find_enclosing_object(s: str, anchor_idx: int) -> str | None:
    """Given an index inside a stringified object, return the smallest enclosing
    JSON object substring (matching {...}). Returns None on failure."""
    # Walk backward to find the enclosing '{'
    depth = 0
    start = -1
    for i in range(anchor_idx, -1, -1):
        c = s[i]
        if c == "}":
            depth += 1
        elif c == "{":
            if depth == 0:
                start = i
                break
            depth -= 1
    if start < 0:
        return None
    # Walk forward to find matching '}'
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(s)):
        c = s[i]
        if esc:
            esc = False
            continue
        if c == "\\":
            esc = True
            continue
        if c == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return s[start:i + 1]
    return None


def fetch_listing_detail(core_listing_id: int, timeout: int = 30) -> dict | None:
    """Fetch a single Elliman listing detail page and return the embedded
    listing object as a dict, or None if it cannot be parsed."""
    url = f"https://www.elliman.com/listing/{core_listing_id}"
    try:
        r = requests.get(url, headers=_HTML_HEADERS, timeout=timeout, allow_redirects=True)
    except Exception as exc:
        logger.warning("fetch_listing_detail %s: request error %s", core_listing_id, exc)
        return None
    if r.status_code != 200:
        logger.warning("fetch_listing_detail %s: status %s", core_listing_id, r.status_code)
        return None

    full = _assemble_next_f(r.text)
    anchor = f'"coreListingId":{core_listing_id}'
    idx = full.find(anchor)
    if idx < 0:
        # Some listing pages redirect to a different id; fall back to the first
        # coreListingId we see.
        m = re.search(r'"coreListingId"\s*:\s*(\d+)', full)
        if m:
            idx = m.start()
        else:
            logger.warning("fetch_listing_detail %s: no coreListingId in HTML", core_listing_id)
            return None

    candidate = _find_enclosing_object(full, idx)
    if not candidate:
        logger.warning("fetch_listing_detail %s: failed to locate enclosing object", core_listing_id)
        return None

    try:
        obj = json.loads(candidate)
    except Exception as exc:
        logger.warning("fetch_listing_detail %s: JSON parse error: %s", core_listing_id, exc)
        return None

    # Attach the canonical URL so downstream code can trace back
    obj.setdefault("_sourceUrl", r.url)
    return obj


def fetch_listing_details_parallel(
    ids: Iterable[int], max_workers: int = 8,
) -> list[dict]:
    """Fetch detail pages in parallel, returning raw listing dicts."""
    ids = list(ids)
    out: list[dict] = []
    if not ids:
        return out
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_to_id = {ex.submit(fetch_listing_detail, i): i for i in ids}
        done = 0
        for fut in as_completed(fut_to_id):
            done += 1
            data = fut.result()
            if data is not None:
                out.append(data)
            if done % 50 == 0 or done == len(ids):
                logger.info("Detail fetch progress: %d/%d ok=%d", done, len(ids), len(out))
    return out


# ── Parsing ──────────────────────────────────────────────────────────────────


def parse_listing_detail(item: dict, scraped_ts: str) -> tuple[dict | None, list[dict]]:
    """Normalize a detail-page object into the canonical listings schema."""
    core_id = item.get("coreListingId")
    if not core_id:
        return None, []
    listing_id = f"elliman_{core_id}"

    addr = item.get("address") or {}
    if not isinstance(addr, dict):
        addr = {}
    street = (
        addr.get("unparsedAddress")
        or addr.get("streetAddress")
        or addr.get("fullAddress")
        or addr.get("line1")
        or ""
    )
    # Fall back to joining components
    if not street:
        comps = [addr.get("streetNumber"), addr.get("streetName"), addr.get("streetSuffix")]
        street = " ".join([c for c in comps if c]).strip()
    if item.get("unitNumber"):
        if item["unitNumber"] not in street:
            street = f"{street} {item['unitNumber']}".strip()

    city = addr.get("city") or item.get("city")
    state = addr.get("stateOrProvince") or addr.get("state") or item.get("state")
    zipcode = addr.get("postalCode") or addr.get("zip") or addr.get("zipCode")

    latlng = item.get("latLng") or {}
    lat = _parse_float(latlng.get("lat") or addr.get("latitude"))
    lon = _parse_float(latlng.get("lng") or addr.get("longitude"))

    price = _parse_float(item.get("listPrice") or item.get("localListPrice"))
    beds = _parse_float(item.get("bedroomsTotal"))
    baths = _parse_float(item.get("bathroomsTotal"))
    sqft = _parse_float(item.get("livingAreaSquareFeet"))

    images_raw = item.get("images") or []
    image_urls: list[str] = []
    photos: list[dict] = []
    for img in images_raw:
        url = img if isinstance(img, str) else (img.get("url") or img.get("uri") or "")
        if url:
            image_urls.append(url)
            photos.append({
                "listing_id": listing_id,
                "property_id": str(core_id),
                "image_url": url,
                "image_alt": (img.get("caption") if isinstance(img, dict) else "") or "",
            })

    description = item.get("publicRemarks") or item.get("privateRemarks") or ""
    if description and description.startswith("$"):  # RSC sentinel like "$2e"
        description = ""

    building_name = item.get("buildingName") or ""
    property_type = item.get("propertyLabel") or item.get("homeType") or "apartment"

    agents = item.get("agents") or []
    email = None
    phone = None
    for a in agents:
        if not isinstance(a, dict):
            continue
        if not email:
            email = a.get("email")
        if not phone:
            phone = a.get("phone") or a.get("officePhone") or a.get("mobilePhone")

    unit_number = item.get("unitNumber")
    fees_list = []
    if item.get("associationFee") not in (None, 0, "0"):
        fees_list.append({
            "name": "associationFee",
            "amount": item.get("associationFee"),
            "frequency": item.get("associationFeeFrequency"),
        })

    # Build canonical listing_url
    slug = item.get("urlKey") or item.get("slug") or ""
    if slug:
        listing_url = f"https://www.elliman.com/listing/{slug}/{core_id}"
    else:
        listing_url = item.get("_sourceUrl") or f"https://www.elliman.com/listing/{core_id}"

    status_raw = (item.get("listingStatus") or "").lower()
    availability = "available" if status_raw in ("active", "activeundercontract", "comingsoon", "pending") else status_raw or None

    row = {
        "listing_id": listing_id,
        "property_id": str(core_id),
        "alternate_property_id": item.get("integrationListingId") or item.get("legacyListingId"),
        "property_name": building_name[:500] if building_name else None,
        "address": street or None,
        "city": city,
        "state": state,
        "zipcode": str(zipcode) if zipcode is not None else None,
        "latitude": lat,
        "longitude": lon,
        "floor_plan": json.dumps(item.get("floorPlans") or []) if item.get("floorPlans") else None,
        "unit_name": unit_number,
        "unit_id": str(core_id),
        "beds": beds,
        "baths": baths,
        "sqft": sqft,
        "rent_price": price,
        "rent_max": price,
        "deposit": None,
        "availability_status": availability,
        "available_at": item.get("moveInDate"),
        "lease_url": None,
        "lease_term": _parse_int(item.get("leaseTerms")),
        "listing_url": listing_url,
        "email": email,
        "phone": phone,
        "description": description[:2000] if description else None,
        "images": json.dumps(image_urls),
        "website": "www.elliman.com",
        "company": COMPANY,
        "building_type": property_type,
        "building_subtype": item.get("propertySubType"),
        "floor_number": _parse_float(item.get("floorNumber")),
        "fees": json.dumps(fees_list),
        "year_built": item.get("yearBuilt"),
        "total_units": _parse_int(item.get("numberOfUnits")),
        "stories": _parse_int(item.get("stories")),
        "scraped_timestamp": scraped_ts,
    }
    return row, photos


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
                  "total_units", "stories", "lease_term"]
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


def save_parquet(
    env: str, rows: list[dict], photos: list[dict], load_date: str,
) -> tuple[str, str]:
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


# ── Main pipeline ────────────────────────────────────────────────────────────


def run_scrape(
    env: str,
    regions: dict[str, tuple[float, float, float, float]] | None = None,
    max_listings: int | None = None,
    detail_workers: int = 8,
) -> tuple[list[dict], list[dict]]:
    regions = regions or REGIONS
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    logger.info("Phase 1: discovering listing ids across %d regions", len(regions))
    ids = discover_listing_ids(regions)
    if max_listings:
        ids = ids[:max_listings]
        logger.info("Limiting to first %d ids for this run", max_listings)

    if not ids:
        logger.warning("No listing ids discovered — aborting")
        return [], []

    logger.info("Phase 2: fetching detail pages for %d listings", len(ids))
    raw_items = fetch_listing_details_parallel(ids, max_workers=detail_workers)
    logger.info("Got %d/%d detail objects", len(raw_items), len(ids))

    all_rows: list[dict] = []
    all_photos: list[dict] = []
    seen: set[str] = set()
    for item in raw_items:
        row, photos = parse_listing_detail(item, scraped_ts)
        if not row or row["listing_id"] in seen:
            continue
        # Enforce NOT NULL requirements: lat/lng/address
        if row["latitude"] is None or row["longitude"] is None:
            logger.warning("Skipping %s: missing lat/lng", row["listing_id"])
            continue
        if not row.get("address"):
            logger.warning("Skipping %s: missing address", row["listing_id"])
            continue
        seen.add(row["listing_id"])
        all_rows.append(row)
        all_photos.extend(photos)
        if env == "local":
            save_raw_gz(env, item, row["listing_id"], scraped_ts.split()[0])

    logger.info("Pipeline complete: %d rows, %d photos (from %d raw)",
                len(all_rows), len(all_photos), len(raw_items))
    return all_rows, all_photos


def main() -> int:
    parser = argparse.ArgumentParser(description="Douglas Elliman rental listing scraper")
    parser.add_argument("--env", choices=("local", "dev", "test", "prod"), default="local")
    parser.add_argument("--mode", choices=("scrape", "process_local"), default="scrape")
    parser.add_argument("--max_listings", type=int, default=None,
                        help="Cap on total listings (useful for quick verification runs)")
    parser.add_argument("--regions", type=str, default=None,
                        help="Comma-separated region keys to scrape (defaults to all)")
    parser.add_argument("--scrape_date", type=str, default=None,
                        help="Date to reprocess (YYYY-MM-DD), for process_local mode")
    parser.add_argument("--detail_workers", type=int, default=8)
    args = parser.parse_args()

    load_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if args.mode == "scrape":
        if args.regions:
            wanted = {k.strip(): REGIONS[k.strip()]
                      for k in args.regions.split(",") if k.strip() in REGIONS}
            if not wanted:
                logger.error("No valid region keys in --regions=%s (available: %s)",
                             args.regions, ",".join(REGIONS))
                return 2
            regions = wanted
        else:
            regions = REGIONS
        rows, photos = run_scrape(
            args.env, regions=regions,
            max_listings=args.max_listings,
            detail_workers=args.detail_workers,
        )
        save_parquet(args.env, rows, photos, load_date)

    elif args.mode == "process_local":
        date = args.scrape_date or load_date
        logger.info("Reprocessing raw files for %s", date)
        raw_items = load_raw_files(args.env, date)
        scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        rows: list[dict] = []
        photos: list[dict] = []
        for item in raw_items:
            row, ph = parse_listing_detail(item, scraped_ts)
            if row and row["latitude"] is not None and row["longitude"] is not None and row.get("address"):
                rows.append(row)
                photos.extend(ph)
        save_parquet(args.env, rows, photos, date)

    logger.info("Done. %s mode complete.", args.mode)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
