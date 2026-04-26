"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type ListingInputs = {
  label: string;
  grossRent: string;
  leaseMonths: string;
  freeMonths: string;
  brokerFee: string;
};

type Computed = {
  paidMonths: number;
  totalLeaseCost: number;
  netEffectiveMonthly: number;
  amortizedMonthlyWithFee: number;
  effectiveDiscountPct: number;
};

const fmtMoney = (n: number) =>
  isFinite(n) && !isNaN(n)
    ? `$${Math.round(n).toLocaleString()}`
    : "—";

const fmtPct = (n: number) =>
  isFinite(n) && !isNaN(n) ? `${n.toFixed(1)}%` : "—";

function compute(input: ListingInputs): Computed {
  const gross = Number(input.grossRent) || 0;
  const lease = Math.max(1, Number(input.leaseMonths) || 0);
  const free = Math.max(0, Math.min(lease, Number(input.freeMonths) || 0));
  const fee = Math.max(0, Number(input.brokerFee) || 0);
  const paidMonths = Math.max(0, lease - free);
  const totalRent = gross * paidMonths;
  const totalWithFee = totalRent + fee;
  const netEff = lease > 0 ? totalRent / lease : 0;
  const amortized = lease > 0 ? totalWithFee / lease : 0;
  const discountPct = gross > 0 ? ((gross - netEff) / gross) * 100 : 0;
  return {
    paidMonths,
    totalLeaseCost: totalWithFee,
    netEffectiveMonthly: netEff,
    amortizedMonthlyWithFee: amortized,
    effectiveDiscountPct: discountPct,
  };
}

const EMPTY: ListingInputs = {
  label: "",
  grossRent: "",
  leaseMonths: "12",
  freeMonths: "",
  brokerFee: "",
};

