#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from openai import AzureOpenAI as AzureOpenAIClient
from openai import OpenAI as OpenAIClient


REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"


def _psycopg_dsn(database_url: str) -> str:
    u = database_url.strip()
    for prefix in ("postgresql+psycopg2://", "postgresql+asyncpg://"):
        if u.startswith(prefix):
            return "postgresql://" + u[len(prefix) :]
    return u


def _http_timeout_s() -> float:
    raw = (os.environ.get("AMENITY_EMBED_HTTP_TIMEOUT_S") or "120").strip()
    return max(10.0, float(raw))


def _embed_many(
    inputs: list[str],
    *,
    model: str,
    dimensions: int,
    azure_cfg: dict[str, str],
) -> list[list[float]]:
    timeout = _http_timeout_s()
    if azure_cfg["endpoint"] and azure_cfg["api_key"] and azure_cfg["deployment"]:
        client = AzureOpenAIClient(
            api_key=azure_cfg["api_key"],
            api_version=azure_cfg["api_version"],
            azure_endpoint=azure_cfg["endpoint"].rstrip("/"),
            timeout=timeout,
        )
        res = client.embeddings.create(model=azure_cfg["deployment"], input=inputs)
        return [list(d.embedding) for d in res.data]

    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required")
    client = OpenAIClient(api_key=key, timeout=timeout)
    res = client.embeddings.create(model=model, input=inputs, dimensions=dimensions)
    return [list(d.embedding) for d in res.data]


def _vec_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


def _vector_from_db(val: object) -> list[float]:
    if isinstance(val, (list, tuple)):
        return [float(x) for x in val]
    s = str(val).strip()
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1]
    if not s.strip():
        return []
    return [float(x.strip()) for x in s.split(",")]


def _fmt_ms(ms: float) -> str:
    if ms >= 1000:
        return f"{ms / 1000:.2f}s"
    if ms >= 100:
        return f"{ms:.0f}ms"
    if ms >= 10:
        return f"{ms:.1f}ms"
    return f"{ms:.2f}ms"


