"""landlord lease offers and signatures schema

Revision ID: 20260323_0016
Revises: 20260323_0015
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0016"
down_revision: Union[str, Sequence[str], None] = "20260323_0015"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    lease_offer_status = postgresql.ENUM(
        "draft", "sent", "countered", "accepted", "declined", "expired", name="landlord_lease_offer_status"
    )
    signature_status = postgresql.ENUM(
        "pending", "signed", "declined", name="landlord_signature_status"
    )
    lease_offer_status.create(op.get_bind(), checkfirst=True)
    signature_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "landlord_lease_offers",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("unit_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("application_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("tenant_name", sa.String(length=255), nullable=False),
        sa.Column("tenant_email", sa.String(length=255), nullable=False),
        sa.Column("monthly_rent", sa.Numeric(12, 2), nullable=False),
        sa.Column("lease_start", sa.Date(), nullable=False),
        sa.Column("lease_end", sa.Date(), nullable=False),
        sa.Column("terms_text", sa.Text(), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "draft",
                "sent",
                "countered",
                "accepted",
                "declined",
                "expired",
                name="landlord_lease_offer_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["unit_id"], ["landlord_units.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["application_id"], ["landlord_applications.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_lease_offers_owner_user_id", "landlord_lease_offers", ["owner_user_id"])
    op.create_index(
        "ix_landlord_lease_offers_owner_status_created",
        "landlord_lease_offers",
        ["owner_user_id", "status", "created_at"],
    )

    op.create_table(
        "landlord_lease_signatures",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("lease_offer_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("signer_role", sa.String(length=32), nullable=False),
        sa.Column("signer_name", sa.String(length=255), nullable=False),
        sa.Column("signer_email", sa.String(length=255), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "pending",
                "signed",
                "declined",
                name="landlord_signature_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["lease_offer_id"], ["landlord_lease_offers.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_landlord_lease_signatures_lease_offer_id",
        "landlord_lease_signatures",
        ["lease_offer_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_landlord_lease_signatures_lease_offer_id", table_name="landlord_lease_signatures")
    op.drop_table("landlord_lease_signatures")

    op.drop_index("ix_landlord_lease_offers_owner_status_created", table_name="landlord_lease_offers")
    op.drop_index("ix_landlord_lease_offers_owner_user_id", table_name="landlord_lease_offers")
    op.drop_table("landlord_lease_offers")

    sa.Enum("pending", "signed", "declined", name="landlord_signature_status").drop(
        op.get_bind(), checkfirst=True
    )
    sa.Enum(
        "draft", "sent", "countered", "accepted", "declined", "expired", name="landlord_lease_offer_status"
    ).drop(op.get_bind(), checkfirst=True)
