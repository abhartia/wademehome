"""Per-user / per-IP rate limiting via slowapi.

Configured as a module-level singleton so routers can decorate endpoints with
``@limiter.limit("5/minute")``. Keyed by :func:`request_identity`, which prefers
the authenticated ``user_id`` from request context and falls back to the
client IP.

Backends:
- In-memory (default): fine for single-instance deploys and dev.
- Redis: set ``RATE_LIMIT_REDIS_URL`` to share counters across replicas.
"""

from __future__ import annotations

import os

from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.requests import Request
from starlette.responses import JSONResponse

from core.request_context import get_user_id


def request_identity(request: Request) -> str:
    """Return ``user:<id>`` when authenticated, otherwise the remote IP."""
    uid = get_user_id()
    if uid:
        return f"user:{uid}"
    return f"ip:{get_remote_address(request)}"


def _storage_uri() -> str | None:
    redis = os.getenv("RATE_LIMIT_REDIS_URL", "").strip()
    return redis or None


limiter = Limiter(
    key_func=request_identity,
    default_limits=[os.getenv("RATE_LIMIT_DEFAULT", "120/minute")],
    storage_uri=_storage_uri(),
    headers_enabled=True,
)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Uniform 429 response. Pairs with the error envelope from :mod:`core.errors`."""
    from core.request_context import get_request_id

    retry_after = getattr(exc, "retry_after", None)
    headers = {"Retry-After": str(retry_after)} if retry_after else {}
    message = "Too many requests — slow down and try again."
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": "rate_limited",
                "message": message,
                "request_id": get_request_id(),
            },
            "detail": message,
        },
        headers=headers,
    )
