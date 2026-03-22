"use client";

import { AppShell } from "@/components/navigation/AppShell";

/**
 * App-area routes only (`/app`, `/search`, …). Never wraps `/` or auth pages — same pattern as wadecv `(dashboard)`.
 */
export default function AppAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
