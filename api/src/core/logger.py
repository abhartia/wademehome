"""Centralized logging configuration.

Uses :mod:`structlog` to emit structured logs (JSON in prod, human-readable in
dev). Every log line is automatically enriched with ``request_id``/``user_id``
from :mod:`core.request_context` when they are set.

Legacy call sites continue to work: ``logger = get_logger(__name__)`` still
returns a stdlib-compatible logger. The formatter is just smarter now.
"""

from __future__ import annotations

import logging
import os
import sys
from typing import Any

import structlog
from structlog.types import EventDict, Processor

from core.request_context import get_request_id, get_user_id


def _add_request_context(_logger: Any, _method: str, event_dict: EventDict) -> EventDict:
    rid = get_request_id()
    uid = get_user_id()
    if rid and "request_id" not in event_dict:
        event_dict["request_id"] = rid
    if uid and "user_id" not in event_dict:
        event_dict["user_id"] = uid
    return event_dict


_CONFIGURED = False


def _build_shared_processors() -> list[Processor]:
    return [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        _add_request_context,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]


def configure_root_logger(level: str | None = None) -> None:
    """Configure stdlib + structlog. Idempotent."""
    global _CONFIGURED
    if _CONFIGURED:
        return

    log_level = (level or os.getenv("LOG_LEVEL", "INFO")).upper()
    log_format = os.getenv("LOG_FORMAT", "pretty" if sys.stderr.isatty() else "json").lower()

    shared = _build_shared_processors()

    if log_format == "json":
        renderer: Processor = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer(colors=sys.stderr.isatty())

    formatter = structlog.stdlib.ProcessorFormatter(
        processor=renderer,
        foreign_pre_chain=shared,
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(getattr(logging, log_level, logging.INFO))

    structlog.configure(
        processors=[
            *shared,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        wrapper_class=structlog.make_filtering_bound_logger(getattr(logging, log_level, logging.INFO)),
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Tame chatty third parties.
    for noisy in ("urllib3", "httpx", "openai", "llama_index", "azure"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    _CONFIGURED = True


def get_logger(name: str, level: str | None = None) -> Any:
    """Return a structlog logger bound to ``name``.

    Backwards compatible with the previous stdlib-based helper: it accepts a
    ``level`` arg (applied to the module's stdlib logger) and returns something
    that supports ``.info("msg %s", arg)`` style calls.
    """
    configure_root_logger()
    if level:
        logging.getLogger(name).setLevel(getattr(logging, level.upper(), logging.INFO))
    return structlog.get_logger(name)


# Configure on import so module-level `logger = get_logger(__name__)` works.
configure_root_logger()
