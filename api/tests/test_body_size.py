import asyncio

from core.body_size import MaxBodySizeMiddleware


def _scope_with_length(n: int):
    return {
        "type": "http",
        "method": "POST",
        "path": "/x",
        "headers": [(b"content-length", str(n).encode())],
    }


def test_rejects_oversized_by_content_length():
    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b"ok"})

    mw = MaxBodySizeMiddleware(inner, max_bytes=100)
    sent = []

    async def receive():
        return {"type": "http.request", "body": b"x" * 200}

    async def send(msg):
        sent.append(msg)

    asyncio.run(mw(_scope_with_length(200), receive, send))
    start = next(m for m in sent if m["type"] == "http.response.start")
    assert start["status"] == 413


def test_allows_underlimit():
    async def inner(_scope, _receive, send):
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b"ok"})

    mw = MaxBodySizeMiddleware(inner, max_bytes=1024)
    sent = []

    async def receive():
        return {"type": "http.request", "body": b"x" * 10}

    async def send(msg):
        sent.append(msg)

    asyncio.run(mw(_scope_with_length(10), receive, send))
    start = next(m for m in sent if m["type"] == "http.response.start")
    assert start["status"] == 200
