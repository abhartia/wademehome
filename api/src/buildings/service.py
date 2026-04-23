from __future__ import annotations

import uuid
from datetime import date
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from buildings.schemas import (
    BuildingAggregates,
    BuildingDetailResponse,
    BuildingPayload,
    BuildingResolveRequest,
    DobComplaintPayload,
    HpdViolationPayload,
    LandlordEntitySummary,
    OwnershipPeriodPayload,
    ReviewSummaryPayload,
)
from db.models import (
    BuildingOwnershipPeriods,
    Buildings,
    DobComplaints,
    HpdViolations,
    LandlordEntities,
    OwnershipRole,
    ReviewResponses,
    Reviews,
    ReviewStatus,
    ReviewSubratings,
    UserProfiles,
)


def _parse_uuid(raw: str, label: str = "id") -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Invalid {label}") from exc


def _normalize_addr(street: str, postal: str | None) -> str:
    base = " ".join(street.lower().strip().split())
    return f"{base} {(postal or '').strip()}".strip()


def _to_building_payload(building: Buildings) -> BuildingPayload:
    return BuildingPayload(
        id=str(building.id),
        bbl=building.bbl,
        bin=building.bin,
        borough=building.borough,
        street_line1=building.street_line1,
        city=building.city,
        state=building.state,
        postal_code=building.postal_code,
        latitude=building.latitude,
        longitude=building.longitude,
        normalized_addr=building.normalized_addr,
        unit_count=building.unit_count,
    )


def _to_entity_summary(entity: LandlordEntities) -> LandlordEntitySummary:
    return LandlordEntitySummary(
        id=str(entity.id),
        kind=entity.kind.value,
        canonical_name=entity.canonical_name,
        portfolio_size_cached=entity.portfolio_size_cached,
        avg_rating_cached=entity.avg_rating_cached,
        claimed=entity.claimed_profile_id is not None,
    )


def resolve_or_create_building(db: Session, payload: BuildingResolveRequest) -> tuple[Buildings, bool]:
    """Dedupe by (bbl, bin) when both present, else by normalized address."""
    normalized = _normalize_addr(payload.street_line1, payload.postal_code)

    existing: Buildings | None = None
    if payload.bbl:
        existing = db.execute(
            select(Buildings).where(
                Buildings.bbl == payload.bbl,
                (Buildings.bin == payload.bin) if payload.bin else (Buildings.bin.is_(None)),
            )
        ).scalar_one_or_none()

    if existing is None:
        existing = db.execute(select(Buildings).where(Buildings.normalized_addr == normalized)).scalar_one_or_none()

    if existing is not None:
        return existing, False

    building = Buildings(
        bbl=payload.bbl,
        bin=payload.bin,
        street_line1=payload.street_line1,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        latitude=payload.latitude,
        longitude=payload.longitude,
        normalized_addr=normalized,
    )
    db.add(building)
    db.commit()
    db.refresh(building)
    return building, True


def _current_owner_period(db: Session, building_id: uuid.UUID, role: OwnershipRole) -> BuildingOwnershipPeriods | None:
    return db.execute(
        select(BuildingOwnershipPeriods)
        .where(
            BuildingOwnershipPeriods.building_id == building_id,
            BuildingOwnershipPeriods.role == role,
            BuildingOwnershipPeriods.end_date.is_(None),
        )
        .order_by(BuildingOwnershipPeriods.start_date.desc())
        .limit(1)
    ).scalar_one_or_none()


def find_owner_at_date(db: Session, building_id: uuid.UUID, on_date: date) -> BuildingOwnershipPeriods | None:
    return db.execute(
        select(BuildingOwnershipPeriods)
        .where(
            BuildingOwnershipPeriods.building_id == building_id,
            BuildingOwnershipPeriods.role == OwnershipRole.owner,
            BuildingOwnershipPeriods.start_date <= on_date,
            or_(
                BuildingOwnershipPeriods.end_date.is_(None),
                BuildingOwnershipPeriods.end_date >= on_date,
            ),
        )
        .limit(1)
    ).scalar_one_or_none()


def _building_aggregates(db: Session, building_id: uuid.UUID) -> BuildingAggregates:
    review_ids_subq = (
        select(Reviews.id)
        .where(
            Reviews.building_id == building_id,
            Reviews.status == ReviewStatus.published,
        )
        .subquery()
    )
    totals = db.execute(
        select(
            func.count(Reviews.id),
            func.avg(Reviews.overall_rating),
        ).where(
            Reviews.building_id == building_id,
            Reviews.status == ReviewStatus.published,
        )
    ).one()
    verified_count = db.execute(
        select(func.count(Reviews.id)).where(
            Reviews.building_id == building_id,
            Reviews.status == ReviewStatus.published,
            Reviews.verified_tenant.is_(True),
        )
    ).scalar_one()

    review_count = int(totals[0] or 0)
    avg_overall = totals[1]
    if avg_overall is not None:
        avg_overall = Decimal(avg_overall).quantize(Decimal("0.01"))

    dim_rows = db.execute(
        select(ReviewSubratings.dimension, func.avg(ReviewSubratings.score))
        .where(ReviewSubratings.review_id.in_(select(review_ids_subq.c.id)))
        .group_by(ReviewSubratings.dimension)
    ).all()
    dimension_averages: dict[str, Decimal] = {
        dim.value: Decimal(score).quantize(Decimal("0.01")) for dim, score in dim_rows if score is not None
    }

    return BuildingAggregates(
        review_count=review_count,
        avg_overall_rating=avg_overall,
        verified_tenant_review_count=int(verified_count or 0),
        dimension_averages=dimension_averages,
    )


