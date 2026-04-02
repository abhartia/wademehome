"""require amenity_embedding on listing_amenities

Revision ID: 20260402_0028
Revises: 20260402_0027
Create Date: 2026-04-02

Prerequisite (or upgrade will abort):

1. PYTHONUNBUFFERED=1 ./api/.venv/bin/python scripts/propagate_listing_amenity_embeddings_by_norm.py --skip-count
2. PYTHONUNBUFFERED=1 ./api/.venv/bin/python scripts/backfill_listing_amenity_embeddings.py --until-empty

Rows with NULL amenity_embedding and no usable amenity_text_norm are deleted (cannot be embedded).

Ongoing inserts/updates use ``scripts/listing_amenities_upsert.py`` with vectors resolved in
``scripts/backfill_listing_amenities.py`` / ``scripts/sync_listing_amenities.py`` (Postgres donor
+ embedding API for novel norms), so new rows stay compatible with NOT NULL.
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260402_0028"
down_revision: Union[str, Sequence[str], None] = "20260402_0027"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_exists() -> bool:
    conn = op.get_bind()
    return bool(
        conn.execute(
            sa.text(
                """
                SELECT EXISTS (
                  SELECT 1
                  FROM information_schema.tables
                  WHERE table_schema = 'public'
                    AND table_name = 'listing_amenities'
                )
                """
            )
        ).scalar()
    )


def upgrade() -> None:
    if not _table_exists():
        return

    op.execute(
        sa.text(
            """
            DELETE FROM listing_amenities
            WHERE amenity_embedding IS NULL
              AND (
                amenity_text_norm IS NULL
                OR LENGTH(BTRIM(amenity_text_norm)) = 0
              )
            """
        )
    )

    conn = op.get_bind()
    null_count = conn.execute(
        sa.text(
            """
            SELECT COUNT(*) FROM listing_amenities
            WHERE amenity_embedding IS NULL
            """
        )
    ).scalar()

    if null_count and int(null_count) > 0:
        raise RuntimeError(
            f"listing_amenities still has {int(null_count)} row(s) with NULL amenity_embedding. "
            "From repo root, run: "
            "PYTHONUNBUFFERED=1 ./api/.venv/bin/python scripts/propagate_listing_amenity_embeddings_by_norm.py --skip-count && "
            "PYTHONUNBUFFERED=1 ./api/.venv/bin/python scripts/backfill_listing_amenity_embeddings.py --until-empty "
            "— then re-run alembic upgrade."
        )

    op.execute(
        sa.text(
            """
            ALTER TABLE listing_amenities
            ALTER COLUMN amenity_embedding SET NOT NULL
            """
        )
    )


def downgrade() -> None:
    if not _table_exists():
        return
    op.execute(
        sa.text(
            """
            ALTER TABLE listing_amenities
            ALTER COLUMN amenity_embedding DROP NOT NULL
            """
        )
    )
