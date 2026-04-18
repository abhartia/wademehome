"""Live SSE smoke test for the home agent workflow.

Drives the AgentWorkflow directly (skips FastAPI auth) against the live DB +
real LLM, asserts the stream emits at least one tool-call event and one
PropertyResultsData UIEvent for a search query, and reaches StopEvent.

Run with:
    cd api
    RUN_LIVE_AGENT_TESTS=1 .venv/bin/pytest -m live tests/integration/test_agent_chat.py -v
"""
from __future__ import annotations

import asyncio
import os

import pytest
from llama_index.core.agent.workflow import ToolCall, ToolCallResult
from llama_index.core.workflow import StopEvent
from llama_index.server.models.ui import UIEvent
from sqlalchemy import select


@pytest.mark.asyncio
@pytest.mark.integration
@pytest.mark.live
async def test_live_agent_chat_search_emits_property_card() -> None:
    if os.getenv("RUN_LIVE_AGENT_TESTS") != "1":
        pytest.skip("Set RUN_LIVE_AGENT_TESTS=1 to run live agent test.")

    # Heavy imports deferred until after the env-guard.
    from agent.workflow import build_home_agent_workflow
    from core.llm_factory import get_llm_mini_reasoning, get_llm_nano
    from db.models import Users
    from db.session import get_session_local

    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        user = db.execute(
            select(Users).order_by(Users.created_at.asc()).limit(1)
        ).scalar_one_or_none()
        assert user is not None, "Need at least one Users row in the DB to run this test."

        workflow = build_home_agent_workflow(
            user=user,
            db=db,
            orchestrator_llm=get_llm_nano(),
            specialist_llm=get_llm_mini_reasoning(),
            timeout=120.0,
        )

        handler = workflow.run(
            user_msg="Find me 2-bedroom apartments under $4500 in Williamsburg",
            chat_history=[],
        )

        tool_calls: list[ToolCall] = []
        tool_results: list[ToolCallResult] = []
        ui_events: list[UIEvent] = []
        saw_stop = False

        async def consume() -> None:
            nonlocal saw_stop
            async for event in handler.stream_events():
                if isinstance(event, ToolCall):
                    tool_calls.append(event)
                elif isinstance(event, ToolCallResult):
                    tool_results.append(event)
                elif isinstance(event, UIEvent):
                    ui_events.append(event)
                elif isinstance(event, StopEvent):
                    saw_stop = True
                    break

        await asyncio.wait_for(consume(), timeout=180.0)

        assert any(tc.tool_name == "search_listings" for tc in tool_calls), (
            f"Expected search_listings tool to be called. Got: "
            f"{[tc.tool_name for tc in tool_calls]}"
        )
        assert any(ev.type == "property_results" for ev in ui_events), (
            f"Expected at least one property_results UIEvent. Got types: "
            f"{[ev.type for ev in ui_events]}"
        )
        assert saw_stop, "Workflow did not reach StopEvent."
    finally:
        db.close()
