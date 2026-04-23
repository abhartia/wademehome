"""Shared LLM factory for FastAPI routes and workflows."""

from llama_index.core.llms import LLM
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.openai import OpenAI

from core.config import Config


def _llm_kwargs_for_no_reasoning() -> dict:
    # GPT-5-nano is a reasoning model: even with reasoning_effort=minimal, any
    # non-trivial prompt can spend tokens on reasoning. A budget under ~1024
    # results in finish_reason=length with 0 output tokens (all tokens consumed
    # by reasoning). 2048 leaves ample room for structured JSON outputs
    # (query plan, listing validation, lease extraction, URL parsing).
    return {
        "max_tokens": 2048,
        "additional_kwargs": {
            "reasoning_effort": "minimal",
        },
    }


def get_llm() -> LLM:
    """Return Azure OpenAI LLM if configured, otherwise OpenAI."""
    endpoint = Config.get("AZURE_OPENAI_ENDPOINT", "")
    if endpoint and Config.get("AZURE_OPENAI_API_KEY") and Config.get("AZURE_OPENAI_DEPLOYMENT"):
        return AzureOpenAI(
            azure_endpoint=endpoint.strip().rstrip("/"),
            api_key=Config.get("AZURE_OPENAI_API_KEY"),
            engine=Config.get("AZURE_OPENAI_DEPLOYMENT"),
            model=Config.get("AZURE_OPENAI_MODEL", "gpt-4o-mini"),
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            **_llm_kwargs_for_no_reasoning(),
        )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model=Config.get("OPENAI_MODEL", "gpt-4.1"),
        **_llm_kwargs_for_no_reasoning(),
    )


def _azure_configured() -> bool:
    return bool(Config.get("AZURE_OPENAI_ENDPOINT", "") and Config.get("AZURE_OPENAI_API_KEY"))


def get_llm_nano() -> LLM:
    """Small/fast LLM for routing and trivial tool prompts (gpt-5-nano).

    Uses Azure if configured (deployment from AZURE_OPENAI_DEPLOYMENT_NANO,
    falling back to AZURE_OPENAI_DEPLOYMENT). Otherwise direct OpenAI.

    reasoning_effort=low (not minimal): with minimal, nano occasionally
    malforms function calls and emits them as plain assistant text
    (e.g. "handoff to=functions.handoff ..."). A small reasoning budget
    fixes function-calling reliability for the orchestrator's routing job
    at negligible cost.
    """
    # max_tokens=4096: nano with reasoning_effort=low burns a variable chunk of
    # the output budget on hidden reasoning tokens before emitting the handoff
    # function call. The orchestrator's prompt carries 11 handoff targets plus
    # detailed routing rules; 2048 left too little headroom — nano occasionally
    # finished with length=limit, no tool call, no text, and the chat stalled
    # showing only "Routing your request…". 4096 gives the routing decision
    # room to actually land. Cost impact is negligible (output tokens only).
    if _azure_configured():
        deployment = Config.get(
            "AZURE_OPENAI_DEPLOYMENT_NANO",
            Config.get("AZURE_OPENAI_DEPLOYMENT"),
        )
        return AzureOpenAI(
            azure_endpoint=Config.get("AZURE_OPENAI_ENDPOINT").strip().rstrip("/"),
            api_key=Config.get("AZURE_OPENAI_API_KEY"),
            engine=deployment,
            model=Config.get("AZURE_OPENAI_MODEL_NANO", "gpt-5-nano"),
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            max_tokens=4096,
            additional_kwargs={"reasoning_effort": "low"},
        )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model=Config.get("OPENAI_MODEL_NANO", "gpt-5-nano"),
        max_tokens=4096,
        additional_kwargs={"reasoning_effort": "low"},
    )


def get_llm_mini_reasoning() -> LLM:
    """Reasoning-tier LLM for specialist agents (gpt-5-mini, medium reasoning).

    Uses Azure if configured (deployment from AZURE_OPENAI_DEPLOYMENT_MINI,
    falling back to AZURE_OPENAI_DEPLOYMENT). Otherwise direct OpenAI.

    If the mini deployment is the same as the nano deployment (i.e. there is
    no separate mini deployed in Azure yet), falls back to reasoning_effort=
    minimal so the small model doesn't starve its token budget on reasoning.
    """
    if _azure_configured():
        nano_deployment = Config.get("AZURE_OPENAI_DEPLOYMENT")
        mini_deployment = Config.get("AZURE_OPENAI_DEPLOYMENT_MINI", nano_deployment)
        is_real_mini = mini_deployment != nano_deployment
        return AzureOpenAI(
            azure_endpoint=Config.get("AZURE_OPENAI_ENDPOINT").strip().rstrip("/"),
            api_key=Config.get("AZURE_OPENAI_API_KEY"),
            engine=mini_deployment,
            model=Config.get("AZURE_OPENAI_MODEL_MINI", "gpt-5-mini"),
            api_version=Config.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
            max_tokens=16384 if is_real_mini else 8192,
            additional_kwargs={
                # Real mini: medium reasoning for genuine thought.
                # Fallback (nano stand-in): "low" — minimal causes nano to
                # malform function calls and emit them as plain text.
                "reasoning_effort": "medium" if is_real_mini else "low",
            },
        )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model=Config.get("OPENAI_MODEL_MINI", "gpt-5-mini"),
        max_tokens=8192,
        additional_kwargs={"reasoning_effort": "medium"},
    )
