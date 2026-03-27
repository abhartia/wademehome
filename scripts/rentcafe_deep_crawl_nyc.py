#!/usr/bin/env python3
"""Deep-crawl RentCafe sub-area pages for NYC metro to find all property URLs."""
import sys
import time

import cloudscraper
from bs4 import BeautifulSoup

sys.stdout.reconfigure(line_buffering=True)


def extract_links(html: str):
    soup = BeautifulSoup(html, "lxml")
    props: set[str] = set()
    subs: set[str] = set()
    for a in soup.find_all("a", href=True):
        href = a["href"].split("?")[0]
        if "/apartments/" in href and "/default.aspx" in href:
            props.add(href)
        elif "/apartments-for-rent/" in href and href.startswith("https://www.rentcafe.com"):
            subs.add(href)
    return props, subs


SEED_CITIES = [
    "https://www.rentcafe.com/apartments-for-rent/manhattan-ny/",
    "https://www.rentcafe.com/apartments-for-rent/brooklyn-ny/",
    "https://www.rentcafe.com/apartments-for-rent/jersey-city-nj/",
    "https://www.rentcafe.com/apartments-for-rent/hoboken-nj/",
    "https://www.rentcafe.com/apartments-for-rent/new-york-city-ny/",
    "https://www.rentcafe.com/apartments-for-rent/queens-ny/",
    "https://www.rentcafe.com/apartments-for-rent/bronx-ny/",
    "https://www.rentcafe.com/apartments-for-rent/newark-nj/",
    "https://www.rentcafe.com/apartments-for-rent/bayonne-nj/",
    "https://www.rentcafe.com/apartments-for-rent/weehawken-nj/",
    "https://www.rentcafe.com/apartments-for-rent/north-bergen-nj/",
    "https://www.rentcafe.com/apartments-for-rent/west-new-york-nj/",
    "https://www.rentcafe.com/apartments-for-rent/union-city-nj/",
    "https://www.rentcafe.com/apartments-for-rent/fort-lee-nj/",
    "https://www.rentcafe.com/apartments-for-rent/edgewater-nj/",
    "https://www.rentcafe.com/apartments-for-rent/hackensack-nj/",
    "https://www.rentcafe.com/apartments-for-rent/east-rutherford-nj/",
    "https://www.rentcafe.com/apartments-for-rent/harrison-nj/",
    "https://www.rentcafe.com/apartments-for-rent/kearny-nj/",
    "https://www.rentcafe.com/apartments-for-rent/elizabeth-nj/",
    "https://www.rentcafe.com/apartments-for-rent/new-brunswick-nj/",
    "https://www.rentcafe.com/apartments-for-rent/yonkers-ny/",
    "https://www.rentcafe.com/apartments-for-rent/white-plains-ny/",
    "https://www.rentcafe.com/apartments-for-rent/stamford-ct/",
    "https://www.rentcafe.com/apartments-for-rent/long-island-city-ny/",
    "https://www.rentcafe.com/apartments-for-rent/astoria-ny/",
    "https://www.rentcafe.com/apartments-for-rent/flushing-ny/",
    "https://www.rentcafe.com/apartments-for-rent/woodside-ny/",
    "https://www.rentcafe.com/apartments-for-rent/east-orange-nj/",
    "https://www.rentcafe.com/apartments-for-rent/clifton-nj/",
    "https://www.rentcafe.com/apartments-for-rent/passaic-nj/",
    "https://www.rentcafe.com/apartments-for-rent/paterson-nj/",
    "https://www.rentcafe.com/apartments-for-rent/staten-island-ny/",
    "https://www.rentcafe.com/apartments-for-rent/plainfield-nj/",
    "https://www.rentcafe.com/apartments-for-rent/perth-amboy-nj/",
    "https://www.rentcafe.com/apartments-for-rent/linden-nj/",
    "https://www.rentcafe.com/apartments-for-rent/rahway-nj/",
    "https://www.rentcafe.com/apartments-for-rent/orange-nj/",
    "https://www.rentcafe.com/apartments-for-rent/irvington-nj/",
    "https://www.rentcafe.com/apartments-for-rent/woodbridge-nj/",
    "https://www.rentcafe.com/apartments-for-rent/piscataway-nj/",
    "https://www.rentcafe.com/apartments-for-rent/somerville-nj/",
]

session = cloudscraper.create_scraper(
    browser={"browser": "chrome", "platform": "darwin", "mobile": False}
)
session.headers.update({"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})

all_sub_links: set[str] = set()
all_property_links: set[str] = set()
visited: set[str] = set()

print("Pass 1: Crawling city pages...")
for url in SEED_CITIES:
    try:
        resp = session.get(url, timeout=30, allow_redirects=True)
        visited.add(url)
        visited.add(resp.url)
        if resp.status_code == 200:
            props, subs = extract_links(resp.text)
            all_property_links.update(props)
            all_sub_links.update(subs)
            print(f"  {url.split('/')[-2]}: {len(props)} props, {len(subs)} sub-links")
        time.sleep(0.5)
    except Exception as e:
        print(f"  FAIL {url}: {e}")

all_sub_links -= visited
print(f"\nPass 1: {len(all_property_links)} properties, {len(all_sub_links)} sub-area links to explore")

print(f"\nPass 2: Crawling {len(all_sub_links)} sub-area links...")
for i, url in enumerate(sorted(all_sub_links)):
    if url in visited:
        continue
    try:
        resp = session.get(url, timeout=30, allow_redirects=True)
        visited.add(url)
        if resp.status_code == 200:
            props, new_subs = extract_links(resp.text)
            before = len(all_property_links)
            all_property_links.update(props)
            added = len(all_property_links) - before
            if added > 0:
                print(f"  +{added} from {url.split('/')[-2]} (total: {len(all_property_links)})")
        time.sleep(0.3)
    except Exception:
        pass
    if (i + 1) % 20 == 0:
        print(f"  ...crawled {i+1}/{len(all_sub_links)}, total props: {len(all_property_links)}")

print(f"\nFINAL: {len(all_property_links)} unique property URLs")

out = "rentcafe_scraper/nyc_metro_property_urls.txt"
with open(out, "w", encoding="utf-8") as f:
    for u in sorted(all_property_links):
        f.write(u + "\n")
print(f"Saved to {out}")
