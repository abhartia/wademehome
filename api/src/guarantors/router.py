from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from guarantors.schemas import (
    GuarantorDecisionPatch,
    GuarantorInviteOut,
    GuarantorRequestCreate,
    GuarantorRequestListResponse,
    GuarantorRequestOut,
    GuarantorRequestPatch,
    SavedGuarantorCreate,
    SavedGuarantorListResponse,
    SavedGuarantorOut,
    SavedGuarantorPatch,
)
from guarantors.service import (
    apply_decision,
    create_invite,
    create_request,
    create_saved_guarantor,
    delete_request,
    delete_saved_guarantor,
    list_requests,
    list_saved_guarantors,
    patch_request,
    patch_saved_guarantor,
)

router = APIRouter(prefix="/guarantors", tags=["guarantors"])


@router.get("", response_model=SavedGuarantorListResponse)
def read_saved_guarantors(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return SavedGuarantorListResponse(saved_guarantors=list_saved_guarantors(db, user.id))


@router.post("", response_model=SavedGuarantorOut)
def create_saved_guarantor_route(
    body: SavedGuarantorCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_saved_guarantor(db, user.id, body)


@router.patch("/{guarantor_id}", response_model=SavedGuarantorOut)
def patch_saved_guarantor_route(
    guarantor_id: uuid.UUID,
    body: SavedGuarantorPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_saved_guarantor(db, user.id, guarantor_id, body)


@router.delete("/{guarantor_id}", status_code=204)
def delete_saved_guarantor_route(
    guarantor_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    delete_saved_guarantor(db, user.id, guarantor_id)
    return None


@router.get("/requests", response_model=GuarantorRequestListResponse)
def read_guarantor_requests(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return GuarantorRequestListResponse(requests=list_requests(db, user.id))


@router.post("/requests", response_model=GuarantorRequestOut)
def create_guarantor_request_route(
    body: GuarantorRequestCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_request(db, user.id, body)


@router.patch("/requests/{request_id}", response_model=GuarantorRequestOut)
def patch_guarantor_request_route(
    request_id: uuid.UUID,
    body: GuarantorRequestPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_request(db, user.id, request_id, body)


@router.post("/requests/{request_id}/invite", response_model=GuarantorInviteOut)
def invite_guarantor_request_route(
    request_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_invite(db, user.id, request_id)


@router.post("/requests/{request_id}/decision", response_model=GuarantorRequestOut)
def decision_guarantor_request_route(
    request_id: uuid.UUID,
    body: GuarantorDecisionPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return apply_decision(db, user.id, request_id, body)


@router.delete("/requests/{request_id}", status_code=204)
def delete_guarantor_request_route(
    request_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    delete_request(db, user.id, request_id)
    return None
