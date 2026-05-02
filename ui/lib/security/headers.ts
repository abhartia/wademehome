/**
 * Security response headers for the Next.js frontend.
 *
 * The FastAPI backend already sets headers on its own responses
 * (api/src/core/security_headers.py), but those never reach the user-agent
 * for HTML the SPA actually renders. This module wires equivalent
 * controls into next.config.ts so every page response carries them too.
 *
 * CSP defaults to off — same opt-in pattern as the backend. Set
 * `CONTENT_SECURITY_POLICY` in the env to ship a value; an unset env
 * means no `Content-Security-Policy` header, so a too-strict default
 * can't silently break a third-party script in prod.
 */

export type HeaderRule = {
  source: string;
  headers: { key: string; value: string }[];
};

const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "cross-origin-isolated=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=(self)",
  "gyroscope=()",
  "keyboard-map=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "sync-xhr=()",
  "usb=()",
  "xr-spatial-tracking=()",
  // GPC: tell ad-tech to redact. Surface even to clients that don't honour it.
  "interest-cohort=()",
].join(", ");

// Embeds intentionally framed by third parties for distribution. Keep these
// frameable; everything else gets X-Frame-Options: DENY.
const EMBED_PATH_PATTERN = "tools/[^/]+/embed";

function commonHeaders(): { key: string; value: string }[] {
  const headers: { key: string; value: string }[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];

  // HSTS only on https deployments. Skip on dev (HSTS over http is ignored
  // by browsers anyway, but emitting it is still a smell in local dev).
  const hstsRaw = (process.env.HSTS_ENABLED ?? "").trim().toLowerCase();
  const hstsEnabled =
    hstsRaw === ""
      ? process.env.NODE_ENV === "production"
      : !["0", "false", "no"].includes(hstsRaw);
  if (hstsEnabled) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  }

  const csp = (process.env.CONTENT_SECURITY_POLICY ?? "").trim();
  if (csp) {
    headers.push({ key: "Content-Security-Policy", value: csp });
  }

  return headers;
}

export function securityHeaderRules(): HeaderRule[] {
  return [
    {
      source: "/:path*",
      headers: commonHeaders(),
    },
    {
      // Negative lookahead so /tools/<slug>/embed/** stays iframable.
      // Path-to-regexp passes the parens through to the underlying RegExp
      // engine, which Next.js compiles for header matching.
      source: `/((?!${EMBED_PATH_PATTERN}).*)`,
      headers: [{ key: "X-Frame-Options", value: "DENY" }],
    },
  ];
}
