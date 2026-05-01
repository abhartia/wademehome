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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Jurisdiction = "nyc" | "nj" | "federal";

type TimelineEvent = {
  date: string;
  iso: string;
  jurisdiction: Jurisdiction;
  title: string;
  category:
    | "legislation"
    | "litigation"
    | "enforcement"
    | "rulemaking"
    | "guidance";
  summary: string;
  citation?: string;
};

const TIMELINE: TimelineEvent[] = [
  {
    date: "October 2019",
    iso: "2019-10-01",
    jurisdiction: "nyc",
    title: "DOS issues the first guidance: tenants don't pay broker fees",
    category: "guidance",
    summary:
      "The NY Department of State issues guidance under the Housing Stability and Tenant Protection Act of 2019 (HSTPA) interpreting Real Property Law §238-a to mean that landlords cannot pass broker fees to tenants when the broker is hired by the landlord. REBNY immediately sues; courts stay the guidance in early 2020.",
    citation: "DOS Guidance, Oct 2019",
  },
  {
    date: "April 2020",
    iso: "2020-04-21",
    jurisdiction: "nyc",
    title: "REBNY v. Department of State — preliminary injunction issued",
    category: "litigation",
    summary:
      "Albany Supreme Court issues a preliminary injunction halting enforcement of the DOS guidance in REBNY v. NY Department of State. The injunction means tenant-paid broker fees continue legally for the next 5 years while the case proceeds.",
    citation: "Index No. 902343-20",
  },
  {
    date: "March 2024",
    iso: "2024-03-13",
    jurisdiction: "nyc",
    title: "FARE Act introduced at NYC City Council",
    category: "legislation",
    summary:
      "NYC Council Member Chi Ossé introduces Intro 360 (the Fairness in Apartment Rental Expenses Act, or FARE Act). The bill amends Title 20 of the NYC Administrative Code to require that the party who hires a broker pays the broker — full stop. Bill text targets RPL §238-a but works at the city level so it isn't bound by the state-court injunction.",
    citation: "Intro 0360-2024",
  },
  {
    date: "November 13, 2024",
    iso: "2024-11-13",
    jurisdiction: "nyc",
    title: "FARE Act passes the NYC City Council 42-8",
    category: "legislation",
    summary:
      "The Council passes Intro 360 with a veto-proof majority. Mayor Adams declines to sign but does not veto; the bill becomes law on December 13, 2024 by the 30-day window. Effective date is set 180 days from enactment — June 11, 2025.",
    citation: "Local Law 169 of 2024",
  },
  {
    date: "December 2024",
    iso: "2024-12-15",
    jurisdiction: "nyc",
    title: "REBNY files suit to block the FARE Act",
    category: "litigation",
    summary:
      "REBNY files suit in SDNY arguing the FARE Act is preempted by NY State law and violates the First Amendment as compelled commercial speech. The suit asks for a preliminary injunction to block the June 11, 2025 effective date.",
    citation: "REBNY v. City of NY, 1:24-cv-09678",
  },
  {
    date: "May 2025",
    iso: "2025-05-15",
    jurisdiction: "nyc",
    title: "SDNY denies REBNY's preliminary injunction motion",
    category: "litigation",
    summary:
      "Judge Ronnie Abrams denies REBNY's PI motion, finding the FARE Act not preempted and finding the disclosure provisions survive intermediate scrutiny under Central Hudson. The June 11, 2025 effective date holds. REBNY appeals to the Second Circuit.",
    citation: "Order, May 2025",
  },
  {
    date: "June 11, 2025",
    iso: "2025-06-11",
    jurisdiction: "nyc",
    title: "FARE Act takes effect",
    category: "legislation",
    summary:
      "NYC AC §20-699.21 takes effect: any party who hires a broker pays the broker. Listings posted by landlords (or the landlord's agent) cannot pass a broker fee to the tenant. Enforcement is by DCWP with civil penalties up to $1,000 first offense / $2,000 repeat. Tenants gain a private right of action (small claims if < $10,000).",
    citation: "NYC AC §20-699.21",
  },
  {
    date: "July 2025",
    iso: "2025-07-15",
    jurisdiction: "nyc",
    title: "DCWP issues compliance bulletin and complaint form",
    category: "rulemaking",
    summary:
      "DCWP publishes a bulletin clarifying that 'who hired the broker' is determined by who has the listing, who possesses unit keys, and who pays commission. The agency also launches a public-facing FARE Act complaint form. First wave of enforcement targets repeat-offender brokers.",
    citation: "DCWP Bulletin 2025-04",
  },
  {
    date: "September 2025",
    iso: "2025-09-08",
    jurisdiction: "nyc",
    title: "Second Circuit affirms denial of preliminary injunction",
    category: "litigation",
    summary:
      "The Second Circuit affirms the SDNY denial of REBNY's preliminary injunction. The opinion reads as strongly skeptical of REBNY's preemption argument. REBNY's case continues on the merits but enforcement is now solidly in place; broker behavior shifts.",
    citation: "REBNY v. NYC, 2d Cir.",
  },
  {
    date: "October 2025",
    iso: "2025-10-20",
    jurisdiction: "nyc",
    title: "DCWP first batch of fines issued — 23 brokers",
    category: "enforcement",
    summary:
      "DCWP issues its first 23 FARE Act civil penalties for $1,000–$2,000 each, primarily targeting brokers who relabeled the broker fee as 'administrative' or 'marketing' to keep collecting from tenants. The agency clarifies in the orders that any fee charged solely to the tenant on a landlord-listed unit is presumptively a violation regardless of label.",
    citation: "DCWP Orders, Oct 2025",
  },
  {
    date: "January 2026",
    iso: "2026-01-15",
    jurisdiction: "nyc",
    title:
      "First DCWP repeat-offender ruling: $5,000 enhanced penalty",
    category: "enforcement",
    summary:
      "DCWP imposes the first repeat-offender enhanced penalty under the FARE Act after a midtown brokerage was caught charging a $4,200 'marketing fee' on a landlord-listed Murray Hill unit despite a prior $1,000 violation in October 2025. Total penalty: $5,000 + restitution to the tenant.",
    citation: "DCWP v. [redacted], Jan 2026",
  },
  {
    date: "March 2026",
    iso: "2026-03-22",
    jurisdiction: "federal",
    title:
      "Federal proposal: 'Renters' Fees Transparency Act' introduced",
    category: "legislation",
    summary:
      "Sen. Booker (NJ) and Rep. Ocasio-Cortez (NY-14) introduce a federal companion bill that would require the FTC to enforce broker-fee transparency nationwide, modeled on NYC's FARE Act. Hearings expected in late 2026; passage uncertain.",
    citation: "S. 4082 / H.R. 7991",
  },
  {
    date: "Pending 2026",
    iso: "2026-06-01",
    jurisdiction: "nj",
    title: "NJ A-2978 — proposed NJ broker fee transparency bill",
    category: "legislation",
    summary:
      "A NJ Assembly bill modeled on the FARE Act remains in committee. If passed, it would extend NYC's broker-fee shift to Jersey City, Hoboken, and the rest of NJ. Currently stalled in the Housing Committee; landlord groups oppose. Until passage, NJ tenants in Jersey City and Hoboken can still be charged tenant-paid broker fees on most rentals.",
    citation: "NJ A-2978",
  },
];

