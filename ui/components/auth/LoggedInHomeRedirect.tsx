"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { normalizePathname } from "@/lib/routes/marketingPaths";

/**
 * After `/auth/me` succeeds, send logged-in users to the app.
 * Do not rely on middleware + raw cookie presence (stale cookies would show /app incorrectly).
 */
export function LoggedInHomeRedirect() {
  const pathname = usePathname();
  const path = normalizePathname(pathname);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // During hydration `usePathname()` can be ""; only redirect from the real marketing home.
    if (path !== "/") return;
    if (loading || !user) return;
    router.replace(user.onboarding_completed ? "/app" : "/onboarding");
  }, [path, loading, user, router]);

  return null;
}
