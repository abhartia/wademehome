#!/usr/bin/env python3
"""Mass-probe AppFolio subdomains to find property management listing pages."""
import sys
import time

import cloudscraper
from bs4 import BeautifulSoup

sys.stdout.reconfigure(line_buffering=True)

session = cloudscraper.create_scraper(
    browser={"browser": "chrome", "platform": "darwin", "mobile": False}
)
session.headers.update({"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"})

prefixes = [
    "abc", "ace", "acme", "advance", "allied", "alpha", "american", "anchor",
    "apex", "ariel", "atlas", "avenue", "bay", "beacon", "bell", "best",
    "blue", "boulder", "bridge", "bright", "broad", "broadway", "brown",
    "capitol", "castle", "cedar", "center", "central", "century", "chelsea",
    "city", "civic", "classic", "cliff", "coastal", "columbia", "comfort",
    "compass", "continental", "corner", "crest", "cross", "crown", "crystal",
    "delta", "diamond", "eagle", "east", "eastern", "edge", "elite", "elm",
    "emerald", "empire", "equinox", "equity", "essex", "excel", "express",
    "fairfield", "falcon", "first", "five", "flagship", "flat", "fox",
    "freedom", "fresh", "frontier", "garden", "gate", "gateway", "genesis",
    "global", "gold", "golden", "grand", "granite", "green", "grove",
    "guardian", "gulf", "hamilton", "harbor", "haven", "hawk", "heritage",
    "highland", "hill", "home", "horizon", "hudson", "ideal", "infinity",
    "integrity", "ivy", "jade", "key", "keystone", "king", "lake",
    "landmark", "latitude", "legacy", "liberty", "life", "light", "lion",
    "living", "luxe", "luxury", "madison", "magna", "manhattan", "maple",
    "market", "maxim", "merit", "metro", "midtown", "millennium", "modern",
    "monarch", "national", "nest", "new", "noble", "north", "oak",
    "ocean", "olympus", "omega", "one", "optimal", "orion", "pacific",
    "palace", "palm", "paramount", "park", "parkside", "patriot", "peak",
    "pearl", "phoenix", "pier", "pine", "pinnacle", "platinum", "plaza",
    "point", "premier", "prestige", "pride", "prime", "prospect", "pure",
    "quad", "quality", "quest", "rainbow", "raven", "real", "realty",
    "red", "regal", "regent", "reliable", "renew", "republic", "ridge",
    "river", "riverside", "rock", "rose", "royal", "ruby", "safe",
    "sage", "sapphire", "select", "shelter", "shore", "signature", "silk",
    "silver", "skyline", "smart", "solid", "south", "spark", "spring",
    "square", "star", "stellar", "sterling", "stone", "summit", "sun",
    "sunrise", "sunset", "superior", "sure", "swift", "terra", "titan",
    "tower", "town", "tri", "triangle", "trinity", "triumph", "trust",
    "ultra", "union", "united", "unity", "universal", "urban", "vale",
    "valley", "valor", "van", "vanguard", "venture", "verde", "vertex",
    "victory", "village", "vine", "vision", "vista", "vivid", "west",
    "western", "white", "windsor", "wise", "york", "zen", "zenith",
]
suffixes = ["pm", "mgmt", "mgt", "realty", "properties", "property", "rentals", "living", "homes", "apts", "residential"]

candidates: set[str] = set()
for p in prefixes:
    candidates.add(p)
    for s in suffixes:
        candidates.add(f"{p}{s}")

specific = [
    "tulirealty", "downtown", "remresidential", "citywidepm", "oneroofpm",
    "rockrose", "morganpm", "morganproperties", "ctpm",
    "lefrakpm", "lefrak", "glenwood", "brodsky", "durst", "silverstein",
    "extell", "tishman", "gotham", "kaled", "jakobson", "halstead",
    "nycpm", "nycrealty", "nycrentals", "nycproperties", "nyrentals",
    "jerseycitypm", "hobokenpm", "jcrentals", "njrentals", "njpm",
    "brooklynpm", "brooklynrealty", "queenspm", "bronxpm",
    "manhattanpm", "manhattanrealty", "uptownpm", "downtownpm",
    "citadelpm", "baysideproperty", "bedrocknyc", "stuytown",
    "avalonbay", "avalon", "kushner", "roseland", "waterfront", "harborside",
]
candidates.update(specific)

print(f"Testing {len(candidates)} subdomain candidates...")
valid: list[tuple[str, int]] = []
candidate_list = sorted(candidates)

for i, sub in enumerate(candidate_list):
    url = f"https://{sub}.appfolio.com/listings/listings"
    try:
        resp = session.get(url, timeout=8, allow_redirects=True)
        if resp.status_code == 200 and len(resp.text) > 1000:
            soup = BeautifulSoup(resp.text, "lxml")
            cards = soup.select('.listing-item, .js-listing-card, [data-listing-id], a[href*="/listings/detail/"]')
            if cards:
                valid.append((sub, len(cards)))
                print(f"  FOUND: {sub} -> {len(cards)} listings")
    except Exception:
        pass
    if (i + 1) % 100 == 0:
        print(f"  ...tested {i+1}/{len(candidate_list)}, found {len(valid)} so far")

print(f"\nTotal valid AppFolio subdomains: {len(valid)}")
total_listings = sum(c for _, c in valid)
print(f"Total listing cards: {total_listings}")
for sub, count in sorted(valid, key=lambda x: -x[1]):
    print(f"  {sub}: {count}")

out = "appfolio_scraper/seeds_discovered.txt"
with open(out, "w", encoding="utf-8") as f:
    f.write("# AppFolio - discovered via mass subdomain probing\n")
    for sub, _ in sorted(valid, key=lambda x: -x[1]):
        f.write(f"https://{sub}.appfolio.com/listings/listings\n")
print(f"Saved to {out}")
