from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel

from reviews.schemas import ReviewVerificationPayload


class VerificationQueueItem(BaseModel):
    id: str
    review_id: str
    user_id: str
    author_display_name: str | None
    proof_type: str
    status: str
    storage_key: str
    created_at: datetime
    review_title: str | None
    review_body_preview: str
    review_overall_rating: int


class VerificationQueueResponse(BaseModel):
    items: list[VerificationQueueItem]
    total: int


class VerificationDecisionRequest(BaseModel):
    decision: Literal["approved", "rejected"]
    rejection_reason: str | None = None


class ModerationQueueItem(BaseModel):
    id: str
    review_id: str
    flag_type: str
    submitted_by_role: str
    submitted_by_user_id: str | None
    details: str | None
    status: str
    created_at: datetime
    review_title: str | None
    review_body_preview: str
    review_status: str


class ModerationQueueResponse(BaseModel):
    items: list[ModerationQueueItem]
    total: int


class ModerationDecisionRequest(BaseModel):
    decision: Literal["accepted", "rejected"]
    # When the flag is accepted the admin picks what happens to the review.
    review_action: Literal["hide", "remove", "none"] = "hide"
    resolution_note: str | None = None


class OwnershipPeriodUpsert(BaseModel):
    id: str | None = None
    building_id: str
    landlord_entity_id: str
    role: Literal["owner", "manager"] = "owner"
    start_date: date
    end_date: date | None = None
    source: Literal["acris_deed", "crowdsourced", "claimed", "admin"] = "admin"
    acris_document_id: str | None = None
    confidence: Decimal | None = None
    notes: str | None = None


class LandlordMergeRequest(BaseModel):
    source_entity_id: str
    target_entity_id: str


class LandlordEntityClaimApproveRequest(BaseModel):
    landlord_profile_id: str


class EmptyResponse(BaseModel):
    ok: bool = True
