from __future__ import annotations

import uuid
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from auth.security import utc_now
from db.models import (
    BuildingOwnershipPeriods,
    Buildings,
    LandlordEntities,
    LandlordEntityAliases,
    LandlordProfiles,
    OwnershipRole,
    OwnershipSource,
    ReviewFlagStatus,
    ReviewModeration,
    Reviews,
    ReviewStatus,
    ReviewVerifications,
    ReviewVerificationStatus,
    UserProfiles,
    Users,
)
from reviews_admin.schemas import (
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


def _parse_uuid(raw: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Invalid {label}") from exc


def _body_preview(body: str, length: int = 200) -> str:
    body = body or ""
    return body if len(body) <= length else body[:length] + "…"


# ── Verification queue ──────────────────────────────────────────────────


def list_verification_queue(
    db: Session, status_filter: str | None, limit: int, offset: int
) -> VerificationQueueResponse:
    base = select(ReviewVerifications)
    if status_filter:
        base = base.where(ReviewVerifications.status == ReviewVerificationStatus(status_filter))
    else:
        base = base.where(ReviewVerifications.status == ReviewVerificationStatus.pending)

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(ReviewVerifications.created_at.asc()).limit(limit).offset(offset)).scalars().all()

    if not rows:
        return VerificationQueueResponse(items=[], total=int(total or 0))

    review_ids = [v.review_id for v in rows]
    review_rows = db.execute(select(Reviews).where(Reviews.id.in_(review_ids))).scalars().all()
    review_by_id = {r.id: r for r in review_rows}

    author_ids = {r.author_user_id for r in review_rows}
    name_by_user = dict(
        db.execute(select(UserProfiles.user_id, UserProfiles.name).where(UserProfiles.user_id.in_(author_ids))).all()
    )

    items = []
    for v in rows:
        review = review_by_id.get(v.review_id)
        items.append(
            VerificationQueueItem(
                id=str(v.id),
                review_id=str(v.review_id),
                user_id=str(v.user_id),
                author_display_name=(name_by_user.get(review.author_user_id) if review else None),
                proof_type=v.proof_type.value,
                status=v.status.value,
                storage_key=v.storage_key,
                created_at=v.created_at,
                review_title=review.title if review else None,
                review_body_preview=_body_preview(review.body if review else ""),
                review_overall_rating=review.overall_rating if review else 0,
            )
        )
    return VerificationQueueResponse(items=items, total=int(total or 0))


def decide_verification(
    db: Session,
    admin: Users,
    verification_id: str,
    payload: VerificationDecisionRequest,
) -> VerificationQueueItem:
    vid = _parse_uuid(verification_id, "verification_id")
    v = db.get(ReviewVerifications, vid)
    if v is None:
        raise HTTPException(status_code=404, detail="Verification not found")
    if v.status != ReviewVerificationStatus.pending:
        raise HTTPException(status_code=409, detail="Verification already decided")

    v.status = ReviewVerificationStatus(payload.decision)
    v.reviewed_by = admin.id
    v.reviewed_at = utc_now()
    if payload.decision == "rejected":
        v.rejection_reason = payload.rejection_reason

    # Mirror on the review row so the badge flips in the same transaction.
    if payload.decision == "approved":
        review = db.get(Reviews, v.review_id)
        if review is not None:
            review.verified_tenant = True

    db.commit()
    db.refresh(v)
    return VerificationQueueItem(
        id=str(v.id),
        review_id=str(v.review_id),
        user_id=str(v.user_id),
        author_display_name=None,
        proof_type=v.proof_type.value,
        status=v.status.value,
        storage_key=v.storage_key,
        created_at=v.created_at,
        review_title=None,
        review_body_preview="",
        review_overall_rating=0,
    )


# ── Moderation queue ────────────────────────────────────────────────────


def list_moderation_queue(db: Session, status_filter: str | None, limit: int, offset: int) -> ModerationQueueResponse:
    base = select(ReviewModeration)
    if status_filter:
        base = base.where(ReviewModeration.status == ReviewFlagStatus(status_filter))
    else:
        base = base.where(ReviewModeration.status == ReviewFlagStatus.open)

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(ReviewModeration.created_at.asc()).limit(limit).offset(offset)).scalars().all()

    if not rows:
        return ModerationQueueResponse(items=[], total=int(total or 0))

    review_ids = [f.review_id for f in rows]
    review_by_id = {r.id: r for r in db.execute(select(Reviews).where(Reviews.id.in_(review_ids))).scalars().all()}

    items = [
        ModerationQueueItem(
            id=str(f.id),
            review_id=str(f.review_id),
            flag_type=f.flag_type.value,
            submitted_by_role=f.submitted_by_role.value,
            submitted_by_user_id=(str(f.submitted_by_user_id) if f.submitted_by_user_id else None),
            details=f.details,
            status=f.status.value,
            created_at=f.created_at,
            review_title=(review_by_id.get(f.review_id).title if f.review_id in review_by_id else None),
            review_body_preview=_body_preview(review_by_id[f.review_id].body if f.review_id in review_by_id else ""),
            review_status=(review_by_id[f.review_id].status.value if f.review_id in review_by_id else ""),
        )
        for f in rows
    ]
    return ModerationQueueResponse(items=items, total=int(total or 0))


