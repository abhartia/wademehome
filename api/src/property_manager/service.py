from __future__ import annotations

import hashlib
import html
import json
import re
import statistics
import uuid
from collections import defaultdict
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session

from auth.emailer import send_property_manager_weekly_report_email
from core.config import Config
from core.logger import get_logger
from db.models import PmBuildingSnapshots, PmMarketSnapshots, PropertyManagerReportSubscriptions, Users
from listings.router import fetch_nearby_listings_radius, fetch_poi_nearby
from listings.schemas import MarketSnapshotResponse, NearbyListingsResponse, PoiNearbyResponse
from property_manager.ai_insights import generate_ai_summary
from property_manager.census import CensusDemographics, fetch_census_demographics
from property_manager.schemas import (
    AmenityAnalysis,
    AmenityFrequency,
    BedroomSupply,
    BuildingDelta,
    BuildingFinancialProfile,
    BuildingFinancials,
    BuildingSnapshotPoint,
    BuildingTrendsResponse,
    CompetitorPosition,
    DemographicsOut,
    FeeCategoryStats,
    FeeIntelligence,
    InsightsResponse,
    MarketDeltas,
    MarketSnapshotPoint,
    MetricDelta,
    ReportSubscriptionCreate,
    ReportSubscriptionResponse,
    ReportSubscriptionUpdate,
    SupplyPressure,
    TrendsResponse,
)
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

LISTING_LIMIT_REPORT = 100
_SNAPSHOT_TABLE_CHECK_TTL_SECONDS = 300
_snapshot_tables_ready_cache: bool | None = None
_snapshot_tables_checked_at: datetime | None = None
_snapshot_tables_missing_logged = False


def _snapshot_tables_ready() -> bool:
    """Return whether snapshot tables are present; cache check to avoid repeated inspector calls."""
    global _snapshot_tables_ready_cache, _snapshot_tables_checked_at, _snapshot_tables_missing_logged

    now = datetime.now(timezone.utc)
    if (
        _snapshot_tables_checked_at is not None
        and _snapshot_tables_ready_cache is not None
        and (now - _snapshot_tables_checked_at).total_seconds() < _SNAPSHOT_TABLE_CHECK_TTL_SECONDS
    ):
        return _snapshot_tables_ready_cache

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            ready = insp.has_table("pm_market_snapshots") and insp.has_table("pm_building_snapshots")
    except Exception as exc:
        logger.warning("snapshot table readiness check failed: %s", exc)
        ready = False

    _snapshot_tables_ready_cache = ready
    _snapshot_tables_checked_at = now
    if not ready and not _snapshot_tables_missing_logged:
        logger.info("snapshot tables not ready; returning empty trend data until migrations are applied")
        _snapshot_tables_missing_logged = True
    return ready


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


def _insights_html_section(insights: InsightsResponse) -> str:
    """Build a compact HTML summary of insights for email reports."""
    parts: list[str] = []
    parts.append('<h3 style="margin:16px 0 8px;">Market Intelligence</h3>')

    # Demographics / Affordability
    demo = insights.demographics
    if demo:
        parts.append('<table border="0" cellpadding="4" style="font-family:sans-serif;font-size:13px;margin-bottom:12px;">')
        if demo.median_household_income:
            parts.append(f'<tr><td><strong>Median Household Income</strong></td><td>${demo.median_household_income:,.0f}</td></tr>')
        if demo.affordability_ceiling:
            parts.append(f'<tr><td><strong>Affordability Ceiling (30% rule)</strong></td><td>${demo.affordability_ceiling:,.0f}/mo</td></tr>')
        if demo.affordable_pct is not None:
            parts.append(f'<tr><td><strong>Households That Can Afford Area Rent</strong></td><td>{demo.affordable_pct}%</td></tr>')
        if demo.renter_pct is not None:
            parts.append(f'<tr><td><strong>Renter Population</strong></td><td>{demo.renter_pct}%')
            if demo.renter_pool_size:
                parts.append(f' (~{demo.renter_pool_size:,} people)')
            parts.append('</td></tr>')
        if demo.population:
            parts.append(f'<tr><td><strong>Total Population</strong></td><td>{demo.population:,}</td></tr>')
        parts.append('</table>')

    # Supply pressure
    sp = insights.supply_pressure
    if sp.total_units > 0:
        parts.append(
            '<p style="font-size:13px;"><strong>Supply:</strong> '
            f'{sp.available_units} of {sp.total_units} listed units currently available '
            f'({sp.listing_sample_vacancy_rate_pct}% listing availability rate). '
            f'Based on listing platform data; actual market vacancy is typically lower.</p>'
        )

    # Top fees
    fi = insights.fee_intelligence
    if fi.fee_categories:
        parts.append('<p style="font-size:13px;margin-bottom:4px;"><strong>Top Fee Benchmarks:</strong></p>')
        parts.append('<table border="1" cellpadding="4" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:12px;margin-bottom:12px;">')
        parts.append('<tr style="background:#f5f5f5;"><th>Fee</th><th>% Charging</th><th>Median</th><th>Range</th></tr>')
        for fc in fi.fee_categories[:8]:
            med = f'${fc.median_amount:,.0f}' if fc.median_amount else '—'
            rng = f'${fc.min_amount:,.0f}–${fc.max_amount:,.0f}' if fc.min_amount is not None and fc.max_amount is not None else '—'
            parts.append(f'<tr><td>{html.escape(fc.label)}</td><td>{fc.pct_buildings}%</td><td>{med}</td><td>{rng}</td></tr>')
        parts.append('</table>')

    # Amenity gaps
    am = insights.amenities
    if am.rare:
        rare_list = ", ".join(a.amenity.title() for a in am.rare[:5])
        parts.append(f'<p style="font-size:13px;"><strong>Rare Amenities Nearby:</strong> {html.escape(rare_list)}</p>')

    return "\n".join(parts)


def _delta_badge_html(label: str, current: float | None, previous: float | None, fmt: str = "dollar") -> str:
    """Render a single metric delta as inline HTML for email."""
    if current is None:
        return ""
    if previous is None or previous == 0:
        if fmt == "dollar":
            return f"<strong>{label}:</strong> ${current:,.0f}"
        elif fmt == "pct":
            return f"<strong>{label}:</strong> {current:.1f}%"
        return f"<strong>{label}:</strong> {current:,.0f}"

    change = current - previous
    change_pct = change / previous * 100 if previous != 0 else 0
    arrow = "&#9650;" if change > 0 else "&#9660;" if change < 0 else "&#8212;"
    color = "#dc2626" if change > 0 else "#16a34a" if change < 0 else "#666"

    if fmt == "dollar":
        val = f"${current:,.0f}"
        delta = f"{arrow} {change_pct:+.1f}%"
    elif fmt == "pct":
        val = f"{current:.1f}%"
        delta = f"{arrow} {change:+.1f}pp"
    else:
        val = f"{current:,.0f}"
        delta = f"{arrow} {change:+.0f}"

    return f'<strong>{label}:</strong> {val} <span style="color:{color};font-size:12px;">({delta})</span>'


