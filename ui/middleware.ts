import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MIDDLEWARE_PATHNAME_HEADER } from "@/lib/middlewareHeaders";

function nextWithPathname(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(MIDDLEWARE_PATHNAME_HEADER, pathname);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/signup",
  "/privacy",
  "/auth/callback",
  "/auth/verify-email",
  "/for-property-managers",
  "/blog",
]);
const PROTECTED_PREFIXES = [
  "/app",
  "/search",
  "/tours",
  "/roommates",
  "/profile",
  "/onboarding",
  "/guarantor",
  "/move-in",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("wmh_session")?.value;
  const isPublic =
    PUBLIC_PATHS.has(pathname) || pathname.startsWith("/blog/");
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Do not redirect based on cookie presence alone: invalid/stale `wmh_session` would
  // send users to /app while `/auth/me` returns 401. Logged-in routing is handled client-side
  // after session validation (see LoggedInHomeRedirect, login/signup pages).

  if (!isPublic && !isProtected) return nextWithPathname(request, pathname);
  return nextWithPathname(request, pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
