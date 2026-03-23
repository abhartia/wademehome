from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from db.models import (
    RoommateConnectionStatus,
    RoommateConnections,
    RoommateMessages,
    RoommateProfiles,
    UserProfiles,
)
from roommates.schemas import (
    MyRoommateProfileOut,
    MyRoommateProfilePatch,
    RoommateConnectionCreate,
    RoommateConnectionOut,
    RoommateMessagePayload,
    RoommateProfilePayload,
)


def _parse_dt(raw: str | None) -> datetime:
    if raw and raw.strip():
        try:
            return datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            pass
    return datetime.now(timezone.utc)


def _profile_payload_from_snapshot(data: dict) -> RoommateProfilePayload:
    return RoommateProfilePayload(
        id=str(data.get("id", "")),
        name=str(data.get("name", "")),
        age=int(data.get("age", 0)),
        occupation=str(data.get("occupation", "")),
        bio=str(data.get("bio", "")),
        avatar_initials=str(data.get("avatar_initials", "")),
        sleep_schedule=str(data.get("sleep_schedule", "")),
        cleanliness_level=str(data.get("cleanliness_level", "")),
        noise_level=str(data.get("noise_level", "")),
        guest_policy=str(data.get("guest_policy", "")),
        smoking=str(data.get("smoking", "")),
        languages_spoken=list(data.get("languages_spoken") or []),
        target_city=str(data.get("target_city", "")),
        max_budget=str(data.get("max_budget", "")),
        move_timeline=str(data.get("move_timeline", "")),
        bedrooms_wanted=str(data.get("bedrooms_wanted", "")),
        has_pets=bool(data.get("has_pets", False)),
        pet_details=str(data.get("pet_details", "")),
        interests=list(data.get("interests") or []),
        university=data.get("university"),
        compatibility_score=data.get("compatibility_score"),
        compatibility_reasons=list(data.get("compatibility_reasons") or []),
    )


def read_my_profile(db: Session, user_id: uuid.UUID) -> MyRoommateProfileOut:
    row = db.execute(select(RoommateProfiles).where(RoommateProfiles.user_id == user_id)).scalar_one_or_none()
    if row is None:
        return MyRoommateProfileOut()
    return MyRoommateProfileOut(
        name=row.name or "",
        age=row.age or 0,
        occupation=row.occupation or "",
        sleep_schedule=row.sleep_schedule or "",
        cleanliness_level=row.cleanliness_level or "",
        noise_level=row.noise_level or "",
        guest_policy=row.guest_policy or "",
        smoking=row.smoking or "",
        languages_spoken=list(row.languages_spoken or []),
        preferred_languages=list(row.preferred_languages or []),
        must_have_preferred_languages=row.must_have_preferred_languages,
        interests=list(row.interests or []),
        bio=row.bio or "",
        profile_completed=row.profile_completed,
    )


def patch_my_profile(
    db: Session, user_id: uuid.UUID, body: MyRoommateProfilePatch
) -> MyRoommateProfileOut:
    row = db.execute(select(RoommateProfiles).where(RoommateProfiles.user_id == user_id)).scalar_one_or_none()
    if row is None:
        row = RoommateProfiles(user_id=user_id)
        db.add(row)
        db.flush()
    data = body.model_dump(exclude_unset=True)
    for key, val in data.items():
        if hasattr(row, key):
            setattr(row, key, val)
    db.commit()
    db.refresh(row)
    return read_my_profile(db, user_id)


def list_connections(db: Session, user_id: uuid.UUID) -> list[RoommateConnectionOut]:
    rows = db.execute(
        select(RoommateConnections).where(RoommateConnections.user_id == user_id)
    ).scalars().all()
    out: list[RoommateConnectionOut] = []
    for row in rows:
        messages = db.execute(
            select(RoommateMessages)
            .where(RoommateMessages.connection_id == row.id)
            .order_by(RoommateMessages.created_at.asc())
        ).scalars().all()
        out.append(
            RoommateConnectionOut(
                id=str(row.id),
                roommate=_profile_payload_from_snapshot(row.roommate_snapshot_json or {}),
                connected_at=row.connected_at.isoformat() if row.connected_at else "",
                messages=[
                    RoommateMessagePayload(
                        role=m.sender_role,
                        content=m.content,
                        time=m.created_at.isoformat() if m.created_at else "",
                    )
                    for m in messages
                ],
            )
        )
    return out


