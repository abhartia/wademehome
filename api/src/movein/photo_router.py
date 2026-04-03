from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from movein.photo_schemas import (
    PhotoCreate,
    PhotoDocumentationSummary,
    PhotoOut,
    PhotoPatch,
    PhotoRoomCreate,
    PhotoRoomOut,
    PhotoRoomPatch,
)
from movein.photo_service import (
    create_room,
    delete_photo,
    delete_room,
    get_summary,
    list_photos,
    list_rooms,
    patch_photo,
    patch_room,
    upload_photo,
)

router = APIRouter(prefix="/move-in/photos", tags=["move-in-photos"])


@router.get("/summary", response_model=PhotoDocumentationSummary)
def read_photo_summary(
    user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return get_summary(db, user.id)


@router.get("/rooms", response_model=list[PhotoRoomOut])
def read_photo_rooms(
    user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return list_rooms(db, user.id)


@router.post("/rooms", response_model=PhotoRoomOut)
def create_photo_room(
    body: PhotoRoomCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_room(db, user.id, body)


@router.patch("/rooms/{room_id}", response_model=PhotoRoomOut)
def patch_photo_room(
    room_id: uuid.UUID,
    body: PhotoRoomPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_room(db, user.id, room_id, body)


@router.delete("/rooms/{room_id}", status_code=204)
def delete_photo_room(
    room_id: uuid.UUID,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_room(db, user.id, room_id)
    return None


@router.get("/rooms/{room_id}/photos", response_model=list[PhotoOut])
def read_room_photos(
    room_id: uuid.UUID,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return list_photos(db, user.id, room_id)


@router.post("/rooms/{room_id}/photos", response_model=PhotoOut)
def upload_room_photo(
    room_id: uuid.UUID,
    file: UploadFile = File(...),
    note: str | None = Form(None),
    captured_at: str | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    body = PhotoCreate(
        note=note,
        captured_at=captured_at,
        latitude=latitude,
        longitude=longitude,
    )
    return upload_photo(db, user.id, room_id, file, body)


@router.patch("/photos/{photo_id}", response_model=PhotoOut)
def patch_single_photo(
    photo_id: uuid.UUID,
    body: PhotoPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_photo(db, user.id, photo_id, body)


@router.delete("/photos/{photo_id}", status_code=204)
def delete_single_photo(
    photo_id: uuid.UUID,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_photo(db, user.id, photo_id)
    return None


