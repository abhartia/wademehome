"""landlord core profile properties units media

Revision ID: 20260323_0013
Revises: 20260323_0012
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0013"
down_revision: Union[str, Sequence[str], None] = "20260323_0012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'landlord'")

    landlord_verification_status = postgresql.ENUM(
        "pending", "verified", "rejected", name="landlord_verification_status"
    )
    landlord_publish_status = postgresql.ENUM(
        "draft", "published", "archived", name="landlord_publish_status"
    )
    landlord_verification_status.create(op.get_bind(), checkfirst=True)
    landlord_publish_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "landlord_profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("display_name", sa.String(length=255), nullable=True),
        sa.Column("company_name", sa.String(length=255), nullable=True),
        sa.Column("phone_number", sa.String(length=64), nullable=True),
        sa.Column(
            "verification_status",
            postgresql.ENUM(
                "pending",
                "verified",
                "rejected",
                name="landlord_verification_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_landlord_profiles_user_id"),
    )
    op.create_index("ix_landlord_profiles_user_id", "landlord_profiles", ["user_id"])

    op.create_table(
        "landlord_properties",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("street_line1", sa.String(length=255), nullable=False),
        sa.Column("street_line2", sa.String(length=255), nullable=True),
        sa.Column("city", sa.String(length=128), nullable=False),
        sa.Column("state", sa.String(length=64), nullable=False),
        sa.Column("postal_code", sa.String(length=32), nullable=False),
        sa.Column("country", sa.String(length=64), nullable=False),
        sa.Column("amenities_json", sa.JSON(), nullable=False),
        sa.Column(
            "publish_status",
            postgresql.ENUM(
                "draft",
                "published",
                "archived",
                name="landlord_publish_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_properties_owner_user_id", "landlord_properties", ["owner_user_id"])
    op.create_index(
        "ix_landlord_properties_owner_status",
        "landlord_properties",
        ["owner_user_id", "publish_status"],
    )

    op.create_table(
        "landlord_property_media",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("media_url", sa.Text(), nullable=False),
        sa.Column("media_type", sa.String(length=32), nullable=False),
        sa.Column("caption", sa.String(length=255), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_property_media_property_id", "landlord_property_media", ["property_id"])
    op.create_index(
        "ix_landlord_property_media_property_sort_order",
        "landlord_property_media",
        ["property_id", "sort_order"],
    )

    op.create_table(
        "landlord_units",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("label", sa.String(length=128), nullable=False),
        sa.Column("bedrooms", sa.Integer(), nullable=False),
        sa.Column("bathrooms", sa.Numeric(4, 1), nullable=False),
        sa.Column("square_feet", sa.Integer(), nullable=True),
        sa.Column("monthly_rent", sa.Numeric(12, 2), nullable=False),
        sa.Column("security_deposit", sa.Numeric(12, 2), nullable=True),
        sa.Column("lease_term_months", sa.Integer(), nullable=True),
        sa.Column("available_on", sa.Date(), nullable=True),
        sa.Column("is_available", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_units_property_id", "landlord_units", ["property_id"])
    op.create_index(
        "ix_landlord_units_property_available",
        "landlord_units",
        ["property_id", "is_available"],
    )


def downgrade() -> None:
    op.drop_index("ix_landlord_units_property_available", table_name="landlord_units")
    op.drop_index("ix_landlord_units_property_id", table_name="landlord_units")
    op.drop_table("landlord_units")

    op.drop_index("ix_landlord_property_media_property_sort_order", table_name="landlord_property_media")
    op.drop_index("ix_landlord_property_media_property_id", table_name="landlord_property_media")
    op.drop_table("landlord_property_media")

    op.drop_index("ix_landlord_properties_owner_status", table_name="landlord_properties")
    op.drop_index("ix_landlord_properties_owner_user_id", table_name="landlord_properties")
    op.drop_table("landlord_properties")

    op.drop_index("ix_landlord_profiles_user_id", table_name="landlord_profiles")
    op.drop_table("landlord_profiles")

    sa.Enum("draft", "published", "archived", name="landlord_publish_status").drop(
        op.get_bind(), checkfirst=True
    )
    sa.Enum("pending", "verified", "rejected", name="landlord_verification_status").drop(
        op.get_bind(), checkfirst=True
    )
