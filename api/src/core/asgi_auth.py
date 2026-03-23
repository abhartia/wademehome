"""ASGI-level authentication middleware that works with LlamaIndexServer."""

from typing import Dict
from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.responses import JSONResponse
from core.token import TokenValidator
from core.logger import get_logger
from core.env_utils import env_manager

logger = get_logger(__name__)


class ASGIAuthMiddleware:
    """ASGI middleware for authentication that works at the lowest level."""

    def __init__(self, app: ASGIApp):
        self.app = app
        self.validator = TokenValidator()
        self.exclude_paths = {
            "/docs", "/redoc", "/openapi.json", "/actuator/health", "/health",
            "/", "/favicon.ico", "/api/components", "/api/layout"
        }
        self.exclude_prefixes = {
            "/_next", "/static"
        }
        self.exclude_extensions = {
            ".js", ".css", ".woff", ".woff2", ".png", ".jpg", ".ico", ".svg"
        }

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """ASGI callable that intercepts all requests."""

        # Only process HTTP requests
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        method = scope.get("method", "")

        # Handle custom health endpoint directly
        if path == "/actuator/health" and method == "GET":
            await self._send_health_response(send)
            return

        # Check if this path should be excluded from authentication
        if self._is_excluded_path(path):
            await self.app(scope, receive, send)
            return

        # Handle OPTIONS requests (CORS preflight)
        if method == "OPTIONS":
            await self.app(scope, receive, send)
            return

        # Only protect expensive / workflow routes. /listings/nearby and other browse endpoints are public;
        # prefix "/listing" matched "/listings/*" and broke guest prod when API_TOKENS is set.
        if not path.startswith("/markets") and not path.startswith("/listings/chat"):
            await self.app(scope, receive, send)
            return

        # When API_TOKENS is not set (dev), skip auth so local dev works without a token
        api_tokens = env_manager.get("API_TOKENS") or ""
        if not api_tokens.strip():
            await self.app(scope, receive, send)
            return

        logger.info(f"🔒 Checking auth for: {method} {path}")

        # Extract headers from scope
        headers = dict(scope.get("headers", []))

        # Extract token from various sources
        token = self._extract_token(headers, scope)

        # Validate token
        if not token or not self.validator.validate_token(token):
            logger.warning(f"❌ Auth failed for: {method} {path} (token: {token[:10] if token else 'None'}...)")
            await self._send_auth_error(send)
            return

        logger.info(f"✅ Auth success for: {method} {path}")

        # Token is valid, check for model selection in headers
        model_header = headers.get(b"x-model", b"").decode("utf-8")

        if model_header and path.startswith("/api/chat"):
            logger.info(f"🎯 Model selected via header: {model_header}")

            # Store model in thread-local storage
            import threading
            current_thread = threading.current_thread()
            current_thread.selected_model = model_header
            logger.info(f"✅ Stored model in thread context: {model_header}")

        # Proceed with normal request
        await self.app(scope, receive, send)

    def _is_excluded_path(self, path: str) -> bool:
        """Check if path should be excluded from authentication."""

        # Check exact matches
        if path in self.exclude_paths:
            return True

        # Check prefixes
        if any(path.startswith(prefix) for prefix in self.exclude_prefixes):
            return True

        # Check extensions
        if any(path.endswith(ext) for ext in self.exclude_extensions):
            return True

        return False

    def _extract_token(self, headers: Dict[bytes, bytes], scope: Scope) -> str:
        """Extract token from headers or query string."""


        # 1. Check Authorization header (Bearer token)
        auth_header = headers.get(b"authorization", b"").decode("utf-8")
        if auth_header.startswith("Bearer "):
            return auth_header[7:]

        # 2. Check X-API-Token header
        api_token_header = headers.get(b"x-api-token", b"").decode("utf-8")
        if api_token_header:
            return api_token_header

        # 3. Check query string for api_token parameter
        query_string = scope.get("query_string", b"").decode("utf-8")
        if query_string:
            # Parse query string manually to avoid dependencies
            params = {}
            for param in query_string.split("&"):
                if "=" in param:
                    key, value = param.split("=", 1)
                    params[key] = value

            if "api_token" in params:
                return params["api_token"]

        return None

    async def _send_health_response(self, send: Send) -> None:
        """Send health check response."""
        import datetime

        response = JSONResponse(
            status_code=200,
            content={
                "status": "UP",
                "timestamp": str(datetime.datetime.now())
            }
        )

        await response(
            scope={"type": "http", "method": "GET"},
            receive=None,
            send=send
        )

    async def _send_auth_error(self, send: Send) -> None:
        """Send authentication error response."""
        response = JSONResponse(
            status_code=401,
            content={
                "detail": "Invalid or missing authentication token",
                "error": "unauthorized",
                "required": "Bearer token, X-API-Token header, or api_token query parameter"
            },
            headers={"WWW-Authenticate": "Bearer"}
        )

        await response(
            scope={"type": "http", "method": "POST"},
            receive=None,
            send=send
        )