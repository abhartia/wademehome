"""Security response headers middleware.

Adds a conservative set of browser security headers to every HTTP response.
The default Content-Security-Policy is appropriate for a JSON API: nothing is
loaded by default. The interactive docs (``/docs``, ``/redoc``) get a slightly
more permissive policy so the Swagger / ReDoc bundles served from
``cdn.jsdelivr.net`` actually work.

Override either via env (``CONTENT_SECURITY_POLICY``,
``CONTENT_SECURITY_POLICY_DOCS``) when you know the exact third-party origins
in play.
"""

from __future__ import annotations

import os

from starlette.types import ASGIApp, Message, Receive, Scope, Send

# Locked-down default for JSON responses. The API does not serve HTML that
# loads sub-resources, so ``default-src 'none'`` is safe and gives a strong
# signal to browsers (and curious humans inspecting headers).
_DEFAULT_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"

# Paths served by FastAPI's built-in docs UIs. They load JS/CSS from
# cdn.jsdelivr.net and need inline script/style for bootstrap.
_DOCS_PATHS: tuple[str, ...] = ("/docs", "/redoc")
_DEFAULT_DOCS_CSP = (
    "default-src 'self'; "
    "img-src 'self' data: https://fastapi.tiangolo.com; "
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
    "font-src 'self' https://cdn.jsdelivr.net; "
    "connect-src 'self'; "
    "frame-ancestors 'none'; "
    "base-uri 'none'; "
    "form-action 'self'"
)

_DEFAULT_PERMISSIONS_POLICY = (
    "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), "
    "cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), "
    "geolocation=(self), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), "
    "midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), "
    "screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()"
)


def _is_docs_path(path: str) -> bool:
    return any(path == p or path.startswith(p + "/") for p in _DOCS_PATHS)


class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        # Empty string disables CSP entirely; any other falsy value falls back
        # to the strict default. ``CONTENT_SECURITY_POLICY=off`` is the escape
        # hatch when a third-party probe or test really needs no CSP at all.
        raw = os.getenv("CONTENT_SECURITY_POLICY")
        if raw is None:
            self.csp = _DEFAULT_CSP
        elif raw.strip().lower() in {"off", "none", "disabled"}:
            self.csp = ""
        else:
            self.csp = raw
        self.csp_docs = os.getenv("CONTENT_SECURITY_POLICY_DOCS", _DEFAULT_DOCS_CSP)
        self.permissions_policy = os.getenv("PERMISSIONS_POLICY", _DEFAULT_PERMISSIONS_POLICY)
        self.hsts_enabled = os.getenv("HSTS_ENABLED", "1") not in {"0", "false", "no"}

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "") or ""
        csp_for_request = self.csp_docs if _is_docs_path(path) else self.csp

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
                add("Cross-Origin-Resource-Policy", "same-origin")
                add("Permissions-Policy", self.permissions_policy)
                if csp_for_request:
                    add("Content-Security-Policy", csp_for_request)
                if self.hsts_enabled:
                    add("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_headers)
