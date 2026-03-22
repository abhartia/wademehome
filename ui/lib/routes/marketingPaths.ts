/**
 * Next.js can briefly report `""` (or null) for `usePathname()` during hydration.
 * Treat that as `/` so we never mount the app shell on the real home URL.
 */
export function normalizePathname(pathname: string | null | undefined): string {
  if (pathname == null || pathname === "") return "/";
  return pathname;
}

/**
 * Routes that render without the authenticated app shell (marketing, auth, legal).
 * Keep in sync with middleware public paths where relevant.
 */
export function isMarketingPath(pathname: string | null | undefined): boolean {
  const p = normalizePathname(pathname);
  if (
    p === "/" ||
    p === "/login" ||
    p === "/signup" ||
    p === "/auth/callback" ||
    p === "/privacy" ||
    p === "/for-property-managers"
  ) {
    return true;
  }
  if (p.startsWith("/blog")) return true;
  if (p.startsWith("/auth/")) return true;
  // Public listing detail (cached from search / home); guests must not hit app-shell auth redirect.
  if (p.startsWith("/properties/")) return true;
  return false;
}
