from __future__ import annotations

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from landlord_entities.schemas import (
    LandlordClaimRequest,
    LandlordEntityDetail,
    LandlordEntityReviewsResponse,
    LandlordPortfolioResponse,
)
from landlord_entities.service import (
    get_entity_detail,
    list_entity_reviews,
    list_portfolio,
    request_claim,
)

router = APIRouter(prefix="/landlord-entities", tags=["landlord-entities"])


@router.get("/{entity_id}", response_model=LandlordEntityDetail)
def read_entity(entity_id: str, db: Session = Depends(get_db)) -> LandlordEntityDetail:
    return get_entity_detail(db, entity_id)


@router.get("/{entity_id}/buildings", response_model=LandlordPortfolioResponse)
def read_portfolio(entity_id: str, db: Session = Depends(get_db)) -> LandlordPortfolioResponse:
    return list_portfolio(db, entity_id)


@router.get("/{entity_id}/reviews", response_model=LandlordEntityReviewsResponse)
def read_reviews(
    entity_id: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    verified_only: bool = False,
    db: Session = Depends(get_db),
) -> LandlordEntityReviewsResponse:
    return list_entity_reviews(db, entity_id, limit, offset, verified_only)


@router.post(
    "/{entity_id}/claim",
    response_model=LandlordEntityDetail,
    status_code=status.HTTP_202_ACCEPTED,
)
def post_claim(
    entity_id: str,
    payload: LandlordClaimRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> LandlordEntityDetail:
    return request_claim(db, user, entity_id, payload)
