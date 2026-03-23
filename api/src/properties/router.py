from sqlalchemy import select
from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends

from auth.router import get_current_user, get_db
from db.models import PropertyFavorites, PropertyNotes, Users
from properties.schemas import (
    FavoriteListResponse,
    FavoriteResponse,
    FavoriteToggleRequest,
    FavoriteToggleResponse,
    PropertyNoteGetResponse,
    PropertyNoteResponse,
    PropertyNoteUpsertRequest,
    TourRequestCreate,
    TourRequestCreateResponse,
)
from tours.service import create_saved_tour_for_property

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/favorites", response_model=FavoriteListResponse)
def list_favorites(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.execute(
        select(PropertyFavorites)
        .where(PropertyFavorites.user_id == user.id)
        .order_by(PropertyFavorites.created_at.desc())
    ).scalars()
    return FavoriteListResponse(
        favorites=[
            FavoriteResponse(
                property_key=row.property_key,
                property_name=row.property_name,
                property_address=row.property_address,
                created_at=row.created_at,
            )
            for row in rows
        ]
    )


@router.post("/favorites/toggle", response_model=FavoriteToggleResponse)
def toggle_favorite(
    payload: FavoriteToggleRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.execute(
        select(PropertyFavorites).where(
            PropertyFavorites.user_id == user.id,
            PropertyFavorites.property_key == payload.property_key,
        )
    ).scalar_one_or_none()
    if existing:
        db.delete(existing)
        db.commit()
        return FavoriteToggleResponse(favorited=False)

    db.add(
        PropertyFavorites(
            user_id=user.id,
            property_key=payload.property_key,
            property_name=payload.property_name,
            property_address=payload.property_address,
        )
    )
    db.commit()
    return FavoriteToggleResponse(favorited=True)


@router.get("/notes/{property_key}", response_model=PropertyNoteGetResponse)
def get_property_note(
    property_key: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    existing = db.execute(
        select(PropertyNotes).where(
            PropertyNotes.user_id == user.id, PropertyNotes.property_key == property_key
        )
    ).scalar_one_or_none()

    if not existing:
        return PropertyNoteGetResponse(note=None)

    return PropertyNoteGetResponse(
        note=PropertyNoteResponse(
            property_key=existing.property_key,
            note=existing.note,
            updated_at=existing.updated_at,
        )
    )


@router.put("/notes/{property_key}", response_model=PropertyNoteGetResponse)
def upsert_property_note(
    property_key: str,
    payload: PropertyNoteUpsertRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.execute(
        select(PropertyNotes).where(
            PropertyNotes.user_id == user.id, PropertyNotes.property_key == property_key
        )
    ).scalar_one_or_none()
    if existing:
        existing.note = payload.note
    else:
        existing = PropertyNotes(user_id=user.id, property_key=property_key, note=payload.note)
        db.add(existing)

    db.commit()
    db.refresh(existing)
    return PropertyNoteGetResponse(
        note=PropertyNoteResponse(
            property_key=existing.property_key,
            note=existing.note,
            updated_at=existing.updated_at,
        )
    )


@router.post("/tour-requests", response_model=TourRequestCreateResponse)
def create_tour_request(
    payload: TourRequestCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tour = create_saved_tour_for_property(
        db,
        user.id,
        property_key=payload.property_key,
        property_name=payload.property_name,
        property_address=payload.property_address,
        property_image=payload.property_image,
        property_price=payload.property_price,
        property_beds=payload.property_beds,
        property_tags=payload.property_tags,
        requested_date=payload.requested_date,
        requested_time=payload.requested_time,
    )
    return TourRequestCreateResponse(id=tour.id)
