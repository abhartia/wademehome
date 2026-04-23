"""Public feature-flag endpoint consumed by the frontend bootstrap."""

from __future__ import annotations

from fastapi import APIRouter

from core.flags import evaluate_all
from core.request_context import get_user_id

router = APIRouter(prefix="/flags", tags=["flags"])


@router.get("")
async def list_flags() -> dict[str, bool]:
    return evaluate_all(get_user_id())
