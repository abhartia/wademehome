"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * After `/auth/me` succeeds, send logged-in users to the app.
 * Do not rely on middleware + raw cookie presence (stale cookies would show /app incorrectly).
 */
export function LoggedInHomeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.onboarding_completed ? "/app" : "/onboarding");
  }, [loading, user, router]);

  return null;
}
