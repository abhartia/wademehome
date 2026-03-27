import asyncio
import time

from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.workflow import Workflow, Context, StopEvent, step
from llama_index.core.llms import LLM
from llama_index.server.models.chat import ChatRequest
from llama_index.server.models.ui import UIEvent

from core.logger import get_logger
from listings.ai_search import embed_query_text, extract_query_plan, run_fast_search
from workflow.events import (
    PropertyDataList,
    SearchFilterBreakdownData,
    SearchFilterBreakdownItem,
    SearchHintData,
    SearchPlanData,
    SearchSummaryData,
    SearchStatsData,
    UserInputEvent,
)

logger = get_logger(__name__)


class ListingFetcherWorkflow(Workflow):
    def __init__(
        self,
        llm: LLM,
        chat_request: ChatRequest,
        *args,
        **kwargs,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.llm = llm
        self.chat_request = chat_request

    @step
    async def run_fast_search_step(
        self, ctx: Context, ev: UserInputEvent
    ) -> StopEvent:
        t0 = time.perf_counter()
        chat_history = ev.chat_history or []
        user_msg = (ev.user_msg or "").strip()

        # Keep annotation contract stable for guests while removing heuristic logic.
        ctx.write_event_to_stream(
            UIEvent(
                type="search_hint",
                data=SearchHintData(suggest_account=False, reason=None),
            )
        )

        try:
            parse_t0 = time.perf_counter()
            plan_task = asyncio.create_task(
                extract_query_plan(
                    self.llm,
                    user_msg=user_msg,
                    chat_history=chat_history,
                )
            )
            embed_task = asyncio.create_task(embed_query_text(user_msg))
            plan = await plan_task
            parse_ms = int((time.perf_counter() - parse_t0) * 1000)
            vec_user_msg, embed_ms_user_msg = await embed_task

            sq = (plan.semantic_query or "").strip()
            if sq.casefold() != user_msg.strip().casefold():
                query_embedding, embed_ms_extra = await embed_query_text(
                    sq or user_msg
                )
                embed_ms = embed_ms_user_msg + embed_ms_extra
            else:
                query_embedding, embed_ms = vec_user_msg, embed_ms_user_msg

            ctx.write_event_to_stream(
                UIEvent(
                    type="search_plan",
                    data=SearchPlanData(
                        summary_headline=plan.summary_headline,
                        summary_bullets=plan.summary_bullets,
                    ),
                )
            )
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_summary",
                    data=SearchSummaryData(
                        headline=plan.summary_headline,
                        bullets=plan.summary_bullets,
                    ),
                )
            )

            search_result = run_fast_search(plan, query_embedding=query_embedding)

            ctx.write_event_to_stream(
                UIEvent(
                    type="property_listings",
                    data=search_result.properties,
                )
            )
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_filter_breakdown",
                    data=SearchFilterBreakdownData(
                        criteria=[
                            SearchFilterBreakdownItem.model_validate(item.model_dump())
                            for item in search_result.breakdown
                        ]
                    ),
                )
            )

            returned_count = len(search_result.properties.properties)
            total_ms = int((time.perf_counter() - t0) * 1000)
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_stats",
                    data=SearchStatsData(
                        returned_count=returned_count,
                        matched_count=search_result.matched_count,
                        limit_cap=search_result.limit_cap,
                        sort_note="Strict filters first, then semantic relevance.",
                        parse_ms=parse_ms,
                        embed_ms=embed_ms,
                        db_ms=search_result.timings_ms.get("db_ms"),
                        breakdown_ms=search_result.timings_ms.get("breakdown_ms"),
                        total_ms=total_ms,
                    ),
                )
            )
            logger.info(
                "listings/chat timing: parse_ms=%s embed_ms=%s db_ms=%s breakdown_ms=%s total_ms=%s matched=%s returned=%s",
                parse_ms,
                embed_ms,
                search_result.timings_ms.get("db_ms"),
                search_result.timings_ms.get("breakdown_ms"),
                total_ms,
                search_result.matched_count,
                returned_count,
            )

            if returned_count == 0:
                return StopEvent(
                    result="No properties found for your search. Try broadening your location or constraints."
                )
            return StopEvent(
                result=f"Found {returned_count} listings matching your search."
            )
        except Exception as exc:
            logger.exception("fast search workflow failed")
            ctx.write_event_to_stream(
                UIEvent(
                    type="property_listings",
                    data=PropertyDataList(properties=[]),
                )
            )
            return StopEvent(
                result=f"Search failed: {exc}"
            )


