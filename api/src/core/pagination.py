"""Opaque cursor pagination helpers.

Encodes a cursor as a URL-safe base64 JSON blob so clients treat it as opaque.
Rotate the cursor schema freely — old cursors just become ``invalid_cursor``.
"""

from __future__ import annotations

import base64
import json
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


def encode_cursor(payload: dict[str, Any]) -> str:
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode()
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def decode_cursor(cursor: Optional[str]) -> Optional[dict[str, Any]]:
    if not cursor:
        return None
    try:
        padding = "=" * (-len(cursor) % 4)
        raw = base64.urlsafe_b64decode(cursor + padding)
        payload = json.loads(raw)
        if not isinstance(payload, dict):
            raise ValueError("cursor payload must be an object")
        return payload
    except (ValueError, json.JSONDecodeError) as e:
        raise ValueError("invalid_cursor") from e


class Page(BaseModel, Generic[T]):
    items: list[T]
    next_cursor: Optional[str] = None
    has_more: bool = False
    total: Optional[int] = Field(
        default=None,
        description="Approximate total when cheap to compute; omit for large result sets.",
    )
