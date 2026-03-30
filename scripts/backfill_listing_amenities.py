#!/usr/bin/env python3
"""
Scrape community/apartment amenities from vendor pages into ``listing_amenities``.

Rows with **no** ``listing_amenities`` for that ``listing_id`` are candidates. Work is deduped
by ``(company, listing_url)`` (one HTTP fetch per URL; inserts apply to every ``listing_id`` on
that URL). Source-only: nothing is written unless the parser returns structured lists
(``None`` skips; empty lists still count as a successful parse but insert no rows).

Uses the same normalization and ``amenity_embedding_source_hash`` as
``sync_listing_amenities.py`` (via ``listing_amenities_upsert``). Run
``scripts/backfill_listing_amenity_embeddings.py`` afterward for vectors.

Logging: UTC lines, ``--heartbeat-sec``, ``wait`` + STALL for HTTP, and a **DB writer thread**
so upserts do not block the HTTP loop. Checkpoint defaults to
``scripts/.listing_amenities_scrape.checkpoint.json`` (advance **every** completed URL).
"""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
import queue
import sys
import threading
import time
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import cloudscraper
import psycopg2
import requests
from dotenv import load_dotenv
from psycopg2.extras import execute_values

REPO_ROOT = Path(__file__).resolve().parent.parent
_SCRIPTS = REPO_ROOT / "scripts"
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

import listing_amenities_upsert as lau

import listing_amenities_parsers as lap

# Reuse URL canonicalization + bad-html checks from description backfill.
_bld_spec = importlib.util.spec_from_file_location(
    "backfill_listing_descriptions",
    REPO_ROOT / "scripts" / "backfill_listing_descriptions.py",
)
assert _bld_spec and _bld_spec.loader
_bld = importlib.util.module_from_spec(_bld_spec)
sys.modules["backfill_listing_descriptions"] = _bld
_bld_spec.loader.exec_module(_bld)

normalize_db_url = _bld.normalize_db_url
normalize_listing_url_for_fetch = _bld.normalize_listing_url_for_fetch
rentcafe_url_from_property_id = _bld.rentcafe_url_from_property_id
is_bad_html = _bld.is_bad_html

ENV_FILE = REPO_ROOT / "api" / ".env"

SUPPORTED_COMPANIES = ("RentCafe", "RealPage", "Entrata", "Greystar")

_LOG_LOCK = threading.Lock()


def _now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _log(msg: str) -> None:
    line = f"{_now_utc()}  {msg}\n"
    with _LOG_LOCK:
        sys.stdout.write(line)
        sys.stdout.flush()


def _job_key(job: "UrlJob") -> str:
    return f"{job.company}|{job.listing_url}"


def _build_mode_signature(args: argparse.Namespace) -> str:
    raw = (
        f"company={args.company}|force={args.force_all_urls}|max={args.max_urls}|"
        f"amenity_table={args.amenity_table}"
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:24]


def _load_checkpoint(path: Path) -> dict[str, Any] | None:
    try:
        if not path.exists():
            return None
        with path.open("r", encoding="utf-8") as f:
            out = json.load(f)
        return out if isinstance(out, dict) else None
    except Exception:
        return None


def _save_checkpoint(
    path: Path,
    mode_signature: str,
    processed: int,
    parsed_ok: int,
    parsed_none: int,
    last_key: str,
) -> None:
    payload = {
        "mode_signature": mode_signature,
        "processed": int(processed),
        "parsed_ok": int(parsed_ok),
        "parsed_none": int(parsed_none),
        "last_key": last_key,
        "updated_at": _now_utc(),
    }
    tmp = path.with_suffix(path.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=True, indent=2)
    os.replace(tmp, path)


def _amenities_to_upsert_rows(
    listing_ids: list[str],
    community: list[str],
    apartment: list[str],
) -> list[tuple[str, str, str, str, str]]:
    rows: list[tuple[str, str, str, str, str]] = []
    for lid in listing_ids:
        lid_s = str(lid).strip()
        if not lid_s:
            continue
        seen_norm_source: set[tuple[str, str]] = set()
        for raw in community:
            raw_s = str(raw).strip()
            if not raw_s:
                continue
            norm = lau.normalize_amenity_text(raw_s)
            if not norm:
                continue
            key = (norm, "community")
            if key in seen_norm_source:
                continue
            seen_norm_source.add(key)
            h = lau.source_hash(raw_s, norm, "community")
            rows.append((lid_s, raw_s, norm, "community", h))
        for raw in apartment:
            raw_s = str(raw).strip()
            if not raw_s:
                continue
            norm = lau.normalize_amenity_text(raw_s)
            if not norm:
                continue
            key = (norm, "apartment")
            if key in seen_norm_source:
                continue
            seen_norm_source.add(key)
            h = lau.source_hash(raw_s, norm, "apartment")
            rows.append((lid_s, raw_s, norm, "apartment", h))
    return rows


