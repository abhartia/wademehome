from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta, timezone

from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import HTTPException, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from auth.security import utc_now
from buildings.service import find_owner_at_date
from core.config import Config
from db.models import (
    BuildingOwnershipPeriods,
    Buildings,
    LandlordEntities,
    LandlordEntityKind,
    LandlordProfiles,
    OwnershipRole,
    OwnershipSource,
    ReviewDimension,
    ReviewFlagStatus,
    ReviewFlagSubmitterRole,
    ReviewFlagType,
    ReviewLandlordRelation,
    ReviewModeration,
    ReviewResponses,
    ReviewStatus,
    ReviewSubratings,
    ReviewVerificationProofType,
    ReviewVerificationStatus,
    ReviewVerifications,
    Reviews,
    UserProfiles,
    UserRole,
    Users,
)
from reviews.schemas import (
    ReviewCreateRequest,
    ReviewFlagPayload,
    ReviewFlagRequest,
    ReviewPayload,
    ReviewResponseCreate,
    ReviewResponsePayload,
    ReviewVerificationCreate,
    ReviewVerificationPayload,
)


# Negative reviews enter a 24h cooldown before publishing; positive reviews
# publish immediately. Keeps room for admin moderation + landlord flag before
# content goes live.
NEGATIVE_RATING_THRESHOLD = 2
COOLDOWN_HOURS = 24


