"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { normalizePathname } from "@/lib/routes/marketingPaths";
import { useEffect } from "react";

const pageTitles: Record<string, string> = {
  "/app": "Home",
  "/search": "Search",
  "/tours": "Tours & Notes",
  "/roommates": "Roommates",
  "/profile": "Profile",
  "/onboarding": "Get Started",
  "/guarantor": "Guarantor Signing",
  "/move-in": "Move-in Hub",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const path = normalizePathname(pathname);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    if (user.onboarding_completed && path === "/onboarding") {
      router.replace("/app");
      return;
    }
    if (!user.onboarding_completed && path !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [loading, user, path, router]);

  if (loading || !user) return null;

  const pageTitle = pageTitles[path] ?? "";
  const isOnboarding = path === "/onboarding";

  if (isOnboarding) {
    return (
      <TooltipProvider>
        <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden">
          <header className="flex h-12 shrink-0 items-center border-b px-4">
            <span className="text-sm font-medium text-muted-foreground">
              {pageTitle}
            </span>
          </header>
          <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <span className="text-sm font-medium text-muted-foreground">
              {pageTitle}
            </span>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
