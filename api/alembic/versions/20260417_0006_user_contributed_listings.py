"""add user-contributed listings columns

Revision ID: 20260417_0006
Revises: 20260417_0005
Create Date: 2026-04-17

Adds three columns to the listings inventory table so users can add
properties they found elsewhere (Zillow, StreetEasy, flyer, etc.) and
track them alongside scraped listings. The listings table isn't on
SQLAlchemy Base — we use imperative DDL keyed by LISTINGS_TABLE_NAME /
LISTINGS_TABLE_SCHEMA, matching prior listings migrations.

- contributed_by_user_id: nullable UUID FK to users.id. NULL = scraped.
- visibility: 'public' (default, incl. all scraped rows) or 'private'.
- source_url: optional URL back to the original external listing.
"""

from __future__ import annotations

import os
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260417_0006"
down_revision: Union[str, Sequence[str], None] = "20260417_0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _qualified_table() -> str:
    table = (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"
    schema = os.environ.get("LISTINGS_TABLE_SCHEMA")
    schema = schema.strip() if schema else ""
    if schema:
        return f'"{schema}"."{table}"'
    return f'"{table}"'


def _table_name() -> str:
    return (os.environ.get("LISTINGS_TABLE_NAME") or "listings").strip() or "listings"


def upgrade() -> None:
    qtable = _qualified_table()
    tname = _table_name()

    op.execute(
        sa.text(
            f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS contributed_by_user_id UUID"
        )
    )
    op.execute(
        sa.text(
            f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS visibility VARCHAR(16) NOT NULL DEFAULT 'public'"
        )
    )
    op.execute(
        sa.text(
            f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS source_url VARCHAR(2048)"
        )
    )
    # Partial index so user-contribution lookups by user don't scan scraped rows.
    op.execute(
        sa.text(
            f'CREATE INDEX IF NOT EXISTS "ix_{tname}_contributed_by_user_id" '
            f"ON {qtable} (contributed_by_user_id) WHERE contributed_by_user_id IS NOT NULL"
        )
    )
    # Indexing visibility lets the nearby filter skip the private rows cheaply.
    op.execute(
        sa.text(
            f'CREATE INDEX IF NOT EXISTS "ix_{tname}_visibility" ON {qtable} (visibility)'
        )
    )


def downgrade() -> None:
    qtable = _qualified_table()
    tname = _table_name()
    op.execute(sa.text(f'DROP INDEX IF EXISTS "ix_{tname}_visibility"'))
    op.execute(sa.text(f'DROP INDEX IF EXISTS "ix_{tname}_contributed_by_user_id"'))
    op.execute(sa.text(f'ALTER TABLE {qtable} DROP COLUMN IF EXISTS "source_url"'))
    op.execute(sa.text(f'ALTER TABLE {qtable} DROP COLUMN IF EXISTS "visibility"'))
    op.execute(sa.text(f'ALTER TABLE {qtable} DROP COLUMN IF EXISTS "contributed_by_user_id"'))
