from __future__ import annotations

import uuid
from datetime import date, datetime, time, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session

from db.models import TourNotes, TourStatus, UserTours
from tours.schemas import (
    TourCreate,
    TourNotePayload,
    TourPayload,
    TourPropertyPayload,
    TourSortParams,
    TourUpdate,
)


def _parse_date(raw: str | None) -> date | None:
    if raw is None:
        return None
    value = raw.strip()
    if not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid scheduled_date format")


def _parse_time(raw: str | None) -> time | None:
    if raw is None:
        return None
    value = raw.strip()
    if not value:
        return None
    for fmt in ("%H:%M", "%I:%M %p", "%I:%M%p"):
        try:
            return datetime.strptime(value, fmt).time()
        except ValueError:
            continue
    raise HTTPException(status_code=422, detail="Invalid scheduled_time format")


def _status_from_str(raw: str) -> TourStatus:
    for status in TourStatus:
        if status.value == raw:
            return status
    raise HTTPException(status_code=422, detail="Invalid tour status")


def _note_payload(note: TourNotes | None) -> TourNotePayload | None:
    if note is None:
        return None
    return TourNotePayload(
        ratings=note.ratings_json or {},
        pros=note.pros or "",
        cons=note.cons or "",
        general_notes=note.general_notes or "",
        would_apply=note.would_apply,
        photo_checklist=list(note.photo_checklist_json or []),
        updated_at=note.updated_at.isoformat() if note.updated_at else "",
    )


def _tour_payload(row: UserTours, note: TourNotes | None) -> TourPayload:
    scheduled_date = row.tour_date.isoformat() if row.tour_date else ""
    scheduled_time = row.tour_time.isoformat(timespec="minutes") if row.tour_time else ""
    return TourPayload(
        id=str(row.id),
        property=TourPropertyPayload(
            id=row.property_ref_id or "",
            name=row.property_name,
            address=row.property_address,
            rent=row.property_price or "",
            beds=row.property_beds or "",
            image=row.property_image or "",
            tags=list(row.property_tags or []),
        ),
        status=row.status.value,
        scheduled_date=scheduled_date,
        scheduled_time=scheduled_time,
        note=_note_payload(note),
        created_at=row.created_at.isoformat() if row.created_at else "",
    )


def _tour_query_for_user(user_id: uuid.UUID) -> Select[tuple[UserTours]]:
    return select(UserTours).where(UserTours.user_id == user_id)


def _apply_filters(query: Select[tuple[UserTours]], params: TourSortParams) -> Select[tuple[UserTours]]:
    if params.status:
        query = query.where(UserTours.status == _status_from_str(params.status))
    if params.from_date:
        query = query.where(UserTours.tour_date >= params.from_date)
    if params.to_date:
        query = query.where(UserTours.tour_date <= params.to_date)
    if params.q:
        term = f"%{params.q.strip()}%"
        query = query.where(
            or_(UserTours.property_name.ilike(term), UserTours.property_address.ilike(term))
        )
    return query


def _apply_sort(query: Select[tuple[UserTours]], sort: str) -> Select[tuple[UserTours]]:
    if sort == "created_at_asc":
        return query.order_by(UserTours.created_at.asc())
    if sort == "tour_date_asc":
        return query.order_by(UserTours.tour_date.asc().nulls_last(), UserTours.created_at.desc())
    if sort == "tour_date_desc":
        return query.order_by(UserTours.tour_date.desc().nulls_last(), UserTours.created_at.desc())
    return query.order_by(UserTours.created_at.desc())


def _get_note_map(db: Session, tour_ids: list[uuid.UUID]) -> dict[uuid.UUID, TourNotes]:
    if not tour_ids:
        return {}
    rows = db.execute(select(TourNotes).where(TourNotes.tour_id.in_(tour_ids))).scalars().all()
    return {row.tour_id: row for row in rows}


def list_tours(db: Session, user_id: uuid.UUID, params: TourSortParams) -> tuple[list[TourPayload], int]:
    base_query = _apply_filters(_tour_query_for_user(user_id), params)
    all_rows = db.execute(base_query).scalars().all()
    total = len(all_rows)
    query = _apply_sort(base_query, params.sort).limit(params.limit).offset(params.offset)
    rows = db.execute(query).scalars().all()
    notes = _get_note_map(db, [row.id for row in rows])
    payload = [_tour_payload(row, notes.get(row.id)) for row in rows]
    return payload, total