def _db_writer_main(
    q: "queue.Queue[list[tuple[str, str, str, str, str]] | None]",
    db_url: str,
    upsert_sql: str,
    batch_commit_every: int,
) -> None:
    wconn = psycopg2.connect(db_url)
    wcur = wconn.cursor()
    wcur.execute("SET statement_timeout = '120s'")
    wcur.execute("SET lock_timeout = '30s'")
    wconn.commit()

    buf: list[tuple[str, str, str, str, str]] = []

    def flush_buf() -> None:
        if not buf:
            return
        n = len(buf)
        _log(f"DB upsert: committing {n} listing_amenities row(s)…")
        execute_values(
            wcur,
            upsert_sql,
            buf,
            template="(%s, %s, %s, %s, %s, NOW())",
        )
        wconn.commit()
        buf.clear()

    while True:
        item = q.get()
        if item is None:
            flush_buf()
            break
        buf.extend(item)
        while len(buf) >= batch_commit_every:
            chunk = buf[:batch_commit_every]
            del buf[:batch_commit_every]
            _log(f"DB upsert: committing {len(chunk)} listing_amenities row(s)…")
            execute_values(
                wcur,
                upsert_sql,
                chunk,
                template="(%s, %s, %s, %s, %s, NOW())",
            )
            wconn.commit()
    wcur.close()
    wconn.close()


def _heartbeat_loop(
    stop: threading.Event,
    state: dict[str, Any],
    total: int,
    interval_s: float,
) -> None:
    while not stop.wait(timeout=interval_s):
        processed = int(state.get("processed", 0))
        parsed_ok = int(state.get("parsed_ok", 0))
        parsed_none = int(state.get("parsed_none", 0))
        t0 = float(state.get("t0", time.monotonic()))
        elapsed = max(time.monotonic() - t0, 1e-6)
        rate = processed / elapsed
        remaining = max(total - processed, 0)
        eta_s = remaining / rate if rate > 0 else 0.0
        _log(
            f"heartbeat  urls_done={processed}/{total}  ok={parsed_ok}  skip={parsed_none}  "
            f"{rate:.2f} url/s  elapsed={elapsed:.0f}s  ETA≈{eta_s:.0f}s"
        )


@dataclass
class UrlJob:
    company: str
    listing_url: str
    listing_ids: list[str]
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


def _http_timeout(connect_s: int, read_s: int) -> tuple[int, int]:
    return (max(5, int(connect_s)), max(10, int(read_s)))


