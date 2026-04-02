"""vendor catalog coverage columns and move-in plan target_state

Revision ID: 20260402_0027
Revises: 20260402_0026
Create Date: 2026-04-02
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260402_0027"
down_revision: Union[str, Sequence[str], None] = "20260402_0026"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "vendor_catalog",
        sa.Column(
            "serves_nationwide",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.add_column(
        "vendor_catalog",
        sa.Column("serves_states", postgresql.ARRAY(sa.String(length=2)), nullable=True),
    )
    op.add_column(
        "user_movein_plans",
        sa.Column("target_state", sa.String(length=2), nullable=True),
    )
    op.alter_column("vendor_catalog", "serves_nationwide", server_default=None)


def downgrade() -> None:
    op.drop_column("user_movein_plans", "target_state")
    op.drop_column("vendor_catalog", "serves_states")
    op.drop_column("vendor_catalog", "serves_nationwide")
