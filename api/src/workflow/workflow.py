import json
from jsonschema import ValidationError
from llama_index.core.base.llms.types import ChatMessage, ChatResponse
from llama_index.core.workflow import (Workflow, Context, StopEvent, step)
from llama_index.core.llms import LLM
from llama_index.server.models.chat import ChatRequest

from workflow.events import DBDataRequiredEvent, GeneratedResponseEvent, PropertyDataList, ResponseStreamEvent, UserInputEvent, TextToSQLEvent, WrongSQLStatementEvent

from workflow.utils import CHECK_QUERY_LAST_MESSAGE, CHECK_QUERY_OUTPUT_PARSER, WRONG_SQL_OUTPUT_PARSER, extract_chat_messages_query_tables, format_wrong_sql_message, get_listing_table_info, get_response_synthesis_message, parse_response_to_sql, text2sql_prompt, sql_retriever
from llama_index.server import UIEvent

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

    @step
    async def check_data_query(
        self, ctx: Context, ev: UserInputEvent
    ) -> (DBDataRequiredEvent | StopEvent):
        """Check if the user query needs data retrieval."""

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
            # Store chat history with previous responses in context for future steps
            await ctx.set("chat_history", chat_history_with_previous_responses)

            return DBDataRequiredEvent(
                query=ev.user_msg
            )
        else:
            # If no data retrieval is needed, we can return a response directly
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
                retrieved_rows = sql_retriever.retrieve(sql_query)
            except BaseException as e:
                return WrongSQLStatementEvent(
                    wrong_sql=sql_query,
                    exception=e,
                    original_event=ev
                )

            if retrieved_rows and hasattr(retrieved_rows[0], 'metadata'):
                result = retrieved_rows[0].metadata.get('result', [])

                query_result_tuples.append(
                    [sql_query, result]
                )

        if len(query_result_tuples) == 0:
            return StopEvent(result="No data found")

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

        # Store response text for later processing
        response_text = ""

        # forward the async gen. content and store it in response_text to be reused in the workflow
        async def streaming_generator():
            nonlocal response_text
            async for chunk in chat_response:
                response_text += chunk.delta
                yield chunk

        ctx.write_event_to_stream(
            ResponseStreamEvent(
                response_stream=streaming_generator()
            )
        )

        await ctx.set("response_text", response_text)

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

        # converting async generator to whole reponse
        response_as_text = await ctx.get("response_text", "")

        sllm = self.llm.as_structured_llm(PropertyDataList)

        query_results_str = "\n".join([
            f"Query: {query_result_tuple[0]}\nSQL Response: {str(query_result_tuple[1])}\n"
            for query_result_tuple in ev.query_result_tuples
        ])

        listings_properties_response: ChatResponse = sllm.chat(messages=[
            *(await ctx.get("chat_history", [])),
            ChatMessage(
                role="user",
                content=f"""
                Given the following response and query results with unit listings of a property, sum up them as a property list with their name, address, amenities (as a list), rent range (with currency, e.g., $2000-$2500), and bedroom range (e.g., 1-3 bedrooms). If no properties are found, return an empty list.

                Very important:
                - Whenever latitude and longitude columns are present in the SQL results for a listing, include them in the corresponding property's latitude and longitude fields in the output.
                - If latitude or longitude are missing for a listing, set those fields to null.
                - The final property list must only include listings where both latitude and longitude are non-null; discard any listings that are missing either coordinate.

                Response: {response_as_text}

                {query_results_str}

                Check the chat history and previous queries results in case some data is missing, you might find some relevant information there.
                Whenever it's possible, get images for the listings using the column image_url field.
                """
            )
        ])

        # content comes as a JSON string and needs to be converted to PropertyDataList
        listings_properties_json = listings_properties_response.message.content

        if listings_properties_json:
            try:
                # Parse JSON string to dict, then convert to PropertyDataList
                parsed_data = json.loads(listings_properties_json)
                listings_properties = PropertyDataList.model_validate(parsed_data)

                # Enforce that we never surface listings without coordinates
                filtered_properties = [
                    prop
                    for prop in listings_properties.properties
                    if prop.latitude is not None and prop.longitude is not None
                ]
                listings_properties.properties = filtered_properties

                ctx.write_event_to_stream(
                    UIEvent(
                        type='property_listings',
                        data=listings_properties,
                    )
                )
            except (json.JSONDecodeError, ValidationError) as e:
                print(f"Error parsing property data: {e}")

        return StopEvent(
            result=""
        )

    @step
    async def handle_wrong_sql_statement(
        self, ctx: Context, ev: WrongSQLStatementEvent
    ) -> StopEvent | TextToSQLEvent:

        print(f"Handling wrong SQL statement (attempt {ev.original_event.attempt_number})")

        if ev.original_event.attempt_number >= 3:
            return StopEvent(
                result=f"Something went wrong fetching the data. Please try again later."
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


