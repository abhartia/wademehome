"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { PublicSiteMenu } from "@/components/navigation/PublicSiteMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LandingTab = "search" | "movein";

interface SharedLandingHeaderProps {
  activeTab: LandingTab;
  onTabChange: (tab: LandingTab) => void;
}

export function SharedLandingHeader({ activeTab, onTabChange }: SharedLandingHeaderProps) {
  return (
    <header className="relative z-50 shrink-0 border-b border-border/70 bg-background px-3 py-2.5 sm:px-4">
      <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex shrink-0 items-center gap-2">
          <BrandLogo className="h-7 w-7 shrink-0 text-primary" />
          <span className="hidden font-semibold text-foreground sm:inline">
            Wade Me Home
          </span>
        </div>
        <span className="hidden h-6 w-px shrink-0 bg-border/90 sm:block" aria-hidden />
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTab === "search"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => onTabChange("search")}
          >
            Find apartments
          </button>
          <button
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeTab === "movein"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => onTabChange("movein")}
          >
            Plan your move
          </button>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <PublicSiteMenu />
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
