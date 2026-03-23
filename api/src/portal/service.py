from __future__ import annotations

import uuid
from datetime import date, datetime, time, timezone
from decimal import Decimal, InvalidOperation
from typing import Any

from sqlalchemy import asc, delete, select
from sqlalchemy.orm import Session

from db.models import (
    GuarantorRequestHistory,
    GuarantorRequests,
    GuarantorRequestStatus,
    GuarantorVerificationStatus,
    JourneyStage,
    RoommateConnections,
    RoommateConnectionStatus,
    RoommateMessages,
    RoommateProfiles,
    TourNotes,
    TourStatus,
    UserChecklistItems,
    UserGuarantors,
    UserMoveinPlans,
    UserProfiles,
    UserTours,
    UserVendorOrders,
    VendorOrderStatus,
)
from portal.schemas import (
    GuarantorStatePayload,
    MoveInStatePayload,
    ProfileOut,
    ProfilePatch,
    RoommateStatePayload,
    ToursStatePayload,
)


def _parse_uuid(s: str) -> uuid.UUID:
    try:
        return uuid.UUID(str(s))
    except ValueError:
        return uuid.uuid4()


def _parse_date(s: str) -> date | None:
    if not s or not str(s).strip():
        return None
    try:
        return date.fromisoformat(str(s)[:10])
    except ValueError:
        return None


def _parse_time(s: str) -> time | None:
    if not s or not str(s).strip():
        return None
    raw = str(s).strip()
    for fmt in ("%H:%M", "%I:%M %p", "%I:%M%p"):
        try:
            return datetime.strptime(raw, fmt).time()
        except ValueError:
            continue
    return None


def _parse_decimal(s: str) -> Decimal | None:
    if not s or not str(s).strip():
        return None
    try:
        cleaned = str(s).replace("$", "").replace(",", "").strip()
        return Decimal(cleaned)
    except (InvalidOperation, ValueError):
        return None


def _tour_status(s: str) -> TourStatus:
    for e in TourStatus:
        if e.value == s:
            return e
    return TourStatus.saved


def _guarantor_req_status(s: str) -> GuarantorRequestStatus:
    for e in GuarantorRequestStatus:
        if e.value == s:
            return e
    return GuarantorRequestStatus.draft


def _guarantor_ver_status(s: str) -> GuarantorVerificationStatus:
    for e in GuarantorVerificationStatus:
        if e.value == s:
            return e
    return GuarantorVerificationStatus.pending


def _vendor_order_status(s: str) -> VendorOrderStatus:
    for e in VendorOrderStatus:
        if e.value == s:
            return e
    return VendorOrderStatus.researching


def _journey_stage(s: str | None) -> JourneyStage | None:
    if not s:
        return None
    for e in JourneyStage:
        if e.value == s:
            return e
    return None


def _parse_dt(s: str) -> datetime | None:
    if not s or not str(s).strip():
        return None
    try:
        return datetime.fromisoformat(str(s).replace("Z", "+00:00"))
    except ValueError:
        return None


def get_profile(db: Session, user_id: uuid.UUID) -> ProfileOut | None:
    row = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    if not row:
        return None
    override = row.journey_stage_override.value if row.journey_stage_override else None
    return ProfileOut(
        has_current_lease=row.has_current_lease,
        search_trigger=row.search_trigger,
        trigger_reason=row.trigger_reason,
        move_timeline=row.move_timeline,
        current_city=row.current_city,
        work_location=row.work_location,
        preferred_cities=list(row.preferred_cities or []),
        neighbourhood_priorities=list(row.neighbourhood_priorities or []),
        dealbreakers=list(row.dealbreakers or []),
        max_monthly_rent=row.max_monthly_rent,
        credit_score_range=row.credit_score_range,
        living_arrangement=row.living_arrangement,
        roommate_search_enabled=row.roommate_search_enabled,
        bedrooms_needed=row.bedrooms_needed,
        has_pets=row.has_pets,
        pet_details=row.pet_details,
        journey_stage_override=override,
        onboarding_completed=row.onboarding_completed,
        onboarding_step=row.onboarding_step,
        last_updated=row.last_updated,
    )


