"""Request-scoped context for logs, tracing, and error tagging.

Exposes `request_id` and `user_id` via :class:`contextvars.ContextVar` so any
module can read them without threading plumbing through call sites. Bound by
:class:`RequestContextMiddleware` early in the ASGI stack.
"""

from __future__ import annotations

import uuid
from contextvars import ContextVar
from typing import Optional

from starlette.types import ASGIApp, Message, Receive, Scope, Send

_REQUEST_ID: ContextVar[Optional[str]] = ContextVar("request_id", default=None)
_USER_ID: ContextVar[Optional[str]] = ContextVar("user_id", default=None)

REQUEST_ID_HEADER = "x-request-id"


def get_request_id() -> Optional[str]:
    return _REQUEST_ID.get()


def get_user_id() -> Optional[str]:
    return _USER_ID.get()


def set_user_id(user_id: Optional[str]) -> None:
    """Bind user_id for the current async task (called by auth layer)."""
    _USER_ID.set(user_id)


class RequestContextMiddleware:
    """Generate/propagate a request ID and echo it on the response.

    Runs as the outermost ASGI layer so every downstream handler sees it.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = dict(scope.get("headers", []))
        incoming = headers.get(REQUEST_ID_HEADER.encode(), b"").decode("utf-8").strip()
        request_id = incoming or uuid.uuid4().hex

        rid_token = _REQUEST_ID.set(request_id)
        uid_token = _USER_ID.set(None)

        async def send_with_request_id(message: Message) -> None:
            if message["type"] == "http.response.start":
                response_headers = list(message.get("headers", []))
                response_headers = [
                    (k, v) for k, v in response_headers if k.lower() != REQUEST_ID_HEADER.encode()
                ]
                response_headers.append((REQUEST_ID_HEADER.encode(), request_id.encode()))
                message = {**message, "headers": response_headers}
            await send(message)

        try:
            await self.app(scope, receive, send_with_request_id)
        finally:
            _REQUEST_ID.reset(rid_token)
            _USER_ID.reset(uid_token)
