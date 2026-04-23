"""CORS middleware for controlled cross-origin requests."""

from starlette.responses import Response
from starlette.types import ASGIApp, Receive, Scope, Send

from core.cors_config import cors_config
from core.logger import get_logger

logger = get_logger(__name__)


class CORSMiddleware:
    """CORS middleware that controls allowed origins."""

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """ASGI callable that handles CORS."""

        # Only process HTTP requests
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        method = scope.get("method", "")
        headers = dict(scope.get("headers", []))

        # Get the origin from request headers
        origin_header = headers.get(b"origin", b"").decode("utf-8")

        # Handle CORS preflight requests
        if method == "OPTIONS" and origin_header:
            await self._handle_preflight(scope, receive, send, origin_header)
            return

        # For regular requests, add CORS headers if origin is allowed
        if origin_header:
            await self._handle_request_with_cors(scope, receive, send, origin_header)
        else:
            await self.app(scope, receive, send)

    async def _handle_preflight(self, scope: Scope, receive: Receive, send: Send, origin: str) -> None:
        """Handle CORS preflight requests."""
        cors_origin = cors_config.get_cors_origin(origin)

        if cors_origin:
            logger.info(f"CORS preflight allowed for origin: {origin}")
            headers = {
                "access-control-allow-origin": cors_origin,
                "access-control-allow-credentials": "true",
                "access-control-allow-methods": "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT",
                "access-control-allow-headers": "Authorization, Content-Type, X-API-Token, X-Model",
                "access-control-max-age": "600",
                "vary": "Origin",
            }
            status_code = 200
        else:
            logger.warning(f"CORS preflight rejected for origin: {origin}")
            headers = {
                "vary": "Origin",
            }
            status_code = 403

        response = Response("", status_code=status_code, headers=headers)
        await response(scope, receive, send)

    async def _handle_request_with_cors(self, scope: Scope, receive: Receive, send: Send, origin: str) -> None:
        """Handle regular requests with CORS headers."""
        cors_origin = cors_config.get_cors_origin(origin)

        if cors_origin:
            # Wrap the send function to add CORS headers
            async def send_with_cors(message):
                if message["type"] == "http.response.start":
                    headers = list(message.get("headers", []))

                    # Remove any existing CORS headers to prevent duplicates
                    headers = [
                        (name, value)
                        for name, value in headers
                        if name.lower() not in [b"access-control-allow-origin", b"access-control-allow-credentials"]
                    ]

                    # Add our CORS headers
                    headers.extend(
                        [
                            (b"access-control-allow-origin", cors_origin.encode()),
                            (b"access-control-allow-credentials", b"true"),
                            (b"vary", b"Origin"),
                        ]
                    )

                    message = {**message, "headers": headers}

                await send(message)

            logger.debug(f"Adding CORS headers for allowed origin: {origin}")
            await self.app(scope, receive, send_with_cors)
        else:
            logger.warning(f"Request from disallowed origin: {origin}")
            # Still process the request but without CORS headers
            await self.app(scope, receive, send)
