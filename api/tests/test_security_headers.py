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


def test_security_headers_added():
    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/", "headers": []})
    start = next(m for m in sent if m["type"] == "http.response.start")
    headers = {k.lower(): v for k, v in start["headers"]}
    assert headers.get(b"x-content-type-options") == b"nosniff"
    assert headers.get(b"x-frame-options") == b"DENY"
    assert b"referrer-policy" in headers
    assert b"permissions-policy" in headers
    # CSP is opt-in — only emitted when CONTENT_SECURITY_POLICY env is set.
    assert b"content-security-policy" not in headers
    # Default no-store keeps auth'd JSON out of shared caches / browser HTTP cache.
    assert headers.get(b"cache-control") == b"no-store"


def test_csp_emitted_when_env_set(monkeypatch):
    monkeypatch.setenv("CONTENT_SECURITY_POLICY", "default-src 'self'")

    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/", "headers": []})
    start = next(m for m in sent if m["type"] == "http.response.start")
    headers = {k.lower(): v for k, v in start["headers"]}
    assert headers.get(b"content-security-policy") == b"default-src 'self'"


def test_handler_cache_control_preserved():
    async def inner(_scope, _receive, send):
        await send(
            {
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"cache-control", b"public, max-age=3600")],
            }
        )
        await send({"type": "http.response.body", "body": b""})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/sitemap-keys", "headers": []})
    start = next(m for m in sent if m["type"] == "http.response.start")
    headers = {k.lower(): v for k, v in start["headers"]}
    # Handler-set caching survives the middleware so opt-in caching still works.
    assert headers.get(b"cache-control") == b"public, max-age=3600"


def test_default_cache_control_disabled_by_empty_env(monkeypatch):
    monkeypatch.setenv("DEFAULT_CACHE_CONTROL", "")

    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "http", "method": "GET", "path": "/", "headers": []})
    start = next(m for m in sent if m["type"] == "http.response.start")
    headers = {k.lower(): v for k, v in start["headers"]}
    assert b"cache-control" not in headers


def test_passes_through_non_http_scope():
    async def inner(scope, _receive, send):
        await send({"type": "lifespan.startup.complete"})

    mw = SecurityHeadersMiddleware(inner)
    sent = _collect(mw, {"type": "lifespan"})
    assert sent == [{"type": "lifespan.startup.complete"}]
