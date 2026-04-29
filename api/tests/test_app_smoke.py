"""Full-stack smoke test: hits the FastAPI app through the real ASGI wrapper chain.

These tests exercise request context, security headers, CORS, and error envelope in one go.
"""

from __future__ import annotations


def test_health_returns_request_id_header(client):
    r = client.get("/health", headers={"x-request-id": "rid-test-abc"})
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "healthy"
    assert r.headers.get("x-request-id") == "rid-test-abc"


def test_health_assigns_request_id_when_missing(client):
    r = client.get("/health")
    assert r.status_code == 200
    rid = r.headers.get("x-request-id")
    assert rid and len(rid) >= 16


def test_security_headers_present(client):
    r = client.get("/health")
    assert r.headers.get("x-content-type-options") == "nosniff"
    assert r.headers.get("x-frame-options") == "DENY"
    assert "referrer-policy" in {k.lower() for k in r.headers}
    assert "permissions-policy" in {k.lower() for k in r.headers}
    # JSON API path: strict default CSP. See ADR-0007.
    csp = r.headers.get("content-security-policy", "")
    assert "default-src 'none'" in csp
    assert "frame-ancestors 'none'" in csp


def test_v1_mirror_mounted(fastapi_client):
    # The /flags endpoint hits the DB; we only check routing exists.
    routes = {r.path for r in fastapi_client.app.routes if hasattr(r, "path")}
    assert "/v1/flags" in routes
    assert "/flags" in routes


def test_404_has_error_envelope(client):
    r = client.get("/definitely-not-a-route")
    assert r.status_code == 404
    body = r.json()
    assert "error" in body
    assert body["error"]["code"] == "not_found"
    assert "request_id" in body["error"]


def test_validation_error_envelope(client):
    # /listings/nearby raises HTTPException(422) when bbox/lat+lng both missing.
    r = client.get("/listings/nearby")
    assert r.status_code == 422
    body = r.json()
    assert body["error"]["code"] == "validation_error"
    assert "request_id" in body["error"]
