"""Security response headers middleware.

Adds a conservative set of browser security headers to every HTTP response.
Values are intentionally strict-but-safe for an API + Next.js SPA. Tighten the
CSP in ``CONTENT_SECURITY_POLICY`` env when you know the exact third-party
origins in play.
"""

from __future__ import annotations

import os

from starlette.types import ASGIApp, Message, Receive, Scope, Send

# Strict default CSP for a JSON API. ``default-src 'none'`` blocks every
# resource type by fetch — JSON responses load nothing, so this is correct.
# ``frame-ancestors 'none'`` is the modern equivalent of ``X-Frame-Options:
# DENY`` (and overrides it where both are set). ``base-uri`` and
# ``form-action`` close two niche XSS vectors that show up if any HTML ever
# leaks through (custom error pages, debug screens, accidental redirects).
# Override via ``CONTENT_SECURITY_POLICY`` env when integrating embeds.
_DEFAULT_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"

# FastAPI's interactive docs (``/docs`` Swagger UI, ``/redoc`` ReDoc) load
# their bundles from ``cdn.jsdelivr.net`` and the ``fastapi.tiangolo.com``
# favicon. The strict default would block both. These paths get a relaxed
# CSP instead — they are dev/operator surfaces, never user data paths.
_DOCS_PATHS: frozenset[str] = frozenset({"/docs", "/docs/oauth2-redirect", "/redoc"})
_DOCS_CSP = (
    "default-src 'none'; "
    "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
    "style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
    "img-src 'self' data: https://fastapi.tiangolo.com; "
    "font-src 'self' https://cdn.jsdelivr.net; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
)

_DEFAULT_PERMISSIONS_POLICY = (
    "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), "
    "cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), "
    "geolocation=(self), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), "
    "midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), "
    "screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()"
)


def _is_docs_path(path: str) -> bool:
    # ``/v1`` mirror in main.py duplicates the API surface; FastAPI also mounts
    # ``/docs`` under any included sub-app. Cover both shapes.
    if path in _DOCS_PATHS:
        return True
    return any(path.startswith(prefix) for prefix in ("/docs/", "/redoc/"))


class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        # Empty string in env explicitly disables CSP (useful for debugging a
        # broken third-party integration); unset falls back to the default.
        env_csp = os.environ.get("CONTENT_SECURITY_POLICY")
        self.csp = _DEFAULT_CSP if env_csp is None else env_csp
        self.permissions_policy = os.getenv("PERMISSIONS_POLICY", _DEFAULT_PERMISSIONS_POLICY)
        self.hsts_enabled = os.getenv("HSTS_ENABLED", "1") not in {"0", "false", "no"}

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "") or ""
        csp_for_request = _DOCS_CSP if _is_docs_path(path) else self.csp

        async def send_with_headers(message: Message) -> None:
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                existing = {k.lower() for k, _ in headers}

                def add(name: str, value: str) -> None:
                    if name.encode().lower() in existing:
                        return
                    headers.append((name.encode(), value.encode()))

                add("X-Content-Type-Options", "nosniff")
                add("X-Frame-Options", "DENY")
                add("Referrer-Policy", "strict-origin-when-cross-origin")
                add("Cross-Origin-Opener-Policy", "same-origin")
                add("Permissions-Policy", self.permissions_policy)
                if csp_for_request:
                    add("Content-Security-Policy", csp_for_request)
                if self.hsts_enabled:
                    add("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_headers)
