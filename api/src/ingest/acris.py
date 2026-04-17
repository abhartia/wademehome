"""ACRIS ingest: real-property documents + parties.

Socrata datasets:
  - bnx9-e6tj  ACRIS - Real Property Master (document header)
  - 636b-3b5g  ACRIS - Real Property Parties (one row per party per document)

This job pulls new documents with `DEED` / related doc types and writes
matching `landlord_entity_aliases` candidates. It does NOT auto-approve
ownership periods — those require admin confirmation via the admin UI because
raw ACRIS party names collide badly (shell LLCs, P.O. box addresses, etc.).
"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from auth.security import utc_now
from db.models import (
    AcrisDocuments,
    AcrisParties,
    IngestSource,
    LandlordAliasSource,
    LandlordAliasType,
    LandlordEntities,
    LandlordEntityAliases,
    LandlordEntityKind,
)
from db.session import get_session_local
from ingest.runs import run_tracked
from ingest.socrata import iter_dataset_rows

DOCUMENTS_DATASET = "bnx9-e6tj"
PARTIES_DATASET = "636b-3b5g"

# ACRIS doc-type codes that imply a change of record ownership.
OWNERSHIP_DOC_TYPES = {"DEED", "DEEDS", "DEED, NYC", "DEEDS, NYC", "DEED - OWNER"}


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _doc_row(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "document_id": str(raw.get("document_id") or "").strip(),
        "doc_type": raw.get("doc_type"),
        "recorded_datetime": _parse_dt(raw.get("recorded_datetime")),
        "bbl": _bbl_from_raw(raw),
        "raw": raw,
    }


def _bbl_from_raw(raw: dict[str, Any]) -> str | None:
    """Build a 10-digit BBL from ACRIS borough/block/lot fields."""
    borough = raw.get("borough")
    block = raw.get("block")
    lot = raw.get("lot")
    if borough is None or block is None or lot is None:
        return None
    try:
        return f"{int(borough)}{int(block):05d}{int(lot):04d}"
    except (TypeError, ValueError):
        return None


def _party_row(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "document_id": str(raw.get("document_id") or "").strip(),
        "party_type": str(raw.get("party_type") or "").strip() or None,
        "name": raw.get("name"),
        "address": _format_address(raw),
        "role": _party_role(raw.get("party_type")),
        "raw": raw,
    }


def _format_address(raw: dict[str, Any]) -> str | None:
    parts = [
        raw.get("address_1") or "",
        raw.get("address_2") or "",
        raw.get("city") or "",
        raw.get("state") or "",
        raw.get("zip") or "",
    ]
    out = ", ".join(p for p in (str(p).strip() for p in parts) if p)
    return out or None


def _party_role(party_type: str | None) -> str | None:
    # ACRIS: party_type '1' = grantor (seller), '2' = grantee (buyer).
    if party_type == "1":
        return "grantor"
    if party_type == "2":
        return "grantee"
    return party_type or None


def run_documents_ingest(max_pages: int | None = None) -> int:
    db: Session = get_session_local()()
    try:
        def work(watermark: datetime | None) -> int:
            # Restrict to ownership-relevant doc types.
            doc_filter = " OR ".join(f"doc_type='{dt}'" for dt in sorted(OWNERSHIP_DOC_TYPES))
            where = f"({doc_filter})"
            if watermark is not None:
                where = (
                    f"{where} AND :updated_at > '{watermark.replace(tzinfo=None).isoformat()}'"
                )

            batch: list[dict[str, Any]] = []
            count = 0
            for raw in iter_dataset_rows(
                DOCUMENTS_DATASET, where=where, max_pages=max_pages
            ):
                row = _doc_row(raw)
                if not row["document_id"]:
                    continue
                batch.append(row)
                if len(batch) >= 500:
                    count += _upsert_documents(db, batch)
                    batch = []
            if batch:
                count += _upsert_documents(db, batch)
            return count

        run = run_tracked(db, IngestSource.acris_documents, work)
        return run.rows_upserted
    finally:
        db.close()


def _upsert_documents(db: Session, rows: list[dict[str, Any]]) -> int:
    stmt = insert(AcrisDocuments).values(rows)
    stmt = stmt.on_conflict_do_update(
        index_elements=[AcrisDocuments.document_id],
        set_={
            "doc_type": stmt.excluded.doc_type,
            "recorded_datetime": stmt.excluded.recorded_datetime,
            "bbl": stmt.excluded.bbl,
            "raw": stmt.excluded.raw,
        },
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


def run_parties_ingest(max_pages: int | None = None) -> int:
    db: Session = get_session_local()()
    try:
        def work(watermark: datetime | None) -> int:
            where = None
            if watermark is not None:
                where = f":updated_at > '{watermark.replace(tzinfo=None).isoformat()}'"

            batch: list[dict[str, Any]] = []
            count = 0
            known_docs: set[str] = set()
            for raw in iter_dataset_rows(
                PARTIES_DATASET, where=where, max_pages=max_pages
            ):
                row = _party_row(raw)
                if not row["document_id"] or not row["name"]:
                    continue
                # Only keep parties for documents we've already ingested so we
                # can FK back cleanly.
                if row["document_id"] not in known_docs:
                    exists = db.execute(
                        select(AcrisDocuments.document_id).where(
                            AcrisDocuments.document_id == row["document_id"]
                        )
                    ).scalar_one_or_none()
                    if exists is None:
                        continue
                    known_docs.add(row["document_id"])
                batch.append(row)
                if len(batch) >= 500:
                    count += _upsert_parties(db, batch)
                    batch = []
            if batch:
                count += _upsert_parties(db, batch)
            _promote_grantees_to_aliases(db)
            return count

        run = run_tracked(db, IngestSource.acris_parties, work)
        return run.rows_upserted
    finally:
        db.close()


def _upsert_parties(db: Session, rows: list[dict[str, Any]]) -> int:
    # Parties table has surrogate UUID PK so we do INSERT-ignore on a synthetic
    # (document_id, name, party_type) tuple via an exists-first check.
    inserted = 0
    for row in rows:
        exists = db.execute(
            select(AcrisParties.id).where(
                AcrisParties.document_id == row["document_id"],
                AcrisParties.name == row["name"],
                AcrisParties.party_type == row["party_type"],
            )
        ).scalar_one_or_none()
        if exists is None:
            db.add(AcrisParties(**row))
            inserted += 1
    db.commit()
    return inserted


def _promote_grantees_to_aliases(db: Session) -> None:
    """For every new grantee party, ensure a landlord_entity + alias exists."""
    parties = db.execute(
        select(AcrisParties).where(AcrisParties.role == "grantee")
    ).scalars().all()

    for p in parties:
        if not p.name:
            continue
        alias = db.execute(
            select(LandlordEntityAliases).where(
                LandlordEntityAliases.alias_type == LandlordAliasType.acris_party,
                LandlordEntityAliases.value == p.name,
            )
        ).scalar_one_or_none()
        if alias is not None:
            continue

        # Create a new entity for this party. Admin can merge later.
        entity = LandlordEntities(
            kind=LandlordEntityKind.llc,
            canonical_name=p.name,
        )
        db.add(entity)
        db.flush()
        db.add(
            LandlordEntityAliases(
                entity_id=entity.id,
                alias_type=LandlordAliasType.acris_party,
                value=p.name,
                source=LandlordAliasSource.acris,
                confidence=Decimal("0.7"),
                verified_by_admin=False,
            )
        )
    db.commit()


if __name__ == "__main__":
    import sys
    max_pages = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    print(f"ACRIS documents upserted: {run_documents_ingest(max_pages)}")
    print(f"ACRIS parties upserted:   {run_parties_ingest(max_pages)}")
