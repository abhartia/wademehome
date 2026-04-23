"""Process-local TTL + LRU cache for text-to-SQL LLM results (shared across requests)."""

from __future__ import annotations

import hashlib
import json
import threading
import time
from collections import OrderedDict
from typing import TYPE_CHECKING

from core.config import Config
from prompts.loader import load_app_prompt

if TYPE_CHECKING:
    from llama_index.core.base.llms.types import ChatMessage

_prompt_sha256: str | None = None
_cache_lock = threading.Lock()
_cache_singleton: Text2SqlLlmCache | None = None
_cache_singleton_sig: tuple[str, str] | None = None


def _text2sql_prompt_fingerprint() -> str:
    global _prompt_sha256
    if _prompt_sha256 is None:
        body = load_app_prompt("text2sql_chat")
        _prompt_sha256 = hashlib.sha256(body.encode()).hexdigest()
    return _prompt_sha256


def _llm_model_identity() -> str:
    endpoint = (Config.get("AZURE_OPENAI_ENDPOINT", "") or "").strip()
    if endpoint and (Config.get("AZURE_OPENAI_API_KEY", "") or "").strip():
        dep = Config.get("AZURE_OPENAI_DEPLOYMENT", "") or ""
        model = Config.get("AZURE_OPENAI_MODEL", "") or ""
        return f"azure:{dep}:{model}"
    return f"openai:{Config.get('OPENAI_MODEL', '') or ''}"


def _serialize_messages(messages: list[ChatMessage]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for m in messages:
        role = getattr(m, "role", None) or ""
        block = getattr(m, "content", None) or ""
        text = block if isinstance(block, str) else str(block)
        out.append({"role": role, "content": text})
    return out


def build_text2sql_cache_key(
    messages: list[ChatMessage],
    *,
    schema_text: str,
) -> str:
    """Stable hash for the exact LLM input used by text-to-SQL."""
    envelope = {
        "v": 1,
        "prompt_fp": _text2sql_prompt_fingerprint(),
        "model": _llm_model_identity(),
        "schema_fp": hashlib.sha256((schema_text or "").encode()).hexdigest(),
        "messages": _serialize_messages(messages),
    }
    raw = json.dumps(envelope, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()


class Text2SqlLlmCache:
    """Thread-safe LRU with per-entry TTL (monotonic deadlines)."""

    def __init__(self, max_entries: int, ttl_seconds: float) -> None:
        self._max = max(1, max_entries)
        self._ttl = max(1.0, ttl_seconds)
        self._data: OrderedDict[str, tuple[str, float]] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str) -> str | None:
        now = time.monotonic()
        with self._lock:
            item = self._data.get(key)
            if item is None:
                return None
            sql, deadline = item
            if deadline <= now:
                del self._data[key]
                return None
            self._data.move_to_end(key)
            return sql

    def set(self, key: str, sql: str) -> None:
        s = (sql or "").strip()
        if not s:
            return
        now = time.monotonic()
        deadline = now + self._ttl
        with self._lock:
            if key in self._data:
                del self._data[key]
            self._data[key] = (sql.strip(), deadline)
            self._data.move_to_end(key)
            while len(self._data) > self._max:
                self._data.popitem(last=False)


def _parse_bool(raw: str | None) -> bool:
    return (raw or "").strip().lower() in ("1", "true", "yes", "on")


def _parse_positive_int(raw: str | None, default: int) -> int:
    try:
        n = int((raw or "").strip())
        return n if n > 0 else default
    except ValueError:
        return default


def _parse_positive_float(raw: str | None, default: float) -> float:
    try:
        x = float((raw or "").strip())
        return x if x > 0 else default
    except ValueError:
        return default


def get_text2sql_llm_cache() -> Text2SqlLlmCache | None:
    """Return shared cache instance when enabled; None otherwise. Recreates if size/TTL change."""
    global _cache_singleton, _cache_singleton_sig
    if not _parse_bool(Config.get("LLM_TEXT2SQL_CACHE_ENABLED", "false")):
        return None
    max_s = (Config.get("LLM_TEXT2SQL_CACHE_MAX_ENTRIES", "256") or "256").strip()
    ttl_s = (Config.get("LLM_TEXT2SQL_CACHE_TTL_SECONDS", "3600") or "3600").strip()
    sig = (max_s, ttl_s)
    max_entries = _parse_positive_int(max_s, 256)
    ttl = _parse_positive_float(ttl_s, 3600.0)
    with _cache_lock:
        if _cache_singleton is None or _cache_singleton_sig != sig:
            _cache_singleton = Text2SqlLlmCache(max_entries=max_entries, ttl_seconds=ttl)
            _cache_singleton_sig = sig
        return _cache_singleton
