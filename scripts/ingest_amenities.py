"""
Fast amenity ingestion script that pre-caches embeddings to avoid per-batch DB lookups.

Usage:
  python scripts/ingest_amenities.py --company RentCafe --max-urls 1000
  python scripts/ingest_amenities.py --company Corcoran --max-urls 100
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

# Add repo root to path
_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

import listing_amenities_parsers as lap

ENV_FILE = _ROOT / "api" / ".env"
load_dotenv(ENV_FILE, override=True)

_PUNCT_SPACE_RE = re.compile(r"[^\w\s]", re.U)
_WHITESPACE_RE = re.compile(r"\s+")


def normalize_amenity_text(value: str) -> str:
    t = value.strip().lower()
    t = _PUNCT_SPACE_RE.sub(" ", t)
    t = _WHITESPACE_RE.sub(" ", t).strip()
    return t


def source_hash(source_field: str, raw: str, norm: str) -> str:
    payload = f"{source_field}\x1f{raw}\x1f{norm}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def get_connection():
    return psycopg2.connect(
        host='wademehome-pg.postgres.database.azure.com',
        port=5432,
        user='postgres',
        password='BYVT&A*YBU(Na',
        dbname='postgres',
        sslmode='require',
        connect_timeout=30,
        options='-c statement_timeout=300000',  # 5 minute statement timeout
    )


def pre_cache_embeddings(conn, norms_needed: list[str] | None = None) -> tuple[dict[str, str], str | None]:
    """Load embeddings for specific norms (or a sample if not specified)."""
    cur = conn.cursor()
    model = None

    # Get the model name from a single row
    cur.execute("SELECT amenity_embedding_model FROM listing_amenities WHERE amenity_embedding IS NOT NULL LIMIT 1")
    row = cur.fetchone()
    if row:
        model = row[0]

    if not norms_needed:
        print("No norms to pre-cache.", flush=True)
        return {}, model

    # Query only the norms we need, in small batches with simple query
    cache = {}
    batch_size = 50
    print(f"Pre-caching embeddings for {len(norms_needed)} norms...", flush=True)
    for i in range(0, len(norms_needed), batch_size):
        batch = norms_needed[i:i + batch_size]
        # Use a simpler query: just grab one embedding per norm without DISTINCT ON
        for norm in batch:
            if norm in cache:
                continue
            try:
                cur.execute("""
                    SELECT amenity_embedding::text
                    FROM listing_amenities
                    WHERE amenity_text_norm = %s
                      AND amenity_embedding IS NOT NULL
                    LIMIT 1
                """, (norm,))
                row = cur.fetchone()
                if row:
                    cache[norm] = row[0]
            except Exception:
                conn.rollback()
        if (i // batch_size) % 5 == 0 and i > 0:
            print(f"  Cached {len(cache)}/{len(norms_needed)}...", flush=True)

    cur.close()
    print(f"  Cached {len(cache):,} embeddings from DB (model={model})", flush=True)
    return cache, model


def embed_via_openai(texts: list[str], model: str = None, dimensions: int = 1536) -> list[list[float]]:
    """Call OpenAI embedding API for novel norms."""
    from openai import OpenAI
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    model = model or os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    dimensions = int(os.environ.get("OPENAI_EMBEDDING_DIMENSIONS", dimensions))

    all_embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        resp = client.embeddings.create(input=batch, model=model, dimensions=dimensions)
        for item in resp.data:
            all_embeddings.append(item.embedding)
    return all_embeddings


def fetch_amenities_for_url(company: str, listing_url: str, timeout: int = 45) -> tuple[list[str], list[str]] | None:
    """Fetch amenities from a vendor page."""
    import cloudscraper
    import requests as req

    use_cf = company in {"RentCafe", "RealPage", "Greystar", "AppFolio"}
    session = cloudscraper.create_scraper() if use_cf else req.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    })

    try:
        if company == "RentCafe":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            return lap.parse_rentcafe_amenities(resp.text)

        if company == "Corcoran":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            return lap.parse_corcoran_amenities(resp.text)

        if company == "Greystar":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            return lap.parse_greystar_amenities_from_html(resp.text)

        if company == "AppFolio":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            return lap.parse_appfolio_listing_detail_amenities_html(resp.text)

        if company == "RealPage":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            am_url = lap.securecafe_amenities_url(listing_url)
            ar = session.get(am_url, timeout=timeout, headers={"Referer": listing_url})
            if ar.status_code == 200:
                return lap.parse_securecafe_amenities_html(ar.text)
            return None

        if company == "Entrata":
            resp = session.get(listing_url, timeout=timeout, allow_redirects=True)
            if resp.status_code != 200:
                return None
            am_url = lap.entrata_amenities_url(listing_url)
            ar = session.get(am_url, timeout=timeout, headers={"Referer": listing_url})
            if ar.status_code == 200:
                return lap.parse_entrata_jonah_amenities_html(ar.text)
            return None

    except Exception:
        return None
    return None


def main():
    parser = argparse.ArgumentParser(description="Fast amenity ingestion with pre-cached embeddings")
    parser.add_argument("--company", required=True)
    parser.add_argument("--max-urls", type=int, default=500)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--batch-size", type=int, default=200, help="DB insert batch size")
    args = parser.parse_args()

    conn = get_connection()
    cur = conn.cursor()

    # Find listings needing amenities (do this BEFORE caching)
    print(f"Finding {args.company} listings without amenities...", flush=True)
    cur.execute("""
        SELECT DISTINCT l.listing_url, array_agg(l.listing_id)
        FROM listings l
        LEFT JOIN listing_amenities la ON l.listing_id = la.listing_id
        WHERE l.company = %s
          AND la.listing_id IS NULL
          AND l.listing_url IS NOT NULL
          AND l.listing_url != ''
        GROUP BY l.listing_url
        ORDER BY l.listing_url
        LIMIT %s
    """, (args.company, args.max_urls))
    url_jobs = cur.fetchall()
    print(f"  Found {len(url_jobs)} URLs to process", flush=True)

    if not url_jobs:
        print("Nothing to do.", flush=True)
        conn.close()
        return

    # Fetch amenities in parallel
    print(f"Fetching amenities from {len(url_jobs)} URLs ({args.workers} workers)...", flush=True)
    all_rows = []  # (listing_id, raw, norm, source_field, hash)
    ok = skip = err = 0

    def fetch_one(url, listing_ids):
        result = fetch_amenities_for_url(args.company, url)
        return url, listing_ids, result

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(fetch_one, url, lids): url for url, lids in url_jobs}
        for i, future in enumerate(as_completed(futures), 1):
            url, listing_ids, result = future.result()
            if result is None:
                skip += 1
            else:
                community, apartment = result
                if not community and not apartment:
                    skip += 1
                    continue
                ok += 1
                for lid in listing_ids:
                    for text in community:
                        norm = normalize_amenity_text(text)
                        if norm:
                            h = source_hash("community", text.strip(), norm)
                            all_rows.append((lid, text.strip(), norm, "community", h))
                    for text in apartment:
                        norm = normalize_amenity_text(text)
                        if norm:
                            h = source_hash("apartment", text.strip(), norm)
                            all_rows.append((lid, text.strip(), norm, "apartment", h))

            if i % 50 == 0:
                print(f"  {i}/{len(url_jobs)}: ok={ok} skip={skip} rows={len(all_rows)}", flush=True)

    print(f"Fetch done: ok={ok} skip={skip} total_rows={len(all_rows)}", flush=True)

    if not all_rows:
        print("No amenity rows to insert.", flush=True)
        conn.close()
        return

    # Now cache embeddings for only the norms we collected
    unique_norms = list(dict.fromkeys(r[2] for r in all_rows))
    embedding_cache, cached_model = pre_cache_embeddings(conn, norms_needed=unique_norms)
    model = cached_model or os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

    novel_norms = [n for n in unique_norms if n not in embedding_cache]
    print(f"Embedding: {len(unique_norms)} unique norms, {len(unique_norms) - len(novel_norms)} cached, {len(novel_norms)} need API", flush=True)

    if novel_norms:
        print(f"  Calling OpenAI API for {len(novel_norms)} novel norms...", flush=True)
        try:
            new_vecs = embed_via_openai(novel_norms, model=model)
            for n, vec in zip(novel_norms, new_vecs):
                embedding_cache[n] = "[" + ",".join(str(x) for x in vec) + "]"
            print(f"  Got {len(new_vecs)} embeddings from API", flush=True)
        except Exception as exc:
            print(f"  OpenAI API error: {exc}", flush=True)
            print("  Cannot insert without embeddings (NOT NULL constraint). Aborting.", flush=True)
            conn.close()
            return

    # Insert in batches
    print(f"Inserting {len(all_rows)} amenity rows in batches of {args.batch_size}...", flush=True)
    insert_sql = """
        INSERT INTO listing_amenities (
            listing_id, amenity_text_raw, amenity_text_norm, source_field,
            amenity_embedding_source_hash, amenity_embedding, amenity_embedding_model,
            amenity_embedding_updated_at, updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s::vector, %s, NOW(), NOW())
        ON CONFLICT (listing_id, amenity_text_norm, source_field)
        DO UPDATE SET
            amenity_text_raw = EXCLUDED.amenity_text_raw,
            amenity_embedding_source_hash = EXCLUDED.amenity_embedding_source_hash,
            amenity_embedding = EXCLUDED.amenity_embedding,
            amenity_embedding_model = EXCLUDED.amenity_embedding_model,
            amenity_embedding_updated_at = EXCLUDED.amenity_embedding_updated_at,
            updated_at = EXCLUDED.updated_at
    """

    inserted = 0
    for i in range(0, len(all_rows), args.batch_size):
        batch = all_rows[i:i + args.batch_size]
        values = []
        for lid, raw, norm, sf, h in batch:
            emb = embedding_cache.get(norm)
            if emb is None:
                continue  # Skip rows without embeddings
            values.append((lid, raw, norm, sf, h, emb, model))

        if values:
            try:
                cur.executemany(insert_sql, values)
                conn.commit()
                inserted += len(values)
                print(f"  Batch {i // args.batch_size + 1}: inserted {len(values)} (total {inserted}/{len(all_rows)})", flush=True)
            except Exception as exc:
                conn.rollback()
                print(f"  Batch failed: {exc}", flush=True)
                # Try one-by-one for this batch
                for v in values:
                    try:
                        cur.execute(insert_sql, v)
                        conn.commit()
                        inserted += 1
                    except Exception:
                        conn.rollback()

    cur.close()
    conn.close()
    print(f"Done! Inserted {inserted} amenity rows for {ok} URLs.", flush=True)


if __name__ == "__main__":
    main()
