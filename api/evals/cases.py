"""Eval case definitions.

Each EvalCase drives the AgentWorkflow with one or more user turns and
asserts:
  * structural: which specialist handled it, which tools were called, which
    UIEvent types showed up, which tools must NOT be called
  * judge: free-text criteria checked by LLM-as-judge against the final
    assistant text

Cases here are deliberately concrete and small. Add new cases liberally —
they're cheap, and the report shows per-case pass / fail so regressions are
obvious.
"""

from dataclasses import dataclass, field
from typing import Literal

Domain = Literal[
    "search",
    "tours",
    "saved",
    "profile",
    "navigator",
    "multi_turn",
    "edge",
]


@dataclass
class EvalCase:
    id: str
    domain: Domain
    description: str
    # Each turn is a single user message. Multi-turn cases thread the
    # rolling chat history between turns. The runner asserts at the end of
    # the final turn unless `assert_each_turn` is True.
    turns: list[str]
    # Specialist agent expected to handle the task across all turns. None ==
    # don't enforce. For multi-turn cases that intentionally bounce between
    # specialists, list every expected agent (order-insensitive).
    expected_agents: list[str] = field(default_factory=list)
    # Tool names that MUST be called at least once across all turns.
    expected_tools: list[str] = field(default_factory=list)
    # Tool names that MUST NOT appear.
    forbidden_tools: list[str] = field(default_factory=list)
    # UIEvent.type strings that MUST appear at least once.
    expected_ui_event_types: list[str] = field(default_factory=list)
    # Free-text yes/no criteria for the LLM-as-judge over the final
    # assistant text. Each criterion becomes one judge call.
    judge_criteria: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)


# ─── Search ───────────────────────────────────────────────────────────────────
SEARCH_CASES: list[EvalCase] = [
    EvalCase(
        id="search.basic_williamsburg",
        domain="search",
        description="Single search query, expects search_listings + property_results card.",
        turns=["Find me 2-bedroom apartments under $4500 in Williamsburg"],
        expected_agents=["search_agent"],
        expected_tools=["search_listings"],
        expected_ui_event_types=["property_results"],
        judge_criteria=[
            "Does the response acknowledge the search results without listing them in text?",
            "Is the response concise (≤2 sentences)?",
            "Does the response avoid mentioning the words 'handoff' or 'specialist'?",
        ],
    ),
    EvalCase(
        id="search.refine_history_passthrough",
        domain="search",
        description="Follow-up should re-query with combined constraints, not lose context.",
        turns=[
            "Find me 2-bedroom apartments in Williamsburg",
            "Actually under $4000 only",
        ],
        expected_agents=["search_agent"],
        expected_tools=["search_listings"],
        expected_ui_event_types=["property_results"],
        judge_criteria=[
            "Does the final response refer to budget-filtered results, implying it re-ran the search?",
        ],
    ),
    EvalCase(
        id="search.no_location",
        domain="search",
        description="Vague query — agent should still attempt a search rather than hand back.",
        turns=["I'm looking for a dog-friendly studio under $3000"],
        expected_agents=["search_agent"],
        expected_tools=["search_listings"],
        expected_ui_event_types=["property_results"],
    ),
]

# ─── Tours ────────────────────────────────────────────────────────────────────
TOURS_CASES: list[EvalCase] = [
    EvalCase(
        id="tours.list_upcoming",
        domain="tours",
        description="List my tours.",
        turns=["What tours do I have coming up?"],
        expected_agents=["tours_agent"],
        expected_tools=["list_my_tours"],
        expected_ui_event_types=["tours_results"],
    ),
    EvalCase(
        id="tours.list_status_filter",
        domain="tours",
        description="List tours filtered by status.",
        turns=["Show me my scheduled tours"],
        expected_agents=["tours_agent"],
        expected_tools=["list_my_tours"],
        expected_ui_event_types=["tours_results"],
    ),
]

# ─── Saved ────────────────────────────────────────────────────────────────────
SAVED_CASES: list[EvalCase] = [
    EvalCase(
        id="saved.list",
        domain="saved",
        description="List saved properties.",
        turns=["Show my saved properties"],
        expected_agents=["saved_agent"],
        expected_tools=["list_saved_properties"],
        expected_ui_event_types=["favorites_results"],
    ),
]

