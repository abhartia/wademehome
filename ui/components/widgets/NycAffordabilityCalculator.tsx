"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Info, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { type FilingStatus, nycAffordability } from "@/lib/nyc/taxes";

const fmt = (n: number) =>
  isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "—";

const fmtPct = (n: number) =>
  isFinite(n) ? `${(n * 100).toFixed(1)}%` : "—";

export interface NycAffordabilityCalculatorProps {
  bare?: boolean;
  showAttribution?: boolean;
}

export function NycAffordabilityCalculator({
  bare = false,
  showAttribution = false,
}: NycAffordabilityCalculatorProps) {
  const [salary, setSalary] = useState<string>("");
  const [filing, setFiling] = useState<FilingStatus>("single");

  const grossAnnual = Number(salary) || 0;
  const ready = grossAnnual > 0;

  const result = useMemo(
    () => nycAffordability(grossAnnual, filing),
    [grossAnnual, filing],
  );

  const reset = () => {
    setSalary("");
    setFiling("single");
  };

  const Body = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor="afd-salary">Gross annual salary ($)</Label>
          <Input
            id="afd-salary"
            type="number"
            inputMode="decimal"
            placeholder="120000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Pre-tax W-2 wages. Bonus, RSUs, and self-employment income should be added in.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label>Filing status</Label>
          <RadioGroup
            value={filing}
            onValueChange={(v: string) => setFiling(v as FilingStatus)}
            className="flex gap-3 pt-1.5"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="single" id="afd-single" />
              <Label htmlFor="afd-single" className="font-normal">
                Single
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="mfj" id="afd-mfj" />
              <Label htmlFor="afd-mfj" className="font-normal">
                Married, joint
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {ready ? (
        <div className="space-y-4">
          <div
            className="rounded-lg border border-emerald-300 bg-emerald-50 p-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-900">
              <Calculator className="h-4 w-4" aria-hidden />
              <span>
                Recommended max rent in NYC:{" "}
                <span className="text-base font-semibold">
                  {fmt(result.recommendedRent)}/mo
                </span>
              </span>
              <Badge variant="secondary" className="bg-emerald-600 text-white">
                {result.bind === "fortyTimes"
                  ? "Bound by 40× rule"
                  : result.bind === "thirtyThreePct"
                    ? "Bound by take-home affordability"
                    : "Both rules tie"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-emerald-900/80">
              Most NYC landlords will approve you up to{" "}
              <strong>{fmt(result.fortyTimesRent)}/mo</strong> (the 40× rule), but a sustainable
              budget from your take-home pay is{" "}
              <strong>{fmt(result.thirtyThreePctTakehome)}/mo</strong> (33% of monthly take-home).
              Pick the lower of the two.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <span>Landlord&apos;s 40× ceiling</span>
                </div>
                <div className="text-2xl font-semibold">
                  {fmt(result.fortyTimesRent)}/mo
                </div>
                <p className="text-xs text-muted-foreground">
                  Gross annual salary ÷ 40. The standard NYC landlord underwriting rule.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <span>Sustainable from take-home</span>
                </div>
                <div className="text-2xl font-semibold">
                  {fmt(result.thirtyThreePctTakehome)}/mo
                </div>
                <p className="text-xs text-muted-foreground">
                  33% of monthly take-home — the personal-finance rule of thumb after NYC taxes.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-muted-foreground">Gross annual salary</TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(result.takeHome.gross)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground">Federal income tax</TableCell>
                    <TableCell className="text-right">
                      −{fmt(result.takeHome.federal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground">FICA (SS + Medicare)</TableCell>
                    <TableCell className="text-right">−{fmt(result.takeHome.fica)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground">NY State income tax</TableCell>
                    <TableCell className="text-right">−{fmt(result.takeHome.state)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground">NYC city income tax</TableCell>
                    <TableCell className="text-right">−{fmt(result.takeHome.city)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Annual take-home</TableCell>
                    <TableCell className="text-right font-semibold">
                      {fmt(result.takeHome.takeHomeAnnual)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monthly take-home</TableCell>
                    <TableCell className="text-right font-semibold">
                      {fmt(result.takeHome.takeHomeMonthly)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-muted-foreground">Effective tax rate</TableCell>
                    <TableCell className="text-right">
                      {fmtPct(result.takeHome.effectiveRate)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              Enter your gross annual salary above to see your max NYC rent under both the
              landlord&apos;s 40× rule and the 33%-of-take-home affordability rule.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={reset} variant="outline" className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/tools/net-effective-rent-calculator">Compare two listings →</Link>
        </Button>
      </div>

      <Separator />

      <div className="rounded-md bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">How the math works</p>
        <p>
          The 40× rule is what NYC landlords actually require — gross annual salary divided by 40
          must equal or exceed the rent. The 33%-of-take-home rule is what your budget can
          actually support after federal + NY State + NYC city + FICA taxes. For most NYC tenants
          the take-home rule is stricter than 40×, especially under $150K. Tax math uses 2026
          published brackets (IRS Rev. Proc. 2025-32, NY DTF, NYC DOF, SSA wage base).
        </p>
      </div>

      {showAttribution ? (
        <div className="border-t pt-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://wademehome.com/tools/nyc-affordability-calculator"
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Wade Me Home — NYC Affordability Calculator
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

export default NycAffordabilityCalculator;
