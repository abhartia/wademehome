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

type TaxAbatement = "none" | "421a" | "j51" | "421g" | "unknown";

type Verdict = {
  verdict:
    | "Almost certainly stabilized"
    | "Likely stabilized"
    | "Possibly stabilized"
    | "Likely market-rate"
    | "Outside scope"
    | "Insufficient input";
  tone: "emerald" | "blue" | "amber" | "rose" | "slate";
  reasons: string[];
  nextSteps: string[];
  rentMath: {
    oneYear: string;
    twoYear: string;
  } | null;
};

const CURRENT_RGB_ONE_YEAR = 0.03;
const CURRENT_RGB_TWO_YEAR = 0.045;

function parsePositiveInt(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value.replace(/[^0-9]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

function classify(input: {
  yearBuilt: number | null;
  unitCount: number | null;
  abatement: TaxAbatement;
  currentRent: number | null;
  buildingType: string;
  hasRider: string;
}): Verdict {
  const reasons: string[] = [];
  const nextSteps: string[] = [];
  const rentMath =
    input.currentRent && input.currentRent > 0
      ? {
          oneYear: `$${Math.round(
            input.currentRent * (1 + CURRENT_RGB_ONE_YEAR)
          ).toLocaleString()} (+$${Math.round(
            input.currentRent * CURRENT_RGB_ONE_YEAR
          ).toLocaleString()}/mo)`,
          twoYear: `$${Math.round(
            input.currentRent * (1 + CURRENT_RGB_TWO_YEAR)
          ).toLocaleString()} (+$${Math.round(
            input.currentRent * CURRENT_RGB_TWO_YEAR
          ).toLocaleString()}/mo)`,
        }
      : null;

  if (
    input.yearBuilt === null &&
    input.unitCount === null &&
    input.abatement === "unknown" &&
    !input.buildingType
  ) {
    return {
      verdict: "Insufficient input",
      tone: "slate",
      reasons: [
        "Enter at least the year the building was built and the unit count to get a verdict.",
      ],
      nextSteps: [],
      rentMath,
    };
  }

  if (input.buildingType === "condo" || input.buildingType === "coop") {
    return {
      verdict: "Outside scope",
      tone: "slate",
      reasons: [
        "Condo and co-op units are generally not rent stabilized — they fall under condo/co-op regulation and the unit owner sets the rent.",
        "Exception: if the unit was occupied by a stabilized tenant before the conversion, that tenant retains stabilization for the duration of their tenancy.",
      ],
      nextSteps: [
        "If you suspect the prior tenant was stabilized, request a DHCR rent history for the unit.",
      ],
      rentMath,
    };
  }

  if (input.buildingType === "single-family" || input.buildingType === "two-family") {
    return {
      verdict: "Likely market-rate",
      tone: "rose",
      reasons: [
        "Rent stabilization applies to buildings with six or more units. 1–2 family homes are not covered.",
      ],
      nextSteps: [
        "Confirm the building is actually 1–2 family on the NYC Department of Buildings (DOB) BIS or HPD records.",
      ],
      rentMath,
    };
  }

  if (input.unitCount !== null && input.unitCount < 6) {
    return {
      verdict: "Likely market-rate",
      tone: "rose",
      reasons: [
        `Building has ${input.unitCount} units. Rent stabilization requires 6+ units in the building.`,
      ],
      nextSteps: [
        "Verify the unit count on the NYC DOB or HPD building record. If you suspect the listing is undercounting, look up the Certificate of Occupancy.",
      ],
      rentMath,
    };
  }

  if (input.abatement === "421a" || input.abatement === "j51" || input.abatement === "421g") {
    reasons.push(
      `The building receives a ${input.abatement.toUpperCase()} tax benefit, which mandates stabilization for the duration of the abatement.`
    );
    if (input.abatement === "421a") {
      reasons.push(
        "421-a buildings must keep all units stabilized while the abatement is active (typically 25–35 years from completion)."
      );
    }
    if (input.abatement === "j51") {
      reasons.push(
        "J-51 buildings must keep units stabilized while the benefit is active. Under the 2019 law (HSTPA), most J-51 stabilization continues even after the benefit expires."
      );
    }
    nextSteps.push(
      "Request a copy of the rent stabilization rider from your landlord (NYC law requires it on every stabilized lease)."
    );
    nextSteps.push(
      "Look up the building's tax abatement status on the NYC Department of Finance property tax page."
    );
    if (input.currentRent && input.currentRent > 0) {
      nextSteps.push(
        `Order a DHCR rent history. Compare the registered rents to your current $${input.currentRent.toLocaleString()}/mo — if the current rent exceeds the legal rent + the cumulative RGB increases, you may have an overcharge claim.`
      );
    }
    return {
      verdict: "Almost certainly stabilized",
      tone: "emerald",
      reasons,
      nextSteps,
      rentMath,
    };
  }

  if (input.yearBuilt !== null) {
    if (input.yearBuilt >= 1947 && input.yearBuilt < 1974) {
      reasons.push(
        `Building was constructed in ${input.yearBuilt} — within the 1947–1973 stabilization era for buildings with 6+ units.`
      );
      if (input.unitCount !== null && input.unitCount >= 6) {
        reasons.push(
          `Confirmed unit count of ${input.unitCount} meets the 6-unit threshold.`
        );
      } else {
        reasons.push(
          "Unit count not entered — the 6+ unit threshold is the other half of the test."
        );
      }
      nextSteps.push(
        "Request the rent stabilization rider from your landlord. NYC law requires it on every renewal."
      );
      nextSteps.push(
        "Order a DHCR rent history to see every registered rent since the unit entered stabilization."
      );
      if (input.currentRent && input.currentRent > 0) {
        nextSteps.push(
          `If the current rent ($${input.currentRent.toLocaleString()}/mo) exceeds the legal regulated rent, you may be entitled to a refund + interest under HSTPA 2019.`
        );
      }
      return {
        verdict: "Almost certainly stabilized",
        tone: "emerald",
        reasons,
        nextSteps,
        rentMath,
      };
    }

    if (input.yearBuilt < 1947) {
      reasons.push(
        `Building was constructed in ${input.yearBuilt} — pre-1947 buildings with 6+ units that have been continuously rented since 1971 are typically rent stabilized (or rent controlled in rare cases).`
      );
      if (input.unitCount !== null && input.unitCount >= 6) {
        reasons.push(
          `Confirmed unit count of ${input.unitCount} meets the 6-unit threshold.`
        );
        nextSteps.push(
          "Order a DHCR rent history — this is the definitive test for pre-1947 buildings."
        );
        nextSteps.push(
          "Ask your landlord whether the unit is rent stabilized or rent controlled."
        );
        return {
          verdict: "Likely stabilized",
          tone: "blue",
          reasons,
          nextSteps,
          rentMath,
        };
      }
      return {
        verdict: "Possibly stabilized",
        tone: "amber",
        reasons,
        nextSteps: [
          "Confirm the unit count is 6+. If yes, order a DHCR rent history.",
        ],
        rentMath,
      };
    }

    if (input.yearBuilt >= 1974) {
      reasons.push(
        `Building was constructed in ${input.yearBuilt} — post-1974 stock is generally not stabilized unless the building receives a 421-a, J-51, or 421-g tax benefit.`
      );
      nextSteps.push(
        "Check whether the building has a 421-a or J-51 abatement on the NYC Department of Finance property tax page. If yes, the unit is almost certainly stabilized."
      );
      nextSteps.push(
        "Look at your lease for a rent stabilization rider — some post-1974 buildings have stabilized units even without a current abatement."
      );
      return {
        verdict: input.hasRider === "yes" ? "Likely stabilized" : "Likely market-rate",
        tone: input.hasRider === "yes" ? "blue" : "rose",
        reasons,
        nextSteps,
        rentMath,
      };
    }
  }

  if (input.hasRider === "yes") {
    return {
      verdict: "Likely stabilized",
      tone: "blue",
      reasons: [
        "You said your lease has a rent stabilization rider — that is the strongest signal. Landlords are required to attach it for stabilized units.",
      ],
      nextSteps: [
        "Cross-check the rider against your DHCR rent history. The registered rent should match your lease rent.",
      ],
      rentMath,
    };
  }

  return {
    verdict: "Possibly stabilized",
    tone: "amber",
    reasons: [
      "Not enough signal to give a definitive answer. The strongest evidence comes from the building's year built + unit count + tax abatement status.",
    ],
    nextSteps: [
      "Order a DHCR rent history — it is free and conclusive.",
      "Look up the building on the NYC DOB BIS for year built, unit count, and Certificate of Occupancy.",
    ],
    rentMath,
  };
}

const TONE_CLASS: Record<Verdict["tone"], string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
  blue: "border-sky-200 bg-sky-50 text-sky-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  slate: "border-slate-200 bg-slate-50 text-slate-900",
};

const TONE_BADGE: Record<Verdict["tone"], string> = {
  emerald: "bg-emerald-600",
  blue: "bg-sky-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
  slate: "bg-slate-500",
};

export function RentStabilizationChecker() {
  const [yearBuiltRaw, setYearBuiltRaw] = useState<string>("");
  const [unitCountRaw, setUnitCountRaw] = useState<string>("");
  const [abatement, setAbatement] = useState<TaxAbatement>("unknown");
  const [currentRentRaw, setCurrentRentRaw] = useState<string>("");
  const [buildingType, setBuildingType] = useState<string>("rental");
  const [hasRider, setHasRider] = useState<string>("unknown");

  const verdict = useMemo(() => {
    const yearBuilt = parsePositiveInt(yearBuiltRaw);
    const unitCount = parsePositiveInt(unitCountRaw);
    const currentRent = parsePositiveInt(currentRentRaw);
    return classify({
      yearBuilt,
      unitCount,
      abatement,
      currentRent,
      buildingType,
      hasRider,
    });
  }, [yearBuiltRaw, unitCountRaw, abatement, currentRentRaw, buildingType, hasRider]);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-600">Interactive Tool</Badge>
          <Badge variant="outline">2026 RGB rates baked in</Badge>
        </div>
        <CardTitle className="mt-2 text-2xl">
          Is My NYC Apartment Rent Stabilized?
        </CardTitle>
        <CardDescription>
          Enter what you know about your building. The checker applies the actual
          NYC stabilization rules — 6+ units, year built, tax abatements — and
          tells you the likely verdict plus exact next steps to confirm. No data
          is stored or transmitted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="rs-year-built">
              Year building was built
            </Label>
            <Input
              id="rs-year-built"
              inputMode="numeric"
              placeholder="e.g. 1962"
              value={yearBuiltRaw}
              onChange={(e) => setYearBuiltRaw(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find this on NYC DOB BIS, HPD records, or the building&apos;s Certificate
              of Occupancy.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-unit-count">Number of units in the building</Label>
            <Input
              id="rs-unit-count"
              inputMode="numeric"
              placeholder="e.g. 24"
              value={unitCountRaw}
              onChange={(e) => setUnitCountRaw(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Stabilization requires 6+ units. 1–5 unit buildings are not covered.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-building-type">Building type</Label>
            <Select value={buildingType} onValueChange={setBuildingType}>
              <SelectTrigger id="rs-building-type">
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rental">Rental apartment building</SelectItem>
                <SelectItem value="condo">Condominium unit</SelectItem>
                <SelectItem value="coop">Co-op unit</SelectItem>
                <SelectItem value="single-family">Single-family home</SelectItem>
                <SelectItem value="two-family">Two-family home</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-abatement">
              Tax abatement (if any)
            </Label>
            <Select value={abatement} onValueChange={(v) => setAbatement(v as TaxAbatement)}>
              <SelectTrigger id="rs-abatement">
                <SelectValue placeholder="Select abatement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">Unknown / haven&apos;t checked</SelectItem>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="421a">421-a (active)</SelectItem>
                <SelectItem value="j51">J-51 (active)</SelectItem>
                <SelectItem value="421g">421-g (FiDi conversion)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Look up on NYC Dept. of Finance property tax page using the address.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-rider">Lease has a rent stabilization rider?</Label>
            <Select value={hasRider} onValueChange={setHasRider}>
              <SelectTrigger id="rs-rider">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unknown">Don&apos;t know</SelectItem>
                <SelectItem value="yes">Yes — rider is attached</SelectItem>
                <SelectItem value="no">No rider on lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rs-current-rent">Current monthly rent (optional)</Label>
            <Input
              id="rs-current-rent"
              inputMode="numeric"
              placeholder="e.g. 2400"
              value={currentRentRaw}
              onChange={(e) => setCurrentRentRaw(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll show the maximum legal renewal under the 2025–2026 RGB rates.
            </p>
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${TONE_CLASS[verdict.tone]}`}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={TONE_BADGE[verdict.tone]}>{verdict.verdict}</Badge>
            {verdict.rentMath && (
              <Badge variant="outline" className="bg-white">
                2025–2026 max renewal calculated
              </Badge>
            )}
          </div>
          {verdict.reasons.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold">Why this verdict</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {verdict.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {verdict.rentMath && (
            <div className="mt-3 space-y-1 rounded border bg-white/70 p-3 text-sm">
              <p className="font-semibold">
                If stabilized, the maximum legal renewal at $
                {parsePositiveInt(currentRentRaw)?.toLocaleString()}/mo is:
              </p>
              <p>
                <span className="font-medium">1-year renewal (3.0%):</span>{" "}
                {verdict.rentMath.oneYear}
              </p>
              <p>
                <span className="font-medium">2-year renewal (4.5%):</span>{" "}
                {verdict.rentMath.twoYear}
              </p>
              <p className="text-xs text-muted-foreground">
                These are the maximum increases set by the NYC Rent Guidelines
                Board for leases beginning Oct 1, 2025 – Sep 30, 2026. They do
                not include IAI or MCI surcharges.
              </p>
            </div>
          )}
          {verdict.nextSteps.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold">Next steps</p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {verdict.nextSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="bg-white">
              <Link href="/blog/nyc-rent-stabilization-guide#nyc-annual-rent-increase-history">
                See the 2015–2026 RGB history
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="bg-white">
              <Link href="/blog/nyc-fare-act-broker-fee-ban">
                FARE Act + broker-fee rules
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="bg-white">
              <Link href="/nyc-rent-by-neighborhood">
                Compare rents by neighborhood
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          This tool implements the public NYC stabilization rules and the
          2025–2026 RGB rates. It is informational, not legal advice. For
          definitive verification, order a free DHCR rent history at{" "}
          <a
            href="https://hcr.ny.gov/dhcr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            hcr.ny.gov/dhcr
          </a>{" "}
          or call 718-739-6400.
        </p>
      </CardContent>
    </Card>
  );
}
