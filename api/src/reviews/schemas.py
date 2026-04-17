from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, conint


Rating = conint(ge=1, le=5)


class ReviewSubratingInput(BaseModel):
    dimension: Literal[
        "responsiveness",
        "maintenance",
        "deposit_return",
        "heat_hot_water",
        "pest_control",
        "harassment",
        "building_condition",
        "noise",
        "value",
    ]
    score: Rating  # type: ignore[valid-type]


class ReviewCreateRequest(BaseModel):
    building_id: str
    landlord_relation: Literal["owner", "manager", "both"] = "both"
    tenancy_start: date
    tenancy_end: date | None = None
    overall_rating: Rating  # type: ignore[valid-type]
    title: str | None = None
    body: str
    subratings: list[ReviewSubratingInput] = Field(default_factory=list)
    # When we cannot resolve an ownership period for the tenancy window the
    # reviewer can supply a best-guess landlord name that we'll use to create
    # a crowdsourced `landlord_entity` (kind=unknown) + ownership period.
    landlord_hint_name: str | None = None


class ReviewResponsePayload(BaseModel):
    id: str
    author_user_id: str
    body: str
    created_at: datetime


class ReviewPayload(BaseModel):
    id: str
    author_user_id: str
    building_id: str
    landlord_entity_id: str
    landlord_entity_name: str
    ownership_period_id: str | None
    landlord_relation: str
    tenancy_start: date
    tenancy_end: date | None
    overall_rating: int
    title: str | None
    body: str
    verified_tenant: bool
    status: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
    subratings: dict[str, int]
    response: ReviewResponsePayload | None


class ReviewResponseCreate(BaseModel):
    body: str


class ReviewFlagRequest(BaseModel):
    flag_type: Literal[
        "defamation", "factual_error", "spam", "harassment", "off_topic", "other"
    ]
    details: str | None = None


class ReviewFlagPayload(BaseModel):
    id: str
    flag_type: str
    status: str
    details: str | None
    created_at: datetime


class ReviewVerificationCreate(BaseModel):
    proof_type: Literal["lease", "utility_bill", "rent_receipt", "mail"]
    storage_key: str
    tenancy_start: date | None = None
    tenancy_end: date | None = None


class ReviewVerificationPayload(BaseModel):
    id: str
    review_id: str
    proof_type: str
    status: str
    storage_key: str
    rejection_reason: str | None
    created_at: datetime


class ReviewListResponse(BaseModel):
    reviews: list[ReviewPayload]
    total: int
