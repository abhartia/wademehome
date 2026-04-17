from __future__ import annotations

from datetime import datetime
from typing import Callable

from sqlalchemy import select
from sqlalchemy.orm import Session

from auth.security import utc_now
from db.models import DataIngestRuns, IngestSource, IngestStatus


def last_successful_watermark(db: Session, source: IngestSource) -> datetime | None:
    row = db.execute(
        select(DataIngestRuns)
        .where(
            DataIngestRuns.source == source,
            DataIngestRuns.status == IngestStatus.completed,
        )
        .order_by(DataIngestRuns.finished_at.desc())
        .limit(1)
    ).scalar_one_or_none()
    return row.finished_at if row else None


def run_tracked(
    db: Session,
    source: IngestSource,
    work: Callable[[datetime | None], int],
) -> DataIngestRuns:
    """Wrap `work` with a `data_ingest_runs` row; work() returns row-count."""
    watermark = last_successful_watermark(db, source)
    run = DataIngestRuns(source=source, started_at=utc_now(), status=IngestStatus.running)
    db.add(run)
    db.commit()
    db.refresh(run)
    try:
        rows_upserted = work(watermark)
    except Exception as exc:  # noqa: BLE001 - every failure is recorded
        run.status = IngestStatus.failed
        run.finished_at = utc_now()
        run.notes = str(exc)[:500]
        db.commit()
        raise
    run.rows_upserted = rows_upserted
    run.status = IngestStatus.completed
    run.finished_at = utc_now()
    db.commit()
    db.refresh(run)
    return run
