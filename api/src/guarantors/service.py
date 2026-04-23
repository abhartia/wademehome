from __future__ import annotations

import hashlib
import secrets
import uuid
from datetime import UTC, date, datetime, timedelta

from fastapi import HTTPException, UploadFile
from sqlalchemy import asc, select
from sqlalchemy.orm import Session

from auth.emailer import send_guarantor_request_email
from core.config import Config
from db.models import (
    GuarantorDocuments,
    GuarantorInviteTokens,
    GuarantorRequests,
    GuarantorRequestStatus,
    GuarantorSignatures,
    GuarantorSigningEvents,
    GuarantorVerificationStatus,
    JourneyStage,
    UserGuarantors,
    UserProfiles,
    Users,
)
from guarantors.schemas import (
    GuarantorDecisionPatch,
    GuarantorInviteConsentIn,
    GuarantorInviteContextOut,
    GuarantorInviteDeclineIn,
    GuarantorInviteOut,
    GuarantorInviteSignIn,
    GuarantorRequestCreate,
    GuarantorRequestOut,
    GuarantorRequestPatch,
    LeasePayload,
    SavedGuarantorCreate,
    SavedGuarantorOut,
    SavedGuarantorPatch,
    SigningEventOut,
)
from guarantors.storage import upload_guarantor_document_to_blob


def _parse_date(raw: str) -> date | None:
    if not raw.strip():
        return None
    try:
        return date.fromisoformat(raw[:10])
    except ValueError:
        return None


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
    rows = (
        db.execute(
            select(UserGuarantors).where(UserGuarantors.user_id == user_id).order_by(UserGuarantors.created_at.desc())
        )
        .scalars()
        .all()
    )
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


def _now() -> datetime:
    return datetime.now(UTC)


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _request_out(db: Session, row: GuarantorRequests) -> GuarantorRequestOut:
    events = (
        db.execute(
            select(GuarantorSigningEvents)
            .where(GuarantorSigningEvents.request_id == row.id)
            .order_by(asc(GuarantorSigningEvents.created_at))
        )
        .scalars()
        .all()
    )
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
        signing_events=[
            SigningEventOut(
                event_type=item.event_type,
                actor=item.actor,
                timestamp=item.created_at.isoformat() if item.created_at else "",
                note=item.note or "",
            )
            for item in events
        ],
    )


def list_requests(db: Session, user_id: uuid.UUID) -> list[GuarantorRequestOut]:
    rows = (
        db.execute(
            select(GuarantorRequests)
            .where(GuarantorRequests.user_id == user_id)
            .order_by(GuarantorRequests.created_at.desc())
        )
        .scalars()
        .all()
    )
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
        GuarantorSigningEvents(
            request_id=row.id,
            event_type="request_created",
            actor="renter",
            actor_ref_id=str(user_id),
            note="Request created",
            created_at=_now(),
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
    if body.lease:
        lease = body.lease.model_dump()
        row.lease_property_name = lease["property_name"]
        row.lease_property_address = lease["property_address"]
        row.lease_monthly_rent = lease["monthly_rent"]
        row.lease_start = _parse_date(lease["lease_start"])
        row.lease_term = lease["lease_term"] or None
        db.add(
            GuarantorSigningEvents(
                request_id=row.id,
                event_type="request_updated",
                actor="renter",
                actor_ref_id=str(user_id),
                note="Lease details updated",
                created_at=_now(),
            )
        )
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


def create_invite(db: Session, user_id: uuid.UUID, request_id: uuid.UUID) -> GuarantorInviteOut:
    row = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.user_id == user_id, GuarantorRequests.id == request_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor request not found")
    if row.status in {
        GuarantorRequestStatus.verified,
        GuarantorRequestStatus.revoked,
        GuarantorRequestStatus.declined,
    }:
        raise HTTPException(status_code=409, detail="Request cannot be invited from current status")

    raw_token = secrets.token_urlsafe(32)
    expires_at = _now().replace(microsecond=0) + timedelta(days=7)

    invite = GuarantorInviteTokens(
        request_id=row.id,
        token_hash=_token_hash(raw_token),
        expires_at=expires_at,
    )
    db.add(invite)

    ui_base = Config.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
    invite_url = f"{ui_base.rstrip('/')}/guarantor-invite/{raw_token}"
    renter = db.execute(select(Users).where(Users.id == user_id)).scalar_one_or_none()
    if renter is None:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        send_guarantor_request_email(
            guarantor_email=row.guarantor_snapshot_email,
            guarantor_name=row.guarantor_snapshot_name,
            renter_email=renter.email,
            property_name=row.lease_property_name,
            property_address=row.lease_property_address,
            monthly_rent=row.lease_monthly_rent,
            lease_start=row.lease_start.isoformat() if row.lease_start else "",
            lease_term=row.lease_term or "",
            invite_url=invite_url,
        )
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    row.status = GuarantorRequestStatus.invited
    row.sent_at = _now()
    row.expires_at = expires_at
    db.add(
        GuarantorSigningEvents(
            request_id=row.id,
            event_type="invite_sent",
            actor="renter",
            actor_ref_id=str(user_id),
            note="Invite sent to guarantor",
            created_at=_now(),
        )
    )
    db.commit()
    return GuarantorInviteOut(
        request_id=str(row.id),
        status=row.status.value,
        invite_expires_at=expires_at.isoformat(),
        invite_url=invite_url,
    )


def _resolve_invite(db: Session, token: str) -> tuple[GuarantorInviteTokens, GuarantorRequests]:
    token_hash = _token_hash(token)
    invite = db.execute(
        select(GuarantorInviteTokens).where(GuarantorInviteTokens.token_hash == token_hash)
    ).scalar_one_or_none()
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    if invite.revoked_at:
        raise HTTPException(status_code=410, detail="Invite revoked")
    if invite.expires_at <= _now():
        raise HTTPException(status_code=410, detail="Invite expired")
    request = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.id == invite.request_id)
    ).scalar_one_or_none()
    if request is None:
        raise HTTPException(status_code=404, detail="Guarantor request not found")
    return invite, request


