"""Merge heads 20260403_0034 and 20260417_0001.

Revision ID: 20260417_0002
Revises: 20260403_0034, 20260417_0001
Create Date: 2026-04-17

Two parallel sessions produced migrations that both chained from
20260403_0033. This is a no-op merge to reunify the history so that
subsequent migrations have a single head to chain from.
"""

revision = "20260417_0002"
down_revision = ("20260403_0034", "20260417_0001")
branch_labels = None
depends_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
