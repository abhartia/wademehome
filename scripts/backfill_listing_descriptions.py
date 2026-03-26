#!/usr/bin/env python3
"""
Backfill overwrite `listings.description` with long-form marketing copy.

Strategy:
- Group by (company, listing_url) since scrapers tend to reuse listing_url for all units of a property.
- Fetch each listing_url page once.
- Extract best-effort "long description" with ordering:
  1) JSON-LD (ApartmentComplex/Residence/etc) "description" / about.description (choose longest candidate)
  2) <meta name="description"> content
  3) Largest text block among common "about/description/overview" containers
- Overwrite `listings.description` for rows matching that (company, listing_url).

Notes:
- This is best-effort. If we can't fetch/extract for a URL, we skip updating that URL
  to avoid blanking existing data.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any
import threading
from urllib.parse import urlparse

import cloudscraper
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import psycopg2


REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"
BASE_RENTCAFE_URL = "https://www.rentcafe.com/"


def normalize_db_url(raw: str) -> str:
    # DATABASE_URL sometimes uses postgresql+psycopg2:// which psycopg2 rejects.
    return re.sub(r"^postgresql\+[^:]+://", "postgresql://", raw)


def _clean_text(s: str) -> str:
    s = s.replace("\u00a0", " ")
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]{2,}", " ", s)
    s = re.sub(r"\s+\n", "\n", s)
    s = re.sub(r"\n\s+", "\n", s)
    return s.strip()


def _parse_json_ld(raw: str) -> list[dict] | list[Any] | None:
    try:
        data = json.loads(raw)
    except Exception:
        return None
    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        return [data]
    return None


def _json_ld_candidates(desc: Any) -> list[str]:
    out: list[str] = []

    def walk(x: Any) -> None:
        if isinstance(x, dict):
            # about.description pattern used by some serializers
            about = x.get("about")
            if isinstance(about, dict):
                maybe = about.get("description") or about.get("shortDescription")
                if isinstance(maybe, str) and maybe.strip():
                    out.append(maybe.strip())
            # direct description
            maybe2 = x.get("description")
            if isinstance(maybe2, str) and maybe2.strip():
                out.append(maybe2.strip())

            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for item in x:
                walk(item)

    walk(desc)
    # preserve order but prefer longer later via max()
    return [o for o in out if isinstance(o, str) and o.strip()]


def extract_long_description(html: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")

    MIN_GOOD_LEN = 250

    fallback_desc: str | None = None

    # 1) JSON-LD (prefer long, but keep as fallback)
    best_json: str | None = None
    json_ld_scripts = soup.find_all("script", attrs={"type": lambda v: isinstance(v, str) and "ld+json" in v})
    for sc in json_ld_scripts:
        raw = sc.get_text(strip=True) if sc else ""
        if not raw:
            continue
        parsed = _parse_json_ld(raw)
        if not parsed:
            continue
        for node in parsed:
            cands = _json_ld_candidates(node)
            if not cands:
                continue
            cand = max(cands, key=len)
            if cand and (best_json is None or len(cand) > len(best_json)):
                best_json = cand

    if best_json:
        cleaned = _clean_text(best_json)
        fallback_desc = cleaned[:20000]
        if len(cleaned) >= MIN_GOOD_LEN:
            return cleaned[:20000]

    # 2) meta description
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        cleaned = _clean_text(meta["content"])
        if cleaned:
            if fallback_desc is None or len(cleaned) > len(fallback_desc):
                fallback_desc = cleaned[:20000]

    # 3) largest "about/description/overview" block
    candidates: list[str] = []
    selectors = [
        "main",
        "article",
        '[class*="description" i]',
        '[id*="description" i]',
        '[class*="about" i]',
        '[id*="about" i]',
        '[class*="overview" i]',
        '[id*="overview" i]',
        ".property-description",
        ".community-description",
        ".about",
        "#about",
        "#overview",
        "[role='main']",
    ]
    seen_el = set()
    for sel in selectors:
        for el in soup.select(sel):
            # de-dupe by object identity
            if id(el) in seen_el:
                continue
            seen_el.add(id(el))
            txt = el.get_text(" ", strip=True)
            txt = _clean_text(txt)
            if len(txt) >= 120:
                candidates.append(txt)
    if candidates:
        best = max(candidates, key=len)
        if len(best) >= MIN_GOOD_LEN:
            return best[:20000]
        # not long enough; keep as an intermediate candidate vs fallback_desc
        if fallback_desc is None or len(best) > len(fallback_desc):
            fallback_desc = best[:20000]

    # last resort: body text head
    body = soup.body.get_text(" ", strip=True) if soup.body else soup.get_text(" ", strip=True)
    body = _clean_text(body)
    if body:
        if len(body) >= MIN_GOOD_LEN:
            return body[:20000]
        if fallback_desc is None or len(body) > len(fallback_desc):
            fallback_desc = body[:20000]

    return fallback_desc


def normalize_listing_url_for_fetch(company: str, listing_url: str) -> list[str]:
    """
    Return an ordered list of URL candidates to try.

    RentCafe commonly stores paths like:
      /.../something/default/default.aspx
    but the live page is typically:
      /.../something/default.aspx
    """
    out: list[str] = []
    u = (listing_url or "").strip()
    if not u:
        return out
    out.append(u)

    if company == "RentCafe" and "rentcafe.com" in u.lower():
        # Collapse a duplicate /default/ immediately before default.aspx
        fixed = re.sub(r"(?i)/default/default\.aspx$", "/default.aspx", u)
        if fixed != u:
            out.append(fixed)
        # Also handle any repeated "/default/default/" segments before final default.aspx
        fixed2 = re.sub(r"(?i)(/default){2,}/default\.aspx$", "/default.aspx", u)
        if fixed2 not in out:
            out.append(fixed2)

        # Many RentCafe marketing URLs are effectively:
        #   /apartments/<st>/<city>/<seg1>/<seg2>/.../default.aspx
        # but the live canonical URL often hyphen-merges all slug segments:
        #   /apartments/<st>/<city>/<seg1>-<seg2>-.../default.aspx
        hyphen_u = rentcafe_hyphen_slug_url(u)
        if hyphen_u and hyphen_u not in out:
            out.append(hyphen_u)
        # And apply the same to the "/default/default.aspx" collapsed variants.
        if fixed != u:
            hyphen_f = rentcafe_hyphen_slug_url(fixed)
            if hyphen_f and hyphen_f not in out:
                out.append(hyphen_f)
        hyphen_f2 = rentcafe_hyphen_slug_url(fixed2)
        if hyphen_f2 and hyphen_f2 not in out:
            out.append(hyphen_f2)

    return out


def rentcafe_hyphen_slug_url(listing_url: str) -> str | None:
    """
    Convert overly-slashy RentCafe paths into the common hyphenated slug shape.

    Example:
      /apartments/az/mesa/pala/mesa/0/default.aspx
        -> /apartments/az/mesa/pala-mesa-0/default.aspx
    """
    try:
        parsed = urlparse(listing_url)
        if not parsed.scheme or not parsed.netloc:
            return None
        parts = parsed.path.strip("/").split("/")
        if len(parts) < 4:
            return None
        if parts[0].lower() != "apartments":
            return None
        state = parts[1]
        city = parts[2]
        rest = parts[3:]
        if not rest:
            return None
        if rest[-1].lower() != "default.aspx":
            return None
        slug_parts = rest[:-1]
        # Drop a trailing folder named "default" right before default.aspx
        if slug_parts and slug_parts[-1].lower() == "default":
            slug_parts = slug_parts[:-1]
        if not slug_parts:
            return None
        slug = "-".join(slug_parts)
        return f"{parsed.scheme}://{parsed.netloc}/apartments/{state}/{city}/{slug}/default.aspx"
    except Exception:
        return None


def rentcafe_url_from_property_id(property_id: str | None) -> str | None:
    """
    Rebuild a RentCafe property URL from the hyphenated `property_id` used by `rentcafe_scraper`.

    This intentionally mirrors `property_id_to_listing_url` without importing `rentcafe_scraper`
    (that module imports proxy configuration at import time).
    """
    if not property_id:
        return None
    core = str(property_id).strip()
    suffix = "-default-aspx"
    if core.lower().endswith(suffix):
        core = core[: -len(suffix)]
    if not core:
        return None
    path_body = core.replace("-", "/")
    if not path_body:
        return None
    return f"{BASE_RENTCAFE_URL}{path_body}/default.aspx"


_BAD_HTML_MARKERS = (
    "error processing your request",
    "sorry, you have been blocked",
    "attention required!",
    "just a moment...",
    "cf-challenge",
    "enable javascript and cookies to continue",
)


def is_bad_html(status_code: int, html: str) -> bool:
    if status_code >= 400:
        return True
    low = html.lower()
    if "<title>error</title>" in low:
        return True
    for m in _BAD_HTML_MARKERS:
        if m in low:
            return True
    return False


@dataclass
class UrlJob:
    company: str
    listing_url: str
    property_id: str | None = None


def _get_thread_http_session() -> requests.Session:
    if not hasattr(fetch_and_extract, "_thread_local"):
        fetch_and_extract._thread_local = threading.local()  # type: ignore[attr-defined]
    local = fetch_and_extract._thread_local  # type: ignore[attr-defined]
    sess = getattr(local, "http_session", None)
    if sess is None:
        sess = requests.Session()
        local.http_session = sess
    return sess


def _get_thread_cf_session() -> cloudscraper.CloudScraper:
    if not hasattr(fetch_and_extract, "_thread_local"):
        fetch_and_extract._thread_local = threading.local()  # type: ignore[attr-defined]
    local = fetch_and_extract._thread_local  # type: ignore[attr-defined]
    sess = getattr(local, "cf_session", None)
    if sess is None:
        sess = cloudscraper.create_scraper(browser={"browser": "chrome", "platform": "darwin", "mobile": False})
        sess.headers.update(
            {
                "User-Agent": (
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept-Language": "en-US,en;q=0.9",
            }
        )
        local.cf_session = sess
    return sess


def fetch_and_extract(session: requests.Session, job: UrlJob, timeout_s: int) -> tuple[UrlJob, str | None]:
    # `session` arg is ignored; we keep per-thread sessions (http + cloudscraper).
    http = _get_thread_http_session()
    cf = _get_thread_cf_session()

    use_cf = job.company in {"RentCafe", "RealPage"} or (
        job.listing_url
        and (
            "rentcafe.com" in job.listing_url.lower()
            or "securecafe.com" in job.listing_url.lower()
        )
    )

    parsed = urlparse(job.listing_url)
    if not parsed.scheme or not parsed.netloc:
        return job, None
    try:
        candidates = normalize_listing_url_for_fetch(job.company, job.listing_url)
        if job.company == "RentCafe":
            rebuilt = rentcafe_url_from_property_id(job.property_id)
            if rebuilt and rebuilt not in candidates:
                candidates.append(rebuilt)
        last_html = ""
        last_status = 0
        for attempt_url in candidates:
            for attempt in range(3):
                client = cf if use_cf else http
                # cloudscraper already carries browser-like headers; avoid fighting it with a bot UA.
                resp = client.get(attempt_url, timeout=timeout_s, allow_redirects=True)
                last_status = int(resp.status_code)
                last_html = resp.text
                if last_status in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(last_status, last_html):
                    break
                desc = extract_long_description(last_html)
                if desc:
                    return job, desc
                break

        # One last try: extract from last response if it wasn't obviously an error gate
        if last_html and not is_bad_html(last_status, last_html):
            return job, extract_long_description(last_html)
        return job, None
    except Exception:
        return job, None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Extract only; do not update DB.")
    parser.add_argument("--company", default=None, help="Optional: restrict to a single company.")
    parser.add_argument("--max-urls", type=int, default=None, help="Optional: cap number of distinct URLs.")
    parser.add_argument("--workers", type=int, default=8, help="Fetch concurrency.")
    parser.add_argument("--timeout-s", type=int, default=45, help="Per-URL timeout.")
    args = parser.parse_args()

    load_dotenv(ENV_FILE, override=True)
    raw_db_url = os.environ.get("DATABASE_URL", "").strip()
    if not raw_db_url:
        raise SystemExit("DATABASE_URL missing in api/.env")
    db_url = normalize_db_url(raw_db_url)

    table_name = (os.environ.get("LISTINGS_TABLE_NAME", "listings") or "listings").strip() or "listings"
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")

    qtable = f'"{schema}"."{table_name}"' if schema else f'"{table_name}"'

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # NOTE: For RentCafe we also pass through `property_id` so we can rebuild canonical URLs when
    # `listing_url` in the DB is stale/broken (common) using the same hyphen→slash mapping as the scraper.
    sql = f"""
      SELECT company, listing_url, MAX(property_id) AS property_id
      FROM {qtable}
      WHERE listing_url IS NOT NULL
    """
    params: list[Any] = []
    if args.company:
        sql += " AND company = %s"
        params.append(args.company)

    sql += " GROUP BY company, listing_url"

    if args.max_urls is not None:
        sql += " LIMIT %s"
        params.append(args.max_urls)

    cur.execute(sql, params if params else None)
    jobs_rows = cur.fetchall()
    jobs: list[UrlJob] = [
        UrlJob(company=r[0], listing_url=r[1], property_id=r[2]) for r in jobs_rows
    ]

    print(f"Distinct URLs to process: {len(jobs)}", flush=True)

    session = requests.Session()  # passed to worker; worker uses thread-local sessions

    processed = 0
    extracted_ok = 0
    extracted_none = 0

    batch_commit_every = 250
    batch: list[tuple[str, str, str]] = []  # (company, listing_url, desc)

    def flush_batch() -> None:
        nonlocal batch, extracted_ok
        if not batch:
            return
        for company, listing_url, desc in batch:
            cur.execute(
                f"UPDATE {qtable} SET description = %s WHERE company = %s AND listing_url = %s",
                (desc, company, listing_url),
            )
        conn.commit()
        batch = []
        print(f"Committed updates (distinct_urls_updated={extracted_ok})", flush=True)

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        fut_map = {ex.submit(fetch_and_extract, session, job, args.timeout_s): job for job in jobs}
        for fut in as_completed(fut_map):
            processed += 1
            job = fut_map[fut]
            try:
                j, desc = fut.result()
            except Exception:
                extracted_none += 1
                if processed % 100 == 0:
                    print(f"Progress: {processed}/{len(jobs)} processed", flush=True)
                continue

            if not desc:
                extracted_none += 1
            else:
                extracted_ok += 1
                if not args.dry_run:
                    batch.append((j.company, j.listing_url, desc))

            if not args.dry_run and len(batch) >= batch_commit_every:
                flush_batch()

            if processed % 100 == 0:
                print(
                    f"Progress: {processed}/{len(jobs)} processed; extracted_ok={extracted_ok}; extracted_none={extracted_none}",
                    flush=True,
                )

    if args.dry_run:
        print(f"Dry run: extracted descriptions for {extracted_ok}/{len(jobs)} URLs", flush=True)
        cur.close()
        conn.close()
        return 0

    # final flush
    flush_batch()

    print(
        f"Done. processed={processed}; distinct_urls_extracted_ok={extracted_ok}; distinct_urls_extracted_none={extracted_none}",
        flush=True,
    )

    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

