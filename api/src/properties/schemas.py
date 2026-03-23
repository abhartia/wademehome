from datetime import datetime

from pydantic import BaseModel, Field


class FavoriteToggleRequest(BaseModel):
    property_key: str = Field(min_length=3, max_length=255)
    property_name: str = Field(min_length=1, max_length=255)
    property_address: str = Field(min_length=1, max_length=255)


class FavoriteResponse(BaseModel):
    property_key: str
    property_name: str
    property_address: str
    created_at: datetime


class FavoriteListResponse(BaseModel):
    favorites: list[FavoriteResponse]


class FavoriteToggleResponse(BaseModel):
    favorited: bool


class PropertyNoteUpsertRequest(BaseModel):
    note: str = Field(max_length=6000)


class PropertyNoteResponse(BaseModel):
    property_key: str
    note: str
    updated_at: datetime


class PropertyNoteGetResponse(BaseModel):
    note: PropertyNoteResponse | None


class TourRequestCreate(BaseModel):
    property_key: str = Field(min_length=3, max_length=255)
    property_name: str = Field(min_length=1, max_length=255)
    property_address: str = Field(min_length=1, max_length=255)
    property_image: str | None = None
    property_price: str | None = None
    property_beds: str | None = None
    property_tags: list[str] = Field(default_factory=list)
    requested_date: str | None = None
    requested_time: str | None = None
    request_message: str | None = Field(default=None, max_length=6000)


class TourRequestCreateResponse(BaseModel):
    id: str
