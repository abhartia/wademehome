"""Add per-group search preference columns.

Revision ID: 20260421_0003
Revises: 20260421_0002
Create Date: 2026-04-21
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260421_0003"
down_revision: Union[str, Sequence[str], None] = "20260421_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("groups", sa.Column("min_beds", sa.Integer(), nullable=True))
    op.add_column("groups", sa.Column("max_beds", sa.Integer(), nullable=True))
    op.add_column("groups", sa.Column("max_rent_usd", sa.Integer(), nullable=True))
    op.add_column(
        "groups",
        sa.Column(
            "preferred_cities",
            postgresql.ARRAY(sa.String(length=120)),
            nullable=True,
        ),
    )
    op.add_column(
        "groups",
        sa.Column(
            "preferred_neighborhoods",
            postgresql.ARRAY(sa.String(length=120)),
            nullable=True,
        ),
    )
    op.add_column(
        "groups",
        sa.Column(
            "dealbreakers",
            postgresql.ARRAY(sa.String(length=120)),
            nullable=True,
        ),
    )
    op.add_column(
        "groups", sa.Column("preferences_notes", sa.Text(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("groups", "preferences_notes")
    op.drop_column("groups", "dealbreakers")
    op.drop_column("groups", "preferred_neighborhoods")
    op.drop_column("groups", "preferred_cities")
    op.drop_column("groups", "max_rent_usd")
    op.drop_column("groups", "max_beds")
    op.drop_column("groups", "min_beds")
