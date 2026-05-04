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
  title: "NYC Renter Answers — FARE Act, Rent Stabilization, Lease Law (2026)",
  description:
    "Concise, sourced answers to 25 questions NYC renters actually ask: FARE Act broker-fee rules, HSTPA deposit caps, rent-stabilization (421-a, J-51, vacancy decontrol), RGB renewal caps, DHCR rent history, sublet rights, eviction timelines, heat / hot water complaints, bedbug disclosure, and pet-fee legality.",
  keywords: [
    "NYC renter questions",
    "FARE Act questions",
    "NYC broker fee questions",
    "rent stabilization NYC questions",
    "NYC renter answers",
    "tenant rights NYC FAQ",
    "HSTPA NYC FAQ",
    "NYC lease law questions",
    "DHCR rent history NYC",
    "NYC moving cost questions",
    "NYC sublet rules",
    "NYC eviction timeline",
    "NYC heat hot water rules",
    "NYC bedbug disclosure",
    "NYC pet fee legal",
    "421-a rent stabilization",
    "J-51 rent stabilization",
  ],
  openGraph: {
    title:
      "NYC renter answers — FARE Act, rent stabilization, lease law (2026)",
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
    slug: "what-is-no-fee-apartment-nyc",
    question: "What is a no-fee apartment in NYC?",
    summary:
      "A NYC rental where the tenant pays no broker fee. After the FARE Act took effect June 11, 2025, this is the default for most landlord-listed units.",
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
    slug: "how-much-was-typical-nyc-broker-fee-before-fare-act",
    question:
      "How much was the typical NYC broker fee before the FARE Act?",
    summary:
      "8.33% (one month's rent) to 15% of annual rent. On a $4,000/month 1BR, that was $4,000–$7,200. The FARE Act zeroed it out for tenants in 2025.",
    cluster: "FARE Act",
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
  {
    slug: "dhcr-rent-history-request-nyc",
    question:
      "How do I request a NYC apartment's rent history from DHCR?",
    summary:
      "Free request to NY HCR via the online portal (2–6 weeks) or paper form RA-90 (6–10 weeks). Required evidence for any rent-overcharge case.",
    cluster: "Rent stabilization",
  },
  {
    slug: "first-last-security-deposit-legal-nyc",
    question: "Is asking for first, last, and security legal in NYC?",
    summary:
      "No. The 2019 HSTPA caps move-in deposits at one month's rent. First + last + security adds an unlawful third month.",
    cluster: "Tenant rights",
  },
  {
    slug: "nyc-application-fee-cap",
    question:
      "What's the maximum application or credit-check fee a NYC landlord can charge?",
    summary:
      "$20 per applicant, total — covers background and credit checks combined (RPL § 238-a). The cap is statewide.",
    cluster: "Tenant rights",
  },
  {
    slug: "break-lease-renovation-nyc",
    question: "Can my NYC landlord break my lease for renovations?",
    summary:
      "No. A signed NYC lease binds the landlord too. Buyouts are negotiated, not imposed. Rent-stabilized tenants have stronger protections.",
    cluster: "Tenant rights",
  },
  {
    slug: "free-market-rent-increase-renewal-nyc",
    question:
      "How much can a NYC landlord raise my rent at renewal if I'm not rent-stabilized?",
    summary:
      "No statutory cap — but HSTPA § 226-c requires 30/60/90-day written notice for any increase over 5%, scaled to tenancy length.",
    cluster: "Tenant rights",
  },
  {
    slug: "can-landlord-raise-rent-after-fare-act",
    question: "Can my NYC landlord raise the rent to cover the broker fee?",
    summary:
      "Free-market: market sets the price (estimated 1–2% pass-through). Rent-stabilized: no — the RGB cap governs regardless.",
    cluster: "Cross-topic",
  },
  {
    slug: "gross-vs-net-effective-rent",
    question:
      "What's the difference between gross rent and net effective rent?",
    summary:
      "Gross is the monthly check. Net effective spreads concessions across the lease term — the only honest way to compare two NYC listings.",
    cluster: "Cross-topic",
  },
  {
    slug: "nyc-moving-cost-2026",
    question: "How much does it cost to move to NYC in 2026?",
    summary:
      "$4,500–$15,500 typical for a 1BR. First + security + movers + COI + utilities. Broker fee is usually $0 thanks to the FARE Act.",
    cluster: "Cross-topic",
  },
  // Third /answers/ batch (S13, 2026-05-03).
  {
    slug: "rent-stabilization-vacancy-decontrol-nyc",
    question: "Did HSTPA end vacancy decontrol in NYC?",
    summary:
      "Yes. The 2019 HSTPA permanently ended high-rent vacancy decontrol, the 20% vacancy bonus, and high-income deregulation. Once stabilized, units stay stabilized.",
    cluster: "Rent stabilization",
  },
  {
    slug: "421a-rent-stabilization-coverage-nyc",
    question: "Are 421-a apartments rent-stabilized in NYC?",
    summary:
      "Yes — for the duration of the abatement (10–35 years). Whether they convert to free-market after depends on construction year and program version.",
    cluster: "Rent stabilization",
  },
  {
    slug: "j-51-tax-abatement-rent-stabilization",
    question:
      "Does a J-51 tax abatement make my NYC apartment rent-stabilized?",
    summary:
      "Yes — for as long as the J-51 benefit runs. Roberts v. Tishman Speyer (2009) closed the deregulation loophole permanently.",
    cluster: "Rent stabilization",
  },
  {
    slug: "nyc-sublet-rules-lease-assignment",
    question: "Can I sublet my NYC apartment?",
    summary:
      "Yes — RPL § 226-b gives tenants in 4+ unit buildings a non-waivable right to sublet. Landlord consent is required but cannot be unreasonably withheld.",
    cluster: "Tenant rights",
  },
  {
    slug: "nyc-eviction-notice-timeline",
    question: "How long does NYC eviction take?",
    summary:
      "4–18+ months from first late rent to physical eviction. 14-day rent demand → court → judgment → 14-day marshal notice. Self-help eviction is illegal.",
    cluster: "Tenant rights",
  },
  {
    slug: "nyc-heat-hot-water-complaint",
    question:
      "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
    summary:
      "Heat Season Oct 1–May 31. 68°F day / 62°F night when outside is below 55°F. Hot water 120°F year-round. File via 311 — HPD inspectors respond.",
    cluster: "Tenant rights",
  },
  {
    slug: "nyc-bedbug-disclosure-law",
    question: "What does NYC's bedbug-disclosure law require?",
    summary:
      "Every NYC landlord must give a Bedbug Disclosure Form at every lease and renewal showing the unit and building's prior-year infestation history.",
    cluster: "Tenant rights",
  },
  {
    slug: "nyc-pet-fee-legality",
    question: "Are pet fees and pet deposits legal in NYC?",
    summary:
      "Non-refundable pet fees: no (HSTPA caps total deposits at one month). Pet rent on stabilized units: illegal. ESAs and service animals: never chargeable.",
    cluster: "Tenant rights",
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
      "Seven questions covering who pays, what counts as a violation, refunds, jurisdictional limits, and how the pre-FARE fee structure compares.",
    filter: (a) => a.cluster === "FARE Act",
  },
  {
    title: "Rent stabilization & RGB renewals",
    blurb:
      "Whether your unit is stabilized (including 421-a and J-51 tax-abated buildings), the lawful 2025–2026 renewal cap, what HSTPA's end of vacancy decontrol means today, and how to pull the DHCR rent history that proves it.",
    filter: (a) => a.cluster === "Rent stabilization",
  },
  {
    title: "NYC tenant rights & lease law",
    blurb:
      "HSTPA deposit caps, the $20 application-fee cap, sublet and assignment rights under RPL § 226-b, the eviction timeline, heat/hot-water complaint rules, bedbug disclosure, and pet-fee legality.",
    filter: (a) => a.cluster === "Tenant rights",
  },
  {
    title: "Rent math & cross-topic",
    blurb:
      "Where the FARE Act, rent regulation, and rent math intersect — including net-effective rent and full move-in cost.",
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
            <Badge variant="outline">25 questions answered</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Concise answers to the questions NYC renters actually ask
          </h1>
          <p className="text-base text-muted-foreground">
            Each answer cross-links to a free tool that runs your specific
            facts — FARE Act violation classifier, rent stabilization checker,
            RGB renewal calculator, move-in cost estimator, PATH commute ROI.
            Updated May 3, 2026.
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
                FARE Act Savings Checker
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
                Move-in Cost Estimator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/net-effective-rent-calculator">
                Net-Effective Rent Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/path-commute-roi-calculator">
                PATH Commute ROI Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/nyc-broker-fee-law-timeline">
                NYC Broker Fee Law Timeline
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
          Reviewed 2026-05-03. Informational only — not legal advice. For
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
