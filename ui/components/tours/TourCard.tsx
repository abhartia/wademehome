"use client";

import { Tour } from "@/lib/types/tours";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { InspectionChecklist } from "./InspectionChecklist";
import {
  Calendar,
  Clock,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import { PropertyImage } from "@/components/ui/property-image";

const statusConfig: Record<
  Tour["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  scheduled: { label: "Scheduled", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  saved: { label: "Saved", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface TourCardProps {
  tour: Tour;
  onViewNotes?: () => void;
  onEditNotes?: () => void;
  onSchedule?: () => void;
  onMarkComplete?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export function TourCard({
  tour,
  onViewNotes,
  onEditNotes,
  onSchedule,
  onMarkComplete,
  onCancel,
  onRemove,
  isRemoving = false,
}: TourCardProps) {
  const { property, status, scheduledDate, scheduledTime, note } = tour;
  const cfg = statusConfig[status];

  return (
    <Card className="overflow-hidden py-0">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted sm:aspect-[4/3] sm:w-36">
          <PropertyImage
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover"
          />
          <Badge
            variant={cfg.variant}
            className="absolute top-2 left-2 text-[10px]"
          >
            {cfg.label}
          </Badge>
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 p-3">
          <div>
            <h3 className="text-sm font-semibold leading-tight">{property.name}</h3>
            <p className="text-xs text-muted-foreground">{property.address}</p>
            <div className="mt-0.5 flex items-center gap-2 text-sm">
              <span className="font-medium">{property.rent}</span>
              <span className="text-xs text-muted-foreground">{property.beds}</span>
            </div>
          </div>

          {property.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {status === "scheduled" && scheduledDate && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(scheduledDate)}
              </span>
              {scheduledTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {scheduledTime}
                </span>
              )}
            </div>
          )}

          {status === "completed" && note && (
            <div className="flex flex-wrap items-center gap-2">
              <StarRating value={note.ratings.overall} size="sm" />
              {note.wouldApply === true && (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-[10px] text-green-700"
                >
                  Would apply
                </Badge>
              )}
              {note.wouldApply === false && (
                <Badge
                  variant="outline"
                  className="border-red-200 bg-red-50 text-[10px] text-red-700"
                >
                  Would not apply
                </Badge>
              )}
            </div>
          )}

          {status === "completed" && note?.pros && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {note.pros}
            </p>
          )}

          {tour.media.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tour.media.map((m) =>
                m.mediaKind === "video" ? (
                  <video
                    key={m.id}
                    src={m.mediaUrl}
                    controls
                    preload="metadata"
                    className="h-24 w-32 rounded border bg-black object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={m.id}
                    src={m.mediaUrl}
                    alt="Tour photo"
                    className="h-24 w-24 rounded border object-cover"
                  />
                ),
              )}
            </div>
          )}

          {status === "scheduled" && <InspectionChecklist />}

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-0.5">
            {status === "saved" && (
              <>
                <Button size="sm" variant="default" onClick={onSchedule} className="h-7 gap-1 px-2.5 text-xs">
                  <CalendarPlus className="h-3 w-3" />
                  Schedule Tour
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onRemove}
                  disabled={isRemoving}
                  className="h-7 gap-1 px-2 text-xs text-destructive"
                >
                  {isRemoving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  {isRemoving ? "Removing..." : "Remove"}
                </Button>
              </>
            )}
            {status === "scheduled" && (
              <>
                <Button size="sm" variant="outline" onClick={onEditNotes} className="h-7 gap-1 px-2.5 text-xs">
                  <FileText className="h-3 w-3" />
                  Add Notes
                </Button>
                <Button size="sm" variant="default" onClick={onMarkComplete} className="h-7 gap-1 px-2.5 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Mark Complete
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 gap-1 px-2 text-xs text-destructive">
                  <XCircle className="h-3 w-3" />
                  Cancel
                </Button>
              </>
            )}
            {status === "completed" && (
              <>
                <Button size="sm" variant="outline" onClick={onViewNotes} className="h-7 gap-1 px-2.5 text-xs">
                  <FileText className="h-3 w-3" />
                  {note ? "View Notes" : "Add Notes"}
                </Button>
                <Button size="sm" variant="ghost" onClick={onEditNotes} className="h-7 gap-1 px-2 text-xs">
                  Edit Notes
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
