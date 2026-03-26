from enum import Enum
from llama_index.core.workflow import (StartEvent, Event)
from llama_index.core.base.llms.types import ChatMessage
from pydantic import BaseModel, Field, field_validator
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
    listing_url: str | None = Field(
        default=None,
        description="Original listing page URL scraped from the provider site (if available).",
    )
    city: str | None = Field(
        default=None,
        description="City or locality from the listings row when present (e.g. units.parquet `city`).",
    )
    state: str | None = Field(
        default=None,
        description="State / region code from the listings row when present (e.g. units.parquet `state`).",
    )
    zip_code: str | None = Field(
        default=None,
        description="Postal code from the listings row when present (e.g. units.parquet `zipcode`).",
    )
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
    match_reason: str | None = Field(
        default=None,
        description=(
            "One short sentence (max ~200 chars) explaining why this listing matches "
            "the user's search (e.g. name/amenities mention 'park', proximity, filters applied)."
        ),
    )

class PropertyDataList(BaseModel):
    properties: list[PropertyDataItem]


class SearchStatsData(BaseModel):
    """Streamed with listing results: transparency about counts and query shape."""

    returned_count: int = Field(ge=0, description="Rows returned by the listing SQL query.")
    limit_cap: int | None = Field(
        default=None,
        description="LIMIT from the SQL if parseable; None if unknown.",
    )
    sort_note: str | None = Field(
        default=None,
        description="Short UI line about ordering (e.g. distance sort).",
    )


class SearchHintData(BaseModel):
    """Streamed to the UI before listing results when search may benefit from a logged-in profile."""

    suggest_account: bool = Field(
        description="True if the user shared personal or persistent context worth saving via an account."
    )
    reason: str | None = Field(
        default=None,
        description="Optional short phrase for product UI (why an account may help).",
    )


class SearchSummaryData(BaseModel):
    """Compact map/search UI summary (not a chat transcript)."""

    headline: str = Field(
        description="One short line summarizing the active property search for a map UI."
    )
    bullets: List[str] = Field(
        default_factory=list,
        description="Up to 5 short bullet points: area, budget, beds, must-haves, etc.",
    )

    @field_validator("bullets", mode="before")
    @classmethod
    def cap_bullets(cls, v: object) -> List[str]:
        if not isinstance(v, list):
            return []
        out: List[str] = []
        for item in v:
            if isinstance(item, str) and (t := item.strip()):
                out.append(t)
            if len(out) >= 6:
                break
        return out[:5]


class ProfileMemoryUpdateData(BaseModel):
    """Structured profile-memory patch extracted from search conversation."""

    preferredCities: List[str] = Field(default_factory=list)
    maxMonthlyRent: str | None = None
    bedroomsNeeded: str | None = None
    dealbreakers: List[str] = Field(default_factory=list)
    neighbourhoodPriorities: List[str] = Field(default_factory=list)
    moveTimeline: str | None = None
    updated_fields: List[str] = Field(default_factory=list)


class ProfileMemoryUpdateEventData(BaseModel):
    patch: dict[str, object] = Field(default_factory=dict)
    updated_fields: List[str] = Field(default_factory=list)