def create_connection(
    db: Session, user_id: uuid.UUID, body: RoommateConnectionCreate
) -> RoommateConnectionOut:
    row = RoommateConnections(
        user_id=user_id,
        roommate_ref_id=body.roommate.id,
        roommate_name=body.roommate.name or None,
        roommate_snapshot_json=body.roommate.model_dump(),
        compatibility_score=body.roommate.compatibility_score,
        compatibility_reasons=list(body.roommate.compatibility_reasons or []),
        status=RoommateConnectionStatus.connected,
        connected_at=datetime.now(timezone.utc),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return RoommateConnectionOut(
        id=str(row.id),
        roommate=body.roommate,
        connected_at=row.connected_at.isoformat() if row.connected_at else "",
        messages=[],
    )


def _resolve_connection(db: Session, user_id: uuid.UUID, connection_id: str) -> RoommateConnections | None:
    row = None
    try:
        as_uuid = uuid.UUID(connection_id)
        row = db.execute(
            select(RoommateConnections).where(
                RoommateConnections.user_id == user_id, RoommateConnections.id == as_uuid
            )
        ).scalar_one_or_none()
    except ValueError:
        row = None
    if row is not None:
        return row
    return db.execute(
        select(RoommateConnections).where(
            RoommateConnections.user_id == user_id,
            RoommateConnections.roommate_ref_id == connection_id,
        )
    ).scalar_one_or_none()


def delete_connection(db: Session, user_id: uuid.UUID, connection_id: str) -> None:
    row = _resolve_connection(db, user_id, connection_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(row)
    db.commit()


def create_message(
    db: Session,
    user_id: uuid.UUID,
    connection_id: str,
    message: RoommateMessagePayload,
) -> RoommateMessagePayload:
    connection = _resolve_connection(db, user_id, connection_id)
    if connection is None:
        raise HTTPException(status_code=404, detail="Connection not found")
    row = RoommateMessages(
        connection_id=connection.id,
        sender_role=message.role,
        sender_ref_id=None,
        content=message.content,
        created_at=_parse_dt(message.time),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return RoommateMessagePayload(
        role=row.sender_role,
        content=row.content,
        time=row.created_at.isoformat() if row.created_at else "",
    )


def _budget_distance(a: str, b: str) -> int:
    order = [
        "Under $1,000",
        "$1,000 - $1,500",
        "$1,500 - $2,000",
        "$2,000 - $3,000",
        "$3,000 - $5,000",
        "$5,000+",
    ]
    ia = order.index(a) if a in order else -1
    ib = order.index(b) if b in order else -1
    if ia < 0 or ib < 0:
        return 2
    return abs(ia - ib)


def _avatar_initials(name: str) -> str:
    parts = [part.strip() for part in name.split(" ") if part.strip()]
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][:2].upper()
    return f"{parts[0][0]}{parts[1][0]}".upper()


def list_matches(db: Session, user_id: uuid.UUID) -> list[RoommateProfilePayload]:
    user_profile = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    my = db.execute(select(RoommateProfiles).where(RoommateProfiles.user_id == user_id)).scalar_one_or_none()
    candidate_rows = db.execute(
        select(RoommateProfiles, UserProfiles)
        .join(UserProfiles, RoommateProfiles.user_id == UserProfiles.user_id)
        .where(
            RoommateProfiles.user_id != user_id,
            UserProfiles.roommate_search_enabled.is_(True),
            RoommateProfiles.profile_completed.is_(True),
        )
    ).all()
    out: list[RoommateProfilePayload] = []
    for c, c_user in candidate_rows:
        score = 50
        reasons: list[str] = []
        candidate_languages = {lang.strip().lower() for lang in (c.languages_spoken or []) if lang.strip()}
        preferred_languages = {lang.strip().lower() for lang in (my.preferred_languages or []) if lang.strip()} if my else set()
        if my and my.must_have_preferred_languages and preferred_languages:
            if candidate_languages.isdisjoint(preferred_languages):
                continue
        preferred = list(user_profile.preferred_cities or []) if user_profile else []
        candidate_city = (
            (list(c_user.preferred_cities or [])[0] if list(c_user.preferred_cities or []) else "")
            or (c_user.current_city or "")
        )
        if preferred and candidate_city and any(city.lower() == candidate_city.lower() for city in preferred):
            score += 15
            reasons.append(f"Both looking in {candidate_city}")
        if user_profile and user_profile.max_monthly_rent:
            dist = _budget_distance(user_profile.max_monthly_rent, c_user.max_monthly_rent or "")
            if dist == 0:
                score += 10
            elif dist == 1:
                score += 5
            elif dist >= 3:
                score -= 10
        if my and my.sleep_schedule and c.sleep_schedule in (my.sleep_schedule, "flexible"):
            score += 8
        if preferred_languages and candidate_languages:
            shared_languages = sorted(candidate_languages.intersection(preferred_languages))
            if shared_languages:
                score += 12
                reasons.append(
                    "Shared language preferences: "
                    + ", ".join(lang.title() for lang in shared_languages[:2])
                )
        score = max(15, min(98, score))
        out.append(
            RoommateProfilePayload(
                id=str(c.user_id),
                name=c.name or "",
                age=c.age or 0,
                occupation=c.occupation or "",
                bio=c.bio,
                avatar_initials=_avatar_initials(c.name or ""),
                sleep_schedule=c.sleep_schedule,
                cleanliness_level=c.cleanliness_level,
                noise_level=c.noise_level,
                guest_policy=c.guest_policy,
                smoking=c.smoking,
                languages_spoken=list(c.languages_spoken or []),
                target_city=candidate_city,
                max_budget=c_user.max_monthly_rent or "",
                move_timeline=c_user.move_timeline or "",
                bedrooms_wanted=c_user.bedrooms_needed or "",
                has_pets=c_user.has_pets,
                pet_details=c_user.pet_details or "",
                interests=list(c.interests or []),
                university=None,
                compatibility_score=score,
                compatibility_reasons=reasons[:3],
            )
        )
    out.sort(key=lambda x: x.compatibility_score or 0, reverse=True)
    return out

