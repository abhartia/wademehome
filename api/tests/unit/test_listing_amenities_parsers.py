"""Tests for source-only listing amenity parsers."""

from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
FIXTURES = REPO_ROOT / "api" / "tests" / "fixtures" / "listing_amenities"

# Import repo-root module when running from api/tests
import sys

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import listing_amenities_parsers as lap


def test_parse_rentcafe_amenities_fixture():
    html = (FIXTURES / "rentcafe_sample.html").read_text(encoding="utf-8")
    out = lap.parse_rentcafe_amenities(html)
    assert out is not None
    comm, apt = out
    assert comm == ["Pool", "Fitness Center"]
    assert apt == ["Washer/Dryer", "Balcony"]


def test_parse_securecafe_amenities_fixture():
    html = (FIXTURES / "securecafe_amenities_sample.html").read_text(encoding="utf-8")
    out = lap.parse_securecafe_amenities_html(html)
    assert out is not None
    comm, apt = out
    assert comm == ["Clubhouse", "Dog Park"]
    assert apt == ["Granite counters"]


def test_parse_entrata_jonah_amenities_fixture():
    html = (FIXTURES / "entrata_jonah_amenities_sample.html").read_text(encoding="utf-8")
    out = lap.parse_entrata_jonah_amenities_html(html)
    assert out is not None
    comm, apt = out
    assert comm == ["Fitness Center", "Pool"]
    assert apt == ["Stainless appliances"]


def test_securecafe_amenities_url():
    u = "https://parkmerced.securecafe.com/onlineleasing/parkmerced/floorplans.aspx"
    assert lap.securecafe_amenities_url(u).endswith("/onlineleasing/parkmerced/amenities.aspx")


def test_entrata_amenities_url():
    assert (
        lap.entrata_amenities_url("https://entrawestend.com/floorplans/")
        == "https://entrawestend.com/amenities/"
    )


def test_parse_rentcafe_missing_returns_none():
    assert lap.parse_rentcafe_amenities("<html><body></body></html>") is None


def test_parse_rentcafe_alt_h2_fixture():
    html = (FIXTURES / "rentcafe_alt_layout.html").read_text(encoding="utf-8")
    out = lap.parse_rentcafe_amenities(html)
    assert out is not None
    comm, apt = out
    assert "Dog Park" in comm
    assert "Quartz counters" in apt


def test_parse_rentcafe_partial_community_only():
    """If only community DOM parses, apartment may be empty rather than failing the whole URL."""
    html = """<html><body>
    <p class="font-weight-bold">Community amenities</p>
    <ul class="list-bullet"><li>Pool</li></ul>
    </body></html>"""
    out = lap.parse_rentcafe_amenities(html)
    assert out is not None
    comm, apt = out
    assert comm == ["Pool"]
    assert apt == []


def test_parse_greystar_amenities_fixture():
    html = (FIXTURES / "greystar_next_data_sample.html").read_text(encoding="utf-8")
    out = lap.parse_greystar_amenities_from_html(html)
    assert out == (["Pool"], ["W/D"])


def test_parse_greystar_highlights_when_lists_empty():
    html = (FIXTURES / "greystar_highlights_only.html").read_text(encoding="utf-8")
    out = lap.parse_greystar_amenities_from_html(html)
    assert out is not None
    comm, apt = out
    assert set(comm) == {"Pool", "Fitness Center", "Pet Friendly", "Smoke Free"}
    assert set(apt) == {"Air Conditioning", "Patio/Balcony"}


def test_parse_greystar_placeholder_lists_fall_through_to_highlights():
    html = """<!DOCTYPE html><html><body>
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"componentProps":{"x":{"componentName":"PropertyDetailsAmenities",
    "data":{"amenities":["Information coming soon!"],"features":["Information coming soon!"],
    "highlights":{"smokeFree":true}}}}}}}
    </script></body></html>"""
    out = lap.parse_greystar_amenities_from_html(html)
    assert out == (["Smoke Free"], [])


def test_parse_greystar_dom_when_no_next_component():
    html = (FIXTURES / "greystar_dom_only.html").read_text(encoding="utf-8")
    out = lap.parse_greystar_amenities_from_html(html)
    assert out == (["Pool"], ["Air Conditioning"])


def test_parse_greystar_uses_property_highlights_when_amenities_component_blank():
    """PD-amenities empty/false; PropertyDetails.property.highlights may still be set."""
    html = """<!DOCTYPE html><html><body>
    <script id="__NEXT_DATA__" type="application/json">
    {"props":{"pageProps":{"componentProps":{
    "a":{"componentName":"PropertyDetailsAmenities","data":{"amenities":[],"features":[],
    "highlights":{"airCon":false,"dishwasher":false,"pools":false,"fitness":false,"pets":false}}},
    "p":{"componentName":"PropertyDetails","data":{"property":{"highlights":{"pools":true,"pets":true,"airCon":true}}}}
    }}}}
    </script></body></html>"""
    out = lap.parse_greystar_amenities_from_html(html)
    assert out is not None
    comm, apt = out
    assert set(comm) == {"Pool", "Pet Friendly"}
    assert apt == ["Air Conditioning"]
