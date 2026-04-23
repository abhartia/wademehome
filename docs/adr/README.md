# Architecture Decision Records

Short, dated notes on decisions that are hard to undo. When you touch a subsystem and have a "wait, why did they do it *this* way?" moment, this is the first place to look.

Format: Context → Decision → Alternatives → Consequences. One page max.

| # | Title | Status |
|---|---|---|
| 0001 | [Structured logging with structlog](0001-structured-logging.md) | Accepted |
| 0002 | [slowapi for rate limiting](0002-slowapi-rate-limiting.md) | Accepted |
| 0003 | [`/v1` API prefix with legacy mirror](0003-api-v1-prefix.md) | Accepted |
| 0004 | [Self-hosted feature flags](0004-self-hosted-feature-flags.md) | Accepted |

## Adding a new ADR

```
docs/adr/NNNN-short-slug.md
```

Copy the nearest existing ADR as a template. Numbers are sequential; never reused.
