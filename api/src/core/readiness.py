"""Readiness probe.

Separate from ``/health`` (liveness). ``/health`` answers "is the ASGI app
accepting connections?" — cheap, no downstreams. ``/ready`` answers "is this
replica ready to serve traffic?" — checks the critical dependencies
(currently the database) so a broken deploy fails the slot-swap gate instead
of rolling into production.

Each probe runs with a server-side statement timeout so a wedged downstream
cannot hang the request. Failures log the underlying error server-side but
return only the check name + ok/latency on the wire, to keep the endpoint
cheap and avoid leaking internal topology to unauthenticated callers.
"""

from __future__ import annotations

import time
from typing import Any, Callable

from sqlalchemy import text

from core.logger import get_logger
from db.session import get_engine

logger = get_logger(__name__)

_DB_PROBE_TIMEOUT_MS = 2000

Probe = Callable[[], None]


def _check_db() -> None:
    engine = get_engine()
    with engine.connect() as conn:
        conn.execute(text(f"SET LOCAL statement_timeout = {_DB_PROBE_TIMEOUT_MS}"))
        conn.execute(text("SELECT 1"))


DEFAULT_PROBES: dict[str, Probe] = {"db": _check_db}


def check_readiness(probes: dict[str, Probe] | None = None) -> tuple[bool, dict[str, Any]]:
    """Run every probe and return ``(all_ok, {name: {ok, latency_ms}})``.

    A probe is "ok" iff it returns without raising. The wire payload
    deliberately omits the exception message — it goes to the log instead.
    """
    to_run = probes if probes is not None else DEFAULT_PROBES
    results: dict[str, Any] = {}
    all_ok = True
    for name, probe in to_run.items():
        t0 = time.perf_counter()
        try:
            probe()
            results[name] = {"ok": True, "latency_ms": int((time.perf_counter() - t0) * 1000)}
        except Exception as exc:
            all_ok = False
            latency_ms = int((time.perf_counter() - t0) * 1000)
            logger.warning(
                "readiness_probe_failed",
                probe=name,
                error=str(exc),
                latency_ms=latency_ms,
            )
            results[name] = {"ok": False, "latency_ms": latency_ms}
    return all_ok, results
