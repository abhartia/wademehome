"""SQL row → PropertyDataList fallback (guest listing search sidebar)."""

from workflow.property_parsing import parse_property_data_list_from_llm_content
from listings.nearby_mapper import property_list_from_sql_rows


def test_parse_property_data_list_from_llm_content_accepts_dict() -> None:
    payload = {
        "properties": [
            {
                "name": "Liberty Bay",
                "address": "190 W 54th Street",
                "city": "Bayonne",
                "state": "NJ",
                "zip_code": "07002",
                "latitude": 40.72,
                "longitude": -74.02,
                "rent_range": "$2,837/mo",
                "bedroom_range": "2 BR",
                "images_urls": [],
                "main_amenities": ["Pool", "Gym"],
                "amenities": ["Pool", "Gym"],
                "match_reason": None,
            }
        ]
    }
    out = parse_property_data_list_from_llm_content(payload)
    assert len(out.properties) == 1
    assert out.properties[0].name == "Liberty Bay"
    assert out.properties[0].city == "Bayonne"


def test_property_list_from_sql_rows_tuple_and_col_keys() -> None:
    col_keys = [
        "listing_id",
        "property_name",
        "address",
        "city",
        "state",
        "zipcode",
        "latitude",
        "longitude",
        "beds",
        "baths",
        "sqft",
        "rent_price",
        "image_url",
        "apartment_amenities",
        "listing_url",
    ]
    row = (
        "x_1",
        "Observer Park",
        "51 Garden St",
        "Hoboken",
        "NJ",
        "07030",
        40.736,
        -74.032,
        1.0,
        1.0,
        630.0,
        3700.0,
        "https://example.com/i.jpg",
        '["Gym"]',
        "https://example.com/l",
    )
    out = property_list_from_sql_rows([row], col_keys)
    assert len(out.properties) == 1
    p = out.properties[0]
    assert p.name == "Observer Park"
    assert p.latitude is not None
    assert p.longitude is not None
    assert "3700" in p.rent_range or "$" in p.rent_range
