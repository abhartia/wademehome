"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { GuestHomeListingChatRuntime } from "@/app/GuestHomeListingChatRuntime";
import {
  DEFAULT_NEARBY_LIMIT,
  DEFAULT_NEARBY_RADIUS_MILES,
  useNearbyListings,
} from "@/lib/listings/useNearbyListings";
import type {
  ListingSearchPhase,
  ListingSearchStreamApi,
} from "@/lib/listings/useListingSearchStream";
import { DEFAULT_BROWSE_MAP_CENTER } from "@/lib/map/defaultBrowseCenter";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { NearbyListingsResponse } from "@/lib/listings/useNearbyListings";

/** Default map + SQL browse center for guests (not the browser geolocation). */
const GUEST_BROWSE_MAP_CENTER = { latitude: 40.7128, longitude: -74.006 };

const MIN_QUERY_CHARS = 2;

const EMPTY_PROPERTY_LIST: PropertyDataItem[] = [];

function composeListingMessage(
  query: string,
  location: { latitude: number; longitude: number },
): string {
  const q = query.trim();
  return `${q}\n\n[System context: User's approximate browser location is latitude ${location.latitude}, longitude ${location.longitude}. Prefer listings near this area when relevant.]`;
}

function stripGeoSuffix(content: string): string {
  return content.replace(/\n\n\[System context:[\s\S]*$/u, "").trim();
}

function NearbyListingsHeaderLine({
  nearbyQuery,
}: {
  nearbyQuery: UseQueryResult<NearbyListingsResponse, Error>;
}) {
  const awaitingData =
    nearbyQuery.isPending ||
    (nearbyQuery.isFetching && nearbyQuery.data === undefined && !nearbyQuery.isError);

  if (awaitingData) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
        <span className="text-muted-foreground">Loading nearby listings…</span>
      </>
    );
  }
  if (nearbyQuery.isError) {
    return <span className="text-destructive">Couldn&apos;t load nearby listings</span>;
  }
  const d = nearbyQuery.data;
  if (!d) {
    return <span className="text-muted-foreground">No nearby listings to show</span>;
  }
  const rm = Number.isInteger(d.radius_miles) ? String(d.radius_miles) : d.radius_miles.toFixed(1);
  if (d.used_global_nearest_fallback) {
    return (
      <span className="text-muted-foreground">
        None within {rm} mi of map center — showing {d.properties.length} closest (pins may be far away).
      </span>
    );
  }
  return (
    <span className="text-muted-foreground">
      {d.properties.length} of {d.total_in_radius} within {rm} miles of map center
    </span>
  );
}

type GuestHomeSearchInnerProps = {
  listingChat: ListingSearchStreamApi | null;
  listingSessionActive: boolean;
  listingPhase: ListingSearchPhase;
  query: string;
  setQuery: (value: string) => void;
  nearbyQuery: UseQueryResult<NearbyListingsResponse, Error>;
  selectedProperty: PropertyDataItem | null;
  setSelectedProperty: (p: PropertyDataItem | null) => void;
  isPropertyDetailOpen: boolean;
  setIsPropertyDetailOpen: (open: boolean) => void;
  accountHintDismissed: boolean;
  setAccountHintDismissed: (v: boolean) => void;
  assistantExpanded: boolean;
  setAssistantExpanded: (v: boolean) => void;
  submitSearchNow: () => void;
};

