from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field


class ProfileOut(BaseModel):
    has_current_lease: bool = False
    search_trigger: str | None = None
    trigger_reason: str | None = None
    move_timeline: str | None = None
    current_city: str | None = None
    work_location: str | None = None
    preferred_cities: list[str] = Field(default_factory=list)
    neighbourhood_priorities: list[str] = Field(default_factory=list)
    dealbreakers: list[str] = Field(default_factory=list)
    max_monthly_rent: str | None = None
    credit_score_range: str | None = None
    living_arrangement: str | None = None
    roommate_search_enabled: bool = False
    bedrooms_needed: str | None = None
    has_pets: bool = False
    pet_details: str | None = None
    journey_stage_override: str | None = None
    onboarding_completed: bool = False
    onboarding_step: int = 0
    last_updated: datetime | None = None


class ProfilePatch(BaseModel):
    has_current_lease: bool | None = None
    search_trigger: str | None = None
    trigger_reason: str | None = None
    move_timeline: str | None = None
    current_city: str | None = None
    work_location: str | None = None
    preferred_cities: list[str] | None = None
    neighbourhood_priorities: list[str] | None = None
    dealbreakers: list[str] | None = None
    max_monthly_rent: str | None = None
    credit_score_range: str | None = None
    living_arrangement: str | None = None
    roommate_search_enabled: bool | None = None
    bedrooms_needed: str | None = None
    has_pets: bool | None = None
    pet_details: str | None = None
    journey_stage_override: str | None = None
    onboarding_completed: bool | None = None
    onboarding_step: int | None = None


class TourPropertyPayload(BaseModel):
    id: str
    name: str
    address: str
    rent: str = ""
    beds: str = ""
    image: str = ""
    tags: list[str] = Field(default_factory=list)


class TourNotePayload(BaseModel):
    ratings: dict[str, Any] = Field(default_factory=dict)
    pros: str = ""
    cons: str = ""
    general_notes: str = ""
    would_apply: bool | None = None
    photo_checklist: list[str] = Field(default_factory=list)
    updated_at: str = ""


class TourPayload(BaseModel):
    id: str
    property: TourPropertyPayload
    status: str
    scheduled_date: str = ""
    scheduled_time: str = ""
    note: TourNotePayload | None = None
    created_at: str = ""


class ToursStatePayload(BaseModel):
    tours: list[TourPayload] = Field(default_factory=list)


class SavedGuarantorPayload(BaseModel):
    id: str
    name: str
    email: str
    phone: str = ""
    relationship: str
    created_at: str = ""


class StatusHistoryPayload(BaseModel):
    status: str
    timestamp: str
    note: str = ""


class LeasePayload(BaseModel):
    property_name: str
    property_address: str
    monthly_rent: str
    lease_start: str = ""
    lease_term: str = ""


class GuarantorRequestPayload(BaseModel):
    id: str
    guarantor_id: str
    guarantor_snapshot: dict[str, str] = Field(default_factory=dict)
    lease: LeasePayload
    status: str
    verification_status: str = "pending"
    created_at: str = ""
    sent_at: str = ""
    viewed_at: str = ""
    signed_at: str = ""
    expires_at: str = ""
    status_history: list[StatusHistoryPayload] = Field(default_factory=list)


class GuarantorStatePayload(BaseModel):
    saved_guarantors: list[SavedGuarantorPayload] = Field(default_factory=list)
    requests: list[GuarantorRequestPayload] = Field(default_factory=list)


class MoveInPlanPayload(BaseModel):
    target_address: str = ""
    move_date: str = ""
    move_from_address: str = ""


class VendorOrderPayload(BaseModel):
    id: str
    vendor_id: str = ""
    vendor_name: str = ""
    plan_id: str = ""
    plan_name: str = ""
    category: str
    status: str
    scheduled_date: str = ""
    account_number: str = ""
    notes: str = ""
    monthly_cost: str = ""
    created_at: str = ""


class ChecklistItemPayload(BaseModel):
    id: str
    category: str
    label: str
    completed: bool = False


class MoveInStatePayload(BaseModel):
    plan: MoveInPlanPayload = Field(default_factory=MoveInPlanPayload)
    orders: list[VendorOrderPayload] = Field(default_factory=list)
    checklist: list[ChecklistItemPayload] = Field(default_factory=list)


class MyRoommateProfilePayload(BaseModel):
    sleep_schedule: str = ""
    cleanliness_level: str = ""
    noise_level: str = ""
    guest_policy: str = ""
    smoking: str = ""
    languages_spoken: list[str] = Field(default_factory=list)
    preferred_languages: list[str] = Field(default_factory=list)
    must_have_preferred_languages: bool = False
    interests: list[str] = Field(default_factory=list)
    bio: str = ""
    profile_completed: bool = False


class RoommateMessagePayload(BaseModel):
    role: str
    content: str
    time: str = ""


class RoommateProfilePayload(BaseModel):
    id: str
    name: str = ""
    age: int = 0
    occupation: str = ""
    bio: str = ""
    avatar_initials: str = ""
    sleep_schedule: str = ""
    cleanliness_level: str = ""
    noise_level: str = ""
    guest_policy: str = ""
    smoking: str = ""
    languages_spoken: list[str] = Field(default_factory=list)
    target_city: str = ""
    max_budget: str = ""
    move_timeline: str = ""
    bedrooms_wanted: str = ""
    has_pets: bool = False
    pet_details: str = ""
    interests: list[str] = Field(default_factory=list)
    university: str | None = None
    compatibility_score: int | None = None
    compatibility_reasons: list[str] = Field(default_factory=list)


class RoommateConnectionPayload(BaseModel):
    roommate: RoommateProfilePayload
    connected_at: str = ""
    messages: list[RoommateMessagePayload] = Field(default_factory=list)


class RoommateStatePayload(BaseModel):
    my_profile: MyRoommateProfilePayload = Field(default_factory=MyRoommateProfilePayload)
    connections: list[RoommateConnectionPayload] = Field(default_factory=list)


class LeaseDocumentOut(BaseModel):
    has_document: bool = False
    original_filename: str | None = None
    updated_at: datetime | None = None