def patch_profile(db: Session, user_id: uuid.UUID, body: ProfilePatch) -> ProfileOut:
    row = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    if not row:
        row = UserProfiles(user_id=user_id)
        db.add(row)
        db.flush()

    data = body.model_dump(exclude_unset=True)
    if "journey_stage_override" in data:
        row.journey_stage_override = _journey_stage(data.pop("journey_stage_override"))
    for key, val in data.items():
        if hasattr(row, key):
            setattr(row, key, val)
    row.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    out = get_profile(db, user_id)
    assert out
    return out


def get_tours_state(db: Session, user_id: uuid.UUID) -> dict[str, Any]:
    tours = db.execute(select(UserTours).where(UserTours.user_id == user_id)).scalars().all()
    out_tours: list[dict[str, Any]] = []
    for t in tours:
        notes = db.execute(select(TourNotes).where(TourNotes.tour_id == t.id)).scalars().all()
        note = notes[0] if notes else None
        note_payload = None
        if note:
            note_payload = {
                "ratings": note.ratings_json or {},
                "pros": note.pros or "",
                "cons": note.cons or "",
                "general_notes": note.general_notes or "",
                "would_apply": note.would_apply,
                "photo_checklist": list(note.photo_checklist_json or []),
                "updated_at": note.updated_at.isoformat() if note.updated_at else "",
            }
        td = t.tour_date.isoformat() if t.tour_date else ""
        tt = t.tour_time.isoformat(timespec="minutes") if t.tour_time else ""
        out_tours.append(
            {
                "id": str(t.id),
                "property": {
                    "id": t.property_ref_id or "",
                    "name": t.property_name,
                    "address": t.property_address,
                    "rent": t.property_price or "",
                    "beds": t.property_beds or "",
                    "image": t.property_image or "",
                    "tags": list(t.property_tags or []),
                },
                "status": t.status.value,
                "scheduled_date": td,
                "scheduled_time": tt,
                "note": note_payload,
                "created_at": t.created_at.isoformat() if t.created_at else "",
            }
        )
    return {"tours": out_tours}


def replace_tours(db: Session, user_id: uuid.UUID, payload: ToursStatePayload) -> None:
    # Single DELETE lets PostgreSQL CASCADE remove tour_notes in one step. A separate DELETE on
    # tour_notes + DELETE user_tours deadlocks when concurrent PUT /portal/tours requests interleave.
    db.execute(delete(UserTours).where(UserTours.user_id == user_id))
    db.flush()

    for tp in payload.tours:
        tid = _parse_uuid(tp.id)
        p = tp.property
        tour = UserTours(
            id=tid,
            user_id=user_id,
            property_ref_id=p.id or None,
            property_name=p.name,
            property_address=p.address,
            property_image=p.image or None,
            property_price=p.rent or None,
            property_beds=p.beds or None,
            property_tags=list(p.tags or []),
            status=_tour_status(tp.status),
            tour_date=_parse_date(tp.scheduled_date),
            tour_time=_parse_time(tp.scheduled_time),
        )
        if tp.created_at:
            parsed = _parse_dt(tp.created_at)
            if parsed:
                tour.created_at = parsed
        db.add(tour)
        db.flush()
        if tp.note:
            n = tp.note
            db.add(
                TourNotes(
                    tour_id=tid,
                    ratings_json=dict(n.ratings or {}),
                    pros=n.pros or None,
                    cons=n.cons or None,
                    general_notes=n.general_notes or None,
                    would_apply=n.would_apply,
                    photo_checklist_json=list(n.photo_checklist or []),
                )
            )
    db.commit()


