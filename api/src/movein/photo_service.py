from __future__ import annotations

import uuid
from datetime import datetime

from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.config import Config
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


def _blob_client():
    """Return (BlobServiceClient, container_name) or raise 500 if not configured."""
    conn = (Config.get("AZURE_BLOB_CONNECTION_STRING", "") or "").strip()
    container = (Config.get("AZURE_BLOB_MOVEIN_CONTAINER", "") or "").strip()
    if not conn or not container:
        raise HTTPException(
            status_code=500,
            detail="Azure Blob storage is not configured for move-in photos",
        )
    return BlobServiceClient.from_connection_string(conn), container


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
    blob_name = f"movein-photos/{plan.id}/{room_id}/{photo_id}.{ext}"

    # Upload to Azure Blob Storage
    content = file.file.read()
    content_type = file.content_type or "image/jpeg"
    try:
        service_client, container = _blob_client()
        blob = service_client.get_blob_client(container=container, blob=blob_name)
        blob.upload_blob(
            content,
            overwrite=False,
            content_settings=ContentSettings(content_type=content_type),
        )
        photo_url = blob.url
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Failed to upload photo: {exc!s}") from exc

    captured_at = None
    if body.captured_at:
        try:
            captured_at = datetime.fromisoformat(body.captured_at)
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid captured_at format")

    photo = UserMoveinPhotos(
        id=photo_id,
        room_id=room_id,
        photo_url=photo_url,
        note=body.note,
        captured_at=captured_at,
        latitude=body.latitude,
        longitude=body.longitude,
        file_size_bytes=len(content),
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


def _delete_blob(photo_url: str) -> None:
    """Best-effort delete of a blob by its full URL."""
    try:
        service_client, container = _blob_client()
        # Extract blob name from the full URL
        # URL format: https://<account>.blob.core.windows.net/<container>/<blob_name>
        container_client = service_client.get_container_client(container)
        # blob name is the path portion after the container segment
        marker = f"/{container}/"
        idx = photo_url.find(marker)
        if idx == -1:
            return
        blob_name = photo_url[idx + len(marker):]
        container_client.delete_blob(blob_name)
    except Exception:
        # Best-effort: don't fail the delete request if blob cleanup fails
        pass


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
    _delete_blob(photo.photo_url)
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
