"""Add tour_media table for tour videos and photos.

Revision ID: 20260418_0001
Revises: 20260417_0007
Create Date: 2026-04-18

Creates a media table attached to user_tours so a group member can upload
videos/photos of a place they toured in person. Blobs live in Azure; this
table just stores the URL, kind, and ordering.
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260418_0001"
down_revision: Union[str, Sequence[str], None] = "20260417_0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    tour_media_kind = postgresql.ENUM(
        "video",
        "image",
        name="tour_media_kind",
    )
    tour_media_kind.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "tour_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tour_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "uploaded_by_user_id", postgresql.UUID(as_uuid=True), nullable=False
        ),
        sa.Column("media_url", sa.Text(), nullable=False),
        sa.Column(
            "media_kind",
            postgresql.ENUM(name="tour_media_kind", create_type=False),
            nullable=False,
        ),
        sa.Column("content_type", sa.String(length=128), nullable=True),
        sa.Column("file_size_bytes", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["tour_id"], ["user_tours.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["uploaded_by_user_id"], ["users.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tour_media_tour_id", "tour_media", ["tour_id"])


def downgrade() -> None:
    op.drop_index("ix_tour_media_tour_id", table_name="tour_media")
    op.drop_table("tour_media")
    sa.Enum(name="tour_media_kind").drop(op.get_bind(), checkfirst=True)
