"use client";

import Link from "next/link";
import { GuestMoveInChecklist } from "@/components/landing/GuestMoveInChecklist";
import { GuestPhotoDocsCTA } from "@/components/landing/GuestPhotoDocsCTA";
import { GuestVendorBrowser } from "@/components/landing/GuestVendorBrowser";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function GuestMoveInClient() {
  return (
    <div className="grid min-h-0 flex-1 gap-2 p-2 sm:gap-3 sm:p-3 lg:grid-cols-[1fr_minmax(280px,340px)]">
      {/* Left column: main content */}
      <div className="min-h-0 space-y-4 overflow-y-auto rounded-lg border border-border/80 bg-background p-3 shadow-sm sm:p-4">
        <GuestMoveInChecklist />

        <Separator />

        <GuestPhotoDocsCTA />

        <Separator />

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Your free account picks up where you left off
            </CardTitle>
            <CardDescription className="text-xs">
              Your free account saves checklist progress, vendor selections,
              move-in photos, and picks up where you left off on your next
              move.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 pt-0">
            <Button asChild size="sm">
              <Link href="/signup">Create free account</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right column: vendor sidebar */}
      <div className="min-h-0 overflow-y-auto rounded-lg border border-border/80 bg-background p-3 shadow-sm">
        <GuestVendorBrowser />
      </div>
    </div>
  );
}
