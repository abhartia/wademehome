"""create listing_amenities table and vector indexes

Revision ID: 20260328_0020
Revises: 20260328_0019
Create Date: 2026-03-28 12:45:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260328_0020"
down_revision: Union[str, Sequence[str], None] = "20260328_0019"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _create_table() -> None:
    op.execute(
        sa.text(
            """
            CREATE TABLE IF NOT EXISTS listing_amenities (
              id BIGSERIAL PRIMARY KEY,
              listing_id TEXT NOT NULL,
              amenity_text_raw TEXT NOT NULL,
              amenity_text_norm TEXT NOT NULL,
              source_field TEXT,
              amenity_embedding vector(1536),
              amenity_embedding_model TEXT,
              amenity_embedding_source_hash TEXT,
              amenity_embedding_updated_at TIMESTAMPTZ,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
            """
        )
    )
    op.execute(
        sa.text(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS uq_listing_amenities_listing_norm
            ON listing_amenities (listing_id, amenity_text_norm)
            """
        )
    )
    op.execute(
        sa.text(
            """
            CREATE INDEX IF NOT EXISTS ix_listing_amenities_listing_id
            ON listing_amenities (listing_id)
            """
        )
    )
    op.execute(
        sa.text(
            """
            CREATE INDEX IF NOT EXISTS ix_listing_amenities_source_hash
            ON listing_amenities (amenity_embedding_source_hash)
            """
        )
    )
    op.execute(
        sa.text(
            """
            CREATE INDEX IF NOT EXISTS ix_listing_amenities_embedding_hnsw
            ON listing_amenities
            USING hnsw (amenity_embedding vector_cosine_ops)
            """
        )
    )


def upgrade() -> None:
    _create_table()


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS ix_listing_amenities_embedding_hnsw"))
    op.execute(sa.text("DROP INDEX IF EXISTS ix_listing_amenities_source_hash"))
    op.execute(sa.text("DROP INDEX IF EXISTS ix_listing_amenities_listing_id"))
    op.execute(sa.text("DROP INDEX IF EXISTS uq_listing_amenities_listing_norm"))
    op.execute(sa.text("DROP TABLE IF EXISTS listing_amenities"))
