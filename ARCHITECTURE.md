# Architecture

A map of how the system fits together. If you want to modify a subsystem, start by reading the section on it here, then the code.

## Services

The repo ships a small deployment surface:

- **`api/`** — FastAPI backend exposing REST endpoints, an agentic chat workflow, and ingest glue.
- **`ui/`** — Next.js 15 App Router frontend. Uses server components for SEO pages and React Query on the client for interactive views.
- **Ingest scripts** — `scripts/` holds scrapers, loaders, and backfills (ad-hoc but tracked in the DB via `ingest_runs`).

Everything runs against a single PostgreSQL database. There is no cache tier; hot reads use in-process LRU+TTL caches (see [api/src/listings/](api/src/listings/)).

## Request lifecycle

Every HTTP request passes through this stack (outermost first):

```
RequestContext   -> generates/propagates X-Request-Id, binds contextvars
  SecurityHeaders -> CSP, nosniff, frame-deny, HSTS, permissions-policy
    CORS           -> allowlist from CORS_ALLOWED_ORIGINS
      MaxBodySize   -> 413 on Content-Length > MAX_REQUEST_BYTES
        Auth         -> token validation on protected prefixes
          FastAPI    -> routing -> dependency injection -> handler
                         -> slowapi rate limit (per-handler)
```

Code: [api/src/main.py](api/src/main.py) composes this. Each middleware lives in `api/src/core/`.

## Observability

- **Logging**: structlog emits JSON in prod (`LOG_FORMAT=json`), pretty in dev. Every line carries `request_id` and (when available) `user_id`.
- **Error tracking**: Sentry SDK is wired but no-op unless `SENTRY_DSN` is set. See [api/src/core/observability.py](api/src/core/observability.py).
- **Tracing**: OpenTelemetry SDK writes to stdout when `OTEL_CONSOLE_EXPORTER=1`, or to a collector when `OTEL_EXPORTER_OTLP_ENDPOINT` is set. FastAPI + SQLAlchemy are auto-instrumented.
- **LLM tracing**: Langfuse captures prompts/completions when its credentials are set; otherwise it's bypassed.

## Data model

Alembic migrations are versioned `YYYYMMDD_NNNN_description.py` under [api/alembic/versions/](api/alembic/versions/). They are append-only — never edit a released migration.

Highlights:

- **`listings`** — the canonical unit-level record; populated by multiple scrapers. The table name and schema are configurable via `LISTINGS_TABLE_NAME` / `LISTINGS_TABLE_SCHEMA` so test/prod can differ without code changes.
- **`listing_amenities`** — normalized (listing_id, amenity, source) triples with an embedding column for semantic amenity lookups.
- **`feature_flags`** — self-hosted flags with `(key, enabled, rollout_percent, user_allowlist)`. Evaluated by [api/src/core/flags.py](api/src/core/flags.py) with a 30-second in-process cache.
- **`ingest_runs`** — every scrape/backfill logs start, watermark, and outcome here.

## Agent workflow

`/listings/chat` accepts a chat history and streams SSE back. Flow:

1. FastAPI handler in [api/src/main.py](api/src/main.py) builds a `ListingFetcherWorkflow`.
2. The workflow is a LlamaIndex multi-agent graph with a router and specialists (search, filter, rank). See [api/src/workflow/](api/src/workflow/) and [api/src/agent/](api/src/agent/).
3. Tool calls hit SQL, vector search, and Mapbox.
4. Events stream over the protocol expected by `@llamaindex/chat-ui` on the client.

Timeouts are explicit (120 s on the outer workflow). Errors terminate the stream cleanly and surface via the standard error envelope.

## Deploy topology

Production is Azure App Service with slot swaps:

- Two container images (`backend`, `frontend`) pushed to ACR.
- GitHub Actions deploys each to the `staging` slot, polls `/health` until ready, then swaps into production.
- Rollback = swap slots back. See [.github/workflows/azure-appservice-cicd.yml](.github/workflows/azure-appservice-cicd.yml) and [RUNBOOK.md](RUNBOOK.md).

## Security boundaries

- Input validation at the edge via Pydantic + hand-rolled bbox / rent-range checks.
- Bearer token (or `X-API-Token`) auth on protected routes. Cookie sessions for the Next.js app are carried over the same auth path.
- Rate limiting per authenticated user (fallback: per IP) via slowapi.
- See [SECURITY.md](SECURITY.md) for the full threat model.

## Where things live

| Concern | Path |
|---|---|
| ASGI middlewares | [api/src/core/](api/src/core/) |
| Domain routers | `api/src/<domain>/router.py` (auth, listings, properties, landlord…) |
| Feature flags | [api/src/core/flags.py](api/src/core/flags.py), [api/src/flags/router.py](api/src/flags/router.py) |
| Agent workflow | [api/src/workflow/](api/src/workflow/), [api/src/agent/](api/src/agent/) |
| Migrations | [api/alembic/versions/](api/alembic/versions/) |
| Ingest | [scripts/](scripts/) + [api/src/ingest/](api/src/ingest/) |
| Frontend pages | [ui/app/](ui/app/) |
| Frontend components | [ui/components/](ui/components/) |
| E2E tests | [ui/tests/e2e/](ui/tests/e2e/) |

## ADRs

Significant decisions are captured as one-page [Architecture Decision Records](docs/adr/). Current ADRs:

- [ADR-0001 — Structured logging with structlog](docs/adr/0001-structured-logging.md)
- [ADR-0002 — slowapi for rate limiting](docs/adr/0002-slowapi-rate-limiting.md)
- [ADR-0003 — `/v1` API prefix with legacy mirror](docs/adr/0003-api-v1-prefix.md)
- [ADR-0004 — Self-hosted feature flags](docs/adr/0004-self-hosted-feature-flags.md)
- [ADR-0005 — Liveness / readiness probe split](docs/adr/0005-liveness-readiness-split.md)
