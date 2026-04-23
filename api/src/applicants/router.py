from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from applicants.schemas import (
    ApplicantCreateRequest,
    ApplicantResponse,
    ApplicantsListResponse,
    ApplicantUpdateRequest,
    PublicApplicantPreviewResponse,
    PublicApplicantSubmitRequest,
    PublicApplicantSubmitResponse,
    SelfRegLinkCreateRequest,
    SelfRegLinkResponse,
)
from applicants.service import (
    applicant_to_response,
    generate_self_reg_token,
    self_reg_expiry,
    self_reg_url,
)
from auth.router import get_current_user, get_db
from db.models import GroupApplicants, GroupMembers, Groups, Users
from groups.deps import require_group_member
from groups.service import utc_now

router = APIRouter(tags=["applicants"])


# ── Authenticated, group-scoped ──────────────────────────────────────────


@router.get("/groups/{group_id}/applicants", response_model=ApplicantsListResponse)
def list_applicants(
    group_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    rows = db.execute(
        select(GroupApplicants).where(GroupApplicants.group_id == group_id).order_by(GroupApplicants.created_at.desc())
    ).scalars()
    return ApplicantsListResponse(applicants=[applicant_to_response(r) for r in rows])


@router.post("/groups/{group_id}/applicants", response_model=ApplicantResponse)
def create_applicant(
    group_id: uuid.UUID,
    payload: ApplicantCreateRequest,
    membership: GroupMembers = Depends(require_group_member()),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    applicant = GroupApplicants(
        group_id=group_id,
        name=(payload.name.strip() if payload.name else None),
        email=(str(payload.email) if payload.email else None),
        phone=(payload.phone.strip() if payload.phone else None),
        status=payload.status,
        role_context=(payload.role_context.strip() if payload.role_context else None),
        notes=payload.notes,
        budget_usd=payload.budget_usd,
        move_in_date=payload.move_in_date,
        source="manual",
        created_by=user.id,
    )
    db.add(applicant)
    db.commit()
    db.refresh(applicant)
    return applicant_to_response(applicant)


@router.patch(
    "/groups/{group_id}/applicants/{applicant_id}",
    response_model=ApplicantResponse,
)
def update_applicant(
    group_id: uuid.UUID,
    applicant_id: uuid.UUID,
    payload: ApplicantUpdateRequest,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    applicant = db.execute(
        select(GroupApplicants).where(
            GroupApplicants.id == applicant_id,
            GroupApplicants.group_id == group_id,
        )
    ).scalar_one_or_none()
    if applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")

    data = payload.model_dump(exclude_unset=True)
    if "name" in data:
        applicant.name = data["name"].strip() if isinstance(data["name"], str) else data["name"]
    if "email" in data:
        applicant.email = str(data["email"]) if data["email"] else None
    if "phone" in data:
        applicant.phone = data["phone"].strip() if isinstance(data["phone"], str) else data["phone"]
    if "status" in data and data["status"] is not None:
        applicant.status = data["status"]
    if "role_context" in data:
        applicant.role_context = (
            data["role_context"].strip() if isinstance(data["role_context"], str) else data["role_context"]
        )
    if "notes" in data:
        applicant.notes = data["notes"]
    if "budget_usd" in data:
        applicant.budget_usd = data["budget_usd"]
    if "move_in_date" in data:
        applicant.move_in_date = data["move_in_date"]

    db.commit()
    db.refresh(applicant)
    return applicant_to_response(applicant)


@router.delete("/groups/{group_id}/applicants/{applicant_id}", status_code=204)
def delete_applicant(
    group_id: uuid.UUID,
    applicant_id: uuid.UUID,
    membership: GroupMembers = Depends(require_group_member()),
    db: Session = Depends(get_db),
):
    applicant = db.execute(
        select(GroupApplicants).where(
            GroupApplicants.id == applicant_id,
            GroupApplicants.group_id == group_id,
        )
    ).scalar_one_or_none()
    if applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    db.delete(applicant)
    db.commit()
    return None


@router.post(
    "/groups/{group_id}/applicants/self-registration-link",
    response_model=SelfRegLinkResponse,
)
def create_self_registration_link(
    group_id: uuid.UUID,
    payload: SelfRegLinkCreateRequest,
    membership: GroupMembers = Depends(require_group_member()),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    token = generate_self_reg_token()
    expires_at = self_reg_expiry()
    applicant = GroupApplicants(
        group_id=group_id,
        role_context=(payload.role_context.strip() if payload.role_context else None),
        status="new",
        source="self_registration",
        self_reg_token=token,
        self_reg_token_expires_at=expires_at,
        created_by=user.id,
    )
    db.add(applicant)
    db.commit()
    db.refresh(applicant)
    return SelfRegLinkResponse(
        applicant_id=applicant.id,
        token=token,
        url=self_reg_url(token),
        expires_at=expires_at,
    )


# ── Public (unauthenticated) self-registration ──────────────────────────


@router.get("/public/applicants/{token}", response_model=PublicApplicantPreviewResponse)
def preview_public_applicant(token: str, db: Session = Depends(get_db)):
    applicant = db.execute(select(GroupApplicants).where(GroupApplicants.self_reg_token == token)).scalar_one_or_none()
    if applicant is None:
        raise HTTPException(status_code=404, detail="Link not found")
    group = db.get(Groups, applicant.group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    expired = applicant.self_reg_token_expires_at is None or applicant.self_reg_token_expires_at <= utc_now()
    already_submitted = applicant.name is not None or applicant.email is not None
    return PublicApplicantPreviewResponse(
        group_name=group.name,
        role_context=applicant.role_context,
        expired=expired,
        already_submitted=already_submitted,
    )


@router.post("/public/applicants/{token}", response_model=PublicApplicantSubmitResponse)
def submit_public_applicant(
    token: str,
    payload: PublicApplicantSubmitRequest,
    db: Session = Depends(get_db),
):
    applicant = db.execute(select(GroupApplicants).where(GroupApplicants.self_reg_token == token)).scalar_one_or_none()
    if applicant is None:
        raise HTTPException(status_code=404, detail="Link not found")
    if applicant.self_reg_token_expires_at is None or applicant.self_reg_token_expires_at <= utc_now():
        raise HTTPException(status_code=410, detail="Link expired")

    group = db.get(Groups, applicant.group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    applicant.name = payload.name.strip()
    applicant.email = str(payload.email)
    applicant.phone = payload.phone.strip() if payload.phone else None
    applicant.notes = payload.notes
    applicant.budget_usd = payload.budget_usd
    applicant.move_in_date = payload.move_in_date
    applicant.source = "self_registration"
    applicant.self_reg_token = None
    applicant.self_reg_token_expires_at = None

    db.commit()
    return PublicApplicantSubmitResponse(group_name=group.name, submitted=True)