def _building_movers_html(building_deltas: list[BuildingDelta]) -> str:
    """Render the top building movers section for email."""
    if not building_deltas:
        return ""
    # Show top 5 biggest movers + any new buildings (up to 3)
    movers = [d for d in building_deltas if d.rent_change_pct is not None and d.rent_change_pct != 0][:5]
    new_buildings = [d for d in building_deltas if d.is_new][:3]

    if not movers and not new_buildings:
        return ""

    parts = ['<p style="font-size:13px;margin-bottom:4px;"><strong>Notable changes this week:</strong></p>']
    parts.append('<ul style="font-size:13px;margin:0 0 12px 0;padding-left:20px;">')
    for d in movers:
        name = html.escape(d.property_name or d.address or d.property_id)
        prev_str = f"${d.previous_rent:,.0f}" if d.previous_rent else "N/A"
        cur_str = f"${d.current_rent:,.0f}" if d.current_rent else "N/A"
        color = "#dc2626" if (d.rent_change_pct or 0) > 0 else "#16a34a"
        pct_str = f"{d.rent_change_pct:+.1f}%" if d.rent_change_pct else ""
        parts.append(
            f'<li>{name}: {prev_str} &rarr; {cur_str} '
            f'<span style="color:{color};">({pct_str})</span></li>'
        )
    for d in new_buildings:
        name = html.escape(d.property_name or d.address or d.property_id)
        rent_str = f" &mdash; ${d.current_rent:,.0f}/mo" if d.current_rent else ""
        parts.append(f'<li><span style="color:#2563eb;">NEW:</span> {name}{rent_str}</li>')
    parts.append("</ul>")
    return "\n".join(parts)


