"""Add groups, group_members, group_invites, property_reactions; add group_id to favorites/notes/tours.

Revision ID: 20260417_0001
Revises: 20260403_0033
Create Date: 2026-04-17
"""
from alembic import op
import sqlalchemy as sa

revision = "20260417_0001"
down_revision = "20260403_0033"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── groups ────────────────────────────────────────────────────────
    op.create_table(
        "groups",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("created_by", sa.UUID(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_groups_created_by", "groups", ["created_by"])

    # ── group_members ─────────────────────────────────────────────────
    op.create_table(
        "group_members",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("group_id", sa.UUID(), sa.ForeignKey("groups.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(32), nullable=False, server_default="member"),
        sa.Column("joined_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("group_id", "user_id", name="uq_group_members_group_user"),
    )
    op.create_index("ix_group_members_user_id", "group_members", ["user_id"])
    op.create_index("ix_group_members_group_id", "group_members", ["group_id"])

    # ── group_invites ─────────────────────────────────────────────────
    op.create_table(
        "group_invites",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("group_id", sa.UUID(), sa.ForeignKey("groups.id", ondelete="CASCADE"), nullable=False),
        sa.Column("invited_by", sa.UUID(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("token", sa.String(96), nullable=False, unique=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("kind", sa.String(16), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("accepted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "accepted_by_user_id",
            sa.UUID(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_group_invites_group_id", "group_invites", ["group_id"])
    op.create_index("ix_group_invites_token", "group_invites", ["token"])

    # ── property_reactions ────────────────────────────────────────────
    op.create_table(
        "property_reactions",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("group_id", sa.UUID(), sa.ForeignKey("groups.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("property_key", sa.String(255), nullable=False),
        sa.Column("reaction", sa.String(32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint(
            "group_id", "user_id", "property_key", "reaction",
            name="uq_property_reactions_group_user_prop_kind",
        ),
    )
    op.create_index(
        "ix_property_reactions_group_property",
        "property_reactions",
        ["group_id", "property_key"],
    )

    # ── alter property_favorites ──────────────────────────────────────
    op.add_column(
        "property_favorites",
        sa.Column(
            "group_id",
            sa.UUID(),
            sa.ForeignKey("groups.id", ondelete="CASCADE"),
            nullable=True,
        ),
    )
    op.drop_constraint("uq_property_favorites_user_property", "property_favorites", type_="unique")
    # Personal favorites: one row per (user, property) when group_id IS NULL
    op.execute(
        "CREATE UNIQUE INDEX uq_property_favorites_personal "
        "ON property_favorites (user_id, property_key) WHERE group_id IS NULL"
    )
    # Group favorites: one row per (group, property) regardless of who added it
    op.execute(
        "CREATE UNIQUE INDEX uq_property_favorites_group "
        "ON property_favorites (group_id, property_key) WHERE group_id IS NOT NULL"
    )
    op.create_index("ix_property_favorites_group_id", "property_favorites", ["group_id"])

    # ── alter property_notes ──────────────────────────────────────────
    op.add_column(
        "property_notes",
        sa.Column(
            "group_id",
            sa.UUID(),
            sa.ForeignKey("groups.id", ondelete="CASCADE"),
            nullable=True,
        ),
    )
    op.drop_constraint("uq_property_notes_user_property", "property_notes", type_="unique")
    # Personal notes: one note per (user, property) when group_id IS NULL (upsert semantics)
    op.execute(
        "CREATE UNIQUE INDEX uq_property_notes_personal "
        "ON property_notes (user_id, property_key) WHERE group_id IS NULL"
    )
    # Group notes: threaded — no uniqueness constraint
    op.create_index("ix_property_notes_group_id", "property_notes", ["group_id"])

    # ── alter user_tours ──────────────────────────────────────────────
    op.add_column(
        "user_tours",
        sa.Column(
            "group_id",
            sa.UUID(),
            sa.ForeignKey("groups.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index("ix_user_tours_group_id", "user_tours", ["group_id"])


def downgrade() -> None:
    op.drop_index("ix_user_tours_group_id", table_name="user_tours")
    op.drop_column("user_tours", "group_id")

    op.drop_index("ix_property_notes_group_id", table_name="property_notes")
    op.execute("DROP INDEX IF EXISTS uq_property_notes_personal")
    op.drop_column("property_notes", "group_id")
    op.create_unique_constraint(
        "uq_property_notes_user_property",
        "property_notes",
        ["user_id", "property_key"],
    )

    op.drop_index("ix_property_favorites_group_id", table_name="property_favorites")
    op.execute("DROP INDEX IF EXISTS uq_property_favorites_group")
    op.execute("DROP INDEX IF EXISTS uq_property_favorites_personal")
    op.drop_column("property_favorites", "group_id")
    op.create_unique_constraint(
        "uq_property_favorites_user_property",
        "property_favorites",
        ["user_id", "property_key"],
    )

    op.drop_index("ix_property_reactions_group_property", table_name="property_reactions")
    op.drop_table("property_reactions")

    op.drop_index("ix_group_invites_token", table_name="group_invites")
    op.drop_index("ix_group_invites_group_id", table_name="group_invites")
    op.drop_table("group_invites")

    op.drop_index("ix_group_members_group_id", table_name="group_members")
    op.drop_index("ix_group_members_user_id", table_name="group_members")
    op.drop_table("group_members")

    op.drop_index("ix_groups_created_by", table_name="groups")
    op.drop_table("groups")
