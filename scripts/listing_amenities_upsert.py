"""Shared normalization, hashing, and upsert SQL for ``listing_amenities`` rows."""

from __future__ import annotations

import hashlib
import re

_WHITESPACE_RE = re.compile(r"\s+")
_PUNCT_SPACE_RE = re.compile(r"[^\w]+")


def normalize_amenity_text(value: str) -> str:
    t = value.strip().lower()
    t = _PUNCT_SPACE_RE.sub(" ", t)
    t = _WHITESPACE_RE.sub(" ", t).strip()
    return t


def source_hash(raw: str, norm: str, source_field: str) -> str:
    base = f"{source_field}\x1f{raw}\x1f{norm}"
    return hashlib.sha256(base.encode("utf-8")).hexdigest()


LISTING_AMENITIES_UPSERT_SQL = """
        INSERT INTO {qtable} (
          listing_id,
          amenity_text_raw,
          amenity_text_norm,
          source_field,
          amenity_embedding_source_hash,
          updated_at
        ) VALUES %s
        ON CONFLICT (listing_id, amenity_text_norm, source_field)
        DO UPDATE SET
          amenity_text_raw = EXCLUDED.amenity_text_raw,
          source_field = EXCLUDED.source_field,
          updated_at = EXCLUDED.updated_at,
          amenity_embedding_source_hash = EXCLUDED.amenity_embedding_source_hash,
          amenity_embedding = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding
          END,
          amenity_embedding_model = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding_model
          END,
          amenity_embedding_updated_at = CASE
            WHEN listing_amenities.amenity_embedding_source_hash IS DISTINCT FROM EXCLUDED.amenity_embedding_source_hash
              THEN NULL
            ELSE listing_amenities.amenity_embedding_updated_at
          END
        """


def upsert_sql_for_table(qtable_qualified: str) -> str:
    """``qtable_qualified`` is e.g. ``\"public\".\"listing_amenities\"`` (quoted)."""
    return LISTING_AMENITIES_UPSERT_SQL.format(qtable=qtable_qualified).strip()
