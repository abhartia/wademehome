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


class SitemapKeysResponse(BaseModel):
    keys: list[str] = Field(default_factory=list, description="Property keys for sitemap URLs.")


class NearbyListingsResponse(BaseModel):
    properties: list[PropertyDataItem]
    total_in_radius: int = Field(
        ge=0,
        description="Count of listings matching the query (radius circle or map bbox) before limit.",
    )
    radius_miles: float = Field(
        ge=0,
        description="Search radius in miles when using center+radius mode; 0 when using bbox mode.",
    )
    limit: int = Field(ge=0)
    used_global_nearest_fallback: bool = Field(
        default=False,
        description=(
            "True when nothing matched the radius; properties are the nearest rows with "
            "coordinates (any distance) so the map is still usable."
        ),
    )
    used_bbox: bool = Field(
        default=False,
        description="True when results were filtered by west/south/east/north bounding box.",
    )


class NearestTransitStation(BaseModel):
    system: str = Field(description="path | hblr | nyc_subway | lirr | nj_transit_rail | ferry")
    station_name: str
    lines: list[str] = Field(default_factory=list)
    latitude: float
    longitude: float
    distance_miles: float = Field(ge=0)
    walk_minutes: int = Field(
        ge=0,
        description="Estimated straight-line walk time at 3 mph (adds ~20% detour overhead).",
    )


class NearestTransitResponse(BaseModel):
    latitude: float
    longitude: float
    stations: list[NearestTransitStation] = Field(
        description="Nearest stations across requested systems, sorted by walk time ascending.",
    )
