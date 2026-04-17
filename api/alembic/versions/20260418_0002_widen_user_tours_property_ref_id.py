"""Widen user_tours.property_ref_id from VARCHAR(128) to VARCHAR(255).

Revision ID: 20260418_0002
Revises: 20260418_0001
Create Date: 2026-04-18

property_ref_id stores the property_key from listings/user_listings, which is
slugified `name + address + lat + lng`. PropertyFavorites.property_key is
already 255; UserTours was the outlier at 128 and started rejecting inserts
for user-added listings whose generated key spilled past 128 chars.
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260418_0002"
down_revision: Union[str, Sequence[str], None] = "20260418_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "user_tours",
        "property_ref_id",
        existing_type=sa.String(length=128),
        type_=sa.String(length=255),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "user_tours",
        "property_ref_id",
        existing_type=sa.String(length=255),
        type_=sa.String(length=128),
        existing_nullable=True,
    )
