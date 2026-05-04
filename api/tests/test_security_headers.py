import asyncio

from core.security_headers import SecurityHeadersMiddleware


def _collect(middleware, scope):
    sent = []

    async def receive():
        return {"type": "http.request"}

    async def send(msg):
        sent.append(msg)

    asyncio.run(middleware(scope, receive, send))
    return sent


def _start_message(sent):
    return next(m for m in sent if m["type"] == "http.response.start")


def _headers(sent):
    return {k.lower(): v for k, v in _start_message(sent)["headers"]}


async def _inner(_scope, _receive, send):
    await send({"type": "http.response.start", "status": 200, "headers": []})
    await send({"type": "http.response.body", "body": b""})


def test_security_headers_added(monkeypatch):
    monkeypatch.delenv("CONTENT_SECURITY_POLICY", raising=False)
    mw = SecurityHeadersMiddleware(_inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/listings", "headers": []})
    headers = _headers(sent)
    assert headers.get(b"x-content-type-options") == b"nosniff"
    assert headers.get(b"x-frame-options") == b"DENY"
    assert b"referrer-policy" in headers
    assert b"permissions-policy" in headers
    assert headers.get(b"cross-origin-resource-policy") == b"same-origin"
    # Default CSP locks down JSON responses to "load nothing".
    csp = headers.get(b"content-security-policy", b"").decode()
    assert "default-src 'none'" in csp
    assert "frame-ancestors 'none'" in csp


def test_csp_can_be_overridden_via_env(monkeypatch):
    monkeypatch.setenv("CONTENT_SECURITY_POLICY", "default-src 'self'")
    mw = SecurityHeadersMiddleware(_inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/listings", "headers": []})
    headers = _headers(sent)
    assert headers.get(b"content-security-policy") == b"default-src 'self'"


def test_csp_can_be_disabled_via_env(monkeypatch):
    # Escape hatch: setting CONTENT_SECURITY_POLICY=off omits the header entirely.
    monkeypatch.setenv("CONTENT_SECURITY_POLICY", "off")
    mw = SecurityHeadersMiddleware(_inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/listings", "headers": []})
    headers = _headers(sent)
    assert b"content-security-policy" not in headers


def _csp_directives(csp: str) -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for raw in csp.split(";"):
        parts = raw.strip().split()
        if not parts:
            continue
        out[parts[0]] = parts[1:]
    return out


def test_docs_paths_get_permissive_csp(monkeypatch):
    # FastAPI docs UI loads Swagger / ReDoc bundles from cdn.jsdelivr.net; the
    # JSON-only default CSP would block them. The docs-specific CSP allows
    # those origins while keeping frame-ancestors locked down.
    monkeypatch.delenv("CONTENT_SECURITY_POLICY", raising=False)
    monkeypatch.delenv("CONTENT_SECURITY_POLICY_DOCS", raising=False)
    jsdelivr = "https://cdn.jsdelivr.net"
    mw = SecurityHeadersMiddleware(_inner)
    for path in ("/docs", "/docs/oauth2-redirect", "/redoc"):
        sent = _collect(mw, {"type": "http", "method": "GET", "path": path, "headers": []})
        csp = _headers(sent).get(b"content-security-policy", b"").decode()
        directives = _csp_directives(csp)
        assert jsdelivr in directives.get("script-src", []), f"docs path {path} missing jsdelivr in script-src"
        assert jsdelivr in directives.get("style-src", []), f"docs path {path} missing jsdelivr in style-src"
        assert directives.get("frame-ancestors") == ["'none'"]


def test_passes_through_non_http_scope():
    async def inner(scope, _receive, send):
        await send({"type": "lifespan.startup.complete"})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "lifespan"})
    assert sent == [{"type": "lifespan.startup.complete"}]
