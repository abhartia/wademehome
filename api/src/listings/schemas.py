from pydantic import BaseModel, Field

from workflow.events import PropertyDataItem


class GeocodeResponse(BaseModel):
    latitude: float
    longitude: float


class MarketSnapshotResponse(BaseModel):
    scope: str = Field(description='Human-readable filter, e.g. "ZIP 78701" or "Austin, TX".')
    zip: str | None = Field(default=None, description="5-digit US ZIP when the filter used postal code.")
    city: str | None = None
    state: str | None = None
    sample_size: int = Field(ge=0)
    median_rent: float | None = None
    p25_rent: float | None = None
    p75_rent: float | None = None
    bedroom_mix: dict[str, int] = Field(default_factory=dict)


class CommuteLegResult(BaseModel):
    label: str
    minutes: float | None = None
    distance_meters: float | None = None


class CommuteMatrixResponse(BaseModel):
    origin_latitude: float
    origin_longitude: float
    legs: list[CommuteLegResult]


class PoiHit(BaseModel):
    category: str
    count: int = Field(ge=0)
    nearest_name: str | None = None
    nearest_latitude: float | None = None
    nearest_longitude: float | None = None
    nearest_distance_meters: float | None = Field(
        default=None,
        ge=0,
        description="Straight-line distance from the query pin to the nearest POI (meters).",
    )


class PoiNearbyResponse(BaseModel):
    latitude: float
    longitude: float
    items: list[PoiHit]


class NearbyListingsResponse(BaseModel):
    properties: list[PropertyDataItem]
    total_in_radius: int = Field(ge=0)
    radius_miles: float = Field(gt=0)
    limit: int = Field(ge=0)
    used_global_nearest_fallback: bool = Field(
        default=False,
        description=(
            "True when nothing matched the radius; properties are the nearest rows with "
            "coordinates (any distance) so the map is still usable."
        ),
    )
