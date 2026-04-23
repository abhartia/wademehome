"""DOB complaints ingest (Socrata dataset `eabe-havv`)."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from db.models import DobComplaints, IngestSource
from db.session import get_session_local
from ingest.runs import run_tracked
from ingest.socrata import iter_dataset_rows

DATASET_ID = "eabe-havv"


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        return None


def _to_row(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "complaint_number": str(raw.get("complaint_number") or raw.get("complaintnumber") or "").strip(),
        "bbl": str(raw.get("bbl") or "").strip() or None,
        "bin": str(raw.get("bin") or raw.get("bin_number") or "").strip() or None,
        "category": raw.get("complaint_category") or raw.get("category"),
        "status": raw.get("status") or raw.get("complaint_status"),
        "date_entered": _parse_date(raw.get("date_entered")),
        "resolution": raw.get("disposition_code") or raw.get("resolution"),
        "raw": raw,
    }


def run_ingest(max_pages: int | None = None) -> int:
    db: Session = get_session_local()()
    try:

        def work(watermark: datetime | None) -> int:
            where = None
            if watermark is not None:
                where = f":updated_at > '{watermark.replace(tzinfo=None).isoformat()}'"

            batch: list[dict[str, Any]] = []
            count = 0
            for raw in iter_dataset_rows(
                DATASET_ID,
                where=where,
                max_pages=max_pages,
            ):
                row = _to_row(raw)
                if not row["complaint_number"]:
                    continue
                batch.append(row)
                if len(batch) >= 500:
                    count += _upsert(db, batch)
                    batch = []
            if batch:
                count += _upsert(db, batch)
            return count

        run = run_tracked(db, IngestSource.dob_complaints, work)
        return run.rows_upserted
    finally:
        db.close()


def _upsert(db: Session, rows: list[dict[str, Any]]) -> int:
    stmt = insert(DobComplaints).values(rows)
    stmt = stmt.on_conflict_do_update(
        index_elements=[DobComplaints.complaint_number],
        set_={
            "bbl": stmt.excluded.bbl,
            "bin": stmt.excluded.bin,
            "category": stmt.excluded.category,
            "status": stmt.excluded.status,
            "date_entered": stmt.excluded.date_entered,
            "resolution": stmt.excluded.resolution,
            "raw": stmt.excluded.raw,
        },
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


if __name__ == "__main__":
    import sys

    max_pages = int(sys.argv[1]) if len(sys.argv) > 1 else None
    print(f"Upserted {run_ingest(max_pages)} DOB complaint rows.")
