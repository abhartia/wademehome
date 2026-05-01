import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const URL = `${baseUrl}/answers`;

export const metadata: Metadata = {
  title: "NYC Renter Answers — FARE Act, Rent Stabilization, Broker Fees",
  description:
    "Concise, sourced answers to the questions NYC renters actually ask: FARE Act broker-fee rules, rent-stabilization eligibility, RGB renewal caps, and what to do if charged illegally.",
  keywords: [
    "NYC renter questions",
    "FARE Act questions",
    "NYC broker fee questions",
    "rent stabilization NYC questions",
    "NYC renter answers",
    "tenant rights NYC FAQ",
  ],
  openGraph: {
    title: "NYC renter answers — FARE Act, rent stabilization, broker fees",
    description:
      "Question-by-question answers cross-linked to the tools that confirm them.",
    url: URL,
    type: "website",
  },
  alternates: { canonical: URL },
};

const ANSWERS = [
  {
    slug: "who-pays-broker-fee-nyc-fare-act",
    question: "Who pays the broker fee in NYC under the FARE Act?",
    summary:
      "Whoever hired the broker pays. Listing authorship, key custody, showing, and commission flow are the four signals that decide.",
    cluster: "FARE Act",
  },
  {
    slug: "does-fare-act-apply-to-streeteasy-listings",
    question: "Does the FARE Act apply to apartments listed on StreetEasy?",
    summary:
      "Yes — listing authorship is the strongest single FARE Act signal. If the broker is the contact on StreetEasy, the landlord engaged them.",
    cluster: "FARE Act",
  },
  {
    slug: "can-broker-charge-administrative-fee-nyc",
    question:
      "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
    summary:
      "No. DCWP has flagged administrative, marketing, processing, and agency fees as rebranded broker fees. The label does not change the analysis.",
    cluster: "FARE Act",
  },
  {
    slug: "fare-act-broker-fee-refund",
    question: "Can I get my NYC broker fee refunded under the FARE Act?",
    summary:
      "Yes, in most landlord-engaged-broker cases. DCWP routes refunds in 30–60 days; Small Claims is the backup path.",
    cluster: "FARE Act",
  },
  {
    slug: "does-fare-act-apply-to-jersey-city-hoboken",
    question: "Does the FARE Act apply to Jersey City and Hoboken?",
    summary:
      "No. The FARE Act is NYC-only. NJ broker-fee practices are different, and most large NJ complexes are direct-leased / no-fee anyway.",
    cluster: "FARE Act",
  },
  {
    slug: "can-landlord-raise-rent-after-fare-act",
    question: "Can my NYC landlord raise the rent to cover the broker fee?",
    summary:
      "Free-market: market sets the price (estimated 1–2% pass-through). Rent-stabilized: no — the RGB cap governs regardless.",
    cluster: "Cross-topic",
  },
  {
    slug: "is-my-nyc-apartment-rent-stabilized",
    question: "How do I find out if my NYC apartment is rent-stabilized?",
    summary:
      "Pre-1974 building, 6+ units, no permanent deregulation event. Newer buildings on 421-a / J-51 are also covered. Confirm via DHCR.",
    cluster: "Rent stabilization",
  },
  {
    slug: "how-much-can-rent-stabilized-rent-go-up-2026",
    question: "How much can NYC rent-stabilized rent go up in 2026?",
    summary:
      "RGB authorized 2.75% on 1-year renewals and 5.25% on 2-year renewals for the Oct 2025 – Sep 2026 cycle.",
    cluster: "Rent stabilization",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "NYC Renter Answers",
  url: URL,
  description:
    "Question-by-question answers to the most-asked NYC renter questions, cross-linked to the tools that confirm them.",
  hasPart: ANSWERS.map((a) => ({
    "@type": "Question",
    url: `${baseUrl}/answers/${a.slug}`,
    name: a.question,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
    { "@type": "ListItem", position: 2, name: "Answers", item: URL },
  ],
};

const CLUSTERS: Array<{
  title: string;
  blurb: string;
  filter: (a: (typeof ANSWERS)[number]) => boolean;
}> = [
  {
    title: "FARE Act (NYC broker fee ban, June 2025)",
    blurb:
      "Five questions covering who pays, what counts as a violation, refunds, and which jurisdictions are covered.",
    filter: (a) => a.cluster === "FARE Act",
  },
  {
    title: "Rent stabilization & RGB renewals",
    blurb:
      "Whether your unit is stabilized, and the lawful 2025–2026 renewal increase.",
    filter: (a) => a.cluster === "Rent stabilization",
  },
  {
    title: "Cross-topic: rent + broker fees",
    blurb:
      "Where the FARE Act and rent regulation rules intersect.",
    filter: (a) => a.cluster === "Cross-topic",
  },
];

export default function AnswersIndexPage() {
  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:py-14">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">NYC renter answers</Badge>
            <Badge className="bg-emerald-600">2026 edition</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Concise answers to the questions NYC renters actually ask
          </h1>
          <p className="text-base text-muted-foreground">
            Each answer cross-links to a free tool that runs your specific
            facts — FARE Act violation classifier, rent stabilization checker,
            RGB renewal calculator. Reviewed April 2026.
          </p>
        </header>

        {CLUSTERS.map((cluster) => {
          const items = ANSWERS.filter(cluster.filter);
          if (items.length === 0) return null;
          return (
            <Card key={cluster.title}>
              <CardHeader>
                <CardTitle>{cluster.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{cluster.blurb}</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {items.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/answers/${a.slug}`}
                    className="flex items-start gap-3 rounded-md border border-transparent px-3 py-3 hover:border-muted hover:bg-muted/40"
                  >
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="flex-1">
                      <span className="block font-medium underline-offset-2 hover:underline">
                        {a.question}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {a.summary}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle>Free tools that go with these answers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-violation-reporter">
                FARE Act Violation Reporter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-broker-fee-checker">
                FARE Act savings checker
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/rent-stabilization-checker">
                Rent Stabilization Checker
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/rgb-renewal-calculator">
                RGB Renewal Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/move-in-cost-estimator">
                Move-in cost estimator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools">
                All NYC renter tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Reviewed 2026-04-30. Informational only — not legal advice. For
          contested or high-dollar disputes, contact{" "}
          <a
            href="https://legalaidnyc.org/get-help/housing-problems/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Legal Aid Society NYC
          </a>{" "}
          or a tenant-rights attorney.
        </p>
      </main>
    </div>
  );
}
