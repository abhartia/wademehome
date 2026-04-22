"""Add min_rent_usd to groups for price-range preferences.

Revision ID: 20260422_0001
Revises: 20260421_0003
Create Date: 2026-04-22
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260422_0001"
down_revision: Union[str, Sequence[str], None] = "20260421_0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "groups", sa.Column("min_rent_usd", sa.Integer(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("groups", "min_rent_usd")
