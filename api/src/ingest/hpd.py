"""HPD violations ingest (Socrata dataset `wvxf-dwi5`)."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from db.models import HpdViolations, IngestSource
from db.session import get_session_local
from ingest.runs import run_tracked
from ingest.socrata import iter_dataset_rows

DATASET_ID = "wvxf-dwi5"


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        return None


def _to_row(raw: dict[str, Any]) -> dict[str, Any]:
    return {
        "violation_id": str(raw.get("violationid") or raw.get("violation_id") or "").strip(),
        "bbl": str(raw.get("bbl") or "").strip() or None,
        "bin": str(raw.get("bin") or "").strip() or None,
        "violation_class": raw.get("class") or raw.get("classfull") or None,
        "status": raw.get("currentstatus") or raw.get("violationstatus"),
        "novissued_date": _parse_date(raw.get("novissueddate")),
        "certified_date": _parse_date(raw.get("certifieddate")),
        "apartment": raw.get("apartment"),
        "description": raw.get("novdescription") or raw.get("description"),
        "raw": raw,
    }


def run_ingest(max_pages: int | None = None) -> int:
    db: Session = get_session_local()()
    try:

        def work(watermark: datetime | None) -> int:
            where = None
            if watermark is not None:
                # Socrata requires naïve ISO without timezone for :updated_at comparisons.
                where = f":updated_at > '{watermark.replace(tzinfo=None).isoformat()}'"

            batch: list[dict[str, Any]] = []
            count = 0
            for raw in iter_dataset_rows(
                DATASET_ID,
                where=where,
                max_pages=max_pages,
            ):
                row = _to_row(raw)
                if not row["violation_id"]:
                    continue
                batch.append(row)
                if len(batch) >= 500:
                    count += _upsert(db, batch)
                    batch = []
            if batch:
                count += _upsert(db, batch)
            return count

        run = run_tracked(db, IngestSource.hpd_violations, work)
        return run.rows_upserted
    finally:
        db.close()


def _upsert(db: Session, rows: list[dict[str, Any]]) -> int:
    stmt = insert(HpdViolations).values(rows)
    stmt = stmt.on_conflict_do_update(
        index_elements=[HpdViolations.violation_id],
        set_={
            "bbl": stmt.excluded.bbl,
            "bin": stmt.excluded.bin,
            "violation_class": stmt.excluded.violation_class,
            "status": stmt.excluded.status,
            "novissued_date": stmt.excluded.novissued_date,
            "certified_date": stmt.excluded.certified_date,
            "apartment": stmt.excluded.apartment,
            "description": stmt.excluded.description,
            "raw": stmt.excluded.raw,
        },
    )
    db.execute(stmt)
    db.commit()
    return len(rows)


if __name__ == "__main__":
    import sys

    max_pages = int(sys.argv[1]) if len(sys.argv) > 1 else None
    print(f"Upserted {run_ingest(max_pages)} HPD violation rows.")
