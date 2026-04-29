# ADR-0007 — Default Content-Security-Policy on the API

**Status:** Accepted — 2026-04-29

## Context

The API ships every browser-relevant security header from
[api/src/core/security_headers.py](../../api/src/core/security_headers.py)
— `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Cross-Origin-Opener-Policy`, `Permissions-Policy`, and HSTS — except
one: `Content-Security-Policy`. Until this ADR the middleware shipped
``_DEFAULT_CSP = ""`` and only emitted a CSP when the operator
explicitly set `CONTENT_SECURITY_POLICY` in the environment. That
created two problems:

1. **Doc/code drift.** [SECURITY.md](../../SECURITY.md) advertised a
   CSP of "`self` + Mapbox origins only" but the running API set no
   CSP header at all. A reviewer running `curl -i` against any
   endpoint immediately spots the gap, and it reads as either a
   doc bug or a missing control. Series A diligence catches both.
2. **No defense in depth for HTML leaks.** The API only serves JSON
   in the happy path, but error envelopes, accidental redirects,
   or a future debug endpoint can return HTML. Without a CSP, any
   reflected HTML — for instance via a misrendered exception
   payload — is a candidate XSS vector. `X-Frame-Options` covers
   clickjacking but not script execution.

The opt-in default also leaked operator awareness: a fresh
deployment where nobody remembered to set the env var got zero CSP
even though SECURITY.md claimed otherwise.

## Decision

Ship a **strict default CSP** appropriate for a JSON API and skip
into a relaxed CSP only on FastAPI's interactive-docs paths.

- **Default (every JSON path):**
  `default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`.
  - `default-src 'none'` — JSON loads no resources, so blocking every
    fetch type by default is correct and breaks nothing.
  - `frame-ancestors 'none'` — modern, header-spec equivalent of
    `X-Frame-Options: DENY`; takes precedence where both are set.
  - `base-uri 'none'` and `form-action 'none'` — close two niche XSS
    sinks that show up if HTML ever leaks through (debug screens,
    custom error pages, misconfigured redirects).
- **`/docs`, `/docs/oauth2-redirect`, `/redoc` and any sub-paths:**
  a relaxed CSP that allows the Swagger UI / ReDoc bundle from
  `cdn.jsdelivr.net` and the FastAPI favicon. Without this, the
  interactive docs render blank in dev/staging.
- **Override:** `CONTENT_SECURITY_POLICY` env var still wins. An
  explicit empty string suppresses the header entirely (operator
  escape hatch while debugging a third-party integration); unset
  falls back to the strict default.

## Alternatives considered

- **Disable `/docs` in production and ship `default-src 'none'`
  unconditionally.** Cleaner CSP but loses operator value: Swagger
  UI is the fastest way to sanity-check an endpoint after a
  rotation or schema change, and it is gated behind the same auth
  middleware as everything else. Path-aware CSP keeps the docs
  alive without weakening the JSON path.
- **Ship a UI-style CSP on the API too** (`'self'` + Mapbox / images
  / unsafe-inline). The API doesn't render HTML and doesn't load
  Mapbox; copying the UI CSP here would advertise allowances that
  don't exist and confuse anyone debugging a violation.
- **Report-Only first.** The strict JSON default is a pure tighten —
  by construction it cannot break a JSON response. A report-only
  rollout adds CSP-report plumbing and a public reporting endpoint
  for no behavior gain. Skip.
- **Move the default to env config / Helm chart.** Keeping it in
  code makes the default visible to anyone reading
  [security_headers.py](../../api/src/core/security_headers.py) and
  CI-tested, which matches how the other security headers work.

## Consequences

- Every non-docs response now carries a CSP that matches what
  SECURITY.md describes. `curl -i` no longer turns up a gap.
- `/docs` and `/redoc` continue to render in dev and staging; the
  CDN allowance is scoped to those paths so the JSON surface stays
  locked down.
- Operators can still override with the env var. A deploy that
  intentionally embeds the API in another origin sets a custom
  policy; nothing forces a code change.
- Tests in
  [api/tests/test_security_headers.py](../../api/tests/test_security_headers.py)
  cover the strict default, the docs-path relaxation, the env
  override, and the empty-string disable path — so a future tweak
  can't silently regress to the old opt-in behaviour.
