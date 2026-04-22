"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { isApiConfigured } from "@/lib/api/isApiConfigured";
import { getPriceHistogramListingsPriceHistogramGet } from "@/lib/api/generated/sdk.gen";
import type {
  GetPriceHistogramListingsPriceHistogramGetData,
  PriceHistogramResponse,
} from "@/lib/api/generated/types.gen";

export type PriceHistogramScope =
  | {
      mode: "bbox";
      west: number;
      south: number;
      east: number;
      north: number;
    }
  | { mode: "city"; city?: string | null; state?: string | null }
  | { mode: "none" };

export type PriceRangeFilterProps = {
  valueMin: number | null;
  valueMax: number | null;
  onApply: (next: { min: number | null; max: number | null }) => void;
  scope: PriceHistogramScope;
  minBeds?: number | null;
  maxBeds?: number | null;
  /** Shown in the trigger when no range is set. Defaults to "Any price". */
  placeholder?: string;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  disabled?: boolean;
};

const SLIDER_STEP_LO = 50;
const SLIDER_STEP_HI = 100;
const FALLBACK_MIN = 0;
const FALLBACK_MAX = 10_000;

function formatUsd(v: number): string {
  if (!Number.isFinite(v)) return "$0";
  if (v >= 10_000) {
    return `$${Math.round(v / 1000)}K`;
  }
  return `$${Math.round(v).toLocaleString()}`;
}

function formatUsdPrecise(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "";
  return `$${Math.round(v).toLocaleString()}`;
}

function describeRange(
  min: number | null,
  max: number | null,
  placeholder: string,
): string {
  if (min === null && max === null) return placeholder;
  if (min !== null && max !== null) {
    return `${formatUsd(min)} – ${formatUsd(max)}`;
  }
  if (min !== null) return `≥ ${formatUsd(min)}`;
  return `≤ ${formatUsd(max!)}`;
}

function clamp(v: number, lo: number, hi: number): number {
  if (v < lo) return lo;
  if (v > hi) return hi;
  return v;
}

