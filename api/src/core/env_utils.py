"""Utility functions for handling environment variables with proper reloading."""

import os
from pathlib import Path

from dotenv import load_dotenv

from core.logger import get_logger

logger = get_logger(__name__)


class EnvManager:
    """Manages environment variables with support for reloading from a .env file."""

    def __init__(self, env_file: str = ".env"):
        """Initialize an EnvManager instance.

        Parameters
        ----------
        env_file : str
            Path to the .env file to load environment variables from.
            Defaults to ".env".

        Example:
            manager = EnvManager()

        """
        self.env_file = Path(env_file)
        self.last_modified: float | None = None
        self.reload()

    def reload(self, force: bool = True) -> None:
        """Reload environment variables from the .env file.

        Parameters
        ----------
        force : bool
            If True, override existing environment variables. Defaults to True.

        Example:
            manager = EnvManager()
            manager.reload()

        """
        if self.env_file.exists():
            self.last_modified = self.env_file.stat().st_mtime
            load_dotenv(self.env_file, override=force)
            logger.info(f"✅ Loaded environment from {self.env_file}")
        else:
            logger.warning(f"⚠️  Environment file {self.env_file} not found")

    def auto_reload(self) -> bool:
        """Check if the .env file has changed and reload if it has.

        Returns:
            True if the environment was reloaded, False otherwise.

        Example:
            manager = EnvManager()
            if manager.auto_reload():
                logger.info("Environment reloaded")

        """
        if not self.env_file.exists():
            return False

        current_mtime = self.env_file.stat().st_mtime
        if self.last_modified is None or current_mtime > self.last_modified:
            self.reload()
            return True
        return False

    def get(self, key: str, default: str | None = None) -> str | None:
        """Get the value of an environment variable, reloading if the .env file changed.

        Parameters
        ----------
        key : str
            Name of the environment variable.
        default : str | None
            Value to return if the variable is not set. Defaults to None.

        Returns
        -------
            The value of the environment variable, or the default if not set.

        Example:
            db_url = manager.get("DATABASE_URL", "sqlite:///:memory:")

        """
        self.auto_reload()
        return os.getenv(key, default)


env_manager = EnvManager()


if __name__ == "__main__":
    """
    Example usage of EnvManager for testing.

    This script demonstrates how to use EnvManager to load and access environment
    variables. Modify your .env file and rerun this script to see auto-reloading
    in action.
    """
    logger.info("🧪 Testing EnvManager...\n")

    manager = EnvManager()

    db_url = manager.get("DATABASE_URL", "not set")
    api_key = manager.get("OPENAI_API_KEY", "not set")
    logger.info("DATABASE_URL: %s", db_url[:30] + "..." if db_url else "not set")
    logger.info("OPENAI_API_KEY: %s", api_key[:10] + "..." if api_key else "not set")

    logger.info("\n📝 Now try modifying your .env file and run this again!")
    logger.info("The EnvManager will automatically detect changes and reload.")
