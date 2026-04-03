"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  DollarSign,
  ExternalLink,
  Home,
  Landmark,
  Loader2,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PropertyListingsMap } from "@/components/annotations/PropertyListings/PropertyListingsMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import {
  createReportSubscriptionPropertyManagerReportSubscriptionsPost,
  getInsightsPropertyManagerInsightsPost,
  patchReportSubscriptionPropertyManagerReportSubscriptionsSubscriptionIdPatch,
  sendReportSubscriptionNowPropertyManagerReportSubscriptionsSubscriptionIdSendNowPost,
} from "@/lib/api/generated/sdk.gen";
import {
  listReportSubscriptionsPropertyManagerReportSubscriptionsGetOptions,
  listReportSubscriptionsPropertyManagerReportSubscriptionsGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type {
  InsightsResponse,
  ReportSubscriptionCreate,
  ReportSubscriptionResponse,
  ReportSubscriptionUpdate,
} from "@/lib/api/generated/types.gen";
import { useNearbyListings } from "@/lib/listings/useNearbyListings";
import { useListingGeocode } from "@/lib/listings/useListingGeocode";
import { toast } from "sonner";

const DEFAULT_RADIUS = 2;
const NEARBY_LIMIT = 100;

function fmt$(n: number | null | undefined): string {
  if (n == null) return "—";
  return "$" + Math.round(n).toLocaleString();
}

function fmtPct(n: number | null | undefined, decimals = 1): string {
  if (n == null) return "—";
  return n.toFixed(decimals) + "%";
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  return Math.round(n).toLocaleString();
}

function positionColor(label: string): string {
  if (label === "Below Market") return "text-green-600";
  if (label === "At Market") return "text-muted-foreground";
  if (label === "Above Market") return "text-amber-600";
  if (label === "Premium") return "text-red-600";
  return "";
}

/* ────────────────── stat card helper ────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold leading-tight">{value}</p>
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}

export default function PropertyManagerAnalysisPageWrapper() {
  return (
    <Suspense>
      <PropertyManagerAnalysisPage />
    </Suspense>
  );
}

function PropertyManagerAnalysisPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialAddress = searchParams.get("q") ?? "";
  const [address, setAddress] = useState(initialAddress);
  const [searchAddress, setSearchAddress] = useState(initialAddress);
  const [reportLabel, setReportLabel] = useState("My property");
  const [showAllCompetitors, setShowAllCompetitors] = useState(false);
  const [showAllBuildings, setShowAllBuildings] = useState(false);

  /** Persist the searched address in the URL query string. */
  const persistSearch = useCallback(
    (addr: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (addr.trim()) {
        params.set("q", addr.trim());
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

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

  /* ── Insights query ── */
  const insightsQuery = useQuery({
    queryKey: ["pm-insights", lat, lng, DEFAULT_RADIUS],
    queryFn: async () => {
      const { data } = await getInsightsPropertyManagerInsightsPost({
        body: {
          center_latitude: lat!,
          center_longitude: lng!,
          radius_miles: DEFAULT_RADIUS,
        },
        throwOnError: true,
      });
      return data as InsightsResponse;
    },
    enabled: lat != null && lng != null && isApiConfigured(),
    staleTime: 5 * 60_000,
  });

  const insights = insightsQuery.data ?? null;

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
    persistSearch(t);
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

  const demo = insights?.demographics;
  const market = insights?.market;
  const supply = insights?.supply_pressure;
  const fees = insights?.fee_intelligence;
  const competitors = insights?.competitors ?? [];
  const amenities = insights?.amenities;
  const neighborhood = insights?.neighborhood;
  const aiSummary = insights?.ai_summary;
  const financials = insights?.building_financials;

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

      {/* ════════════════════════════════════════════════════════════════════
          INSIGHTS SECTION — shown when lat/lng are set
         ════════════════════════════════════════════════════════════════════ */}
      {lat != null && lng != null && (
        <>
          {insightsQuery.isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating competitive insights…
              </CardContent>
            </Card>
          ) : insightsQuery.isError ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-destructive">
                Could not load insights. Try again or check server logs.
              </CardContent>
            </Card>
          ) : insights ? (
            <>
              {/* ── AI Summary (hero card) ── */}
              {aiSummary && aiSummary.sections && aiSummary.sections.length > 0 ? (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Market Intelligence
                    </CardTitle>
                    {aiSummary.headline ? (
                      <p className="text-base font-medium leading-snug">
                        {aiSummary.headline}
                      </p>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {aiSummary.sections.map((s) => (
                        <div key={s.title} className="space-y-1.5 rounded-lg border bg-background p-4">
                          <p className="text-sm font-semibold">{s.title}</p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {s.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* ── Row 1: Affordability & Demographics (full width) ── */}
              {demo ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Affordability &amp; Demographics
                      <Badge variant="secondary" className="ml-2 text-xs font-normal">
                        ZIP {demo.zip_code}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Census ACS 5-Year data — median income, renter density, and affordability at
                      the 30% rule.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <StatCard
                        icon={DollarSign}
                        label="Median household income"
                        value={fmt$(demo.median_household_income)}
                      />
                      <StatCard
                        icon={Home}
                        label="Affordability ceiling (30% rule)"
                        value={fmt$(demo.affordability_ceiling)}
                        sub={
                          market?.median_rent != null && demo.affordability_ceiling != null
                            ? market.median_rent <= demo.affordability_ceiling
                              ? "Area median rent is within budget"
                              : "Area median rent exceeds ceiling"
                            : undefined
                        }
                      />
                      <StatCard
                        icon={Users}
                        label="Renter pool"
                        value={fmtNum(demo.renter_pool_size)}
                        sub={
                          demo.population != null && demo.renter_pct != null
                            ? `${fmtNum(demo.population)} pop · ${fmtPct(demo.renter_pct, 0)} renters`
                            : undefined
                        }
                      />
                      <StatCard
                        icon={TrendingUp}
                        label="Can afford area median rent"
                        value={demo.affordable_pct != null ? fmtPct(demo.affordable_pct, 0) : "—"}
                        sub={
                          demo.affordable_pct != null
                            ? `of households in ZIP ${demo.zip_code}`
                            : undefined
                        }
                      />
                    </div>

                    {/* Census vs observed rent */}
                    {demo.census_median_rent != null && market?.median_rent != null ? (
                      <div className="mt-6 rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm font-medium">Census vs. observed rent</p>
                        <div className="mt-2 flex items-baseline gap-4 text-sm">
                          <span>
                            Census median:{" "}
                            <span className="font-semibold">{fmt$(demo.census_median_rent)}</span>
                          </span>
                          <span>
                            Observed median:{" "}
                            <span className="font-semibold">{fmt$(market.median_rent)}</span>
                          </span>
                          <Badge
                            variant={
                              market.median_rent > demo.census_median_rent
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {market.median_rent > demo.census_median_rent ? "Running hot" : "At or below Census"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          A gap means the market is moving faster than Census figures reflect.
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              {/* ── Building Economics (NYC DOF) ── */}
              {financials && (financials.building_count ?? 0) > 0 ? (() => {
                const bldgs = financials.buildings ?? [];
                const visible = showAllBuildings ? bldgs : bldgs.slice(0, 10);
                const hasMore = bldgs.length > 10;
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Landmark className="h-4 w-4" />
                        Building economics ({financials.building_count} buildings · {fmtNum(financials.total_units)} units)
                      </CardTitle>
                      <CardDescription>
                        Derived from NYC DOF assessed market values using{" "}
                        {((financials.cap_rate_used ?? 0) * 100).toFixed(0)}% cap rate,{" "}
                        {((financials.expense_ratio_used ?? 0) * 100).toFixed(0)}% expense ratio (RGB study assumptions).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary stats */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <StatCard
                          icon={Landmark}
                          label="Median value / unit"
                          value={fmt$(financials.median_value_per_unit)}
                        />
                        <StatCard
                          icon={Building2}
                          label="Median value / sqft"
                          value={financials.median_value_per_sqft != null
                            ? "$" + financials.median_value_per_sqft.toFixed(0)
                            : "—"}
                        />
                        <StatCard
                          icon={DollarSign}
                          label="Est. in-place rent (median)"
                          value={fmt$(financials.median_estimated_in_place_rent)}
                        />
                        <StatCard
                          icon={TrendingUp}
                          label="Asking vs. in-place gap"
                          value={financials.median_asking_vs_in_place_gap_pct != null
                            ? (financials.median_asking_vs_in_place_gap_pct > 0 ? "+" : "")
                              + fmtPct(financials.median_asking_vs_in_place_gap_pct)
                            : "—"}
                          sub={
                            financials.median_asking_vs_in_place_gap_pct != null
                              ? financials.median_asking_vs_in_place_gap_pct > 0
                                ? "Asking rents above estimated in-place"
                                : "Asking rents below estimated in-place"
                              : undefined
                          }
                        />
                      </div>

                      {/* Asking vs in-place callout */}
                      {financials.median_estimated_in_place_rent != null && financials.median_asking_rent != null ? (
                        <div className="rounded-lg border bg-muted/40 p-4">
                          <p className="text-sm font-medium">Estimated in-place vs. observed asking</p>
                          <div className="mt-2 flex items-baseline gap-4 text-sm">
                            <span>
                              Est. in-place:{" "}
                              <span className="font-semibold">{fmt$(financials.median_estimated_in_place_rent)}</span>
                            </span>
                            <span>
                              Observed asking:{" "}
                              <span className="font-semibold">{fmt$(financials.median_asking_rent)}</span>
                            </span>
                            <Badge
                              variant={
                                financials.median_asking_rent > financials.median_estimated_in_place_rent
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {financials.median_asking_rent > financials.median_estimated_in_place_rent
                                ? "Asking premium"
                                : "Asking discount"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            In-place rents estimated from NYC DOF income-capitalized assessed values.
                            A positive gap suggests rents are rising faster than the tax roll reflects.
                          </p>
                        </div>
                      ) : null}

                      {/* Rent distribution histogram */}
                      {(() => {
                        const rents = bldgs
                          .map((b) => b.estimated_avg_in_place_rent)
                          .filter((r): r is number => r != null && r > 0 && r < 20000);
                        if (rents.length < 5) return null;
                        const binSize = 500;
                        const min = Math.floor(Math.min(...rents) / binSize) * binSize;
                        const max = Math.ceil(Math.max(...rents) / binSize) * binSize;
                        const bins: { range: string; from: number; count: number }[] = [];
                        for (let lo = min; lo < max; lo += binSize) {
                          const hi = lo + binSize;
                          bins.push({
                            range: `$${(lo / 1000).toFixed(1)}k`,
                            from: lo,
                            count: rents.filter((r) => r >= lo && r < hi).length,
                          });
                        }
                        const medianRent = financials.median_estimated_in_place_rent;
                        const askingRent = financials.median_asking_rent;
                        return (
                          <div>
                            <p className="mb-2 text-sm font-medium">
                              Estimated in-place rent distribution ({rents.length} buildings)
                            </p>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={bins} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
                                <Tooltip
                                  formatter={(value: number) => [`${value} buildings`, "Count"]}
                                  labelFormatter={(label: string) => `Rent: ${label}`}
                                />
                                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                                  {bins.map((entry, i) => (
                                    <Cell
                                      key={i}
                                      fill={
                                        medianRent != null && Math.abs(entry.from - medianRent) < binSize
                                          ? "hsl(var(--primary))"
                                          : "hsl(var(--muted-foreground) / 0.3)"
                                      }
                                    />
                                  ))}
                                </Bar>
                                {medianRent != null && (
                                  <ReferenceLine
                                    x={`$${(Math.floor(medianRent / binSize) * binSize / 1000).toFixed(1)}k`}
                                    stroke="hsl(var(--primary))"
                                    strokeDasharray="4 4"
                                    label={{ value: "Median in-place", position: "top", fontSize: 11 }}
                                  />
                                )}
                                {askingRent != null && (
                                  <ReferenceLine
                                    x={`$${(Math.floor(askingRent / binSize) * binSize / 1000).toFixed(1)}k`}
                                    stroke="hsl(var(--destructive))"
                                    strokeDasharray="4 4"
                                    label={{ value: "Asking", position: "top", fontSize: 11 }}
                                  />
                                )}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        );
                      })()}

                      {/* Building details table */}
                      {bldgs.length > 0 ? (
                        <div className="overflow-auto">
                          <table className="w-full caption-bottom text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="p-2 text-left font-medium">Address</th>
                                <th className="p-2 text-right font-medium">Units</th>
                                <th className="hidden p-2 text-right font-medium sm:table-cell">Year</th>
                                <th className="p-2 text-right font-medium">Market value</th>
                                <th className="p-2 text-right font-medium">$/unit</th>
                                <th className="p-2 text-right font-medium">Est. rent</th>
                                <th className="p-2 text-right font-medium">Gap</th>
                              </tr>
                            </thead>
                            <tbody>
                              {visible.map((b, i) => (
                                <tr key={`${b.bbl}-${i}`} className="border-b border-border/60">
                                  <td className="max-w-[220px] p-2 align-top">
                                    <div className="font-medium leading-tight">{b.address || b.bbl}</div>
                                    {b.owner_name ? (
                                      <div className="text-xs text-muted-foreground">{b.owner_name}</div>
                                    ) : null}
                                    {b.bldg_class || b.zone_dist ? (
                                      <div className="text-xs text-muted-foreground">
                                        {[b.bldg_class, b.zone_dist].filter(Boolean).join(" · ")}
                                      </div>
                                    ) : null}
                                  </td>
                                  <td className="p-2 text-right align-top">{b.units_res ?? "—"}</td>
                                  <td className="hidden p-2 text-right align-top sm:table-cell">
                                    {b.year_built ?? "—"}
                                  </td>
                                  <td className="whitespace-nowrap p-2 text-right align-top">
                                    {fmt$(b.market_value)}
                                  </td>
                                  <td className="whitespace-nowrap p-2 text-right align-top font-semibold">
                                    {fmt$(b.value_per_unit)}
                                  </td>
                                  <td className="whitespace-nowrap p-2 text-right align-top">
                                    {fmt$(b.estimated_avg_in_place_rent)}
                                  </td>
                                  <td className="whitespace-nowrap p-2 text-right align-top">
                                    {b.asking_vs_in_place_gap_pct != null ? (
                                      <span
                                        className={
                                          b.asking_vs_in_place_gap_pct > 0 ? "text-green-600" : "text-red-600"
                                        }
                                      >
                                        {b.asking_vs_in_place_gap_pct > 0 ? "+" : ""}
                                        {fmtPct(b.asking_vs_in_place_gap_pct)}
                                      </span>
                                    ) : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {hasMore ? (
                            <div className="border-t p-2 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAllBuildings((v) => !v)}
                              >
                                {showAllBuildings
                                  ? "Show less"
                                  : `Show all ${bldgs.length} buildings`}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })() : null}

              {/* ── Row 2: Market Overview | Supply Pressure ── */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Market Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <DollarSign className="h-4 w-4" />
                      Market overview
                    </CardTitle>
                    {market?.scope ? (
                      <CardDescription>{market.scope}</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{fmt$(market?.median_rent)}</span>
                      <span className="text-sm text-muted-foreground">median rent</span>
                    </div>
                    {market?.p25_rent != null && market.p75_rent != null ? (
                      <p className="text-sm text-muted-foreground">
                        p25–p75 range: {fmt$(market.p25_rent)} – {fmt$(market.p75_rent)}
                      </p>
                    ) : null}
                    {market?.bedroom_mix && Object.keys(market.bedroom_mix).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(market.bedroom_mix)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([beds, count]) => (
                            <Badge key={beds} variant="outline">
                              {beds}: {count}
                            </Badge>
                          ))}
                      </div>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {market?.sample_size ?? 0} listings in sample
                    </p>
                  </CardContent>
                </Card>

                {/* Supply Pressure */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4" />
                      Supply pressure
                    </CardTitle>
                    <CardDescription>
                      Vacancy proxy from availability status in listings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {fmtPct(supply?.vacancy_rate_pct, 1)}
                      </span>
                      <span className="text-sm text-muted-foreground">vacancy rate</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {fmtNum(supply?.available_units)} available of {fmtNum(supply?.total_units)}{" "}
                      total units
                    </p>

                    {supply?.by_bedroom && supply.by_bedroom.length > 0 ? (
                      <div className="space-y-2">
                        {supply.by_bedroom.map((br) => (
                          <div key={br.beds} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{br.beds}</span>
                              <span>
                                {br.available}/{br.total} ({fmtPct(br.vacancy_pct, 0)})
                              </span>
                            </div>
                            <Progress value={br.vacancy_pct} className="h-2" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              {/* ── Row 3: Rent Positioning (full width, capped at 10) ── */}
              {competitors.length > 0 ? (() => {
                const visible = showAllCompetitors ? competitors : competitors.slice(0, 10);
                const hasMore = competitors.length > 10;
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4" />
                        Rent positioning ({competitors.length})
                      </CardTitle>
                      <CardDescription>
                        Where each competitor stands relative to the area median. Sorted by $/sqft.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-auto p-0">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left font-medium">Building</th>
                            <th className="p-2 text-right font-medium">Units</th>
                            <th className="p-2 text-right font-medium">Median rent</th>
                            <th className="hidden p-2 text-right font-medium sm:table-cell">
                              Median sqft
                            </th>
                            <th className="p-2 text-right font-medium">$/sqft</th>
                            <th className="p-2 text-right font-medium">vs. median</th>
                            <th className="p-2 text-left font-medium">Position</th>
                            <th className="p-2 font-medium">Link</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visible.map((c, i) => (
                            <tr
                              key={`${c.name}-${c.address}-${i}`}
                              className="border-b border-border/60"
                            >
                              <td className="max-w-[200px] p-2 align-top">
                                <div className="font-medium leading-tight">{c.name}</div>
                                <div className="text-xs text-muted-foreground">{c.address}</div>
                                {c.beds_available ? (
                                  <div className="text-xs text-muted-foreground">
                                    {c.beds_available}
                                  </div>
                                ) : null}
                              </td>
                              <td className="p-2 text-right align-top">{c.unit_count}</td>
                              <td className="whitespace-nowrap p-2 text-right align-top">
                                {fmt$(c.median_rent)}
                              </td>
                              <td className="hidden whitespace-nowrap p-2 text-right align-top sm:table-cell">
                                {c.median_sqft != null ? fmtNum(c.median_sqft) : "—"}
                              </td>
                              <td className="whitespace-nowrap p-2 text-right align-top font-semibold">
                                {c.rent_per_sqft != null
                                  ? "$" + c.rent_per_sqft.toFixed(2)
                                  : "—"}
                              </td>
                              <td className="whitespace-nowrap p-2 text-right align-top">
                                {c.vs_median_pct != null ? (
                                  <span
                                    className={
                                      c.vs_median_pct > 0 ? "text-red-600" : "text-green-600"
                                    }
                                  >
                                    {c.vs_median_pct > 0 ? "+" : ""}
                                    {fmtPct(c.vs_median_pct, 1)}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="p-2 align-top">
                                <span className={`text-xs font-medium ${positionColor(c.position_label ?? "")}`}>
                                  {c.position_label || "—"}
                                </span>
                              </td>
                              <td className="p-2 align-top">
                                {c.listing_url ? (
                                  <Button variant="ghost" size="sm" asChild className="h-8 px-2">
                                    <a href={c.listing_url} target="_blank" rel="noreferrer">
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
                      {hasMore ? (
                        <div className="border-t p-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAllCompetitors((v) => !v)}
                          >
                            {showAllCompetitors
                              ? "Show less"
                              : `Show all ${competitors.length} buildings`}
                          </Button>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })() : null}

              {/* ── Row 4: Fee Intelligence (full width) ── */}
              {fees && fees.fee_categories && fees.fee_categories.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <DollarSign className="h-4 w-4" />
                      Fee intelligence
                    </CardTitle>
                    <CardDescription>
                      What competitors charge beyond rent. {fees.total_buildings_with_fees} buildings
                      with fee data in radius.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-auto p-0">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2 text-left font-medium">Fee</th>
                          <th className="p-2 text-right font-medium">Buildings</th>
                          <th className="p-2 text-right font-medium">% charging</th>
                          <th className="p-2 text-right font-medium">Median</th>
                          <th className="hidden p-2 text-right font-medium sm:table-cell">
                            Min–Max
                          </th>
                          <th className="hidden p-2 text-left font-medium md:table-cell">
                            Frequency
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fees.fee_categories.map((f, i) => (
                          <tr
                            key={`${f.label}-${i}`}
                            className="border-b border-border/60"
                          >
                            <td className="max-w-[200px] p-2 font-medium">{f.label}</td>
                            <td className="p-2 text-right">{f.buildings_charging}</td>
                            <td className="p-2 text-right">{fmtPct(f.pct_buildings, 0)}</td>
                            <td className="whitespace-nowrap p-2 text-right font-semibold">
                              {fmt$(f.median_amount)}
                            </td>
                            <td className="hidden whitespace-nowrap p-2 text-right text-muted-foreground sm:table-cell">
                              {f.min_amount != null && f.max_amount != null
                                ? `${fmt$(f.min_amount)} – ${fmt$(f.max_amount)}`
                                : "—"}
                            </td>
                            <td className="hidden p-2 text-muted-foreground md:table-cell">
                              {f.frequency || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ) : null}

              {/* ── Row 5: Amenity Landscape | Neighborhood ── */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Amenity Landscape */}
                {amenities && amenities.total_buildings > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Amenity landscape</CardTitle>
                      <CardDescription>
                        {amenities.total_buildings} buildings with amenity data.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {amenities.standard && amenities.standard.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Standard (&ge;60% of buildings)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {amenities.standard.map((a) => (
                              <Badge key={a.amenity} variant="secondary" className="text-xs">
                                {a.amenity}{" "}
                                <span className="ml-1 opacity-60">
                                  {fmtPct(a.pct_of_buildings, 0)}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {amenities.differentiators && amenities.differentiators.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Differentiators (20–60%)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {amenities.differentiators.map((a) => (
                              <Badge key={a.amenity} variant="outline" className="text-xs">
                                {a.amenity}{" "}
                                <span className="ml-1 opacity-60">
                                  {fmtPct(a.pct_of_buildings, 0)}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {amenities.rare && amenities.rare.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                            Rare (&lt;20%) — potential differentiators
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {amenities.rare.map((a) => (
                              <Badge
                                key={a.amenity}
                                variant="outline"
                                className="border-amber-300 text-xs text-amber-700"
                              >
                                {a.amenity}{" "}
                                <span className="ml-1 opacity-60">
                                  {fmtPct(a.pct_of_buildings, 0)}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ) : null}

                {/* Neighborhood POI */}
                {neighborhood && neighborhood.items.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4" />
                        Neighborhood
                      </CardTitle>
                      <CardDescription>Points of interest nearby.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {neighborhood.items.map((poi) => (
                          <div
                            key={poi.category}
                            className="rounded-lg border p-3"
                          >
                            <p className="text-xs font-medium capitalize">
                              {poi.category.replace(/_/g, " ")}
                            </p>
                            <p className="text-lg font-semibold">{poi.count}</p>
                            {poi.nearest_name ? (
                              <p className="truncate text-xs text-muted-foreground">
                                {poi.nearest_name}
                                {poi.nearest_distance_meters != null
                                  ? ` · ${(poi.nearest_distance_meters / 1609.34).toFixed(1)} mi`
                                  : ""}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </>
          ) : null}
        </>
      )}

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
