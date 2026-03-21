"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PropertyListingsMap } from "@/components/annotations/PropertyListings/PropertyListingsMap";
import { PropertyList } from "@/components/annotations/PropertyListings/PropertyListings";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { GuestPropertyDetailSheet } from "@/components/properties/GuestPropertyDetailSheet";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { Input } from "@/components/ui/input";
import { PublicSiteMenu } from "@/components/navigation/PublicSiteMenu";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useListingSearchStream } from "@/lib/listings/useListingSearchStream";
import { Loader2, X } from "lucide-react";

const FALLBACK_LOCATION = { latitude: 40.7128, longitude: -74.006 };

const MIN_QUERY_CHARS = 2;
/** Idle time after last keystroke before we treat the query as “settled” and search. */
const SEARCH_IDLE_MS = 850;

const SEED_LISTINGS: PropertyDataItem[] = [
  {
    name: "Hudson View Residences",
    address: "500 W 43rd St, New York, NY",
    amenities: ["Gym", "Doorman", "Laundry"],
    rent_range: "$2,850-$3,450",
    bedroom_range: "1-2 BR",
    images_urls: ["https://images.unsplash.com/photo-1460317442991-0ec209397118"],
    main_amenities: ["Gym", "Doorman"],
    latitude: 40.7592,
    longitude: -73.9942,
  },
  {
    name: "Brooklyn Heights Lofts",
    address: "35 Remsen St, Brooklyn, NY",
    amenities: ["Pet Friendly", "Roof Deck"],
    rent_range: "$2,200-$2,900",
    bedroom_range: "Studio-1 BR",
    images_urls: ["https://images.unsplash.com/photo-1480074568708-e7b720bb3f09"],
    main_amenities: ["Pet Friendly", "Roof Deck"],
    latitude: 40.6955,
    longitude: -73.9955,
  },
  {
    name: "Jersey Waterfront Apartments",
    address: "170 Greene St, Jersey City, NJ",
    amenities: ["Parking", "Gym", "Lounge"],
    rent_range: "$2,450-$3,100",
    bedroom_range: "1-2 BR",
    images_urls: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"],
    main_amenities: ["Parking", "Gym"],
    latitude: 40.7178,
    longitude: -74.0428,
  },
];

function haversineMiles(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return earthRadiusMiles * c;
}

