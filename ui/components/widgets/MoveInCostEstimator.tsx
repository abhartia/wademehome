"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Info, RotateCcw, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const fmt = (n: number) =>
  isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "—";

type LineItem = { label: string; amount: number; note?: string };

export interface MoveInCostEstimatorProps {
  bare?: boolean;
  showAttribution?: boolean;
}

export function MoveInCostEstimator({
  bare = false,
  showAttribution = false,
}: MoveInCostEstimatorProps) {
  const [rent, setRent] = useState<string>("");
  const [securityDeposit, setSecurityDeposit] = useState<"1mo" | "2mo">("1mo");
  const [requireLastMonth, setRequireLastMonth] = useState(false);
  const [city, setCity] = useState<"nyc" | "outside-nyc">("nyc");
  const [brokerHired, setBrokerHired] = useState<"landlord" | "tenant">(
    "landlord",
  );
  const [tenantBrokerFeeMonths, setTenantBrokerFeeMonths] = useState<string>("0");
  const [movers, setMovers] = useState<string>("1500");
  const [utilities, setUtilities] = useState<string>("250");
  const [renterInsurance, setRenterInsurance] = useState<string>("180");
  const [leaseLength, setLeaseLength] = useState<string>("12");

  const monthlyRent = Number(rent) || 0;
  const ready = monthlyRent > 0;

  const breakdown = useMemo<{ items: LineItem[]; total: number }>(() => {
    const items: LineItem[] = [];

    items.push({ label: "First month's rent", amount: monthlyRent });

    items.push({
      label: "Security deposit",
      amount: securityDeposit === "2mo" ? monthlyRent * 2 : monthlyRent,
      note:
        securityDeposit === "2mo"
          ? "NYC: cap is 1 month under HSTPA 2019 — only out-of-NYC landlords can charge 2 months."
          : "NY State HSTPA 2019 caps deposit at 1 month for unregulated rentals.",
    });

    if (requireLastMonth) {
      items.push({
        label: "Last month's rent",
        amount: monthlyRent,
        note: "Common in NJ/Westchester. Illegal as part of NYC unregulated security deposits.",
      });
    }

    let brokerFee = 0;
    let brokerNote: string | undefined;
    if (brokerHired === "tenant") {
      const months = Number(tenantBrokerFeeMonths) || 0;
      brokerFee = monthlyRent * months;
      brokerNote =
        "Tenant-engaged broker fees are still legal post-FARE Act. Confirm a written agency agreement.";
    } else if (city === "outside-nyc") {
      // Default to a 1-month broker fee for NJ/Westchester landlord-side
      const months = Number(tenantBrokerFeeMonths) || 0;
      brokerFee = monthlyRent * months;
      brokerNote =
        "Outside NYC the FARE Act doesn't apply. NJ/Westchester landlords may pass broker fees to tenants.";
    } else {
      brokerNote =
        "Landlord-hired broker in NYC = $0 to you under the FARE Act (eff. 2025-06-15).";
    }
    items.push({ label: "Broker fee", amount: brokerFee, note: brokerNote });

    items.push({
      label: "Movers",
      amount: Number(movers) || 0,
      note: "NYC studio-1BR typical $800-1,500. 2BR with elevator $1,500-2,500.",
    });

    items.push({
      label: "Utility setup deposits",
      amount: Number(utilities) || 0,
      note: "Con Edison + Spectrum/Verizon installation + first-month internet.",
    });

    items.push({
      label: "Renter's insurance (annual)",
      amount: Number(renterInsurance) || 0,
      note: "$15-25/mo typical, often required by NYC landlords now.",
    });

    const total = items.reduce((s, i) => s + i.amount, 0);
    return { items, total };
  }, [
    monthlyRent,
    securityDeposit,
    requireLastMonth,
    brokerHired,
    city,
    tenantBrokerFeeMonths,
    movers,
    utilities,
    renterInsurance,
  ]);

  const lease = Math.max(1, Number(leaseLength) || 12);
  const amortized = breakdown.total / lease;
  const trueMonthly = amortized + monthlyRent - monthlyRent / lease;
  // Above subtracts back the first-month rent which is already in the lump
  // sum, so the user's "true monthly cost" reflects rent + amortized one-time.

  const showFareNudge =
    city === "nyc" &&
    brokerHired === "landlord" &&
    Number(tenantBrokerFeeMonths) > 0;

  const reset = () => {
    setRent("");
    setSecurityDeposit("1mo");
    setRequireLastMonth(false);
    setCity("nyc");
    setBrokerHired("landlord");
    setTenantBrokerFeeMonths("0");
    setMovers("1500");
    setUtilities("250");
    setRenterInsurance("180");
    setLeaseLength("12");
  };

  const Body = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="mi-rent">Monthly rent ($)</Label>
          <Input
            id="mi-rent"
            type="number"
            inputMode="decimal"
            placeholder="3500"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mi-lease">Lease length (months)</Label>
          <Input
            id="mi-lease"
            type="number"
            inputMode="numeric"
            placeholder="12"
            value={leaseLength}
            onChange={(e) => setLeaseLength(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Where is the apartment?</Label>
        <RadioGroup
          value={city}
          onValueChange={(v: string) => setCity(v as "nyc" | "outside-nyc")}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="nyc" id="mi-nyc" />
            <Label htmlFor="mi-nyc" className="font-normal">
              Inside NYC (FARE Act applies)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="outside-nyc" id="mi-out" />
            <Label htmlFor="mi-out" className="font-normal">
              Outside NYC (NJ, Westchester, etc.)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Security deposit</Label>
        <RadioGroup
          value={securityDeposit}
          onValueChange={(v: string) => setSecurityDeposit(v as "1mo" | "2mo")}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="1mo" id="mi-sd-1" />
            <Label htmlFor="mi-sd-1" className="font-normal">
              1 month (NY State cap)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="2mo" id="mi-sd-2" />
            <Label htmlFor="mi-sd-2" className="font-normal">
              2 months (out-of-NYC only)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-3 rounded-md border p-3">
        <Switch
          id="mi-last"
          checked={requireLastMonth}
          onCheckedChange={setRequireLastMonth}
        />
        <Label htmlFor="mi-last" className="cursor-pointer text-sm font-normal">
          Landlord requires last month&apos;s rent up front (typical NJ/Westchester)
        </Label>
      </div>

      <div className="space-y-2">
        <Label>Who hired the broker?</Label>
        <RadioGroup
          value={brokerHired}
          onValueChange={(v: string) => setBrokerHired(v as "landlord" | "tenant")}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="landlord" id="mi-br-ll" />
            <Label htmlFor="mi-br-ll" className="font-normal">
              The landlord (or no broker)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="tenant" id="mi-br-t" />
            <Label htmlFor="mi-br-t" className="font-normal">
              I hired one myself
            </Label>
          </div>
        </RadioGroup>
        <div className="grid gap-1.5">
          <Label htmlFor="mi-br-months" className="text-xs text-muted-foreground">
            Broker fee, in months of rent (typical 0–1.5)
          </Label>
          <Input
            id="mi-br-months"
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={tenantBrokerFeeMonths}
            onChange={(e) => setTenantBrokerFeeMonths(e.target.value)}
            className="max-w-32"
          />
        </div>
        {showFareNudge ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <strong>Heads up:</strong> a landlord-hired broker can&apos;t charge you a fee under
            the FARE Act in NYC. Either set this back to $0 or run the fee through the{" "}
            <Link
              href="/tools/fare-act-broker-fee-checker"
              className="underline underline-offset-2"
            >
              FARE Act broker fee checker
            </Link>
            .
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="mi-movers">Movers ($)</Label>
          <Input
            id="mi-movers"
            type="number"
            inputMode="decimal"
            value={movers}
            onChange={(e) => setMovers(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mi-util">Utility setup ($)</Label>
          <Input
            id="mi-util"
            type="number"
            inputMode="decimal"
            value={utilities}
            onChange={(e) => setUtilities(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mi-ins">Renter&apos;s insurance ($/yr)</Label>
          <Input
            id="mi-ins"
            type="number"
            inputMode="decimal"
            value={renterInsurance}
            onChange={(e) => setRenterInsurance(e.target.value)}
          />
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
              <Truck className="h-4 w-4" aria-hidden />
              <span>
                Total cash up front:{" "}
                <span className="text-base font-semibold">{fmt(breakdown.total)}</span>
              </span>
              <Badge variant="secondary" className="bg-emerald-600 text-white">
                {fmt(amortized)}/mo amortized over {lease} months
              </Badge>
            </div>
            <p className="mt-2 text-sm text-emerald-900/80">
              Your true monthly housing cost (rent + amortized move-in) is{" "}
              <strong>{fmt(trueMonthly)}/mo</strong>. Plan accordingly when comparing listings.
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {breakdown.items.map((item) => (
                    <TableRow key={item.label}>
                      <TableCell className="align-top">
                        <div className="font-medium">{item.label}</div>
                        {item.note ? (
                          <div className="text-xs text-muted-foreground">{item.note}</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right align-top font-medium">
                        {fmt(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold">Total cash at signing</TableCell>
                    <TableCell className="text-right font-semibold">
                      {fmt(breakdown.total)}
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
            <p>Enter your monthly rent to see total cash needed at signing and the amortized monthly cost.</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={reset} variant="outline" className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button asChild type="button" variant="ghost" className="gap-1.5">
          <Link href="/tools/fare-act-broker-fee-checker">
            Verify broker fee with FARE Act checker <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="rounded-md bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">How the math works</p>
        <p>
          Total cash at signing = first month&apos;s rent + security deposit + (optional last
          month) + broker fee + movers + utility setup + annual renter&apos;s insurance. Amortized
          over the lease length, this gives you the true monthly housing cost — the number to use
          when comparing two listings or budgeting against the 40× rule. NY State HSTPA caps
          security deposit at 1 month for unregulated rentals; NYC&apos;s FARE Act bans
          landlord-side broker fees from being passed to the tenant.
        </p>
      </div>

      {showAttribution ? (
        <div className="border-t pt-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://wademehome.com/tools/move-in-cost-estimator"
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Wade Me Home — Move-In Cost Estimator
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

export default MoveInCostEstimator;
