"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Button } from "@/components/ui/button";
import { PublicSiteMenu } from "@/components/navigation/PublicSiteMenu";

/**
 * Slim header for public listing pages (no authenticated app shell).
 * Matches guest home branding without the full marketing hero chrome.
 */
export function PublicListingTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-md text-foreground outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo className="h-7 w-7 shrink-0 text-primary" />
          <span className="truncate font-semibold tracking-tight">Wade Me Home</span>
        </Link>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground sm:inline-flex">
            <Link href="/">Search homes</Link>
          </Button>
          <PublicSiteMenu />
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
