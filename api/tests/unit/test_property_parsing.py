import json

import pytest
from pydantic import ValidationError

from workflow.property_parsing import parse_property_data_list_from_json


def test_parse_property_data_list_empty() -> None:
    out = parse_property_data_list_from_json("")
    assert out.properties == []


def test_parse_property_data_list_keeps_listings_without_coordinates() -> None:
    payload = {
        "properties": [
            {
                "name": "A",
                "address": "Addr A",
                "latitude": 40.0,
                "longitude": -74.0,
                "rent_range": "$2000-$2500",
                "bedroom_range": "1-3 bedrooms",
                "images_urls": ["https://example.com/a.jpg"],
                "main_amenities": ["Pool", "Gym", "Parking", "Doorman"],
                "amenities": ["Pool", "Gym"],
            },
            {
                "name": "B",
                "address": "Addr B",
                "latitude": None,
                "longitude": -73.0,
                "rent_range": "$1800-$2200",
                "bedroom_range": "0-1 bedrooms",
                "images_urls": [],
                "main_amenities": ["Parking"],
                "amenities": [],
            },
        ]
    }

    out = parse_property_data_list_from_json(json.dumps(payload))
    assert [p.name for p in out.properties] == ["A", "B"]
    assert out.properties[1].latitude is None


def test_parse_property_data_list_invalid_json_raises() -> None:
    with pytest.raises(json.JSONDecodeError):
        parse_property_data_list_from_json("{not-json")


def test_parse_property_data_list_validation_error_raises() -> None:
    # Missing required field `bedroom_range`
    payload = {
        "properties": [
            {
                "name": "A",
                "address": "Addr A",
                "latitude": 40.0,
                "longitude": -74.0,
                "rent_range": "$2000-$2500",
                "images_urls": [],
                "main_amenities": [],
                "amenities": [],
            }
        ]
    }

    with pytest.raises(ValidationError):
        parse_property_data_list_from_json(json.dumps(payload))

