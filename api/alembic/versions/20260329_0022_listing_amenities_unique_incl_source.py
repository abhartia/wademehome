"""listing_amenities unique per source column (community vs apartment)

Revision ID: 20260329_0022
Revises: 20260329_0021
Create Date: 2026-03-29 14:00:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260329_0022"
down_revision: Union[str, Sequence[str], None] = "20260329_0021"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE listing_amenities
            SET source_field = 'legacy'
            WHERE source_field IS NULL OR BTRIM(source_field) = ''
            """
        )
    )
    op.execute(sa.text("ALTER TABLE listing_amenities ALTER COLUMN source_field SET NOT NULL"))
    op.execute(sa.text("DROP INDEX IF EXISTS uq_listing_amenities_listing_norm"))
    op.execute(
        sa.text(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS uq_listing_amenities_listing_norm_source
            ON listing_amenities (listing_id, amenity_text_norm, source_field)
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS uq_listing_amenities_listing_norm_source"))
    op.execute(
        sa.text(
            """
            DELETE FROM listing_amenities la
            WHERE EXISTS (
              SELECT 1 FROM listing_amenities lb
              WHERE lb.listing_id = la.listing_id
                AND lb.amenity_text_norm = la.amenity_text_norm
                AND lb.id < la.id
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
    op.execute(sa.text("ALTER TABLE listing_amenities ALTER COLUMN source_field DROP NOT NULL"))
