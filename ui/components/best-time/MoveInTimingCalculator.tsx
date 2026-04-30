"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MonthKey =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: "Jan", label: "January" },
  { key: "Feb", label: "February" },
  { key: "Mar", label: "March" },
  { key: "Apr", label: "April" },
  { key: "May", label: "May" },
  { key: "Jun", label: "June" },
  { key: "Jul", label: "July" },
  { key: "Aug", label: "August" },
  { key: "Sep", label: "September" },
  { key: "Oct", label: "October" },
  { key: "Nov", label: "November" },
  { key: "Dec", label: "December" },
];

type MonthMarket = {
  priceIndex: string;
  inventory: string;
  competition: string;
  leverage: string;
  concessions: string;
  recommendation: string;
  hoodFocus: string[];
};

const MARKET: Record<MonthKey, MonthMarket> = {
  Jan: {
    priceIndex: "-7% to -10%",
    inventory: "Very Low",
    competition: "Very Low",
    leverage: "High",
    concessions: "1–2 months free common; broker fee waived; reduced security deposit",
    recommendation:
      "Cheapest month to sign. Be flexible on neighborhood and unit type — the deals are real but inventory is thin.",
    hoodFocus: ["long-island-city", "upper-west-side", "park-slope"],
  },
  Feb: {
    priceIndex: "-5% to -8%",
    inventory: "Low",
    competition: "Low",
    leverage: "High",
    concessions: "1 month free standard; lease-up towers especially aggressive",
    recommendation:
      "Second-cheapest month. New-construction lease-ups are still pushing concessions to clear winter inventory.",
    hoodFocus: ["long-island-city", "luxury-apartments", "no-fee-apartments"],
  },
  Mar: {
    priceIndex: "-3% to -5%",
    inventory: "Building",
    competition: "Moderate",
    leverage: "Moderate",
    concessions: "Half-month free or paint/appliance upgrades on units listed > 3 weeks",
    recommendation:
      "Last clean shoulder month before peak. Inventory is opening up but pricing has not fully reset.",
    hoodFocus: ["williamsburg", "east-village", "park-slope"],
  },
  Apr: {
    priceIndex: "-1% to -3%",
    inventory: "Building",
    competition: "Rising",
    leverage: "Moderate",
    concessions: "Selective; mostly on long-vacant units",
    recommendation:
      "Final shoulder window. If you can sign by mid-April for a May 1 move-in, you get strong selection at sub-peak pricing.",
    hoodFocus: ["chelsea", "harlem", "lower-east-side"],
  },
  May: {
    priceIndex: "+2% to +5%",
    inventory: "High",
    competition: "High",
    leverage: "Low",
    concessions: "Disappearing — only on units that have been listed >30 days",
    recommendation:
      "The tipping month. Through mid-May you still have negotiating room; by late May the market has flipped to landlord-favored.",
    hoodFocus: ["bushwick", "astoria", "bed-stuy"],
  },
  Jun: {
    priceIndex: "+5% to +8%",
    inventory: "Peak",
    competition: "Peak",
    leverage: "Very Low",
    concessions: "Effectively none; bidding wars in popular hoods",
    recommendation:
      "Maximum competition month. Tour multiple per day, apply within hours, expand neighborhood list to value submarkets.",
    hoodFocus: ["astoria", "bushwick", "harlem"],
  },
  Jul: {
    priceIndex: "+7% to +10%",
    inventory: "Peak",
    competition: "Peak",
    leverage: "Very Low",
    concessions: "None standard; bidding wars common",
    recommendation:
      "Most expensive month of the year. Have docs pre-packaged as a single PDF; landlord turnaround is under 24 hours on desirable units.",
    hoodFocus: ["astoria", "long-island-city", "bushwick"],
  },
  Aug: {
    priceIndex: "+5% to +8%",
    inventory: "High",
    competition: "High",
    leverage: "Low",
    concessions: "Almost none; occasional half-month on stale listings",
    recommendation:
      "Demand peaks early August (corporate relocations + late grads). By month-end the curve breaks slightly.",
    hoodFocus: ["williamsburg", "east-village", "chelsea"],
  },
  Sep: {
    priceIndex: "+2% to +4%",
    inventory: "Strong",
    competition: "Moderate",
    leverage: "Moderate",
    concessions: "Repriced summer carryover; minor concessions on long-vacant",
    recommendation:
      "Smarter than peak summer if you have 30–60 days flexibility. Strong selection from summer carryover, easing pricing.",
    hoodFocus: ["greenpoint", "park-slope", "lower-east-side"],
  },
  Oct: {
    priceIndex: "0% to -2%",
    inventory: "Strong",
    competition: "Easing",
    leverage: "Moderate",
    concessions: "Reappearing on luxury / new-construction inventory",
    recommendation:
      "First half of the best balance window. Pricing back to annual average with summer-carryover selection.",
    hoodFocus: ["luxury-apartments", "tribeca", "soho"],
  },
  Nov: {
    priceIndex: "-3% to -5%",
    inventory: "Moderate",
    competition: "Low",
    leverage: "High",
    concessions: "1 month free returning; broker fee negotiation possible",
    recommendation:
      "Many experienced renters' favorite month. Negotiation leverage rebuilds and pricing softens before holiday slowdown.",
    hoodFocus: ["west-village", "luxury-apartments", "upper-west-side"],
  },
  Dec: {
    priceIndex: "-5% to -8%",
    inventory: "Low",
    competition: "Very Low",
    leverage: "High",
    concessions: "Most aggressive of the year on units listed since November",
    recommendation:
      "Quietest month. Landlords with two-month-old listings are genuinely worried — best leverage of the year if you can stomach a holiday-week move.",
    hoodFocus: ["luxury-apartments", "long-island-city", "no-fee-apartments"],
  },
};

