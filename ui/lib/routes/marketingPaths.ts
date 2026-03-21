/**
 * Routes that render without the authenticated app shell (marketing, auth, legal).
 * Keep in sync with middleware public paths where relevant.
 */
export function isMarketingPath(pathname: string): boolean {
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/callback" ||
    pathname === "/privacy" ||
    pathname === "/for-property-managers"
  ) {
    return true;
  }
  if (pathname.startsWith("/blog")) return true;
  if (pathname.startsWith("/auth/")) return true;
  // Public listing detail (cached from search / home); guests must not hit app-shell auth redirect.
  if (pathname.startsWith("/properties/")) return true;
  return false;
}
