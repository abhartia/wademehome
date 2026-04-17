from __future__ import annotations

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from auth.router import get_current_admin_user, get_db
from db.models import LandlordEntities, Users
from reviews_admin.schemas import (
    EmptyResponse,
    LandlordEntityClaimApproveRequest,
    LandlordMergeRequest,
    ModerationDecisionRequest,
    ModerationQueueItem,
    ModerationQueueResponse,
    OwnershipPeriodUpsert,
    VerificationDecisionRequest,
    VerificationQueueItem,
    VerificationQueueResponse,
)
from reviews_admin.service import (
    approve_claim,
    decide_moderation,
    decide_verification,
    list_moderation_queue,
    list_verification_queue,
    merge_landlord_entities,
    refresh_portfolio_cache,
    upsert_ownership_period,
)

router = APIRouter(
    prefix="/admin/reviews", tags=["admin-reviews"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.get("/verifications", response_model=VerificationQueueResponse)
def read_verification_queue(
    status_filter: str | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> VerificationQueueResponse:
    return list_verification_queue(db, status_filter, limit, offset)


@router.post("/verifications/{verification_id}/decide", response_model=VerificationQueueItem)
def decide_verification_endpoint(
    verification_id: str,
    payload: VerificationDecisionRequest,
    admin: Users = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> VerificationQueueItem:
    return decide_verification(db, admin, verification_id, payload)


@router.get("/moderation", response_model=ModerationQueueResponse)
def read_moderation_queue(
    status_filter: str | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> ModerationQueueResponse:
    return list_moderation_queue(db, status_filter, limit, offset)


@router.post("/moderation/{flag_id}/decide", response_model=ModerationQueueItem)
def decide_moderation_endpoint(
    flag_id: str,
    payload: ModerationDecisionRequest,
    admin: Users = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
) -> ModerationQueueItem:
    return decide_moderation(db, admin, flag_id, payload)


@router.post(
    "/ownership-periods",
    status_code=status.HTTP_201_CREATED,
    response_model=EmptyResponse,
)
def upsert_ownership(
    payload: OwnershipPeriodUpsert,
    db: Session = Depends(get_db),
) -> EmptyResponse:
    upsert_ownership_period(db, payload)
    return EmptyResponse()


@router.post("/landlord-entities/merge", response_model=EmptyResponse)
def post_merge(
    payload: LandlordMergeRequest,
    db: Session = Depends(get_db),
) -> EmptyResponse:
    merge_landlord_entities(db, payload)
    return EmptyResponse()


@router.post("/landlord-entities/{entity_id}/approve-claim", response_model=EmptyResponse)
def post_approve_claim(
    entity_id: str,
    payload: LandlordEntityClaimApproveRequest,
    db: Session = Depends(get_db),
) -> EmptyResponse:
    approve_claim(db, entity_id, payload)
    return EmptyResponse()


@router.post("/portfolio-cache/refresh", response_model=EmptyResponse)
def post_refresh_portfolio_cache(db: Session = Depends(get_db)) -> EmptyResponse:
    refresh_portfolio_cache(db)
    return EmptyResponse()
