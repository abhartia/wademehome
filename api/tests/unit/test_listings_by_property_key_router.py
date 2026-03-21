from unittest.mock import MagicMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from listings.router import router


def _make_app() -> TestClient:
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


@patch("listings.router.Config.get")
@patch("listings.router.listing_table_schema", None)
@patch("listings.router.listing_table_name", "listings")
@patch("listings.router.inspect")
@patch("listings.router.engine")
def test_by_property_key_returns_match(
    mock_engine: MagicMock,
    mock_inspect: MagicMock,
    mock_config_get: MagicMock,
) -> None:
    mock_config_get.side_effect = lambda key, default=None: (
        "postgresql://user:pass@localhost:5432/db" if key == "DATABASE_URL" else default
    )
    mock_engine.dialect.name = "postgresql"
    mock_inspect.return_value = MagicMock(has_table=MagicMock(return_value=True))

    cols_result = MagicMock()
    cols_result.fetchall.return_value = [
        ("property_id",),
        ("latitude",),
        ("longitude",),
        ("building_name",),
        ("address",),
        ("min_rent",),
        ("max_rent",),
        ("bedrooms",),
    ]

    row = {
        "building_name": "Hi Rise",
        "address": "1 Oak",
        "latitude": 40.71275,
        "longitude": -74.00601,
        "min_rent": 2000,
        "max_rent": 2100,
        "bedrooms": 1,
        "property_id": "p1",
    }
    select_result = MagicMock()
    select_result.mappings.return_value.all.return_value = [row]

    conn = MagicMock()
    conn.execute.side_effect = [cols_result, select_result]
    cm = MagicMock()
    cm.__enter__.return_value = conn
    cm.__exit__.return_value = None
    mock_engine.connect.return_value = cm

    client = _make_app()
    key = "hi-rise--1-oak--40.7127---74.0060"
    r = client.get("/listings/by-property-key", params={"property_key": key})
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Hi Rise"
    assert data["address"] == "1 Oak"


@patch("listings.router.Config.get")
@patch("listings.router.listing_table_schema", None)
@patch("listings.router.listing_table_name", "listings")
@patch("listings.router.inspect")
@patch("listings.router.engine")
def test_by_property_key_404_when_no_match(
    mock_engine: MagicMock,
    mock_inspect: MagicMock,
    mock_config_get: MagicMock,
) -> None:
    mock_config_get.side_effect = lambda key, default=None: (
        "postgresql://user:pass@localhost:5432/db" if key == "DATABASE_URL" else default
    )
    mock_engine.dialect.name = "postgresql"
    mock_inspect.return_value = MagicMock(has_table=MagicMock(return_value=True))

    cols_result = MagicMock()
    cols_result.fetchall.return_value = [
        ("property_id",),
        ("latitude",),
        ("longitude",),
        ("name",),
        ("address",),
    ]

    row = {
        "name": "Other",
        "address": "Elsewhere",
        "latitude": 41.0,
        "longitude": -75.0,
        "property_id": "x",
    }
    select_result = MagicMock()
    select_result.mappings.return_value.all.return_value = [row]

    conn = MagicMock()
    conn.execute.side_effect = [cols_result, select_result]
    cm = MagicMock()
    cm.__enter__.return_value = conn
    cm.__exit__.return_value = None
    mock_engine.connect.return_value = cm

    client = _make_app()
    r = client.get("/listings/by-property-key", params={"property_key": "nope--nope--40.0000--74.0000"})
    assert r.status_code == 404
