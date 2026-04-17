"""Review system core: buildings, landlord_entities, ownership, reviews, subratings.

Revision ID: 20260417_0003
Revises: 20260417_0002
Create Date: 2026-04-17
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260417_0003"
down_revision = "20260417_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Required for the exclusion constraint on building_ownership_periods.
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")

    # ── Enum types ────────────────────────────────────────────────────
    landlord_entity_kind = postgresql.ENUM(
        "individual", "llc", "corp", "mgmt_company", "unknown",
        name="landlord_entity_kind",
    )
    landlord_alias_type = postgresql.ENUM(
        "llc_name", "dba", "principal_name", "acris_party",
        "email", "phone", "address",
        name="landlord_alias_type",
    )
    landlord_alias_source = postgresql.ENUM(
        "acris", "crowdsourced", "admin", "claimed",
        name="landlord_alias_source",
    )
    ownership_role = postgresql.ENUM(
        "owner", "manager", name="ownership_role",
    )
    ownership_source = postgresql.ENUM(
        "acris_deed", "crowdsourced", "claimed", "admin",
        name="ownership_source",
    )
    review_status = postgresql.ENUM(
        "draft", "pending_cooldown", "published", "flagged", "hidden", "removed",
        name="review_status",
    )
    review_landlord_relation = postgresql.ENUM(
        "owner", "manager", "both",
        name="review_landlord_relation",
    )
    review_dimension = postgresql.ENUM(
        "responsiveness", "maintenance", "deposit_return",
        "heat_hot_water", "pest_control", "harassment",
        "building_condition", "noise", "value",
        name="review_dimension",
    )
    bind = op.get_bind()
    for enum in (
        landlord_entity_kind, landlord_alias_type, landlord_alias_source,
        ownership_role, ownership_source,
        review_status, review_landlord_relation, review_dimension,
    ):
        enum.create(bind, checkfirst=True)

    # ── buildings ─────────────────────────────────────────────────────
    op.create_table(
        "buildings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("bbl", sa.String(length=10), nullable=True),
        sa.Column("bin", sa.String(length=7), nullable=True),
        sa.Column("borough", sa.Integer(), nullable=True),
        sa.Column("street_line1", sa.String(length=255), nullable=False),
        sa.Column("unit_count", sa.Integer(), nullable=True),
        sa.Column("city", sa.String(length=128), nullable=False, server_default="New York"),
        sa.Column("state", sa.String(length=64), nullable=False, server_default="NY"),
        sa.Column("postal_code", sa.String(length=32), nullable=True),
        sa.Column("latitude", sa.Numeric(10, 7), nullable=False),
        sa.Column("longitude", sa.Numeric(11, 7), nullable=False),
        sa.Column("normalized_addr", sa.String(length=512), nullable=False),
        sa.Column("geohash", sa.String(length=12), nullable=True),
        sa.Column("building_group_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["building_group_id"], ["buildings.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("bbl", "bin", name="uq_buildings_bbl_bin"),
    )
    op.create_index("ix_buildings_bbl", "buildings", ["bbl"])
    op.create_index("ix_buildings_bin", "buildings", ["bin"])
    op.create_index("ix_buildings_normalized_addr", "buildings", ["normalized_addr"])
    op.create_index("ix_buildings_borough", "buildings", ["borough"])

    # ── landlord_entities ─────────────────────────────────────────────
    op.create_table(
        "landlord_entities",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "kind",
            postgresql.ENUM(name="landlord_entity_kind", create_type=False),
            nullable=False,
        ),
        sa.Column("canonical_name", sa.String(length=512), nullable=False),
        sa.Column("claimed_profile_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("head_entity_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("portfolio_size_cached", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("avg_rating_cached", sa.Numeric(3, 2), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["claimed_profile_id"], ["landlord_profiles.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["head_entity_id"], ["landlord_entities.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_landlord_entities_head_entity_id", "landlord_entities", ["head_entity_id"])
    op.create_index(
        "ix_landlord_entities_claimed_profile_id",
        "landlord_entities",
        ["claimed_profile_id"],
    )
    op.create_index("ix_landlord_entities_canonical_name", "landlord_entities", ["canonical_name"])

    # ── landlord_entity_aliases ───────────────────────────────────────
    op.create_table(
        "landlord_entity_aliases",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "alias_type",
            postgresql.ENUM(name="landlord_alias_type", create_type=False),
            nullable=False,
        ),
        sa.Column("value", sa.String(length=512), nullable=False),
        sa.Column(
            "source",
            postgresql.ENUM(name="landlord_alias_source", create_type=False),
            nullable=False,
        ),
        sa.Column("confidence", sa.Numeric(3, 2), nullable=True),
        sa.Column("verified_by_admin", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["entity_id"], ["landlord_entities.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("alias_type", "value", name="uq_landlord_entity_aliases_type_value"),
    )
    op.create_index(
        "ix_landlord_entity_aliases_entity_id",
        "landlord_entity_aliases",
        ["entity_id"],
    )

    # ── building_ownership_periods ────────────────────────────────────
    op.create_table(
        "building_ownership_periods",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("building_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("landlord_entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "role",
            postgresql.ENUM(name="ownership_role", create_type=False),
            nullable=False,
            server_default="owner",
        ),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column(
            "source",
            postgresql.ENUM(name="ownership_source", create_type=False),
            nullable=False,
        ),
        sa.Column("acris_document_id", sa.String(length=64), nullable=True),
        sa.Column("confidence", sa.Numeric(3, 2), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["building_id"], ["buildings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["landlord_entity_id"], ["landlord_entities.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_building_ownership_periods_building_id_start",
        "building_ownership_periods",
        ["building_id", "start_date"],
    )
    op.create_index(
        "ix_building_ownership_periods_landlord_entity_id",
        "building_ownership_periods",
        ["landlord_entity_id"],
    )
    op.create_index(
        "ix_building_ownership_periods_role",
        "building_ownership_periods",
        ["role"],
    )

    # Enforce: only one current "owner" period per building can overlap any
    # given date range. Manager periods may overlap freely.
    op.execute(
        """
        ALTER TABLE building_ownership_periods
        ADD CONSTRAINT ex_building_ownership_no_owner_overlap
        EXCLUDE USING gist (
            building_id WITH =,
            daterange(start_date, COALESCE(end_date, 'infinity'::date), '[)') WITH &&
        )
        WHERE (role = 'owner')
        """
    )

    # ── reviews ───────────────────────────────────────────────────────
    op.create_table(
        "reviews",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("author_user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("building_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("landlord_entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("ownership_period_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column(
            "landlord_relation",
            postgresql.ENUM(name="review_landlord_relation", create_type=False),
            nullable=False,
            server_default="both",
        ),
        sa.Column("tenancy_start", sa.Date(), nullable=False),
        sa.Column("tenancy_end", sa.Date(), nullable=True),
        sa.Column("overall_rating", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("verified_tenant", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column(
            "status",
            postgresql.ENUM(name="review_status", create_type=False),
            nullable=False,
            server_default="pending_cooldown",
        ),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("overall_rating BETWEEN 1 AND 5", name="ck_reviews_overall_rating_range"),
        sa.ForeignKeyConstraint(["author_user_id"], ["users.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["building_id"], ["buildings.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["landlord_entity_id"], ["landlord_entities.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(
            ["ownership_period_id"],
            ["building_ownership_periods.id"],
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reviews_building_id", "reviews", ["building_id"])
    op.create_index("ix_reviews_landlord_entity_id", "reviews", ["landlord_entity_id"])
    op.create_index("ix_reviews_author_user_id", "reviews", ["author_user_id"])
    op.create_index("ix_reviews_status", "reviews", ["status"])

    # ── review_subratings ─────────────────────────────────────────────
    op.create_table(
        "review_subratings",
        sa.Column("review_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "dimension",
            postgresql.ENUM(name="review_dimension", create_type=False),
            nullable=False,
        ),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.CheckConstraint("score BETWEEN 1 AND 5", name="ck_review_subratings_score_range"),
        sa.ForeignKeyConstraint(["review_id"], ["reviews.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("review_id", "dimension"),
    )


def downgrade() -> None:
    op.drop_table("review_subratings")

    op.drop_index("ix_reviews_status", table_name="reviews")
    op.drop_index("ix_reviews_author_user_id", table_name="reviews")
    op.drop_index("ix_reviews_landlord_entity_id", table_name="reviews")
    op.drop_index("ix_reviews_building_id", table_name="reviews")
    op.drop_table("reviews")

    op.execute(
        "ALTER TABLE building_ownership_periods "
        "DROP CONSTRAINT IF EXISTS ex_building_ownership_no_owner_overlap"
    )
    op.drop_index("ix_building_ownership_periods_role", table_name="building_ownership_periods")
    op.drop_index(
        "ix_building_ownership_periods_landlord_entity_id",
        table_name="building_ownership_periods",
    )
    op.drop_index(
        "ix_building_ownership_periods_building_id_start",
        table_name="building_ownership_periods",
    )
    op.drop_table("building_ownership_periods")

    op.drop_index(
        "ix_landlord_entity_aliases_entity_id",
        table_name="landlord_entity_aliases",
    )
    op.drop_table("landlord_entity_aliases")

    op.drop_index("ix_landlord_entities_canonical_name", table_name="landlord_entities")
    op.drop_index(
        "ix_landlord_entities_claimed_profile_id",
        table_name="landlord_entities",
    )
    op.drop_index("ix_landlord_entities_head_entity_id", table_name="landlord_entities")
    op.drop_table("landlord_entities")

    op.drop_index("ix_buildings_borough", table_name="buildings")
    op.drop_index("ix_buildings_normalized_addr", table_name="buildings")
    op.drop_index("ix_buildings_bin", table_name="buildings")
    op.drop_index("ix_buildings_bbl", table_name="buildings")
    op.drop_table("buildings")

    bind = op.get_bind()
    for name in (
        "review_dimension", "review_landlord_relation", "review_status",
        "ownership_source", "ownership_role",
        "landlord_alias_source", "landlord_alias_type", "landlord_entity_kind",
    ):
        sa.Enum(name=name).drop(bind, checkfirst=True)
