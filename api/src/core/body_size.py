"""Request body size cap — 413s oversized requests before they hit a handler."""

from __future__ import annotations

import os

from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send

# 25 MiB by default — large enough for photo uploads (listing / move-in) and
# agent chat bodies. Tune down per-deploy via ``MAX_REQUEST_BYTES`` if needed.
DEFAULT_MAX_BYTES = 25 * 1024 * 1024


class MaxBodySizeMiddleware:
    def __init__(self, app: ASGIApp, max_bytes: int | None = None) -> None:
        self.app = app
        self.max_bytes = max_bytes or int(os.getenv("MAX_REQUEST_BYTES", str(DEFAULT_MAX_BYTES)))

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = dict(scope.get("headers", []))
        content_length = headers.get(b"content-length")
        if content_length:
            try:
                if int(content_length.decode()) > self.max_bytes:
                    msg = f"Request body exceeds {self.max_bytes} bytes"
                    response = JSONResponse(
                        status_code=413,
                        content={
                            "error": {"code": "payload_too_large", "message": msg},
                            "detail": msg,
                        },
                    )
                    await response(scope, receive, send)
                    return
            except (ValueError, UnicodeDecodeError):
                pass

        received = 0
        max_bytes = self.max_bytes
        too_large = False

        async def counting_receive() -> Message:
            nonlocal received, too_large
            message = await receive()
            if message["type"] == "http.request":
                body = message.get("body", b"") or b""
                received += len(body)
                if received > max_bytes:
                    too_large = True
            return message

        # If we overshoot during streaming, close the connection with a 413 — can't
        # easily rewind, so signal the error and stop.
        async def guarded_send(message: Message) -> None:
            if too_large and message["type"] == "http.response.start":
                msg = f"Request body exceeds {max_bytes} bytes"
                response = JSONResponse(
                    status_code=413,
                    content={
                        "error": {"code": "payload_too_large", "message": msg},
                        "detail": msg,
                    },
                )
                await response(scope, receive, send)
                return
            await send(message)

        await self.app(scope, counting_receive, guarded_send)
