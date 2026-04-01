from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy.orm import Session

from auth.router import get_current_property_manager_or_admin, get_db
from core.env_utils import env_manager
from db.models import Users
from listings.schemas import NearbyListingsResponse
from property_manager.schemas import (
    ReportPreviewRequest,
    ReportSubscriptionCreate,
    ReportSubscriptionResponse,
    ReportSubscriptionUpdate,
    WeeklySendResponse,
)
from property_manager import service as pm_service

router = APIRouter(prefix="/property-manager", tags=["property-manager"])


@router.get("/report-subscriptions", response_model=list[ReportSubscriptionResponse])
def list_report_subscriptions(
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_property_manager_or_admin),
) -> list[ReportSubscriptionResponse]:
    return pm_service.list_subscriptions(db, user.id)


@router.post("/report-subscriptions", response_model=ReportSubscriptionResponse)
def create_report_subscription(
    payload: ReportSubscriptionCreate,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_property_manager_or_admin),
) -> ReportSubscriptionResponse:
    return pm_service.create_subscription(db, user.id, payload)


@router.patch("/report-subscriptions/{subscription_id}", response_model=ReportSubscriptionResponse)
def patch_report_subscription(
    subscription_id: uuid.UUID,
    payload: ReportSubscriptionUpdate,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_property_manager_or_admin),
) -> ReportSubscriptionResponse:
    out = pm_service.update_subscription(db, user.id, subscription_id, payload)
    if not out:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return out


@router.delete("/report-subscriptions/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report_subscription(
    subscription_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_property_manager_or_admin),
) -> Response:
    if not pm_service.delete_subscription(db, user.id, subscription_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/report-subscriptions/preview", response_model=NearbyListingsResponse)
def preview_report_payload(
    payload: ReportPreviewRequest,
    _: Users = Depends(get_current_property_manager_or_admin),
) -> NearbyListingsResponse:
    return pm_service.preview_nearby(
        payload.center_latitude,
        payload.center_longitude,
        payload.radius_miles,
        payload.limit,
    )


@router.post("/report-subscriptions/{subscription_id}/send-now", response_model=ReportSubscriptionResponse)
def send_report_subscription_now(
    subscription_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_property_manager_or_admin),
) -> ReportSubscriptionResponse:
    try:
        return pm_service.send_subscription_report_now(db, user.id, subscription_id)
    except KeyError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


internal_router = APIRouter(prefix="/internal/property-manager", tags=["internal-property-manager"])


def _verify_cron_secret(x_internal_cron_secret: str | None = Header(default=None)) -> None:
    expected = (env_manager.get("INTERNAL_CRON_SECRET", "") or "").strip()
    if not expected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="INTERNAL_CRON_SECRET is not configured",
        )
    got = (x_internal_cron_secret or "").strip()
    if got != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid cron secret")


@internal_router.post("/reports/send-weekly", response_model=WeeklySendResponse)
def send_weekly_reports(
    db: Session = Depends(get_db),
    _: None = Depends(_verify_cron_secret),
) -> WeeklySendResponse:
    sent, failed = pm_service.send_weekly_reports_for_all_active(db)
    return WeeklySendResponse(sent=sent, failed=failed)
