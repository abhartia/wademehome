"""Tests for process-local text-to-SQL LLM cache."""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest
from llama_index.core.base.llms.types import ChatMessage, ChatResponse

from core.config import Config
from workflow.llm_cache import (
    Text2SqlLlmCache,
    build_text2sql_cache_key,
    get_text2sql_llm_cache,
)
from workflow.utils import parse_response_to_sql


@pytest.fixture(autouse=True)
def reset_text2sql_cache_module():
    import workflow.llm_cache as lc

    lc._cache_singleton = None
    lc._cache_singleton_sig = None
    yield
    lc._cache_singleton = None
    lc._cache_singleton_sig = None


def test_build_text2sql_cache_key_stable() -> None:
    msgs = [
        ChatMessage(role="user", content="2br in Austin"),
        ChatMessage(role="system", content="schema bit"),
    ]
    k1 = build_text2sql_cache_key(msgs, schema_text="listing_schema")
    k2 = build_text2sql_cache_key(msgs, schema_text="listing_schema")
    assert k1 == k2
    assert len(k1) == 64


def test_build_text2sql_cache_key_differs_on_schema() -> None:
    m = [ChatMessage(role="user", content="same")]
    assert build_text2sql_cache_key(m, schema_text="a") != build_text2sql_cache_key(
        m, schema_text="b"
    )


def test_text2sql_llm_cache_ttl_expiry(monkeypatch: pytest.MonkeyPatch) -> None:
    now = [0.0]
    monkeypatch.setattr("workflow.llm_cache.time.monotonic", lambda: now[0])
    c = Text2SqlLlmCache(max_entries=4, ttl_seconds=5.0)
    c.set("a", "SELECT 1")
    assert c.get("a") == "SELECT 1"
    now[0] = 10.0
    assert c.get("a") is None


def test_text2sql_llm_cache_lru_eviction() -> None:
    c = Text2SqlLlmCache(max_entries=2, ttl_seconds=3600.0)
    c.set("x", "SX")
    c.set("y", "SY")
    c.set("z", "SZ")
    assert c.get("x") is None
    assert c.get("y") == "SY"
    assert c.get("z") == "SZ"


def test_text2sql_llm_cache_skips_empty_sql() -> None:
    c = Text2SqlLlmCache(max_entries=4, ttl_seconds=60.0)
    c.set("k", "   ")
    assert c.get("k") is None


def _run_text2sql_with_cache(
    llm: MagicMock,
    messages: list[ChatMessage],
    schema_text: str,
) -> tuple[str, int]:
    """Mirror generate_sql cache branch (sync subset) for testing."""
    cache = get_text2sql_llm_cache()
    assert cache is not None
    cache_key = build_text2sql_cache_key(messages, schema_text=schema_text)
    cached = cache.get(cache_key)
    if cached is not None:
        return cached, llm.chat.call_count
    chat_response = llm.chat(messages)
    sql = parse_response_to_sql(chat_response)
    cache.set(cache_key, sql)
    return sql, llm.chat.call_count


def test_cache_hit_skips_second_llm_chat(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("LLM_TEXT2SQL_CACHE_ENABLED", "true")
    monkeypatch.setenv("LLM_TEXT2SQL_CACHE_MAX_ENTRIES", "32")
    monkeypatch.setenv("LLM_TEXT2SQL_CACHE_TTL_SECONDS", "3600")
    Config._refresh_values()

    llm = MagicMock()
    llm.chat.return_value = ChatResponse(
        message=ChatMessage(role="assistant", content="SQLQuery: SELECT 1 AS one")
    )
    schema = "table x (id int)"
    messages: list[ChatMessage] = [ChatMessage(role="user", content="show me listings")]

    sql1, calls1 = _run_text2sql_with_cache(llm, messages, schema)
    assert "SELECT 1" in sql1.replace("\n", " ")
    assert calls1 == 1

    sql2, calls2 = _run_text2sql_with_cache(llm, messages, schema)
    assert sql2 == sql1
    assert calls2 == 1
    assert llm.chat.call_count == 1