def get_tour_or_404(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> UserTours:
    row = db.execute(
        select(UserTours).where(UserTours.id == tour_id, UserTours.user_id == user_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour not found")
    return row


def get_tour_payload(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> TourPayload:
    row = get_tour_or_404(db, user_id, tour_id)
    note = db.execute(select(TourNotes).where(TourNotes.tour_id == row.id)).scalar_one_or_none()
    return _tour_payload(row, note)


def create_tour(db: Session, user_id: uuid.UUID, payload: TourCreate) -> TourPayload:
    row = UserTours(
        user_id=user_id,
        property_ref_id=payload.property.id or None,
        property_name=payload.property.name,
        property_address=payload.property.address,
        property_image=payload.property.image or None,
        property_price=payload.property.rent or None,
        property_beds=payload.property.beds or None,
        property_tags=list(payload.property.tags or []),
        status=_status_from_str(payload.status),
        tour_date=_parse_date(payload.scheduled_date),
        tour_time=_parse_time(payload.scheduled_time),
    )
    db.add(row)
    db.flush()
    if payload.note:
        db.add(
            TourNotes(
                tour_id=row.id,
                ratings_json=dict(payload.note.ratings or {}),
                pros=payload.note.pros or None,
                cons=payload.note.cons or None,
                general_notes=payload.note.general_notes or None,
                would_apply=payload.note.would_apply,
                photo_checklist_json=list(payload.note.photo_checklist or []),
            )
        )
    db.commit()
    db.refresh(row)
    note = db.execute(select(TourNotes).where(TourNotes.tour_id == row.id)).scalar_one_or_none()
    return _tour_payload(row, note)


def update_tour(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, payload: TourUpdate) -> TourPayload:
    row = get_tour_or_404(db, user_id, tour_id)
    if payload.status is not None:
        row.status = _status_from_str(payload.status)
    if payload.scheduled_date is not None:
        row.tour_date = _parse_date(payload.scheduled_date)
    if payload.scheduled_time is not None:
        row.tour_time = _parse_time(payload.scheduled_time)
    if payload.property is not None:
        row.property_ref_id = payload.property.id or None
        row.property_name = payload.property.name
        row.property_address = payload.property.address
        row.property_image = payload.property.image or None
        row.property_price = payload.property.rent or None
        row.property_beds = payload.property.beds or None
        row.property_tags = list(payload.property.tags or [])
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    note = db.execute(select(TourNotes).where(TourNotes.tour_id == row.id)).scalar_one_or_none()
    return _tour_payload(row, note)


def delete_tour(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> None:
    row = get_tour_or_404(db, user_id, tour_id)
    db.delete(row)
    db.commit()


def upsert_tour_note(
    db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, payload: TourNotePayload
) -> TourPayload:
    row = get_tour_or_404(db, user_id, tour_id)
    note = db.execute(select(TourNotes).where(TourNotes.tour_id == row.id)).scalar_one_or_none()
    if note is None:
        note = TourNotes(tour_id=row.id)
        db.add(note)
    note.ratings_json = dict(payload.ratings or {})
    note.pros = payload.pros or None
    note.cons = payload.cons or None
    note.general_notes = payload.general_notes or None
    note.would_apply = payload.would_apply
    note.photo_checklist_json = list(payload.photo_checklist or [])
    note.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    db.refresh(note)
    return _tour_payload(row, note)


def create_saved_tour_for_property(
    db: Session,
    user_id: uuid.UUID,
    *,
    property_key: str,
    property_name: str,
    property_address: str,
    property_image: str | None,
    property_price: str | None,
    property_beds: str | None,
    property_tags: list[str],
    requested_date: str | None = None,
    requested_time: str | None = None,
) -> TourPayload:
    return create_tour(
        db,
        user_id,
        TourCreate(
            property=TourPropertyPayload(
                id=property_key,
                name=property_name,
                address=property_address,
                rent=property_price or "",
                beds=property_beds or "",
                image=property_image or "",
                tags=property_tags,
            ),
            status="saved",
            scheduled_date=requested_date or "",
            scheduled_time=requested_time or "",
            note=None,
        ),
    )
