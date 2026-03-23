from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class LandlordProfilePayload(BaseModel):
    display_name: str = ""
    company_name: str = ""
    phone_number: str = ""
    verification_status: str = "pending"


class LandlordProfileResponse(BaseModel):
    profile: LandlordProfilePayload


class LandlordProfileUpdate(BaseModel):
    display_name: str | None = None
    company_name: str | None = None
    phone_number: str | None = None


class LandlordPropertyBase(BaseModel):
    title: str
    description: str = ""
    street_line1: str
    street_line2: str = ""
    city: str
    state: str
    postal_code: str
    country: str = "US"
    amenities: list[str] = Field(default_factory=list)


class LandlordPropertyCreate(LandlordPropertyBase):
    pass


class LandlordPropertyUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    street_line1: str | None = None
    street_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    amenities: list[str] | None = None


class LandlordPropertyPayload(LandlordPropertyBase):
    id: str
    publish_status: str
    created_at: str
    updated_at: str


class LandlordPropertiesResponse(BaseModel):
    properties: list[LandlordPropertyPayload] = Field(default_factory=list)


class LandlordPropertyResponse(BaseModel):
    property: LandlordPropertyPayload


class LandlordMediaPayload(BaseModel):
    id: str
    media_url: str
    media_type: str
    caption: str = ""
    sort_order: int


class LandlordMediaCreate(BaseModel):
    media_url: str
    media_type: str = "image"
    caption: str = ""
    sort_order: int = 0


class LandlordMediaUpdate(BaseModel):
    media_url: str | None = None
    media_type: str | None = None
    caption: str | None = None
    sort_order: int | None = None


class LandlordMediaResponse(BaseModel):
    media: list[LandlordMediaPayload] = Field(default_factory=list)


class LandlordUnitBase(BaseModel):
    label: str
    bedrooms: int = 0
    bathrooms: Decimal = Decimal("1.0")
    square_feet: int | None = None
    monthly_rent: Decimal
    security_deposit: Decimal | None = None
    lease_term_months: int | None = None
    available_on: date | None = None
    is_available: bool = True


class LandlordUnitCreate(LandlordUnitBase):
    pass


class LandlordUnitUpdate(BaseModel):
    label: str | None = None
    bedrooms: int | None = None
    bathrooms: Decimal | None = None
    square_feet: int | None = None
    monthly_rent: Decimal | None = None
    security_deposit: Decimal | None = None
    lease_term_months: int | None = None
    available_on: date | None = None
    is_available: bool | None = None


class LandlordUnitPayload(LandlordUnitBase):
    id: str


class LandlordUnitsResponse(BaseModel):
    units: list[LandlordUnitPayload] = Field(default_factory=list)


class LandlordLeadCreate(BaseModel):
    property_id: str
    unit_id: str | None = None
    name: str
    email: str
    phone: str = ""
    message: str = ""
    source: str = "platform"


class LandlordLeadUpdate(BaseModel):
    status: str | None = None
    message: str | None = None


class LandlordLeadPayload(BaseModel):
    id: str
    property_id: str
    unit_id: str | None = None
    name: str
    email: str
    phone: str = ""
    message: str = ""
    source: str = "platform"
    status: str
    created_at: str


class LandlordLeadsResponse(BaseModel):
    leads: list[LandlordLeadPayload] = Field(default_factory=list)


class LandlordTourSlotCreate(BaseModel):
    property_id: str
    unit_id: str
    start_time: datetime
    end_time: datetime
    is_blocked: bool = False


class LandlordTourSlotUpdate(BaseModel):
    start_time: datetime | None = None
    end_time: datetime | None = None
    is_blocked: bool | None = None


class LandlordTourSlotPayload(BaseModel):
    id: str
    property_id: str
    unit_id: str
    start_time: datetime
    end_time: datetime
    is_blocked: bool


class LandlordTourSlotsResponse(BaseModel):
    slots: list[LandlordTourSlotPayload] = Field(default_factory=list)


class LandlordTourBookingCreate(BaseModel):
    slot_id: str
    lead_id: str | None = None
    guest_name: str
    guest_email: str
    notes: str = ""


class LandlordTourBookingUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None


class LandlordTourBookingPayload(BaseModel):
    id: str
    slot_id: str
    lead_id: str | None = None
    guest_name: str
    guest_email: str
    status: str
    notes: str = ""
    created_at: str


class LandlordTourBookingsResponse(BaseModel):
    bookings: list[LandlordTourBookingPayload] = Field(default_factory=list)


class LandlordApplicationCreate(BaseModel):
    property_id: str
    unit_id: str | None = None
    lead_id: str | None = None
    applicant_name: str
    applicant_email: str
    annual_income: Decimal | None = None
    credit_score: int | None = None
    notes: str = ""


class LandlordApplicationUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None


class LandlordApplicationPayload(BaseModel):
    id: str
    property_id: str
    unit_id: str | None = None
    lead_id: str | None = None
    applicant_name: str
    applicant_email: str
    annual_income: Decimal | None = None
    credit_score: int | None = None
    status: str
    notes: str = ""
    created_at: str


class LandlordApplicationsResponse(BaseModel):
    applications: list[LandlordApplicationPayload] = Field(default_factory=list)


class LandlordApplicationDocumentCreate(BaseModel):
    file_name: str
    file_url: str
    file_type: str


class LandlordApplicationDocumentPayload(BaseModel):
    id: str
    application_id: str
    file_name: str
    file_url: str
    file_type: str
    created_at: str


class LandlordApplicationDocumentsResponse(BaseModel):
    documents: list[LandlordApplicationDocumentPayload] = Field(default_factory=list)


class LandlordLeaseOfferCreate(BaseModel):
    property_id: str
    unit_id: str | None = None
    application_id: str | None = None
    tenant_name: str
    tenant_email: str
    monthly_rent: Decimal
    lease_start: date
    lease_end: date
    terms_text: str


class LandlordLeaseOfferAction(BaseModel):
    action: Literal["send", "counter", "accept", "decline"]


class LandlordLeaseOfferPayload(BaseModel):
    id: str
    property_id: str
    unit_id: str | None = None
    application_id: str | None = None
    tenant_name: str
    tenant_email: str
    monthly_rent: Decimal
    lease_start: date
    lease_end: date
    terms_text: str
    status: str
    created_at: str


class LandlordLeaseOffersResponse(BaseModel):
    lease_offers: list[LandlordLeaseOfferPayload] = Field(default_factory=list)


class LandlordLeaseSignatureCreate(BaseModel):
    signer_role: str
    signer_name: str
    signer_email: str


class LandlordLeaseSignatureUpdate(BaseModel):
    status: str | None = None


class LandlordLeaseSignaturePayload(BaseModel):
    id: str
    lease_offer_id: str
    signer_role: str
    signer_name: str
    signer_email: str
    status: str
    signed_at: str | None = None


class LandlordLeaseSignaturesResponse(BaseModel):
    signatures: list[LandlordLeaseSignaturePayload] = Field(default_factory=list)
