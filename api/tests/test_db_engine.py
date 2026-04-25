"""Tests for the shared SQLAlchemy engine factory."""

from __future__ import annotations

import pytest

from db.engine import _build_connect_args, make_engine


def test_rejects_empty_url() -> None:
    with pytest.raises(ValueError, match="DATABASE_URL"):
        make_engine("")


def test_postgres_engine_has_pool_hardening(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DB_POOL_SIZE", raising=False)
    monkeypatch.delenv("DB_MAX_OVERFLOW", raising=False)
    monkeypatch.delenv("DB_POOL_RECYCLE_SECONDS", raising=False)

    engine = make_engine("postgresql+psycopg2://u:p@h/d")

    assert engine.pool._pre_ping is True
    assert engine.pool._recycle == 1800
    # QueuePool exposes size() (steady) and _max_overflow (burst).
    assert engine.pool.size() == 5
    assert engine.pool._max_overflow == 10


def test_postgres_connect_args_set_statement_timeout(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DB_STATEMENT_TIMEOUT_MS", raising=False)
    monkeypatch.delenv("DB_CONNECT_TIMEOUT_SECONDS", raising=False)

    args = _build_connect_args("postgresql+psycopg2://u:p@h/d")

    assert args["connect_timeout"] == 5
    assert args["options"] == "-c statement_timeout=30000"


def test_env_overrides_apply(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DB_POOL_SIZE", "12")
    monkeypatch.setenv("DB_MAX_OVERFLOW", "20")
    monkeypatch.setenv("DB_POOL_RECYCLE_SECONDS", "600")
    monkeypatch.setenv("DB_STATEMENT_TIMEOUT_MS", "5000")
    monkeypatch.setenv("DB_CONNECT_TIMEOUT_SECONDS", "3")

    engine = make_engine("postgresql+psycopg2://u:p@h/d")
    args = _build_connect_args("postgresql+psycopg2://u:p@h/d")

    assert engine.pool.size() == 12
    assert engine.pool._max_overflow == 20
    assert engine.pool._recycle == 600
    assert args["connect_timeout"] == 3
    assert args["options"] == "-c statement_timeout=5000"


def test_invalid_int_env_falls_back_to_default(monkeypatch: pytest.MonkeyPatch) -> None:
    # Operators occasionally typo a setting; we should not crash app boot.
    monkeypatch.setenv("DB_POOL_SIZE", "not-a-number")
    monkeypatch.delenv("DB_MAX_OVERFLOW", raising=False)

    engine = make_engine("postgresql+psycopg2://u:p@h/d")

    assert engine.pool.size() == 5


def test_non_postgres_url_skips_pg_options() -> None:
    # ``options`` is psycopg2-specific; non-PG drivers must not see it.
    assert _build_connect_args("sqlite:///:memory:") == {}
    assert _build_connect_args("mysql://u:p@h/d") == {}


def test_sqlite_engine_opens_and_skips_pool_kwargs() -> None:
    # Smoke: the engine can actually open a connection (no psycopg2 ``options``).
    engine = make_engine("sqlite:///:memory:")
    with engine.connect() as conn:
        conn.exec_driver_sql("SELECT 1")
