import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { FAREActViolationReporter } from "@/components/fare-act/FAREActViolationReporter";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/fare-act-violation-reporter`;

export const metadata: Metadata = {
  title:
    "FARE Act Violation Reporter (NYC, 2026): Was Your Broker Fee Illegal? | Wade Me Home",
  description:
    "Free interactive tool that classifies your NYC broker-fee situation against the FARE Act, walks through DCWP and small-claims enforcement, and drafts a copy-paste DCWP complaint. Built for NYC tenants illegally charged a landlord-side broker fee.",
  keywords: [
    "FARE Act violation reporter",
    "FARE Act violation",
    "FARE Act NYC complaint",
    "FARE Act DCWP complaint",
    "how to file FARE Act complaint",
    "is my broker fee illegal NYC",
    "NYC broker fee illegal 2026",
    "broker fee refund NYC",
    "what to do if charged broker fee NYC",
    "NYC DCWP complaint form",
    "FARE Act small claims NYC",
    "small claims broker fee NYC",
    "NYC broker fee illegal",
    "broker keys to apartment fee",
    "FARE Act enforcement",
    "FARE Act administrative fee",
    "FARE Act marketing fee",
    "FARE Act application fee",
    "FARE Act 2026",
    "tenant rights broker fee NYC",
  ],
  openGraph: {
    title: "NYC FARE Act Violation Reporter (2026)",
    description:
      "Was you charged a NYC broker fee illegally? Run your situation against the FARE Act and get a copy-paste DCWP complaint draft.",
    url: TOOL_URL,
    type: "website",
  },
  alternates: { canonical: TOOL_URL },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC FARE Act Violation Reporter",
    url: TOOL_URL,
    applicationCategory: "GovernmentApplication",
    operatingSystem: "Any",
    description:
      "Free interactive NYC FARE Act violation classifier. Inputs the landlord-engagement test, fee channel, and timing of demand; outputs a verdict, enforcement next steps, and a copy-paste DCWP complaint draft.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I know if my broker fee is illegal under the FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "If the broker who demanded the fee posted the listing, has keys to the unit, showed you the apartment, or is paid a commission by the landlord on lease-up, the landlord engaged them. The FARE Act (NYC Admin. Code §§ 20-699.20–20-699.27, eff. June 11, 2025) prohibits charging the tenant in that case. If you hired the broker yourself, the fee is legal.",
        },
      },
      {
        "@type": "Question",
        name: "What if the broker calls the fee an 'administrative fee' or 'marketing fee' instead?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "DCWP has explicitly flagged rebranded broker fees — administrative, marketing, agency, processing — as FARE Act violations when the broker was landlord-hired. NYC application fees are also capped at $20 by separate state law. The label does not change the legal analysis.",
        },
      },
      {
        "@type": "Question",
        name: "What if I already paid the broker fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "DCWP has been ordering refunds in 2025–2026 cases. File a DCWP complaint at nyc.gov/dcwp; if no resolution within 30–60 days, file in NYC Small Claims Court ($20 filing fee, $10,000 cap, no lawyer required). For amounts over $10,000, consult Legal Aid Society NYC or the Tenant Defense Network.",
        },
      },
      {
        "@type": "Question",
        name: "How long do I have to file a FARE Act complaint?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "DCWP's administrative complaint window is approximately 1 year from the date of the demand. Small-claims and civil court windows can be longer; a tenant-rights attorney can confirm. The reporter flags whether your demand date is inside the 12-month window.",
        },
      },
      {
        "@type": "Question",
        name: "Does the violation reporter store any of my data?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. All classification and the DCWP complaint draft are generated entirely in your browser. Nothing is sent to a server, stored, or transmitted. The tool runs offline once loaded.",
        },
      },
      {
        "@type": "Question",
        name: "Does the FARE Act apply to Hoboken, Jersey City, or Newark?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. The FARE Act is a New York City ordinance only. New Jersey cities — Hoboken, Jersey City, Newark — still allow tenant-paid broker fees. The reporter is for NYC-side transactions only.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "FARE Act Violation Reporter",
        item: TOOL_URL,
      },
    ],
  },
];

const FAQ_DISPLAY = [
  {
    q: "What counts as the landlord engaging the broker?",
    a: "Any of: the broker posted the listing, the broker has keys to the unit, the broker is the one showing the apartment, or the broker is paid a commission by the landlord on lease-up. Any one of these is sufficient — DCWP weighs them in combination.",
  },
  {
    q: "Can a broker rename the fee to get around the FARE Act?",
    a: "No. DCWP has flagged 'administrative,' 'marketing,' 'agency,' and 'processing' fees as rebranded broker fees when the broker was landlord-hired. NYC application fees are also capped at $20 by state law.",
  },
  {
    q: "I already paid. Can I still get a refund?",
    a: "Yes, in many cases. File at nyc.gov/dcwp. If unresolved in 30–60 days, NYC Small Claims is the next step ($20 filing fee, $10,000 cap, no attorney required). The reporter drafts the DCWP complaint for you.",
  },
  {
    q: "What if the demand was verbal, not in writing?",
    a: "Verbal demands are harder to prove. Reply by text or email asking the broker to restate the fee amount and the broker's role on the transaction. Save screenshots. Most brokers will reiterate in writing if asked plainly.",
  },
  {
    q: "Does the reporter store my information?",
    a: "No. The classification and the DCWP draft are generated entirely in your browser. Nothing is sent to a server.",
  },
  {
    q: "Is this legal advice?",
    a: "No — this is informational only. For amounts over $10,000, contested cases, or where the landlord is retaliating, contact Legal Aid Society NYC, the Tenant Defense Network, or a private tenant-rights attorney.",
  },
];

export default function FAREActViolationReporterPage() {
  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:py-14">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free</Badge>
            <Badge className="bg-emerald-600">DCWP draft included</Badge>
            <Badge variant="outline">NYC FARE Act 2026</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            NYC FARE Act Violation Reporter
          </h1>
          <p className="text-base text-muted-foreground">
            Were you charged a broker fee in NYC after June 11, 2025? Run the
            facts past the FARE Act&apos;s landlord-engagement test below. The
            tool walks through DCWP and small-claims enforcement and drafts a
            copy-paste DCWP complaint with your details inserted. Runs entirely
            in your browser, stores nothing.
          </p>
        </header>

        <FAREActViolationReporter />

        <Card>
          <CardHeader>
            <CardTitle>How the reporter decides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The FARE Act&apos;s core rule is simple: whoever engaged the
              broker pays the broker. The reporter applies four signal tests
              in order of weight:
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                <strong>Listing authorship.</strong> If the broker posted the
                listing on StreetEasy, Zillow, Apartments.com, or any public
                rental platform, the broker is the landlord&apos;s agent. This
                is the strongest single signal.
              </li>
              <li>
                <strong>Key custody and showing.</strong> If the broker has
                keys to the unit and is the one showing it, they are
                operating on the landlord&apos;s behalf. Tenants do not give
                their own brokers building access.
              </li>
              <li>
                <strong>Commission flow.</strong> If the broker is paid by the
                landlord on lease-up, the landlord is the principal.
                Tenant-side brokers are paid by tenants.
              </li>
              <li>
                <strong>Tenant initiation.</strong> The narrow legal exception:
                if the tenant independently engaged a buyer&apos;s-side
                broker — typically signed a search agreement up front — the
                tenant pays. Most NYC FARE Act complaints fail this test
                because there is no such agreement.
              </li>
            </ol>
            <p>
              The reporter also weighs evidence quality (verbal vs. text vs.
              email vs. signed document) and timing (DCWP&apos;s
              administrative complaint window is ~1 year). Strong evidence in
              writing inside the 12-month window with multiple
              landlord-engagement signals is the textbook violation profile.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What enforcement actually looks like</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Through April 2026 (about 10 months of FARE Act enforcement
              data), DCWP has logged well over 1,500 tenant complaints. The
              standard outcomes:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Most-common path:</strong> tenant files at
                nyc.gov/dcwp (or 311). DCWP contacts the broker, the broker
                refunds the fee + a warning letter is issued. Resolution
                typically 30–60 days.
              </li>
              <li>
                <strong>Repeat-offender path:</strong> DCWP issues a $2,000-
                per-violation fine. Several brokerages with multiple flagged
                cases have already been fined.
              </li>
              <li>
                <strong>Tenant self-help path:</strong> NYC Small Claims
                Court — $20 filing fee, $10,000 cap, no lawyer required.
                Tenants have won these cases on text-message evidence
                alone in 2025–2026.
              </li>
              <li>
                <strong>Civil Court / class action path:</strong> for
                higher-value cases (luxury rentals where the fee was tens of
                thousands), or where multiple tenants in the same building
                were illegally charged. Legal Aid Society NYC and the
                Tenant Defense Network have ongoing intake.
              </li>
            </ul>
            <p>
              The reporter routes you to the right path based on the dollar
              amount in dispute and the strength of your evidence.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently asked questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            {FAQ_DISPLAY.map((item) => (
              <div key={item.q} className="space-y-1.5">
                <p className="font-semibold text-foreground">{item.q}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Related guides &amp; tools</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-between">
              <Link href="/blog/nyc-fare-act-broker-fee-ban">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act broker fee ban guide
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-broker-fee-checker">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act savings checker
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/rent-stabilization-checker">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Rent stabilization checker
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/rgb-renewal-calculator">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  RGB renewal calculator
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/blog/nyc-rent-stabilization-guide">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  NYC rent stabilization guide
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  All NYC renter tools
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Built and maintained by Wade Me Home. Not legal advice. For
          amounts over $10,000 or where the landlord is retaliating, contact{" "}
          <a
            href="https://legalaidnyc.org/get-help/housing-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Legal Aid Society NYC
          </a>{" "}
          or the Tenant Defense Network. Reviewed 2026-04-30.
        </p>
      </main>
    </div>
  );
}
