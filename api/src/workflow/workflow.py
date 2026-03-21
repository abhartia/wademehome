import asyncio
import json
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
    UserInputEvent,
    TextToSQLEvent,
    WrongSQLStatementEvent,
)

from workflow.utils import (
    CHECK_QUERY_LAST_MESSAGE,
    CHECK_QUERY_OUTPUT_PARSER,
    SEARCH_HINT_SYSTEM,
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
from workflow.property_parsing import parse_property_data_list_from_json

logger = get_logger(__name__)


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

    async def _emit_search_hint(self, ctx: Context, user_msg: str) -> None:
        """Lightweight classification for whether to suggest logging in (streamed early)."""
        hint = SearchHintData(suggest_account=False, reason=None)
        try:
            sllm = self.llm.as_structured_llm(SearchHintData)
            resp = await asyncio.wait_for(
                sllm.achat(
                    messages=[
                        ChatMessage(role="system", content=SEARCH_HINT_SYSTEM),
                        ChatMessage(role="user", content=user_msg),
                    ]
                ),
                timeout=12.0,
            )
            hint = _parse_search_hint_from_chat_response(resp)
        except Exception:
            logger.exception("search_hint classification failed")
        ctx.write_event_to_stream(UIEvent(type="search_hint", data=hint))

    @step
    async def check_data_query(
        self, ctx: Context, ev: UserInputEvent
    ) -> (DBDataRequiredEvent | StopEvent):
        """Check if the user query needs data retrieval."""

        await self._emit_search_hint(ctx, ev.user_msg)

        chat_history_with_previous_responses = [
            *(ev.chat_history or []),
            ChatMessage(
                role="system",
                content=f"Previous queries' results (may be in plain text or JSON format): {self.chat_messages_query_tables}"
            )
        ]

        response = self.llm.chat(
            messages=[
                *(chat_history_with_previous_responses or []),
                ChatMessage(role="user", content=ev.user_msg),
                ChatMessage(
                    role="system",
                    content=CHECK_QUERY_LAST_MESSAGE,
                )
            ]
        )

        parsedResponse = CHECK_QUERY_OUTPUT_PARSER.parse(response)

        if parsedResponse["should_retrieve_data"]:
            logger.info("check_data_query: should_retrieve_data=true")
            # Store chat history with previous responses in context for future steps
            await ctx.set("chat_history", chat_history_with_previous_responses)

            return DBDataRequiredEvent(
                query=ev.user_msg
            )
        else:
            # If no data retrieval is needed, we can return a response directly
            logger.info(
                "check_data_query: should_retrieve_data=false; skipping SQL retrieval"
            )
            self._emit_empty_property_listings(ctx)
            return StopEvent(
                content=True,
                result=parsedResponse["response_to_user"]
            )

    @step
    async def generate_sql(
        self, ctx: Context, ev: DBDataRequiredEvent
    ) -> TextToSQLEvent:
        """Generate SQL statement."""

        fmt_messages = text2sql_prompt.format_messages(
            query_str=ev.query,
            schema=get_listing_table_info()
        )

        message_with_chat_history: list[ChatMessage] = await ctx.get("chat_history", [])

        chat_response = self.llm.chat([
            *message_with_chat_history,
            *fmt_messages
        ])
        sql = parse_response_to_sql(chat_response)
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
        query_result_tuples: list[tuple[str, str]] = []

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

            if retrieved_rows and hasattr(retrieved_rows[0], 'metadata'):
                result = retrieved_rows[0].metadata.get('result', [])
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

                query_result_tuples.append(
                    [sql_query, result]
                )

        if len(query_result_tuples) == 0:
            self._emit_empty_property_listings(ctx)
            no_props_message = (
                "No properties found for your search. Try a different zipcode or criteria."
            )
            await ctx.set("no_properties_message", no_props_message)
            return StopEvent(result=no_props_message)

        chat_response = await self.llm.astream_chat(
            get_response_synthesis_message(
                query_str=ev.query,
                query_result_tuples=query_result_tuples,
                chat_history= await ctx.get("chat_history", []),
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
                await ctx.set("response_text", "".join(response_chunks))

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
                        *(await ctx.get("chat_history", [])),
                        ChatMessage(
                            role="user",
                            content=f"""
                    Given the following response and query results with unit listings of a property, sum up them as a property list with their name, address, amenities (as a list), rent range (with currency, e.g., $2000-$2500), and bedroom range (e.g., 1-3 bedrooms). If no properties are found, return an empty list.

                    Very important:
                    - Whenever latitude and longitude columns are present in the SQL results for a listing, include them in the corresponding property's latitude and longitude fields in the output.
                    - If latitude or longitude are missing for a listing, set those fields to null.
                    - Include every listing from the SQL results in the output; if latitude or longitude are missing, set those fields to null (the map UI will omit pins without coordinates).
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
                            "amenities": string[]       // full amenities list
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

            # Default to empty to keep the UI deterministic.
            listings_properties = PropertyDataList(properties=[])

            listings_properties_json = (
                (listings_properties_response.message.content if listings_properties_response else None)
                or ""
            )

            try:
                listings_properties = parse_property_data_list_from_json(listings_properties_json)
            except (json.JSONDecodeError, ValidationError) as e:
                logger.warning(
                    "generate_response: failed parsing property data: %s raw_prefix=%r",
                    e,
                    listings_properties_json[:200],
                )

            await ctx.set("property_listings_emitted", True)
            no_props_message = (
                "No properties found for your search. Try a different zipcode or criteria."
            )
            ctx.write_event_to_stream(
                UIEvent(
                    type="property_listings",
                    data=listings_properties,
                )
            )
            if len(listings_properties.properties) == 0:
                await ctx.set("no_properties_message", no_props_message)

        await extract_and_emit_properties()
        # Do not block workflow completion on the full LLM stream.
        # We already emitted `property_listings` above.

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
        if await ctx.get("property_listings_emitted", False):
            no_props_message = await ctx.get("no_properties_message", "")
            return StopEvent(result=no_props_message or "")

        # converting async generator to whole reponse
        response_as_text = await ctx.get("response_text", "")

        sllm = self.llm.as_structured_llm(PropertyDataList)

        query_results_str = "\n".join([
            f"Query: {query_result_tuple[0]}\nSQL Response: {str(query_result_tuple[1])}\n"
            for query_result_tuple in ev.query_result_tuples
        ])

        listings_properties_response: ChatResponse | None = None
        try:
            listings_properties_response = await asyncio.wait_for(
                sllm.achat(messages=[
                    *(await ctx.get("chat_history", [])),
                    ChatMessage(
                        role="user",
                        content=f"""
                    Given the following response and query results with unit listings of a property, sum up them as a property list with their name, address, amenities (as a list), rent range (with currency, e.g., $2000-$2500), and bedroom range (e.g., 1-3 bedrooms). If no properties are found, return an empty list.

                    Very important:
                    - Whenever latitude and longitude columns are present in the SQL results for a listing, include them in the corresponding property's latitude and longitude fields in the output.
                    - If latitude or longitude are missing for a listing, set those fields to null.
                    - Include every listing from the SQL results in the output; if latitude or longitude are missing, set those fields to null (the map UI will omit pins without coordinates).
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
                            "amenities": string[]       // full amenities list
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

        # Default to an empty list to keep the UI deterministic even if the model
        # returns malformed/empty structured output.
        listings_properties = PropertyDataList(properties=[])

        # content comes as a JSON string and needs to be converted to PropertyDataList
        listings_properties_json = (
            (listings_properties_response.message.content if listings_properties_response else None)
            or ""
        )
        try:
            listings_properties = parse_property_data_list_from_json(listings_properties_json)
        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Error parsing property data: {e}. raw_prefix={listings_properties_json[:200]}")

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

        table_context = await ctx.get("table_context_str", "")

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


