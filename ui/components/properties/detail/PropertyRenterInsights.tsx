"use client";

import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommuteMatrix } from "@/lib/listings/useCommuteMatrix";
import { useMarketSnapshot } from "@/lib/listings/useMarketSnapshot";
import { useOpenMeteoPropertyInsights } from "@/lib/listings/useOpenMeteoPropertyInsights";
import { usePoiNearby } from "@/lib/listings/usePoiNearby";
import { useNearestTransit, SYSTEM_LABELS as TRANSIT_LABELS } from "@/lib/listings/useNearestTransit";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { geocodeAddressListingsGeocodePostMutation } from "@/lib/api/generated/@tanstack/react-query.gen";
import { useAuth } from "@/components/providers/AuthProvider";
import { amenityTourHints } from "@/lib/properties/amenityHints";
import { appleMapsUrl, extractZipFromAddress, mapsSearchUrl } from "@/lib/properties/addressUtils";
import {
  addCommuteDestination,
  loadCommuteDestinations,
  removeCommuteDestination,
  type CommuteDestination,
} from "@/lib/properties/commuteStorage";
import { formatPropertyRangeLabel } from "@/lib/properties/formatPropertyRangeLabel";
import { parseRentRangeMidpoint } from "@/lib/properties/parseRentRange";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import { cacheProperty } from "@/lib/properties/propertyStorage";
import { ChevronDown, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";

const LEASE_ITEMS: { title: string; body: string }[] = [
  {
    title: "Security deposit",
    body: "Money held against damages—often one month’s rent. It is not the same as last month’s rent unless the lease says so.",
  },
  {
    title: "Proration",
    body: "If you move in mid-month, rent for that month is often calculated by day. Confirm the exact formula.",
  },
  {
    title: "Guarantor",
    body: "A third party who agrees to pay if you cannot. Common for students or thin credit files; fees may apply.",
  },
  {
    title: "RUBS (ratio utility billing)",
    body: "Shared utilities split by unit size, occupancy, or usage rather than individual meters. Ask for a sample bill.",
  },
  {
    title: "Fixed-term vs month-to-month",
    body: "Fixed-term locks rent for the lease period; month-to-month offers flexibility but weaker rent predictability.",
  },
];

interface PropertyRenterInsightsProps {
  property: PropertyDataItem;
  propertyKey: string;
  mapLatitude: number | null;
  mapLongitude: number | null;
  nearbyProperties: PropertyDataItem[];
  /** False when coordinates are unknown (avoid POI/weather/commute on bogus center). */
  locationReady: boolean;
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    n,
  );
}

/** Mapbox returns straight-line distance in meters; show feet under ~1000 ft, else miles. */
function formatDistanceFromPin(meters: number | null | undefined): string | null {
  if (meters == null || !Number.isFinite(meters) || meters < 0) return null;
  const ft = Math.round(meters * 3.28084);
  if (meters < 304.8) {
    return `~${ft.toLocaleString()} ft`;
  }
  const mi = meters / 1609.344;
  return mi < 10 ? `~${mi.toFixed(2)} mi` : `~${mi.toFixed(1)} mi`;
}

