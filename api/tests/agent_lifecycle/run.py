"""Run the renter-lifecycle prompt suite against the live agent workflow.

Usage:
    cd api
    # Single case:
    uv run python tests/agent_lifecycle/run.py --id tell_me_about_moving_destination
    # Whole suite (serial — LLM calls are expensive; parallelize later if needed):
    uv run python tests/agent_lifecycle/run.py --all
    # Filter by stage:
    uv run python tests/agent_lifecycle/run.py --stage movein

Env:
    RUN_LIVE_AGENT_TESTS=1   must be set (real LLM, real DB)
    TEST_USER_EMAIL           defaults to bhartta@gmail.com (read-only checks
                              prefer an account that has data to exercise)

The runner bypasses the HTTP/SSE layer and drives `build_home_agent_workflow`
directly. The SSE generator is a thin wrapper over the same events, so
routing / tools / card emission validate the full agent behavior. What this
DOES NOT exercise: the UI's annotation rendering — that's covered by
`ui/`'s typecheck + browser smoke tests.

Output: prints a human-readable report to stdout and writes a JSON report
to `tests/agent_lifecycle/last_run.json`.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
import traceback
from dataclasses import asdict, dataclass, field
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent.parent / "src"
API_ROOT = HERE.parent.parent  # api/
for p in (str(SRC), str(API_ROOT)):
    if p not in sys.path:
        sys.path.insert(0, p)

from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    AgentSetup,
    AgentStream,
    ToolCall,
    ToolCallResult,
)
from llama_index.core.workflow import StopEvent
from llama_index.server.models.ui import UIEvent
from sqlalchemy import select
from sqlalchemy.orm import Session

from tests.agent_lifecycle.spec import ALL_CASES, PromptCase, by_id


@dataclass
class TurnObservation:
    prompt: str
    agents_seen: list[str] = field(default_factory=list)
    tools_called: list[str] = field(default_factory=list)
    card_types: list[str] = field(default_factory=list)
    text: str = ""
    elapsed_s: float = 0.0
    error: str | None = None


@dataclass
class CaseResult:
    id: str
    stage: str
    prompt: str
    notes: str
    turns: list[TurnObservation] = field(default_factory=list)
    passed: bool = False
    failures: list[str] = field(default_factory=list)


async def _run_turn(workflow, prompt: str, chat_history: list) -> TurnObservation:
    obs = TurnObservation(prompt=prompt)
    t0 = time.perf_counter()
    try:
        handler = workflow.run(user_msg=prompt, chat_history=chat_history)
        agents_order: list[str] = []
        seen_agents: set[str] = set()
        final_text_parts: list[str] = []
        async for event in handler.stream_events():
            if isinstance(event, (AgentInput, AgentSetup)):
                name = event.current_agent_name
                if name and name not in seen_agents:
                    seen_agents.add(name)
                    agents_order.append(name)
            elif isinstance(event, ToolCall):
                obs.tools_called.append(event.tool_name)
            elif isinstance(event, ToolCallResult):
                pass
            elif isinstance(event, UIEvent):
                t = getattr(event, "type", "")
                if t and t not in {"agent_step", "agent_tool_call", "agent_tool_result", "agent_error"}:
                    obs.card_types.append(t)
            elif isinstance(event, AgentStream):
                if event.delta:
                    final_text_parts.append(event.delta)
            elif isinstance(event, AgentOutput):
                # Only flush AgentOutput if we've streamed NOTHING — mirrors the
                # router's behavior of preferring deltas over the final content
                # blob (which would otherwise double the text in the transcript).
                if not final_text_parts and event.response and event.response.content:
                    final_text_parts.append(event.response.content)
            elif isinstance(event, StopEvent):
                break
        obs.agents_seen = agents_order
        obs.text = "".join(final_text_parts).strip()
    except Exception as exc:
        obs.error = f"{type(exc).__name__}: {exc}\n{traceback.format_exc()}"
    obs.elapsed_s = time.perf_counter() - t0
    return obs


def _assert_case(case: PromptCase, final_turn: TurnObservation) -> list[str]:
    fails: list[str] = []
    agents = set(final_turn.agents_seen)
    tools = set(final_turn.tools_called)
    cards = set(final_turn.card_types)

    if final_turn.error:
        fails.append(f"RUNTIME ERROR: {final_turn.error.splitlines()[0]}")

    missing_agents = case.expected_agents - agents
    if missing_agents:
        fails.append(f"missing expected agent(s): {sorted(missing_agents)}; got {sorted(agents)}")

    bad_agents = case.forbidden_agents & agents
    if bad_agents:
        fails.append(f"forbidden agent(s) ran: {sorted(bad_agents)}")

    # For tools we treat expected_tools as "AT LEAST ONE of these must appear"
    # so cases like movein_checklist (either list_movein_tasks OR view_movein_plan
    # is acceptable) don't false-fail.
    if case.expected_tools and not (case.expected_tools & tools):
        fails.append(f"expected at least one of tool(s) {sorted(case.expected_tools)}; " f"got {sorted(tools)}")

    bad_tools = case.forbidden_tools & tools
    if bad_tools:
        fails.append(f"forbidden tool(s) used: {sorted(bad_tools)}")

    missing_cards = case.expected_cards - cards
    if missing_cards:
        fails.append(f"missing card type(s): {sorted(missing_cards)}; got {sorted(cards)}")

    bad_cards = case.forbidden_cards & cards
    if bad_cards:
        fails.append(f"forbidden card type(s) emitted: {sorted(bad_cards)}")
    return fails


def _build_context_history(runner_results: dict[str, CaseResult], from_ids: list[str]) -> list:
    """Stitch prior turn(s) into an assistant/user chat history so a follow-up
    case can reference them. Uses the assistant text recorded on a prior case
    run. If a prior case hasn't been run yet, raises so the runner can play
    it first."""
    from llama_index.core.base.llms.types import ChatMessage

    history: list = []
    for fid in from_ids:
        prior = runner_results.get(fid)
        if not prior:
            raise RuntimeError(f"Follow-up case depends on prior case '{fid}' which hasn't run.")
        # Use the last turn of the prior case.
        last = prior.turns[-1]
        history.append(ChatMessage(role="user", content=last.prompt))
        # Fall back to a terse stub if the prior turn produced no text (it
        # may have produced only cards). The orchestrator still sees that
        # the prior user turn happened.
        history.append(ChatMessage(role="assistant", content=last.text or "[card-only reply]"))
    return history


async def _run_case(
    case: PromptCase,
    *,
    user,
    db: Session,
    orchestrator_llm,
    specialist_llm,
    prior: dict[str, CaseResult],
) -> CaseResult:
    from agent.workflow import build_home_agent_workflow

    result = CaseResult(id=case.id, stage=case.stage, prompt=case.prompt, notes=case.notes)
    history = _build_context_history(prior, case.context_from) if case.context_from else []
    workflow = build_home_agent_workflow(
        user=user,
        db=db,
        orchestrator_llm=orchestrator_llm,
        specialist_llm=specialist_llm,
        timeout=120.0,
    )
    turn = await _run_turn(workflow, case.prompt, history)
    result.turns.append(turn)
    result.failures = _assert_case(case, turn)
    result.passed = not result.failures
    return result


def _filter_cases(args) -> list[PromptCase]:
    if args.id:
        # Explicit --id always runs, even if skip_runner is set (lets you
        # force-test attachment cases once the runner supports them).
        return [by_id(i) for i in args.id]
    if args.stage:
        wanted = set(args.stage)
        return [c for c in ALL_CASES if c.stage in wanted and not c.skip_runner]
    if args.all:
        return [c for c in ALL_CASES if not c.skip_runner]
    raise SystemExit("Pass --all, --stage NAME, or --id CASE_ID")


def _print_case(idx: int, total: int, result: CaseResult) -> None:
    marker = "PASS" if result.passed else "FAIL"
    color = "\033[92m" if result.passed else "\033[91m"
    reset = "\033[0m"
    print(f"{color}[{marker}]{reset} {idx+1}/{total} " f"{result.stage}/{result.id}: {result.prompt!r}")
    for turn in result.turns:
        print(f"    agents:  {turn.agents_seen}")
        print(f"    tools:   {turn.tools_called}")
        print(f"    cards:   {turn.card_types}")
        if turn.text:
            trunc = turn.text[:160].replace("\n", " ")
            print(f"    text:    {trunc!r}{'…' if len(turn.text) > 160 else ''}")
        print(f"    elapsed: {turn.elapsed_s:.1f}s")
    for f in result.failures:
        print(f"    ✗ {f}")


def _summary(results: list[CaseResult]) -> None:
    total = len(results)
    passed = sum(1 for r in results if r.passed)
    print()
    print("═══════════════════════════════════════════════════════════════")
    print(f"  {passed}/{total} passed ({100 * passed / max(total, 1):.0f}%)")
    by_stage: dict[str, tuple[int, int]] = {}
    for r in results:
        p, t = by_stage.get(r.stage, (0, 0))
        by_stage[r.stage] = (p + (1 if r.passed else 0), t + 1)
    for stage, (p, t) in sorted(by_stage.items()):
        marker = "✓" if p == t else "✗"
        print(f"  {marker} {stage:14s} {p}/{t}")
    print("═══════════════════════════════════════════════════════════════")


def main() -> None:
    if os.getenv("RUN_LIVE_AGENT_TESTS") != "1":
        print("Skipping: set RUN_LIVE_AGENT_TESTS=1 to run this suite.")
        return

    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--stage", action="append", default=[])
    parser.add_argument("--id", action="append", default=[])
    parser.add_argument("--user-email", default=os.getenv("TEST_USER_EMAIL", "bhartta@gmail.com"))
    args = parser.parse_args()

    cases = _filter_cases(args)
    print(f"Running {len(cases)} case(s) against live agent workflow...")

    from core.llm_factory import get_llm_mini_reasoning, get_llm_nano
    from db.models import Users
    from db.session import get_session_local

    db: Session = get_session_local()()
    try:
        user = db.execute(select(Users).where(Users.email == args.user_email)).scalar_one_or_none()
        if not user:
            raise SystemExit(f"Test user {args.user_email!r} not found in DB")
        orchestrator_llm = get_llm_nano()
        specialist_llm = get_llm_mini_reasoning()

        results: list[CaseResult] = []
        prior: dict[str, CaseResult] = {}
        for idx, case in enumerate(cases):
            try:
                r = asyncio.run(
                    _run_case(
                        case,
                        user=user,
                        db=db,
                        orchestrator_llm=orchestrator_llm,
                        specialist_llm=specialist_llm,
                        prior=prior,
                    )
                )
            except Exception as exc:
                r = CaseResult(
                    id=case.id,
                    stage=case.stage,
                    prompt=case.prompt,
                    notes=case.notes,
                    passed=False,
                    failures=[f"runner exception: {exc!r}"],
                )
            results.append(r)
            prior[case.id] = r
            _print_case(idx, len(cases), r)

        _summary(results)
        report_path = HERE / "last_run.json"
        report_path.write_text(json.dumps([asdict(r) for r in results], indent=2, default=str))
        print(f"\nFull JSON report: {report_path}")
        sys.exit(0 if all(r.passed for r in results) else 1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
