from __future__ import annotations

import secrets
import uuid
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from auth.emailer import send_group_invite_email, send_group_member_joined_email
from auth.router import get_current_user, get_db
from core.logger import get_logger
from db.models import GroupInvites, GroupMembers, Groups, Users

logger = get_logger(__name__)
from groups.deps import require_group_member
from groups.service import (
    accept_url as _accept_url,
    app_base_url as _app_base_url,
    invite_to_response as _invite_to_response,
    utc_now as _utc_now,
)
from groups.schemas import (
    GroupCreateRequest,
    GroupInviteCreateRequest,
    GroupInviteResponse,
    GroupInvitesListResponse,
    GroupListResponse,
    GroupMemberResponse,
    GroupMemberRoleUpdateRequest,
    GroupMembersListResponse,
    GroupPreferences,
    GroupPreferencesUpdate,
    GroupRenameRequest,
    GroupResponse,
    InviteAcceptRequest,
    InviteAcceptResponse,
    InvitePreviewResponse,
)


def _clean_str_list(values: list[str] | None) -> list[str] | None:
    if values is None:
        return None
    cleaned: list[str] = []
    seen: set[str] = set()
    for v in values:
        s = (v or "").strip()
        if not s:
            continue
        if s in seen:
            continue
        seen.add(s)
        cleaned.append(s[:120])
    return cleaned or None


def _group_preferences(group: Groups) -> GroupPreferences:
    return GroupPreferences(
        min_beds=group.min_beds,
        max_beds=group.max_beds,
        min_rent_usd=group.min_rent_usd,
        max_rent_usd=group.max_rent_usd,
        preferred_cities=list(group.preferred_cities or []),
        preferred_neighborhoods=list(group.preferred_neighborhoods or []),
        dealbreakers=list(group.dealbreakers or []),
        notes=group.preferences_notes,
    )


def _build_group_response(
    group: Groups, *, role: str, member_count: int
) -> GroupResponse:
    return GroupResponse(
        id=group.id,
        name=group.name,
        role=role,
        member_count=member_count,
        created_at=group.created_at,
        preferences=_group_preferences(group),
    )

router = APIRouter(tags=["groups"])


