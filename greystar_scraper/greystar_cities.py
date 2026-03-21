import requests
import pandas as pd
from bs4 import BeautifulSoup
from rapidfuzz import process, fuzz
import logging
import re

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

SITEMAP_URL = "https://www.greystar.com/sitemap.xml"
US_CITIES_CSV = "uscities.csv"

CITY_ALIASES = {
    "hilton head, sc": "hilton head island, sc",
    "west hyattsville, md": "hyattsville, md",
    "lake worth, fl": "lake worth beach, fl",
    "heber city, ut": "heber, ut",
    "nottingham, md": "baltimore, md",  # example fallback
    # Add more here as needed
}

def get_greystar_scrape_cities():
    def load_city_latlons():
        df = pd.read_csv(US_CITIES_CSV)
        df["city_state"] = df["city"].str.lower().str.strip() + ", " + df["state_id"].str.strip()
        df = df.drop_duplicates(subset="city_state")
        return df.set_index("city_state")[["lat", "lng"]].to_dict(orient="index")

    def scrape_greystar_sitemap():
        logger.info("Scraping Greystar sitemap (index page)...")
        response = requests.get(SITEMAP_URL, timeout=20)
        logger.info(f"Sitemap response status: {response.status_code}")
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "xml")
        url_tags = soup.find_all("url")
        logger.info(f"Found {len(url_tags)} <url> entries in sitemap")

        seen = set()
        city_state_pairs = []

        for tag in url_tags:
            loc_tag = tag.find("loc")
            if not loc_tag:
                continue

            url = loc_tag.text.strip()
            match = re.search(r"/properties/([^/]+)/", url)
            if not match:
                continue

            city_state = match.group(1)
            if "-" not in city_state:
                logger.debug(f"Skipping malformed city-state in URL: {url}")
                continue

            *city_parts, state = city_state.split("-")
            city = " ".join(city_parts).title()

            if len(state) != 2 or not state.isalpha():
                logger.debug(f"Skipping non-US or invalid state code: {state} in URL: {url}")
                continue

            key = (city, state.upper())
            if key not in seen:
                seen.add(key)
                city_state_pairs.append({"city": city, "state": state.upper()})
            else:
                logger.debug(f"Duplicate skipped: {key}")

        logger.info(f"Found {len(city_state_pairs)} unique city/state combos")
        return city_state_pairs

    def normalize_city_name(name):
        name = name.lower().strip()
        name = name.replace("ft ", "fort ")
        name = name.replace("st ", "saint ")
        name = name.replace(".", "")  # remove periods
        name = name.replace("-", " ")  # unify hyphens and spaces
        name = re.sub(r"\btownship\b", "", name)
        name = re.sub(r"\bvillage of\b", "", name)
        name = re.sub(r"\s+", " ", name)
        return name.strip()

    def match_and_fill_latlons(locations, city_latlons):
        all_keys = list(city_latlons.keys())
        normalized_keys = {normalize_city_name(k): k for k in all_keys}
        enriched = []

        for loc in locations:
            raw_key = f"{loc['city']}, {loc['state']}"
            norm_key = normalize_city_name(raw_key)
            norm_key = CITY_ALIASES.get(norm_key, norm_key)


            match_norm_key, score, _ = process.extractOne(norm_key, normalized_keys.keys(), scorer=fuzz.token_sort_ratio)
            match_key = normalized_keys[match_norm_key]

            if score >= 80:
                coords = city_latlons[match_key]
                enriched.append({
                    "city": loc["city"],
                    "state": loc["state"],
                    "lat": coords["lat"],
                    "lon": coords["lng"]
                })
            else:
                logger.warning(f"Missing lat/lon for {raw_key} (match: {match_key}, score: {score})")

        logger.info(f"Matched {len(enriched)} of {len(locations)} cities with lat/lon")
        return enriched

    # 👇 CALL the inner functions here
    city_latlons = load_city_latlons()
    locations = scrape_greystar_sitemap()
    return match_and_fill_latlons(locations, city_latlons)


# 👇 Add CLI entry point
if __name__ == "__main__":
    cities = get_greystar_scrape_cities()
    print(f"Loaded {len(cities)} cities")
    for city in cities[:10]:  # show sample
        print(city)