def get_guarantor_state(db: Session, user_id: uuid.UUID) -> dict[str, Any]:
    gtor_rows = db.execute(select(UserGuarantors).where(UserGuarantors.user_id == user_id)).scalars().all()
    saved = [
        {
            "id": str(g.id),
            "name": g.name,
            "email": g.email,
            "phone": g.phone,
            "relationship": g.relationship_type,
            "created_at": g.created_at.isoformat() if g.created_at else "",
        }
        for g in gtor_rows
    ]
    req_rows = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.user_id == user_id)
    ).scalars().all()
    requests_out: list[dict[str, Any]] = []
    for r in req_rows:
        hist = db.execute(
            select(GuarantorRequestHistory)
            .where(GuarantorRequestHistory.request_id == r.id)
            .order_by(asc(GuarantorRequestHistory.created_at))
        ).scalars().all()
        requests_out.append(
            {
                "id": str(r.id),
                "guarantor_id": str(r.guarantor_id) if r.guarantor_id else "",
                "guarantor_snapshot": {
                    "name": r.guarantor_snapshot_name,
                    "email": r.guarantor_snapshot_email,
                },
                "lease": {
                    "property_name": r.lease_property_name,
                    "property_address": r.lease_property_address,
                    "monthly_rent": r.lease_monthly_rent,
                    "lease_start": r.lease_start.isoformat() if r.lease_start else "",
                    "lease_term": r.lease_term or "",
                },
                "status": r.status.value,
                "verification_status": r.verification_status.value,
                "created_at": r.created_at.isoformat() if r.created_at else "",
                "sent_at": r.sent_at.isoformat() if r.sent_at else "",
                "viewed_at": r.viewed_at.isoformat() if r.viewed_at else "",
                "signed_at": r.signed_at.isoformat() if r.signed_at else "",
                "expires_at": r.expires_at.isoformat() if r.expires_at else "",
                "status_history": [
                    {
                        "status": h.status.value,
                        "timestamp": h.created_at.isoformat() if h.created_at else "",
                        "note": h.note or "",
                    }
                    for h in hist
                ],
            }
        )
    return {"saved_guarantors": saved, "requests": requests_out}


def replace_guarantors(db: Session, user_id: uuid.UUID, payload: GuarantorStatePayload) -> None:
    req_ids = db.execute(
        select(GuarantorRequests.id).where(GuarantorRequests.user_id == user_id)
    ).scalars().all()
    if req_ids:
        db.execute(delete(GuarantorRequestHistory).where(GuarantorRequestHistory.request_id.in_(req_ids)))
    db.execute(delete(GuarantorRequests).where(GuarantorRequests.user_id == user_id))
    db.execute(delete(UserGuarantors).where(UserGuarantors.user_id == user_id))
    db.flush()

    id_map: dict[str, uuid.UUID] = {}
    for g in payload.saved_guarantors:
        gid = _parse_uuid(g.id)
        id_map[g.id] = gid
        row = UserGuarantors(
            id=gid,
            user_id=user_id,
            name=g.name,
            email=g.email,
            phone=g.phone or "",
            relationship_type=g.relationship,
        )
        if g.created_at:
            parsed = _parse_dt(g.created_at)
            if parsed:
                row.created_at = parsed
        db.add(row)
    db.flush()

    for r in payload.requests:
        gid = id_map.get(r.guarantor_id)
        if not gid:
            for sg in payload.saved_guarantors:
                if sg.id == r.guarantor_id:
                    gid = id_map.get(sg.id)
                    break
        snap = r.guarantor_snapshot or {}
        lease = r.lease
        rid = _parse_uuid(r.id)
        row = GuarantorRequests(
            id=rid,
            user_id=user_id,
            guarantor_id=gid,
            guarantor_snapshot_name=snap.get("name") or "",
            guarantor_snapshot_email=snap.get("email") or "",
            lease_property_name=lease.property_name,
            lease_property_address=lease.property_address,
            lease_monthly_rent=lease.monthly_rent,
            lease_start=_parse_date(lease.lease_start),
            lease_term=lease.lease_term or None,
            status=_guarantor_req_status(r.status),
            verification_status=_guarantor_ver_status(r.verification_status),
            sent_at=_parse_dt(r.sent_at),
            viewed_at=_parse_dt(r.viewed_at),
            signed_at=_parse_dt(r.signed_at),
            expires_at=_parse_dt(r.expires_at),
        )
        if r.created_at:
            parsed = _parse_dt(r.created_at)
            if parsed:
                row.created_at = parsed
        db.add(row)
        db.flush()
        for h in r.status_history:
            db.add(
                GuarantorRequestHistory(
                    request_id=rid,
                    status=_guarantor_req_status(h.status),
                    note=h.note or None,
                    created_at=_parse_dt(h.timestamp) or datetime.now(timezone.utc),
                )
            )
    db.commit()


