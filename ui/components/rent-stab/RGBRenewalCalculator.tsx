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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CURRENT_RGB_ONE_YEAR = 0.03;
const CURRENT_RGB_TWO_YEAR = 0.045;

type MoveLikelihood = "moving-1y" | "staying-2y" | "unsure";

type Recommendation = {
  pick: "one-year" | "two-year" | "tie";
  tone: "emerald" | "blue" | "amber" | "slate";
  headline: string;
  reasons: string[];
  twentyFourMonthCost: {
    oneYearPath: number;
    twoYearPath: number;
    delta: number;
  } | null;
  crossoverNextYearRgb: number | null;
};

function parseMoney(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parsePercent(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return n / 100;
}

function classify(input: {
  currentRent: number | null;
  expectedNextRgb: number | null;
  moveLikelihood: MoveLikelihood;
}): Recommendation {
  const reasons: string[] = [];

  if (input.currentRent === null) {
    return {
      pick: "tie",
      tone: "slate",
      headline: "Enter your current monthly rent to compare paths.",
      reasons: [
        "We need your current monthly rent to compute the actual dollar difference between the 1-year and 2-year RGB renewal paths.",
      ],
      twentyFourMonthCost: null,
      crossoverNextYearRgb: null,
    };
  }

  if (input.moveLikelihood === "moving-1y") {
    const oneYearCost = input.currentRent * 12 * (1 + CURRENT_RGB_ONE_YEAR);
    const twoYearCost = input.currentRent * 12 * (1 + CURRENT_RGB_TWO_YEAR);
    return {
      pick: "one-year",
      tone: "emerald",
      headline: "Take the 1-year renewal.",
      reasons: [
        `If you're moving inside 12 months, the 1-year renewal locks the lower cap (${(CURRENT_RGB_ONE_YEAR * 100).toFixed(1)}% vs. ${(CURRENT_RGB_TWO_YEAR * 100).toFixed(1)}%). The 2-year cap only matters if you're staying past month 12.`,
        `Year-1 cost on the 1-year path: $${oneYearCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}. Year-1 cost on the 2-year path: $${twoYearCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`,
        `You save $${(twoYearCost - oneYearCost).toLocaleString(undefined, { maximumFractionDigits: 0 })} in year 1 alone by picking the 1-year — and you keep the option to leave or re-negotiate at month 12.`,
      ],
      twentyFourMonthCost: null,
      crossoverNextYearRgb: null,
    };
  }

  // Both other branches need expected next-year RGB
  // For "staying-2y" we need a confident input.
  // For "unsure" we can still compute the crossover and a default scenario.

  const expectedNextRgb =
    input.expectedNextRgb ?? (input.moveLikelihood === "unsure" ? 0.035 : null);

  if (expectedNextRgb === null) {
    return {
      pick: "tie",
      tone: "amber",
      headline: "Enter an expected 2026–2027 RGB rate to compare paths.",
      reasons: [
        "If you're staying 2+ years, the comparison depends on what next year's RGB cap turns out to be. The current RGB staff range for the 2026–2027 cycle is 2.75%–4.5% (1-year). You can use 3.0% as the base case, or your own estimate.",
      ],
      twentyFourMonthCost: null,
      crossoverNextYearRgb: 0.015,
    };
  }

  // 24-month total cost under each path
  // 1-year path: year 1 at 3.0% over current, year 2 at (1+expectedNextRgb) over year 1's rent
  const oneYearPathCost =
    input.currentRent * 12 * (1 + CURRENT_RGB_ONE_YEAR) +
    input.currentRent *
      12 *
      (1 + CURRENT_RGB_ONE_YEAR) *
      (1 + expectedNextRgb);
  // 2-year path: year 1 and year 2 both at 4.5% locked
  const twoYearPathCost =
    input.currentRent * 12 * (1 + CURRENT_RGB_TWO_YEAR) +
    input.currentRent * 12 * (1 + CURRENT_RGB_TWO_YEAR);
  const delta = twoYearPathCost - oneYearPathCost;

  // Crossover: if the 2nd-year RGB is exactly 1.5%, the paths are exactly equal in year 2 only.
  // The crossover for total 2-year cost is approximately:
  // (1.03)*(1+x) ≈ 2 * 1.045 - 1.03  (ignoring rounding) → x ≈ ~6.0% / 1.03 ≈ 5.83%
  // More precisely: cumulative 2-year multiplier:
  //   1-yr path: 1.03 + 1.03*(1+x)  (year1 + year2 in months of rent)
  //   2-yr path: 1.045 + 1.045
  //   1.03 + 1.03(1+x) = 2.090
  //   1.03(1+x) = 1.060
  //   (1+x) = 1.029...
  //   x ≈ 2.91%
  // Using exact:
  const crossover = (2 * (1 + CURRENT_RGB_TWO_YEAR) - (1 + CURRENT_RGB_ONE_YEAR)) / (1 + CURRENT_RGB_ONE_YEAR) - 1;
  // crossover ≈ 0.02913 (≈ 2.91%)

  const pick: "one-year" | "two-year" | "tie" =
    delta > 100 ? "two-year" : delta < -100 ? "one-year" : "tie";

  if (pick === "two-year") {
    reasons.push(
      `Your expected 2026–2027 RGB cap (${(expectedNextRgb * 100).toFixed(2)}%) is above the crossover (${(crossover * 100).toFixed(2)}%). The 2-year renewal locks ${(CURRENT_RGB_TWO_YEAR * 100).toFixed(1)}% across both years, which beats compounding ${(CURRENT_RGB_ONE_YEAR * 100).toFixed(1)}% then ${(expectedNextRgb * 100).toFixed(2)}%.`
    );
    reasons.push(
      `Over 24 months you save $${delta.toLocaleString(undefined, { maximumFractionDigits: 0 })} on the 2-year path vs. the 1-year path.`
    );
    reasons.push(
      `Trade-off: a 2-year renewal locks you in. If you might leave NYC or upgrade apartments in year 2, the lock-in is a cost that doesn't show up in the rent math.`
    );
  } else if (pick === "one-year") {
    reasons.push(
      `Your expected 2026–2027 RGB cap (${(expectedNextRgb * 100).toFixed(2)}%) is below the crossover (${(crossover * 100).toFixed(2)}%). Compounding ${(CURRENT_RGB_ONE_YEAR * 100).toFixed(1)}% then ${(expectedNextRgb * 100).toFixed(2)}% is cheaper than locking ${(CURRENT_RGB_TWO_YEAR * 100).toFixed(1)}% for both years.`
    );
    reasons.push(
      `Over 24 months you save $${Math.abs(delta).toLocaleString(undefined, { maximumFractionDigits: 0 })} on the 1-year path vs. the 2-year path.`
    );
    reasons.push(
      `Plus the 1-year keeps your year-2 option open: if you decide to move at month 12, you only owe through month 12 — no early termination penalty.`
    );
  } else {
    reasons.push(
      `At your expected 2026–2027 RGB cap (${(expectedNextRgb * 100).toFixed(2)}%), the two paths are within $100 over 24 months. The crossover is at ${(crossover * 100).toFixed(2)}%.`
    );
    reasons.push(
      `Tie-breakers: pick 1-year if you might want to leave at month 12, or pick 2-year if you want certainty across both years.`
    );
  }

  return {
    pick,
    tone:
      pick === "two-year"
        ? "blue"
        : pick === "one-year"
          ? "emerald"
          : "amber",
    headline:
      pick === "two-year"
        ? "Take the 2-year renewal."
        : pick === "one-year"
          ? "Take the 1-year renewal."
          : "Either path is roughly equal — pick on flexibility.",
    reasons,
    twentyFourMonthCost: {
      oneYearPath: oneYearPathCost,
      twoYearPath: twoYearPathCost,
      delta,
    },
    crossoverNextYearRgb: crossover,
  };
}

export function RGBRenewalCalculator() {
  const [currentRent, setCurrentRent] = useState("");
  const [expectedRgb, setExpectedRgb] = useState("");
  const [moveLikelihood, setMoveLikelihood] = useState<MoveLikelihood>("staying-2y");

  const result = useMemo<Recommendation>(() => {
    return classify({
      currentRent: parseMoney(currentRent),
      expectedNextRgb: parsePercent(expectedRgb),
      moveLikelihood,
    });
  }, [currentRent, expectedRgb, moveLikelihood]);

  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50/40",
    blue: "border-sky-200 bg-sky-50/40",
    amber: "border-amber-200 bg-amber-50/40",
    slate: "border-slate-200 bg-slate-50/40",
  }[result.tone];

  const badgeClass = {
    emerald: "bg-emerald-600",
    blue: "bg-sky-600",
    amber: "bg-amber-600",
    slate: "bg-slate-500",
  }[result.tone];

  return (
    <Card className={toneClass}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={badgeClass}>RGB renewal calculator</Badge>
          <Badge variant="outline">2025–2026 cycle</Badge>
          <Badge variant="outline">Stabilized leases only</Badge>
        </div>
        <CardTitle>1-year vs. 2-year renewal: which should you sign?</CardTitle>
        <CardDescription>
          NYC rent-stabilized tenants get to choose between a 1-year renewal at
          the current RGB cap (3.0%) or a 2-year renewal at the higher cap
          (4.5%). The right choice depends on what next year&apos;s RGB cap
          turns out to be — and on whether you&apos;re likely to move at
          month 12. Run the math below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="rgb-current-rent">Current monthly rent</Label>
            <Input
              id="rgb-current-rent"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 2,400"
              value={currentRent}
              onChange={(e) => setCurrentRent(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your current legal regulated rent — the number on your lease
              before any preferential-rent discount.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rgb-move-likelihood">Plans for the next 24 months</Label>
            <Select
              value={moveLikelihood}
              onValueChange={(v) => setMoveLikelihood(v as MoveLikelihood)}
            >
              <SelectTrigger id="rgb-move-likelihood">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staying-2y">
                  Staying 2+ years (the comparison matters)
                </SelectItem>
                <SelectItem value="moving-1y">
                  Likely moving inside 12 months
                </SelectItem>
                <SelectItem value="unsure">
                  Unsure — show me both scenarios
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              If you&apos;re moving inside 12 months, the 1-year always wins
              (the 2-year cap doesn&apos;t apply to you).
            </p>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="rgb-expected-next">
              Expected 2026–2027 RGB 1-year cap (your estimate)
            </Label>
            <Input
              id="rgb-expected-next"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 3.5 (RGB staff range: 2.75%–4.5%)"
              value={expectedRgb}
              onChange={(e) => setExpectedRgb(e.target.value)}
              disabled={moveLikelihood === "moving-1y"}
            />
            <p className="text-xs text-muted-foreground">
              The RGB votes the 2026–2027 cycle in May (preliminary) and June
              (final). Staff input range as of April 2026 is 2.75%–4.5%
              (1-year). Use 3.0% as the base case if you&apos;re unsure.
            </p>
          </div>
        </div>

        <Card className="bg-background/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{result.headline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
              {result.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            {result.twentyFourMonthCost && (
              <div className="rounded-md border bg-muted/30 p-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  24-month total rent cost
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Path</TableHead>
                      <TableHead className="text-right">24-mo total</TableHead>
                      <TableHead className="text-right">Vs. other path</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        1-year renewal (3.0% then your est.)
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {result.twentyFourMonthCost.oneYearPath.toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {result.twentyFourMonthCost.delta < 0
                          ? `−$${Math.abs(result.twentyFourMonthCost.delta).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        2-year renewal (4.5% locked both years)
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {result.twentyFourMonthCost.twoYearPath.toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {result.twentyFourMonthCost.delta > 0
                          ? `−$${result.twentyFourMonthCost.delta.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            {result.crossoverNextYearRgb !== null && (
              <p className="text-xs text-muted-foreground">
                <strong>Crossover point:</strong> if you expect the 2026–2027
                1-year RGB cap to land above{" "}
                <strong>{(result.crossoverNextYearRgb * 100).toFixed(2)}%</strong>,
                the 2-year renewal beats the 1-year on total rent paid over
                24 months. Below that crossover, the 1-year wins.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/tools/rent-stabilization-checker">
              Is my apartment stabilized? →
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/blog/nyc-rent-stabilization-guide">
              Full rent stabilization guide
            </Link>
          </Button>
        </div>

        <p className="text-xs italic text-muted-foreground">
          Results assume the 2025–2026 RGB caps (3.0% / 4.5%). The RGB sets
          new caps each June for leases starting Oct 1; the 2026–2027 cycle
          will replace these caps for renewals signed after Oct 1, 2026.
          IAI/MCI surcharges and preferential-rent step-ups can stack on top
          of the RGB cap and are not modeled here. This is informational
          guidance, not legal or financial advice.
        </p>
      </CardContent>
    </Card>
  );
}