function GuestHomeSearchInner({
  listingChat,
  listingSessionActive,
  listingPhase,
  query,
  setQuery,
  nearbyQuery,
  selectedProperty,
  setSelectedProperty,
  isPropertyDetailOpen,
  setIsPropertyDetailOpen,
  accountHintDismissed,
  setAccountHintDismissed,
  assistantExpanded,
  setAssistantExpanded,
  submitSearchNow,
}: GuestHomeSearchInnerProps) {
  const messages = useMemo(() => listingChat?.messages ?? [], [listingChat]);
  const phase = listingChat?.phase ?? "idle";
  const streamText = listingChat?.streamText ?? "";
  const properties = useMemo(() => listingChat?.properties ?? [], [listingChat]);
  const searchHint = listingChat?.searchHint ?? null;
  const searchSummary = listingChat?.searchSummary ?? null;
  const searchStats = listingChat?.searchStats ?? null;
  const error = listingChat?.error ?? null;

  const nearbyProperties = nearbyQuery.data?.properties ?? EMPTY_PROPERTY_LIST;

  const useAiSlice = listingSessionActive;

  const displaySearchSummary = useMemo(() => {
    if (searchSummary && (searchSummary.headline || searchSummary.bullets.length > 0)) {
      return searchSummary;
    }
    const bullets = messages
      .filter((m) => m.role === "user")
      .map((m) => stripGeoSuffix(String(m.content ?? "")))
      .filter(Boolean)
      .slice(-5);
    if (bullets.length === 0) return null;
    return { headline: "What we're using for this search", bullets };
  }, [searchSummary, messages]);

  const assistantFullText = streamText.trim();
  const assistantHasQuestion = assistantFullText.includes("?");
  const assistantNeedsExpand = assistantFullText.length > 400;

  const lastAiListingsRef = useRef<PropertyDataItem[]>([]);

  useEffect(() => {
    if (properties.length > 0) {
      lastAiListingsRef.current = properties;
    }
  }, [properties]);

  useEffect(() => {
    if (!useAiSlice) {
      lastAiListingsRef.current = [];
    }
  }, [useAiSlice]);

  const nearbyListings: PropertyDataItem[] = useMemo(() => {
    if (!useAiSlice) return nearbyProperties;
    if (properties.length > 0) return properties;
    if (phase === "streaming" || phase === "idle") {
      return lastAiListingsRef.current.length > 0 ? lastAiListingsRef.current : nearbyProperties;
    }
    if (phase === "error" || phase === "done") {
      return lastAiListingsRef.current.length > 0 ? lastAiListingsRef.current : nearbyProperties;
    }
    return nearbyProperties;
  }, [useAiSlice, nearbyProperties, phase, properties]);

  const showingSearchPins = useAiSlice && properties.length > 0;

  const showAccountHint =
    useAiSlice && searchHint?.suggest_account && !accountHintDismissed;

  const showAiActivity =
    useAiSlice && (phase === "streaming" || phase === "done" || phase === "error");

  const handleSelectProperty = useCallback((property: PropertyDataItem) => {
    setSelectedProperty(property);
    setIsPropertyDetailOpen(true);
  }, [setSelectedProperty, setIsPropertyDetailOpen]);

  return (
    <>
      <div className="grid min-h-0 flex-1 gap-2 p-2 sm:gap-3 sm:p-3 lg:grid-cols-[1fr_minmax(280px,340px)]">
        <div className="relative min-h-0 overflow-hidden rounded-lg border border-border/80 bg-muted/10 shadow-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-2 sm:p-3">
            <div className="pointer-events-auto relative mx-auto w-full max-w-xl sm:mx-0">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    submitSearchNow();
                  }}
                  placeholder="Neighborhood, city, or building — press Enter or Search"
                  className="bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80"
                  aria-label="Search listings"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="shrink-0 shadow-md"
                  onClick={submitSearchNow}
                  disabled={
                    query.trim().length < MIN_QUERY_CHARS ||
                    (listingSessionActive && listingPhase === "streaming")
                  }
                  aria-label={listingSessionActive ? "Update search" : "Search"}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {useAiSlice && (
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Press <span className="font-medium text-foreground">Enter</span> or tap{" "}
                  <span className="font-medium text-foreground">Search</span> to run a query. Fewer
                  than {MIN_QUERY_CHARS} characters in the box resets your session.
                </p>
              )}
              {useAiSlice && (showAccountHint || showAiActivity) && (
                <div
                  className="pointer-events-none absolute left-0 right-0 top-full z-30 mt-2 flex max-h-[min(55vh,26rem)] flex-col gap-2 rounded-md border border-border/60 bg-background/98 p-2 shadow-lg backdrop-blur"
                  aria-live="polite"
                >
                  <div className="pointer-events-auto flex min-h-0 flex-col gap-2">
                    {showAiActivity && (
                      <div className="max-h-[min(40vh,15rem)] min-h-0 overflow-y-auto rounded-md border bg-muted/40 px-3 py-2">
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          {phase === "streaming" && (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                              <span>Searching listings with AI…</span>
                            </>
                          )}
                          {phase === "done" && <span>Search ready</span>}
                          {phase === "error" && (
                            <span className="text-destructive">Search failed</span>
                          )}
                        </div>
                        {displaySearchSummary && (
                          <div className="mb-2 rounded-md border border-border/50 bg-background/80 px-2.5 py-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Active search
                            </p>
                            {displaySearchSummary.headline ? (
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {displaySearchSummary.headline}
                              </p>
                            ) : null}
                            {displaySearchSummary.bullets.length > 0 ? (
                              <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                                {displaySearchSummary.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        )}
                        {phase === "streaming" && streamText.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            Interpreting your request and querying listings…
                          </p>
                        )}
                        {assistantFullText.length > 0 && (
                          <div className="mt-1">
                            <p className="text-[11px] font-medium text-muted-foreground">
                              Latest from assistant
                            </p>
                            {assistantHasQuestion ? (
                              <p className="mt-1 text-[11px] text-amber-900/90 dark:text-amber-200/90">
                                The assistant may be asking something—expand below to read the full
                                reply.
                              </p>
                            ) : null}
                            {!assistantNeedsExpand ? (
                              <p className="mt-0.5 whitespace-pre-wrap text-sm leading-snug text-foreground">
                                {assistantFullText}
                              </p>
                            ) : (
                              <Collapsible open={assistantExpanded} onOpenChange={setAssistantExpanded}>
                                <div
                                  className={cn(
                                    "mt-0.5 rounded-md text-sm leading-snug text-foreground",
                                    assistantExpanded
                                      ? "max-h-60 overflow-y-auto border border-border/50 bg-background/90 p-2"
                                      : "max-h-24 overflow-hidden",
                                  )}
                                >
                                  <p className="whitespace-pre-wrap">{assistantFullText}</p>
                                </div>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-1 h-auto gap-1 px-0 py-0.5 text-xs text-primary"
                                  >
                                    <ChevronDown
                                      className={cn(
                                        "h-3.5 w-3.5 transition-transform",
                                        assistantExpanded && "rotate-180",
                                      )}
                                      aria-hidden
                                    />
                                    {assistantExpanded ? "Show less" : "Show full message"}
                                  </Button>
                                </CollapsibleTrigger>
                              </Collapsible>
                            )}
                          </div>
                        )}
                        {phase === "error" && error && (
                          <p className="mt-2 text-sm text-destructive">{error.message}</p>
                        )}
                      </div>
                    )}

                    {showAccountHint && (
                      <Card className="shrink-0 border-primary/30 bg-primary/5">
                        <CardContent className="flex items-start gap-2 py-2.5 sm:gap-3 sm:py-3">
                          <div className="min-w-0 flex-1 text-sm">
                            <p className="font-medium leading-snug text-foreground">
                              {searchHint?.reason?.trim()
                                ? searchHint.reason.trim()
                                : "Create an account for smarter, personalized search"}
                            </p>
                            <p className="mt-1 text-xs leading-snug text-muted-foreground">
                              Sign up free to save preferences and use the full search experience.
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
                            className="h-8 w-8 shrink-0"
                            onClick={() => setAccountHintDismissed(true)}
                            aria-label="Dismiss"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-full min-h-[200px]">
            <PropertyListingsMap
              properties={nearbyListings}
              fallbackCenter={DEFAULT_BROWSE_MAP_CENTER}
              globalNearestFallback={Boolean(nearbyQuery.data?.used_global_nearest_fallback)}
              openPropertySheetOnMarkerClick={false}
            />
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto rounded-lg border border-border/80 bg-background p-3 shadow-sm">
          <div className="mb-2.5 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
              {useAiSlice ? (
                <>
                  {phase === "streaming" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                  )}
                  {showingSearchPins ? (
                    <span>Results ({nearbyListings.length})</span>
                  ) : (
                    <NearbyListingsHeaderLine nearbyQuery={nearbyQuery} />
                  )}
                </>
              ) : (
                <NearbyListingsHeaderLine nearbyQuery={nearbyQuery} />
              )}
            </div>
            {useAiSlice && phase === "done" && searchStats && (
              <p className="text-[11px] leading-snug text-muted-foreground">
                Search returned{" "}
                <span className="font-medium text-foreground">{searchStats.returned_count}</span>{" "}
                listing{searchStats.returned_count === 1 ? "" : "s"}
                {searchStats.limit_cap != null
                  ? ` (up to ${searchStats.limit_cap} per query)`
                  : ""}
                {searchStats.sort_note ? ` · ${searchStats.sort_note}` : ""}
                {nearbyListings.length !== searchStats.returned_count
                  ? ` · ${nearbyListings.length} shown with map coordinates`
                  : ""}
              </p>
            )}
          </div>
          {!useAiSlice && (
            <div className="mb-3 space-y-2 border-l-2 border-primary/35 pl-3">
              <p className="text-[11px] leading-snug text-muted-foreground">
                Pins show listings near the default browse area on the map (fast SQL)—not necessarily
                where your browser is. Type at least{" "}
                <span className="font-medium text-foreground">{MIN_QUERY_CHARS}</span> characters,
                then press <span className="font-medium text-foreground">Enter</span> or{" "}
                <span className="font-medium text-foreground">Search</span> to run an AI-assisted
                search. Clearing the box resets the assistant session.
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                <Link
                  href="/signup"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Create a free account
                </Link>{" "}
                for saved context and the full renter journey, or browse{" "}
                <Link href="/blog" className="font-medium text-foreground underline-offset-2 hover:underline">
                  guides
                </Link>
                .
              </p>
            </div>
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
    </>
  );
}

export function GuestHomeSearchClient({ intro }: { intro: ReactNode }) {
  const [query, setQuery] = useState("");
  /** Approximate device location for AI search context only; guest browse SQL uses GUEST_BROWSE_MAP_CENTER. */
  const locationRef = useRef(GUEST_BROWSE_MAP_CENTER);
  const trimmedQuery = query.trim();
  const [selectedProperty, setSelectedProperty] = useState<PropertyDataItem | null>(null);
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);
  const [accountHintDismissed, setAccountHintDismissed] = useState(false);
  const [assistantExpanded, setAssistantExpanded] = useState(false);

  const [listingSessionActive, setListingSessionActive] = useState(false);
  const [listingFireVersion, setListingFireVersion] = useState(0);
  const [listingPhase, setListingPhase] = useState<ListingSearchPhase>("idle");

  const nearbyQuery = useNearbyListings({
    latitude: DEFAULT_BROWSE_MAP_CENTER.latitude,
    longitude: DEFAULT_BROWSE_MAP_CENTER.longitude,
    radiusMiles: DEFAULT_NEARBY_RADIUS_MILES,
    limit: DEFAULT_NEARBY_LIMIT,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      },
      () => {
        locationRef.current = DEFAULT_BROWSE_MAP_CENTER;
      },
      { timeout: 5000 },
    );
  }, []);

  useEffect(() => {
    if (trimmedQuery.length >= MIN_QUERY_CHARS) return;
    setListingSessionActive(false);
    setListingFireVersion(0);
    setListingPhase("idle");
  }, [trimmedQuery]);

  const submitSearchNow = useCallback(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_CHARS) return;
    setListingSessionActive(true);
    setListingFireVersion((v) => v + 1);
  }, [query]);

  useEffect(() => {
    setAccountHintDismissed(false);
  }, [trimmedQuery]);

  const innerProps: Omit<GuestHomeSearchInnerProps, "listingChat"> = {
    listingSessionActive,
    listingPhase,
    query,
    setQuery,
    nearbyQuery,
    selectedProperty,
    setSelectedProperty,
    isPropertyDetailOpen,
    setIsPropertyDetailOpen,
    accountHintDismissed,
    setAccountHintDismissed,
    assistantExpanded,
    setAssistantExpanded,
    submitSearchNow,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="relative z-50 shrink-0 border-b border-border/70 bg-background px-3 py-2.5 sm:px-4">
        <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <BrandLogo className="h-7 w-7 shrink-0 text-primary" />
            <span className="max-w-[9rem] truncate font-semibold text-foreground sm:max-w-none">
              Wade Me Home
            </span>
          </div>
          <span className="h-6 w-px shrink-0 bg-border/90" aria-hidden />
          <div className="min-w-0 flex-1">{intro}</div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <PublicSiteMenu />
            <Button asChild variant="outline">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {listingSessionActive ? (
        <GuestHomeListingChatRuntime
          fireVersion={listingFireVersion}
          getMessage={() => composeListingMessage(query.trim(), locationRef.current)}
          onPhaseChange={setListingPhase}
        >
          {(chat) => <GuestHomeSearchInner {...innerProps} listingChat={chat} />}
        </GuestHomeListingChatRuntime>
      ) : (
        <GuestHomeSearchInner {...innerProps} listingChat={null} />
      )}
    </div>
  );
}
