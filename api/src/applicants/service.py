from __future__ import annotations

import secrets
from datetime import timedelta

from applicants.schemas import ApplicantResponse
from db.models import GroupApplicants
from groups.service import app_base_url, utc_now

SELF_REG_TTL_DAYS = 30


def generate_self_reg_token() -> str:
    return secrets.token_urlsafe(32)


def self_reg_expiry():
    return utc_now() + timedelta(days=SELF_REG_TTL_DAYS)


def self_reg_url(token: str) -> str:
    return f"{app_base_url()}/applicants/register/{token}"


def applicant_to_response(applicant: GroupApplicants) -> ApplicantResponse:
    has_pending = (
        applicant.self_reg_token is not None
        and applicant.self_reg_token_expires_at is not None
        and applicant.self_reg_token_expires_at > utc_now()
    )
    return ApplicantResponse(
        id=applicant.id,
        group_id=applicant.group_id,
        name=applicant.name,
        email=applicant.email,
        phone=applicant.phone,
        status=applicant.status,
        role_context=applicant.role_context,
        notes=applicant.notes,
        budget_usd=applicant.budget_usd,
        move_in_date=applicant.move_in_date,
        source=applicant.source,
        has_pending_self_reg=has_pending,
        self_reg_url=(self_reg_url(applicant.self_reg_token) if has_pending else None),
        self_reg_expires_at=(applicant.self_reg_token_expires_at if has_pending else None),
        created_at=applicant.created_at,
        updated_at=applicant.updated_at,
    )
