"""
RealPage OneSite (consumer) scraper — v1 targets SecureCafe `floorplans.aspx` flows.

Flow (spike-verified on parkmerced.securecafe.com):
  1) GET …/onlineleasing/{sitekey}/floorplans.aspx
  2) POST {host}/onlineleasing/rcLoadContent.ashx?contentclass=availableunits
     (not under /onlineleasing/{sitekey}/) with repeated floorPlans=<bed bucket>.
  3) Parse HTML: tr.AvailUnitRow, th#<unitNumericId>, .unit-address, rent td.

Geo: Parsed from each unit address line (street, city, state, zip). Optional
Nominatim geocode (--geocode) fills latitude/longitude once per property (1.1s delay).
"""
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
import requests
from bs4 import BeautifulSoup

from proxy_manager import ProxyManager

GCS_BUCKET = "scrapers-v2"
COMPANY = "RealPage"
NOMINATIM_UA = "wademehome-realpage-scraper/1.0 (contact: dev@local)"


def _gcs_client():
    try:
        from google.cloud import storage
    except ImportError as e:
        raise ImportError(
            "google-cloud-storage is required when env is not 'local'. "
            "Use --env local or install requirements.txt."
        ) from e
    return storage.Client()


proxy_manager = ProxyManager(
    ["IP_1:3128", "IP_1:3128", "IP_1:3128", "IP_1:3128"]
)

Path("logs").mkdir(exist_ok=True)
log_filename = f"logs/realpage_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(log_filename), logging.StreamHandler()],
)
logger = logging.getLogger("realpage_scraper")
thread_local = threading.local()


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
            logger.warning("Seed file missing (skip): %s", path)
            continue
        for u in load_seeds(path):
            if u not in seen:
                seen.add(u)
                out.append(u)
    return out


