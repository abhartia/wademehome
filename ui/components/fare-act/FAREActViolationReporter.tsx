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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Channel = "verbal" | "text" | "email" | "written" | "unknown";
type LandlordHired =
  | "yes_listed"
  | "yes_keys"
  | "yes_commission"
  | "no_self_hired"
  | "unsure";
type FeePaid = "not_paid" | "paid_partial" | "paid_full";

type Verdict = {
  headline: string;
  tone: "emerald" | "amber" | "rose" | "slate";
  badges: string[];
  reasons: string[];
  nextSteps: string[];
  scoreSummary: string;
  draftAvailable: boolean;
  smallClaimsEligible: boolean;
  withinStatuteOfLimitations: boolean | null;
};

function parsePositiveAmount(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n);
}

function monthsAgo(value: string): number | null {
  if (!value.trim()) return null;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  if (diffMs < 0) return null;
  const months = diffMs / (1000 * 60 * 60 * 24 * 30.44);
  return Math.round(months * 10) / 10;
}

function classify(input: {
  landlordHired: LandlordHired;
  brokerDemandedFee: boolean | null;
  channel: Channel;
  feePaid: FeePaid;
  feeAmount: number | null;
  monthlyRent: number | null;
  monthsSinceDemand: number | null;
}): Verdict {
  const reasons: string[] = [];
  const nextSteps: string[] = [];
  const badges: string[] = [];

  if (
    input.landlordHired === "no_self_hired" &&
    input.brokerDemandedFee === true
  ) {
    return {
      headline: "Probably legal — you hired the broker yourself",
      tone: "slate",
      badges: ["Tenant-hired"],
      reasons: [
        "If you hired the broker independently to help you search, the FARE Act allows them to charge you a fee.",
        "The FARE Act prohibits charging tenants for a broker the landlord engaged — not a broker the tenant engaged.",
      ],
      nextSteps: [
        "Confirm in writing what services the broker performed for you specifically.",
        "If the broker also represented the landlord on the same transaction, that may be dual-agency — DCWP and DOS still require written disclosure of the conflict.",
      ],
      scoreSummary: "Tenant-hired engagement: outside the FARE Act ban.",
      draftAvailable: false,
      smallClaimsEligible: false,
      withinStatuteOfLimitations: null,
    };
  }

  if (input.brokerDemandedFee === false) {
    return {
      headline: "No fee demanded — nothing to report yet",
      tone: "emerald",
      badges: ["No demand"],
      reasons: [
        "Per your inputs, no broker fee has been demanded from you. The FARE Act ban on tenant-paid landlord-side broker fees is working as intended on this transaction.",
      ],
      nextSteps: [
        "Get the lease offer in writing with all upfront costs itemized (first month's rent, security deposit, application fee — capped at $20).",
        "If anything changes — even a verbal ask — return to this tool with the new information.",
      ],
      scoreSummary: "No demand recorded.",
      draftAvailable: false,
      smallClaimsEligible: false,
      withinStatuteOfLimitations: null,
    };
  }

  // We are in the violation path
  let landlordHiredScore = 0;
  if (input.landlordHired === "yes_listed") {
    landlordHiredScore = 3;
    reasons.push(
      "The broker posted the listing — that is a clear sign the landlord engaged them, not you.",
    );
  } else if (input.landlordHired === "yes_keys") {
    landlordHiredScore = 3;
    reasons.push(
      "The broker has keys to the unit and is the one showing it — strong signal that the landlord engaged them.",
    );
  } else if (input.landlordHired === "yes_commission") {
    landlordHiredScore = 3;
    reasons.push(
      "The broker is paid a commission by the landlord on lease-up — the landlord is the principal.",
    );
  } else if (input.landlordHired === "unsure") {
    landlordHiredScore = 1;
    reasons.push(
      "Whether the landlord engaged the broker is unclear — DCWP will weigh listing posting, key custody, and commission flow.",
    );
  }

  if (landlordHiredScore >= 3) {
    badges.push("Likely violation");
  } else if (landlordHiredScore === 1) {
    badges.push("Needs investigation");
  }

  if (input.channel === "text" || input.channel === "email") {
    reasons.push(
      "You have written evidence (text/email) of the demand — DCWP and small-claims judges weigh this heavily.",
    );
    badges.push("Written evidence");
  } else if (input.channel === "written") {
    reasons.push(
      "You have a signed/printed document of the demand — strongest possible evidence.",
    );
    badges.push("Written evidence");
  } else if (input.channel === "verbal") {
    reasons.push(
      "Verbal demands are harder to prove. Try to get the demand restated in text or email immediately.",
    );
  } else if (input.channel === "unknown") {
    reasons.push(
      "We could not classify how the demand was made — capture it in writing if any further communication happens.",
    );
  }

  const withinSOL =
    input.monthsSinceDemand === null ? null : input.monthsSinceDemand <= 12;
  if (withinSOL === false) {
    reasons.push(
      "The demand was made more than 12 months ago — DCWP's administrative complaint window is approximately 1 year. Small-claims and civil court windows can be longer; a tenant-rights attorney can confirm.",
    );
    badges.push("Past 12-month window");
  }

  if (input.feePaid === "paid_full" || input.feePaid === "paid_partial") {
    reasons.push(
      input.feePaid === "paid_full"
        ? "You already paid the fee in full. DCWP and small-claims have ordered refunds in 2025–2026 cases with similar fact patterns."
        : "You paid part of the fee. Track every dollar — partial payments are still recoverable.",
    );
    if (input.feeAmount && input.feeAmount > 0 && input.feeAmount <= 10000) {
      reasons.push(
        `The amount in dispute ($${input.feeAmount.toLocaleString()}) is within the NYC small-claims jurisdiction ($10,000 cap).`,
      );
    } else if (input.feeAmount && input.feeAmount > 10000) {
      reasons.push(
        `The amount in dispute ($${input.feeAmount.toLocaleString()}) exceeds the small-claims cap of $10,000 — Civil Court is the venue.`,
      );
    }
  } else {
    reasons.push(
      "You have not yet paid the demanded fee. Refuse in writing and document everything — the demand alone, when it comes from a landlord-side broker, is a violation.",
    );
  }

  // Build verdict
  const isStrong = landlordHiredScore >= 3;
  const isPlausible = landlordHiredScore >= 1;
  const tone: Verdict["tone"] = isStrong ? "rose" : isPlausible ? "amber" : "slate";
  const headline = isStrong
    ? "Likely FARE Act violation — you should not be paying this fee"
    : isPlausible
      ? "Plausible FARE Act issue — gather evidence and file a DCWP complaint"
      : "Unclear — collect more information before filing";

  // Next steps
  if (input.channel !== "text" && input.channel !== "email" && input.channel !== "written") {
    nextSteps.push(
      "Reply to the broker by text or email and ask them to restate the fee demand and the amount. Save screenshots.",
    );
  }
  nextSteps.push(
    "File a DCWP complaint at nyc.gov/dcwp (free, 311 also works). Use the draft below as a starting point.",
  );
  if (input.feePaid !== "not_paid") {
    if (input.feeAmount && input.feeAmount <= 10000) {
      nextSteps.push(
        "If DCWP does not resolve your refund within 30–60 days, sue in NYC Small Claims Court — $20 filing fee, $10,000 cap, no lawyer required.",
      );
    } else {
      nextSteps.push(
        "Because the amount exceeds $10,000, consult a tenant-rights attorney about Civil Court. The Tenant Defense Network and Legal Aid Society both have FARE Act intake.",
      );
    }
  } else {
    nextSteps.push(
      "Refuse to pay in writing. Email the broker stating that the FARE Act prohibits the demand and that you will report any further demand to DCWP.",
    );
  }
  nextSteps.push(
    "Screenshot the original listing — if the broker is also the listing agent, that listing is your strongest exhibit.",
  );
  if (input.monthlyRent) {
    nextSteps.push(
      `Request that any 'discounts' or 'concessions' be applied to the rent itself, not as broker-fee offsets — that protects your renewal baseline.`,
    );
  }

  const draftAvailable = isStrong || isPlausible;
  const smallClaimsEligible =
    input.feeAmount !== null && input.feeAmount <= 10000 && input.feePaid !== "not_paid";

  const scoreSummary = isStrong
    ? "Multiple landlord-engagement signals + fee demand → strong FARE Act violation profile."
    : isPlausible
      ? "Some landlord-engagement signal + fee demand → fact-finding warranted."
      : "Insufficient signal — gather more evidence before filing.";

  return {
    headline,
    tone,
    badges,
    reasons,
    nextSteps,
    scoreSummary,
    draftAvailable,
    smallClaimsEligible,
    withinStatuteOfLimitations: withinSOL,
  };
}

