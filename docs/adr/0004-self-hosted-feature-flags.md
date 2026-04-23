# ADR-0004 — Self-hosted feature flags

**Status:** Accepted — 2026-04-23

## Context

We needed a way to:

1. Decouple deploys from releases (ship a half-finished feature hidden behind a flag).
2. Kill a broken feature in production without a redeploy.
3. Gradually ramp a feature to a percentage of users.
4. Allowlist specific users for internal testing.

Commercial flag services (LaunchDarkly, GrowthBook Cloud, Statsig) give all of this, but they add a vendor dependency, a monthly bill, and another "if their status page is red, we are too" risk. At our scale the abstraction is small enough to own.

## Decision

Implement feature flags in-repo:

- `feature_flags` table in Postgres with `(key, description, enabled, rollout_percent, user_allowlist, created_at, updated_at)` — migration [20260423_0001_add_feature_flags.py](../../api/alembic/versions/20260423_0001_add_feature_flags.py).
- [api/src/core/flags.py](../../api/src/core/flags.py) exposes `is_enabled(key, user_id, default)` and `evaluate_all(user_id)`.
- A 30-second in-process TTL cache keeps the hot path cheap. Flips propagate across replicas within that window.
- Environment override `FLAG_<KEY>=true|false` takes precedence — used by dev and tests.
- Rollout percentage uses a stable SHA-1 bucket keyed by `(flag_key, user_id)` so a user either always sees the flag or never does, which is what ramped rollouts actually need.
- Frontend consumes `/flags` (and `/v1/flags`), cached via React Query, exposed as a `useFlag(key)` hook.

## Alternatives considered

- **LaunchDarkly / GrowthBook Cloud**. Best-in-class, but vendor+bill+outage risk.
- **GrowthBook self-hosted**. A great project; overkill for our one table and no-UI needs. Revisit if we outgrow what `core/flags.py` can express.
- **Config-file flags**. No gradual rollout, no runtime kill switch, requires deploy to flip.

## Consequences

- We own the implementation — ~100 LOC including the migration and the React hook. Simple enough to understand in one sitting.
- Flips are persistent and auditable — `updated_at` tells you when someone toggled a flag.
- No UI yet — changes go through `psql` or an Alembic data migration. That's a feature for now (forces a paper trail); we'll add a small admin UI when the list grows past ~10 flags.
- Percentage rollouts only work for *authenticated* users. Anonymous visitors always see the `enabled && rollout>=100` variant. Acceptable because we don't yet have experiments on the anonymous marketing surface.
