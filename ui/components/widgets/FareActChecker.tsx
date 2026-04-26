"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type WhoHired = "landlord" | "tenant" | "unknown";
type ListingSource =
  | "public-listing-site"
  | "landlord-direct"
  | "tenant-engaged-broker"
  | "open-house"
  | "unknown";

type Verdict = {
  status: "illegal" | "likely-illegal" | "legal" | "outside-scope";
  headline: string;
  rationale: string;
  nextSteps: string[];
};

const FARE_EFFECTIVE = new Date("2025-06-15T00:00:00-04:00");

function computeVerdict(input: {
  city: "nyc" | "outside-nyc";
  feeChargedDate: Date | null;
  whoHired: WhoHired;
  listingSource: ListingSource;
  feePaid: number;
  monthlyRent: number;
}): Verdict {
  const { city, feeChargedDate, whoHired, listingSource, feePaid, monthlyRent } = input;

  if (city === "outside-nyc") {
    return {
      status: "outside-scope",
      headline: "FARE Act doesn't apply outside NYC",
      rationale:
        "The FARE Act (NYC Local Law 119) only governs apartment rentals inside the five boroughs. New Jersey, Westchester, Long Island, and other jurisdictions have their own (much weaker) broker-fee rules — a tenant-paid broker fee is generally legal there if disclosed up front.",
      nextSteps: [
        "If you rented in Hoboken, Jersey City, or Newark, NJ Real Estate Commission rules apply, not FARE Act.",
        "If your broker did not disclose the fee in writing before signing, you may still have a state-level claim.",
      ],
    };
  }

  if (feeChargedDate && feeChargedDate < FARE_EFFECTIVE) {
    return {
      status: "outside-scope",
      headline: "Fee predates the FARE Act",
      rationale:
        "The FARE Act took effect on June 15, 2025. Fees charged before that date were governed by the prior regime, which generally allowed landlord-side brokers to bill tenants up to 15% of annual rent.",
      nextSteps: [
        "If you renewed or signed a new lease after June 15, 2025, run the checker again with the new lease date.",
        "Pre-FARE fees are not refundable under the FARE Act, but separate consumer-protection or breach-of-contract claims may still apply.",
      ],
    };
  }

  if (whoHired === "tenant" && listingSource === "tenant-engaged-broker") {
    return {
      status: "legal",
      headline: "Likely legal — you hired the broker",
      rationale:
        "If you signed a separate written agreement engaging a buyer's-side broker to find you apartments, the FARE Act allows that broker to charge you a fee. The fee must still be disclosed in writing before they show you any units.",
      nextSteps: [
        "Confirm your written agency agreement names the broker and the fee amount.",
        "If you toured a unit the broker did not actively source for you (e.g. one already publicly listed), the fee for that specific unit may still be illegal.",
      ],
    };
  }

  if (
    listingSource === "public-listing-site" ||
    listingSource === "landlord-direct" ||
    listingSource === "open-house" ||
    whoHired === "landlord"
  ) {
    const annualRent = monthlyRent * 12;
    const pctOfAnnual = annualRent > 0 ? (feePaid / annualRent) * 100 : 0;
    const feeContext =
      feePaid > 0 && monthlyRent > 0
        ? ` You paid $${feePaid.toLocaleString()} on a $${monthlyRent.toLocaleString()}/mo lease — that is ${pctOfAnnual.toFixed(1)}% of annual rent, which appears to be a classic 12–15% landlord-side broker commission.`
        : "";
    return {
      status: "illegal",
      headline: "Illegal under the FARE Act",
      rationale:
        `Under the FARE Act, the party who "hires" the broker pays the broker. A broker who lists a unit on StreetEasy, Zillow, or similar — or who is paid by the landlord — is considered hired by the landlord. They cannot pass that fee to you.${feeContext}`,
      nextSteps: [
        "File a complaint with NYC Department of Consumer & Worker Protection (DCWP). Civil penalties start at $1,000 per violation.",
        "Demand a refund of the broker fee in writing. Cite NYC Admin Code §20-699.21 (the FARE Act).",
        "If the broker refuses, small claims court (NYC Civil Court) hears claims up to $10,000 and is tenant-friendly for FARE Act cases.",
        "Keep every text, email, and listing screenshot — you'll need them for both DCWP and small claims.",
      ],
    };
  }

  return {
    status: "likely-illegal",
    headline: "Likely illegal — needs clarification",
    rationale:
      "Based on your answers it looks like the landlord (not you) was the broker's principal, which means you should not have been charged a fee under the FARE Act. Confirm whether you signed a separate buyer's-side agency agreement with the broker before they showed you the unit.",
    nextSteps: [
      "Find any written agreement you signed with the broker. If there is none — or it doesn't predate the showing — the fee was almost certainly illegal.",
      "Ask the listing agent in writing: \"Who is your principal on this listing — the landlord or me?\" Save the response.",
      "If the answer is \"landlord\" or there's no clear answer, file with DCWP.",
    ],
  };
}

