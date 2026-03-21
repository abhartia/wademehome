"""Unit tests for Mapbox Search Box category nearby helper."""

from __future__ import annotations

import json
from io import BytesIO
from unittest.mock import patch

from listings.mapbox_client import search_category_nearby


def test_search_category_nearby_parses_feature_collection() -> None:
    payload = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-74.0, 40.7]},
                "properties": {
                    "name": "Test Pharmacy",
                    "full_address": "1 Main St, New York, NY",
                },
            }
        ],
    }

    class _FakeCM:
        def __enter__(self):
            return BytesIO(json.dumps(payload).encode())

        def __exit__(self, *args: object) -> None:
            return None

    with patch("listings.mapbox_client.urllib.request.urlopen", return_value=_FakeCM()):
        out = search_category_nearby(40.7, -74.0, "pharmacy", "tok", limit=5)

    assert len(out) == 1
    assert out[0]["name"] == "Test Pharmacy"
    assert out[0]["place_name"] == "1 Main St, New York, NY"
    assert out[0]["longitude"] == -74.0
    assert out[0]["latitude"] == 40.7
    assert out[0]["distance_meters"] == 0.0


def test_search_category_nearby_uses_mapbox_distance_when_present() -> None:
    payload = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-74.0, 40.7]},
                "properties": {
                    "name": "Far Mart",
                    "distance": 412.5,
                },
            }
        ],
    }

    class _FakeCM:
        def __enter__(self):
            return BytesIO(json.dumps(payload).encode())

        def __exit__(self, *args: object) -> None:
            return None

    with patch("listings.mapbox_client.urllib.request.urlopen", return_value=_FakeCM()):
        out = search_category_nearby(40.7, -74.0, "supermarket", "tok", limit=5)

    assert out[0]["distance_meters"] == 412.5


def test_search_category_nearby_empty_category_id() -> None:
    assert search_category_nearby(1.0, 2.0, "   ", "tok") == []
