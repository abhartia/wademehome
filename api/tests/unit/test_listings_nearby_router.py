from unittest.mock import MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from listings.router import router


def _make_app() -> TestClient:
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


@patch("listings.router.cached_execute_all")
@patch("listings.router.Config.get")
@patch("listings.router.listing_table_schema", None)
@patch("listings.router.listing_table_name", "listings")
@patch("listings.router.inspect")
@patch("listings.router.engine")
def test_nearby_returns_total_and_limits_rows(
    mock_engine: MagicMock,
    mock_inspect: MagicMock,
    mock_config_get: MagicMock,
    mock_cached_execute_all: MagicMock,
) -> None:
    def _cfg(key: str, default=None):
        if key == "DATABASE_URL":
            return "postgresql://user:pass@localhost:5432/db"
        if key == "LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT":
            return "true"
        return default

    mock_config_get.side_effect = _cfg

    mock_engine.dialect.name = "postgresql"

    mock_insp_obj = MagicMock()
    mock_insp_obj.has_table.return_value = True
    mock_inspect.return_value = mock_insp_obj

    cols_result = MagicMock()
    cols_result.fetchall.return_value = [
        ("property_id",),
        ("latitude",),
        ("longitude",),
    ]

    conn = MagicMock()
    row = {
        "building_name": "Hi-Rise",
        "address": "1 Oak Ave",
        "latitude": 40.0,
        "longitude": -74.0,
        "min_rent": 2000,
        "max_rent": 2100,
        "bedrooms": 1,
        "amenities": "Gym",
        "image_url": "https://example.com/i.jpg",
        "property_id": "p1",
        "total_in_scope": 42,
        "d_mi": 0.1,
    }
    mock_cached_execute_all.return_value = [row]

    conn.execute.side_effect = [cols_result]

    cm = MagicMock()
    cm.__enter__.return_value = conn
    cm.__exit__.return_value = None
    mock_engine.connect.return_value = cm

    client = _make_app()
    r = client.get(
        "/listings/nearby",
        params={"latitude": 40.1, "longitude": -74.1, "radius_miles": 15, "limit": 50},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["total_in_radius"] == 42
    assert data["radius_miles"] == 15
    assert data["limit"] == 50
    assert len(data["properties"]) == 1
    assert data["properties"][0]["name"] == "Hi-Rise"
    assert data["properties"][0]["latitude"] == 40.0
    assert data["used_global_nearest_fallback"] is False


@patch("listings.router.cached_execute_all")
@patch("listings.router.Config.get")
@patch("listings.router.listing_table_schema", None)
@patch("listings.router.listing_table_name", "listings")
@patch("listings.router.inspect")
@patch("listings.router.engine")
def test_nearby_global_nearest_when_none_in_radius(
    mock_engine: MagicMock,
    mock_inspect: MagicMock,
    mock_config_get: MagicMock,
    mock_cached_execute_all: MagicMock,
) -> None:
    def _cfg(key: str, default=None):
        if key == "DATABASE_URL":
            return "postgresql://user:pass@localhost:5432/db"
        if key == "LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT":
            return "true"
        return default

    mock_config_get.side_effect = _cfg
    mock_engine.dialect.name = "postgresql"
    mock_inspect.return_value = MagicMock(has_table=MagicMock(return_value=True))

    cols_result = MagicMock()
    cols_result.fetchall.return_value = [
        ("property_id",),
        ("latitude",),
        ("longitude",),
    ]

    row = {
        "property_name": "Far Away",
        "address": "1 Main",
        "latitude": 34.0,
        "longitude": -86.0,
        "rent_price": 1200.0,
        "beds": 2.0,
        "image_url": "https://example.com/x.jpg",
        "property_id": "far1",
        "total_in_scope": 0,
        "d_mi": 500.0,
    }

    mock_cached_execute_all.side_effect = [[], [row]]

    conn = MagicMock()
    conn.execute.side_effect = [cols_result]
    cm = MagicMock()
    cm.__enter__.return_value = conn
    cm.__exit__.return_value = None
    mock_engine.connect.return_value = cm

    client = _make_app()
    r = client.get(
        "/listings/nearby",
        params={"latitude": 40.7128, "longitude": -74.006, "radius_miles": 15, "limit": 50},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["total_in_radius"] == 0
    assert data["used_global_nearest_fallback"] is True
    assert len(data["properties"]) == 1
    assert data["properties"][0]["name"] == "Far Away"


@patch("listings.router.listing_table_name", "")
def test_nearby_empty_when_no_table_configured() -> None:
    client = _make_app()
    r = client.get("/listings/nearby", params={"latitude": 0, "longitude": 0})
    assert r.status_code == 200
    data = r.json()
    assert data["properties"] == []
    assert data["total_in_radius"] == 0
    assert data["used_global_nearest_fallback"] is False
