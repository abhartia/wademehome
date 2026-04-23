from __future__ import annotations

from pydantic import BaseModel, Field


class MoveInPlanOut(BaseModel):
    target_address: str = ""
    target_state: str = ""
    move_date: str = ""
    move_from_address: str = ""


class MoveInPlanPatch(BaseModel):
    target_address: str | None = None
    move_date: str | None = None
    move_from_address: str | None = None


class VendorOrderOut(BaseModel):
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


class VendorOrderCreate(BaseModel):
    vendor_id: str = ""
    vendor_name: str = ""
    plan_id: str = ""
    plan_name: str = ""
    category: str
    status: str = "researching"
    scheduled_date: str = ""
    account_number: str = ""
    notes: str = ""
    monthly_cost: str = ""


class VendorOrderPatch(BaseModel):
    vendor_id: str | None = None
    vendor_name: str | None = None
    plan_id: str | None = None
    plan_name: str | None = None
    category: str | None = None
    status: str | None = None
    scheduled_date: str | None = None
    account_number: str | None = None
    notes: str | None = None
    monthly_cost: str | None = None


class ChecklistItemOut(BaseModel):
    id: str
    category: str
    label: str
    completed: bool


class ChecklistItemCreate(BaseModel):
    category: str
    label: str
    completed: bool = False


class ChecklistItemPatch(BaseModel):
    category: str | None = None
    label: str | None = None
    completed: bool | None = None


class VendorPlanOut(BaseModel):
    id: str
    name: str
    price: str
    price_unit: str
    features: list[str] = Field(default_factory=list)
    popular: bool = False


class VendorCatalogOut(BaseModel):
    id: str
    name: str
    category: str
    initials: str
    rating: float | None = None
    review_count: int | None = None
    phone: str = ""
    website: str = ""
    coverage_area: str = ""
    plans: list[VendorPlanOut] = Field(default_factory=list)


class VendorCatalogListResponse(BaseModel):
    vendors: list[VendorCatalogOut] = Field(default_factory=list)


class VendorOrderListResponse(BaseModel):
    orders: list[VendorOrderOut] = Field(default_factory=list)


class ChecklistListResponse(BaseModel):
    checklist: list[ChecklistItemOut] = Field(default_factory=list)