function parseUsdInput(raw: string): number | null {
  const digits = raw.replace(/[^0-9.]/g, "").trim();
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

function scopeToQuery(
  scope: PriceHistogramScope,
  minBeds?: number | null,
  maxBeds?: number | null,
): GetPriceHistogramListingsPriceHistogramGetData["query"] | null {
  const q: Record<string, unknown> = {};
  if (scope.mode === "bbox") {
    if (
      !Number.isFinite(scope.west) ||
      !Number.isFinite(scope.south) ||
      !Number.isFinite(scope.east) ||
      !Number.isFinite(scope.north) ||
      scope.south >= scope.north ||
      scope.west >= scope.east
    ) {
      return null;
    }
    q.west = scope.west;
    q.south = scope.south;
    q.east = scope.east;
    q.north = scope.north;
  } else if (scope.mode === "city") {
    const c = (scope.city ?? "").trim();
    const s = (scope.state ?? "").trim();
    if (!c && !s) return null;
    if (c) q.city = c;
    if (s) q.state = s;
  } else {
    return null;
  }
  if (typeof minBeds === "number") q.min_beds = minBeds;
  if (typeof maxBeds === "number") q.max_beds = maxBeds;
  return q as GetPriceHistogramListingsPriceHistogramGetData["query"];
}

export function PriceRangeFilter({
  valueMin,
  valueMax,
  onApply,
  scope,
  minBeds,
  maxBeds,
  placeholder = "Any price",
  triggerClassName,
  align = "start",
  disabled,
}: PriceRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const query = useMemo(
    () => scopeToQuery(scope, minBeds, maxBeds),
    [scope, minBeds, maxBeds],
  );
  const histogramQuery = useQuery<PriceHistogramResponse>({
    queryKey: ["price-histogram", query],
    queryFn: async () => {
      const { data } = await getPriceHistogramListingsPriceHistogramGet({
        query: query ?? undefined,
        throwOnError: true,
      });
      return data!;
    },
    enabled: Boolean(query) && open && isApiConfigured(),
    staleTime: 60_000,
  });

  const data = histogramQuery.data;
  const rangeMin = data?.range_min ?? FALLBACK_MIN;
  const rangeMax = data?.range_max ?? FALLBACK_MAX;
  const sliderStep = rangeMax - rangeMin > 5_000 ? SLIDER_STEP_HI : SLIDER_STEP_LO;

  const [draftMin, setDraftMin] = useState<number | null>(valueMin);
  const [draftMax, setDraftMax] = useState<number | null>(valueMax);
  const [minText, setMinText] = useState<string>(formatUsdPrecise(valueMin));
  const [maxText, setMaxText] = useState<string>(formatUsdPrecise(valueMax));

  useEffect(() => {
    if (open) {
      setDraftMin(valueMin);
      setDraftMax(valueMax);
      setMinText(formatUsdPrecise(valueMin));
      setMaxText(formatUsdPrecise(valueMax));
    }
  }, [open, valueMin, valueMax]);

  const sliderLo = draftMin !== null ? clamp(draftMin, rangeMin, rangeMax) : rangeMin;
  const sliderHi = draftMax !== null ? clamp(draftMax, rangeMin, rangeMax) : rangeMax;

  const buckets = data?.buckets ?? [];
  const maxBucketCount = useMemo(
    () => buckets.reduce((m, b) => (b.count > m ? b.count : m), 0),
    [buckets],
  );

  const histogramTotalSpan = rangeMax - rangeMin;
  const hasHistogram = buckets.length > 0 && maxBucketCount > 0 && histogramTotalSpan > 0;

  const handleSliderChange = (v: number[]) => {
    const [lo, hi] = v;
    setDraftMin(lo <= rangeMin ? null : Math.round(lo));
    setDraftMax(hi >= rangeMax ? null : Math.round(hi));
    setMinText(lo <= rangeMin ? "" : formatUsdPrecise(lo));
    setMaxText(hi >= rangeMax ? "" : formatUsdPrecise(hi));
  };

  const handleApply = () => {
    let nextMin = draftMin;
    let nextMax = draftMax;
    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      const swap = nextMin;
      nextMin = nextMax;
      nextMax = swap;
    }
    onApply({ min: nextMin, max: nextMax });
    setOpen(false);
  };

  const handleClear = () => {
    setDraftMin(null);
    setDraftMax(null);
    setMinText("");
    setMaxText("");
  };

  const triggerLabel = describeRange(valueMin, valueMax, placeholder);
  const hasActiveValue = valueMin !== null || valueMax !== null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={hasActiveValue ? "default" : "outline"}
          size="sm"
          className={cn("h-8 px-3 text-xs font-medium", triggerClassName)}
          disabled={disabled}
        >
          Price{hasActiveValue ? ":" : ""} {hasActiveValue ? triggerLabel : ""}
          {!hasActiveValue ? triggerLabel : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-[360px] p-0"
      >
        <div className="border-b px-4 py-3 bg-muted/40 rounded-t-md">
          <h3 className="text-sm font-semibold">Price Range</h3>
        </div>

        <div className="px-4 py-4">
          <div className="mb-2 h-24 w-full">
            {histogramQuery.isLoading && !data ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Loading price distribution…
              </div>
            ) : hasHistogram ? (
              <Histogram
                buckets={buckets.map((b) => ({
                  index: b.index,
                  count: b.count,
                  minRent: b.min_rent,
                  maxRent: b.max_rent,
                }))}
                rangeMin={rangeMin}
                rangeMax={rangeMax}
                maxCount={maxBucketCount}
                selectedMin={draftMin ?? rangeMin}
                selectedMax={draftMax ?? rangeMax}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                {histogramQuery.isError
                  ? "Couldn't load price data"
                  : "Not enough data to chart"}
              </div>
            )}
          </div>

          <Slider
            className="mt-1"
            min={rangeMin}
            max={rangeMax}
            step={sliderStep}
            value={[sliderLo, sliderHi]}
            onValueChange={handleSliderChange}
            disabled={!hasHistogram && !data}
            aria-label="Price range slider"
          />

          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
            <span>{formatUsd(rangeMin)}</span>
            <span>
              {data?.max_rent && data.max_rent > rangeMax
                ? `${formatUsd(rangeMax)}+`
                : formatUsd(rangeMax)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="price-min" className="text-xs font-semibold">
                Min
              </Label>
              <Input
                id="price-min"
                inputMode="numeric"
                placeholder="No min"
                value={minText}
                onChange={(e) => {
                  setMinText(e.target.value);
                  setDraftMin(parseUsdInput(e.target.value));
                }}
                className="h-9"
              />
            </div>
            <div className="pb-2 text-sm text-muted-foreground">–</div>
            <div className="space-y-1">
              <Label htmlFor="price-max" className="text-xs font-semibold">
                Max
              </Label>
              <Input
                id="price-max"
                inputMode="numeric"
                placeholder="No max"
                value={maxText}
                onChange={(e) => {
                  setMaxText(e.target.value);
                  setDraftMax(parseUsdInput(e.target.value));
                }}
                className="h-9"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleClear}
              disabled={draftMin === null && draftMax === null}
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="ml-auto w-full"
            >
              Apply
            </Button>
          </div>

          {data?.sample_size ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Based on {data.sample_size.toLocaleString()} listing
              {data.sample_size === 1 ? "" : "s"}
              {data.median_rent
                ? ` · median ${formatUsdPrecise(data.median_rent)}`
                : ""}
            </p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type HistogramBar = {
  index: number;
  count: number;
  minRent: number;
  maxRent: number;
};

function Histogram({
  buckets,
  rangeMin,
  rangeMax,
  maxCount,
  selectedMin,
  selectedMax,
}: {
  buckets: HistogramBar[];
  rangeMin: number;
  rangeMax: number;
  maxCount: number;
  selectedMin: number;
  selectedMax: number;
}) {
  const interior = buckets.filter((b) => b.index >= 1 && b.minRent < b.maxRent);
  if (interior.length === 0) return null;
  const gap = 2;
  const width = 320;
  const height = 72;
  const barWidth = Math.max(2, width / interior.length - gap);
  const scale = (c: number) => (maxCount > 0 ? (c / maxCount) * height : 0);
  const isSelected = (b: HistogramBar) =>
    b.maxRent > selectedMin && b.minRent < selectedMax;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Price distribution histogram"
    >
      {interior.map((b, i) => {
        const x = i * (barWidth + gap);
        const h = scale(b.count);
        const y = height - h;
        const active = isSelected(b);
        return (
          <rect
            key={b.index}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            rx={1}
            className={active ? "fill-primary" : "fill-primary/25"}
          />
        );
      })}
    </svg>
  );
}
