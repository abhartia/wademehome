"""NYC OpenData ingest: HPD violations, DOB complaints, ACRIS, ingest-run audit.

Revision ID: 20260417_0005
Revises: 20260417_0004
Create Date: 2026-04-17
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "20260417_0005"
down_revision = "20260417_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    ingest_source = postgresql.ENUM(
        "hpd_violations", "dob_complaints",
        "acris_documents", "acris_parties",
        "geosupport",
        name="ingest_source",
    )
    ingest_status = postgresql.ENUM(
        "running", "completed", "failed",
        name="ingest_status",
    )
    bind = op.get_bind()
    ingest_source.create(bind, checkfirst=True)
    ingest_status.create(bind, checkfirst=True)

    op.create_table(
        "hpd_violations",
        sa.Column("violation_id", sa.String(length=32), nullable=False),
        sa.Column("bbl", sa.String(length=10), nullable=True),
        sa.Column("bin", sa.String(length=7), nullable=True),
        sa.Column("violation_class", sa.String(length=8), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=True),
        sa.Column("novissued_date", sa.Date(), nullable=True),
        sa.Column("certified_date", sa.Date(), nullable=True),
        sa.Column("apartment", sa.String(length=32), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("raw", postgresql.JSONB(), nullable=True),
        sa.Column("ingested_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("violation_id"),
    )
    op.create_index("ix_hpd_violations_bbl", "hpd_violations", ["bbl"])
    op.create_index("ix_hpd_violations_bin", "hpd_violations", ["bin"])
    op.create_index("ix_hpd_violations_status", "hpd_violations", ["status"])

    op.create_table(
        "dob_complaints",
        sa.Column("complaint_number", sa.String(length=32), nullable=False),
        sa.Column("bbl", sa.String(length=10), nullable=True),
        sa.Column("bin", sa.String(length=7), nullable=True),
        sa.Column("category", sa.String(length=64), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=True),
        sa.Column("date_entered", sa.Date(), nullable=True),
        sa.Column("resolution", sa.Text(), nullable=True),
        sa.Column("raw", postgresql.JSONB(), nullable=True),
        sa.Column("ingested_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("complaint_number"),
    )
    op.create_index("ix_dob_complaints_bbl", "dob_complaints", ["bbl"])
    op.create_index("ix_dob_complaints_bin", "dob_complaints", ["bin"])
    op.create_index("ix_dob_complaints_status", "dob_complaints", ["status"])

    op.create_table(
        "acris_documents",
        sa.Column("document_id", sa.String(length=32), nullable=False),
        sa.Column("doc_type", sa.String(length=32), nullable=True),
        sa.Column("recorded_datetime", sa.DateTime(timezone=True), nullable=True),
        sa.Column("bbl", sa.String(length=10), nullable=True),
        sa.Column("raw", postgresql.JSONB(), nullable=True),
        sa.Column("ingested_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("document_id"),
    )
    op.create_index("ix_acris_documents_bbl", "acris_documents", ["bbl"])
    op.create_index(
        "ix_acris_documents_recorded_datetime",
        "acris_documents",
        ["recorded_datetime"],
    )

    op.create_table(
        "acris_parties",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("document_id", sa.String(length=32), nullable=False),
        sa.Column("party_type", sa.String(length=16), nullable=True),
        sa.Column("name", sa.String(length=512), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("role", sa.String(length=32), nullable=True),
        sa.Column("raw", postgresql.JSONB(), nullable=True),
        sa.ForeignKeyConstraint(
            ["document_id"], ["acris_documents.document_id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_acris_parties_document_id", "acris_parties", ["document_id"])
    op.create_index("ix_acris_parties_name", "acris_parties", ["name"])

    op.create_table(
        "data_ingest_runs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "source",
            postgresql.ENUM(name="ingest_source", create_type=False),
            nullable=False,
        ),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rows_upserted", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "status",
            postgresql.ENUM(name="ingest_status", create_type=False),
            nullable=False,
            server_default="running",
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_data_ingest_runs_source_started",
        "data_ingest_runs",
        ["source", "started_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_data_ingest_runs_source_started", table_name="data_ingest_runs")
    op.drop_table("data_ingest_runs")

    op.drop_index("ix_acris_parties_name", table_name="acris_parties")
    op.drop_index("ix_acris_parties_document_id", table_name="acris_parties")
    op.drop_table("acris_parties")

    op.drop_index("ix_acris_documents_recorded_datetime", table_name="acris_documents")
    op.drop_index("ix_acris_documents_bbl", table_name="acris_documents")
    op.drop_table("acris_documents")

    op.drop_index("ix_dob_complaints_status", table_name="dob_complaints")
    op.drop_index("ix_dob_complaints_bin", table_name="dob_complaints")
    op.drop_index("ix_dob_complaints_bbl", table_name="dob_complaints")
    op.drop_table("dob_complaints")

    op.drop_index("ix_hpd_violations_status", table_name="hpd_violations")
    op.drop_index("ix_hpd_violations_bin", table_name="hpd_violations")
    op.drop_index("ix_hpd_violations_bbl", table_name="hpd_violations")
    op.drop_table("hpd_violations")

    bind = op.get_bind()
    sa.Enum(name="ingest_status").drop(bind, checkfirst=True)
    sa.Enum(name="ingest_source").drop(bind, checkfirst=True)
