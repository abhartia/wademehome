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
        Index("ix_user_tours_group_id", "group_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    group_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="SET NULL"), nullable=True
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
        Index("ix_property_favorites_group_id", "group_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    group_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=True
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
        Index("ix_property_notes_group_id", "group_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    group_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=True
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


# ---------------------------------------------------------------------------
# Building / Landlord-entity / Review system
# ---------------------------------------------------------------------------


class LandlordEntityKind(str, Enum):
    individual = "individual"
    llc = "llc"
    corp = "corp"
    mgmt_company = "mgmt_company"
    unknown = "unknown"


class LandlordAliasType(str, Enum):
    llc_name = "llc_name"
    dba = "dba"
    principal_name = "principal_name"
    acris_party = "acris_party"
    email = "email"
    phone = "phone"
    address = "address"


class LandlordAliasSource(str, Enum):
    acris = "acris"
    crowdsourced = "crowdsourced"
    admin = "admin"
    claimed = "claimed"


class OwnershipRole(str, Enum):
    owner = "owner"
    manager = "manager"


class OwnershipSource(str, Enum):
    acris_deed = "acris_deed"
    crowdsourced = "crowdsourced"
    claimed = "claimed"
    admin = "admin"


class ReviewStatus(str, Enum):
    draft = "draft"
    pending_cooldown = "pending_cooldown"
    published = "published"
    flagged = "flagged"
    hidden = "hidden"
    removed = "removed"


class ReviewLandlordRelation(str, Enum):
    owner = "owner"
    manager = "manager"
    both = "both"


class TransitSystem(str, Enum):
    path = "path"
    hblr = "hblr"
    nyc_subway = "nyc_subway"
    lirr = "lirr"
    nj_transit_rail = "nj_transit_rail"
    ferry = "ferry"


class ReviewDimension(str, Enum):
    responsiveness = "responsiveness"
    maintenance = "maintenance"
    deposit_return = "deposit_return"
    heat_hot_water = "heat_hot_water"
    pest_control = "pest_control"
    harassment = "harassment"
    building_condition = "building_condition"
    noise = "noise"
    value = "value"


# Classification of each review dimension as either traveling with the landlord
# (applies to the person / entity) or staying with the building (applies to the
# physical property). Used when aggregating subratings on the building and the
# landlord-entity pages.
REVIEW_DIMENSION_SCOPE: dict[ReviewDimension, str] = {
    ReviewDimension.responsiveness: "landlord",
    ReviewDimension.maintenance: "landlord",
    ReviewDimension.deposit_return: "landlord",
    ReviewDimension.heat_hot_water: "building",
    ReviewDimension.pest_control: "building",
    ReviewDimension.harassment: "landlord",
    ReviewDimension.building_condition: "building",
    ReviewDimension.noise: "building",
    ReviewDimension.value: "building",
}


class ReviewVerificationProofType(str, Enum):
    lease = "lease"
    utility_bill = "utility_bill"
    rent_receipt = "rent_receipt"
    mail = "mail"


class ReviewVerificationStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class ReviewFlagType(str, Enum):
    defamation = "defamation"
    factual_error = "factual_error"
    spam = "spam"
    harassment = "harassment"
    off_topic = "off_topic"
    other = "other"


class ReviewFlagSubmitterRole(str, Enum):
    tenant = "tenant"
    landlord = "landlord"
    public = "public"
    system = "system"


class ReviewFlagStatus(str, Enum):
    open = "open"
    accepted = "accepted"
    rejected = "rejected"


class IngestSource(str, Enum):
    hpd_violations = "hpd_violations"
    dob_complaints = "dob_complaints"
    acris_documents = "acris_documents"
    acris_parties = "acris_parties"
    geosupport = "geosupport"


class IngestStatus(str, Enum):
    running = "running"
    completed = "completed"
    failed = "failed"


class Buildings(Base):
    __tablename__ = "buildings"
    __table_args__ = (
        UniqueConstraint("bbl", "bin", name="uq_buildings_bbl_bin"),
        Index("ix_buildings_bbl", "bbl"),
        Index("ix_buildings_bin", "bin"),
        Index("ix_buildings_normalized_addr", "normalized_addr"),
        Index("ix_buildings_borough", "borough"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    bbl: Mapped[str | None] = mapped_column(String(10))
    bin: Mapped[str | None] = mapped_column(String(7))
    borough: Mapped[int | None] = mapped_column(Integer)
    street_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    unit_count: Mapped[int | None] = mapped_column(Integer)
    city: Mapped[str] = mapped_column(String(128), nullable=False, default="New York")
    state: Mapped[str] = mapped_column(String(64), nullable=False, default="NY")
    postal_code: Mapped[str | None] = mapped_column(String(32))
    latitude: Mapped[Decimal] = mapped_column(Numeric(10, 7), nullable=False)
    longitude: Mapped[Decimal] = mapped_column(Numeric(11, 7), nullable=False)
    normalized_addr: Mapped[str] = mapped_column(String(512), nullable=False)
    geohash: Mapped[str | None] = mapped_column(String(12))
    building_group_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("buildings.id", ondelete="SET NULL")
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

    ownership_periods: Mapped[list["BuildingOwnershipPeriods"]] = relationship(
        back_populates="building", cascade="all, delete-orphan"
    )
    reviews: Mapped[list["Reviews"]] = relationship(back_populates="building")


class TransitStations(Base):
    __tablename__ = "transit_stations"
    __table_args__ = (
        UniqueConstraint("system", "station_name", name="uq_transit_system_name"),
        Index("ix_transit_stations_system", "system"),
        Index("ix_transit_stations_lat_lng", "latitude", "longitude"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    system: Mapped[TransitSystem] = mapped_column(
        SQLEnum(TransitSystem, name="transit_system", create_type=False), nullable=False
    )
    station_name: Mapped[str] = mapped_column(String(255), nullable=False)
    lines: Mapped[list[str] | None] = mapped_column(ARRAY(String(64)))
    latitude: Mapped[Decimal] = mapped_column(Numeric(10, 7), nullable=False)
    longitude: Mapped[Decimal] = mapped_column(Numeric(11, 7), nullable=False)
    city: Mapped[str | None] = mapped_column(String(128))
    state: Mapped[str | None] = mapped_column(String(8))
    borough: Mapped[str | None] = mapped_column(String(64))
    external_id: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class LandlordEntities(Base):
    __tablename__ = "landlord_entities"
    __table_args__ = (
        Index("ix_landlord_entities_head_entity_id", "head_entity_id"),
        Index("ix_landlord_entities_claimed_profile_id", "claimed_profile_id"),
        Index("ix_landlord_entities_canonical_name", "canonical_name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    kind: Mapped[LandlordEntityKind] = mapped_column(
        SQLEnum(LandlordEntityKind, name="landlord_entity_kind"),
        nullable=False,
        default=LandlordEntityKind.unknown,
    )
    canonical_name: Mapped[str] = mapped_column(String(512), nullable=False)
    claimed_profile_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_profiles.id", ondelete="SET NULL"),
    )
    head_entity_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_entities.id", ondelete="SET NULL"),
    )
    portfolio_size_cached: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    avg_rating_cached: Mapped[Decimal | None] = mapped_column(Numeric(3, 2))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    aliases: Mapped[list["LandlordEntityAliases"]] = relationship(
        back_populates="entity", cascade="all, delete-orphan"
    )
    ownership_periods: Mapped[list["BuildingOwnershipPeriods"]] = relationship(
        back_populates="landlord_entity"
    )
    reviews: Mapped[list["Reviews"]] = relationship(back_populates="landlord_entity")


class LandlordEntityAliases(Base):
    __tablename__ = "landlord_entity_aliases"
    __table_args__ = (
        UniqueConstraint("alias_type", "value", name="uq_landlord_entity_aliases_type_value"),
        Index("ix_landlord_entity_aliases_entity_id", "entity_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    entity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_entities.id", ondelete="CASCADE"),
        nullable=False,
    )
    alias_type: Mapped[LandlordAliasType] = mapped_column(
        SQLEnum(LandlordAliasType, name="landlord_alias_type"), nullable=False
    )
    value: Mapped[str] = mapped_column(String(512), nullable=False)
    source: Mapped[LandlordAliasSource] = mapped_column(
        SQLEnum(LandlordAliasSource, name="landlord_alias_source"), nullable=False
    )
    confidence: Mapped[Decimal | None] = mapped_column(Numeric(3, 2))
    verified_by_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    entity: Mapped["LandlordEntities"] = relationship(back_populates="aliases")


class BuildingOwnershipPeriods(Base):
    __tablename__ = "building_ownership_periods"
    __table_args__ = (
        Index(
            "ix_building_ownership_periods_building_id_start",
            "building_id",
            "start_date",
        ),
        Index("ix_building_ownership_periods_landlord_entity_id", "landlord_entity_id"),
        Index("ix_building_ownership_periods_role", "role"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    building_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("buildings.id", ondelete="CASCADE"),
        nullable=False,
    )
    landlord_entity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_entities.id", ondelete="RESTRICT"),
        nullable=False,
    )
    role: Mapped[OwnershipRole] = mapped_column(
        SQLEnum(OwnershipRole, name="ownership_role"),
        nullable=False,
        default=OwnershipRole.owner,
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date)
    source: Mapped[OwnershipSource] = mapped_column(
        SQLEnum(OwnershipSource, name="ownership_source"), nullable=False
    )
    acris_document_id: Mapped[str | None] = mapped_column(String(64))
    confidence: Mapped[Decimal | None] = mapped_column(Numeric(3, 2))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    building: Mapped["Buildings"] = relationship(back_populates="ownership_periods")
    landlord_entity: Mapped["LandlordEntities"] = relationship(
        back_populates="ownership_periods"
    )


class Reviews(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        Index("ix_reviews_building_id", "building_id"),
        Index("ix_reviews_landlord_entity_id", "landlord_entity_id"),
        Index("ix_reviews_author_user_id", "author_user_id"),
        Index("ix_reviews_status", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    author_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    building_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("buildings.id", ondelete="RESTRICT"),
        nullable=False,
    )
    landlord_entity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("landlord_entities.id", ondelete="RESTRICT"),
        nullable=False,
    )
    ownership_period_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("building_ownership_periods.id", ondelete="SET NULL"),
    )
    landlord_relation: Mapped[ReviewLandlordRelation] = mapped_column(
        SQLEnum(ReviewLandlordRelation, name="review_landlord_relation"),
        nullable=False,
        default=ReviewLandlordRelation.both,
    )
    tenancy_start: Mapped[date] = mapped_column(Date, nullable=False)
    tenancy_end: Mapped[date | None] = mapped_column(Date)
    overall_rating: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str | None] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text, nullable=False)
    verified_tenant: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[ReviewStatus] = mapped_column(
        SQLEnum(ReviewStatus, name="review_status"),
        nullable=False,
        default=ReviewStatus.pending_cooldown,
    )
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    building: Mapped["Buildings"] = relationship(back_populates="reviews")
    landlord_entity: Mapped["LandlordEntities"] = relationship(back_populates="reviews")
    subratings: Mapped[list["ReviewSubratings"]] = relationship(
        back_populates="review", cascade="all, delete-orphan"
    )
    verification: Mapped["ReviewVerifications | None"] = relationship(
        back_populates="review", uselist=False, cascade="all, delete-orphan"
    )
    response: Mapped["ReviewResponses | None"] = relationship(
        back_populates="review", uselist=False, cascade="all, delete-orphan"
    )
    moderation_flags: Mapped[list["ReviewModeration"]] = relationship(
        back_populates="review", cascade="all, delete-orphan"
    )


class ReviewSubratings(Base):
    __tablename__ = "review_subratings"

    review_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reviews.id", ondelete="CASCADE"),
        primary_key=True,
    )
    dimension: Mapped[ReviewDimension] = mapped_column(
        SQLEnum(ReviewDimension, name="review_dimension"), primary_key=True
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)

    review: Mapped["Reviews"] = relationship(back_populates="subratings")


class ReviewVerifications(Base):
    __tablename__ = "review_verifications"
    __table_args__ = (
        UniqueConstraint("review_id", name="uq_review_verifications_review_id"),
        Index("ix_review_verifications_status", "status"),
        Index("ix_review_verifications_user_id", "user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reviews.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    tenancy_start: Mapped[date | None] = mapped_column(Date)
    tenancy_end: Mapped[date | None] = mapped_column(Date)
    proof_type: Mapped[ReviewVerificationProofType] = mapped_column(
        SQLEnum(ReviewVerificationProofType, name="review_verification_proof_type"),
        nullable=False,
    )
    storage_key: Mapped[str] = mapped_column(String(1024), nullable=False)
    status: Mapped[ReviewVerificationStatus] = mapped_column(
        SQLEnum(ReviewVerificationStatus, name="review_verification_status"),
        nullable=False,
        default=ReviewVerificationStatus.pending,
    )
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    rejection_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    review: Mapped["Reviews"] = relationship(
        back_populates="verification", foreign_keys=[review_id]
    )


class ReviewResponses(Base):
    __tablename__ = "review_responses"
    __table_args__ = (
        UniqueConstraint("review_id", name="uq_review_responses_review_id"),
        Index("ix_review_responses_author_user_id", "author_user_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reviews.id", ondelete="CASCADE"),
        nullable=False,
    )
    author_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    review: Mapped["Reviews"] = relationship(back_populates="response")


class ReviewModeration(Base):
    __tablename__ = "review_moderation"
    __table_args__ = (
        Index("ix_review_moderation_review_id", "review_id"),
        Index("ix_review_moderation_status", "status"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    review_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reviews.id", ondelete="CASCADE"),
        nullable=False,
    )
    flag_type: Mapped[ReviewFlagType] = mapped_column(
        SQLEnum(ReviewFlagType, name="review_flag_type"), nullable=False
    )
    submitted_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    submitted_by_role: Mapped[ReviewFlagSubmitterRole] = mapped_column(
        SQLEnum(ReviewFlagSubmitterRole, name="review_flag_submitter_role"),
        nullable=False,
    )
    details: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ReviewFlagStatus] = mapped_column(
        SQLEnum(ReviewFlagStatus, name="review_flag_status"),
        nullable=False,
        default=ReviewFlagStatus.open,
    )
    resolution_note: Mapped[str | None] = mapped_column(Text)
    resolved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    review: Mapped["Reviews"] = relationship(back_populates="moderation_flags")


# ---------------------------------------------------------------------------
# NYC OpenData ingest tables
# ---------------------------------------------------------------------------


class HpdViolations(Base):
    __tablename__ = "hpd_violations"
    __table_args__ = (
        Index("ix_hpd_violations_bbl", "bbl"),
        Index("ix_hpd_violations_bin", "bin"),
        Index("ix_hpd_violations_status", "status"),
    )

    violation_id: Mapped[str] = mapped_column(String(32), primary_key=True)
    bbl: Mapped[str | None] = mapped_column(String(10))
    bin: Mapped[str | None] = mapped_column(String(7))
    violation_class: Mapped[str | None] = mapped_column(String(8))
    status: Mapped[str | None] = mapped_column(String(32))
    novissued_date: Mapped[date | None] = mapped_column(Date)
    certified_date: Mapped[date | None] = mapped_column(Date)
    apartment: Mapped[str | None] = mapped_column(String(32))
    description: Mapped[str | None] = mapped_column(Text)
    raw: Mapped[dict | None] = mapped_column(JSONB)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class DobComplaints(Base):
    __tablename__ = "dob_complaints"
    __table_args__ = (
        Index("ix_dob_complaints_bbl", "bbl"),
        Index("ix_dob_complaints_bin", "bin"),
        Index("ix_dob_complaints_status", "status"),
    )

    complaint_number: Mapped[str] = mapped_column(String(32), primary_key=True)
    bbl: Mapped[str | None] = mapped_column(String(10))
    bin: Mapped[str | None] = mapped_column(String(7))
    category: Mapped[str | None] = mapped_column(String(64))
    status: Mapped[str | None] = mapped_column(String(32))
    date_entered: Mapped[date | None] = mapped_column(Date)
    resolution: Mapped[str | None] = mapped_column(Text)
    raw: Mapped[dict | None] = mapped_column(JSONB)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class AcrisDocuments(Base):
    __tablename__ = "acris_documents"
    __table_args__ = (
        Index("ix_acris_documents_bbl", "bbl"),
        Index("ix_acris_documents_recorded_datetime", "recorded_datetime"),
    )

    document_id: Mapped[str] = mapped_column(String(32), primary_key=True)
    doc_type: Mapped[str | None] = mapped_column(String(32))
    recorded_datetime: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    bbl: Mapped[str | None] = mapped_column(String(10))
    raw: Mapped[dict | None] = mapped_column(JSONB)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    parties: Mapped[list["AcrisParties"]] = relationship(
        back_populates="document", cascade="all, delete-orphan"
    )


class AcrisParties(Base):
    __tablename__ = "acris_parties"
    __table_args__ = (
        Index("ix_acris_parties_document_id", "document_id"),
        Index("ix_acris_parties_name", "name"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    document_id: Mapped[str] = mapped_column(
        String(32),
        ForeignKey("acris_documents.document_id", ondelete="CASCADE"),
        nullable=False,
    )
    party_type: Mapped[str | None] = mapped_column(String(16))
    name: Mapped[str | None] = mapped_column(String(512))
    address: Mapped[str | None] = mapped_column(Text)
    role: Mapped[str | None] = mapped_column(String(32))
    raw: Mapped[dict | None] = mapped_column(JSONB)

    document: Mapped["AcrisDocuments"] = relationship(back_populates="parties")


class DataIngestRuns(Base):
    __tablename__ = "data_ingest_runs"
    __table_args__ = (
        Index("ix_data_ingest_runs_source_started", "source", "started_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source: Mapped[IngestSource] = mapped_column(
        SQLEnum(IngestSource, name="ingest_source"), nullable=False
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    rows_upserted: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[IngestStatus] = mapped_column(
        SQLEnum(IngestStatus, name="ingest_status"),
        nullable=False,
        default=IngestStatus.running,
    )
    notes: Mapped[str | None] = mapped_column(Text)


class Groups(Base):
    __tablename__ = "groups"
    __table_args__ = (
        Index("ix_groups_created_by", "created_by"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
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

    members: Mapped[list["GroupMembers"]] = relationship(
        back_populates="group", passive_deletes=True
    )
    invites: Mapped[list["GroupInvites"]] = relationship(
        back_populates="group", passive_deletes=True
    )


class GroupMembers(Base):
    __tablename__ = "group_members"
    __table_args__ = (
        UniqueConstraint("group_id", "user_id", name="uq_group_members_group_user"),
        Index("ix_group_members_user_id", "user_id"),
        Index("ix_group_members_group_id", "group_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    role: Mapped[str] = mapped_column(String(32), nullable=False, default="member")
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    group: Mapped["Groups"] = relationship(back_populates="members")
    user: Mapped["Users"] = relationship()


class GroupInvites(Base):
    __tablename__ = "group_invites"
    __table_args__ = (
        Index("ix_group_invites_group_id", "group_id"),
        Index("ix_group_invites_token", "token"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    invited_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    token: Mapped[str] = mapped_column(String(96), nullable=False, unique=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    kind: Mapped[str] = mapped_column(String(16), nullable=False)  # "email" | "link"
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    accepted_by_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    group: Mapped["Groups"] = relationship(back_populates="invites")


class PropertyReactions(Base):
    __tablename__ = "property_reactions"
    __table_args__ = (
        UniqueConstraint(
            "group_id",
            "user_id",
            "property_key",
            "reaction",
            name="uq_property_reactions_group_user_prop_kind",
        ),
        Index("ix_property_reactions_group_property", "group_id", "property_key"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    property_key: Mapped[str] = mapped_column(String(255), nullable=False)
    reaction: Mapped[str] = mapped_column(String(32), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
