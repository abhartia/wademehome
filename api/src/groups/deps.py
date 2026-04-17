from __future__ import annotations

import uuid

from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import GroupMembers, Users


def require_group_member(role: str | None = None):
    def _dep(
        group_id: uuid.UUID,
        user: Users = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> GroupMembers:
        membership = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == group_id,
                GroupMembers.user_id == user.id,
            )
        ).scalar_one_or_none()
        if membership is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Group not found"
            )
        if role == "owner" and membership.role != "owner":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Owner only"
            )
        return membership

    return _dep


def resolve_scope(
    group_id: uuid.UUID | None,
    user: Users,
    db: Session,
) -> tuple[uuid.UUID, uuid.UUID | None]:
    """Validate optional group_id scoping. Returns (user_id, group_id_or_None).

    Raises 404 if group_id is provided but the user is not a member.
    """
    if group_id is None:
        return user.id, None
    membership = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group_id,
            GroupMembers.user_id == user.id,
        )
    ).scalar_one_or_none()
    if membership is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Group not found"
        )
    return user.id, group_id
