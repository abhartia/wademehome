"""Centralized logging configuration for Ask-Markerr."""

import logging
import os
import sys


def get_logger(name: str, level: str | None = None) -> logging.Logger:
    """Return a configured logger instance for the given name.

    This function creates and configures a logger with a console handler and a standard
    formatter if it has not already been configured. The log level can be set via the
    'level' argument or the LOG_LEVEL environment variable.

    Parameters
    ----------
    name : str
        The name of the logger, typically __name__.
    level : str | None
        Optional log level override. Accepts "DEBUG", "INFO", "WARNING",
        "ERROR", or "CRITICAL". If not provided, uses the LOG_LEVEL environment
        variable or defaults to "INFO".

    Returns
    -------
        A configured logging.Logger instance.

    Raises
    ------
        AttributeError: If an invalid log level string is provided.

    Example:
        logger = get_logger(__name__, level="DEBUG")
        logger.info("This is an info message")

    """
    logger = logging.getLogger(name)

    # Only configure if this logger hasn't been configured yet
    if not logger.handlers:
        # Get log level from environment or parameter
        log_level = level or os.getenv("LOG_LEVEL", "INFO").upper()
        logger.setLevel(getattr(logging, log_level))

        # Create console handler with formatting
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, log_level))

        # Create formatter
        formatter = logging.Formatter(
            fmt="%(asctime)s - %(name)s - %(levelname)s - %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(formatter)

        # Add handler to logger
        logger.addHandler(console_handler)

        # Prevent propagation to avoid duplicate logs
        logger.propagate = False

    return logger


def configure_root_logger(level: str | None = None) -> None:
    """Configure the root logger for the application.

    Sets up the root logger with a console handler, standard formatting, and
    adjusts log levels for noisy third-party libraries. The log level can be set
    via the 'level' argument or the LOG_LEVEL environment variable.

    Parameters
    ----------
    level : str | None
        Optional log level. Accepts "DEBUG", "INFO", "WARNING", "ERROR",
        or "CRITICAL". If not provided, uses the LOG_LEVEL environment
        variable or defaults to "INFO".

    Example:
        configure_root_logger(level="WARNING")

    """
    log_level = level or os.getenv("LOG_LEVEL", "INFO").upper()

    logging.basicConfig(
        level=getattr(logging, log_level),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    # Set specific log levels for noisy libraries
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.WARNING)
    logging.getLogger("llama_index").setLevel(logging.WARNING)


# Configure root logger on module import
configure_root_logger()