def get_building_detail(db: Session, building_id: str) -> BuildingDetailResponse:
    bid = _parse_uuid(building_id, "building id")
    building = db.get(Buildings, bid)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    owner_period = _current_owner_period(db, bid, OwnershipRole.owner)
    manager_period = _current_owner_period(db, bid, OwnershipRole.manager)

    return BuildingDetailResponse(
        building=_to_building_payload(building),
        current_owner=(_to_entity_summary(owner_period.landlord_entity) if owner_period else None),
        current_manager=(_to_entity_summary(manager_period.landlord_entity) if manager_period else None),
        aggregates=_building_aggregates(db, bid),
    )


def list_ownership_history(db: Session, building_id: str) -> list[OwnershipPeriodPayload]:
    bid = _parse_uuid(building_id, "building id")
    periods = (
        db.execute(
            select(BuildingOwnershipPeriods)
            .where(BuildingOwnershipPeriods.building_id == bid)
            .order_by(BuildingOwnershipPeriods.start_date.desc())
        )
        .scalars()
        .all()
    )
    return [
        OwnershipPeriodPayload(
            id=str(p.id),
            landlord_entity=_to_entity_summary(p.landlord_entity),
            role=p.role.value,
            start_date=p.start_date,
            end_date=p.end_date,
            source=p.source.value,
            confidence=p.confidence,
        )
        for p in periods
    ]


def list_building_reviews(
    db: Session, building_id: str, limit: int, offset: int, verified_only: bool
) -> tuple[list[ReviewSummaryPayload], int]:
    bid = _parse_uuid(building_id, "building id")

    base = select(Reviews).where(
        Reviews.building_id == bid,
        Reviews.status == ReviewStatus.published,
    )
    if verified_only:
        base = base.where(Reviews.verified_tenant.is_(True))

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()

    rows = db.execute(base.order_by(Reviews.created_at.desc()).limit(limit).offset(offset)).scalars().all()

    if not rows:
        return [], int(total or 0)

    author_ids = {r.author_user_id for r in rows}
    profile_rows = db.execute(
        select(UserProfiles.user_id, UserProfiles.name).where(UserProfiles.user_id.in_(author_ids))
    ).all()
    name_by_user: dict[uuid.UUID, str | None] = dict(profile_rows)

    entity_ids = {r.landlord_entity_id for r in rows}
    entity_rows = db.execute(
        select(LandlordEntities.id, LandlordEntities.canonical_name).where(LandlordEntities.id.in_(entity_ids))
    ).all()
    entity_name_by_id = dict(entity_rows)

    review_ids = [r.id for r in rows]
    sub_rows = db.execute(
        select(
            ReviewSubratings.review_id,
            ReviewSubratings.dimension,
            ReviewSubratings.score,
        ).where(ReviewSubratings.review_id.in_(review_ids))
    ).all()
    subs_by_review: dict[uuid.UUID, dict[str, int]] = {}
    for rid, dim, score in sub_rows:
        subs_by_review.setdefault(rid, {})[dim.value] = score

    response_rows = db.execute(
        select(ReviewResponses.review_id, ReviewResponses.body).where(ReviewResponses.review_id.in_(review_ids))
    ).all()
    response_by_review = dict(response_rows)

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
            landlord_entity_name=entity_name_by_id.get(r.landlord_entity_id, ""),
            subratings=subs_by_review.get(r.id, {}),
            response_body=response_by_review.get(r.id),
            created_at=r.created_at,
        )
        for r in rows
    ]
    return payloads, int(total or 0)


def list_hpd_violations(
    db: Session, building_id: str, limit: int, open_only: bool
) -> tuple[list[HpdViolationPayload], int]:
    bid = _parse_uuid(building_id, "building id")
    building = db.get(Buildings, bid)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    if not building.bbl and not building.bin:
        return [], 0

    filters = []
    if building.bbl:
        filters.append(HpdViolations.bbl == building.bbl)
    if building.bin:
        filters.append(HpdViolations.bin == building.bin)
    pred = and_(*filters) if len(filters) == 1 else or_(*filters)

    base = select(HpdViolations).where(pred)
    if open_only:
        base = base.where(HpdViolations.status.ilike("%open%"))

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(HpdViolations.novissued_date.desc().nullslast()).limit(limit)).scalars().all()

    return (
        [
            HpdViolationPayload(
                violation_id=v.violation_id,
                violation_class=v.violation_class,
                status=v.status,
                novissued_date=v.novissued_date,
                certified_date=v.certified_date,
                apartment=v.apartment,
                description=v.description,
            )
            for v in rows
        ],
        int(total or 0),
    )


def list_dob_complaints(
    db: Session, building_id: str, limit: int, open_only: bool
) -> tuple[list[DobComplaintPayload], int]:
    bid = _parse_uuid(building_id, "building id")
    building = db.get(Buildings, bid)
    if building is None:
        raise HTTPException(status_code=404, detail="Building not found")

    if not building.bbl and not building.bin:
        return [], 0

    filters = []
    if building.bbl:
        filters.append(DobComplaints.bbl == building.bbl)
    if building.bin:
        filters.append(DobComplaints.bin == building.bin)
    pred = and_(*filters) if len(filters) == 1 else or_(*filters)

    base = select(DobComplaints).where(pred)
    if open_only:
        base = base.where(DobComplaints.status.ilike("%active%"))

    total = db.execute(select(func.count()).select_from(base.subquery())).scalar_one()
    rows = db.execute(base.order_by(DobComplaints.date_entered.desc().nullslast()).limit(limit)).scalars().all()

    return (
        [
            DobComplaintPayload(
                complaint_number=c.complaint_number,
                category=c.category,
                status=c.status,
                date_entered=c.date_entered,
                resolution=c.resolution,
            )
            for c in rows
        ],
        int(total or 0),
    )
