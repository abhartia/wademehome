"""Create pm_building_snapshots and pm_market_snapshots tables for time-series tracking.

Revision ID: 20260403_0033
Revises: 20260403_0032
Create Date: 2026-04-03
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = "20260403_0033"
down_revision = "20260403_0032"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Building-level snapshots ──────────────────────────────────────
    op.create_table(
        "pm_building_snapshots",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("location_key", sa.String(64), nullable=False),
        sa.Column("snapshot_week", sa.Date(), nullable=False),
        sa.Column("property_id", sa.String(255), nullable=False),
        sa.Column("property_name", sa.String(500)),
        sa.Column("address", sa.String(500)),
        sa.Column("median_rent", sa.Float()),
        sa.Column("median_sqft", sa.Float()),
        sa.Column("rent_per_sqft", sa.Float()),
        sa.Column("unit_count", sa.Integer()),
        sa.Column("available_units", sa.Integer()),
        sa.Column("beds_available", sa.String(100)),
        sa.Column("fees_json", JSONB()),
        sa.Column("amenities_json", JSONB()),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("location_key", "snapshot_week", "property_id", name="uq_pm_bldg_snap_loc_week_pid"),
    )
    op.create_index(
        "ix_pm_bldg_snap_loc_pid_week",
        "pm_building_snapshots",
        ["location_key", "property_id", sa.text("snapshot_week DESC")],
    )
    op.create_index(
        "ix_pm_bldg_snap_loc_week",
        "pm_building_snapshots",
        ["location_key", sa.text("snapshot_week DESC")],
    )

    # ── Market-level snapshots ────────────────────────────────────────
    op.create_table(
        "pm_market_snapshots",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("location_key", sa.String(64), nullable=False),
        sa.Column("snapshot_week", sa.Date(), nullable=False),
        sa.Column("median_rent", sa.Float()),
        sa.Column("p25_rent", sa.Float()),
        sa.Column("p75_rent", sa.Float()),
        sa.Column("sample_size", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("vacancy_rate_pct", sa.Float()),
        sa.Column("available_units", sa.Integer()),
        sa.Column("total_units", sa.Integer()),
        sa.Column("bedroom_vacancy_json", JSONB()),
        sa.Column("center_latitude", sa.Numeric(10, 7), nullable=False),
        sa.Column("center_longitude", sa.Numeric(11, 7), nullable=False),
        sa.Column("radius_miles", sa.Numeric(6, 2), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("location_key", "snapshot_week", name="uq_pm_mkt_snap_loc_week"),
    )
    op.create_index(
        "ix_pm_mkt_snap_loc_week",
        "pm_market_snapshots",
        ["location_key", sa.text("snapshot_week DESC")],
    )


def downgrade() -> None:
    op.drop_index("ix_pm_mkt_snap_loc_week")
    op.drop_table("pm_market_snapshots")
    op.drop_index("ix_pm_bldg_snap_loc_week")
    op.drop_index("ix_pm_bldg_snap_loc_pid_week")
    op.drop_table("pm_building_snapshots")
