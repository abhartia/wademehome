"""add roommate_search_enabled to user_profiles

Revision ID: 20260322_0005
Revises: 20260321_0004
Create Date: 2026-03-22 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260322_0005"
down_revision: Union[str, Sequence[str], None] = "20260321_0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_profiles",
        sa.Column(
            "roommate_search_enabled",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.execute(
        sa.text(
            "UPDATE user_profiles SET roommate_search_enabled = true "
            "WHERE living_arrangement = 'roommates'"
        )
    )


def downgrade() -> None:
    op.drop_column("user_profiles", "roommate_search_enabled")
