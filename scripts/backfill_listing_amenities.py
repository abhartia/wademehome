#!/usr/bin/env python3
"""
Backfill ``listings.community_amenities`` / ``listings.apartment_amenities`` from vendor pages.

Source-only: updates run only when the expected HTML/JSON structure parses successfully.
On parse failure, the row is left unchanged (no overwrite with ``[]``).
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import cloudscraper
import psycopg2
import requests
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import listing_amenities_parsers as lap

# Reuse URL canonicalization + bad-html checks from description backfill.
_bld_spec = importlib.util.spec_from_file_location(
    "backfill_listing_descriptions",
    REPO_ROOT / "scripts" / "backfill_listing_descriptions.py",
)
assert _bld_spec and _bld_spec.loader
_bld = importlib.util.module_from_spec(_bld_spec)
# Required so dataclasses in the loaded module resolve their module in sys.modules.
sys.modules["backfill_listing_descriptions"] = _bld
_bld_spec.loader.exec_module(_bld)

normalize_db_url = _bld.normalize_db_url
normalize_listing_url_for_fetch = _bld.normalize_listing_url_for_fetch
rentcafe_url_from_property_id = _bld.rentcafe_url_from_property_id
is_bad_html = _bld.is_bad_html

ENV_FILE = REPO_ROOT / "api" / ".env"


@dataclass
class UrlJob:
    company: str
    listing_url: str
    property_id: str | None = None


def _get_thread_cf_session() -> cloudscraper.CloudScraper:
    if not hasattr(fetch_amenities, "_thread_local"):
        fetch_amenities._thread_local = threading.local()  # type: ignore[attr-defined]
    local = fetch_amenities._thread_local  # type: ignore[attr-defined]
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


def _get_thread_http_session() -> requests.Session:
    if not hasattr(fetch_amenities, "_thread_local"):
        fetch_amenities._thread_local = threading.local()  # type: ignore[attr-defined]
    local = fetch_amenities._thread_local  # type: ignore[attr-defined]
    sess = getattr(local, "http_session", None)
    if sess is None:
        sess = requests.Session()
        local.http_session = sess
    return sess


def fetch_amenities(job: UrlJob, timeout_s: int) -> tuple[list[str], list[str]] | None:
    """Return (community, apartment) name lists or None if skipped / failed parse."""
    parsed = urlparse(job.listing_url)
    if not parsed.scheme or not parsed.netloc:
        return None

    use_cf = job.company in {"RentCafe", "RealPage"} or (
        job.listing_url
        and ("rentcafe.com" in job.listing_url.lower() or "securecafe.com" in job.listing_url.lower())
    )

    if job.company == "RentCafe":
        cf = _get_thread_cf_session()
        candidates = normalize_listing_url_for_fetch(job.company, job.listing_url)
        rebuilt = rentcafe_url_from_property_id(job.property_id)
        if rebuilt and rebuilt not in candidates:
            candidates.append(rebuilt)
        last_html = ""
        last_status = 0
        for attempt_url in candidates:
            for attempt in range(3):
                client = cf if use_cf else _get_thread_http_session()
                resp = client.get(attempt_url, timeout=timeout_s, allow_redirects=True)
                last_status = int(resp.status_code)
                last_html = resp.text
                if last_status in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(last_status, last_html):
                    break
                parsed_am = lap.parse_rentcafe_amenities(last_html)
                if parsed_am is not None:
                    return parsed_am
                break
        if last_html and not is_bad_html(last_status, last_html):
            return lap.parse_rentcafe_amenities(last_html)
        return None

    if job.company == "RealPage":
        cf = _get_thread_cf_session()
        floorplans_url = job.listing_url.strip()
        for attempt_url in normalize_listing_url_for_fetch(job.company, floorplans_url) or [floorplans_url]:
            for attempt in range(3):
                resp = cf.get(attempt_url, timeout=timeout_s, allow_redirects=True)
                if int(resp.status_code) in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(int(resp.status_code), resp.text):
                    break
                try:
                    am_url = lap.securecafe_amenities_url(attempt_url)
                    ra = cf.get(
                        am_url,
                        timeout=timeout_s,
                        headers={
                            "Referer": attempt_url,
                            "Accept": "text/html,application/xhtml+xml",
                        },
                    )
                    if ra.status_code == 200 and not is_bad_html(int(ra.status_code), ra.text):
                        out = lap.parse_securecafe_amenities_html(ra.text)
                        if out is not None:
                            return out
                except Exception:
                    pass
                break
        return None

    if job.company == "Entrata":
        cf = _get_thread_cf_session()
        seed_url = job.listing_url.strip()
        for attempt_url in normalize_listing_url_for_fetch(job.company, seed_url) or [seed_url]:
            for attempt in range(3):
                resp = cf.get(attempt_url, timeout=timeout_s, allow_redirects=True)
                if int(resp.status_code) in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(int(resp.status_code), resp.text):
                    break
                try:
                    am_url = lap.entrata_amenities_url(attempt_url)
                    ar = cf.get(
                        am_url,
                        timeout=timeout_s,
                        headers={
                            "Referer": attempt_url,
                            "Accept": "text/html,application/xhtml+xml",
                        },
                    )
                    if ar.status_code == 200 and not is_bad_html(int(ar.status_code), ar.text):
                        out = lap.parse_entrata_jonah_amenities_html(ar.text)
                        if out is not None:
                            return out
                except Exception:
                    pass
                break
        return None

    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Parse only; do not update DB.")
    parser.add_argument("--company", default=None, help="Restrict to one company (RentCafe, RealPage, Entrata).")
    parser.add_argument("--max-urls", type=int, default=None, help="Cap distinct URLs processed.")
    parser.add_argument("--workers", type=int, default=6, help="Fetch concurrency.")
    parser.add_argument("--timeout-s", type=int, default=45, help="HTTP timeout per request.")
    parser.add_argument(
        "--validate-greystar",
        action="store_true",
        help="Sample Greystar rows: compare DB JSON to parse_greystar_amenities_from_html (no writes).",
    )
    parser.add_argument("--validate-sample", type=int, default=20, help="Rows to sample for --validate-greystar.")
    parser.add_argument(
        "--force-all-urls",
        action="store_true",
        help="Fetch every distinct listing_url even when amenities are already populated (legacy behavior).",
    )
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

    if args.validate_greystar:
        sql = f"""
          SELECT listing_url,
                 community_amenities,
                 apartment_amenities
          FROM {qtable}
          WHERE company = 'Greystar'
            AND listing_url IS NOT NULL
          ORDER BY RANDOM()
          LIMIT %s
        """
        cur.execute(sql, (args.validate_sample,))
        rows = cur.fetchall()
        cf = _get_thread_cf_session()
        mismatches = 0
        for listing_url, db_comm, db_apt in rows:
            try:
                r = cf.get(listing_url.strip(), timeout=args.timeout_s, allow_redirects=True)
                if r.status_code != 200 or is_bad_html(r.status_code, r.text):
                    continue
                live = lap.parse_greystar_amenities_from_html(r.text)
                if live is None:
                    continue
                try:
                    c_db = json.loads(db_comm) if db_comm else []
                    a_db = json.loads(db_apt) if db_apt else []
                except (json.JSONDecodeError, TypeError):
                    mismatches += 1
                    continue
                if live[0] != c_db or live[1] != a_db:
                    mismatches += 1
                    print(
                        f"MISMATCH {listing_url}\n  db: comm={c_db[:3]}... apt={a_db[:3]}...\n"
                        f"  live: comm={live[0][:3]}... apt={live[1][:3]}...\n",
                        flush=True,
                    )
            except Exception as e:
                print(f"ERR {listing_url}: {e}", flush=True)
        print(f"Greystar validate sample={len(rows)} mismatches={mismatches}", flush=True)
        cur.close()
        conn.close()
        return 0

    sql = f"""
      SELECT company, listing_url, MAX(property_id) AS property_id
      FROM {qtable}
      WHERE listing_url IS NOT NULL
        AND company IN ('RentCafe', 'RealPage', 'Entrata')
    """
    params: list[Any] = []
    if args.company:
        sql += " AND company = %s"
        params.append(args.company)

    sql += """
      GROUP BY company, listing_url
    """
    if not args.force_all_urls:
        # Skip URLs where both columns already look populated (not NULL/[]/null/blank).
        sql += """ HAVING BOOL_OR(
          community_amenities IS NULL
          OR BTRIM(community_amenities::text) IN ('', '[]', 'null')
          OR apartment_amenities IS NULL
          OR BTRIM(apartment_amenities::text) IN ('', '[]', 'null')
        )
    """

    if args.max_urls is not None:
        sql += " LIMIT %s"
        params.append(args.max_urls)

    cur.execute(sql, params if params else None)
    jobs_rows = cur.fetchall()
    jobs: list[UrlJob] = [UrlJob(company=r[0], listing_url=r[1], property_id=r[2]) for r in jobs_rows]

    if args.force_all_urls:
        print("Mode: processing every distinct listing_url (--force-all-urls).", flush=True)
    else:
        print(
            "Mode: only listing_urls where some row still has empty community and/or apartment amenities.",
            flush=True,
        )
    print(f"Distinct URLs to process: {len(jobs)}", flush=True)

    processed = 0
    parsed_ok = 0
    parsed_none = 0

    batch: list[tuple[str, str, str, str]] = []
    batch_commit_every = 100

    def flush_batch() -> None:
        nonlocal batch
        if not batch:
            return
        for company, listing_url, cj, aj in batch:
            cur.execute(
                f"UPDATE {qtable} SET community_amenities = %s, apartment_amenities = %s "
                f"WHERE company = %s AND listing_url = %s",
                (cj, aj, company, listing_url),
            )
        conn.commit()
        batch = []
        print(f"Committed batch (updates so far={parsed_ok})", flush=True)

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        fut_map = {ex.submit(fetch_amenities, job, args.timeout_s): job for job in jobs}
        for fut in as_completed(fut_map):
            processed += 1
            job = fut_map[fut]
            try:
                out = fut.result()
            except Exception:
                parsed_none += 1
                if processed % 100 == 0:
                    print(f"Progress: {processed}/{len(jobs)}", flush=True)
                continue

            if out is None:
                parsed_none += 1
            else:
                parsed_ok += 1
                cj, aj = json.dumps(out[0]), json.dumps(out[1])
                if not args.dry_run:
                    batch.append((job.company, job.listing_url, cj, aj))

            if not args.dry_run and len(batch) >= batch_commit_every:
                flush_batch()

            if processed % 100 == 0:
                print(
                    f"Progress: {processed}/{len(jobs)} ok={parsed_ok} skip={parsed_none}",
                    flush=True,
                )

    if args.dry_run:
        print(f"Dry run: parsed_ok={parsed_ok} skip={parsed_none} total={len(jobs)}", flush=True)
        cur.close()
        conn.close()
        return 0

    flush_batch()
    print(f"Done. processed={processed} parsed_ok={parsed_ok} parsed_none={parsed_none}", flush=True)
    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
