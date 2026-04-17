"""Pydantic models for user-contributed listings endpoints."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


Visibility = Literal["private", "public"]


class ParseUrlRequest(BaseModel):
    url: HttpUrl


class PrefillFields(BaseModel):
    name: str | None = None
    address: str | None = None
    unit: str | None = None
    price: str | None = None
    beds: str | None = None
    baths: str | None = None
    image_url: str | None = None
    source_host: str | None = None


class ParseUrlResponse(BaseModel):
    prefill: PrefillFields
    parsed: bool


class DedupeCheckRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str = Field(..., min_length=3, max_length=512)
    unit: str | None = Field(default=None, max_length=64)


class DedupeMatch(BaseModel):
    property_key: str
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None = None
    distance_meters: float
    score: float
    is_user_contributed: bool


class DedupeCheckResponse(BaseModel):
    matches: list[DedupeMatch]


class CreateUserListingRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    address: str = Field(..., min_length=3, max_length=512)
    unit: str | None = Field(default=None, max_length=64)
    city: str | None = Field(default=None, max_length=128)
    state: str | None = Field(default=None, max_length=64)
    zipcode: str | None = Field(default=None, max_length=16)
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    price: str | None = Field(default=None, max_length=64)
    beds: str | None = Field(default=None, max_length=32)
    baths: str | None = Field(default=None, max_length=32)
    source_url: str | None = Field(default=None, max_length=2048)
    image_url: str | None = Field(default=None, max_length=2048)


class CreateUserListingResponse(BaseModel):
    property_key: str
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None = None
    visibility: Visibility


class VisibilityUpdateRequest(BaseModel):
    visibility: Visibility


class DuplicateConflictResponse(BaseModel):
    detail: str
    match: DedupeMatch
