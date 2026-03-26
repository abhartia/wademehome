"""
Entrata-oriented marketing-site scraper (v1).

Many Entrata consumer sites are React/Next.js SPAs. v1 extracts:
  - Embedded __NEXT_DATA__ JSON (recursive walk for unit/floorplan-like dicts)
  - JSON-LD (ApartmentComplex / Place with address/geo)
  - Inline propertyId-style hints in HTML

Seeds must be pages that actually expose inventory in embedded JSON or JSON-LD.
Resident / authenticated Entrata APIs are out of scope.
"""
from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import logging
import os
import re
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from glob import glob
from pathlib import Path
from urllib.parse import quote, urlparse, urlunparse

import cloudscraper
import pandas as pd
import requests
from bs4 import BeautifulSoup

from proxy_manager import ProxyManager

GCS_BUCKET = "scrapers-v2"
COMPANY = "Entrata"
NOMINATIM_UA = "wademehome-entrata-scraper/1.0 (contact: dev@local)"

proxy_manager = ProxyManager(["IP_1:3128", "IP_1:3128", "IP_1:3128", "IP_1:3128"])

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/entrata_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("entrata_scraper")
thread_local = threading.local()


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError(
            "google-cloud-storage is required when env is not 'local'. "
            "Use --env local or install requirements.txt."
        ) from e
    return storage.Client()


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
    thread_local.session = session
    return session


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


def url_folder_id(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:24]


def extract_next_data(html: str) -> dict | None:
    m = re.search(
        r'<script[^>]+id=["\']__NEXT_DATA__["\'][^>]*>(.*?)</script>',
        html,
        re.DOTALL | re.I,
    )
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except (json.JSONDecodeError, TypeError):
        return None


def _lower_key_map(d: dict) -> dict:
    return {str(k).lower(): (k, v) for k, v in d.items() if isinstance(k, str)}


def _pick_first(d: dict, *names: str):
    lk = _lower_key_map(d)
    for n in names:
        if n.lower() in lk:
            _, v = lk[n.lower()]
            if v is not None and v != "":
                return v
    return None


def _parse_float(v) -> float | None:
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    m = re.search(r"[\d,]+(?:\.\d+)?", s.replace(",", ""))
    if not m:
        return None
    try:
        return float(m.group(0).replace(",", ""))
    except ValueError:
        return None


def is_likely_inventory_leaf(d: dict) -> bool:
    if not isinstance(d, dict) or len(d) < 2:
        return False
    rent = _pick_first(
        d,
        "rent",
        "minRent",
        "maxRent",
        "startingRent",
        "baseRent",
        "price",
        "monthlyRent",
        "fromRent",
        "startingPrice",
        "totalRentStartingPrice",
    )
    if _parse_float(rent) is None:
        return False
    uid = _pick_first(d, "unitId", "unit_id", "unitNumber", "unit_number", "id", "apartmentNumber", "aptNumber")
    fp = _pick_first(d, "floorPlanId", "floor_plan_id", "floorPlanName", "name", "floorplanName")
    return bool(uid or fp)