const HOOD_LABELS: Record<string, string> = {
  "long-island-city": "Long Island City",
  "upper-west-side": "Upper West Side",
  "park-slope": "Park Slope",
  "luxury-apartments": "NYC luxury apartments",
  "no-fee-apartments": "NYC no-fee apartments",
  williamsburg: "Williamsburg",
  "east-village": "East Village",
  chelsea: "Chelsea",
  harlem: "Harlem",
  "lower-east-side": "Lower East Side",
  bushwick: "Bushwick",
  astoria: "Astoria",
  "bed-stuy": "Bedford-Stuyvesant",
  greenpoint: "Greenpoint",
  tribeca: "Tribeca",
  soho: "SoHo",
  "west-village": "West Village",
};

function hoodHref(slug: string): string {
  return `/nyc/${slug}`;
}

function subtractDays(monthKey: MonthKey, days: number): {
  startMonth: MonthKey;
  copy: string;
} {
  const idx = MONTHS.findIndex((m) => m.key === monthKey);
  const targetIdx = (idx - Math.floor(days / 30) + 12) % 12;
  const targetMonth = MONTHS[targetIdx].key;
  return {
    startMonth: targetMonth,
    copy: `~${days} days before, around ${MONTHS[targetIdx].label}`,
  };
}

export function MoveInTimingCalculator() {
  const [moveInMonth, setMoveInMonth] = useState<MonthKey>("Jul");
  const [priority, setPriority] = useState<"price" | "selection" | "balance">(
    "balance",
  );

  const market = MARKET[moveInMonth];

  const searchStart = useMemo(() => {
    if (priority === "selection") {
      return subtractDays(moveInMonth, 45);
    }
    if (priority === "price") {
      return subtractDays(moveInMonth, 30);
    }
    return subtractDays(moveInMonth, 35);
  }, [moveInMonth, priority]);

  const cheapestAdvice = useMemo(() => {
    if (priority !== "price") return null;
    const isExpensive = ["May", "Jun", "Jul", "Aug"].includes(moveInMonth);
    if (!isExpensive) return null;
    return "If price is your top priority, consider shifting your move-in date to October–February. Average savings of 5–10% on annual rent (~$2,000–$4,000 on a $3,500/mo lease).";
  }, [moveInMonth, priority]);

  const peakReadiness = useMemo(() => {
    const peakMonths: MonthKey[] = ["May", "Jun", "Jul", "Aug"];
    if (!peakMonths.includes(moveInMonth)) return null;
    return "Peak season requires same-day applications. Have your packet (last 2 pay stubs, W-2, ID, references, bank statements) saved as one PDF before you tour.";
  }, [moveInMonth]);

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Interactive</Badge>
          <Badge variant="outline">2026 Calendar</Badge>
        </div>
        <CardTitle>When should I start my NYC apartment search?</CardTitle>
        <CardDescription>
          Pick your target move-in month and what you care about most. We&apos;ll
          tell you when to start, what the market will look like, and which
          neighborhoods to focus on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="move-in-month">Target move-in month</Label>
            <Select
              value={moveInMonth}
              onValueChange={(v) => setMoveInMonth(v as MonthKey)}
            >
              <SelectTrigger id="move-in-month">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.key} value={m.key}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">What matters most?</Label>
            <Select
              value={priority}
              onValueChange={(v) =>
                setPriority(v as "price" | "selection" | "balance")
              }
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Lowest possible rent</SelectItem>
                <SelectItem value="selection">Maximum selection</SelectItem>
                <SelectItem value="balance">Balance of both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-background p-4 space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Start active touring
            </p>
            <p className="text-base font-semibold">
              {MONTHS.find((m) => m.key === searchStart.startMonth)?.label} (
              {searchStart.copy})
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Expected price index
              </p>
              <p className="font-semibold">{market.priceIndex}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Inventory
              </p>
              <p className="font-semibold">{market.inventory}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Competition
              </p>
              <p className="font-semibold">{market.competition}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Negotiating leverage
              </p>
              <p className="font-semibold">{market.leverage}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Concessions to expect
            </p>
            <p className="text-sm">{market.concessions}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Strategy for this month
            </p>
            <p className="text-sm">{market.recommendation}</p>
          </div>

          {cheapestAdvice ? (
            <div className="rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
              {cheapestAdvice}
            </div>
          ) : null}

          {peakReadiness ? (
            <div className="rounded border border-blue-300 bg-blue-50 p-2 text-xs text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-100">
              {peakReadiness}
            </div>
          ) : null}

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground mb-1">
              Best-fit neighborhoods this month
            </p>
            <div className="flex flex-wrap gap-2">
              {market.hoodFocus.map((slug) => (
                <Button
                  key={slug}
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={hoodHref(slug)}>{HOOD_LABELS[slug] ?? slug}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Calendar reflects multi-year median patterns across Manhattan,
          Brooklyn, and Queens market-rate inventory. Individual neighborhoods
          and luxury submarkets show smaller seasonality.
        </p>
      </CardContent>
    </Card>
  );
}
