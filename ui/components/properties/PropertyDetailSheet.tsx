"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PropertyImageGallery } from "@/components/properties/PropertyImageGallery";
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
  const [tourConfirmOpen, setTourConfirmOpen] = useState(false);
  const [tourRequestedDate, setTourRequestedDate] = useState("");
  const [tourRequestedTime, setTourRequestedTime] = useState("");
  const [tourRequestMessage, setTourRequestMessage] = useState("");

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

  const onRequestTour = () => {
    setTourRequestedDate("");
    setTourRequestedTime("");
    setTourRequestMessage("");
    setTourConfirmOpen(true);
  };

  const onConfirmSendTourRequest = async () => {
    try {
      await createTourRequest.mutateAsync({
        ...toTourRequestPayload(propertyKey, property),
        requested_date: tourRequestedDate || null,
        requested_time: tourRequestedTime || null,
        request_message: tourRequestMessage.trim() || null,
      });
      toast.success("Tour request sent");
      setTourConfirmOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send tour request";
      toast.error(message);
    }
  };

  const emailPreview = [
    `Property: ${property.name}`,
    `Address: ${property.address}`,
    `Requested date: ${tourRequestedDate || "Not specified"}`,
    `Requested time: ${tourRequestedTime || "Not specified"}`,
    "",
    tourRequestMessage.trim() || "No additional message provided.",
  ].join("\n");

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{property.name}</SheetTitle>
          <SheetDescription>{property.address}</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-4">
          <PropertyImageGallery property={property} variant="sheet" />

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formatPropertyRangeLabel(property.bedroom_range)}
            </Badge>
            <Badge variant="secondary">{formatPropertyRangeLabel(property.rent_range)}</Badge>
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
      <Sheet open={tourConfirmOpen} onOpenChange={setTourConfirmOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Confirm tour request email</SheetTitle>
            <SheetDescription>
              Review and edit the request before sending to our tour operations inbox.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Preferred date</label>
                <Input
                  type="date"
                  value={tourRequestedDate}
                  onChange={(event) => setTourRequestedDate(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Preferred time</label>
                <Input
                  type="time"
                  value={tourRequestedTime}
                  onChange={(event) => setTourRequestedTime(event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Message</label>
              <Textarea
                value={tourRequestMessage}
                onChange={(event) => setTourRequestMessage(event.target.value)}
                placeholder="Any details for scheduling, availability, or access?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email preview</label>
              <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs">
                {emailPreview}
              </pre>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setTourConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirmSendTourRequest} disabled={createTourRequest.isPending}>
              {createTourRequest.isPending ? "Sending..." : "Send Request"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
