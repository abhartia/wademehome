import uuid
from datetime import date, datetime, time
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Enum as SQLEnum,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    Time,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class UserRole(str, Enum):
    user = "user"
    admin = "admin"
    landlord = "landlord"
    property_manager = "property_manager"


class JourneyStage(str, Enum):
    searching = "searching"
    touring = "touring"
    applying = "applying"
    lease_signed = "lease-signed"
    moving = "moving"
    moved_in = "moved-in"


class TourStatus(str, Enum):
    saved = "saved"
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"


class GuarantorRequestStatus(str, Enum):
    draft = "draft"
    invited = "invited"
    opened = "opened"
    consented = "consented"
    signed = "signed"
    submitted = "submitted"
    verified = "verified"
    failed = "failed"
    expired = "expired"
    declined = "declined"
    revoked = "revoked"


class GuarantorVerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    failed = "failed"


class VendorOrderStatus(str, Enum):
    researching = "researching"
    requested = "requested"
    confirmed = "confirmed"
    active = "active"
    cancelled = "cancelled"


class RoommateConnectionStatus(str, Enum):
    requested = "requested"
    connected = "connected"
    archived = "archived"


class LandlordVerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class LandlordPublishStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class LandlordLeadStatus(str, Enum):
    new = "new"
    contacted = "contacted"
    toured = "toured"
    applied = "applied"
    leased = "leased"
    closed = "closed"


class LandlordTourBookingStatus(str, Enum):
    requested = "requested"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class LandlordApplicationStatus(str, Enum):
    submitted = "submitted"
    under_review = "under_review"
    approved = "approved"
    denied = "denied"
    withdrawn = "withdrawn"


class LandlordLeaseOfferStatus(str, Enum):
    draft = "draft"
    sent = "sent"
    countered = "countered"
    accepted = "accepted"
    declined = "declined"
    expired = "expired"


class LandlordSignatureStatus(str, Enum):
    pending = "pending"
    signed = "signed"
    declined = "declined"