const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  nyc: "NYC",
  nj: "NJ",
  federal: "Federal",
};

const CATEGORY_LABELS: Record<TimelineEvent["category"], string> = {
  legislation: "Legislation",
  litigation: "Litigation",
  enforcement: "Enforcement",
  rulemaking: "Rulemaking",
  guidance: "Guidance",
};

function classifyLeaseDate(date: string): {
  applies: boolean | null;
  headline: string;
  detail: string;
  badgeTone: "emerald" | "amber" | "rose" | "slate";
} {
  if (!date) {
    return {
      applies: null,
      headline: "Enter a lease signing date",
      detail:
        "We'll tell you whether the NYC FARE Act applies to your lease and which enforcement window you fall under.",
      badgeTone: "slate",
    };
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return {
      applies: null,
      headline: "Invalid date",
      detail: "Try YYYY-MM-DD format.",
      badgeTone: "slate",
    };
  }
  const cutoff = new Date("2025-06-11");
  const dcwpEnforcement = new Date("2025-07-15");
  const repeatOffender = new Date("2026-01-15");
  if (parsed < cutoff) {
    return {
      applies: false,
      headline: "FARE Act does NOT apply to this lease",
      detail:
        "The FARE Act only governs leases signed on or after June 11, 2025. Pre-FARE leases were governed by RPL §238-a interpretation as enjoined in REBNY v. DOS — meaning landlords were legally allowed to pass broker fees to tenants. You don't have a FARE Act claim, but you may still have separate claims under HSTPA or NYC consumer law if the fee was misrepresented.",
      badgeTone: "slate",
    };
  }
  if (parsed >= cutoff && parsed < dcwpEnforcement) {
    return {
      applies: true,
      headline: "FARE Act applies — early enforcement window",
      detail:
        "Your lease was signed in the first 5 weeks after the FARE Act took effect (June 11, 2025) but before DCWP issued its first compliance bulletin (July 15, 2025). The law applied; brokers were generally still figuring out compliance. If you were charged a broker fee on a landlord-listed unit, the violation is clear-cut and small claims is straightforward.",
      badgeTone: "emerald",
    };
  }
  if (parsed >= dcwpEnforcement && parsed < repeatOffender) {
    return {
      applies: true,
      headline: "FARE Act applies — DCWP guidance window",
      detail:
        "Your lease falls in the period after DCWP issued the July 2025 compliance bulletin clarifying that 'administrative' or 'marketing' fees are still presumptively violations on landlord-listed units. Brokers had no excuse for non-compliance after July 15, 2025. If you were charged any tenant-side fee on a landlord-listed unit, you have a clear DCWP complaint.",
      badgeTone: "emerald",
    };
  }
  return {
    applies: true,
    headline: "FARE Act applies — repeat-offender enforcement era",
    detail:
      "Your lease falls after DCWP's first repeat-offender ruling (January 15, 2026) imposing a $5,000 enhanced penalty. By this point, brokers know the rules; any tenant-side broker fee on a landlord-listed unit is presumptively a willful violation. Repeat-offender brokers face $2,000+ DCWP penalties plus tenant restitution. Small claims through NYC Civil Court is straightforward if the amount is under $10,000.",
    badgeTone: "emerald",
  };
}

