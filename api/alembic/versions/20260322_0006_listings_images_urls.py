"""add images_urls to listings inventory table

Revision ID: 20260322_0006
Revises: 20260322_0005
Create Date: 2026-03-22 14:00:00.000000

Listings table is not on SQLAlchemy Base; this revision uses imperative DDL only.
Table/schema follow LISTINGS_TABLE_NAME / LISTINGS_TABLE_SCHEMA (same defaults as load script).
"""

from __future__ import annotations

import os
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260322_0006"
down_revision: Union[str, Sequence[str], None] = "20260322_0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _qualified_table() -> str:
    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")
    schema = schema.strip() if schema else ""
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def upgrade() -> None:
    qtable = _qualified_table()
    op.execute(
        sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS images_urls TEXT")
    )


def downgrade() -> None:
    qtable = _qualified_table()
    op.execute(sa.text(f'ALTER TABLE {qtable} DROP COLUMN IF EXISTS "images_urls"'))
