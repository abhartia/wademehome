"""Endpoints for users adding properties the scraper pipeline hasn't picked up."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from core.logger import get_logger
from db.models import PropertyFavorites, TourStatus, UserTours, Users
from user_listings.schemas import (
    CreateUserListingRequest,
    CreateUserListingResponse,
    DedupeCheckRequest,
    DedupeCheckResponse,
    ParseUrlRequest,
    ParseUrlResponse,
    VisibilityUpdateRequest,
)
from user_listings.service import (
    create_user_listing,
    delete_user_listing,
    run_dedupe,
    set_visibility,
)
from user_listings.url_parser import parse_listing_paste, parse_listing_url

logger = get_logger(__name__)

router = APIRouter(prefix="/user-listings", tags=["user-listings"])


@router.post("/parse-url", response_model=ParseUrlResponse)
async def parse_url(
    payload: ParseUrlRequest,
    _user: Users = Depends(get_current_user),
) -> ParseUrlResponse:
    text = (payload.text or "").strip()
    if text:
        prefill, parsed = await parse_listing_paste(text)
    elif payload.url is not None:
        prefill, parsed = await parse_listing_url(str(payload.url))
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide `text` (a pasted share message) or `url`.",
        )
    return ParseUrlResponse(prefill=prefill, parsed=parsed)


@router.post("/dedupe-check", response_model=DedupeCheckResponse)
def dedupe_check(
    payload: DedupeCheckRequest,
    user: Users = Depends(get_current_user),
) -> DedupeCheckResponse:
    matches = run_dedupe(
        latitude=payload.latitude,
        longitude=payload.longitude,
        address=payload.address if not payload.unit else f"{payload.address} {payload.unit}",
        current_user_id=user.id,
        visibility_scope="private_add",
    )
    return DedupeCheckResponse(matches=matches)


@router.post(
    "",
    response_model=CreateUserListingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_listing(
    payload: CreateUserListingRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CreateUserListingResponse:
    created = create_user_listing(payload, user.id)

    # Auto-favorite so the user sees it in their favorites/search UI.
    existing_fav = (
        db.query(PropertyFavorites)
        .filter(
            PropertyFavorites.user_id == user.id,
            PropertyFavorites.group_id.is_(None),
            PropertyFavorites.property_key == created.property_key,
        )
        .one_or_none()
    )
    if existing_fav is None:
        db.add(
            PropertyFavorites(
                user_id=user.id,
                group_id=None,
                property_key=created.property_key,
                property_name=created.name,
                property_address=created.address,
            )
        )

    # Also drop a saved-status tour so the property shows in the Saved tab of /tours.
    existing_tour = (
        db.query(UserTours)
        .filter(
            UserTours.user_id == user.id,
            UserTours.property_ref_id == created.property_key,
        )
        .one_or_none()
    )
    if existing_tour is None:
        db.add(
            UserTours(
                user_id=user.id,
                property_ref_id=created.property_key,
                property_name=created.name,
                property_address=created.address,
                property_image=created.image_url,
                property_price=payload.price,
                property_beds=payload.beds,
                property_tags=["User-added"],
                status=TourStatus.saved,
            )
        )
    db.commit()

    return CreateUserListingResponse(
        property_key=created.property_key,
        name=created.name,
        address=created.address,
        latitude=created.latitude,
        longitude=created.longitude,
        image_url=created.image_url,
        visibility="private",
    )


@router.patch("/{property_key}/visibility", response_model=CreateUserListingResponse)
def update_visibility(
    property_key: str,
    payload: VisibilityUpdateRequest,
    user: Users = Depends(get_current_user),
) -> CreateUserListingResponse:
    applied, _ = set_visibility(
        property_key=property_key,
        user_id=user.id,
        new_visibility=payload.visibility,
    )
    # Minimal response — caller already has the rest of the listing state client-side.
    return CreateUserListingResponse(
        property_key=property_key,
        name="",
        address="",
        latitude=0.0,
        longitude=0.0,
        image_url=None,
        visibility=applied,  # type: ignore[arg-type]
    )


@router.delete(
    "/{property_key}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
)
def delete_listing(
    property_key: str,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    delete_user_listing(property_key=property_key, user_id=user.id)
    # Cascade-remove the user's favorite + saved tour, so the saved tab updates.
    db.query(PropertyFavorites).filter(
        PropertyFavorites.user_id == user.id,
        PropertyFavorites.property_key == property_key,
    ).delete(synchronize_session=False)
    db.query(UserTours).filter(
        UserTours.user_id == user.id,
        UserTours.property_ref_id == property_key,
    ).delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
