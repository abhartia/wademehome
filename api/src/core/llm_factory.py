"""Shared LLM factory for FastAPI routes and workflows."""

from llama_index.core.llms import LLM
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.llms.openai import OpenAI

from core.config import Config


def _llm_kwargs_for_no_reasoning() -> dict:
    # Keep completions short for latency; avoid unsupported params (e.g. temperature on GPT-5 nano).
    return {
        "max_tokens": 256,
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
