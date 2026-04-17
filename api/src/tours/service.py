from __future__ import annotations

import uuid
from datetime import date, datetime, time, timezone
from typing import Any

from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import HTTPException, UploadFile
from sqlalchemy import Select, or_, select
from sqlalchemy.orm import Session

from core.config import Config
from db.models import TourMedia, TourMediaKind, TourNotes, TourStatus, UserTours
from tours.schemas import (
    TourCreate,
    TourMediaPayload,
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


def _media_payload(media: TourMedia) -> TourMediaPayload:
    return TourMediaPayload(
        id=str(media.id),
        media_url=media.media_url,
        media_kind=media.media_kind.value,
        content_type=media.content_type,
        file_size_bytes=media.file_size_bytes,
        sort_order=media.sort_order or 0,
        created_at=media.created_at.isoformat() if media.created_at else "",
    )


def _tour_payload(
    row: UserTours, note: TourNotes | None, media: list[TourMedia] | None = None
) -> TourPayload:
    scheduled_date = row.tour_date.isoformat() if row.tour_date else ""
    scheduled_time = row.tour_time.isoformat(timespec="minutes") if row.tour_time else ""
    media_rows = list(media or [])
    media_rows.sort(key=lambda m: (m.sort_order or 0, m.created_at or datetime.min))
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
        media=[_media_payload(m) for m in media_rows],
        created_at=row.created_at.isoformat() if row.created_at else "",
    )


def _tour_query_for_user(
    user_id: uuid.UUID, group_id: uuid.UUID | None = None
) -> Select[tuple[UserTours]]:
    if group_id is None:
        return select(UserTours).where(
            UserTours.user_id == user_id, UserTours.group_id.is_(None)
        )
    # Group scope: any member sees any tour under the group (group membership
    # is verified upstream via resolve_scope). Matches the PropertyFavorites
    # behaviour in properties/router.py so a tour one roommate logs is visible
    # to everyone else in the group.
    return select(UserTours).where(UserTours.group_id == group_id)


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


def _get_media_map(
    db: Session, tour_ids: list[uuid.UUID]
) -> dict[uuid.UUID, list[TourMedia]]:
    if not tour_ids:
        return {}
    rows = (
        db.execute(select(TourMedia).where(TourMedia.tour_id.in_(tour_ids)))
        .scalars()
        .all()
    )
    out: dict[uuid.UUID, list[TourMedia]] = {}
    for row in rows:
        out.setdefault(row.tour_id, []).append(row)
    return out


def list_tours(db: Session, user_id: uuid.UUID, params: TourSortParams) -> tuple[list[TourPayload], int]:
    base_query = _apply_filters(_tour_query_for_user(user_id, params.group_id), params)
    all_rows = db.execute(base_query).scalars().all()
    total = len(all_rows)
    query = _apply_sort(base_query, params.sort).limit(params.limit).offset(params.offset)
    rows = db.execute(query).scalars().all()
    tour_ids = [row.id for row in rows]
    notes = _get_note_map(db, tour_ids)
    media = _get_media_map(db, tour_ids)
    payload = [
        _tour_payload(row, notes.get(row.id), media.get(row.id, [])) for row in rows
    ]
    return payload, total


def get_tour_or_404(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> UserTours:
    """Tour row visible to this user — own tour or any tour in a shared group.

    Group membership for the row's group_id is verified against GroupMembers so
    a user can only read tours in groups they belong to.
    """
    from db.models import GroupMembers  # local to avoid cycle at import time

    row = db.execute(select(UserTours).where(UserTours.id == tour_id)).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour not found")
    if row.user_id == user_id:
        return row
    if row.group_id is not None:
        is_member = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == row.group_id,
                GroupMembers.user_id == user_id,
            )
        ).scalar_one_or_none()
        if is_member is not None:
            return row
    raise HTTPException(status_code=404, detail="Tour not found")


