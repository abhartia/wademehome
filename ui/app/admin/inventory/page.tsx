"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { getInventoryAnalyticsAdminInventoryAnalyticsGetQueryKey } from "@/lib/api/generated/@tanstack/react-query.gen";
import { getInventoryAnalyticsAdminInventoryAnalyticsGet } from "@/lib/api/generated/sdk.gen";
import type { InventoryAnalyticsResponse } from "@/lib/api/generated/types.gen";
import { authMeQueryKey } from "@/lib/api/authSessionQuery";

function isAdminRole(role: unknown): boolean {
  if (role === undefined || role === null) return false;
  return String(role).trim().toLowerCase() === "admin";
}

const PIE_PALETTE = [
  "#0d9488",
  "#6366f1",
  "#d946ef",
  "#f97316",
  "#22c55e",
  "#eab308",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
  "#a855f7",
  "#64748b",
  "#84cc16",
  "#f43f5e",
  "#06b6d4",
  "#8b5cf6",
];

const SCRAPE_NEXT_COLORS = ["#3b82f6", "#60a5fa", "#2563eb", "#93c5fd"];
const NOT_SCRAPABLE_COLORS = ["#94a3b8", "#64748b", "#cbd5e1", "#475569", "#a8a29e", "#78716c"];

const PROPERTY_ROW_COUNT_DIAGNOSTIC_SQL = `SELECT
  COUNT(*) AS rows,
  COUNT(DISTINCT listing_id) AS distinct_listing_ids,
  COUNT(DISTINCT unit_id) AS distinct_unit_ids,
  COUNT(DISTINCT unit_name) AS distinct_unit_names,
  COUNT(DISTINCT floor_plan) AS distinct_floor_plans,
  COUNT(DISTINCT listing_url) AS distinct_listing_urls
FROM listings
WHERE property_id = '23045';`;

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = isAdminRole(user?.role);
  const [availableOnly, setAvailableOnly] = useState(true);

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: authMeQueryKey() });
  }, [queryClient]);

  const analyticsQuery = useQuery({
    queryKey: getInventoryAnalyticsAdminInventoryAnalyticsGetQueryKey({
      query: { available_only: availableOnly },
    }),
    queryFn: async ({ signal }) => {
      const r = await getInventoryAnalyticsAdminInventoryAnalyticsGet({
        throwOnError: false,
        signal,
        query: { available_only: availableOnly },
      });
      if (!r.response?.ok) {
        throw new Error(
          r.response?.status === 403
            ? "Forbidden"
            : `HTTP ${String(r.response?.status ?? "?")}`,
        );
      }
      return r.data as InventoryAnalyticsResponse;
    },
    enabled: isAdmin,
    retry: 1,
  });

  const cmsMarketOffPlatformAssumptions = useMemo(() => {
    const raw = analyticsQuery.data?.cms_market_share_pie ?? [];
    return raw.filter((s) => s.segment !== "on_platform");
  }, [analyticsQuery.data?.cms_market_share_pie]);

  const cmsMarketPieData = useMemo(() => {
    const raw = analyticsQuery.data?.cms_market_share_pie ?? [];
    let onIdx = 0;
    let scrapeIdx = 0;
    let greyIdx = 0;
    return raw
      .filter((s) => (s.listing_rows ?? 0) > 0)
      .map((s) => {
        let fill: string;
        if (s.segment === "on_platform") {
          fill = PIE_PALETTE[onIdx++ % PIE_PALETTE.length];
        } else if (s.segment === "scrape_next") {
          fill = SCRAPE_NEXT_COLORS[scrapeIdx++ % SCRAPE_NEXT_COLORS.length];
        } else {
          fill = NOT_SCRAPABLE_COLORS[greyIdx++ % NOT_SCRAPABLE_COLORS.length];
        }
        return {
          label: s.label,
          listing_rows: s.listing_rows,
          segment: s.segment,
          fill,
        };
      });
  }, [analyticsQuery.data?.cms_market_share_pie]);

  const zipChart = useMemo(
    () => (analyticsQuery.data?.zip_buckets ?? []).slice(0, 18),
    [analyticsQuery.data?.zip_buckets],
  );

  const stalenessCompanyChart = useMemo(
    () => (analyticsQuery.data?.staleness_by_company ?? []).slice(0, 12),
    [analyticsQuery.data?.staleness_by_company],
  );

  const coveragePct = useMemo(() => {
    const total = analyticsQuery.data?.metro_coverage_estimate?.estimated_market_listing_rows;
    const onPlatform = analyticsQuery.data?.total_listing_rows ?? 0;
    if (!total || total <= 0) return null;
    return ((onPlatform / total) * 100).toFixed(1);
  }, [analyticsQuery.data]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl p-8 text-muted-foreground">
        Checking session\u2026
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-semibold">Admin inventory</h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to view this page.
        </p>
        <Link href="/login" className="mt-4 inline-block text-teal-600 underline">
          Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    const reported =
      user?.role === undefined || user?.role === null || String(user.role).trim() === ""
        ? "not returned by the server (check API /auth/me)"
        : String(user.role);
    return (
      <div className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-semibold">Admin only</h1>
        <p className="mt-2 text-muted-foreground">
          This page requires database role <code className="text-xs">admin</code>{" "}
          on your user row. Your session reports role: {reported}.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          After changing <code className="text-xs">users.role</code>, refresh this page
          (session reads fresh from the API; no need to log out in most cases).
        </p>
        <Link href="/" className="mt-4 inline-block text-teal-600 underline">
          Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 pb-16">
      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            NYC metro listing analytics
          </h1>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={availableOnly}
              onCheckedChange={(v) => setAvailableOnly(v === true)}
              id="avail-only"
            />
            <span>
              Count only <strong className="text-foreground">available</strong> rows.
              Uncheck for debugging.
            </span>
          </label>
        </div>
        {analyticsQuery.data?.availability_filter_description ? (
          <p className="max-w-3xl rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <strong className="text-foreground">Availability filter:</strong>{" "}
            {analyticsQuery.data.availability_filter_description}
          </p>
        ) : null}
      </header>

      {analyticsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading analytics\u2026</p>
      ) : null}
      {analyticsQuery.isError ? (
        <p className="text-destructive">
          {(analyticsQuery.error as Error)?.message ?? "Failed to load analytics"}
        </p>
      ) : null}

      {analyticsQuery.data ? (
        <>
          {/* ── Summary cards ── */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Listings (rows)</CardTitle>
                <CardDescription>
                  In bbox, table {analyticsQuery.data.listings_table}
                  {analyticsQuery.data.available_only !== false ? " \u00b7 available-only" : " \u00b7 all rows"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold tabular-nums">
                {analyticsQuery.data.total_listing_rows.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distinct buildings</CardTitle>
                <CardDescription>property_id or rounded lat/lng</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-semibold tabular-nums">
                {analyticsQuery.data.distinct_buildings.toLocaleString()}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality</CardTitle>
                <CardDescription>Coverage in region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div>
                  Rent present:{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.rent_present_pct != null
                      ? `${analyticsQuery.data.quality.rent_present_pct}%`
                      : "\u2014"}
                  </span>
                </div>
                <div>
                  Image present:{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.image_present_pct != null
                      ? `${analyticsQuery.data.quality.image_present_pct}%`
                      : "\u2014"}
                  </span>
                </div>
                <div>
                  Duplicate listing_id rows:{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.duplicate_listing_id_rows ?? "\u2014"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── THE coverage pie ── */}
          <Card>
            <CardHeader>
              <CardTitle>
                NYC metro rental market coverage
                {coveragePct != null ? (
                  <span className="ml-3 text-base font-normal text-muted-foreground">
                    {coveragePct}% on platform
                  </span>
                ) : null}
              </CardTitle>
              <CardDescription>
                Estimated ~{analyticsQuery.data.metro_coverage_estimate.estimated_market_listing_rows?.toLocaleString() ?? "?"}{" "}
                currently available rentals in this bbox (source: StreetEasy Feb 2026 + NJ suburb estimates).{" "}
                <span className="text-teal-700 dark:text-teal-300 font-medium">Teal</span> = on your platform.{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">Blue</span> = scrapable, target next.{" "}
                <span className="text-slate-500 font-medium">Grey</span> = not reachable (ToS, legal, or offline).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div className="h-[420px]">
                  {cmsMarketPieData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={cmsMarketPieData as unknown as Record<string, unknown>[]}
                          dataKey="listing_rows"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          label={({ percent }) => `${((percent as number) * 100).toFixed(1)}%`}
                        >
                          {cmsMarketPieData.map((row, i) => (
                            <Cell key={`cms-${i}-${row.label}`} fill={row.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">No slices (empty bbox or no data).</p>
                  )}
                </div>

                <div className="space-y-4 text-sm">
                  <div className="rounded-lg border bg-teal-50 px-4 py-3 dark:bg-teal-950/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-teal-800 dark:text-teal-300">On platform</div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums text-teal-900 dark:text-teal-100">
                      {analyticsQuery.data.total_listing_rows.toLocaleString()}
                    </div>
                    <div className="text-xs text-teal-700 dark:text-teal-400">
                      available listings in {analyticsQuery.data.distinct_buildings.toLocaleString()} buildings
                    </div>
                  </div>

                  <div className="rounded-lg border bg-blue-50 px-4 py-3 dark:bg-blue-950/30">
                    <div className="text-xs font-medium uppercase tracking-wide text-blue-800 dark:text-blue-300">Scrape next</div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums text-blue-900 dark:text-blue-100">
                      {cmsMarketPieData
                        .filter((s) => s.segment === "scrape_next")
                        .reduce((sum, s) => sum + s.listing_rows, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-400">
                      est. scrapable via property mgmt sites & broker pages
                    </div>
                  </div>

                  <div className="rounded-lg border bg-slate-50 px-4 py-3 dark:bg-slate-900/50">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">Not scrapable</div>
                    <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                      {cmsMarketPieData
                        .filter((s) => s.segment === "not_scrapable")
                        .reduce((sum, s) => sum + s.listing_rows, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      est. behind ToS walls, private landlords, or offline
                    </div>
                  </div>

                  {analyticsQuery.data.metro_coverage_estimate.cms_market_pie_warning ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                      {analyticsQuery.data.metro_coverage_estimate.cms_market_pie_warning}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Source breakdown table ── */}
          {cmsMarketOffPlatformAssumptions.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Source breakdown \u2014 where are the missing listings?</CardTitle>
                <CardDescription>
                  Estimated non-overlapping slices of the gap. Edit{" "}
                  <code className="text-xs">nyc_metro_coverage_context.json</code> to refine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto rounded-md border text-sm">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr>
                        <th className="p-2">Source</th>
                        <th className="p-2 text-right">Est. listings</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cmsMarketOffPlatformAssumptions.map((s, idx) => (
                        <tr key={`${s.label}-${s.listing_rows}-${idx}`} className="border-t">
                          <td className="p-2 break-all">
                            {s.label}
                            {s.citation_url ? (
                              <>
                                {" "}
                                <a href={s.citation_url} className="text-teal-700 underline dark:text-teal-300" target="_blank" rel="noreferrer">\u2197</a>
                              </>
                            ) : null}
                          </td>
                          <td className="p-2 tabular-nums text-right">{s.listing_rows?.toLocaleString()}</td>
                          <td className="p-2">
                            {s.segment === "scrape_next" ? (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                Scrape next
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                Not scrapable
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-xs text-muted-foreground break-words max-w-sm">
                            {s.assumption_note ?? "\u2014"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* ── Listings per building proof ── */}
          <Collapsible className="rounded-lg border">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium hover:underline">
              Proof: listings per property (same bbox)
              <span className="text-xs font-normal text-muted-foreground">
                Mean \u2248{" "}
                {(
                  analyticsQuery.data.total_listing_rows /
                  Math.max(analyticsQuery.data.distinct_buildings, 1)
                ).toFixed(2)}{" "}
                rows/building
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-4 py-3">
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <dl className="space-y-2">
                  <div>
                    <dt className="text-muted-foreground">Rows attributed to a building key</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.listings_per_building_proof.total_listing_rows_attributed.toLocaleString()}{" "}
                      / {analyticsQuery.data.total_listing_rows.toLocaleString()} total bbox rows
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Buildings (non-null key)</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.listings_per_building_proof.buildings_in_distribution.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Mean / median listings per building</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.listings_per_building_proof.mean_listings_per_building.toFixed(2)} /{" "}
                      {analyticsQuery.data.listings_per_building_proof.median_listings_per_building?.toFixed(2) ??
                        "\u2014"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Max listings, one building</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.listings_per_building_proof.max_listings_single_building?.toLocaleString() ??
                        "\u2014"}
                    </dd>
                  </div>
                  {(analyticsQuery.data.listings_per_building_proof.rows_without_building_key ?? 0) > 0 ? (
                    <div>
                      <dt className="text-muted-foreground">Rows missing building key</dt>
                      <dd className="font-medium tabular-nums">
                        {(
                          analyticsQuery.data.listings_per_building_proof.rows_without_building_key ?? 0
                        ).toLocaleString()}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                <div>
                  <div className="text-muted-foreground mb-1">Buildings by listing count</div>
                  <ul className="space-y-1 tabular-nums">
                    <li>1 listing: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_1}</li>
                    <li>
                      2\u20135 listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_2_to_5}
                    </li>
                    <li>
                      6\u201315 listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_6_to_15}
                    </li>
                    <li>
                      16+ listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_16_plus}
                    </li>
                  </ul>
                  <Collapsible className="mt-2 rounded border px-2 py-1">
                    <CollapsibleTrigger className="text-left text-[11px] font-medium text-teal-700 underline dark:text-teal-300">
                      SQL: diagnose row count vs marketing site
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/60 p-2 text-[10px]">
                        {PROPERTY_ROW_COUNT_DIAGNOSTIC_SQL}
                      </pre>
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="mt-2 max-h-72 overflow-auto rounded border text-xs">
                    <table className="w-full">
                      <tbody>
                        {analyticsQuery.data.listings_per_building_proof.top_buildings_by_listing_count.map(
                          (row) => (
                            <Fragment key={row.building_key}>
                              <tr className="border-t">
                                <td className="p-1 break-all max-w-[200px]">{row.building_key}</td>
                                <td className="p-1 text-right tabular-nums">{row.listing_count}</td>
                              </tr>
                              {(row.sample_rows?.length ?? 0) > 0 ? (
                                <tr className="border-t bg-muted/20">
                                  <td colSpan={2} className="p-2 align-top">
                                    <div className="space-y-1.5 text-[11px] text-muted-foreground">
                                      {row.sample_rows?.map((p, i) => (
                                        <div key={i}>
                                          {p.listing_url ? (
                                            <a
                                              href={p.listing_url}
                                              className="break-all text-teal-700 underline dark:text-teal-300"
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {p.listing_url.length > 90
                                                ? `${p.listing_url.slice(0, 90)}\u2026`
                                                : p.listing_url}
                                            </a>
                                          ) : (
                                            <span>\u2014</span>
                                          )}
                                          {p.property_name ? (
                                            <span className="text-foreground/80"> \u00b7 {p.property_name}</span>
                                          ) : null}
                                          {p.latitude != null && p.longitude != null ? (
                                            <span className="tabular-nums">
                                              {" "}
                                              \u00b7 {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                                            </span>
                                          ) : null}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </Fragment>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ── Staleness ── */}
          <Card>
            <CardHeader>
              <CardTitle>Staleness (hours since scrape)</CardTitle>
              <CardDescription>
                Rows with parsed timestamp:{" "}
                {analyticsQuery.data.staleness.rows_with_timestamp.toLocaleString()}
                {analyticsQuery.data.staleness.rows_parse_failed
                  ? ` \u00b7 parse issues: ${analyticsQuery.data.staleness.rows_parse_failed}`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <div className="text-muted-foreground">p50 / p90 age (h)</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.age_hours_p50?.toFixed(1) ?? "\u2014"} /{" "}
                  {analyticsQuery.data.staleness.age_hours_p90?.toFixed(1) ?? "\u2014"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Min / max age (h)</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.age_hours_min?.toFixed(1) ?? "\u2014"} /{" "}
                  {analyticsQuery.data.staleness.age_hours_max?.toFixed(1) ?? "\u2014"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">&gt; 7d / &gt; 30d</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.pct_older_than_7d?.toFixed(1) ?? "\u2014"}% /{" "}
                  {analyticsQuery.data.staleness.pct_older_than_30d?.toFixed(1) ?? "\u2014"}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── ZIP + staleness charts ── */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ZIP codes (listings)</CardTitle>
                <CardDescription>Top ZIPs by row count in bbox</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                {zipChart.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zipChart} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="zip5" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="listing_rows" fill="var(--color-teal-600, #0d9488)" name="Rows" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm">No ZIP data (column missing or empty).</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mean age by source</CardTitle>
                <CardDescription>Hours since scrape, grouped by company</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                {stalenessCompanyChart.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stalenessCompanyChart}
                      layout="vertical"
                      margin={{ left: 24, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="bucket"
                        width={100}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="age_hours_mean"
                        fill="#6366f1"
                        name="Mean hours"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm">No staleness breakdown.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Bedroom mix ── */}
          <Card>
            <CardHeader>
              <CardTitle>Bedroom mix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analyticsQuery.data.bedroom_mix).map(([k, v]) => (
                  <span
                    key={k}
                    className="rounded-full bg-muted px-3 py-1 text-sm"
                  >
                    {k}: <strong>{v}</strong>
                  </span>
                ))}
                {Object.keys(analyticsQuery.data.bedroom_mix).length === 0 ? (
                  <span className="text-muted-foreground text-sm">No bedroom labels in region.</span>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* ── On-platform company table ── */}
          <Card>
            <CardHeader>
              <CardTitle>On-platform sources</CardTitle>
              <CardDescription>
                Breakdown of what{"'"}s already in your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto rounded-md border text-sm">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-muted/80">
                    <tr>
                      <th className="p-2">Source</th>
                      <th className="p-2">Listings</th>
                      <th className="p-2">Buildings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsQuery.data.company_slices.map((row, idx) => (
                      <tr key={`${idx}-${row.label}`} className="border-t">
                        <td className="p-2 break-all">{row.label}</td>
                        <td className="p-2 tabular-nums">{row.listing_rows}</td>
                        <td className="p-2 tabular-nums">{row.distinct_buildings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Computed{" "}
            {analyticsQuery.data.computed_at
              ? new Date(analyticsQuery.data.computed_at).toLocaleString()
              : ""}{" "}
            \u00b7 bbox{" "}
            {JSON.stringify(analyticsQuery.data.bbox)}
          </p>
        </>
      ) : null}
    </div>
  );
}
