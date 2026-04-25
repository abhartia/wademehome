# ADR-0006 — Database connection pool hardening

**Status:** Accepted — 2026-04-25

## Context

The repo wires SQLAlchemy ``Engine`` instances in two places — the
request-path ORM session in
[api/src/db/session.py](../../api/src/db/session.py) and the LlamaIndex
text-to-SQL workflow engine in
[api/src/workflow/utils.py](../../api/src/workflow/utils.py). Until this
ADR, both called ``create_engine(url, future=True)`` with only a five-second
``connect_timeout`` and otherwise default pool settings. That is fine for a
laptop demo but ships four real production hazards on Azure App Service:

1. **No ``pool_pre_ping``.** When App Service idles a worker, NAT or the
   DB-side ``idle_session_timeout`` half-closes the TCP connection. The
   next checkout returns a dead handle and the request 500s with
   ``server closed the connection unexpectedly``. Classic textbook PaaS
   failure mode and one a Series A reviewer will look for.
2. **No ``pool_recycle``.** Long-lived connections eventually exceed
   PG's ``idle_in_transaction_session_timeout`` or PgBouncer's
   ``server_idle_timeout`` and the next checkout fails the same way.
3. **No ``statement_timeout``.** A runaway query — notably an
   LLM-generated SQL plan from the chat workflow — pins both a worker
   thread and a DB connection indefinitely. The readiness probe already
   sets ``SET LOCAL statement_timeout`` for itself
   ([api/src/core/readiness.py:36](../../api/src/core/readiness.py)) but
   no equivalent guard existed for normal request traffic.
4. **Unbounded pool.** Default ``pool_size=5`` is too small for a
   moderately busy worker, and there is no explicit ``max_overflow``
   ceiling, so a traffic spike can saturate PG's ``max_connections``
   from a handful of replicas.

## Decision

Centralise engine construction in a new
[api/src/db/engine.py](../../api/src/db/engine.py)::``make_engine`` helper
that both call sites use. The helper applies, on every engine:

- ``pool_pre_ping=True`` — one cheap ``SELECT 1`` on checkout invalidates
  dead connections before they can poison a request.
- ``pool_recycle=DB_POOL_RECYCLE_SECONDS`` (default ``1800`` — 30 min,
  comfortably under typical PG / PgBouncer idle timeouts).
- ``pool_size=DB_POOL_SIZE`` (default ``5``) and
  ``max_overflow=DB_MAX_OVERFLOW`` (default ``10``) — bounded pool so
  one runaway replica cannot eat the DB's connection budget.
- ``connect_args["options"] = "-c statement_timeout=…"`` for PostgreSQL
  URLs, set from ``DB_STATEMENT_TIMEOUT_MS`` (default ``30000`` —
  30 seconds, well above observed p99 search latency).
- ``connect_args["connect_timeout"] = DB_CONNECT_TIMEOUT_SECONDS``
  (default ``5``), preserving the prior behaviour.

SQLite URLs (used in tests) skip the pool kwargs and the psycopg2-only
``options`` arg so in-memory fixtures keep working unchanged.

Settings are env-tunable so ops can adjust pool sizing or timeouts
without a redeploy via Azure App Service application settings.

## Alternatives considered

- **Set the timeouts at the PG role level** (``ALTER ROLE … SET
  statement_timeout``). Centralised, but couples app behaviour to a
  schema migration and is invisible to anyone reading the app code.
  Worse, it does not protect against the connection-staleness class of
  bug at all.
- **Drop a ``SET LOCAL statement_timeout`` at the start of every
  session.** Works but every router has to remember to do it; one
  forgotten endpoint is a runaway-query foothold. The libpq
  ``options`` parameter applies the GUC at connection time so it's on
  by default.
- **Switch to async SQLAlchemy / asyncpg.** Larger change, breaks the
  text-to-SQL ``SQLDatabase`` path which expects a sync engine, and
  would not by itself fix the staleness or runaway-query issues. Out
  of scope for this ADR.

## Consequences

- First-request-after-idle 500s on Azure should disappear. The cost is
  one round-trip per pool checkout; on a hot pool that is < 1 ms and
  amortised across the request anyway.
- A genuinely runaway query now fails after ``DB_STATEMENT_TIMEOUT_MS``
  with ``QueryCanceled`` instead of pinning a worker. Callers see a
  500 mapped through the existing error envelope; the structured log
  carries the SQL state so it is greppable.
- The two engine call sites now share configuration. Future tweaks
  (e.g. read-replica routing, custom event listeners) only need to be
  wired in one place.
- Pool sizing is intentionally conservative. If real traffic exceeds
  the ceiling, raise ``DB_POOL_SIZE`` / ``DB_MAX_OVERFLOW`` via App
  Service settings before bumping replicas — extra replicas multiply
  the connection budget faster than extra pool slots do.
- Test coverage for the helper lives at
  [api/tests/test_db_engine.py](../../api/tests/test_db_engine.py) and
  includes the SQLite skip path so the fixtures keep passing.
