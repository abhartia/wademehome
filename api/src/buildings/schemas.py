from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class BuildingResolveRequest(BaseModel):
    """Lookup-or-create a building by address + lat/lng.

    BBL/BIN is optional (filled in later by the Geosupport ingest job). A client
    calling this endpoint with just an address and Mapbox-geocoded lat/lng is
    enough to give us a canonical building row for review attribution.
    """

    street_line1: str
    city: str = "New York"
    state: str = "NY"
    postal_code: str | None = None
    latitude: Decimal
    longitude: Decimal
    bbl: str | None = None
    bin: str | None = None


class BuildingPayload(BaseModel):
    id: str
    bbl: str | None
    bin: str | None
    borough: int | None
    street_line1: str
    city: str
    state: str
    postal_code: str | None
    latitude: Decimal
    longitude: Decimal
    normalized_addr: str
    unit_count: int | None


class BuildingResolveResponse(BaseModel):
    building: BuildingPayload
    is_new: bool


class LandlordEntitySummary(BaseModel):
    id: str
    kind: str
    canonical_name: str
    portfolio_size_cached: int
    avg_rating_cached: Decimal | None
    claimed: bool


class BuildingAggregates(BaseModel):
    review_count: int
    avg_overall_rating: Decimal | None
    verified_tenant_review_count: int
    dimension_averages: dict[str, Decimal]


class BuildingDetailResponse(BaseModel):
    building: BuildingPayload
    current_owner: LandlordEntitySummary | None
    current_manager: LandlordEntitySummary | None
    aggregates: BuildingAggregates


class OwnershipPeriodPayload(BaseModel):
    id: str
    landlord_entity: LandlordEntitySummary
    role: str
    start_date: date
    end_date: date | None
    source: str
    confidence: Decimal | None


class OwnershipHistoryResponse(BaseModel):
    periods: list[OwnershipPeriodPayload]


class HpdViolationPayload(BaseModel):
    violation_id: str
    violation_class: str | None
    status: str | None
    novissued_date: date | None
    certified_date: date | None
    apartment: str | None
    description: str | None


class HpdViolationsResponse(BaseModel):
    violations: list[HpdViolationPayload]
    total: int


class DobComplaintPayload(BaseModel):
    complaint_number: str
    category: str | None
    status: str | None
    date_entered: date | None
    resolution: str | None


class DobComplaintsResponse(BaseModel):
    complaints: list[DobComplaintPayload]
    total: int


class ReviewSummaryPayload(BaseModel):
    id: str
    author_display_name: str
    overall_rating: int
    title: str | None
    body: str
    tenancy_start: date
    tenancy_end: date | None
    verified_tenant: bool
    landlord_relation: str
    landlord_entity_id: str
    landlord_entity_name: str
    subratings: dict[str, int]
    response_body: str | None
    created_at: datetime


class BuildingReviewsResponse(BaseModel):
    reviews: list[ReviewSummaryPayload]
    total: int
    limit: int
    offset: int
