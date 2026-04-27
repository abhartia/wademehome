# ADR-0002 — slowapi for rate limiting

**Status:** Accepted — 2026-04-23

## Context

Two endpoints are particularly expensive: `/listings/chat` (LLM tokens, often 10+ seconds) and `/listings/nearby` (spatial query against a multi-million-row table). Without throttling, a single buggy client or a cheap abuser can blow up costs or degrade every other user's experience.

We wanted rate limiting that:
1. Could be applied as a decorator on individual routes (per-endpoint budgets).
2. Could key off the authenticated user, not just the IP (users behind NAT shouldn't share a bucket).
3. Had a drop-in in-memory backend for dev + single-instance deploys, but could scale out to Redis later.
4. Didn't require standing up a separate service.

## Decision

Use [slowapi](https://github.com/laurents/slowapi) — a FastAPI-flavored wrapper over the well-tested `limits` library.

- [api/src/core/rate_limit.py](../../api/src/core/rate_limit.py) exposes a module-level `limiter` singleton.
- The key function prefers the authenticated `user_id` (pulled from our request context) and falls back to the remote IP.
- `RATE_LIMIT_REDIS_URL` upgrades the backend from memory to Redis when set — no code change.
- `@limiter.limit("10/minute")` on a route is the minimum friction to protect a new endpoint.

## Alternatives considered

- **Nginx `limit_req`**. Fast, but configured in YAML out-of-band from the code. Harder to test and harder to key off our user identity.
- **Envoy / API gateway**. Overkill at our scale; we'd be running an extra process for the sake of it.
- **Hand-rolled middleware**. Easy to get subtle sliding-window math wrong; `limits` already handled it.

## Consequences

- Every expensive endpoint should opt in with `@limiter.limit(...)`. The default (120/min) catches the truly aggressive cases but won't prevent a determined abuser of cheap endpoints.
- When we move to multi-replica Azure, we must set `RATE_LIMIT_REDIS_URL` or counters per replica will under-count.
- 429 responses go through the same uniform error envelope (code `rate_limited`, includes `request_id`), matching the rest of the API.

## 2026-04-27 update — auth endpoints

The original decision left auth write endpoints on the 120/min default. That budget is too generous when paired with bcrypt (`/auth/login`) and outbound email (`/auth/signup`, `/auth/magic-link/request`, `/auth/verify-email/resend`): even an unauthenticated attacker scripted to one IP can burn meaningful CPU and SMTP per minute. SECURITY.md threat #3 already named these endpoints; this ADR now matches.

- All six auth write paths declare explicit budgets via env (`RATE_LIMIT_AUTH_*`); see [SECURITY.md](../../SECURITY.md#rate-limiting) for the table.
- A regression test (`tests/test_rate_limit.py::test_auth_endpoints_declare_explicit_limits`) walks the registered routes and asserts each is in `limiter._route_limits`, so a future copy-paste can't silently fall back to the default.
- The end-to-end test (`test_auth_login_returns_429_after_burst`) exercises the full ASGI stack and confirms the uniform 429 envelope is produced.
