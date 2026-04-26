"""
Discover Entrata-powered property sites in the NYC metro area.

Strategy: Check a curated list of known large NYC apartment building websites
for Entrata tech stack markers (__NEXT_DATA__ with inventory, Jonah Digital,
entrata references). Also uses Bing search as a fallback (less aggressive
bot detection than Google).

Usage:
  python discover_entrata_nyc.py --output seeds_nyc.txt
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote_plus, urlparse

import cloudscraper
import requests
from bs4 import BeautifulSoup

Path("logs").mkdir(exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger("entrata_discovery")

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

ENTRATA_MARKERS = [
    "entrata.com",
    "entrata_platform",
    "jonahdigital",
    "listing-chunks",
    "entrata-chat",
    "entrata_website",
    "data-entrata",
]

# Known large NYC apartment building marketing sites to test.
# Many luxury / large buildings use Entrata, Yardi, or RealPage for leasing.
# We test each for Entrata markers.
CANDIDATE_SITES = [
    # Manhattan
    "https://www.gothamwest.com/floorplans/",
    "https://www.theeugene.com/floorplans/",
    "https://www.sky-nyc.com/floorplans/",
    "https://www.525w52nd.com/floorplans/",
    "https://www.themax.nyc/floorplans/",
    "https://www.elliot-chelsea.com/floorplans/",
    "https://www.viaapartments.com/floorplans/",
    "https://www.thecole.com/floorplans/",
    "https://www.instrata.com/floorplans/",
    "https://www.thelandmark.com/floorplans/",
    "https://www.535west43rd.com/floorplans/",
    "https://www.thealdynnyc.com/floorplans/",
    "https://www.theashlandnyc.com/floorplans/",
    "https://www.theashland.com/floorplans/",
    "https://www.brooklynapartments.com/floorplans/",
    "https://www.ciprianiliving.com/floorplans/",
    "https://www.thegalleriapts.com/floorplans/",
    "https://www.viajerseycity.com/floorplans/",
    # Brooklyn
    "https://www.66rockwell.com/floorplans/",
    "https://www.thedenizen.com/floorplans/",
    "https://www.thecloverjc.com/floorplans/",
    "https://www.journalsquared.com/floor-plans/",
    "https://www.thearthousejc.com/floorplans/",
    # Jersey City / Hoboken
    "https://www.225grandstreet.com/floorplans/",
    "https://www.theoverjc.com/floorplans/",
    "https://www.1shortstreet.com/floorplans/",
    "https://www.pierhoboken.com/floorplans/",
    "https://www.maxwellplace.com/floorplans/",
    "https://www.1000maxwell.com/floorplans/",
    "https://www.1400hudson.com/floorplans/",
    # General patterns to try
    "https://www.entrawestend.com/floorplans/",
    "https://www.elanredmond.com/interactivepropertymap",
]


def bing_search_urls(query: str, count: int = 30) -> list[str]:
    """Search Bing for property sites (less aggressive anti-bot than Google)."""
    session = cloudscraper.create_scraper(
        browser={"browser": "chrome", "platform": "darwin", "mobile": False}
    )
    session.headers.update({"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    urls: list[str] = []
    try:
        resp = session.get(
            f"https://www.bing.com/search?q={quote_plus(query)}&count={count}",
            timeout=30,
        )
        if resp.status_code != 200:
            logger.warning("Bing returned %d for query: %s", resp.status_code, query)
            return urls
        soup = BeautifulSoup(resp.text, "lxml")
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if href.startswith("http") and not any(
                skip in href for skip in ["bing.com", "microsoft.com", "msn.com", "live.com"]
            ):
                parsed = urlparse(href)
                if parsed.scheme in ("http", "https") and parsed.hostname:
                    urls.append(href)
    except Exception as e:
        logger.warning("Bing search failed for '%s': %s", query, e)
    return urls


BING_QUERIES = [
    '"entrata" apartments floor plans New York',
    '"entrata" apartments floor plans Jersey City',
    '"entrata" apartments floor plans Brooklyn',
    '"entrata" apartments floor plans Hoboken NJ',
    '"jonahdigital" apartments NYC',
    '"listing-chunks" apartments New York',
    'apartments "powered by entrata" NYC',
    'apartments "entrata_platform" New York NJ',
    '"entrata" apartments floor plans Queens',
    '"entrata" apartments floor plans Long Island City',
    '"entrata" apartments floor plans Bronx',
    '"entrata" apartments Westchester NY',
    '"entrata" apartments Yonkers NY',
    '"entrata" apartments Newark NJ',
    'site:entrata.com new york',
    '"data-entrata" apartments NYC',
]


def check_entrata_markers(url: str) -> tuple[bool, str]:
    """Fetch a URL and check for Entrata tech stack markers."""
    try:
        session = cloudscraper.create_scraper(
            browser={"browser": "chrome", "platform": "darwin", "mobile": False}
        )
        session.headers.update({"User-Agent": UA})
        resp = session.get(url, timeout=30, allow_redirects=True)
        if resp.status_code != 200:
            return False, f"http_{resp.status_code}"
        html = resp.text.lower()
        for marker in ENTRATA_MARKERS:
            if marker in html:
                return True, f"marker:{marker}"
        if "__next_data__" in html:
            try:
                soup = BeautifulSoup(resp.text, "lxml")
                nd = soup.select_one("script#__NEXT_DATA__")
                if nd:
                    data = json.loads(nd.string or "{}")
                    text = json.dumps(data)
                    if any(k in text.lower() for k in ["floorplan", "availableunit", "unittype", "bedrooms"]):
                        return True, "next_data_inventory"
            except Exception:
                pass
        return False, "no_markers"
    except Exception as e:
        return False, str(e)[:60]


def normalize_to_floorplan_url(url: str) -> str:
    """If URL isn't already a floorplans page, try common paths."""
    parsed = urlparse(url)
    path = parsed.path.rstrip("/").lower()
    if "/floorplans" in path or "/floor-plans" in path or "/interactiveproperty" in path:
        return url
    base = f"{parsed.scheme}://{parsed.netloc}"
    return f"{base}/floorplans/"


