"""Add move-in photo documentation tables.

Revision ID: 20260403_0033
Revises: 20260403_0032
Create Date: 2026-04-03
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "20260403_0033"
down_revision = "20260403_0032"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "user_movein_photo_rooms",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "movein_plan_id",
            UUID(as_uuid=True),
            sa.ForeignKey("user_movein_plans.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("room_type", sa.String(64), nullable=False),
        sa.Column("room_label", sa.String(128), nullable=False),
        sa.Column("sort_order", sa.Integer, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_user_movein_photo_rooms_movein_plan_id", "user_movein_photo_rooms", ["movein_plan_id"])

    op.create_table(
        "user_movein_photos",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "room_id",
            UUID(as_uuid=True),
            sa.ForeignKey("user_movein_photo_rooms.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("photo_url", sa.Text, nullable=False),
        sa.Column("thumbnail_url", sa.Text, nullable=True),
        sa.Column("note", sa.Text, nullable=True),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("latitude", sa.Numeric(10, 7), nullable=True),
        sa.Column("longitude", sa.Numeric(10, 7), nullable=True),
        sa.Column("file_size_bytes", sa.Integer, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_user_movein_photos_room_id", "user_movein_photos", ["room_id"])


def downgrade() -> None:
    op.drop_table("user_movein_photos")
    op.drop_table("user_movein_photo_rooms")
