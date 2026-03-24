"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { normalizePathname } from "@/lib/routes/marketingPaths";

/**
 * After `/auth/me` succeeds, send logged-in users to the app.
 * Do not rely on middleware + raw cookie presence (stale cookies would show /app incorrectly).
 */
export function LoggedInHomeRedirect() {
  const pathname = usePathname();
  const path = normalizePathname(pathname);
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // During hydration `usePathname()` can be ""; only redirect from the real marketing home.
    if (path !== "/") return;
    if (loading || !user) return;
    if (!user.onboarding_completed) {
      router.replace("/onboarding");
      return;
    }
    const q = (searchParams.get("q") ?? "").trim();
    if (q.length > 0) {
      router.replace(`/search?q=${encodeURIComponent(q)}`);
      return;
    }
    router.replace("/app");
  }, [path, loading, user, router, searchParams]);

  return null;
}
