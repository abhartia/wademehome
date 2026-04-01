"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PropertyManagerSidebar } from "./PropertyManagerSidebar";

const pageTitles: Record<string, string> = {
  "/property-manager/analysis": "Competitive analysis",
};

function isPropertyManagerOrAdmin(role: string | undefined): boolean {
  const r = (role ?? "").trim().toLowerCase();
  return r === "property_manager" || r === "admin";
}

export function PropertyManagerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    if (!isPropertyManagerOrAdmin(user.role)) {
      router.replace("/app");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  if (!isPropertyManagerOrAdmin(user.role)) {
    return (
      <div className="mx-auto max-w-lg p-8 text-muted-foreground">
        Redirecting…
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-0">
        <PropertyManagerSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <span className="text-sm font-medium text-muted-foreground">
              {pageTitles[pathname] ?? "Property manager"}
            </span>
          </header>
          <main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