def _parse_uuid(raw: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Invalid {label}") from exc


def _resolve_landlord_entity_for_tenancy(
    db: Session,
    building_id: uuid.UUID,
    tenancy_start: date,
    landlord_hint_name: str | None,
) -> tuple[LandlordEntities, BuildingOwnershipPeriods | None]:
    """Snapshot the landlord entity at the start of the tenancy.

    Preference order:
      1. An ACRIS-sourced / claimed owner period overlapping tenancy_start.
      2. A crowdsourced landlord entity created from landlord_hint_name.
    """
    period = find_owner_at_date(db, building_id, tenancy_start)
    if period is not None:
        return period.landlord_entity, period

    if not landlord_hint_name or not landlord_hint_name.strip():
        raise HTTPException(
            status_code=422,
            detail=(
                "We could not resolve the landlord for this tenancy window. "
                "Please provide the landlord or management company name "
                "as `landlord_hint_name`."
            ),
        )

    name = landlord_hint_name.strip()
    entity = db.execute(
        select(LandlordEntities).where(
            func.lower(LandlordEntities.canonical_name) == name.lower(),
            LandlordEntities.kind == LandlordEntityKind.unknown,
        )
    ).scalar_one_or_none()
    if entity is None:
        entity = LandlordEntities(
            kind=LandlordEntityKind.unknown,
            canonical_name=name,
        )
        db.add(entity)
        db.flush()

    # Insert a crowdsourced ownership period spanning just this tenancy start.
    # Admin review + ACRIS ingest will eventually replace / merge it.
    period = BuildingOwnershipPeriods(
        building_id=building_id,
        landlord_entity_id=entity.id,
        role=OwnershipRole.owner,
        start_date=tenancy_start,
        end_date=None,
        source=OwnershipSource.crowdsourced,
        confidence=0.3,
        notes="Auto-created from reviewer landlord hint; needs admin confirmation.",
    )
    try:
        db.add(period)
        db.flush()
    except Exception:
        # Exclusion constraint violation: an overlapping owner already exists.
        # Re-run the lookup and snapshot the pre-existing period.
        db.rollback()
        period = find_owner_at_date(db, building_id, tenancy_start)
        if period is None:
            raise
        return period.landlord_entity, period

    return entity, period


def _subratings_dict(db: Session, review_id: uuid.UUID) -> dict[str, int]:
    rows = db.execute(
        select(ReviewSubratings.dimension, ReviewSubratings.score).where(
            ReviewSubratings.review_id == review_id
        )
    ).all()
    return {dim.value: score for dim, score in rows}


def _to_review_payload(
    db: Session, review: Reviews
) -> ReviewPayload:
    entity = db.get(LandlordEntities, review.landlord_entity_id)
    response_row = db.execute(
        select(ReviewResponses).where(ReviewResponses.review_id == review.id)
    ).scalar_one_or_none()
    response_payload = None
    if response_row is not None:
        response_payload = ReviewResponsePayload(
            id=str(response_row.id),
            author_user_id=str(response_row.author_user_id),
            body=response_row.body,
            created_at=response_row.created_at,
        )
    return ReviewPayload(
        id=str(review.id),
        author_user_id=str(review.author_user_id),
        building_id=str(review.building_id),
        landlord_entity_id=str(review.landlord_entity_id),
        landlord_entity_name=entity.canonical_name if entity else "",
        ownership_period_id=str(review.ownership_period_id) if review.ownership_period_id else None,
        landlord_relation=review.landlord_relation.value,
        tenancy_start=review.tenancy_start,
        tenancy_end=review.tenancy_end,
        overall_rating=review.overall_rating,
        title=review.title,
        body=review.body,
        verified_tenant=review.verified_tenant,
        status=review.status.value,
        published_at=review.published_at,
        created_at=review.created_at,
        updated_at=review.updated_at,
        subratings=_subratings_dict(db, review.id),
        response=response_payload,
    )


def create_review(
    db: Session, user: Users, payload: ReviewCreateRequest
) -> ReviewPayload:
    if payload.tenancy_end and payload.tenancy_end < payload.tenancy_start:
        raise HTTPException(status_code=422, detail="tenancy_end before tenancy_start")

    building_id = _parse_uuid(payload.building_id, "building_id")
    if db.get(Buildings, building_id) is None:
        raise HTTPException(status_code=404, detail="Building not found")

    entity, period = _resolve_landlord_entity_for_tenancy(
        db, building_id, payload.tenancy_start, payload.landlord_hint_name
    )

    now = utc_now()
    is_negative = payload.overall_rating <= NEGATIVE_RATING_THRESHOLD
    status = ReviewStatus.pending_cooldown if is_negative else ReviewStatus.published
    published_at = None if is_negative else now

    review = Reviews(
        author_user_id=user.id,
        building_id=building_id,
        landlord_entity_id=entity.id,
        ownership_period_id=period.id if period else None,
        landlord_relation=ReviewLandlordRelation(payload.landlord_relation),
        tenancy_start=payload.tenancy_start,
        tenancy_end=payload.tenancy_end,
        overall_rating=payload.overall_rating,
        title=payload.title,
        body=payload.body,
        status=status,
        published_at=published_at,
    )
    db.add(review)
    db.flush()

    for sub in payload.subratings:
        db.add(
            ReviewSubratings(
                review_id=review.id,
                dimension=ReviewDimension(sub.dimension),
                score=sub.score,
            )
        )
    db.commit()
    db.refresh(review)
    return _to_review_payload(db, review)


def _get_review_or_404(db: Session, review_id: str) -> Reviews:
    rid = _parse_uuid(review_id, "review_id")
    review = db.get(Reviews, rid)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


def get_review(db: Session, review_id: str) -> ReviewPayload:
    review = _get_review_or_404(db, review_id)
    if review.status in (ReviewStatus.hidden, ReviewStatus.removed):
        raise HTTPException(status_code=404, detail="Review not available")
    return _to_review_payload(db, review)


def publish_due_reviews(db: Session) -> int:
    """Promote pending_cooldown reviews past their cooldown to published.

    Intended to be called by a periodic worker; also invoked opportunistically
    so a review becomes visible without waiting on the scheduler.
    """
    threshold = utc_now() - timedelta(hours=COOLDOWN_HOURS)
    rows = db.execute(
        select(Reviews).where(
            Reviews.status == ReviewStatus.pending_cooldown,
            Reviews.created_at <= threshold,
        )
    ).scalars().all()
    for r in rows:
        r.status = ReviewStatus.published
        r.published_at = utc_now()
    if rows:
        db.commit()
    return len(rows)


# ── Landlord response ────────────────────────────────────────────────────


def create_response(
    db: Session, user: Users, review_id: str, payload: ReviewResponseCreate
) -> ReviewResponsePayload:
    review = _get_review_or_404(db, review_id)

    # Authorization: user must have a landlord_profile that is linked to the
    # review's landlord_entity via LandlordEntities.claimed_profile_id.
    profile = db.execute(
        select(LandlordProfiles).where(LandlordProfiles.user_id == user.id)
    ).scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=403, detail="Not a landlord account")

    entity = db.get(LandlordEntities, review.landlord_entity_id)
    if entity is None or entity.claimed_profile_id != profile.id:
        raise HTTPException(
            status_code=403, detail="Entity not claimed by this landlord"
        )

    existing = db.execute(
        select(ReviewResponses).where(ReviewResponses.review_id == review.id)
    ).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status_code=409, detail="Response already exists")

    response = ReviewResponses(
        review_id=review.id,
        author_user_id=user.id,
        body=payload.body,
    )
    db.add(response)
    db.commit()
    db.refresh(response)
    return ReviewResponsePayload(
        id=str(response.id),
        author_user_id=str(response.author_user_id),
        body=response.body,
        created_at=response.created_at,
    )


