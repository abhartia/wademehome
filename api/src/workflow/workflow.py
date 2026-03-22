import asyncio
import json
import re
from typing import Any

from jsonschema import ValidationError
from llama_index.core.base.llms.types import ChatMessage, ChatResponse
from llama_index.core.workflow import (Workflow, Context, StopEvent, step)
from llama_index.core.llms import LLM
from llama_index.server.models.chat import ChatRequest

from core.logger import get_logger

from workflow.events import (
    DBDataRequiredEvent,
    GeneratedResponseEvent,
    PropertyDataList,
    ResponseStreamEvent,
    SearchHintData,
    SearchStatsData,
    SearchSummaryData,
    UserInputEvent,
    TextToSQLEvent,
    WrongSQLStatementEvent,
)

from workflow.utils import (
    CHECK_QUERY_LAST_MESSAGE,
    CHECK_QUERY_OUTPUT_PARSER,
    SEARCH_HINT_SYSTEM,
    SEARCH_SUMMARY_SYSTEM,
    WRONG_SQL_OUTPUT_PARSER,
    extract_chat_messages_query_tables,
    format_wrong_sql_message,
    get_listing_table_info,
    get_response_synthesis_message,
    parse_response_to_sql,
    text2sql_prompt,
    sql_retriever,
)
from llama_index.server.models.ui import UIEvent
from listings.nearby_mapper import property_list_from_sql_rows

from workflow.property_parsing import parse_property_data_list_from_llm_content

logger = get_logger(__name__)

_SQL_LIMIT_RE = re.compile(r"\bLIMIT\s+(\d+)\b", re.IGNORECASE)


def _parse_sql_limit_cap(sql: str) -> int | None:
    m = _SQL_LIMIT_RE.search(sql or "")
    return int(m.group(1)) if m else None


def _infer_sql_sort_note(sql: str) -> str | None:
    s = (sql or "").upper()
    if "ACOS(" in s or "3959" in s or "3958" in s or "3963" in s or "HAVERSINE" in s:
        return "Sorted by distance from your search area."
    if "ORDER BY" in s:
        return "Ordered by the search query (e.g. distance or relevance)."
    return None


def _count_sql_result_rows(query_result_tuples: list) -> int:
    n = 0
    for tup in query_result_tuples:
        if len(tup) < 2:
            continue
        r = tup[1]
        if isinstance(r, list):
            n += len(r)
    return n


def _merge_search_hint_heuristic(user_msg: str, hint: SearchHintData) -> SearchHintData:
    """Boost suggest_account when the message reads like lifestyle + preference (prompt-only model can miss)."""
    if hint.suggest_account:
        return hint
    t = (user_msg or "").lower()
    first_person = bool(
        re.search(
            r"\b(i am|i'm|\bim\b|i want|i need|i prefer|we are|we're|i love|i like)\b",
            t,
        )
    )
    lifestyle = bool(
        re.search(
            r"\b(active|quiet|lifestyle|person|park|outdoors|fitness|gym|wfh|"
            r"work from home|running|walkable|commute|pet|kids|family)\b",
            t,
        )
    )
    if first_person and lifestyle:
        return SearchHintData(
            suggest_account=True,
            reason=hint.reason or "Save lifestyle and preferences across searches with a free account.",
        )
    return hint


def _parse_search_hint_from_chat_response(resp: ChatResponse | None) -> SearchHintData:
    default = SearchHintData(suggest_account=False, reason=None)
    if not resp or not resp.message:
        return default
    content = resp.message.content
    if content is None:
        return default
    if isinstance(content, dict):
        try:
            return SearchHintData.model_validate(content)
        except Exception:
            return default
    if isinstance(content, str):
        try:
            return SearchHintData.model_validate_json(content.strip())
        except Exception:
            try:
                return SearchHintData.model_validate_json(content)
            except Exception:
                return default
    return default


