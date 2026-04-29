import asyncio

from core.security_headers import SecurityHeadersMiddleware


def _csp_sources(csp: str) -> set[str]:
    """Return the union of every source token across every directive in
    the CSP. Used so tests can check origin allowance without fuzzy
    substring matching against the raw header string."""
    tokens: set[str] = set()
    for directive in csp.split(";"):
        parts = directive.strip().split()
        if len(parts) <= 1:
            continue
        tokens.update(parts[1:])
    return tokens


def _collect(middleware, scope):
    sent = []

    async def receive():
        return {"type": "http.request"}

    async def send(msg):
        sent.append(msg)

    asyncio.run(middleware(scope, receive, send))
    return sent


def _headers_for(path: str, monkeypatch=None) -> dict[bytes, bytes]:
    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": path, "headers": []})
    start = next(m for m in sent if m["type"] == "http.response.start")
    return {k.lower(): v for k, v in start["headers"]}


def test_security_headers_added():
    headers = _headers_for("/")
    assert headers.get(b"x-content-type-options") == b"nosniff"
    assert headers.get(b"x-frame-options") == b"DENY"
    assert b"referrer-policy" in headers
    assert b"permissions-policy" in headers


def test_default_csp_is_strict_for_json_api():
    csp = _headers_for("/listings/nearby").get(b"content-security-policy", b"").decode()
    assert "default-src 'none'" in csp
    assert "frame-ancestors 'none'" in csp
    assert "base-uri 'none'" in csp
    assert "form-action 'none'" in csp
    # The JSON-API default must not silently allow any third-party origins.
    sources = _csp_sources(csp)
    assert not any(s.startswith("https://") for s in sources)


def test_docs_paths_get_relaxed_csp():
    cdn = "https://cdn.jsdelivr.net"
    for path in ("/docs", "/redoc", "/docs/oauth2-redirect"):
        csp = _headers_for(path).get(b"content-security-policy", b"").decode()
        # Swagger UI / ReDoc bundle is served from jsDelivr; without this
        # source allowance the interactive docs would be blank.
        assert cdn in _csp_sources(csp), f"missing CDN allowance on {path}"
        assert "frame-ancestors 'none'" in csp


def test_csp_env_override_replaces_default(monkeypatch):
    monkeypatch.setenv("CONTENT_SECURITY_POLICY", "default-src 'self'")
    csp = _headers_for("/").get(b"content-security-policy", b"")
    assert csp == b"default-src 'self'"


def test_csp_can_be_disabled_via_empty_env(monkeypatch):
    # Operator escape hatch: explicit empty string suppresses the header
    # entirely (e.g. while debugging a broken third-party integration).
    monkeypatch.setenv("CONTENT_SECURITY_POLICY", "")
    headers = _headers_for("/listings/nearby")
    assert b"content-security-policy" not in headers


def test_passes_through_non_http_scope():
    async def inner(scope, _receive, send):
        await send({"type": "lifespan.startup.complete"})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "lifespan"})
    assert sent == [{"type": "lifespan.startup.complete"}]