def build_report_html(
    *,
    label: str,
    nearby: NearbyListingsResponse,
    insights: InsightsResponse | None = None,
    market_deltas: MarketDeltas | None = None,
    building_deltas: list[BuildingDelta] | None = None,
) -> str:
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
    insights_section = _insights_html_section(insights) if insights else ""

    # Week-over-week deltas summary
    deltas_section = ""
    if market_deltas:
        badges = []
        if market_deltas.median_rent:
            badges.append(_delta_badge_html("Median rent", market_deltas.median_rent.current, market_deltas.median_rent.previous, "dollar"))
        if market_deltas.vacancy_rate_pct:
            badges.append(_delta_badge_html("Availability", market_deltas.vacancy_rate_pct.current, market_deltas.vacancy_rate_pct.previous, "pct"))
        if market_deltas.sample_size:
            badges.append(_delta_badge_html("Supply", market_deltas.sample_size.current, market_deltas.sample_size.previous, "int"))
        if badges:
            deltas_section = (
                '<div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;padding:10px 14px;'
                'margin:12px 0;font-family:sans-serif;font-size:13px;">'
                '<strong style="font-size:14px;">Week-over-Week</strong><br/>'
                + " &nbsp;&middot;&nbsp; ".join(badges)
                + "</div>"
            )

    # Building movers
    movers_section = _building_movers_html(building_deltas or [])

    # Footer
    if market_deltas:
        footer = "Powered by Wade Me Home — tracking your market weekly."
    else:
        footer = "Trends will appear after 2+ weekly snapshots. Powered by Wade Me Home."

    return f"""
    <html><body>
    <h2>Weekly competitive snapshot</h2>
    <p><strong>{html.escape(label)}</strong></p>
    <p>Radius: {nearby.radius_miles} mi &middot; Showing up to {nearby.limit} buildings &middot; \
Total in scope (when available): {nearby.total_in_radius}</p>
    {deltas_section}
    {movers_section}
    {insights_section}
    {fallback_note}
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
    <thead><tr>
    <th>Building</th><th>Address</th><th>Rent</th><th>Beds</th>
    <th>Concessions</th><th>Availability</th><th>Link</th>
    </tr></thead>
    <tbody>{body_rows}</tbody>
    </table>
    <p style="color:#666;font-size:12px;">{footer}</p>
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

    s_lat = float(sub.center_latitude)
    s_lng = float(sub.center_longitude)
    s_radius = float(sub.radius_miles)
    nearby = fetch_nearby_listings_radius(s_lat, s_lng, s_radius, LISTING_LIMIT_REPORT)

    # Fetch existing trend data to pass into AI summary
    ai_trend_data = _build_ai_trend_payload(s_lat, s_lng, s_radius)

    try:
        insights = build_insights(s_lat, s_lng, s_radius, trend_data=ai_trend_data)
    except Exception:
        logger.warning("insights generation failed for subscription %s", sub.id)
        insights = None

    # Archive snapshots and compute deltas for email
    market_deltas: MarketDeltas | None = None
    building_deltas: list[BuildingDelta] = []
    if insights:
        try:
            archive_snapshots(db, s_lat, s_lng, s_radius, insights)
            history = get_market_history(s_lat, s_lng, s_radius, weeks=2)
            market_deltas = compute_market_deltas(history)
            building_deltas = get_buildings_latest_vs_previous(s_lat, s_lng, s_radius)
        except Exception:
            logger.warning("snapshot archiving failed for subscription %s", sub.id)
            db.rollback()

    html_body = build_report_html(
        label=sub.label, nearby=nearby, insights=insights,
        market_deltas=market_deltas, building_deltas=building_deltas,
    )
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
            s_lat = float(sub.center_latitude)
            s_lng = float(sub.center_longitude)
            s_radius = float(sub.radius_miles)
            nearby = fetch_nearby_listings_radius(s_lat, s_lng, s_radius, LISTING_LIMIT_REPORT)

            # Fetch existing trend data to pass into AI summary
            ai_trend_data = _build_ai_trend_payload(s_lat, s_lng, s_radius)

            try:
                insights = build_insights(s_lat, s_lng, s_radius, trend_data=ai_trend_data)
            except Exception:
                logger.warning("insights failed for weekly sub %s", sub.id)
                insights = None

            # Archive snapshots and compute deltas for email
            market_deltas: MarketDeltas | None = None
            building_deltas: list[BuildingDelta] = []
            if insights:
                try:
                    archive_snapshots(db, s_lat, s_lng, s_radius, insights)
                    history = get_market_history(s_lat, s_lng, s_radius, weeks=2)
                    market_deltas = compute_market_deltas(history)
                    building_deltas = get_buildings_latest_vs_previous(s_lat, s_lng, s_radius)
                except Exception:
                    logger.warning("snapshot archiving failed for weekly sub %s", sub.id)
                    db.rollback()

            html_body = build_report_html(
                label=sub.label, nearby=nearby, insights=insights,
                market_deltas=market_deltas, building_deltas=building_deltas,
            )
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

    # Retention cleanup
    cleanup_old_snapshots(db)

    return sent, failed


# ── Insights engine ─────────────────────────────────────────────────────


def _qualified_table() -> str:
    name = (listing_table_name or "").strip()
    if not name:
        return ""
    schema = (listing_table_schema or "").strip()
    if schema:
        return f'"{schema}"."{name}"'
    return f'"{name}"'


def _fetch_building_details_in_radius(
    lat: float, lng: float, radius_miles: float,
) -> list[dict[str, Any]]:
    """Fetch raw unit rows with fees/sqft/availability within a radius."""
    qtable = _qualified_table()
    if not qtable:
        return []
    radius_m = radius_miles * 1609.344
    sql = text(f"""
        SELECT
            t.property_id,
            t.listing_id,
            t.property_name,
            t.address,
            t.city,
            t.state,
            t.zipcode,
            t.rent_price,
            t.sqft,
            t.beds,
            t.fees,
            t.availability_status,
            t.available_at,
            t.listing_url
        FROM {qtable} AS t
        WHERE t.geog IS NOT NULL
          AND ST_DWithin(
            t.geog,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius_m
          )
        LIMIT 3000
    """)
    try:
        with engine.connect() as conn:
            rows = conn.execute(sql, {"lat": lat, "lng": lng, "radius_m": radius_m}).mappings().all()
            return [dict(r) for r in rows]
    except Exception:
        logger.exception("_fetch_building_details_in_radius failed")
        return []


def _extract_zip(properties: list[Any]) -> str | None:
    for p in properties:
        z = getattr(p, "zip_code", None)
        if isinstance(z, str) and len(z.strip()) >= 5:
            return z.strip()[:5]
    return None


_RENT_RE = re.compile(r"\$?([\d,]+)")


def _parse_rent_midpoint(rent_range: str | None) -> float | None:
    if not rent_range:
        return None
    matches = _RENT_RE.findall(rent_range)
    nums = []
    for m in matches:
        try:
            nums.append(float(m.replace(",", "")))
        except ValueError:
            pass
    if not nums:
        return None
    return statistics.mean(nums)


def _compute_market_snapshot(rows: list[dict[str, Any]], zip_code: str | None) -> MarketSnapshotResponse:
    """Build market snapshot from the detail rows already in memory."""
    rents = [r["rent_price"] for r in rows if r.get("rent_price") and r["rent_price"] > 0]
    if not rents:
        scope = f"ZIP {zip_code}" if zip_code else "Nearby"
        return MarketSnapshotResponse(scope=scope, zip=zip_code, sample_size=0, bedroom_mix={})

    # IQR-based outlier filtering to remove extreme rents (e.g. $650 in JC)
    rents_sorted = sorted(rents)
    n = len(rents_sorted)
    q1 = rents_sorted[int(n * 0.25)]
    q3 = rents_sorted[int(n * 0.75)]
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    rents_filtered = [r for r in rents_sorted if lower_bound <= r <= upper_bound]
    if not rents_filtered:
        rents_filtered = rents_sorted  # fallback if filtering removes everything

    n = len(rents_filtered)
    p25 = rents_filtered[int(n * 0.25)]
    p50 = rents_filtered[int(n * 0.50)]
    p75 = rents_filtered[int(n * 0.75)]

    bed_counts: dict[str, int] = defaultdict(int)
    for r in rows:
        if r.get("rent_price") and r["rent_price"] > 0:
            b = r.get("beds")
            label = f"{int(b)} BR" if b is not None else "Unknown"
            bed_counts[label] += 1

    scope = f"ZIP {zip_code}" if zip_code else "Nearby"
    return MarketSnapshotResponse(
        scope=scope,
        zip=zip_code,
        sample_size=n,
        median_rent=round(p50, 0),
        p25_rent=round(p25, 0),
        p75_rent=round(p75, 0),
        bedroom_mix=dict(sorted(bed_counts.items())),
    )


def _compute_rent_positioning(
    rows: list[dict[str, Any]],
    area_median: float | None,
) -> list[CompetitorPosition]:
    """Group by building, compute $/sqft and vs-median positioning."""
    buildings: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for r in rows:
        pid = r.get("property_id") or r.get("address") or "unknown"
        buildings[pid].append(r)

    out: list[CompetitorPosition] = []
    for pid, units in buildings.items():
        first = units[0]
        rents = [u["rent_price"] for u in units if u.get("rent_price") and u["rent_price"] > 0]
        sqfts = [u["sqft"] for u in units if u.get("sqft") and u["sqft"] > 0]
        beds_set = sorted({int(u["beds"]) for u in units if u.get("beds") is not None})

        med_rent = statistics.median(rents) if rents else None
        med_sqft = statistics.median(sqfts) if sqfts else None
        rent_per_sqft = round(med_rent / med_sqft, 2) if med_rent and med_sqft else None

        vs_pct: float | None = None
        label = ""
        if med_rent and area_median and area_median > 0:
            vs_pct = round((med_rent - area_median) / area_median * 100, 1)
            if vs_pct < -10:
                label = "Below Market"
            elif vs_pct <= 5:
                label = "At Market"
            elif vs_pct <= 20:
                label = "Above Market"
            else:
                label = "Premium"

        beds_str = ", ".join(f"{b} BR" for b in beds_set) if beds_set else ""

        out.append(CompetitorPosition(
            name=first.get("property_name") or first.get("address") or "Unknown",
            address=first.get("address") or "",
            unit_count=len(units),
            median_rent=round(med_rent, 0) if med_rent else None,
            median_sqft=round(med_sqft, 0) if med_sqft else None,
            rent_per_sqft=rent_per_sqft,
            vs_median_pct=vs_pct,
            position_label=label,
            beds_available=beds_str,
            listing_url=first.get("listing_url"),
        ))

    out.sort(key=lambda c: c.rent_per_sqft if c.rent_per_sqft is not None else 9999)
    return out


def _compute_fee_intelligence(rows: list[dict[str, Any]]) -> FeeIntelligence:
    """Parse structured fees JSON across buildings, aggregate by fee type."""
    # Collect fees per building (deduplicate by property_id)
    building_fees: dict[str, list[dict]] = defaultdict(list)
    seen_pids: set[str] = set()
    for r in rows:
        pid = r.get("property_id") or r.get("address") or "unknown"
        if pid in seen_pids:
            continue
        seen_pids.add(pid)
        raw = r.get("fees")
        if not raw or not isinstance(raw, str) or not raw.strip().startswith("["):
            continue
        try:
            fee_items = json.loads(raw)
            if isinstance(fee_items, list):
                building_fees[pid] = fee_items
        except (json.JSONDecodeError, TypeError):
            pass

    total_with_fees = len(building_fees)
    if total_with_fees == 0:
        return FeeIntelligence(total_buildings_with_fees=0, fee_categories=[])

    # Aggregate by fee label
    label_data: dict[str, dict] = defaultdict(lambda: {
        "type": "", "frequency": "", "amounts": [], "building_count": 0,
    })
    for pid, items in building_fees.items():
        seen_labels: set[str] = set()
        for f in items:
            label = (f.get("label") or "").strip()
            if not label or label in seen_labels:
                continue
            seen_labels.add(label)
            entry = label_data[label]
            entry["building_count"] += 1
            if not entry["type"]:
                entry["type"] = f.get("type") or ""
            if not entry["frequency"]:
                entry["frequency"] = f.get("frequency") or ""
            amt = f.get("amount")
            if isinstance(amt, (int, float)) and amt > 0:
                entry["amounts"].append(float(amt))

    categories: list[FeeCategoryStats] = []
    for label, data in label_data.items():
        amts = data["amounts"]
        categories.append(FeeCategoryStats(
            label=label,
            fee_type=data["type"],
            buildings_charging=data["building_count"],
            pct_buildings=round(data["building_count"] / total_with_fees * 100, 1),
            median_amount=round(statistics.median(amts), 2) if amts else None,
            min_amount=round(min(amts), 2) if amts else None,
            max_amount=round(max(amts), 2) if amts else None,
            frequency=data["frequency"],
        ))

    categories.sort(key=lambda c: c.buildings_charging, reverse=True)
    return FeeIntelligence(
        total_buildings_with_fees=total_with_fees,
        fee_categories=categories[:30],
    )


# Listing portals capture only part of the rental stock; the rest is mostly off-market and occupied.
_SUPPLY_UNLISTED_MARKET_SHARE_PCT = 55.0
_SUPPLY_ASSUMED_UNLISTED_VACANCY_PCT = 2.0


def _compute_supply_pressure(rows: list[dict[str, Any]]) -> SupplyPressure:
    """Compute listing availability from availability_status."""
    total = 0
    available = 0
    bed_totals: dict[str, int] = defaultdict(int)
    bed_available: dict[str, int] = defaultdict(int)

    for r in rows:
        status = (r.get("availability_status") or "").strip().lower()
        beds_raw = r.get("beds")
        bed_label = f"{int(beds_raw)} BR" if beds_raw is not None else "Unknown"
        bed_totals[bed_label] += 1

        is_available = status in (
            "available", "available now", "available soon", "vacant",
            "not yet leased", "ready", "open",
        )

        # Exclude "Unknown" bedroom units from headline totals — they inflate
        # availability and signal dirty data.
        if bed_label != "Unknown":
            total += 1
            if is_available:
                available += 1

        if is_available:
            bed_available[bed_label] += 1

    # Build by-bedroom breakdown, excluding "Unknown"
    by_bedroom: list[BedroomSupply] = []
    for bed_label in sorted(bed_totals.keys()):
        if bed_label == "Unknown":
            continue
        t = bed_totals[bed_label]
        a = bed_available.get(bed_label, 0)
        by_bedroom.append(BedroomSupply(
            beds=bed_label,
            total=t,
            available=a,
            vacancy_pct=round(a / t * 100, 1) if t > 0 else 0,
        ))

    listing_availability = round(available / total * 100, 1) if total > 0 else 0.0
    unlisted_share = min(max(_SUPPLY_UNLISTED_MARKET_SHARE_PCT, 0.0), 99.0)
    share_in_db = 1.0 - unlisted_share / 100.0
    assumed_uv = min(max(_SUPPLY_ASSUMED_UNLISTED_VACANCY_PCT, 0.0), 100.0)

    if total <= 0 or share_in_db <= 0:
        return SupplyPressure(
            total_units=total,
            available_units=available,
            vacancy_rate_pct=0.0,
            listing_sample_vacancy_rate_pct=listing_availability,
            estimated_market_units=0,
            estimated_unlisted_units=0,
            unlisted_market_share_pct=unlisted_share,
            assumed_unlisted_vacancy_pct=assumed_uv,
            by_bedroom=by_bedroom,
        )

    est_market = total / share_in_db
    est_unlisted = max(0, int(round(est_market - total)))
    avail_unlisted = est_unlisted * (assumed_uv / 100.0)
    est_vacancy = (available + avail_unlisted) / est_market * 100 if est_market > 0 else 0.0

    return SupplyPressure(
        total_units=total,
        available_units=available,
        vacancy_rate_pct=round(est_vacancy, 1),
        listing_sample_vacancy_rate_pct=listing_availability,
        estimated_market_units=int(round(est_market)),
        estimated_unlisted_units=est_unlisted,
        unlisted_market_share_pct=unlisted_share,
        assumed_unlisted_vacancy_pct=assumed_uv,
        by_bedroom=by_bedroom,
    )


# Amenities that are too generic (every apartment has these), malformed, or placeholder text.
_AMENITY_BLOCKLIST: set[str] = {
    # Basic appliances every unit has
    "refrigerator", "fridge", "stove", "oven", "microwave", "range",
    "garbage disposal", "smoke detector", "carbon monoxide detector",
    "fire extinguisher", "smoke free", "smoke free community",
    # Generic / meaningless
    "other", "none", "n/a", "na", "tbd", "ask", "call for details",
    "information coming soon", "coming soon", "please inquire",
    "see website", "visit website", "contact us", "inquire within",
    # Too vague
    "kitchen", "bathroom", "bedroom", "living room", "closet",
    "window", "windows", "door", "doors", "floor", "floors",
    "wall", "walls", "ceiling", "ceilings", "light", "lights",
    "cable ready", "cable", "internet ready",
}

# Substrings that indicate junk entries
_AMENITY_JUNK_SUBSTRINGS = (
    "coming soon", "information coming", "call for", "please call",
    "contact for", "inquire", "see manager", "ask about",
)

_AMENITY_JUNK_RE = re.compile(
    r"^\d+\s*(foot|ft|'|ceiling)"  # "9 foot ceilings", "9 ceilings", "9' ceilings"
    r"|^\d+$"                       # bare numbers
    r"|^.{1,2}$"                    # 1-2 char junk
)


def _is_junk_amenity(amenity: str) -> bool:
    """Return True if the amenity should be excluded from the landscape analysis."""
    a = amenity.lower().strip()
    if a in _AMENITY_BLOCKLIST:
        return True
    if any(sub in a for sub in _AMENITY_JUNK_SUBSTRINGS):
        return True
    if _AMENITY_JUNK_RE.search(a):
        return True
    return False


def _compute_amenity_analysis(listing_ids: list[str]) -> AmenityAnalysis:
    """Query listing_amenities for given listing_ids, classify by frequency tier."""
    if not listing_ids:
        return AmenityAnalysis(total_buildings=0)

    qtable = _qualified_table()
    if not qtable:
        return AmenityAnalysis(total_buildings=0)

    batch = listing_ids[:500]
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text(f"""
                    SELECT COALESCE(l.property_id, la.listing_id) AS bldg,
                           la.amenity_text_norm
                    FROM listing_amenities la
                    LEFT JOIN {qtable} l ON l.listing_id = la.listing_id
                    WHERE la.listing_id = ANY(:ids)
                      AND la.amenity_text_norm IS NOT NULL
                      AND la.amenity_text_norm != ''
                """),
                {"ids": batch},
            ).fetchall()
    except Exception:
        logger.exception("_compute_amenity_analysis query failed")
        return AmenityAnalysis(total_buildings=0)

    if not rows:
        return AmenityAnalysis(total_buildings=0)

    # Count amenities per building (grouped by property_id)
    building_amenities: dict[str, set[str]] = defaultdict(set)
    for r in rows:
        building_amenities[r[0]].add(r[1].lower().strip())

    total_buildings = len(building_amenities)
    if total_buildings == 0:
        return AmenityAnalysis(total_buildings=0)

    # Count frequency of each amenity across buildings, filtering noise
    amenity_counts: dict[str, int] = defaultdict(int)
    for amenities_set in building_amenities.values():
        for a in amenities_set:
            if _is_junk_amenity(a):
                continue
            amenity_counts[a] += 1

    standard: list[AmenityFrequency] = []
    differentiators: list[AmenityFrequency] = []
    rare: list[AmenityFrequency] = []

    for amenity, count in sorted(amenity_counts.items(), key=lambda x: x[1], reverse=True):
        pct = round(count / total_buildings * 100, 1)
        item = AmenityFrequency(amenity=amenity, count=count, pct_of_buildings=pct)
        if pct >= 60:
            standard.append(item)
        elif pct >= 20:
            differentiators.append(item)
        else:
            rare.append(item)

    return AmenityAnalysis(
        total_buildings=total_buildings,
        standard=standard[:15],
        differentiators=differentiators[:15],
        rare=rare[:15],
    )


# ── NYC Building Financials (PLUTO + DOF assessments) ──────────────────

_NYC_CAP_RATE = 0.05       # ~5% for NYC multifamily (RGB study baseline)
_NYC_EXPENSE_RATIO = 0.60  # ~60% operating expense ratio per RGB studies


def _compute_building_financials(
    pluto_buildings: list,
    area_median_asking_rent: float | None,
) -> BuildingFinancials | None:
    """Derive financial metrics from PLUTO + assessment data."""
    if not pluto_buildings:
        return None

    profiles: list[BuildingFinancialProfile] = []
    values_per_unit: list[float] = []
    values_per_sqft: list[float] = []
    est_rents: list[float] = []
    gap_pcts: list[float] = []

    for b in pluto_buildings:
        units = b.units_res
        if not units or units < 3:
            continue

        # Prefer DOF actual_total_market_value; fall back to PLUTO assessed_total
        # (PLUTO assesstot is the assessed value, roughly 45% of market for class-2)
        mv = b.market_value or (b.assessed_total / 0.45 if b.assessed_total else None)
        vpu = round(mv / units, 0) if mv else None
        vps = round(mv / b.bldg_area, 2) if mv and b.bldg_area and b.bldg_area > 0 else None

        est_noi = round(mv * _NYC_CAP_RATE, 0) if mv else None
        est_gross = round(est_noi / (1 - _NYC_EXPENSE_RATIO), 0) if est_noi else None
        est_rent = round(est_gross / units / 12, 0) if est_gross and units else None

        gap_pct = None
        if est_rent and area_median_asking_rent and est_rent > 0:
            gap_pct = round((area_median_asking_rent - est_rent) / est_rent * 100, 1)

        profiles.append(BuildingFinancialProfile(
            bbl=b.bbl,
            address=b.address,
            owner_name=b.owner_name,
            units_res=units,
            bldg_area_sqft=b.bldg_area,
            num_floors=b.num_floors,
            year_built=b.year_built,
            bldg_class=b.bldg_class,
            zone_dist=b.zone_dist,
            assessed_total=b.assessed_total,
            market_value=mv,
            value_per_unit=vpu,
            value_per_sqft=vps,
            estimated_noi=est_noi,
            estimated_gross_income=est_gross,
            estimated_avg_in_place_rent=est_rent,
            asking_vs_in_place_gap_pct=gap_pct,
        ))

        if vpu is not None:
            values_per_unit.append(vpu)
        if vps is not None:
            values_per_sqft.append(vps)
        if est_rent is not None:
            est_rents.append(est_rent)
        if gap_pct is not None:
            gap_pcts.append(gap_pct)

    if not profiles:
        return None

    profiles.sort(key=lambda p: p.units_res or 0, reverse=True)

    return BuildingFinancials(
        building_count=len(profiles),
        total_units=sum(p.units_res or 0 for p in profiles),
        median_value_per_unit=round(statistics.median(values_per_unit), 0) if values_per_unit else None,
        median_value_per_sqft=round(statistics.median(values_per_sqft), 2) if values_per_sqft else None,
        median_estimated_in_place_rent=round(statistics.median(est_rents), 0) if est_rents else None,
        median_asking_rent=area_median_asking_rent,
        median_asking_vs_in_place_gap_pct=round(statistics.median(gap_pcts), 1) if gap_pcts else None,
        cap_rate_used=_NYC_CAP_RATE,
        expense_ratio_used=_NYC_EXPENSE_RATIO,
        buildings=profiles[:50],
    )


def _demographics_out(demo: CensusDemographics | None) -> DemographicsOut | None:
    if demo is None:
        return None
    return DemographicsOut(
        zip_code=demo.zip_code,
        median_household_income=demo.median_household_income,
        population=demo.population,
        renter_pct=demo.renter_pct,
        census_median_rent=demo.census_median_rent,
        affordability_ceiling=demo.affordability_ceiling,
        affordable_pct=demo.affordable_pct,
        renter_pool_size=demo.renter_pool_size,
    )


def build_insights(lat: float, lng: float, radius_miles: float, trend_data: dict[str, Any] | None = None) -> InsightsResponse:
    """Orchestrate all insight modules into a single response."""
    # 1. Nearby listings (for property list + zip extraction)
    nearby = fetch_nearby_listings_radius(lat, lng, radius_miles, 150)

    # 2. Supplemental query for fees, sqft, availability
    details = _fetch_building_details_in_radius(lat, lng, radius_miles)

    # 3. Extract ZIP for market + census lookups
    zip_code = _extract_zip(nearby.properties)
    if not zip_code and details:
        for d in details:
            z = (d.get("zipcode") or "").strip()
            if len(z) >= 5:
                zip_code = z[:5]
                break

    # 4. Market snapshot — compute directly from detail rows (avoids slow regex ZIP query)
    market = _compute_market_snapshot(details, zip_code)

    # 5. Census demographics
    demographics = None
    if zip_code:
        demographics = fetch_census_demographics(zip_code, area_median_rent=market.median_rent)

    # 6. Rent positioning
    competitors = _compute_rent_positioning(details, market.median_rent)

    # 7. Fee intelligence
    fee_intel = _compute_fee_intelligence(details)

    # 8. Supply pressure
    supply = _compute_supply_pressure(details)

    # 9. Amenity analysis + AI label cleanup
    listing_ids = list({d["listing_id"] for d in details if d.get("listing_id")})
    amenities = _compute_amenity_analysis(listing_ids)
    try:
        from property_manager.ai_insights import clean_amenity_labels
        amenities = clean_amenity_labels(amenities)
    except Exception:
        logger.debug("Amenity label cleanup failed — using raw labels", exc_info=True)

    # 10. NYC Building Financials (PLUTO + DOF assessments)
    building_financials = None
    try:
        from property_manager.nyc_property_data import fetch_pluto_with_assessments

        pluto_buildings = fetch_pluto_with_assessments(lat, lng, radius_miles)
        logger.info("PLUTO returned %d buildings", len(pluto_buildings))
        building_financials = _compute_building_financials(pluto_buildings, market.median_rent)
    except Exception as exc:
        logger.exception("NYC building financials failed: %s", exc)

    # 11. POI
    neighborhood = fetch_poi_nearby(lat, lng)

    # 12. AI narrative summary (cached by data hash)
    demographics_out = _demographics_out(demographics)
    ai_summary = generate_ai_summary(
        market, demographics_out, competitors, fee_intel, supply, amenities,
        building_financials=building_financials,
        trend_data=trend_data,
    )

    return InsightsResponse(
        market=market,
        demographics=demographics_out,
        competitors=competitors,
        fee_intelligence=fee_intel,
        supply_pressure=supply,
        amenities=amenities,
        neighborhood=neighborhood,
        ai_summary=ai_summary,
        building_financials=building_financials,
        center_latitude=lat,
        center_longitude=lng,
        radius_miles=radius_miles,
        generated_at=datetime.now(timezone.utc),
    )


# ── Time-series snapshot archiving ─────────────────────────────────────


def _snapshot_week_monday() -> date:
    """Return Monday of the current ISO week."""
    today = date.today()
    return today - __import__("datetime").timedelta(days=today.weekday())


def _location_key(lat: float, lng: float, radius: float) -> str:
    """Deterministic 32-char hex key for a (lat, lng, radius) triple."""
    raw = f"{round(lat, 5)}|{round(lng, 5)}|{round(radius, 2)}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


_AVAIL_STATUSES = frozenset({
    "available", "available now", "available soon", "vacant",
    "not yet leased", "ready", "open",
})


def archive_snapshots(
    db: Session,
    lat: float,
    lng: float,
    radius_miles: float,
    insights: InsightsResponse,
) -> None:
    """Archive building-level and market-level snapshots for time-series tracking.

    Uses location_key so identical locations from different subscriptions share data.
    UPSERTs so calling multiple times in the same week is idempotent.
    """
    if not _snapshot_tables_ready():
        return

    loc_key = _location_key(lat, lng, radius_miles)
    week = _snapshot_week_monday()

    # Fetch raw unit rows for building-level detail
    detail_rows = _fetch_building_details_in_radius(lat, lng, radius_miles)

    # ── Building-level snapshots ──────────────────────────────────────
    buildings: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for r in detail_rows:
        pid = r.get("property_id") or r.get("address") or "unknown"
        buildings[pid].append(r)

    for pid, units in buildings.items():
        first = units[0]
        rents = [u["rent_price"] for u in units if u.get("rent_price") and u["rent_price"] > 0]
        sqfts = [u["sqft"] for u in units if u.get("sqft") and u["sqft"] > 0]
        beds_set = sorted({int(u["beds"]) for u in units if u.get("beds") is not None})

        med_rent = round(statistics.median(rents), 0) if rents else None
        med_sqft = round(statistics.median(sqfts), 0) if sqfts else None
        rps = round(med_rent / med_sqft, 2) if med_rent and med_sqft else None

        avail_count = sum(
            1 for u in units
            if (u.get("availability_status") or "").strip().lower() in _AVAIL_STATUSES
        )
        beds_str = ", ".join(f"{b} BR" for b in beds_set) if beds_set else ""

        # Collect fees for this building (first unit that has fees)
        fees_snapshot = None
        for u in units:
            raw_fees = u.get("fees")
            if raw_fees and isinstance(raw_fees, str) and raw_fees.strip().startswith("["):
                try:
                    fees_snapshot = json.loads(raw_fees)
                    break
                except (json.JSONDecodeError, TypeError):
                    pass

        # Collect amenities for this building from listing_amenities table
        listing_ids = [u["listing_id"] for u in units if u.get("listing_id")]
        amenities_snapshot = _fetch_building_amenities(listing_ids) if listing_ids else None

        db.execute(
            text("""
                INSERT INTO pm_building_snapshots
                    (id, location_key, snapshot_week, property_id, property_name, address,
                     median_rent, median_sqft, rent_per_sqft, unit_count, available_units,
                     beds_available, fees_json, amenities_json)
                VALUES
                    (gen_random_uuid(), :loc_key, :week, :pid, :pname, :addr,
                     :med_rent, :med_sqft, :rps, :unit_count, :avail,
                     :beds, :fees::jsonb, :amenities::jsonb)
                ON CONFLICT (location_key, snapshot_week, property_id) DO UPDATE SET
                    property_name = EXCLUDED.property_name,
                    address = EXCLUDED.address,
                    median_rent = EXCLUDED.median_rent,
                    median_sqft = EXCLUDED.median_sqft,
                    rent_per_sqft = EXCLUDED.rent_per_sqft,
                    unit_count = EXCLUDED.unit_count,
                    available_units = EXCLUDED.available_units,
                    beds_available = EXCLUDED.beds_available,
                    fees_json = EXCLUDED.fees_json,
                    amenities_json = EXCLUDED.amenities_json,
                    captured_at = now()
            """),
            {
                "loc_key": loc_key,
                "week": week,
                "pid": pid,
                "pname": first.get("property_name") or first.get("address") or "Unknown",
                "addr": first.get("address") or "",
                "med_rent": med_rent,
                "med_sqft": med_sqft,
                "rps": rps,
                "unit_count": len(units),
                "avail": avail_count,
                "beds": beds_str,
                "fees": json.dumps(fees_snapshot) if fees_snapshot else None,
                "amenities": json.dumps(amenities_snapshot) if amenities_snapshot else None,
            },
        )

    # ── Market-level snapshot ─────────────────────────────────────────
    mkt = insights.market
    sp = insights.supply_pressure
    bed_vac = {
        b.beds: {"total": b.total, "available": b.available, "vacancy_pct": b.vacancy_pct}
        for b in (sp.by_bedroom or [])
    } if sp.by_bedroom else None

    db.execute(
        text("""
            INSERT INTO pm_market_snapshots
                (id, location_key, snapshot_week, median_rent, p25_rent, p75_rent,
                 sample_size, vacancy_rate_pct, available_units, total_units,
                 bedroom_vacancy_json, center_latitude, center_longitude, radius_miles)
            VALUES
                (gen_random_uuid(), :loc_key, :week, :med_rent, :p25, :p75,
                 :sample, :vac, :avail, :total,
                 :bed_vac::jsonb, :lat, :lng, :radius)
            ON CONFLICT (location_key, snapshot_week) DO UPDATE SET
                median_rent = EXCLUDED.median_rent,
                p25_rent = EXCLUDED.p25_rent,
                p75_rent = EXCLUDED.p75_rent,
                sample_size = EXCLUDED.sample_size,
                vacancy_rate_pct = EXCLUDED.vacancy_rate_pct,
                available_units = EXCLUDED.available_units,
                total_units = EXCLUDED.total_units,
                bedroom_vacancy_json = EXCLUDED.bedroom_vacancy_json,
                captured_at = now()
        """),
        {
            "loc_key": loc_key,
            "week": week,
            "med_rent": mkt.median_rent,
            "p25": mkt.p25_rent,
            "p75": mkt.p75_rent,
            "sample": mkt.sample_size,
            "vac": sp.vacancy_rate_pct,
            "avail": sp.available_units,
            "total": sp.total_units,
            "bed_vac": json.dumps(bed_vac) if bed_vac else None,
            "lat": lat,
            "lng": lng,
            "radius": radius_miles,
        },
    )

    try:
        db.commit()
    except Exception:
        logger.exception("Failed to archive snapshots for location_key=%s", loc_key)
        db.rollback()


def _fetch_building_amenities(listing_ids: list[str]) -> list[str] | None:
    """Fetch distinct amenities for a set of listing_ids from listing_amenities table."""
    if not listing_ids:
        return None
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("""
                    SELECT DISTINCT normalized_name
                    FROM listing_amenities
                    WHERE listing_id = ANY(:ids) AND normalized_name IS NOT NULL
                    ORDER BY normalized_name
                """),
                {"ids": listing_ids},
            ).fetchall()
            return [r[0] for r in rows] if rows else None
    except Exception:
        logger.debug("Failed to fetch building amenities", exc_info=True)
        return None


# ── Trend queries ──────────────────────────────────────────────────────


def get_market_history(
    lat: float, lng: float, radius: float, weeks: int = 12,
) -> list[MarketSnapshotPoint]:
    """Return market-level snapshots for a location, newest first."""
    if not _snapshot_tables_ready():
        return []
    loc_key = _location_key(lat, lng, radius)
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("""
                    SELECT snapshot_week, median_rent, p25_rent, p75_rent,
                           sample_size, vacancy_rate_pct, available_units, total_units
                    FROM pm_market_snapshots
                    WHERE location_key = :loc_key
                    ORDER BY snapshot_week DESC
                    LIMIT :lim
                """),
                {"loc_key": loc_key, "lim": weeks},
            ).mappings().all()
            return [
                MarketSnapshotPoint(
                    snapshot_week=r["snapshot_week"],
                    median_rent=r["median_rent"],
                    p25_rent=r["p25_rent"],
                    p75_rent=r["p75_rent"],
                    sample_size=r["sample_size"] or 0,
                    vacancy_rate_pct=r["vacancy_rate_pct"],
                    available_units=r["available_units"],
                    total_units=r["total_units"],
                )
                for r in rows
            ]
    except Exception:
        logger.exception("get_market_history failed")
        return []


def get_building_history(
    lat: float, lng: float, radius: float, property_id: str, weeks: int = 12,
) -> BuildingTrendsResponse:
    """Return per-building snapshots for a specific building, newest first."""
    if not _snapshot_tables_ready():
        return BuildingTrendsResponse(property_id=property_id, snapshots=[])
    loc_key = _location_key(lat, lng, radius)
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("""
                    SELECT snapshot_week, property_id, property_name, address,
                           median_rent, rent_per_sqft, unit_count, available_units
                    FROM pm_building_snapshots
                    WHERE location_key = :loc_key AND property_id = :pid
                    ORDER BY snapshot_week DESC
                    LIMIT :lim
                """),
                {"loc_key": loc_key, "pid": property_id, "lim": weeks},
            ).mappings().all()
            snapshots = [
                BuildingSnapshotPoint(
                    snapshot_week=r["snapshot_week"],
                    property_id=r["property_id"],
                    property_name=r["property_name"],
                    address=r["address"],
                    median_rent=r["median_rent"],
                    rent_per_sqft=r["rent_per_sqft"],
                    unit_count=r["unit_count"],
                    available_units=r["available_units"],
                )
                for r in rows
            ]
            name = snapshots[0].property_name if snapshots else None
            return BuildingTrendsResponse(
                property_id=property_id,
                property_name=name,
                snapshots=snapshots,
            )
    except Exception:
        logger.exception("get_building_history failed")
        return BuildingTrendsResponse(property_id=property_id, snapshots=[])


def get_buildings_latest_vs_previous(
    lat: float, lng: float, radius: float,
) -> list[BuildingDelta]:
    """Compare latest and previous week building snapshots to compute deltas."""
    if not _snapshot_tables_ready():
        return []
    loc_key = _location_key(lat, lng, radius)
    try:
        with engine.connect() as conn:
            # Get the two most recent distinct snapshot_weeks
            week_rows = conn.execute(
                text("""
                    SELECT DISTINCT snapshot_week
                    FROM pm_building_snapshots
                    WHERE location_key = :loc_key
                    ORDER BY snapshot_week DESC
                    LIMIT 2
                """),
                {"loc_key": loc_key},
            ).fetchall()
            if not week_rows:
                return []

            latest_week = week_rows[0][0]
            prev_week = week_rows[1][0] if len(week_rows) >= 2 else None

            # Fetch latest week buildings
            latest_rows = conn.execute(
                text("""
                    SELECT property_id, property_name, address, median_rent, available_units
                    FROM pm_building_snapshots
                    WHERE location_key = :loc_key AND snapshot_week = :week
                """),
                {"loc_key": loc_key, "week": latest_week},
            ).mappings().all()

            # Fetch previous week buildings
            prev_map: dict[str, dict] = {}
            if prev_week:
                prev_rows = conn.execute(
                    text("""
                        SELECT property_id, median_rent, available_units
                        FROM pm_building_snapshots
                        WHERE location_key = :loc_key AND snapshot_week = :week
                    """),
                    {"loc_key": loc_key, "week": prev_week},
                ).mappings().all()
                prev_map = {r["property_id"]: dict(r) for r in prev_rows}

            deltas: list[BuildingDelta] = []
            for r in latest_rows:
                pid = r["property_id"]
                prev = prev_map.get(pid)
                cur_rent = r["median_rent"]
                prev_rent = prev["median_rent"] if prev else None

                rent_change: float | None = None
                rent_change_pct: float | None = None
                if cur_rent is not None and prev_rent is not None and prev_rent > 0:
                    rent_change = round(cur_rent - prev_rent, 0)
                    rent_change_pct = round((cur_rent - prev_rent) / prev_rent * 100, 1)

                deltas.append(BuildingDelta(
                    property_id=pid,
                    property_name=r["property_name"],
                    address=r["address"],
                    current_rent=cur_rent,
                    previous_rent=prev_rent,
                    rent_change=rent_change,
                    rent_change_pct=rent_change_pct,
                    current_vacancy=r["available_units"],
                    previous_vacancy=prev["available_units"] if prev else None,
                    is_new=prev is None and prev_week is not None,
                ))

            # Sort by absolute rent change percentage (biggest movers first)
            deltas.sort(key=lambda d: abs(d.rent_change_pct) if d.rent_change_pct is not None else 0, reverse=True)
            return deltas
    except Exception:
        logger.exception("get_buildings_latest_vs_previous failed")
        return []


def _compute_single_delta(current: float | None, previous: float | None) -> MetricDelta | None:
    """Compute a single metric delta."""
    if current is None:
        return None
    if previous is None:
        return MetricDelta(current=current)
    change = round(current - previous, 2)
    change_pct = round(change / previous * 100, 1) if previous != 0 else None
    return MetricDelta(current=current, previous=previous, change=change, change_pct=change_pct)


def compute_market_deltas(snapshots: list[MarketSnapshotPoint]) -> MarketDeltas | None:
    """Compute WoW deltas from the two most recent market snapshots."""
    if len(snapshots) < 2:
        return None
    curr, prev = snapshots[0], snapshots[1]
    return MarketDeltas(
        median_rent=_compute_single_delta(curr.median_rent, prev.median_rent),
        vacancy_rate_pct=_compute_single_delta(curr.vacancy_rate_pct, prev.vacancy_rate_pct),
        sample_size=_compute_single_delta(
            float(curr.sample_size) if curr.sample_size is not None else None,
            float(prev.sample_size) if prev.sample_size is not None else None,
        ),
    )


def get_trends(lat: float, lng: float, radius: float, weeks: int = 12) -> TrendsResponse:
    """Build the full trends response for a location."""
    history = get_market_history(lat, lng, radius, weeks)
    deltas = compute_market_deltas(history) if len(history) >= 2 else None
    building_deltas = get_buildings_latest_vs_previous(lat, lng, radius)
    return TrendsResponse(
        market_history=history,
        market_deltas=deltas,
        building_deltas=building_deltas,
        weeks_of_data=len(history),
    )


def _build_ai_trend_payload(lat: float, lng: float, radius: float) -> dict[str, Any] | None:
    """Build a compact trend summary dict for the AI prompt, or None if insufficient data."""
    history = get_market_history(lat, lng, radius, weeks=4)
    if len(history) < 2:
        return None

    curr, prev = history[0], history[1]
    rent_change_pct: float | None = None
    rent_dir = "stable"
    if curr.median_rent and prev.median_rent and prev.median_rent > 0:
        rent_change_pct = round((curr.median_rent - prev.median_rent) / prev.median_rent * 100, 1)
        if rent_change_pct > 1:
            rent_dir = "rising"
        elif rent_change_pct < -1:
            rent_dir = "falling"

    vac_dir = "stable"
    if curr.vacancy_rate_pct is not None and prev.vacancy_rate_pct is not None:
        vac_diff = curr.vacancy_rate_pct - prev.vacancy_rate_pct
        if vac_diff > 0.5:
            vac_dir = "loosening"
        elif vac_diff < -0.5:
            vac_dir = "tightening"

    # Top building movers
    building_deltas = get_buildings_latest_vs_previous(lat, lng, radius)
    top_movers = [
        {"name": d.property_name or d.address or d.property_id, "rent_change_pct": d.rent_change_pct}
        for d in building_deltas[:5]
        if d.rent_change_pct is not None and abs(d.rent_change_pct) > 1
    ]

    return {
        "weeks_of_data": len(history),
        "rent_direction": rent_dir,
        "rent_change_pct": rent_change_pct,
        "vacancy_direction": vac_dir,
        "recent_rents": [
            {"week": str(h.snapshot_week), "median": h.median_rent}
            for h in history[:4]
        ],
        "top_movers": top_movers,
    }


def archive_snapshots_for_all_subscriptions(db: Session) -> int:
    """Generate PM building + market snapshots for all active report subscriptions.

    Intended to be called post-scrape (e.g. from the weekly pipeline) so that
    fresh listing data is reflected in the snapshot time-series.  UPSERTs are
    idempotent per (location_key, week).
    """
    subs = (
        db.query(PropertyManagerReportSubscriptions)
        .filter(PropertyManagerReportSubscriptions.is_active.is_(True))
        .all()
    )
    if not subs:
        logger.info("archive_snapshots_for_all_subscriptions: no active subscriptions")
        return 0

    count = 0
    for sub in subs:
        lat = float(sub.center_latitude)
        lng = float(sub.center_longitude)
        radius = float(sub.radius_miles)
        try:
            insights = build_insights(lat, lng, radius)
            archive_snapshots(db, lat, lng, radius, insights)
            count += 1
        except Exception:
            logger.exception(
                "Snapshot failed for subscription %s (lat=%s, lng=%s, r=%s)",
                sub.id, lat, lng, radius,
            )
    logger.info("archive_snapshots_for_all_subscriptions: %d/%d succeeded", count, len(subs))
    return count


def cleanup_old_snapshots(db: Session) -> None:
    """Delete snapshots older than 53 weeks."""
    if not _snapshot_tables_ready():
        return
    try:
        db.execute(text("DELETE FROM pm_building_snapshots WHERE captured_at < now() - interval '53 weeks'"))
        db.execute(text("DELETE FROM pm_market_snapshots WHERE captured_at < now() - interval '53 weeks'"))
        db.commit()
    except Exception:
        logger.exception("cleanup_old_snapshots failed")
        db.rollback()
