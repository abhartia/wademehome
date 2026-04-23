# ADR-0001 — Structured logging with structlog

**Status:** Accepted — 2026-04-23

## Context

Early logs were stdlib `logging` with a `%s`-style formatter. That's fine when you're tailing a single process, but it doesn't survive the journey into a log aggregator: you can't filter by `user_id`, correlate a request across services, or build a dashboard off log events. The site is small today but will grow past what `grep` can handle.

## Decision

Adopt [`structlog`](https://www.structlog.org/) for all backend logging. Emit JSON in production (triggered by `LOG_FORMAT=json`) and human-readable output in dev. Every log line is automatically enriched with `request_id` and `user_id` via `contextvars`.

Key pieces:

- [api/src/core/logger.py](../../api/src/core/logger.py) configures structlog on import. `get_logger(__name__)` continues to return a logger with the old API so existing call sites don't change.
- [api/src/core/request_context.py](../../api/src/core/request_context.py) owns the `ContextVar`s. `RequestContextMiddleware` is the outermost ASGI wrapper, ensuring the IDs are set before any downstream handler runs.

## Alternatives considered

- **Stay on stdlib `logging`** with a custom JSON formatter. Works, but we'd end up reimplementing structlog's contextvar integration badly.
- **Loguru**. Nicer DX, but less common in "production-ish" Python and it fights stdlib integration.
- **OpenTelemetry logs**. Attractive but still maturing; current OTel logging SDKs in Python are not as stable as traces. Revisit in a year.

## Consequences

- Every log line now has stable keys: `request_id`, `user_id`, `event`, `level`, `timestamp`.
- Log aggregators (Grafana Loki, Datadog, ELK) can index these fields without custom parsers.
- When Sentry is enabled, events automatically pick up the same tags via `before_send` in [api/src/core/observability.py](../../api/src/core/observability.py).
- Downside: old `logger.info("foo %s", bar)` calls still work but don't get the structured fields. New call sites should pass kwargs: `logger.info("foo", bar=bar)`.