def get_movein_state(db: Session, user_id: uuid.UUID) -> dict[str, Any]:
    plans = db.execute(
        select(UserMoveinPlans)
        .where(UserMoveinPlans.user_id == user_id)
        .order_by(UserMoveinPlans.updated_at.desc())
    ).scalars().all()
    if not plans:
        return {
            "plan": {"target_address": "", "move_date": "", "move_from_address": ""},
            "orders": [],
            "checklist": [],
        }
    plan = plans[0]
    pid = plan.id
    orders = db.execute(
        select(UserVendorOrders).where(UserVendorOrders.movein_plan_id == pid)
    ).scalars().all()
    checklist = db.execute(
        select(UserChecklistItems).where(UserChecklistItems.movein_plan_id == pid)
    ).scalars().all()
    return {
        "plan": {
            "target_address": plan.target_address,
            "move_date": plan.move_date.isoformat() if plan.move_date else "",
            "move_from_address": plan.move_from_address or "",
        },
        "orders": [
            {
                "id": str(o.id),
                "vendor_id": o.vendor_id or "",
                "vendor_name": o.vendor_name,
                "plan_id": o.plan_id or "",
                "plan_name": o.plan_name or "",
                "category": o.category,
                "status": o.status.value,
                "scheduled_date": o.scheduled_date.isoformat() if o.scheduled_date else "",
                "account_number": o.account_number or "",
                "notes": o.notes or "",
                "monthly_cost": str(o.monthly_cost) if o.monthly_cost is not None else "",
                "created_at": o.created_at.isoformat() if o.created_at else "",
            }
            for o in orders
        ],
        "checklist": [
            {
                "id": str(c.id),
                "category": c.category,
                "label": c.label,
                "completed": c.completed,
            }
            for c in checklist
        ],
    }


def replace_movein(db: Session, user_id: uuid.UUID, payload: MoveInStatePayload) -> None:
    plans = db.execute(select(UserMoveinPlans).where(UserMoveinPlans.user_id == user_id)).scalars().all()
    for p in plans:
        db.execute(delete(UserVendorOrders).where(UserVendorOrders.movein_plan_id == p.id))
        db.execute(delete(UserChecklistItems).where(UserChecklistItems.movein_plan_id == p.id))
    db.execute(delete(UserMoveinPlans).where(UserMoveinPlans.user_id == user_id))
    db.execute(delete(UserChecklistItems).where(UserChecklistItems.user_id == user_id))
    db.flush()

    pl = payload.plan
    plan = UserMoveinPlans(
        user_id=user_id,
        target_address=pl.target_address or "—",
        move_date=_parse_date(pl.move_date),
        move_from_address=pl.move_from_address or None,
    )
    db.add(plan)
    db.flush()
    pid = plan.id

    for o in payload.orders:
        oid = _parse_uuid(o.id)
        db.add(
            UserVendorOrders(
                id=oid,
                movein_plan_id=pid,
                vendor_id=o.vendor_id or None,
                vendor_name=o.vendor_name or "—",
                plan_id=o.plan_id or None,
                plan_name=o.plan_name or None,
                category=o.category,
                status=_vendor_order_status(o.status),
                scheduled_date=_parse_date(o.scheduled_date),
                account_number=o.account_number or None,
                notes=o.notes or None,
                monthly_cost=_parse_decimal(o.monthly_cost),
            )
        )
    for c in payload.checklist:
        cid = _parse_uuid(c.id)
        db.add(
            UserChecklistItems(
                id=cid,
                user_id=user_id,
                movein_plan_id=pid,
                category=c.category,
                label=c.label,
                completed=c.completed,
            )
        )
    db.commit()


def _roommate_snapshot_dict(rp: Any) -> dict[str, Any]:
    return {
        "id": rp.id,
        "name": rp.name,
        "age": rp.age,
        "occupation": rp.occupation,
        "bio": rp.bio,
        "avatar_initials": rp.avatar_initials,
        "sleep_schedule": rp.sleep_schedule,
        "cleanliness_level": rp.cleanliness_level,
        "noise_level": rp.noise_level,
        "guest_policy": rp.guest_policy,
        "smoking": rp.smoking,
        "target_city": rp.target_city,
        "max_budget": rp.max_budget,
        "move_timeline": rp.move_timeline,
        "bedrooms_wanted": rp.bedrooms_wanted,
        "has_pets": rp.has_pets,
        "pet_details": rp.pet_details,
        "interests": list(rp.interests or []),
        "university": rp.university,
        "compatibility_score": rp.compatibility_score,
        "compatibility_reasons": list(rp.compatibility_reasons or []),
    }


