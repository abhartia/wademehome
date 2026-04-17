"""Add transit_stations table for PATH, HBLR, and ferry walk-time scoring.

Revision ID: 20260417_0007
Revises: 20260417_0006
Create Date: 2026-04-17

A canonical list of transit stations/stops used to compute
walk-time scores for listings. Initial scope: PATH (13 stations),
Hudson-Bergen Light Rail (23 stations), NY Waterway ferry landings
relevant to the Hudson County commute (Paulus Hook, Newport, Hoboken,
Lincoln Harbor, Weehawken).

The table is not partitioned by city — each row carries lat/lng so
proximity queries are simple haversine / ST_Distance over the
canonical-coordinate pair. `system` and `line` let us filter (e.g.
"nearest PATH station under 8 min walk").
"""

from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260417_0007"
down_revision: Union[str, Sequence[str], None] = "20260417_0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    transit_system = postgresql.ENUM(
        "path",
        "hblr",
        "nyc_subway",
        "lirr",
        "nj_transit_rail",
        "ferry",
        name="transit_system",
    )
    transit_system.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "transit_stations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "system",
            postgresql.ENUM(name="transit_system", create_type=False),
            nullable=False,
        ),
        sa.Column("station_name", sa.String(length=255), nullable=False),
        sa.Column("lines", postgresql.ARRAY(sa.String(length=64)), nullable=True),
        sa.Column("latitude", sa.Numeric(10, 7), nullable=False),
        sa.Column("longitude", sa.Numeric(11, 7), nullable=False),
        sa.Column("city", sa.String(length=128), nullable=True),
        sa.Column("state", sa.String(length=8), nullable=True),
        sa.Column("borough", sa.String(length=64), nullable=True),
        sa.Column("external_id", sa.String(length=64), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("system", "station_name", name="uq_transit_system_name"),
    )
    op.create_index("ix_transit_stations_system", "transit_stations", ["system"])
    op.create_index(
        "ix_transit_stations_lat_lng",
        "transit_stations",
        ["latitude", "longitude"],
    )


def downgrade() -> None:
    op.drop_index("ix_transit_stations_lat_lng", table_name="transit_stations")
    op.drop_index("ix_transit_stations_system", table_name="transit_stations")
    op.drop_table("transit_stations")
    sa.Enum(name="transit_system").drop(op.get_bind(), checkfirst=True)
