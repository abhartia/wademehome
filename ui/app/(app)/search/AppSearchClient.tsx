"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyListingsMap } from "@/components/annotations/PropertyListings/PropertyListingsMap";
import { PropertyList } from "@/components/annotations/PropertyListings/PropertyListings";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { PropertyDetailSheet } from "@/components/properties/PropertyDetailSheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_NEARBY_LIMIT,
  type NearbyListingsResponse,
  useNearbyListings,
} from "@/lib/listings/useNearbyListings";
import {
  DEFAULT_BROWSE_MAP_CENTER,
  isApproxDefaultBrowseCenter,
} from "@/lib/map/defaultBrowseCenter";
import {
  approximateBoundsFromCenterZoom,
  type BrowseMapViewport,
} from "@/lib/map/approximateBrowseBounds";
import { isSamePropertyListing } from "@/lib/properties/propertyIdentity";
import { GuestHomeListingChatRuntime } from "@/app/(marketing)/GuestHomeListingChatRuntime";
import type {
  ListingSearchPhase,
  ListingSearchStreamApi,
  ProfileMemoryUpdateState,
} from "@/lib/listings/useListingSearchStream";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import type { UserProfile } from "@/lib/types/userProfile";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Search } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import { SearchTransparencyPanel } from "@/components/search/SearchTransparencyPanel";

const MIN_QUERY_CHARS = 2;
const DEFAULT_STREAM_SEARCH_HEADLINE = "Property search";

function streamSearchSummaryIsUseful(headline: string, bullets: string[]): boolean {
  const h = headline.trim();
  const nonEmptyBullets = bullets.filter((b) => Boolean(b?.trim()));
  return nonEmptyBullets.length > 0 || (h.length > 0 && h !== DEFAULT_STREAM_SEARCH_HEADLINE);
}

const EMPTY_PROPERTY_LIST: PropertyDataItem[] = [];

function composeListingMessage(
  query: string,
  location: { latitude: number; longitude: number },
): string {
  const q = query.trim();
  return `${q}\n\n[System context: User's approximate browser location is latitude ${location.latitude}, longitude ${location.longitude}. Prefer listings near this area when relevant.]`;
}

