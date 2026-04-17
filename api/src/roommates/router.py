from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from roommates.schemas import (
    CreateGroupFromConnectionRequest,
    CreateGroupFromConnectionResponse,
    InviteConnectionToGroupRequest,
    InviteConnectionToGroupResponse,
    MyRoommateProfileOut,
    MyRoommateProfilePatch,
    RoommateConnectionCreate,
    RoommateConnectionListResponse,
    RoommateConnectionOut,
    RoommateMatchesListResponse,
    RoommateMessagePayload,
)
from roommates.service import (
    create_connection,
    create_group_from_connection,
    create_message,
    delete_connection,
    invite_connection_to_group,
    list_connections,
    list_matches,
    patch_my_profile,
    read_my_profile,
)

router = APIRouter(prefix="/roommates", tags=["roommates"])


@router.get("/profile", response_model=MyRoommateProfileOut)
def read_my_roommate_profile(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return read_my_profile(db, user.id)


@router.patch("/profile", response_model=MyRoommateProfileOut)
def patch_my_roommate_profile(
    body: MyRoommateProfilePatch, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return patch_my_profile(db, user.id, body)


@router.get("/connections", response_model=RoommateConnectionListResponse)
def read_roommate_connections(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return RoommateConnectionListResponse(connections=list_connections(db, user.id))


@router.post("/connections", response_model=RoommateConnectionOut)
def create_roommate_connection(
    body: RoommateConnectionCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_connection(db, user.id, body)


@router.delete("/connections/{connection_id}", status_code=204)
def delete_roommate_connection(
    connection_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    delete_connection(db, user.id, connection_id)
    return None


@router.post("/connections/{connection_id}/messages", response_model=RoommateMessagePayload)
def create_roommate_message(
    connection_id: str,
    body: RoommateMessagePayload,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_message(db, user.id, connection_id, body)


@router.post(
    "/connections/{connection_id}/group",
    response_model=CreateGroupFromConnectionResponse,
)
def create_group_from_roommate_connection(
    connection_id: str,
    body: CreateGroupFromConnectionRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_group_from_connection(db, user, connection_id, body.name)


@router.post(
    "/connections/{connection_id}/invites",
    response_model=InviteConnectionToGroupResponse,
)
def invite_roommate_connection_to_group(
    connection_id: str,
    body: InviteConnectionToGroupRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return invite_connection_to_group(db, user, connection_id, body.group_id)


@router.get("/matches", response_model=RoommateMatchesListResponse)
def read_roommate_matches(
    group_id: uuid.UUID | None = None,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return RoommateMatchesListResponse(matches=list_matches(db, user.id, group_id))
