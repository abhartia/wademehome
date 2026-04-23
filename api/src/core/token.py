"""Authentication middleware for API token validation."""

import secrets

from fastapi import HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from core.env_utils import env_manager
from core.logger import get_logger

logger = get_logger(__name__)


class TokenValidator:
    """Validates API tokens against configured values."""

    def __init__(self):
        self._load_tokens()

    def _load_tokens(self):
        """Load valid tokens from environment variables."""
        # Support multiple tokens separated by comma
        tokens_str = env_manager.get("API_TOKENS", "")
        if tokens_str:
            self.valid_tokens = {token.strip() for token in tokens_str.split(",") if token.strip()}
        else:
            # Generate a default token if none specified (for development)
            default_token = env_manager.get("DEFAULT_API_TOKEN", "")
            if not default_token:
                default_token = secrets.token_urlsafe(32)
                logger.warning(f"No API_TOKENS configured. Generated default token: {default_token}")
                logger.warning("Please set API_TOKENS in your .env file for production use")
            self.valid_tokens = {default_token}

    def validate_token(self, token: str) -> bool:
        """Check if the provided token is valid.

        Args:
            token: The API token to validate

        Returns:
            True if token is valid, False otherwise
        """
        return token in self.valid_tokens

    def reload_tokens(self):
        """Reload tokens from environment (useful for runtime updates)."""
        self._load_tokens()


class TokenAuthMiddleware(BaseHTTPMiddleware):
    """Middleware to validate API tokens on all requests."""

    def __init__(self, app, exclude_paths: list | None = None):
        super().__init__(app)
        self.validator = TokenValidator()
        # Paths that don't require authentication
        self.exclude_paths = exclude_paths or [
            "/docs",
            "/redoc",
            "/openapi.json",
            "/actuator/health",
            "/",  # UI root
            "/favicon.ico",
            "/_next",  # Next.js assets
            "/static",  # Static files
        ]

    async def dispatch(self, request: Request, call_next):
        """Process each request and validate tokens."""
        # Check if path should be excluded from auth
        path = request.url.path

        # Allow excluded paths
        for exclude_path in self.exclude_paths:
            if path.startswith(exclude_path):
                return await call_next(request)

        # Extract token from header
        token = self._extract_token(request)

        if not token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing authentication token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Validate token
        if not self.validator.validate_token(token):
            logger.warning(f"Invalid token attempt from {request.client.host}")
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid authentication token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Token is valid, proceed with request
        response = await call_next(request)
        return response

    def _extract_token(self, request: Request) -> str | None:
        """Extract token from Authorization header or query parameter.

        Args:
            request: The incoming request

        Returns:
            The token string if found, None otherwise
        """
        # First check Authorization header (Bearer token)
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            return auth_header[7:]  # Remove "Bearer " prefix

        # Fallback to query parameter (useful for testing)
        # Example: /api/chat?api_token=your_token_here
        token = request.query_params.get("api_token")
        if token:
            return token

        # Check X-API-Token header (alternative header)
        token = request.headers.get("X-API-Token")
        if token:
            return token

        return None


class BearerTokenAuth(HTTPBearer):
    """FastAPI dependency for token validation (alternative approach)."""

    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)
        self.validator = TokenValidator()

    async def __call__(self, request: Request) -> str | None:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not self.validator.validate_token(credentials.credentials):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return credentials.credentials
        return None