function composeInitialProfileQuery(profile: UserProfile): string | null {
  const parts: string[] = [];
  if (profile.preferredCities.length > 0) {
    parts.push(`city: ${profile.preferredCities[0]}`);
  }
  if (profile.maxMonthlyRent.trim()) {
    parts.push(`budget: ${profile.maxMonthlyRent.trim()}`);
  }
  if (profile.bedroomsNeeded.trim()) {
    parts.push(`bedrooms: ${profile.bedroomsNeeded.trim()}`);
  }
  if (profile.neighbourhoodPriorities.length > 0) {
    parts.push(`priorities: ${profile.neighbourhoodPriorities.slice(0, 3).join(", ")}`);
  }
  if (profile.dealbreakers.length > 0) {
    parts.push(`avoid: ${profile.dealbreakers.slice(0, 3).join(", ")}`);
  }
  if (parts.length === 0) return null;
  return `Find listings for my profile preferences. ${parts.join(" · ")}`;
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
    nearbyQuery.isLoading ||
    (nearbyQuery.isFetching && nearbyQuery.data === undefined && !nearbyQuery.isError);

  if (awaitingData) {
    return (
      <>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
        <span className="text-muted-foreground">Loading nearby listings...</span>
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
  const isBackgroundRefreshing = nearbyQuery.isFetching && nearbyQuery.data !== undefined;
  const updatingPrefix = isBackgroundRefreshing ? (
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
  ) : null;
  const bbox = Boolean(d.used_bbox);

  if (d.used_global_nearest_fallback) {
    return (
      <>
        {updatingPrefix}
        <span className="text-muted-foreground">
          {bbox ? (
            <>None in the current map view - showing {d.properties.length} closest.</>
          ) : (
            <>None within {rm} mi of map center - showing {d.properties.length} closest.</>
          )}
          {isBackgroundRefreshing ? " Updating..." : ""}
        </span>
      </>
    );
  }
  return (
    <>
      {updatingPrefix}
      <span className="text-muted-foreground">
        {bbox ? (
          <>
            {d.properties.length} of {d.total_in_radius} in the current map view
          </>
        ) : (
          <>
            {d.properties.length} of {d.total_in_radius} within {rm} miles of map center
          </>
        )}
        {isBackgroundRefreshing ? " Updating..." : ""}
      </span>
    </>
  );
}

type AppSearchInnerProps = {
  listingChat: ListingSearchStreamApi | null;
  listingSessionActive: boolean;
  listingPhase: ListingSearchPhase;
  query: string;
  setQuery: (value: string) => void;
  browseMapCenter: { latitude: number; longitude: number };
  onBrowseMapCenterChange: (c: BrowseMapViewport) => void;
  nearbyQuery: UseQueryResult<NearbyListingsResponse, Error>;
  selectedProperty: PropertyDataItem | null;
  setSelectedProperty: (p: PropertyDataItem | null) => void;
  isPropertyDetailOpen: boolean;
  setIsPropertyDetailOpen: (open: boolean) => void;
  assistantExpanded: boolean;
  setAssistantExpanded: (v: boolean) => void;
  submitSearchNow: () => void;
  hoveredProperty: PropertyDataItem | null;
  onHoveredPropertyChange: (property: PropertyDataItem | null) => void;
  onMapMarkerClick: (property: PropertyDataItem) => void;
  mapFocusProperty: PropertyDataItem | null;
  mapFocusVersion: number;
  listScrollProperty: PropertyDataItem | null;
};

function AppSearchInner({
  listingChat,
  listingSessionActive,
  listingPhase,
  query,
  setQuery,
  browseMapCenter,
  onBrowseMapCenterChange,
  nearbyQuery,
  selectedProperty,
  setSelectedProperty,
  isPropertyDetailOpen,
  setIsPropertyDetailOpen,
  assistantExpanded,
  setAssistantExpanded,
  submitSearchNow,
  hoveredProperty,
  onHoveredPropertyChange,
  onMapMarkerClick,
  mapFocusProperty,
  mapFocusVersion,
  listScrollProperty,
}: AppSearchInnerProps) {
  const messages = useMemo(() => listingChat?.messages ?? [], [listingChat?.messages]);
  const phase = listingChat?.phase ?? "idle";
  const streamText = useMemo(() => listingChat?.streamText ?? "", [listingChat?.streamText]);
  const properties = useMemo(() => listingChat?.properties ?? [], [listingChat?.properties]);
  const searchSummary = listingChat?.searchSummary ?? null;
  const searchPlan = listingChat?.searchPlan ?? null;
  const searchFilterBreakdown = listingChat?.searchFilterBreakdown ?? null;
  const searchStats = listingChat?.searchStats ?? null;
  const error = listingChat?.error ?? null;

  const nearbyProperties = nearbyQuery.data?.properties ?? EMPTY_PROPERTY_LIST;
  const useAiSlice = listingSessionActive;
  const memoryUpdate = listingChat?.profileMemoryUpdate ?? null;

  const displaySearchSummary = useMemo(() => {
    if (
      searchPlan &&
      streamSearchSummaryIsUseful(searchPlan.summary_headline, searchPlan.summary_bullets)
    ) {
      return {
        headline: searchPlan.summary_headline,
        bullets: searchPlan.summary_bullets,
      };
    }
    if (
      searchSummary &&
      streamSearchSummaryIsUseful(searchSummary.headline, searchSummary.bullets)
    ) {
      return searchSummary;
    }
    const bullets = [
      ...new Set(
        messages
          .filter((m) => m.role === "user")
          .map((m) => stripGeoSuffix(String(m.content ?? "")))
          .filter(Boolean)
          .slice(-5),
      ),
    ];
    if (bullets.length === 0) return null;
    return { headline: "What we are using for this search", bullets };
  }, [messages, searchPlan, searchSummary]);

  const assistantFullText = streamText.trim();
  const assistantNeedsExpand = assistantFullText.length > 400;
  const showAiActivity =
    useAiSlice && (phase === "streaming" || phase === "done" || phase === "error");
  const [mapAiPanelOpen, setMapAiPanelOpen] = useState(true);

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

  const visibleListings: PropertyDataItem[] = useMemo(() => {
    if (!useAiSlice) return nearbyProperties;
    if (properties.length > 0) return properties;
    if (phase === "streaming" || phase === "idle" || phase === "error" || phase === "done") {
      return lastAiListingsRef.current.length > 0 ? lastAiListingsRef.current : nearbyProperties;
    }
    return nearbyProperties;
  }, [nearbyProperties, phase, properties, useAiSlice]);

  const showingSearchPins = useAiSlice && properties.length > 0;

  const handleSelectProperty = useCallback(
    (property: PropertyDataItem) => {
      setSelectedProperty(property);
      setIsPropertyDetailOpen(true);
    },
    [setIsPropertyDetailOpen, setSelectedProperty],
  );

  return (
    <>
      <div className="grid h-full min-h-0 flex-1 grid-rows-[minmax(220px,40vh)_minmax(0,1fr)] gap-3 overflow-hidden p-2 pb-4 sm:p-3 lg:grid-cols-[1fr_minmax(320px,380px)] lg:grid-rows-1">
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
                  placeholder="Neighborhood, city, ZIP, or building"
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
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Pan/zoom loads listings for the visible map area. Enter at least {MIN_QUERY_CHARS}{" "}
                chars to run AI search with map context.
              </p>
              {useAiSlice && showAiActivity && (
                <div
                  className="pointer-events-none absolute left-0 right-0 top-full z-30 mt-2 flex max-h-[min(32vh,26rem)] flex-col gap-2 rounded-md border border-border/60 bg-background/98 p-2 shadow-lg backdrop-blur sm:max-h-[min(55vh,26rem)]"
                  aria-live="polite"
                >
                  <div className="pointer-events-auto flex min-h-0 flex-col gap-2">
                    <div className="overflow-hidden rounded-md border bg-muted/40">
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <div className="flex min-w-0 flex-1 items-center gap-2 text-xs font-medium text-muted-foreground">
                          {phase === "streaming" && (
                            <>
                              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
                              <span className="min-w-0">Searching listings with AI...</span>
                            </>
                          )}
                          {phase === "done" && <span>Search ready</span>}
                          {phase === "error" && (
                            <span className="text-destructive">Search failed</span>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 shrink-0 gap-1 px-2 text-xs text-muted-foreground"
                          aria-expanded={mapAiPanelOpen}
                          aria-label={mapAiPanelOpen ? "Hide AI search details" : "Show AI search details"}
                          onClick={() => setMapAiPanelOpen((open) => !open)}
                        >
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              mapAiPanelOpen && "rotate-180",
                            )}
                            aria-hidden
                          />
                          {mapAiPanelOpen ? "Hide" : "Details"}
                        </Button>
                      </div>
                      {mapAiPanelOpen ? (
                        <div className="max-h-[min(22vh,15rem)] min-h-0 overflow-y-auto border-t border-border/40 px-3 py-2 sm:max-h-[min(40vh,15rem)]">
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
                            {searchFilterBreakdown?.criteria?.length ? (
                              <SearchTransparencyPanel
                                criteria={searchFilterBreakdown.criteria}
                                finalMatched={searchStats?.matched_count ?? null}
                                stageStats={searchStats}
                              />
                            ) : null}
                            {assistantFullText.length > 0 && (
                              <div className="mt-1">
                                <p className="text-[11px] font-medium text-muted-foreground">
                                  Latest from assistant
                                </p>
                                {!assistantNeedsExpand ? (
                                  <p className="mt-0.5 whitespace-pre-wrap text-sm leading-snug text-foreground">
                                    {assistantFullText}
                                  </p>
                                ) : (
                                  <div className="mt-0.5">
                                    <div
                                      className={cn(
                                        "rounded-md text-sm leading-snug text-foreground",
                                        assistantExpanded
                                          ? "max-h-60 overflow-y-auto border border-border/50 bg-background/90 p-2"
                                          : "max-h-24 overflow-hidden",
                                      )}
                                    >
                                      <p className="whitespace-pre-wrap">{assistantFullText}</p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="mt-1 h-auto gap-1 px-0 py-0.5 text-xs text-primary"
                                      aria-expanded={assistantExpanded}
                                      onClick={() => setAssistantExpanded(!assistantExpanded)}
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
                                  </div>
                                )}
                              </div>
                            )}
                            {phase === "error" && error && (
                              <p className="mt-2 text-sm text-destructive">{error.message}</p>
                            )}
                            {memoryUpdate && (
                              <div className="mt-2 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                                  Memory updated
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Saved {memoryUpdate.updated_fields.length} preference
                                  {memoryUpdate.updated_fields.length === 1 ? "" : "s"} from this turn.
                                </p>
                              </div>
                            )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-full min-h-[240px]">
            <PropertyListingsMap
              properties={visibleListings}
              fallbackCenter={browseMapCenter}
              followDataCamera={
                showingSearchPins ||
                (!listingSessionActive &&
                  Boolean(nearbyQuery.data?.used_global_nearest_fallback))
              }
              onBrowseCenterChange={listingSessionActive ? undefined : onBrowseMapCenterChange}
              globalNearestFallback={Boolean(nearbyQuery.data?.used_global_nearest_fallback)}
              openPropertySheetOnMarkerClick={false}
              onMarkerClick={onMapMarkerClick}
              highlightedProperty={hoveredProperty}
              focusedProperty={mapFocusProperty}
              focusRequestVersion={mapFocusVersion}
            />
          </div>
        </div>
        <div className="flex min-h-0 flex-col rounded-lg border border-border/80 bg-background p-2 shadow-sm sm:p-3">
          <div className="mb-2.5 shrink-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
              {useAiSlice ? (
                <>
                  {phase === "streaming" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                  )}
                  {showingSearchPins ? (
                    <span>Results ({visibleListings.length})</span>
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
                {searchStats.matched_count != null
                  ? ` (${searchStats.matched_count} matched before limit)`
                  : ""}
                {searchStats.limit_cap != null ? ` (up to ${searchStats.limit_cap} per query)` : ""}
                {searchStats.sort_note ? ` - ${searchStats.sort_note}` : ""}
                {visibleListings.length !== searchStats.returned_count
                  ? ` - ${visibleListings.length} shown with map coordinates`
                  : ""}
              </p>
            )}
            {memoryUpdate && memoryUpdate.updated_fields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {memoryUpdate.updated_fields.map((field) => (
                  <Badge key={field} variant="secondary" className="text-[11px] font-normal">
                    Updated: {field}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <PropertyList
              properties={visibleListings}
              selectedProperty={selectedProperty}
              onSelectProperty={handleSelectProperty}
              onHoverProperty={onHoveredPropertyChange}
              scrollToProperty={listScrollProperty}
            />
          </div>
        </div>
      </div>
      <PropertyDetailSheet
        property={selectedProperty}
        open={isPropertyDetailOpen}
        onOpenChange={setIsPropertyDetailOpen}
      />
    </>
  );
}

type AppSearchRuntimeInnerProps = Omit<AppSearchInnerProps, "listingChat"> & {
  chat: ListingSearchStreamApi;
  handleMemoryUpdate: (
    memoryUpdate: ProfileMemoryUpdateState | null,
    updateVersion: number,
  ) => void;
};

/**
 * Must stay at module scope. Defining this component inside `AppSearchClient` recreates a new
 * function identity every render; React treats that as a new component type and remounts the
 * entire subtree (map, list, sheets), which feels like a full page refresh on hover.
 */
function AppSearchRuntimeInner({
  chat,
  handleMemoryUpdate,
  ...inner
}: AppSearchRuntimeInnerProps) {
  useEffect(() => {
    handleMemoryUpdate(chat.profileMemoryUpdate, chat.profileMemoryUpdateVersion);
  }, [chat.profileMemoryUpdate, chat.profileMemoryUpdateVersion, handleMemoryUpdate]);
  const { listingSessionActive, ...rest } = inner;
  return (
    <AppSearchInner
      {...rest}
      listingSessionActive={listingSessionActive}
      listingChat={listingSessionActive ? chat : null}
    />
  );
}

export function AppSearchClient() {
  const searchParams = useSearchParams();
  const { profile, updateProfile } = useUserProfile();
  const [query, setQuery] = useState("");
  const locationRef = useRef(DEFAULT_BROWSE_MAP_CENTER);
  const browseMapCenterRef = useRef(DEFAULT_BROWSE_MAP_CENTER);
  const trimmedQuery = query.trim();
  const [selectedProperty, setSelectedProperty] = useState<PropertyDataItem | null>(null);
  const [isPropertyDetailOpen, setIsPropertyDetailOpen] = useState(false);
  const [assistantExpanded, setAssistantExpanded] = useState(false);

  const [listingSessionActive, setListingSessionActive] = useState(false);
  const [listingFireVersion, setListingFireVersion] = useState(0);
  const [listingPhase, setListingPhase] = useState<ListingSearchPhase>("idle");
  const [hasBrowseViewport, setHasBrowseViewport] = useState(false);
  const [browseMapCenter, setBrowseMapCenter] = useState(DEFAULT_BROWSE_MAP_CENTER);
  const [browseBounds, setBrowseBounds] = useState(() =>
    approximateBoundsFromCenterZoom(
      DEFAULT_BROWSE_MAP_CENTER.latitude,
      DEFAULT_BROWSE_MAP_CENTER.longitude,
      11,
    ),
  );
  browseMapCenterRef.current = browseMapCenter;
  const [hoveredProperty, setHoveredProperty] = useState<PropertyDataItem | null>(null);
  const [mapFocusProperty, setMapFocusProperty] = useState<PropertyDataItem | null>(null);
  const [mapFocusVersion, setMapFocusVersion] = useState(0);
  const [listScrollProperty, setListScrollProperty] = useState<PropertyDataItem | null>(null);
  const latestMemoryAppliedVersionRef = useRef(0);
  const didAutoBootstrapSearchRef = useRef(false);
  const didSetInitialBrowseCenterRef = useRef(false);
  const didHydrateQueryFromUrlRef = useRef(false);
  const prevTrimmedQueryRef = useRef<string | null>(null);
  const listingFireAckRef = useRef(0);

  const onBrowseMapCenterChange = useCallback((c: BrowseMapViewport) => {
    didSetInitialBrowseCenterRef.current = true;
    setHasBrowseViewport(true);
    setBrowseBounds({
      west: c.west,
      south: c.south,
      east: c.east,
      north: c.north,
    });
    setBrowseMapCenter((prev) => {
      if (
        Math.abs(prev.latitude - c.latitude) < 1e-6 &&
        Math.abs(prev.longitude - c.longitude) < 1e-6
      ) {
        return prev;
      }
      return { latitude: c.latitude, longitude: c.longitude };
    });
  }, []);

  const nearbyQuery = useNearbyListings({
    mode: "bbox",
    bounds: browseBounds,
    limit: DEFAULT_NEARBY_LIMIT,
    enabled: !listingSessionActive && hasBrowseViewport,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        locationRef.current = next;
        const shouldApplyGeo =
          !didSetInitialBrowseCenterRef.current ||
          isApproxDefaultBrowseCenter(browseMapCenterRef.current);
        if (shouldApplyGeo) {
          setBrowseMapCenter(next);
          setBrowseBounds(
            approximateBoundsFromCenterZoom(next.latitude, next.longitude, 11),
          );
          didSetInitialBrowseCenterRef.current = true;
          setHasBrowseViewport(true);
        }
      },
      () => {
        locationRef.current = DEFAULT_BROWSE_MAP_CENTER;
      },
      { timeout: 5000 },
    );
  }, []);

  useEffect(() => {
    if (didHydrateQueryFromUrlRef.current) return;
    const urlQ = (searchParams.get("q") ?? "").trim();
    if (urlQ.length >= MIN_QUERY_CHARS) {
      setQuery(urlQ);
      setListingSessionActive(true);
      setListingFireVersion((v) => v + 1);
      didAutoBootstrapSearchRef.current = true;
    } else if (urlQ.length > 0) {
      setQuery(urlQ);
      didAutoBootstrapSearchRef.current = true;
    }
    didHydrateQueryFromUrlRef.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (didAutoBootstrapSearchRef.current) return;
    if (listingSessionActive) return;
    const initialQuery = composeInitialProfileQuery(profile);
    if (!initialQuery) return;
    didAutoBootstrapSearchRef.current = true;
    setQuery(initialQuery);
    setListingSessionActive(true);
    setListingFireVersion((v) => v + 1);
  }, [listingSessionActive, profile]);

  useEffect(() => {
    const prev = prevTrimmedQueryRef.current;
    prevTrimmedQueryRef.current = trimmedQuery;

    if (trimmedQuery.length >= MIN_QUERY_CHARS) return;

    // Only reset when the user shortens/clears an active query — not on first mount with ""
    // (profile bootstrap sets a long query in the same tick and would be clobbered otherwise).
    if (prev !== null && prev.length >= MIN_QUERY_CHARS) {
      setListingSessionActive(false);
      setListingFireVersion(0);
      setListingPhase("idle");
    }
  }, [trimmedQuery]);

  const submitSearchNow = useCallback(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_CHARS) return;
    setListingSessionActive(true);
    setListingFireVersion((v) => v + 1);
  }, [query]);

  const onMapMarkerClick = useCallback((property: PropertyDataItem) => {
    setListScrollProperty((prev) =>
      isSamePropertyListing(prev, property) ? { ...property } : property,
    );
    setSelectedProperty(property);
  }, []);

  const onListSelectProperty = useCallback((property: PropertyDataItem | null) => {
    if (!property) {
      setSelectedProperty(null);
      return;
    }
    setMapFocusProperty(property);
    setMapFocusVersion((v) => v + 1);
    setSelectedProperty(property);
    setIsPropertyDetailOpen(true);
  }, []);

  const handleMemoryUpdate = useCallback(
    (memoryUpdate: ProfileMemoryUpdateState | null, updateVersion: number) => {
      if (!memoryUpdate || memoryUpdate.updated_fields.length === 0) return;
      if (updateVersion <= latestMemoryAppliedVersionRef.current) return;
      updateProfile(memoryUpdate.patch);
      latestMemoryAppliedVersionRef.current = updateVersion;
    },
    [updateProfile],
  );

  const innerProps: Omit<AppSearchInnerProps, "listingChat"> = {
    listingSessionActive,
    listingPhase,
    query,
    setQuery,
    browseMapCenter,
    onBrowseMapCenterChange,
    nearbyQuery,
    selectedProperty,
    setSelectedProperty,
    isPropertyDetailOpen,
    setIsPropertyDetailOpen,
    assistantExpanded,
    setAssistantExpanded,
    submitSearchNow,
    hoveredProperty,
    onHoveredPropertyChange: setHoveredProperty,
    onMapMarkerClick,
    mapFocusProperty,
    mapFocusVersion,
    listScrollProperty,
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {/*
        Single subtree: do not swap AppSearchInner between runtime and non-runtime parents,
        or the search Input remounts and loses focus when listingSessionActive flips off.
      */}
      <GuestHomeListingChatRuntime
        chatId="app-search-listings"
        fireAcknowledgedVersionRef={listingFireAckRef}
        fireVersion={listingSessionActive ? listingFireVersion : 0}
        getMessage={() => composeListingMessage(query.trim(), locationRef.current)}
        onPhaseChange={setListingPhase}
      >
        {(chat) => (
          <AppSearchRuntimeInner
            chat={chat}
            handleMemoryUpdate={handleMemoryUpdate}
            {...innerProps}
            setSelectedProperty={onListSelectProperty}
          />
        )}
      </GuestHomeListingChatRuntime>
    </div>
  );
}