def get_roommate_state(db: Session, user_id: uuid.UUID) -> dict[str, Any]:
    prof = db.execute(
        select(RoommateProfiles).where(RoommateProfiles.user_id == user_id)
    ).scalar_one_or_none()
    my_profile = {
        "sleep_schedule": prof.sleep_schedule or "" if prof else "",
        "cleanliness_level": prof.cleanliness_level or "" if prof else "",
        "noise_level": prof.noise_level or "" if prof else "",
        "guest_policy": prof.guest_policy or "" if prof else "",
        "smoking": prof.smoking or "" if prof else "",
        "interests": list(prof.interests or []) if prof else [],
        "bio": prof.bio or "" if prof else "",
        "profile_completed": prof.profile_completed if prof else False,
    }
    conns = db.execute(
        select(RoommateConnections).where(RoommateConnections.user_id == user_id)
    ).scalars().all()
    connections: list[dict[str, Any]] = []
    for c in conns:
        snap = c.roommate_snapshot_json or {}
        msgs = db.execute(
            select(RoommateMessages)
            .where(RoommateMessages.connection_id == c.id)
            .order_by(RoommateMessages.created_at)
        ).scalars().all()
        roommate = {
            "id": snap.get("id") or c.roommate_ref_id,
            "name": snap.get("name") or c.roommate_name or "",
            "age": snap.get("age") or 0,
            "occupation": snap.get("occupation") or "",
            "bio": snap.get("bio") or "",
            "avatar_initials": snap.get("avatar_initials") or "",
            "sleep_schedule": snap.get("sleep_schedule") or "",
            "cleanliness_level": snap.get("cleanliness_level") or "",
            "noise_level": snap.get("noise_level") or "",
            "guest_policy": snap.get("guest_policy") or "",
            "smoking": snap.get("smoking") or "",
            "target_city": snap.get("target_city") or "",
            "max_budget": snap.get("max_budget") or "",
            "move_timeline": snap.get("move_timeline") or "",
            "bedrooms_wanted": snap.get("bedrooms_wanted") or "",
            "has_pets": bool(snap.get("has_pets")),
            "pet_details": snap.get("pet_details") or "",
            "interests": list(snap.get("interests") or []),
            "university": snap.get("university"),
            "compatibility_score": c.compatibility_score,
            "compatibility_reasons": list(c.compatibility_reasons or []),
        }
        connections.append(
            {
                "roommate": roommate,
                "connected_at": c.connected_at.isoformat() if c.connected_at else "",
                "messages": [
                    {
                        "role": m.sender_role,
                        "content": m.content,
                        "time": m.created_at.isoformat() if m.created_at else "",
                    }
                    for m in msgs
                ],
            }
        )
    return {"my_profile": my_profile, "connections": connections}


def replace_roommates(db: Session, user_id: uuid.UUID, payload: RoommateStatePayload) -> None:
    conns = db.execute(
        select(RoommateConnections).where(RoommateConnections.user_id == user_id)
    ).scalars().all()
    for c in conns:
        db.execute(delete(RoommateMessages).where(RoommateMessages.connection_id == c.id))
    db.execute(delete(RoommateConnections).where(RoommateConnections.user_id == user_id))
    db.execute(delete(RoommateProfiles).where(RoommateProfiles.user_id == user_id))
    db.flush()

    mp = payload.my_profile
    db.add(
        RoommateProfiles(
            user_id=user_id,
            sleep_schedule=mp.sleep_schedule or None,
            cleanliness_level=mp.cleanliness_level or None,
            noise_level=mp.noise_level or None,
            guest_policy=mp.guest_policy or None,
            smoking=mp.smoking or None,
            interests=list(mp.interests or []),
            bio=mp.bio or None,
            profile_completed=mp.profile_completed,
        )
    )
    db.flush()

    for conn in payload.connections:
        rp = conn.roommate
        cid = uuid.uuid4()
        reasons = list(rp.compatibility_reasons or [])
        score = rp.compatibility_score
        db.add(
            RoommateConnections(
                id=cid,
                user_id=user_id,
                roommate_ref_id=rp.id,
                roommate_name=rp.name or None,
                roommate_snapshot_json=_roommate_snapshot_dict(rp),
                compatibility_score=score,
                compatibility_reasons=reasons,
                status=RoommateConnectionStatus.connected,
                connected_at=_parse_dt(conn.connected_at) or datetime.now(timezone.utc),
            )
        )
        db.flush()
        for m in conn.messages:
            db.add(
                RoommateMessages(
                    connection_id=cid,
                    sender_role=m.role,
                    sender_ref_id=None,
                    content=m.content,
                    created_at=_parse_dt(m.time) or datetime.now(timezone.utc),
                )
            )
    db.commit()
