from unittest.mock import MagicMock

from core.rate_limit import request_identity


def test_identity_prefers_user_id(monkeypatch):
    from core import request_context

    monkeypatch.setattr(request_context, "get_user_id", lambda: "user-42")
    import core.rate_limit as rl

    monkeypatch.setattr(rl, "get_user_id", lambda: "user-42")
    req = MagicMock()
    req.client.host = "10.0.0.1"
    assert request_identity(req) == "user:user-42"


def test_identity_falls_back_to_ip(monkeypatch):
    import core.rate_limit as rl

    monkeypatch.setattr(rl, "get_user_id", lambda: None)
    req = MagicMock()
    req.client.host = "10.0.0.9"
    assert request_identity(req).startswith("ip:")


def test_auth_endpoints_declare_explicit_limits():
    """Every auth write endpoint that costs CPU or sends email must opt out of
    the permissive 120/min default; SECURITY.md threat #3 calls these out by
    name. Regression guard: it's easy to add a new auth route and forget the
    decorator. We resolve route -> endpoint -> slowapi's internal registry so
    the check follows whatever path FastAPI's APIRouter actually mounts."""
    import importlib

    auth_module = importlib.import_module("auth.router")
    import core.rate_limit as rl

    must_be_limited = {
        "/auth/login",
        "/auth/signup",
        "/auth/magic-link/request",
        "/auth/magic-link/verify",
        "/auth/verify-email",
        "/auth/verify-email/resend",
    }
    registered = set(rl.limiter._route_limits.keys())  # type: ignore[attr-defined]
    found_paths: set[str] = set()
    for route in auth_module.router.routes:
        path = getattr(route, "path", None)
        endpoint = getattr(route, "endpoint", None)
        if not path or endpoint is None or path not in must_be_limited:
            continue
        found_paths.add(path)
        key = f"{endpoint.__module__}.{endpoint.__qualname__}"
        assert key in registered, f"{path} missing @limiter.limit decorator (key {key} not in {sorted(registered)})"

    missing = must_be_limited - found_paths
    assert not missing, f"expected auth routes not registered: {missing}"


def test_auth_login_returns_429_after_burst(client, app_module):
    """End-to-end: hammer /auth/login past its configured budget and confirm
    the uniform 429 envelope kicks in. We override get_db with a stub session
    so the handler returns a deterministic 401 without needing a live DB."""
    import core.rate_limit as rl
    from auth.router import get_db

    class _StubResult:
        def scalar_one_or_none(self):
            return None

    class _StubDB:
        def execute(self, *args, **kwargs):
            return _StubResult()

        def add(self, *args, **kwargs):
            return None

        def commit(self):
            return None

        def refresh(self, *args, **kwargs):
            return None

        def close(self):
            return None

    def _override_get_db():
        yield _StubDB()

    app_module.fastapi_app.dependency_overrides[get_db] = _override_get_db
    rl.limiter.reset()
    try:
        payload = {"email": "nobody@example.com", "password": "wrong-password"}
        statuses = [client.post("/auth/login", json=payload).status_code for _ in range(8)]
    finally:
        app_module.fastapi_app.dependency_overrides.pop(get_db, None)
        rl.limiter.reset()

    # Up to RATE_LIMIT_AUTH_LOGIN (default 5/min) should return 401, the rest 429.
    assert 401 in statuses, f"expected 401s before throttling, got {statuses}"
    assert 429 in statuses, f"expected at least one 429, got {statuses}"
