"""index for amenity norm embedding cache lookups in backfill

Revision ID: 20260329_0023
Revises: 20260329_0022
Create Date: 2026-03-29 15:00:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260329_0023"
down_revision: Union[str, Sequence[str], None] = "20260329_0022"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            CREATE INDEX IF NOT EXISTS ix_listing_amenities_norm_model_embedded
            ON listing_amenities (amenity_text_norm, amenity_embedding_model, id)
            WHERE amenity_embedding IS NOT NULL
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS ix_listing_amenities_norm_model_embedded"))
