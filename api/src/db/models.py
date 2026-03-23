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
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class UserRole(str, Enum):
    user = "user"
    admin = "admin"


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
    sent = "sent"
    viewed = "viewed"
    signed = "signed"
    expired = "expired"
    declined = "declined"


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
    history_entries: Mapped[list["GuarantorRequestHistory"]] = relationship(
        back_populates="request"
    )


class GuarantorRequestHistory(Base):
    __tablename__ = "guarantor_request_history"
    __table_args__ = (
        Index("ix_guarantor_request_history_request_id", "request_id"),
        Index("ix_guarantor_request_history_created_at", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("guarantor_requests.id", ondelete="CASCADE"),
        nullable=False,
    )
    status: Mapped[GuarantorRequestStatus] = mapped_column(
        SQLEnum(GuarantorRequestStatus, name="guarantor_request_status"), nullable=False
    )
    note: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    request: Mapped["GuarantorRequests"] = relationship(back_populates="history_entries")


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


class RoommateProfiles(Base):
    __tablename__ = "roommate_profiles"
    __table_args__ = (UniqueConstraint("user_id", name="uq_roommate_profiles_user_id"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
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
    rating: Mapped[Decimal] = mapped_column(Numeric(3, 1), nullable=False, default=Decimal("0.0"))
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    phone: Mapped[str | None] = mapped_column(String(64))
    website: Mapped[str | None] = mapped_column(String(255))
    coverage_area: Mapped[str | None] = mapped_column(String(255))
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


class RoommateCandidateCatalog(Base):
    __tablename__ = "roommate_candidate_catalog"
    __table_args__ = (
        Index("ix_roommate_candidate_catalog_target_city", "target_city"),
        UniqueConstraint("candidate_key", name="uq_roommate_candidate_catalog_candidate_key"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    candidate_key: Mapped[str] = mapped_column(String(128), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    occupation: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    bio: Mapped[str] = mapped_column(Text, nullable=False, default="")
    avatar_initials: Mapped[str] = mapped_column(String(16), nullable=False, default="")
    sleep_schedule: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    cleanliness_level: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    noise_level: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    guest_policy: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    smoking: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    languages_spoken: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    target_city: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    max_budget: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    move_timeline: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    bedrooms_wanted: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    has_pets: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    pet_details: Mapped[str] = mapped_column(Text, nullable=False, default="")
    interests: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    university: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


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
