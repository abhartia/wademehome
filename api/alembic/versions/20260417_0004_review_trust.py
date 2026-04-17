"""Review trust: verifications, landlord responses, moderation flags.

Revision ID: 20260417_0004
Revises: 20260417_0003
Create Date: 2026-04-17
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260417_0004"
down_revision = "20260417_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    review_verification_proof_type = postgresql.ENUM(
        "lease", "utility_bill", "rent_receipt", "mail",
        name="review_verification_proof_type",
    )
    review_verification_status = postgresql.ENUM(
        "pending", "approved", "rejected",
        name="review_verification_status",
    )
    review_flag_type = postgresql.ENUM(
        "defamation", "factual_error", "spam", "harassment", "off_topic", "other",
        name="review_flag_type",
    )
    review_flag_submitter_role = postgresql.ENUM(
        "tenant", "landlord", "public", "system",
        name="review_flag_submitter_role",
    )
    review_flag_status = postgresql.ENUM(
        "open", "accepted", "rejected",
        name="review_flag_status",
    )
    bind = op.get_bind()
    for enum in (
        review_verification_proof_type, review_verification_status,
        review_flag_type, review_flag_submitter_role, review_flag_status,
    ):
        enum.create(bind, checkfirst=True)

    # ── review_verifications ──────────────────────────────────────────
    op.create_table(
        "review_verifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("review_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("tenancy_start", sa.Date(), nullable=True),
        sa.Column("tenancy_end", sa.Date(), nullable=True),
        sa.Column(
            "proof_type",
            postgresql.ENUM(name="review_verification_proof_type", create_type=False),
            nullable=False,
        ),
        sa.Column("storage_key", sa.String(length=1024), nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(name="review_verification_status", create_type=False),
            nullable=False,
            server_default="pending",
        ),
        sa.Column("reviewed_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["review_id"], ["reviews.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["reviewed_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("review_id", name="uq_review_verifications_review_id"),
    )
    op.create_index("ix_review_verifications_status", "review_verifications", ["status"])
    op.create_index("ix_review_verifications_user_id", "review_verifications", ["user_id"])

    # ── review_responses ──────────────────────────────────────────────
    op.create_table(
        "review_responses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("review_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("author_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["review_id"], ["reviews.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["author_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("review_id", name="uq_review_responses_review_id"),
    )
    op.create_index("ix_review_responses_author_user_id", "review_responses", ["author_user_id"])

    # ── review_moderation ─────────────────────────────────────────────
    op.create_table(
        "review_moderation",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("review_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "flag_type",
            postgresql.ENUM(name="review_flag_type", create_type=False),
            nullable=False,
        ),
        sa.Column("submitted_by_user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "submitted_by_role",
            postgresql.ENUM(name="review_flag_submitter_role", create_type=False),
            nullable=False,
        ),
        sa.Column("details", sa.Text(), nullable=True),
        sa.Column(
            "status",
            postgresql.ENUM(name="review_flag_status", create_type=False),
            nullable=False,
            server_default="open",
        ),
        sa.Column("resolution_note", sa.Text(), nullable=True),
        sa.Column("resolved_by", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["review_id"], ["reviews.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["submitted_by_user_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["resolved_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_review_moderation_review_id", "review_moderation", ["review_id"])
    op.create_index("ix_review_moderation_status", "review_moderation", ["status"])


def downgrade() -> None:
    op.drop_index("ix_review_moderation_status", table_name="review_moderation")
    op.drop_index("ix_review_moderation_review_id", table_name="review_moderation")
    op.drop_table("review_moderation")

    op.drop_index("ix_review_responses_author_user_id", table_name="review_responses")
    op.drop_table("review_responses")

    op.drop_index("ix_review_verifications_user_id", table_name="review_verifications")
    op.drop_index("ix_review_verifications_status", table_name="review_verifications")
    op.drop_table("review_verifications")

    bind = op.get_bind()
    for name in (
        "review_flag_status", "review_flag_submitter_role", "review_flag_type",
        "review_verification_status", "review_verification_proof_type",
    ):
        sa.Enum(name=name).drop(bind, checkfirst=True)
