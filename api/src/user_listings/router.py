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
    PasteCreateRequest,
    PasteCreateResponse,
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


def _perform_create(
    payload: CreateUserListingRequest, user: Users, db: Session
) -> CreateUserListingResponse:
    """Shared by POST / and POST /paste — listing insert + favorite + saved tour.

    Respects payload.group_id so the favorite entry is scoped to the sidebar's
    active group when the user is working in a group context. The underlying
    listings row is still per-user (contributed_by_user_id); group scoping only
    affects the PropertyFavorites link so the /saved view filters correctly.
    """
    created = create_user_listing(payload, user.id)

    # Normalize empty-string to None — a blank sidebar selection should not land
    # as an unknown group_id in the DB.
    fav_group_id = (payload.group_id or None) if payload.group_id else None

    fav_filters = [
        PropertyFavorites.user_id == user.id,
        PropertyFavorites.property_key == created.property_key,
    ]
    if fav_group_id is None:
        fav_filters.append(PropertyFavorites.group_id.is_(None))
    else:
        fav_filters.append(PropertyFavorites.group_id == fav_group_id)

    existing_fav = db.query(PropertyFavorites).filter(*fav_filters).one_or_none()
    if existing_fav is None:
        db.add(
            PropertyFavorites(
                user_id=user.id,
                group_id=fav_group_id,
                property_key=created.property_key,
                property_name=created.name,
                property_address=created.address,
            )
        )

    tour_filters = [
        UserTours.user_id == user.id,
        UserTours.property_ref_id == created.property_key,
    ]
    if fav_group_id is None:
        tour_filters.append(UserTours.group_id.is_(None))
    else:
        tour_filters.append(UserTours.group_id == fav_group_id)
    existing_tour = db.query(UserTours).filter(*tour_filters).one_or_none()
    if existing_tour is None:
        db.add(
            UserTours(
                user_id=user.id,
                group_id=fav_group_id,
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
    return _perform_create(payload, user, db)


@router.post("/paste", response_model=PasteCreateResponse)
async def paste_and_create(
    payload: PasteCreateRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PasteCreateResponse:
    """Fire-and-forget endpoint: parse + geocode + dedupe-check + create in one call.

    Returns one of three outcomes so the client can show a terminal state per
    queued paste without extra round trips:
      * listing populated → saved
      * dedupe_matches non-empty → user must confirm (retry with force=True)
      * parse_error populated → couldn't recover an address / coords
    """
    text = (payload.text or "").strip()
    if not text:
        return PasteCreateResponse(parse_error="Nothing to parse.")

    prefill, parsed = await parse_listing_paste(text)
    if not parsed or not prefill.address:
        return PasteCreateResponse(
            parse_error="Couldn't extract an address from that paste.",
        )
    if prefill.latitude is None or prefill.longitude is None:
        return PasteCreateResponse(
            parse_error="Got an address but couldn't geocode it. Try a more specific address.",
        )

    if not payload.force:
        matches = run_dedupe(
            latitude=prefill.latitude,
            longitude=prefill.longitude,
            address=prefill.address,
            current_user_id=user.id,
            visibility_scope="private_add",
        )
        if matches:
            return PasteCreateResponse(dedupe_matches=matches)

    create_payload = CreateUserListingRequest(
        name=prefill.name or prefill.address,
        address=prefill.address,
        unit=prefill.unit,
        city=prefill.city,
        state=prefill.state,
        zipcode=prefill.zipcode,
        latitude=prefill.latitude,
        longitude=prefill.longitude,
        price=prefill.price,
        beds=prefill.beds,
        baths=prefill.baths,
        source_url=prefill.source_url,
        image_url=prefill.image_url,
        group_id=payload.group_id,
    )
    try:
        created = _perform_create(create_payload, user, db)
    except HTTPException as exc:
        # Exact property_key collision is rare but real (same address saved twice
        # in quick succession) — surface as a parse_error so the chip can show it.
        detail = exc.detail
        message = (
            detail.get("message")
            if isinstance(detail, dict) and "message" in detail
            else str(detail)
        )
        return PasteCreateResponse(parse_error=message or "Could not save listing.")

    return PasteCreateResponse(listing=created)


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
