from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from db.models import (
    LandlordApplicationDocuments,
    LandlordApplications,
    LandlordApplicationStatus,
    LandlordLeaseOffers,
    LandlordLeaseOfferStatus,
    LandlordLeaseSignatures,
    LandlordLeadStatus,
    LandlordLeads,
    LandlordProfiles,
    LandlordProperties,
    LandlordPropertyMedia,
    LandlordPublishStatus,
    LandlordSignatureStatus,
    LandlordTourBookings,
    LandlordTourBookingStatus,
    LandlordTourSlots,
    LandlordUnits,
    UserRole,
    Users,
)
from landlord.schemas import (
    LandlordApplicationCreate,
    LandlordApplicationDocumentCreate,
    LandlordApplicationPayload,
    LandlordApplicationUpdate,
    LandlordLeadCreate,
    LandlordLeadPayload,
    LandlordLeadUpdate,
    LandlordLeaseOfferCreate,
    LandlordLeaseOfferPayload,
    LandlordLeaseSignatureCreate,
    LandlordLeaseSignaturePayload,
    LandlordMediaCreate,
    LandlordMediaPayload,
    LandlordMediaUpdate,
    LandlordProfilePayload,
    LandlordProfileUpdate,
    LandlordPropertyCreate,
    LandlordPropertyPayload,
    LandlordPropertyUpdate,
    LandlordTourBookingCreate,
    LandlordTourBookingPayload,
    LandlordTourBookingUpdate,
    LandlordTourSlotCreate,
    LandlordTourSlotPayload,
    LandlordTourSlotUpdate,
    LandlordUnitCreate,
    LandlordUnitPayload,
    LandlordUnitUpdate,
)


def _parse_uuid(raw: str, label: str) -> uuid.UUID:
    try:
        return uuid.UUID(raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=f"Invalid {label}") from exc


def _ensure_landlord(db: Session, user: Users) -> LandlordProfiles:
    profile = db.execute(
        select(LandlordProfiles).where(LandlordProfiles.user_id == user.id)
    ).scalar_one_or_none()
    if profile is None:
        profile = LandlordProfiles(user_id=user.id)
        db.add(profile)
    # Only promote renters to landlord; never downgrade admin (or other roles).
    if user.role == UserRole.user:
        user.role = UserRole.landlord
    db.commit()
    db.refresh(profile)
    return profile


def get_landlord_profile(db: Session, user: Users) -> LandlordProfilePayload:
    profile = _ensure_landlord(db, user)
    return LandlordProfilePayload(
        display_name=profile.display_name or "",
        company_name=profile.company_name or "",
        phone_number=profile.phone_number or "",
        verification_status=profile.verification_status.value,
    )


def update_landlord_profile(db: Session, user: Users, payload: LandlordProfileUpdate) -> LandlordProfilePayload:
    profile = _ensure_landlord(db, user)
    if payload.display_name is not None:
        profile.display_name = payload.display_name.strip() or None
    if payload.company_name is not None:
        profile.company_name = payload.company_name.strip() or None
    if payload.phone_number is not None:
        profile.phone_number = payload.phone_number.strip() or None
    db.commit()
    db.refresh(profile)
    return get_landlord_profile(db, user)


def _property_to_payload(row: LandlordProperties) -> LandlordPropertyPayload:
    return LandlordPropertyPayload(
        id=str(row.id),
        title=row.title,
        description=row.description or "",
        street_line1=row.street_line1,
        street_line2=row.street_line2 or "",
        city=row.city,
        state=row.state,
        postal_code=row.postal_code,
        country=row.country,
        amenities=list(row.amenities_json or []),
        publish_status=row.publish_status.value,
        created_at=row.created_at.isoformat(),
        updated_at=row.updated_at.isoformat(),
    )


def list_properties(db: Session, user: Users) -> list[LandlordPropertyPayload]:
    _ensure_landlord(db, user)
    rows = db.execute(
        select(LandlordProperties)
        .where(LandlordProperties.owner_user_id == user.id)
        .order_by(LandlordProperties.updated_at.desc())
    ).scalars().all()
    return [_property_to_payload(row) for row in rows]


