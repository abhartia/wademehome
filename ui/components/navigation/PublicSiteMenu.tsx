"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAnalyticsConsent } from "@/components/providers/AnalyticsConsentProvider";

const links = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/for-property-managers", label: "For property managers" },
  { href: "/blog", label: "Blog" },
] as const;

export function PublicSiteMenu() {
  const [open, setOpen] = useState(false);
  const { openPreferences } = useAnalyticsConsent();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-sm">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Links to legal pages, property managers, and the blog.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-4" aria-label="Site">
          {links.map(({ href, label }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {label}
              </Link>
            </SheetClose>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openPreferences();
            }}
            className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted"
          >
            Your Privacy Choices
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
