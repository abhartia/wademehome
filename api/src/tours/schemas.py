from __future__ import annotations

import uuid
from datetime import date
from typing import Any, Literal

from pydantic import BaseModel, Field


class TourPropertyPayload(BaseModel):
    id: str = ""
    name: str
    address: str
    rent: str = ""
    beds: str = ""
    image: str = ""
    tags: list[str] = Field(default_factory=list)


class TourNotePayload(BaseModel):
    ratings: dict[str, Any] = Field(default_factory=dict)
    pros: str = ""
    cons: str = ""
    general_notes: str = ""
    would_apply: bool | None = None
    photo_checklist: list[str] = Field(default_factory=list)
    updated_at: str = ""


class TourPayload(BaseModel):
    id: str
    property: TourPropertyPayload
    status: str
    scheduled_date: str = ""
    scheduled_time: str = ""
    note: TourNotePayload | None = None
    created_at: str = ""


class ToursListResponse(BaseModel):
    tours: list[TourPayload] = Field(default_factory=list)
    total: int


class TourResponse(BaseModel):
    tour: TourPayload


class TourCreate(BaseModel):
    property: TourPropertyPayload
    status: str = "saved"
    scheduled_date: str = ""
    scheduled_time: str = ""
    note: TourNotePayload | None = None
    group_id: uuid.UUID | None = None


class TourUpdate(BaseModel):
    status: str | None = None
    scheduled_date: str | None = None
    scheduled_time: str | None = None
    property: TourPropertyPayload | None = None


class TourNoteUpsert(BaseModel):
    note: TourNotePayload


class TourSortParams(BaseModel):
    sort: Literal["created_at_desc", "created_at_asc", "tour_date_asc", "tour_date_desc"] = (
        "created_at_desc"
    )
    status: str | None = None
    from_date: date | None = None
    to_date: date | None = None
    q: str | None = None
    group_id: uuid.UUID | None = None
    limit: int = Field(default=50, ge=1, le=200)
    offset: int = Field(default=0, ge=0)
