"""add vendor and roommate catalogs

Revision ID: 20260323_0009
Revises: 20260323_0008
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0009"
down_revision: Union[str, Sequence[str], None] = "20260323_0008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "vendor_catalog",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("vendor_key", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("initials", sa.String(length=8), nullable=False),
        sa.Column("rating", sa.Numeric(3, 1), nullable=False, server_default=sa.text("0.0")),
        sa.Column("review_count", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("website", sa.String(length=255), nullable=True),
        sa.Column("coverage_area", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("vendor_key", name="uq_vendor_catalog_vendor_key"),
    )
    op.create_index("ix_vendor_catalog_category", "vendor_catalog", ["category"])

    op.create_table(
        "vendor_catalog_plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("vendor_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("plan_key", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("price", sa.String(length=64), nullable=False),
        sa.Column("price_unit", sa.String(length=32), nullable=False),
        sa.Column("features", sa.JSON(), nullable=False),
        sa.Column("popular", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.ForeignKeyConstraint(["vendor_id"], ["vendor_catalog.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("plan_key", name="uq_vendor_catalog_plans_plan_key"),
    )
    op.create_index("ix_vendor_catalog_plans_vendor_id", "vendor_catalog_plans", ["vendor_id"])

    op.create_table(
        "roommate_candidate_catalog",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("candidate_key", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("occupation", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("bio", sa.Text(), nullable=False, server_default=""),
        sa.Column("avatar_initials", sa.String(length=16), nullable=False, server_default=""),
        sa.Column("sleep_schedule", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("cleanliness_level", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("noise_level", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("guest_policy", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("smoking", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("target_city", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("max_budget", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("move_timeline", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("bedrooms_wanted", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("has_pets", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("pet_details", sa.Text(), nullable=False, server_default=""),
        sa.Column("interests", sa.JSON(), nullable=False),
        sa.Column("university", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("candidate_key", name="uq_roommate_candidate_catalog_candidate_key"),
    )
    op.create_index(
        "ix_roommate_candidate_catalog_target_city",
        "roommate_candidate_catalog",
        ["target_city"],
    )

    op.execute(
        sa.text(
            """
            INSERT INTO vendor_catalog (id, vendor_key, name, category, initials, rating, review_count, phone, website, coverage_area)
            VALUES
              (gen_random_uuid(), 'v-coned', 'Con Edison', 'electric', 'CE', 3.8, 12400, '(800) 752-6633', 'coned.com', 'NYC, Westchester'),
              (gen_random_uuid(), 'v-fios', 'Verizon Fios', 'internet', 'VF', 4.2, 18600, '(800) 837-4966', 'verizon.com/fios', 'NYC, NJ, CT'),
              (gen_random_uuid(), 'v-flatrate', 'FlatRate Moving', 'movers', 'FR', 4.4, 3200, '(212) 988-1543', 'flatrate.com', 'NYC metro area')
            """
        )
    )
    op.execute(
        sa.text(
            """
            INSERT INTO vendor_catalog_plans (id, vendor_id, plan_key, name, price, price_unit, features, popular)
            SELECT gen_random_uuid(), v.id, p.plan_key, p.name, p.price, p.price_unit, p.features::json, p.popular
            FROM vendor_catalog v
            JOIN (
              VALUES
                ('v-coned','p-coned-std','Standard Residential','$0.22','/kWh','["Default supply rate","No contract required","Budget billing available"]',true),
                ('v-fios','p-fios-300','300 Mbps','$49.99','/mo','["Fiber optic","No data caps","Free router included"]',true),
                ('v-flatrate','p-flat-full','Full Service','$150','/hr','["Packing + unpacking","Disassembly + reassembly","3 hr minimum"]',true)
            ) AS p(vendor_key, plan_key, name, price, price_unit, features, popular)
              ON p.vendor_key = v.vendor_key
            """
        )
    )
    op.execute(
        sa.text(
            """
            INSERT INTO roommate_candidate_catalog
              (id, candidate_key, name, age, occupation, bio, avatar_initials, sleep_schedule, cleanliness_level, noise_level, guest_policy, smoking, target_city, max_budget, move_timeline, bedrooms_wanted, has_pets, pet_details, interests, university)
            VALUES
              (gen_random_uuid(), 'r1', 'Jordan Rivera', 24, 'Software Engineer', 'Fintech engineer, cooks often and keeps common spaces tidy.', 'JR', 'night-owl', 'tidy', 'moderate', 'sometimes', 'no', 'New York', '$2,000 - $3,000', '1-2 months', '2 bedrooms', false, '', '["Cooking","Music","Tech","Fitness"]', 'NYU'),
              (gen_random_uuid(), 'r2', 'Priya Sharma', 22, 'Graduate Student', 'Data science student, early riser, calm weekday routine.', 'PS', 'early-bird', 'very-tidy', 'quiet', 'rarely', 'no', 'New York', '$1,500 - $2,000', '1-2 months', '2 bedrooms', false, '', '["Fitness","Reading","Hiking","Photography"]', 'Columbia'),
              (gen_random_uuid(), 'r3', 'Marcus Chen', 26, 'UX Designer', 'Startup designer who likes social game nights and shared cooking.', 'MC', 'flexible', 'tidy', 'social', 'often', 'no', 'Austin', '$1,000 - $1,500', '1-2 months', '2 bedrooms', true, 'Cat', '["Gaming","Art","Cooking","Movies"]', null)
            """
        )
    )


def downgrade() -> None:
    op.drop_index("ix_roommate_candidate_catalog_target_city", table_name="roommate_candidate_catalog")
    op.drop_table("roommate_candidate_catalog")
    op.drop_index("ix_vendor_catalog_plans_vendor_id", table_name="vendor_catalog_plans")
    op.drop_table("vendor_catalog_plans")
    op.drop_index("ix_vendor_catalog_category", table_name="vendor_catalog")
    op.drop_table("vendor_catalog")
