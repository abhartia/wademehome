from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from movein.schemas import (
    ChecklistItemCreate,
    ChecklistItemOut,
    ChecklistItemPatch,
    ChecklistListResponse,
    MoveInPlanOut,
    MoveInPlanPatch,
    VendorCatalogListResponse,
    VendorOrderCreate,
    VendorOrderOut,
    VendorOrderPatch,
    VendorOrderListResponse,
)
from movein.service import (
    create_checklist_item,
    create_order,
    delete_checklist_item,
    delete_order,
    list_checklist,
    list_orders,
    list_vendor_catalog,
    list_vendor_catalog_public,
    patch_checklist_item,
    patch_order,
    patch_plan,
    read_plan,
)

router = APIRouter(prefix="/move-in", tags=["move-in"])


@router.get("/plan", response_model=MoveInPlanOut)
def read_move_in_plan(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return read_plan(db, user.id)


@router.patch("/plan", response_model=MoveInPlanOut)
def patch_move_in_plan(
    body: MoveInPlanPatch, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return patch_plan(db, user.id, body)


@router.get("/orders", response_model=VendorOrderListResponse)
def read_move_in_orders(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return VendorOrderListResponse(orders=list_orders(db, user.id))


@router.post("/orders", response_model=VendorOrderOut)
def create_move_in_order(
    body: VendorOrderCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_order(db, user.id, body)


@router.patch("/orders/{order_id}", response_model=VendorOrderOut)
def patch_move_in_order(
    order_id: uuid.UUID,
    body: VendorOrderPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_order(db, user.id, order_id, body)


@router.delete("/orders/{order_id}", status_code=204)
def delete_move_in_order(
    order_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    delete_order(db, user.id, order_id)
    return None


@router.get("/checklist", response_model=ChecklistListResponse)
def read_move_in_checklist(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return ChecklistListResponse(checklist=list_checklist(db, user.id))


@router.post("/checklist", response_model=ChecklistItemOut)
def create_move_in_checklist_item(
    body: ChecklistItemCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return create_checklist_item(db, user.id, body)


@router.patch("/checklist/{item_id}", response_model=ChecklistItemOut)
def patch_move_in_checklist_item(
    item_id: uuid.UUID,
    body: ChecklistItemPatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_checklist_item(db, user.id, item_id, body)


@router.delete("/checklist/{item_id}", status_code=204)
def delete_move_in_checklist_item(
    item_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    delete_checklist_item(db, user.id, item_id)
    return None


@router.get("/vendors", response_model=VendorCatalogListResponse)
def read_vendor_catalog(
    category: str | None = Query(default=None),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return VendorCatalogListResponse(vendors=list_vendor_catalog(db, user.id, category))


@router.get("/vendors/public", response_model=VendorCatalogListResponse)
def read_vendor_catalog_public(
    state: str = Query(..., min_length=2, max_length=2),
    category: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Public endpoint — no auth required. Returns vendors available in the given state."""
    return VendorCatalogListResponse(vendors=list_vendor_catalog_public(db, state, category))

