"""Unit tests for Mapbox US state extraction from geocoding features."""

from __future__ import annotations

import json
from io import BytesIO
from unittest.mock import patch

from listings.mapbox_client import _feature_us_state_code, forward_geocode_us_state


def test_feature_us_state_from_context() -> None:
    feature = {
        "context": [
            {"id": "country.123", "short_code": "us"},
            {"id": "region.456", "short_code": "US-NY"},
        ]
    }
    assert _feature_us_state_code(feature) == "NY"


def test_feature_us_state_requires_us_country() -> None:
    feature = {
        "context": [
            {"id": "country.123", "short_code": "ca"},
            {"id": "region.456", "short_code": "US-NY"},
        ]
    }
    assert _feature_us_state_code(feature) is None


def test_forward_geocode_us_state_reads_first_feature() -> None:
    payload = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "center": [-74.0, 40.7],
                "context": [
                    {"id": "country.1", "short_code": "us"},
                    {"id": "region.2", "short_code": "US-PA"},
                ],
            }
        ],
    }

    class _FakeCM:
        def __enter__(self):
            return BytesIO(json.dumps(payload).encode())

        def __exit__(self, *args: object) -> None:
            return None

    with patch("listings.mapbox_client.urllib.request.urlopen", return_value=_FakeCM()):
        assert forward_geocode_us_state("100 Chestnut St, Philadelphia, PA", "tok") == "PA"