function ListingFields({
  prefix,
  value,
  onChange,
  showLabel,
}: {
  prefix: string;
  value: ListingInputs;
  onChange: (next: ListingInputs) => void;
  showLabel?: boolean;
}) {
  const set = <K extends keyof ListingInputs>(k: K, v: ListingInputs[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="space-y-3">
      {showLabel ? (
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-label`}>Listing label</Label>
          <Input
            id={`${prefix}-label`}
            placeholder="e.g. 350 W 18th St"
            value={value.label}
            onChange={(e) => set("label", e.target.value)}
          />
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-rent`}>Gross monthly rent ($)</Label>
          <Input
            id={`${prefix}-rent`}
            type="number"
            inputMode="decimal"
            placeholder="3500"
            value={value.grossRent}
            onChange={(e) => set("grossRent", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-lease`}>Lease length (months)</Label>
          <Input
            id={`${prefix}-lease`}
            type="number"
            inputMode="numeric"
            placeholder="12"
            value={value.leaseMonths}
            onChange={(e) => set("leaseMonths", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-free`}>Free months</Label>
          <Input
            id={`${prefix}-free`}
            type="number"
            inputMode="decimal"
            placeholder="1"
            value={value.freeMonths}
            onChange={(e) => set("freeMonths", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}-fee`}>Broker / move-in fee ($)</Label>
          <Input
            id={`${prefix}-fee`}
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={value.brokerFee}
            onChange={(e) => set("brokerFee", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Result({
  label,
  result,
  highlight,
}: {
  label: string;
  result: Computed;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-emerald-300 bg-emerald-50" : "bg-muted/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium">{label || "Listing"}</h3>
        {highlight ? (
          <Badge variant="secondary" className="bg-emerald-600 text-white">
            Cheaper
          </Badge>
        ) : null}
      </div>
      <Table className="mt-2">
        <TableBody>
          <TableRow>
            <TableCell className="text-muted-foreground">Paid months</TableCell>
            <TableCell className="text-right font-medium">{result.paidMonths}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Total lease cost</TableCell>
            <TableCell className="text-right font-medium">
              {fmtMoney(result.totalLeaseCost)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Net effective rent</TableCell>
            <TableCell className="text-right font-semibold">
              {fmtMoney(result.netEffectiveMonthly)}/mo
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">
              Amortized w/ broker fee
            </TableCell>
            <TableCell className="text-right font-medium">
              {fmtMoney(result.amortizedMonthlyWithFee)}/mo
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-muted-foreground">Effective discount</TableCell>
            <TableCell className="text-right font-medium">
              {fmtPct(result.effectiveDiscountPct)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export interface NetEffectiveRentCalculatorProps {
  bare?: boolean;
  showAttribution?: boolean;
}

export function NetEffectiveRentCalculator({
  bare = false,
  showAttribution = false,
}: NetEffectiveRentCalculatorProps) {
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [a, setA] = useState<ListingInputs>({ ...EMPTY, label: "Listing A" });
  const [b, setB] = useState<ListingInputs>({ ...EMPTY, label: "Listing B" });

  const ra = useMemo(() => compute(a), [a]);
  const rb = useMemo(() => compute(b), [b]);

  const aReady = Number(a.grossRent) > 0;
  const bReady = Number(b.grossRent) > 0;

  const cheaper: "a" | "b" | "tie" | null = useMemo(() => {
    if (mode !== "compare" || !aReady || !bReady) return null;
    if (Math.abs(ra.amortizedMonthlyWithFee - rb.amortizedMonthlyWithFee) < 1) {
      return "tie";
    }
    return ra.amortizedMonthlyWithFee < rb.amortizedMonthlyWithFee ? "a" : "b";
  }, [mode, aReady, bReady, ra, rb]);

  const monthlyDelta =
    cheaper && cheaper !== "tie"
      ? Math.abs(ra.amortizedMonthlyWithFee - rb.amortizedMonthlyWithFee)
      : 0;

  const reset = () => {
    setA({ ...EMPTY, label: "Listing A" });
    setB({ ...EMPTY, label: "Listing B" });
  };

  const Body = (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "single" | "compare")}>
        <TabsList className="grid w-full grid-cols-2 sm:w-80">
          <TabsTrigger value="single">Single listing</TabsTrigger>
          <TabsTrigger value="compare">Compare two</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-4 space-y-4">
          <ListingFields prefix="ne-a" value={a} onChange={setA} />
          {aReady ? (
            <Result label={a.label || "Your listing"} result={ra} />
          ) : (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>
                  Enter a gross monthly rent above to see your real net-effective rent and the
                  amortized monthly cost including any one-time fees.
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="compare" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <ListingFields prefix="ne-cmp-a" value={a} onChange={setA} showLabel />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <ListingFields prefix="ne-cmp-b" value={b} onChange={setB} showLabel />
              </CardContent>
            </Card>
          </div>

          {aReady && bReady ? (
            <div className="space-y-3">
              <div
                className={`rounded-lg border p-4 ${
                  cheaper === "tie"
                    ? "border-slate-300 bg-slate-50"
                    : "border-emerald-300 bg-emerald-50"
                }`}
                role="status"
                aria-live="polite"
              >
                {cheaper === "tie" ? (
                  <p className="text-sm font-medium text-slate-900">
                    These two listings are within $1/mo of each other on a true net basis.
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-900">
                    {cheaper === "a" ? (
                      <TrendingDown className="h-4 w-4" aria-hidden />
                    ) : (
                      <TrendingUp className="h-4 w-4" aria-hidden />
                    )}
                    <span>
                      {cheaper === "a" ? a.label || "Listing A" : b.label || "Listing B"}{" "}
                      is cheaper by{" "}
                      <span className="font-semibold">{fmtMoney(monthlyDelta)}/mo</span>{" "}
                      <span className="text-emerald-800">
                        ({fmtMoney(monthlyDelta * 12)} over a year)
                      </span>{" "}
                      on an apples-to-apples basis.
                    </span>
                  </div>
                )}
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <Result
                  label={a.label || "Listing A"}
                  result={ra}
                  highlight={cheaper === "a"}
                />
                <Result
                  label={b.label || "Listing B"}
                  result={rb}
                  highlight={cheaper === "b"}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>
                  Fill in gross rent for both listings to see which one is actually cheaper after
                  free months and broker fees.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={reset} variant="outline" className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button asChild type="button" variant="ghost" className="gap-1.5">
          <Link href="/blog/security-deposits-move-in-fees">
            See typical move-in costs <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="rounded-md bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">How the math works</p>
        <p>
          Net effective rent = (gross rent × paid months) ÷ total lease months. A 13-month lease
          with 1 free month at $4,000/mo gross has a net effective of $3,692/mo — that&apos;s the
          number to compare against a no-concession listing. Broker / move-in fees are amortized
          over the full lease length so a $5,000 broker fee on a 12-month lease adds $417/mo to
          your true cost.
        </p>
      </div>

      {showAttribution ? (
        <div className="border-t pt-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://wademehome.com/tools/net-effective-rent-calculator"
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Wade Me Home — Net-Effective Rent Calculator
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

export default NetEffectiveRentCalculator;
