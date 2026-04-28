"""Shared pytest fixtures.

Goals:
- Keep unit tests fast and hermetic — no real DB, no LLM, no network.
- Still make it easy to exercise the FastAPI app end-to-end via ``TestClient``.
"""

from __future__ import annotations

import os
import sys

import pytest

SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)


# Must run BEFORE any `llama_index.server` import (tests pull it transitively
# through src/workflow/utils.py -> listings.router). PyPI `llama-cloud` 1.x
# dropped `ManagedIngestionStatus` / `PipelineFileCreateCustomMetadataValue`
# that `llama_index.server` still expects; the shim re-exposes minimal stubs.
from core.llama_cloud_compat import apply_llama_cloud_server_compat

apply_llama_cloud_server_compat()


# Hermetic defaults so importing src/ doesn't try to talk to services.
os.environ.setdefault("LOG_FORMAT", "pretty")
os.environ.setdefault("LOG_LEVEL", "WARNING")
os.environ.setdefault("LANGFUSE_PUBLIC_KEY", "")
os.environ.setdefault("LANGFUSE_SECRET_KEY", "")
os.environ.setdefault("OPENAI_API_KEY", "test-key")
os.environ.setdefault("API_TOKENS", "")

# Tight auth limits so the rate-limit test in test_auth_rate_limits.py runs
# in a few requests. Using `setdefault` keeps CI/dev overrides untouched and
# only this module's test exercises these endpoints.
os.environ.setdefault("RATE_LIMIT_AUTH_LOGIN", "2/minute")
os.environ.setdefault("RATE_LIMIT_AUTH_SIGNUP", "2/minute")
os.environ.setdefault("RATE_LIMIT_AUTH_MAGIC_LINK_REQUEST", "2/minute")
os.environ.setdefault("RATE_LIMIT_AUTH_MAGIC_LINK_VERIFY", "2/minute")
os.environ.setdefault("RATE_LIMIT_AUTH_VERIFY_EMAIL", "2/minute")
os.environ.setdefault("RATE_LIMIT_AUTH_VERIFY_EMAIL_RESEND", "2/minute")


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
def app_module():
    """Import the FastAPI app lazily; heavy deps load on first import."""
    import importlib

    return importlib.import_module("main")


@pytest.fixture
def client(app_module):
    """A TestClient with the full ASGI stack (request context, security headers, auth)."""
    from fastapi.testclient import TestClient

    return TestClient(app_module.app)


@pytest.fixture
def fastapi_client(app_module):
    """A TestClient bound to the inner FastAPI instance (bypasses outer ASGI wrappers).

    Useful for unit-testing individual routers without dealing with auth headers.
    """
    from fastapi.testclient import TestClient

    return TestClient(app_module.fastapi_app)
