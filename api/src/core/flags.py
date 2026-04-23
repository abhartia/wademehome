"""Self-hosted feature flags.

Backed by a ``feature_flags`` table so flips are visible to every replica
without a redeploy. In-process TTL cache keeps the hot path cheap.

Evaluation order:
1. Env override ``FLAG_<KEY_UPPER>=true|false`` (local dev, tests).
2. Database row (if present).
3. ``default`` argument passed to :func:`is_enabled`.
"""

from __future__ import annotations

import hashlib
import os
import time
from typing import Optional

from sqlalchemy import text

from core.logger import get_logger

log = get_logger(__name__)

_CACHE: dict[str, tuple[float, dict]] = {}
_TTL_SECONDS = 30


def _env_override(key: str) -> Optional[bool]:
    raw = os.getenv(f"FLAG_{key.upper().replace('-', '_')}")
    if raw is None:
        return None
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _fetch(key: str) -> Optional[dict]:
    """Pull one flag row. Lazy import avoids pulling DB at module load."""
    try:
        from db.session import get_session_local

        factory = get_session_local()
    except Exception:
        return None

    try:
        with factory() as session:
            row = session.execute(
                text(
                    "SELECT enabled, rollout_percent, user_allowlist "
                    "FROM feature_flags WHERE key = :key"
                ),
                {"key": key},
            ).first()
    except Exception as e:
        log.debug("flag fetch failed", key=key, error=str(e))
        return None

    if row is None:
        return None
    return {
        "enabled": bool(row[0]),
        "rollout_percent": int(row[1] or 0),
        "user_allowlist": list(row[2] or []),
    }


def _get_cached(key: str) -> Optional[dict]:
    entry = _CACHE.get(key)
    now = time.monotonic()
    if entry and now - entry[0] < _TTL_SECONDS:
        return entry[1]
    row = _fetch(key)
    if row is not None:
        _CACHE[key] = (now, row)
    return row


def invalidate(key: Optional[str] = None) -> None:
    if key is None:
        _CACHE.clear()
    else:
        _CACHE.pop(key, None)


def _bucket(user_id: str, key: str) -> int:
    """Stable 0–99 bucket for consistent user rollouts."""
    digest = hashlib.sha1(f"{key}:{user_id}".encode()).digest()
    return digest[0] % 100


def is_enabled(key: str, user_id: Optional[str] = None, default: bool = False) -> bool:
    override = _env_override(key)
    if override is not None:
        return override

    row = _get_cached(key)
    if row is None:
        return default

    if not row["enabled"]:
        return False

    allowlist = row["user_allowlist"]
    if user_id and user_id in allowlist:
        return True

    percent = row["rollout_percent"]
    if percent >= 100:
        return True
    if percent <= 0:
        return False
    if not user_id:
        return False
    return _bucket(user_id, key) < percent


def evaluate_all(user_id: Optional[str] = None) -> dict[str, bool]:
    """Return all known flags — used by the frontend bootstrap hook."""
    try:
        from db.session import get_session_local

        factory = get_session_local()
        with factory() as session:
            rows = session.execute(text("SELECT key FROM feature_flags")).all()
    except Exception:
        return {}

    return {row[0]: is_enabled(row[0], user_id) for row in rows}
