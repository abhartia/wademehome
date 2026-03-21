"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import {
  toTourRequestPayload,
  useCreateTourRequest,
  usePropertyFavorites,
  usePropertyNote,
  useToggleFavorite,
  useUpsertPropertyNote,
} from "@/lib/properties/api";
import { cacheProperty } from "@/lib/properties/propertyStorage";

interface PropertyDetailSheetProps {
  property: PropertyDataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PropertyDetailSheet({
  property,
  open,
  onOpenChange,
}: PropertyDetailSheetProps) {
  const propertyKey = useMemo(
    () => (property ? buildPropertyKey(property) : ""),
    [property],
  );
  const [draftNote, setDraftNote] = useState("");
  const favoritesQuery = usePropertyFavorites();
  const noteQuery = usePropertyNote(propertyKey);
  const toggleFavorite = useToggleFavorite();
  const upsertNote = useUpsertPropertyNote(propertyKey);
  const createTourRequest = useCreateTourRequest();

  const isFavorited = useMemo(() => {
    if (!favoritesQuery.data?.favorites || !propertyKey) return false;
    return favoritesQuery.data.favorites.some((f) => f.property_key === propertyKey);
  }, [favoritesQuery.data?.favorites, propertyKey]);

  useEffect(() => {
    setDraftNote(noteQuery.data?.note?.note ?? "");
  }, [noteQuery.data?.note?.note, propertyKey]);
  if (!property) return null;

  const fullDetailsPath = `/properties/${encodeURIComponent(propertyKey)}`;
  const openFullDetails = () => {
    cacheProperty(propertyKey, property);
    window.open(fullDetailsPath, "_blank", "noopener,noreferrer");
  };

  const shareListing = async () => {
    cacheProperty(propertyKey, property);
    const absoluteUrl = `${window.location.origin}${fullDetailsPath}`;
    await navigator.clipboard.writeText(absoluteUrl);
    toast.success("Copied property link");
  };

  const onSaveFavorite = async () => {
    const response = await toggleFavorite.mutateAsync({
      propertyKey,
      propertyName: property.name,
      propertyAddress: property.address,
    });
    toast.success(response.favorited ? "Saved to favorites" : "Removed from favorites");
  };

  const onSaveNote = async () => {
    await upsertNote.mutateAsync(draftNote);
    toast.success("Note saved");
  };

  const onRequestTour = async () => {
    await createTourRequest.mutateAsync(toTourRequestPayload(propertyKey, property));
    toast.success("Tour request submitted");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{property.name}</SheetTitle>
          <SheetDescription>{property.address}</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-4">
          <div className="relative h-56 w-full overflow-hidden rounded-md border bg-muted">
            {property.images_urls[0] ? (
              <Image
                src={property.images_urls[0]}
                alt={property.name}
                fill
                sizes="(max-width: 640px) 100vw, 40vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{property.bedroom_range}</Badge>
            <Badge variant="secondary">{property.rent_range}</Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Main amenities</h4>
            <div className="flex flex-wrap gap-2">
              {property.main_amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onSaveFavorite} disabled={toggleFavorite.isPending}>
              {isFavorited ? "Unsave" : "Save"}
            </Button>
            <Button variant="outline" onClick={onRequestTour} disabled={createTourRequest.isPending}>
              Request Tour
            </Button>
            <Button variant="outline" onClick={() => toast.info("Contact flow coming next")}>
              Contact
            </Button>
            <Button variant="outline" onClick={() => toast.info("Added to compare shortlist")}>
              Compare
            </Button>
            <Button variant="outline" onClick={shareListing}>
              Share
            </Button>
            <Button variant="outline" onClick={() => toast.info("Application flow coming next")}>
              Apply
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Personal notes</h4>
            <Textarea
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              placeholder="What stood out about this property?"
            />
            <Button size="sm" onClick={onSaveNote} disabled={upsertNote.isPending}>
              Save Note
            </Button>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={openFullDetails}>Open Full Details</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
