"""Create pluto_building_cache table for NYC PLUTO + assessment data.

Revision ID: 20260403_0032
Revises: 20260402_0031
Create Date: 2026-04-03
"""
from alembic import op
import sqlalchemy as sa

revision = "20260403_0032"
down_revision = "20260402_0031"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "pluto_building_cache",
        sa.Column("bbl", sa.String(10), primary_key=True),
        sa.Column("data_json", sa.Text, nullable=False),
        sa.Column("fetched_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_pluto_cache_fetched", "pluto_building_cache", ["fetched_at"])


def downgrade() -> None:
    op.drop_index("ix_pluto_cache_fetched")
    op.drop_table("pluto_building_cache")
