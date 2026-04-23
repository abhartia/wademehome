"""Process-local TTL + LRU cache for read queries against the configured listings table."""

from __future__ import annotations

import base64
import hashlib
import json
import threading
import time
from collections import OrderedDict
from collections.abc import Mapping
from datetime import date, datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.engine import Connection
from sqlalchemy.sql.elements import TextClause

from core.config import Config

_CACHE_MISS = object()

_cache_lock = threading.Lock()
_cache_singleton: ListingsTableQueryCache | None = None
_cache_singleton_sig: tuple[str, str, str] | None = None


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


def _table_identity() -> str:
    s = (Config.get("LISTINGS_TABLE_SCHEMA") or "").strip()
    n = (Config.get("LISTINGS_TABLE_NAME") or "").strip()
    if not n:
        return "listings"
    return f"{s}.{n}" if s else n


def _normalize_sql(sql: str) -> str:
    return " ".join(sql.split())


def _unwrap_sql_fragment(sql: Any) -> str:
    if isinstance(sql, TextClause):
        return str(sql.text)
    return str(sql)


def _json_safe_value(v: Any) -> Any:
    if v is None:
        return None
    if isinstance(v, bool):
        return v
    if isinstance(v, int | float | str):
        return v
    if isinstance(v, Decimal):
        return str(v)
    if isinstance(v, (datetime, date)):
        return v.isoformat()
    if isinstance(v, UUID):
        return str(v)
    if isinstance(v, (bytes, memoryview)):
        raw = bytes(v)
        return {"__bytes__": base64.b64encode(raw).decode("ascii")}
    if isinstance(v, dict):
        return {str(k): _json_safe_value(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_json_safe_value(x) for x in v]
    return str(v)


def _deserialize_cached_value(v: Any) -> Any:
    if isinstance(v, dict) and set(v.keys()) == {"__bytes__"}:
        try:
            return base64.b64decode(v["__bytes__"])
        except Exception:
            return v
    if isinstance(v, dict):
        return {k: _deserialize_cached_value(x) for k, x in v.items()}
    if isinstance(v, list):
        return [_deserialize_cached_value(x) for x in v]
    return v


def _serialize_params(params: Any) -> Any:
    if params is None:
        return None
    if isinstance(params, Mapping):
        return {str(k): _json_safe_value(v) for k, v in sorted(params.items(), key=lambda kv: str(kv[0]))}
    if isinstance(params, (list, tuple)):
        return [_json_safe_value(v) for v in params]
    return _json_safe_value(params)


def build_cache_key(mode: str, sql: str, params: Any) -> str:
    envelope = {
        "v": 1,
        "table": _table_identity(),
        "mode": mode,
        "sql": _normalize_sql(sql),
        "params": _serialize_params(params),
    }
    raw = json.dumps(envelope, sort_keys=True, ensure_ascii=False, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()


def _to_executable(sql: Any) -> TextClause:
    if isinstance(sql, TextClause):
        return sql
    if isinstance(sql, str):
        return text(sql)
    return text(str(sql))


class ListingsTableQueryCache:
    """Thread-safe LRU with per-entry TTL (monotonic deadlines). Values are JSON-like payloads."""

    def __init__(self, max_entries: int, ttl_seconds: float) -> None:
        self._max = max(1, max_entries)
        self._ttl = max(1.0, ttl_seconds)
        self._data: OrderedDict[str, tuple[Any, float]] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str) -> Any:
        """Return _CACHE_MISS if missing or expired; otherwise the stored payload (may be None)."""
        now = time.monotonic()
        with self._lock:
            item = self._data.get(key)
            if item is None:
                return _CACHE_MISS
            payload, deadline = item
            if deadline <= now:
                del self._data[key]
                return _CACHE_MISS
            self._data.move_to_end(key)
            return payload

    def set(self, key: str, payload: Any) -> None:
        now = time.monotonic()
        deadline = now + self._ttl
        with self._lock:
            if key in self._data:
                del self._data[key]
            self._data[key] = (payload, deadline)
            self._data.move_to_end(key)
            while len(self._data) > self._max:
                self._data.popitem(last=False)


def get_listings_table_query_cache() -> ListingsTableQueryCache | None:
    """Return shared cache when enabled; None otherwise. Recreates if size/TTL change."""
    global _cache_singleton, _cache_singleton_sig
    if not _parse_bool(Config.get("LISTINGS_TABLE_CACHE_ENABLED", "true")):
        return None
    max_s = (Config.get("LISTINGS_TABLE_CACHE_MAX_ENTRIES", "512") or "512").strip()
    ttl_s = (Config.get("LISTINGS_TABLE_CACHE_TTL_SECONDS", "3600") or "3600").strip()
    sig = (max_s, ttl_s)
    max_entries = _parse_positive_int(max_s, 512)
    ttl = _parse_positive_float(ttl_s, 3600.0)
    with _cache_lock:
        if _cache_singleton is None or _cache_singleton_sig != sig:
            _cache_singleton = ListingsTableQueryCache(max_entries=max_entries, ttl_seconds=ttl)
            _cache_singleton_sig = sig
        return _cache_singleton


def _row_to_payload(row: Any) -> dict[str, Any]:
    return {k: _json_safe_value(v) for k, v in dict(row).items()}


def cached_execute_all(conn: Connection, sql: Any, params: Any) -> list[dict[str, Any]]:
    """Execute a listings read; return rows as dicts (cached when enabled)."""
    sql_s = _unwrap_sql_fragment(sql)
    key = build_cache_key("all", sql_s, params)
    cache = get_listings_table_query_cache()
    if cache is not None:
        hit = cache.get(key)
        if hit is not _CACHE_MISS:
            return [_deserialize_cached_value(dict(r)) for r in hit]
    stmt = _to_executable(sql)
    rows = [_row_to_payload(r) for r in conn.execute(stmt, params).mappings().all()]
    if cache is not None:
        cache.set(key, rows)
    return [_deserialize_cached_value(dict(r)) for r in rows]


def cached_execute_first(conn: Connection, sql: Any, params: Any) -> dict[str, Any] | None:
    """Execute a listings read; return first row as dict or None."""
    sql_s = _unwrap_sql_fragment(sql)
    key = build_cache_key("first", sql_s, params)
    cache = get_listings_table_query_cache()
    if cache is not None:
        hit = cache.get(key)
        if hit is not _CACHE_MISS:
            return None if hit is None else _deserialize_cached_value(dict(hit))
    stmt = _to_executable(sql)
    row = conn.execute(stmt, params).mappings().first()
    payload = None if row is None else _row_to_payload(row)
    if cache is not None:
        cache.set(key, payload)
    return None if payload is None else _deserialize_cached_value(dict(payload))


def cached_execute_scalar(conn: Connection, sql: Any, params: Any) -> Any:
    """Execute a listings read returning a single scalar (e.g. COUNT)."""
    sql_s = _unwrap_sql_fragment(sql)
    key = build_cache_key("scalar", sql_s, params)
    cache = get_listings_table_query_cache()
    if cache is not None:
        hit = cache.get(key)
        if hit is not _CACHE_MISS:
            return _deserialize_cached_value(hit)
    stmt = _to_executable(sql)
    val = conn.execute(stmt, params).scalar()
    safe = _json_safe_value(val)
    if cache is not None:
        cache.set(key, safe)
    return _deserialize_cached_value(safe)
