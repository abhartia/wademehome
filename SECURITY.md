# Security

This document captures the threat model and the controls the codebase relies on. If you find a vulnerability, please open a private security advisory on the repo rather than a public issue.

## Threat model

The app handles renter-submitted data (saved listings, tours, messages) and landlord-submitted data (building info, payouts). The primary risks are:

1. **Account takeover** — magic-link / cookie theft, weak session invalidation.
2. **Data exfiltration** — an authenticated user reading rows that belong to another tenant.
3. **Abuse of expensive endpoints** — `/listings/chat` (LLM cost), `/listings/nearby` (DB cost), `/auth/login` (brute-force / enumeration).
4. **Injection** — dynamic SQL in search paths, XSS via LLM-rendered chat responses.
5. **Supply-chain** — compromised Python/npm dependency.

Nation-state actors, side-channel attacks, and physical attacks on Azure are explicitly **out of scope**.

## Controls

### Transport

- HTTPS is enforced at the Azure edge. HSTS header set by [api/src/core/security_headers.py](api/src/core/security_headers.py) (`max-age=31536000; includeSubDomains`).
- Strict CORS allowlist via `CORS_ALLOWED_ORIGINS`. No wildcards in production.

### AuthN / AuthZ

- Magic-link email + password hashing via bcrypt (see `api/src/auth/`).
- Cookie sessions are `httponly; secure; samesite`.
- Bearer / `X-API-Token` auth on server-to-server calls.
- Every protected route resolves a user and binds it to the request context; downstream code calls `get_user_id()`.

### Input validation

- Query parameters go through Pydantic with explicit bounds (`ge`, `le`, `max_length`).
- Geographic queries enforce `lat_span <= 4°`, `lng_span <= 6°` to prevent unbounded scans (see [api/src/listings/router.py](api/src/listings/router.py)).
- Request bodies are capped at `MAX_REQUEST_BYTES` (default 1 MiB) by [api/src/core/body_size.py](api/src/core/body_size.py). 413 on overrun.

### Rate limiting

- [api/src/core/rate_limit.py](api/src/core/rate_limit.py) wires slowapi. Default `120/min`; `/listings/chat` is `10/min` by default (configurable).
- Keyed by authenticated user first, IP second.
- Backed by Redis when `RATE_LIMIT_REDIS_URL` is set; otherwise in-process (single-replica only).

### Headers

[api/src/core/security_headers.py](api/src/core/security_headers.py) sets on every response:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cross-Origin-Opener-Policy: same-origin`
- `Permissions-Policy` — locked down by default
- `Content-Security-Policy` — opt-in via `CONTENT_SECURITY_POLICY` env (a too-strict default silently breaks third-party embeds; see [ADR-0007](docs/adr/0007-default-cache-control.md) for the cache-control sibling decision)
- `Strict-Transport-Security` — on when `HSTS_ENABLED=1` (default)
- `Cache-Control: no-store` — applied to every response unless the handler sets its own `Cache-Control`. Prevents shared proxies, CDNs, and browser HTTP caches from retaining authenticated JSON. Override per-handler when caching is intentional (sitemap-keys, OpenAPI spec). Disable globally with `DEFAULT_CACHE_CONTROL=` (empty).

### SQL

- All raw SQL uses bound parameters (`:name` with a dict). String interpolation only happens against values from the [column_aliases](api/src/listings/) allowlist, not user input.
- ORM queries use SQLAlchemy constructs that auto-parameterize.

### Output

- LLM responses are rendered via the official `@llamaindex/chat-ui` component, which sanitizes HTML.
- No `dangerouslySetInnerHTML` in the UI.

### Dependencies

- [Dependabot](.github/dependabot.yml) opens weekly PRs for pip / npm / GitHub Actions / Docker.
- CI runs `bandit -r src`, `pip-audit`, and `npm audit`.
- GitHub CodeQL runs on every PR (Python + JavaScript).
- [`actions/dependency-review-action`](.github/workflows/dependency-review.yml) **blocks** PRs that introduce a new dependency with a high/critical advisory or a copyleft (GPL/AGPL) license. Policy lives in [.github/dependency-review-config.yml](.github/dependency-review-config.yml).
- [gitleaks](https://github.com/gitleaks/gitleaks) runs as a pre-commit hook to catch committed secrets before push.

### Secrets

- `.env` files are gitignored. `.env.example` documents every env var with no values.
- Production secrets are GitHub Actions secrets or Azure App Service configuration — never in the repo.
- A dummy `API_TOKENS` is auto-generated in dev when the env var is unset; a warning logs on startup so the operator notices.

## Reporting

Please open a [private security advisory](../../security/advisories/new) with a proof-of-concept, the affected version, and a suggested fix if you have one. Expect an acknowledgement within 3 business days.
