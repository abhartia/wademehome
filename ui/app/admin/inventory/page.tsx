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

/** Match /auth/me `role` even if casing/whitespace differ; API should send lowercase `admin`. */
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

/** Muted slate tones — distinct from on-platform teal/indigo pie colors. */
const OFF_PLATFORM_PIE_COLORS = [
  "#64748b",
  "#94a3b8",
  "#475569",
  "#78716c",
  "#a8a29e",
  "#cbd5e1",
];

/** Run in your SQL client if row counts on the site disagree with a property_id bucket. */
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
    return raw.filter((s) => s.segment === "off_platform");
  }, [analyticsQuery.data?.cms_market_share_pie]);

  const cmsMarketPieData = useMemo(() => {
    const raw = analyticsQuery.data?.cms_market_share_pie ?? [];
    let onIdx = 0;
    let offIdx = 0;
    return raw
      .filter((s) => (s.listing_rows ?? 0) > 0)
      .map((s) => {
        const onPlatform = s.segment === "on_platform";
        const fill = onPlatform
          ? PIE_PALETTE[onIdx++ % PIE_PALETTE.length]
          : OFF_PLATFORM_PIE_COLORS[offIdx++ % OFF_PLATFORM_PIE_COLORS.length];
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

  const metroPieSlices = useMemo(() => {
    const raw = analyticsQuery.data?.metro_coverage_pie ?? [];
    return raw.filter((s) => s.buildings > 0);
  }, [analyticsQuery.data?.metro_coverage_pie]);

  const onPlatformMixPieData = useMemo(() => {
    const slices = analyticsQuery.data?.company_slices ?? [];
    const total = slices.reduce((acc, s) => acc + (s.listing_rows ?? 0), 0);
    if (total <= 0) return [];
    let idx = 0;
    return slices
      .filter((s) => (s.listing_rows ?? 0) > 0)
      .map((s) => ({
        label: s.label,
        listing_rows: s.listing_rows,
        fill: PIE_PALETTE[idx++ % PIE_PALETTE.length],
      }));
  }, [analyticsQuery.data?.company_slices]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl p-8 text-muted-foreground">
        Checking session…
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
              Count only <strong className="text-foreground">available</strong> rows (API default).
              Uncheck to include unavailable / no-rent rows for debugging.
            </span>
          </label>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Default bounding box covers NYC metro (see API bbox).{" "}
          <strong>Listings vs buildings</strong> is explained with SQL-backed counts per property.{" "}
          <strong>Metro coverage pie</strong> compares distinct buildings in bbox to{" "}
          <code className="text-xs">estimated_metro_rental_buildings</code>.{" "}
          <strong>Large listing-vs-site pie</strong> compares your in-DB rows to{" "}
          <code className="text-xs">estimated_market_listing_rows</code> and JSON off-platform
          estimates — not scraped competitor totals. <strong>Staleness</strong> uses{" "}
          <code className="text-xs">scraped_timestamp</code>. <strong>Target seeds</strong>:{" "}
          <code className="text-xs">data/inventory_targets/nyc_metro_seeds.json</code>.
        </p>
        {analyticsQuery.data?.availability_filter_description ? (
          <p className="max-w-3xl rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <strong className="text-foreground">Availability filter:</strong>{" "}
            {analyticsQuery.data.availability_filter_description}
          </p>
        ) : null}
      </header>

      {analyticsQuery.isLoading ? (
        <p className="text-muted-foreground">Loading analytics…</p>
      ) : null}
      {analyticsQuery.isError ? (
        <p className="text-destructive">
          {(analyticsQuery.error as Error)?.message ?? "Failed to load analytics"}
        </p>
      ) : null}

      {analyticsQuery.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Listings (rows)</CardTitle>
                <CardDescription>
                  In bbox, table {analyticsQuery.data.listings_table}
                  {analyticsQuery.data.available_only !== false ? " · available-only" : " · all rows"}
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
                      : "—"}
                  </span>
                </div>
                <div>
                  Image present:{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.image_present_pct != null
                      ? `${analyticsQuery.data.quality.image_present_pct}%`
                      : "—"}
                  </span>
                </div>
                <div>
                  Top-5 CMS share (of bbox rows):{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.top5_priority_share_pct != null
                      ? `${analyticsQuery.data.quality.top5_priority_share_pct}%`
                      : "—"}
                  </span>
                </div>
                <div>
                  Duplicate listing_id rows:{" "}
                  <span className="font-medium tabular-nums">
                    {analyticsQuery.data.quality.duplicate_listing_id_rows ?? "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Proof: listings per property (same bbox)</CardTitle>
              <CardDescription>
                One row = one inventory record (often a unit). Distinct buildings group by{" "}
                <code className="text-xs">property_id</code> or rounded lat/lng. Mean ≈{" "}
                <strong>
                  {(
                    analyticsQuery.data.total_listing_rows /
                    Math.max(analyticsQuery.data.distinct_buildings, 1)
                  ).toFixed(2)}
                </strong>{" "}
                rows ÷ buildings; below is the distribution used for that ratio.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
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
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Max listings, one building</dt>
                  <dd className="font-medium tabular-nums">
                    {analyticsQuery.data.listings_per_building_proof.max_listings_single_building?.toLocaleString() ??
                      "—"}
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
                    2–5 listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_2_to_5}
                  </li>
                  <li>
                    6–15 listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_6_to_15}
                  </li>
                  <li>
                    16+ listings: {analyticsQuery.data.listings_per_building_proof.buildings_with_count_16_plus}
                  </li>
                </ul>
                <div className="mt-3 text-muted-foreground text-xs">
                  Highest listing counts (sample).{" "}
                  <span className="text-foreground/80">
                    Keys are <code className="text-[10px]">property_id</code> (or lat/lng) — not building
                    names. Sample rows below help verify mega-counts.
                  </span>
                </div>
                <Collapsible className="mt-2 rounded border px-2 py-1">
                  <CollapsibleTrigger className="text-left text-[11px] font-medium text-teal-700 underline dark:text-teal-300">
                    SQL: diagnose row count vs marketing site (example property_id)
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <p className="mb-1 text-[10px] text-muted-foreground">
                      If the Greystar page shows fewer homes than the table, compare distinct{" "}
                      <code className="text-[10px]">unit_id</code> / <code className="text-[10px]">unit_name</code>{" "}
                      to <code className="text-[10px]">listing_id</code>.                       New Greystar scrapes append a <code className="text-[10px]">_u…</code> suffix to{" "}
                      <code className="text-[10px]">listing_id</code> when{" "}
                      <code className="text-[10px]">unitId</code> is present (re-ingest to apply).
                    </p>
                    <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/60 p-2 text-[10px]">
                      {PROPERTY_ROW_COUNT_DIAGNOSTIC_SQL}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
                <div className="max-h-72 overflow-auto rounded border text-xs">
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
                                              ? `${p.listing_url.slice(0, 90)}…`
                                              : p.listing_url}
                                          </a>
                                        ) : (
                                          <span>—</span>
                                        )}
                                        {p.property_name ? (
                                          <span className="text-foreground/80"> · {p.property_name}</span>
                                        ) : null}
                                        {p.latitude != null && p.longitude != null ? (
                                          <span className="tabular-nums">
                                            {" "}
                                            · {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metro rental stock vs platform inventory (estimated)</CardTitle>
              <CardDescription>
                Distinct buildings <strong>in the bbox</strong> compared to{" "}
                <code className="text-xs">estimated_metro_rental_buildings</code> in{" "}
                <code className="text-xs">nyc_metro_coverage_context.json</code>. The large
                slice is “everything we don’t have,” per your benchmark—not an automatic crawl
                of the internet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsQuery.data.metro_coverage_estimate.inventory_meets_or_exceeds_estimate ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                  On-platform building count meets or exceeds your estimate—raise{" "}
                  <code className="text-xs">estimated_metro_rental_buildings</code> or tighten
                  the definition (e.g. only large multifamily).
                </p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px]">
                  {metroPieSlices.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metroPieSlices as unknown as Record<string, unknown>[]}
                          dataKey="buildings"
                          nameKey="label"
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          label={({ name, percent }) =>
                            `${String(name).slice(0, 28)}${String(name).length > 28 ? "…" : ""} ${((percent as number) * 100).toFixed(1)}%`
                          }
                        >
                          {metroPieSlices.map((_, i) => (
                            <Cell
                              key={`m-${i}`}
                              fill={i === 0 ? "#0d9488" : "#cbd5e1"}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No non-zero slices (no inventory in bbox, or estimate not configured).
                    </p>
                  )}
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Estimate configured</dt>
                    <dd className="font-medium">
                      {analyticsQuery.data.metro_coverage_estimate.configured ? "Yes" : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estimated metro buildings</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.metro_coverage_estimate.estimated_metro_buildings?.toLocaleString() ??
                        "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">On platform (bbox)</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.metro_coverage_estimate.on_platform_buildings?.toLocaleString() ??
                        "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Gap (estimate − on platform)</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.metro_coverage_estimate.gap_buildings?.toLocaleString() ??
                        "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Estimated market listing rows (CMS pie)</dt>
                    <dd className="font-medium tabular-nums">
                      {analyticsQuery.data.metro_coverage_estimate.estimated_market_listing_rows?.toLocaleString() ??
                        "—"}
                    </dd>
                  </div>
                  {analyticsQuery.data.metro_coverage_estimate.cms_market_pie_warning ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
                      {analyticsQuery.data.metro_coverage_estimate.cms_market_pie_warning}
                    </div>
                  ) : null}
                  {analyticsQuery.data.metro_coverage_estimate.methodology_note ? (
                    <div className="pt-2 text-muted-foreground">
                      {analyticsQuery.data.metro_coverage_estimate.methodology_note}
                    </div>
                  ) : null}
                </dl>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to read coverage (operators vs CMS vs market)</CardTitle>
              <CardDescription>What each chart is for — and what it is not</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Greystar</strong> in your data is the{" "}
                <strong>operator</strong> label on rows from greystar.com-style feeds — not an internet
                listing site like StreetEasy. <strong className="text-foreground">RentCafe</strong> is a{" "}
                <strong>leasing / consumer CMS</strong> channel (RealPage ecosystem) used as the scraper
                <code className="text-[10px]"> company</code> field for many property sites.
              </p>
              <p>
                The <strong className="text-foreground">large pie</strong> below compares{" "}
                <em>available rows you have ingested in this bbox</em> to your own{" "}
                <code className="text-[10px]">estimated_market_listing_rows</code> and configured
                off-platform <em>estimates</em>. A small Greystar slice there means your platform holds a
                small fraction of the <em>total metro rental rows you assume exist</em> — not that Greystar
                is a small company.
              </p>
              <p>
                The <strong className="text-foreground">on-platform mix</strong> pie (next) always sums to
                100% of your <em>ingested</em> rows by <code className="text-[10px]">company</code> — use it
                to prioritize scrapers (Greystar vs RentCafe vs others).
              </p>
              <p>
                Progress toward a one-stop renter search: raise on-platform counts (more sources, seeds,
                ZIPs), narrow the unallocated off-platform slice via better JSON breakdowns, and close the
                metro <strong>buildings</strong> gap using{" "}
                <code className="text-[10px]">estimated_metro_rental_buildings</code>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staleness (hours since scrape)</CardTitle>
              <CardDescription>
                Rows with parsed timestamp:{" "}
                {analyticsQuery.data.staleness.rows_with_timestamp.toLocaleString()}
                {analyticsQuery.data.staleness.rows_parse_failed
                  ? ` · parse issues: ${analyticsQuery.data.staleness.rows_parse_failed}`
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <div className="text-muted-foreground">p50 / p90 age (h)</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.age_hours_p50?.toFixed(1) ?? "—"} /{" "}
                  {analyticsQuery.data.staleness.age_hours_p90?.toFixed(1) ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Min / max age (h)</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.age_hours_min?.toFixed(1) ?? "—"} /{" "}
                  {analyticsQuery.data.staleness.age_hours_max?.toFixed(1) ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">&gt; 7d / &gt; 30d</div>
                <div className="font-medium tabular-nums">
                  {analyticsQuery.data.staleness.pct_older_than_7d?.toFixed(1) ?? "—"}% /{" "}
                  {analyticsQuery.data.staleness.pct_older_than_30d?.toFixed(1) ?? "—"}%
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="min-h-[460px]">
              <CardHeader>
                <CardTitle>Estimated metro listing rows (coverage vs assumptions)</CardTitle>
                <CardDescription>
                  Denominator = your <code className="text-xs">estimated_market_listing_rows</code> for this
                  bbox. <span className="text-teal-700 dark:text-teal-300">Teal palette</span> ={" "}
                  <strong>available</strong> rows in DB (by <code className="text-xs">company</code> /
                  scraper label). <span className="text-slate-600">Slate</span> = your JSON estimates for
                  listings not on the platform + unallocated remainder —{" "}
                  <strong>not</strong> live-scraped ILS totals.
                </CardDescription>
              </CardHeader>
            <CardContent className="h-[380px]">
              {cmsMarketPieData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cmsMarketPieData as unknown as Record<string, unknown>[]}
                      dataKey="listing_rows"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      label={({ percent }) => `${((percent as number) * 100).toFixed(0)}%`}
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
            </CardContent>
          </Card>

            <Card className="min-h-[460px]">
              <CardHeader>
                <CardTitle>On-platform mix (100% of ingested rows)</CardTitle>
                <CardDescription>
                  Same <code className="text-xs">company</code> buckets as the table below — relative share
                  of <strong>available</strong> rows you already have. Use this to choose the next scraper
                  targets; use the metro pie + large pie for total-market progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[380px]">
                {onPlatformMixPieData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={onPlatformMixPieData as unknown as Record<string, unknown>[]}
                        dataKey="listing_rows"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        label={({ percent }) => `${((percent as number) * 100).toFixed(0)}%`}
                      >
                        {onPlatformMixPieData.map((row, i) => (
                          <Cell key={`mix-${i}-${row.label}`} fill={row.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-sm">No on-platform rows in bbox.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {cmsMarketOffPlatformAssumptions.length ? (
            <Collapsible className="rounded-lg border px-4 py-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm font-medium hover:underline">
                Off-platform market assumptions (citations & notes)
                <span className="text-xs font-normal text-muted-foreground">
                  {cmsMarketOffPlatformAssumptions.length} slice
                  {cmsMarketOffPlatformAssumptions.length === 1 ? "" : "s"} · from JSON
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <p className="mb-2 text-xs text-muted-foreground">
                  Estimates only — edit{" "}
                  <code className="text-[10px]">data/inventory_targets/nyc_metro_coverage_context.json</code>{" "}
                  (<code className="text-[10px]">off_platform_listing_sources</code>). Optional{" "}
                  <code className="text-[10px]">note</code> and{" "}
                  <code className="text-[10px]">citation_url</code> per row.
                </p>
                <div className="max-h-64 overflow-auto rounded-md border text-xs">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr>
                        <th className="p-2">Label</th>
                        <th className="p-2">Rows</th>
                        <th className="p-2">Note</th>
                        <th className="p-2">Citation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cmsMarketOffPlatformAssumptions.map((s, idx) => (
                        <tr key={`${s.label}-${s.listing_rows}-${idx}`} className="border-t">
                          <td className="p-2 break-all">{s.label}</td>
                          <td className="p-2 tabular-nums">{s.listing_rows}</td>
                          <td className="p-2 break-words text-muted-foreground">
                            {s.assumption_note ?? "—"}
                          </td>
                          <td className="p-2 break-all">
                            {s.citation_url ? (
                              <a
                                href={s.citation_url}
                                className="text-teal-700 underline dark:text-teal-300"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Link
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : null}

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
                <CardTitle>Mean age by CMS</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Target seed coverage</CardTitle>
              <CardDescription>
                {analyticsQuery.data.target_coverage.covered_count} /{" "}
                {analyticsQuery.data.target_coverage.total_targets} seeds matched in bbox (NYC metro
                default: west {analyticsQuery.data.bbox.west}, south {analyticsQuery.data.bbox.south}, east{" "}
                {analyticsQuery.data.bbox.east}, north {analyticsQuery.data.bbox.north}).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Covered</strong> means at least one listing row in this bbox has a{" "}
                <code className="text-[10px]">listing_url</code> whose prefix matches the seed’s{" "}
                <strong>normalized prefix</strong> (lowercased{" "}
                <code className="text-[10px]">scheme://host/path</code>, no trailing slash on the path), or
                the host appears in the URL. Use property floorplan/marketing URLs you expect in inventory —
                seeds outside this region will always show as uncovered.
              </p>
              <div className="max-h-64 overflow-auto rounded-md border text-sm">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-muted/80">
                    <tr>
                      <th className="p-2">Covered</th>
                      <th className="p-2">Seed / prefix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsQuery.data.target_coverage.targets.map((t) => (
                      <tr key={t.seed_url} className="border-t">
                        <td className="p-2 align-top">{t.covered ? "yes" : "no"}</td>
                        <td className="p-2 break-all">
                          <div>{t.seed_url}</div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            <span className="font-medium text-foreground/80">Prefix:</span>{" "}
                            <code className="break-all text-[10px]">{t.normalized_prefix}</code>
                          </div>
                          {t.matched_listing_sample ? (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Matched: {t.matched_listing_sample}
                            </div>
                          ) : !t.covered ? (
                            <div className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                              No listing URL in bbox matched this prefix (wrong region or URL shape).
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analyticsQuery.data.target_coverage.total_targets === 0 ? (
                  <p className="p-2 text-muted-foreground">
                    Add URLs to the manifest JSON to track off-platform targets.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CMS company (on-platform rows)</CardTitle>
              <CardDescription>
                Same grouping as on-platform slices in the market pie · export-friendly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto rounded-md border text-sm">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-muted/80">
                    <tr>
                      <th className="p-2">Label</th>
                      <th className="p-2">Rows</th>
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
            · bbox{" "}
            {JSON.stringify(analyticsQuery.data.bbox)}
          </p>
        </>
      ) : null}
    </div>
  );
}