def decide_moderation(
    db: Session,
    admin: Users,
    flag_id: str,
    payload: ModerationDecisionRequest,
) -> ModerationQueueItem:
    fid = _parse_uuid(flag_id, "flag_id")
    flag = db.get(ReviewModeration, fid)
    if flag is None:
        raise HTTPException(status_code=404, detail="Flag not found")
    if flag.status != ReviewFlagStatus.open:
        raise HTTPException(status_code=409, detail="Flag already resolved")

    flag.status = ReviewFlagStatus(payload.decision)
    flag.resolution_note = payload.resolution_note
    flag.resolved_by = admin.id
    flag.resolved_at = utc_now()

    if payload.decision == "accepted":
        review = db.get(Reviews, flag.review_id)
        if review is not None:
            if payload.review_action == "hide":
                review.status = ReviewStatus.hidden
            elif payload.review_action == "remove":
                review.status = ReviewStatus.removed

    db.commit()
    db.refresh(flag)
    review = db.get(Reviews, flag.review_id)
    return ModerationQueueItem(
        id=str(flag.id),
        review_id=str(flag.review_id),
        flag_type=flag.flag_type.value,
        submitted_by_role=flag.submitted_by_role.value,
        submitted_by_user_id=(str(flag.submitted_by_user_id) if flag.submitted_by_user_id else None),
        details=flag.details,
        status=flag.status.value,
        created_at=flag.created_at,
        review_title=review.title if review else None,
        review_body_preview=_body_preview(review.body if review else ""),
        review_status=review.status.value if review else "",
    )


# ── Ownership correction ────────────────────────────────────────────────


def upsert_ownership_period(db: Session, payload: OwnershipPeriodUpsert) -> BuildingOwnershipPeriods:
    building_id = _parse_uuid(payload.building_id, "building_id")
    entity_id = _parse_uuid(payload.landlord_entity_id, "landlord_entity_id")
    if db.get(Buildings, building_id) is None:
        raise HTTPException(status_code=404, detail="Building not found")
    if db.get(LandlordEntities, entity_id) is None:
        raise HTTPException(status_code=404, detail="Landlord entity not found")

    if payload.id:
        period_id = _parse_uuid(payload.id, "period id")
        period = db.get(BuildingOwnershipPeriods, period_id)
        if period is None:
            raise HTTPException(status_code=404, detail="Ownership period not found")
        period.building_id = building_id
        period.landlord_entity_id = entity_id
        period.role = OwnershipRole(payload.role)
        period.start_date = payload.start_date
        period.end_date = payload.end_date
        period.source = OwnershipSource(payload.source)
        period.acris_document_id = payload.acris_document_id
        period.confidence = payload.confidence
        period.notes = payload.notes
    else:
        period = BuildingOwnershipPeriods(
            building_id=building_id,
            landlord_entity_id=entity_id,
            role=OwnershipRole(payload.role),
            start_date=payload.start_date,
            end_date=payload.end_date,
            source=OwnershipSource(payload.source),
            acris_document_id=payload.acris_document_id,
            confidence=payload.confidence,
            notes=payload.notes,
        )
        db.add(period)

    db.commit()
    db.refresh(period)
    return period


