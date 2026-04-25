"""Hardened SQLAlchemy engine factory.

The codebase needs a SQLAlchemy ``Engine`` in two places — the request-path
ORM session (``db/session.py``) and the LlamaIndex text-to-SQL workflow
(``workflow/utils.py``). Both used to call ``create_engine`` with default
settings, which is fine for a laptop demo but brittle in production:

* No ``pool_pre_ping`` — the first request after Azure App Service idles a
  worker hits a half-open TCP connection and returns 500 ("server closed
  the connection unexpectedly").
* No ``pool_recycle`` — long-lived connections eventually exceed PG's
  ``idle_in_transaction_session_timeout`` or PgBouncer's
  ``server_idle_timeout`` and the next checkout fails.
* No ``statement_timeout`` — a runaway query (notably an LLM-generated
  ``text2sql`` query) pins a worker thread + a DB connection indefinitely.
* Default pool size (5) is too small for a busy worker and there is no
  bound on overflow, so a traffic spike can saturate PG's
  ``max_connections``.

This module centralises the configuration so both engines get the same
hardening. Settings are env-tunable for ops without a redeploy.

ADR-0006 walks through the trade-offs.
"""

from __future__ import annotations

import os

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

# Defaults are conservative — sized for a single Azure App Service
# Standard worker (2 vCPU). Tune via env.
_DEFAULT_POOL_SIZE = 5
_DEFAULT_MAX_OVERFLOW = 10
_DEFAULT_POOL_RECYCLE_SECONDS = 1800  # 30 min — under typical PgBouncer/PG idle timeouts.
_DEFAULT_STATEMENT_TIMEOUT_MS = 30_000  # 30 s — well above p99 search; catches runaways.
_DEFAULT_CONNECT_TIMEOUT_SECONDS = 5


def _int_env(name: str, default: int) -> int:
    """Read an int from env; fall back to ``default`` on missing/invalid."""
    raw = os.environ.get(name, "")
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def _is_postgres(database_url: str) -> bool:
    return database_url.startswith(("postgresql://", "postgresql+", "postgres://"))


def _is_sqlite(database_url: str) -> bool:
    return database_url.startswith("sqlite")


def _build_connect_args(database_url: str) -> dict:
    """Driver-specific connect args. Only psycopg2 understands ``options``."""
    if not _is_postgres(database_url):
        return {}
    statement_timeout_ms = _int_env("DB_STATEMENT_TIMEOUT_MS", _DEFAULT_STATEMENT_TIMEOUT_MS)
    connect_timeout = _int_env("DB_CONNECT_TIMEOUT_SECONDS", _DEFAULT_CONNECT_TIMEOUT_SECONDS)
    return {
        "connect_timeout": connect_timeout,
        # libpq passes ``options`` to the backend; ``-c key=value`` sets a
        # session GUC. Applies to every checked-out connection.
        "options": f"-c statement_timeout={statement_timeout_ms}",
    }


def make_engine(database_url: str) -> Engine:
    """Create a SQLAlchemy ``Engine`` with production-safe pool defaults.

    SQLite is treated as a test-only backend: pooling kwargs are skipped so
    in-memory or file-based fixtures keep working without driver-specific
    flags.
    """
    if not database_url:
        raise ValueError("DATABASE_URL is empty or unset")

    kwargs: dict = {
        "future": True,
        "connect_args": _build_connect_args(database_url),
    }

    if not _is_sqlite(database_url):
        kwargs.update(
            pool_pre_ping=True,
            pool_recycle=_int_env("DB_POOL_RECYCLE_SECONDS", _DEFAULT_POOL_RECYCLE_SECONDS),
            pool_size=_int_env("DB_POOL_SIZE", _DEFAULT_POOL_SIZE),
            max_overflow=_int_env("DB_MAX_OVERFLOW", _DEFAULT_MAX_OVERFLOW),
        )

    return create_engine(database_url, **kwargs)
