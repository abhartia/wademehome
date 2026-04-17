from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from db.models import (
    GroupMembers,
    Groups,
    RoommateConnectionStatus,
    RoommateConnections,
    RoommateMessages,
    RoommateProfiles,
    UserProfiles,
    Users,
)
from groups.service import (
    create_email_invite,
    invite_to_response,
)
from roommates.schemas import (
    CreateGroupFromConnectionResponse,
    InviteConnectionToGroupResponse,
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


_BUDGET_ORDER = [
    "Under $1,000",
    "$1,000 - $1,500",
    "$1,500 - $2,000",
    "$2,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000+",
]


def _budget_distance(a: str, b: str) -> int:
    ia = _BUDGET_ORDER.index(a) if a in _BUDGET_ORDER else -1
    ib = _BUDGET_ORDER.index(b) if b in _BUDGET_ORDER else -1
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


def _min_budget(values: list[str]) -> str:
    """Pick the most restrictive (lowest-bracket) budget from a list."""
    indexed = [(_BUDGET_ORDER.index(v), v) for v in values if v in _BUDGET_ORDER]
    if not indexed:
        return ""
    indexed.sort()
    return indexed[0][1]


def _build_group_preferences(
    db: Session, group_id: uuid.UUID
) -> tuple[list[uuid.UUID], list[str], str, set[str], bool]:
    """Returns (member_user_ids, preferred_cities, max_monthly_rent, preferred_languages, must_have_languages)."""
    member_rows = db.execute(
        select(GroupMembers.user_id).where(GroupMembers.group_id == group_id)
    ).all()
    member_ids = [r[0] for r in member_rows]
    if not member_ids:
        return [], [], "", set(), False

    user_profiles = db.execute(
        select(UserProfiles).where(UserProfiles.user_id.in_(member_ids))
    ).scalars().all()
    rm_profiles = db.execute(
        select(RoommateProfiles).where(RoommateProfiles.user_id.in_(member_ids))
    ).scalars().all()

    city_sets: list[set[str]] = []
    budgets: list[str] = []
    for up in user_profiles:
        cities = {c.strip() for c in (up.preferred_cities or []) if c and c.strip()}
        if cities:
            city_sets.append(cities)
        if up.max_monthly_rent:
            budgets.append(up.max_monthly_rent)

    if city_sets:
        intersection = set.intersection(*city_sets)
        union = set.union(*city_sets)
        combined_cities = sorted(intersection) if intersection else sorted(union)
    else:
        combined_cities = []

    combined_budget = _min_budget(budgets)

    preferred_languages: set[str] = set()
    must_have = False
    for rp in rm_profiles:
        for lang in rp.preferred_languages or []:
            if lang and lang.strip():
                preferred_languages.add(lang.strip().lower())
        if rp.must_have_preferred_languages:
            must_have = True

    return member_ids, combined_cities, combined_budget, preferred_languages, must_have


def list_matches(
    db: Session, user_id: uuid.UUID, group_id: uuid.UUID | None = None
) -> list[RoommateProfilePayload]:
    user_profile = db.execute(select(UserProfiles).where(UserProfiles.user_id == user_id)).scalar_one_or_none()
    my = db.execute(select(RoommateProfiles).where(RoommateProfiles.user_id == user_id)).scalar_one_or_none()

    excluded_user_ids: set[uuid.UUID] = {user_id}
    group_cities: list[str] = []
    group_budget: str = ""
    group_languages: set[str] = set()
    group_must_have_languages = False
    use_group_scoring = False

    if group_id is not None:
        membership = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == group_id,
                GroupMembers.user_id == user_id,
            )
        ).scalar_one_or_none()
        if membership is None:
            raise HTTPException(status_code=403, detail="Not a member of this group")
        member_ids, group_cities, group_budget, group_languages, group_must_have_languages = (
            _build_group_preferences(db, group_id)
        )
        excluded_user_ids.update(member_ids)
        use_group_scoring = True

    candidate_rows = db.execute(
        select(RoommateProfiles, UserProfiles)
        .join(UserProfiles, RoommateProfiles.user_id == UserProfiles.user_id)
        .where(
            RoommateProfiles.user_id.notin_(excluded_user_ids),
            UserProfiles.roommate_search_enabled.is_(True),
            RoommateProfiles.profile_completed.is_(True),
        )
    ).all()

    if use_group_scoring:
        preferred_cities = group_cities
        max_rent = group_budget
        preferred_languages = group_languages
        must_have_preferred_languages = group_must_have_languages
        city_match_label = "Everyone in your group looking in"
        budget_match_label_fmt = "Matches your group's budget"
        language_label_prefix = "Shared language with your group"
    else:
        preferred_cities = list(user_profile.preferred_cities or []) if user_profile else []
        max_rent = (user_profile.max_monthly_rent if user_profile else "") or ""
        preferred_languages = (
            {lang.strip().lower() for lang in (my.preferred_languages or []) if lang.strip()}
            if my
            else set()
        )
        must_have_preferred_languages = bool(my and my.must_have_preferred_languages)
        city_match_label = "Both looking in"
        budget_match_label_fmt = ""
        language_label_prefix = "Shared language preferences"

    out: list[RoommateProfilePayload] = []
    for c, c_user in candidate_rows:
        score = 50
        reasons: list[str] = []
        candidate_languages = {lang.strip().lower() for lang in (c.languages_spoken or []) if lang.strip()}
        if must_have_preferred_languages and preferred_languages:
            if candidate_languages.isdisjoint(preferred_languages):
                continue
        candidate_city = (
            (list(c_user.preferred_cities or [])[0] if list(c_user.preferred_cities or []) else "")
            or (c_user.current_city or "")
        )
        if preferred_cities and candidate_city and any(
            city.lower() == candidate_city.lower() for city in preferred_cities
        ):
            score += 15
            reasons.append(f"{city_match_label} {candidate_city}")
        if max_rent:
            dist = _budget_distance(max_rent, c_user.max_monthly_rent or "")
            if dist == 0:
                score += 10
                if budget_match_label_fmt:
                    reasons.append(budget_match_label_fmt)
            elif dist == 1:
                score += 5
            elif dist >= 3:
                score -= 10
        if (
            not use_group_scoring
            and my
            and my.sleep_schedule
            and c.sleep_schedule in (my.sleep_schedule, "flexible")
        ):
            score += 8
        if preferred_languages and candidate_languages:
            shared_languages = sorted(candidate_languages.intersection(preferred_languages))
            if shared_languages:
                score += 12
                reasons.append(
                    f"{language_label_prefix}: "
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


def _resolve_matched_user(
    db: Session, connection: RoommateConnections
) -> Users:
    try:
        matched_user_id = uuid.UUID(connection.roommate_ref_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail="Cannot invite this match: missing user reference",
        )
    matched = db.get(Users, matched_user_id)
    if matched is None or not matched.email:
        raise HTTPException(
            status_code=404, detail="Matched user not found"
        )
    return matched


def _first_name(value: str | None) -> str:
    if not value:
        return ""
    parts = [p.strip() for p in value.split() if p.strip()]
    return parts[0] if parts else ""


def create_group_from_connection(
    db: Session,
    user: Users,
    connection_id: str,
    name: str | None = None,
) -> CreateGroupFromConnectionResponse:
    connection = _resolve_connection(db, user.id, connection_id)
    if connection is None:
        raise HTTPException(status_code=404, detail="Connection not found")
    matched = _resolve_matched_user(db, connection)

    my_first = _first_name(
        (db.execute(
            select(RoommateProfiles.name).where(RoommateProfiles.user_id == user.id)
        ).scalar_one_or_none())
    ) or (user.email.split("@")[0] if user.email else "You")
    match_first = _first_name(connection.roommate_name) or "Roommate"
    group_name = (name or "").strip() or f"{my_first} & {match_first}"

    group = Groups(name=group_name[:120], created_by=user.id)
    db.add(group)
    db.flush()
    db.add(GroupMembers(group_id=group.id, user_id=user.id, role="owner"))
    db.flush()

    existing_member = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group.id,
            GroupMembers.user_id == matched.id,
        )
    ).scalar_one_or_none()
    if existing_member is not None:
        db.commit()
        db.refresh(group)
        return CreateGroupFromConnectionResponse(
            group_id=group.id,
            group_name=group.name,
            invite=None,
            already_member=True,
        )

    invite = create_email_invite(
        db, group=group, inviter=user, email=matched.email
    )
    db.commit()
    db.refresh(group)
    db.refresh(invite)
    return CreateGroupFromConnectionResponse(
        group_id=group.id,
        group_name=group.name,
        invite=invite_to_response(invite),
        already_member=False,
    )


def invite_connection_to_group(
    db: Session,
    user: Users,
    connection_id: str,
    group_id: uuid.UUID,
) -> InviteConnectionToGroupResponse:
    membership = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group_id,
            GroupMembers.user_id == user.id,
        )
    ).scalar_one_or_none()
    if membership is None:
        raise HTTPException(status_code=404, detail="Group not found")

    connection = _resolve_connection(db, user.id, connection_id)
    if connection is None:
        raise HTTPException(status_code=404, detail="Connection not found")
    matched = _resolve_matched_user(db, connection)

    group = db.get(Groups, group_id)
    if group is None:
        raise HTTPException(status_code=404, detail="Group not found")

    existing_member = db.execute(
        select(GroupMembers).where(
            GroupMembers.group_id == group_id,
            GroupMembers.user_id == matched.id,
        )
    ).scalar_one_or_none()
    if existing_member is not None:
        return InviteConnectionToGroupResponse(invite=None, already_member=True)

    invite = create_email_invite(
        db, group=group, inviter=user, email=matched.email
    )
    db.commit()
    db.refresh(invite)
    return InviteConnectionToGroupResponse(
        invite=invite_to_response(invite), already_member=False
    )