class Users(Base):
    __tablename__ = "users"
    __table_args__ = (
        Index("ix_users_email_verification_token_hash", "email_verification_token_hash"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role"), nullable=False, default=UserRole.user
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    email_verification_token_hash: Mapped[str | None] = mapped_column(String(128))
    email_verification_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    profile: Mapped["UserProfiles"] = relationship(back_populates="user", uselist=False)
    tours: Mapped[list["UserTours"]] = relationship(back_populates="user")
    guarantors: Mapped[list["UserGuarantors"]] = relationship(back_populates="user")
    guarantor_requests: Mapped[list["GuarantorRequests"]] = relationship(back_populates="user")
    movein_plans: Mapped[list["UserMoveinPlans"]] = relationship(back_populates="user")
    checklist_items: Mapped[list["UserChecklistItems"]] = relationship(back_populates="user")
    roommate_profile: Mapped["RoommateProfiles"] = relationship(
        back_populates="user", uselist=False
    )
    roommate_connections: Mapped[list["RoommateConnections"]] = relationship(
        back_populates="user"
    )
    sessions: Mapped[list["UserSessions"]] = relationship(back_populates="user")
    magic_link_tokens: Mapped[list["MagicLinkTokens"]] = relationship(back_populates="user")
    property_favorites: Mapped[list["PropertyFavorites"]] = relationship(
        back_populates="user"
    )
    property_notes: Mapped[list["PropertyNotes"]] = relationship(back_populates="user")
    lease_document: Mapped["UserLeaseDocuments | None"] = relationship(
        back_populates="user", uselist=False
    )
    landlord_profile: Mapped["LandlordProfiles | None"] = relationship(
        back_populates="user", uselist=False
    )
    landlord_properties: Mapped[list["LandlordProperties"]] = relationship(
        back_populates="owner"
    )
    property_manager_report_subscriptions: Mapped[list["PropertyManagerReportSubscriptions"]] = (
        relationship(back_populates="user")
    )


class PropertyManagerReportSubscriptions(Base):
    """Weekly competitive-set email opt-in for property_manager users."""

    __tablename__ = "property_manager_report_subscriptions"
    __table_args__ = (
        UniqueConstraint("user_id", "label", name="uq_pm_report_sub_user_label"),
        Index("ix_pm_report_sub_user_id", "user_id"),
        Index("ix_pm_report_sub_active", "is_active"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    center_latitude: Mapped[Decimal] = mapped_column(Numeric(10, 7), nullable=False)
    center_longitude: Mapped[Decimal] = mapped_column(Numeric(11, 7), nullable=False)
    radius_miles: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False, default=Decimal("2"))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="property_manager_report_subscriptions")


class PmBuildingSnapshots(Base):
    """Per-building weekly snapshots for time-series tracking, shared by location."""

    __tablename__ = "pm_building_snapshots"
    __table_args__ = (
        UniqueConstraint("location_key", "snapshot_week", "property_id", name="uq_pm_bldg_snap_loc_week_pid"),
        Index("ix_pm_bldg_snap_loc_pid_week", "location_key", "property_id", "snapshot_week"),
        Index("ix_pm_bldg_snap_loc_week", "location_key", "snapshot_week"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_key: Mapped[str] = mapped_column(String(64), nullable=False)
    snapshot_week: Mapped[date] = mapped_column(Date, nullable=False)
    property_id: Mapped[str] = mapped_column(String(255), nullable=False)
    property_name: Mapped[str | None] = mapped_column(String(500))
    address: Mapped[str | None] = mapped_column(String(500))
    median_rent: Mapped[float | None] = mapped_column(Float)
    median_sqft: Mapped[float | None] = mapped_column(Float)
    rent_per_sqft: Mapped[float | None] = mapped_column(Float)
    unit_count: Mapped[int | None] = mapped_column(Integer)
    available_units: Mapped[int | None] = mapped_column(Integer)
    beds_available: Mapped[str | None] = mapped_column(String(100))
    fees_json: Mapped[dict | None] = mapped_column(JSONB)
    amenities_json: Mapped[list | None] = mapped_column(JSONB)
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class PmMarketSnapshots(Base):
    """Area-level weekly market aggregates for time-series tracking, shared by location."""

    __tablename__ = "pm_market_snapshots"
    __table_args__ = (
        UniqueConstraint("location_key", "snapshot_week", name="uq_pm_mkt_snap_loc_week"),
        Index("ix_pm_mkt_snap_loc_week", "location_key", "snapshot_week"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_key: Mapped[str] = mapped_column(String(64), nullable=False)
    snapshot_week: Mapped[date] = mapped_column(Date, nullable=False)
    median_rent: Mapped[float | None] = mapped_column(Float)
    p25_rent: Mapped[float | None] = mapped_column(Float)
    p75_rent: Mapped[float | None] = mapped_column(Float)
    sample_size: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    vacancy_rate_pct: Mapped[float | None] = mapped_column(Float)
    available_units: Mapped[int | None] = mapped_column(Integer)
    total_units: Mapped[int | None] = mapped_column(Integer)
    bedroom_vacancy_json: Mapped[dict | None] = mapped_column(JSONB)
    center_latitude: Mapped[Decimal] = mapped_column(Numeric(10, 7), nullable=False)
    center_longitude: Mapped[Decimal] = mapped_column(Numeric(11, 7), nullable=False)
    radius_miles: Mapped[Decimal] = mapped_column(Numeric(6, 2), nullable=False)
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class UserSessions(Base):
    __tablename__ = "user_sessions"
    __table_args__ = (
        Index("ix_user_sessions_user_id", "user_id"),
        Index("ix_user_sessions_expires_at", "expires_at"),
        UniqueConstraint("token_hash", name="uq_user_sessions_token_hash"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped["Users"] = relationship(back_populates="sessions")


class MagicLinkTokens(Base):
    __tablename__ = "magic_link_tokens"
    __table_args__ = (
        Index("ix_magic_link_tokens_email", "email"),
        Index("ix_magic_link_tokens_expires_at", "expires_at"),
        UniqueConstraint("token_hash", name="uq_magic_link_tokens_token_hash"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE")
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["Users | None"] = relationship(back_populates="magic_link_tokens")


class UserProfiles(Base):
    __tablename__ = "user_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_user_profiles_user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    search_trigger: Mapped[str | None] = mapped_column(String(32))
    trigger_reason: Mapped[str | None] = mapped_column(Text)
    move_timeline: Mapped[str | None] = mapped_column(String(128))
    current_city: Mapped[str | None] = mapped_column(String(128))
    work_location: Mapped[str | None] = mapped_column(String(128))
    preferred_cities: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    neighbourhood_priorities: Mapped[list[str]] = mapped_column(
        JSON, nullable=False, default=list
    )
    dealbreakers: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    max_monthly_rent: Mapped[str | None] = mapped_column(String(64))
    credit_score_range: Mapped[str | None] = mapped_column(String(64))
    living_arrangement: Mapped[str | None] = mapped_column(String(32))
    roommate_search_enabled: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    has_current_lease: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    bedrooms_needed: Mapped[str | None] = mapped_column(String(32))
    has_pets: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    pet_details: Mapped[str | None] = mapped_column(Text)
    journey_stage_override: Mapped[JourneyStage | None] = mapped_column(
        SQLEnum(JourneyStage, name="journey_stage")
    )
    onboarding_completed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    onboarding_step: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="profile")


class UserTours(Base):
    __tablename__ = "user_tours"
    __table_args__ = (
        Index("ix_user_tours_user_id", "user_id"),
        Index("ix_user_tours_user_status_date", "user_id", "status", "tour_date"),
        Index("ix_user_tours_user_created_at", "user_id", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_ref_id: Mapped[str | None] = mapped_column(String(128))
    property_name: Mapped[str] = mapped_column(String(255), nullable=False)
    property_address: Mapped[str] = mapped_column(String(255), nullable=False)
    property_image: Mapped[str | None] = mapped_column(Text)
    property_price: Mapped[str | None] = mapped_column(String(64))
    property_beds: Mapped[str | None] = mapped_column(String(64))
    property_tags: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    status: Mapped[TourStatus] = mapped_column(
        SQLEnum(TourStatus, name="tour_status"), nullable=False, default=TourStatus.saved
    )
    tour_date: Mapped[date | None] = mapped_column(Date)
    tour_time: Mapped[time | None] = mapped_column(Time(timezone=False))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="tours")
    notes: Mapped[list["TourNotes"]] = relationship(
        back_populates="tour",
        passive_deletes=True,
    )


class PropertyFavorites(Base):
    __tablename__ = "property_favorites"
    __table_args__ = (
        Index("ix_property_favorites_user_id", "user_id"),
        UniqueConstraint("user_id", "property_key", name="uq_property_favorites_user_property"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_key: Mapped[str] = mapped_column(String(255), nullable=False)
    property_name: Mapped[str] = mapped_column(String(255), nullable=False)
    property_address: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["Users"] = relationship(back_populates="property_favorites")


class PropertyNotes(Base):
    __tablename__ = "property_notes"
    __table_args__ = (
        Index("ix_property_notes_user_id", "user_id"),
        UniqueConstraint("user_id", "property_key", name="uq_property_notes_user_property"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_key: Mapped[str] = mapped_column(String(255), nullable=False)
    note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="property_notes")


class TourNotes(Base):
    __tablename__ = "tour_notes"
    __table_args__ = (
        Index("ix_tour_notes_tour_id", "tour_id"),
        UniqueConstraint("tour_id", name="uq_tour_notes_tour_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tour_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_tours.id", ondelete="CASCADE"), nullable=False
    )
    ratings_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    pros: Mapped[str | None] = mapped_column(Text)
    cons: Mapped[str | None] = mapped_column(Text)
    general_notes: Mapped[str | None] = mapped_column(Text)
    would_apply: Mapped[bool | None] = mapped_column(Boolean)
    photo_checklist_json: Mapped[list[str]] = mapped_column(
        JSON, nullable=False, default=list
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    tour: Mapped["UserTours"] = relationship(back_populates="notes")


class UserGuarantors(Base):
    __tablename__ = "user_guarantors"
    __table_args__ = (Index("ix_user_guarantors_user_id", "user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(64), nullable=False)
    relationship_type: Mapped[str] = mapped_column("relationship", String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="guarantors")
    requests: Mapped[list["GuarantorRequests"]] = relationship(back_populates="guarantor")


class GuarantorRequests(Base):
    __tablename__ = "guarantor_requests"
    __table_args__ = (
        Index("ix_guarantor_requests_user_id", "user_id"),
        Index("ix_guarantor_requests_guarantor_id", "guarantor_id"),
        Index(
            "ix_guarantor_requests_user_status_created",
            "user_id",
            "status",
            "created_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    guarantor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user_guarantors.id", ondelete="SET NULL")
    )
    guarantor_snapshot_name: Mapped[str] = mapped_column(String(255), nullable=False)
    guarantor_snapshot_email: Mapped[str] = mapped_column(String(255), nullable=False)
    lease_property_name: Mapped[str] = mapped_column(String(255), nullable=False)
    lease_property_address: Mapped[str] = mapped_column(String(255), nullable=False)
    lease_monthly_rent: Mapped[str] = mapped_column(String(64), nullable=False)
    lease_start: Mapped[date | None] = mapped_column(Date)
    lease_term: Mapped[str | None] = mapped_column(String(64))
    status: Mapped[GuarantorRequestStatus] = mapped_column(
        SQLEnum(GuarantorRequestStatus, name="guarantor_request_status"),
        nullable=False,
        default=GuarantorRequestStatus.draft,
    )
    verification_status: Mapped[GuarantorVerificationStatus] = mapped_column(
        SQLEnum(GuarantorVerificationStatus, name="guarantor_verification_status"),
        nullable=False,
        default=GuarantorVerificationStatus.pending,
    )
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    viewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="guarantor_requests")
    guarantor: Mapped["UserGuarantors"] = relationship(back_populates="requests")
    signing_events: Mapped[list["GuarantorSigningEvents"]] = relationship(
        back_populates="request", cascade="all, delete-orphan"
    )
    invite_tokens: Mapped[list["GuarantorInviteTokens"]] = relationship(
        back_populates="request", cascade="all, delete-orphan"
    )
    signatures: Mapped[list["GuarantorSignatures"]] = relationship(
        back_populates="request", cascade="all, delete-orphan"
    )
    documents: Mapped[list["GuarantorDocuments"]] = relationship(
        back_populates="request", cascade="all, delete-orphan"
    )


class GuarantorInviteTokens(Base):
    __tablename__ = "guarantor_invite_tokens"
    __table_args__ = (
        Index("ix_guarantor_invite_tokens_request_id", "request_id"),
        Index("ix_guarantor_invite_tokens_expires_at", "expires_at"),
        UniqueConstraint("token_hash", name="uq_guarantor_invite_tokens_token_hash"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("guarantor_requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    token_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    request: Mapped["GuarantorRequests"] = relationship(back_populates="invite_tokens")


class GuarantorSigningEvents(Base):
    __tablename__ = "guarantor_signing_events"
    __table_args__ = (
        Index("ix_guarantor_signing_events_request_id", "request_id"),
        Index("ix_guarantor_signing_events_created_at", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("guarantor_requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    actor: Mapped[str] = mapped_column(String(32), nullable=False)
    actor_ref_id: Mapped[str | None] = mapped_column(String(128))
    ip_address: Mapped[str | None] = mapped_column(String(64))
    user_agent: Mapped[str | None] = mapped_column(String(512))
    payload_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    request: Mapped["GuarantorRequests"] = relationship(back_populates="signing_events")


class GuarantorSignatures(Base):
    __tablename__ = "guarantor_signatures"
    __table_args__ = (
        Index("ix_guarantor_signatures_request_id", "request_id"),
        Index("ix_guarantor_signatures_signed_at", "signed_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("guarantor_requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    signer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    signer_email: Mapped[str] = mapped_column(String(255), nullable=False)
    signature_text: Mapped[str] = mapped_column(Text, nullable=False)
    consent_text_version: Mapped[str] = mapped_column(String(64), nullable=False)
    signed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    request: Mapped["GuarantorRequests"] = relationship(back_populates="signatures")


class GuarantorDocuments(Base):
    __tablename__ = "guarantor_documents"
    __table_args__ = (
        Index("ix_guarantor_documents_request_id", "request_id"),
        Index("ix_guarantor_documents_uploaded_at", "uploaded_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("guarantor_requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    document_type: Mapped[str] = mapped_column(String(64), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(128), nullable=False)
    byte_size: Mapped[int] = mapped_column(Integer, nullable=False)
    storage_key: Mapped[str] = mapped_column(String(512), nullable=False)
    metadata_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    request: Mapped["GuarantorRequests"] = relationship(back_populates="documents")


class UserMoveinPlans(Base):
    __tablename__ = "user_movein_plans"
    __table_args__ = (Index("ix_user_movein_plans_user_id", "user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    target_address: Mapped[str] = mapped_column(String(255), nullable=False)
    target_state: Mapped[str | None] = mapped_column(String(2), nullable=True)
    move_date: Mapped[date | None] = mapped_column(Date)
    move_from_address: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="movein_plans")
    vendor_orders: Mapped[list["UserVendorOrders"]] = relationship(back_populates="movein_plan")
    checklist_items: Mapped[list["UserChecklistItems"]] = relationship(back_populates="movein_plan")
    photo_rooms: Mapped[list["UserMoveinPhotoRooms"]] = relationship(
        back_populates="plan", cascade="all, delete-orphan"
    )


class UserVendorOrders(Base):
    __tablename__ = "user_vendor_orders"
    __table_args__ = (
        Index("ix_user_vendor_orders_movein_plan_id", "movein_plan_id"),
        Index("ix_user_vendor_orders_movein_plan_status", "movein_plan_id", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    movein_plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user_movein_plans.id", ondelete="CASCADE"),
        nullable=False,
    )
    vendor_id: Mapped[str | None] = mapped_column(String(128))
    vendor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    plan_id: Mapped[str | None] = mapped_column(String(128))
    plan_name: Mapped[str | None] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[VendorOrderStatus] = mapped_column(
        SQLEnum(VendorOrderStatus, name="vendor_order_status"),
        nullable=False,
        default=VendorOrderStatus.researching,
    )
    scheduled_date: Mapped[date | None] = mapped_column(Date)
    account_number: Mapped[str | None] = mapped_column(String(128))
    notes: Mapped[str | None] = mapped_column(Text)
    monthly_cost: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    movein_plan: Mapped["UserMoveinPlans"] = relationship(back_populates="vendor_orders")


class UserChecklistItems(Base):
    __tablename__ = "user_checklist_items"
    __table_args__ = (
        Index("ix_user_checklist_items_user_id", "user_id"),
        Index("ix_user_checklist_items_movein_plan_id", "movein_plan_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    movein_plan_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user_movein_plans.id", ondelete="CASCADE"),
    )
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="checklist_items")
    movein_plan: Mapped["UserMoveinPlans"] = relationship(back_populates="checklist_items")


class UserMoveinPhotoRooms(Base):
    __tablename__ = "user_movein_photo_rooms"
    __table_args__ = (Index("ix_user_movein_photo_rooms_movein_plan_id", "movein_plan_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    movein_plan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user_movein_plans.id", ondelete="CASCADE"),
        nullable=False,
    )
    room_type: Mapped[str] = mapped_column(String(64), nullable=False)
    room_label: Mapped[str] = mapped_column(String(128), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    plan: Mapped["UserMoveinPlans"] = relationship(back_populates="photo_rooms")
    photos: Mapped[list["UserMoveinPhotos"]] = relationship(
        back_populates="room", cascade="all, delete-orphan"
    )


class UserMoveinPhotos(Base):
    __tablename__ = "user_movein_photos"
    __table_args__ = (Index("ix_user_movein_photos_room_id", "room_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    room_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user_movein_photo_rooms.id", ondelete="CASCADE"),
        nullable=False,
    )
    photo_url: Mapped[str] = mapped_column(Text, nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(Text)
    note: Mapped[str | None] = mapped_column(Text)
    captured_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    latitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7))
    longitude: Mapped[Decimal | None] = mapped_column(Numeric(10, 7))
    file_size_bytes: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    room: Mapped["UserMoveinPhotoRooms"] = relationship(back_populates="photos")


class RoommateProfiles(Base):
    __tablename__ = "roommate_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_roommate_profiles_user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str | None] = mapped_column(String(255))
    age: Mapped[int | None] = mapped_column(Integer)
    occupation: Mapped[str | None] = mapped_column(String(255))
    sleep_schedule: Mapped[str | None] = mapped_column(String(64))
    cleanliness_level: Mapped[str | None] = mapped_column(String(64))
    noise_level: Mapped[str | None] = mapped_column(String(64))
    guest_policy: Mapped[str | None] = mapped_column(String(64))
    smoking: Mapped[str | None] = mapped_column(String(64))
    languages_spoken: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    preferred_languages: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    must_have_preferred_languages: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    interests: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    bio: Mapped[str | None] = mapped_column(Text)
    profile_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="roommate_profile")


class RoommateConnections(Base):
    __tablename__ = "roommate_connections"
    __table_args__ = (Index("ix_roommate_connections_user_id", "user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    roommate_ref_id: Mapped[str] = mapped_column(String(128), nullable=False)
    roommate_name: Mapped[str | None] = mapped_column(String(255))
    roommate_snapshot_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    compatibility_score: Mapped[int | None] = mapped_column(Integer)
    compatibility_reasons: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    status: Mapped[RoommateConnectionStatus] = mapped_column(
        SQLEnum(RoommateConnectionStatus, name="roommate_connection_status"),
        nullable=False,
        default=RoommateConnectionStatus.connected,
    )
    connected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    user: Mapped["Users"] = relationship(back_populates="roommate_connections")
    messages: Mapped[list["RoommateMessages"]] = relationship(back_populates="connection")


class RoommateMessages(Base):
    __tablename__ = "roommate_messages"
    __table_args__ = (
        Index("ix_roommate_messages_connection_id", "connection_id"),
        Index(
            "ix_roommate_messages_connection_created",
            "connection_id",
            "created_at",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    connection_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("roommate_connections.id", ondelete="CASCADE"),
        nullable=False,
    )
    sender_role: Mapped[str] = mapped_column(String(32), nullable=False)
    sender_ref_id: Mapped[str | None] = mapped_column(String(128))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    connection: Mapped["RoommateConnections"] = relationship(back_populates="messages")


class VendorCatalog(Base):
    __tablename__ = "vendor_catalog"
    __table_args__ = (
        Index("ix_vendor_catalog_category", "category"),
        UniqueConstraint("vendor_key", name="uq_vendor_catalog_vendor_key"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    vendor_key: Mapped[str] = mapped_column(String(128), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    initials: Mapped[str] = mapped_column(String(8), nullable=False)
    rating: Mapped[Decimal | None] = mapped_column(Numeric(3, 1), nullable=True)
    review_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(64))
    website: Mapped[str | None] = mapped_column(String(255))
    coverage_area: Mapped[str | None] = mapped_column(String(255))
    serves_nationwide: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    serves_states: Mapped[list[str] | None] = mapped_column(ARRAY(String(2)), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    plans: Mapped[list["VendorCatalogPlan"]] = relationship(
        back_populates="vendor", cascade="all, delete-orphan"
    )


class VendorCatalogPlan(Base):
    __tablename__ = "vendor_catalog_plans"
    __table_args__ = (
        Index("ix_vendor_catalog_plans_vendor_id", "vendor_id"),
        UniqueConstraint("plan_key", name="uq_vendor_catalog_plans_plan_key"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    vendor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("vendor_catalog.id", ondelete="CASCADE"),
        nullable=False,
    )
    plan_key: Mapped[str] = mapped_column(String(128), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    price: Mapped[str] = mapped_column(String(64), nullable=False)
    price_unit: Mapped[str] = mapped_column(String(32), nullable=False)
    features: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    popular: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    vendor: Mapped["VendorCatalog"] = relationship(back_populates="plans")


class UserLeaseDocuments(Base):
    __tablename__ = "user_lease_documents"
    __table_args__ = (
        Index("ix_user_lease_documents_user_id", "user_id"),
        UniqueConstraint("user_id", name="uq_user_lease_documents_user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    original_filename: Mapped[str] = mapped_column(String(512), nullable=False)
    content_type: Mapped[str] = mapped_column(String(128), nullable=False)
    byte_size: Mapped[int] = mapped_column(Integer, nullable=False)
    extracted_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="lease_document")


class LandlordProfiles(Base):
    __tablename__ = "landlord_profiles"
    __table_args__ = (
        Index("ix_landlord_profiles_user_id", "user_id"),
        UniqueConstraint("user_id", name="uq_landlord_profiles_user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    display_name: Mapped[str | None] = mapped_column(String(255))
    company_name: Mapped[str | None] = mapped_column(String(255))
    phone_number: Mapped[str | None] = mapped_column(String(64))
    verification_status: Mapped[LandlordVerificationStatus] = mapped_column(
        SQLEnum(LandlordVerificationStatus, name="landlord_verification_status"),
        nullable=False,
        default=LandlordVerificationStatus.pending,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user: Mapped["Users"] = relationship(back_populates="landlord_profile")


class LandlordProperties(Base):
    __tablename__ = "landlord_properties"
    __table_args__ = (
        Index("ix_landlord_properties_owner_user_id", "owner_user_id"),
        Index("ix_landlord_properties_owner_status", "owner_user_id", "publish_status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    street_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    street_line2: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(128), nullable=False)
    state: Mapped[str] = mapped_column(String(64), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(32), nullable=False)
    country: Mapped[str] = mapped_column(String(64), nullable=False, default="US")
    amenities_json: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    publish_status: Mapped[LandlordPublishStatus] = mapped_column(
        SQLEnum(LandlordPublishStatus, name="landlord_publish_status"),
        nullable=False,
        default=LandlordPublishStatus.draft,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    owner: Mapped["Users"] = relationship(back_populates="landlord_properties")
    media_items: Mapped[list["LandlordPropertyMedia"]] = relationship(
        back_populates="property", cascade="all, delete-orphan"
    )
    units: Mapped[list["LandlordUnits"]] = relationship(
        back_populates="property", cascade="all, delete-orphan"
    )


class LandlordPropertyMedia(Base):
    __tablename__ = "landlord_property_media"
    __table_args__ = (
        Index("ix_landlord_property_media_property_id", "property_id"),
        Index("ix_landlord_property_media_property_sort_order", "property_id", "sort_order"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    media_url: Mapped[str] = mapped_column(Text, nullable=False)
    media_type: Mapped[str] = mapped_column(String(32), nullable=False, default="image")
    caption: Mapped[str | None] = mapped_column(String(255))
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    property: Mapped["LandlordProperties"] = relationship(back_populates="media_items")


class LandlordUnits(Base):
    __tablename__ = "landlord_units"
    __table_args__ = (
        Index("ix_landlord_units_property_id", "property_id"),
        Index("ix_landlord_units_property_available", "property_id", "is_available"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bathrooms: Mapped[Decimal] = mapped_column(Numeric(4, 1), nullable=False, default=Decimal("1.0"))
    square_feet: Mapped[int | None] = mapped_column(Integer)
    monthly_rent: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    security_deposit: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    lease_term_months: Mapped[int | None] = mapped_column(Integer)
    available_on: Mapped[date | None] = mapped_column(Date)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    property: Mapped["LandlordProperties"] = relationship(back_populates="units")
    leads: Mapped[list["LandlordLeads"]] = relationship(back_populates="unit")
    tour_slots: Mapped[list["LandlordTourSlots"]] = relationship(back_populates="unit")
    applications: Mapped[list["LandlordApplications"]] = relationship(back_populates="unit")
    lease_offers: Mapped[list["LandlordLeaseOffers"]] = relationship(back_populates="unit")


class LandlordLeads(Base):
    __tablename__ = "landlord_leads"
    __table_args__ = (
        Index("ix_landlord_leads_owner_user_id", "owner_user_id"),
        Index("ix_landlord_leads_owner_status_created", "owner_user_id", "status", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_properties.id", ondelete="CASCADE"),
        nullable=False,
    )
    unit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_units.id", ondelete="SET NULL")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(64))
    message: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(64), nullable=False, default="platform")
    status: Mapped[LandlordLeadStatus] = mapped_column(
        SQLEnum(LandlordLeadStatus, name="landlord_lead_status"),
        nullable=False,
        default=LandlordLeadStatus.new,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    unit: Mapped["LandlordUnits | None"] = relationship(back_populates="leads")


class LandlordTourSlots(Base):
    __tablename__ = "landlord_tour_slots"
    __table_args__ = (
        Index("ix_landlord_tour_slots_owner_user_id", "owner_user_id"),
        Index("ix_landlord_tour_slots_unit_start_time", "unit_id", "start_time"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_units.id", ondelete="CASCADE"), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_blocked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    unit: Mapped["LandlordUnits"] = relationship(back_populates="tour_slots")
    bookings: Mapped[list["LandlordTourBookings"]] = relationship(
        back_populates="slot", cascade="all, delete-orphan"
    )


class LandlordTourBookings(Base):
    __tablename__ = "landlord_tour_bookings"
    __table_args__ = (
        Index("ix_landlord_tour_bookings_owner_user_id", "owner_user_id"),
        Index("ix_landlord_tour_bookings_slot_id", "slot_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    slot_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_tour_slots.id", ondelete="CASCADE"), nullable=False
    )
    lead_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_leads.id", ondelete="SET NULL")
    )
    guest_name: Mapped[str] = mapped_column(String(255), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[LandlordTourBookingStatus] = mapped_column(
        SQLEnum(LandlordTourBookingStatus, name="landlord_tour_booking_status"),
        nullable=False,
        default=LandlordTourBookingStatus.requested,
    )
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    slot: Mapped["LandlordTourSlots"] = relationship(back_populates="bookings")


class LandlordApplications(Base):
    __tablename__ = "landlord_applications"
    __table_args__ = (
        Index("ix_landlord_applications_owner_user_id", "owner_user_id"),
        Index("ix_landlord_applications_owner_status_created", "owner_user_id", "status", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_units.id", ondelete="SET NULL")
    )
    lead_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_leads.id", ondelete="SET NULL")
    )
    applicant_name: Mapped[str] = mapped_column(String(255), nullable=False)
    applicant_email: Mapped[str] = mapped_column(String(255), nullable=False)
    annual_income: Mapped[Decimal | None] = mapped_column(Numeric(14, 2))
    credit_score: Mapped[int | None] = mapped_column(Integer)
    notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[LandlordApplicationStatus] = mapped_column(
        SQLEnum(LandlordApplicationStatus, name="landlord_application_status"),
        nullable=False,
        default=LandlordApplicationStatus.submitted,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    unit: Mapped["LandlordUnits | None"] = relationship(back_populates="applications")
    documents: Mapped[list["LandlordApplicationDocuments"]] = relationship(
        back_populates="application", cascade="all, delete-orphan"
    )
    lease_offers: Mapped[list["LandlordLeaseOffers"]] = relationship(back_populates="application")


class LandlordApplicationDocuments(Base):
    __tablename__ = "landlord_application_documents"
    __table_args__ = (
        Index("ix_landlord_application_documents_application_id", "application_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_applications.id", ondelete="CASCADE"),
        nullable=False,
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    file_type: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    application: Mapped["LandlordApplications"] = relationship(back_populates="documents")


class LandlordLeaseOffers(Base):
    __tablename__ = "landlord_lease_offers"
    __table_args__ = (
        Index("ix_landlord_lease_offers_owner_user_id", "owner_user_id"),
        Index("ix_landlord_lease_offers_owner_status_created", "owner_user_id", "status", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_properties.id", ondelete="CASCADE"), nullable=False
    )
    unit_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_units.id", ondelete="SET NULL")
    )
    application_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("landlord_applications.id", ondelete="SET NULL")
    )
    tenant_name: Mapped[str] = mapped_column(String(255), nullable=False)
    tenant_email: Mapped[str] = mapped_column(String(255), nullable=False)
    monthly_rent: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    lease_start: Mapped[date] = mapped_column(Date, nullable=False)
    lease_end: Mapped[date] = mapped_column(Date, nullable=False)
    terms_text: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[LandlordLeaseOfferStatus] = mapped_column(
        SQLEnum(LandlordLeaseOfferStatus, name="landlord_lease_offer_status"),
        nullable=False,
        default=LandlordLeaseOfferStatus.draft,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    unit: Mapped["LandlordUnits | None"] = relationship(back_populates="lease_offers")
    application: Mapped["LandlordApplications | None"] = relationship(back_populates="lease_offers")
    signatures: Mapped[list["LandlordLeaseSignatures"]] = relationship(
        back_populates="lease_offer", cascade="all, delete-orphan"
    )


class LandlordLeaseSignatures(Base):
    __tablename__ = "landlord_lease_signatures"
    __table_args__ = (
        Index("ix_landlord_lease_signatures_lease_offer_id", "lease_offer_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    lease_offer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_lease_offers.id", ondelete="CASCADE"),
        nullable=False,
    )
    signer_role: Mapped[str] = mapped_column(String(32), nullable=False)
    signer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    signer_email: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[LandlordSignatureStatus] = mapped_column(
        SQLEnum(LandlordSignatureStatus, name="landlord_signature_status"),
        nullable=False,
        default=LandlordSignatureStatus.pending,
    )
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    lease_offer: Mapped["LandlordLeaseOffers"] = relationship(back_populates="signatures")
