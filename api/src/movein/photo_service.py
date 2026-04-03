from __future__ import annotations

import os
import uuid
from datetime import datetime

from fastapi import HTTPException, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from db.models import UserMoveinPhotoRooms, UserMoveinPhotos, UserMoveinPlans
from movein.photo_schemas import (
    PhotoCreate,
    PhotoDocumentationSummary,
    PhotoOut,
    PhotoPatch,
    PhotoRoomCreate,
    PhotoRoomOut,
    PhotoRoomPatch,
)


UPLOAD_ROOT = "uploads/movein-photos"


def _ensure_plan(db: Session, user_id: uuid.UUID) -> UserMoveinPlans:
    row = db.execute(
        select(UserMoveinPlans)
        .where(UserMoveinPlans.user_id == user_id)
        .order_by(UserMoveinPlans.updated_at.desc())
    ).scalar_one_or_none()
    if row:
        return row
    row = UserMoveinPlans(user_id=user_id, target_address="")
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def _room_out(room: UserMoveinPhotoRooms) -> PhotoRoomOut:
    photos = room.photos or []
    first_url = photos[0].photo_url if photos else None
    return PhotoRoomOut(
        id=str(room.id),
        room_type=room.room_type,
        room_label=room.room_label,
        sort_order=room.sort_order or 0,
        photo_count=len(photos),
        first_photo_url=first_url,
    )


def _photo_out(photo: UserMoveinPhotos) -> PhotoOut:
    return PhotoOut(
        id=str(photo.id),
        room_id=str(photo.room_id),
        photo_url=photo.photo_url,
        thumbnail_url=photo.thumbnail_url,
        note=photo.note,
        captured_at=photo.captured_at.isoformat() if photo.captured_at else None,
        latitude=float(photo.latitude) if photo.latitude is not None else None,
        longitude=float(photo.longitude) if photo.longitude is not None else None,
        file_size_bytes=photo.file_size_bytes,
        created_at=photo.created_at.isoformat() if photo.created_at else "",
    )


def list_rooms(db: Session, user_id: uuid.UUID) -> list[PhotoRoomOut]:
    plan = _ensure_plan(db, user_id)
    rooms = (
        db.execute(
            select(UserMoveinPhotoRooms)
            .where(UserMoveinPhotoRooms.movein_plan_id == plan.id)
            .order_by(UserMoveinPhotoRooms.sort_order.asc(), UserMoveinPhotoRooms.created_at.asc())
        )
        .scalars()
        .all()
    )
    return [_room_out(r) for r in rooms]


