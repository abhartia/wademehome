"""Uniform JSON error envelope + FastAPI exception handlers.

Every error response looks like::

    {"error": {"code": "snake_case_code", "message": "...", "request_id": "hex"}}

This gives clients a machine-readable error code to switch on without parsing
human strings, and a request_id they can paste into a bug report so you can
find the matching log line.
"""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse

from core.request_context import get_request_id


def _envelope(code: str, message: str, *, status: int, extra: dict[str, Any] | None = None) -> JSONResponse:
    # Top-level ``detail`` is kept for backward compatibility with existing
    # clients that parse FastAPI's default ``{"detail": "..."}`` shape. The
    # new shape lives under ``error`` — new code should prefer that.
    payload: dict[str, Any] = {
        "error": {
            "code": code,
            "message": message,
            "request_id": get_request_id(),
        },
        "detail": message,
    }
    if extra:
        payload["error"].update(extra)
    return JSONResponse(status_code=status, content=payload)


def _code_for_status(status: int) -> str:
    return {
        400: "bad_request",
        401: "unauthorized",
        403: "forbidden",
        404: "not_found",
        405: "method_not_allowed",
        409: "conflict",
        413: "payload_too_large",
        415: "unsupported_media_type",
        422: "validation_error",
        429: "rate_limited",
        500: "internal_error",
        502: "upstream_error",
        503: "service_unavailable",
        504: "upstream_timeout",
    }.get(status, "error")


async def http_exception_handler(_req: Request, exc: HTTPException) -> JSONResponse:
    code = _code_for_status(exc.status_code)
    message = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    return _envelope(code, message, status=exc.status_code)


async def validation_exception_handler(_req: Request, exc: RequestValidationError) -> JSONResponse:
    # FastAPI's default validation response is ``{"detail": [...]}``; mirror
    # that under the top-level ``detail`` key so existing clients keep working.
    errors = exc.errors()
    payload: dict[str, Any] = {
        "error": {
            "code": "validation_error",
            "message": "Request failed validation.",
            "request_id": get_request_id(),
            "details": errors,
        },
        "detail": errors,
    }
    return JSONResponse(status_code=422, content=payload)


async def unhandled_exception_handler(_req: Request, _exc: Exception) -> JSONResponse:
    # The body is deliberately generic — stack traces are in the logs, not the wire.
    return _envelope(
        "internal_error",
        "An unexpected error occurred. Please retry or contact support with the request_id.",
        status=500,
    )


def install_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
