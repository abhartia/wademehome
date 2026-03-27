from core.logger import get_logger
from core.env_utils import env_manager


logger = get_logger(__name__)

class Config:
    """Central configuration class for Ask-Markerr.

    This class manages application-wide configuration, loading values from environment
    variables and providing validation and reload mechanisms.
    """

    # Database
    DATABASE_URL: str = env_manager.get("DATABASE_URL", "")

    # OpenAI (used when Azure OpenAI is not configured)
    OPENAI_API_KEY: str = env_manager.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = env_manager.get("OPENAI_MODEL", "gpt-4.1")
    OPENAI_SEARCH_PLANNER_MODEL: str = env_manager.get("OPENAI_SEARCH_PLANNER_MODEL", "gpt-4o-mini")

    # Azure OpenAI (if AZURE_OPENAI_ENDPOINT is set, this is used instead of OpenAI)
    AZURE_OPENAI_ENDPOINT: str = env_manager.get("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_KEY: str = env_manager.get("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_DEPLOYMENT: str = env_manager.get("AZURE_OPENAI_DEPLOYMENT", "")
    AZURE_OPENAI_MODEL: str = env_manager.get("AZURE_OPENAI_MODEL", "gpt-4o-mini")
    AZURE_OPENAI_API_VERSION: str = env_manager.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: str = env_manager.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "")
    AZURE_OPENAI_SEARCH_PLANNER_DEPLOYMENT: str = env_manager.get(
        "AZURE_OPENAI_SEARCH_PLANNER_DEPLOYMENT",
        "",
    )
    AZURE_OPENAI_SEARCH_PLANNER_MODEL: str = env_manager.get(
        "AZURE_OPENAI_SEARCH_PLANNER_MODEL",
        "gpt-4o-mini",
    )

    # Text-to-SQL LLM cache (process-local; reuse SQL across users when prompts match)
    LLM_TEXT2SQL_CACHE_ENABLED: str = env_manager.get("LLM_TEXT2SQL_CACHE_ENABLED", "false") or "false"
    LLM_TEXT2SQL_CACHE_MAX_ENTRIES: str = env_manager.get("LLM_TEXT2SQL_CACHE_MAX_ENTRIES", "256") or "256"
    LLM_TEXT2SQL_CACHE_TTL_SECONDS: str = (
        env_manager.get("LLM_TEXT2SQL_CACHE_TTL_SECONDS", "3600") or "3600"
    )

    # Application settings
    LOG_LEVEL: str = env_manager.get("LOG_LEVEL", "INFO") or "INFO"
    LISTINGS_TABLE_NAME: str = env_manager.get("LISTINGS_TABLE_NAME", None)
    LISTINGS_TABLE_SCHEMA: str = env_manager.get("LISTINGS_TABLE_SCHEMA", None)
    OPENAI_EMBEDDING_MODEL: str = env_manager.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small") or "text-embedding-3-small"
    OPENAI_EMBEDDING_DIMENSIONS: str = env_manager.get("OPENAI_EMBEDDING_DIMENSIONS", "1536") or "1536"
    LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT: str = (
        env_manager.get("LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT", "false") or "false"
    )

    # Mapbox (server-side geocoding, matrix, POI search). Optional; endpoints return 503 if unset.
    MAPBOX_ACCESS_TOKEN: str = env_manager.get("MAPBOX_ACCESS_TOKEN", "")

    # Resend (magic link + verification email). Read from env / Azure App Settings.
    RESEND_API_KEY: str = env_manager.get("RESEND_API_KEY", "") or ""
    RESEND_FROM_EMAIL: str = env_manager.get("RESEND_FROM_EMAIL", "") or ""
    TOUR_REQUEST_OPS_EMAIL: str = env_manager.get("TOUR_REQUEST_OPS_EMAIL", "") or ""

    # Auth (cookies, session TTL, magic links). Must use env_manager so production env is honored.
    AUTH_UI_BASE_URL: str = env_manager.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
    AUTH_COOKIE_NAME: str = env_manager.get("AUTH_COOKIE_NAME", "wmh_session") or "wmh_session"
    AUTH_COOKIE_SECURE: str = env_manager.get("AUTH_COOKIE_SECURE", "false") or "false"
    AUTH_COOKIE_SAMESITE: str = env_manager.get("AUTH_COOKIE_SAMESITE", "lax") or "lax"
    AUTH_COOKIE_DOMAIN: str = env_manager.get("AUTH_COOKIE_DOMAIN", "") or ""
    AUTH_SESSION_DAYS: str = env_manager.get("AUTH_SESSION_DAYS", "14") or "14"
    AUTH_MAGIC_LINK_MINUTES: str = env_manager.get("AUTH_MAGIC_LINK_MINUTES", "15") or "15"
    AUTH_VERIFY_EMAIL_HOURS: str = env_manager.get("AUTH_VERIFY_EMAIL_HOURS", "48") or "48"

    @classmethod
    def _refresh_values(cls) -> None:
        """Re-sync class attributes after .env reload (see env_manager.auto_reload)."""
        cls.DATABASE_URL = env_manager.get("DATABASE_URL", "") or ""
        cls.OPENAI_API_KEY = env_manager.get("OPENAI_API_KEY", "") or ""
        cls.OPENAI_MODEL = env_manager.get("OPENAI_MODEL", "gpt-4.1") or "gpt-4.1"
        cls.OPENAI_SEARCH_PLANNER_MODEL = (
            env_manager.get("OPENAI_SEARCH_PLANNER_MODEL", "gpt-4o-mini") or "gpt-4o-mini"
        )
        cls.AZURE_OPENAI_ENDPOINT = env_manager.get("AZURE_OPENAI_ENDPOINT", "") or ""
        cls.AZURE_OPENAI_API_KEY = env_manager.get("AZURE_OPENAI_API_KEY", "") or ""
        cls.AZURE_OPENAI_DEPLOYMENT = env_manager.get("AZURE_OPENAI_DEPLOYMENT", "") or ""
        cls.AZURE_OPENAI_MODEL = env_manager.get("AZURE_OPENAI_MODEL", "gpt-4o-mini") or "gpt-4o-mini"
        cls.AZURE_OPENAI_API_VERSION = (
            env_manager.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview") or "2024-12-01-preview"
        )
        cls.AZURE_OPENAI_EMBEDDING_DEPLOYMENT = (
            env_manager.get("AZURE_OPENAI_EMBEDDING_DEPLOYMENT", "") or ""
        )
        cls.AZURE_OPENAI_SEARCH_PLANNER_DEPLOYMENT = (
            env_manager.get("AZURE_OPENAI_SEARCH_PLANNER_DEPLOYMENT", "") or ""
        )
        cls.AZURE_OPENAI_SEARCH_PLANNER_MODEL = (
            env_manager.get("AZURE_OPENAI_SEARCH_PLANNER_MODEL", "gpt-4o-mini") or "gpt-4o-mini"
        )
        cls.LLM_TEXT2SQL_CACHE_ENABLED = (
            env_manager.get("LLM_TEXT2SQL_CACHE_ENABLED", "false") or "false"
        )
        cls.LLM_TEXT2SQL_CACHE_MAX_ENTRIES = (
            env_manager.get("LLM_TEXT2SQL_CACHE_MAX_ENTRIES", "256") or "256"
        )
        cls.LLM_TEXT2SQL_CACHE_TTL_SECONDS = (
            env_manager.get("LLM_TEXT2SQL_CACHE_TTL_SECONDS", "3600") or "3600"
        )
        cls.LOG_LEVEL = env_manager.get("LOG_LEVEL", "INFO") or "INFO"
        cls.LISTINGS_TABLE_NAME = env_manager.get("LISTINGS_TABLE_NAME", None)
        cls.LISTINGS_TABLE_SCHEMA = env_manager.get("LISTINGS_TABLE_SCHEMA", None)
        cls.OPENAI_EMBEDDING_MODEL = (
            env_manager.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small") or "text-embedding-3-small"
        )
        cls.OPENAI_EMBEDDING_DIMENSIONS = (
            env_manager.get("OPENAI_EMBEDDING_DIMENSIONS", "1536") or "1536"
        )
        cls.LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT = (
            env_manager.get("LISTINGS_NEARBY_INCLUDE_TOTAL_COUNT", "false") or "false"
        )
        cls.MAPBOX_ACCESS_TOKEN = env_manager.get("MAPBOX_ACCESS_TOKEN", "") or ""
        cls.RESEND_API_KEY = env_manager.get("RESEND_API_KEY", "") or ""
        cls.RESEND_FROM_EMAIL = env_manager.get("RESEND_FROM_EMAIL", "") or ""
        cls.TOUR_REQUEST_OPS_EMAIL = env_manager.get("TOUR_REQUEST_OPS_EMAIL", "") or ""
        cls.AUTH_UI_BASE_URL = (
            env_manager.get("AUTH_UI_BASE_URL", "http://localhost:3000") or "http://localhost:3000"
        )
        cls.AUTH_COOKIE_NAME = env_manager.get("AUTH_COOKIE_NAME", "wmh_session") or "wmh_session"
        cls.AUTH_COOKIE_SECURE = env_manager.get("AUTH_COOKIE_SECURE", "false") or "false"
        cls.AUTH_COOKIE_SAMESITE = env_manager.get("AUTH_COOKIE_SAMESITE", "lax") or "lax"
        cls.AUTH_COOKIE_DOMAIN = env_manager.get("AUTH_COOKIE_DOMAIN", "") or ""
        cls.AUTH_SESSION_DAYS = env_manager.get("AUTH_SESSION_DAYS", "14") or "14"
        cls.AUTH_MAGIC_LINK_MINUTES = env_manager.get("AUTH_MAGIC_LINK_MINUTES", "15") or "15"
        cls.AUTH_VERIFY_EMAIL_HOURS = env_manager.get("AUTH_VERIFY_EMAIL_HOURS", "48") or "48"

    @classmethod
    def get(cls, key: str, default: str | None = None) -> str | None:
        """Get any configuration value with automatic reload.

        Args:
            key: The configuration attribute name (e.g., 'DATABASE_URL')
            default: Default value if attribute doesn't exist

        Returns:
            The configuration value or default

        Example:
            model = Config.get('OPENAI_MODEL', 'gpt-4')

        """
        # Auto-reload if .env file changed
        if env_manager.auto_reload():
            cls._refresh_values()
            cls._validated = False
            logger.info("Environment reloaded due to .env file change")

        return getattr(cls, key, default)

