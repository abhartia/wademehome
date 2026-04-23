"""Renter-lifecycle prompt suite for the home agent — 100 cases.

Each case carries the prompt text plus assertions about what the workflow
should do — which specialist should pick it up, which tools should be
called, which UIEvent card types should be emitted, and which should NOT
be emitted. Organized by lifecycle stage so regressions localize to the
right domain.

Stages:
  meta, onboarding, discovery, refinement, saving, touring, profile,
  roommates, groups, lease, movein, guarantor, buildings, attachments,
  cross_cutting

Expected fields:
  expected_agents / forbidden_agents     - agent names
  expected_tools  / forbidden_tools      - tool names  (expected is AT-LEAST-ONE)
  expected_cards  / forbidden_cards      - UIEvent card 'type' values
  context_from                           - case IDs whose last turn seeds history
  skip_runner                            - case is documented but not run
                                           (e.g. requires file attachment)
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class PromptCase:
    stage: str
    id: str
    prompt: str
    notes: str = ""
    expected_agents: set[str] = field(default_factory=set)
    forbidden_agents: set[str] = field(default_factory=set)
    expected_tools: set[str] = field(default_factory=set)
    forbidden_tools: set[str] = field(default_factory=set)
    expected_cards: set[str] = field(default_factory=set)
    forbidden_cards: set[str] = field(default_factory=set)
    context_from: list[str] = field(default_factory=list)
    skip_runner: bool = False


# Non-specialist agents that must NOT run for domain cases.
_NO_SEARCH = {"search_agent"}


# ───────────────────────── meta / help ─────────────────────────
META = [
    PromptCase(
        stage="meta",
        id="meta_what_can_you_help",
        prompt="what can you help me with?",
        notes="Pure meta — orchestrator answers inline, no specialist.",
        forbidden_agents={"search_agent", "navigator_agent", "movein_agent"},
        forbidden_cards={"navigation_action", "property_results"},
    ),
    PromptCase(
        stage="meta",
        id="meta_get_started",
        prompt="how do I get started?",
        notes="Onboarding-shaped meta. Navigator onboarding is acceptable; " "orchestrator-only is also fine.",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="meta",
        id="meta_actually_book",
        prompt="are you able to actually book things, or just show me links?",
        forbidden_agents={"search_agent", "tours_agent", "navigator_agent"},
    ),
    PromptCase(
        stage="meta",
        id="meta_save_vs_tour",
        prompt="what's the difference between saving and scheduling a tour?",
        forbidden_agents={"search_agent", "tours_agent", "saved_agent"},
    ),
    PromptCase(
        stage="meta",
        id="meta_privacy",
        prompt="is my data private?",
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
]


# ───────────────────────── onboarding ─────────────────────────
ONBOARDING = [
    PromptCase(
        stage="onboarding",
        id="ob_brand_new",
        prompt="I'm brand new here, set me up",
        expected_agents={"navigator_agent"},
        expected_tools={"open_app_section"},
        expected_cards={"navigation_action"},
    ),
    PromptCase(
        stage="onboarding",
        id="ob_finish_profile",
        prompt="help me finish my profile",
        notes="Either profile_agent (to show/update) or navigator (onboarding) is acceptable.",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="onboarding",
        id="ob_no_movein_date",
        prompt="I don't have a move-in date yet, is that ok?",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="onboarding",
        id="ob_unsure_neighborhood",
        prompt="I'm not sure what neighborhood I want — guide me",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="onboarding",
        id="ob_complete_onboarding",
        prompt="complete onboarding for me",
        expected_agents={"navigator_agent"},
        expected_tools={"open_app_section"},
    ),
]


# ───────────────────────── discovery / search ─────────────────────────
SEARCH = [
    PromptCase(
        stage="discovery",
        id="search_2br_williamsburg",
        prompt="find me a 2BR under $4500 in Williamsburg",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
        expected_cards={"property_results"},
    ),
    PromptCase(
        stage="discovery",
        id="search_show_dishwasher",
        prompt="show me only the ones with a dishwasher",
        context_from=["search_2br_williamsburg"],
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_under_3k_wd",
        prompt="anything under 3k with a washer/dryer?",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_doorman_central_park",
        prompt="I want a doorman building near Central Park",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_quiet_top_floor",
        prompt="quiet block, 1BR, top-floor, under 3800",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_pet_studio_lic",
        prompt="pet-friendly studios in LIC",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_compare_three",
        prompt="compare the cheapest three you just showed me",
        context_from=["search_2br_williamsburg"],
        notes="Refinement on prior results. Must not re-route to navigator.",
        forbidden_agents={"navigator_agent"},
    ),
    PromptCase(
        stage="discovery",
        id="search_near_l_train",
        prompt="what's available near the L train?",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_parking_included",
        prompt="I need parking included",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_outdoor_space",
        prompt="something with outdoor space under 5k",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_posted_this_week",
        prompt="only show me listings posted this week",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_drop_budget",
        prompt="drop the budget to 3500",
        context_from=["search_2br_williamsburg"],
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_near_school",
        prompt="show me places close to a good elementary school",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_no_ground_floor",
        prompt="I hate ground-floor apartments, filter those out",
        context_from=["search_2br_williamsburg"],
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="discovery",
        id="search_include_jc",
        prompt="same search but include Jersey City this time",
        context_from=["search_2br_williamsburg"],
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
]


# ───────────────────────── saving ─────────────────────────
SAVING = [
    PromptCase(
        stage="saving",
        id="save_first",
        prompt="save the first one",
        context_from=["search_2br_williamsburg"],
        expected_agents={"saved_agent"},
        expected_tools={"save_property"},
        forbidden_tools={"search_listings"},
        forbidden_cards={"property_results"},
        notes="After a save, the turn STOPS. No chained search, no extra " "property_results cards.",
    ),
    PromptCase(
        stage="saving",
        id="just_save_no_chain",
        prompt="just save",
        context_from=["search_2br_williamsburg"],
        notes="Regression: after 'just save', saved_agent must not hand off "
        "to search_agent. Only save_property runs; no search_listings.",
        expected_agents={"saved_agent"},
        expected_tools={"save_property"},
        forbidden_agents={"search_agent"},
        forbidden_tools={"search_listings"},
        forbidden_cards={"property_results"},
    ),
    PromptCase(
        stage="saving",
        id="save_second_also",
        prompt="actually save the second one too",
        context_from=["search_2br_williamsburg", "save_first"],
        expected_agents={"saved_agent"},
        expected_tools={"save_property"},
    ),
    PromptCase(
        stage="saving",
        id="saved_list",
        prompt="show my saved properties",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        expected_cards={"favorites_results"},
    ),
    PromptCase(
        stage="saving",
        id="saved_remove_bushwick",
        prompt="remove the Bushwick one from saved",
        notes="If user has no Bushwick saved, list + ask is fine. Accept either.",
        expected_agents={"saved_agent"},
        expected_tools={"remove_saved_property", "list_saved_properties"},
    ),
    PromptCase(
        stage="saving",
        id="saved_cheapest",
        prompt="which of my saved places is cheapest?",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
    ),
    PromptCase(
        stage="saving",
        id="saved_with_laundry",
        prompt="which saved places have laundry in-unit?",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
    ),
    PromptCase(
        stage="saving",
        id="saved_clear_all",
        prompt="clear all my saved",
        notes="No bulk-delete tool — agent should ask / walk through removal.",
        expected_agents={"saved_agent"},
        forbidden_agents={"search_agent"},
    ),
]


# ───────────────────────── touring ─────────────────────────
TOURS = [
    PromptCase(
        stage="touring",
        id="tour_schedule_first_tomorrow",
        prompt="schedule a tour for the first one tomorrow at 3pm",
        context_from=["search_2br_williamsburg"],
        expected_agents={"tours_agent"},
        expected_tools={"schedule_tour"},
    ),
    PromptCase(
        stage="touring",
        id="tour_book_second_saturday",
        prompt="book a viewing for #2 on Saturday morning",
        context_from=["search_2br_williamsburg"],
        expected_agents={"tours_agent"},
        expected_tools={"schedule_tour"},
    ),
    PromptCase(
        stage="touring",
        id="tour_upcoming",
        prompt="what tours do I have coming up?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
        expected_cards={"tours_results"},
    ),
    PromptCase(
        stage="touring",
        id="tour_reschedule_thursday",
        prompt="reschedule my Thursday tour to Friday",
        expected_agents={"tours_agent"},
    ),
    PromptCase(
        stage="touring",
        id="tour_cancel_4pm",
        prompt="cancel my 4pm tour",
        notes="If user has 0 or >1 4pm tours, agent should list and ask. "
        "Only assert it stays in tours_agent and doesn't loop.",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours", "cancel_tour", "update_tour_status"},
    ),
    PromptCase(
        stage="touring",
        id="tour_completed_list",
        prompt="which tours have I already completed?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="touring",
        id="tour_add_note",
        prompt="add a note to my Friday tour: bring a tape measure",
        notes="No note-editing tool — agent should gracefully say it can't, "
        "but must still route to tours_agent (not navigator).",
        expected_agents={"tours_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="touring",
        id="tour_this_week",
        prompt="show me tours this week",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="touring",
        id="tour_mark_completed",
        prompt="I toured that place — log it as completed",
        notes="Without a referent, agent should list tours and ask. Accept "
        "either update_tour_status (if tools picks a unique match) or "
        "just list_my_tours + short clarifying reply.",
        expected_agents={"tours_agent"},
        expected_tools={"update_tour_status", "list_my_tours"},
    ),
    PromptCase(
        stage="touring",
        id="tour_next_address",
        prompt="what's the address of my next tour?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
]


# ───────────────────────── profile ─────────────────────────
PROFILE = [
    PromptCase(
        stage="profile",
        id="profile_budget",
        prompt="what's my budget?",
        expected_agents={"profile_agent"},
        expected_tools={"view_my_profile"},
        expected_cards={"profile_summary"},
    ),
    PromptCase(
        stage="profile",
        id="profile_set_rent_5000",
        prompt="set my max rent to 5000",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
    ),
    PromptCase(
        stage="profile",
        id="profile_live_in_jc",
        prompt="I want to live in Jersey City",
        notes="'Want to live in X' updates preferred_cities, not a search. "
        "If Jersey City is already in the list, view_my_profile + a "
        "one-sentence confirmation is acceptable (no duplicate add).",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile", "view_my_profile"},
        forbidden_agents={"search_agent"},
        forbidden_tools={"search_listings"},
    ),
    PromptCase(
        stage="profile",
        id="profile_add_astoria",
        prompt="add Astoria to my preferred neighborhoods",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="profile",
        id="profile_has_dog",
        prompt="I have a dog — update my profile",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
    ),
    PromptCase(
        stage="profile",
        id="profile_movein_date",
        prompt="my move-in date is June 1",
        notes="Renter-prefs move-in date (profile.move_in_date), not the "
        "movein plan's schedule. Either profile_agent OR movein_agent "
        "is acceptable here.",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="profile",
        id="profile_student",
        prompt="I'm a student, note that",
        notes="UserProfiles has no is_student column — the closest field is "
        "neighbourhood_priorities or dealbreakers. Agent may either "
        "persist via those OR say the field isn't supported. Only "
        "assert it routes to profile_agent and does NOT hallucinate.",
        expected_agents={"profile_agent"},
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
    PromptCase(
        stage="profile",
        id="profile_change_name",
        prompt="change my name to Abhy",
        notes="Legal name lives on Users, not UserProfiles — update_my_profile "
        "can't persist it today. Profile agent must route here and say "
        "so explicitly (not hallucinate success).",
        expected_agents={"profile_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="profile",
        id="profile_dealbreakers",
        prompt="what are my dealbreakers right now?",
        expected_agents={"profile_agent"},
        expected_tools={"view_my_profile"},
    ),
    PromptCase(
        stage="profile",
        id="profile_remove_elevator",
        prompt="remove elevator from my must-haves",
        notes="If user has no must-haves set, update_my_profile not needed; "
        "agent should view_my_profile and reply 'nothing to remove'. "
        "Just ensure it stays in profile_agent.",
        expected_agents={"profile_agent"},
        forbidden_agents={"search_agent"},
    ),
]


# ───────────────────────── roommates ─────────────────────────
ROOMMATES = [
    PromptCase(
        stage="roommates",
        id="rm_find_match",
        prompt="find me a roommate match in Brooklyn under 2k",
        expected_agents={"roommates_agent"},
        expected_tools={"list_roommate_matches"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_night_owl_clean",
        prompt="I'm a night owl and very clean — update my roommate profile",
        notes="Personality pref goes to roommates_agent, NOT profile_agent.",
        expected_agents={"roommates_agent"},
        expected_tools={"update_my_roommate_profile"},
        forbidden_agents={"profile_agent"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_message_first",
        prompt="message the first match",
        context_from=["rm_find_match"],
        notes="If no matches exist for the test user, listing + reply is fine.",
        expected_agents={"roommates_agent"},
        expected_tools={"message_connection", "connect_with_match", "list_roommate_matches"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_connections",
        prompt="show me my roommate connections",
        expected_agents={"roommates_agent"},
        expected_tools={"list_my_connections"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_accepted",
        prompt="who's accepted my roommate request?",
        expected_agents={"roommates_agent"},
        expected_tools={"list_my_connections"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_start_group",
        prompt="start a group with that match",
        context_from=["rm_find_match"],
        notes="Either roommates_agent.start_group_from_connection OR a handoff "
        "to groups_agent.create_group is fine. Only forbid wrong domains.",
        forbidden_agents={"search_agent", "movein_agent"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_gender_pref",
        prompt="I want a female roommate, non-smoker",
        expected_agents={"roommates_agent"},
        expected_tools={"update_my_roommate_profile", "list_roommate_matches"},
        forbidden_agents={"profile_agent"},
    ),
    PromptCase(
        stage="roommates",
        id="rm_withdraw_request",
        prompt="withdraw my connection request to person #2",
        notes="No withdraw tool today — agent should say so, but still stay in roommates.",
        expected_agents={"roommates_agent"},
        forbidden_agents={"search_agent"},
    ),
]


# ───────────────────────── groups ─────────────────────────
GROUPS = [
    PromptCase(
        stage="groups",
        id="grp_create_nyc_hunt",
        prompt="create a group called NYC Hunt and invite alice@example.com",
        expected_agents={"groups_agent"},
        expected_tools={"create_group", "invite_to_group"},
    ),
    PromptCase(
        stage="groups",
        id="grp_list_mine",
        prompt="show me my groups",
        expected_agents={"groups_agent"},
        expected_tools={"list_my_groups"},
    ),
    PromptCase(
        stage="groups",
        id="grp_members_of",
        prompt="who's in my NYC Hunt group?",
        expected_agents={"groups_agent"},
        expected_tools={"list_my_groups"},
    ),
    PromptCase(
        stage="groups",
        id="grp_save_to_group",
        prompt="save the current listing to my NYC Hunt group",
        context_from=["search_2br_williamsburg"],
        expected_agents={"groups_agent"},
        expected_tools={"save_property_to_group"},
    ),
    PromptCase(
        stage="groups",
        id="grp_remove_bob",
        prompt="remove Bob from the group",
        notes="No remove-member tool today — agent should say so, stay in groups.",
        expected_agents={"groups_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="groups",
        id="grp_promote_admin",
        prompt="promote alice to admin of the group",
        notes="No role-change tool — agent should say so, stay in groups.",
        expected_agents={"groups_agent"},
        forbidden_agents={"search_agent"},
    ),
]


# ───────────────────────── lease ─────────────────────────
LEASE = [
    PromptCase(
        stage="lease",
        id="lease_upload_parse",
        prompt="I just uploaded my lease, parse it for me",
        notes="Attachment not actually sent by runner — agent should ask for "
        "the upload OR summarize if one exists. Must stay in lease.",
        expected_agents={"lease_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="lease",
        id="lease_pets",
        prompt="what does my lease say about pets?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_end",
        prompt="when does my lease end?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease", "view_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_sublet",
        prompt="am I allowed to sublet?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_security_deposit",
        prompt="what's the security deposit amount?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease", "view_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_break_clause",
        prompt="is there an early-termination clause?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_paint_walls",
        prompt="can I paint the walls?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="lease",
        id="lease_summarize",
        prompt="summarize my lease in 5 bullets",
        expected_agents={"lease_agent"},
        expected_tools={"view_my_lease", "ask_about_my_lease"},
    ),
]


# ───────────────────────── move-in ─────────────────────────
MOVEIN = [
    PromptCase(
        stage="movein",
        id="mi_tell_me_about_place",
        prompt="tell me about the place I'm moving to",
        notes="Regression guard — this was the original bug (routed to search).",
        expected_agents={"movein_agent"},
        expected_tools={"view_movein_plan"},
        forbidden_agents={"search_agent"},
        forbidden_tools={"search_listings"},
        forbidden_cards={"property_results"},
    ),
    PromptCase(
        stage="movein",
        id="mi_checklist",
        prompt="what's on my move-in checklist?",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
        expected_cards={"movein_checklist"},
    ),
    PromptCase(
        stage="movein",
        id="mi_add_internet",
        prompt="add 'set up internet' due Friday",
        expected_agents={"movein_agent"},
        expected_tools={"add_movein_task"},
    ),
    PromptCase(
        stage="movein",
        id="mi_add_forward_mail",
        prompt="add 'forward mail' to my move-in checklist",
        # Seeds the referent for mi_mark_forward_mail.
        expected_agents={"movein_agent"},
        expected_tools={"add_movein_task"},
    ),
    PromptCase(
        stage="movein",
        id="mi_mark_forward_mail",
        prompt="mark 'forward mail' as done",
        # Depends on mi_add_forward_mail seeding the task in the same run
        # so the referent exists regardless of pre-test DB state.
        context_from=["mi_add_forward_mail"],
        expected_agents={"movein_agent"},
        expected_tools={"complete_movein_task"},
    ),
    PromptCase(
        stage="movein",
        id="mi_whats_left",
        prompt="what's left before I move?",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
    ),
    PromptCase(
        stage="movein",
        id="mi_schedule_movers",
        prompt="I want to schedule movers",
        notes="No order-creation tool today — agent should list orders or " "explain, but stay in movein.",
        expected_agents={"movein_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="movein",
        id="mi_order_cleaning",
        prompt="order cleaning for the day before move-in",
        expected_agents={"movein_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="movein",
        id="mi_list_orders",
        prompt="show my move-in orders",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_orders"},
    ),
    PromptCase(
        stage="movein",
        id="mi_take_photos",
        prompt="I want to take my move-in photos",
        notes="Photos route to navigator (camera UI); movein has no photo tool.",
        expected_cards={"navigation_action"},
        forbidden_agents={"search_agent"},
    ),
]


# ───────────────────────── guarantor ─────────────────────────
GUARANTOR = [
    PromptCase(
        stage="guarantor",
        id="gt_view_center",
        prompt="do I have a guarantor set up?",
        expected_agents={"guarantor_agent"},
        expected_tools={"view_guarantor_center"},
    ),
    PromptCase(
        stage="guarantor",
        id="gt_add_dad",
        prompt="add my dad as a saved guarantor",
        notes="Missing email/phone — agent should ask or stub; must stay in guarantor.",
        expected_agents={"guarantor_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="guarantor",
        id="gt_send_request",
        prompt="send a guarantor request to landlord@example.com",
        expected_agents={"guarantor_agent"},
        expected_tools={"start_guarantor_request"},
    ),
    PromptCase(
        stage="guarantor",
        id="gt_status",
        prompt="what's the status of my guarantor request?",
        expected_agents={"guarantor_agent"},
        expected_tools={"view_guarantor_center"},
    ),
    PromptCase(
        stage="guarantor",
        id="gt_invite_saved",
        prompt="invite my saved guarantor to the active request",
        expected_agents={"guarantor_agent"},
        # Test user has 4 saved guarantors, so asking "which one?" (via
        # view_guarantor_center then clarification text) is correct. Accept
        # either the direct invite path or the disambiguation path.
        expected_tools={"invite_guarantor", "view_guarantor_center"},
        notes="ambiguous when >1 saved guarantor exists — clarification is OK",
    ),
]


# ───────────────────────── buildings ─────────────────────────
BUILDINGS = [
    PromptCase(
        stage="buildings",
        id="bld_reviews_bedford",
        prompt="show me reviews for 100 Bedford Ave, Brooklyn",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_building", "list_reviews_for_building"},
    ),
    PromptCase(
        stage="buildings",
        id="bld_hpd_at_address",
        prompt="any HPD violations at that address?",
        context_from=["bld_reviews_bedford"],
        expected_agents={"buildings_agent"},
        expected_tools={"list_hpd_violations_for_building", "lookup_building"},
    ),
    PromptCase(
        stage="buildings",
        id="bld_dob_grand",
        prompt="DOB complaints for 250 Grand St?",
        expected_agents={"buildings_agent"},
        expected_tools={"list_dob_complaints_for_building", "lookup_building"},
    ),
    PromptCase(
        stage="buildings",
        id="bld_owner",
        prompt="who owns that building?",
        context_from=["bld_reviews_bedford"],
        expected_agents={"buildings_agent"},
    ),
    PromptCase(
        stage="buildings",
        id="bld_current_landlord",
        prompt="what do people say about my current landlord?",
        notes="No lease/current-landlord data for the test user — agent may "
        "ask for an address or name. Must stay in buildings_agent.",
        expected_agents={"buildings_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="buildings",
        id="bld_leave_review",
        prompt="I want to leave a review for my old building",
        notes="Write-review flow = navigator (multi-step form UI).",
        expected_agents={"navigator_agent"},
        expected_tools={"open_app_section"},
        expected_cards={"navigation_action"},
    ),
]


# ───────────────────────── attachments (documented; cannot run through runner) ───
ATTACHMENTS = [
    PromptCase(
        stage="attachments",
        id="att_random_photo",
        prompt="[attaches random photo] where does this go?",
        skip_runner=True,
        notes="Orchestrator should ASK where the photo belongs (move-in / "
        "roommate avatar / building review). Needs multipart upload path.",
    ),
    PromptCase(
        stage="attachments",
        id="att_lease_docx",
        prompt="[attaches lease DOCX] read my lease",
        skip_runner=True,
        notes="Orchestrator routes to lease_agent when kind=lease.",
    ),
    PromptCase(
        stage="attachments",
        id="att_floorplan_fit",
        prompt="[attaches floorplan image] does this fit a queen bed?",
        skip_runner=True,
        notes="Requires vision-capable model; punt to floorplan feature.",
    ),
]


# ───────────────────────── cross-cutting / edge ─────────────────────────
CROSS = [
    PromptCase(
        stage="cross_cutting",
        id="x_undo_last",
        prompt="undo my last action",
        notes="No undo today — orchestrator should say so, not route anywhere destructive.",
        forbidden_agents={"search_agent", "saved_agent", "tours_agent"},
        forbidden_tools={"remove_saved_property", "cancel_tour", "update_my_profile"},
    ),
    PromptCase(
        stage="cross_cutting",
        id="x_switch_brooklyn_to_queens",
        prompt="I changed my mind — switch me from Brooklyn to Queens everywhere",
        notes="Profile-level city change; profile_agent must run. If Queens "
        "is already in the list and Brooklyn isn't, view_my_profile + "
        "a one-sentence no-op confirmation is acceptable.",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile", "view_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cross_cutting",
        id="x_journey_summary",
        prompt="summarize where I am in my rental journey",
        notes="Orchestrator may answer inline, or route to profile_agent / "
        "movein_agent. Must NOT run a listings search.",
        forbidden_tools={"search_listings"},
    ),
]


# ─────────────────────────────────────────────────────────────────────────
# COLD-START SUITE — 100 independent first-turn prompts.
# No context_from. Each is what a user might open the app and type fresh.
# IDs prefixed "cs_" to avoid collision with the multi-turn suite above.
# ─────────────────────────────────────────────────────────────────────────

COLD_META = [
    PromptCase(stage="cs_meta", id="cs_hey", prompt="hey", forbidden_agents={"search_agent", "navigator_agent"}),
    PromptCase(
        stage="cs_meta", id="cs_hello_there", prompt="hello there", forbidden_agents={"search_agent", "navigator_agent"}
    ),
    PromptCase(
        stage="cs_meta",
        id="cs_are_you_human",
        prompt="are you a human?",
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
    PromptCase(
        stage="cs_meta",
        id="cs_what_is_wade",
        prompt="what is wade me home?",
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
    PromptCase(
        stage="cs_meta",
        id="cs_i_dont_know",
        prompt="I don't know what I'm doing",
        notes="Vague — can ask clarifying Q or offer onboarding. Must not search blindly.",
        forbidden_agents={"search_agent"},
    ),
    PromptCase(stage="cs_meta", id="cs_help", prompt="help", forbidden_agents={"search_agent"}),
    PromptCase(
        stage="cs_meta",
        id="cs_can_you_find",
        prompt="can you find me an apartment?",
        notes="Meta question about capability. Orchestrator may answer inline "
        "OR route to search_agent (both reasonable).",
        forbidden_agents={"navigator_agent"},
    ),
    PromptCase(
        stage="cs_meta",
        id="cs_is_this_free",
        prompt="is this free?",
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
    PromptCase(stage="cs_meta", id="cs_thanks", prompt="thanks", forbidden_agents={"search_agent", "navigator_agent"}),
    PromptCase(
        stage="cs_meta", id="cs_ok_cool", prompt="ok cool", forbidden_agents={"search_agent", "navigator_agent"}
    ),
]

COLD_SEARCH = [
    PromptCase(
        stage="cs_discovery",
        id="cs_1br_bushwick_3k",
        prompt="I want a 1BR in Bushwick under 3k",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
        expected_cards={"property_results"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_3br_harlem",
        prompt="find 3-bedrooms in Harlem",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_pet_east_village",
        prompt="pet-friendly apartments in the east village",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_studio_fidi",
        prompt="I need a studio in FiDi for under 2500",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_luxury_lic_gym",
        prompt="luxury 2BR in LIC with a gym",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_rent_stabilized_chelsea",
        prompt="rent-stabilized in Chelsea",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_brownstone_park_slope",
        prompt="brownstone in Park Slope with a backyard",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_cheapest_1br_manhattan",
        prompt="cheapest 1BR in Manhattan",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_2br_astoria_laundry",
        prompt="2BR in Astoria under 3500, laundry in-unit",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_duplex_brooklyn",
        prompt="duplex with outdoor space in Brooklyn",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_near_nyu",
        prompt="apartments near NYU",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_family_queens",
        prompt="family-friendly rentals near good schools in Queens",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_furnished_midtown",
        prompt="furnished short-term 1BR in Midtown",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_studio_ues_elevator",
        prompt="studio on the Upper East Side with elevator",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_garden_park_slope",
        prompt="garden-level 1BR in Park Slope",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_williamsburg_roof",
        prompt="2BR in Williamsburg with roof deck",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_modern_lic",
        prompt="modern 1BR in LIC under 3500",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_convertible_2br",
        prompt="convertible 2BR with dishwasher under 4000",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_near_g_train",
        prompt="something near the G train",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_discovery",
        id="cs_dumbo_affordable",
        prompt="affordable 1BR in DUMBO",
        expected_agents={"search_agent"},
        expected_tools={"search_listings"},
    ),
]

COLD_SAVING = [
    PromptCase(
        stage="cs_saving",
        id="cs_show_saved",
        prompt="show my saved apartments",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        expected_cards={"favorites_results"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_saving",
        id="cs_any_favorites",
        prompt="do I have any favorites saved?",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_saving",
        id="cs_how_many_favorited",
        prompt="how many places have I favorited?",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_saving",
        id="cs_list_saved_properties",
        prompt="list my saved properties",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_saving",
        id="cs_see_favorites",
        prompt="I'd like to see my favorites",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_saving",
        id="cs_what_starred",
        prompt="what have I starred?",
        expected_agents={"saved_agent"},
        expected_tools={"list_saved_properties"},
        forbidden_agents={"search_agent"},
    ),
]

COLD_TOURS = [
    PromptCase(
        stage="cs_touring",
        id="cs_next_tour",
        prompt="when is my next tour?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
        expected_cards={"tours_results"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_any_tours_scheduled",
        prompt="do I have any tours scheduled?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_tours_this_week",
        prompt="what tours do I have this week?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_tour_today",
        prompt="I have a tour today, what time?",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_tour_schedule",
        prompt="show my tour schedule",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_book_123_main_sat",
        prompt="book a tour at 123 Main St on Saturday",
        expected_agents={"tours_agent"},
        expected_tools={"schedule_tour"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_schedule_100_park_2pm",
        prompt="schedule a showing at 100 Park Ave tomorrow at 2pm",
        expected_agents={"tours_agent"},
        expected_tools={"schedule_tour"},
    ),
    PromptCase(
        stage="cs_touring",
        id="cs_upcoming_tours",
        prompt="upcoming tours",
        expected_agents={"tours_agent"},
        expected_tools={"list_my_tours"},
    ),
]

COLD_PROFILE = [
    PromptCase(
        stage="cs_profile",
        id="cs_show_preferences",
        prompt="show my preferences",
        expected_agents={"profile_agent"},
        expected_tools={"view_my_profile"},
        expected_cards={"profile_summary"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_search_criteria",
        prompt="what are my search criteria?",
        expected_agents={"profile_agent"},
        expected_tools={"view_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_update_budget_4000",
        prompt="update my budget to 4000",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_prefer_elevator",
        prompt="I prefer elevator buildings",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_allergic_cats",
        prompt="I'm allergic to cats",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_add_doorman",
        prompt="add doorman to must-haves",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_want_outdoor",
        prompt="I want outdoor space",
        notes="Ambiguous — profile pref or search filter. Either is fine; " "just don't route to navigator.",
        forbidden_agents={"navigator_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_movein_july_15",
        prompt="my target move-in is July 15",
        notes="Either profile_agent (move-in date pref) or movein_agent (plan). " "Must not search.",
        forbidden_agents={"search_agent", "navigator_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_no_pets",
        prompt="I don't have any pets",
        expected_agents={"profile_agent"},
        expected_tools={"update_my_profile"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_profile",
        id="cs_whats_max_rent",
        prompt="what's my max rent?",
        expected_agents={"profile_agent"},
        expected_tools={"view_my_profile"},
    ),
]

COLD_ROOMMATES = [
    PromptCase(
        stage="cs_roommates",
        id="cs_find_matches",
        prompt="find me roommate matches",
        expected_agents={"roommates_agent"},
        expected_tools={"list_roommate_matches"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_show_rm_profile",
        prompt="show my roommate profile",
        expected_agents={"roommates_agent"},
        expected_tools={"view_my_roommate_profile"},
        forbidden_agents={"profile_agent"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_looking_rm_brooklyn",
        prompt="I'm looking for a roommate in Brooklyn",
        expected_agents={"roommates_agent"},
        expected_tools={"list_roommate_matches"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_top_matches",
        prompt="who are my top roommate matches?",
        expected_agents={"roommates_agent"},
        expected_tools={"list_roommate_matches"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_quiet_tidy",
        prompt="I'm quiet, tidy, non-smoker",
        notes="Roommate personality — roommates_agent NOT profile_agent.",
        expected_agents={"roommates_agent"},
        expected_tools={"update_my_roommate_profile"},
        forbidden_agents={"profile_agent"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_rm_connections",
        prompt="what roommates am I connected to?",
        expected_agents={"roommates_agent"},
        expected_tools={"list_my_connections"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_28_tech",
        prompt="I'm 28, I work in tech, looking for a roommate",
        expected_agents={"roommates_agent"},
        forbidden_agents={"profile_agent", "search_agent"},
    ),
    PromptCase(
        stage="cs_roommates",
        id="cs_update_rm_profile",
        prompt="update my roommate profile",
        expected_agents={"roommates_agent"},
        expected_tools={"view_my_roommate_profile", "update_my_roommate_profile"},
        forbidden_agents={"profile_agent"},
    ),
]

COLD_GROUPS = [
    PromptCase(
        stage="cs_groups",
        id="cs_create_group_hunt",
        prompt="create a group for my apartment hunt",
        expected_agents={"groups_agent"},
        expected_tools={"create_group"},
    ),
    PromptCase(
        stage="cs_groups",
        id="cs_show_groups",
        prompt="show my groups",
        expected_agents={"groups_agent"},
        expected_tools={"list_my_groups"},
    ),
    PromptCase(
        stage="cs_groups",
        id="cs_start_cotenant",
        prompt="start a co-tenant group",
        expected_agents={"groups_agent"},
        expected_tools={"create_group"},
    ),
    PromptCase(
        stage="cs_groups",
        id="cs_invite_to_group",
        prompt="invite someone to my group",
        expected_agents={"groups_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_groups",
        id="cs_list_groups",
        prompt="list my groups",
        expected_agents={"groups_agent"},
        expected_tools={"list_my_groups"},
    ),
]

COLD_LEASE = [
    PromptCase(
        stage="cs_lease",
        id="cs_review_lease",
        prompt="review my lease",
        expected_agents={"lease_agent"},
        expected_tools={"view_my_lease", "ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_when_expire",
        prompt="when does my lease expire?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease", "view_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_monthly_rent_lease",
        prompt="what's my monthly rent on my lease?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease", "view_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_guest_rules",
        prompt="what are the rules about guests in my lease?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_sublet_allowed",
        prompt="does my lease allow subletting?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_summarize_lease",
        prompt="summarize my lease",
        expected_agents={"lease_agent"},
        expected_tools={"view_my_lease", "ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_explain_lease",
        prompt="explain my lease to me",
        expected_agents={"lease_agent"},
        expected_tools={"view_my_lease", "ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_deposit_amount",
        prompt="what's the security deposit on my lease?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease", "view_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_notice_period",
        prompt="what's my notice period?",
        expected_agents={"lease_agent"},
        expected_tools={"ask_about_my_lease"},
    ),
    PromptCase(
        stage="cs_lease",
        id="cs_pull_up_lease",
        prompt="pull up my lease",
        expected_agents={"lease_agent"},
        expected_tools={"view_my_lease"},
    ),
]

COLD_MOVEIN = [
    PromptCase(
        stage="cs_movein",
        id="cs_movein_date",
        prompt="when is my move-in date?",
        expected_agents={"movein_agent"},
        expected_tools={"view_movein_plan"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_movein_checklist",
        prompt="show my move-in checklist",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_before_move",
        prompt="what do I need to do before I move?",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_where_moving",
        prompt="where am I moving to?",
        expected_agents={"movein_agent"},
        expected_tools={"view_movein_plan"},
        forbidden_agents={"search_agent"},
        forbidden_tools={"search_listings"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_movein_address",
        prompt="what's my move-in address?",
        expected_agents={"movein_agent"},
        expected_tools={"view_movein_plan"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_movein_orders",
        prompt="show my move-in orders",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_orders"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_set_up_utilities",
        prompt="I need to set up utilities",
        expected_agents={"movein_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_help_with_move",
        prompt="help me with my move",
        expected_agents={"movein_agent"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_list_movein_tasks",
        prompt="list my move-in tasks",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
    ),
    PromptCase(
        stage="cs_movein",
        id="cs_left_before_day",
        prompt="what's left before move-in day?",
        expected_agents={"movein_agent"},
        expected_tools={"list_movein_tasks", "view_movein_plan"},
        forbidden_agents={"search_agent"},
    ),
]

COLD_GUARANTOR = [
    PromptCase(
        stage="cs_guarantor",
        id="cs_do_I_need",
        prompt="do I need a guarantor?",
        expected_agents={"guarantor_agent"},
        expected_tools={"view_guarantor_center"},
    ),
    PromptCase(
        stage="cs_guarantor",
        id="cs_show_guarantors",
        prompt="show my guarantors",
        expected_agents={"guarantor_agent"},
        expected_tools={"view_guarantor_center"},
    ),
    PromptCase(
        stage="cs_guarantor",
        id="cs_saved_guarantors",
        prompt="who are my saved guarantors?",
        expected_agents={"guarantor_agent"},
        expected_tools={"view_guarantor_center"},
    ),
    PromptCase(
        stage="cs_guarantor",
        id="cs_start_request",
        prompt="start a guarantor request",
        # start_guarantor_request needs property_name/address/monthly_rent +
        # guarantor_id. With zero context the agent correctly views the
        # center and asks for the missing property info — don't force a
        # tool call that would 422. Accept either path.
        expected_agents={"guarantor_agent"},
        expected_tools={"start_guarantor_request", "view_guarantor_center"},
    ),
    PromptCase(
        stage="cs_guarantor",
        id="cs_need_cosigner",
        prompt="I need a co-signer",
        expected_agents={"guarantor_agent"},
        forbidden_agents={"search_agent"},
    ),
]

COLD_BUILDINGS = [
    PromptCase(
        stage="cs_buildings",
        id="cs_tell_100_bedford",
        prompt="tell me about 100 Bedford Ave",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_building"},
        forbidden_agents={"search_agent"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_hpd_250_grand",
        prompt="HPD violations at 250 Grand St",
        expected_agents={"buildings_agent"},
        expected_tools={"list_hpd_violations_for_building", "lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_reviews_350_lex",
        prompt="reviews of 350 Lexington Ave",
        expected_agents={"buildings_agent"},
        expected_tools={"list_reviews_for_building", "lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_lookup_500_broadway",
        prompt="look up 500 Broadway, NYC",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_dob_wtc",
        prompt="DOB complaints at 1 World Trade Center",
        expected_agents={"buildings_agent"},
        expected_tools={"list_dob_complaints_for_building", "lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_is_320w37_good",
        prompt="is 320 West 37th a good building?",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_owns_432_park",
        prompt="who owns 432 Park Avenue?",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_building"},
    ),
    PromptCase(
        stage="cs_buildings",
        id="cs_durst_reviews",
        prompt="landlord reviews for Durst Organization",
        expected_agents={"buildings_agent"},
        expected_tools={"lookup_landlord"},
    ),
]


ALL_CASES: list[PromptCase] = [
    *META,
    *ONBOARDING,
    *SEARCH,
    *SAVING,
    *TOURS,
    *PROFILE,
    *ROOMMATES,
    *GROUPS,
    *LEASE,
    *MOVEIN,
    *GUARANTOR,
    *BUILDINGS,
    *ATTACHMENTS,
    *CROSS,
    *COLD_META,
    *COLD_SEARCH,
    *COLD_SAVING,
    *COLD_TOURS,
    *COLD_PROFILE,
    *COLD_ROOMMATES,
    *COLD_GROUPS,
    *COLD_LEASE,
    *COLD_MOVEIN,
    *COLD_GUARANTOR,
    *COLD_BUILDINGS,
]

# Sanity: IDs must be unique.
_seen: set[str] = set()
for _c in ALL_CASES:
    if _c.id in _seen:
        raise RuntimeError(f"duplicate case id: {_c.id}")
    _seen.add(_c.id)


def by_id(case_id: str) -> PromptCase:
    for c in ALL_CASES:
        if c.id == case_id:
            return c
    raise KeyError(case_id)