def walk_collect_inventory(obj, acc: list[dict]) -> None:
    if isinstance(obj, dict):
        if is_likely_inventory_leaf(obj):
            acc.append(obj)
        for v in obj.values():
            walk_collect_inventory(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            walk_collect_inventory(v, acc)


def extract_property_id_hint(html: str) -> str | None:
    for pat in (
        r'"propertyId"\s*:\s*(\d+)',
        r'"property_id"\s*:\s*(\d+)',
        r"data-property-id=[\"'](\d+)[\"']",
        r"propertyId\s*=\s*(\d+)",
        r'"propertyID"\s*:\s*(\d+)',
    ):
        m = re.search(pat, html, re.I)
        if m:
            return m.group(1)
    return None


def extract_json_ld_property(soup: BeautifulSoup) -> dict | None:
    """First ApartmentComplex / Residence with address we can flatten."""
    for script in soup.find_all("script", attrs={"type": True}):
        t = (script.get("type") or "").lower()
        if "ld+json" not in t:
            continue
        raw = script.string or script.get_text() or ""
        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            continue
        candidates = data if isinstance(data, list) else [data]
        for item in candidates:
            if not isinstance(item, dict):
                continue
            typ = item.get("@type")
            types = typ if isinstance(typ, list) else [typ] if typ else []
            if not any(str(x) in ("ApartmentComplex", "Residence", "LocalBusiness") for x in types):
                continue
            addr = item.get("address")
            street = city = state = zipc = None
            lat = lon = None
            if isinstance(addr, dict):
                street = addr.get("streetAddress")
                city = addr.get("addressLocality")
                state = addr.get("addressRegion")
                zipc = addr.get("postalCode")
            geo = item.get("geo")
            if isinstance(geo, dict):
                lat = _parse_float(geo.get("latitude"))
                lon = _parse_float(geo.get("longitude"))
            return {
                "property_name": item.get("name"),
                "address": street,
                "city": city,
                "state": state,
                "zipcode": zipc,
                "latitude": lat,
                "longitude": lon,
                "description": item.get("description"),
            }
    return None


def geocode_nominatim(query: str) -> tuple[float | None, float | None]:
    try:
        r = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": query, "format": "json", "limit": "1"},
            headers={"User-Agent": NOMINATIM_UA},
            timeout=25,
        )
        r.raise_for_status()
        data = r.json()
        if not data:
            return None, None
        return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        logger.debug("Nominatim %s", e)
        return None, None


def rows_from_fp_dom_cards(
    soup: BeautifulSoup,
    url: str,
    *,
    prop_id: str,
    prop_name: str | None,
    address,
    city,
    state,
    zipcode,
    plat,
    plon,
    scraped_ts: str,
    description,
) -> list[dict]:
    """Fallback: RentCafe-style .fp-item / data-floorplan-id marketing cards."""
    rows: list[dict] = []
    cards = soup.select(".fp-item, [data-floorplan-id]")
    for idx, card in enumerate(cards):
        fp_id = card.get("data-floorplan-id") or card.get("data-id") or f"fp_{idx}"
        name = card.get("data-name")
        rent_raw = card.get("data-rent")
        rent = _parse_float(rent_raw)
        beds = _parse_float(card.get("data-beds"))
        baths = _parse_float(card.get("data-baths"))
        sqft = _parse_float(card.get("data-size"))
        unit_id = str(fp_id)
        listing_id = f"entrata_{prop_id}_{unit_id}"
        rows.append(
            {
                "listing_id": listing_id,
                "property_id": str(prop_id),
                "alternate_property_id": str(fp_id),
                "property_name": prop_name,
                "address": address,
                "city": city,
                "state": state,
                "zipcode": zipcode,
                "latitude": plat,
                "longitude": plon,
                "floor_plan": str(name)[:500] if name else None,
                "unit_name": None,
                "unit_id": unit_id,
                "beds": beds,
                "baths": baths,
                "sqft": sqft,
                "rent_price": rent,
                "rent_max": rent,
                "deposit": None,
                "availability_status": "available" if rent else "unavailable",
                "available_at": None,
                "lease_url": None,
                "lease_term": None,
                "listing_url": url,
                "email": None,
                "phone": None,
                "description": description,
                "images": json.dumps([]),
                "website": urlparse(url).netloc,
                "company": COMPANY,
                "building_type": "apartment",
                "building_subtype": None,
                "floor_number": None,
                "community_amenities": json.dumps([]),
                "apartment_amenities": json.dumps([]),
                "fees": json.dumps([]),
                "concessions": None,
                "year_built": None,
                "total_units": None,
                "stories": None,
                "scraped_timestamp": scraped_ts,
            }
        )
    return rows