# ─── Profile ──────────────────────────────────────────────────────────────────
PROFILE_CASES: list[EvalCase] = [
    EvalCase(
        id="profile.view",
        domain="profile",
        description="View profile.",
        turns=["What's my current profile / preferences?"],
        expected_agents=["profile_agent"],
        expected_tools=["view_my_profile"],
        expected_ui_event_types=["profile_summary"],
    ),
    EvalCase(
        id="profile.update_budget",
        domain="profile",
        description="Update budget — must not overwrite cities/beds.",
        turns=["Update my max monthly rent to $4000"],
        expected_agents=["profile_agent"],
        expected_tools=["update_my_profile"],
        expected_ui_event_types=["profile_summary"],
        judge_criteria=[
            "Does the response confirm only the budget was changed, without mentioning other fields?",
        ],
    ),
    EvalCase(
        id="profile.update_multi",
        domain="profile",
        description="Update budget + cities in one turn.",
        turns=["Set my budget to $4000 and add Brooklyn to my cities"],
        expected_agents=["profile_agent"],
        expected_tools=["update_my_profile"],
        expected_ui_event_types=["profile_summary"],
    ),
]

# ─── Navigator ────────────────────────────────────────────────────────────────
NAVIGATOR_CASES: list[EvalCase] = [
    EvalCase(
        id="navigator.roommate",
        domain="navigator",
        description="Roommate request → navigator card.",
        turns=["I want to find a roommate"],
        expected_agents=["navigator_agent"],
        expected_tools=["open_app_section"],
        expected_ui_event_types=["navigation_action"],
    ),
    EvalCase(
        id="navigator.lease",
        domain="navigator",
        description="Lease question → navigator card pointing at /lease.",
        turns=["I want to upload my lease"],
        expected_agents=["navigator_agent"],
        expected_tools=["open_app_section"],
        expected_ui_event_types=["navigation_action"],
    ),
]

# ─── Multi-turn ───────────────────────────────────────────────────────────────
MULTI_TURN_CASES: list[EvalCase] = [
    EvalCase(
        id="multi.search_then_save_by_index",
        domain="multi_turn",
        description="Search → save the first result by index (uses last_search_results stash).",
        turns=[
            "Find me 2-bedroom apartments under $4500 in Williamsburg",
            "Save the first one",
        ],
        expected_agents=["search_agent", "saved_agent"],
        expected_tools=["search_listings", "save_property"],
        expected_ui_event_types=["property_results"],
    ),
    EvalCase(
        id="multi.search_then_tour",
        domain="multi_turn",
        description="Search → schedule a tour for the first result.",
        turns=[
            "Find me 1-bedroom apartments under $3500 in the East Village",
            "Schedule a tour for the first one tomorrow at 3pm",
        ],
        expected_agents=["search_agent", "tours_agent"],
        expected_tools=["search_listings", "schedule_tour"],
        expected_ui_event_types=["property_results", "tours_results"],
    ),
    EvalCase(
        id="multi.profile_then_search",
        domain="multi_turn",
        description="Update profile → use new prefs to search.",
        turns=[
            "Set my budget to $4000",
            "Now find me 2-bedrooms in Brooklyn within budget",
        ],
        expected_agents=["profile_agent", "search_agent"],
        expected_tools=["update_my_profile", "search_listings"],
        expected_ui_event_types=["property_results"],
    ),
]

# ─── Edge / quality ───────────────────────────────────────────────────────────
EDGE_CASES: list[EvalCase] = [
    EvalCase(
        id="edge.greeting",
        domain="edge",
        description="Greeting — orchestrator should answer, NOT hand off.",
        turns=["hey there"],
        forbidden_tools=["search_listings", "list_my_tours", "view_my_profile",
                         "list_saved_properties", "open_app_section"],
        judge_criteria=[
            "Is the response a brief, friendly greeting (≤2 sentences)?",
            "Does it avoid offering a list of features or capabilities?",
        ],
    ),
    EvalCase(
        id="edge.off_topic",
        domain="edge",
        description="Off-topic question — orchestrator should answer briefly, no tool spam.",
        turns=["What's the weather like in NYC?"],
        forbidden_tools=["search_listings", "schedule_tour"],
    ),
]


CASES: list[EvalCase] = [
    *SEARCH_CASES,
    *TOURS_CASES,
    *SAVED_CASES,
    *PROFILE_CASES,
    *NAVIGATOR_CASES,
    *MULTI_TURN_CASES,
    *EDGE_CASES,
]


def get_cases(
    ids: list[str] | None = None,
    domains: list[str] | None = None,
    tags: list[str] | None = None,
) -> list[EvalCase]:
    out = CASES
    if ids:
        wanted = set(ids)
        out = [c for c in out if c.id in wanted]
    if domains:
        wanted = set(domains)
        out = [c for c in out if c.domain in wanted]
    if tags:
        wanted = set(tags)
        out = [c for c in out if wanted.intersection(c.tags)]
    return out
