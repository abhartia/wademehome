from __future__ import annotations

from pydantic import BaseModel, Field


class PhotoRoomCreate(BaseModel):
    room_type: str
    room_label: str


class PhotoRoomPatch(BaseModel):
    room_label: str | None = None
    sort_order: int | None = None


class PhotoRoomOut(BaseModel):
    id: str
    room_type: str
    room_label: str
    sort_order: int
    photo_count: int = 0
    first_photo_url: str | None = None


class PhotoCreate(BaseModel):
    note: str | None = None
    captured_at: str | None = None  # ISO datetime
    latitude: float | None = None
    longitude: float | None = None


class PhotoPatch(BaseModel):
    note: str | None = None


class PhotoOut(BaseModel):
    id: str
    room_id: str
    photo_url: str
    thumbnail_url: str | None = None
    note: str | None = None
    captured_at: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    file_size_bytes: int | None = None
    created_at: str


class PhotoDocumentationSummary(BaseModel):
    room_count: int = 0
    total_photos: int = 0
    rooms: list[PhotoRoomOut] = Field(default_factory=list)
