"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LandlordSidebar } from "./LandlordSidebar";

const pageTitles: Record<string, string> = {
  "/landlord": "Landlord Dashboard",
  "/landlord/properties": "Properties",
  "/landlord/leads": "Leads",
  "/landlord/tours": "Tours",
  "/landlord/applications": "Applications",
  "/landlord/leases": "Leases",
};

export function LandlordShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-0">
        <LandlordSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <span className="text-sm font-medium text-muted-foreground">
              {pageTitles[pathname] ?? "Landlord"}
            </span>
          </header>
          <main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
