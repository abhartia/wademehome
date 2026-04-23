import json
from typing import Any


def stop_event_result_to_sse_chunk(result: Any) -> str:
    """
    Render a non-streaming `StopEvent.result` into the SSE protocol used by `main.py`.

    The UI expects events of the form:
      0:<json-string>\n\n
    """
    payload = "" if result is None else str(result)
    return f"0:{json.dumps(payload)}\n\n"
