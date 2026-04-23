from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator


class GroupCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class GroupRenameRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class GroupPreferences(BaseModel):
    min_beds: int | None = Field(default=None, ge=0, le=20)
    max_beds: int | None = Field(default=None, ge=0, le=20)
    min_rent_usd: int | None = Field(default=None, ge=0, le=1_000_000)
    max_rent_usd: int | None = Field(default=None, ge=0, le=1_000_000)
    preferred_cities: list[str] = Field(default_factory=list)
    preferred_neighborhoods: list[str] = Field(default_factory=list)
    dealbreakers: list[str] = Field(default_factory=list)
    notes: str | None = None


class GroupPreferencesUpdate(BaseModel):
    min_beds: int | None = Field(default=None, ge=0, le=20)
    max_beds: int | None = Field(default=None, ge=0, le=20)
    min_rent_usd: int | None = Field(default=None, ge=0, le=1_000_000)
    max_rent_usd: int | None = Field(default=None, ge=0, le=1_000_000)
    preferred_cities: list[str] | None = None
    preferred_neighborhoods: list[str] | None = None
    dealbreakers: list[str] | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def _validate_ranges(self) -> GroupPreferencesUpdate:
        if self.min_beds is not None and self.max_beds is not None and self.min_beds > self.max_beds:
            raise ValueError("min_beds cannot exceed max_beds")
        if self.min_rent_usd is not None and self.max_rent_usd is not None and self.min_rent_usd > self.max_rent_usd:
            raise ValueError("min_rent_usd cannot exceed max_rent_usd")
        return self


class GroupResponse(BaseModel):
    id: uuid.UUID
    name: str
    role: str
    member_count: int
    created_at: datetime
    preferences: GroupPreferences


class GroupListResponse(BaseModel):
    groups: list[GroupResponse]


class GroupMemberResponse(BaseModel):
    user_id: uuid.UUID
    email: str
    role: str
    joined_at: datetime


class GroupMembersListResponse(BaseModel):
    members: list[GroupMemberResponse]


class GroupMemberRoleUpdateRequest(BaseModel):
    role: Literal["owner", "member"]


class GroupInviteCreateRequest(BaseModel):
    kind: Literal["email", "link"]
    email: EmailStr | None = None


class GroupInviteResponse(BaseModel):
    id: uuid.UUID
    kind: str
    email: str | None
    token: str
    accept_url: str
    expires_at: datetime
    accepted_at: datetime | None
    revoked_at: datetime | None


class GroupInvitesListResponse(BaseModel):
    invites: list[GroupInviteResponse]


class InvitePreviewResponse(BaseModel):
    group_id: uuid.UUID
    group_name: str
    inviter_email: str | None
    kind: str
    email: str | None
    expired: bool
    revoked: bool
    already_accepted: bool


class InviteAcceptRequest(BaseModel):
    token: str = Field(min_length=8, max_length=128)


class InviteAcceptResponse(BaseModel):
    group_id: uuid.UUID
    group_name: str
