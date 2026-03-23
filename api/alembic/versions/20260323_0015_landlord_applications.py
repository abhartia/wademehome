"""landlord applications and docs schema

Revision ID: 20260323_0015
Revises: 20260323_0014
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0015"
down_revision: Union[str, Sequence[str], None] = "20260323_0014"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    application_status = postgresql.ENUM(
        "submitted", "under_review", "approved", "denied", "withdrawn", name="landlord_application_status"
    )
    application_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "landlord_applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("property_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("unit_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("lead_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("applicant_name", sa.String(length=255), nullable=False),
        sa.Column("applicant_email", sa.String(length=255), nullable=False),
        sa.Column("annual_income", sa.Numeric(14, 2), nullable=True),
        sa.Column("credit_score", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "status",
            postgresql.ENUM(
                "submitted",
                "under_review",
                "approved",
                "denied",
                "withdrawn",
                name="landlord_application_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["property_id"], ["landlord_properties.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["unit_id"], ["landlord_units.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["lead_id"], ["landlord_leads.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_applications_owner_user_id", "landlord_applications", ["owner_user_id"])
    op.create_index(
        "ix_landlord_applications_owner_status_created",
        "landlord_applications",
        ["owner_user_id", "status", "created_at"],
    )

    op.create_table(
        "landlord_application_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("application_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.Text(), nullable=False),
        sa.Column("file_type", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["application_id"], ["landlord_applications.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_landlord_application_documents_application_id",
        "landlord_application_documents",
        ["application_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_landlord_application_documents_application_id",
        table_name="landlord_application_documents",
    )
    op.drop_table("landlord_application_documents")

    op.drop_index("ix_landlord_applications_owner_status_created", table_name="landlord_applications")
    op.drop_index("ix_landlord_applications_owner_user_id", table_name="landlord_applications")
    op.drop_table("landlord_applications")

    sa.Enum(
        "submitted", "under_review", "approved", "denied", "withdrawn", name="landlord_application_status"
    ).drop(op.get_bind(), checkfirst=True)
