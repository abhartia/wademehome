"""UI event payloads streamed from the home agent workflow to the chat UI.

These extend the existing /listings/chat event vocabulary with cards for
non-search domains (tours, favorites, profile, etc.). Each payload is wrapped
in `llama_index.server.models.ui.UIEvent` and serialized as an `8:` annotation
chunk in the SSE stream, matching the protocol the existing chat UI consumes.
"""
from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from workflow.events import PropertyDataItem


class AgentStepData(BaseModel):
    """Lightweight breadcrumb for the chat UI: which agent is doing what."""

    agent: str
    label: str
    state: Literal["start", "running", "done", "error"] = "running"
    detail: str | None = None


class PropertyResultsData(BaseModel):
    """Search-style listing card embedded inline in the conversation."""

    title: str = "Listings"
    query: str | None = None
    properties: list[PropertyDataItem] = Field(default_factory=list)


class TourCardItem(BaseModel):
    id: str
    property_name: str
    property_address: str
    status: str
    scheduled_date: str = ""
    scheduled_time: str = ""
    image: str = ""
    rent: str = ""
    beds: str = ""


class TourResultsData(BaseModel):
    title: str = "Your tours"
    tours: list[TourCardItem] = Field(default_factory=list)
    empty_message: str | None = None


class FavoriteCardItem(BaseModel):
    property_key: str
    property_name: str
    property_address: str
    created_at: str | None = None


class FavoritesResultsData(BaseModel):
    title: str = "Saved properties"
    favorites: list[FavoriteCardItem] = Field(default_factory=list)
    empty_message: str | None = None


class ProfileSummaryData(BaseModel):
    title: str = "Your renter profile"
    cities: list[str] = Field(default_factory=list)
    move_timeline: str | None = None
    max_monthly_rent: str | None = None
    bedrooms_needed: str | None = None
    has_pets: bool | None = None
    dealbreakers: list[str] = Field(default_factory=list)
    neighbourhood_priorities: list[str] = Field(default_factory=list)
    onboarding_completed: bool = False
    updated_fields: list[str] = Field(default_factory=list)


class NavigationActionData(BaseModel):
    """Chat-side affordance: a button that navigates to a route in the app."""

    title: str
    description: str | None = None
    href: str
    cta: str = "Open"


class GenericResultData(BaseModel):
    """Fallback structured payload — used when no specialized card exists yet."""

    title: str
    body: str | None = None
    fields: dict[str, Any] = Field(default_factory=dict)


# ─────────────────────────────────────────────────────────────────────────────
# Phase 2: roommates / groups / lease / movein / guarantor / buildings
# ─────────────────────────────────────────────────────────────────────────────


class RoommateMatchItem(BaseModel):
    id: str
    name: str
    age: int | None = None
    occupation: str | None = None
    avatar_initials: str = ""
    bio: str | None = None
    target_city: str | None = None
    max_budget: str | None = None
    bedrooms_wanted: str | None = None
    compatibility_score: int | None = None
    compatibility_reasons: list[str] = Field(default_factory=list)


class RoommateMatchesData(BaseModel):
    title: str = "Roommate matches"
    matches: list[RoommateMatchItem] = Field(default_factory=list)
    empty_message: str | None = None


class RoommateConnectionItem(BaseModel):
    id: str
    roommate_name: str
    roommate_initials: str = ""
    last_message: str | None = None
    last_message_time: str | None = None
    connected_at: str | None = None
    message_count: int = 0


class RoommateConnectionsData(BaseModel):
    title: str = "Your roommate connections"
    connections: list[RoommateConnectionItem] = Field(default_factory=list)
    empty_message: str | None = None


class GroupMemberItem(BaseModel):
    user_id: str
    role: str


class GroupInviteItem(BaseModel):
    email: str | None = None
    accept_url: str | None = None
    status: str = "pending"


class GroupSummaryData(BaseModel):
    id: str
    name: str
    role: str
    member_count: int = 0
    members: list[GroupMemberItem] = Field(default_factory=list)
    invites: list[GroupInviteItem] = Field(default_factory=list)
    saved_count: int = 0


class GroupListData(BaseModel):
    title: str = "Your groups"
    groups: list[GroupSummaryData] = Field(default_factory=list)
    empty_message: str | None = None


class LeaseSummaryData(BaseModel):
    title: str = "Your lease"
    has_document: bool = False
    original_filename: str | None = None
    updated_at: str | None = None
    premises_address: str | None = None
    char_count: int = 0


class LeaseAnswerData(BaseModel):
    title: str = "From your lease"
    question: str
    answer: str


class MoveInTaskItem(BaseModel):
    id: str
    category: str
    label: str
    completed: bool = False


class MoveInChecklistData(BaseModel):
    title: str = "Move-in checklist"
    target_address: str | None = None
    move_date: str | None = None
    tasks: list[MoveInTaskItem] = Field(default_factory=list)
    empty_message: str | None = None


class MoveInOrderItem(BaseModel):
    id: str
    vendor_name: str
    plan_name: str | None = None
    category: str
    status: str
    scheduled_date: str | None = None
    monthly_cost: str | None = None


class MoveInOrdersData(BaseModel):
    title: str = "Move-in orders"
    orders: list[MoveInOrderItem] = Field(default_factory=list)
    empty_message: str | None = None


class GuarantorItem(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    relationship: str | None = None


class GuarantorRequestItem(BaseModel):
    id: str
    guarantor_name: str
    guarantor_email: str
    property_name: str | None = None
    property_address: str | None = None
    monthly_rent: str | None = None
    status: str
    verification_status: str | None = None
    invite_url: str | None = None


class GuarantorSummaryData(BaseModel):
    title: str = "Guarantor center"
    saved: list[GuarantorItem] = Field(default_factory=list)
    requests: list[GuarantorRequestItem] = Field(default_factory=list)
    empty_message: str | None = None


class BuildingReviewSnippet(BaseModel):
    id: str
    author: str
    rating: int
    title: str | None = None
    body: str
    verified_tenant: bool = False


class BuildingProfileData(BaseModel):
    id: str
    title: str
    address: str
    city: str | None = None
    state: str | None = None
    landlord_name: str | None = None
    avg_rating: float | None = None
    review_count: int = 0
    hpd_open_count: int = 0
    dob_open_count: int = 0
    recent_reviews: list[BuildingReviewSnippet] = Field(default_factory=list)


class LandlordProfileData(BaseModel):
    id: str
    canonical_name: str
    portfolio_size: int = 0
    avg_rating: float | None = None
    review_count: int = 0
    verified_tenant_review_count: int = 0
    recent_reviews: list[BuildingReviewSnippet] = Field(default_factory=list)
