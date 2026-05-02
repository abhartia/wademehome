# ADR-0007 — Frontend security headers

**Status:** Accepted — 2026-05-02

## Context

The FastAPI backend has shipped a strict response-header middleware since
the early days of the repo
([api/src/core/security_headers.py](../../api/src/core/security_headers.py)
— `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`, opt-in CSP, opt-in
HSTS). [SECURITY.md](../../SECURITY.md) advertises these as a control.

But the API only sees JSON. The user-agent rendering the actual UI hits
the Next.js frontend, which until now had **no `headers()` config and no
header middleware**. A reviewer running `curl -I` against
`https://wademehome.com/` got back none of the controls listed in
[SECURITY.md](../../SECURITY.md):

- No `X-Frame-Options` → the marketing pages were fully iframable for
  clickjacking.
- No `X-Content-Type-Options` → MIME-sniffing attacks were possible
  against any user-content path that ends up on this origin.
- No `Referrer-Policy` → full URLs (including query strings on
  authenticated app routes) leaked via `Referer` to every outbound link
  click.
- No `Permissions-Policy` → embedded third-party scripts could request
  camera/mic/payment if they wanted.
- No `Strict-Transport-Security` → first-visit HTTP downgrade window.

This is the kind of bar a Series A reviewer pattern-matches on within
30 seconds. Fixing it on the frontend brings the deployed surface to
parity with what the backend has been advertising.

## Decision

Add a typed [`securityHeaderRules()`](../../ui/lib/security/headers.ts)
helper that returns Next.js header rules, and wire it into
[`ui/next.config.ts`](../../ui/next.config.ts) via the framework's
`async headers()` hook. Apply two rules:

1. **Baseline, all paths (`/:path*`):** `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: strict-origin-when-cross-origin`,
   `Permissions-Policy` locking down camera/mic/payment/etc.,
   `Cross-Origin-Opener-Policy: same-origin`, and (in production)
   `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
2. **Frame deny, non-embed paths only:** `X-Frame-Options: DENY` for
   every route except `/tools/<slug>/embed/**`. The embed routes exist
   so partners can iframe the calculators on third-party sites
   (see [ui/app/(marketing)/tools/move-in-cost-estimator/embed/page.tsx](../../ui/app/(marketing)/tools/move-in-cost-estimator/embed/page.tsx)
   and siblings) — sending `DENY` would silently break that
   distribution channel.

CSP stays opt-in behind `CONTENT_SECURITY_POLICY`, mirroring the
backend's pattern in `api/src/core/security_headers.py`. A wrong CSP
default would break Mapbox, GA, or PostHog before anyone notices; we
prefer "header set explicitly and reviewed" over "default that
silently broke prod."

## Alternatives considered

- **Set headers in `middleware.ts`.** Works, but `middleware.ts`
  already does auth gating and adding header logic muddles its job.
  Next's `headers()` config is the documented, statically-evaluated
  primitive — the values land in the standalone build manifest, no
  per-request middleware cost.
- **Set them at the Azure App Service edge.** Possible via
  `web.config` overrides, but couples a security control to platform
  configuration that lives outside the repo. Future infra changes
  (Cloudflare, Vercel, …) would silently lose the headers. Keeping
  them in `next.config.ts` makes the control travel with the app.
- **Ship a strict default CSP.** Tempting, but the app loads Mapbox
  tiles, Google Tag Manager, Google Analytics, PostHog (proxied) and
  several remote image origins. A default that misses one breaks the
  page in prod with no warning. Backend ADR-0001-era convention has
  CSP env-toggled; matching that here is the safer call.
- **Use `frame-ancestors 'none'` instead of `X-Frame-Options`.**
  Modern browsers prefer the CSP directive, but XFO is honoured by
  every UA and works without enabling the rest of CSP. Once CSP is
  shipped non-default, `frame-ancestors` will subsume XFO and the
  same source pattern can carry the override.

## Consequences

- Deployed UI now passes a basic security-header scan
  (`securityheaders.com`, Mozilla Observatory baseline).
- The five `/tools/*/embed/**` routes remain frameable; everything
  else is `X-Frame-Options: DENY`. Adding a new embed route is a one
  matcher change in `ui/lib/security/headers.ts` — the test asserts
  the negative lookahead is in place.
- HSTS only emits in production by default
  (`NODE_ENV === "production"`), tunable via `HSTS_ENABLED`. Local dev
  over `http://localhost` does not get a header browsers would
  ignore anyway.
- Test coverage lives at
  [ui/tests/security-headers.test.ts](../../ui/tests/security-headers.test.ts)
  and asserts both the baseline header set and the embed-path
  exception, so future refactors of the matcher fail loudly.
