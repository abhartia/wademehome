"""Create insight_llm_cache table for persistent LLM insight caching.

Revision ID: 20260402_0031
Revises: 20260402_0030
Create Date: 2026-04-02
"""
from alembic import op
import sqlalchemy as sa

revision = "20260402_0031"
down_revision = "20260402_0030"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "insight_llm_cache",
        sa.Column("cache_key", sa.String(64), primary_key=True),
        sa.Column("response_json", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("insight_llm_cache")
