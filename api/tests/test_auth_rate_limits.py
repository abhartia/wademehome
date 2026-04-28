"""Auth endpoints reject abuse with 429 once the per-route limit is exceeded.

Threat model #3 in SECURITY.md flags `/auth/login` as a brute-force / enumeration
target. Tight per-endpoint limits live on the router; this test proves the
decorator is actually wired (not just present).

Conftest sets ``RATE_LIMIT_AUTH_LOGIN=2/minute`` so we hit the cap in three calls
without sleeping.
"""

from __future__ import annotations

import pytest


class _FakeQueryResult:
    def scalar_one_or_none(self):
        return None


class _FakeSession:
    """Minimal stand-in for a SQLAlchemy Session.

    Any user-lookup returns no rows, which sends `/auth/login` down the 401
    branch before it touches a real DB.
    """

    def execute(self, *_a, **_kw):
        return _FakeQueryResult()

    def add(self, *_a, **_kw): ...
    def flush(self, *_a, **_kw): ...
    def commit(self, *_a, **_kw): ...
    def refresh(self, *_a, **_kw): ...
    def close(self, *_a, **_kw): ...


@pytest.fixture
def auth_client(app_module):
    from fastapi.testclient import TestClient

    from auth.router import get_db

    app_module.fastapi_app.dependency_overrides[get_db] = lambda: _FakeSession()
    try:
        yield TestClient(app_module.app)
    finally:
        app_module.fastapi_app.dependency_overrides.pop(get_db, None)


def test_login_rate_limit_returns_429_after_cap(auth_client):
    payload = {"email": "nobody@example.com", "password": "irrelevant"}
    statuses = [auth_client.post("/auth/login", json=payload).status_code for _ in range(4)]

    # Default cap (set in conftest) is 2/minute. The first two calls should
    # surface the real 401; everything past the cap must be 429.
    assert statuses[:2] == [401, 401], statuses
    assert all(code == 429 for code in statuses[2:]), statuses


def test_login_429_carries_error_envelope_and_request_id(auth_client):
    payload = {"email": "nobody@example.com", "password": "irrelevant"}
    for _ in range(2):
        auth_client.post("/auth/login", json=payload)
    resp = auth_client.post("/auth/login", json=payload)

    assert resp.status_code == 429
    body = resp.json()
    assert body["error"]["code"] == "rate_limited"
    assert body["error"]["request_id"]  # propagated by RequestContext middleware