# ── Landlord-entity merge ───────────────────────────────────────────────


def merge_landlord_entities(db: Session, payload: LandlordMergeRequest) -> None:
    src_id = _parse_uuid(payload.source_entity_id, "source_entity_id")
    tgt_id = _parse_uuid(payload.target_entity_id, "target_entity_id")
    if src_id == tgt_id:
        raise HTTPException(status_code=422, detail="Cannot merge an entity into itself")
    src = db.get(LandlordEntities, src_id)
    tgt = db.get(LandlordEntities, tgt_id)
    if src is None or tgt is None:
        raise HTTPException(status_code=404, detail="Entity not found")

    db.execute(
        update(BuildingOwnershipPeriods)
        .where(BuildingOwnershipPeriods.landlord_entity_id == src_id)
        .values(landlord_entity_id=tgt_id)
    )
    db.execute(update(Reviews).where(Reviews.landlord_entity_id == src_id).values(landlord_entity_id=tgt_id))
    db.execute(update(LandlordEntityAliases).where(LandlordEntityAliases.entity_id == src_id).values(entity_id=tgt_id))
    db.execute(update(LandlordEntities).where(LandlordEntities.head_entity_id == src_id).values(head_entity_id=tgt_id))

    # Preserve the source entity's canonical name as an alias on the target.
    already = db.execute(
        select(LandlordEntityAliases).where(
            LandlordEntityAliases.entity_id == tgt_id,
            LandlordEntityAliases.value == src.canonical_name,
        )
    ).scalar_one_or_none()
    if already is None:
        db.add(
            LandlordEntityAliases(
                entity_id=tgt_id,
                alias_type="dba",
                value=src.canonical_name,
                source="admin",
                confidence=Decimal("1.0"),
                verified_by_admin=True,
            )
        )

    db.delete(src)
    db.commit()


# ── Claim approval ──────────────────────────────────────────────────────


def approve_claim(
    db: Session,
    entity_id: str,
    payload: LandlordEntityClaimApproveRequest,
) -> LandlordEntities:
    eid = _parse_uuid(entity_id, "entity_id")
    entity = db.get(LandlordEntities, eid)
    if entity is None:
        raise HTTPException(status_code=404, detail="Entity not found")
    if entity.claimed_profile_id is not None:
        raise HTTPException(status_code=409, detail="Entity already claimed")

    profile_id = _parse_uuid(payload.landlord_profile_id, "landlord_profile_id")
    profile = db.get(LandlordProfiles, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Landlord profile not found")

    entity.claimed_profile_id = profile_id
    db.commit()
    db.refresh(entity)
    return entity


# ── Portfolio-cache refresh ─────────────────────────────────────────────


def refresh_portfolio_cache(db: Session) -> int:
    """Recompute portfolio_size_cached and avg_rating_cached for every entity.

    Called by the nightly scheduler. Idempotent.
    """
    entities = db.execute(select(LandlordEntities)).scalars().all()
    for entity in entities:
        portfolio_size = db.execute(
            select(func.count(func.distinct(BuildingOwnershipPeriods.building_id))).where(
                BuildingOwnershipPeriods.landlord_entity_id == entity.id,
                BuildingOwnershipPeriods.role == OwnershipRole.owner,
            )
        ).scalar_one()
        avg_rating = db.execute(
            select(func.avg(Reviews.overall_rating)).where(
                Reviews.landlord_entity_id == entity.id,
                Reviews.status == ReviewStatus.published,
            )
        ).scalar_one()
        entity.portfolio_size_cached = int(portfolio_size or 0)
        entity.avg_rating_cached = Decimal(avg_rating).quantize(Decimal("0.01")) if avg_rating is not None else None
    db.commit()
    return len(entities)
