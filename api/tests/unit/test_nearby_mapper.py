import json

from listings.nearby_mapper import row_to_property_data_item


def test_row_to_property_minimal() -> None:
    p = row_to_property_data_item(
        {
            "name": "Tower A",
            "address": "10 Main St, NYC, NY",
            "latitude": 40.7128,
            "longitude": -74.006,
            "min_rent": 2500,
            "max_rent": 2800,
            "bedrooms": 2,
            "amenities": '["Gym", "Pool"]',
            "image_url": "https://example.com/a.jpg",
        }
    )
    assert p.name == "Tower A"
    assert p.address == "10 Main St, NYC, NY"
    assert p.latitude == 40.7128
    assert p.longitude == -74.006
    assert "$2,500" in p.rent_range and "$2,800" in p.rent_range
    assert p.bedroom_range == "2 BR"
    assert p.amenities == ["Gym", "Pool"]
    assert p.main_amenities == ["Gym", "Pool"]
    assert p.images_urls == ["https://example.com/a.jpg"]


def test_row_to_property_case_insensitive_keys() -> None:
    p = row_to_property_data_item(
        {
            "Building_Name": "Lowrise",
            "Latitude": 41.0,
            "Longitude": -73.0,
        }
    )
    assert p.name == "Lowrise"
    assert p.latitude == 41.0
    assert p.longitude == -73.0


def test_row_to_property_rent_price_and_greystar_amenities() -> None:
    p = row_to_property_data_item(
        {
            "property_name": "Observer Park",
            "address": "51 Garden St",
            "city": "Hoboken",
            "state": "NJ",
            "zipcode": "07030",
            "latitude": 40.736,
            "longitude": -74.033,
            "rent_price": 3700.0,
            "beds": 1.0,
            "apartment_amenities": '["Gym", "Pool"]',
            "community_amenities": '["Lounge"]',
            "image_url": "https://example.com/x.jpg",
        }
    )
    assert p.name == "Observer Park"
    assert "Hoboken" in p.address
    assert "07030" in p.address
    assert p.city == "Hoboken"
    assert p.state == "NJ"
    assert p.zip_code == "07030"
    assert "$3,700" in p.rent_range
    assert p.amenities[:3] == ["Gym", "Pool", "Lounge"]


def test_row_to_property_amenities_comma_string() -> None:
    p = row_to_property_data_item(
        {
            "name": "X",
            "address": "Y",
            "latitude": 0.0,
            "longitude": 0.0,
            "amenities": "Doorman, Roof deck, Gym",
        }
    )
    assert p.amenities == ["Doorman", "Roof deck", "Gym"]
    assert p.main_amenities == ["Doorman", "Roof deck", "Gym"]


def test_images_json_beats_single_image_url() -> None:
    imgs = json.dumps(
        [
            {"url": "https://cdn.example.com/1.jpg"},
            {"photoUrl": "https://cdn.example.com/2.jpg"},
        ]
    )
    p = row_to_property_data_item(
        {
            "name": "Tower",
            "address": "1 Main",
            "latitude": 0.0,
            "longitude": 0.0,
            "image_url": "https://thumb.example.com/only.jpg",
            "images": imgs,
        }
    )
    assert p.images_urls == [
        "https://cdn.example.com/1.jpg",
        "https://cdn.example.com/2.jpg",
    ]


def test_images_urls_column_takes_priority_over_images() -> None:
    p = row_to_property_data_item(
        {
            "name": "Tower",
            "address": "1 Main",
            "latitude": 0.0,
            "longitude": 0.0,
            "images_urls": '["https://a.example.com/x.jpg", "https://a.example.com/y.jpg"]',
            "images": json.dumps([{"url": "https://b.example.com/z.jpg"}]),
        }
    )
    assert p.images_urls == [
        "https://a.example.com/x.jpg",
        "https://a.example.com/y.jpg",
    ]
