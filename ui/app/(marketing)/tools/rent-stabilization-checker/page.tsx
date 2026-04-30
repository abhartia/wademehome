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
import { RentStabilizationChecker } from "@/components/rent-stab/RentStabilizationChecker";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/rent-stabilization-checker`;

export const metadata: Metadata = {
  title:
    "NYC Rent Stabilization Checker (2026): Is My Apartment Rent Stabilized? | Wade Me Home",
  description:
    "Free NYC rent stabilization eligibility checker. Enter your building's year built, unit count, tax abatement and current rent — get an instant verdict, 2025–2026 RGB max-renewal math, and exact next steps to confirm with DHCR.",
  keywords: [
    "rent stabilization checker",
    "rent stabilization NYC checker",
    "is my apartment rent stabilized",
    "is my apartment stabilized NYC",
    "NYC rent stabilization eligibility",
    "rent stabilized eligibility NYC",
    "is my building rent stabilized",
    "rent stabilization tool",
    "stabilized apartment NYC tool",
    "RGB calculator NYC",
    "RGB renewal calculator",
    "NYC rent renewal calculator",
    "421a stabilized check",
    "j51 stabilized check",
    "DHCR rent history",
    "NYC rent overcharge",
    "NYC rent stabilization 2026",
    "rent stabilization 2025 2026 RGB",
    "rent stabilization rights",
  ],
  openGraph: {
    title:
      "NYC Rent Stabilization Checker (2026): Is My Apartment Stabilized?",
    description:
      "Free NYC rent stabilization eligibility checker. Year built, unit count, tax abatement, current rent → instant verdict + 2025–2026 RGB renewal math + DHCR next steps.",
    url: TOOL_URL,
    type: "website",
  },
  alternates: { canonical: TOOL_URL },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC Rent Stabilization Checker",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "Free interactive checker that determines whether your NYC apartment is likely rent stabilized based on year built, unit count, tax abatements, and lease rider — with 2025–2026 RGB renewal math.",
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
        name: "How does the rent stabilization checker work?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The checker applies the actual NYC stabilization rules: 6+ unit threshold, year-built test (1947–1973 default-stabilized window vs. post-1974 abatement-only), 421-a / J-51 / 421-g tax-abatement coverage, and lease-rider presence. It returns one of five verdicts (Almost certainly stabilized, Likely stabilized, Possibly stabilized, Likely market-rate, Outside scope) plus reasons and exact next steps.",
        },
      },
      {
        "@type": "Question",
        name: "Is the checker accurate?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It is accurate for the standard cases that cover ~95% of NYC stabilized stock. Edge cases — Mitchell-Lama, Article XI, Article XIV, expired-but-protected 421-a, condo conversions with grandfathered stabilized tenants — require a DHCR rent history to resolve definitively. The checker recommends ordering a free DHCR rent history in those cases.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 2025–2026 RGB rates?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "For lease renewals starting between October 1, 2025 and September 30, 2026, the NYC Rent Guidelines Board approved 3.0% for one-year renewals and 4.5% for two-year renewals. The checker calculates the maximum legal renewal at both rates given your current rent.",
        },
      },
      {
        "@type": "Question",
        name: "Does the checker store my data?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. All calculation runs in your browser. No data is sent to a server, stored, or transmitted. You can refresh the page and your inputs are gone.",
        },
      },
      {
        "@type": "Question",
        name: "What if my building was built before 1947?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Pre-1947 buildings with 6+ units that have been continuously rented since 1971 are typically rent stabilized — and a small subset (occupied since before July 1, 1971 by the same tenant) may be rent-controlled, the older and stricter regulation. The checker flags pre-1947 buildings as 'Likely stabilized' and recommends a DHCR rent history as the definitive test.",
        },
      },
      {
        "@type": "Question",
        name: "How do I order a free DHCR rent history?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Go to hcr.ny.gov/dhcr or call 718-739-6400. You'll need your building address, apartment number, and a valid email. The history arrives in 4–8 weeks. It is free and definitive — every registered rent for your unit going back to 1984.",
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
        name: "Rent Stabilization Checker",
        item: TOOL_URL,
      },
    ],
  },
];

const FAQ_DISPLAY = [
  {
    q: "What buildings are rent stabilized in NYC?",
    a: "Two main categories. (1) Buildings with six or more units built between February 1, 1947 and January 1, 1974 — the default-stabilized era. (2) Newer buildings receiving 421-a, J-51, or 421-g tax abatements — stabilized for the duration of the abatement (typically 25–35 years). Pre-1947 buildings with 6+ units may also be stabilized. Condos, co-ops, and 1–5 unit buildings are not.",
  },
  {
    q: "How accurate is this stabilization checker?",
    a: "It applies the standard NYC stabilization rules and covers ~95% of cases. Edge cases (Mitchell-Lama, Article XI, expired 421-a, condo grandfathering) require a DHCR rent history to resolve. The checker recommends ordering one when relevant.",
  },
  {
    q: "Does the checker work for buildings outside NYC?",
    a: "No. NYC rent stabilization is governed by the Emergency Tenant Protection Act of 1974 and applies inside the five boroughs only. Westchester, Long Island, and upstate use different (much narrower) ETPA rules. New Jersey has its own city-by-city rent control rules — Hoboken, Jersey City, Newark, and others have local ordinances.",
  },
  {
    q: "What's the 2025–2026 RGB increase?",
    a: "3.0% for 1-year lease renewals and 4.5% for 2-year renewals starting between October 1, 2025 and September 30, 2026. The 2026–2027 rates will be voted in late June 2026.",
  },
  {
    q: "Does the checker store my data?",
    a: "No. Everything runs in your browser. Inputs are not sent to a server.",
  },
];

export default function RentStabilizationCheckerPage() {
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
            <Badge className="bg-emerald-600">2025–2026 RGB rates</Badge>
            <Badge variant="outline">No login</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            NYC Rent Stabilization Checker
          </h1>
          <p className="text-base text-muted-foreground">
            Is your NYC apartment rent stabilized? Enter what you know about
            your building — year built, unit count, tax abatements, current
            rent — and get an instant eligibility verdict, the 2025–2026 max
            legal renewal calculation, and exact next steps to confirm with
            DHCR. No login, no data stored, runs entirely in your browser.
          </p>
        </header>

        <RentStabilizationChecker />

        <Card>
          <CardHeader>
            <CardTitle>How the checker decides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              The checker applies the standard NYC stabilization rules in
              order of strength:
            </p>
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                <strong>Building type filter.</strong> Condos, co-ops, and 1–2
                family homes are not covered by stabilization (with narrow
                exceptions for grandfathered stabilized tenants in
                converted-condo units).
              </li>
              <li>
                <strong>6-unit threshold.</strong> Buildings with fewer than 6
                units are not stabilized regardless of year built.
              </li>
              <li>
                <strong>Active tax abatement.</strong> 421-a, J-51, or 421-g
                buildings are stabilized for the duration of the abatement.
                This overrides the year-built test.
              </li>
              <li>
                <strong>Year-built test.</strong> 1947–1973 buildings with 6+
                units default to stabilized. Pre-1947 buildings with continuous
                rental history since 1971 typically qualify. Post-1974 stock is
                generally market-rate unless an active abatement applies.
              </li>
              <li>
                <strong>Lease rider check.</strong> The presence of a rent
                stabilization rider on your lease is the strongest individual
                signal — landlords are required by law to attach it on every
                stabilized lease.
              </li>
            </ol>
            <p>
              The checker does not implement edge cases (Mitchell-Lama, Article
              XI, Article XIV co-op buyouts, certain expired-but-protected
              421-a buildings). For those, the right move is to order a free
              DHCR rent history — it is the definitive answer.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2025–2026 RGB renewal math</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              For stabilized lease renewals starting between October 1, 2025
              and September 30, 2026, the maximum increases voted by the Rent
              Guidelines Board are:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>1-year renewal:</strong> 3.0% increase
              </li>
              <li>
                <strong>2-year renewal:</strong> 4.5% increase
              </li>
            </ul>
            <p>
              These rates do not include Individual Apartment Improvement
              (IAI) surcharges, Major Capital Improvement (MCI) increases, or
              fuel cost adjustments — those can add modest amounts on top in
              specific buildings.
            </p>
            <p>
              For 2026–2027 (leases starting October 1, 2026), the
              preliminary RGB vote happens in early May 2026 and the final
              vote in mid-to-late June. Staff projections currently point at
              roughly 2.75%–4.5% (1-year) and 4.5%–6.0% (2-year). See the{" "}
              <Link
                href="/blog/nyc-rent-stabilization-guide#nyc-annual-rent-increase-history"
                className="text-primary underline"
              >
                full 2015–2026 RGB history
              </Link>{" "}
              for context.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>If your apartment is stabilized: what to do next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-6">
              <li>
                <strong>Order a free DHCR rent history</strong> at{" "}
                <a
                  href="https://hcr.ny.gov/dhcr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  hcr.ny.gov/dhcr
                </a>
                . This is the definitive document showing every registered
                rent for your unit going back to 1984.
              </li>
              <li>
                <strong>Cross-check current rent against the legal regulated
                rent.</strong> Add up the cumulative RGB increases from the
                last registered base rent. Anything above that is a potential
                overcharge.
              </li>
              <li>
                <strong>Request the stabilization rider on every lease.</strong>{" "}
                Landlords are legally required to attach it. If they refuse,
                file a complaint with DHCR.
              </li>
              <li>
                <strong>Know your renewal rights.</strong> Landlords must offer
                a renewal 90–150 days before lease expiration. You have 60 days
                to accept.
              </li>
              <li>
                <strong>If overcharged, file with DHCR.</strong> Overcharge
                claims have a 4-year lookback (6 years in some cases). Refunds
                include interest. The median order through Q1 2026 was ~$8,400.
              </li>
            </ol>
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
              <Link href="/blog/nyc-rent-stabilization-guide">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  NYC rent stabilization guide
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/blog/nyc-fare-act-broker-fee-ban">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act broker fee ban
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/fare-act-broker-fee-checker">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  FARE Act broker fee checker
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/net-effective-rent-calculator">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Net effective rent calculator
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/nyc-rent-by-neighborhood">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  NYC rent by neighborhood
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
          definitive verification, order a free DHCR rent history at{" "}
          <a
            href="https://hcr.ny.gov/dhcr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            hcr.ny.gov/dhcr
          </a>
          . Reviewed 2026-04-28.
        </p>
      </main>
    </div>
  );
}
