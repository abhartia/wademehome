"""Runs eval cases against a model combo and returns structured results.

The runner:
  1. Builds the AgentWorkflow with the combo's two LLMs
  2. For each case, drives every turn (threading chat history)
  3. Captures: tool calls, ui events, agent transitions, agent outputs,
     latency per turn, token usage from raw response if present
  4. Runs structural assertions
  5. Runs LLM-as-judge over the final assistant text
  6. Returns CaseResult with pass/fail per assertion + judge

The runner is deliberately not a pytest test — it's a library used by the
CLI in `evals/__main__.py`. This makes it easy to run from a notebook /
script for ad-hoc model comparisons.
"""

import asyncio
import time
from dataclasses import dataclass, field
from typing import Any

from llama_index.core.agent.workflow import (
    AgentInput,
    AgentOutput,
    AgentSetup,
    ToolCall,
    ToolCallResult,
)
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.core.workflow import StopEvent
from llama_index.server.models.ui import UIEvent
from sqlalchemy import select
from sqlalchemy.orm import Session

from agent.workflow import build_home_agent_workflow
from db.models import Users

from .cases import EvalCase
from .judge import JudgeResult, judge_all
from .models import ModelCombo


@dataclass
class TurnTrace:
    user_msg: str
    assistant_text: str
    agents_visited: list[str] = field(default_factory=list)
    tool_calls: list[tuple[str, dict[str, Any]]] = field(default_factory=list)
    tool_results: list[tuple[str, str]] = field(default_factory=list)  # (name, content[:300])
    ui_event_types: list[str] = field(default_factory=list)
    duration_s: float = 0.0
    saw_stop: bool = False
    error: str | None = None


@dataclass
class AssertionResult:
    name: str
    passed: bool
    detail: str


@dataclass
class CaseResult:
    case_id: str
    domain: str
    combo: str
    turns: list[TurnTrace]
    assertions: list[AssertionResult]
    judge_results: list[JudgeResult]
    total_duration_s: float

    @property
    def passed(self) -> bool:
        return (
            all(a.passed for a in self.assertions)
            and all(j.passed for j in self.judge_results)
        )

    @property
    def assistant_final_text(self) -> str:
        for t in reversed(self.turns):
            if t.assistant_text:
                return t.assistant_text
        return ""


async def _drive_turn(
    *,
    workflow: Any,
    ctx: Any,
    user_msg: str,
    chat_history: list[ChatMessage],
    timeout: float = 180.0,
) -> TurnTrace:
    """Run a single user turn against the shared workflow + context.

    The workflow + Context are shared across turns of one case so that
    state like `last_search_results` (used by save_property /
    schedule_tour shortcuts) survives between turns — matching how a
    real session persists across messages.
    """
    handler = workflow.run(
        ctx=ctx, user_msg=user_msg, chat_history=list(chat_history)
    )

    trace = TurnTrace(user_msg=user_msg, assistant_text="")
    last_assistant_text = ""
    t0 = time.perf_counter()

    async def consume() -> None:
        nonlocal last_assistant_text
        async for event in handler.stream_events():
            if isinstance(event, (AgentInput, AgentSetup)):
                name = event.current_agent_name
                if not trace.agents_visited or trace.agents_visited[-1] != name:
                    trace.agents_visited.append(name)
            elif isinstance(event, ToolCall):
                trace.tool_calls.append((event.tool_name, dict(event.tool_kwargs or {})))
            elif isinstance(event, ToolCallResult):
                content = ""
                try:
                    content = str(event.tool_output.content)[:300]
                except Exception:
                    pass
                trace.tool_results.append((event.tool_name, content))
            elif isinstance(event, UIEvent):
                trace.ui_event_types.append(event.type)
            elif isinstance(event, AgentOutput):
                text = (event.response.content or "").strip()
                if text:
                    last_assistant_text = text
            elif isinstance(event, StopEvent):
                trace.saw_stop = True
                # Some workflows put the final response on the StopEvent.
                result = getattr(event, "result", None)
                if result is not None:
                    text = (
                        getattr(getattr(result, "response", None), "content", None)
                        or getattr(result, "content", None)
                        or ""
                    )
                    if isinstance(text, str) and text.strip():
                        last_assistant_text = text.strip()
                break

    try:
        await asyncio.wait_for(consume(), timeout=timeout)
    except Exception as exc:
        trace.error = f"{type(exc).__name__}: {exc}"
    finally:
        trace.duration_s = time.perf_counter() - t0
        trace.assistant_text = last_assistant_text

    return trace