function composeListingMessage(
  query: string,
  location: { latitude: number; longitude: number },
): string {
  const q = query.trim();
  return `${q}\n\n[System context: User's approximate browser location is latitude ${location.latitude}, longitude ${location.longitude}. Prefer listings near this area when relevant.]`;
}

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(FALLBACK_LOCATION);
  const locationRef = useRef(FALLBACK_LOCATION);
  const lastComposedSearchRef = useRef<string | null>(null);
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_IDLE_MS);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDataItem | null>(null);
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);
  const [accountHintDismissed, setAccountHintDismissed] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { phase, streamText, properties, searchHint, error, runSearch, reset } =
    useListingSearchStream();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        locationRef.current = loc;
        setLocation(loc);
      },
      () => {
        locationRef.current = FALLBACK_LOCATION;
        setLocation(FALLBACK_LOCATION);
      },
      { timeout: 5000 },
    );
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_CHARS) {
      lastComposedSearchRef.current = null;
      reset();
      return;
    }
    const composedMessage = composeListingMessage(debouncedQuery, locationRef.current);
    if (composedMessage === lastComposedSearchRef.current) {
      return;
    }
    lastComposedSearchRef.current = composedMessage;
    void runSearch({ composedMessage });
  }, [debouncedQuery, runSearch, reset]);

  useEffect(() => {
    setAccountHintDismissed(false);
  }, [debouncedQuery]);

  const seedNearby = useMemo(
    () =>
      SEED_LISTINGS.filter((listing) => {
        if (typeof listing.latitude !== "number" || typeof listing.longitude !== "number")
          return false;
        const distance = haversineMiles(location, {
          latitude: listing.latitude,
          longitude: listing.longitude,
        });
        return distance <= 15;
      }),
    [location],
  );

  const useAiSlice = debouncedQuery.length >= MIN_QUERY_CHARS;

  const nearbyListings: PropertyDataItem[] = useMemo(() => {
    if (!useAiSlice) return seedNearby;
    if (phase === "error") return [];
    return properties;
  }, [useAiSlice, seedNearby, phase, properties]);

  const showAccountHint =
    !authLoading &&
    !user &&
    useAiSlice &&
    searchHint?.suggest_account &&
    !accountHintDismissed;

  const showAiActivity = useAiSlice && (phase === "streaming" || phase === "done" || phase === "error");

  const handleSelectProperty = (property: PropertyDataItem) => {
    setSelectedProperty(property);
    setIsPropertyDetailOpen(true);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="z-20 shrink-0 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="relative">
          <div className="flex w-full items-center gap-3">
            <div className="flex items-center gap-2">
              <BrandLogo className="h-7 w-7 text-primary" />
              <span className="font-semibold text-foreground">Wade Me Home</span>
            </div>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by neighborhood, city, or building"
              className="max-w-xl"
              aria-label="Search listings"
            />
            <div className="ml-auto flex items-center gap-2">
              <PublicSiteMenu />
              <Button asChild variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>

          {useAiSlice && (showAccountHint || showAiActivity) && (
            <div
              className="pointer-events-none absolute left-0 right-0 top-full z-30 mt-2 flex max-h-[min(40vh,14rem)] flex-col gap-2 overflow-y-auto rounded-md border border-border/60 bg-background/98 p-2 shadow-lg backdrop-blur"
              aria-live="polite"
            >
              <div className="pointer-events-auto flex flex-col gap-2">
                {showAccountHint && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="flex items-start gap-3 py-3">
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-medium text-foreground">
                          Save your situation for smarter search
                        </p>
                        <p className="mt-1 text-muted-foreground">
                          {searchHint?.reason
                            ? `${searchHint.reason} `
                            : ""}
                          Create a free account to remember your preferences and use the full search
                          experience.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button asChild size="sm">
                            <Link href="/signup">Create account</Link>
                          </Button>
                          <Button asChild size="sm" variant="outline">
                            <Link href="/login">Log in</Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost">
                            <Link href="/search">Full search</Link>
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => setAccountHintDismissed(true)}
                        aria-label="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {showAiActivity && (
                  <div className="rounded-md border bg-muted/40 px-3 py-2">
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      {phase === "streaming" && (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                          <span>Searching listings with AI…</span>
                        </>
                      )}
                      {phase === "done" && <span>Latest response</span>}
                      {phase === "error" && <span className="text-destructive">Search failed</span>}
                    </div>
                    {phase === "streaming" && streamText.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Interpreting your request and querying listings…
                      </p>
                    )}
                    {streamText.length > 0 && (
                      <div className="max-h-28 overflow-y-auto text-sm leading-snug text-foreground">
                        {streamText}
                      </div>
                    )}
                    {phase === "error" && error && (
                      <p className="text-sm text-destructive">{error.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[1fr_360px]">
        <div className="min-h-0 rounded-md border">
          <PropertyListingsMap
            properties={nearbyListings}
            onSelectProperty={handleSelectProperty}
          />
        </div>
        <div className="min-h-0 overflow-y-auto rounded-md border p-2">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            {useAiSlice ? (
              <>
                {phase === "streaming" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                )}
                <span>Results ({nearbyListings.length})</span>
              </>
            ) : (
              <span>Nearby sample listings ({nearbyListings.length})</span>
            )}
          </div>
          {!useAiSlice && (
            <p className="mb-2 text-xs text-muted-foreground">
              Type at least {MIN_QUERY_CHARS} characters to search live listings with AI.
            </p>
          )}
          <PropertyList
            properties={nearbyListings}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
          />
        </div>
      </div>
      <GuestPropertyDetailSheet
        property={selectedProperty}
        open={isPropertyDetailOpen}
        onOpenChange={setIsPropertyDetailOpen}
      />
    </div>
  );
}
