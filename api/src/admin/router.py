"""Admin API routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import inspect

from admin.inventory_analytics import (
    NYC_METRO_BBOX_DEFAULT,
    InventoryAnalyticsResponse,
    run_inventory_analytics,
    validate_bbox,
)
from auth.router import get_current_admin_user
from core.config import Config
from core.logger import get_logger
from db.models import Users
from workflow.utils import engine, listing_table_name, listing_table_schema

logger = get_logger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


def _qualified_table() -> str:
    name = (listing_table_name or "").strip()
    if not name:
        return ""
    schema = (listing_table_schema or "").strip()
    if schema:
        return f'"{schema}"."{name}"'
    return f'"{name}"'


@router.get("/inventory-analytics", response_model=InventoryAnalyticsResponse)
def get_inventory_analytics(
    user: Users = Depends(get_current_admin_user),
    west: float | None = Query(default=None, description="BBox west longitude (default NYC metro)"),
    south: float | None = Query(default=None),
    east: float | None = Query(default=None),
    north: float | None = Query(default=None),
    available_only: bool = Query(
        default=True,
        description="When true, count only rows deemed available (availability_status and/or rent).",
    ),
) -> InventoryAnalyticsResponse:
    _ = user
    w = NYC_METRO_BBOX_DEFAULT["west"] if west is None else west
    so = NYC_METRO_BBOX_DEFAULT["south"] if south is None else south
    e = NYC_METRO_BBOX_DEFAULT["east"] if east is None else east
    n = NYC_METRO_BBOX_DEFAULT["north"] if north is None else north
    try:
        validate_bbox(w, so, e, n)
    except ValueError as ex:
        raise HTTPException(status_code=422, detail=str(ex)) from ex

    qtable = _qualified_table()
    db_url = (Config.get("DATABASE_URL") or "").strip()
    if not db_url or not qtable:
        raise HTTPException(status_code=503, detail="Listings database not configured")

    if engine.dialect.name != "postgresql":
        raise HTTPException(status_code=503, detail="Unsupported database dialect")

    schema_kw = (listing_table_schema or "").strip() or None
    schema_for_info = schema_kw if schema_kw else "public"
    tname = (listing_table_name or "").strip()

    try:
        with engine.connect() as conn:
            insp = inspect(conn)
            if not insp.has_table(tname, schema=schema_kw):
                raise HTTPException(status_code=503, detail="Listings table missing")

            try:
                return run_inventory_analytics(
                    conn,
                    qtable=qtable,
                    tname=tname,
                    schema_for_info=schema_for_info,
                    west=w,
                    south=so,
                    east=e,
                    north=n,
                    available_only=available_only,
                )
            except ValueError as ex:
                raise HTTPException(status_code=501, detail=str(ex)) from ex
    except HTTPException:
        raise
    except Exception:
        logger.exception("admin/inventory-analytics failed")
        raise HTTPException(status_code=500, detail="Analytics query failed")
