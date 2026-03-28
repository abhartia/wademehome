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


def _embed_many(
    inputs: list[str],
    *,
    model: str,
    dimensions: int,
    azure_cfg: dict[str, str],
) -> list[list[float]]:
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


def _sql_quote(val: str) -> str:
    return "'" + val.replace("'", "''") + "'"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Backfill embeddings for listing_amenities rows"
    )
    parser.add_argument("--env-file", type=Path, default=ENV_FILE)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--max-rows", type=int, default=100000)
    args = parser.parse_args()

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

    engine = create_engine(database_url, future=True)
    done = 0
    while done < args.max_rows:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id, amenity_text_norm
                    FROM listing_amenities
                    WHERE amenity_text_norm IS NOT NULL
                      AND LENGTH(TRIM(amenity_text_norm)) > 0
                      AND (
                        amenity_embedding IS NULL
                        OR amenity_embedding_model IS DISTINCT FROM :model
                      )
                    ORDER BY id
                    LIMIT :n
                    """
                ),
                {"n": min(args.batch_size, args.max_rows - done), "model": model},
            ).all()
        if not rows:
            break

        ids = [int(r[0]) for r in rows]
        docs = [str(r[1]) for r in rows]
        embeddings = _embed_many(docs, model=model, dimensions=dimensions, azure_cfg=azure_cfg)

        with engine.begin() as conn:
            values_sql = ", ".join(
                f"({rid}, {_sql_quote(_vec_literal(emb))})"
                for rid, emb in zip(ids, embeddings)
            )
            conn.execute(
                text(
                    f"""
                    UPDATE listing_amenities la
                    SET
                      amenity_embedding = CAST(v.embedding AS vector),
                      amenity_embedding_model = :model,
                      amenity_embedding_updated_at = NOW()
                    FROM (VALUES {values_sql}) AS v(id, embedding)
                    WHERE la.id = v.id
                    """
                ),
                {"model": model},
            )
        done += len(rows)
        print(f"embedded amenity rows: {done}", flush=True)

    print(f"completed amenity embedding backfill: {done} rows", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
