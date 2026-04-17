from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from buildings.schemas import (
    BuildingDetailResponse,
    BuildingResolveRequest,
    BuildingResolveResponse,
    BuildingReviewsResponse,
    DobComplaintsResponse,
    HpdViolationsResponse,
    OwnershipHistoryResponse,
)
from buildings.service import (
    get_building_detail,
    list_building_reviews,
    list_dob_complaints,
    list_hpd_violations,
    list_ownership_history,
    resolve_or_create_building,
    _to_building_payload,
)

router = APIRouter(prefix="/buildings", tags=["buildings"])


@router.post("/resolve", response_model=BuildingResolveResponse)
def resolve_building(
    payload: BuildingResolveRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BuildingResolveResponse:
    building, is_new = resolve_or_create_building(db, payload)
    return BuildingResolveResponse(building=_to_building_payload(building), is_new=is_new)


@router.get("/{building_id}", response_model=BuildingDetailResponse)
def read_building(
    building_id: str,
    db: Session = Depends(get_db),
) -> BuildingDetailResponse:
    return get_building_detail(db, building_id)


@router.get("/{building_id}/reviews", response_model=BuildingReviewsResponse)
def read_building_reviews(
    building_id: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    verified_only: bool = False,
    db: Session = Depends(get_db),
) -> BuildingReviewsResponse:
    reviews, total = list_building_reviews(db, building_id, limit, offset, verified_only)
    return BuildingReviewsResponse(reviews=reviews, total=total, limit=limit, offset=offset)


@router.get("/{building_id}/ownership-history", response_model=OwnershipHistoryResponse)
def read_ownership_history(
    building_id: str,
    db: Session = Depends(get_db),
) -> OwnershipHistoryResponse:
    return OwnershipHistoryResponse(periods=list_ownership_history(db, building_id))


@router.get("/{building_id}/hpd-violations", response_model=HpdViolationsResponse)
def read_hpd_violations(
    building_id: str,
    limit: int = Query(50, ge=1, le=500),
    open_only: bool = False,
    db: Session = Depends(get_db),
) -> HpdViolationsResponse:
    violations, total = list_hpd_violations(db, building_id, limit, open_only)
    return HpdViolationsResponse(violations=violations, total=total)


@router.get("/{building_id}/dob-complaints", response_model=DobComplaintsResponse)
def read_dob_complaints(
    building_id: str,
    limit: int = Query(50, ge=1, le=500),
    open_only: bool = False,
    db: Session = Depends(get_db),
) -> DobComplaintsResponse:
    complaints, total = list_dob_complaints(db, building_id, limit, open_only)
    return DobComplaintsResponse(complaints=complaints, total=total)
