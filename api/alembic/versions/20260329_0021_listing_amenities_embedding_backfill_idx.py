"""partial index for listing_amenities embedding backfill scans

Revision ID: 20260329_0021
Revises: 20260328_0020
Create Date: 2026-03-29 12:00:00.000000
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260329_0021"
down_revision: Union[str, Sequence[str], None] = "20260328_0020"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            CREATE INDEX IF NOT EXISTS ix_listing_amenities_id_null_embedding
            ON listing_amenities (id)
            WHERE amenity_embedding IS NULL
            """
        )
    )


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS ix_listing_amenities_id_null_embedding"))
