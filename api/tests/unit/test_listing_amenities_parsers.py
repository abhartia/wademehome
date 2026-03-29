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


def test_parse_greystar_amenities_fixture():
    html = (FIXTURES / "greystar_next_data_sample.html").read_text(encoding="utf-8")
    out = lap.parse_greystar_amenities_from_html(html)
    assert out == (["Pool"], ["W/D"])
