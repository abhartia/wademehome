"""nullable vendor ratings; clear seeded vendor catalog

Revision ID: 20260402_0029
Revises: 20260402_0028
Create Date: 2026-04-02

Ratings/review counts are optional (unknown until sourced from real data).
Removes all rows from vendor catalog tables so the app does not ship fabricated listings.
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260402_0029"
down_revision: Union[str, Sequence[str], None] = "20260402_0028"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            "UPDATE user_movein_plans SET target_address = '' "
            "WHERE target_address IN ('—', '–', '-')"
        )
    )
    op.execute(sa.text("TRUNCATE TABLE vendor_catalog CASCADE"))
    op.alter_column(
        "vendor_catalog",
        "rating",
        existing_type=sa.Numeric(3, 1),
        nullable=True,
        server_default=None,
    )
    op.alter_column(
        "vendor_catalog",
        "review_count",
        existing_type=sa.Integer(),
        nullable=True,
        server_default=None,
    )


def downgrade() -> None:
    op.execute(sa.text("UPDATE vendor_catalog SET rating = 0.0 WHERE rating IS NULL"))
    op.execute(sa.text("UPDATE vendor_catalog SET review_count = 0 WHERE review_count IS NULL"))
    op.alter_column(
        "vendor_catalog",
        "review_count",
        existing_type=sa.Integer(),
        nullable=False,
        server_default=sa.text("0"),
    )
    op.alter_column(
        "vendor_catalog",
        "rating",
        existing_type=sa.Numeric(3, 1),
        nullable=False,
        server_default=sa.text("0.0"),
    )
