"""Add group_applicants table for tenant-side applicant tracking.

Revision ID: 20260421_0002
Revises: 20260421_0001
Create Date: 2026-04-21
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260421_0002"
down_revision: Union[str, Sequence[str], None] = "20260421_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "group_applicants",
        sa.Column(
            "id",
            sa.UUID(),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "group_id",
            sa.UUID(),
            sa.ForeignKey("groups.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(64), nullable=True),
        sa.Column(
            "status",
            sa.String(32),
            nullable=False,
            server_default="new",
        ),
        sa.Column("role_context", sa.String(255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("budget_usd", sa.Integer(), nullable=True),
        sa.Column("move_in_date", sa.Date(), nullable=True),
        sa.Column(
            "source",
            sa.String(32),
            nullable=False,
            server_default="manual",
        ),
        sa.Column("self_reg_token", sa.String(96), nullable=True),
        sa.Column("self_reg_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_by",
            sa.UUID(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index(
        "ix_group_applicants_group_id",
        "group_applicants",
        ["group_id"],
    )
    op.create_index(
        "uq_group_applicants_self_reg_token",
        "group_applicants",
        ["self_reg_token"],
        unique=True,
        postgresql_where=sa.text("self_reg_token IS NOT NULL"),
    )


def downgrade() -> None:
    op.drop_index("uq_group_applicants_self_reg_token", table_name="group_applicants")
    op.drop_index("ix_group_applicants_group_id", table_name="group_applicants")
    op.drop_table("group_applicants")
