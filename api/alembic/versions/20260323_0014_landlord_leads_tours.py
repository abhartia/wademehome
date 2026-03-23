"""landlord leads and tours schema

Revision ID: 20260323_0014
Revises: 20260323_0013
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0014"
down_revision: Union[str, Sequence[str], None] = "20260323_0013"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    lead_status = postgresql.ENUM(
        "new", "contacted", "toured", "applied", "leased", "closed", name="landlord_lead_status"
    )
    booking_status = postgresql.ENUM(
        "requested", "confirmed", "cancelled", "completed", name="landlord_tour_booking_status"
    )
    lead_status.create(op.get_bind(), checkfirst=True)
    booking_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "landlord_leads",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("unit_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("source", sa.String(length=64), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "new",
                "contacted",
                "toured",
                "applied",
                "leased",
                "closed",
                name="landlord_lead_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["unit_id"], ["landlord_units.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_leads_owner_user_id", "landlord_leads", ["owner_user_id"])
    op.create_index(
        "ix_landlord_leads_owner_status_created",
        "landlord_leads",
        ["owner_user_id", "status", "created_at"],
    )

    op.create_table(
        "landlord_tour_slots",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("unit_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_blocked", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["unit_id"], ["landlord_units.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_tour_slots_owner_user_id", "landlord_tour_slots", ["owner_user_id"])
    op.create_index(
        "ix_landlord_tour_slots_unit_start_time", "landlord_tour_slots", ["unit_id", "start_time"]
    )

    op.create_table(
        "landlord_tour_bookings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("slot_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("lead_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("guest_name", sa.String(length=255), nullable=False),
        sa.Column("guest_email", sa.String(length=255), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "requested",
                "confirmed",
                "cancelled",
                "completed",
                name="landlord_tour_booking_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["slot_id"], ["landlord_tour_slots.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lead_id"], ["landlord_leads.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_tour_bookings_owner_user_id", "landlord_tour_bookings", ["owner_user_id"])
    op.create_index("ix_landlord_tour_bookings_slot_id", "landlord_tour_bookings", ["slot_id"])


def downgrade() -> None:
    op.drop_index("ix_landlord_tour_bookings_slot_id", table_name="landlord_tour_bookings")
    op.drop_index("ix_landlord_tour_bookings_owner_user_id", table_name="landlord_tour_bookings")
    op.drop_table("landlord_tour_bookings")

    op.drop_index("ix_landlord_tour_slots_unit_start_time", table_name="landlord_tour_slots")
    op.drop_index("ix_landlord_tour_slots_owner_user_id", table_name="landlord_tour_slots")
    op.drop_table("landlord_tour_slots")

    op.drop_index("ix_landlord_leads_owner_status_created", table_name="landlord_leads")
    op.drop_index("ix_landlord_leads_owner_user_id", table_name="landlord_leads")
    op.drop_table("landlord_leads")

    sa.Enum("requested", "confirmed", "cancelled", "completed", name="landlord_tour_booking_status").drop(
        op.get_bind(), checkfirst=True
    )
    sa.Enum("new", "contacted", "toured", "applied", "leased", "closed", name="landlord_lead_status").drop(
        op.get_bind(), checkfirst=True
    )
