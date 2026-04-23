from __future__ import annotations

import uuid
from datetime import date

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from groups.deps import resolve_scope
from tours.schemas import (
    TourCreate,
    TourMediaPayload,
    TourNoteUpsert,
    TourResponse,
    ToursListResponse,
    TourSortParams,
    TourUpdate,
)
from tours.service import (
    create_tour,
    delete_tour,
    delete_tour_media,
    get_tour_payload,
    list_tours,
    update_tour,
    upload_tour_media,
    upsert_tour_note,
)

router = APIRouter(prefix="/tours", tags=["tours"])


@router.get("", response_model=ToursListResponse)
def read_tours(
    status: str | None = Query(default=None),
    from_date: date | None = Query(default=None),
    to_date: date | None = Query(default=None),
    q: str | None = Query(default=None),
    group_id: uuid.UUID | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    sort: str = Query(default="created_at_desc"),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, scope_group_id = resolve_scope(group_id, user, db)
    params = TourSortParams(
        status=status,
        from_date=from_date,
        to_date=to_date,
        q=q,
        group_id=scope_group_id,
        limit=limit,
        offset=offset,
        sort=sort,
    )
    tours, total = list_tours(db, user.id, params)
    return ToursListResponse(tours=tours, total=total)


@router.get("/{tour_id}", response_model=TourResponse)
def read_tour(tour_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    tour = get_tour_payload(db, user.id, tour_id)
    return TourResponse(tour=tour)


@router.post("", response_model=TourResponse)
def create_tour_route(payload: TourCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    _, scope_group_id = resolve_scope(payload.group_id, user, db)
    payload.group_id = scope_group_id
    tour = create_tour(db, user.id, payload)
    return TourResponse(tour=tour)


@router.patch("/{tour_id}", response_model=TourResponse)
def update_tour_route(
    tour_id: uuid.UUID,
    payload: TourUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tour = update_tour(db, user.id, tour_id, payload)
    return TourResponse(tour=tour)


@router.delete("/{tour_id}", status_code=204)
def delete_tour_route(tour_id: uuid.UUID, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_tour(db, user.id, tour_id)
    return None


@router.put("/{tour_id}/note", response_model=TourResponse)
def upsert_tour_note_route(
    tour_id: uuid.UUID,
    payload: TourNoteUpsert,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tour = upsert_tour_note(db, user.id, tour_id, payload.note)
    return TourResponse(tour=tour)


@router.post("/{tour_id}/media", response_model=TourMediaPayload)
def upload_tour_media_route(
    tour_id: uuid.UUID,
    file: UploadFile = File(...),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return upload_tour_media(db, user.id, tour_id, file)


@router.delete("/{tour_id}/media/{media_id}", status_code=204)
def delete_tour_media_route(
    tour_id: uuid.UUID,
    media_id: uuid.UUID,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_tour_media(db, user.id, tour_id, media_id)
    return None