export function PropertyRenterInsights({
  property,
  propertyKey,
  mapLatitude,
  mapLongitude,
  nearbyProperties,
  locationReady,
}: PropertyRenterInsightsProps) {
  const { user, loading: authLoading } = useAuth();
  const zipFromRow = property.zip_code?.trim() || undefined;
  const cityFromRow = property.city?.trim() || undefined;
  const stateFromRow = property.state?.trim() || undefined;
  const zipFallback = zipFromRow ?? extractZipFromAddress(property.address) ?? undefined;
  const market = useMarketSnapshot(
    {
      zip: zipFallback,
      city: !zipFallback ? cityFromRow : undefined,
      state: !zipFallback ? stateFromRow : undefined,
      address:
        !zipFallback && !(cityFromRow && stateFromRow) ? property.address : undefined,
    },
    {
      enabled: Boolean(
        zipFallback || (cityFromRow && stateFromRow) || property.address?.trim(),
      ),
    },
  );
  const poi = usePoiNearby(mapLatitude ?? undefined, mapLongitude ?? undefined, {
    enabled: locationReady,
  });
  const transit = useNearestTransit(
    mapLatitude ?? undefined,
    mapLongitude ?? undefined,
    { enabled: locationReady, limit: 5, maxWalkMinutes: 25 },
  );
  const { weather, air } = useOpenMeteoPropertyInsights(
    mapLatitude ?? undefined,
    mapLongitude ?? undefined,
    { enabled: locationReady },
  );
  const commuteMutation = useCommuteMatrix();
  const geocodeMutation = useMutation(geocodeAddressListingsGeocodePostMutation());
  const apiConfigured = isApiConfigured();

  const [destinations, setDestinations] = useState<CommuteDestination[]>([]);
  useEffect(() => {
    setDestinations(loadCommuteDestinations());
  }, []);

  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const onAddDestination = async () => {
    const label = newLabel.trim();
    const addr = newAddress.trim();
    if (!label || !addr) return;
    try {
      if (!isApiConfigured()) return;
      const res = await geocodeMutation.mutateAsync({ body: { address: addr } });
      const item: CommuteDestination = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label,
        latitude: res.latitude,
        longitude: res.longitude,
      };
      addCommuteDestination(item);
      setDestinations(loadCommuteDestinations());
      setNewLabel("");
      setNewAddress("");
    } catch {
      toast.error("Could not geocode that address. Check the spelling or try a fuller address.");
    }
  };

  const onRemoveDestination = (id: string) => {
    removeCommuteDestination(id);
    setDestinations(loadCommuteDestinations());
  };

  const onRunCommute = async () => {
    if (destinations.length === 0 || mapLatitude == null || mapLongitude == null) return;
    await commuteMutation.mutateAsync({
      body: {
        origin: { latitude: mapLatitude, longitude: mapLongitude },
        destinations: destinations.map((d) => ({
          latitude: d.latitude,
          longitude: d.longitude,
        })),
        labels: destinations.map((d) => d.label),
      },
    });
  };

  const rentMid = parseRentRangeMidpoint(property.rent_range);
  const median = market.data?.median_rent ?? null;
  const benchText = useMemo(() => {
    if (!market.data || market.data.sample_size === 0) return null;
    const area = market.data.scope;
    if (median === null || rentMid === null) {
      return `Typical rent for ${area} (sample ${market.data.sample_size} listings): median ${median != null ? fmtMoney(median) : "n/a"}.`;
    }
    const diff = rentMid - median;
    const pct = median !== 0 ? Math.round((diff / median) * 100) : 0;
    if (Math.abs(pct) < 4) {
      return `Your range (~${fmtMoney(rentMid)}) is close to the local median (${fmtMoney(median)}) for ${area}, based on ${market.data.sample_size} listings.`;
    }
    if (diff > 0) {
      return `Your range (~${fmtMoney(rentMid)}) is about ${Math.abs(pct)}% above the local median (${fmtMoney(median)}) for ${area}, from ${market.data.sample_size} listings.`;
    }
    return `Your range (~${fmtMoney(rentMid)}) is about ${Math.abs(pct)}% below the local median (${fmtMoney(median)}) for ${area}, from ${market.data.sample_size} listings.`;
  }, [market.data, median, rentMid]);

  const [scenarioPct, setScenarioPct] = useState(5);
  const scenarioRent = rentMid != null ? rentMid * (1 + scenarioPct / 100) : null;
  const [firstTimeRenter, setFirstTimeRenter] = useState(false);

  const hints = amenityTourHints(property);
  const comps = useMemo(() => {
    return nearbyProperties
      .filter((p) => buildPropertyKey(p) !== propertyKey)
      .slice(0, 8);
  }, [nearbyProperties, propertyKey]);

  const firstTimeId = useId();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Maps & area context</CardTitle>
          <CardDescription>Open in your preferred app using the listing address.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={mapsSearchUrl(property.address)} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Google Maps
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={appleMapsUrl(property.address)} target="_blank" rel="noreferrer">
              Apple Maps
            </a>
          </Button>
        </CardContent>
      </Card>

      {property.match_reason ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why this matched your search</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{property.match_reason}</CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rent vs nearby inventory</CardTitle>
          <CardDescription>
            Benchmark from your own listings table for this ZIP (not a third-party AVM).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!apiConfigured ? (
            <p className="text-muted-foreground">Configure the API base URL to load market stats.</p>
          ) : market.isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : market.isError ? (
            <p className="text-muted-foreground">Market snapshot is not available for this dataset or ZIP.</p>
          ) : benchText ? (
            <p>{benchText}</p>
          ) : (
            <p className="text-muted-foreground">No comparable rent sample for this ZIP yet.</p>
          )}
          {market.data && market.data.sample_size > 0 && Object.keys(market.data.bedroom_mix ?? {}).length > 0 ? (
            <p className="text-xs text-muted-foreground">
              Bedroom mix (top groups):{" "}
              {Object.entries(market.data.bedroom_mix ?? {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(" · ")}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Errands & daily life</CardTitle>
          <CardDescription>
            Rough idea of groceries, pharmacies, parks, and gyms near this pin—when the feature is enabled on the
            server.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!locationReady ? (
            <p className="text-muted-foreground">Available once the listing has a map pin (coordinates or geocode).</p>
          ) : !apiConfigured ? (
            <p className="text-muted-foreground">API not configured.</p>
          ) : poi.isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : poi.isError ? (
            <p className="text-muted-foreground">
              Couldn&apos;t load nearby places. Try again later, or use Google Maps above to explore the block.
            </p>
          ) : poi.data?.service_unavailable ? (
            <p className="text-muted-foreground">
              This preview isn&apos;t turned on for this deployment yet (the server needs a Mapbox token). Use{" "}
              <span className="font-medium text-foreground">Google Maps</span> or{" "}
              <span className="font-medium text-foreground">Apple Maps</span> above to check supermarkets, transit, and
              parks yourself.
            </p>
          ) : (
            <ul className="space-y-1">
              {poi.data?.items.map((it) => {
                const distLabel = formatDistanceFromPin(it.nearest_distance_meters);
                return (
                  <li key={it.category} className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium capitalize">{it.category}</span>
                    <span className="text-muted-foreground">
                      {it.nearest_name ? (
                        <>
                          nearest ~{it.nearest_name}
                          {distLabel ? <> ({distLabel} from this pin)</> : null}
                          {it.count > 1 ? ` (+${it.count - 1} more hits)` : null}
                        </>
                      ) : it.count > 0 ? (
                        <>
                          {it.count} nearby (name not available)
                          {distLabel ? <> · {distLabel} from this pin</> : null}
                        </>
                      ) : (
                        "none found in quick search"
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nearest transit</CardTitle>
          <CardDescription>
            Straight-line walk time at 3 mph with a 20% detour factor. Covers
            PATH, Hudson-Bergen Light Rail, and NY Waterway ferry landings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!locationReady ? (
            <p className="text-muted-foreground">
              Available once the listing has a map pin.
            </p>
          ) : !apiConfigured ? (
            <p className="text-muted-foreground">API not configured.</p>
          ) : transit.isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : transit.isError ? (
            <p className="text-muted-foreground">
              Couldn&apos;t load transit data.
            </p>
          ) : !transit.data || transit.data.stations.length === 0 ? (
            <p className="text-muted-foreground">
              No PATH, light rail, or ferry stops within a 25-minute walk.
            </p>
          ) : (
            <ul className="space-y-1">
              {transit.data.stations.map((s) => {
                const label = TRANSIT_LABELS[s.system] ?? s.system;
                return (
                  <li
                    key={`${s.system}-${s.station_name}`}
                    className="flex flex-wrap items-baseline justify-between gap-2"
                  >
                    <span className="font-medium">
                      {s.station_name}{" "}
                      <span className="text-muted-foreground">({label})</span>
                    </span>
                    <span className="text-muted-foreground">
                      {s.walk_minutes} min walk · {s.distance_miles.toFixed(2)} mi
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commute lab</CardTitle>
          <CardDescription>
            Save places you care about (work, campus, daycare). Drive times are estimates from Mapbox—account holders
            only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : !user ? (
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                Log in
              </Link>{" "}
              or{" "}
              <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
                sign up
              </Link>{" "}
              to save commute stops and see drive times from this listing.
            </p>
          ) : !locationReady ? (
            <p className="text-sm text-muted-foreground">
              Add a map pin for this listing to save stops and calculate drive times from here.
            </p>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="cd-label" className="text-sm font-medium">
                    Label
                  </label>
                  <Input
                    id="cd-label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Work"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="cd-addr" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="cd-addr"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="123 Main St, City ST 00000"
                  />
                </div>
              </div>
              <Button type="button" size="sm" onClick={onAddDestination} disabled={!apiConfigured}>
                Save stop (geocode)
              </Button>
              {destinations.length > 0 ? (
                <ul className="space-y-2">
                  {destinations.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-2 text-sm">
                      <span>{d.label}</span>
                      <Button type="button" variant="ghost" size="icon" onClick={() => onRemoveDestination(d.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No saved stops yet.</p>
              )}
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onRunCommute}
                disabled={destinations.length === 0}
              >
                {commuteMutation.isPending ? "Calculating…" : "Drive times from this listing"}
              </Button>
              {commuteMutation.data ? (
                <ul className="space-y-1 text-sm">
                  {commuteMutation.data.legs.map((leg) => (
                    <li key={leg.label}>
                      <span className="font-medium">{leg.label}:</span>{" "}
                      {leg.minutes != null ? `~${leg.minutes} min drive` : "unavailable"}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">This week’s weather & air</CardTitle>
          <CardDescription>
            Open-Meteo forecast (next 7 days) and current air index—indicative only, not health advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!locationReady ? (
            <p className="text-muted-foreground">Weather and air quality show after the listing is pinned on the map.</p>
          ) : weather.isLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : weather.data && weather.data.dates.length > 0 ? (
            <p>
              Next days highs (°C):{" "}
              {weather.data.maxC.slice(0, 4).map((t, i) => (
                <span key={weather.data!.dates[i]} className="mr-2 inline-block">
                  {Math.round(t)}°
                </span>
              ))}
              …
            </p>
          ) : (
            <p className="text-muted-foreground">Weather unavailable.</p>
          )}
          {air.isLoading ? null : air.data?.usAqi != null ? (
            <p>
              US AQI (now): <span className="font-medium">{air.data.usAqi}</span>
              {air.data.pm10 != null ? ` · PM10 ≈ ${Math.round(air.data.pm10)} µg/m³` : null}
            </p>
          ) : (
            <p className="text-muted-foreground">Air quality data not available here.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tour questions from amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {hints.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nearby listings</CardTitle>
          <CardDescription>Other buildings from the same nearby query (not a guarantee of availability).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {comps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other pins in this radius.</p>
          ) : (
            <ul className="space-y-2">
              {comps.map((p) => {
                const k = buildPropertyKey(p);
                return (
                  <li key={k} className="flex items-start gap-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium break-words">{p.name}</div>
                      <div className="text-muted-foreground">
                        {formatPropertyRangeLabel(p.rent_range)} · {formatPropertyRangeLabel(p.bedroom_range)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0" asChild>
                      <Link
                        href={`/properties/${encodeURIComponent(k)}`}
                        onClick={() => {
                          cacheProperty(k, p);
                        }}
                      >
                        View
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">If rent goes up when you renew</CardTitle>
          <CardDescription>
            See how a higher monthly rent would feel. We take the listing&apos;s advertised range, pick one rough
            monthly number in the middle (or the only number if it&apos;s a single price), then add the percentage
            you choose. Your actual renewal is set by the lease and landlord—this is not a quote or prediction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rentMid != null ? (
            <>
              <p className="text-sm text-muted-foreground">
                Rough monthly amount we&apos;re using from this listing:{" "}
                <span className="font-medium text-foreground">{fmtMoney(rentMid)}</span>
              </p>
              <div className="space-y-2">
                <label htmlFor="renewal-pct-slider" className="text-sm font-medium">
                  Hypothetical increase
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="renewal-pct-slider"
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={scenarioPct}
                    onChange={(e) => setScenarioPct(Number(e.target.value))}
                    className="flex-1 accent-primary"
                    aria-valuemin={0}
                    aria-valuemax={15}
                    aria-valuenow={scenarioPct}
                    aria-label="Hypothetical rent increase percent at renewal"
                  />
                  <span className="w-12 shrink-0 text-right text-sm tabular-nums font-medium">{scenarioPct}%</span>
                </div>
              </div>
              <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground">After that increase: </span>
                <span className="font-semibold text-foreground">{fmtMoney(scenarioRent ?? rentMid)}</span>
                <span className="text-muted-foreground"> per month </span>
                <span className="text-muted-foreground">
                  (was {fmtMoney(rentMid)} at 0%)
                </span>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t turn this listing&apos;s rent text into a dollar amount, so this calculator
              isn&apos;t available here.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Before you apply</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Checkbox
              id={firstTimeId}
              checked={firstTimeRenter}
              onCheckedChange={(v) => setFirstTimeRenter(v === true)}
            />
            <label htmlFor={firstTimeId} className="text-sm font-normal">
              First-time renter (show extra checks)
            </label>
          </div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Tour in person when possible; photos can omit noise, light, and odors.</li>
            <li>Verify the leasing office domain and never wire money to strangers.</li>
            <li>Get fee schedules, pet rules, and parking in the written lease.</li>
            <li>Document existing damage at move-in with photos and written notes.</li>
            {firstTimeRenter ? (
              <>
                <li>Ask how maintenance requests work after hours and typical response times.</li>
                <li>Confirm renters insurance minimums and whether the landlord must be listed as interested party.</li>
              </>
            ) : null}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lease terms cheat sheet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {LEASE_ITEMS.map((item) => (
            <Collapsible key={item.title}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-medium hover:bg-muted/60">
                {item.title}
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 py-2 text-sm text-muted-foreground">{item.body}</CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
