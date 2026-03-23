"""tours constraints and listing indexes

Revision ID: 20260323_0008
Revises: 20260322_0007
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260323_0008"
down_revision: Union[str, Sequence[str], None] = "20260322_0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Keep only the newest note per tour before adding uniqueness.
    op.execute(
        sa.text(
            """
            DELETE FROM tour_notes tn
            USING tour_notes newer
            WHERE tn.tour_id = newer.tour_id
              AND (
                tn.created_at < newer.created_at
                OR (tn.created_at = newer.created_at AND tn.id::text < newer.id::text)
              )
            """
        )
    )
    op.create_unique_constraint("uq_tour_notes_tour_id", "tour_notes", ["tour_id"])
    op.create_index(
        "ix_user_tours_user_created_at",
        "user_tours",
        ["user_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_user_tours_user_created_at", table_name="user_tours")
    op.drop_constraint("uq_tour_notes_tour_id", "tour_notes", type_="unique")
