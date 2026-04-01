from __future__ import annotations

import argparse
import gzip
import json
import logging
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from glob import glob
from pathlib import Path
from urllib.parse import urlparse

import cloudscraper

_REPO_ROOT = Path(__file__).resolve().parents[1]
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))
import listing_amenities_parsers as _amenities
import pandas as pd
from bs4 import BeautifulSoup

from proxy_manager import ProxyManager

GCS_BUCKET = "scrapers-v2"
BASE_URL = "https://www.rentcafe.com/"
HOMEPAGE_URL = "https://www.rentcafe.com/"


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError(
            "google-cloud-storage is required when env is not 'local'. "
            "Use --env local for local-only runs, or install requirements.txt."
        ) from e
    return storage.Client()


proxy_manager = ProxyManager(
    [
        "IP_1:3128",
        "IP_1:3128",
        "IP_1:3128",
        "IP_1:3128",
    ]
)

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/rentcafe_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("rentcafe_scraper")
thread_local = threading.local()


def normalize_url(url: str) -> str:
    return url.rstrip("/") + "/"


def parse_city_slug(url: str) -> tuple[str | None, str | None]:
    # ex: /apartments-for-rent/brooklyn-ny/
    path = urlparse(url).path.strip("/")
    parts = path.split("/")
    if len(parts) < 2:
        return None, None
    slug = parts[1]
    m = re.match(r"(.+)-([a-z]{2})$", slug)
    if not m:
        return None, None
    city_raw, state = m.groups()
    city = city_raw.replace("-", " ").title()
    return city, state.upper()


def property_id_to_listing_url(prop_id: str) -> str:
    """Rebuild canonical property URL from raw folder id (…-default-aspx → …/default.aspx)."""
    core = prop_id
    suffix = "-default-aspx"
    if core.lower().endswith(suffix):
        core = core[: -len(suffix)]
    path_body = core.replace("-", "/")
    return f"{BASE_URL}{path_body}/default.aspx"


def extract_canonical_listing_url(soup: BeautifulSoup) -> str | None:
    """Prefer link[rel=canonical] or og:url — property_id hyphen reversal breaks multi-word cities."""
    for link in soup.find_all("link", href=True):
        rel = link.get("rel")
        if not rel:
            continue
        rel_list = rel if isinstance(rel, list) else [rel]
        if any(str(r).lower() == "canonical" for r in rel_list):
            href = (link.get("href") or "").strip()
            if href.startswith("http") and "rentcafe.com" in href:
                return href.split("?")[0]
    og = soup.find("meta", attrs={"property": "og:url"})
    if og and og.get("content"):
        c = str(og["content"]).strip()
        if c.startswith("http") and "rentcafe.com" in c:
            return c.split("?")[0]
    return None


def parse_city_state_from_property_url(url: str) -> tuple[str | None, str | None]:
    # ex: /apartments/ca/anaheim/property-name/default.aspx
    path = urlparse(url).path.strip("/")
    parts = path.split("/")
    if len(parts) >= 3 and parts[0] == "apartments":
        state = parts[1].upper()
        city = parts[2].replace("-", " ").title()
        if len(state) == 2 and city:
            return city, state
    return None, None


def parse_beds(value: str | None) -> float | None:
    if not value:
        return None
    val = value.strip().lower()
    if val == "studio":
        return 0.0
    m = re.search(r"(\d+(?:\.\d+)?)", val)
    return float(m.group(1)) if m else None


def parse_baths(value: str | None) -> float | None:
    if not value:
        return None
    m = re.search(r"(\d+(?:\.\d+)?)", value)
    return float(m.group(1)) if m else None


def parse_sqft(value: str | None) -> float | None:
    if not value:
        return None
    m = re.search(r"(\d[\d,]*)", value)
    if not m:
        return None
    return float(m.group(1).replace(",", ""))


