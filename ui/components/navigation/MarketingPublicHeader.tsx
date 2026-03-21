"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { PublicSiteMenu } from "@/components/navigation/PublicSiteMenu";
import { Button } from "@/components/ui/button";

export function MarketingPublicHeader() {
  return (
    <div className="flex w-full shrink-0 items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90">
        <BrandLogo className="h-7 w-7 text-primary" />
        <span className="font-semibold">Wade Me Home</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <PublicSiteMenu />
        <Button asChild variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
