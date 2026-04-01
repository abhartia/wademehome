from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


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