def _check_assertions(case: EvalCase, turns: list[TurnTrace]) -> list[AssertionResult]:
    out: list[AssertionResult] = []

    all_tool_names = {tn for t in turns for tn, _ in t.tool_calls}
    all_ui_types = {et for t in turns for et in t.ui_event_types}
    all_agents = {a for t in turns for a in t.agents_visited}

    # 1. Every turn must reach a StopEvent.
    if all(t.saw_stop for t in turns):
        out.append(AssertionResult("all_turns_stopped", True, ""))
    else:
        bad = [i for i, t in enumerate(turns) if not t.saw_stop]
        out.append(AssertionResult(
            "all_turns_stopped", False, f"turns without StopEvent: {bad}"
        ))

    # 2. No turn errored.
    errored = [(i, t.error) for i, t in enumerate(turns) if t.error]
    out.append(AssertionResult(
        "no_turn_errored",
        not errored,
        "" if not errored else f"errors: {errored}",
    ))

    # 3. Expected agents visited.
    if case.expected_agents:
        missing = [a for a in case.expected_agents if a not in all_agents]
        out.append(AssertionResult(
            "expected_agents_visited",
            not missing,
            "" if not missing
            else f"missing agents: {missing} (visited: {sorted(all_agents)})",
        ))

    # 4. Expected tools called.
    if case.expected_tools:
        missing = [t for t in case.expected_tools if t not in all_tool_names]
        out.append(AssertionResult(
            "expected_tools_called",
            not missing,
            "" if not missing
            else f"missing tools: {missing} (called: {sorted(all_tool_names)})",
        ))

    # 5. Forbidden tools not called.
    if case.forbidden_tools:
        called = [t for t in case.forbidden_tools if t in all_tool_names]
        out.append(AssertionResult(
            "no_forbidden_tools",
            not called,
            "" if not called else f"forbidden tools called: {called}",
        ))

    # 6. Expected UIEvent types emitted.
    if case.expected_ui_event_types:
        missing = [t for t in case.expected_ui_event_types if t not in all_ui_types]
        out.append(AssertionResult(
            "expected_ui_events",
            not missing,
            "" if not missing
            else f"missing UI events: {missing} (got: {sorted(all_ui_types)})",
        ))

    return out


async def run_case(
    *,
    user: Users,
    db: Session,
    combo: ModelCombo,
    case: EvalCase,
    judge: bool = True,
) -> CaseResult:
    from llama_index.core.workflow import Context

    turns: list[TurnTrace] = []
    chat_history: list[ChatMessage] = []

    workflow = build_home_agent_workflow(
        user=user,
        db=db,
        orchestrator_llm=combo.orchestrator_factory(),
        specialist_llm=combo.specialist_factory(),
        timeout=180.0,
    )
    ctx = Context(workflow)

    t0 = time.perf_counter()
    for user_msg in case.turns:
        # Reset routing each turn so the orchestrator re-evaluates intent.
        # Without this, AgentWorkflow keeps `current_agent_name` from the
        # previous turn and dispatches the next user message straight to
        # whichever specialist last spoke. Stash state (last_search_results,
        # etc.) is preserved on ctx.store.
        await ctx.store.set("current_agent_name", workflow.root_agent)
        trace = await _drive_turn(
            workflow=workflow,
            ctx=ctx,
            user_msg=user_msg,
            chat_history=chat_history,
        )
        turns.append(trace)
        # Append THIS turn to history before the next turn so the agent has
        # full context. Use the user msg + the agent's final reply.
        chat_history.append(ChatMessage(role=MessageRole.USER, content=user_msg))
        if trace.assistant_text:
            chat_history.append(
                ChatMessage(role=MessageRole.ASSISTANT, content=trace.assistant_text)
            )

    assertions = _check_assertions(case, turns)
    judge_results: list[JudgeResult] = []
    if judge and case.judge_criteria:
        final_user_msg = case.turns[-1]
        final_text = turns[-1].assistant_text if turns else ""
        judge_results = await judge_all(
            case.judge_criteria,
            final_user_msg,
            final_text,
        )

    return CaseResult(
        case_id=case.id,
        domain=case.domain,
        combo=combo.name,
        turns=turns,
        assertions=assertions,
        judge_results=judge_results,
        total_duration_s=time.perf_counter() - t0,
    )


async def run_suite(
    *,
    db: Session,
    combo: ModelCombo,
    cases: list[EvalCase],
    judge: bool = True,
    on_case_done: Any = None,  # callback(CaseResult) -> None
) -> list[CaseResult]:
    user = db.execute(
        select(Users).order_by(Users.created_at.asc()).limit(1)
    ).scalar_one_or_none()
    if user is None:
        raise RuntimeError("Need at least one Users row in the DB to run evals.")

    results: list[CaseResult] = []
    for case in cases:
        result = await run_case(
            user=user, db=db, combo=combo, case=case, judge=judge
        )
        results.append(result)
        if on_case_done is not None:
            on_case_done(result)
    return results
