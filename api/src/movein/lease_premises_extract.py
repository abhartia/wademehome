"""Extract leased premises address from lease plain text (for move-from autofill)."""

from __future__ import annotations

import json
import re

from llama_index.core.base.llms.types import ChatMessage
from llama_index.core.llms import LLM

from core.llm_factory import get_llm
from core.logger import get_logger

logger = get_logger(__name__)

PREMISES_EXTRACT_MAX_CHARS = 15_000
MOVE_FROM_ADDRESS_MAX_LEN = 255

_SYSTEM = (
    "You read residential lease excerpts. Respond with JSON only, no markdown. "
    "Keys: premises_address (string or null). "
    "Set premises_address to the physical mailing/street address of the leased premises "
    "(unit, building, street, city, state, ZIP) exactly as stated in the text when possible, "
    "as a single line. If the lease does not clearly state that address, use null. "
    "Do not invent addresses. Ignore landlord or agent office addresses unless they are clearly "
    "labeled as the rented premises."
)

_USER_TEMPLATE = """Extract the leased premises (rental unit) address from this lease excerpt:

---
{snippet}
---
"""


def _normalize_premises_address(raw: str | None) -> str | None:
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    s = re.sub(r"\s+", " ", s)
    if len(s) > MOVE_FROM_ADDRESS_MAX_LEN:
        s = s[:MOVE_FROM_ADDRESS_MAX_LEN].rstrip()
    return s


async def extract_premises_address_from_lease_text(
    lease_text: str,
    *,
    llm: LLM | None = None,
) -> str | None:
    """Return normalized premises address or None on failure / not found."""
    text = (lease_text or "").strip()
    if not text:
        return None

    snippet = text[:PREMISES_EXTRACT_MAX_CHARS]
    active_llm = llm or get_llm()

    try:
        resp = await active_llm.achat(
            messages=[
                ChatMessage(role="system", content=_SYSTEM),
                ChatMessage(role="user", content=_USER_TEMPLATE.format(snippet=snippet)),
            ],
            response_format={"type": "json_object"},
            max_tokens=300,
            reasoning_effort="none",
        )
    except Exception:
        logger.exception("lease premises LLM call failed")
        return None

    raw_content = (resp.message.content if resp and resp.message else None) or ""
    try:
        if isinstance(raw_content, dict):
            payload = raw_content
        else:
            payload = json.loads(str(raw_content))
    except (json.JSONDecodeError, TypeError):
        logger.warning("lease premises extract: invalid JSON from model")
        return None

    if not isinstance(payload, dict):
        return None

    addr = payload.get("premises_address")
    return _normalize_premises_address(addr if isinstance(addr, str) else None)
