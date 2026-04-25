"""Readiness probe — /ready endpoint and core.readiness.check_readiness."""

from __future__ import annotations

from core import readiness


def test_check_readiness_all_pass():
    ok, results = readiness.check_readiness(probes={"fake": lambda: None})
    assert ok is True
    assert results["fake"]["ok"] is True
    assert results["fake"]["latency_ms"] >= 0


def test_check_readiness_single_failure():
    def boom() -> None:
        raise RuntimeError("db unreachable")

    ok, results = readiness.check_readiness(probes={"db": boom})
    assert ok is False
    assert results["db"]["ok"] is False
    # Error message must NOT leak to the wire payload — it's logged server-side.
    assert "error" not in results["db"]


def test_check_readiness_mixed():
    def boom() -> None:
        raise RuntimeError("x")

    ok, results = readiness.check_readiness(probes={"db": lambda: None, "cache": boom})
    assert ok is False
    assert results["db"]["ok"] is True
    assert results["cache"]["ok"] is False


def test_ready_endpoint_returns_200_when_probes_pass(client, monkeypatch):
    import main

    monkeypatch.setattr(
        main,
        "check_readiness",
        lambda: (True, {"db": {"ok": True, "latency_ms": 1}}),
    )
    r = client.get("/ready")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ready"
    assert body["checks"]["db"]["ok"] is True


def test_ready_endpoint_returns_503_when_probe_fails(client, monkeypatch):
    import main

    monkeypatch.setattr(
        main,
        "check_readiness",
        lambda: (False, {"db": {"ok": False, "latency_ms": 42}}),
    )
    r = client.get("/ready")
    assert r.status_code == 503
    body = r.json()
    assert body["status"] == "not_ready"
    assert body["checks"]["db"]["ok"] is False
    # Probe latency is surfaced so operators can see *why* 503 (timeout vs. refused).
    assert body["checks"]["db"]["latency_ms"] == 42


def test_ready_endpoint_sets_request_id_header(client, monkeypatch):
    import main

    monkeypatch.setattr(main, "check_readiness", lambda: (True, {}))
    r = client.get("/ready", headers={"x-request-id": "rid-ready-1"})
    assert r.headers.get("x-request-id") == "rid-ready-1"


def test_v1_mirror_does_not_shadow_ready(fastapi_client):
    # /ready is app-level (not router-mounted), so it intentionally does NOT appear under /v1.
    # Asserting this keeps someone from accidentally moving it into _ALL_ROUTERS.
    paths = {r.path for r in fastapi_client.app.routes if hasattr(r, "path")}
    assert "/ready" in paths
    assert "/v1/ready" not in paths
