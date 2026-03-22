from typing import List
from llama_index.core import SQLDatabase
from sqlalchemy import create_engine
from llama_index.core.retrievers import SQLRetriever

from core.config import Config

from prompts.loader import load_app_prompt
from llama_index.core.prompts.base import PromptTemplate
from llama_index.core.prompts.prompt_type import PromptType
from workflow.langchain_output_parser import LangchainOutputParser
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from llama_index.server.models.chat import ChatAPIMessage
from llama_index.core.llms import ChatResponse, ChatMessage


def extract_chat_messages_query_tables(messages: List[ChatAPIMessage]) -> str:
  chat_messages_query_tables = ''

  for i, msg in enumerate(messages):
      if msg.annotations is None:
          continue

      for annotation in msg.annotations:
          if annotation["type"] == "sql_table":
              query = annotation["data"]
              if query:
                  chat_messages_query_tables += f"\n\nThis is the table data used in the response message #{i}: {query}\n\n"

  return chat_messages_query_tables


def parse_response_to_sql(chat_response: ChatResponse) -> str:
    """Parse response to SQL."""
    response = chat_response.message.content
    if response is None:
        return ""
    sql_query_start = response.find("SQLQuery:")
    if sql_query_start != -1:
        response = response[sql_query_start:]
        # TODO: move to removeprefix after Python 3.9+
        if response.startswith("SQLQuery:"):
            response = response[len("SQLQuery:") :]
    sql_result_start = response.find("SQLResult:")
    if sql_result_start != -1:
        response = response[:sql_result_start]
    return response.strip().strip("```sql").strip("```").strip()

def get_response_synthesis_message(
    query_str: str,
    query_result_tuples: List[tuple[str, str]],
    chat_history: List[ChatMessage] = [],
    extra_instructions: str = ""
):
  prompt = f""""
    Given an input question, synthesize a response from the query results with the conversation history in mind.
    {extra_instructions}
    Query: {query_str}
  """

  for query_result_tuple in query_result_tuples:
      prompt += f"Query: {query_result_tuple[0]}\n"
      prompt += f"SQL Response: {str(query_result_tuple[1])}\n"
  prompt += "Response: "


  return [
      *chat_history,
      ChatMessage(
          role="user",
          content=prompt
      )
  ]


listing_table_name = Config.get("LISTINGS_TABLE_NAME")
listing_table_schema = Config.get("LISTINGS_TABLE_SCHEMA")

_workflow_engine = None
_sql_database = None
_sql_retriever = None


def get_engine():
    """Lazily create the workflow SQLAlchemy engine (avoids DB I/O at import time)."""
    global _workflow_engine
    if _workflow_engine is None:
        database_url = (Config.get("DATABASE_URL") or "").strip()
        if not database_url:
            raise ValueError(
                "DATABASE_URL is empty or unset; configure it in App Service application settings."
            )
        connect_args: dict = {}
        if "postgresql" in database_url:
            connect_args["connect_timeout"] = 5
        _workflow_engine = create_engine(
            database_url,
            future=True,
            connect_args=connect_args,
        )
    return _workflow_engine


class _LazyEngine:
    """Forwards to get_engine() so callers can keep using `engine` without eager connect()."""

    __slots__ = ()

    def __getattr__(self, name: str):
        # unittest.mock.patch inspects the patch target with hasattr(..., "__func__"); must not
        # call get_engine() (needs DATABASE_URL) before the mock is installed.
        if name in {"__func__", "__wrapped__", "__code__"}:
            raise AttributeError(name)
        return getattr(get_engine(), name)


engine = _LazyEngine()


def get_sql_database() -> SQLDatabase:
    global _sql_database
    if _sql_database is None:
        _sql_database = SQLDatabase(get_engine(), schema=listing_table_schema)
    return _sql_database


def get_sql_retriever() -> SQLRetriever:
    global _sql_retriever
    if _sql_retriever is None:
        _sql_retriever = SQLRetriever(get_sql_database())
    return _sql_retriever


CHAT_TEXT_TO_SQL_PROMPT = PromptTemplate(
    load_app_prompt('text2sql_chat'),
    prompt_type=PromptType.TEXT_TO_SQL,
)

# Fixed dialect — do not use engine.dialect at import time: create_engine("") raises and
# kills the process before uvicorn binds (e.g. missing DATABASE_URL on a deployment slot).
text2sql_prompt = CHAT_TEXT_TO_SQL_PROMPT.partial_format(
    dialect="postgresql",
)

def get_listing_table_info():
  if not listing_table_name:
    return (
      "No table configured. Set LISTINGS_TABLE_NAME and DATABASE_URL in .env, "
      "then ensure the database has that table."
    )
  try:
    info = get_sql_database().get_single_table_info(listing_table_name)
    return info if info is not None else "(Table not found or empty schema.)"
  except Exception:
    return "(Could not load table schema. Check LISTINGS_TABLE_NAME and database.)"

##
# Check query prompt mounting
##
check_query_struct_output_parser = StructuredOutputParser.from_response_schemas([
    ResponseSchema(
        name="should_retrieve_data",
        description=(
            "Describes whether the query requires data retrieval."
        ),
        type="boolean",
    ),
    ResponseSchema(
        name="response_to_user",
        description="In case data retrieval is not needed, this is the response to the user.",
    )
])

CHECK_QUERY_OUTPUT_PARSER = LangchainOutputParser(check_query_struct_output_parser)

CHECK_QUERY_LAST_MESSAGE = CHECK_QUERY_OUTPUT_PARSER.format(
    load_app_prompt('check_data_query')
)

SEARCH_HINT_SYSTEM = load_app_prompt("search_hint")

SEARCH_SUMMARY_SYSTEM = load_app_prompt("search_summary")

##
# Wrong SQL prompt mounting
##

WRONG_SQL_PROMPT = PromptTemplate(
    load_app_prompt('wrong_sql')
)

wrong_sql_struct_output_parser = StructuredOutputParser.from_response_schemas([
    ResponseSchema(
        name="corrected_sql_query",
        description=(
            "The corrected SQL query that fixes the problems in the original query."
        ),
        type="string",
    )
])

WRONG_SQL_OUTPUT_PARSER = LangchainOutputParser(wrong_sql_struct_output_parser)

def format_wrong_sql_message(
    user_query: str,
    wrong_sql: str,
    table_context: str,
    exception: BaseException
) -> str:
    return WRONG_SQL_OUTPUT_PARSER.format(
        WRONG_SQL_PROMPT.format(
            user_query=user_query,
            wrong_sql=wrong_sql,
            table_context=table_context,
            stringified_exception=str(exception)
        )
    )