"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import { PropertyListingsMap } from "@/components/annotations/PropertyListings/PropertyListingsMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import {
  createReportSubscriptionPropertyManagerReportSubscriptionsPost,
  patchReportSubscriptionPropertyManagerReportSubscriptionsSubscriptionIdPatch,
  sendReportSubscriptionNowPropertyManagerReportSubscriptionsSubscriptionIdSendNowPost,
} from "@/lib/api/generated/sdk.gen";
import {
  listReportSubscriptionsPropertyManagerReportSubscriptionsGetOptions,
  listReportSubscriptionsPropertyManagerReportSubscriptionsGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type {
  ReportSubscriptionCreate,
  ReportSubscriptionResponse,
  ReportSubscriptionUpdate,
} from "@/lib/api/generated/types.gen";
import { useNearbyListings } from "@/lib/listings/useNearbyListings";
import { useListingGeocode } from "@/lib/listings/useListingGeocode";
import { toast } from "sonner";

const DEFAULT_RADIUS = 2;
const NEARBY_LIMIT = 100;

export default function PropertyManagerAnalysisPage() {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [reportLabel, setReportLabel] = useState("My property");

  const geoQuery = useListingGeocode(searchAddress, {
    enabled: Boolean(searchAddress.trim()) && isApiConfigured(),
  });

  const lat = geoQuery.data?.latitude ?? null;
  const lng = geoQuery.data?.longitude ?? null;

  const nearbyQuery = useNearbyListings({
    mode: "radius",
    latitude: lat ?? 0,
    longitude: lng ?? 0,
    radiusMiles: DEFAULT_RADIUS,
    limit: NEARBY_LIMIT,
    enabled: lat != null && lng != null && isApiConfigured(),
  });

  const subsQuery = useQuery({
    ...listReportSubscriptionsPropertyManagerReportSubscriptionsGetOptions(),
  });

  const createSub = useMutation({
    mutationFn: async (vars: { body: ReportSubscriptionCreate }) => {
      const { data } = await createReportSubscriptionPropertyManagerReportSubscriptionsPost({
        body: vars.body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: listReportSubscriptionsPropertyManagerReportSubscriptionsGetQueryKey(),
      });
      toast.success("Weekly email subscription saved.");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Could not save subscription"),
  });

  const patchSub = useMutation({
    mutationFn: async (vars: {
      path: { subscription_id: string };
      body: ReportSubscriptionUpdate;
    }) => {
      const { data } = await patchReportSubscriptionPropertyManagerReportSubscriptionsSubscriptionIdPatch({
        path: vars.path,
        body: vars.body,
        throwOnError: true,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: listReportSubscriptionsPropertyManagerReportSubscriptionsGetQueryKey(),
      });
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Could not update subscription"),
  });

  const sendNowSub = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data } = await sendReportSubscriptionNowPropertyManagerReportSubscriptionsSubscriptionIdSendNowPost({
        path: { subscription_id: subscriptionId },
        throwOnError: true,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: listReportSubscriptionsPropertyManagerReportSubscriptionsGetQueryKey(),
      });
      toast.success("Report sent to your email.");
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Could not send report"),
  });

  const mapCenter = useMemo(() => {
    if (lat != null && lng != null) return { latitude: lat, longitude: lng };
    return { latitude: 40.7128, longitude: -74.006 };
  }, [lat, lng]);

  const properties = nearbyQuery.data?.properties ?? [];
  const fallbackNote = nearbyQuery.data?.used_global_nearest_fallback;

  const onRunSearch = () => {
    const t = address.trim();
    if (!t) {
      toast.error("Enter an address or area to analyze.");
      return;
    }
    setSearchAddress(t);
  };

  const onSubscribeWeekly = () => {
    if (lat == null || lng == null) {
      toast.error("Geocode the address first (use Look up).");
      return;
    }
    const label = reportLabel.trim() || "My property";
    createSub.mutate({
      body: {
        label,
        center_latitude: lat,
        center_longitude: lng,
        radius_miles: DEFAULT_RADIUS,
        is_active: true,
      },
    });
  };

  const toggleSubActive = (row: ReportSubscriptionResponse, next: boolean) => {
    patchSub.mutate({
      path: { subscription_id: row.id },
      body: { is_active: next },
    });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Competitive analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          See rents, specials from amenities when present, and links for buildings within{" "}
          {`${DEFAULT_RADIUS} miles`} of a pin—same
          inventory as renter search. Weekly email sends this snapshot on your schedule (ops-triggered
          job).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>
            Enter a street address or place name. We geocode it, then load nearby buildings from
            inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="pm-address" className="text-sm font-medium leading-none">
              Address or area
            </label>
            <Input
              id="pm-address"
              placeholder="e.g. 350 5th Ave, New York, NY"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRunSearch();
              }}
            />
          </div>
          <Button type="button" onClick={onRunSearch} disabled={geoQuery.isFetching}>
            {geoQuery.isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up…
              </>
            ) : (
              "Look up"
            )}
          </Button>
        </CardContent>
        {geoQuery.isError ? (
          <CardContent className="pt-0 text-sm text-destructive">
            Could not geocode that address. Try a fuller address or check Mapbox configuration.
          </CardContent>
        ) : null}
        {lat != null && lng != null ? (
          <CardContent className="border-t pt-4 text-xs text-muted-foreground">
            Pin: {lat.toFixed(5)}, {lng.toFixed(5)}
          </CardContent>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:h-[min(72vh,520px)] lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">
        <Card className="flex max-h-[min(52vh,400px)] flex-col gap-3 overflow-hidden py-0 lg:h-full lg:max-h-none lg:min-h-0">
          <CardHeader className="shrink-0 pb-2 pt-6">
            <CardTitle className="text-base">Map</CardTitle>
            {fallbackNote ? (
              <CardDescription>
                Nothing matched inside the radius; showing nearest buildings (same as search).
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-0">
            <div className="min-h-0 flex-1">
              <PropertyListingsMap
                properties={properties}
                fallbackCenter={mapCenter}
                globalNearestFallback={Boolean(nearbyQuery.data?.used_global_nearest_fallback)}
                openPropertySheetOnMarkerClick={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="flex max-h-[min(52vh,400px)] flex-col overflow-hidden lg:h-full lg:max-h-none lg:min-h-0">
          <CardHeader className="shrink-0">
            <CardTitle className="text-base">Buildings ({properties.length})</CardTitle>
            <CardDescription>
              Promo-style lines are taken from the listing_amenities table and from other special-offer
              fields on the listing row when present.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 overflow-auto p-0">
            {nearbyQuery.isLoading ? (
              <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading listings…
              </div>
            ) : properties.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                {lat == null || lng == null
                  ? "Geocode an address to load competitors."
                  : "No rows returned for this pin."}
              </p>
            ) : (
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left font-medium">Building</th>
                    <th className="p-2 text-left font-medium">Rent</th>
                    <th className="hidden max-w-[200px] p-2 text-left font-medium sm:table-cell">
                      Move-in specials
                    </th>
                    <th className="hidden max-w-[140px] p-2 text-left font-medium md:table-cell">
                      Availability
                    </th>
                    <th className="w-[100px] p-2 text-left font-medium">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr
                      key={`${p.name}-${p.address}-${p.latitude}-${p.longitude}`}
                      className="border-b border-border/60"
                    >
                      <td className="max-w-[200px] p-2 align-top">
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.address}</div>
                      </td>
                      <td className="whitespace-nowrap p-2 align-top text-sm">{p.rent_range}</td>
                      <td className="hidden max-w-[180px] p-2 align-top text-sm sm:table-cell">
                        {p.concessions?.trim() ? p.concessions : "—"}
                      </td>
                      <td className="hidden max-w-[140px] whitespace-normal break-words p-2 align-top text-sm md:table-cell">
                        {p.available_date?.trim() ? p.available_date : "—"}
                      </td>
                      <td className="p-2 align-top">
                        {p.listing_url ? (
                          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                            <a href={p.listing_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly email report</CardTitle>
          <CardDescription>
            Opt in for automated weekly email (ops cron). Use Send now on a row to deliver the current
            snapshot immediately. Toggle Weekly to pause scheduled sends for that watch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="pm-label" className="text-sm font-medium leading-none">
                Label for this watch
              </label>
              <Input
                id="pm-label"
                value={reportLabel}
                onChange={(e) => setReportLabel(e.target.value)}
                placeholder="e.g. Midtown tower"
              />
            </div>
            <Button
              type="button"
              onClick={onSubscribeWeekly}
              disabled={createSub.isPending || lat == null || lng == null}
            >
              {createSub.isPending ? "Saving…" : "Subscribe at this pin"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Uses the current geocoded pin and a {DEFAULT_RADIUS}-mile radius. To change the pin, run a
            new lookup and subscribe again with a different label.
          </p>

          {subsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading subscriptions…</p>
          ) : subsQuery.data && subsQuery.data.length > 0 ? (
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium">Label</th>
                  <th className="hidden p-2 text-left font-medium md:table-cell">Center</th>
                  <th className="p-2 text-left font-medium">Weekly</th>
                  <th className="hidden p-2 text-left font-medium sm:table-cell">Last sent</th>
                  <th className="p-2 text-left font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {subsQuery.data.map((s) => (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="p-2 font-medium">{s.label}</td>
                    <td className="hidden p-2 font-mono text-xs md:table-cell">
                      {Number(s.center_latitude).toFixed(4)}, {Number(s.center_longitude).toFixed(4)} ·{" "}
                      {Number(s.radius_miles)} mi
                    </td>
                    <td className="p-2">
                      <Checkbox
                        checked={s.is_active}
                        onCheckedChange={(v) => toggleSubActive(s, v === true)}
                        disabled={patchSub.isPending}
                        aria-label={`Weekly report for ${s.label}`}
                      />
                    </td>
                    <td className="hidden p-2 text-sm text-muted-foreground sm:table-cell">
                      {s.last_sent_at
                        ? new Date(s.last_sent_at).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                    <td className="p-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        disabled={sendNowSub.isPending}
                        onClick={() => sendNowSub.mutate(s.id)}
                      >
                        {sendNowSub.isPending ? "Sending…" : "Send now"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Renter tools: <Link href="/search" className="underline underline-offset-4">Search</Link>
      </p>
    </div>
  );
}
