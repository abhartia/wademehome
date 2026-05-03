"""Request-scoped context for logs, tracing, and error tagging.

Exposes `request_id` and `user_id` via :class:`contextvars.ContextVar` so any
module can read them without threading plumbing through call sites. Bound by
:class:`RequestContextMiddleware` early in the ASGI stack.
"""

from __future__ import annotations

import re
import uuid
from contextvars import ContextVar

from starlette.types import ASGIApp, Message, Receive, Scope, Send

_REQUEST_ID: ContextVar[str | None] = ContextVar("request_id", default=None)
_USER_ID: ContextVar[str | None] = ContextVar("user_id", default=None)

REQUEST_ID_HEADER = "x-request-id"

# Accept upstream-supplied IDs only when they look like an opaque token: a
# conservative charset that covers UUIDs (with or without dashes), W3C
# `traceparent`-style hex, ULIDs, and the short alphanumerics most LBs emit.
# Anything else (control chars, whitespace, oversized blobs, header-splitting
# payloads) gets discarded and we mint our own UUID. Bounding the length also
# caps how much per-request bookkeeping a hostile client can force into logs.
_REQUEST_ID_MIN_LEN = 8
_REQUEST_ID_MAX_LEN = 128
_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9._-]+$")


def get_request_id() -> str | None:
    return _REQUEST_ID.get()


def get_user_id() -> str | None:
    return _USER_ID.get()


def set_user_id(user_id: str | None) -> None:
    """Bind user_id for the current async task (called by auth layer)."""
    _USER_ID.set(user_id)


def _sanitize_incoming_request_id(raw: str) -> str | None:
    """Return ``raw`` if it's a safe-looking opaque ID, else None.

    Validates length and charset; rejects anything that could break log
    parsing, response-header serialization, or correlation across systems.
    """
    if not raw:
        return None
    if len(raw) < _REQUEST_ID_MIN_LEN or len(raw) > _REQUEST_ID_MAX_LEN:
        return None
    if not _REQUEST_ID_PATTERN.fullmatch(raw):
        return None
    return raw


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
        raw_incoming = headers.get(REQUEST_ID_HEADER.encode(), b"")
        try:
            incoming = raw_incoming.decode("ascii").strip()
        except UnicodeDecodeError:
            incoming = ""
        request_id = _sanitize_incoming_request_id(incoming) or uuid.uuid4().hex

        rid_token = _REQUEST_ID.set(request_id)
        uid_token = _USER_ID.set(None)

        async def send_with_request_id(message: Message) -> None:
            if message["type"] == "http.response.start":
                response_headers = list(message.get("headers", []))
                response_headers = [(k, v) for k, v in response_headers if k.lower() != REQUEST_ID_HEADER.encode()]
                response_headers.append((REQUEST_ID_HEADER.encode(), request_id.encode()))
                message = {**message, "headers": response_headers}
            await send(message)

        try:
            await self.app(scope, receive, send_with_request_id)
        finally:
            _REQUEST_ID.reset(rid_token)
            _USER_ID.reset(uid_token)
