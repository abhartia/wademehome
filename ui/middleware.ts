import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/signup",
  "/privacy",
  "/auth/callback",
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

  if (session && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (!isPublic && !isProtected) return NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
