"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Minus,
  TrendingUp,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import {
  getTrendsPropertyManagerTrendsPost,
  getBuildingTrendsPropertyManagerBuildingTrendsPost,
} from "@/lib/api/generated/sdk.gen";
import type {
  TrendsResponse,
  MetricDelta,
  BuildingDelta,
  BuildingTrendsResponse,
} from "@/lib/api/generated/types.gen";

// ── Formatting helpers ────────────────────────────────────────────────

function fmt$(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function fmtPct(n: number | null | undefined, decimals = 1): string {
  if (n == null) return "—";
  return `${n.toFixed(decimals)}%`;
}

function fmtNum(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Delta badge component ─────────────────────────────────────────────

function DeltaBadge({
  label,
  delta,
  format = "dollar",
}: {
  label: string;
  delta: MetricDelta | null | undefined;
  format?: "dollar" | "pct" | "int";
}) {
  if (!delta || delta.current == null) return null;

  const hasChange = delta.change != null && delta.change !== 0;
  const isPositive = (delta.change ?? 0) > 0;

  let valueStr: string;
  let changeStr: string;
  if (format === "dollar") {
    valueStr = fmt$(delta.current);
    changeStr = delta.change_pct != null ? `${delta.change_pct > 0 ? "+" : ""}${delta.change_pct.toFixed(1)}%` : "";
  } else if (format === "pct") {
    valueStr = fmtPct(delta.current);
    changeStr = delta.change != null ? `${delta.change > 0 ? "+" : ""}${delta.change.toFixed(1)}pp` : "";
  } else {
    valueStr = fmtNum(delta.current);
    changeStr = delta.change != null ? `${delta.change > 0 ? "+" : ""}${delta.change.toFixed(0)}` : "";
  }

  const ArrowIcon = !hasChange ? Minus : isPositive ? ArrowUp : ArrowDown;
  const colorClass = !hasChange
    ? "text-muted-foreground"
    : isPositive
      ? "text-red-500"
      : "text-green-600";

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">{valueStr}</span>
        {hasChange && (
          <span className={`flex items-center text-xs ${colorClass}`}>
            <ArrowIcon className="h-3 w-3" />
            {changeStr}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Building sparkline (inline trend for a single building) ───────────

function BuildingSparkline({
  lat,
  lng,
  radius,
  propertyId,
}: {
  lat: number;
  lng: number;
  radius: number;
  propertyId: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["pm-building-trends", lat, lng, radius, propertyId],
    queryFn: () =>
      getBuildingTrendsPropertyManagerBuildingTrendsPost({
        body: {
          center_latitude: lat,
          center_longitude: lng,
          radius_miles: radius,
          property_id: propertyId,
          weeks: 12,
        },
      }),
    enabled: isApiConfigured(),
    staleTime: 5 * 60_000,
  });

  const snapshots = (data?.data as BuildingTrendsResponse | undefined)?.snapshots;
  if (isLoading) return <div className="h-12 text-xs text-muted-foreground">Loading...</div>;
  if (!snapshots || snapshots.length < 2) return null;

  const chartData = [...snapshots].reverse().map((s) => ({
    week: formatWeek(s.snapshot_week),
    rent: s.median_rent,
  }));

  return (
    <div className="h-16 w-full mt-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="rent"
            stroke="hsl(var(--primary))"
            strokeWidth={1.5}
            dot={false}
          />
          <Tooltip
            formatter={(value: number) => [fmt$(value), "Rent"]}
            labelFormatter={(label: string) => label}
            contentStyle={{ fontSize: 11 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Building movers row ───────────────────────────────────────────────

function BuildingMoverRow({
  delta,
  lat,
  lng,
  radius,
}: {
  delta: BuildingDelta;
  lat: number;
  lng: number;
  radius: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasChange = delta.rent_change_pct != null && delta.rent_change_pct !== 0;
  const isPositive = (delta.rent_change_pct ?? 0) > 0;
  const colorClass = !hasChange
    ? "text-muted-foreground"
    : isPositive
      ? "text-red-500"
      : "text-green-600";

  return (
    <div className="border-b last:border-b-0">
      <button
        className="w-full flex items-center gap-3 py-2 px-1 text-left hover:bg-muted/50 transition-colors text-sm"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {delta.property_name || delta.address || delta.property_id}
            {delta.is_new && (
              <Badge variant="secondary" className="ml-2 text-xs">
                New
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {delta.address}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-medium">{fmt$(delta.current_rent)}</div>
          {hasChange && (
            <div className={`text-xs ${colorClass} flex items-center justify-end gap-0.5`}>
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {delta.rent_change_pct != null ? `${delta.rent_change_pct > 0 ? "+" : ""}${delta.rent_change_pct.toFixed(1)}%` : ""}
            </div>
          )}
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-2 pb-2">
          <BuildingSparkline
            lat={lat}
            lng={lng}
            radius={radius}
            propertyId={delta.property_id}
          />
        </div>
      )}
    </div>
  );
}

// ── Main TrendsCard component ─────────────────────────────────────────

export function TrendsCard({
  lat,
  lng,
  radius,
}: {
  lat: number | null;
  lng: number | null;
  radius: number;
}) {
  const enabled = lat != null && lng != null && isApiConfigured();

  const { data, isLoading } = useQuery({
    queryKey: ["pm-trends", lat, lng, radius],
    queryFn: () =>
      getTrendsPropertyManagerTrendsPost({
        body: {
          center_latitude: lat!,
          center_longitude: lng!,
          radius_miles: radius,
        },
        query: { weeks: 12 },
      }),
    enabled,
    staleTime: 5 * 60_000,
  });

  const trends = data?.data as TrendsResponse | undefined;
  const history = trends?.market_history ?? [];
  const deltas = trends?.market_deltas;
  const buildingDeltas = trends?.building_deltas ?? [];
  const weeksOfData = trends?.weeks_of_data ?? 0;

  // Don't render if no location selected
  if (!enabled) return null;

  // Empty state
  if (!isLoading && weeksOfData === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No trend data yet for this area. Trends build automatically as you
            and others analyze this location.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data (reverse so oldest first for X axis)
  const rentChartData = [...history].reverse().map((s) => ({
    week: formatWeek(s.snapshot_week),
    median: s.median_rent,
    p25: s.p25_rent,
    p75: s.p75_rent,
  }));

  const vacancyChartData = [...history].reverse().map((s) => ({
    week: formatWeek(s.snapshot_week),
    vacancy: s.vacancy_rate_pct,
  }));

  // Top movers (buildings with biggest rent changes)
  const movers = buildingDeltas.filter(
    (d) => d.rent_change_pct != null || d.is_new
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4" />
          Market Trends
        </CardTitle>
        <CardDescription>
          {weeksOfData} week{weeksOfData !== 1 ? "s" : ""} of data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* WoW Delta Badges */}
        {deltas && (
          <div className="flex gap-6 flex-wrap">
            <DeltaBadge label="Median Rent" delta={deltas.median_rent} format="dollar" />
            <DeltaBadge label="Vacancy Rate" delta={deltas.vacancy_rate_pct} format="pct" />
            <DeltaBadge label="Sample Size" delta={deltas.sample_size} format="int" />
          </div>
        )}

        {/* Rent Trend Chart */}
        {rentChartData.length >= 2 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Rent Trend</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rentChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      fmt$(value),
                      name === "median" ? "Median" : name === "p25" ? "25th %ile" : "75th %ile",
                    ]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p25"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    name="p25"
                  />
                  <Line
                    type="monotone"
                    dataKey="median"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="median"
                  />
                  <Line
                    type="monotone"
                    dataKey="p75"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                    name="p75"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Vacancy Trend Chart */}
        {vacancyChartData.length >= 2 && vacancyChartData.some((d) => d.vacancy != null) && (
          <div>
            <h4 className="text-sm font-medium mb-2">Vacancy Rate</h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vacancyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `${v}%`}
                    domain={[0, "auto"]}
                  />
                  <Tooltip
                    formatter={(value: number) => [fmtPct(value), "Vacancy"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <defs>
                    <linearGradient id="vacancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="vacancy"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#vacancyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Building Movers */}
        {movers.length > 0 && lat != null && lng != null && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              Building Movers
            </h4>
            <div className="border rounded-md max-h-72 overflow-y-auto">
              {movers.slice(0, 10).map((d) => (
                <BuildingMoverRow
                  key={d.property_id}
                  delta={d}
                  lat={lat}
                  lng={lng}
                  radius={radius}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
