from __future__ import annotations

import uuid
from datetime import date
from decimal import Decimal, InvalidOperation

from fastapi import HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from db.models import (
    UserChecklistItems,
    UserMoveinPlans,
    UserVendorOrders,
    VendorCatalog,
    VendorCatalogPlan,
    VendorOrderStatus,
)
from movein.geocode import resolve_target_state_from_address
from movein.schemas import (
    ChecklistItemCreate,
    ChecklistItemOut,
    ChecklistItemPatch,
    MoveInPlanOut,
    MoveInPlanPatch,
    VendorCatalogOut,
    VendorOrderCreate,
    VendorOrderOut,
    VendorOrderPatch,
    VendorPlanOut,
)


def _parse_date(raw: str | None) -> date | None:
    if raw is None or not raw.strip():
        return None
    try:
        return date.fromisoformat(raw[:10])
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid date format")


def _parse_decimal(raw: str | None) -> Decimal | None:
    if raw is None or not raw.strip():
        return None
    try:
        return Decimal(raw.replace("$", "").replace(",", "").strip())
    except (InvalidOperation, ValueError):
        return None


def _to_status(raw: str) -> VendorOrderStatus:
    for status in VendorOrderStatus:
        if status.value == raw:
            return status
    raise HTTPException(status_code=422, detail="Invalid order status")


def _ensure_plan(db: Session, user_id: uuid.UUID) -> UserMoveinPlans:
    row = db.execute(
        select(UserMoveinPlans)
        .where(UserMoveinPlans.user_id == user_id)
        .order_by(UserMoveinPlans.updated_at.desc())
    ).scalar_one_or_none()
    if row:
        return row
    row = UserMoveinPlans(user_id=user_id, target_address="")
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def set_move_from_address_if_empty(db: Session, user_id: uuid.UUID, address: str) -> bool:
    """Set move_from_address only when unset. Returns True if the plan was updated."""
    q = (address or "").strip()
    if not q:
        return False
    row = _ensure_plan(db, user_id)
    if (row.move_from_address or "").strip():
        return False
    row.move_from_address = q[:255]
    db.commit()
    db.refresh(row)
    return True


def _order_out(row: UserVendorOrders) -> VendorOrderOut:
    return VendorOrderOut(
        id=str(row.id),
        vendor_id=row.vendor_id or "",
        vendor_name=row.vendor_name,
        plan_id=row.plan_id or "",
        plan_name=row.plan_name or "",
        category=row.category,
        status=row.status.value,
        scheduled_date=row.scheduled_date.isoformat() if row.scheduled_date else "",
        account_number=row.account_number or "",
        notes=row.notes or "",
        monthly_cost=str(row.monthly_cost) if row.monthly_cost is not None else "",
        created_at=row.created_at.isoformat() if row.created_at else "",
    )


def _checklist_out(row: UserChecklistItems) -> ChecklistItemOut:
    return ChecklistItemOut(
        id=str(row.id),
        category=row.category,
        label=row.label,
        completed=row.completed,
    )


def read_plan(db: Session, user_id: uuid.UUID) -> MoveInPlanOut:
    row = _ensure_plan(db, user_id)
    return MoveInPlanOut(
        target_address=row.target_address,
        target_state=row.target_state or "",
        move_date=row.move_date.isoformat() if row.move_date else "",
        move_from_address=row.move_from_address or "",
    )


def patch_plan(db: Session, user_id: uuid.UUID, body: MoveInPlanPatch) -> MoveInPlanOut:
    row = _ensure_plan(db, user_id)
    data = body.model_dump(exclude_unset=True)
    if "target_address" in data:
        row.target_address = (data["target_address"] or "")[:255]
        row.target_state = resolve_target_state_from_address(row.target_address)
    if "move_date" in data:
        row.move_date = _parse_date(data["move_date"])
    if "move_from_address" in data:
        row.move_from_address = data["move_from_address"] or None
    db.commit()
    db.refresh(row)
    return read_plan(db, user_id)


def list_orders(db: Session, user_id: uuid.UUID) -> list[VendorOrderOut]:
    plan = _ensure_plan(db, user_id)
    rows = db.execute(
        select(UserVendorOrders)
        .where(UserVendorOrders.movein_plan_id == plan.id)
        .order_by(UserVendorOrders.created_at.desc())
    ).scalars().all()
    return [_order_out(row) for row in rows]


