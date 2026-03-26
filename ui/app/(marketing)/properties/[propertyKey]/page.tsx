"use client";

import { PropertyImageGallery } from "@/components/properties/PropertyImageGallery";
import { PropertyDetailMap } from "@/components/properties/detail/PropertyDetailMap";
import { PropertyRenterInsights } from "@/components/properties/detail/PropertyRenterInsights";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNearbyListings } from "@/lib/listings/useNearbyListings";
import { useListingGeocode } from "@/lib/listings/useListingGeocode";
import { usePropertyByKey } from "@/lib/listings/usePropertyByKey";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import {
  toTourRequestPayload,
  useCreateTourRequest,
  usePropertyFavorites,
  usePropertyNote,
  useToggleFavorite,
  useUpsertPropertyNote,
} from "@/lib/properties/api";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { getCachedProperty, cacheProperty } from "@/lib/properties/propertyStorage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function amenityGroupLabel(raw: string): string {
  const s = raw.toLowerCase();
  if (/pet|dog|cat/.test(s)) return "Pets & policies";
  if (/park|garage|parking|car/.test(s)) return "Parking";
  if (/pool|gym|fitness|yoga|club/.test(s)) return "Building & community";
  if (/laundry|washer|dryer/.test(s)) return "Laundry";
  if (/util|electric|water|gas|internet|wifi/.test(s)) return "Utilities & tech";
  return "Other";
}

function groupAmenities(items: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const a of items) {
    const g = amenityGroupLabel(a);
    if (!out[g]) out[g] = [];
    out[g].push(a);
  }
  return out;
}