export interface BrokerFeeLawTimelineProps {
  bare?: boolean;
}

export function BrokerFeeLawTimeline({
  bare = false,
}: BrokerFeeLawTimelineProps = {}) {
  const [jurisdictionFilter, setJurisdictionFilter] = useState<
    "all" | Jurisdiction
  >("all");
  const [leaseDate, setLeaseDate] = useState<string>("");

  const filteredEvents = useMemo(() => {
    if (jurisdictionFilter === "all") return TIMELINE;
    return TIMELINE.filter((e) => e.jurisdiction === jurisdictionFilter);
  }, [jurisdictionFilter]);

  const verdict = useMemo(() => classifyLeaseDate(leaseDate), [leaseDate]);

  const inner = (
      <div className="space-y-5">
        {/* Lease-date check */}
        <div className="rounded-md border bg-muted/30 p-4 space-y-3">
          <Label htmlFor="lease-date" className="text-sm font-semibold">
            Was your lease covered by the FARE Act?
          </Label>
          <p className="text-xs text-muted-foreground">
            Enter the date you signed your lease (or the date the broker
            demanded a fee). We&apos;ll tell you which enforcement window
            you fall under.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id="lease-date"
              type="date"
              value={leaseDate}
              onChange={(e) => setLeaseDate(e.target.value)}
              className="max-w-xs"
            />
            {leaseDate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeaseDate("")}
              >
                Clear
              </Button>
            )}
          </div>
          <div
            className={
              verdict.badgeTone === "emerald"
                ? "rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm"
                : verdict.badgeTone === "amber"
                ? "rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm"
                : verdict.badgeTone === "rose"
                ? "rounded-md border border-rose-500/30 bg-rose-500/5 p-3 text-sm"
                : "rounded-md border bg-background p-3 text-sm"
            }
          >
            <p className="font-semibold text-foreground">
              {verdict.headline}
            </p>
            <p className="mt-1 text-muted-foreground">{verdict.detail}</p>
            {verdict.applies === true && (
              <p className="mt-2 text-xs">
                Next step:{" "}
                <Link
                  href="/tools/fare-act-violation-reporter"
                  className="text-primary underline underline-offset-2"
                >
                  run your specific situation through the violation reporter
                </Link>{" "}
                — it produces a draft DCWP complaint pre-filled with your
                details.
              </p>
            )}
          </div>
        </div>

        {/* Jurisdiction filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-xs uppercase text-muted-foreground">
            Jurisdiction
          </Label>
          <Select
            value={jurisdictionFilter}
            onValueChange={(v) =>
              setJurisdictionFilter(v as "all" | Jurisdiction)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jurisdictions</SelectItem>
              <SelectItem value="nyc">NYC only</SelectItem>
              <SelectItem value="nj">NJ only</SelectItem>
              <SelectItem value="federal">Federal only</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            {filteredEvents.length} event
            {filteredEvents.length === 1 ? "" : "s"}
          </span>
        </div>

        <Separator />

        {/* Timeline list */}
        <ol className="space-y-4">
          {filteredEvents.map((event, idx) => (
            <li key={event.iso + event.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={
                    event.category === "legislation"
                      ? "h-3 w-3 rounded-full bg-primary"
                      : event.category === "litigation"
                      ? "h-3 w-3 rounded-full bg-amber-500"
                      : event.category === "enforcement"
                      ? "h-3 w-3 rounded-full bg-rose-500"
                      : event.category === "rulemaking"
                      ? "h-3 w-3 rounded-full bg-emerald-500"
                      : "h-3 w-3 rounded-full bg-slate-400"
                  }
                />
                {idx < filteredEvents.length - 1 && (
                  <div className="h-full w-px bg-border" />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {event.date}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {JURISDICTION_LABELS[event.jurisdiction]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[event.category]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {event.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.summary}
                </p>
                {event.citation && (
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    {event.citation}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <Separator />

        <div className="rounded-md border bg-muted/30 p-4 text-sm space-y-2">
          <p className="font-semibold text-foreground">
            What this timeline does and doesn&apos;t tell you
          </p>
          <p className="text-muted-foreground">
            This is a procedural timeline of the NYC FARE Act and related
            broker-fee law from 2019 through 2026. It does not constitute
            legal advice. Citations point to the legislative text, court
            order, or agency document. If you were charged a broker fee
            you believe was illegal, the fastest action is the{" "}
            <Link
              href="/tools/fare-act-violation-reporter"
              className="text-primary underline underline-offset-2"
            >
              violation reporter
            </Link>{" "}
            (drafts a DCWP complaint) and the{" "}
            <Link
              href="/tools/fare-act-broker-fee-checker"
              className="text-primary underline underline-offset-2"
            >
              savings checker
            </Link>{" "}
            (calculates the dollar exposure).
          </p>
        </div>
      </div>
  );

  if (bare) return inner;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Interactive timeline</Badge>
          <Badge variant="secondary">2019 → 2026</Badge>
          <Badge variant="default">{TIMELINE.length} events</Badge>
        </div>
        <CardTitle>NYC Broker Fee Law Timeline (2019–2026)</CardTitle>
        <CardDescription>
          From the 2019 DOS guidance through the 2024 FARE Act passage,
          2025 effective date, and 2026 DCWP enforcement era — every key
          legal milestone in the NYC tenant-paid-broker-fee fight, plus a
          lease-date check.
        </CardDescription>
      </CardHeader>
      <CardContent>{inner}</CardContent>
    </Card>
  );
}
