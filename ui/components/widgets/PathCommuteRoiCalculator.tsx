"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Info,
  RotateCcw,
  Train,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

const fmtUSD = (n: number) =>
  isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "—";
const fmtMin = (n: number) =>
  isFinite(n) ? `${Math.round(n)} min` : "—";
const fmtHour = (n: number) =>
  isFinite(n) ? `${Math.round(n).toLocaleString()} hr` : "—";

type NjOrigin =
  | "hoboken"
  | "newport"
  | "exchange-place"
  | "grove-st"
  | "journal-square"
  | "harrison";

type NycDest =
  | "wtc"
  | "christopher"
  | "9th"
  | "14th"
  | "23rd"
  | "33rd";

const NJ_ORIGINS: { value: NjOrigin; label: string }[] = [
  { value: "hoboken", label: "Hoboken Terminal" },
  { value: "newport", label: "Newport (Pavonia)" },
  { value: "exchange-place", label: "Exchange Place" },
  { value: "grove-st", label: "Grove Street" },
  { value: "journal-square", label: "Journal Square" },
  { value: "harrison", label: "Harrison" },
];

const NYC_DESTS: { value: NycDest; label: string; near: string }[] = [
  { value: "wtc", label: "World Trade Center", near: "FiDi / Tribeca / Battery Park City" },
  { value: "christopher", label: "Christopher St", near: "West Village / SoHo" },
  { value: "9th", label: "9th Street", near: "Greenwich Village / NoHo" },
  { value: "14th", label: "14th Street", near: "Union Square / Meatpacking" },
  { value: "23rd", label: "23rd Street", near: "Flatiron / Chelsea" },
  { value: "33rd", label: "33rd Street (Herald Sq)", near: "Midtown South / Penn / NoMad" },
];

// One-way ride time on PATH, including typical transfer when required.
// Sourced from published PANYNJ schedules (off-peak weekday baseline).
const PATH_RIDE: Record<NjOrigin, Record<NycDest, { time: number; transfer: boolean }>> = {
  hoboken: {
    wtc: { time: 11, transfer: false },
    christopher: { time: 7, transfer: false },
    "9th": { time: 9, transfer: false },
    "14th": { time: 11, transfer: false },
    "23rd": { time: 13, transfer: false },
    "33rd": { time: 15, transfer: false },
  },
  newport: {
    wtc: { time: 8, transfer: false },
    christopher: { time: 5, transfer: false },
    "9th": { time: 7, transfer: false },
    "14th": { time: 9, transfer: false },
    "23rd": { time: 11, transfer: false },
    "33rd": { time: 13, transfer: false },
  },
  "exchange-place": {
    wtc: { time: 4, transfer: false },
    christopher: { time: 13, transfer: true },
    "9th": { time: 15, transfer: true },
    "14th": { time: 17, transfer: true },
    "23rd": { time: 19, transfer: true },
    "33rd": { time: 21, transfer: true },
  },
  "grove-st": {
    wtc: { time: 7, transfer: false },
    christopher: { time: 9, transfer: false },
    "9th": { time: 11, transfer: false },
    "14th": { time: 13, transfer: false },
    "23rd": { time: 15, transfer: false },
    "33rd": { time: 17, transfer: false },
  },
  "journal-square": {
    wtc: { time: 11, transfer: false },
    christopher: { time: 13, transfer: false },
    "9th": { time: 15, transfer: false },
    "14th": { time: 17, transfer: false },
    "23rd": { time: 19, transfer: false },
    "33rd": { time: 21, transfer: false },
  },
  harrison: {
    wtc: { time: 16, transfer: false },
    christopher: { time: 19, transfer: true },
    "9th": { time: 21, transfer: true },
    "14th": { time: 23, transfer: true },
    "23rd": { time: 25, transfer: true },
    "33rd": { time: 27, transfer: true },
  },
};

// 2025 PATH SmartLink monthly: $106 unlimited.
const SMARTLINK_MONTHLY_USD = 106;

// Typical wait between trains, off-peak weekday.
const AVG_WAIT_MIN = 5;
// Typical transfer time at Hoboken / Newport / Exchange Place.
const TRANSFER_MIN = 5;

// 5 days/wk × 50 work weeks (factoring 2 wks PTO/holiday).
const ANNUAL_WORK_WEEKS = 50;