def fetch_amenities(job: UrlJob, connect_timeout_s: int, read_timeout_s: int) -> tuple[list[str], list[str]] | None:
    """Return (community, apartment) name lists or None if skipped / failed parse."""
    to = _http_timeout(connect_timeout_s, read_timeout_s)
    parsed = urlparse(job.listing_url)
    if not parsed.scheme or not parsed.netloc:
        return None

    use_cf = job.company in {"RentCafe", "RealPage", "Greystar"} or (
        job.listing_url
        and ("rentcafe.com" in job.listing_url.lower() or "securecafe.com" in job.listing_url.lower())
    )

    if job.company == "Greystar":
        cf = _get_thread_cf_session()
        seed_url = job.listing_url.strip()
        for attempt in range(3):
            resp = cf.get(seed_url, timeout=to, allow_redirects=True)
            if int(resp.status_code) in {403, 429, 503}:
                time.sleep(1.5 + attempt)
                continue
            if is_bad_html(int(resp.status_code), resp.text):
                return None
            out = lap.parse_greystar_amenities_from_html(resp.text)
            return out
        return None

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
                resp = client.get(attempt_url, timeout=to, allow_redirects=True)
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
                resp = cf.get(attempt_url, timeout=to, allow_redirects=True)
                if int(resp.status_code) in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(int(resp.status_code), resp.text):
                    break
                try:
                    am_url = lap.securecafe_amenities_url(attempt_url)
                    ra = cf.get(
                        am_url,
                        timeout=to,
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
                resp = cf.get(attempt_url, timeout=to, allow_redirects=True)
                if int(resp.status_code) in {403, 429, 503}:
                    time.sleep(1.5 + attempt)
                    continue
                if is_bad_html(int(resp.status_code), resp.text):
                    break
                try:
                    am_url = lap.entrata_amenities_url(attempt_url)
                    ar = cf.get(
                        am_url,
                        timeout=to,
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


def _qualified_table(schema: str | None, table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scrape amenities into listing_amenities for listings with no amenity rows."
    )
    parser.add_argument("--dry-run", action="store_true", help="Parse only; do not write listing_amenities.")
    parser.add_argument(
        "--company",
        default=None,
        help=f"Restrict to one company ({', '.join(SUPPORTED_COMPANIES)}).",
    )
    parser.add_argument("--max-urls", type=int, default=None, help="Cap distinct URLs processed.")
    parser.add_argument("--workers", type=int, default=4, help="HTTP fetch concurrency.")
    parser.add_argument("--timeout-s", type=int, default=45, help="HTTP read timeout.")
    parser.add_argument("--connect-timeout-s", type=int, default=15, metavar="SEC")
    parser.add_argument(
        "--pool-wait-sec",
        type=int,
        default=120,
        metavar="SEC",
        help="Seconds before STALL log if no worker finishes.",
    )
    parser.add_argument(
        "--validate-greystar",
        action="store_true",
        help="Sample Greystar listing URLs; fetch and print parsed amenity counts (no DB writes).",
    )
    parser.add_argument("--validate-sample", type=int, default=20)
    parser.add_argument(
        "--force-all-urls",
        action="store_true",
        help="Process every distinct (company, listing_url) for supported companies, even if listing_amenities already has rows.",
    )
    parser.add_argument("--progress-every", type=int, default=10)
    parser.add_argument("--heartbeat-sec", type=int, default=30)
    parser.add_argument(
        "--checkpoint-file",
        default=str(REPO_ROOT / "scripts" / ".listing_amenities_scrape.checkpoint.json"),
        help="Checkpoint path (updated after every URL).",
    )
    parser.add_argument(
        "--amenity-table",
        default=None,
        help="Override listing_amenities table name (default: LISTING_AMENITIES_TABLE_NAME or listing_amenities).",
    )
    parser.add_argument(
        "--db-upsert-batch",
        type=int,
        default=400,
        help="Rows per listing_amenities commit batch in writer thread.",
    )
    args = parser.parse_args()

    amenity_table = (args.amenity_table or os.environ.get("LISTING_AMENITIES_TABLE_NAME") or "listing_amenities").strip()
    args.amenity_table = amenity_table

    load_dotenv(ENV_FILE, override=True)
    raw_db_url = os.environ.get("DATABASE_URL", "").strip()
    if not raw_db_url:
        raise SystemExit("DATABASE_URL missing in api/.env")
    db_url = normalize_db_url(raw_db_url)

    table_name = (os.environ.get("LISTINGS_TABLE_NAME", "listings") or "listings").strip() or "listings"
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")
    qlist = _qualified_table(schema, table_name)
    q_amenity = _qualified_table(schema, amenity_table)
    upsert_sql = lau.upsert_sql_for_table(q_amenity)

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SET statement_timeout = '120s'")
    cur.execute("SET lock_timeout = '30s'")
    conn.commit()

    if args.validate_greystar:
        sql = f"""
          SELECT listing_url
          FROM {qlist}
          WHERE company = 'Greystar'
            AND listing_url IS NOT NULL
          ORDER BY RANDOM()
          LIMIT %s
        """
        cur.execute(sql, (args.validate_sample,))
        rows = cur.fetchall()
        cf = _get_thread_cf_session()
        to = _http_timeout(15, args.timeout_s)
        for (listing_url,) in rows:
            try:
                r = cf.get(listing_url.strip(), timeout=to, allow_redirects=True)
                if r.status_code != 200 or is_bad_html(r.status_code, r.text):
                    print(f"{listing_url}  skip bad_http {r.status_code}", flush=True)
                    continue
                live = lap.parse_greystar_amenities_from_html(r.text)
                if live is None:
                    print(f"{listing_url}  parse=None", flush=True)
                else:
                    c, a = live
                    print(
                        f"{listing_url}  community={len(c)} apartment={len(a)}  "
                        f"sample_c={c[:2]!r} sample_a={a[:2]!r}",
                        flush=True,
                    )
            except Exception as e:
                print(f"ERR {listing_url}: {e}", flush=True)
        print(f"Greystar validate sample={len(rows)}", flush=True)
        cur.close()
        conn.close()
        return 0

    companies = list(SUPPORTED_COMPANIES)
    if args.company:
        if args.company not in SUPPORTED_COMPANIES:
            _log(
                f"Unsupported --company={args.company!r}; supported: {', '.join(SUPPORTED_COMPANIES)}. Exiting."
            )
            cur.close()
            conn.close()
            return 2
        companies = [args.company]

    miss_clause = "TRUE" if args.force_all_urls else f"""
          NOT EXISTS (
            SELECT 1 FROM {q_amenity} la
            WHERE la.listing_id = l.listing_id::text
          )
    """

    sql = f"""
      WITH missing AS (
        SELECT l.listing_id::text AS listing_id, l.company, l.listing_url, l.property_id
        FROM {qlist} l
        WHERE l.listing_url IS NOT NULL
          AND l.company IS NOT NULL
          AND l.company IN ({",".join(["%s"] * len(companies))})
          AND ({miss_clause})
      ),
      grouped AS (
        SELECT company, listing_url, MAX(property_id) AS property_id,
               array_agg(listing_id ORDER BY listing_id) AS listing_ids
        FROM missing
        GROUP BY company, listing_url
      )
      SELECT company, listing_url, property_id, listing_ids
      FROM grouped
      ORDER BY company, listing_url
    """
    params: list[Any] = list(companies)
    if args.max_urls is not None:
        sql += " LIMIT %s"
        params.append(args.max_urls)

    cur.execute(sql, params)
    rows_raw = cur.fetchall()
    jobs: list[UrlJob] = []
    for r in rows_raw:
        company, listing_url, property_id, listing_ids = r[0], r[1], r[2], r[3]
        ids = [str(x) for x in (listing_ids or []) if str(x).strip()]
        if not ids:
            continue
        jobs.append(
            UrlJob(
                company=str(company),
                listing_url=str(listing_url),
                listing_ids=ids,
                property_id=str(property_id) if property_id is not None else None,
            )
        )

    total_jobs = len(jobs)
    checkpoint_path = Path(args.checkpoint_file).expanduser()
    mode_signature = _build_mode_signature(args)
    cp = _load_checkpoint(checkpoint_path)
    if cp and cp.get("mode_signature") == mode_signature:
        resume_from = 0
        last_key = str(cp.get("last_key", "") or "")
        if last_key:
            key_to_idx = {_job_key(job): i for i, job in enumerate(jobs)}
            if last_key in key_to_idx:
                resume_from = key_to_idx[last_key] + 1
            elif last_key == "DONE":
                resume_from = total_jobs
        if resume_from == 0:
            resume_from = max(0, min(int(cp.get("processed", 0) or 0), total_jobs))
        if resume_from > 0:
            _log(
                f"Resume checkpoint: skipping first {resume_from}/{total_jobs} URL(s) "
                f"(last={cp.get('last_key', '')})"
            )
            jobs = jobs[resume_from:]
    else:
        resume_from = 0
        if cp:
            _log("Checkpoint mode/options mismatch; starting from beginning of this queue.")

    if not jobs:
        _log("No URLs to process (nothing missing or already past checkpoint).")
        cur.close()
        conn.close()
        return 0

    if args.force_all_urls:
        _log("Mode: all distinct URLs for selected companies (--force-all-urls).")
    else:
        _log("Mode: URLs with at least one listing_id missing listing_amenities rows.")
    _log(f"RUNNING pid={os.getpid()}  amenity_table={q_amenity}")
    _log(
        f"URLs queued: {len(jobs)} remaining / {total_jobs} total  listing_ids cover all units per URL  "
        f"workers={args.workers}  http=({args.connect_timeout_s}s,{args.timeout_s}s)"
    )

    parsed_ok = int(cp.get("parsed_ok", 0)) if (cp and cp.get("mode_signature") == mode_signature) else 0
    parsed_none = int(cp.get("parsed_none", 0)) if (cp and cp.get("mode_signature") == mode_signature) else 0
    processed = resume_from

    write_q: queue.Queue[list[tuple[str, str, str, str, str]] | None] | None = None
    writer_thread: threading.Thread | None = None
    if not args.dry_run and len(jobs) > 0:
        write_q = queue.Queue()
        writer_thread = threading.Thread(
            target=_db_writer_main,
            args=(write_q, db_url, upsert_sql, max(50, args.db_upsert_batch)),
            name="listing-amenities-upsert-writer",
            daemon=False,
        )
        writer_thread.start()

    progress_state: dict[str, Any] = {
        "processed": processed,
        "parsed_ok": parsed_ok,
        "parsed_none": parsed_none,
        "t0": time.monotonic(),
    }
    stop_heartbeat = threading.Event()
    hb_thread: threading.Thread | None = None
    if args.heartbeat_sec > 0 and total_jobs > 0:
        hb_thread = threading.Thread(
            target=_heartbeat_loop,
            args=(stop_heartbeat, progress_state, total_jobs, float(args.heartbeat_sec)),
            name="amenity-scrape-heartbeat",
            daemon=True,
        )
        hb_thread.start()

    def checkpoint_now(job: UrlJob) -> None:
        _save_checkpoint(
            checkpoint_path, mode_signature, processed, parsed_ok, parsed_none, _job_key(job)
        )

    t_start = time.monotonic()
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        fut_map = {
            ex.submit(fetch_amenities, job, args.connect_timeout_s, args.timeout_s): job for job in jobs
        }
        _log(f"Submitted {len(fut_map)} fetch task(s); workers running…")
        pending: set = set(fut_map.keys())
        while pending:
            done, pending = wait(pending, timeout=args.pool_wait_sec, return_when=FIRST_COMPLETED)
            if not done:
                _log(
                    f"STALL no worker finished in {args.pool_wait_sec}s; in_flight={len(pending)}. "
                    "Try --workers 2."
                )
                continue
            for fut in done:
                processed += 1
                job = fut_map[fut]
                try:
                    out = fut.result()
                except Exception as exc:
                    parsed_none += 1
                    progress_state["processed"] = processed
                    progress_state["parsed_ok"] = parsed_ok
                    progress_state["parsed_none"] = parsed_none
                    url_snip = (job.listing_url[:100] + "…") if len(job.listing_url) > 100 else job.listing_url
                    _log(f"worker error  company={job.company}  url={url_snip}  err={exc!r}")
                    if processed % max(args.progress_every, 1) == 0 or processed == total_jobs:
                        _log(
                            f"progress  {processed}/{total_jobs}  ok={parsed_ok}  skip={parsed_none}  "
                            f"last={job.company}"
                        )
                    checkpoint_now(job)
                    continue

                rows_to_write: list[tuple[str, str, str, str, str]] = []
                if out is None:
                    parsed_none += 1
                else:
                    parsed_ok += 1
                    comm, apt = out[0], out[1]
                    if not args.dry_run and write_q is not None:
                        rows_to_write = _amenities_to_upsert_rows(job.listing_ids, comm, apt)
                        if rows_to_write:
                            write_q.put(rows_to_write)

                progress_state["processed"] = processed
                progress_state["parsed_ok"] = parsed_ok
                progress_state["parsed_none"] = parsed_none

                if processed % max(args.progress_every, 1) == 0 or processed == total_jobs:
                    elapsed = time.monotonic() - t_start
                    rate = processed / max(elapsed, 1e-6)
                    remaining = total_jobs - processed
                    eta = remaining / rate if rate > 0 else 0.0
                    _log(
                        f"progress  {processed}/{total_jobs}  ok={parsed_ok}  skip={parsed_none}  "
                        f"{rate:.2f} url/s  ETA≈{eta:.0f}s  n_ids={len(job.listing_ids)}  last={job.company}"
                    )
                checkpoint_now(job)

    stop_heartbeat.set()
    if hb_thread is not None:
        hb_thread.join(timeout=2.0)

    if args.dry_run:
        _log(f"Dry run done: ok={parsed_ok}  skip={parsed_none}  urls={total_jobs}")
        cur.close()
        conn.close()
        return 0

    if write_q is not None:
        write_q.put(None)
        if writer_thread is not None:
            writer_thread.join(timeout=7200)
            if writer_thread.is_alive():
                _log("DB writer join timed out after 7200s.")

    total_s = time.monotonic() - t_start
    _save_checkpoint(checkpoint_path, mode_signature, total_jobs, parsed_ok, parsed_none, "DONE")
    _log(
        f"Done: urls={processed}  ok={parsed_ok}  skip={parsed_none}  "
        f"elapsed={total_s:.1f}s  avg={processed / max(total_s, 1e-6):.2f} url/s"
    )
    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