def parse_rent_range(value: str | None) -> tuple[float | None, float | None]:
    if not value:
        return None, None
    if "ask for pricing" in value.lower():
        return None, None
    nums = re.findall(r"\$?\s*(\d[\d,]*)", value)
    if not nums:
        return None, None
    vals = [float(n.replace(",", "")) for n in nums]
    if len(vals) == 1:
        return vals[0], vals[0]
    return min(vals), max(vals)


def get_session(env: str):
    if hasattr(thread_local, "session"):
        return thread_local.session

    session = cloudscraper.create_scraper(
        browser={"browser": "chrome", "platform": "darwin", "mobile": False}
    )
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    if env != "local":
        proxy = proxy_manager.get_random_proxy()
        session.proxies = {"http": proxy, "https": proxy}
        logger.debug("Assigned proxy %s", proxy)

    thread_local.session = session
    return session


def fetch_html(url: str, env: str, retries: int = 3, timeout: int = 30) -> str:
    session = get_session(env)
    err = None
    for attempt in range(retries):
        try:
            resp = session.get(url, timeout=timeout, allow_redirects=True)
            if resp.status_code == 200:
                return resp.text
            if resp.status_code in {403, 429, 503}:
                time.sleep(2 + attempt)
                continue
            return resp.text
        except Exception as e:
            err = e
            time.sleep(2 + attempt)
    if err:
        raise err
    raise RuntimeError(f"Failed to fetch {url}")