def create_property(db: Session, user: Users, payload: LandlordPropertyCreate) -> LandlordPropertyPayload:
    _ensure_landlord(db, user)
    row = LandlordProperties(owner_user_id=user.id, **payload.model_dump(), amenities_json=payload.amenities)
    db.add(row)
    db.commit()
    db.refresh(row)
    return _property_to_payload(row)


def _get_property_for_owner(db: Session, owner_user_id: uuid.UUID, property_id: uuid.UUID) -> LandlordProperties:
    row = db.execute(
        select(LandlordProperties).where(
            LandlordProperties.id == property_id,
            LandlordProperties.owner_user_id == owner_user_id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return row


def get_property(db: Session, user: Users, property_id: str) -> LandlordPropertyPayload:
    row = _get_property_for_owner(db, user.id, _parse_uuid(property_id, "property_id"))
    return _property_to_payload(row)


def update_property(
    db: Session, user: Users, property_id: str, payload: LandlordPropertyUpdate
) -> LandlordPropertyPayload:
    row = _get_property_for_owner(db, user.id, _parse_uuid(property_id, "property_id"))
    updates = payload.model_dump(exclude_unset=True)
    amenities = updates.pop("amenities", None)
    for key, value in updates.items():
        setattr(row, key, value)
    if amenities is not None:
        row.amenities_json = amenities
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return _property_to_payload(row)


def delete_property(db: Session, user: Users, property_id: str) -> None:
    row = _get_property_for_owner(db, user.id, _parse_uuid(property_id, "property_id"))
    db.delete(row)
    db.commit()


def set_property_publish_state(db: Session, user: Users, property_id: str, publish: bool) -> LandlordPropertyPayload:
    row = _get_property_for_owner(db, user.id, _parse_uuid(property_id, "property_id"))
    row.publish_status = LandlordPublishStatus.published if publish else LandlordPublishStatus.draft
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return _property_to_payload(row)


def list_media(db: Session, user: Users, property_id: str) -> list[LandlordMediaPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    rows = db.execute(
        select(LandlordPropertyMedia)
        .where(LandlordPropertyMedia.property_id == pid)
        .order_by(LandlordPropertyMedia.sort_order.asc(), LandlordPropertyMedia.created_at.asc())
    ).scalars().all()
    return [
        LandlordMediaPayload(
            id=str(row.id),
            media_url=row.media_url,
            media_type=row.media_type,
            caption=row.caption or "",
            sort_order=row.sort_order,
        )
        for row in rows
    ]


def create_media(db: Session, user: Users, property_id: str, payload: LandlordMediaCreate) -> list[LandlordMediaPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    db.add(LandlordPropertyMedia(property_id=pid, **payload.model_dump()))
    db.commit()
    return list_media(db, user, property_id)


def update_media(
    db: Session, user: Users, property_id: str, media_id: str, payload: LandlordMediaUpdate
) -> list[LandlordMediaPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    mid = _parse_uuid(media_id, "media_id")
    row = db.execute(
        select(LandlordPropertyMedia).where(
            LandlordPropertyMedia.id == mid, LandlordPropertyMedia.property_id == pid
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Media not found")
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(row, key, value)
    db.commit()
    return list_media(db, user, property_id)


def delete_media(db: Session, user: Users, property_id: str, media_id: str) -> list[LandlordMediaPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    mid = _parse_uuid(media_id, "media_id")
    row = db.execute(
        select(LandlordPropertyMedia).where(
            LandlordPropertyMedia.id == mid, LandlordPropertyMedia.property_id == pid
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Media not found")
    db.delete(row)
    db.commit()
    return list_media(db, user, property_id)


def list_units(db: Session, user: Users, property_id: str) -> list[LandlordUnitPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    rows = db.execute(
        select(LandlordUnits).where(LandlordUnits.property_id == pid).order_by(LandlordUnits.created_at.desc())
    ).scalars().all()
    return [
        LandlordUnitPayload(
            id=str(row.id),
            label=row.label,
            bedrooms=row.bedrooms,
            bathrooms=row.bathrooms,
            square_feet=row.square_feet,
            monthly_rent=row.monthly_rent,
            security_deposit=row.security_deposit,
            lease_term_months=row.lease_term_months,
            available_on=row.available_on,
            is_available=row.is_available,
        )
        for row in rows
    ]


def create_unit(db: Session, user: Users, property_id: str, payload: LandlordUnitCreate) -> list[LandlordUnitPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    db.add(LandlordUnits(property_id=pid, **payload.model_dump()))
    db.commit()
    return list_units(db, user, property_id)


def update_unit(
    db: Session, user: Users, property_id: str, unit_id: str, payload: LandlordUnitUpdate
) -> list[LandlordUnitPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    uid = _parse_uuid(unit_id, "unit_id")
    row = db.execute(
        select(LandlordUnits).where(LandlordUnits.id == uid, LandlordUnits.property_id == pid)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    return list_units(db, user, property_id)


def delete_unit(db: Session, user: Users, property_id: str, unit_id: str) -> list[LandlordUnitPayload]:
    pid = _parse_uuid(property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    uid = _parse_uuid(unit_id, "unit_id")
    row = db.execute(
        select(LandlordUnits).where(LandlordUnits.id == uid, LandlordUnits.property_id == pid)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(row)
    db.commit()
    return list_units(db, user, property_id)


def list_leads(db: Session, user: Users) -> list[LandlordLeadPayload]:
    rows = db.execute(
        select(LandlordLeads)
        .where(LandlordLeads.owner_user_id == user.id)
        .order_by(LandlordLeads.created_at.desc())
    ).scalars().all()
    return [
        LandlordLeadPayload(
            id=str(row.id),
            property_id=str(row.property_id),
            unit_id=str(row.unit_id) if row.unit_id else None,
            name=row.name,
            email=row.email,
            phone=row.phone or "",
            message=row.message or "",
            source=row.source,
            status=row.status.value,
            created_at=row.created_at.isoformat(),
        )
        for row in rows
    ]


def create_lead(db: Session, user: Users, payload: LandlordLeadCreate) -> LandlordLeadPayload:
    pid = _parse_uuid(payload.property_id, "property_id")
    _get_property_for_owner(db, user.id, pid)
    row = LandlordLeads(
        owner_user_id=user.id,
        property_id=pid,
        unit_id=_parse_uuid(payload.unit_id, "unit_id") if payload.unit_id else None,
        name=payload.name,
        email=payload.email,
        phone=payload.phone or None,
        message=payload.message or None,
        source=payload.source,
        status=LandlordLeadStatus.new,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return list_leads(db, user)[0]


def update_lead(db: Session, user: Users, lead_id: str, payload: LandlordLeadUpdate) -> LandlordLeadPayload:
    row = db.execute(
        select(LandlordLeads).where(
            LandlordLeads.id == _parse_uuid(lead_id, "lead_id"),
            LandlordLeads.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Lead not found")
    if payload.status is not None:
        row.status = LandlordLeadStatus(payload.status)
    if payload.message is not None:
        row.message = payload.message or None
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return LandlordLeadPayload(
        id=str(row.id),
        property_id=str(row.property_id),
        unit_id=str(row.unit_id) if row.unit_id else None,
        name=row.name,
        email=row.email,
        phone=row.phone or "",
        message=row.message or "",
        source=row.source,
        status=row.status.value,
        created_at=row.created_at.isoformat(),
    )


def list_tour_slots(db: Session, user: Users) -> list[LandlordTourSlotPayload]:
    rows = db.execute(
        select(LandlordTourSlots)
        .where(LandlordTourSlots.owner_user_id == user.id)
        .order_by(LandlordTourSlots.start_time.asc())
    ).scalars().all()
    return [
        LandlordTourSlotPayload(
            id=str(row.id),
            property_id=str(row.property_id),
            unit_id=str(row.unit_id),
            start_time=row.start_time,
            end_time=row.end_time,
            is_blocked=row.is_blocked,
        )
        for row in rows
    ]


def create_tour_slot(db: Session, user: Users, payload: LandlordTourSlotCreate) -> list[LandlordTourSlotPayload]:
    pid = _parse_uuid(payload.property_id, "property_id")
    uid = _parse_uuid(payload.unit_id, "unit_id")
    _get_property_for_owner(db, user.id, pid)
    db.add(
        LandlordTourSlots(
            owner_user_id=user.id,
            property_id=pid,
            unit_id=uid,
            start_time=payload.start_time,
            end_time=payload.end_time,
            is_blocked=payload.is_blocked,
        )
    )
    db.commit()
    return list_tour_slots(db, user)


def update_tour_slot(
    db: Session, user: Users, slot_id: str, payload: LandlordTourSlotUpdate
) -> list[LandlordTourSlotPayload]:
    row = db.execute(
        select(LandlordTourSlots).where(
            LandlordTourSlots.id == _parse_uuid(slot_id, "slot_id"),
            LandlordTourSlots.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour slot not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(row, key, value)
    db.commit()
    return list_tour_slots(db, user)


def delete_tour_slot(db: Session, user: Users, slot_id: str) -> list[LandlordTourSlotPayload]:
    row = db.execute(
        select(LandlordTourSlots).where(
            LandlordTourSlots.id == _parse_uuid(slot_id, "slot_id"),
            LandlordTourSlots.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour slot not found")
    db.delete(row)
    db.commit()
    return list_tour_slots(db, user)


def list_tour_bookings(db: Session, user: Users) -> list[LandlordTourBookingPayload]:
    rows = db.execute(
        select(LandlordTourBookings)
        .where(LandlordTourBookings.owner_user_id == user.id)
        .order_by(LandlordTourBookings.created_at.desc())
    ).scalars().all()
    return [
        LandlordTourBookingPayload(
            id=str(row.id),
            slot_id=str(row.slot_id),
            lead_id=str(row.lead_id) if row.lead_id else None,
            guest_name=row.guest_name,
            guest_email=row.guest_email,
            status=row.status.value,
            notes=row.notes or "",
            created_at=row.created_at.isoformat(),
        )
        for row in rows
    ]


def create_tour_booking(
    db: Session, user: Users, payload: LandlordTourBookingCreate
) -> LandlordTourBookingPayload:
    slot = db.execute(
        select(LandlordTourSlots).where(
            LandlordTourSlots.id == _parse_uuid(payload.slot_id, "slot_id"),
            LandlordTourSlots.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if slot is None:
        raise HTTPException(status_code=404, detail="Tour slot not found")
    row = LandlordTourBookings(
        owner_user_id=user.id,
        slot_id=slot.id,
        lead_id=_parse_uuid(payload.lead_id, "lead_id") if payload.lead_id else None,
        guest_name=payload.guest_name,
        guest_email=payload.guest_email,
        notes=payload.notes or None,
        status=LandlordTourBookingStatus.requested,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return list_tour_bookings(db, user)[0]


def update_tour_booking(
    db: Session, user: Users, booking_id: str, payload: LandlordTourBookingUpdate
) -> LandlordTourBookingPayload:
    row = db.execute(
        select(LandlordTourBookings).where(
            LandlordTourBookings.id == _parse_uuid(booking_id, "booking_id"),
            LandlordTourBookings.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Tour booking not found")
    if payload.status is not None:
        row.status = LandlordTourBookingStatus(payload.status)
    if payload.notes is not None:
        row.notes = payload.notes or None
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return LandlordTourBookingPayload(
        id=str(row.id),
        slot_id=str(row.slot_id),
        lead_id=str(row.lead_id) if row.lead_id else None,
        guest_name=row.guest_name,
        guest_email=row.guest_email,
        status=row.status.value,
        notes=row.notes or "",
        created_at=row.created_at.isoformat(),
    )


def list_applications(db: Session, user: Users) -> list[LandlordApplicationPayload]:
    rows = db.execute(
        select(LandlordApplications)
        .where(LandlordApplications.owner_user_id == user.id)
        .order_by(LandlordApplications.created_at.desc())
    ).scalars().all()
    return [
        LandlordApplicationPayload(
            id=str(row.id),
            property_id=str(row.property_id),
            unit_id=str(row.unit_id) if row.unit_id else None,
            lead_id=str(row.lead_id) if row.lead_id else None,
            applicant_name=row.applicant_name,
            applicant_email=row.applicant_email,
            annual_income=row.annual_income,
            credit_score=row.credit_score,
            status=row.status.value,
            notes=row.notes or "",
            created_at=row.created_at.isoformat(),
        )
        for row in rows
    ]


def create_application(
    db: Session, user: Users, payload: LandlordApplicationCreate
) -> LandlordApplicationPayload:
    row = LandlordApplications(
        owner_user_id=user.id,
        property_id=_parse_uuid(payload.property_id, "property_id"),
        unit_id=_parse_uuid(payload.unit_id, "unit_id") if payload.unit_id else None,
        lead_id=_parse_uuid(payload.lead_id, "lead_id") if payload.lead_id else None,
        applicant_name=payload.applicant_name,
        applicant_email=payload.applicant_email,
        annual_income=payload.annual_income,
        credit_score=payload.credit_score,
        notes=payload.notes or None,
        status=LandlordApplicationStatus.submitted,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return list_applications(db, user)[0]


def update_application(
    db: Session, user: Users, application_id: str, payload: LandlordApplicationUpdate
) -> LandlordApplicationPayload:
    row = db.execute(
        select(LandlordApplications).where(
            LandlordApplications.id == _parse_uuid(application_id, "application_id"),
            LandlordApplications.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    if payload.status is not None:
        row.status = LandlordApplicationStatus(payload.status)
    if payload.notes is not None:
        row.notes = payload.notes or None
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return LandlordApplicationPayload(
        id=str(row.id),
        property_id=str(row.property_id),
        unit_id=str(row.unit_id) if row.unit_id else None,
        lead_id=str(row.lead_id) if row.lead_id else None,
        applicant_name=row.applicant_name,
        applicant_email=row.applicant_email,
        annual_income=row.annual_income,
        credit_score=row.credit_score,
        status=row.status.value,
        notes=row.notes or "",
        created_at=row.created_at.isoformat(),
    )


def list_application_documents(db: Session, user: Users, application_id: str) -> list:
    app_row = db.execute(
        select(LandlordApplications).where(
            LandlordApplications.id == _parse_uuid(application_id, "application_id"),
            LandlordApplications.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if app_row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    rows = db.execute(
        select(LandlordApplicationDocuments)
        .where(LandlordApplicationDocuments.application_id == app_row.id)
        .order_by(LandlordApplicationDocuments.created_at.desc())
    ).scalars().all()
    return rows


def create_application_document(
    db: Session, user: Users, application_id: str, payload: LandlordApplicationDocumentCreate
) -> list:
    app_row = db.execute(
        select(LandlordApplications).where(
            LandlordApplications.id == _parse_uuid(application_id, "application_id"),
            LandlordApplications.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if app_row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    db.add(LandlordApplicationDocuments(application_id=app_row.id, **payload.model_dump()))
    db.commit()
    return list_application_documents(db, user, application_id)


def list_lease_offers(db: Session, user: Users) -> list[LandlordLeaseOfferPayload]:
    rows = db.execute(
        select(LandlordLeaseOffers)
        .where(LandlordLeaseOffers.owner_user_id == user.id)
        .order_by(LandlordLeaseOffers.created_at.desc())
    ).scalars().all()
    return [
        LandlordLeaseOfferPayload(
            id=str(row.id),
            property_id=str(row.property_id),
            unit_id=str(row.unit_id) if row.unit_id else None,
            application_id=str(row.application_id) if row.application_id else None,
            tenant_name=row.tenant_name,
            tenant_email=row.tenant_email,
            monthly_rent=row.monthly_rent,
            lease_start=row.lease_start,
            lease_end=row.lease_end,
            terms_text=row.terms_text,
            status=row.status.value,
            created_at=row.created_at.isoformat(),
        )
        for row in rows
    ]


def create_lease_offer(db: Session, user: Users, payload: LandlordLeaseOfferCreate) -> LandlordLeaseOfferPayload:
    row = LandlordLeaseOffers(
        owner_user_id=user.id,
        property_id=_parse_uuid(payload.property_id, "property_id"),
        unit_id=_parse_uuid(payload.unit_id, "unit_id") if payload.unit_id else None,
        application_id=_parse_uuid(payload.application_id, "application_id")
        if payload.application_id
        else None,
        tenant_name=payload.tenant_name,
        tenant_email=payload.tenant_email,
        monthly_rent=payload.monthly_rent,
        lease_start=payload.lease_start,
        lease_end=payload.lease_end,
        terms_text=payload.terms_text,
        status=LandlordLeaseOfferStatus.draft,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return list_lease_offers(db, user)[0]


def apply_lease_offer_action(db: Session, user: Users, lease_offer_id: str, action: str) -> LandlordLeaseOfferPayload:
    row = db.execute(
        select(LandlordLeaseOffers).where(
            LandlordLeaseOffers.id == _parse_uuid(lease_offer_id, "lease_offer_id"),
            LandlordLeaseOffers.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Lease offer not found")
    mapping = {
        "send": LandlordLeaseOfferStatus.sent,
        "counter": LandlordLeaseOfferStatus.countered,
        "accept": LandlordLeaseOfferStatus.accepted,
        "decline": LandlordLeaseOfferStatus.declined,
    }
    row.status = mapping[action]
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return LandlordLeaseOfferPayload(
        id=str(row.id),
        property_id=str(row.property_id),
        unit_id=str(row.unit_id) if row.unit_id else None,
        application_id=str(row.application_id) if row.application_id else None,
        tenant_name=row.tenant_name,
        tenant_email=row.tenant_email,
        monthly_rent=row.monthly_rent,
        lease_start=row.lease_start,
        lease_end=row.lease_end,
        terms_text=row.terms_text,
        status=row.status.value,
        created_at=row.created_at.isoformat(),
    )


def list_lease_signatures(db: Session, user: Users, lease_offer_id: str) -> list[LandlordLeaseSignaturePayload]:
    offer = db.execute(
        select(LandlordLeaseOffers).where(
            LandlordLeaseOffers.id == _parse_uuid(lease_offer_id, "lease_offer_id"),
            LandlordLeaseOffers.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if offer is None:
        raise HTTPException(status_code=404, detail="Lease offer not found")
    rows = db.execute(
        select(LandlordLeaseSignatures).where(LandlordLeaseSignatures.lease_offer_id == offer.id)
    ).scalars().all()
    return [
        LandlordLeaseSignaturePayload(
            id=str(row.id),
            lease_offer_id=str(row.lease_offer_id),
            signer_role=row.signer_role,
            signer_name=row.signer_name,
            signer_email=row.signer_email,
            status=row.status.value,
            signed_at=row.signed_at.isoformat() if row.signed_at else None,
        )
        for row in rows
    ]


def create_lease_signature(
    db: Session, user: Users, lease_offer_id: str, payload: LandlordLeaseSignatureCreate
) -> list[LandlordLeaseSignaturePayload]:
    offer = db.execute(
        select(LandlordLeaseOffers).where(
            LandlordLeaseOffers.id == _parse_uuid(lease_offer_id, "lease_offer_id"),
            LandlordLeaseOffers.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if offer is None:
        raise HTTPException(status_code=404, detail="Lease offer not found")
    db.add(
        LandlordLeaseSignatures(
            lease_offer_id=offer.id,
            signer_role=payload.signer_role,
            signer_name=payload.signer_name,
            signer_email=payload.signer_email,
            status=LandlordSignatureStatus.pending,
        )
    )
    db.commit()
    return list_lease_signatures(db, user, lease_offer_id)


def update_lease_signature(
    db: Session, user: Users, signature_id: str, status: str
) -> LandlordLeaseSignaturePayload:
    row = db.execute(
        select(LandlordLeaseSignatures)
        .join(LandlordLeaseOffers, LandlordLeaseOffers.id == LandlordLeaseSignatures.lease_offer_id)
        .where(
            LandlordLeaseSignatures.id == _parse_uuid(signature_id, "signature_id"),
            LandlordLeaseOffers.owner_user_id == user.id,
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Signature not found")
    row.status = LandlordSignatureStatus(status)
    row.signed_at = datetime.now(timezone.utc) if row.status == LandlordSignatureStatus.signed else None
    db.commit()
    db.refresh(row)
    return LandlordLeaseSignaturePayload(
        id=str(row.id),
        lease_offer_id=str(row.lease_offer_id),
        signer_role=row.signer_role,
        signer_name=row.signer_name,
        signer_email=row.signer_email,
        status=row.status.value,
        signed_at=row.signed_at.isoformat() if row.signed_at else None,
    )