@router.post("/groups", response_model=GroupResponse)
def create_group(
    payload: GroupCreateRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    group = Groups(name=payload.name.strip(), created_by=user.id)
    db.add(group)
    db.flush()
    db.add(GroupMembers(group_id=group.id, user_id=user.id, role="owner"))
    db.commit()
    db.refresh(group)
    return _build_group_response(group, role="owner", member_count=1)


@router.get("/groups", response_model=GroupListResponse)
def list_groups(
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(Groups, GroupMembers.role)
        .join(GroupMembers, GroupMembers.group_id == Groups.id)
        .where(GroupMembers.user_id == user.id)
        .order_by(Groups.created_at.desc())
    ).all()

    if not rows:
        return GroupListResponse(groups=[])

    group_ids = [r[0].id for r in rows]
    counts = dict(
        db.execute(
            select(GroupMembers.group_id, func.count(GroupMembers.id))
            .where(GroupMembers.group_id.in_(group_ids))
            .group_by(GroupMembers.group_id)
        ).all()
    )

    return GroupListResponse(
        groups=[
            _build_group_response(
                group,
                role=role,
                member_count=int(counts.get(group.id, 0) or 0),
            )
            for (group, role) in rows
        ]
    )


@router.patch("/groups/{group_id}", response_model=GroupResponse)
def rename_group(
    group_id: uuid.UUID,
    payload: GroupRenameRequest,
    membership: GroupMembers = Depends(require_group_member(role="owner")),
    db: Session = Depends(get_db),
):
    group = db.get(Groups, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    group.name = payload.name.strip()
    db.commit()
    db.refresh(group)
    member_count = int(
        db.execute(
            select(func.count(GroupMembers.id)).where(GroupMembers.group_id == group.id)
        ).scalar_one()
    )
    return _build_group_response(
        group, role=membership.role, member_count=member_count
    )


@router.get("/groups/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    group = db.get(Groups, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    member_count = int(
        db.execute(
            select(func.count(GroupMembers.id)).where(GroupMembers.group_id == group.id)
        ).scalar_one()
    )
    return _build_group_response(
        group, role=membership.role, member_count=member_count
    )


@router.patch(
    "/groups/{group_id}/preferences", response_model=GroupResponse
)
def update_group_preferences(
    group_id: uuid.UUID,
    payload: GroupPreferencesUpdate,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    group = db.get(Groups, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    data = payload.model_dump(exclude_unset=True)
    if "min_beds" in data:
        group.min_beds = data["min_beds"]
    if "max_beds" in data:
        group.max_beds = data["max_beds"]
    if "min_rent_usd" in data:
        group.min_rent_usd = data["min_rent_usd"]
    if "max_rent_usd" in data:
        group.max_rent_usd = data["max_rent_usd"]
    if "preferred_cities" in data:
        group.preferred_cities = _clean_str_list(data["preferred_cities"])
    if "preferred_neighborhoods" in data:
        group.preferred_neighborhoods = _clean_str_list(data["preferred_neighborhoods"])
    if "dealbreakers" in data:
        group.dealbreakers = _clean_str_list(data["dealbreakers"])
    if "notes" in data:
        note = (data["notes"] or "").strip()
        group.preferences_notes = note or None
    db.commit()
    db.refresh(group)
    member_count = int(
        db.execute(
            select(func.count(GroupMembers.id)).where(GroupMembers.group_id == group.id)
        ).scalar_one()
    )
    return _build_group_response(
        group, role=membership.role, member_count=member_count
    )


@router.delete("/groups/{group_id}", status_code=204)
def delete_group(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member(role="owner")),
    db: Session = Depends(get_db),
):
    group = db.get(Groups, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(group)
    db.commit()
    return None


@router.post("/groups/{group_id}/leave", status_code=204)
def leave_group(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    if membership.role == "owner":
        other_owners = db.execute(
            select(func.count(GroupMembers.id)).where(
                GroupMembers.group_id == group_id,
                GroupMembers.role == "owner",
                GroupMembers.user_id != membership.user_id,
            )
        ).scalar_one()
        if int(other_owners) == 0:
            raise HTTPException(
                status_code=400,
                detail="Transfer ownership or delete the group before leaving",
            )
    db.delete(membership)
    db.commit()
    return None


@router.get("/groups/{group_id}/members", response_model=GroupMembersListResponse)
def list_members(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(
            GroupMembers.user_id,
            GroupMembers.role,
            GroupMembers.joined_at,
            Users.email,
        )
        .join(Users, Users.id == GroupMembers.user_id)
        .where(GroupMembers.group_id == group_id)
        .order_by(GroupMembers.joined_at.asc())
    ).all()
    return GroupMembersListResponse(
        members=[
            GroupMemberResponse(
                user_id=r.user_id,
                email=r.email,
                role=r.role,
                joined_at=r.joined_at,
            )
            for r in rows
        ]
    )


@router.delete("/groups/{group_id}/members/{user_id}", status_code=204)
def remove_member(
    group_id: uuid.UUID,
    user_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member(role="owner")),
    db: Session = Depends(get_db),
):
    if user_id == membership.user_id:
        raise HTTPException(status_code=400, detail="Owner cannot remove themselves")
    target = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group_id, GroupMembers.user_id == user_id
        )
    ).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(target)
    db.commit()
    return None


@router.patch(
    "/groups/{group_id}/members/{user_id}/role", response_model=GroupMemberResponse
)
def update_member_role(
    group_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: GroupMemberRoleUpdateRequest,
    membership: GroupMembers = Depends(require_group_member(role="owner")),
    db: Session = Depends(get_db),
):
    target = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group_id, GroupMembers.user_id == user_id
        )
    ).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="Member not found")

    if target.role == payload.role:
        pass
    elif payload.role == "member" and target.role == "owner":
        other_owners = db.execute(
            select(func.count(GroupMembers.id)).where(
                GroupMembers.group_id == group_id,
                GroupMembers.role == "owner",
                GroupMembers.user_id != target.user_id,
            )
        ).scalar_one()
        if int(other_owners) == 0:
            raise HTTPException(
                status_code=400,
                detail="Cannot demote the last owner",
            )
        target.role = "member"
        db.commit()
        db.refresh(target)
    else:
        target.role = payload.role
        db.commit()
        db.refresh(target)

    user_row = db.get(Users, target.user_id)
    return GroupMemberResponse(
        user_id=target.user_id,
        email=user_row.email if user_row else "",
        role=target.role,
        joined_at=target.joined_at,
    )


@router.get("/groups/{group_id}/invites", response_model=GroupInvitesListResponse)
def list_invites(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(GroupInvites)
        .where(GroupInvites.group_id == group_id)
        .order_by(GroupInvites.created_at.desc())
    ).scalars()
    return GroupInvitesListResponse(invites=[_invite_to_response(r) for r in rows])


