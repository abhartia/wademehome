from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from listings.schemas import MarketSnapshotResponse, PoiNearbyResponse


class ReportSubscriptionCreate(BaseModel):
    label: str = Field(min_length=1, max_length=255)
    center_latitude: float = Field(ge=-90, le=90)
    center_longitude: float = Field(ge=-180, le=180)
    radius_miles: float = Field(default=2, gt=0, le=50)
    is_active: bool = True


class ReportSubscriptionUpdate(BaseModel):
    label: str | None = Field(default=None, min_length=1, max_length=255)
    center_latitude: float | None = Field(default=None, ge=-90, le=90)
    center_longitude: float | None = Field(default=None, ge=-180, le=180)
    radius_miles: float | None = Field(default=None, gt=0, le=50)
    is_active: bool | None = None


class ReportSubscriptionResponse(BaseModel):
    id: str
    label: str
    center_latitude: Decimal
    center_longitude: Decimal
    radius_miles: Decimal
    is_active: bool
    last_sent_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReportPreviewRequest(BaseModel):
    center_latitude: float = Field(ge=-90, le=90)
    center_longitude: float = Field(ge=-180, le=180)
    radius_miles: float = Field(default=2, gt=0, le=50)
    limit: int = Field(default=100, ge=1, le=100)


class WeeklySendResponse(BaseModel):
    sent: int
    failed: int


# ── Insights ────────────────────────────────────────────────────────────


class InsightsRequest(BaseModel):
    center_latitude: float = Field(ge=-90, le=90)
    center_longitude: float = Field(ge=-180, le=180)
    radius_miles: float = Field(default=2, gt=0, le=50)


class DemographicsOut(BaseModel):
    zip_code: str
    median_household_income: float | None = None
    population: int | None = None
    renter_pct: float | None = None
    census_median_rent: float | None = None
    affordability_ceiling: float | None = None
    affordable_pct: float | None = None
    renter_pool_size: int | None = None


class CompetitorPosition(BaseModel):
    name: str
    address: str
    unit_count: int
    median_rent: float | None = None
    median_sqft: float | None = None
    rent_per_sqft: float | None = None
    vs_median_pct: float | None = None
    position_label: str = ""
    beds_available: str = ""
    listing_url: str | None = None


class FeeCategoryStats(BaseModel):
    label: str
    fee_type: str = ""
    buildings_charging: int
    pct_buildings: float
    median_amount: float | None = None
    min_amount: float | None = None
    max_amount: float | None = None
    frequency: str = ""


class FeeIntelligence(BaseModel):
    total_buildings_with_fees: int
    fee_categories: list[FeeCategoryStats] = Field(default_factory=list)


class BedroomSupply(BaseModel):
    beds: str
    total: int
    available: int
    vacancy_pct: float


class SupplyPressure(BaseModel):
    total_units: int
    available_units: int
    vacancy_rate_pct: float
    by_bedroom: list[BedroomSupply] = Field(default_factory=list)


class AmenityFrequency(BaseModel):
    amenity: str
    count: int
    pct_of_buildings: float


class AmenityAnalysis(BaseModel):
    total_buildings: int
    standard: list[AmenityFrequency] = Field(default_factory=list)
    differentiators: list[AmenityFrequency] = Field(default_factory=list)
    rare: list[AmenityFrequency] = Field(default_factory=list)


class BuildingFinancialProfile(BaseModel):
    """Financial profile for a single building derived from NYC public records."""

    bbl: str
    address: str
    owner_name: str | None = None
    units_res: int | None = None
    bldg_area_sqft: float | None = None
    num_floors: int | None = None
    year_built: int | None = None
    bldg_class: str | None = None
    zone_dist: str | None = None
    assessed_total: float | None = None
    market_value: float | None = None
    value_per_unit: float | None = None
    value_per_sqft: float | None = None
    estimated_noi: float | None = None
    estimated_gross_income: float | None = None
    estimated_avg_in_place_rent: float | None = None
    asking_vs_in_place_gap_pct: float | None = None


class BuildingFinancials(BaseModel):
    """Aggregate building financial data for a radius, from NYC DOF records."""

    building_count: int = 0
    total_units: int = 0
    median_value_per_unit: float | None = None
    median_value_per_sqft: float | None = None
    median_estimated_in_place_rent: float | None = None
    median_asking_rent: float | None = None
    median_asking_vs_in_place_gap_pct: float | None = None
    cap_rate_used: float | None = None
    expense_ratio_used: float | None = None
    buildings: list[BuildingFinancialProfile] = Field(default_factory=list)


class AiInsightSection(BaseModel):
    title: str
    body: str


class AiSummary(BaseModel):
    headline: str = ""
    sections: list[AiInsightSection] = Field(default_factory=list)


class InsightsResponse(BaseModel):
    market: MarketSnapshotResponse
    demographics: DemographicsOut | None = None
    competitors: list[CompetitorPosition] = Field(default_factory=list)
    fee_intelligence: FeeIntelligence
    supply_pressure: SupplyPressure
    amenities: AmenityAnalysis
    neighborhood: PoiNearbyResponse | None = None
    ai_summary: AiSummary | None = None
    building_financials: BuildingFinancials | None = None
    center_latitude: float
    center_longitude: float
    radius_miles: float
    generated_at: datetime


# ── Trends / time-series ───────────────────────────────────────────────


class MarketSnapshotPoint(BaseModel):
    snapshot_week: date
    median_rent: float | None = None
    p25_rent: float | None = None
    p75_rent: float | None = None
    sample_size: int = 0
    vacancy_rate_pct: float | None = None
    available_units: int | None = None
    total_units: int | None = None


class BuildingSnapshotPoint(BaseModel):
    snapshot_week: date
    property_id: str
    property_name: str | None = None
    address: str | None = None
    median_rent: float | None = None
    rent_per_sqft: float | None = None
    unit_count: int | None = None
    available_units: int | None = None


class BuildingDelta(BaseModel):
    property_id: str
    property_name: str | None = None
    address: str | None = None
    current_rent: float | None = None
    previous_rent: float | None = None
    rent_change: float | None = None
    rent_change_pct: float | None = None
    current_vacancy: int | None = None
    previous_vacancy: int | None = None
    is_new: bool = False


class MetricDelta(BaseModel):
    current: float | None = None
    previous: float | None = None
    change: float | None = None
    change_pct: float | None = None


class MarketDeltas(BaseModel):
    median_rent: MetricDelta | None = None
    vacancy_rate_pct: MetricDelta | None = None
    sample_size: MetricDelta | None = None


class TrendsResponse(BaseModel):
    market_history: list[MarketSnapshotPoint] = Field(default_factory=list)
    market_deltas: MarketDeltas | None = None
    building_deltas: list[BuildingDelta] = Field(default_factory=list)
    weeks_of_data: int = 0


class BuildingTrendsRequest(BaseModel):
    center_latitude: float = Field(ge=-90, le=90)
    center_longitude: float = Field(ge=-180, le=180)
    radius_miles: float = Field(default=2, gt=0, le=50)
    property_id: str
    weeks: int = Field(default=12, ge=1, le=52)


class BuildingTrendsResponse(BaseModel):
    property_id: str
    property_name: str | None = None
    snapshots: list[BuildingSnapshotPoint] = Field(default_factory=list)
