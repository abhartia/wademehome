from __future__ import annotations

import uuid
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from buildings.schemas import ReviewSummaryPayload
from buildings.service import _to_building_payload
from db.models import (
    BuildingOwnershipPeriods,
    Buildings,
    LandlordEntities,
    LandlordEntityAliases,
    LandlordProfiles,
    OwnershipRole,
    ReviewResponses,
    Reviews,
    ReviewStatus,
    ReviewSubratings,
    UserProfiles,
    UserRole,
    Users,
)
from landlord_entities.schemas import (
    LandlordClaimRequest,
    LandlordEntityAliasPayload,
    LandlordEntityDetail,
    LandlordEntityReviewsResponse,
    LandlordPortfolioBuilding,
    LandlordPortfolioResponse,
)


def _parse_uuid(raw: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Invalid {label}") from exc


def get_entity_detail(db: Session, entity_id: str) -> LandlordEntityDetail:
    eid = _parse_uuid(entity_id, "entity_id")
    entity = db.get(LandlordEntities, eid)
    if entity is None:
        raise HTTPException(status_code=404, detail="Landlord entity not found")

    aliases = db.execute(select(LandlordEntityAliases).where(LandlordEntityAliases.entity_id == eid)).scalars().all()

    review_count = db.execute(
        select(func.count(Reviews.id)).where(
            Reviews.landlord_entity_id == eid,
            Reviews.status == ReviewStatus.published,
        )
    ).scalar_one()
    verified_count = db.execute(
        select(func.count(Reviews.id)).where(
            Reviews.landlord_entity_id == eid,
            Reviews.status == ReviewStatus.published,
            Reviews.verified_tenant.is_(True),
        )
    ).scalar_one()

    dim_rows = db.execute(
        select(ReviewSubratings.dimension, func.avg(ReviewSubratings.score))
        .join(Reviews, Reviews.id == ReviewSubratings.review_id)
        .where(
            Reviews.landlord_entity_id == eid,
            Reviews.status == ReviewStatus.published,
        )
        .group_by(ReviewSubratings.dimension)
    ).all()
    dimension_averages = {
        dim.value: Decimal(score).quantize(Decimal("0.01")) for dim, score in dim_rows if score is not None
    }

    portfolio_size = db.execute(
        select(func.count(func.distinct(BuildingOwnershipPeriods.building_id))).where(
            BuildingOwnershipPeriods.landlord_entity_id == eid,
            BuildingOwnershipPeriods.role == OwnershipRole.owner,
        )
    ).scalar_one()

    return LandlordEntityDetail(
        id=str(entity.id),
        kind=entity.kind.value,
        canonical_name=entity.canonical_name,
        portfolio_size=int(portfolio_size or 0),
        avg_rating=entity.avg_rating_cached,
        claimed=entity.claimed_profile_id is not None,
        claimed_profile_id=str(entity.claimed_profile_id) if entity.claimed_profile_id else None,
        head_entity_id=str(entity.head_entity_id) if entity.head_entity_id else None,
        aliases=[
            LandlordEntityAliasPayload(
                id=str(a.id),
                alias_type=a.alias_type.value,
                value=a.value,
                source=a.source.value,
                confidence=a.confidence,
                verified_by_admin=a.verified_by_admin,
            )
            for a in aliases
        ],
        review_count=int(review_count or 0),
        verified_tenant_review_count=int(verified_count or 0),
        dimension_averages=dimension_averages,
    )


def list_portfolio(db: Session, entity_id: str) -> LandlordPortfolioResponse:
    eid = _parse_uuid(entity_id, "entity_id")
    if db.get(LandlordEntities, eid) is None:
        raise HTTPException(status_code=404, detail="Landlord entity not found")

    periods = (
        db.execute(
            select(BuildingOwnershipPeriods)
            .where(BuildingOwnershipPeriods.landlord_entity_id == eid)
            .order_by(BuildingOwnershipPeriods.start_date.desc())
        )
        .scalars()
        .all()
    )

    buildings_by_id: dict[uuid.UUID, Buildings] = {}
    for p in periods:
        if p.building_id not in buildings_by_id:
            b = db.get(Buildings, p.building_id)
            if b is not None:
                buildings_by_id[p.building_id] = b

    review_counts = dict(
        db.execute(
            select(Reviews.building_id, func.count(Reviews.id))
            .where(
                Reviews.landlord_entity_id == eid,
                Reviews.status == ReviewStatus.published,
            )
            .group_by(Reviews.building_id)
        ).all()
    )
    avg_ratings = dict(
        db.execute(
            select(Reviews.building_id, func.avg(Reviews.overall_rating))
            .where(
                Reviews.landlord_entity_id == eid,
                Reviews.status == ReviewStatus.published,
            )
            .group_by(Reviews.building_id)
        ).all()
    )

    # Deduplicate to one row per building; prefer the most-recent / currently-
    # active ownership period.
    seen: set[uuid.UUID] = set()
    items: list[LandlordPortfolioBuilding] = []
    for p in periods:
        if p.building_id in seen:
            continue
        seen.add(p.building_id)
        building = buildings_by_id.get(p.building_id)
        if building is None:
            continue
        avg = avg_ratings.get(p.building_id)
        items.append(
            LandlordPortfolioBuilding(
                building=_to_building_payload(building),
                review_count=int(review_counts.get(p.building_id) or 0),
                avg_rating=(Decimal(avg).quantize(Decimal("0.01")) if avg is not None else None),
                role=p.role.value,
                start_date=p.start_date,
                end_date=p.end_date,
            )
        )
    return LandlordPortfolioResponse(buildings=items)


def list_entity_reviews(
    db: Session, entity_id: str, limit: int, offset: int, verified_only: bool
) -> LandlordEntityReviewsResponse:
    eid = _parse_uuid(entity_id, "entity_id")
    if db.get(LandlordEntities, eid) is None:
        raise HTTPException(status_code=404, detail="Landlord entity not found")

    base = select(Reviews).where(
        Reviews.landlord_entity_id == eid,
        Reviews.status == ReviewStatus.published,
    )
    if verified_only:
        base = base.where(Reviews.verified_tenant.is_(True))

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(Reviews.created_at.desc()).limit(limit).offset(offset)).scalars().all()

    if not rows:
        return LandlordEntityReviewsResponse(reviews=[], total=int(total or 0), limit=limit, offset=offset)

    author_ids = {r.author_user_id for r in rows}
    name_by_user = dict(
        db.execute(select(UserProfiles.user_id, UserProfiles.name).where(UserProfiles.user_id.in_(author_ids))).all()
    )

    review_ids = [r.id for r in rows]
    sub_rows = db.execute(
        select(ReviewSubratings.review_id, ReviewSubratings.dimension, ReviewSubratings.score).where(
            ReviewSubratings.review_id.in_(review_ids)
        )
    ).all()
    subs_by_review: dict[uuid.UUID, dict[str, int]] = {}
    for rid, dim, score in sub_rows:
        subs_by_review.setdefault(rid, {})[dim.value] = score

    response_by_review = dict(
        db.execute(
            select(ReviewResponses.review_id, ReviewResponses.body).where(ReviewResponses.review_id.in_(review_ids))
        ).all()
    )

    entity = db.get(LandlordEntities, eid)
    entity_name = entity.canonical_name if entity else ""

    payloads = [
        ReviewSummaryPayload(
            id=str(r.id),
            author_display_name=name_by_user.get(r.author_user_id) or "Anonymous tenant",
            overall_rating=r.overall_rating,
            title=r.title,
            body=r.body,
            tenancy_start=r.tenancy_start,
            tenancy_end=r.tenancy_end,
            verified_tenant=r.verified_tenant,
            landlord_relation=r.landlord_relation.value,
            landlord_entity_id=str(r.landlord_entity_id),
            landlord_entity_name=entity_name,
            subratings=subs_by_review.get(r.id, {}),
            response_body=response_by_review.get(r.id),
            created_at=r.created_at,
        )
        for r in rows
    ]
    return LandlordEntityReviewsResponse(reviews=payloads, total=int(total or 0), limit=limit, offset=offset)


