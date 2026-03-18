from enum import Enum
from llama_index.core.workflow import (StartEvent, Event)
from llama_index.core.base.llms.types import ChatMessage
from pydantic import BaseModel, Field
from typing import List, Any


class UserInputEvent(StartEvent):
    """Start event for the Text-to-SQL workflow."""
    user_msg: str
    chat_history: list[ChatMessage]

class DBDataRequiredEvent(Event):
    """Event to indicate that database data is required for processing."""

    query: str


class TextToSQLEvent(Event):
    """Text-to-SQL event."""

    sql: str
    query: str
    attempt_number: int = 0

class ResponseFormatType(str, Enum):
    TEXT = "text"
    TABLE = "table"
    CHART = "chart"

class WrongSQLStatementEvent(Event):
    """Event to indicate that the SQL statement is wrong."""

    wrong_sql: str
    exception: BaseException
    original_event: TextToSQLEvent

# Add the data model for your table
class SQLTableData(BaseModel):
    """Data model for SQL table results"""
    columns: List[str]
    rows: List[List[Any]]
    query: str

class SQLUIEventData(BaseModel):
    """Data model for SQL UI event"""
    type: str = "sql_table"
    data: SQLTableData


class ResponseStreamEvent(Event):
    response_stream: Any

class GeneratedResponseEvent(Event):
    """Event to indicate that a response has been generated."""

    response: Any
    query: str
    query_results: list[tuple[str, str]] = []

class PropertyDataItem(BaseModel):
    name: str
    address: str
    latitude: float | None = Field(
        default=None,
        description="Latitude of the property if available from the query results.",
    )
    longitude: float | None = Field(
        default=None,
        description="Longitude of the property if available from the query results.",
    )
    rent_range: str = Field(description="rent range from the units available with currency, e.g., $2000-$2500")
    bedroom_range: str = Field(description="bedroom range from the units available, e.g., 1-3 bedrooms")
    images_urls: List[str] = Field(default=[], description="list of image URLs of the property")
    main_amenities: List[str] = Field(
        description="""
            List of the four main amenities of the property, which should include things related to:
            - pool
            - Gym / Fitness center
            - Parking / Garage
            - Policies, e.g., pet friendly
            - Location features, e.g., waterfront, beach access
            - Building features, e.g., elevator, doorman

            Maximum of four items.
            It's important to keep the items concise and avoid full sentences.
        """
    )
    amenities: List[str] = Field(description="list of amenities available in the property")

class PropertyDataList(BaseModel):
    properties: list[PropertyDataItem]