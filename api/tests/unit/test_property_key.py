from listings.property_key import (
    build_property_key,
    item_matches_property_key,
    parse_property_key,
    property_key_from_item,
    slugify,
)
from workflow.events import PropertyDataItem


def test_slugify_matches_ts_conventions() -> None:
    assert slugify("Hello World!!") == "hello-world"
    assert slugify("  Foo-Bar  ") == "foo-bar"
    assert slugify("") == ""


def test_build_property_key_fixed_decimals() -> None:
    k = build_property_key("Hi Rise", "1 Oak", 40.71274999, -74.006011)
    # JS joins lat + "--" + lng; negative lng yields three hyphens (e.g. 40.7---74.0).
    assert k == "hi-rise--1-oak--40.7127---74.0060"


def test_build_property_key_na() -> None:
    k = build_property_key("A", "B", None, None)
    assert k == "a--b--na--na"


def test_parse_property_key_roundtrip() -> None:
    raw = "foo--bar-baz--12.0000--na"
    p = parse_property_key(raw)
    assert p is not None
    assert p.name_slug == "foo"
    assert p.address_slug == "bar-baz"
    assert p.lat_token == "12.0000"
    assert p.lng_token == "na"


def test_item_matches_full_key() -> None:
    item = PropertyDataItem(
        name="Hi Rise",
        address="1 Oak",
        latitude=40.71274999,
        longitude=-74.006011,
        rent_range="$2k",
        bedroom_range="1 BR",
        images_urls=[],
        main_amenities=[],
        amenities=[],
        match_reason=None,
    )
    key = property_key_from_item(item)
    assert item_matches_property_key(key, item)


def test_item_matches_slug_only_when_key_has_na_coords() -> None:
    key = "my-prop--123-main-st--na--na"
    item = PropertyDataItem(
        name="My Prop",
        address="123 Main St",
        latitude=30.1,
        longitude=-97.7,
        rent_range="$1",
        bedroom_range="1 BR",
        images_urls=[],
        main_amenities=[],
        amenities=[],
        match_reason=None,
    )
    assert item_matches_property_key(key, item)
