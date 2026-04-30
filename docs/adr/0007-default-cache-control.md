# ADR-0007 — Default `Cache-Control: no-store` on API responses

**Status:** Accepted — 2026-04-30

## Context

FastAPI does not set `Cache-Control` on JSON responses. When the header is
absent, RFC 7234 lets shared caches (forward proxies, CDNs, the browser HTTP
cache) apply *heuristic* freshness — typically 10 % of the time since the
response's `Last-Modified`, capped at 24 h. For an authenticated API that
serves user-scoped data, that is a real risk:

1. **Cross-user leakage in shared caches.** Anything in front of the app
   (corporate proxy, ISP transparent cache, an over-eager CDN config) may
   store and replay a response keyed only on URL. `/properties/favorites`
   served to user A could be replayed to user B.
2. **Stale data in the browser cache.** Back/forward navigation and a
   second `fetch()` to the same URL within the heuristic freshness window
   return cached bytes, masking writes the user just made.
3. **Forensic residue.** Sensitive responses persist on disk in the
   browser's HTTP cache after logout. Common Series-A audit checklist
   item; OWASP ASVS V8.3.1 calls it out specifically.

Before this ADR, no handler in the repo set `Cache-Control` (verified with
`grep -rn "Cache-Control" api/src/`), so every response inherited heuristic
caching. The handlers that *should* be cacheable
(`/listings/sitemap-keys`, `/openapi.json`) likewise relied on that
heuristic, which is unreliable in either direction.

## Decision

Extend
[api/src/core/security_headers.py](../../api/src/core/security_headers.py)
to set `Cache-Control: no-store` on every response by default. Keep the
existing "do not overwrite handler-set headers" pattern so any endpoint
that wants to be cacheable can opt back in by setting its own
`Cache-Control` (e.g. `public, max-age=3600`).

The default is configurable via `DEFAULT_CACHE_CONTROL`. Setting it to the
empty string disables the middleware-level header entirely, which is the
escape hatch for the rare deployment where an upstream layer is already
managing cache headers.

## Alternatives considered

- **Apply only to authenticated routes.** More precise but requires the
  middleware to know which routes are protected, duplicating logic
  already in `ASGIAuthMiddleware`. The simpler default-deny shape is
  safer — handlers that *want* caching are easy to spot and opt in.
- **Use `private, no-cache, max-age=0` instead of `no-store`.** `no-cache`
  permits storage with revalidation, which is fine for `ETag`-aware
  endpoints but does not exist here. `no-store` is the strictest option
  and matches the threat model (no residue anywhere).
- **Set the header at the reverse proxy / Azure layer.** Couples app
  behaviour to infra config, invisible to local dev, easy to drift. The
  middleware approach travels with the code and is testable.

## Consequences

- Browsers, proxies, and CDNs no longer cache JSON responses unless the
  handler opts in. Cross-user leakage and post-logout residue both go
  away by default.
- Endpoints that *should* cache (sitemap keys for SEO bots, market
  snapshots for landing pages) need an explicit
  `Cache-Control: public, max-age=…` from the handler. Migrating those is
  a follow-up; today none of them set the header, so behaviour matches
  the previous heuristic-cache state from a backend-load perspective.
- The middleware preserves any handler-set value, so the migration path
  is purely additive: add the header on a route, get caching back.
- `/health` and `/ready` get `no-store` for free, which is the right
  answer for probe endpoints anyway.
- Test coverage lives at
  [api/tests/test_security_headers.py](../../api/tests/test_security_headers.py)
  and covers the default-applied, handler-preserved, and
  empty-env-disables cases.