@router.post("/groups/{group_id}/invites", response_model=GroupInviteResponse)
def create_invite(
    group_id: uuid.UUID,
    payload: GroupInviteCreateRequest,
    membership: GroupMembers = Depends(require_group_member()),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.kind == "email" and not payload.email:
        raise HTTPException(status_code=400, detail="Email is required for email invites")

    token = secrets.token_urlsafe(32)
    ttl_days = 14 if payload.kind == "email" else 30
    expires_at = _utc_now() + timedelta(days=ttl_days)
    invite = GroupInvites(
        group_id=group_id,
        invited_by=user.id,
        token=token,
        email=(payload.email or None),
        kind=payload.kind,
        expires_at=expires_at,
    )
    db.add(invite)
    db.flush()

    if payload.kind == "email" and payload.email:
        group = db.get(Groups, group_id)
        group_name = group.name if group else ""
        try:
            send_group_invite_email(
                to_email=payload.email,
                inviter_email=user.email,
                group_name=group_name,
                accept_url=_accept_url(token),
            )
        except ValueError as exc:
            db.rollback()
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    db.commit()
    db.refresh(invite)
    return _invite_to_response(invite)


@router.delete("/groups/{group_id}/invites/{invite_id}", status_code=204)
def revoke_invite(
    group_id: uuid.UUID,
    invite_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    invite = db.execute(
        select(GroupInvites).where(
            GroupInvites.id == invite_id, GroupInvites.group_id == group_id
        )
    ).scalar_one_or_none()
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite.revoked_at is None and invite.accepted_at is None:
        invite.revoked_at = _utc_now()
        db.commit()
    return None


@router.get("/invites/{token}", response_model=InvitePreviewResponse)
def preview_invite(token: str, db: Session = Depends(get_db)):
    invite = db.execute(
        select(GroupInvites).where(GroupInvites.token == token)
    ).scalar_one_or_none()
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    group = db.get(Groups, invite.group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    inviter_email: str | None = None
    if invite.invited_by is not None:
        inviter = db.get(Users, invite.invited_by)
        inviter_email = inviter.email if inviter else None
    return InvitePreviewResponse(
        group_id=group.id,
        group_name=group.name,
        inviter_email=inviter_email,
        kind=invite.kind,
        email=invite.email,
        expired=invite.expires_at <= _utc_now(),
        revoked=invite.revoked_at is not None,
        already_accepted=invite.accepted_at is not None,
    )


@router.post("/invites/accept", response_model=InviteAcceptResponse)
def accept_invite(
    payload: InviteAcceptRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    invite = db.execute(
        select(GroupInvites).where(GroupInvites.token == payload.token)
    ).scalar_one_or_none()
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite.revoked_at is not None:
        raise HTTPException(status_code=410, detail="Invite was revoked")
    if invite.expires_at <= _utc_now():
        raise HTTPException(status_code=410, detail="Invite has expired")
    if invite.kind == "email" and invite.email:
        if invite.email.strip().lower() != user.email.strip().lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This invite was sent to a different email",
            )
    if (
        invite.accepted_at is not None
        and invite.kind == "email"
        and invite.accepted_by_user_id is not None
        and invite.accepted_by_user_id != user.id
    ):
        raise HTTPException(status_code=410, detail="Invite already used")

    group = db.get(Groups, invite.group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    existing = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == invite.group_id,
            GroupMembers.user_id == user.id,
        )
    ).scalar_one_or_none()
    newly_joined = existing is None
    if newly_joined:
        db.add(
            GroupMembers(group_id=invite.group_id, user_id=user.id, role="member")
        )
    if invite.accepted_at is None:
        invite.accepted_at = _utc_now()
        invite.accepted_by_user_id = user.id

    inviter_email: str | None = None
    if newly_joined and invite.invited_by is not None and invite.invited_by != user.id:
        inviter = db.get(Users, invite.invited_by)
        if inviter is not None:
            inviter_email = inviter.email

    db.commit()

    if inviter_email:
        try:
            send_group_member_joined_email(
                to_email=inviter_email,
                joiner_email=user.email,
                group_name=group.name,
                group_url=f"{_app_base_url()}/groups/{group.id}",
            )
        except ValueError:
            logger.exception(
                "Failed to send group join notification to inviter %s", inviter_email
            )

    return InviteAcceptResponse(group_id=group.id, group_name=group.name)
