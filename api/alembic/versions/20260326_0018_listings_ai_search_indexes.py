"""add ai search columns and indexes on listings table

Revision ID: 20260326_0018
Revises: 20260323_0017
Create Date: 2026-03-26 16:10:00.000000
"""

from __future__ import annotations

import os
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260326_0018"
down_revision: Union[str, Sequence[str], None] = "20260323_0017"
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


def _lower_columns() -> set[str]:
    schema = _table_schema() or "public"
    table = _table_name()
    conn = op.get_bind()
    rows = conn.execute(
        sa.text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = :schema
              AND table_name = :table
            """
        ),
        {"schema": schema, "table": table},
    )
    return {str(r[0]).lower() for r in rows}


def _ci_column(cols: set[str], candidates: tuple[str, ...]) -> str | None:
    for name in candidates:
        if name.lower() in cols:
            return name.lower()
    return None


def upgrade() -> None:
    # Required for semantic + geospatial search.
    # Use explicit `pg_extension` checks instead of `IF NOT EXISTS` to avoid
    # rare duplicate-name errors during reruns/transaction rollbacks.
    op.execute(
        sa.text(
            """
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
                CREATE EXTENSION vector;
              END IF;
            END $$;
            """
        )
    )
    op.execute(
        sa.text(
            """
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
                CREATE EXTENSION postgis;
              END IF;
            END $$;
            """
        )
    )

    if not _table_exists():
        return

    qtable = _qualified_table()
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS geog geography(Point,4326)"))
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS search_doc TEXT"))
    op.execute(sa.text(f"ALTER TABLE {qtable} ADD COLUMN IF NOT EXISTS embedding vector(1536)"))

    # Intentionally avoid backfills/index builds inside the migration transaction.
    # These can be extremely expensive on large listings tables; we do them in
    # a separate processing step after the schema is in place.


def downgrade() -> None:
    if not _table_exists():
        return

    qtable = _qualified_table()
    table = _table_name()
    op.execute(sa.text(f"DROP INDEX IF EXISTS ix_{table}_search_doc_tsv"))
    op.execute(sa.text(f"DROP INDEX IF EXISTS ix_{table}_embedding_hnsw"))
    op.execute(sa.text(f"DROP INDEX IF EXISTS ix_{table}_geog_gist"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS embedding"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS search_doc"))
    op.execute(sa.text(f"ALTER TABLE {qtable} DROP COLUMN IF EXISTS geog"))