def get_invite_context(db: Session, token: str) -> GuarantorInviteContextOut:
    _, request = _resolve_invite(db, token)
    return GuarantorInviteContextOut(
        request_id=str(request.id),
        guarantor_name=request.guarantor_snapshot_name,
        guarantor_email=request.guarantor_snapshot_email,
        lease=LeasePayload(
            property_name=request.lease_property_name,
            property_address=request.lease_property_address,
            monthly_rent=request.lease_monthly_rent,
            lease_start=request.lease_start.isoformat() if request.lease_start else "",
            lease_term=request.lease_term or "",
        ),
        status=request.status.value,
        invite_expires_at=request.expires_at.isoformat() if request.expires_at else "",
    )


def mark_invite_opened(db: Session, token: str, *, ip_address: str | None, user_agent: str | None) -> None:
    invite, request = _resolve_invite(db, token)
    if request.status == GuarantorRequestStatus.invited:
        request.status = GuarantorRequestStatus.opened
        request.viewed_at = _now()
    if invite.used_at is None:
        invite.used_at = _now()
    db.add(
        GuarantorSigningEvents(
            request_id=request.id,
            event_type="invite_opened",
            actor="guarantor",
            ip_address=ip_address,
            user_agent=user_agent,
            note="Guarantor opened invite",
            created_at=_now(),
        )
    )
    db.commit()


def submit_consent(
    db: Session,
    token: str,
    body: GuarantorInviteConsentIn,
    *,
    ip_address: str | None,
    user_agent: str | None,
) -> None:
    _, request = _resolve_invite(db, token)
    if request.status not in {GuarantorRequestStatus.opened, GuarantorRequestStatus.invited}:
        raise HTTPException(status_code=409, detail="Consent not allowed in current status")
    request.status = GuarantorRequestStatus.consented
    db.add(
        GuarantorSigningEvents(
            request_id=request.id,
            event_type="consent_accepted",
            actor="guarantor",
            ip_address=ip_address,
            user_agent=user_agent,
            payload_json={"consent_text_version": body.consent_text_version},
            note="Guarantor accepted e-sign consent",
            created_at=_now(),
        )
    )
    db.commit()


def submit_signature(
    db: Session,
    token: str,
    body: GuarantorInviteSignIn,
    *,
    ip_address: str | None,
    user_agent: str | None,
) -> None:
    _, request = _resolve_invite(db, token)
    if request.status not in {GuarantorRequestStatus.consented, GuarantorRequestStatus.opened}:
        raise HTTPException(status_code=409, detail="Signature not allowed in current status")
    signature = GuarantorSignatures(
        request_id=request.id,
        signer_name=body.signer_name,
        signer_email=body.signer_email,
        signature_text=body.signature_text,
        consent_text_version=body.consent_text_version,
        signed_at=_now(),
    )
    db.add(signature)
    request.status = GuarantorRequestStatus.signed
    request.signed_at = _now()
    db.add(
        GuarantorSigningEvents(
            request_id=request.id,
            event_type="signature_submitted",
            actor="guarantor",
            ip_address=ip_address,
            user_agent=user_agent,
            payload_json={"signer_email": body.signer_email},
            note="Guarantor submitted signature",
            created_at=_now(),
        )
    )
    db.commit()


