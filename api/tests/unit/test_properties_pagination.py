"""Pagination behavior on the /properties list endpoints.

The legacy router returned every row for the user's group; an authenticated user
who accumulated thousands of favorites or notes could trigger an unbounded scan
on every read. These tests pin the new bounded ``limit``/``offset`` contract and
the ``total`` count returned alongside the page.
"""

from __future__ import annotations

import uuid
from types import SimpleNamespace
from unittest.mock import MagicMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from auth.router import get_current_user, get_db
from properties.router import router


def _make_client(rows: list, total: int) -> TestClient:
    """Build a TestClient with auth + DB swapped out for in-memory fakes."""

    user = SimpleNamespace(id=uuid.uuid4(), email="t@example.com")

    db = MagicMock()
    # resolve_scope() runs first and uses .scalar_one_or_none() to look up
    # the GroupMembers row. Returning a truthy object satisfies that check.
    membership_result = MagicMock()
    membership_result.scalar_one_or_none.return_value = SimpleNamespace(role="member")

    count_result = MagicMock()
    count_result.scalar_one.return_value = total

    rows_result = MagicMock()
    rows_result.all.return_value = rows

    db.execute.side_effect = [membership_result, count_result, rows_result]

    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_user] = lambda: user
    return TestClient(app)


def _favorite_row(property_key: str = "p1") -> SimpleNamespace:
    fav = SimpleNamespace(
        property_key=property_key,
        property_name="Example",
        property_address="1 Main St",
        created_at="2026-01-01T00:00:00+00:00",
        user_id=uuid.uuid4(),
        group_id=None,
    )
    return SimpleNamespace(PropertyFavorites=fav, email="t@example.com")


def test_favorites_rejects_zero_limit() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get("/properties/favorites", params={"group_id": str(uuid.uuid4()), "limit": 0})
    assert r.status_code == 422


def test_favorites_rejects_oversized_limit() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get("/properties/favorites", params={"group_id": str(uuid.uuid4()), "limit": 201})
    assert r.status_code == 422


def test_favorites_rejects_negative_offset() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get("/properties/favorites", params={"group_id": str(uuid.uuid4()), "offset": -1})
    assert r.status_code == 422


def test_favorites_returns_total_alongside_page() -> None:
    client = _make_client(rows=[_favorite_row("p1")], total=42)
    r = client.get(
        "/properties/favorites",
        params={"group_id": str(uuid.uuid4()), "limit": 1, "offset": 0},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 42
    assert len(body["favorites"]) == 1
    assert body["favorites"][0]["property_key"] == "p1"


def test_group_notes_rejects_oversized_limit() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get(
        "/properties/group-notes/some-key",
        params={"group_id": str(uuid.uuid4()), "limit": 500},
    )
    assert r.status_code == 422


def test_reactions_rejects_oversized_limit() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get(
        "/properties/reactions/some-key",
        params={"group_id": str(uuid.uuid4()), "limit": 500},
    )
    assert r.status_code == 422


def test_commented_rejects_oversized_limit() -> None:
    client = _make_client(rows=[], total=0)
    r = client.get(
        "/properties/commented",
        params={"group_id": str(uuid.uuid4()), "limit": 500},
    )
    assert r.status_code == 422
