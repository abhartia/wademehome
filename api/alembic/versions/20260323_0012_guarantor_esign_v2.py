"""guarantor esign v2 hard cutover

Revision ID: 20260323_0012
Revises: 20260323_0011
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0012"
down_revision: Union[str, Sequence[str], None] = "20260323_0011"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'invited'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'opened'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'consented'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'submitted'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'verified'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'failed'")
    op.execute("ALTER TYPE guarantor_request_status ADD VALUE IF NOT EXISTS 'revoked'")

    # Hard reset legacy data as requested.
    op.execute("TRUNCATE TABLE guarantor_request_history RESTART IDENTITY CASCADE")
    op.execute("TRUNCATE TABLE guarantor_requests RESTART IDENTITY CASCADE")
    op.execute("TRUNCATE TABLE user_guarantors RESTART IDENTITY CASCADE")

    op.create_table(
        "guarantor_invite_tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token_hash", sa.String(length=128), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash", name="uq_guarantor_invite_tokens_token_hash"),
    )
    op.create_index(
        "ix_guarantor_invite_tokens_request_id", "guarantor_invite_tokens", ["request_id"]
    )
    op.create_index(
        "ix_guarantor_invite_tokens_expires_at", "guarantor_invite_tokens", ["expires_at"]
    )

    op.create_table(
        "guarantor_signing_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("event_type", sa.String(length=64), nullable=False),
        sa.Column("actor", sa.String(length=32), nullable=False),
        sa.Column("actor_ref_id", sa.String(length=128), nullable=True),
        sa.Column("ip_address", sa.String(length=64), nullable=True),
        sa.Column("user_agent", sa.String(length=512), nullable=True),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_guarantor_signing_events_request_id", "guarantor_signing_events", ["request_id"]
    )
    op.create_index(
        "ix_guarantor_signing_events_created_at", "guarantor_signing_events", ["created_at"]
    )

    op.create_table(
        "guarantor_signatures",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("signer_name", sa.String(length=255), nullable=False),
        sa.Column("signer_email", sa.String(length=255), nullable=False),
        sa.Column("signature_text", sa.Text(), nullable=False),
        sa.Column("consent_text_version", sa.String(length=64), nullable=False),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_guarantor_signatures_request_id", "guarantor_signatures", ["request_id"])
    op.create_index("ix_guarantor_signatures_signed_at", "guarantor_signatures", ["signed_at"])

    op.create_table(
        "guarantor_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("document_type", sa.String(length=64), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=128), nullable=False),
        sa.Column("byte_size", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(length=512), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_guarantor_documents_request_id", "guarantor_documents", ["request_id"])
    op.create_index("ix_guarantor_documents_uploaded_at", "guarantor_documents", ["uploaded_at"])

    op.drop_index("ix_guarantor_request_history_created_at", table_name="guarantor_request_history")
    op.drop_index("ix_guarantor_request_history_request_id", table_name="guarantor_request_history")
    op.drop_table("guarantor_request_history")


def downgrade() -> None:
    op.create_table(
        "guarantor_request_history",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("request_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "draft",
                "sent",
                "viewed",
                "signed",
                "expired",
                "declined",
                "invited",
                "opened",
                "consented",
                "submitted",
                "verified",
                "failed",
                "revoked",
                name="guarantor_request_status",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["request_id"], ["guarantor_requests.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_guarantor_request_history_request_id", "guarantor_request_history", ["request_id"]
    )
    op.create_index(
        "ix_guarantor_request_history_created_at", "guarantor_request_history", ["created_at"]
    )

    op.drop_index("ix_guarantor_documents_uploaded_at", table_name="guarantor_documents")
    op.drop_index("ix_guarantor_documents_request_id", table_name="guarantor_documents")
    op.drop_table("guarantor_documents")

    op.drop_index("ix_guarantor_signatures_signed_at", table_name="guarantor_signatures")
    op.drop_index("ix_guarantor_signatures_request_id", table_name="guarantor_signatures")
    op.drop_table("guarantor_signatures")

    op.drop_index("ix_guarantor_signing_events_created_at", table_name="guarantor_signing_events")
    op.drop_index("ix_guarantor_signing_events_request_id", table_name="guarantor_signing_events")
    op.drop_table("guarantor_signing_events")

    op.drop_index("ix_guarantor_invite_tokens_expires_at", table_name="guarantor_invite_tokens")
    op.drop_index("ix_guarantor_invite_tokens_request_id", table_name="guarantor_invite_tokens")
    op.drop_table("guarantor_invite_tokens")
