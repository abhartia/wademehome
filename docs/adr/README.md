# Architecture Decision Records

Short, dated notes on decisions that are hard to undo. When you touch a subsystem and have a "wait, why did they do it *this* way?" moment, this is the first place to look.

Format: Context → Decision → Alternatives → Consequences. One page max.

| # | Title | Status |
|---|---|---|
| 0001 | [Structured logging with structlog](0001-structured-logging.md) | Accepted |
| 0002 | [slowapi for rate limiting](0002-slowapi-rate-limiting.md) | Accepted |
| 0003 | [`/v1` API prefix with legacy mirror](0003-api-v1-prefix.md) | Accepted |
| 0004 | [Self-hosted feature flags](0004-self-hosted-feature-flags.md) | Accepted |
| 0005 | [Liveness / readiness probe split](0005-liveness-readiness-split.md) | Accepted |
| 0006 | [Database connection pool hardening](0006-db-connection-hardening.md) | Accepted |
| 0007 | [Default Content-Security-Policy on the API](0007-default-content-security-policy.md) | Accepted |

## Adding a new ADR

```
docs/adr/NNNN-short-slug.md
```

Copy the nearest existing ADR as a template. Numbers are sequential; never reused.
