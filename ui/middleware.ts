import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  "/admin",
  "/search",
  "/tours",
  "/roommates",
  "/profile",
  "/onboarding",
  "/guarantor",
  "/move-in",
  "/landlord",
  "/property-manager",
  "/account",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("wmh_session")?.value;
  const isPublic =
    PUBLIC_PATHS.has(pathname) || pathname.startsWith("/blog/");
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Do not redirect based on cookie presence alone: invalid/stale `wmh_session` would
  // send users to /app while `/auth/me` returns 401. Logged-in routing is handled client-side
  // after session validation (see LoggedInHomeRedirect, login/signup pages).

  if (!isPublic && !isProtected) return NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