function buildDraftComplaint(input: {
  brokerName: string;
  unitAddress: string;
  monthlyRent: number | null;
  feeAmount: number | null;
  channel: Channel;
  monthsSinceDemand: number | null;
  landlordHired: LandlordHired;
}): string {
  const lines: string[] = [];
  lines.push("To: NYC Department of Consumer and Worker Protection (DCWP)");
  lines.push("Re: Suspected FARE Act violation — landlord-side broker fee demand");
  lines.push("");
  lines.push(
    `On or about ${
      input.monthsSinceDemand !== null
        ? `${input.monthsSinceDemand} months ago`
        : "[date of demand]"
    }, ${input.brokerName.trim() || "[broker name]"} demanded a broker fee from me in connection with my application for the rental unit at ${
      input.unitAddress.trim() || "[unit address]"
    }${input.monthlyRent ? ` (asking rent $${input.monthlyRent.toLocaleString()}/month)` : ""}.`,
  );
  lines.push("");
  if (input.landlordHired === "yes_listed") {
    lines.push(
      "The broker who demanded the fee is the same party who posted the listing for this unit on a public rental platform. The landlord engaged the broker; I did not.",
    );
  } else if (input.landlordHired === "yes_keys") {
    lines.push(
      "The broker who demanded the fee has keys to the unit and showed me the apartment. I did not engage them; the landlord did.",
    );
  } else if (input.landlordHired === "yes_commission") {
    lines.push(
      "On information and belief, the landlord pays this broker a commission on lease-up, making the landlord the principal. I did not engage the broker.",
    );
  } else {
    lines.push(
      "I did not engage this broker. I believe the landlord engaged them based on the circumstances of the showing and listing.",
    );
  }
  lines.push("");
  if (input.feeAmount) {
    lines.push(
      `The demanded fee is $${input.feeAmount.toLocaleString()}. ${
        input.feeAmount > 10000
          ? "This is above the small-claims threshold."
          : "This is within the small-claims threshold."
      }`,
    );
  }
  if (input.channel === "text" || input.channel === "email" || input.channel === "written") {
    lines.push(
      `The demand was made in writing (${input.channel === "text" ? "SMS / text message" : input.channel === "email" ? "email" : "signed/printed document"}). I have preserved screenshots / copies of the communication and can provide them.`,
    );
  } else {
    lines.push(
      "The demand was made verbally. I am attempting to obtain a written restatement and will supplement this complaint when received.",
    );
  }
  lines.push("");
  lines.push(
    "The FARE Act (NYC Admin. Code §§ 20-699.20–20-699.27, eff. June 11, 2025) prohibits charging a tenant for a broker the landlord engaged. I am asking DCWP to (1) order any paid fee refunded, (2) issue a $2,000-per-violation fine where appropriate, and (3) record the broker's conduct against any future violations.",
  );
  lines.push("");
  lines.push(
    "I can be reached at the contact details on file. I am happy to provide all supporting documents.",
  );
  return lines.join("\n");
}