def get_owned_tour_or_404(
    db: Session, user_id: uuid.UUID, tour_id: uuid.UUID
) -> UserTours:
    """Strict variant: only the tour owner. Used for mutations other than media."""
    row = db.execute(
        select(UserTours).where(UserTours.id == tour_id, UserTours.user_id == user_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour not found")
    return row


def get_tour_payload(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> TourPayload:
    row = get_tour_or_404(db, user_id, tour_id)
    note = db.execute(select(TourNotes).where(TourNotes.tour_id == row.id)).scalar_one_or_none()
    media = db.execute(select(TourMedia).where(TourMedia.tour_id == row.id)).scalars().all()
    return _tour_payload(row, note, list(media))


def create_tour(db: Session, user_id: uuid.UUID, payload: TourCreate) -> TourPayload:
    row = UserTours(
        user_id=user_id,
        group_id=payload.group_id,
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
    media = db.execute(select(TourMedia).where(TourMedia.tour_id == row.id)).scalars().all()
    return _tour_payload(row, note, list(media))


def update_tour(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, payload: TourUpdate) -> TourPayload:
    row = get_owned_tour_or_404(db, user_id, tour_id)
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
    media = db.execute(select(TourMedia).where(TourMedia.tour_id == row.id)).scalars().all()
    return _tour_payload(row, note, list(media))


def delete_tour(db: Session, user_id: uuid.UUID, tour_id: uuid.UUID) -> None:
    row = get_owned_tour_or_404(db, user_id, tour_id)
    db.delete(row)
    db.commit()


def upsert_tour_note(
    db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, payload: TourNotePayload
) -> TourPayload:
    row = get_owned_tour_or_404(db, user_id, tour_id)
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
    media = db.execute(select(TourMedia).where(TourMedia.tour_id == row.id)).scalars().all()
    return _tour_payload(row, note, list(media))


def _tour_media_blob_client() -> tuple[BlobServiceClient, str]:
    conn = (Config.get("AZURE_BLOB_CONNECTION_STRING", "") or "").strip()
    container = (Config.get("AZURE_BLOB_TOUR_MEDIA_CONTAINER", "") or "").strip()
    if not conn or not container:
        raise HTTPException(
            status_code=500,
            detail="Azure Blob storage is not configured for tour media",
        )
    return BlobServiceClient.from_connection_string(conn), container


def _media_kind_from_content_type(content_type: str | None) -> TourMediaKind:
    ct = (content_type or "").lower()
    if ct.startswith("video/"):
        return TourMediaKind.video
    if ct.startswith("image/"):
        return TourMediaKind.image
    raise HTTPException(
        status_code=422,
        detail="Unsupported file type. Upload an image or video.",
    )


_MAX_TOUR_MEDIA_BYTES = 512 * 1024 * 1024  # 512 MB per-file cap; plenty for phone video


def upload_tour_media(
    db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, file: UploadFile
) -> TourMediaPayload:
    """Upload a single video/image for a tour the user owns.

    Owner-only (not any group member) to keep the blame trail simple and avoid
    storage-bill surprises from drive-by uploaders. The tour itself is
    group-visible once uploaded.
    """
    tour = get_owned_tour_or_404(db, user_id, tour_id)

    kind = _media_kind_from_content_type(file.content_type)
    raw = file.file.read()
    if len(raw) == 0:
        raise HTTPException(status_code=422, detail="Empty file")
    if len(raw) > _MAX_TOUR_MEDIA_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 512 MB)")

    original_name = file.filename or ("video.mp4" if kind == TourMediaKind.video else "image.jpg")
    ext = original_name.rsplit(".", 1)[-1].lower() if "." in original_name else (
        "mp4" if kind == TourMediaKind.video else "jpg"
    )
    media_id = uuid.uuid4()
    blob_name = f"tour-media/{tour.id}/{media_id}.{ext}"

    try:
        service_client, container = _tour_media_blob_client()
        blob = service_client.get_blob_client(container=container, blob=blob_name)
        blob.upload_blob(
            raw,
            overwrite=False,
            content_settings=ContentSettings(content_type=file.content_type or None),
        )
        media_url = blob.url
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502, detail=f"Failed to upload tour media: {exc!s}"
        ) from exc

    existing = (
        db.execute(
            select(TourMedia).where(TourMedia.tour_id == tour.id).order_by(
                TourMedia.sort_order.desc()
            )
        )
        .scalars()
        .first()
    )
    next_sort = (existing.sort_order + 1) if existing else 0

    row = TourMedia(
        id=media_id,
        tour_id=tour.id,
        uploaded_by_user_id=user_id,
        media_url=media_url,
        media_kind=kind,
        content_type=file.content_type,
        file_size_bytes=len(raw),
        sort_order=next_sort,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _media_payload(row)


def _delete_tour_blob(media_url: str) -> None:
    try:
        service_client, container = _tour_media_blob_client()
        marker = f"/{container}/"
        idx = media_url.find(marker)
        if idx == -1:
            return
        blob_name = media_url[idx + len(marker) :]
        service_client.get_container_client(container).delete_blob(blob_name)
    except Exception:
        # Best-effort; don't block DB cleanup on stale blobs.
        pass


def delete_tour_media(
    db: Session, user_id: uuid.UUID, tour_id: uuid.UUID, media_id: uuid.UUID
) -> None:
    get_owned_tour_or_404(db, user_id, tour_id)
    row = db.execute(
        select(TourMedia).where(
            TourMedia.id == media_id, TourMedia.tour_id == tour_id
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Media not found")
    _delete_tour_blob(row.media_url)
    db.delete(row)
    db.commit()


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
    group_id: uuid.UUID | None = None,
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
            group_id=group_id,
        ),
    )
