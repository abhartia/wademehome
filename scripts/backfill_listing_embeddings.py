#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import AzureOpenAI as AzureOpenAIClient
from openai import OpenAI as OpenAIClient
from sqlalchemy import create_engine, text


REPO_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = REPO_ROOT / "api" / ".env"


def _qtable(schema: str | None, table: str) -> str:
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _embed_many(inputs: list[str], *, model: str, dimensions: int, azure_cfg: dict[str, str]) -> list[list[float]]:
    if azure_cfg["endpoint"] and azure_cfg["api_key"] and azure_cfg["deployment"]:
        client = AzureOpenAIClient(
            api_key=azure_cfg["api_key"],
            api_version=azure_cfg["api_version"],
            azure_endpoint=azure_cfg["endpoint"].rstrip("/"),
        )
        res = client.embeddings.create(model=azure_cfg["deployment"], input=inputs)
        return [list(d.embedding) for d in res.data]

    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required")
    client = OpenAIClient(api_key=key)
    res = client.embeddings.create(model=model, input=inputs, dimensions=dimensions)
    return [list(d.embedding) for d in res.data]


def _vec_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


def _table_columns(engine, schema: str, table: str) -> set[str]:
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = :schema
                  AND table_name = :table
                """
            ),
            {"schema": schema, "table": table},
        ).fetchall()
    return {str(r[0]).lower() for r in rows}


def _pick(cols: set[str], *candidates: str) -> str | None:
    for c in candidates:
        if c.lower() in cols:
            return c.lower()
    return None


def _build_doc_expr(cols: set[str]) -> str | None:
    parts: list[str] = []
    for name in (
        _pick(cols, "property_name", "building_name", "name", "title"),
        _pick(cols, "address", "street_address", "full_address", "formatted_address"),
        _pick(cols, "city", "locality"),
        _pick(cols, "state", "state_code", "region"),
        _pick(cols, "zipcode", "zip", "postal_code"),
        _pick(cols, "amenities", "community_amenities", "apartment_amenities", "building_amenities"),
        _pick(cols, "description", "summary", "about"),
    ):
        if name:
            parts.append(f'COALESCE("{name}"::text, \'\' )')

    if not parts:
        return None

    return f"NULLIF(trim(concat_ws(' ', {', '.join(parts)})), '')"


def _sql_quote(val: str) -> str:
    return "'" + val.replace("'", "''") + "'"


def main() -> int:
    parser = argparse.ArgumentParser(description="Backfill pgvector embeddings for listings.search_doc")
    parser.add_argument("--env-file", type=Path, default=ENV_FILE)
    parser.add_argument("--batch-size", type=int, default=64)
    parser.add_argument("--max-rows", type=int, default=20000)
    args = parser.parse_args()

    load_dotenv(args.env_file, override=True)
    database_url = (os.environ.get("DATABASE_URL") or "").strip()
    if not database_url:
        raise RuntimeError("DATABASE_URL missing")

    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = (os.environ.get("LISTINGS_TABLE_SCHEMA") or "").strip() or None
    qtable = _qtable(schema, table)
    model = (os.environ.get("OPENAI_EMBEDDING_MODEL") or "text-embedding-3-small").strip()
    dimensions = int((os.environ.get("OPENAI_EMBEDDING_DIMENSIONS") or "1536").strip())

    azure_cfg = {
        "endpoint": (os.environ.get("AZURE_OPENAI_ENDPOINT") or "").strip(),
        "api_key": (os.environ.get("AZURE_OPENAI_API_KEY") or "").strip(),
        "deployment": (os.environ.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT") or "").strip(),
        "api_version": (os.environ.get("AZURE_OPENAI_API_VERSION") or "2024-12-01-preview").strip(),
    }

    engine = create_engine(database_url, future=True)

    cols = _table_columns(engine, schema or "public", table)
    doc_expr = _build_doc_expr(cols)
    if doc_expr is None:
        raise RuntimeError("Could not build a text blob from listings columns for embedding backfill")
    listing_id_col = _pick(cols, "listing_id") or "listing_id"

    done = 0
    while done < args.max_rows:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    f"""
                    SELECT listing_id, {doc_expr} AS search_doc
                    FROM {qtable}
                    WHERE embedding IS NULL
                      AND {doc_expr} IS NOT NULL
                      AND LENGTH(TRIM({doc_expr})) > 0
                    LIMIT :n
                    """
                ),
                {"n": min(args.batch_size, args.max_rows - done)},
            ).all()
        if not rows:
            break

        listing_ids = [str(r[0]) for r in rows]
        # Note: the query now returns (listing_id, doc_expr as search_doc alias).
        docs = [str(r[1]) for r in rows]
        embeddings = _embed_many(docs, model=model, dimensions=dimensions, azure_cfg=azure_cfg)

        with engine.begin() as conn:
            values_sql = ", ".join(
                f"({_sql_quote(str(listing_id))}, {_sql_quote(_vec_literal(emb))})"
                for listing_id, emb in zip(listing_ids, embeddings)
            )
            update_sql = f"""
                UPDATE {qtable} AS t
                SET embedding = CAST(v.embedding AS vector)
                FROM (VALUES {values_sql}) AS v(listing_id, embedding)
                WHERE t."{listing_id_col}"::text = v.listing_id
            """
            conn.execute(text(update_sql))

        done += len(rows)
        print(f"embedded {done} rows", flush=True)

    print(f"completed embedding backfill: {done} rows", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
