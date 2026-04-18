"""LLM-as-judge for response-text quality criteria.

Uses gpt-5-mini (or whatever `get_llm_mini_reasoning` returns) as the judge
so the same model that the specialist agents use is grading them. Each
criterion becomes one judge call; the judge returns a strict yes/no plus a
short reason. We aggregate per case as `judge_pass_rate = pass / total`.

Judge prompt is intentionally narrow — it only sees the criterion, the
final assistant text, and (for context) the user's last message. It does
NOT see the chain-of-thought or tool results, which would bias it.
"""

import asyncio
import re
from dataclasses import dataclass

from llama_index.core.llms import LLM, ChatMessage, MessageRole

from core.llm_factory import get_llm_mini_reasoning


JUDGE_SYSTEM = """\
You are a strict evaluator for an AI assistant's response.

You will be given:
  1. The user's last message
  2. The assistant's reply
  3. ONE specific criterion to evaluate

Your job: decide whether the assistant's reply meets the criterion.

Respond with EXACTLY this format on two lines:
VERDICT: PASS
REASON: <one short sentence>

(Or `VERDICT: FAIL` if it does not meet the criterion.)

Be strict. If the criterion is "concise" and the reply is 4 sentences, that's FAIL.
"""


@dataclass
class JudgeResult:
    criterion: str
    passed: bool
    reason: str
    raw: str


_JUDGE_LLM: LLM | None = None


def _get_judge_llm() -> LLM:
    global _JUDGE_LLM
    if _JUDGE_LLM is None:
        _JUDGE_LLM = get_llm_mini_reasoning()
    return _JUDGE_LLM


_VERDICT_RE = re.compile(r"VERDICT:\s*(PASS|FAIL)", re.IGNORECASE)
_REASON_RE = re.compile(r"REASON:\s*(.+)", re.IGNORECASE)


async def judge_one(
    criterion: str,
    user_msg: str,
    assistant_reply: str,
    llm: LLM | None = None,
) -> JudgeResult:
    llm = llm or _get_judge_llm()
    prompt = (
        f"USER MESSAGE:\n{user_msg}\n\n"
        f"ASSISTANT REPLY:\n{assistant_reply or '(empty)'}\n\n"
        f"CRITERION:\n{criterion}\n"
    )
    resp = await llm.achat([
        ChatMessage(role=MessageRole.SYSTEM, content=JUDGE_SYSTEM),
        ChatMessage(role=MessageRole.USER, content=prompt),
    ])
    raw = (resp.message.content or "").strip()
    verdict_match = _VERDICT_RE.search(raw)
    reason_match = _REASON_RE.search(raw)
    passed = bool(verdict_match and verdict_match.group(1).upper() == "PASS")
    reason = reason_match.group(1).strip() if reason_match else raw[:200]
    return JudgeResult(criterion=criterion, passed=passed, reason=reason, raw=raw)


async def judge_all(
    criteria: list[str],
    user_msg: str,
    assistant_reply: str,
    llm: LLM | None = None,
) -> list[JudgeResult]:
    """Run all criteria in parallel."""
    if not criteria:
        return []
    llm = llm or _get_judge_llm()
    return await asyncio.gather(
        *(judge_one(c, user_msg, assistant_reply, llm) for c in criteria)
    )