def run_discovery(
    max_verify_workers: int = 6,
    output: str = "seeds_nyc.txt",
) -> list[str]:
    """Run Entrata NYC discovery: curated sites + Bing search."""
    all_candidates: set[str] = set()

    for url in CANDIDATE_SITES:
        all_candidates.add(url)

    logger.info("Phase 1: Bing search for Entrata sites (%d queries)...", len(BING_QUERIES))
    for query in BING_QUERIES:
        urls = bing_search_urls(query)
        for u in urls:
            parsed = urlparse(u)
            if parsed.hostname and not any(
                skip in parsed.hostname
                for skip in ["google.", "youtube.", "facebook.", "yelp.", "zillow.", "streeteasy.",
                             "apartments.com", "reddit.", "wikipedia.", "craigslist.", "bing.", "microsoft."]
            ):
                all_candidates.add(u)
        time.sleep(3)
    logger.info("Total candidates after search: %d", len(all_candidates))

    logger.info("Phase 2: Verify %d candidates for Entrata markers...", len(all_candidates))
    verified: list[str] = []
    reasons: dict[str, int] = {}

    with ThreadPoolExecutor(max_workers=max_verify_workers) as ex:
        fut_map = {ex.submit(check_entrata_markers, u): u for u in all_candidates}
        for fut in as_completed(fut_map):
            u = fut_map[fut]
            ok, reason = fut.result()
            reasons[reason] = reasons.get(reason, 0) + 1
            if ok:
                fp_url = normalize_to_floorplan_url(u)
                verified.append(fp_url)
                logger.info("VERIFIED: %s (%s)", fp_url, reason)

    unique_verified = sorted(set(verified))
    logger.info("Verified %d Entrata sites from %d candidates", len(unique_verified), len(all_candidates))

    with open(output, "w", encoding="utf-8") as f:
        f.write("# Auto-discovered Entrata sites in NYC metro\n")
        for u in unique_verified:
            f.write(u + "\n")

    manifest = {
        "candidates_searched": len(all_candidates),
        "verified": len(unique_verified),
        "reasons": reasons,
    }
    with open(output + ".manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    logger.info("Wrote %d seeds to %s", len(unique_verified), output)
    return unique_verified


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Discover Entrata-powered sites in NYC metro")
    parser.add_argument("--output", default="seeds_nyc.txt")
    parser.add_argument("--max-workers", type=int, default=6)
    args = parser.parse_args()

    run_discovery(max_verify_workers=args.max_workers, output=args.output)
