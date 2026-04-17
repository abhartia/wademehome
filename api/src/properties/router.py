import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session, aliased

from fastapi import APIRouter, Depends, HTTPException, Query

from auth.router import get_current_user, get_db
from auth.emailer import send_tour_request_email
from core.config import Config
from db.models import PropertyFavorites, PropertyNotes, PropertyReactions, Users
from groups.deps import resolve_scope
from properties.schemas import (
    FavoriteListResponse,
    FavoriteResponse,
    FavoriteToggleRequest,
    FavoriteToggleResponse,
    CommentedPropertiesListResponse,
    CommentedPropertyResponse,
    GroupNoteCreateRequest,
    GroupNoteResponse,
    GroupNotesListResponse,
    PropertyNoteGetResponse,
    PropertyNoteResponse,
    PropertyNoteUpsertRequest,
    ReactionEntry,
    ReactionListResponse,
    ReactionToggleRequest,
    ReactionToggleResponse,
    TourRequestCreate,
    TourRequestCreateResponse,
)
from tours.service import create_saved_tour_for_property

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("/favorites", response_model=FavoriteListResponse)
def list_favorites(
    group_id: uuid.UUID | None = Query(default=None),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, scope_group_id = resolve_scope(group_id, user, db)
    stmt = (
        select(PropertyFavorites, Users.email)
        .join(Users, Users.id == PropertyFavorites.user_id, isouter=True)
        .order_by(PropertyFavorites.created_at.desc())
    )
    if scope_group_id is None:
        stmt = stmt.where(
            PropertyFavorites.user_id == user.id,
            PropertyFavorites.group_id.is_(None),
        )
    else:
        stmt = stmt.where(PropertyFavorites.group_id == scope_group_id)

    rows = db.execute(stmt).all()
    return FavoriteListResponse(
        favorites=[
            FavoriteResponse(
                property_key=row.PropertyFavorites.property_key,
                property_name=row.PropertyFavorites.property_name,
                property_address=row.PropertyFavorites.property_address,
                created_at=row.PropertyFavorites.created_at,
                added_by_user_id=row.PropertyFavorites.user_id,
                added_by_email=row.email,
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
    _, scope_group_id = resolve_scope(payload.group_id, user, db)

    if scope_group_id is None:
        existing = db.execute(
            select(PropertyFavorites).where(
                PropertyFavorites.user_id == user.id,
                PropertyFavorites.group_id.is_(None),
                PropertyFavorites.property_key == payload.property_key,
            )
        ).scalar_one_or_none()
    else:
        existing = db.execute(
            select(PropertyFavorites).where(
                PropertyFavorites.group_id == scope_group_id,
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
            group_id=scope_group_id,
            property_key=payload.property_key,
            property_name=payload.property_name,
            property_address=payload.property_address,
        )
    )
    db.commit()
    return FavoriteToggleResponse(favorited=True)


@router.get("/notes/{property_key}", response_model=PropertyNoteGetResponse)
def get_property_note(
    property_key: str,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.execute(
        select(PropertyNotes).where(
            PropertyNotes.user_id == user.id,
            PropertyNotes.group_id.is_(None),
            PropertyNotes.property_key == property_key,
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
            PropertyNotes.user_id == user.id,
            PropertyNotes.group_id.is_(None),
            PropertyNotes.property_key == property_key,
        )
    ).scalar_one_or_none()
    if existing:
        existing.note = payload.note
    else:
        existing = PropertyNotes(
            user_id=user.id, property_key=property_key, note=payload.note
        )
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


@router.get("/commented", response_model=CommentedPropertiesListResponse)
def list_commented_properties(
    group_id: uuid.UUID = Query(...),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resolve_scope(group_id, user, db)
    agg = (
        select(
            PropertyNotes.property_key.label("property_key"),
            func.count(PropertyNotes.id).label("note_count"),
            func.max(PropertyNotes.updated_at).label("latest_at"),
        )
        .where(PropertyNotes.group_id == group_id)
        .group_by(PropertyNotes.property_key)
        .subquery()
    )
    latest_note = aliased(PropertyNotes)
    rows = db.execute(
        select(
            agg.c.property_key,
            agg.c.note_count,
            agg.c.latest_at,
            PropertyFavorites.property_name,
            PropertyFavorites.property_address,
            latest_note.note,
            Users.email.label("author_email"),
        )
        .join(
            latest_note,
            (latest_note.group_id == group_id)
            & (latest_note.property_key == agg.c.property_key)
            & (latest_note.updated_at == agg.c.latest_at),
        )
        .join(Users, Users.id == latest_note.user_id)
        .join(
            PropertyFavorites,
            (PropertyFavorites.property_key == agg.c.property_key)
            & (PropertyFavorites.group_id == group_id),
            isouter=True,
        )
        .order_by(agg.c.latest_at.desc())
    ).all()
    seen: set[str] = set()
    properties: list[CommentedPropertyResponse] = []
    for row in rows:
        # Guard against duplicate latest-note rows when two notes share the same
        # max(updated_at) for a property_key — take the first and skip the rest.
        if row.property_key in seen:
            continue
        seen.add(row.property_key)
        preview = row.note or ""
        if len(preview) > 240:
            preview = preview[:237] + "…"
        properties.append(
            CommentedPropertyResponse(
                property_key=row.property_key,
                property_name=row.property_name,
                property_address=row.property_address,
                note_count=row.note_count,
                latest_note_at=row.latest_at,
                latest_note_preview=preview,
                latest_note_author_email=row.author_email,
            )
        )
    return CommentedPropertiesListResponse(properties=properties)


@router.get("/group-notes/{property_key}", response_model=GroupNotesListResponse)
def list_group_notes(
    property_key: str,
    group_id: uuid.UUID = Query(...),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resolve_scope(group_id, user, db)
    rows = db.execute(
        select(PropertyNotes, Users.email)
        .join(Users, Users.id == PropertyNotes.user_id)
        .where(
            PropertyNotes.group_id == group_id,
            PropertyNotes.property_key == property_key,
        )
        .order_by(PropertyNotes.created_at.asc())
    ).all()
    return GroupNotesListResponse(
        notes=[
            GroupNoteResponse(
                id=row.PropertyNotes.id,
                property_key=row.PropertyNotes.property_key,
                note=row.PropertyNotes.note,
                author_user_id=row.PropertyNotes.user_id,
                author_email=row.email,
                created_at=row.PropertyNotes.created_at,
                updated_at=row.PropertyNotes.updated_at,
            )
            for row in rows
        ]
    )


@router.post("/group-notes", response_model=GroupNoteResponse)
def create_group_note(
    payload: GroupNoteCreateRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resolve_scope(payload.group_id, user, db)
    note = PropertyNotes(
        user_id=user.id,
        group_id=payload.group_id,
        property_key=payload.property_key,
        note=payload.note,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return GroupNoteResponse(
        id=note.id,
        property_key=note.property_key,
        note=note.note,
        author_user_id=note.user_id,
        author_email=user.email,
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


@router.delete("/group-notes/{note_id}", status_code=204)
def delete_group_note(
    note_id: uuid.UUID,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    note = db.get(PropertyNotes, note_id)
    if note is None or note.group_id is None:
        raise HTTPException(status_code=404, detail="Note not found")
    resolve_scope(note.group_id, user, db)
    if note.user_id != user.id:
        raise HTTPException(status_code=403, detail="Only the author can delete")
    db.delete(note)
    db.commit()
    return None


@router.get("/reactions/{property_key}", response_model=ReactionListResponse)
def list_reactions(
    property_key: str,
    group_id: uuid.UUID = Query(...),
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resolve_scope(group_id, user, db)
    rows = db.execute(
        select(PropertyReactions, Users.email)
        .join(Users, Users.id == PropertyReactions.user_id)
        .where(
            PropertyReactions.group_id == group_id,
            PropertyReactions.property_key == property_key,
        )
        .order_by(PropertyReactions.created_at.asc())
    ).all()
    return ReactionListResponse(
        reactions=[
            ReactionEntry(
                user_id=r.PropertyReactions.user_id,
                email=r.email,
                reaction=r.PropertyReactions.reaction,
                created_at=r.PropertyReactions.created_at,
            )
            for r in rows
        ]
    )


@router.post("/reactions/toggle", response_model=ReactionToggleResponse)
def toggle_reaction(
    payload: ReactionToggleRequest,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resolve_scope(payload.group_id, user, db)
    existing = db.execute(
        select(PropertyReactions).where(
            PropertyReactions.group_id == payload.group_id,
            PropertyReactions.user_id == user.id,
            PropertyReactions.property_key == payload.property_key,
            PropertyReactions.reaction == payload.reaction,
        )
    ).scalar_one_or_none()
    if existing:
        db.delete(existing)
        db.commit()
        return ReactionToggleResponse(active=False)
    db.add(
        PropertyReactions(
            group_id=payload.group_id,
            user_id=user.id,
            property_key=payload.property_key,
            reaction=payload.reaction,
        )
    )
    db.commit()
    return ReactionToggleResponse(active=True)


@router.post("/tour-requests", response_model=TourRequestCreateResponse)
def create_tour_request(
    payload: TourRequestCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, scope_group_id = resolve_scope(payload.group_id, user, db)
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
        group_id=scope_group_id,
    )
    ops_email = (Config.get("TOUR_REQUEST_OPS_EMAIL", "") or "").strip()
    if not ops_email:
        raise HTTPException(
            status_code=503,
            detail="Tour request email is unavailable. Missing TOUR_REQUEST_OPS_EMAIL configuration.",
        )
    try:
        send_tour_request_email(
            to_email=ops_email,
            renter_email=user.email,
            property_name=payload.property_name,
            property_address=payload.property_address,
            requested_date=payload.requested_date,
            requested_time=payload.requested_time,
            request_message=payload.request_message,
        )
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return TourRequestCreateResponse(id=tour.id)
