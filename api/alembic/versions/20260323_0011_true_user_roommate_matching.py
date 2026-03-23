"""true user roommate matching

Revision ID: 20260323_0011
Revises: 20260323_0010
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260323_0011"
down_revision: Union[str, Sequence[str], None] = "20260323_0010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("roommate_profiles", sa.Column("name", sa.String(length=255), nullable=True))
    op.add_column("roommate_profiles", sa.Column("age", sa.Integer(), nullable=True))
    op.add_column(
        "roommate_profiles", sa.Column("occupation", sa.String(length=255), nullable=True)
    )

    op.drop_index("ix_roommate_candidate_catalog_target_city", table_name="roommate_candidate_catalog")
    op.drop_table("roommate_candidate_catalog")


def downgrade() -> None:
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
        sa.Column("languages_spoken", sa.JSON(), nullable=False),
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

    op.drop_column("roommate_profiles", "occupation")
    op.drop_column("roommate_profiles", "age")
    op.drop_column("roommate_profiles", "name")
