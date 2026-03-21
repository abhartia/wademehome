import os
import asyncio

import pytest

from llama_index.core.types import MessageRole
from llama_index.core.workflow import StopEvent
from llama_index.server.models.chat import ChatAPIMessage, ChatRequest

from llama_index.server.models.ui import UIEvent


@pytest.mark.asyncio
@pytest.mark.integration
@pytest.mark.live
async def test_live_workflow_emits_property_listings() -> None:
    """
    Uses the actual live database + actual LLM (no mocks).

    To run:
      cd api
      RUN_LIVE_WORKFLOW_TESTS=1 uv run pytest -m \"live\"
    """
    if os.getenv("RUN_LIVE_WORKFLOW_TESTS") != "1":
        pytest.skip("Set RUN_LIVE_WORKFLOW_TESTS=1 to run live workflow test.")

    query = "apartments in new jersey near 07307"
    chat_request = ChatRequest(
        id="pytest-live-1",
        messages=[ChatAPIMessage(role=MessageRole.USER, content=query)],
    )

    # Delay heavy imports (DB + LLM wiring) until after the live-env guard,
    # so unit tests can run in environments without DB connectivity.
    from main import get_llm
    from workflow.workflow import ListingFetcherWorkflow

    llm = get_llm()
    workflow = ListingFetcherWorkflow(
        llm=llm,
        chat_request=chat_request,
        verbose=False,
        timeout=120.0,
    )

    handler = workflow.run(user_msg=query, chat_history=[])

    ui_events: list[UIEvent] = []
    stop_result: object | None = None

    async def consume() -> None:
        nonlocal stop_result
        async for event in handler.stream_events():
            if isinstance(event, UIEvent) and event.type == "property_listings":
                ui_events.append(event)
            if isinstance(event, StopEvent):
                stop_result = event.result
                break

    await asyncio.wait_for(consume(), timeout=150.0)

    assert ui_events, "Expected at least one UIEvent of type property_listings"

    # If the workflow returns an empty properties list, it should also provide
    # a sensible message in the final StopEvent.
    latest = ui_events[-1]
    latest_properties = getattr(latest.data, "properties", None)
    if isinstance(latest_properties, list) and len(latest_properties) == 0:
        assert stop_result is not None
        assert "No properties found" in str(stop_result)


@pytest.mark.asyncio
@pytest.mark.integration
@pytest.mark.live
async def test_live_workflow_emits_property_listings_for_35757() -> None:
    """
    Smoke-test property listing events using a zipcode with expected rows.
    """
    if os.getenv("RUN_LIVE_WORKFLOW_TESTS") != "1":
        pytest.skip("Set RUN_LIVE_WORKFLOW_TESTS=1 to run live workflow test.")

    query = "apartments in new jersey near 35757"
    chat_request = ChatRequest(
        id="pytest-live-35757",
        messages=[ChatAPIMessage(role=MessageRole.USER, content=query)],
    )

    from main import get_llm
    from workflow.workflow import ListingFetcherWorkflow

    llm = get_llm()
    workflow = ListingFetcherWorkflow(
        llm=llm,
        chat_request=chat_request,
        verbose=False,
        timeout=120.0,
    )

    handler = workflow.run(user_msg=query, chat_history=[])

    ui_events: list[UIEvent] = []

    async def consume() -> None:
        async for event in handler.stream_events():
            if isinstance(event, UIEvent) and event.type == "property_listings":
                ui_events.append(event)
            if isinstance(event, StopEvent):
                break

    await asyncio.wait_for(consume(), timeout=150.0)

    assert ui_events, "Expected at least one UIEvent of type property_listings"


@pytest.mark.integration
@pytest.mark.live
def test_live_db_schema_reflection_works() -> None:
    """
    Smoke-test the live database reflection that powers text-to-SQL.

    This test uses the real DB but does not call the LLM.
    """
    if os.getenv("RUN_LIVE_WORKFLOW_TESTS") != "1":
        pytest.skip("Set RUN_LIVE_WORKFLOW_TESTS=1 to run live DB test.")

    from core.config import Config
    from sqlalchemy import create_engine, text
    from workflow.utils import get_listing_table_info

    table_info = get_listing_table_info()
    assert "No table configured" not in table_info

    database_url = Config.get("DATABASE_URL")
    table_name = Config.get("LISTINGS_TABLE_NAME") or "listings"
    engine = create_engine(database_url)
    with engine.connect() as conn:
        count = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}")).scalar_one()

    assert count is not None
    assert count >= 0

