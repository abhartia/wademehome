"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { PropertyDetailMap } from "@/components/properties/detail/PropertyDetailMap";
import { PropertyRenterInsights } from "@/components/properties/detail/PropertyRenterInsights";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNearbyListings } from "@/lib/listings/useNearbyListings";
import { useListingGeocode } from "@/lib/listings/useListingGeocode";
import { usePropertyByKey } from "@/lib/listings/usePropertyByKey";
import { getListingsApiBase } from "@/lib/listings/listingsApi";
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
import { Building2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const apiBaseConfigured = Boolean(getListingsApiBase());

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
    latitude: mapLat ?? 0,
    longitude: mapLng ?? 0,
    radiusMiles: 2.5,
    limit: 25,
    enabled: mapLat != null && mapLng != null && apiBaseConfigured,
  });

  const [draftNote, setDraftNote] = useState("");
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{property.name}</h1>
        <p className="text-muted-foreground">{property.address}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-6">
          <PropertyImageGallery property={property} />

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
              <Button
                variant="outline"
                onClick={async () => {
                  await createTourRequest.mutateAsync(toTourRequestPayload(propertyKey, property));
                  toast.success("Tour request submitted");
                }}
              >
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
    </main>
  );
}

function PropertyImageGallery({ property }: { property: PropertyDataItem }) {
  const urls = property.images_urls?.filter(Boolean) ?? [];
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  if (urls.length === 0) {
    return (
      <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
        <Building2 className="h-16 w-16 text-muted-foreground/40" aria-hidden />
      </div>
    );
  }

  const [hero, ...rest] = urls;

  return (
    <div className="space-y-3">
      <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-muted">
        {!failed[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary listing CDNs
          <img
            src={hero}
            alt={property.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
            onError={() => setFailed((f) => ({ ...f, 0: true }))}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Building2 className="h-14 w-14 opacity-40" />
          </div>
        )}
      </div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {rest.map((src, i) => {
            const idx = i + 1;
            return (
              <div key={`${src}-${idx}`} className="relative aspect-[4/3] overflow-hidden rounded-md border bg-muted">
                {!failed[idx] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed((f) => ({ ...f, [idx]: true }))}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground/35" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
