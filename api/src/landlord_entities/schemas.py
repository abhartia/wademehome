from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field

from buildings.schemas import BuildingPayload, ReviewSummaryPayload


class LandlordEntityAliasPayload(BaseModel):
    id: str
    alias_type: str
    value: str
    source: str
    confidence: Decimal | None
    verified_by_admin: bool


class LandlordEntityDetail(BaseModel):
    id: str
    kind: str
    canonical_name: str
    portfolio_size: int
    avg_rating: Decimal | None
    claimed: bool
    claimed_profile_id: str | None
    head_entity_id: str | None
    aliases: list[LandlordEntityAliasPayload]
    review_count: int
    verified_tenant_review_count: int
    dimension_averages: dict[str, Decimal]


class LandlordPortfolioBuilding(BaseModel):
    building: BuildingPayload
    review_count: int
    avg_rating: Decimal | None
    role: str
    start_date: date
    end_date: date | None


class LandlordPortfolioResponse(BaseModel):
    buildings: list[LandlordPortfolioBuilding]


class LandlordEntityReviewsResponse(BaseModel):
    reviews: list[ReviewSummaryPayload]
    total: int
    limit: int
    offset: int


class LandlordClaimRequest(BaseModel):
    display_name: str | None = None
    company_name: str | None = None
    phone_number: str | None = None
    notes: str | None = None
