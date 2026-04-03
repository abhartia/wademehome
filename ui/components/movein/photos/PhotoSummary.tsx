"use client";

import { Camera, ImageIcon, LayoutGrid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PhotoDocumentationSummary } from "@/lib/types/movein";

interface Props {
  summary: PhotoDocumentationSummary | null;
}

export function PhotoSummary({ summary }: Props) {
  if (!summary || (summary.roomCount === 0 && summary.totalPhotos === 0)) return null;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-6 p-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{summary.roomCount}</span>{" "}
            {summary.roomCount === 1 ? "room" : "rooms"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-semibold">{summary.totalPhotos}</span>{" "}
            {summary.totalPhotos === 1 ? "photo" : "photos"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Timestamped and geotagged for deposit protection
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
