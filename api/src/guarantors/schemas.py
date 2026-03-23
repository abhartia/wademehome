from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class SavedGuarantorOut(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    relationship: str
    created_at: str


class SavedGuarantorCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255)
    phone: str = ""
    relationship: str = "other"


class SavedGuarantorPatch(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    relationship: str | None = None


class StatusHistoryOut(BaseModel):
    status: str
    timestamp: str
    note: str = ""


class LeasePayload(BaseModel):
    property_name: str
    property_address: str
    monthly_rent: str
    lease_start: str = ""
    lease_term: str = ""


class GuarantorRequestOut(BaseModel):
    id: str
    guarantor_id: str
    guarantor_snapshot: dict[str, str]
    lease: LeasePayload
    status: str
    verification_status: str
    created_at: str
    sent_at: str
    viewed_at: str
    signed_at: str
    expires_at: str
    status_history: list[StatusHistoryOut]


class GuarantorRequestCreate(BaseModel):
    guarantor_id: str
    lease: LeasePayload


class GuarantorRequestPatch(BaseModel):
    lease: LeasePayload | None = None
    status: str | None = None
    verification_status: str | None = None
    sent_at: datetime | None = None
    viewed_at: datetime | None = None
    signed_at: datetime | None = None
    expires_at: datetime | None = None
    status_note: str | None = None


class SavedGuarantorListResponse(BaseModel):
    saved_guarantors: list[SavedGuarantorOut]


class GuarantorRequestListResponse(BaseModel):
    requests: list[GuarantorRequestOut]

