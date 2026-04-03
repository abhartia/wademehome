from __future__ import annotations

import html
import json
import re
import statistics
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session

from auth.emailer import send_property_manager_weekly_report_email
from core.config import Config
from core.logger import get_logger
from db.models import PropertyManagerReportSubscriptions, Users
from listings.router import fetch_nearby_listings_radius, fetch_poi_nearby
from listings.schemas import MarketSnapshotResponse, NearbyListingsResponse, PoiNearbyResponse
from property_manager.ai_insights import generate_ai_summary
from property_manager.census import CensusDemographics, fetch_census_demographics
from property_manager.schemas import (
    AmenityAnalysis,
    AmenityFrequency,
    BedroomSupply,
    BuildingFinancialProfile,
    BuildingFinancials,
    CompetitorPosition,
    DemographicsOut,
    FeeCategoryStats,
    FeeIntelligence,
    InsightsResponse,
    ReportSubscriptionCreate,
    ReportSubscriptionResponse,
    ReportSubscriptionUpdate,
    SupplyPressure,
)
from workflow.utils import engine, listing_table_name, listing_table_schema

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
        parts.append(f'<p style="font-size:13px;"><strong>Supply:</strong> {sp.available_units} of {sp.total_units} units available ({sp.vacancy_rate_pct}% vacancy)</p>')

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


def build_report_html(*, label: str, nearby: NearbyListingsResponse, insights: InsightsResponse | None = None) -> str:
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
    return f"""
    <html><body>
    <h2>Weekly competitive snapshot</h2>
    <p><strong>{html.escape(label)}</strong></p>
    <p>Radius: {nearby.radius_miles} mi &middot; Showing up to {nearby.limit} buildings &middot; \
Total in scope (when available): {nearby.total_in_radius}</p>
    {insights_section}
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

    s_lat = float(sub.center_latitude)
    s_lng = float(sub.center_longitude)
    s_radius = float(sub.radius_miles)
    nearby = fetch_nearby_listings_radius(s_lat, s_lng, s_radius, LISTING_LIMIT_REPORT)
    try:
        insights = build_insights(s_lat, s_lng, s_radius)
    except Exception:
        logger.warning("insights generation failed for subscription %s", sub.id)
        insights = None
    html_body = build_report_html(label=sub.label, nearby=nearby, insights=insights)
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
            try:
                insights = build_insights(s_lat, s_lng, s_radius)
            except Exception:
                logger.warning("insights failed for weekly sub %s", sub.id)
                insights = None
            html_body = build_report_html(label=sub.label, nearby=nearby, insights=insights)
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

    rents_sorted = sorted(rents)
    n = len(rents_sorted)
    p25 = rents_sorted[int(n * 0.25)]
    p50 = rents_sorted[int(n * 0.50)]
    p75 = rents_sorted[int(n * 0.75)]

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


def _compute_supply_pressure(rows: list[dict[str, Any]]) -> SupplyPressure:
    """Compute vacancy proxy from availability_status."""
    total = len(rows)
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
        if is_available:
            available += 1
            bed_available[bed_label] += 1

    by_bedroom: list[BedroomSupply] = []
    for bed_label in sorted(bed_totals.keys()):
        t = bed_totals[bed_label]
        a = bed_available.get(bed_label, 0)
        by_bedroom.append(BedroomSupply(
            beds=bed_label,
            total=t,
            available=a,
            vacancy_pct=round(a / t * 100, 1) if t > 0 else 0,
        ))

    return SupplyPressure(
        total_units=total,
        available_units=available,
        vacancy_rate_pct=round(available / total * 100, 1) if total > 0 else 0,
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


def build_insights(lat: float, lng: float, radius_miles: float) -> InsightsResponse:
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

    # 9. Amenity analysis
    listing_ids = list({d["listing_id"] for d in details if d.get("listing_id")})
    amenities = _compute_amenity_analysis(listing_ids)

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
