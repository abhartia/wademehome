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

    # Azure OpenAI (if AZURE_OPENAI_ENDPOINT is set, this is used instead of OpenAI)
    AZURE_OPENAI_ENDPOINT: str = env_manager.get("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_API_KEY: str = env_manager.get("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_DEPLOYMENT: str = env_manager.get("AZURE_OPENAI_DEPLOYMENT", "")
    AZURE_OPENAI_MODEL: str = env_manager.get("AZURE_OPENAI_MODEL", "gpt-4o-mini")
    AZURE_OPENAI_API_VERSION: str = env_manager.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")

    # Application settings
    LOG_LEVEL: str = env_manager.get("LOG_LEVEL", "INFO") or "INFO"
    LISTINGS_TABLE_NAME: str = env_manager.get("LISTINGS_TABLE_NAME", None)
    LISTINGS_TABLE_SCHEMA: str = env_manager.get("LISTINGS_TABLE_SCHEMA", None)

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

