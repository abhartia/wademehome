"""add roommate language preferences

Revision ID: 20260323_0010
Revises: 20260323_0009
Create Date: 2026-03-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260323_0010"
down_revision: Union[str, Sequence[str], None] = "20260323_0009"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "roommate_profiles",
        sa.Column("languages_spoken", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )
    op.add_column(
        "roommate_profiles",
        sa.Column("preferred_languages", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )
    op.add_column(
        "roommate_profiles",
        sa.Column(
            "must_have_preferred_languages",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.add_column(
        "roommate_candidate_catalog",
        sa.Column("languages_spoken", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )

    op.execute(
        sa.text(
            """
            UPDATE roommate_candidate_catalog
            SET languages_spoken = CASE candidate_key
              WHEN 'r1' THEN '["English","Spanish"]'::json
              WHEN 'r2' THEN '["English","Hindi"]'::json
              WHEN 'r3' THEN '["English","Mandarin"]'::json
              ELSE '["English"]'::json
            END
            """
        )
    )

    op.alter_column("roommate_profiles", "languages_spoken", server_default=None)
    op.alter_column("roommate_profiles", "preferred_languages", server_default=None)
    op.alter_column("roommate_profiles", "must_have_preferred_languages", server_default=None)
    op.alter_column("roommate_candidate_catalog", "languages_spoken", server_default=None)


def downgrade() -> None:
    op.drop_column("roommate_candidate_catalog", "languages_spoken")
    op.drop_column("roommate_profiles", "must_have_preferred_languages")
    op.drop_column("roommate_profiles", "preferred_languages")
    op.drop_column("roommate_profiles", "languages_spoken")