def extract_jonah_digital_config(html: str) -> dict | None:
    soup = BeautifulSoup(html, "html.parser")
    for sc in soup.find_all("script"):
        if not sc.string:
            continue
        t = sc.string.strip()
        if not t.startswith('{"version"'):
            continue
        try:
            data = json.loads(t)
        except (json.JSONDecodeError, TypeError):
            continue
        if data.get("renderable_endpoint") == "_fp-renderable" and data.get("base_uri"):
            return data
    return None


def infer_address_from_marketing_soup(soup: BeautifulSoup) -> tuple[str | None, str | None, str | None, str | None]:
    text = soup.get_text("\n", strip=True)
    m = re.search(
        r"(\d[\w\s.\#'\-/]+)\s*\|\s*([^,\n]+),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?",
        text,
        re.MULTILINE,
    )
    if m:
        return m.group(1).strip(), m.group(2).strip(), m.group(3).strip(), m.group(4).strip()
    m2 = re.search(
        r"(\d[\w\s.\#'\-/]{5,80}),\s*([^,\n]+),\s*([A-Z]{2})\s+(\d{5})\b",
        text,
    )
    if m2:
        return m2.group(1).strip(), m2.group(2).strip(), m2.group(3).strip(), m2.group(4).strip()
    return None, None, None, None


