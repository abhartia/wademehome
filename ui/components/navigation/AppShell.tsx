"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { isMarketingPath } from "@/lib/routes/marketingPaths";
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
  const shouldUseShell = !isMarketingPath(pathname);

  useEffect(() => {
    if (!loading && shouldUseShell && !user) {
      router.replace("/login");
    }
  }, [loading, shouldUseShell, user, router]);

  if (!shouldUseShell) {
    return <main className="min-h-screen">{children}</main>;
  }
  if (loading || !user) return null;

  const pageTitle = pageTitles[pathname] ?? "";

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
