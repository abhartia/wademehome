import asyncio

from core.request_context import (
    REQUEST_ID_HEADER,
    RequestContextMiddleware,
    get_request_id,
    get_user_id,
    set_user_id,
)


def _make_scope(headers=None):
    return {
        "type": "http",
        "method": "GET",
        "path": "/",
        "headers": headers or [],
    }


def _run_with_incoming(value: bytes):
    captured: dict[str, str | None] = {}
    sent: list[dict] = []

    async def app(scope, receive, send):
        captured["rid"] = get_request_id()
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    middleware = RequestContextMiddleware(app)

    async def receive():
        return {"type": "http.request"}

    async def send(msg):
        sent.append(msg)

    scope = _make_scope(headers=[(REQUEST_ID_HEADER.encode(), value)])
    asyncio.run(middleware(scope, receive, send))
    start = next(m for m in sent if m["type"] == "http.response.start")
    echoed = dict(start["headers"]).get(REQUEST_ID_HEADER.encode())
    return captured["rid"], (echoed.decode() if echoed else None)


def test_generates_request_id_when_missing():
    captured = {}

    async def app(scope, receive, send):
        captured["rid"] = get_request_id()
        await send(
            {
                "type": "http.response.start",
                "status": 200,
                "headers": [],
            }
        )
        await send({"type": "http.response.body", "body": b""})

    middleware = RequestContextMiddleware(app)
    sent = []

    async def receive():
        return {"type": "http.request"}

    async def send(msg):
        sent.append(msg)

    asyncio.run(middleware(_make_scope(), receive, send))

    assert captured["rid"] is not None
    assert len(captured["rid"]) >= 16
    start = next(m for m in sent if m["type"] == "http.response.start")
    echoed = dict(start["headers"]).get(REQUEST_ID_HEADER.encode())
    assert echoed is not None
    assert echoed.decode() == captured["rid"]


def test_propagates_incoming_request_id():
    rid, echoed = _run_with_incoming(b"5f3a8c2e1d4b6789a0c1e2f3b4d5a6c7")
    assert rid == "5f3a8c2e1d4b6789a0c1e2f3b4d5a6c7"
    assert echoed == rid


def test_propagates_uuid_with_dashes():
    rid, echoed = _run_with_incoming(b"550e8400-e29b-41d4-a716-446655440000")
    assert rid == "550e8400-e29b-41d4-a716-446655440000"
    assert echoed == rid


def test_rejects_too_short_incoming_id():
    # 7 chars — below the 8-char floor; we mint a fresh UUID instead.
    rid, echoed = _run_with_incoming(b"abc-123")
    assert rid != "abc-123"
    assert rid is not None and len(rid) == 32  # uuid4().hex
    assert echoed == rid


def test_rejects_too_long_incoming_id():
    rid, _ = _run_with_incoming(b"a" * 256)
    assert rid is not None
    assert len(rid) == 32  # uuid4().hex


def test_rejects_control_chars_in_incoming_id():
    # Newline would break log parsing and could split response headers.
    rid, echoed = _run_with_incoming(b"abc-123\r\nX-Injected: 1")
    assert rid is not None
    assert "\n" not in rid and "\r" not in rid
    assert len(rid) == 32  # uuid4().hex
    assert echoed == rid


def test_rejects_disallowed_charset():
    # Spaces, slashes, equals — reject and regenerate.
    for value in (b"abc 123def", b"abc/123/def", b"x=1;y=2;z=3;a=4"):
        rid, _ = _run_with_incoming(value)
        assert rid is not None
        assert len(rid) == 32, f"unexpected rid for {value!r}: {rid!r}"


def test_user_id_contextvar_is_isolated():
    set_user_id("user-a")
    assert get_user_id() == "user-a"
    set_user_id(None)
    assert get_user_id() is None
