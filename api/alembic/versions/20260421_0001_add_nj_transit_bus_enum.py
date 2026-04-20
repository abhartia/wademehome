"""Add nj_transit_bus to transit_system enum.

Revision ID: 20260421_0001
Revises: 20260417_0007
Create Date: 2026-04-21

ALTER TYPE ... ADD VALUE can't run inside a transaction block. Alembic's
default transactional DDL handles that via the autocommit block below.
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op


revision: str = "20260421_0001"
down_revision: Union[str, Sequence[str], None] = "20260418_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE transit_system ADD VALUE IF NOT EXISTS 'nj_transit_bus'")


def downgrade() -> None:
    # Postgres does not support removing a value from an enum. Leaving
    # `nj_transit_bus` present on downgrade is harmless.
    pass
