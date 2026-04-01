"""property_manager role + report subscription table

Revision ID: 20260401_0025
Revises: 20260330_0024
Create Date: 2026-04-01
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260401_0025"
down_revision: Union[str, Sequence[str], None] = "20260330_0024"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'property_manager'")

    op.create_table(
        "property_manager_report_subscriptions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("center_latitude", sa.Numeric(10, 7), nullable=False),
        sa.Column("center_longitude", sa.Numeric(11, 7), nullable=False),
        sa.Column("radius_miles", sa.Numeric(6, 2), nullable=False, server_default="2"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("last_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "label", name="uq_pm_report_sub_user_label"),
    )
    op.create_index(
        "ix_pm_report_sub_user_id",
        "property_manager_report_subscriptions",
        ["user_id"],
    )
    op.create_index(
        "ix_pm_report_sub_active",
        "property_manager_report_subscriptions",
        ["is_active"],
    )


def downgrade() -> None:
    op.drop_index("ix_pm_report_sub_active", table_name="property_manager_report_subscriptions")
    op.drop_index("ix_pm_report_sub_user_id", table_name="property_manager_report_subscriptions")
    op.drop_table("property_manager_report_subscriptions")
    # PostgreSQL: cannot remove enum value safely; leave user_role as-is
