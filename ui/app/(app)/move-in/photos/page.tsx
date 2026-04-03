"use client";

import Link from "next/link";
import { ArrowLeft, Camera, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhotoRoomList } from "@/components/movein/photos/PhotoRoomList";
import { PhotoSummary } from "@/components/movein/photos/PhotoSummary";
import { PhotoExportView } from "@/components/movein/photos/PhotoExportView";
import { usePhotoDocumentation } from "@/lib/hooks/usePhotoDocumentation";

export default function MoveInPhotosPage() {
  const { summary } = usePhotoDocumentation();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/move-in">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back to Move-in Hub
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Move-In Photo Documentation</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Photograph every room on move-in day to create a timestamped, geotagged record
          of your apartment&apos;s condition. This protects your security deposit if your
          landlord tries to charge you for pre-existing damage.
        </p>
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Why this matters</p>
          <p className="text-xs text-muted-foreground">
            Security deposit disputes are the most common landlord-tenant conflict.
            California now legally requires timestamped move-in photos (AB 2801). Even
            where not legally required, documented condition evidence is your strongest
            protection against unfair deductions of $500&ndash;$2,000+.
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <PhotoSummary summary={summary} />

      <Separator />

      {/* Room list */}
      <PhotoRoomList />

      <Separator />

      {/* Export */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Condition report</p>
          <p className="text-xs text-muted-foreground">
            Generate a printable PDF of all photos with timestamps and notes.
          </p>
        </div>
        <PhotoExportView />
      </div>
    </div>
  );
}
