"""create portal core schema

Revision ID: 20260320_0001
Revises:
Create Date: 2026-03-20 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "20260320_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


user_role_enum = postgresql.ENUM("user", "admin", name="user_role")
journey_stage_enum = postgresql.ENUM(
    "searching",
    "touring",
    "applying",
    "lease-signed",
    "moving",
    "moved-in",
    name="journey_stage",
)
tour_status_enum = postgresql.ENUM(
    "saved", "scheduled", "completed", "cancelled", name="tour_status"
)
guarantor_request_status_enum = postgresql.ENUM(
    "draft", "sent", "viewed", "signed", "expired", "declined", name="guarantor_request_status"
)
guarantor_verification_status_enum = postgresql.ENUM(
    "pending", "verified", "failed", name="guarantor_verification_status"
)
vendor_order_status_enum = postgresql.ENUM(
    "researching", "requested", "confirmed", "active", "cancelled", name="vendor_order_status"
)
roommate_connection_status_enum = postgresql.ENUM(
    "requested", "connected", "archived", name="roommate_connection_status"
)

user_role_enum_ref = postgresql.ENUM(name="user_role", create_type=False)
journey_stage_enum_ref = postgresql.ENUM(name="journey_stage", create_type=False)
tour_status_enum_ref = postgresql.ENUM(name="tour_status", create_type=False)
guarantor_request_status_enum_ref = postgresql.ENUM(
    name="guarantor_request_status", create_type=False
)
guarantor_verification_status_enum_ref = postgresql.ENUM(
    name="guarantor_verification_status", create_type=False
)
vendor_order_status_enum_ref = postgresql.ENUM(name="vendor_order_status", create_type=False)
roommate_connection_status_enum_ref = postgresql.ENUM(
    name="roommate_connection_status", create_type=False
)


def upgrade() -> None:
    bind = op.get_bind()
    user_role_enum.create(bind, checkfirst=True)
    journey_stage_enum.create(bind, checkfirst=True)
    tour_status_enum.create(bind, checkfirst=True)
    guarantor_request_status_enum.create(bind, checkfirst=True)
    guarantor_verification_status_enum.create(bind, checkfirst=True)
    vendor_order_status_enum.create(bind, checkfirst=True)
    roommate_connection_status_enum.create(bind, checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", user_role_enum_ref, nullable=False, server_default=sa.text("'user'")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )

    op.create_table(
        "user_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("search_trigger", sa.String(length=32), nullable=True),
        sa.Column("trigger_reason", sa.Text(), nullable=True),
        sa.Column("move_timeline", sa.String(length=128), nullable=True),
        sa.Column("current_city", sa.String(length=128), nullable=True),
        sa.Column("work_location", sa.String(length=128), nullable=True),
        sa.Column("preferred_cities", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("neighbourhood_priorities", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("dealbreakers", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("max_monthly_rent", sa.String(length=64), nullable=True),
        sa.Column("credit_score_range", sa.String(length=64), nullable=True),
        sa.Column("living_arrangement", sa.String(length=32), nullable=True),
        sa.Column("bedrooms_needed", sa.String(length=32), nullable=True),
        sa.Column("has_pets", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("pet_details", sa.Text(), nullable=True),
        sa.Column("journey_stage_override", journey_stage_enum_ref, nullable=True),
        sa.Column("onboarding_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("onboarding_step", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("last_updated", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_user_profiles_user_id"),
    )
    op.create_index("ix_user_profiles_user_id", "user_profiles", ["user_id"])

    op.create_table(
        "user_tours",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_ref_id", sa.String(length=128), nullable=True),
        sa.Column("property_name", sa.String(length=255), nullable=False),
        sa.Column("property_address", sa.String(length=255), nullable=False),
        sa.Column("property_image", sa.Text(), nullable=True),
        sa.Column("property_price", sa.String(length=64), nullable=True),
        sa.Column("property_beds", sa.String(length=64), nullable=True),
        sa.Column("property_tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("status", tour_status_enum_ref, nullable=False, server_default=sa.text("'saved'")),
        sa.Column("tour_date", sa.Date(), nullable=True),
        sa.Column("tour_time", sa.Time(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_tours_user_id", "user_tours", ["user_id"])
    op.create_index("ix_user_tours_user_status_date", "user_tours", ["user_id", "status", "tour_date"])

    op.create_table(
        "tour_notes",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tour_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ratings_json", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("pros", sa.Text(), nullable=True),
        sa.Column("cons", sa.Text(), nullable=True),
        sa.Column("general_notes", sa.Text(), nullable=True),
        sa.Column("would_apply", sa.Boolean(), nullable=True),
        sa.Column("photo_checklist_json", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["tour_id"], ["user_tours.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_tour_notes_tour_id", "tour_notes", ["tour_id"])

    op.create_table(
        "user_guarantors",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=64), nullable=False),
        sa.Column("relationship", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_guarantors_user_id", "user_guarantors", ["user_id"])

    op.create_table(
        "guarantor_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("guarantor_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("guarantor_snapshot_name", sa.String(length=255), nullable=False),
        sa.Column("guarantor_snapshot_email", sa.String(length=255), nullable=False),
        sa.Column("lease_property_name", sa.String(length=255), nullable=False),
        sa.Column("lease_property_address", sa.String(length=255), nullable=False),
        sa.Column("lease_monthly_rent", sa.String(length=64), nullable=False),
        sa.Column("lease_start", sa.Date(), nullable=True),
        sa.Column("lease_term", sa.String(length=64), nullable=True),
        sa.Column(
            "status",
            guarantor_request_status_enum_ref,
            nullable=False,
            server_default=sa.text("'draft'"),
        ),
        sa.Column(
            "verification_status",
            guarantor_verification_status_enum_ref,
            nullable=False,
            server_default=sa.text("'pending'"),
        ),
        sa.Column("sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("viewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["guarantor_id"], ["user_guarantors.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_guarantor_requests_user_id", "guarantor_requests", ["user_id"])
    op.create_index("ix_guarantor_requests_guarantor_id", "guarantor_requests", ["guarantor_id"])
    op.create_index(
        "ix_guarantor_requests_user_status_created",
        "guarantor_requests",
        ["user_id", "status", "created_at"],
    )

    op.create_table(
        "guarantor_request_history",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", guarantor_request_status_enum_ref, nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_guarantor_request_history_request_id", "guarantor_request_history", ["request_id"])
    op.create_index("ix_guarantor_request_history_created_at", "guarantor_request_history", ["created_at"])

    op.create_table(
        "user_movein_plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("target_address", sa.String(length=255), nullable=False),
        sa.Column("move_date", sa.Date(), nullable=True),
        sa.Column("move_from_address", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_movein_plans_user_id", "user_movein_plans", ["user_id"])

    op.create_table(
        "user_vendor_orders",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("movein_plan_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("vendor_id", sa.String(length=128), nullable=True),
        sa.Column("vendor_name", sa.String(length=255), nullable=False),
        sa.Column("plan_id", sa.String(length=128), nullable=True),
        sa.Column("plan_name", sa.String(length=255), nullable=True),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column(
            "status",
            vendor_order_status_enum_ref,
            nullable=False,
            server_default=sa.text("'researching'"),
        ),
        sa.Column("scheduled_date", sa.Date(), nullable=True),
        sa.Column("account_number", sa.String(length=128), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("monthly_cost", sa.Numeric(10, 2), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["movein_plan_id"], ["user_movein_plans.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_vendor_orders_movein_plan_id", "user_vendor_orders", ["movein_plan_id"])
    op.create_index(
        "ix_user_vendor_orders_movein_plan_status",
        "user_vendor_orders",
        ["movein_plan_id", "status"],
    )

    op.create_table(
        "user_checklist_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("movein_plan_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("label", sa.String(length=255), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["movein_plan_id"], ["user_movein_plans.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_checklist_items_user_id", "user_checklist_items", ["user_id"])
    op.create_index("ix_user_checklist_items_movein_plan_id", "user_checklist_items", ["movein_plan_id"])

    op.create_table(
        "roommate_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sleep_schedule", sa.String(length=64), nullable=True),
        sa.Column("cleanliness_level", sa.String(length=64), nullable=True),
        sa.Column("noise_level", sa.String(length=64), nullable=True),
        sa.Column("guest_policy", sa.String(length=64), nullable=True),
        sa.Column("smoking", sa.String(length=64), nullable=True),
        sa.Column("interests", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("profile_completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_roommate_profiles_user_id"),
    )
    op.create_index("ix_roommate_profiles_user_id", "roommate_profiles", ["user_id"])

    op.create_table(
        "roommate_connections",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("roommate_ref_id", sa.String(length=128), nullable=False),
        sa.Column("roommate_name", sa.String(length=255), nullable=True),
        sa.Column("roommate_snapshot_json", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("compatibility_score", sa.Integer(), nullable=True),
        sa.Column("compatibility_reasons", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column(
            "status",
            roommate_connection_status_enum_ref,
            nullable=False,
            server_default=sa.text("'connected'"),
        ),
        sa.Column("connected_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_roommate_connections_user_id", "roommate_connections", ["user_id"])

    op.create_table(
        "roommate_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("connection_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sender_role", sa.String(length=32), nullable=False),
        sa.Column("sender_ref_id", sa.String(length=128), nullable=True),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(["connection_id"], ["roommate_connections.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_roommate_messages_connection_id", "roommate_messages", ["connection_id"])
    op.create_index(
        "ix_roommate_messages_connection_created",
        "roommate_messages",
        ["connection_id", "created_at"],
    )


def downgrade() -> None:
    bind = op.get_bind()

    op.drop_index("ix_roommate_messages_connection_created", table_name="roommate_messages")
    op.drop_index("ix_roommate_messages_connection_id", table_name="roommate_messages")
    op.drop_table("roommate_messages")

    op.drop_index("ix_roommate_connections_user_id", table_name="roommate_connections")
    op.drop_table("roommate_connections")

    op.drop_index("ix_roommate_profiles_user_id", table_name="roommate_profiles")
    op.drop_table("roommate_profiles")

    op.drop_index("ix_user_checklist_items_movein_plan_id", table_name="user_checklist_items")
    op.drop_index("ix_user_checklist_items_user_id", table_name="user_checklist_items")
    op.drop_table("user_checklist_items")

    op.drop_index("ix_user_vendor_orders_movein_plan_status", table_name="user_vendor_orders")
    op.drop_index("ix_user_vendor_orders_movein_plan_id", table_name="user_vendor_orders")
    op.drop_table("user_vendor_orders")

    op.drop_index("ix_user_movein_plans_user_id", table_name="user_movein_plans")
    op.drop_table("user_movein_plans")

    op.drop_index("ix_guarantor_request_history_created_at", table_name="guarantor_request_history")
    op.drop_index("ix_guarantor_request_history_request_id", table_name="guarantor_request_history")
    op.drop_table("guarantor_request_history")

    op.drop_index("ix_guarantor_requests_user_status_created", table_name="guarantor_requests")
    op.drop_index("ix_guarantor_requests_guarantor_id", table_name="guarantor_requests")
    op.drop_index("ix_guarantor_requests_user_id", table_name="guarantor_requests")
    op.drop_table("guarantor_requests")

    op.drop_index("ix_user_guarantors_user_id", table_name="user_guarantors")
    op.drop_table("user_guarantors")

    op.drop_index("ix_tour_notes_tour_id", table_name="tour_notes")
    op.drop_table("tour_notes")

    op.drop_index("ix_user_tours_user_status_date", table_name="user_tours")
    op.drop_index("ix_user_tours_user_id", table_name="user_tours")
    op.drop_table("user_tours")

    op.drop_index("ix_user_profiles_user_id", table_name="user_profiles")
    op.drop_table("user_profiles")

    op.drop_table("users")

    roommate_connection_status_enum.drop(bind, checkfirst=True)
    vendor_order_status_enum.drop(bind, checkfirst=True)
    guarantor_verification_status_enum.drop(bind, checkfirst=True)
    guarantor_request_status_enum.drop(bind, checkfirst=True)
    tour_status_enum.drop(bind, checkfirst=True)
    journey_stage_enum.drop(bind, checkfirst=True)
    user_role_enum.drop(bind, checkfirst=True)
