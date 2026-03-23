"""landlord constraint and index hardening

Revision ID: 20260323_0017
Revises: 20260323_0016
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260323_0017"
down_revision: Union[str, Sequence[str], None] = "20260323_0016"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_landlord_tour_bookings_one_active_per_slot",
        "landlord_tour_bookings",
        ["slot_id"],
        unique=True,
        postgresql_where=sa.text("status IN ('requested', 'confirmed')"),
    )


def downgrade() -> None:
    op.drop_index(
        "ix_landlord_tour_bookings_one_active_per_slot",
        table_name="landlord_tour_bookings",
    )
