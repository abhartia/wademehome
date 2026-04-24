# ADR-0005 — Liveness / readiness probe split

**Status:** Accepted — 2026-04-24

## Context

The backend shipped with a single `/health` endpoint that returns `{"status":
"healthy"}` unconditionally as long as the ASGI app is up. The Azure App
Service slot-swap gate (see
[.github/workflows/azure-appservice-cicd.yml](../../.github/workflows/azure-appservice-cicd.yml))
uses that endpoint to decide whether a freshly-built image is ready to accept
production traffic.

Because `/health` does not touch the database, a staging slot that boots
with an unreachable DB (missing `DATABASE_URL`, firewall rule flipped, bad
password after a secret rotation) still returns 200 and still swaps into
production. The first user request then 500s. We have been one typo away
from a visible outage every deploy.

## Decision

Split the probe surface into two endpoints with distinct contracts:

- **`/health`** — **liveness.** Cheap, no downstreams. Answers "is the ASGI
  app accepting connections?". Used by platform liveness checks and the
  legacy fallback in the deploy workflow for rollbacks to images that
  predate `/ready`.
- **`/ready`** — **readiness.** Runs every probe in
  [api/src/core/readiness.py](../../api/src/core/readiness.py) — currently a
  DB `SELECT 1` with a 2000 ms `statement_timeout`. Returns
  `200 {"status":"ready","checks":{...}}` on success,
  `503 {"status":"not_ready","checks":{...}}` on any probe failure. Probes
  run in a threadpool so the event loop is free under concurrent probe load.

The Azure slot-swap job now polls `/ready`. On 200 it swaps; on 503 it
keeps waiting (DB still unreachable); on 404 it falls back to `/health`
(the image predates this ADR).

Failure payloads carry only the check name, an `ok: false`, and
`latency_ms`. The underlying exception is logged server-side but
**deliberately not returned on the wire** — `/ready` is unauthenticated and
we do not want it to double as a topology oracle for a scanner.

## Alternatives considered

- **Keep a single `/health` and have it check the DB.** Mixes two concerns:
  platform liveness checks fire every few seconds and would hammer the DB
  from every replica; a momentarily flaky DB would restart every pod
  instead of just failing the swap gate.
- **External synthetic check against a sentinel URL.** Adds a vendor or
  cron dependency for a test that should live in-process anyway. Also
  can't block the slot swap — which is the whole point.
- **Probe application-level invariants (alembic at head, cache warm, LLM
  reachable).** Tempting, but each extra probe is an extra way to fail
  deploys for reasons unrelated to serving traffic. Start with DB; add
  more only when an incident justifies it.

## Consequences

- A deploy whose DB secret is wrong no longer swaps into production — the
  staging slot hangs at 503 until the 10-minute timeout trips the deploy
  job red. That is the desired failure mode.
- `/ready` is cheap-ish but not free: one short DB round-trip per call.
  Platform probes should hit `/health` for liveness and reserve `/ready`
  for readiness (most orchestrators already split these by default).
- The deploy workflow has a small compatibility wart (`/ready` → fall
  back to `/health` on 404) that can be removed one release after every
  deployed image has `/ready`. Track this as a cleanup follow-up.
- Probes are pluggable via the `probes` kwarg on `check_readiness()`,
  which keeps them unit-testable without a live DB (see
  [api/tests/test_readiness.py](../../api/tests/test_readiness.py)).