def fetch_crt_securecafe_hostnames() -> list[str]:
    """Hostnames from certificate transparency (crt.sh) matching *.securecafe.com."""
    # Wildcard queries often fail; search registrable domain and filter. crt.sh is often rate-limited.
    last_err: Exception | None = None
    r = None
    for attempt in range(3):
        try:
            r = requests.get(
                "https://crt.sh/",
                params={"q": "securecafe.com", "output": "json"},
                headers={"User-Agent": NOMINATIM_UA},
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
    hosts: set[str] = set()
    for row in rows:
        nv = row.get("name_value") or ""
        for part in nv.splitlines():
            part = part.strip().lower().rstrip(".")
            if part.startswith("*."):
                part = part[2:]
            if part.endswith(".securecafe.com") and part != "securecafe.com":
                hosts.add(part)
    return sorted(hosts)


def host_to_floorplans_candidates(hostname: str) -> list[str]:
    h = hostname.lower().replace("www.", "")
    if not h.endswith(".securecafe.com"):
        return []
    left = h[: -len(".securecafe.com")].strip(".")
    if not left:
        return []
    sitekey = left.split(".")[-1]
    base = f"https://{h}"
    return [f"{base}/onlineleasing/{sitekey}/floorplans.aspx"]


def probe_securecafe_floorplans_url(url: str, timeout: int = 45) -> tuple[bool, str]:
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
    try:
        r = session.get(url, timeout=timeout, allow_redirects=True)
        final = (r.url or "").lower()
        if "rentcafe.com" in urlparse(final).netloc:
            return False, "redirect_rentcafe"
        if r.status_code != 200:
            return False, f"http_{r.status_code}"
        if not extract_rp_property_id(r.text):
            return False, "no_property_id"
        if "onlineleasing" not in r.text.lower() and "floorplan" not in r.text.lower():
            return False, "unexpected_body"
        return True, "ok"
    except Exception as e:
        return False, f"err_{type(e).__name__}"


def run_probe_seeds(
    *,
    source: str,
    probe_input: str | None,
    probe_output: str,
    crt_max_hosts: int,
    max_probe: int,
    max_workers: int,
) -> None:
    candidates: list[str] = []
    if source == "crt":
        hosts = fetch_crt_securecafe_hostnames()
        hosts = hosts[:crt_max_hosts]
        logger.info("CRT: unique securecafe hosts (capped): %s", len(hosts))
        for h in hosts:
            candidates.extend(host_to_floorplans_candidates(h))
    else:
        if not probe_input or not os.path.isfile(probe_input):
            raise ValueError("--probe-input must exist when --probe-source file")
        with open(probe_input, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith("http"):
                    candidates.append(line.split()[0])
                else:
                    for c in host_to_floorplans_candidates(line):
                        candidates.append(c)
    seen: set[str] = set()
    uniq: list[str] = []
    for c in candidates:
        if c not in seen:
            seen.add(c)
            uniq.append(c)
    uniq = uniq[:max_probe]
    logger.info("Probing %s candidate URLs (max_workers=%s)", len(uniq), max_workers)
    ok_urls: list[str] = []
    reasons: dict[str, int] = {}
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_map = {ex.submit(probe_securecafe_floorplans_url, u): u for u in uniq}
        for fut in as_completed(fut_map):
            u = fut_map[fut]
            ok, reason = fut.result()
            reasons[reason] = reasons.get(reason, 0) + 1
            if ok:
                ok_urls.append(u)
    out_abs = os.path.abspath(probe_output)
    parent = os.path.dirname(out_abs)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(probe_output, "w", encoding="utf-8") as f:
        for u in sorted(ok_urls):
            f.write(u + "\n")
    manifest = {
        "source": source,
        "candidates_tried": len(uniq),
        "valid_count": len(ok_urls),
        "reasons": reasons,
    }
    with open(probe_output + ".probe_manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    logger.info("Probe wrote %s valid URLs -> %s", len(ok_urls), probe_output)


def property_folder_id(netloc: str, rp_property_id: str) -> str:
    host = netloc.split(":")[0].lower().replace("www.", "")
    safe = re.sub(r"[^a-z0-9]+", "-", f"{host}-{rp_property_id}").strip("-")
    return safe or f"rp-{rp_property_id}"


def extract_rp_property_id(html: str) -> str | None:
    m = re.search(r"var\s+propertyid\s*=\s*(\d+)\s*;", html, re.I)
    if m:
        return m.group(1)
    m = re.search(r"propertyid\s*=\s*(\d+)", html, re.I)
    return m.group(1) if m else None


def _class_has(fragment: str):
    def _check(c):
        if not c:
            return False
        if isinstance(c, str):
            return fragment in c.split()
        return fragment in c

    return _check


def extract_floorplan_post_keys(soup: BeautifulSoup) -> list[str]:
    inner = soup.find(id="innerformdiv")
    if not inner:
        return []
    keys: list[str] = []
    for inp in inner.find_all("input", type="checkbox"):
        cid = (inp.get("id") or inp.get("value") or "").strip()
        if cid and cid not in keys:
            keys.append(cid)
    return keys


def build_floorplan_post_body(keys: list[str]) -> list[tuple[str, str]]:
    """Repeat `floorPlans` with bed-bucket values (digits), per SecureCafe form."""
    out: list[tuple[str, str]] = []
    for k in keys:
        m = re.match(r"^(\d+)Bed$", k, re.I)
        if m:
            out.append(("floorPlans", m.group(1)))
            continue
        if k.isdigit():
            out.append(("floorPlans", k))
    if out:
        return out
    return [("floorPlans", str(i)) for i in range(4)]


def extract_property_name(soup: BeautifulSoup) -> str | None:
    title = soup.find("title")
    if title:
        t = title.get_text(strip=True)
        if t:
            return t.split("|")[0].strip()
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        c = meta["content"].strip()
        if c:
            m = re.match(r"^(.+?),\s*([A-Za-z\s]+),\s*([A-Z]{2})\b", c)
            if m:
                return m.group(1).strip()
            return c[:120]
    return None


def split_us_address_line(line: str) -> tuple[str | None, str | None, str | None, str | None]:
    """SecureCafe uses two spaces between street line and 'City ST ZIP'."""
    line = line.strip()
    if not line:
        return None, None, None, None
    line = re.sub(r"\s{2,}", "\x1f", line)
    line = re.sub(r"\s+", " ", line)
    m = re.search(r"\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)\s*$", line)
    if not m:
        return None, None, None, None
    state, zipc = m.group(1), m.group(2)
    before = line[: m.start()].strip()
    if "\x1f" in before:
        street, city = before.split("\x1f", 1)
        return street.strip(), city.strip(), state, zipc
    parts = before.split()
    if len(parts) >= 2 and parts[-2].lower() in {
        "san",
        "los",
        "new",
        "el",
        "santa",
        "fort",
        "west",
        "east",
        "north",
        "south",
        "lake",
    }:
        return " ".join(parts[:-2]).strip() or None, " ".join(parts[-2:]), state, zipc
    if len(parts) >= 2:
        return " ".join(parts[:-1]).strip() or None, parts[-1], state, zipc
    return before or None, None, state, zipc


def geocode_query_from_floorplans_soup(soup: BeautifulSoup) -> str | None:
    """Prefer 'City, ST' / 'Name, City, ST' in meta description over full marketing copy."""
    meta = soup.find("meta", attrs={"name": "description"})
    if not meta or not meta.get("content"):
        return None
    c = meta["content"].strip()
    m = re.search(
        r"at\s+([^,]+),\s*([A-Za-z][A-Za-z\s]+),\s*([A-Z]{2})\b",
        c,
        re.I,
    )
    if m:
        return f"{m.group(2).strip()}, {m.group(3)}"
    m2 = re.search(r"([A-Za-z][A-Za-z\s]+),\s*([A-Z]{2})\b(?:\s|[!.]|$)", c)
    if m2:
        return f"{m2.group(1).strip()}, {m2.group(2)}"
    return c[:200]


def geocode_nominatim(query: str, direct_session: requests.Session | None = None) -> tuple[float | None, float | None]:
    sess = direct_session or requests.Session()
    params = {"q": query, "format": "json", "limit": "1"}
    try:
        r = sess.get(
            "https://nominatim.openstreetmap.org/search",
            params=params,
            headers={"User-Agent": NOMINATIM_UA},
            timeout=25,
        )
        r.raise_for_status()
        data = r.json()
        if not data:
            return None, None
        return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception as e:
        logger.debug("Nominatim failed for %r: %s", query[:80], e)
        return None, None


def _floor_plan_labels_by_table(soup: BeautifulSoup) -> dict:
    """Map id(table) -> label string from nearest preceding 'Floor Plan:' row."""
    labels: dict[int, str] = {}
    for table in soup.find_all("table", class_=_class_has("availableUnits")):
        label = None
        prev = table.find_previous_sibling()
        steps = 0
        while prev is not None and steps < 12:
            text = prev.get_text(" ", strip=True)
            if "Floor Plan:" in text:
                label = text
                break
            prev = prev.find_previous_sibling()
            steps += 1
        labels[id(table)] = label or ""
    return labels


def parse_available_units_html(
    html: str,
    *,
    rp_property_id: str,
    property_name: str,
    floorplans_url: str,
    property_lat: float | None,
    property_lon: float | None,
    scraped_ts: str,
    community_amenities: list[str] | None = None,
    apartment_amenities: list[str] | None = None,
) -> tuple[list[dict], list[dict]]:
    soup = BeautifulSoup(html, "html.parser")
    labels_by_table = _floor_plan_labels_by_table(soup)
    rows_out: list[dict] = []
    photos: list[dict] = []
    comm_j = json.dumps(community_amenities) if community_amenities is not None else json.dumps([])
    apt_j = json.dumps(apartment_amenities) if apartment_amenities is not None else json.dumps([])

    for table in soup.find_all("table", class_=_class_has("availableUnits")):
        fp_label = labels_by_table.get(id(table), "")
        for tr in table.find_all("tr", class_=_class_has("AvailUnitRow")):
            th = tr.find("th")
            if not th:
                continue
            unit_numeric = (th.get("id") or "").strip()
            if not unit_numeric:
                continue
            addr_div = th.find(class_="unit-address")
            raw_addr = addr_div.get_text(" ", strip=True) if addr_div else ""
            street, city, state, zipcode = split_us_address_line(raw_addr)
            display_bits = th.get_text(" ", strip=True)
            unit_display = ""
            if "#" in display_bits:
                unit_display = display_bits.split("#", 1)[1].split()[0] if "#" in display_bits else ""

            rent_td = tr.find("td", attrs={"data-label": "Rent"})
            rent_text = rent_td.get_text(strip=True) if rent_td else ""
            rent_min = None
            rent_max = None
            rm = re.search(r"\$?\s*([\d,]+)", rent_text)
            if rm:
                rent_min = float(rm.group(1).replace(",", ""))
                rent_max = rent_min

            lat, lon = property_lat, property_lon
            listing_id = f"realpage_{rp_property_id}_{unit_numeric}"

            rows_out.append(
                {
                    "listing_id": listing_id,
                    "property_id": str(rp_property_id),
                    "alternate_property_id": unit_display or None,
                    "property_name": property_name,
                    "address": street,
                    "city": city,
                    "state": state,
                    "zipcode": zipcode,
                    "latitude": lat,
                    "longitude": lon,
                    "floor_plan": fp_label[:500] if fp_label else None,
                    "unit_name": unit_display or None,
                    "unit_id": unit_numeric,
                    "beds": None,
                    "baths": None,
                    "sqft": None,
                    "rent_price": rent_min,
                    "rent_max": rent_max,
                    "deposit": None,
                    "availability_status": "available" if rent_min else "unavailable",
                    "available_at": None,
                    "lease_url": None,
                    "lease_term": None,
                    "listing_url": floorplans_url,
                    "email": None,
                    "phone": None,
                    "description": None,
                    "images": json.dumps([]),
                    "website": urlparse(floorplans_url).netloc,
                    "company": COMPANY,
                    "building_type": "apartment",
                    "building_subtype": None,
                    "floor_number": None,
                    "community_amenities": comm_j,
                    "apartment_amenities": apt_j,
                    "fees": json.dumps([]),
                    "year_built": None,
                    "total_units": None,
                    "stories": None,
                    "scraped_timestamp": scraped_ts,
                }
            )
    return rows_out, photos


def save_raw_gz(env: str, folder_id: str, scraped_at: str, name: str, text: str):
    if env == "local":
        return  # Local mode skips raw cache (parquet + DB are sufficient).
    path = (
        f"env={env}/source=realpage/stage=raw/entity=property/"
        f"property_id={folder_id}/scraped_at={scraped_at}/{name}.gz"
    )
    client = _gcs_client()
    blob = client.bucket(GCS_BUCKET).blob(path)
    blob.upload_from_string(gzip.compress(text.encode("utf-8")), content_type="application/gzip")


def save_raw_json_gz(env: str, folder_id: str, scraped_at: str, data: dict):
    if env == "local":
        return
    path = (
        f"env={env}/source=realpage/stage=raw/entity=property/"
        f"property_id={folder_id}/scraped_at={scraped_at}/meta.json.gz"
    )
    raw = json.dumps(data).encode("utf-8")
    client = _gcs_client()
    client.bucket(GCS_BUCKET).blob(path).upload_from_string(
        gzip.compress(raw), content_type="application/gzip"
    )


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
    null_cols = ["listing_id", "property_id", "property_name", "city", "state", "zipcode", "rent_price", "latitude", "longitude"]
    null_rates = {
        c: round(float(df[c].isna().mean()) * 100.0, 2) if c in df.columns else None
        for c in null_cols
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


def scrape_securecafe_floorplans(
    floorplans_url: str,
    env: str,
    scraped_at: str,
    *,
    geocode: bool,
) -> tuple[list[dict], list[dict], str]:
    session = get_session(env)
    r = session.get(floorplans_url, timeout=40)
    r.raise_for_status()
    floor_html = r.text
    soup = BeautifulSoup(floor_html, "html.parser")
    parsed = urlparse(floorplans_url)
    rp_id = extract_rp_property_id(floor_html)
    if not rp_id:
        raise ValueError(f"No property id in floorplans page: {floorplans_url}")
    folder_id = property_folder_id(parsed.netloc, rp_id)
    keys = extract_floorplan_post_keys(soup)
    if not keys:
        logger.warning("No innerformdiv checkboxes; using floorPlans 0-3 for %s", floorplans_url)
    post_body = build_floorplan_post_body(keys)

    base = f"{parsed.scheme}://{parsed.netloc}"
    post_url = f"{base}/onlineleasing/rcLoadContent.ashx?contentclass=availableunits&t={time.time()}"
    r2 = session.post(
        post_url,
        data=post_body,
        timeout=60,
        headers={
            "Referer": floorplans_url,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    r2.raise_for_status()
    units_html = r2.text

    comm_list: list[str] | None = None
    apt_list: list[str] | None = None
    try:
        am_url = _amenities.securecafe_amenities_url(floorplans_url)
        ra = session.get(
            am_url,
            timeout=45,
            headers={
                "Referer": floorplans_url,
                "Accept": "text/html,application/xhtml+xml",
            },
        )
        if ra.status_code == 200:
            save_raw_gz(env, folder_id, scraped_at, "amenities.html", ra.text)
            parsed_am = _amenities.parse_securecafe_amenities_html(ra.text)
            if parsed_am is not None:
                comm_list, apt_list = parsed_am
    except Exception as e:
        logger.debug("SecureCafe amenities fetch/parse skipped for %s: %s", floorplans_url, e)

    save_raw_gz(env, folder_id, scraped_at, "floorplans.html", floor_html)
    save_raw_gz(env, folder_id, scraped_at, "availableunits.html", units_html)

    prop_name = extract_property_name(soup) or f"Property {rp_id}"
    scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    q: str | None = None
    plat, plon = None, None
    if geocode:
        time.sleep(1.1)
        q = geocode_query_from_floorplans_soup(soup) or prop_name
        plat, plon = geocode_nominatim(q)

    save_raw_json_gz(
        env,
        folder_id,
        scraped_at,
        {
            "floorplans_url": floorplans_url,
            "post_url": post_url,
            "rp_property_id": rp_id,
            "floorplan_keys": keys,
            "property_name": prop_name,
            "geocode_query": q,
            "latitude": plat,
            "longitude": plon,
        },
    )

    rows, photos = parse_available_units_html(
        units_html,
        rp_property_id=rp_id,
        property_name=prop_name,
        floorplans_url=floorplans_url,
        property_lat=plat,
        property_lon=plon,
        scraped_ts=scraped_ts,
        community_amenities=comm_list,
        apartment_amenities=apt_list,
    )
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
    total_seeds_file = len(seeds)
    if max_properties is not None:
        seeds = seeds[:max_properties]
    logger.info(
        "Discovery v1: merged_seeds=%s after_cap=%s max_properties=%s",
        total_seeds_file,
        len(seeds),
        max_properties,
    )
    output_dir = f"env={env}/source=realpage/stage=processed/entity=property/load_date={scraped_at}"
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    all_rows: list[dict] = []
    all_photos: list[dict] = []
    ok_seeds = 0
    fail_seeds = 0

    def _one(url: str):
        return scrape_securecafe_floorplans(url, env, scraped_at, geocode=geocode)

    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        fut_map = {ex.submit(_one, u): u for u in seeds}
        for fut in as_completed(fut_map):
            u = fut_map[fut]
            try:
                rows, photos, _fid = fut.result()
                all_rows.extend(rows)
                all_photos.extend(photos)
                ok_seeds += 1
                logger.info("Parsed %s unit rows from %s", len(rows), u)
            except Exception as e:
                fail_seeds += 1
                logger.error("Failed seed %s: %s", u, e)
    logger.info(
        "Run metrics: seeds_ok=%s seeds_failed=%s unit_rows=%s",
        ok_seeds,
        fail_seeds,
        len(all_rows),
    )

    df = pd.DataFrame(all_rows)
    if not df.empty:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    pdf = pd.DataFrame(all_photos)
    if not pdf.empty and "property_id" in pdf.columns and "image_url" in pdf.columns:
        pdf = pdf.drop_duplicates(subset=["property_id", "image_url"], keep="first")

    units_file = os.path.join(output_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(output_dir, "images." + ("csv" if output_format == "csv" else "parquet"))
    if output_format == "csv":
        df.to_csv(units_file, index=False)
        pdf.to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        pdf.to_parquet(photos_file, index=False)

    summary = quality_summary(df)
    logger.info("Quality summary: %s", json.dumps(summary))
    summary_path = os.path.join(output_dir, "quality_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    if env != "local":
        try:
            upload_to_gcs(log_filename, f"env={env}/source=realpage/logs/scraped_at={scraped_at}")
        except Exception as e:
            logger.warning("Log upload failed: %s", e)
        upload_to_gcs(
            units_file,
            f"env={env}/source=realpage/stage=processed/entity=property/property_id=realpage/load_date={scraped_at}",
        )
        upload_to_gcs(
            photos_file,
            f"env={env}/source=realpage/stage=processed/entity=photo/property_id=realpage/load_date={scraped_at}",
        )
        upload_to_gcs(
            summary_path,
            f"env={env}/source=realpage/stage=processed/entity=property/property_id=realpage/load_date={scraped_at}",
        )


def process_local(env: str, output_format: str = "parquet", scraped_at: str | None = None):
    if not scraped_at:
        dirs = glob(f"env={env}/source=realpage/stage/raw/entity=property/property_id=*/scraped_at=*")
        dates = sorted({Path(p).parts[-1].split("=")[-1] for p in dirs})
        if not dates:
            raise ValueError("No realpage raw scraped_at folders found")
        scraped_at = dates[-1]

    scraped_dirs = sorted(
        glob(
            f"env={env}/source=realpage/stage/raw/entity=property/property_id=*/scraped_at={scraped_at}"
        )
    )
    if not scraped_dirs:
        logger.warning("process_local: no raw folders for scraped_at=%s", scraped_at)
    rows: list[dict] = []
    photos: list[dict] = []
    for base in scraped_dirs:
        folder_part = Path(base).parent.name
        folder_id = folder_part.split("=", 1)[-1]
        fp_path = os.path.join(base, "floorplans.html.gz")
        au_path = os.path.join(base, "availableunits.html.gz")
        am_path = os.path.join(base, "amenities.html.gz")
        meta_path = os.path.join(base, "meta.json.gz")
        if not os.path.isfile(fp_path) or not os.path.isfile(au_path):
            continue
        with gzip.open(fp_path, "rt", encoding="utf-8") as f:
            floor_html = f.read()
        with gzip.open(au_path, "rt", encoding="utf-8") as f:
            units_html = f.read()
        comm_list = apt_list = None
        if os.path.isfile(am_path):
            with gzip.open(am_path, "rt", encoding="utf-8") as f:
                am_html = f.read()
            parsed_am = _amenities.parse_securecafe_amenities_html(am_html)
            if parsed_am is not None:
                comm_list, apt_list = parsed_am
        meta = {}
        if os.path.isfile(meta_path):
            with gzip.open(meta_path, "rt", encoding="utf-8") as f:
                meta = json.load(f)
        soup = BeautifulSoup(floor_html, "html.parser")
        rp_id = meta.get("rp_property_id") or extract_rp_property_id(floor_html)
        if not rp_id:
            continue
        prop_name = meta.get("property_name") or extract_property_name(soup) or f"Property {rp_id}"
        floorplans_url = meta.get("floorplans_url") or ""
        plat = meta.get("latitude")
        plon = meta.get("longitude")
        if plat is not None:
            plat = float(plat)
        if plon is not None:
            plon = float(plon)
        scraped_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        r, p = parse_available_units_html(
            units_html,
            rp_property_id=str(rp_id),
            property_name=prop_name,
            floorplans_url=floorplans_url or f"https://local.reprocess/{folder_id}",
            property_lat=plat,
            property_lon=plon,
            scraped_ts=scraped_ts,
            community_amenities=comm_list,
            apartment_amenities=apt_list,
        )
        rows.extend(r)
        photos.extend(p)

    out_dir = f"env={env}/source=realpage/stage=processed/entity=property/load_date={scraped_at}"
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(rows)
    if not df.empty:
        df = enforce_unit_types(df).drop_duplicates(subset=["listing_id"], keep="last")
    pdf = pd.DataFrame(photos)
    if not pdf.empty and "property_id" in pdf.columns and "image_url" in pdf.columns:
        pdf = pdf.drop_duplicates(subset=["property_id", "image_url"], keep="first")

    units_file = os.path.join(out_dir, "units." + ("csv" if output_format == "csv" else "parquet"))
    photos_file = os.path.join(out_dir, "images." + ("csv" if output_format == "csv" else "parquet"))
    if output_format == "csv":
        df.to_csv(units_file, index=False)
        pdf.to_csv(photos_file, index=False)
    else:
        df.to_parquet(units_file, index=False)
        pdf.to_parquet(photos_file, index=False)

    summary = quality_summary(df)
    summary_path = os.path.join(out_dir, "quality_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    logger.info("process_local complete rows=%s photos=%s", len(df), len(pdf))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RealPage OneSite / SecureCafe floorplans scraper")
    parser.add_argument("--env", choices=["local", "dev", "test", "prod"], default=None)
    parser.add_argument(
        "--mode",
        default="scrape",
        choices=["scrape", "process_local", "probe_seeds"],
    )
    parser.add_argument("--format", default="parquet", choices=["parquet", "csv"])
    parser.add_argument(
        "--seeds",
        nargs="+",
        default=["seeds.txt"],
        help="One or more seed files (merged, deduped) for scrape mode",
    )
    parser.add_argument("--max_workers", type=int, default=4)
    parser.add_argument("--max_properties", type=int, default=None, help="Cap number of seed URLs processed")
    parser.add_argument("--geocode", action="store_true", help="Nominatim geocode per property (1.1s delay)")
    parser.add_argument("--scrape_date", default=None, help="process_local: scraped_at partition YYYY-MM-DD")
    parser.add_argument("--probe-source", choices=["crt", "file"], default="file")
    parser.add_argument("--probe-input", default=None, help="Hostnames or floorplans URLs, one per line (file mode)")
    parser.add_argument("--probe-output", default="seeds_validated.txt", help="Validated floorplans URLs output")
    parser.add_argument("--crt-max-hosts", type=int, default=600, help="Max unique hosts from CRT to expand")
    parser.add_argument("--max-probe", type=int, default=2500, help="Max candidate URLs to HTTP-probe")
    args = parser.parse_args()

    if args.mode == "probe_seeds":
        run_probe_seeds(
            source=args.probe_source,
            probe_input=args.probe_input,
            probe_output=args.probe_output,
            crt_max_hosts=args.crt_max_hosts,
            max_probe=args.max_probe,
            max_workers=args.max_workers,
        )
    elif args.env is None:
        parser.error("--env is required for scrape and process_local modes")
    elif args.mode == "scrape":
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