def create_room(db: Session, user_id: uuid.UUID, body: PhotoRoomCreate) -> PhotoRoomOut:
    plan = _ensure_plan(db, user_id)
    room = UserMoveinPhotoRooms(
        movein_plan_id=plan.id,
        room_type=body.room_type,
        room_label=body.room_label,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return _room_out(room)


def patch_room(
    db: Session, user_id: uuid.UUID, room_id: uuid.UUID, body: PhotoRoomPatch
) -> PhotoRoomOut:
    plan = _ensure_plan(db, user_id)
    room = db.execute(
        select(UserMoveinPhotoRooms).where(
            UserMoveinPhotoRooms.id == room_id,
            UserMoveinPhotoRooms.movein_plan_id == plan.id,
        )
    ).scalar_one_or_none()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    data = body.model_dump(exclude_unset=True)
    for key, val in data.items():
        if hasattr(room, key):
            setattr(room, key, val)
    db.commit()
    db.refresh(room)
    return _room_out(room)


def delete_room(db: Session, user_id: uuid.UUID, room_id: uuid.UUID) -> None:
    plan = _ensure_plan(db, user_id)
    room = db.execute(
        select(UserMoveinPhotoRooms).where(
            UserMoveinPhotoRooms.id == room_id,
            UserMoveinPhotoRooms.movein_plan_id == plan.id,
        )
    ).scalar_one_or_none()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()


def list_photos(db: Session, user_id: uuid.UUID, room_id: uuid.UUID) -> list[PhotoOut]:
    plan = _ensure_plan(db, user_id)
    # Verify room belongs to user's plan
    room = db.execute(
        select(UserMoveinPhotoRooms).where(
            UserMoveinPhotoRooms.id == room_id,
            UserMoveinPhotoRooms.movein_plan_id == plan.id,
        )
    ).scalar_one_or_none()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    photos = (
        db.execute(
            select(UserMoveinPhotos)
            .where(UserMoveinPhotos.room_id == room_id)
            .order_by(UserMoveinPhotos.created_at.asc())
        )
        .scalars()
        .all()
    )
    return [_photo_out(p) for p in photos]


def upload_photo(
    db: Session,
    user_id: uuid.UUID,
    room_id: uuid.UUID,
    file: UploadFile,
    body: PhotoCreate,
) -> PhotoOut:
    plan = _ensure_plan(db, user_id)
    room = db.execute(
        select(UserMoveinPhotoRooms).where(
            UserMoveinPhotoRooms.id == room_id,
            UserMoveinPhotoRooms.movein_plan_id == plan.id,
        )
    ).scalar_one_or_none()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    # Determine file extension
    original_name = file.filename or "photo.jpg"
    ext = original_name.rsplit(".", 1)[-1] if "." in original_name else "jpg"
    photo_id = uuid.uuid4()
    relative_path = f"{UPLOAD_ROOT}/{plan.id}/{room_id}/{photo_id}.{ext}"

    # Save to disk
    abs_path = os.path.join(os.getcwd(), relative_path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    content = file.file.read()
    with open(abs_path, "wb") as f:
        f.write(content)

    file_size = os.path.getsize(abs_path)

    captured_at = None
    if body.captured_at:
        try:
            captured_at = datetime.fromisoformat(body.captured_at)
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid captured_at format")

    photo = UserMoveinPhotos(
        id=photo_id,
        room_id=room_id,
        photo_url=relative_path,
        note=body.note,
        captured_at=captured_at,
        latitude=body.latitude,
        longitude=body.longitude,
        file_size_bytes=file_size,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return _photo_out(photo)


def patch_photo(
    db: Session, user_id: uuid.UUID, photo_id: uuid.UUID, body: PhotoPatch
) -> PhotoOut:
    plan = _ensure_plan(db, user_id)
    photo = (
        db.execute(
            select(UserMoveinPhotos)
            .join(UserMoveinPhotoRooms, UserMoveinPhotos.room_id == UserMoveinPhotoRooms.id)
            .where(
                UserMoveinPhotos.id == photo_id,
                UserMoveinPhotoRooms.movein_plan_id == plan.id,
            )
        )
        .scalar_one_or_none()
    )
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    data = body.model_dump(exclude_unset=True)
    for key, val in data.items():
        if hasattr(photo, key):
            setattr(photo, key, val)
    db.commit()
    db.refresh(photo)
    return _photo_out(photo)


def delete_photo(db: Session, user_id: uuid.UUID, photo_id: uuid.UUID) -> None:
    plan = _ensure_plan(db, user_id)
    photo = (
        db.execute(
            select(UserMoveinPhotos)
            .join(UserMoveinPhotoRooms, UserMoveinPhotos.room_id == UserMoveinPhotoRooms.id)
            .where(
                UserMoveinPhotos.id == photo_id,
                UserMoveinPhotoRooms.movein_plan_id == plan.id,
            )
        )
        .scalar_one_or_none()
    )
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(photo)
    db.commit()


def get_summary(db: Session, user_id: uuid.UUID) -> PhotoDocumentationSummary:
    plan = _ensure_plan(db, user_id)
    rooms = (
        db.execute(
            select(UserMoveinPhotoRooms)
            .where(UserMoveinPhotoRooms.movein_plan_id == plan.id)
            .order_by(UserMoveinPhotoRooms.sort_order.asc(), UserMoveinPhotoRooms.created_at.asc())
        )
        .scalars()
        .all()
    )
    room_outs = [_room_out(r) for r in rooms]
    total_photos = sum(r.photo_count for r in room_outs)
    return PhotoDocumentationSummary(
        room_count=len(room_outs),
        total_photos=total_photos,
        rooms=room_outs,
    )
