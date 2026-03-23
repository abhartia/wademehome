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


class SigningEventOut(BaseModel):
    event_type: str
    actor: str
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
    signing_events: list[SigningEventOut]


class GuarantorRequestCreate(BaseModel):
    guarantor_id: str
    lease: LeasePayload


class GuarantorRequestPatch(BaseModel):
    lease: LeasePayload | None = None


class GuarantorInviteOut(BaseModel):
    request_id: str
    status: str
    invite_expires_at: str
    invite_url: str


class GuarantorDecisionPatch(BaseModel):
    status: str = Field(description="One of: verified, failed, declined, revoked")
    note: str = ""


class GuarantorInviteContextOut(BaseModel):
    request_id: str
    guarantor_name: str
    guarantor_email: str
    lease: LeasePayload
    status: str
    invite_expires_at: str


class GuarantorInviteConsentIn(BaseModel):
    consent_text_version: str


class GuarantorInviteSignIn(BaseModel):
    signer_name: str = Field(min_length=1, max_length=255)
    signer_email: str = Field(min_length=3, max_length=255)
    signature_text: str = Field(min_length=1, max_length=2000)
    consent_text_version: str = Field(min_length=1, max_length=64)


class GuarantorInviteDeclineIn(BaseModel):
    note: str = ""


class SavedGuarantorListResponse(BaseModel):
    saved_guarantors: list[SavedGuarantorOut]


class GuarantorRequestListResponse(BaseModel):
    requests: list[GuarantorRequestOut]

