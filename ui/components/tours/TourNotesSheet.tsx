"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "./StarRating";
import { useTours } from "@/components/providers/ToursProvider";
import { Tour, TourNote, TourRatings, defaultNote } from "@/lib/types/tours";
import { PHOTO_CHECKLIST_ITEMS } from "@/lib/mock/tours";
import { FileText, Camera, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyImage } from "@/components/ui/property-image";

interface TourNotesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tour: Tour | null;
  readOnly?: boolean;
}

export function TourNotesSheet({
  open,
  onOpenChange,
  tour,
  readOnly = false,
}: TourNotesSheetProps) {
  const { updateNote } = useTours();
  const [note, setNote] = useState<TourNote>({ ...defaultNote });

  useEffect(() => {
    if (tour?.note) {
      setNote({ ...tour.note });
    } else {
      setNote({ ...defaultNote, ratings: { ...defaultNote.ratings } });
    }
  }, [tour]);

  if (!tour) return null;

  const setRating = (key: keyof TourRatings, val: number) => {
    setNote((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [key]: val },
    }));
  };

  const togglePhotoItem = (item: string) => {
    setNote((prev) => ({
      ...prev,
      photoChecklist: prev.photoChecklist.includes(item)
        ? prev.photoChecklist.filter((i) => i !== item)
        : [...prev.photoChecklist, item],
    }));
  };

  const setWouldApply = (val: boolean | null) => {
    setNote((prev) => ({
      ...prev,
      wouldApply: prev.wouldApply === val ? null : val,
    }));
  };

  const handleSave = () => {
    updateNote(tour.id, note);
    onOpenChange(false);
  };

  const { property } = tour;

  const ratingFields: { key: keyof TourRatings; label: string }[] = [
    { key: "overall", label: "Overall" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "naturalLight", label: "Natural light" },
    { key: "noiseLevel", label: "Noise level" },
    { key: "condition", label: "Condition" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Tour Notes
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {/* Property header */}
          <div className="flex items-center gap-3 rounded-lg border p-2.5">
            <PropertyImage
              src={property.image}
              alt={property.name}
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{property.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {property.address}
              </p>
              <p className="text-xs text-muted-foreground">
                {property.rent} · {property.beds}
              </p>
            </div>
          </div>

          {/* Star ratings */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ratings
            </h4>
            <div className="space-y-1.5">
              {ratingFields.map(({ key, label }) => (
                <StarRating
                  key={key}
                  label={label}
                  value={note.ratings[key]}
                  onChange={readOnly ? undefined : (v) => setRating(key, v)}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Would apply */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Would you apply?
            </h4>
            <div className="flex gap-1.5">
              {(
                [
                  { val: true, label: "Yes" },
                  { val: null, label: "Maybe" },
                  { val: false, label: "No" },
                ] as const
              ).map(({ val, label }) => (
                <Badge
                  key={label}
                  variant={note.wouldApply === val ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-3 py-1 text-xs transition-colors",
                    readOnly && "pointer-events-none",
                    note.wouldApply !== val && "hover:bg-muted",
                  )}
                  onClick={() => !readOnly && setWouldApply(val)}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Free-text sections */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pros
              </label>
              <Textarea
                placeholder="What did you like about this place?"
                value={note.pros}
                onChange={(e) =>
                  setNote((prev) => ({ ...prev, pros: e.target.value }))
                }
                readOnly={readOnly}
                rows={2}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cons
              </label>
              <Textarea
                placeholder="What didn't you like?"
                value={note.cons}
                onChange={(e) =>
                  setNote((prev) => ({ ...prev, cons: e.target.value }))
                }
                readOnly={readOnly}
                rows={2}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                General notes
              </label>
              <Textarea
                placeholder="Anything else worth remembering..."
                value={note.generalNotes}
                onChange={(e) =>
                  setNote((prev) => ({
                    ...prev,
                    generalNotes: e.target.value,
                  }))
                }
                readOnly={readOnly}
                rows={3}
                className="text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Photo checklist */}
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Camera className="h-3.5 w-3.5" />
              Photo checklist
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Check off items you photographed during the tour.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PHOTO_CHECKLIST_ITEMS.map((item) => {
                const isChecked = note.photoChecklist.includes(item);
                return (
                  <Badge
                    key={item}
                    variant={isChecked ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-2.5 py-1 text-[11px] transition-colors",
                      readOnly && "pointer-events-none",
                      !isChecked && "hover:bg-muted",
                    )}
                    onClick={() => !readOnly && togglePhotoItem(item)}
                  >
                    {item}
                  </Badge>
                );
              })}
            </div>
          </div>

          {!readOnly && (
            <Button className="w-full gap-1.5" size="sm" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" />
              Save Notes
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
