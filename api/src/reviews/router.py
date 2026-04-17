from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from auth.security import build_cookie_settings, hash_token, utc_now
from db.models import UserSessions, Users
from reviews.schemas import (
    ReviewCreateRequest,
    ReviewFlagPayload,
    ReviewFlagRequest,
    ReviewListResponse,
    ReviewPayload,
    ReviewResponseCreate,
    ReviewResponsePayload,
    ReviewVerificationCreate,
    ReviewVerificationPayload,
)
from reviews.service import (
    create_flag,
    create_response,
    create_review,
    create_verification,
    get_review,
    list_reviews_by_author,
    list_reviews_for_claimed_entities,
    upload_verification_file,
)

router = APIRouter(prefix="/reviews", tags=["reviews"])


def _optional_current_user(
    request: Request, db: Session = Depends(get_db)
) -> Users | None:
    cookie_name = str(build_cookie_settings()["key"])
    token = request.cookies.get(cookie_name)
    if not token:
        return None
    session = db.execute(
        select(UserSessions).where(UserSessions.token_hash == hash_token(token))
    ).scalar_one_or_none()
    if not session or session.revoked_at is not None or session.expires_at <= utc_now():
        return None
    user = db.execute(select(Users).where(Users.id == session.user_id)).scalar_one_or_none()
    if not user or not user.is_active:
        return None
    return user


@router.post("", response_model=ReviewPayload, status_code=status.HTTP_201_CREATED)
def post_review(
    payload: ReviewCreateRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewPayload:
    return create_review(db, user, payload)


@router.get("/mine", response_model=ReviewListResponse)
def read_my_reviews(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewListResponse:
    reviews, total = list_reviews_by_author(db, user, limit, offset)
    return ReviewListResponse(reviews=reviews, total=total)


@router.get("/landlord-inbox", response_model=ReviewListResponse)
def read_landlord_inbox(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewListResponse:
    reviews, total = list_reviews_for_claimed_entities(db, user, limit, offset)
    return ReviewListResponse(reviews=reviews, total=total)


@router.get("/{review_id}", response_model=ReviewPayload)
def read_review(
    review_id: str,
    db: Session = Depends(get_db),
) -> ReviewPayload:
    return get_review(db, review_id)


@router.post(
    "/{review_id}/response",
    response_model=ReviewResponsePayload,
    status_code=status.HTTP_201_CREATED,
)
def post_response(
    review_id: str,
    payload: ReviewResponseCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewResponsePayload:
    return create_response(db, user, review_id, payload)


@router.post(
    "/{review_id}/flag",
    response_model=ReviewFlagPayload,
    status_code=status.HTTP_201_CREATED,
)
def post_flag(
    review_id: str,
    payload: ReviewFlagRequest,
    user: Users | None = Depends(_optional_current_user),
    db: Session = Depends(get_db),
) -> ReviewFlagPayload:
    return create_flag(db, user, review_id, payload)


@router.post(
    "/{review_id}/verification",
    response_model=ReviewVerificationPayload,
    status_code=status.HTTP_201_CREATED,
)
def post_verification(
    review_id: str,
    payload: ReviewVerificationCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewVerificationPayload:
    return create_verification(db, user, review_id, payload)


@router.post(
    "/{review_id}/verification/upload",
    response_model=ReviewVerificationPayload,
    status_code=status.HTTP_201_CREATED,
)
def post_verification_upload(
    review_id: str,
    file: UploadFile = File(...),
    proof_type: str = Form(...),
    tenancy_start: str | None = Form(None),
    tenancy_end: str | None = Form(None),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ReviewVerificationPayload:
    start = date.fromisoformat(tenancy_start) if tenancy_start else None
    end = date.fromisoformat(tenancy_end) if tenancy_end else None
    return upload_verification_file(db, user, review_id, file, proof_type, start, end)
