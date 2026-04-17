from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class GroupCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class GroupRenameRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class GroupResponse(BaseModel):
    id: uuid.UUID
    name: str
    role: str
    member_count: int
    created_at: datetime


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
