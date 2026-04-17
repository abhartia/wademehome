from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from auth.emailer import send_group_invite_email
from core.config import Config
from db.models import GroupInvites, Groups, Users
from groups.schemas import GroupInviteResponse


def app_base_url() -> str:
    raw = (Config.get("AUTH_UI_BASE_URL", "") or "").strip().rstrip("/")
    if not raw:
        return "http://localhost:3000"
    return raw


def accept_url(token: str) -> str:
    return f"{app_base_url()}/invites/accept?token={token}"


def invite_to_response(invite: GroupInvites) -> GroupInviteResponse:
    return GroupInviteResponse(
        id=invite.id,
        kind=invite.kind,
        email=invite.email,
        token=invite.token,
        accept_url=accept_url(invite.token),
        expires_at=invite.expires_at,
        accepted_at=invite.accepted_at,
        revoked_at=invite.revoked_at,
    )


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def create_email_invite(
    db: Session,
    *,
    group: Groups,
    inviter: Users,
    email: str,
) -> GroupInvites:
    """Create + send an email invite. Caller is responsible for db.commit()."""
    token = secrets.token_urlsafe(32)
    expires_at = utc_now() + timedelta(days=14)
    invite = GroupInvites(
        group_id=group.id,
        invited_by=inviter.id,
        token=token,
        email=email,
        kind="email",
        expires_at=expires_at,
    )
    db.add(invite)
    db.flush()
    try:
        send_group_invite_email(
            to_email=email,
            inviter_email=inviter.email,
            group_name=group.name or "",
            accept_url=accept_url(token),
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return invite
