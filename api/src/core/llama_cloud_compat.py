"""
llama-index-server imports symbols that existed on legacy llama-cloud (0.1.x).

The current PyPI `llama-cloud` (1.x), required by `llama-index-indices-managed-llama-cloud`,
uses OpenAPI-generated types and no longer exports `ManagedIngestionStatus` or
`PipelineFileCreateCustomMetadataValue` at the package root.

Those names are only needed so llama_index.server's LlamaCloud helpers can import;
this app does not require LlamaCloud ingestion. We expose minimal shims compatible
with string statuses returned by the 1.x client (e.g. "SUCCESS", "ERROR").

Call `apply_llama_cloud_server_compat()` before importing `llama_index.server`.
"""

from __future__ import annotations

from enum import StrEnum
from typing import Any

_applied = False


def apply_llama_cloud_server_compat() -> None:
    global _applied
    if _applied:
        return

    import llama_cloud as lc

    if hasattr(lc, "ManagedIngestionStatus") and hasattr(lc, "PipelineType"):
        _applied = True
        return

    class ManagedIngestionStatus(StrEnum):
        """Matches statuses used by ManagedIngestionStatusResponse in llama-cloud 1.x."""

        NOT_STARTED = "NOT_STARTED"
        IN_PROGRESS = "IN_PROGRESS"
        SUCCESS = "SUCCESS"
        ERROR = "ERROR"
        PARTIAL_SUCCESS = "PARTIAL_SUCCESS"
        CANCELLED = "CANCELLED"

    class PipelineType(StrEnum):
        """llama-cloud 1.x uses Literal[\"PLAYGROUND\", \"MANAGED\"]; server uses .MANAGED.value."""

        PLAYGROUND = "PLAYGROUND"
        MANAGED = "MANAGED"

    lc.ManagedIngestionStatus = ManagedIngestionStatus  # type: ignore[attr-defined]
    lc.PipelineType = PipelineType  # type: ignore[attr-defined]
    # Only used in type hints for custom metadata dict values in llama-index-server
    lc.PipelineFileCreateCustomMetadataValue = Any  # type: ignore[attr-defined]
    _applied = True