def _parse_search_summary_from_chat_response(
    resp: ChatResponse | None,
) -> SearchSummaryData:
    default = SearchSummaryData(headline="Property search", bullets=[])
    if not resp or not resp.message:
        return default
    content = resp.message.content
    if content is None:
        return default
    if isinstance(content, dict):
        try:
            return SearchSummaryData.model_validate(content)
        except Exception:
            return default
    if isinstance(content, str):
        try:
            return SearchSummaryData.model_validate_json(content.strip())
        except Exception:
            try:
                return SearchSummaryData.model_validate_json(content)
            except Exception:
                return default
    return default


class ListingFetcherWorkflow(Workflow):
    def __init__(
        self,
        llm: LLM,
        chat_request: ChatRequest,
        *args,
        **kwargs
    ) -> None:
        super().__init__(*args, **kwargs)
        self.llm = llm
        self.chat_messages_query_tables = extract_chat_messages_query_tables(
            chat_request.messages
        )

    def _emit_empty_property_listings(self, ctx: Context) -> None:
        """Emit an empty listings UIEvent so the UI doesn't stall."""
        ctx.write_event_to_stream(
            UIEvent(
                type="property_listings",
                data=PropertyDataList(properties=[]),
            )
        )

    def _format_recent_messages_for_hint(self, messages: list[ChatMessage]) -> str:
        lines: list[str] = []
        for m in messages[-10:]:
            role = getattr(m, "role", None) or ""
            block = getattr(m, "content", None) or ""
            text = block if isinstance(block, str) else str(block)
            lines.append(f"{role}: {text[:1200]}")
        return "\n".join(lines)

    async def _emit_search_hint(
        self,
        ctx: Context,
        user_msg: str,
        prior_messages: list[ChatMessage] | None,
    ) -> None:
        """Lightweight classification for whether to suggest logging in (streamed early)."""
        hint = SearchHintData(suggest_account=False, reason=None)
        try:
            hist_text = self._format_recent_messages_for_hint(prior_messages or [])
            user_payload = (
                "Classify using the whole session below, not only the latest line.\n\n"
                f"Prior conversation (oldest to newest within this window):\n"
                f"{hist_text or '(no prior turns)'}\n\n"
                f"Latest user message:\n{user_msg}"
            )
            sllm = self.llm.as_structured_llm(SearchHintData)
            resp = await asyncio.wait_for(
                sllm.achat(
                    messages=[
                        ChatMessage(role="system", content=SEARCH_HINT_SYSTEM),
                        ChatMessage(role="user", content=user_payload),
                    ]
                ),
                timeout=6.0,
            )
            hint = _parse_search_hint_from_chat_response(resp)
        except asyncio.TimeoutError:
            logger.warning("search_hint classification timed out")
        except Exception:
            logger.exception("search_hint classification failed")
        hint = _merge_search_hint_heuristic(user_msg, hint)
        ctx.write_event_to_stream(UIEvent(type="search_hint", data=hint))

    async def _emit_search_summary(
        self,
        ctx: Context,
        *,
        user_query: str,
        response_text: str,
    ) -> None:
        """Short UI summary for map search (streamed after listings)."""
        try:
            chat_hist = await ctx.store.get("chat_history", []) or []
            hist_lines: list[str] = []
            for m in chat_hist[-10:]:
                role = getattr(m, "role", None) or ""
                block = getattr(m, "content", None) or ""
                text = block if isinstance(block, str) else str(block)
                hist_lines.append(f"{role}: {text[:1200]}")
            hist_text = "\n".join(hist_lines)
            sllm = self.llm.as_structured_llm(SearchSummaryData)
            resp = await asyncio.wait_for(
                sllm.achat(
                    messages=[
                        ChatMessage(role="system", content=SEARCH_SUMMARY_SYSTEM),
                        ChatMessage(
                            role="user",
                            content=(
                                "Summarize the active search for the map UI.\n\n"
                                f"Text-to-SQL / retrieval query:\n{user_query}\n\n"
                                f"Conversation (recent):\n{hist_text}\n\n"
                                f"Assistant reply excerpt:\n{(response_text or '')[:2200]}"
                            ),
                        ),
                    ]
                ),
                timeout=28.0,
            )
            summary = _parse_search_summary_from_chat_response(resp)
        except asyncio.TimeoutError:
            logger.warning("search_summary generation timed out")
            summary = SearchSummaryData(headline="Property search", bullets=[])
        except Exception:
            logger.exception("search_summary generation failed")
            summary = SearchSummaryData(headline="Property search", bullets=[])
        ctx.write_event_to_stream(UIEvent(type="search_summary", data=summary))

    def _run_retrieval_gate_sync(
        self, ev: UserInputEvent
    ) -> tuple[dict, list[ChatMessage]]:
        """Sync LLM call for should_retrieve_data; run in a thread so the event loop stays free."""
        chat_history_with_previous_responses = [
            *(ev.chat_history or []),
            ChatMessage(
                role="system",
                content=(
                    "Previous queries' results (may be in plain text or JSON format): "
                    f"{self.chat_messages_query_tables}"
                ),
            ),
        ]
        response = self.llm.chat(
            messages=[
                *chat_history_with_previous_responses,
                ChatMessage(role="user", content=ev.user_msg),
                ChatMessage(role="system", content=CHECK_QUERY_LAST_MESSAGE),
            ]
        )
        parsed = CHECK_QUERY_OUTPUT_PARSER.parse(response)
        return parsed, chat_history_with_previous_responses

    @step
    async def check_data_query(
        self, ctx: Context, ev: UserInputEvent
    ) -> (DBDataRequiredEvent | StopEvent):
        """Check if the user query needs data retrieval."""

        hint_task = asyncio.create_task(
            self._emit_search_hint(ctx, ev.user_msg, ev.chat_history)
        )
        check_task = asyncio.create_task(
            asyncio.to_thread(self._run_retrieval_gate_sync, ev)
        )
        try:
            await asyncio.gather(hint_task, check_task)
        except BaseException:
            hint_task.cancel()
            check_task.cancel()
            raise
        parsedResponse, chat_history_with_previous_responses = check_task.result()

        if parsedResponse["should_retrieve_data"]:
            logger.info("check_data_query: should_retrieve_data=true")
            # Store chat history with previous responses in context for future steps
            await ctx.store.set("chat_history", chat_history_with_previous_responses)

            return DBDataRequiredEvent(
                query=ev.user_msg
            )
        else:
            # If no data retrieval is needed, we can return a response directly
            logger.info(
                "check_data_query: should_retrieve_data=false; skipping SQL retrieval"
            )
            self._emit_empty_property_listings(ctx)
            return StopEvent(result=parsedResponse["response_to_user"])

    def _text2sql_llm_sync(self, messages: list[ChatMessage]) -> ChatResponse:
        return self.llm.chat(messages)

    @step
    async def generate_sql(
        self, ctx: Context, ev: DBDataRequiredEvent
    ) -> TextToSQLEvent | StopEvent:
        """Generate SQL statement."""

        logger.info("generate_sql: entered query=%r", ev.query)
        print(f"generate_sql: entered query={ev.query!r}")

        fmt_messages = text2sql_prompt.format_messages(
            query_str=ev.query,
            schema=get_listing_table_info()
        )

        message_with_chat_history: list[ChatMessage] = await ctx.store.get("chat_history", [])

        chat_response = await asyncio.to_thread(
            self._text2sql_llm_sync,
            [*message_with_chat_history, *fmt_messages],
        )
        sql = parse_response_to_sql(chat_response)
        if not (sql or "").strip():
            raw = getattr(getattr(chat_response, "message", None), "content", None)
            raw_preview = (
                (raw[:800] + "…") if isinstance(raw, str) and len(raw) > 800 else raw
            )
            logger.warning(
                "generate_sql: empty SQL after text2sql query=%r raw_preview=%r",
                ev.query,
                raw_preview,
            )
            print(f"generate_sql: empty SQL query={ev.query!r}")
            self._emit_empty_property_listings(ctx)
            return StopEvent(
                result=(
                    "We couldn't turn your request into a database search. "
                    "Try rephrasing with a neighborhood, city, or ZIP code."
                )
            )

        logger.info("generate_sql: query=%r sql=%r", ev.query, sql)
        sql_preview = sql if len(sql) <= 1000 else (sql[:1000] + "…")
        print(f"generate_sql: query={ev.query!r} sql={sql_preview!r}")
        return TextToSQLEvent(
            sql=sql, query=ev.query
        )


    @step
    async def generate_response(self, ctx: Context, ev: TextToSQLEvent) -> GeneratedResponseEvent | WrongSQLStatementEvent:
        """Run SQL retrieval and generate response."""

        # Splitting the SQL queries in case there are multiple statements
        sql_queries = [query.strip() for query in ev.sql.split(';') if query.strip()]
        # Each entry: [sql, result_rows, col_keys | None] — col_keys enables SQL→PropertyDataList fallback.
        query_result_tuples: list[list[Any]] = []
        await ctx.store.set("no_properties_message", "")

        for sql_query in sql_queries:
            try:
                logger.info("DB retrieve: sql=%r", sql_query)
                sql_preview = sql_query if len(sql_query) <= 1200 else (sql_query[:1200] + "…")
                print(f"DB retrieve: sql={sql_preview!r}")
                retrieved_rows = sql_retriever.retrieve(sql_query)
            except BaseException as e:
                logger.exception("DB retrieve failed for sql=%r", sql_query)
                return WrongSQLStatementEvent(
                    wrong_sql=sql_query,
                    exception=e,
                    original_event=ev
                )

            retrieved_count = len(retrieved_rows) if retrieved_rows else 0
            logger.info("DB retrieve: rows=%d", retrieved_count)
            print(f"DB retrieve: rows={retrieved_count}")

            if retrieved_rows and hasattr(retrieved_rows[0], "metadata"):
                meta = retrieved_rows[0].metadata
                result = meta.get("result", [])
                col_keys_raw = meta.get("col_keys")
                col_keys: list[str] | None = None
                if isinstance(col_keys_raw, list) and col_keys_raw:
                    col_keys = [str(c) for c in col_keys_raw]
                if isinstance(result, list):
                    sample = result[:3]
                    first = sample[0] if sample else None
                    logger.info("DB retrieve: first_row_sample=%r", first)
                    first_preview = repr(first)
                    first_preview = first_preview[:500] + ("…" if len(first_preview) > 500 else "")
                    print(f"DB retrieve: first_row_sample={first_preview}")
                    logger.debug(
                        "DB retrieve: result_len=%d sample=%r",
                        len(result),
                        sample,
                    )
                else:
                    logger.info("DB retrieve: result_type=%s", type(result).__name__)

                query_result_tuples.append([sql_query, result, col_keys])

        if len(query_result_tuples) == 0:
            self._emit_empty_property_listings(ctx)
            no_props_message = (
                "No properties found for your search. Try a different zipcode or criteria."
            )
            await ctx.store.set("no_properties_message", no_props_message)
            return StopEvent(result=no_props_message)

        chat_response = await self.llm.astream_chat(
            get_response_synthesis_message(
                query_str=ev.query,
                query_result_tuples=query_result_tuples,
                chat_history= await ctx.store.get("chat_history", []),
                extra_instructions=""""
                    There is no need to add the images in the response, just return the property details.
                """
            )
        )

        # Buffer chunks immediately in a pump task. If we only iterate inside the
        # SSE-facing generator, OpenInference's export queue may close the LLM span
        # after ~60s with no in-progress events (slow clients / slow first token),
        # which triggers "Open span is missing" and breaks traces.
        chunk_queue: asyncio.Queue[ChatResponse | None] = asyncio.Queue(maxsize=64)
        response_chunks: list[str] = []

        async def pump_llm_stream() -> None:
            try:
                async for chunk in chat_response:
                    response_chunks.append(chunk.delta)
                    # Never block forever if the consumer isn't draining
                    # `ResponseStreamEvent.response_stream` (e.g. in tests).
                    try:
                        chunk_queue.put_nowait(chunk)
                    except asyncio.QueueFull:
                        # Drop chunks when the queue is full; the workflow
                        # completion must not depend on slow/no consumers.
                        logger.debug(
                            "response_stream queue full; dropping chunk"
                        )
            finally:
                await chunk_queue.put(None)
                await ctx.store.set("response_text", "".join(response_chunks))

        pump_task = asyncio.create_task(pump_llm_stream())

        async def streaming_generator():
            while True:
                chunk = await chunk_queue.get()
                if chunk is None:
                    break
                yield chunk

        ctx.write_event_to_stream(
            ResponseStreamEvent(
                response_stream=streaming_generator()
            )
        )

        # Emit `property_listings` as soon as the DB query results are
        # available (before the full response synthesis stream finishes).
        #
        # This prevents the workflow timeout from aborting the structured
        # extraction step before the UI receives results.
        response_as_text = ""

        async def extract_and_emit_properties() -> None:
            sllm = self.llm.as_structured_llm(PropertyDataList)

            query_results_str = "\n".join([
                f"Query: {query_result_tuple[0]}\nSQL Response: {str(query_result_tuple[1])}\n"
                for query_result_tuple in query_result_tuples
            ])

            listings_properties_response: ChatResponse | None = None
            try:
                listings_properties_response = await asyncio.wait_for(
                    sllm.achat(messages=[
                        *(await ctx.store.get("chat_history", [])),
                        ChatMessage(
                            role="user",
                            content=f"""
                    Given the following response and query results with unit listings of a property, sum up them as a property list with their name, address, amenities (as a list), rent range (with currency, e.g., $2000-$2500), and bedroom range (e.g., 1-3 bedrooms). If no properties are found, return an empty list.

                    Very important:
                    - Whenever latitude and longitude columns are present in the SQL results for a listing, include them in the corresponding property's latitude and longitude fields in the output.
                    - If latitude or longitude are missing for a listing, set those fields to null.
                    - Include every listing from the SQL results in the output; if latitude or longitude are missing, set those fields to null (the map UI will omit pins without coordinates).
                    - For EACH property, set "match_reason" to one short sentence (max ~200 chars) explaining
                      why this row matches the user's search (use listing name, address, amenities text,
                      description fields from SQL, and distance ordering if the query sorted by geography).
                    - If unclear, give a best-effort tie to the user's stated criteria (e.g. "Park" in name,
                      amenities mentioning parks, or closest matches to the user's area).
                    - Output must match the following JSON schema exactly:
                      PropertyDataList = {{
                        "properties": [
                          {{
                            "name": string,
                            "address": string,
                            "latitude": number | null,
                            "longitude": number | null,
                            "rent_range": string,
                            "bedroom_range": string,
                            "images_urls": string[],   // from SQL column `image_url` when possible
                            "main_amenities": string[], // max 4 items
                            "amenities": string[],      // full amenities list
                            "match_reason": string | null
                          }}
                        ]
                      }}

                    Response: {response_as_text}

                    {query_results_str}

                    Check the chat history and previous queries results in case some data is missing, you might find some relevant information there.
                    Whenever it's possible, get images for the listings using the column image_url field.
                    """
                        ),
                    ]),
                    timeout=60.0,
                )
            except Exception as e:
                logger.warning("generate_response: structured extraction failed: %s", e)

            row_count = _count_sql_result_rows(query_result_tuples)
            raw_content = (
                listings_properties_response.message.content
                if listings_properties_response and listings_properties_response.message
                else None
            )
            listings_properties = parse_property_data_list_from_llm_content(raw_content)
            if not listings_properties.properties and row_count > 0:
                merged: list[Any] = []
                for tup in query_result_tuples:
                    if len(tup) < 2:
                        continue
                    rows = tup[1]
                    ckeys = tup[2] if len(tup) > 2 else None
                    if isinstance(rows, list) and rows:
                        fb = property_list_from_sql_rows(rows, ckeys)
                        merged.extend(fb.properties)
                if merged:
                    listings_properties = PropertyDataList(properties=merged)
                    logger.info(
                        "generate_response: structured extraction empty; SQL fallback emitted %d listings",
                        len(merged),
                    )

            await ctx.store.set("property_listings_emitted", True)
            no_props_message = (
                "No properties found for your search. Try a different zipcode or criteria."
            )
            ctx.write_event_to_stream(
                UIEvent(
                    type="property_listings",
                    data=listings_properties,
                )
            )
            primary_sql = query_result_tuples[0][0] if query_result_tuples else ""
            ctx.write_event_to_stream(
                UIEvent(
                    type="search_stats",
                    data=SearchStatsData(
                        returned_count=row_count,
                        limit_cap=_parse_sql_limit_cap(primary_sql),
                        sort_note=_infer_sql_sort_note(primary_sql),
                    ),
                )
            )
            if row_count == 0 and len(listings_properties.properties) == 0:
                await ctx.store.set("no_properties_message", no_props_message)
            elif len(listings_properties.properties) == 0 and row_count > 0:
                logger.warning(
                    "generate_response: DB returned %d rows but property_listings is still empty "
                    "(structured parse failed and SQL row mapping produced no items)",
                    row_count,
                )

        await extract_and_emit_properties()
        await pump_task
        await self._emit_search_summary(
            ctx,
            user_query=ev.query,
            response_text=await ctx.store.get("response_text", ""),
        )

        return GeneratedResponseEvent(
            response=None,
            query=ev.query,
            query_result_tuples=query_result_tuples
        )

    @step
    async def extract_property_cards(
        self, ctx: Context, ev: GeneratedResponseEvent
    ) -> StopEvent:
        """Check if listings were found to include in the response."""

        # If we've already emitted `property_listings` directly from
        # `generate_response`, skip structured extraction here.
        if await ctx.store.get("property_listings_emitted", False):
            row_done = _count_sql_result_rows(ev.query_result_tuples or [])
            if row_done > 0:
                return StopEvent(result="")
            no_props_message = await ctx.store.get("no_properties_message", "")
            return StopEvent(result=no_props_message or "")

        # converting async generator to whole reponse
        response_as_text = await ctx.store.get("response_text", "")

        sllm = self.llm.as_structured_llm(PropertyDataList)

        query_results_str = "\n".join([
            f"Query: {query_result_tuple[0]}\nSQL Response: {str(query_result_tuple[1])}\n"
            for query_result_tuple in ev.query_result_tuples
        ])

        listings_properties_response: ChatResponse | None = None
        try:
            listings_properties_response = await asyncio.wait_for(
                sllm.achat(messages=[
                    *(await ctx.store.get("chat_history", [])),
                    ChatMessage(
                        role="user",
                        content=f"""
                    Given the following response and query results with unit listings of a property, sum up them as a property list with their name, address, amenities (as a list), rent range (with currency, e.g., $2000-$2500), and bedroom range (e.g., 1-3 bedrooms). If no properties are found, return an empty list.

                    Very important:
                    - Whenever latitude and longitude columns are present in the SQL results for a listing, include them in the corresponding property's latitude and longitude fields in the output.
                    - If latitude or longitude are missing for a listing, set those fields to null.
                    - Include every listing from the SQL results in the output; if latitude or longitude are missing, set those fields to null (the map UI will omit pins without coordinates).
                    - For EACH property, set "match_reason" to one short sentence (max ~200 chars) explaining
                      why this row matches the user's search (name, amenities, description, distance if sorted by geo).
                    - When SQL results include city, state, or postal code columns (e.g. city, state, zipcode / zip / postal_code),
                      copy them into "city", "state", and "zip_code" on each property; otherwise set those fields to null.
                    - Output must match the following JSON schema exactly:
                      PropertyDataList = {{
                        "properties": [
                          {{
                            "name": string,
                            "address": string,
                            "city": string | null,
                            "state": string | null,
                            "zip_code": string | null,
                            "latitude": number | null,
                            "longitude": number | null,
                            "rent_range": string,
                            "bedroom_range": string,
                            "images_urls": string[],   // from SQL column `image_url` when possible
                            "main_amenities": string[], // max 4 items
                            "amenities": string[],      // full amenities list
                            "match_reason": string | null
                          }}
                        ]
                      }}

                    Response: {response_as_text}

                    {query_results_str}

                    Check the chat history and previous queries results in case some data is missing, you might find some relevant information there.
                    Whenever it's possible, get images for the listings using the column image_url field.
                    """
                    )
                ]),
                timeout=60.0,
            )
        except Exception as e:
            # If structured extraction fails (timeout/validation/etc), we still
            # want to emit `property_listings` so the UI doesn't stall.
            print(f"extract_property_cards: structured LLM failed: {e}")

        row_count = _count_sql_result_rows(ev.query_result_tuples or [])
        raw_content = (
            listings_properties_response.message.content
            if listings_properties_response and listings_properties_response.message
            else None
        )
        listings_properties = parse_property_data_list_from_llm_content(raw_content)
        if not listings_properties.properties and row_count > 0:
            merged_cards: list[Any] = []
            for tup in ev.query_result_tuples or []:
                if len(tup) < 2:
                    continue
                rows = tup[1]
                ckeys = tup[2] if len(tup) > 2 else None
                if isinstance(rows, list) and rows:
                    fb = property_list_from_sql_rows(rows, ckeys)
                    merged_cards.extend(fb.properties)
            if merged_cards:
                listings_properties = PropertyDataList(properties=merged_cards)

        print(
            "extract_property_cards: parsed_properties=",
            len(listings_properties.properties),
        )

        ctx.write_event_to_stream(
            UIEvent(
                type="property_listings",
                data=listings_properties,
            )
        )
        primary_sql = ev.query_result_tuples[0][0] if ev.query_result_tuples else ""
        row_count = _count_sql_result_rows(ev.query_result_tuples)
        ctx.write_event_to_stream(
            UIEvent(
                type="search_stats",
                data=SearchStatsData(
                    returned_count=row_count,
                    limit_cap=_parse_sql_limit_cap(primary_sql),
                    sort_note=_infer_sql_sort_note(primary_sql),
                ),
            )
        )

        return StopEvent(
            result=""
        )

    @step
    async def handle_wrong_sql_statement(
        self, ctx: Context, ev: WrongSQLStatementEvent
    ) -> StopEvent | TextToSQLEvent:

        print(f"Handling wrong SQL statement (attempt {ev.original_event.attempt_number})")

        if ev.original_event.attempt_number >= 3:
            no_props_message = (
                "No properties found for your search. Try a different zipcode or criteria."
            )
            self._emit_empty_property_listings(ctx)
            return StopEvent(
                result=no_props_message
            )

        table_context = await ctx.store.get("table_context_str", "")

        user_query = ev.original_event.query

        response = self.llm.complete(
            format_wrong_sql_message(
                user_query=user_query,
                wrong_sql=ev.wrong_sql,
                table_context=table_context,
                exception=ev.exception
            )
        )

        parsedResponse = WRONG_SQL_OUTPUT_PARSER.parse(response)

        if "corrected_sql_query" in parsedResponse:
            corrected_sql_query = parsedResponse["corrected_sql_query"]
            return TextToSQLEvent(
                sql=corrected_sql_query,
                query=ev.original_event.query,
                attempt_number=ev.original_event.attempt_number + 1
            )
        else:
            return StopEvent(
                result=f"Error: {str(ev.exception)}. No corrected SQL query provided."
            )