def upload_document(
    db: Session,
    token: str,
    *,
    document_type: str,
    file: UploadFile,
    ip_address: str | None,
    user_agent: str | None,
) -> None:
    _, request = _resolve_invite(db, token)
    if request.status not in {GuarantorRequestStatus.signed, GuarantorRequestStatus.submitted}:
        raise HTTPException(status_code=409, detail="Document upload not allowed in current status")
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    payload = file.file.read()
    if not payload:
        raise HTTPException(status_code=400, detail="Uploaded document is empty")
    content_type = (file.content_type or "application/octet-stream").strip()
    storage_key = upload_guarantor_document_to_blob(
        request_id=request.id,
        filename=file.filename,
        content_type=content_type,
        data=payload,
    )
    db.add(
        GuarantorDocuments(
            request_id=request.id,
            document_type=document_type,
            filename=file.filename,
            content_type=content_type,
            byte_size=len(payload),
            storage_key=storage_key,
            metadata_json={},
            uploaded_at=_now(),
        )
    )
    request.status = GuarantorRequestStatus.submitted
    db.add(
        GuarantorSigningEvents(
            request_id=request.id,
            event_type="document_uploaded",
            actor="guarantor",
            ip_address=ip_address,
            user_agent=user_agent,
            payload_json={"document_type": document_type, "filename": file.filename},
            note="Guarantor uploaded supporting document",
            created_at=_now(),
        )
    )
    db.commit()


def decline_invite(
    db: Session,
    token: str,
    body: GuarantorInviteDeclineIn,
    *,
    ip_address: str | None,
    user_agent: str | None,
) -> None:
    _, request = _resolve_invite(db, token)
    request.status = GuarantorRequestStatus.declined
    db.add(
        GuarantorSigningEvents(
            request_id=request.id,
            event_type="invite_declined",
            actor="guarantor",
            ip_address=ip_address,
            user_agent=user_agent,
            note=body.note or "Guarantor declined invite",
            created_at=_now(),
        )
    )
    db.commit()


def apply_decision(
    db: Session, user_id: uuid.UUID, request_id: uuid.UUID, body: GuarantorDecisionPatch
) -> GuarantorRequestOut:
    row = db.execute(
        select(GuarantorRequests).where(GuarantorRequests.user_id == user_id, GuarantorRequests.id == request_id)
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Guarantor request not found")
    allowed = {
        "verified": GuarantorRequestStatus.verified,
        "failed": GuarantorRequestStatus.failed,
        "declined": GuarantorRequestStatus.declined,
        "revoked": GuarantorRequestStatus.revoked,
    }
    if body.status not in allowed:
        raise HTTPException(status_code=422, detail="Invalid decision status")
    row.status = allowed[body.status]
    if row.status == GuarantorRequestStatus.verified:
        row.verification_status = GuarantorVerificationStatus.verified
        _auto_progress_user_stage(db, user_id)
    elif row.status in {GuarantorRequestStatus.failed, GuarantorRequestStatus.declined}:
        row.verification_status = GuarantorVerificationStatus.failed
    db.add(
        GuarantorSigningEvents(
            request_id=row.id,
            event_type="decision_recorded",
            actor="renter",
            actor_ref_id=str(user_id),
            note=body.note or f"Renter marked request as {body.status}",
            created_at=_now(),
        )
    )
    db.commit()
    db.refresh(row)
    return _request_out(db, row)


def _auto_progress_user_stage(db: Session, user_id: uuid.UUID) -> None:
    profile = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    if profile is None:
        return
    stage_order = [
        JourneyStage.searching,
        JourneyStage.touring,
        JourneyStage.applying,
        JourneyStage.lease_signed,
        JourneyStage.moving,
        JourneyStage.moved_in,
    ]
    current = profile.journey_stage_override or JourneyStage.searching
    current_idx = stage_order.index(current)
    target_idx = stage_order.index(JourneyStage.lease_signed)
    if current_idx < target_idx:
        profile.journey_stage_override = JourneyStage.lease_signed
