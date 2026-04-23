"""CORS configuration management."""

import re

from core.env_utils import env_manager
from core.logger import get_logger

logger = get_logger(__name__)


class CORSConfig:
    """Manages CORS allowed origins configuration."""

    def __init__(self):
        self.allowed_origins = self._load_allowed_origins()
        self.allowed_patterns = self._compile_patterns()
        logger.info(f"CORS configured with origins: {self.allowed_origins}")

    def _load_allowed_origins(self) -> set[str]:
        """Load allowed origins from environment variables."""
        # Default allowed origins. Localhost wildcards cover dev tools that
        # bind to ephemeral ports (Claude Code preview tunnel, Playwright,
        # Storybook, etc.) — pattern matcher converts `*` → `[^./]+` so the
        # port digits match cleanly.
        default_origins = [
            "http://localhost:*",
            "http://127.0.0.1:*",
            "*.markerr.com",
        ]

        # Get from environment variable
        cors_origins_env = env_manager.get("CORS_ALLOWED_ORIGINS", "")

        if cors_origins_env:
            # Parse comma-separated origins from environment
            env_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
            logger.info(f"Using CORS origins from environment: {env_origins}")
            return set(env_origins)
        else:
            logger.info(f"Using default CORS origins: {default_origins}")
            return set(default_origins)

    def _compile_patterns(self) -> list[re.Pattern]:
        """Compile wildcard patterns to regex."""
        patterns = []
        for origin in self.allowed_origins:
            if "*" in origin:
                # Convert wildcard pattern to regex
                # *.markerr.com -> ^https?://[^.]+\.markerr\.com$
                pattern = origin.replace("*", r"[^./]+")
                pattern = pattern.replace(".", r"\.")
                # Allow both http and https if no protocol specified
                if not pattern.startswith(("http://", "https://")):
                    pattern = rf"^https?://{pattern}$"
                else:
                    pattern = f"^{pattern}$"
                patterns.append(re.compile(pattern))
                logger.info(f"Compiled pattern: {origin} -> {pattern}")
        return patterns

    def is_origin_allowed(self, origin: str) -> bool:
        """Check if an origin is allowed."""
        if not origin:
            return False

        # Check exact matches first
        if origin in self.allowed_origins:
            return True

        # Check wildcard patterns
        for pattern in self.allowed_patterns:
            if pattern.match(origin):
                logger.info(f"Origin {origin} matches pattern {pattern.pattern}")
                return True

        logger.warning(f"Origin {origin} not allowed")
        return False

    def get_cors_origin(self, request_origin: str) -> str:
        """Get the CORS origin header value for the response."""
        if self.is_origin_allowed(request_origin):
            return request_origin
        return ""


# Global instance
cors_config = CORSConfig()
