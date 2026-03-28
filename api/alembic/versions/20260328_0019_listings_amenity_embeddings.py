"""add amenity embedding columns on listings table

Revision ID: 20260328_0019
Revises: 20260326_0018
Create Date: 2026-03-28 12:10:00.000000
"""

from __future__ import annotations

import os
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260328_0019"
down_revision: Union[str, Sequence[str], None] = "20260326_0018"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _table_name() -> str:
    return (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"


def _table_schema() -> str:
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")
    return schema.strip() if schema else ""


def _qualified_table() -> str:
    schema = _table_schema()
    table = _table_name()
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _table_exists() -> bool:
    schema = _table_schema() or "public"
    table = _table_name()
    conn = op.get_bind()
    exists = conn.execute(
        sa.text(
            """
            SELECT EXISTS (
              SELECT 1
              FROM information_schema.tables
              WHERE table_schema = :schema
                AND table_name = :table
            )
            """
        ),
        {"schema": schema, "table": table},
    ).scalar()
    return bool(exists)


def upgrade() -> None:
    if not _table_exists():
        return

    qtable = _qualified_table()
    # These fields support amenity-focused semantic retrieval and freshness/version tracking.
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS amenity_profile_text TEXT"))
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS amenity_embedding vector(1536)"))
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS amenity_embedding_model TEXT"))
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS amenity_embedding_source_hash TEXT"))
    op.execute(
        sa.text(
            f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS amenity_embedding_updated_at TIMESTAMPTZ"
        )
    )


def downgrade() -> None:
    if not _table_exists():
        return

    qtable = _qualified_table()
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS amenity_embedding_updated_at"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS amenity_embedding_source_hash"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS amenity_embedding_model"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS amenity_embedding"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS amenity_profile_text"))