def create_order(db: Session, user_id: uuid.UUID, body: VendorOrderCreate) -> VendorOrderOut:
    plan = _ensure_plan(db, user_id)
    row = UserVendorOrders(
        movein_plan_id=plan.id,
        vendor_id=body.vendor_id or None,
        vendor_name=body.vendor_name or "—",
        plan_id=body.plan_id or None,
        plan_name=body.plan_name or None,
        category=body.category,
        status=_to_status(body.status),
        scheduled_date=_parse_date(body.scheduled_date),
        account_number=body.account_number or None,
        notes=body.notes or None,
        monthly_cost=_parse_decimal(body.monthly_cost),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _order_out(row)


def patch_order(db: Session, user_id: uuid.UUID, order_id: uuid.UUID, body: VendorOrderPatch) -> VendorOrderOut:
    plan = _ensure_plan(db, user_id)
    row = db.execute(
        select(UserVendorOrders).where(
            UserVendorOrders.id == order_id, UserVendorOrders.movein_plan_id == plan.id
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Order not found")
    data = body.model_dump(exclude_unset=True)
    if "status" in data:
        row.status = _to_status(data.pop("status"))
    if "scheduled_date" in data:
        row.scheduled_date = _parse_date(data.pop("scheduled_date"))
    if "monthly_cost" in data:
        row.monthly_cost = _parse_decimal(data.pop("monthly_cost"))
    for key, val in data.items():
        if hasattr(row, key):
            if key == "vendor_name":
                setattr(row, key, ((val if val is not None else "") or "")[:255])
            else:
                setattr(row, key, val or None)
    db.commit()
    db.refresh(row)
    return _order_out(row)


def delete_order(db: Session, user_id: uuid.UUID, order_id: uuid.UUID) -> None:
    plan = _ensure_plan(db, user_id)
    row = db.execute(
        select(UserVendorOrders).where(
            UserVendorOrders.id == order_id, UserVendorOrders.movein_plan_id == plan.id
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(row)
    db.commit()


def list_checklist(db: Session, user_id: uuid.UUID) -> list[ChecklistItemOut]:
    plan = _ensure_plan(db, user_id)
    rows = db.execute(
        select(UserChecklistItems).where(UserChecklistItems.movein_plan_id == plan.id)
    ).scalars().all()
    return [_checklist_out(row) for row in rows]


def create_checklist_item(
    db: Session, user_id: uuid.UUID, body: ChecklistItemCreate
) -> ChecklistItemOut:
    plan = _ensure_plan(db, user_id)
    row = UserChecklistItems(
        user_id=user_id,
        movein_plan_id=plan.id,
        category=body.category,
        label=body.label,
        completed=body.completed,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return _checklist_out(row)


def patch_checklist_item(
    db: Session, user_id: uuid.UUID, item_id: uuid.UUID, body: ChecklistItemPatch
) -> ChecklistItemOut:
    plan = _ensure_plan(db, user_id)
    row = db.execute(
        select(UserChecklistItems).where(
            UserChecklistItems.id == item_id, UserChecklistItems.movein_plan_id == plan.id
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    data = body.model_dump(exclude_unset=True)
    for key, val in data.items():
        if hasattr(row, key):
            setattr(row, key, val)
    db.commit()
    db.refresh(row)
    return _checklist_out(row)


def delete_checklist_item(db: Session, user_id: uuid.UUID, item_id: uuid.UUID) -> None:
    plan = _ensure_plan(db, user_id)
    row = db.execute(
        select(UserChecklistItems).where(
            UserChecklistItems.id == item_id, UserChecklistItems.movein_plan_id == plan.id
        )
    ).scalar_one_or_none()
    if row is None:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    db.delete(row)
    db.commit()


def list_vendor_catalog(
    db: Session,
    user_id: uuid.UUID,
    category: str | None = None,
) -> list[VendorCatalogOut]:
    plan = _ensure_plan(db, user_id)
    target_state = (plan.target_state or "").strip().upper() or None
    if not target_state:
        addr = (plan.target_address or "").strip()
        if addr:
            resolved = resolve_target_state_from_address(addr)
            if resolved:
                plan.target_state = resolved
                db.commit()
                db.refresh(plan)
                target_state = resolved
    if not target_state:
        return []

    query = select(VendorCatalog).where(
        or_(
            VendorCatalog.serves_nationwide.is_(True),
            VendorCatalog.serves_states.overlap([target_state]),
        )
    )
    if category:
        query = query.where(VendorCatalog.category == category)
    vendors = db.execute(query.order_by(VendorCatalog.name.asc())).scalars().all()
    out: list[VendorCatalogOut] = []
    for vendor in vendors:
        plans = db.execute(
            select(VendorCatalogPlan).where(VendorCatalogPlan.vendor_id == vendor.id)
        ).scalars().all()
        out.append(
            VendorCatalogOut(
                id=vendor.vendor_key,
                name=vendor.name,
                category=vendor.category,
                initials=vendor.initials,
                rating=float(vendor.rating) if vendor.rating is not None else None,
                review_count=vendor.review_count,
                phone=vendor.phone or "",
                website=vendor.website or "",
                coverage_area=vendor.coverage_area or "",
                plans=[
                    VendorPlanOut(
                        id=p.plan_key,
                        name=p.name,
                        price=p.price,
                        price_unit=p.price_unit,
                        features=list(p.features or []),
                        popular=p.popular,
                    )
                    for p in plans
                ],
            )
        )
    return out