def rows_from_jonah_listing_chunks(
    *,
    html: str,
    seed_url: str,
    session,
    scraped_ts: str,
    prop_id: str,
    prop_name: str | None,
    address,
    city,
    state,
    zipcode,
    plat,
    plon,
    meta_description: str | None,
) -> list[dict]:
    cfg = extract_jonah_digital_config(html)
    if not cfg or session is None:
        return []
    base_uri = cfg.get("base_uri")
    if not isinstance(base_uri, str) or not base_uri.startswith("/"):
        return []
    parsed = urlparse(seed_url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return []
    instance_key = hashlib.md5(parsed.path.encode("utf-8")).hexdigest()
    param = f"params:instance={instance_key}&action=render&type=listing-chunks"
    enc = quote(param, safe="")
    chunks_path = f"{base_uri.rstrip('/')}/_fp-renderable/{enc}/?forcecache=1"
    chunks_url = urlunparse((parsed.scheme, parsed.netloc, chunks_path, "", "", ""))
    try:
        r = session.get(
            chunks_url,
            timeout=50,
            headers={
                "Referer": seed_url,
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "*/*",
            },
        )
        r.raise_for_status()
    except Exception as e:
        logger.warning("Jonah listing-chunks failed %s: %s", chunks_url, e)
        return []
    if len(r.text) < 200 or "jd-fp-floorplan-card" not in r.text:
        return []

    if not (city and state):
        sa, scity, sst, szip = infer_address_from_marketing_soup(BeautifulSoup(html, "html.parser"))
        if scity:
            address = address or sa
            city, state, zipcode = scity, sst, szip

    # Regex on raw HTML: Jonah chunks sometimes confuse html.parser/lxml (NavigableString text
    # not visible to get_text on <span>); card blocks are small and stable.
    card_pat = re.compile(
        r'<a(?=[^>]*jd-fp-floorplan-card)(?=[^>]*data-floorplan="(\d+)")[^>]*>[\s\S]*?</a>',
        re.I,
    )
    rows: list[dict] = []
    for m in card_pat.finditer(r.text):
        block = m.group(0)
        fp_id = m.group(1)
        t_m = re.search(r'(?:title|aria-label)="([^"]+)"', block, re.I)
        fp_title = None
        if t_m:
            raw_t = t_m.group(1).strip()
            if raw_t.lower().startswith("floorplan "):
                fp_title = raw_t[10:].strip()
            elif raw_t.lower().startswith("view floorplan "):
                fp_title = raw_t[15:].strip()
            elif raw_t.lower().startswith("view floor plan "):
                fp_title = raw_t[16:].strip()
            else:
                fp_title = raw_t[:200]
        rent = None
        pr = re.search(
            r"(?:Starting at|From|Starting)\s*(?:\$|USD\s*)?([\d,]+(?:\.\d+)?)",
            block,
            re.I,
        )
        if pr:
            rent = _parse_float(pr.group(1))
        beds = baths = sqft = None
        if re.search(r">\s*Studio\s*<", block, re.I):
            beds = 0.0
        else:
            bd = re.search(r"(\d+)\s*(?:bed|br|bedroom)s?\b", block, re.I)
            if bd:
                beds = _parse_float(bd.group(1))
        bt = re.search(r"(\d+)\s*baths?\b", block, re.I)
        if bt:
            baths = _parse_float(bt.group(1))
        sf = re.search(r"([\d,]+)\s*sq\.?\s*ft", block, re.I)
        if sf:
            sqft = _parse_float(sf.group(1))

        listing_id = f"entrata_{prop_id}_{fp_id}"
        rows.append(
            {
                "listing_id": listing_id,
                "property_id": str(prop_id),
                "alternate_property_id": fp_id,
                "property_name": prop_name,
                "address": address,
                "city": city,
                "state": state,
                "zipcode": zipcode,
                "latitude": plat,
                "longitude": plon,
                "floor_plan": str(fp_title)[:500] if fp_title else None,
                "unit_name": fp_title,
                "unit_id": fp_id,
                "beds": beds,
                "baths": baths,
                "sqft": sqft,
                "rent_price": rent,
                "rent_max": rent,
                "deposit": None,
                "availability_status": "available" if rent else "unavailable",
                "available_at": None,
                "lease_url": None,
                "lease_term": None,
                "listing_url": seed_url,
                "email": None,
                "phone": None,
                "description": meta_description,
                "images": json.dumps([]),
                "website": parsed.netloc,
                "company": COMPANY,
                "building_type": "apartment",
                "building_subtype": None,
                "floor_number": None,
                "community_amenities": json.dumps([]),
                "apartment_amenities": json.dumps([]),
                "fees": json.dumps([]),
                "concessions": None,
                "year_built": None,
                "total_units": None,
                "stories": None,
                "scraped_timestamp": scraped_ts,
            }
        )
    return rows


def rows_from_seed_page(
    html: str,
    url: str,
    *,
    scraped_ts: str,
    geocode: bool,
    session=None,
) -> tuple[list[dict], list[dict]]:
    soup = BeautifulSoup(html, "html.parser")
    photos: list[dict] = []
    meta = extract_json_ld_property(soup)
    prop_id = extract_property_id_hint(html) or url_folder_id(url)
    prop_name = None
    address = city = state = zipcode = None
    plat = plon = None
    if meta:
        prop_name = meta.get("property_name")
        address = meta.get("address")
        city = meta.get("city")
        state = meta.get("state")
        zipcode = meta.get("zipcode")
        plat = meta.get("latitude")
        plon = meta.get("longitude")
    if not prop_name:
        title = soup.find("title")
        if title:
            prop_name = title.get_text(strip=True).split("|")[0][:200]
    if geocode and (plat is None or plon is None) and (city and state):
        plat, plon = geocode_nominatim(f"{city}, {state}")

    rows: list[dict] = []
    if extract_jonah_digital_config(html):
        rows.extend(
            rows_from_jonah_listing_chunks(
                html=html,
                seed_url=url,
                session=session,
                scraped_ts=scraped_ts,
                prop_id=str(prop_id),
                prop_name=prop_name,
                address=address,
                city=city,
                state=state,
                zipcode=zipcode,
                plat=plat,
                plon=plon,
                meta_description=(meta or {}).get("description") if meta else None,
            )
        )

    leaves: list[dict] = []
    nd = extract_next_data(html)
    if nd:
        walk_collect_inventory(nd, leaves)

    if not rows:
        for i, leaf in enumerate(leaves):
            rent = _parse_float(
                _pick_first(
                    leaf,
                    "rent",
                    "minRent",
                    "maxRent",
                    "startingRent",
                    "baseRent",
                    "price",
                    "monthlyRent",
                    "fromRent",
                    "startingPrice",
                    "totalRentStartingPrice",
                )
            )
            uid = _pick_first(leaf, "unitId", "unit_id", "unitNumber", "unit_number", "id", "apartmentNumber", "aptNumber")
            fp_name = _pick_first(leaf, "floorPlanName", "floorplanName", "name", "floorPlanId", "floor_plan_id")
            beds = _parse_float(_pick_first(leaf, "beds", "bedrooms", "bedRooms"))
            baths = _parse_float(_pick_first(leaf, "baths", "bathrooms", "bathRooms"))
            sqft = _parse_float(_pick_first(leaf, "sqft", "squareFeet", "square_feet", "size"))
            unit_key = str(uid or fp_name or i)
            safe_key = re.sub(r"[^\w\-]+", "_", unit_key)[:80]
            listing_id = f"entrata_{prop_id}_{safe_key}"

            rows.append(
                {
                    "listing_id": listing_id,
                    "property_id": str(prop_id),
                    "alternate_property_id": str(uid) if uid is not None else None,
                    "property_name": prop_name,
                    "address": address,
                    "city": city,
                    "state": state,
                    "zipcode": zipcode,
                    "latitude": plat,
                    "longitude": plon,
                    "floor_plan": str(fp_name)[:500] if fp_name else None,
                    "unit_name": str(uid) if uid else None,
                    "unit_id": str(uid) if uid else str(i),
                    "beds": beds,
                    "baths": baths,
                    "sqft": sqft,
                    "rent_price": rent,
                    "rent_max": rent,
                    "deposit": None,
                    "availability_status": "available" if rent else "unavailable",
                    "available_at": None,
                    "lease_url": None,
                    "lease_term": None,
                    "listing_url": url,
                    "email": None,
                    "phone": None,
                    "description": (meta or {}).get("description") if meta else None,
                    "images": json.dumps([]),
                    "website": urlparse(url).netloc,
                    "company": COMPANY,
                    "building_type": "apartment",
                    "building_subtype": None,
                    "floor_number": _parse_float(_pick_first(leaf, "floor", "floorNumber", "floor_number")),
                    "community_amenities": json.dumps([]),
                    "apartment_amenities": json.dumps([]),
                    "fees": json.dumps([]),
                    "concessions": None,
                    "year_built": None,
                    "total_units": None,
                    "stories": None,
                    "scraped_timestamp": scraped_ts,
                }
            )

    if not rows:
        rows.extend(
            rows_from_fp_dom_cards(
                soup,
                url,
                prop_id=prop_id,
                prop_name=prop_name,
                address=address,
                city=city,
                state=state,
                zipcode=zipcode,
                plat=plat,
                plon=plon,
                scraped_ts=scraped_ts,
                description=(meta or {}).get("description") if meta else None,
            )
        )

    if not rows and meta:
        listing_id = f"entrata_{prop_id}_property"
        rows.append(
            {
                "listing_id": listing_id,
                "property_id": str(prop_id),
                "alternate_property_id": None,
                "property_name": prop_name,
                "address": address,
                "city": city,
                "state": state,
                "zipcode": zipcode,
                "latitude": plat,
                "longitude": plon,
                "floor_plan": None,
                "unit_name": None,
                "unit_id": "property",
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
                "listing_url": url,
                "email": None,
                "phone": None,
                "description": meta.get("description"),
                "images": json.dumps([]),
                "website": urlparse(url).netloc,
                "company": COMPANY,
                "building_type": "apartment",
                "building_subtype": None,
                "floor_number": None,
                "community_amenities": json.dumps([]),
                "apartment_amenities": json.dumps([]),
                "fees": json.dumps([]),
                "concessions": None,
                "year_built": None,
                "total_units": None,
                "stories": None,
                "scraped_timestamp": scraped_ts,
            }
        )

    return rows, photos


def save_raw_gz(env: str, folder_id: str, scraped_at: str, text: str):
    path = (
        f"env={env}/source=entrata/stage=raw/entity=property/"
        f"property_id={folder_id}/scraped_at={scraped_at}/page.html.gz"
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


def empty_typed_units_dataframe() -> pd.DataFrame:
    """Zero-row frame with full schema for loader compatibility."""
    return enforce_unit_types(
        pd.DataFrame(
            [
                {
                    "listing_id": "entrata_placeholder",
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
                    "community_amenities": "[]",
                    "apartment_amenities": "[]",
                    "fees": "[]",
                    "concessions": None,
                    "year_built": None,
                    "total_units": None,
                    "stories": None,
                    "scraped_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
                }
            ]
        )
    ).iloc[:0]


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
        "concessions",
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
    null_cols = [
        "listing_id",
        "property_id",
        "property_name",
        "city",
        "state",
        "zipcode",
        "rent_price",
        "latitude",
        "longitude",
    ]
    null_rates = {
        c: round(float(df[c].isna().mean()) * 100.0, 2) if c in df.columns else None for c in null_cols
    }
    dupes = int(df.duplicated(subset=["listing_id"]).sum()) if "listing_id" in df.columns else 0
    top_states = (
        df["state"].fillna("NA").astype(str).value_counts().head(10).to_dict() if "state" in df.columns else {}
    )
    top_cities = (
        df["city"].fillna("NA").astype(str).value_counts().head(10).to_dict() if "city" in df.columns else {}
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


def scrape_seed_url(url: str, env: str, scraped_at: str, geocode: bool) -> tuple[list[dict], list[dict], str]:
    session = get_session(env)
    r = session.get(url, timeout=50)
    r.raise_for_status()
    html = r.text
    folder_id = url_folder_id(url)
    save_raw_gz(env, folder_id, scraped_at, html)
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    rows, photos = rows_from_seed_page(html, url, scraped_ts=scraped_ts, geocode=geocode, session=session)
    return rows, photos, folder_id


def upload_to_gcs(filepath: str, prefix: str):
    client = _gcs_client()
    blob = client.bucket(GCS_BUCKET).blob(f"{prefix}/{os.path.basename(filepath)}")
    blob.upload_from_filename(filepath)
    os.remove(filepath)


def run_scraper(
    env: str,
    seeds_paths: list[str],
    output_format: str = "parquet",
    max_workers: int = 4,
    max_properties: int | None = None,
    geocode: bool = False,
):
    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    seeds = load_seeds_merged(seeds_paths)
    n_merged = len(seeds)
    if max_properties is not None:
        seeds = seeds[:max_properties]
    logger.info("Entrata discovery v1: merged_seeds=%s after_cap=%s", n_merged, len(seeds))
    if not seeds:
        logger.warning("No seed URLs after merge; writing empty typed parquet (add seeds for data).")

    output_dir = f"env={env}/source=entrata/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    all_rows: list[dict] = []
    all_photos: list[dict] = []
    ok = fail = 0

    def _one(u: str):
        return scrape_seed_url(u, env, scraped_at, geocode=geocode)

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_map = {ex.submit(_one, u): u for u in seeds}
        for fut in as_completed(fut_map):
            u = fut_map[fut]
            try:
                rows, photos, _ = fut.result()
                all_rows.extend(rows)
                all_photos.extend(photos)
                ok += 1
                logger.info("Parsed %s rows from %s", len(rows), u)
            except Exception as e:
                fail += 1
                logger.error("Failed %s: %s", u, e)
    logger.info("Run metrics: seeds_ok=%s seeds_failed=%s row_count=%s", ok, fail, len(all_rows))

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
        try:
            upload_to_gcs(log_filename, f"env={env}/source=entrata/logs/scraped_at={scraped_at}")
        except Exception as e:
            logger.warning("Log upload failed: %s", e)
        upload_to_gcs(
            units_file,
            f"env={env}/source=entrata/stage=processed/entity=property/property_id=entrata/load_date={scraped_at}",
        )
        upload_to_gcs(
            photos_file,
            f"env={env}/source=entrata/stage=processed/entity=photo/property_id=entrata/load_date={scraped_at}",
        )
        upload_to_gcs(
            summary_path,
            f"env={env}/source=entrata/stage=processed/entity=property/property_id=entrata/load_date={scraped_at}",
        )


def process_local(env: str, output_format: str = "parquet", scraped_at: str | None = None):
    if not scraped_at:
        dirs = glob(f"env={env}/source=entrata/stage/raw/entity=property/property_id=*/scraped_at=*")
        dates = sorted({Path(p).parts[-1].split("=")[-1] for p in dirs})
        if not dates:
            raise ValueError("No entrata raw scraped_at folders found")
        scraped_at = dates[-1]

    paths = sorted(
        glob(f"env={env}/source=entrata/stage/raw/entity=property/property_id=*/scraped_at={scraped_at}/page.html.gz")
    )
    rows: list[dict] = []
    photos: list[dict] = []
    for path in paths:
        try:
            with gzip.open(path, "rt", encoding="utf-8") as f:
                html = f.read()
            folder_id = Path(path).parts[-3].split("=", 1)[-1]
            url = f"https://local.reprocess/entrata/{folder_id}"
            scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
            r, p = rows_from_seed_page(html, url, scraped_ts=scraped_ts, geocode=False)
            rows.extend(r)
            photos.extend(p)
        except Exception as e:
            logger.error("process_local failed %s: %s", path, e)

    out_dir = f"env={env}/source=entrata/stage=processed/entity=property/load_date={scraped_at}"
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(rows)
    if df.empty:
        df = empty_typed_units_dataframe()
    else:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    pdf = pd.DataFrame(photos)
    ext = "csv" if output_format == "csv" else "parquet"
    units_path = os.path.join(out_dir, f"units.{ext}")
    photos_path = os.path.join(out_dir, f"images.{ext}")
    if output_format == "csv":
        df.to_csv(units_path, index=False)
        pdf.to_csv(photos_path, index=False)
    else:
        df.to_parquet(units_path, index=False)
        pdf.to_parquet(photos_path, index=False)
    with open(os.path.join(out_dir, "quality_summary.json"), "w", encoding="utf-8") as f:
        json.dump(quality_summary(df), f, indent=2)
    logger.info("process_local complete rows=%s", len(df))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Entrata-oriented marketing site scraper (embedded JSON / JSON-LD)")
    parser.add_argument("--env", required=True, choices=["local", "dev", "test", "prod"])
    parser.add_argument("--mode", default="scrape", choices=["scrape", "process_local"])
    parser.add_argument("--format", default="parquet", choices=["parquet", "csv"])
    parser.add_argument("--seeds", nargs="+", default=["seeds.txt"], help="Seed URL files (merged)")
    parser.add_argument("--max_workers", type=int, default=4)
    parser.add_argument("--max_properties", type=int, default=None)
    parser.add_argument("--geocode", action="store_true")
    parser.add_argument("--scrape_date", default=None)
    args = parser.parse_args()
    if args.mode == "scrape":
        run_scraper(
            env=args.env,
            seeds_paths=args.seeds,
            output_format=args.format,
            max_workers=args.max_workers,
            max_properties=args.max_properties,
            geocode=args.geocode,
        )
    else:
        process_local(env=args.env, output_format=args.format, scraped_at=args.scrape_date)
