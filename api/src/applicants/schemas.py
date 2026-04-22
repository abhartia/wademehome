from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


ApplicantStatus = Literal[
    "new", "contacted", "toured", "accepted", "rejected", "withdrawn"
]
ApplicantSource = Literal["manual", "self_registration"]


class ApplicantCreateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=64)
    status: ApplicantStatus = "new"
    role_context: str | None = Field(default=None, max_length=255)
    notes: str | None = None
    budget_usd: int | None = Field(default=None, ge=0, le=10_000_000)
    move_in_date: date | None = None

    @model_validator(mode="after")
    def _require_name_or_email(self) -> "ApplicantCreateRequest":
        if not (self.name and self.name.strip()) and not self.email:
            raise ValueError("Provide at least a name or an email")
        return self


class ApplicantUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=64)
    status: ApplicantStatus | None = None
    role_context: str | None = Field(default=None, max_length=255)
    notes: str | None = None
    budget_usd: int | None = Field(default=None, ge=0, le=10_000_000)
    move_in_date: date | None = None


class ApplicantResponse(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    name: str | None
    email: str | None
    phone: str | None
    status: str
    role_context: str | None
    notes: str | None
    budget_usd: int | None
    move_in_date: date | None
    source: str
    has_pending_self_reg: bool
    self_reg_url: str | None
    self_reg_expires_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ApplicantsListResponse(BaseModel):
    applicants: list[ApplicantResponse]


class SelfRegLinkCreateRequest(BaseModel):
    role_context: str | None = Field(default=None, max_length=255)


class SelfRegLinkResponse(BaseModel):
    applicant_id: uuid.UUID
    token: str
    url: str
    expires_at: datetime


class PublicApplicantPreviewResponse(BaseModel):
    group_name: str
    role_context: str | None
    expired: bool
    already_submitted: bool


class PublicApplicantSubmitRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=64)
    notes: str | None = None
    budget_usd: int | None = Field(default=None, ge=0, le=10_000_000)
    move_in_date: date | None = None


class PublicApplicantSubmitResponse(BaseModel):
    group_name: str
    submitted: bool = True
