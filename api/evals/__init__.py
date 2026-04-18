"""Evals framework for the home agent workflow.

Drives `AgentWorkflow` directly against a real LLM + DB, captures structural
events (tool calls, ui events, handoffs), measures latency / token cost, and
runs an LLM-as-judge over the final assistant text. Results write to
`eval-results/` and (optionally) push to Langfuse as a dataset run so model
combos can be A/B'd in the Langfuse UI.

CLI: see `evals/__main__.py`.
"""

import os
import sys

# Make `src/` importable so `from agent.workflow import ...` resolves when
# the evals package is loaded as `python -m evals` from the api/ directory.
_SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))
if _SRC_DIR not in sys.path:
    sys.path.insert(0, _SRC_DIR)
