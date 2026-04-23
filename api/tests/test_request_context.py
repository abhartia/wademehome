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
    captured = {}

    async def app(scope, receive, send):
        captured["rid"] = get_request_id()
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    middleware = RequestContextMiddleware(app)

    async def receive():
        return {"type": "http.request"}

    async def send(_msg):
        pass

    scope = _make_scope(headers=[(REQUEST_ID_HEADER.encode(), b"abc-123")])
    asyncio.run(middleware(scope, receive, send))
    assert captured["rid"] == "abc-123"


def test_user_id_contextvar_is_isolated():
    set_user_id("user-a")
    assert get_user_id() == "user-a"
    set_user_id(None)
    assert get_user_id() is None
