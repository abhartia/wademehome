"""LlamaIndex FunctionTool factories for the home agent workflow.

Each `make_*_tools(user, db, llm)` returns a list of FunctionTools bound to the
authenticated user and DB session via closure. Tools call existing service
functions directly (not over HTTP) and emit `UIEvent`s through the workflow
context so the chat UI can render rich cards inline with the conversation.

NOTE: do NOT add `from __future__ import annotations` here. FunctionTool's
`_is_context_param` checks the annotation by identity (`==  Context`), so
stringified annotations slip through and the Context param ends up in the
tool's fn_schema as a ForwardRef, breaking pydantic JSON-schema generation.
"""

import asyncio
import uuid
from typing import Any, Optional

from llama_index.core.llms import LLM
from llama_index.core.tools import FunctionTool
from llama_index.core.workflow import Context
from llama_index.server.models.ui import UIEvent
from sqlalchemy import select
from sqlalchemy.orm import Session

from agent.events import (
    AgentStepData,
    BuildingProfileData,
    BuildingReviewSnippet,
    FavoriteCardItem,
    FavoritesResultsData,
    GroupInviteItem,
    GroupListData,
    GroupMemberItem,
    GroupSummaryData,
    GuarantorItem,
    GuarantorRequestItem,
    GuarantorSummaryData,
    LandlordProfileData,
    LeaseAnswerData,
    LeaseSummaryData,
    MoveInChecklistData,
    MoveInOrderItem,
    MoveInOrdersData,
    MoveInTaskItem,
    NavigationActionData,
    ProfileSummaryData,
    PropertyResultsData,
    RoommateConnectionItem,
    RoommateConnectionsData,
    RoommateMatchesData,
    RoommateMatchItem,
    TourCardItem,
    TourResultsData,
)
from buildings.service import (
    list_building_reviews,
    list_dob_complaints,
    list_hpd_violations,
)
from db.models import (
    BuildingOwnershipPeriods,
    Buildings,
    GroupMembers,
    Groups,
    LandlordEntities,
    OwnershipRole,
    PropertyFavorites,
    UserLeaseDocuments,
    Users,
)
from groups.service import create_email_invite as groups_create_email_invite
from guarantors.schemas import (
    GuarantorRequestCreate,
    LeasePayload as GuarantorLeasePayload,
    SavedGuarantorCreate,
)
from guarantors.service import (
    create_invite as guarantor_create_invite,
    create_request as guarantor_create_request,
    create_saved_guarantor,
    list_requests as guarantor_list_requests,
    list_saved_guarantors,
)
from landlord_entities.service import (
    get_entity_detail,
    list_entity_reviews,
)
from listings.ai_search import (
    embed_query_text,
    extract_query_plan,
    run_fast_search,
)
from llama_index.core.base.llms.types import ChatMessage
from movein.lease_premises_extract import extract_premises_address_from_lease_text
from movein.schemas import (
    ChecklistItemCreate,
    ChecklistItemPatch,
    MoveInPlanPatch,
    VendorOrderCreate,
)
from movein.service import (
    create_checklist_item,
    create_order,
    list_checklist,
    list_orders,
    patch_checklist_item,
    patch_plan,
    read_plan,
)
from portal.service import get_profile, patch_profile
from portal.schemas import ProfilePatch
from roommates.schemas import (
    MyRoommateProfilePatch,
    RoommateConnectionCreate,
    RoommateMessagePayload,
    RoommateProfilePayload,
)
from roommates.service import (
    create_connection as roommates_create_connection,
    create_group_from_connection,
    create_message as roommates_create_message,
    list_connections as roommates_list_connections,
    list_matches as roommates_list_matches,
    patch_my_profile as roommates_patch_my_profile,
    read_my_profile as roommates_read_my_profile,
)
from sqlalchemy import func
from tours.schemas import (
    TourCreate,
    TourPropertyPayload,
    TourSortParams,
    TourUpdate,
)
from tours.service import (
    create_tour,
    delete_tour,
    list_tours,
    update_tour,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

# Process-level cache of each user's most recent search results so that
# follow-up turns ("save the first one", "tour the second") can resolve
# index_in_last_search even though the workflow Context is rebuilt per
# `/agent/chat` POST. Keyed by user.id; bounded by the number of active
# users (small). Lost on API restart — that is acceptable for v1; durable
# conversation state is Phase 3.
_LAST_SEARCH_CACHE: dict[int, list[dict[str, str]]] = {}


def _infer_user_city(db: Session, user_id: Any) -> str | None:
    """Structured fallback city for vague search queries.

    Reads only clean, structured profile fields — preferred_cities (first
    entry) then target_city. No heuristic address parsing; if the user has
    neither field populated, we return None and let the search run
    ungrounded (and the orchestrator prompt already nudges specialists to
    handle the intent properly so this rarely fires).
    """
    try:
        prof = get_profile(db, user_id)
    except Exception:
        return None
    if not prof:
        return None
    if prof.preferred_cities:
        first = (prof.preferred_cities[0] or "").strip()
        if first:
            return first
    tc = (getattr(prof, "target_city", None) or "").strip()
    if tc:
        return tc
    return None


def _emit(ctx: Context, event_type: str, data: Any) -> None:
    ctx.write_event_to_stream(UIEvent(type=event_type, data=data))


def _step(ctx: Context, agent: str, label: str, state: str = "running",
          detail: str | None = None) -> None:
    _emit(ctx, "agent_step",
          AgentStepData(agent=agent, label=label, state=state, detail=detail))


# ─────────────────────────────────────────────────────────────────────────────
# Search tools
# ─────────────────────────────────────────────────────────────────────────────

async def _get_chat_history(ctx: Context):
    """Pull AgentWorkflow's running chat history out of context memory."""
    try:
        memory = await ctx.store.get("memory", default=None)
        if memory is None:
            return []
        return await memory.aget()
    except Exception:
        return []


def make_search_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def search_listings(ctx: Context, query: str) -> str:
        """Search the listings catalog with a free-text natural-language query.

        Use this to find apartments / homes that match the user's intent
        (location, bedrooms, budget, amenities, vibe, must-haves). Returns a
        structured summary of matches; the UI will render rich cards in
        parallel — your text reply should be a brief commentary, not a list.

        Args:
            query: A natural-language description of what the user is looking
                for, e.g. "two-bedroom in Williamsburg under 4500 with gym".
        """
        _step(ctx, "search", f"Planning search for “{query[:60]}”", "running")

        history = await _get_chat_history(ctx)
        plan_task = asyncio.create_task(
            extract_query_plan(llm, user_msg=query, chat_history=history)
        )
        embed_task = asyncio.create_task(embed_query_text(query))
        plan = await plan_task
        embedding, _ = await embed_task

        # Location grounding: if the planner couldn't extract a location from
        # the query, fall back to the user's profile (preferred_cities, then
        # target_city) and finally the move-in plan's target address city.
        # Without this, run_fast_search ranks by listing_id with no city
        # filter — that returned Dallas listings to a Brooklyn user.
        if not plan.city and plan.latitude is None and plan.longitude is None:
            fallback_city = _infer_user_city(db, user.id)
            if fallback_city:
                plan.city = fallback_city
                _step(
                    ctx,
                    "search",
                    f"No location in query — using your profile city: {fallback_city}",
                    "running",
                )

        _step(ctx, "search", f"Searching for {plan.summary_headline.lower()}",
              "running")

        result = run_fast_search(plan, query_embedding=embedding, limit=24)
        items = list(result.properties.properties)
        for item in items:
            item.validation_status = "confirmed"

        from listings.property_key import property_key_from_item

        keyed = [(property_key_from_item(p), p) for p in items]

        # Stash for save_property / schedule_tour's index_in_last_search
        # shortcut. Write to BOTH the workflow Context (intra-turn handoffs)
        # and the per-user process cache (cross-turn follow-ups).
        cache_entries = [
            {"property_key": key, "name": p.name, "address": p.address}
            for key, p in keyed
        ]
        await ctx.store.set("last_search_results", cache_entries)
        _LAST_SEARCH_CACHE[user.id] = cache_entries

        _emit(ctx, "property_results", PropertyResultsData(
            title=plan.summary_headline or "Listings",
            query=query,
            properties=items,
        ))
        _step(ctx, "search", f"Found {len(items)} listings", "done")

        if not items:
            return f"No listings matched the query: {query}"
        # Include keys + 1-based indices so the LLM can save by index or key.
        lines = [
            f"  {i+1}. [{key}] {p.name} — {p.rent_range or '?'} — {p.address or ''}"
            for i, (key, p) in enumerate(keyed[:10])
        ]
        return (
            f"Found {len(items)} listings for '{plan.summary_headline}'. "
            f"Top results (use either the index or the [key] to save / tour):\n"
            + "\n".join(lines)
        )

    return [
        FunctionTool.from_defaults(
            async_fn=search_listings,
            name="search_listings",
            description=(
                "Search the listings catalog by free-text query. "
                "Renders property cards in the chat. Use whenever the user "
                "asks to find, browse, look at, or compare apartments / homes."
            ),
        )
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Tours tools
# ─────────────────────────────────────────────────────────────────────────────

def _serialize_tour(t: Any) -> TourCardItem:
    prop = t.property
    return TourCardItem(
        id=t.id,
        property_name=prop.name,
        property_address=prop.address,
        status=t.status,
        scheduled_date=t.scheduled_date or "",
        scheduled_time=t.scheduled_time or "",
        image=prop.image or "",
        rent=prop.rent or "",
        beds=prop.beds or "",
    )


def make_tours_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def list_my_tours(
        ctx: Context, status: str | None = None
    ) -> str:
        """List the current user's tours.

        Args:
            status: Optional filter by status. Accepts the raw values
                'saved', 'scheduled', 'completed', 'cancelled' OR the
                semantic aliases 'upcoming' (→ scheduled) and 'past'
                (→ completed). Omit to list all.
        """
        # Semantic aliases the LLM naturally reaches for.
        alias = {"upcoming": "scheduled", "past": "completed"}
        normalized_status = alias.get(status, status) if status else None
        _step(ctx, "tours", "Loading your tours", "running")
        params = TourSortParams(status=normalized_status, limit=50, offset=0,
                                sort="created_at_desc")
        tours, total = list_tours(db, user.id, params)
        items = [_serialize_tour(t) for t in tours]
        _emit(ctx, "tours_results", TourResultsData(
            title=("All tours" if not status else f"{status.title()} tours"),
            tours=items,
            empty_message=("No tours yet." if total == 0 else None),
        ))
        _step(ctx, "tours", f"{total} tour(s) loaded", "done")
        if total == 0:
            return "The user has no tours yet."
        return f"Listed {total} tour(s); rendered cards in the UI."

    async def schedule_tour(
        ctx: Context,
        property_name: str = "",
        property_address: str = "",
        scheduled_date: str = "",
        scheduled_time: str = "",
        index_in_last_search: int | None = None,
    ) -> str:
        """Create a tour entry for a property.

        Provide either:
        - `property_name` + `property_address` directly, OR
        - `index_in_last_search` (1-based) referencing the most recent
          search_listings results in this conversation.

        Date in YYYY-MM-DD, time in HH:MM (24h) when known; leave empty
        if unknown.
        """
        if index_in_last_search is not None and not (property_name and property_address):
            cached = (
                await ctx.store.get("last_search_results", default=None)
                or _LAST_SEARCH_CACHE.get(user.id, [])
            )
            idx = index_in_last_search - 1
            if idx < 0 or idx >= len(cached):
                return (
                    f"index_in_last_search={index_in_last_search} is out of "
                    f"range (last search had {len(cached)} results)."
                )
            entry = cached[idx]
            property_name = property_name or entry["name"]
            property_address = property_address or entry["address"]

        if not property_name or not property_address:
            return (
                "Need either property_name+property_address or "
                "index_in_last_search referencing a prior search result."
            )

        _step(ctx, "tours", f"Scheduling tour for {property_name}", "running")
        payload = TourCreate(
            property=TourPropertyPayload(
                name=property_name,
                address=property_address,
            ),
            status=("scheduled" if scheduled_date else "saved"),
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
        )
        tour = create_tour(db, user.id, payload)
        _emit(ctx, "tours_results", TourResultsData(
            title="Tour scheduled",
            tours=[_serialize_tour(tour)],
        ))
        _step(ctx, "tours", "Tour saved", "done")
        return (
            f"Created tour {tour.id} for {property_name} "
            f"(status={tour.status})."
        )

    async def update_tour_status(
        ctx: Context,
        tour_id: str,
        status: str | None = None,
        scheduled_date: str | None = None,
        scheduled_time: str | None = None,
    ) -> str:
        """Update an existing tour: change status, date, or time.

        Args:
            tour_id: The tour's UUID.
            status: 'saved' | 'scheduled' | 'completed' | 'cancelled'.
            scheduled_date: YYYY-MM-DD.
            scheduled_time: HH:MM (24h).
        """
        _step(ctx, "tours", "Updating tour", "running")
        tour = update_tour(
            db, user.id, uuid.UUID(tour_id),
            TourUpdate(
                status=status,
                scheduled_date=scheduled_date,
                scheduled_time=scheduled_time,
            ),
        )
        _emit(ctx, "tours_results", TourResultsData(
            title="Tour updated",
            tours=[_serialize_tour(tour)],
        ))
        _step(ctx, "tours", "Tour updated", "done")
        return f"Tour updated to status={tour.status}."

    async def cancel_tour(ctx: Context, tour_id: str) -> str:
        """Delete a tour. Use only when the user explicitly asks to remove it."""
        _step(ctx, "tours", "Removing tour", "running")
        delete_tour(db, user.id, uuid.UUID(tour_id))
        _step(ctx, "tours", "Tour removed", "done")
        return "Deleted the tour."

    return [
        FunctionTool.from_defaults(
            async_fn=list_my_tours,
            name="list_my_tours",
            description=(
                "List the user's tours. Use when they ask about their tours, "
                "what's coming up, or what they've toured."
            ),
        ),
        FunctionTool.from_defaults(
            async_fn=schedule_tour,
            name="schedule_tour",
            description=(
                "Create a tour. Pass property_name + property_address from a "
                "search result, or index_in_last_search (1-based) for shorthand."
            ),
        ),
        FunctionTool.from_defaults(
            async_fn=update_tour_status,
            name="update_tour_status",
            description="Update a tour's status / scheduled date / time.",
        ),
        FunctionTool.from_defaults(
            async_fn=cancel_tour,
            name="cancel_tour",
            description="Delete a tour. Confirm with user before calling.",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Saved (favorites) tools
# ─────────────────────────────────────────────────────────────────────────────

def make_saved_tools(
    user: Users,
    db: Session,
    llm: LLM,
    active_group_id: uuid.UUID | None = None,
) -> list[FunctionTool]:
    """Saved-properties tools.

    `active_group_id` reflects the group the user has selected in the sidebar
    (carried over HTTP via `X-Active-Group-Id`). When set, saves/lists/removes
    operate on THAT group's shared favorites instead of the user's personal
    favorites — matching the UI's current context. When unset, everything
    behaves as personal favorites (group_id IS NULL).

    Note: the orchestrator separately routes explicit "save to GROUP_NAME group"
    prompts to `groups_agent.save_property_to_group` (which takes a group_id
    arg). This `active_group_id` closure is the implicit default for
    saved_agent when the user just says "save".
    """
    # Validate membership once at construction so every tool call inherits the
    # guarantee. If the header id is bogus or stale (user left the group), we
    # fall back to personal — safer than silently writing to a wrong group.
    resolved_group_id: uuid.UUID | None = None
    if active_group_id is not None:
        membership = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == active_group_id,
                GroupMembers.user_id == user.id,
            )
        ).scalar_one_or_none()
        if membership is not None:
            resolved_group_id = active_group_id

    def _scope_clause():
        # SQLAlchemy doesn't treat `col == None` the same as IS NULL reliably
        # across dialects, hence the explicit is_().
        if resolved_group_id is None:
            return PropertyFavorites.group_id.is_(None)
        return PropertyFavorites.group_id == resolved_group_id

    scope_label = "group" if resolved_group_id else "personal"

    async def list_saved_properties(ctx: Context) -> str:
        """List the user's saved / favorited properties (scoped to the
        active group if one is selected in the UI, otherwise personal)."""
        _step(ctx, "saved", f"Loading {scope_label} saved properties", "running")
        query = select(PropertyFavorites).where(_scope_clause())
        # Personal favorites are filtered to user_id; group favorites are
        # shared so we don't filter user_id (every member should see them).
        if resolved_group_id is None:
            query = query.where(PropertyFavorites.user_id == user.id)
        rows = db.execute(
            query.order_by(PropertyFavorites.created_at.desc())
        ).scalars().all()

        items = [
            FavoriteCardItem(
                property_key=row.property_key,
                property_name=row.property_name or "Untitled",
                property_address=row.property_address or "",
                created_at=row.created_at.isoformat() if row.created_at else None,
            )
            for row in rows
        ]
        _emit(ctx, "favorites_results", FavoritesResultsData(
            favorites=items,
            empty_message=("Nothing saved yet." if not items else None),
        ))
        _step(ctx, "saved", f"{len(items)} saved ({scope_label})", "done")
        if not items:
            return f"User has no saved properties yet ({scope_label})."
        return f"Listed {len(items)} saved properties ({scope_label})."

    async def save_property(
        ctx: Context,
        property_key: str | None = None,
        property_name: str | None = None,
        property_address: str | None = None,
        index_in_last_search: int | None = None,
    ) -> str:
        """Add a property to the user's saved list (favorite it).

        Provide either:
        - `property_key` (+ name/address) from a search result, OR
        - `index_in_last_search` (1-based) referencing the most recent
          search_listings results in this conversation.

        Target (personal vs group) is driven by the UI's selected group at
        request time — no group_id argument is exposed on this tool.
        """
        if index_in_last_search is not None and not property_key:
            cached = (
                await ctx.store.get("last_search_results", default=None)
                or _LAST_SEARCH_CACHE.get(user.id, [])
            )
            idx = index_in_last_search - 1
            if idx < 0 or idx >= len(cached):
                return (
                    f"index_in_last_search={index_in_last_search} is out of "
                    f"range (last search had {len(cached)} results)."
                )
            entry = cached[idx]
            property_key = entry["property_key"]
            property_name = property_name or entry["name"]
            property_address = property_address or entry["address"]

        if not property_key:
            return (
                "Need either property_key or index_in_last_search. "
                "Run search_listings first, then refer to a result by index."
            )

        _step(
            ctx,
            "saved",
            f"Saving {property_name or property_key} ({scope_label})",
            "running",
        )
        existing = db.execute(
            select(PropertyFavorites).where(
                _scope_clause(),
                PropertyFavorites.property_key == property_key,
            )
        ).scalar_one_or_none()
        if existing:
            _step(ctx, "saved", "Already saved", "done")
            return (
                f"{property_name or property_key} was already saved "
                f"({scope_label})."
            )
        db.add(PropertyFavorites(
            user_id=user.id,
            group_id=resolved_group_id,
            property_key=property_key,
            property_name=property_name or "Untitled",
            property_address=property_address or "",
        ))
        db.commit()
        _step(ctx, "saved", f"Saved ({scope_label})", "done")
        return f"Saved {property_name or property_key} ({scope_label})."

    async def remove_saved_property(
        ctx: Context, property_key: str
    ) -> str:
        """Remove a property from the user's saved list (same scope as save)."""
        _step(ctx, "saved", "Removing from saved", "running")
        query = select(PropertyFavorites).where(
            _scope_clause(),
            PropertyFavorites.property_key == property_key,
        )
        if resolved_group_id is None:
            query = query.where(PropertyFavorites.user_id == user.id)
        existing = db.execute(query).scalar_one_or_none()
        if not existing:
            _step(ctx, "saved", "Not in saved", "done")
            return f"Property was not in the {scope_label} saved list."
        db.delete(existing)
        db.commit()
        _step(ctx, "saved", "Removed", "done")
        return f"Removed from saved properties ({scope_label})."

    return [
        FunctionTool.from_defaults(
            async_fn=list_saved_properties,
            name="list_saved_properties",
            description="List the user's saved/favorited properties.",
        ),
        FunctionTool.from_defaults(
            async_fn=save_property,
            name="save_property",
            description=(
                "Save (favorite) a property. Pass property_key from a search "
                "result, or index_in_last_search (1-based) for shorthand."
            ),
        ),
        FunctionTool.from_defaults(
            async_fn=remove_saved_property,
            name="remove_saved_property",
            description="Remove a property from the user's saved list.",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Profile tools
# ─────────────────────────────────────────────────────────────────────────────

def _profile_to_summary(p: Any) -> ProfileSummaryData:
    return ProfileSummaryData(
        cities=p.preferred_cities or [],
        move_timeline=p.move_timeline,
        max_monthly_rent=p.max_monthly_rent,
        bedrooms_needed=p.bedrooms_needed,
        has_pets=p.has_pets,
        dealbreakers=p.dealbreakers or [],
        neighbourhood_priorities=p.neighbourhood_priorities or [],
        onboarding_completed=p.onboarding_completed,
    )


def make_profile_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def view_my_profile(ctx: Context) -> str:
        """Show the user's saved renter profile / preferences."""
        _step(ctx, "profile", "Loading your profile", "running")
        prof = get_profile(db, user.id)
        if prof is None:
            _step(ctx, "profile", "No profile yet", "done")
            _emit(ctx, "navigation_action", NavigationActionData(
                title="Complete your profile",
                description="A few quick questions help tailor every search.",
                href="/onboarding",
                cta="Get started",
            ))
            return "User has no profile yet."
        _emit(ctx, "profile_summary", _profile_to_summary(prof))
        _step(ctx, "profile", "Profile loaded", "done")
        return (
            f"Loaded profile: cities={prof.preferred_cities}, "
            f"budget={prof.max_monthly_rent}, beds={prof.bedrooms_needed}."
        )

    async def update_my_profile(
        ctx: Context,
        preferred_cities: list[str] | None = None,
        max_monthly_rent: str | None = None,
        bedrooms_needed: str | None = None,
        move_timeline: str | None = None,
        dealbreakers: list[str] | None = None,
        neighbourhood_priorities: list[str] | None = None,
        has_pets: bool | None = None,
        roommate_search_enabled: bool | None = None,
    ) -> str:
        """Patch the user's renter profile.

        Pass only the fields the user explicitly mentioned. Use this when the
        user states a preference ("I want to move to Chicago", "raise my budget
        to $4000", "no walk-ups"). Cities are list of city names; budget and
        bedrooms are short strings ("$3500", "2 bedrooms").
        """
        _step(ctx, "profile", "Saving updates", "running")
        # Only pass fields the LLM actually set. ProfilePatch + patch_profile
        # use `exclude_unset` to skip un-touched columns; passing None
        # explicitly would clobber NOT-NULL fields like has_pets.
        provided = {
            k: v for k, v in {
                "preferred_cities": preferred_cities,
                "max_monthly_rent": max_monthly_rent,
                "bedrooms_needed": bedrooms_needed,
                "move_timeline": move_timeline,
                "dealbreakers": dealbreakers,
                "neighbourhood_priorities": neighbourhood_priorities,
                "has_pets": has_pets,
                "roommate_search_enabled": roommate_search_enabled,
            }.items() if v is not None
        }
        patch = ProfilePatch(**provided)
        prof = patch_profile(db, user.id, patch)
        updated = list(provided.keys())
        summary = _profile_to_summary(prof)
        summary.updated_fields = updated
        _emit(ctx, "profile_summary", summary)
        _step(ctx, "profile", f"Updated {len(updated)} field(s)", "done")
        return f"Updated profile fields: {updated}."

    return [
        FunctionTool.from_defaults(
            async_fn=view_my_profile,
            name="view_my_profile",
            description=(
                "Show the user's saved renter profile (cities, budget, beds, "
                "timeline, dealbreakers, etc.)."
            ),
        ),
        FunctionTool.from_defaults(
            async_fn=update_my_profile,
            name="update_my_profile",
            description=(
                "Update fields on the user's renter profile. Only set fields "
                "the user explicitly mentioned."
            ),
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Navigation tool — for things best done in a dedicated UI
# ─────────────────────────────────────────────────────────────────────────────

def make_navigation_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    # Navigator is the FALLBACK agent. It must never deep-link to a domain
    # that has a dedicated specialist (search, tours, saved, profile,
    # roommates, guarantor, lease, groups, buildings, move-in state). Those
    # belong to their own agents — handing the user a "/search" card when
    # they asked to find apartments is the wrong UX.
    #
    # The allow-list below is intentionally tiny: onboarding, writing a
    # landlord review, and capturing move-in photos (needs camera UI).
    async def open_app_section(
        ctx: Context, section: str, reason: str = ""
    ) -> str:
        """Deep-link the user to a dedicated UI that chat can't render.

        Args:
            section: One of 'onboarding', 'landlord-reviews', 'move-in-photos'.
            reason: Short user-facing one-liner explaining why.
        """
        routes = {
            "onboarding": ("Get started", "/onboarding"),
            "landlord-reviews": ("Write a landlord review", "/landlord/reviews"),
            "move-in-photos": ("Move-in photo capture", "/move-in/photos"),
        }
        if section not in routes:
            # Refuse specialist-covered sections so the orchestrator is
            # forced to route them correctly on the next turn instead of us
            # silently handing out a generic nav card.
            return (
                f"Cannot open '{section}' from the navigator — that domain has a "
                "dedicated specialist. Hand off to orchestrator and let it route."
            )
        title, href = routes[section]
        _emit(ctx, "navigation_action", NavigationActionData(
            title=title,
            description=reason or None,
            href=href,
            cta="Open",
        ))
        return f"Offered navigation card for {title} ({href})."

    return [
        FunctionTool.from_defaults(
            async_fn=open_app_section,
            name="open_app_section",
            description=(
                "Render a navigation card ONLY for the three flows that chat "
                "can't render: 'onboarding', 'landlord-reviews', "
                "'move-in-photos'. Everything else (searching listings, tours, "
                "saved, profile, roommates, lease, guarantor, groups, "
                "buildings) belongs to a specialist agent, not this tool."
            ),
        )
    ]


def all_tools_for_user(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    """Return every tool the home agent can use, bound to (user, db, llm)."""
    return [
        *make_search_tools(user, db, llm),
        *make_tours_tools(user, db, llm),
        *make_saved_tools(user, db, llm),
        *make_profile_tools(user, db, llm),
        *make_navigation_tools(user, db, llm),
        *make_roommates_tools(user, db, llm),
        *make_groups_tools(user, db, llm),
        *make_lease_tools(user, db, llm),
        *make_movein_tools(user, db, llm),
        *make_guarantor_tools(user, db, llm),
        *make_buildings_tools(user, db, llm),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Roommates tools
# ─────────────────────────────────────────────────────────────────────────────

# Per-user cache of last shown roommate matches so "connect with the first one"
# resolves across turns. Same justification as _LAST_SEARCH_CACHE.
_LAST_MATCHES_CACHE: dict[uuid.UUID, list[RoommateProfilePayload]] = {}


def _match_to_item(p: RoommateProfilePayload) -> RoommateMatchItem:
    return RoommateMatchItem(
        id=p.id,
        name=p.name or "",
        age=p.age or None,
        occupation=p.occupation or None,
        avatar_initials=p.avatar_initials or "",
        bio=p.bio or None,
        target_city=p.target_city or None,
        max_budget=p.max_budget or None,
        bedrooms_wanted=p.bedrooms_wanted or None,
        compatibility_score=p.compatibility_score,
        compatibility_reasons=list(p.compatibility_reasons or []),
    )


def make_roommates_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def view_my_roommate_profile(ctx: Context) -> str:
        """Show the user's roommate matching profile."""
        _step(ctx, "roommates", "Loading roommate profile", "running")
        prof = roommates_read_my_profile(db, user.id)
        _step(ctx, "roommates", "Profile loaded", "done")
        return (
            f"Roommate profile: name={prof.name}, age={prof.age}, "
            f"occupation={prof.occupation}, sleep={prof.sleep_schedule}, "
            f"cleanliness={prof.cleanliness_level}, smoking={prof.smoking}, "
            f"interests={prof.interests}. Profile completed: {prof.profile_completed}."
        )

    async def update_my_roommate_profile(
        ctx: Context,
        name: str | None = None,
        age: int | None = None,
        occupation: str | None = None,
        sleep_schedule: str | None = None,
        cleanliness_level: str | None = None,
        noise_level: str | None = None,
        guest_policy: str | None = None,
        smoking: str | None = None,
        bio: str | None = None,
        interests: list[str] | None = None,
        languages_spoken: list[str] | None = None,
    ) -> str:
        """Patch the user's roommate profile.

        Pass only the fields the user explicitly mentioned. Use this when the
        user states a roommate preference ("I'm a night owl", "I'm clean",
        "I work in tech").
        """
        _step(ctx, "roommates", "Saving roommate profile", "running")
        provided = {
            k: v for k, v in {
                "name": name, "age": age, "occupation": occupation,
                "sleep_schedule": sleep_schedule,
                "cleanliness_level": cleanliness_level,
                "noise_level": noise_level, "guest_policy": guest_policy,
                "smoking": smoking, "bio": bio,
                "interests": interests, "languages_spoken": languages_spoken,
            }.items() if v is not None
        }
        patch = MyRoommateProfilePatch(**provided)
        roommates_patch_my_profile(db, user.id, patch)
        _step(ctx, "roommates", f"Updated {len(provided)} field(s)", "done")
        return f"Updated roommate profile fields: {list(provided.keys())}."

    async def list_roommate_matches(ctx: Context, limit: int = 10) -> str:
        """List potential roommate matches for the current user.

        Args:
            limit: Max matches to surface (default 10).
        """
        _step(ctx, "roommates", "Finding matches", "running")
        matches = roommates_list_matches(db, user.id, group_id=None)
        items = [_match_to_item(m) for m in matches[:limit]]
        _LAST_MATCHES_CACHE[user.id] = list(matches[:limit])
        _emit(ctx, "roommate_matches", RoommateMatchesData(
            matches=items,
            empty_message=("No matches yet — complete your roommate profile first." if not items else None),
        ))
        _step(ctx, "roommates", f"{len(items)} match(es)", "done")
        if not items:
            return "No roommate matches available — user may need to complete their roommate profile."
        lines = [
            f"  {i+1}. {m.name} ({m.compatibility_score or '?'}% match) — {m.occupation or 'unknown'}, {m.target_city or 'no city'}, budget {m.max_budget or '?'}"
            for i, m in enumerate(items)
        ]
        return f"Found {len(items)} match(es). Use connect_with_match with index_in_last_matches:\n" + "\n".join(lines)

    async def list_my_connections(ctx: Context) -> str:
        """List the user's existing roommate connections (in-progress chats)."""
        _step(ctx, "roommates", "Loading connections", "running")
        conns = roommates_list_connections(db, user.id)
        items = []
        for c in conns:
            last = c.messages[-1] if c.messages else None
            items.append(RoommateConnectionItem(
                id=c.id,
                roommate_name=c.roommate.name or "Unknown",
                roommate_initials=c.roommate.avatar_initials or "",
                last_message=(last.content if last else None),
                last_message_time=(last.time if last else None),
                connected_at=c.connected_at or None,
                message_count=len(c.messages or []),
            ))
        _emit(ctx, "roommate_connections", RoommateConnectionsData(
            connections=items,
            empty_message=("No connections yet." if not items else None),
        ))
        _step(ctx, "roommates", f"{len(items)} connection(s)", "done")
        if not items:
            return "User has no roommate connections yet."
        return f"Listed {len(items)} connection(s)."

    async def connect_with_match(
        ctx: Context,
        index_in_last_matches: int | None = None,
        match_id: str | None = None,
        opening_message: str | None = None,
    ) -> str:
        """Send a connection request to a roommate match.

        Provide either `index_in_last_matches` (1-based, references the most
        recent list_roommate_matches results) or `match_id`. Optionally include
        an opening_message to send right after connecting.
        """
        cached = _LAST_MATCHES_CACHE.get(user.id, [])
        target: RoommateProfilePayload | None = None
        if index_in_last_matches is not None and cached:
            idx = index_in_last_matches - 1
            if 0 <= idx < len(cached):
                target = cached[idx]
        if target is None and match_id:
            target = next((m for m in cached if m.id == match_id), None)
        if target is None:
            return (
                "Need either index_in_last_matches (after running list_roommate_matches) "
                "or match_id from a prior matches list."
            )
        _step(ctx, "roommates", f"Connecting with {target.name}", "running")
        conn = roommates_create_connection(
            db, user.id, RoommateConnectionCreate(roommate=target),
        )
        if opening_message:
            from datetime import datetime, timezone
            roommates_create_message(
                db, user.id, conn.id,
                RoommateMessagePayload(
                    role="user",
                    content=opening_message,
                    time=datetime.now(timezone.utc).isoformat(),
                ),
            )
        _step(ctx, "roommates", "Connected", "done")
        _ = conn
        return f"Connected with {target.name}."

    async def message_connection(
        ctx: Context, connection_id: str, body: str
    ) -> str:
        """Send a chat message in an existing roommate connection."""
        from datetime import datetime, timezone
        _step(ctx, "roommates", "Sending message", "running")
        roommates_create_message(
            db, user.id, connection_id,
            RoommateMessagePayload(
                role="user",
                content=body,
                time=datetime.now(timezone.utc).isoformat(),
            ),
        )
        _step(ctx, "roommates", "Sent", "done")
        return "Message sent."

    async def start_group_from_connection(
        ctx: Context, connection_id: str, name: str | None = None
    ) -> str:
        """Convert a roommate connection into a co-tenant group."""
        _step(ctx, "roommates", "Creating group from connection", "running")
        result = create_group_from_connection(db, user, connection_id, name)
        _emit(ctx, "navigation_action", NavigationActionData(
            title=f"Group: {result.group_name}",
            description=("Already a member of this group." if result.already_member else "Group created."),
            href=f"/groups/{result.group_id}",
            cta="Open group",
        ))
        _step(ctx, "roommates", "Group ready", "done")
        return f"Group {result.group_name} ready."

    return [
        FunctionTool.from_defaults(
            async_fn=view_my_roommate_profile, name="view_my_roommate_profile",
            description="Show the user's roommate matching profile.",
        ),
        FunctionTool.from_defaults(
            async_fn=update_my_roommate_profile, name="update_my_roommate_profile",
            description="Patch fields on the user's roommate profile (only the fields they mentioned).",
        ),
        FunctionTool.from_defaults(
            async_fn=list_roommate_matches, name="list_roommate_matches",
            description="List potential roommate matches; renders match cards.",
        ),
        FunctionTool.from_defaults(
            async_fn=list_my_connections, name="list_my_connections",
            description="List the user's existing roommate connections.",
        ),
        FunctionTool.from_defaults(
            async_fn=connect_with_match, name="connect_with_match",
            description="Connect with a roommate match by index_in_last_matches or match_id.",
        ),
        FunctionTool.from_defaults(
            async_fn=message_connection, name="message_connection",
            description="Send a chat message in an existing roommate connection.",
        ),
        FunctionTool.from_defaults(
            async_fn=start_group_from_connection, name="start_group_from_connection",
            description="Convert a roommate connection into a co-tenant group.",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Groups tools
# ─────────────────────────────────────────────────────────────────────────────

def _group_to_summary(db: Session, g: Groups, role: str) -> GroupSummaryData:
    members = db.execute(
        select(GroupMembers).where(GroupMembers.group_id == g.id)
    ).scalars().all()
    saved_count = db.execute(
        select(func.count(PropertyFavorites.id)).where(
            PropertyFavorites.group_id == g.id
        )
    ).scalar_one() or 0
    return GroupSummaryData(
        id=str(g.id),
        name=g.name or "Untitled group",
        role=role,
        member_count=len(members),
        members=[
            GroupMemberItem(user_id=str(m.user_id), role=m.role)
            for m in members
        ],
        saved_count=int(saved_count),
    )


def make_groups_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def list_my_groups(ctx: Context) -> str:
        """List the user's co-tenant groups."""
        _step(ctx, "groups", "Loading groups", "running")
        rows = db.execute(
            select(Groups, GroupMembers.role)
            .join(GroupMembers, GroupMembers.group_id == Groups.id)
            .where(GroupMembers.user_id == user.id)
            .order_by(Groups.created_at.desc())
        ).all()
        summaries = [_group_to_summary(db, g, role) for g, role in rows]
        _emit(ctx, "group_list", GroupListData(
            groups=summaries,
            empty_message=("No groups yet." if not summaries else None),
        ))
        _step(ctx, "groups", f"{len(summaries)} group(s)", "done")
        if not summaries:
            return "User is not in any groups yet."
        lines = [f"  - {s.name} (id={s.id}, role={s.role}, {s.member_count} member(s))" for s in summaries]
        return f"Listed {len(summaries)} group(s):\n" + "\n".join(lines)

    async def create_group(ctx: Context, name: str) -> str:
        """Create a new co-tenant group with the given name."""
        _step(ctx, "groups", f"Creating group {name}", "running")
        g = Groups(name=name.strip(), created_by=user.id)
        db.add(g)
        db.flush()
        db.add(GroupMembers(group_id=g.id, user_id=user.id, role="owner"))
        db.commit()
        db.refresh(g)
        _emit(ctx, "group_list", GroupListData(
            groups=[_group_to_summary(db, g, "owner")],
            title="Group created",
        ))
        _step(ctx, "groups", "Group created", "done")
        _ = g
        return f"Created group {g.name}."

    async def invite_to_group(
        ctx: Context, group_id: str, email: str
    ) -> str:
        """Send an email invite to join a group."""
        _step(ctx, "groups", f"Inviting {email}", "running")
        g = db.get(Groups, uuid.UUID(group_id))
        if g is None:
            return "Group not found."
        membership = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == g.id,
                GroupMembers.user_id == user.id,
            )
        ).scalar_one_or_none()
        if membership is None:
            return "You are not a member of that group."
        invite = groups_create_email_invite(
            db, group=g, inviter=user, email=email,
        )
        db.commit()
        _emit(ctx, "group_list", GroupListData(
            title="Invite sent",
            groups=[
                GroupSummaryData(
                    id=str(g.id), name=g.name or "", role=membership.role,
                    member_count=0,
                    invites=[GroupInviteItem(email=email, status="pending")],
                ),
            ],
        ))
        _step(ctx, "groups", "Invite sent", "done")
        return f"Sent invite to {email} for group {g.name}. Token: {invite.token[:8]}..."

    async def save_property_to_group(
        ctx: Context,
        group_id: str,
        property_key: str | None = None,
        property_name: str | None = None,
        property_address: str | None = None,
        index_in_last_search: int | None = None,
    ) -> str:
        """Save a property to a group's shared list (instead of the user's personal saved)."""
        if index_in_last_search is not None and not property_key:
            cached = (
                await ctx.store.get("last_search_results", default=None)
                or _LAST_SEARCH_CACHE.get(user.id, [])
            )
            idx = index_in_last_search - 1
            if 0 <= idx < len(cached):
                entry = cached[idx]
                property_key = entry["property_key"]
                property_name = property_name or entry["name"]
                property_address = property_address or entry["address"]
        if not property_key:
            return "Need property_key or index_in_last_search."
        gid = uuid.UUID(group_id)
        membership = db.execute(
            select(GroupMembers).where(
                GroupMembers.group_id == gid,
                GroupMembers.user_id == user.id,
            )
        ).scalar_one_or_none()
        if membership is None:
            return "You are not a member of that group."
        existing = db.execute(
            select(PropertyFavorites).where(
                PropertyFavorites.group_id == gid,
                PropertyFavorites.property_key == property_key,
            )
        ).scalar_one_or_none()
        if existing:
            return f"{property_name or property_key} already saved to that group."
        db.add(PropertyFavorites(
            user_id=user.id,
            group_id=gid,
            property_key=property_key,
            property_name=property_name or "Untitled",
            property_address=property_address or "",
        ))
        db.commit()
        _step(ctx, "groups", "Saved to group", "done")
        return f"Saved {property_name or property_key} to the group."

    return [
        FunctionTool.from_defaults(
            async_fn=list_my_groups, name="list_my_groups",
            description="List the user's co-tenant groups.",
        ),
        FunctionTool.from_defaults(
            async_fn=create_group, name="create_group",
            description="Create a new co-tenant group with a given name.",
        ),
        FunctionTool.from_defaults(
            async_fn=invite_to_group, name="invite_to_group",
            description="Send an email invite for someone to join a group.",
        ),
        FunctionTool.from_defaults(
            async_fn=save_property_to_group, name="save_property_to_group",
            description="Save a property to a group's shared list (instead of personal saved).",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Lease tools
# ─────────────────────────────────────────────────────────────────────────────

LEASE_QA_SYSTEM = """You are reading a tenant's residential lease text. Answer the user's question using only the lease text below. If the lease is silent on the topic, say so plainly. Quote or paraphrase specific clauses when helpful. This is not legal advice.

--- BEGIN LEASE TEXT ---
{lease_text}
--- END LEASE TEXT ---
"""

LEASE_QA_MAX_CHARS = 120_000


def make_lease_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def view_my_lease(ctx: Context) -> str:
        """Show what the user has on file for their current lease."""
        _step(ctx, "lease", "Loading lease", "running")
        row = db.execute(
            select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
        ).scalar_one_or_none()
        if row is None:
            _emit(ctx, "lease_summary", LeaseSummaryData(has_document=False))
            _emit(ctx, "navigation_action", NavigationActionData(
                title="Upload your lease",
                description="Add your lease PDF so I can answer questions about it.",
                href="/lease",
                cta="Upload lease",
            ))
            _step(ctx, "lease", "No lease on file", "done")
            return "User has no lease document on file."
        premises = await extract_premises_address_from_lease_text(
            (row.extracted_text or "")[:8000], llm=llm
        )
        _emit(ctx, "lease_summary", LeaseSummaryData(
            has_document=True,
            original_filename=row.original_filename,
            updated_at=row.updated_at.isoformat() if row.updated_at else None,
            premises_address=premises,
            char_count=len(row.extracted_text or ""),
        ))
        _step(ctx, "lease", "Lease loaded", "done")
        return (
            f"Lease on file: {row.original_filename} "
            f"({len(row.extracted_text or '')} chars). Premises: {premises or 'unknown'}."
        )

    async def ask_about_my_lease(ctx: Context, question: str) -> str:
        """Answer a question grounded in the user's uploaded lease text."""
        _step(ctx, "lease", "Reading lease", "running")
        row = db.execute(
            select(UserLeaseDocuments).where(UserLeaseDocuments.user_id == user.id)
        ).scalar_one_or_none()
        if row is None or not (row.extracted_text or "").strip():
            _emit(ctx, "navigation_action", NavigationActionData(
                title="Upload your lease",
                description="I need your lease PDF before I can answer questions about it.",
                href="/lease",
                cta="Upload lease",
            ))
            _step(ctx, "lease", "No lease", "done")
            return "No lease on file. Suggested upload."
        body = (row.extracted_text or "")[:LEASE_QA_MAX_CHARS]
        _step(ctx, "lease", "Asking the model", "running")
        history = [
            ChatMessage(role="system", content=LEASE_QA_SYSTEM.format(lease_text=body)),
            ChatMessage(role="user", content=question),
        ]
        resp = await llm.achat(history)
        answer = (resp.message.content or "").strip()
        _emit(ctx, "lease_answer", LeaseAnswerData(
            question=question, answer=answer,
        ))
        _step(ctx, "lease", "Answered", "done")
        return f"Lease Q&A done. Question: {question[:80]}"

    return [
        FunctionTool.from_defaults(
            async_fn=view_my_lease, name="view_my_lease",
            description="Show the lease document the user has on file (filename, premises address, length).",
        ),
        FunctionTool.from_defaults(
            async_fn=ask_about_my_lease, name="ask_about_my_lease",
            description="Answer a question grounded in the user's uploaded lease text. Use for any question about lease terms (pets, break clause, rent due date, security deposit, etc.).",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Move-in tools
# ─────────────────────────────────────────────────────────────────────────────

def make_movein_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def view_movein_plan(ctx: Context) -> str:
        """Show the user's move-in plan (target address, move date, from address)."""
        _step(ctx, "movein", "Loading plan", "running")
        plan = read_plan(db, user.id)
        items = list_checklist(db, user.id)
        _emit(ctx, "movein_checklist", MoveInChecklistData(
            target_address=plan.target_address or None,
            move_date=plan.move_date or None,
            tasks=[
                MoveInTaskItem(id=i.id, category=i.category, label=i.label, completed=i.completed)
                for i in items
            ],
            empty_message=("No tasks yet." if not items else None),
        ))
        _step(ctx, "movein", "Plan loaded", "done")
        return (
            f"Move-in plan: target={plan.target_address or '?'}, "
            f"date={plan.move_date or '?'}, tasks={len(items)}."
        )

    async def update_movein_plan(
        ctx: Context,
        target_address: str | None = None,
        move_date: str | None = None,
        move_from_address: str | None = None,
    ) -> str:
        """Update the user's move-in plan. Pass only the fields the user set."""
        _step(ctx, "movein", "Saving plan", "running")
        provided = {
            k: v for k, v in {
                "target_address": target_address,
                "move_date": move_date,
                "move_from_address": move_from_address,
            }.items() if v is not None
        }
        patch_plan(db, user.id, MoveInPlanPatch(**provided))
        _step(ctx, "movein", "Plan saved", "done")
        return f"Updated move-in plan: {list(provided.keys())}."

    async def list_movein_tasks(
        ctx: Context, completed: bool | None = None
    ) -> str:
        """List move-in checklist tasks, optionally filtered by completion.

        Returns the task labels and ids so the agent can resolve a user's
        reference ("mark 'forward mail' done") to a concrete task_id and
        call `complete_movein_task` in the same turn.
        """
        _step(ctx, "movein", "Loading tasks", "running")
        items = list_checklist(db, user.id)
        if completed is not None:
            items = [i for i in items if i.completed == completed]
        _emit(ctx, "movein_checklist", MoveInChecklistData(
            tasks=[
                MoveInTaskItem(id=i.id, category=i.category, label=i.label, completed=i.completed)
                for i in items
            ],
            empty_message=("No matching tasks." if not items else None),
        ))
        _step(ctx, "movein", f"{len(items)} task(s)", "done")
        if not items:
            return "No move-in tasks."
        lines = [
            f"- task_id={i.id} label={i.label!r} "
            f"{'[done]' if i.completed else '[open]'} category={i.category}"
            for i in items
        ]
        return "Move-in tasks:\n" + "\n".join(lines)

    async def add_movein_task(
        ctx: Context, label: str, category: str = "general"
    ) -> str:
        """Add a new task to the move-in checklist."""
        _step(ctx, "movein", f"Adding task: {label[:40]}", "running")
        item = create_checklist_item(
            db, user.id,
            ChecklistItemCreate(category=category, label=label, completed=False),
        )
        items = list_checklist(db, user.id)
        _emit(ctx, "movein_checklist", MoveInChecklistData(
            title="Task added",
            tasks=[
                MoveInTaskItem(id=i.id, category=i.category, label=i.label, completed=i.completed)
                for i in items
            ],
        ))
        _step(ctx, "movein", "Task added", "done")
        _ = item
        return f"Added task '{label}'."

    async def complete_movein_task(ctx: Context, task_id: str) -> str:
        """Mark a checklist task complete."""
        _step(ctx, "movein", "Marking complete", "running")
        patch_checklist_item(
            db, user.id, uuid.UUID(task_id),
            ChecklistItemPatch(completed=True),
        )
        _step(ctx, "movein", "Done", "done")
        return "Marked task complete."

    async def list_movein_orders(ctx: Context) -> str:
        """List the user's vendor orders (utilities, internet, movers, etc.)."""
        _step(ctx, "movein", "Loading orders", "running")
        orders = list_orders(db, user.id)
        _emit(ctx, "movein_orders", MoveInOrdersData(
            orders=[
                MoveInOrderItem(
                    id=o.id, vendor_name=o.vendor_name, plan_name=o.plan_name,
                    category=o.category, status=o.status,
                    scheduled_date=o.scheduled_date or None,
                    monthly_cost=o.monthly_cost or None,
                )
                for o in orders
            ],
            empty_message=("No orders yet." if not orders else None),
        ))
        _step(ctx, "movein", f"{len(orders)} order(s)", "done")
        return f"Listed {len(orders)} move-in order(s)."

    return [
        FunctionTool.from_defaults(
            async_fn=view_movein_plan, name="view_movein_plan",
            description="Show the user's move-in plan and current checklist.",
        ),
        FunctionTool.from_defaults(
            async_fn=update_movein_plan, name="update_movein_plan",
            description="Update the move-in plan: target address, move date, from address.",
        ),
        FunctionTool.from_defaults(
            async_fn=list_movein_tasks, name="list_movein_tasks",
            description="List move-in checklist tasks; optionally filter by completed flag.",
        ),
        FunctionTool.from_defaults(
            async_fn=add_movein_task, name="add_movein_task",
            description="Add a task to the move-in checklist.",
        ),
        FunctionTool.from_defaults(
            async_fn=complete_movein_task, name="complete_movein_task",
            description="Mark a move-in task complete.",
        ),
        FunctionTool.from_defaults(
            async_fn=list_movein_orders, name="list_movein_orders",
            description="List the user's move-in vendor orders (utilities, internet, movers).",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Guarantor tools
# ─────────────────────────────────────────────────────────────────────────────

def make_guarantor_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    def _emit_summary(ctx: Context) -> int:
        saved = list_saved_guarantors(db, user.id)
        reqs = guarantor_list_requests(db, user.id)
        _emit(ctx, "guarantor_summary", GuarantorSummaryData(
            saved=[
                GuarantorItem(
                    id=g.id, name=g.name, email=g.email,
                    phone=g.phone or None, relationship=g.relationship or None,
                )
                for g in saved
            ],
            requests=[
                GuarantorRequestItem(
                    id=r.id,
                    guarantor_name=(r.guarantor_snapshot or {}).get("name", "Unknown"),
                    guarantor_email=(r.guarantor_snapshot or {}).get("email", ""),
                    property_name=r.lease.property_name if r.lease else None,
                    property_address=r.lease.property_address if r.lease else None,
                    monthly_rent=r.lease.monthly_rent if r.lease else None,
                    status=r.status,
                    verification_status=r.verification_status or None,
                )
                for r in reqs
            ],
            empty_message=("No guarantors set up yet." if not saved and not reqs else None),
        ))
        return len(saved) + len(reqs)

    async def view_guarantor_center(ctx: Context) -> str:
        """Show the user's saved guarantors and active guarantor requests."""
        _step(ctx, "guarantor", "Loading guarantors", "running")
        n = _emit_summary(ctx)
        _step(ctx, "guarantor", "Loaded", "done")
        return f"Guarantor center: {n} item(s)."

    async def add_saved_guarantor(
        ctx: Context, name: str, email: str,
        phone: str = "", relationship: str = "",
    ) -> str:
        """Save a new guarantor contact (name + email + optional phone/relationship)."""
        _step(ctx, "guarantor", f"Saving {name}", "running")
        create_saved_guarantor(
            db, user.id,
            SavedGuarantorCreate(
                name=name, email=email, phone=phone, relationship=relationship,
            ),
        )
        _emit_summary(ctx)
        _step(ctx, "guarantor", "Saved", "done")
        return f"Saved guarantor {name} <{email}>."

    async def start_guarantor_request(
        ctx: Context,
        guarantor_id: str,
        property_name: str,
        property_address: str,
        monthly_rent: str,
        lease_start: str = "",
        lease_term: str = "",
    ) -> str:
        """Start a guarantor request for a specific property + lease + saved guarantor."""
        _step(ctx, "guarantor", "Creating request", "running")
        req = guarantor_create_request(
            db, user.id,
            GuarantorRequestCreate(
                guarantor_id=guarantor_id,
                lease=GuarantorLeasePayload(
                    property_name=property_name,
                    property_address=property_address,
                    monthly_rent=monthly_rent,
                    lease_start=lease_start,
                    lease_term=lease_term,
                ),
            ),
        )
        _emit_summary(ctx)
        _step(ctx, "guarantor", "Request created", "done")
        _ = req
        return f"Created guarantor request for {property_name}."

    async def invite_guarantor(ctx: Context, request_id: str) -> str:
        """Send the invite link to the guarantor for a previously created request."""
        _step(ctx, "guarantor", "Sending invite", "running")
        invite = guarantor_create_invite(db, user.id, uuid.UUID(request_id))
        _emit_summary(ctx)
        _step(ctx, "guarantor", "Invite sent", "done")
        _ = invite
        return "Invite sent."

    return [
        FunctionTool.from_defaults(
            async_fn=view_guarantor_center, name="view_guarantor_center",
            description="Show saved guarantors and active guarantor requests.",
        ),
        FunctionTool.from_defaults(
            async_fn=add_saved_guarantor, name="add_saved_guarantor",
            description="Save a new guarantor contact (name + email).",
        ),
        FunctionTool.from_defaults(
            async_fn=start_guarantor_request, name="start_guarantor_request",
            description="Start a guarantor request for a property; needs saved guarantor_id.",
        ),
        FunctionTool.from_defaults(
            async_fn=invite_guarantor, name="invite_guarantor",
            description="Send the invite link to the guarantor for a request.",
        ),
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Buildings tools (read-only)
# ─────────────────────────────────────────────────────────────────────────────

async def _resolve_address_to_building(
    db: Session, llm: LLM, address: str
) -> Buildings | None:
    """Read-only lookup of an existing building by free-text address.

    Buildings has NOT NULL latitude/longitude — we never want to mint zero-coord
    rows just because the agent surfaces an address. So this does not call
    resolve_or_create_building; it does a fuzzy match against normalized_addr
    using the LLM-cleaned street line, and returns None when nothing matches.
    """
    addr_clean = address.strip()
    parsed_street = addr_clean
    try:
        prompt = (
            "Extract the street_line1 (number + street, no city/state/zip) from "
            "this US address. Reply with the street line only, no extra text.\n"
            f"Address: {addr_clean}"
        )
        resp = await llm.achat([ChatMessage(role="user", content=prompt)])
        cand = (resp.message.content or "").strip().splitlines()[0].strip()
        if cand:
            parsed_street = cand
    except Exception:
        pass

    needle = parsed_street.lower().strip()
    return db.execute(
        select(Buildings)
        .where(Buildings.normalized_addr.ilike(f"%{needle}%"))
        .order_by(func.length(Buildings.normalized_addr))
        .limit(1)
    ).scalar_one_or_none()


def _building_profile_payload(
    db: Session, b: Buildings, *,
    reviews_total: int, reviews_recent: list[Any],
    hpd_open: int, dob_open: int,
    landlord: LandlordEntities | None,
) -> BuildingProfileData:
    avg = float(landlord.avg_rating_cached) if landlord and landlord.avg_rating_cached else None
    return BuildingProfileData(
        id=str(b.id),
        title=b.street_line1 or "Building",
        address=b.normalized_addr or b.street_line1 or "",
        city=b.city, state=b.state,
        landlord_name=landlord.canonical_name if landlord else None,
        avg_rating=avg, review_count=reviews_total,
        hpd_open_count=hpd_open, dob_open_count=dob_open,
        recent_reviews=[
            BuildingReviewSnippet(
                id=r.id, author=r.author_display_name,
                rating=r.overall_rating, title=r.title,
                body=(r.body or "")[:400],
                verified_tenant=r.verified_tenant,
            )
            for r in reviews_recent[:3]
        ],
    )


def make_buildings_tools(user: Users, db: Session, llm: LLM) -> list[FunctionTool]:
    async def lookup_building(ctx: Context, address: str) -> str:
        """Look up a building by address. Returns building_id and a profile card.

        Pass a free-text address like '100 Bedford Ave, Brooklyn, NY 11211'.
        """
        _step(ctx, "buildings", f"Looking up {address[:60]}", "running")
        b = await _resolve_address_to_building(db, llm, address)
        if b is None:
            _step(ctx, "buildings", "Not found", "done")
            return f"Could not resolve building for: {address}"
        reviews, total = list_building_reviews(db, str(b.id), 5, 0, False)
        hpd, hpd_total = list_hpd_violations(db, str(b.id), 100, True)
        dob, dob_total = list_dob_complaints(db, str(b.id), 100, True)
        landlord_period = db.execute(
            select(BuildingOwnershipPeriods)
            .where(
                BuildingOwnershipPeriods.building_id == b.id,
                BuildingOwnershipPeriods.role == OwnershipRole.owner,
                BuildingOwnershipPeriods.end_date.is_(None),
            )
            .limit(1)
        ).scalar_one_or_none()
        landlord = None
        if landlord_period:
            landlord = db.get(LandlordEntities, landlord_period.landlord_entity_id)
        _emit(ctx, "building_profile", _building_profile_payload(
            db, b,
            reviews_total=total, reviews_recent=reviews,
            hpd_open=hpd_total, dob_open=dob_total, landlord=landlord,
        ))
        _step(ctx, "buildings", "Loaded", "done")
        return (
            f"Building {b.street_line1}: {total} review(s), "
            f"{hpd_total} open HPD, {dob_total} open DOB."
        )

    async def list_reviews_for_building(
        ctx: Context, building_id: str, limit: int = 10
    ) -> str:
        """List existing reviews for a building."""
        _step(ctx, "buildings", "Loading reviews", "running")
        reviews, total = list_building_reviews(
            db, building_id, max(1, min(limit, 25)), 0, False
        )
        b = db.get(Buildings, uuid.UUID(building_id))
        if b is None:
            return "Building not found."
        _emit(ctx, "building_profile", BuildingProfileData(
            id=str(b.id), title=b.street_line1 or "Building",
            address=b.normalized_addr or "",
            city=b.city, state=b.state,
            review_count=total,
            recent_reviews=[
                BuildingReviewSnippet(
                    id=r.id, author=r.author_display_name,
                    rating=r.overall_rating, title=r.title,
                    body=(r.body or "")[:400],
                    verified_tenant=r.verified_tenant,
                )
                for r in reviews[:5]
            ],
        ))
        _step(ctx, "buildings", f"{total} review(s)", "done")
        return f"Listed {total} review(s) for the building."

    async def list_hpd_violations_for_building(
        ctx: Context, building_id: str, open_only: bool = True
    ) -> str:
        """List HPD violations for a building (NYC only). Default: open only."""
        _step(ctx, "buildings", "Loading HPD violations", "running")
        rows, total = list_hpd_violations(db, building_id, 50, open_only)
        _step(ctx, "buildings", f"{total} HPD violation(s)", "done")
        if not rows:
            return f"No {'open ' if open_only else ''}HPD violations on file."
        lines = [
            f"  - {r.violation_id} class={r.violation_class or '?'} status={r.status or '?'}: {(r.description or '')[:80]}"
            for r in rows[:10]
        ]
        return f"{total} HPD violation(s):\n" + "\n".join(lines)

    async def list_dob_complaints_for_building(
        ctx: Context, building_id: str, open_only: bool = True
    ) -> str:
        """List DOB complaints for a building (NYC only). Default: open only."""
        _step(ctx, "buildings", "Loading DOB complaints", "running")
        rows, total = list_dob_complaints(db, building_id, 50, open_only)
        _step(ctx, "buildings", f"{total} DOB complaint(s)", "done")
        if not rows:
            return f"No {'open ' if open_only else ''}DOB complaints on file."
        lines = [
            f"  - {r.complaint_number} cat={r.category or '?'} status={r.status or '?'}"
            for r in rows[:10]
        ]
        return f"{total} DOB complaint(s):\n" + "\n".join(lines)

    async def lookup_landlord(ctx: Context, name: str) -> str:
        """Look up a landlord entity by name (fuzzy match). Returns reviews + portfolio size."""
        _step(ctx, "buildings", f"Looking up landlord {name[:40]}", "running")
        ent = db.execute(
            select(LandlordEntities)
            .where(LandlordEntities.canonical_name.ilike(f"%{name}%"))
            .limit(1)
        ).scalar_one_or_none()
        if ent is None:
            _step(ctx, "buildings", "Not found", "done")
            return f"No landlord matching '{name}'."
        detail = get_entity_detail(db, str(ent.id))
        reviews_resp = list_entity_reviews(db, str(ent.id), 5, 0, False)
        _emit(ctx, "landlord_profile", LandlordProfileData(
            id=detail.id,
            canonical_name=detail.canonical_name,
            portfolio_size=detail.portfolio_size,
            avg_rating=float(detail.avg_rating) if detail.avg_rating is not None else None,
            review_count=detail.review_count,
            verified_tenant_review_count=detail.verified_tenant_review_count,
            recent_reviews=[
                BuildingReviewSnippet(
                    id=r.id, author=r.author_display_name,
                    rating=r.overall_rating, title=r.title,
                    body=(r.body or "")[:400],
                    verified_tenant=r.verified_tenant,
                )
                for r in reviews_resp.reviews[:3]
            ],
        ))
        _step(ctx, "buildings", "Loaded", "done")
        return (
            f"Landlord {detail.canonical_name}: {detail.portfolio_size} buildings, "
            f"{detail.review_count} reviews."
        )

    return [
        FunctionTool.from_defaults(
            async_fn=lookup_building, name="lookup_building",
            description="Look up a building by free-text address. Returns building card with HPD/DOB counts and recent reviews.",
        ),
        FunctionTool.from_defaults(
            async_fn=list_reviews_for_building, name="list_reviews_for_building",
            description="List recent reviews for a building (read-only).",
        ),
        FunctionTool.from_defaults(
            async_fn=list_hpd_violations_for_building, name="list_hpd_violations_for_building",
            description="List HPD violations for a NYC building. Default open_only=True.",
        ),
        FunctionTool.from_defaults(
            async_fn=list_dob_complaints_for_building, name="list_dob_complaints_for_building",
            description="List DOB complaints for a NYC building. Default open_only=True.",
        ),
        FunctionTool.from_defaults(
            async_fn=lookup_landlord, name="lookup_landlord",
            description="Look up a landlord entity by name (fuzzy). Returns portfolio + reviews.",
        ),
    ]
