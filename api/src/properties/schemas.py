import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class FavoriteToggleRequest(BaseModel):
    property_key: str = Field(min_length=3, max_length=255)
    property_name: str = Field(min_length=1, max_length=255)
    property_address: str = Field(min_length=1, max_length=255)
    group_id: uuid.UUID | None = None


class FavoriteResponse(BaseModel):
    property_key: str
    property_name: str
    property_address: str
    created_at: datetime
    added_by_user_id: uuid.UUID | None = None
    added_by_email: str | None = None


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


class GroupNoteCreateRequest(BaseModel):
    group_id: uuid.UUID
    property_key: str = Field(min_length=3, max_length=255)
    note: str = Field(min_length=1, max_length=6000)


class GroupNoteResponse(BaseModel):
    id: uuid.UUID
    property_key: str
    note: str
    author_user_id: uuid.UUID
    author_email: str
    created_at: datetime
    updated_at: datetime


class GroupNotesListResponse(BaseModel):
    notes: list[GroupNoteResponse]


class CommentedPropertyResponse(BaseModel):
    property_key: str
    property_name: str | None = None
    property_address: str | None = None
    note_count: int
    latest_note_at: datetime
    latest_note_preview: str
    latest_note_author_email: str


class CommentedPropertiesListResponse(BaseModel):
    properties: list[CommentedPropertyResponse]


ReactionKind = Literal["thumbs_up", "thumbs_down", "heart"]


class ReactionToggleRequest(BaseModel):
    group_id: uuid.UUID
    property_key: str = Field(min_length=3, max_length=255)
    reaction: ReactionKind


class ReactionEntry(BaseModel):
    user_id: uuid.UUID
    email: str
    reaction: ReactionKind
    created_at: datetime


class ReactionListResponse(BaseModel):
    reactions: list[ReactionEntry]


class ReactionToggleResponse(BaseModel):
    active: bool


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
    group_id: uuid.UUID | None = None


class TourRequestCreateResponse(BaseModel):
    id: str