def _pct(part: float, total: float) -> str:
    if total <= 0:
        return "0%"
    return f"{100.0 * part / total:.0f}%"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Backfill embeddings for listing_amenities rows"
    )
    parser.add_argument("--env-file", type=Path, default=ENV_FILE)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--max-rows", type=int, default=100000)
    parser.add_argument(
        "--no-session-cache",
        action="store_true",
        help="Drop in-memory norm→vector map after each batch (reuse still comes from Postgres)",
    )
    parser.add_argument(
        "--no-timing",
        action="store_true",
        help="Omit per-batch timing breakdown (summary line only)",
    )
    parser.add_argument(
        "--statement-timeout-s",
        type=int,
        default=int((os.environ.get("AMENITY_EMBED_PG_STATEMENT_TIMEOUT_S") or "0").strip() or 0),
        help="PostgreSQL statement_timeout in seconds (0 = server default). Prevents endless stuck queries.",
    )
    args = parser.parse_args()

    print(
        "amenity embedding backfill: loading env, batch_size="
        f"{args.batch_size}, max_rows={args.max_rows}",
        flush=True,
    )
    print(
        "amenity embedding backfill: per-batch timing is logged by default "
        "(select · cache · prepare · api · update+commit).",
        flush=True,
    )
    print(
        "amenity embedding backfill: reruns resume automatically (only rows still missing "
        "embeddings or the current model are selected).",
        flush=True,
    )
    print(
        "amenity embedding backfill: OpenAI/Azure embedding API is called once per distinct "
        "amenity_text_norm per batch; duplicates reuse vectors from this session or Postgres.",
        flush=True,
    )
    load_dotenv(args.env_file, override=True)
    database_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL missing")

    model = (os.environ.get("OPENAI_EMBEDDING_MODEL") or "text-embedding-3-small").strip()
    dimensions = int((os.environ.get("OPENAI_EMBEDDING_DIMENSIONS") or "1536").strip())
    azure_cfg = {
        "endpoint": (os.environ.get("AZURE_OPENAI_ENDPOINT") or "").strip(),
        "api_key": (os.environ.get("AZURE_OPENAI_API_KEY") or "").strip(),
        "deployment": (os.environ.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT") or "").strip(),
        "api_version": (os.environ.get("AZURE_OPENAI_API_VERSION") or "2024-12-01-preview").strip(),
    }

    norm_cache: dict[str, list[float]] = {}
    embedded_this_run = 0
    rows_total = 0
    api_vectors = 0
    reused_vectors = 0
    prefer_null_embedding = True
    batch_num = 0
    sum_total_ms = 0.0

    dsn = _psycopg_dsn(database_url)
    print("[amenity-embed] connecting to Postgres…", flush=True)
    pg = psycopg2.connect(
        dsn,
        connect_timeout=30,
        options=(
            "-c application_name=amenity_embedding_backfill "
            + (
                f"-c statement_timeout={int(args.statement_timeout_s) * 1000}"
                if args.statement_timeout_s > 0
                else ""
            )
        ).strip(),
    )
    pg.autocommit = False
    with pg.cursor() as cur:
        cur.execute("SET lock_timeout TO '30s'")

    sel_null = """
        SELECT id, amenity_text_norm
        FROM listing_amenities
        WHERE amenity_text_norm IS NOT NULL
          AND LENGTH(TRIM(amenity_text_norm)) > 0
          AND amenity_embedding IS NULL
        ORDER BY id
        LIMIT %s
        """
    sel_remodel = """
        SELECT id, amenity_text_norm
        FROM listing_amenities
        WHERE amenity_text_norm IS NOT NULL
          AND LENGTH(TRIM(amenity_text_norm)) > 0
          AND amenity_embedding IS NOT NULL
          AND amenity_embedding_model IS DISTINCT FROM %s
        ORDER BY id
        LIMIT %s
        """
    # One index seek per distinct norm (fast on ix_listing_amenities_norm_model_embedded).
    fetch_cached_sql = """
        SELECT q.amenity_text_norm, la.amenity_embedding::text AS emb
        FROM unnest(%s::text[]) AS q(amenity_text_norm)
        INNER JOIN LATERAL (
          SELECT amenity_embedding
          FROM listing_amenities la
          WHERE la.amenity_text_norm = q.amenity_text_norm
            AND la.amenity_embedding IS NOT NULL
            AND la.amenity_embedding_model = %s
          ORDER BY la.id
          LIMIT 1
        ) la ON TRUE
        """
    update_sql = """
        UPDATE listing_amenities AS la
        SET
          amenity_embedding = u.emb::vector,
          amenity_embedding_model = %s,
          amenity_embedding_updated_at = NOW()
        FROM unnest(%s::bigint[], %s::text[]) AS u(id, emb)
        WHERE la.id = u.id
        """

    try:
        while embedded_this_run < args.max_rows:
            lim = min(args.batch_size, args.max_rows - embedded_this_run)
            t_batch = time.perf_counter()
            t_sel = t_cache = t_api = t_upd = t_prep = 0.0

            phase = "NULL-embedding rows" if prefer_null_embedding else "model-mismatch rows"
            print(
                f"[amenity-embed] fetch | phase=SELECT ({phase}) limit={lim} | "
                f"t={time.strftime('%H:%M:%S')}",
                flush=True,
            )
            t0 = time.perf_counter()
            with pg.cursor() as cur:
                if prefer_null_embedding:
                    cur.execute(sel_null, (lim,))
                    rows = cur.fetchall()
                    if not rows:
                        prefer_null_embedding = False
                        print(
                            "[amenity-embed] no NULL-embedding rows left; "
                            "switching to model-mismatch SELECT",
                            flush=True,
                        )
                        cur.execute(sel_remodel, (model, lim))
                        rows = cur.fetchall()
                else:
                    cur.execute(sel_remodel, (model, lim))
                    rows = cur.fetchall()
            t_sel = (time.perf_counter() - t0) * 1000
            pg.commit()

            if not rows:
                break

            batch_num += 1

            ids = [int(r[0]) for r in rows]
            norms = [str(r[1]) for r in rows]
            unique_norms = list(dict.fromkeys(norms))

            need_lookup = [n for n in unique_norms if n not in norm_cache]
            t0 = time.perf_counter()
            if need_lookup:
                print(
                    f"[amenity-embed] batch {batch_num} | phase=cache_lookup "
                    f"norms={len(need_lookup)} | t={time.strftime('%H:%M:%S')}",
                    flush=True,
                )
                with pg.cursor() as cur:
                    cur.execute(fetch_cached_sql, (need_lookup, model))
                    got = cur.fetchall()
                    for norm, emb_txt in got:
                        norm_cache[norm] = _vector_from_db(emb_txt)
                    print(
                        f"[amenity-embed] batch {batch_num} | phase=cache_lookup_done "
                        f"rows={len(got)} | t={time.strftime('%H:%M:%S')}",
                        flush=True,
                    )
                pg.commit()
            t_cache = (time.perf_counter() - t0) * 1000

            api_norms = [n for n in unique_norms if n not in norm_cache]
            t0 = time.perf_counter()
            if api_norms:
                print(
                    f"[amenity-embed] batch {batch_num} | phase=embedding_api "
                    f"vectors={len(api_norms)} | t={time.strftime('%H:%M:%S')}",
                    flush=True,
                )
                new_vecs = _embed_many(
                    api_norms,
                    model=model,
                    dimensions=dimensions,
                    azure_cfg=azure_cfg,
                )
                api_vectors += len(api_norms)
                for n, emb in zip(api_norms, new_vecs):
                    norm_cache[n] = emb
            t_api = (time.perf_counter() - t0) * 1000

            reused_vectors += len(unique_norms) - len(api_norms)
            t0 = time.perf_counter()
            embeddings = [norm_cache[n] for n in norms]
            emb_strs = [_vec_literal(e) for e in embeddings]
            t_prep = (time.perf_counter() - t0) * 1000

            print(
                f"[amenity-embed] batch {batch_num} | phase=update_commit "
                f"rows={len(ids)} | t={time.strftime('%H:%M:%S')}",
                flush=True,
            )
            t0 = time.perf_counter()
            with pg.cursor() as cur:
                cur.execute(update_sql, (model, ids, emb_strs))
            pg.commit()
            t_upd = (time.perf_counter() - t0) * 1000
            print(
                f"[amenity-embed] batch {batch_num} | phase=update_commit_done "
                f"({_fmt_ms(t_upd)}) | t={time.strftime('%H:%M:%S')}",
                flush=True,
            )

            embedded_this_run += len(rows)
            rows_total += len(rows)
            total_ms = (time.perf_counter() - t_batch) * 1000
            sum_total_ms += total_ms
            rps = (len(rows) / (total_ms / 1000.0)) if total_ms > 0 else 0.0

            head = (
                f"[amenity-embed] batch {batch_num} | "
                f"+{len(rows)} rows (cumulative {embedded_this_run:,}) | "
                f"{len(unique_norms)} unique norms | {len(api_norms)} API calls"
            )
            print(head, flush=True)
            if not args.no_timing:
                print(
                    "  "
                    f"timing total {_fmt_ms(total_ms)} | "
                    f"select {_fmt_ms(t_sel)} ({_pct(t_sel, total_ms)}) · "
                    f"cache {_fmt_ms(t_cache)} ({_pct(t_cache, total_ms)}) · "
                    f"prepare {_fmt_ms(t_prep)} ({_pct(t_prep, total_ms)}) · "
                    f"api {_fmt_ms(t_api)} ({_pct(t_api, total_ms)}) · "
                    f"update+commit {_fmt_ms(t_upd)} ({_pct(t_upd, total_ms)}) · "
                    f"{rps:.0f} rows/s",
                    flush=True,
                )
            if args.no_session_cache:
                norm_cache.clear()

        avg_batch_ms = (sum_total_ms / batch_num) if batch_num else 0.0
        overall_rps = (rows_total / (sum_total_ms / 1000.0)) if sum_total_ms > 0 else 0.0
        print(
            f"[amenity-embed] done: {rows_total:,} rows updated in {batch_num} batches "
            f"· {api_vectors:,} embedding API calls (distinct norms) "
            f"· {reused_vectors:,} norm cache hits (session+DB)",
            flush=True,
        )
        if not args.no_timing and batch_num:
            print(
                f"[amenity-embed] averages: {_fmt_ms(avg_batch_ms)} per batch · "
                f"{overall_rps:.0f} rows/s overall",
                flush=True,
            )
        return 0
    finally:
        pg.close()


if __name__ == "__main__":
    raise SystemExit(main())
