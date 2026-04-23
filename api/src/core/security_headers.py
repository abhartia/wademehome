"""Security response headers middleware.

Adds a conservative set of browser security headers to every HTTP response.
Values are intentionally strict-but-safe for an API + Next.js SPA. Tighten the
CSP in ``CONTENT_SECURITY_POLICY`` env when you know the exact third-party
origins in play.
"""

from __future__ import annotations

import os

from starlette.types import ASGIApp, Message, Receive, Scope, Send

# CSP is intentionally opt-in: ship only when ``CONTENT_SECURITY_POLICY`` is
# explicitly set in the environment. A too-strict default can silently break
# third-party scripts (analytics, maps, embeds) in prod before anyone notices.
_DEFAULT_CSP = ""

_DEFAULT_PERMISSIONS_POLICY = (
    "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(self), "
    "cross-origin-isolated=(), display-capture=(), encrypted-media=(), fullscreen=(self), "
    "geolocation=(self), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), "
    "midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), "
    "screen-wake-lock=(), sync-xhr=(), usb=(), xr-spatial-tracking=()"
)


class SecurityHeadersMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app
        self.csp = os.getenv("CONTENT_SECURITY_POLICY", _DEFAULT_CSP)
        self.permissions_policy = os.getenv("PERMISSIONS_POLICY", _DEFAULT_PERMISSIONS_POLICY)
        self.hsts_enabled = os.getenv("HSTS_ENABLED", "1") not in {"0", "false", "no"}

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

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
                if self.csp:
                    add("Content-Security-Policy", self.csp)
                if self.hsts_enabled:
                    add("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_headers)
