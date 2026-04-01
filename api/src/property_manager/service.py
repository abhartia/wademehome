from __future__ import annotations

import html
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from auth.emailer import send_property_manager_weekly_report_email
from core.logger import get_logger
from db.models import PropertyManagerReportSubscriptions, Users
from listings.router import fetch_nearby_listings_radius
from listings.schemas import NearbyListingsResponse
from property_manager.schemas import (
    ReportSubscriptionCreate,
    ReportSubscriptionResponse,
    ReportSubscriptionUpdate,
)

logger = get_logger(__name__)

LISTING_LIMIT_REPORT = 100


def _to_response(row: PropertyManagerReportSubscriptions) -> ReportSubscriptionResponse:
    return ReportSubscriptionResponse(
        id=str(row.id),
        label=row.label,
        center_latitude=row.center_latitude,
        center_longitude=row.center_longitude,
        radius_miles=row.radius_miles,
        is_active=row.is_active,
        last_sent_at=row.last_sent_at,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


def list_subscriptions(db: Session, user_id: uuid.UUID) -> list[ReportSubscriptionResponse]:
    rows = db.execute(
        select(PropertyManagerReportSubscriptions)
        .where(PropertyManagerReportSubscriptions.user_id == user_id)
        .order_by(PropertyManagerReportSubscriptions.created_at.desc())
    ).scalars().all()
    return [_to_response(r) for r in rows]


def create_subscription(
    db: Session, user_id: uuid.UUID, payload: ReportSubscriptionCreate
) -> ReportSubscriptionResponse:
    row = PropertyManagerReportSubscriptions(
        id=uuid.uuid4(),
        user_id=user_id,
        label=payload.label.strip(),
        center_latitude=Decimal(str(round(payload.center_latitude, 7))),
        center_longitude=Decimal(str(round(payload.center_longitude, 7))),
        radius_miles=Decimal(str(round(payload.radius_miles, 2))),
        is_active=payload.is_active,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _to_response(row)


def update_subscription(
    db: Session, user_id: uuid.UUID, sub_id: uuid.UUID, payload: ReportSubscriptionUpdate
) -> ReportSubscriptionResponse | None:
    row = db.execute(
        select(PropertyManagerReportSubscriptions).where(
            PropertyManagerReportSubscriptions.id == sub_id,
            PropertyManagerReportSubscriptions.user_id == user_id,
        )
    ).scalar_one_or_none()
    if not row:
        return None
    if payload.label is not None:
        row.label = payload.label.strip()
    if payload.center_latitude is not None:
        row.center_latitude = Decimal(str(round(payload.center_latitude, 7)))
    if payload.center_longitude is not None:
        row.center_longitude = Decimal(str(round(payload.center_longitude, 7)))
    if payload.radius_miles is not None:
        row.radius_miles = Decimal(str(round(payload.radius_miles, 2)))
    if payload.is_active is not None:
        row.is_active = payload.is_active
    db.commit()
    db.refresh(row)
    return _to_response(row)


def delete_subscription(db: Session, user_id: uuid.UUID, sub_id: uuid.UUID) -> bool:
    row = db.execute(
        select(PropertyManagerReportSubscriptions).where(
            PropertyManagerReportSubscriptions.id == sub_id,
            PropertyManagerReportSubscriptions.user_id == user_id,
        )
    ).scalar_one_or_none()
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True


def build_report_html(*, label: str, nearby: NearbyListingsResponse) -> str:
    rows_html = []
    for p in nearby.properties:
        name = html.escape(p.name or "")
        addr = html.escape(p.address or "")
        rent = html.escape(p.rent_range or "")
        beds = html.escape(p.bedroom_range or "")
        conc = html.escape(p.concessions or "") if p.concessions else "—"
        avail = html.escape(p.available_date or "") if p.available_date else "—"
        link = ""
        if p.listing_url:
            u = html.escape(p.listing_url, quote=True)
            link = f'<a href="{u}">View listing</a>'
        else:
            link = "—"
        rows_html.append(
            "<tr>"
            f"<td>{name}</td><td>{addr}</td><td>{rent}</td><td>{beds}</td>"
            f"<td>{conc}</td><td>{avail}</td><td>{link}</td>"
            "</tr>"
        )
    body_rows = "\n".join(rows_html) if rows_html else "<tr><td colspan='7'>No listings returned.</td></tr>"
    fallback_note = ""
    if nearby.used_global_nearest_fallback:
        fallback_note = (
            "<p><em>Note: Nothing matched inside your radius; showing nearest buildings "
            "globally (same behavior as search).</em></p>"
        )
    return f"""
    <html><body>
    <h2>Weekly competitive snapshot</h2>
    <p><strong>{html.escape(label)}</strong></p>
    <p>Radius: {nearby.radius_miles} mi · Showing up to {nearby.limit} buildings · \
Total in scope (when available): {nearby.total_in_radius}</p>
    {fallback_note}
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
    <thead><tr>
    <th>Building</th><th>Address</th><th>Rent</th><th>Beds</th>
    <th>Concessions</th><th>Availability</th><th>Link</th>
    </tr></thead>
    <tbody>{body_rows}</tbody>
    </table>
    <p style="color:#666;font-size:12px;">This is a point-in-time snapshot from Wade Me Home inventory. \
Week-over-week price change alerts require a future data pipeline update.</p>
    </body></html>
    """


def preview_nearby(lat: float, lng: float, radius_miles: float, limit: int) -> NearbyListingsResponse:
    return fetch_nearby_listings_radius(lat, lng, radius_miles, limit)


def send_subscription_report_now(
    db: Session, user_id: uuid.UUID, subscription_id: uuid.UUID
) -> ReportSubscriptionResponse:
    """Build and email the competitive snapshot for one subscription; updates last_sent_at."""
    sub = db.execute(
        select(PropertyManagerReportSubscriptions).where(
            PropertyManagerReportSubscriptions.id == subscription_id,
            PropertyManagerReportSubscriptions.user_id == user_id,
        )
    ).scalar_one_or_none()
    if not sub:
        raise KeyError("Subscription not found")

    user = db.execute(select(Users).where(Users.id == sub.user_id)).scalar_one_or_none()
    if not user or not user.is_active:
        raise ValueError("Account is not active")
    if user.email_verified_at is None:
        raise ValueError("Verify your email before sending reports")

    nearby = fetch_nearby_listings_radius(
        float(sub.center_latitude),
        float(sub.center_longitude),
        float(sub.radius_miles),
        LISTING_LIMIT_REPORT,
    )
    html_body = build_report_html(label=sub.label, nearby=nearby)
    subject = f"Weekly comps: {sub.label}"
    send_property_manager_weekly_report_email(
        to_email=user.email,
        subject=subject,
        html_body=html_body,
    )
    sub.last_sent_at = datetime.now(timezone.utc)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return _to_response(sub)


def send_weekly_reports_for_all_active(db: Session) -> tuple[int, int]:
    """Send one email per active subscription. Returns (sent_count, failed_count)."""
    rows = db.execute(
        select(PropertyManagerReportSubscriptions, Users)
        .join(Users, Users.id == PropertyManagerReportSubscriptions.user_id)
        .where(
            PropertyManagerReportSubscriptions.is_active.is_(True),
            Users.is_active.is_(True),
            Users.email_verified_at.isnot(None),
        )
    ).all()

    sent = 0
    failed = 0
    now = datetime.now(timezone.utc)
    for sub, user in rows:
        try:
            nearby = fetch_nearby_listings_radius(
                float(sub.center_latitude),
                float(sub.center_longitude),
                float(sub.radius_miles),
                LISTING_LIMIT_REPORT,
            )
            html_body = build_report_html(label=sub.label, nearby=nearby)
            subject = f"Weekly comps: {sub.label}"
            send_property_manager_weekly_report_email(
                to_email=user.email,
                subject=subject,
                html_body=html_body,
            )
            sub.last_sent_at = now
            db.add(sub)
            db.commit()
            sent += 1
        except Exception:
            logger.exception("weekly report failed for subscription %s", sub.id)
            failed += 1
            db.rollback()

    return sent, failed