export interface FAREActViolationReporterProps {
  bare?: boolean;
  showAttribution?: boolean;
}

export function FAREActViolationReporter({
  bare = false,
  showAttribution = false,
}: FAREActViolationReporterProps) {
  const [landlordHired, setLandlordHired] =
    useState<LandlordHired>("yes_listed");
  const [brokerDemandedFee, setBrokerDemandedFee] = useState<string>("yes");
  const [channel, setChannel] = useState<Channel>("text");
  const [feePaid, setFeePaid] = useState<FeePaid>("not_paid");
  const [feeAmountStr, setFeeAmountStr] = useState("");
  const [monthlyRentStr, setMonthlyRentStr] = useState("");
  const [demandDate, setDemandDate] = useState("");
  const [brokerName, setBrokerName] = useState("");
  const [unitAddress, setUnitAddress] = useState("");

  const result = useMemo(() => {
    const feeAmount = parsePositiveAmount(feeAmountStr);
    const monthlyRent = parsePositiveAmount(monthlyRentStr);
    const monthsSinceDemand = monthsAgo(demandDate);
    const v = classify({
      landlordHired,
      brokerDemandedFee:
        brokerDemandedFee === "yes"
          ? true
          : brokerDemandedFee === "no"
            ? false
            : null,
      channel,
      feePaid,
      feeAmount,
      monthlyRent,
      monthsSinceDemand,
    });
    const draft = v.draftAvailable
      ? buildDraftComplaint({
          brokerName,
          unitAddress,
          monthlyRent,
          feeAmount,
          channel,
          monthsSinceDemand,
          landlordHired,
        })
      : "";
    return { v, draft, monthsSinceDemand };
  }, [
    landlordHired,
    brokerDemandedFee,
    channel,
    feePaid,
    feeAmountStr,
    monthlyRentStr,
    demandDate,
    brokerName,
    unitAddress,
  ]);

  const verdictToneClass: Record<Verdict["tone"], string> = {
    emerald: "border-emerald-300 bg-emerald-50",
    amber: "border-amber-300 bg-amber-50",
    rose: "border-rose-300 bg-rose-50",
    slate: "border-slate-300 bg-slate-50",
  };

  const inner = (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="far-landlord-hired">Did the landlord engage the broker?</Label>
          <Select
            value={landlordHired}
            onValueChange={(v) => setLandlordHired(v as LandlordHired)}
          >
            <SelectTrigger id="far-landlord-hired">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes_listed">Yes — broker posted the listing</SelectItem>
              <SelectItem value="yes_keys">Yes — broker has keys / showed the unit</SelectItem>
              <SelectItem value="yes_commission">Yes — broker paid commission by landlord</SelectItem>
              <SelectItem value="no_self_hired">No — I hired the broker myself</SelectItem>
              <SelectItem value="unsure">Unsure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-demanded">Did the broker demand a fee from you?</Label>
          <Select
            value={brokerDemandedFee}
            onValueChange={(v) => setBrokerDemandedFee(v)}
          >
            <SelectTrigger id="far-demanded">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-channel">How was the demand made?</Label>
          <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
            <SelectTrigger id="far-channel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verbal">Verbally / over the phone</SelectItem>
              <SelectItem value="text">SMS / text message</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="written">Signed / printed document</SelectItem>
              <SelectItem value="unknown">Not sure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-paid">Have you paid yet?</Label>
          <Select value={feePaid} onValueChange={(v) => setFeePaid(v as FeePaid)}>
            <SelectTrigger id="far-paid">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_paid">Not yet</SelectItem>
              <SelectItem value="paid_partial">Partially</SelectItem>
              <SelectItem value="paid_full">In full</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-fee">Fee amount (USD)</Label>
          <Input
            id="far-fee"
            inputMode="numeric"
            placeholder="e.g. 4200"
            value={feeAmountStr}
            onChange={(e) => setFeeAmountStr(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-rent">Monthly rent (USD)</Label>
          <Input
            id="far-rent"
            inputMode="numeric"
            placeholder="e.g. 3500"
            value={monthlyRentStr}
            onChange={(e) => setMonthlyRentStr(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-date">Date of the demand</Label>
          <Input
            id="far-date"
            type="date"
            value={demandDate}
            onChange={(e) => setDemandDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="far-broker-name">Broker / brokerage name (optional)</Label>
          <Input
            id="far-broker-name"
            placeholder="e.g. Jane Smith @ XYZ Realty"
            value={brokerName}
            onChange={(e) => setBrokerName(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="far-address">Unit address (optional)</Label>
          <Input
            id="far-address"
            placeholder="e.g. 123 E 5th St #4B, New York NY 10003"
            value={unitAddress}
            onChange={(e) => setUnitAddress(e.target.value)}
          />
        </div>
      </div>

      <Card className={verdictToneClass[result.v.tone]}>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {result.v.badges.map((b) => (
              <Badge key={b} variant="secondary" className="bg-white/70">
                {b}
              </Badge>
            ))}
            {result.v.withinStatuteOfLimitations === true && (
              <Badge variant="secondary" className="bg-white/70">
                Within 12-month DCWP window
              </Badge>
            )}
          </div>
          <CardTitle className="mt-2 text-base">{result.v.headline}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {result.v.scoreSummary}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          {result.v.reasons.length > 0 && (
            <div>
              <p className="font-semibold text-foreground">Why we say that</p>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                {result.v.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {result.v.nextSteps.length > 0 && (
            <div>
              <p className="font-semibold text-foreground">What to do next</p>
              <ol className="mt-1 list-decimal pl-5 text-muted-foreground">
                {result.v.nextSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          )}
          {result.v.draftAvailable && (
            <div>
              <Separator className="my-3" />
              <p className="font-semibold text-foreground">Draft DCWP complaint</p>
              <p className="text-xs text-muted-foreground">
                Copy this into your DCWP complaint at{" "}
                <Link
                  href="https://www1.nyc.gov/site/dca/consumers/file-complaint.page"
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-4"
                >
                  nyc.gov/dcwp
                </Link>{" "}
                or call 311. Replace any bracketed placeholders with your details before submitting.
              </p>
              <Textarea
                readOnly
                value={result.draft}
                rows={14}
                className="mt-2 font-mono text-xs"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      void navigator.clipboard.writeText(result.draft);
                    }
                  }}
                >
                  Copy draft
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://www1.nyc.gov/site/dca/consumers/file-complaint.page"
                    target="_blank"
                    rel="noopener"
                  >
                    File at DCWP
                  </Link>
                </Button>
                {result.v.smallClaimsEligible && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href="https://www.nycourts.gov/courts/nyc/smallclaims/index.shtml"
                      target="_blank"
                      rel="noopener"
                    >
                      Small claims
                    </Link>
                  </Button>
                )}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                This is informational, not legal advice. For amounts over $10,000 or where
                an attorney is needed, contact Legal Aid Society NYC or the Tenant Defense
                Network.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAttribution && (
        <p className="text-xs text-muted-foreground">
          Built by{" "}
          <Link href="/" className="underline underline-offset-4">
            wademehome.com
          </Link>{" "}
          — NYC FARE Act enforcement helper.
        </p>
      )}
    </div>
  );

  if (bare) return inner;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Live April 2026</Badge>
          <Badge variant="outline">DCWP complaint draft</Badge>
        </div>
        <CardTitle className="mt-2">FARE Act violation reporter</CardTitle>
        <CardDescription>
          Tell us what happened and we&apos;ll tell you whether it looks like a
          FARE Act violation, walk you through the next steps, and draft a
          DCWP complaint you can copy.
        </CardDescription>
      </CardHeader>
      <CardContent>{inner}</CardContent>
    </Card>
  );
}

export default FAREActViolationReporter;