def extract_city_urls_from_html(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("https://www.rentcafe.com/apartments-for-rent/"):
            p = urlparse(href).path
            parts = p.strip("/").split("/")
            if len(parts) == 2 and parts[0] == "apartments-for-rent":
                urls.add(normalize_url(href))
    return sorted(urls)


def discover_city_urls(
    env: str, max_cities: int | None = None, expand_city_graph: bool = False
) -> list[str]:
    # Start from homepage, then expand by scanning discovered city pages for more city links.
    homepage_html = fetch_html(HOMEPAGE_URL, env=env)
    seed = extract_city_urls_from_html(homepage_html)
    logger.info("Initial city seeds from homepage: %s", len(seed))
    all_cities: set[str] = set(seed)

    if max_cities is not None and len(seed) >= max_cities:
        limited = sorted(seed)[:max_cities]
        logger.info("Using first %s city seeds due to max_cities", len(limited))
        return limited

    if not expand_city_graph:
        city_list = sorted(all_cities)
        if max_cities is not None:
            city_list = city_list[:max_cities]
        logger.info("Total discovered city URLs: %s", len(city_list))
        return city_list

    # Two-pass expansion catches many linked nearby metros without deep crawl explosion.
    frontier = list(seed)
    for _ in range(2):
        next_frontier: list[str] = []
        for city_url in frontier:
            try:
                html = fetch_html(city_url, env=env)
                urls = extract_city_urls_from_html(html)
                for u in urls:
                    if u not in all_cities:
                        all_cities.add(u)
                        next_frontier.append(u)
                        if max_cities is not None and len(all_cities) >= max_cities:
                            city_list = sorted(all_cities)[:max_cities]
                            logger.info("Reached max_cities=%s during discovery", max_cities)
                            return city_list
            except Exception as e:
                logger.debug("City discover failed %s: %s", city_url, e)
        frontier = next_frontier
        if not frontier:
            break

    city_list = sorted(all_cities)
    if max_cities is not None:
        city_list = city_list[:max_cities]
    logger.info("Total discovered city URLs: %s", len(city_list))
    return city_list


def extract_property_urls_from_city_html(html: str) -> list[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if not href.startswith("https://www.rentcafe.com/apartments/"):
            continue
        if "/default.aspx" not in href:
            continue
        urls.add(href.split("?")[0])
    return sorted(urls)


def discover_property_urls(env: str, city_urls: list[str]) -> list[str]:
    seen: set[str] = set()
    for city_url in city_urls:
        try:
            html = fetch_html(city_url, env=env)
            props = extract_property_urls_from_city_html(html)
            for p in props:
                seen.add(p)
            logger.info("Found %s properties in %s", len(props), city_url)
        except Exception as e:
            logger.warning("Failed city page %s: %s", city_url, e)
    out = sorted(seen)
    logger.info("Discovered %s unique property URLs", len(out))
    return out


def safe_json_ld_parse(raw: str):
    try:
        return json.loads(raw)
    except Exception:
        # Some pages include control chars; normalize quickly.
        try:
            cleaned = raw.replace("\r", " ").replace("\n", " ")
            cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", cleaned)
            return json.loads(cleaned)
        except Exception:
            return None


def _extract_field_from_html(html: str, key: str) -> str | None:
    # Works for JSON-LD-like fragments embedded in HTML scripts.
    # Example: "postalCode": "30342"
    pattern = rf'"{re.escape(key)}"\s*:\s*"([^"]+)"'
    m = re.search(pattern, html)
    if m:
        return m.group(1).strip()
    return None


def extract_property_meta(soup: BeautifulSoup, url: str) -> dict:
    meta = {
        "property_id": re.sub(r"[^a-zA-Z0-9]+", "-", urlparse(url).path.strip("/")).lower(),
        "property_name": None,
        "address": None,
        "city": None,
        "state": None,
        "zipcode": None,
        "latitude": None,
        "longitude": None,
        "phone": None,
        "description": None,
        "images": [],
    }

    ld_blocks = soup.find_all("script", attrs={"type": "application/ld+json"})
    for block in ld_blocks:
        raw = block.get_text(strip=True)
        data = safe_json_ld_parse(raw)
        if not data or not isinstance(data, dict):
            continue
        about = data.get("about", {}) if isinstance(data.get("about"), dict) else {}
        name = about.get("name") or data.get("name")
        if name and not meta["property_name"]:
            meta["property_name"] = str(name).strip()
        address = about.get("address") if isinstance(about.get("address"), dict) else data.get("address")
        if isinstance(address, dict):
            meta["address"] = meta["address"] or address.get("streetAddress")
            meta["city"] = meta["city"] or address.get("addressLocality")
            meta["state"] = meta["state"] or address.get("addressRegion")
            meta["zipcode"] = meta["zipcode"] or address.get("postalCode")
        geo = about.get("geo") if isinstance(about.get("geo"), dict) else data.get("geo")
        if isinstance(geo, dict):
            meta["latitude"] = meta["latitude"] or geo.get("latitude")
            meta["longitude"] = meta["longitude"] or geo.get("longitude")
        telephone = about.get("telephone") or data.get("telephone")
        if telephone and not meta["phone"]:
            meta["phone"] = str(telephone).strip()
        image = about.get("image") or data.get("image")
        if isinstance(image, list):
            for img in image:
                if isinstance(img, dict):
                    u = img.get("url")
                    if isinstance(u, str) and u.startswith("http"):
                        meta["images"].append(u)
                elif isinstance(img, str) and img.startswith("http"):
                    meta["images"].append(img)
        elif isinstance(image, str) and image.startswith("http"):
            meta["images"].append(image)

    title = soup.find("title")
    if title and not meta["property_name"]:
        meta["property_name"] = title.get_text(strip=True).split("|")[0].strip()

    if not meta["property_name"]:
        meta["property_name"] = "Unknown RentCafe Property"

    if not meta["description"]:
        desc = soup.find("meta", attrs={"name": "description"})
        if desc and desc.get("content"):
            meta["description"] = desc["content"].strip()

    # Fallback parsing from raw HTML text for pages where JSON-LD is malformed.
    raw_html = str(soup)
    meta["address"] = meta["address"] or _extract_field_from_html(raw_html, "streetAddress")
    meta["city"] = meta["city"] or _extract_field_from_html(raw_html, "addressLocality")
    meta["state"] = meta["state"] or _extract_field_from_html(raw_html, "addressRegion")
    meta["zipcode"] = meta["zipcode"] or _extract_field_from_html(raw_html, "postalCode")
    if meta["latitude"] is None:
        lat = _extract_field_from_html(raw_html, "latitude")
        try:
            meta["latitude"] = float(lat) if lat else None
        except ValueError:
            meta["latitude"] = None
    if meta["longitude"] is None:
        lon = _extract_field_from_html(raw_html, "longitude")
        try:
            meta["longitude"] = float(lon) if lon else None
        except ValueError:
            meta["longitude"] = None

    # URL path often abbreviates cities (e.g. /apartments/ny/new/... → "New").
    # Only use URL after HTML/JSON-LD so addressLocality wins over path segments.
    city_guess, state_guess = parse_city_state_from_property_url(url)
    if not city_guess or not state_guess:
        city_guess, state_guess = parse_city_slug(url)
    if not meta["city"]:
        meta["city"] = city_guess
    if not meta["state"]:
        meta["state"] = state_guess

    # RentCafe URLs use /apartments/ny/new/... for Manhattan; path-only city is "New".
    if (
        meta.get("city")
        and meta.get("state") == "NY"
        and str(meta["city"]).strip().lower() == "new"
    ):
        meta["city"] = "New York"

    # Dedupe image URLs preserving order.
    seen_img = set()
    images = []
    for u in meta["images"]:
        if u not in seen_img:
            seen_img.add(u)
            images.append(u)
    meta["images"] = images
    return meta


def extract_floorplan_rows(
    soup: BeautifulSoup,
    url: str,
    prop: dict,
    scraped_at: str,
    *,
    amenities: tuple[list[str], list[str]] | None = None,
) -> tuple[list[dict], list[dict]]:
    rows: list[dict] = []
    photos: list[dict] = []
    cards = soup.select(".fp-item")
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    comm_amenities_j = json.dumps(amenities[0]) if amenities else json.dumps([])
    apt_amenities_j = json.dumps(amenities[1]) if amenities else json.dumps([])

    for idx, card in enumerate(cards):
        fp_id = card.get("data-floorplan-id") or card.get("data-id") or f"fp_{idx}"
        name = card.get("data-name")
        beds_raw = card.get("data-beds")
        baths_raw = card.get("data-baths")
        sqft_raw = card.get("data-size")
        rent_raw = card.get("data-rent")

        beds = parse_beds(beds_raw)
        baths = parse_baths(baths_raw)
        sqft = parse_sqft(sqft_raw)
        rent_min, rent_max = parse_rent_range(rent_raw)

        unit_name = None
        unit_id = str(fp_id)
        floorplan_name = name
        listing_id = f"rentcafe_{prop['property_id']}_{unit_id}"

        img_tag = card.find("img")
        image_url = img_tag.get("src") if img_tag and img_tag.get("src") else None
        if image_url and image_url.startswith("http"):
            photos.append(
                {
                    "property_id": prop["property_id"],
                    "image_id": f"{prop['property_id']}_{idx}",
                    "image_index": idx,
                    "image_url": image_url,
                    "scraped_timestamp": scraped_ts,
                }
            )

        rows.append(
            {
                "listing_id": listing_id,
                "property_id": str(prop["property_id"]),
                "alternate_property_id": str(fp_id),
                "property_name": prop["property_name"],
                "address": prop["address"],
                "city": prop["city"],
                "state": prop["state"],
                "zipcode": prop["zipcode"],
                "latitude": prop["latitude"],
                "longitude": prop["longitude"],
                "floor_plan": floorplan_name,
                "unit_name": unit_name,
                "unit_id": unit_id,
                "beds": beds,
                "baths": baths,
                "sqft": sqft,
                "rent_price": rent_min,
                "rent_max": rent_max,
                "deposit": None,
                "availability_status": "available" if rent_min else "unavailable",
                "available_at": None,
                "lease_url": None,
                "lease_term": None,
                "listing_url": url,
                "email": None,
                "phone": prop["phone"],
                "description": prop["description"],
                "images": json.dumps(prop["images"]),
                "website": BASE_URL,
                "company": "RentCafe",
                "building_type": "apartment",
                "building_subtype": None,
                "floor_number": None,
                "community_amenities": comm_amenities_j,
                "apartment_amenities": apt_amenities_j,
                "fees": json.dumps([]),
                "year_built": None,
                "total_units": None,
                "stories": None,
                "scraped_timestamp": scraped_ts,
            }
        )

    return rows, photos


def save_raw_property_html(env: str, property_id: str, html: str, scraped_at: str):
    path = (
        f"env={env}/source=rentcafe/stage=raw/entity=property/"
        f"property_id={property_id}/scraped_at={scraped_at}/page.html.gz"
    )
    if env == "local":
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            f.write(html)
    else:
        client = _gcs_client()
        blob = client.bucket(GCS_BUCKET).blob(path)
        blob.upload_from_string(gzip.compress(html.encode("utf-8")), content_type="application/gzip")


def save_raw_property_json(env: str, property_id: str, data: dict, scraped_at: str):
    path = (
        f"env={env}/source=rentcafe/stage=raw/entity=property/"
        f"property_id={property_id}/scraped_at={scraped_at}/property.json.gz"
    )
    if env == "local":
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            json.dump(data, f)
    else:
        client = _gcs_client()
        blob = client.bucket(GCS_BUCKET).blob(path)
        payload = gzip.compress(json.dumps(data).encode("utf-8"))
        blob.upload_from_string(payload, content_type="application/gzip")


def enforce_unit_types(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return df
    string_cols = [
        "listing_id",
        "property_id",
        "alternate_property_id",
        "property_name",
        "address",
        "city",
        "state",
        "zipcode",
        "floor_plan",
        "unit_name",
        "unit_id",
        "availability_status",
        "available_at",
        "lease_url",
        "listing_url",
        "email",
        "phone",
        "description",
        "images",
        "website",
        "company",
        "building_type",
        "building_subtype",
        "community_amenities",
        "apartment_amenities",
        "fees",
        "year_built",
        "total_units",
        "stories",
        "scraped_timestamp",
    ]
    for col in string_cols:
        if col not in df.columns:
            df[col] = None
        df[col] = df[col].astype("string")
    for col in ["latitude", "longitude", "rent_price", "rent_max", "beds", "baths", "sqft", "deposit"]:
        if col not in df.columns:
            df[col] = None
        df[col] = pd.to_numeric(df[col], errors="coerce").astype("float64")
    for col in ["lease_term", "floor_number"]:
        if col not in df.columns:
            df[col] = None
        df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")
    return df


def quality_summary(df: pd.DataFrame) -> dict:
    if df.empty:
        return {
            "rows": 0,
            "unique_listing_ids": 0,
            "duplicate_listing_ids": 0,
            "available_rows": 0,
            "null_rates": {},
            "top_states": {},
            "top_cities": {},
        }
    null_cols = ["listing_id", "property_id", "property_name", "city", "state", "rent_price"]
    null_rates = {
        c: round(float(df[c].isna().mean()) * 100.0, 2) if c in df.columns else None for c in null_cols
    }
    dupes = int(df.duplicated(subset=["listing_id"]).sum()) if "listing_id" in df.columns else 0
    top_states = (
        df["state"].fillna("NA").astype(str).value_counts().head(10).to_dict()
        if "state" in df.columns
        else {}
    )
    top_cities = (
        df["city"].fillna("NA").astype(str).value_counts().head(10).to_dict()
        if "city" in df.columns
        else {}
    )
    return {
        "rows": int(len(df)),
        "unique_listing_ids": int(df["listing_id"].nunique(dropna=True)) if "listing_id" in df.columns else 0,
        "duplicate_listing_ids": dupes,
        "available_rows": int((df["availability_status"] == "available").sum())
        if "availability_status" in df.columns
        else 0,
        "null_rates": null_rates,
        "top_states": top_states,
        "top_cities": top_cities,
    }


def scrape_property(url: str, env: str, scraped_at: str) -> tuple[list[dict], list[dict]]:
    html = fetch_html(url, env=env)
    soup = BeautifulSoup(html, "html.parser")
    prop = extract_property_meta(soup, url)
    save_raw_property_html(env, prop["property_id"], html, scraped_at)
    save_raw_property_json(env, prop["property_id"], {"url": url, "meta": prop}, scraped_at)
    amenities = _amenities.parse_rentcafe_amenities(html)
    rows, photos = extract_floorplan_rows(
        soup, url, prop, scraped_at=scraped_at, amenities=amenities
    )
    return rows, photos


def upload_to_gcs(filepath: str, prefix: str):
    client = _gcs_client()
    blob = client.bucket(GCS_BUCKET).blob(f"{prefix}/{os.path.basename(filepath)}")
    blob.upload_from_filename(filepath)
    os.remove(filepath)


def run_scraper(
    env: str,
    output_format: str = "parquet",
    max_workers: int = 10,
    max_cities: int | None = None,
    max_properties: int | None = None,
    expand_city_graph: bool = False,
    seeds_file: str | None = None,
):
    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    output_dir = f"env={env}/source=rentcafe/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    if seeds_file and os.path.isfile(seeds_file):
        with open(seeds_file, encoding="utf-8") as f:
            property_urls = [line.strip() for line in f if line.strip() and not line.startswith("#")]
        city_urls = []
        logger.info("Using pre-discovered seeds: %s property URLs from %s", len(property_urls), seeds_file)
    else:
        city_urls = discover_city_urls(env=env, max_cities=max_cities, expand_city_graph=expand_city_graph)
        property_urls = discover_property_urls(env=env, city_urls=city_urls)
    if max_properties is not None:
        property_urls = property_urls[:max_properties]
    manifest = {
        "scraped_at": scraped_at,
        "city_count": len(city_urls),
        "property_count": len(property_urls),
        "expand_city_graph": expand_city_graph,
        "max_cities": max_cities,
        "max_properties": max_properties,
        "seeds_file": seeds_file,
        "cities_sample": city_urls[:20],
    }
    with open(os.path.join(output_dir, "discovery_manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    logger.info("Wrote discovery_manifest.json cities=%s properties=%s", len(city_urls), len(property_urls))
    logger.info("Scraping %s property pages", len(property_urls))

    all_rows: list[dict] = []
    all_photos: list[dict] = []
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_to_url = {ex.submit(scrape_property, u, env, scraped_at): u for u in property_urls}
        for fut in as_completed(fut_to_url):
            url = fut_to_url[fut]
            try:
                rows, photos = fut.result()
                all_rows.extend(rows)
                all_photos.extend(photos)
                logger.info("Parsed %s floorplans from %s", len(rows), url)
            except Exception as e:
                logger.error("Failed %s: %s", url, e)

    df = pd.DataFrame(all_rows)
    if not df.empty:
        df = enforce_unit_types(df)
        df = df.drop_duplicates(subset=["listing_id"], keep="last")
    photos_df = pd.DataFrame(all_photos).drop_duplicates(subset=["property_id", "image_url"], keep="first")

    units_file = os.path.join(output_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(output_dir, "images." + ("csv" if output_format == "csv" else "parquet"))
    if output_format == "csv":
        df.to_csv(units_file, index=False)
        photos_df.to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        photos_df.to_parquet(photos_file, index=False)

    logger.info(
        "RentCafe scrape complete: properties=%s rows=%s available=%s photos=%s",
        len(property_urls),
        len(df),
        len(df[df["availability_status"] == "available"]) if not df.empty else 0,
        len(photos_df),
    )
    summary = quality_summary(df)
    logger.info("Quality summary: %s", json.dumps(summary))
    summary_path = os.path.join(output_dir, "quality_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    if env != "local":
        upload_to_gcs(log_filename, f"env={env}/source=rentcafe/logs/scraped_at={scraped_at}")
        upload_to_gcs(
            units_file,
            f"env={env}/source=rentcafe/stage=processed/entity=property/property_id=rentcafe/load_date={scraped_at}",
        )
        upload_to_gcs(
            photos_file,
            f"env={env}/source=rentcafe/stage=processed/entity=photo/property_id=rentcafe/load_date={scraped_at}",
        )
        upload_to_gcs(
            summary_path,
            f"env={env}/source=rentcafe/stage=processed/entity=property/property_id=rentcafe/load_date={scraped_at}",
        )


def process_local(env: str, output_format: str = "parquet", scraped_at: str | None = None):
    if not scraped_at:
        base_glob = f"env={env}/source=rentcafe/stage=raw/entity=property/property_id=*/scraped_at=*"
        scraped_at_dirs = glob(base_glob)
        dates = sorted({Path(p).parts[-1].split("=")[-1] for p in scraped_at_dirs})
        if not dates:
            raise ValueError("No scraped_at folders found in rentcafe raw data")
        scraped_at = dates[-1]

    raw_glob = f"env={env}/source=rentcafe/stage=raw/entity=property/property_id=*/scraped_at={scraped_at}/page.html.gz"
    paths = sorted(glob(raw_glob))
    logger.info("process_local reading %s pages for scraped_at=%s", len(paths), scraped_at)

    rows: list[dict] = []
    photos: list[dict] = []
    for path in paths:
        try:
            with gzip.open(path, "rt", encoding="utf-8") as f:
                html = f.read()
            soup = BeautifulSoup(html, "html.parser")
            prop_id = Path(path).parts[-3].split("=")[-1]
            url = extract_canonical_listing_url(soup) or property_id_to_listing_url(prop_id)
            prop = extract_property_meta(soup, url=url)
            prop["property_id"] = prop_id
            am = _amenities.parse_rentcafe_amenities(html)
            r, p = extract_floorplan_rows(
                soup, url=url, prop=prop, scraped_at=scraped_at, amenities=am
            )
            rows.extend(r)
            photos.extend(p)
        except Exception as e:
            logger.error("process_local failed %s: %s", path, e)

    output_dir = f"env={env}/source=rentcafe/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(rows)
    if not df.empty:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    photos_df = pd.DataFrame(photos).drop_duplicates(subset=["property_id", "image_url"], keep="first")

    units_file = os.path.join(output_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(output_dir, "images." + ("csv" if output_format == "csv" else "parquet"))
    if output_format == "csv":
        df.to_csv(units_file, index=False)
        photos_df.to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        photos_df.to_parquet(photos_file, index=False)
    logger.info("process_local complete rows=%s photos=%s", len(df), len(photos_df))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", required=True, choices=["local", "dev", "test", "prod"])
    parser.add_argument("--mode", default="scrape", choices=["scrape", "process_local"])
    parser.add_argument("--format", default="parquet", choices=["parquet", "csv"])
    parser.add_argument("--max_workers", type=int, default=10)
    parser.add_argument("--max_cities", type=int, default=None)
    parser.add_argument("--max_properties", type=int, default=None)
    parser.add_argument("--expand_city_graph", action="store_true")
    parser.add_argument("--seeds", default=None, help="Pre-discovered property URL file (one URL per line)")
    parser.add_argument("--scrape_date", default=None)
    args = parser.parse_args()

    if args.mode == "scrape":
        run_scraper(
            env=args.env,
            output_format=args.format,
            max_workers=args.max_workers,
            max_cities=args.max_cities,
            max_properties=args.max_properties,
            expand_city_graph=args.expand_city_graph,
            seeds_file=args.seeds,
        )
    else:
        process_local(env=args.env, output_format=args.format, scraped_at=args.scrape_date)
