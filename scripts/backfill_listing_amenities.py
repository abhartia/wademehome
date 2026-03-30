#!/usr/bin/env python3
"""
Backfill ``listings.community_amenities`` / ``listings.apartment_amenities`` from vendor pages.

Source-only: updates run only when the expected HTML/JSON structure parses successfully.
On parse failure, the row is left unchanged (no overwrite with ``[]``).

Logging: every line is UTC-timestamped and ``flush``-ed. Use ``--progress-every`` (default 10)
and ``--heartbeat-sec`` (default 30; 0 disables). The main thread uses ``wait(..., timeout=pool-wait-sec)``
so if no worker finishes in time you get a **STALL** line (threads may still be stuck in vendor I/O).
HTTP uses separate connect vs read timeouts. Database writes run on a **dedicated thread** with its own
connection so slow ``UPDATE``/``COMMIT`` cannot freeze the HTTP progress loop. When redirecting output, use ``PYTHONUNBUFFERED=1 python -u …``.
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
from datetime import datetime, timezone
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


def _now_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _log(msg: str) -> None:
    print(f"{_now_utc()}  {msg}", flush=True)


def _job_key(job: "UrlJob") -> str:
    return f"{job.company}|{job.listing_url}"


def _build_mode_signature(args: argparse.Namespace) -> str:
    raw = f"company={args.company}|force={args.force_all_urls}|max={args.max_urls}"
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


def _db_writer_main(
    q: "queue.Queue[list[tuple[str, str, str, str]] | None]",
    db_url: str,
    qtable: str,
    batch_commit_every: int,
    db_chunk: int,
) -> None:
    """Own connection + cursor; UPDATEs never block the HTTP wait loop."""
    wconn = psycopg2.connect(db_url)
    wcur = wconn.cursor()
    wcur.execute("SET statement_timeout = '120s'")
    wcur.execute("SET lock_timeout = '30s'")
    wconn.commit()

    def flush_rows(rows: list[tuple[str, str, str, str]]) -> None:
        if not rows:
            return
        n_batch = len(rows)
        _log(f"DB flush start: {n_batch} URL(s) in batch (writer thread)")
        rows_touched = 0
        chunk_idx = 0
        while rows:
            chunk = rows[:db_chunk]
            del rows[:db_chunk]
            chunk_idx += 1
            _log(f"DB chunk {chunk_idx}: applying {len(chunk)} UPDATE(s)…")
            for company, listing_url, cj, aj in chunk:
                wcur.execute(
                    f"UPDATE {qtable} SET community_amenities = %s, apartment_amenities = %s "
                    f"WHERE company = %s AND listing_url = %s",
                    (cj, aj, company, listing_url),
                )
                rows_touched += wcur.rowcount if wcur.rowcount is not None else 0
            _log(f"DB chunk {chunk_idx}: commit ({len(chunk)} URL(s))…")
            wconn.commit()
        _log(f"DB flush done: {n_batch} URL(s) total, {rows_touched} listing row(s) updated")

    buf: list[tuple[str, str, str, str]] = []
    while True:
        item = q.get()
        if item is None:
            if buf:
                flush_rows(buf)
                buf.clear()
            break
        buf.extend(item)
        while len(buf) >= batch_commit_every:
            flush_rows(buf[:batch_commit_every])
            del buf[:batch_commit_every]

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
            f"heartbeat  completed={processed}/{total}  ok={parsed_ok}  skip={parsed_none}  "
            f"{rate:.2f} url/s  elapsed={elapsed:.0f}s  ETA≈{eta_s:.0f}s"
        )


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


def _http_timeout(connect_s: int, read_s: int) -> tuple[int, int]:
    """(connect, read) tuple so TLS/connect cannot hang unbounded."""
    return (max(5, int(connect_s)), max(10, int(read_s)))


def fetch_amenities(job: UrlJob, connect_timeout_s: int, read_timeout_s: int) -> tuple[list[str], list[str]] | None:
    """Return (community, apartment) name lists or None if skipped / failed parse."""
    to = _http_timeout(connect_timeout_s, read_timeout_s)
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Parse only; do not update DB.")
    parser.add_argument("--company", default=None, help="Restrict to one company (RentCafe, RealPage, Entrata).")
    parser.add_argument("--max-urls", type=int, default=None, help="Cap distinct URLs processed.")
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Fetch concurrency (default 4; raise if vendor is slow, lower if you see STALL spam).",
    )
    parser.add_argument(
        "--timeout-s",
        type=int,
        default=45,
        help="HTTP read timeout per request (connect uses --connect-timeout-s).",
    )
    parser.add_argument(
        "--connect-timeout-s",
        type=int,
        default=15,
        metavar="SEC",
        help="Max seconds to establish TCP/TLS (default 15).",
    )
    parser.add_argument(
        "--pool-wait-sec",
        type=int,
        default=120,
        metavar="SEC",
        help="Max seconds to wait for any worker to finish before logging STALL (default 120).",
    )
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
    parser.add_argument(
        "--progress-every",
        type=int,
        default=10,
        metavar="N",
        help="Log a progress line every N completed URLs (default: 10).",
    )
    parser.add_argument(
        "--heartbeat-sec",
        type=int,
        default=30,
        metavar="SEC",
        help="Print a heartbeat with rate/ETA every SEC seconds while workers run (0=off).",
    )
    parser.add_argument(
        "--checkpoint-file",
        default=str(REPO_ROOT / "scripts" / ".amenity_backfill.checkpoint.json"),
        help="Checkpoint file used to resume mid-run after crashes/restarts.",
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
    # Avoid indefinite hangs on COMMIT (locks / slow remote DB) — heartbeats would keep running otherwise.
    cur.execute("SET statement_timeout = '120s'")
    cur.execute("SET lock_timeout = '30s'")
    conn.commit()

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
                r = cf.get(
                    listing_url.strip(),
                    timeout=_http_timeout(15, args.timeout_s),
                    allow_redirects=True,
                )
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
    sql += " ORDER BY company, listing_url"

    if args.max_urls is not None:
        sql += " LIMIT %s"
        params.append(args.max_urls)

    cur.execute(sql, params if params else None)
    jobs_rows = cur.fetchall()
    jobs: list[UrlJob] = [UrlJob(company=r[0], listing_url=r[1], property_id=r[2]) for r in jobs_rows]

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
                f"Resume checkpoint found: skipping first {resume_from}/{total_jobs} URL(s) "
                f"(last={cp.get('last_key', '')})"
            )
            jobs = jobs[resume_from:]
    else:
        resume_from = 0
        if cp:
            _log("Checkpoint exists but mode/options changed; starting from beginning of this queue.")

    if args.force_all_urls:
        _log("Mode: processing every distinct listing_url (--force-all-urls).")
    else:
        _log(
            "Mode: only listing_urls where some row still has empty community and/or apartment amenities."
        )
    _log(
        f"Distinct URLs queued: {len(jobs)} remaining / {total_jobs} total  workers={args.workers}  "
        f"http=({args.connect_timeout_s}s connect, {args.timeout_s}s read)  "
        f"pool_wait={args.pool_wait_sec}s"
    )
    _log("Tip: use `PYTHONUNBUFFERED=1 python -u scripts/backfill_listing_amenities.py …` when piping to a file.")

    processed = resume_from
    parsed_ok = int(cp.get("parsed_ok", 0)) if (cp and cp.get("mode_signature") == mode_signature) else 0
    parsed_none = int(cp.get("parsed_none", 0)) if (cp and cp.get("mode_signature") == mode_signature) else 0

    batch: list[tuple[str, str, str, str]] = []
    batch_commit_every = 100
    db_chunk = 25  # smaller transactions: less lock time, clearer logs if a chunk hangs

    write_q: queue.Queue[list[tuple[str, str, str, str]] | None] | None = None
    writer_thread: threading.Thread | None = None
    if not args.dry_run and len(jobs) > 0:
        write_q = queue.Queue()
        writer_thread = threading.Thread(
            target=_db_writer_main,
            args=(write_q, db_url, qtable, batch_commit_every, db_chunk),
            name="amenity-db-writer",
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
            name="amenity-backfill-heartbeat",
            daemon=True,
        )
        hb_thread.start()

    t_start = time.monotonic()
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        fut_map = {
            ex.submit(fetch_amenities, job, args.connect_timeout_s, args.timeout_s): job for job in jobs
        }
        _log(f"All {len(fut_map)} fetch tasks submitted; workers are running…")
        pending: set = set(fut_map.keys())
        while pending:
            done, pending = wait(pending, timeout=args.pool_wait_sec, return_when=FIRST_COMPLETED)
            if not done:
                _log(
                    f"STALL no worker finished in {args.pool_wait_sec}s; "
                    f"in_flight={len(pending)} (vendor or TLS hang). "
                    "If this repeats, interrupt and rerun with --workers 2."
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
                        elapsed = time.monotonic() - t_start
                        rate = processed / max(elapsed, 1e-6)
                        _log(
                            f"progress  {processed}/{total_jobs}  ok={parsed_ok}  skip={parsed_none}  "
                            f"{rate:.2f} url/s"
                        )
                    if processed % max(args.progress_every, 1) == 0 or processed == total_jobs:
                        _save_checkpoint(
                            checkpoint_path, mode_signature, processed, parsed_ok, parsed_none, _job_key(job)
                        )
                    continue

                if out is None:
                    parsed_none += 1
                else:
                    parsed_ok += 1
                    cj, aj = json.dumps(out[0]), json.dumps(out[1])
                    if not args.dry_run:
                        batch.append((job.company, job.listing_url, cj, aj))

                progress_state["processed"] = processed
                progress_state["parsed_ok"] = parsed_ok
                progress_state["parsed_none"] = parsed_none

                if write_q is not None and len(batch) >= batch_commit_every:
                    write_q.put(list(batch))
                    batch.clear()

                if processed % max(args.progress_every, 1) == 0 or processed == total_jobs:
                    elapsed = time.monotonic() - t_start
                    rate = processed / max(elapsed, 1e-6)
                    remaining = total_jobs - processed
                    eta = remaining / rate if rate > 0 else 0.0
                    _log(
                        f"progress  {processed}/{total_jobs}  ok={parsed_ok}  skip={parsed_none}  "
                        f"{rate:.2f} url/s  ETA≈{eta:.0f}s  last={job.company}"
                    )
                    _save_checkpoint(
                        checkpoint_path, mode_signature, processed, parsed_ok, parsed_none, _job_key(job)
                    )

    stop_heartbeat.set()
    if hb_thread is not None:
        hb_thread.join(timeout=2.0)

    if args.dry_run:
        _log(f"Dry run finished: parsed_ok={parsed_ok}  skip={parsed_none}  total={total_jobs}")
        cur.close()
        conn.close()
        return 0

    if write_q is not None:
        if batch:
            write_q.put(list(batch))
            batch.clear()
        write_q.put(None)
        if writer_thread is not None:
            writer_thread.join(timeout=7200)
            if writer_thread.is_alive():
                _log("DB writer join timed out after 7200s (writer thread may still be running).")

    total_s = time.monotonic() - t_start
    _save_checkpoint(checkpoint_path, mode_signature, total_jobs, parsed_ok, parsed_none, "DONE")
    _log(
        f"Done: processed={processed}  ok={parsed_ok}  skip={parsed_none}  "
        f"elapsed={total_s:.1f}s  avg={processed / max(total_s, 1e-6):.2f} url/s"
    )
    cur.close()
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