export default function PropertyDetailsPage() {
  const params = useParams<{ propertyKey: string | string[] }>();
  const propertyKey = useMemo(() => {
    const raw = params.propertyKey;
    const segment = Array.isArray(raw) ? raw[0] : raw;
    if (!segment) return "";
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  }, [params.propertyKey]);

  const { user, loading: authLoading } = useAuth();
  const apiEnabled = Boolean(user) && !authLoading;
  const apiBaseConfigured = isApiConfigured();

  const cached = useMemo(() => (propertyKey ? getCachedProperty(propertyKey) : null), [propertyKey]);
  const listingQuery = usePropertyByKey(propertyKey, {
    enabled: Boolean(propertyKey) && apiBaseConfigured,
  });

  useEffect(() => {
    if (listingQuery.data && propertyKey) {
      cacheProperty(propertyKey, listingQuery.data);
    }
  }, [listingQuery.data, propertyKey]);

  const property = listingQuery.data ?? cached;

  const hasRowCoords = Boolean(
    property &&
      toFiniteNumber(property.latitude) != null &&
      toFiniteNumber(property.longitude) != null,
  );
  const geoQuery = useListingGeocode(property?.address ?? "", {
    enabled: Boolean(property) && !hasRowCoords && apiBaseConfigured,
  });

  const mapLat =
    toFiniteNumber(property?.latitude) ??
    toFiniteNumber(geoQuery.data?.latitude) ??
    null;
  const mapLng =
    toFiniteNumber(property?.longitude) ??
    toFiniteNumber(geoQuery.data?.longitude) ??
    null;

  const nearbyQuery = useNearbyListings({
    mode: "radius",
    latitude: mapLat ?? 0,
    longitude: mapLng ?? 0,
    radiusMiles: 2.5,
    limit: 25,
    enabled: mapLat != null && mapLng != null && apiBaseConfigured,
  });

  const [draftNote, setDraftNote] = useState("");
  const [tourConfirmOpen, setTourConfirmOpen] = useState(false);
  const [tourRequestedDate, setTourRequestedDate] = useState("");
  const [tourRequestedTime, setTourRequestedTime] = useState("");
  const [tourRequestMessage, setTourRequestMessage] = useState("");
  const favoritesQuery = usePropertyFavorites({ enabled: apiEnabled });
  const noteQuery = usePropertyNote(propertyKey, { enabled: apiEnabled && Boolean(propertyKey) });
  const toggleFavorite = useToggleFavorite();
  const upsertNote = useUpsertPropertyNote(propertyKey);
  const createTourRequest = useCreateTourRequest();

  useEffect(() => {
    if (!apiEnabled) return;
    setDraftNote(noteQuery.data?.note?.note ?? "");
  }, [noteQuery.data?.note?.note, apiEnabled]);

  const isFavorited = useMemo(() => {
    if (!favoritesQuery.data?.favorites) return false;
    return favoritesQuery.data.favorites.some((f) => f.property_key === propertyKey);
  }, [favoritesQuery.data?.favorites, propertyKey]);

  const amenityGroups = useMemo(() => {
    if (!property) return {};
    return groupAmenities(property.amenities ?? []);
  }, [property]);

  const openTourConfirm = () => {
    setTourRequestedDate("");
    setTourRequestedTime("");
    setTourRequestMessage("");
    setTourConfirmOpen(true);
  };

  if (!propertyKey) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Property unavailable</h1>
      </main>
    );
  }

  const showLoadingShell = !property && (listingQuery.isLoading || (apiBaseConfigured && listingQuery.fetchStatus === "fetching"));
  if (showLoadingShell) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-72 w-full" />
      </main>
    );
  }

  if (!property) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Property unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          We could not load this listing. It may have been removed, or the link may be invalid. Try opening it again
          from search results.
        </p>
        {!apiBaseConfigured ? (
          <p className="mt-2 text-sm text-muted-foreground">
            The listings API URL is not configured in this environment.
          </p>
        ) : null}
      </main>
    );
  }

  const centerCoords =
    mapLat != null && mapLng != null
      ? { latitude: mapLat, longitude: mapLng }
      : { latitude: 39.8283, longitude: -98.5795 };

  const locationReady =
    mapLat != null &&
    mapLng != null &&
    (hasRowCoords || Boolean(geoQuery.isSuccess && geoQuery.data));

  const emailPreview = [
    `Property: ${property.name}`,
    `Address: ${property.address}`,
    `Requested date: ${tourRequestedDate || "Not specified"}`,
    `Requested time: ${tourRequestedTime || "Not specified"}`,
    "",
    tourRequestMessage.trim() || "No additional message provided.",
  ].join("\n");

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{property.name}</h1>
        <p className="text-muted-foreground">{property.address}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-6">
          <PropertyImageGallery property={property} variant="page" />

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{formatPropertyRangeLabel(property.rent_range)}</Badge>
            <Badge variant="secondary">{formatPropertyRangeLabel(property.bedroom_range)}</Badge>
            {(property.main_amenities ?? []).map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>

          {!user && !authLoading ? (
            <p className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                Log in
              </Link>{" "}
              or{" "}
              <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
                sign up
              </Link>{" "}
              to save this listing, add notes, and request a tour.
            </p>
          ) : null}

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {user ? (
              <Button
                onClick={async () => {
                  const response = await toggleFavorite.mutateAsync({
                    propertyKey,
                    propertyName: property.name,
                    propertyAddress: property.address,
                  });
                  toast.success(response.favorited ? "Saved to favorites" : "Removed from favorites");
                }}
              >
                {isFavorited ? "Unsave" : "Save"}
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Save</Link>
              </Button>
            )}
            {user ? (
              <Button variant="outline" onClick={openTourConfirm}>
                Request Tour
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Request Tour</Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Copied link");
              }}
            >
              Share
            </Button>
            {property.listing_url ? (
              <Button variant="outline" asChild>
                <a href={property.listing_url} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                  Original source
                </a>
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => toast.info("Contact flow coming next")}>
              Contact
            </Button>
            <Button variant="outline" onClick={() => toast.info("Added to compare shortlist")}>
              Compare
            </Button>
            <Button variant="outline" onClick={() => toast.info("Application flow coming next")}>
              Apply
            </Button>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">All amenities</h2>
            {Object.keys(amenityGroups).length === 0 ? (
              <p className="text-sm text-muted-foreground">No detailed amenity list for this listing.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(amenityGroups).map(([group, items]) => (
                  <div key={group}>
                    <h3 className="mb-2 text-sm font-medium text-foreground">{group}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((a) => (
                        <Badge key={a} variant="outline">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">Your notes</h2>
            {user ? (
              <>
                <Textarea
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder="Write your pros, cons, and follow-up questions."
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    await upsertNote.mutateAsync(draftNote);
                    toast.success("Note saved");
                  }}
                >
                  Save note
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Notes are saved to your account after you{" "}
                <Link href="/login" className="underline underline-offset-4">
                  log in
                </Link>
                .
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Location</h2>
            {!hasRowCoords && geoQuery.isLoading ? (
              <Skeleton className="mb-2 h-72 w-full rounded-lg" />
            ) : mapLat != null && mapLng != null ? (
              <PropertyDetailMap
                primary={property}
                nearby={nearbyQuery.data?.properties ?? []}
                center={centerCoords}
              />
            ) : (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Map pin needs coordinates. Configure{" "}
                  <code className="rounded bg-muted px-1">MAPBOX_ACCESS_TOKEN</code> on the API for geocoding, or
                  ensure listings include latitude and longitude.
                </CardContent>
              </Card>
            )}
            {geoQuery.isError ? (
              <p className="mt-2 text-xs text-destructive">Could not geocode this address for the map.</p>
            ) : null}
          </div>

          <PropertyRenterInsights
            property={property}
            propertyKey={propertyKey}
            mapLatitude={mapLat}
            mapLongitude={mapLng}
            nearbyProperties={nearbyQuery.data?.properties ?? []}
            locationReady={locationReady}
          />
        </aside>
      </div>
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
            <Button
              onClick={async () => {
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
              }}
              disabled={createTourRequest.isPending}
            >
              {createTourRequest.isPending ? "Sending..." : "Send Request"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}
