"""Shared amenity embedding helpers for listing_amenities upsert pipelines."""

from __future__ import annotations

import os
from typing import Any, Sequence

from openai import AzureOpenAI as AzureOpenAIClient
from openai import OpenAI as OpenAIClient


def http_timeout_s() -> float:
    raw = (os.environ.get("AMENITY_EMBED_HTTP_TIMEOUT_S") or "120").strip()
    return max(10.0, float(raw))


def embedding_model_and_dimensions() -> tuple[str, int]:
    model = (os.environ.get("OPENAI_EMBEDDING_MODEL") or "text-embedding-3-small").strip()
    dimensions = int((os.environ.get("OPENAI_EMBEDDING_DIMENSIONS") or "1536").strip())
    return model, dimensions


def azure_embedding_config() -> dict[str, str]:
    return {
        "endpoint": (os.environ.get("AZURE_OPENAI_ENDPOINT") or "").strip(),
        "api_key": (os.environ.get("AZURE_OPENAI_API_KEY") or "").strip(),
        "deployment": (os.environ.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT") or "").strip(),
        "api_version": (os.environ.get("AZURE_OPENAI_API_VERSION") or "2024-12-01-preview").strip(),
    }


def embed_many(
    inputs: list[str],
    *,
    model: str,
    dimensions: int,
    azure_cfg: dict[str, str],
) -> list[list[float]]:
    timeout = http_timeout_s()
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
        raise RuntimeError(
            "OPENAI_API_KEY (or Azure OpenAI env vars) is required to embed new listing_amenities norms"
        )
    client = OpenAIClient(api_key=key, timeout=timeout)
    res = client.embeddings.create(model=model, input=inputs, dimensions=dimensions)
    return [list(d.embedding) for d in res.data]


def vec_literal(values: Sequence[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


def vector_from_db(val: object) -> list[float]:
    if isinstance(val, (list, tuple)):
        return [float(x) for x in val]
    s = str(val).strip()
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1]
    if not s.strip():
        return []
    return [float(x.strip()) for x in s.split(",")]


def fetch_norm_vectors_for_model(
    cur: Any,
    qtable_qualified: str,
    norms: list[str],
    model: str,
) -> dict[str, list[float]]:
    if not norms:
        return {}
    sql = f"""
        SELECT q.amenity_text_norm, la.amenity_embedding::text AS emb
        FROM unnest(%s::text[]) AS q(amenity_text_norm)
        INNER JOIN LATERAL (
          SELECT amenity_embedding
          FROM {qtable_qualified} la
          WHERE la.amenity_text_norm = q.amenity_text_norm
            AND la.amenity_embedding IS NOT NULL
            AND la.amenity_embedding_model = %s
          ORDER BY la.id
          LIMIT 1
        ) la ON TRUE
        """
    cur.execute(sql, (norms, model))
    out: dict[str, list[float]] = {}
    for norm, emb_txt in cur.fetchall():
        out[str(norm)] = vector_from_db(emb_txt)
    return out


def materialize_upsert_rows_with_embeddings(
    cur: Any,
    qtable_qualified: str,
    base_rows: list[tuple[str, str, str, str, str]],
) -> list[tuple[str, str, str, str, str, str, str]]:
    """Turn (listing_id, raw, norm, source_field, hash) rows into upsert tuples including vectors.

    Vectors come from Postgres (same model) first, then the embedding API for novel norms.
    Returns tuples: listing_id, raw, norm, source_field, hash, vec_literal, model.
    """
    if not base_rows:
        return []
    model, dimensions = embedding_model_and_dimensions()
    azure_cfg = azure_embedding_config()
    unique_norms = list(dict.fromkeys(str(r[2]) for r in base_rows))
    norm_to_vec = fetch_norm_vectors_for_model(cur, qtable_qualified, unique_norms, model)
    api_norms = [n for n in unique_norms if n not in norm_to_vec]
    if api_norms:
        new_vecs = embed_many(
            api_norms,
            model=model,
            dimensions=dimensions,
            azure_cfg=azure_cfg,
        )
        for n, emb in zip(api_norms, new_vecs):
            norm_to_vec[n] = emb
    out: list[tuple[str, str, str, str, str, str, str]] = []
    for lid, raw, norm, src, h in base_rows:
        vec = norm_to_vec.get(str(norm))
        if vec is None:
            raise RuntimeError(
                f"Internal error: no embedding for norm {norm!r} after DB+API resolution"
            )
        out.append((lid, raw, norm, src, h, vec_literal(vec), model))
    return out
