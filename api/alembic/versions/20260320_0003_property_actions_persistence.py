"""add property favorites and notes tables

Revision ID: 20260320_0003
Revises: 20260320_0002
Create Date: 2026-03-20 01:30:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260320_0003"
down_revision: Union[str, Sequence[str], None] = "20260320_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "property_favorites",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_key", sa.String(length=255), nullable=False),
        sa.Column("property_name", sa.String(length=255), nullable=False),
        sa.Column("property_address", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "property_key", name="uq_property_favorites_user_property"),
    )
    op.create_index("ix_property_favorites_user_id", "property_favorites", ["user_id"])

    op.create_table(
        "property_notes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_key", sa.String(length=255), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "property_key", name="uq_property_notes_user_property"),
    )
    op.create_index("ix_property_notes_user_id", "property_notes", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_property_notes_user_id", table_name="property_notes")
    op.drop_table("property_notes")
    op.drop_index("ix_property_favorites_user_id", table_name="property_favorites")
    op.drop_table("property_favorites")