function statusToTone(status: Verdict["status"]) {
  switch (status) {
    case "illegal":
      return {
        Icon: ShieldAlert,
        cls: "border-red-300 bg-red-50 text-red-900",
        badgeVariant: "destructive" as const,
        badgeText: "Illegal",
      };
    case "likely-illegal":
      return {
        Icon: AlertTriangle,
        cls: "border-amber-300 bg-amber-50 text-amber-900",
        badgeVariant: "secondary" as const,
        badgeText: "Likely illegal",
      };
    case "legal":
      return {
        Icon: ShieldCheck,
        cls: "border-emerald-300 bg-emerald-50 text-emerald-900",
        badgeVariant: "secondary" as const,
        badgeText: "Likely legal",
      };
    case "outside-scope":
    default:
      return {
        Icon: Info,
        cls: "border-slate-300 bg-slate-50 text-slate-900",
        badgeVariant: "outline" as const,
        badgeText: "Outside scope",
      };
  }
}

export interface FareActCheckerProps {
  /** Hide the wrapper card chrome (used in compact embed). */
  bare?: boolean;
  /** Show a small "Powered by Wade Me Home" attribution + backlink. */
  showAttribution?: boolean;
}

export function FareActChecker({ bare = false, showAttribution = false }: FareActCheckerProps) {
  const [city, setCity] = useState<"nyc" | "outside-nyc">("nyc");
  const [feeDate, setFeeDate] = useState<string>("");
  const [whoHired, setWhoHired] = useState<WhoHired>("unknown");
  const [listingSource, setListingSource] = useState<ListingSource>("unknown");
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [feePaid, setFeePaid] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const verdict = useMemo<Verdict | null>(() => {
    if (!submitted) return null;
    return computeVerdict({
      city,
      feeChargedDate: feeDate ? new Date(feeDate) : null,
      whoHired,
      listingSource,
      feePaid: Number(feePaid) || 0,
      monthlyRent: Number(monthlyRent) || 0,
    });
  }, [submitted, city, feeDate, whoHired, listingSource, feePaid, monthlyRent]);

  const reset = () => {
    setCity("nyc");
    setFeeDate("");
    setWhoHired("unknown");
    setListingSource("unknown");
    setMonthlyRent("");
    setFeePaid("");
    setSubmitted(false);
  };

  const tone = verdict ? statusToTone(verdict.status) : null;

  const Body = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fac-city">Where is the apartment?</Label>
          <RadioGroup
            id="fac-city"
            value={city}
            onValueChange={(v: string) => setCity(v as "nyc" | "outside-nyc")}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="nyc" id="fac-city-nyc" />
              <Label htmlFor="fac-city-nyc" className="font-normal">
                Inside NYC (any of the five boroughs)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="outside-nyc" id="fac-city-out" />
              <Label htmlFor="fac-city-out" className="font-normal">
                Outside NYC (NJ, Westchester, LI, etc.)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fac-date">Date the broker fee was charged</Label>
          <Input
            id="fac-date"
            type="date"
            value={feeDate}
            onChange={(e) => setFeeDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            FARE Act applies to fees charged on or after June 15, 2025.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>How did you find the apartment?</Label>
        <RadioGroup
          value={listingSource}
          onValueChange={(v: string) => setListingSource(v as ListingSource)}
          className="grid gap-2"
        >
          <div className="flex items-start gap-2">
            <RadioGroupItem value="public-listing-site" id="fac-src-pub" className="mt-0.5" />
            <Label htmlFor="fac-src-pub" className="font-normal">
              Public listing site (StreetEasy, Zillow, Apartments.com, Naked Apartments, etc.)
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem value="landlord-direct" id="fac-src-ll" className="mt-0.5" />
            <Label htmlFor="fac-src-ll" className="font-normal">
              Directly from the landlord or building&apos;s leasing office
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem value="open-house" id="fac-src-oh" className="mt-0.5" />
            <Label htmlFor="fac-src-oh" className="font-normal">
              Open house or sign in the window
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem
              value="tenant-engaged-broker"
              id="fac-src-eng"
              className="mt-0.5"
            />
            <Label htmlFor="fac-src-eng" className="font-normal">
              I hired a broker myself (signed a written agreement before they showed me units)
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <RadioGroupItem value="unknown" id="fac-src-unk" className="mt-0.5" />
            <Label htmlFor="fac-src-unk" className="font-normal">
              I&apos;m not sure
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Who hired the broker?</Label>
        <RadioGroup
          value={whoHired}
          onValueChange={(v: string) => setWhoHired(v as WhoHired)}
          className="flex flex-wrap gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="landlord" id="fac-who-ll" />
            <Label htmlFor="fac-who-ll" className="font-normal">
              The landlord
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="tenant" id="fac-who-t" />
            <Label htmlFor="fac-who-t" className="font-normal">
              I did
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="unknown" id="fac-who-u" />
            <Label htmlFor="fac-who-u" className="font-normal">
              Not sure
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fac-rent">Monthly rent ($)</Label>
          <Input
            id="fac-rent"
            type="number"
            inputMode="decimal"
            placeholder="3500"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fac-fee">Broker fee paid ($)</Label>
          <Input
            id="fac-fee"
            type="number"
            inputMode="decimal"
            placeholder="6300"
            value={feePaid}
            onChange={(e) => setFeePaid(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setSubmitted(true)} className="gap-1.5">
          Check fee <ArrowRight className="h-4 w-4" />
        </Button>
        {submitted ? (
          <Button type="button" onClick={reset} variant="outline" className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        ) : null}
      </div>

      {verdict && tone ? (
        <div className={`rounded-lg border p-4 ${tone.cls}`} role="status" aria-live="polite">
          <div className="flex items-center gap-2">
            <tone.Icon className="h-5 w-5" aria-hidden />
            <Badge variant={tone.badgeVariant}>{tone.badgeText}</Badge>
            <h3 className="font-semibold">{verdict.headline}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed">{verdict.rationale}</p>
          {verdict.nextSteps.length ? (
            <>
              <Separator className="my-3 bg-current/10" />
              <p className="text-sm font-medium">What to do next</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
                {verdict.nextSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </>
          ) : null}
          {verdict.status === "illegal" || verdict.status === "likely-illegal" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="default">
                <a
                  href="https://portal.311.nyc.gov/article/?kanumber=KA-03477"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  File DCWP complaint
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog/nyc-fare-act-broker-fee-ban">Read the FARE Act guide</Link>
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              This tool gives a plain-English read of NYC&apos;s FARE Act (Local Law 119, eff. June
              15, 2025). It is not legal advice. For complex situations consult a
              tenant&apos;s-rights attorney or the NYC Department of Consumer &amp; Worker
              Protection.
            </p>
          </div>
        </div>
      )}

      {showAttribution ? (
        <div className="border-t pt-3 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href="https://wademehome.com/tools/fare-act-broker-fee-checker"
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Wade Me Home — FARE Act Broker Fee Checker
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