def request_claim(db: Session, user: Users, entity_id: str, payload: LandlordClaimRequest) -> LandlordEntityDetail:
    """User asserts they represent this entity. Admin must approve.

    We pre-create / update the landlord_profiles row on the user but we do NOT
    set `claimed_profile_id` on the entity until an admin approves via
    /admin/landlord-entities/{id}/claim/approve.
    """
    eid = _parse_uuid(entity_id, "entity_id")
    entity = db.get(LandlordEntities, eid)
    if entity is None:
        raise HTTPException(status_code=404, detail="Landlord entity not found")
    if entity.claimed_profile_id is not None:
        raise HTTPException(status_code=409, detail="Entity already claimed")

    profile = db.execute(select(LandlordProfiles).where(LandlordProfiles.user_id == user.id)).scalar_one_or_none()
    if profile is None:
        profile = LandlordProfiles(
            user_id=user.id,
            display_name=payload.display_name,
            company_name=payload.company_name,
            phone_number=payload.phone_number,
        )
        db.add(profile)
    else:
        if payload.display_name is not None:
            profile.display_name = payload.display_name
        if payload.company_name is not None:
            profile.company_name = payload.company_name
        if payload.phone_number is not None:
            profile.phone_number = payload.phone_number

    if user.role == UserRole.user:
        user.role = UserRole.landlord

    # The actual binding entity.claimed_profile_id = profile.id happens on
    # admin approval. We store intent here as a crowdsourced alias so admin
    # has a paper trail.
    alias_exists = db.execute(
        select(LandlordEntityAliases).where(
            LandlordEntityAliases.entity_id == eid,
            LandlordEntityAliases.alias_type == "dba",
            LandlordEntityAliases.value == f"claim-request:{user.id}",
        )
    ).scalar_one_or_none()
    if alias_exists is None:
        db.add(
            LandlordEntityAliases(
                entity_id=eid,
                alias_type="dba",
                value=f"claim-request:{user.id}",
                source="claimed",
                confidence=Decimal("0.5"),
                verified_by_admin=False,
            )
        )
    db.commit()
    return get_entity_detail(db, entity_id)
