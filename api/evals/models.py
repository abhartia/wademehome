"""Model combinations for the eval matrix.

Each combo defines how to construct the orchestrator LLM and the specialist
LLM. Add a combo here to make it available to the runner.

Combos use the same LLM factory the production endpoint uses (Azure when
configured, OpenAI otherwise) so eval results map 1:1 to prod behavior.
"""

from dataclasses import dataclass
from typing import Callable

from llama_index.core.llms import LLM
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.openai import OpenAI

from core.config import Config
from core.llm_factory import (
    _azure_configured,
    get_llm_mini_reasoning,
    get_llm_nano,
)


@dataclass
class ModelCombo:
    """A pair of LLMs (orchestrator, specialist) to evaluate together."""

    name: str
    description: str
    orchestrator_factory: Callable[[], LLM]
    specialist_factory: Callable[[], LLM]


def _gpt4o_mini() -> LLM:
    if _azure_configured():
        # Azure account may not have gpt-4o-mini deployed; fall through to
        # OpenAI direct in that case.
        endpoint = Config.get("AZURE_OPENAI_ENDPOINT", "").strip().rstrip("/")
        deployment = Config.get("AZURE_OPENAI_DEPLOYMENT_4O_MINI", "")
        if deployment:
            return AzureOpenAI(
                azure_endpoint=endpoint,
                api_key=Config.get("AZURE_OPENAI_API_KEY"),
                engine=deployment,
                model="gpt-4o-mini",
                api_version=Config.get(
                    "AZURE_OPENAI_API_VERSION", "2024-12-01-preview"
                ),
                max_tokens=2048,
            )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model="gpt-4o-mini",
        max_tokens=2048,
    )


def _gpt4o() -> LLM:
    if _azure_configured():
        endpoint = Config.get("AZURE_OPENAI_ENDPOINT", "").strip().rstrip("/")
        deployment = Config.get("AZURE_OPENAI_DEPLOYMENT_4O", "")
        if deployment:
            return AzureOpenAI(
                azure_endpoint=endpoint,
                api_key=Config.get("AZURE_OPENAI_API_KEY"),
                engine=deployment,
                model="gpt-4o",
                api_version=Config.get(
                    "AZURE_OPENAI_API_VERSION", "2024-12-01-preview"
                ),
                max_tokens=4096,
            )
    return OpenAI(
        api_key=Config.get("OPENAI_API_KEY"),
        model="gpt-4o",
        max_tokens=4096,
    )


COMBOS: dict[str, ModelCombo] = {
    "nano+nano": ModelCombo(
        name="nano+nano",
        description="GPT-5-nano for both orchestrator and specialists. Cheapest baseline.",
        orchestrator_factory=get_llm_nano,
        specialist_factory=get_llm_nano,
    ),
    "nano+mini": ModelCombo(
        name="nano+mini",
        description="Production default: nano routes, mini-reasoning specializes.",
        orchestrator_factory=get_llm_nano,
        specialist_factory=get_llm_mini_reasoning,
    ),
    "mini+mini": ModelCombo(
        name="mini+mini",
        description="Mini-reasoning everywhere. Highest quality, highest cost.",
        orchestrator_factory=get_llm_mini_reasoning,
        specialist_factory=get_llm_mini_reasoning,
    ),
    "4o-mini+4o": ModelCombo(
        name="4o-mini+4o",
        description="GPT-4o-mini routes, GPT-4o specializes. Fallback if gpt-5 unavailable.",
        orchestrator_factory=_gpt4o_mini,
        specialist_factory=_gpt4o,
    ),
}


def get_combo(name: str) -> ModelCombo:
    if name not in COMBOS:
        raise KeyError(
            f"Unknown model combo {name!r}. Known: {sorted(COMBOS.keys())}"
        )
    return COMBOS[name]