# ── Moderation flag ──────────────────────────────────────────────────────


def create_flag(
    db: Session, user: Users | None, review_id: str, payload: ReviewFlagRequest
) -> ReviewFlagPayload:
    review = _get_review_or_404(db, review_id)

    role = ReviewFlagSubmitterRole.public
    if user is not None:
        if user.role == UserRole.landlord:
            role = ReviewFlagSubmitterRole.landlord
        elif user.id == review.author_user_id:
            role = ReviewFlagSubmitterRole.tenant
        else:
            role = ReviewFlagSubmitterRole.public

    flag = ReviewModeration(
        review_id=review.id,
        flag_type=ReviewFlagType(payload.flag_type),
        submitted_by_user_id=user.id if user is not None else None,
        submitted_by_role=role,
        details=payload.details,
        status=ReviewFlagStatus.open,
    )
    db.add(flag)
    db.commit()
    db.refresh(flag)
    return ReviewFlagPayload(
        id=str(flag.id),
        flag_type=flag.flag_type.value,
        status=flag.status.value,
        details=flag.details,
        created_at=flag.created_at,
    )


# ── Verification upload ──────────────────────────────────────────────────


def create_verification(
    db: Session,
    user: Users,
    review_id: str,
    payload: ReviewVerificationCreate,
) -> ReviewVerificationPayload:
    review = _get_review_or_404(db, review_id)
    if review.author_user_id != user.id:
        raise HTTPException(status_code=403, detail="Only the author can verify")

    existing = db.execute(
        select(ReviewVerifications).where(ReviewVerifications.review_id == review.id)
    ).scalar_one_or_none()
    if existing is not None:
        # Replace storage key and re-set to pending on re-upload.
        existing.storage_key = payload.storage_key
        existing.proof_type = ReviewVerificationProofType(payload.proof_type)
        existing.tenancy_start = payload.tenancy_start
        existing.tenancy_end = payload.tenancy_end
        existing.status = ReviewVerificationStatus.pending
        existing.rejection_reason = None
        existing.reviewed_at = None
        existing.reviewed_by = None
        db.commit()
        db.refresh(existing)
        return _verification_to_payload(existing)

    verification = ReviewVerifications(
        review_id=review.id,
        user_id=user.id,
        proof_type=ReviewVerificationProofType(payload.proof_type),
        storage_key=payload.storage_key,
        tenancy_start=payload.tenancy_start,
        tenancy_end=payload.tenancy_end,
        status=ReviewVerificationStatus.pending,
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return _verification_to_payload(verification)


def _verification_to_payload(v: ReviewVerifications) -> ReviewVerificationPayload:
    return ReviewVerificationPayload(
        id=str(v.id),
        review_id=str(v.review_id),
        proof_type=v.proof_type.value,
        status=v.status.value,
        storage_key=v.storage_key,
        rejection_reason=v.rejection_reason,
        created_at=v.created_at,
    )


# ── Azure Blob upload for tenancy-proof files ──────────────────────────


def _blob_container_for_verifications() -> tuple[BlobServiceClient, str]:
    conn = (Config.get("AZURE_BLOB_CONNECTION_STRING", "") or "").strip()
    container = (
        Config.get("AZURE_BLOB_REVIEW_VERIFICATIONS_CONTAINER", "") or ""
    ).strip()
    if not conn or not container:
        raise HTTPException(
            status_code=500,
            detail=(
                "Azure Blob storage is not configured for review verifications. "
                "Set AZURE_BLOB_REVIEW_VERIFICATIONS_CONTAINER."
            ),
        )
    return BlobServiceClient.from_connection_string(conn), container


def upload_verification_file(
    db: Session,
    user: Users,
    review_id: str,
    file: UploadFile,
    proof_type: str,
    tenancy_start: date | None,
    tenancy_end: date | None,
) -> ReviewVerificationPayload:
    review = _get_review_or_404(db, review_id)
    if review.author_user_id != user.id:
        raise HTTPException(status_code=403, detail="Only the author can verify")

    original_name = file.filename or "proof.pdf"
    ext = original_name.rsplit(".", 1)[-1] if "." in original_name else "pdf"
    blob_name = f"review-verifications/{review.id}/{uuid.uuid4()}.{ext}"
    content = file.file.read()
    content_type = file.content_type or "application/octet-stream"

    try:
        service_client, container = _blob_container_for_verifications()
        blob = service_client.get_blob_client(container=container, blob=blob_name)
        blob.upload_blob(
            content,
            overwrite=False,
            content_settings=ContentSettings(content_type=content_type),
        )
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001 — bubble up as 502 so UI shows a clear error
        raise HTTPException(
            status_code=502, detail=f"Failed to upload proof: {exc!s}"
        ) from exc

    storage_key = blob_name

    existing = db.execute(
        select(ReviewVerifications).where(ReviewVerifications.review_id == review.id)
    ).scalar_one_or_none()
    if existing is not None:
        existing.storage_key = storage_key
        existing.proof_type = ReviewVerificationProofType(proof_type)
        existing.tenancy_start = tenancy_start
        existing.tenancy_end = tenancy_end
        existing.status = ReviewVerificationStatus.pending
        existing.rejection_reason = None
        existing.reviewed_at = None
        existing.reviewed_by = None
        db.commit()
        db.refresh(existing)
        return _verification_to_payload(existing)

    verification = ReviewVerifications(
        review_id=review.id,
        user_id=user.id,
        proof_type=ReviewVerificationProofType(proof_type),
        storage_key=storage_key,
        tenancy_start=tenancy_start,
        tenancy_end=tenancy_end,
        status=ReviewVerificationStatus.pending,
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return _verification_to_payload(verification)


# ── Listings ──────────────────────────────────────────────────────────


def list_reviews_by_author(
    db: Session, user: Users, limit: int, offset: int
) -> tuple[list[ReviewPayload], int]:
    base = select(Reviews).where(Reviews.author_user_id == user.id)
    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = (
        db.execute(base.order_by(Reviews.created_at.desc()).limit(limit).offset(offset))
        .scalars()
        .all()
    )
    payloads = [_to_review_payload(db, r) for r in rows]
    return payloads, int(total or 0)


def list_reviews_for_claimed_entities(
    db: Session,
    user: Users,
    limit: int,
    offset: int,
    include_flagged: bool = False,
) -> tuple[list[ReviewPayload], int]:
    """Reviews on every landlord entity claimed by the current user's profile."""
    profile = db.execute(
        select(LandlordProfiles).where(LandlordProfiles.user_id == user.id)
    ).scalar_one_or_none()
    if profile is None:
        return [], 0

    entity_ids_subq = (
        select(LandlordEntities.id)
        .where(LandlordEntities.claimed_profile_id == profile.id)
        .subquery()
    )

    base = select(Reviews).where(
        Reviews.landlord_entity_id.in_(select(entity_ids_subq.c.id))
    )
    if not include_flagged:
        base = base.where(Reviews.status.in_([ReviewStatus.published, ReviewStatus.pending_cooldown]))

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = (
        db.execute(base.order_by(Reviews.created_at.desc()).limit(limit).offset(offset))
        .scalars()
        .all()
    )
    payloads = [_to_review_payload(db, r) for r in rows]
    return payloads, int(total or 0)