export interface PathCommuteRoiCalculatorProps {
  bare?: boolean;
  showAttribution?: boolean;
}

export function PathCommuteRoiCalculator({
  bare = false,
  showAttribution = false,
}: PathCommuteRoiCalculatorProps) {
  const [origin, setOrigin] = useState<NjOrigin>("hoboken");
  const [dest, setDest] = useState<NycDest>("33rd");
  const [njRent, setNjRent] = useState<string>("3200");
  const [nycRent, setNycRent] = useState<string>("4500");
  const [hourlyValue, setHourlyValue] = useState<string>("50");
  const [daysPerWeek, setDaysPerWeek] = useState<string>("5");
  const [walkToStation, setWalkToStation] = useState<string>("8");
  const [walkToOffice, setWalkToOffice] = useState<string>("5");
  const [nycResidentCommute, setNycResidentCommute] = useState<string>("20");
  const [includeSmartLink, setIncludeSmartLink] = useState<boolean>(true);

  const ride = PATH_RIDE[origin][dest];

  const result = useMemo(() => {
    const njRentN = Number(njRent) || 0;
    const nycRentN = Number(nycRent) || 0;
    const hv = Number(hourlyValue) || 0;
    const dpw = Math.max(0, Math.min(7, Number(daysPerWeek) || 0));
    const walkA = Math.max(0, Number(walkToStation) || 0);
    const walkB = Math.max(0, Number(walkToOffice) || 0);
    const nycCommute = Math.max(0, Number(nycResidentCommute) || 0);

    const njOneWay =
      walkA +
      AVG_WAIT_MIN +
      ride.time +
      (ride.transfer ? TRANSFER_MIN : 0) +
      walkB;

    // NYC-resident scenario: assume the same destination office, with a
    // shorter subway commute from a Manhattan apartment of equivalent rent.
    const nycOneWay = nycCommute;

    const extraOneWay = Math.max(0, njOneWay - nycOneWay);
    const extraDaily = extraOneWay * 2;
    const extraAnnualMin = extraDaily * dpw * ANNUAL_WORK_WEEKS;
    const extraAnnualHours = extraAnnualMin / 60;

    const annualCommuteCost = extraAnnualHours * hv;
    const smartLinkAnnual = includeSmartLink ? SMARTLINK_MONTHLY_USD * 12 : 0;
    const annualRentSavings = (nycRentN - njRentN) * 12;
    const netRoi = annualRentSavings - annualCommuteCost - smartLinkAnnual;

    const breakEvenHourly =
      extraAnnualHours > 0
        ? (annualRentSavings - smartLinkAnnual) / extraAnnualHours
        : Infinity;

    let verdict: "worth-it" | "marginal" | "not-worth-it" | "neutral";
    let verdictNote: string;
    if (annualRentSavings <= 0) {
      verdict = "not-worth-it";
      verdictNote =
        "Your NJ rent is at or above the Manhattan equivalent — there's no rent arbitrage here, just extra commute.";
    } else if (extraAnnualHours <= 0) {
      verdict = "worth-it";
      verdictNote =
        "Your NJ commute is at least as fast as the Manhattan-resident scenario you compared. Pure win.";
    } else if (netRoi > annualRentSavings * 0.4) {
      verdict = "worth-it";
      verdictNote =
        "Net annual ROI is solidly positive after pricing every extra commute hour. Move to NJ pencils out.";
    } else if (netRoi > 0) {
      verdict = "marginal";
      verdictNote =
        "ROI is positive but the margin is thin. Sensitivity check: re-run with $/hour ±50% before committing.";
    } else {
      verdict = "not-worth-it";
      verdictNote =
        "Once you price commute time, the NJ rent savings don't cover it. Either negotiate a faster commute (closer station, shorter walks) or stay in NYC.";
    }

    return {
      njOneWay,
      nycOneWay,
      extraOneWay,
      extraDaily,
      extraAnnualHours,
      annualCommuteCost,
      smartLinkAnnual,
      annualRentSavings,
      netRoi,
      breakEvenHourly,
      verdict,
      verdictNote,
    };
  }, [
    njRent,
    nycRent,
    hourlyValue,
    daysPerWeek,
    walkToStation,
    walkToOffice,
    nycResidentCommute,
    includeSmartLink,
    ride,
  ]);

  const reset = () => {
    setOrigin("hoboken");
    setDest("33rd");
    setNjRent("3200");
    setNycRent("4500");
    setHourlyValue("50");
    setDaysPerWeek("5");
    setWalkToStation("8");
    setWalkToOffice("5");
    setNycResidentCommute("20");
    setIncludeSmartLink(true);
  };

  const verdictTone =
    result.verdict === "worth-it"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
      : result.verdict === "marginal"
        ? "border-amber-300 bg-amber-50 text-amber-900"
        : "border-rose-300 bg-rose-50 text-rose-900";

  const verdictLabel =
    result.verdict === "worth-it"
      ? "Worth it"
      : result.verdict === "marginal"
        ? "Marginal"
        : "Not worth it";

  const Body = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pc-origin">PATH origin (NJ side)</Label>
          <Select
            value={origin}
            onValueChange={(v) => setOrigin(v as NjOrigin)}
          >
            <SelectTrigger id="pc-origin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NJ_ORIGINS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pc-dest">PATH destination (Manhattan side)</Label>
          <Select
            value={dest}
            onValueChange={(v) => setDest(v as NycDest)}
          >
            <SelectTrigger id="pc-dest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NYC_DESTS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label} — {d.near}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pc-walk-a">Walk to PATH station (min)</Label>
          <Input
            id="pc-walk-a"
            type="number"
            inputMode="decimal"
            value={walkToStation}
            onChange={(e) => setWalkToStation(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pc-walk-b">Walk from station to office (min)</Label>
          <Input
            id="pc-walk-b"
            type="number"
            inputMode="decimal"
            value={walkToOffice}
            onChange={(e) => setWalkToOffice(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pc-nj-rent">Monthly rent — NJ apartment ($)</Label>
          <Input
            id="pc-nj-rent"
            type="number"
            inputMode="decimal"
            placeholder="3200"
            value={njRent}
            onChange={(e) => setNjRent(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pc-nyc-rent">
            Monthly rent — comparable Manhattan apartment ($)
          </Label>
          <Input
            id="pc-nyc-rent"
            type="number"
            inputMode="decimal"
            placeholder="4500"
            value={nycRent}
            onChange={(e) => setNycRent(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="pc-hourly">Your $/hour value of time</Label>
          <Input
            id="pc-hourly"
            type="number"
            inputMode="decimal"
            placeholder="50"
            value={hourlyValue}
            onChange={(e) => setHourlyValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Rule of thumb: salary ÷ 2,000. $100k ≈ $50/hr.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pc-dpw">Days commuting / week</Label>
          <Input
            id="pc-dpw"
            type="number"
            inputMode="numeric"
            placeholder="5"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pc-nyc-commute">
            Manhattan-resident commute (min, one-way)
          </Label>
          <Input
            id="pc-nyc-commute"
            type="number"
            inputMode="decimal"
            placeholder="20"
            value={nycResidentCommute}
            onChange={(e) => setNycResidentCommute(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Typical Manhattan-to-Manhattan subway commute is 15–25 min.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-md border p-3">
        <input
          id="pc-smartlink"
          type="checkbox"
          checked={includeSmartLink}
          onChange={(e) => setIncludeSmartLink(e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="pc-smartlink" className="cursor-pointer text-sm font-normal">
          Include PATH SmartLink monthly ($106/mo, $1,272/yr)
        </Label>
      </div>

      <div className={`rounded-lg border p-4 ${verdictTone}`} role="status" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {result.verdict === "worth-it" ? (
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          ) : (
            <ArrowDownRight className="h-4 w-4" aria-hidden />
          )}
          <span>
            Verdict: <span className="font-semibold">{verdictLabel}</span> ·{" "}
            Net annual ROI{" "}
            <span className="text-base font-semibold">
              {fmtUSD(result.netRoi)}
            </span>
          </span>
          {ride.transfer ? (
            <Badge variant="outline">Transfer required</Badge>
          ) : (
            <Badge variant="secondary">Direct PATH ride</Badge>
          )}
        </div>
        <p className="mt-2 text-sm">
          {result.verdictNote}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">One-way commute (NJ → office)</div>
                  <div className="text-xs text-muted-foreground">
                    Walk {walkToStation} min + {AVG_WAIT_MIN} min wait + {ride.time} min ride
                    {ride.transfer ? ` + ${TRANSFER_MIN} min transfer` : ""} + walk{" "}
                    {walkToOffice} min.
                  </div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtMin(result.njOneWay)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">
                    One-way commute (Manhattan resident, equivalent rent)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Your input — used as the alternative-scenario baseline.
                  </div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtMin(result.nycOneWay)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">Extra commute, round-trip / day</div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtMin(result.extraDaily)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">Extra commute / year</div>
                  <div className="text-xs text-muted-foreground">
                    {daysPerWeek}d/wk × {ANNUAL_WORK_WEEKS} work weeks.
                  </div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtHour(result.extraAnnualHours)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">Annual cost of extra commute</div>
                  <div className="text-xs text-muted-foreground">
                    {fmtHour(result.extraAnnualHours)} × ${hourlyValue}/hr.
                  </div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtUSD(result.annualCommuteCost)}
                </TableCell>
              </TableRow>
              {includeSmartLink ? (
                <TableRow>
                  <TableCell className="align-top">
                    <div className="font-medium">PATH SmartLink (annual)</div>
                    <div className="text-xs text-muted-foreground">
                      $106/mo × 12. Cheaper than NYC unlimited MetroCard ($132/mo) but most NJ
                      commuters still buy MetroCards on top.
                    </div>
                  </TableCell>
                  <TableCell className="text-right align-top font-medium">
                    {fmtUSD(result.smartLinkAnnual)}
                  </TableCell>
                </TableRow>
              ) : null}
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">Annual rent savings (NYC − NJ) × 12</div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {fmtUSD(result.annualRentSavings)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Net ROI / year</TableCell>
                <TableCell className="text-right font-semibold">
                  {fmtUSD(result.netRoi)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <div className="font-medium">Break-even $/hour value of time</div>
                  <div className="text-xs text-muted-foreground">
                    The hourly rate at which the move just barely pays for itself.
                  </div>
                </TableCell>
                <TableCell className="text-right align-top font-medium">
                  {isFinite(result.breakEvenHourly)
                    ? `$${Math.round(result.breakEvenHourly).toLocaleString()}/hr`
                    : "—"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={reset} variant="outline" className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button asChild type="button" variant="ghost" className="gap-1.5">
          <Link href="/jersey-city">
            See JC rentals <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button asChild type="button" variant="ghost" className="gap-1.5">
          <Link href="/hoboken">
            See Hoboken rentals <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="rounded-md bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-foreground">
          <Train className="h-4 w-4" aria-hidden />
          <span className="font-semibold">How the math works</span>
        </div>
        <p>
          One-way NJ commute = walk to station + average PATH wait ({AVG_WAIT_MIN} min) + published
          ride time + transfer time when required ({TRANSFER_MIN} min) + walk to office. Extra
          annual commute = (NJ one-way − Manhattan one-way) × 2 × days/week × {ANNUAL_WORK_WEEKS}{" "}
          work weeks. Net ROI = annual rent savings − (extra commute hours × $/hour) − annual PATH
          SmartLink. Break-even $/hour is the rate at which net ROI is exactly $0 — if your real
          $/hour is above it, the NJ move is losing you money on time alone.
        </p>
        <p className="mt-2">
          Manhattan-resident commute baseline is your input — set it to the realistic subway commute
          you&apos;d face from a Manhattan apartment of equivalent rent to the same office. PATH
          ride times are off-peak weekday baselines from PANYNJ; peak service can be 1–2 min faster
          on direct routes but slightly worse on transfer routes.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0" aria-hidden />
        <p>
          Educational only — does not include Penn Station / NJ Transit, commuter ferry, or PATH
          peak/late-night schedule variability. Always verify with{" "}
          <a
            href="https://www.panynj.gov/path/en/index.html"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2"
          >
            PANYNJ
          </a>{" "}
          before signing a lease.
        </p>
      </div>

      {showAttribution ? (
        <div className="border-t pt-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://wademehome.com/tools/path-commute-roi-calculator"
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Wade Me Home — PATH Commute ROI Calculator
          </a>
        </div>
      ) : null}
    </div>
  );

  if (bare) return Body;

  return (
    <Card>
      <CardContent className="p-6 md:p-8">{Body}</CardContent>
    </Card>
  );
}

export default PathCommuteRoiCalculator;
