from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import asc, select
from sqlalchemy.orm import Session

from db.models import (
    GuarantorRequestHistory,
    GuarantorRequestStatus,
    GuarantorRequests,
    GuarantorVerificationStatus,
    UserGuarantors,
)
from guarantors.schemas import (
    GuarantorRequestCreate,
    GuarantorRequestOut,
    GuarantorRequestPatch,
    LeasePayload,
    SavedGuarantorCreate,
    SavedGuarantorOut,
    SavedGuarantorPatch,
    StatusHistoryOut,
)


def _parse_date(raw: str) -> datetime | None:
    if not raw.strip():
        return None
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None


def _to_req_status(raw: str) -> GuarantorRequestStatus:
    for status in GuarantorRequestStatus:
        if status.value == raw:
            return status
    raise HTTPException(status_code=422, detail="Invalid guarantor request status")


def _to_ver_status(raw: str) -> GuarantorVerificationStatus:
    for status in GuarantorVerificationStatus:
        if status.value == raw:
            return status
    raise HTTPException(status_code=422, detail="Invalid guarantor verification status")


def _saved_out(row: UserGuarantors) -> SavedGuarantorOut:
    return SavedGuarantorOut(
        id=str(row.id),
        name=row.name,
        email=row.email,
        phone=row.phone,
        relationship=row.relationship_type,
        created_at=row.created_at.isoformat() if row.created_at else "",
    )


def list_saved_guarantors(db: Session, user_id: uuid.UUID) -> list[SavedGuarantorOut]:
    rows = db.execute(
        select(UserGuarantors)
        .where(UserGuarantors.user_id == user_id)
        .order_by(UserGuarantors.created_at.desc())
    ).scalars().all()
    return [_saved_out(row) for row in rows]


def create_saved_guarantor(db: Session, user_id: uuid.UUID, body: SavedGuarantorCreate) -> SavedGuarantorOut:
    row = UserGuarantors(
        user_id=user_id,
        name=body.name,
        email=body.email,
        phone=body.phone,
        relationship_type=body.relationship,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _saved_out(row)


def patch_saved_guarantor(
    db: Session, user_id: uuid.UUID, guarantor_id: uuid.UUID, body: SavedGuarantorPatch
) -> SavedGuarantorOut:
    row = db.execute(
        select(UserGuarantors).where(UserGuarantors.user_id == user_id, UserGuarantors.id == guarantor_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor not found")
    data = body.model_dump(exclude_unset=True)
    if "relationship" in data:
        row.relationship_type = data.pop("relationship")
    for key, val in data.items():
        if hasattr(row, key):
            setattr(row, key, val)
    db.commit()
    db.refresh(row)
    return _saved_out(row)


def delete_saved_guarantor(db: Session, user_id: uuid.UUID, guarantor_id: uuid.UUID) -> None:
    row = db.execute(
        select(UserGuarantors).where(UserGuarantors.user_id == user_id, UserGuarantors.id == guarantor_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor not found")
    db.delete(row)
    db.commit()


def _request_out(db: Session, row: GuarantorRequests) -> GuarantorRequestOut:
    history = db.execute(
        select(GuarantorRequestHistory)
        .where(GuarantorRequestHistory.request_id == row.id)
        .order_by(asc(GuarantorRequestHistory.created_at))
    ).scalars().all()
    return GuarantorRequestOut(
        id=str(row.id),
        guarantor_id=str(row.guarantor_id) if row.guarantor_id else "",
        guarantor_snapshot={
            "name": row.guarantor_snapshot_name,
            "email": row.guarantor_snapshot_email,
        },
        lease=LeasePayload(
            property_name=row.lease_property_name,
            property_address=row.lease_property_address,
            monthly_rent=row.lease_monthly_rent,
            lease_start=row.lease_start.isoformat() if row.lease_start else "",
            lease_term=row.lease_term or "",
        ),
        status=row.status.value,
        verification_status=row.verification_status.value,
        created_at=row.created_at.isoformat() if row.created_at else "",
        sent_at=row.sent_at.isoformat() if row.sent_at else "",
        viewed_at=row.viewed_at.isoformat() if row.viewed_at else "",
        signed_at=row.signed_at.isoformat() if row.signed_at else "",
        expires_at=row.expires_at.isoformat() if row.expires_at else "",
        status_history=[
            StatusHistoryOut(
                status=item.status.value,
                timestamp=item.created_at.isoformat() if item.created_at else "",
                note=item.note or "",
            )
            for item in history
        ],
    )


def list_requests(db: Session, user_id: uuid.UUID) -> list[GuarantorRequestOut]:
    rows = db.execute(
        select(GuarantorRequests)
        .where(GuarantorRequests.user_id == user_id)
        .order_by(GuarantorRequests.created_at.desc())
    ).scalars().all()
    return [_request_out(db, row) for row in rows]


def create_request(db: Session, user_id: uuid.UUID, body: GuarantorRequestCreate) -> GuarantorRequestOut:
    guarantor_id = uuid.UUID(body.guarantor_id)
    guarantor = db.execute(
        select(UserGuarantors).where(UserGuarantors.user_id == user_id, UserGuarantors.id == guarantor_id)
    ).scalar_one_or_none()
    if guarantor is None:
        raise HTTPException(status_code=404, detail="Guarantor not found")
    row = GuarantorRequests(
        user_id=user_id,
        guarantor_id=guarantor.id,
        guarantor_snapshot_name=guarantor.name,
        guarantor_snapshot_email=guarantor.email,
        lease_property_name=body.lease.property_name,
        lease_property_address=body.lease.property_address,
        lease_monthly_rent=body.lease.monthly_rent,
        lease_start=_parse_date(body.lease.lease_start),
        lease_term=body.lease.lease_term or None,
        status=GuarantorRequestStatus.draft,
        verification_status=GuarantorVerificationStatus.pending,
    )
    db.add(row)
    db.flush()
    db.add(
        GuarantorRequestHistory(
            request_id=row.id,
            status=GuarantorRequestStatus.draft,
            note="Request created",
            created_at=datetime.now(timezone.utc),
        )
    )
    db.commit()
    db.refresh(row)
    return _request_out(db, row)


def patch_request(
    db: Session, user_id: uuid.UUID, request_id: uuid.UUID, body: GuarantorRequestPatch
) -> GuarantorRequestOut:
    row = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.user_id == user_id, GuarantorRequests.id == request_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor request not found")
    data = body.model_dump(exclude_unset=True)
    lease = data.pop("lease", None)
    if lease:
        row.lease_property_name = lease["property_name"]
        row.lease_property_address = lease["property_address"]
        row.lease_monthly_rent = lease["monthly_rent"]
        row.lease_start = _parse_date(lease["lease_start"])
        row.lease_term = lease["lease_term"] or None
    status_note = data.pop("status_note", None)
    if "status" in data:
        row.status = _to_req_status(data["status"])
        db.add(
            GuarantorRequestHistory(
                request_id=row.id,
                status=row.status,
                note=status_note or "",
                created_at=datetime.now(timezone.utc),
            )
        )
        data.pop("status")
    if "verification_status" in data:
        row.verification_status = _to_ver_status(data.pop("verification_status"))
    for key, val in data.items():
        if hasattr(row, key):
            setattr(row, key, val)
    db.commit()
    db.refresh(row)
    return _request_out(db, row)


def delete_request(db: Session, user_id: uuid.UUID, request_id: uuid.UUID) -> None:
    row = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.user_id == user_id, GuarantorRequests.id == request_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor request not found")
    db.delete(row)
    db.commit()

