import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { MoveInCostEstimator } from "@/components/widgets/MoveInCostEstimator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/move-in-cost-estimator`;
const EMBED_URL = `${baseUrl}/tools/move-in-cost-estimator/embed`;

export const metadata: Metadata = {
  title: "NYC Move-In Cost Estimator (2026): What You Pay at Lease Signing",
  description:
    "Free NYC move-in cost calculator. First month + security deposit + movers + utilities + FARE Act-aware broker fee, with monthly amortization.",
  keywords: [
    "NYC move in cost",
    "NYC move in calculator",
    "NYC apartment move in fees",
    "first month last month security NYC",
    "NYC apartment cash up front",
    "moving to NYC cost",
    "NYC rental application costs",
    "NYC security deposit",
    "FARE Act move in",
    "NYC apartment cost calculator",
  ],
  openGraph: {
    title: "NYC Move-In Cost Estimator",
    description:
      "How much cash do you actually need at NYC lease signing? Free tool, FARE Act-aware.",
    url: TOOL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Move-In Cost Estimator",
    description:
      "Free tool: total cash at NYC lease signing, with FARE Act-aware broker fee defaults.",
  },
  alternates: { canonical: TOOL_URL },
};

const FAQ = [
  {
    q: "How much do I actually need to move into a NYC apartment?",
    a: "On a $3,500/mo NYC apartment in 2026, plan for roughly $5,200-7,500 cash at signing: first month's rent ($3,500) + 1-month security deposit ($3,500) + movers ($800-1,500) + utility setup ($150-400) + renter's insurance ($150-250). Broker fees are now usually $0 in NYC under the FARE Act unless you hired a tenant-side broker yourself. The estimator above lets you tune all six line items to your situation.",
  },
  {
    q: "How much can a NYC landlord legally charge as a security deposit?",
    a: "NYC landlords can charge a maximum of one month's rent as a security deposit under the 2019 Housing Stability and Tenant Protection Act (HSTPA). This applies to all market-rate, rent-stabilized, and most other unregulated rentals. Out-of-NYC landlords (NJ, Westchester, etc.) are typically governed by state law that allows up to two months. Coops and condos are exempt from the HSTPA cap.",
  },
  {
    q: "Can a NYC landlord require last month's rent up front?",
    a: "Generally no — under HSTPA the total of any security deposit + last month's rent demanded up front cannot exceed one month. So if a NYC landlord asks for first + last + security on a market-rate rental, they're charging an illegal deposit. Out-of-NYC the rule is different: NJ allows 1.5x months, Westchester landlords often demand first + last + 1-month security.",
  },
  {
    q: "Are broker fees included in move-in cost?",
    a: "If you found the listing on StreetEasy, Zillow, or any public listing site in NYC, the FARE Act (eff. June 15, 2025) means your broker fee is $0 — the landlord pays. If you hired a tenant-side broker yourself with a written agency agreement, you pay 0.5-1.5 months of rent as fee. This estimator defaults to $0 for the FARE Act case and warns you if your inputs look wrong.",
  },
  {
    q: "How much do NYC movers cost?",
    a: "Studio or 1BR within Manhattan or Brooklyn: $600-1,200 for licensed movers, $300-600 for piecework / rental truck. 2BR with elevator building: $1,200-2,000. Walk-up surcharge: $50-150 per flight. Manhattan-to-Brooklyn or Manhattan-to-Queens: add $200-400 for distance. Get binding written estimates and confirm USDOT licensing — unlicensed movers and brokers cause most NYC moving disputes.",
  },
  {
    q: "What utility setup costs should I budget for in NYC?",
    a: "Con Edison electric: usually no deposit if you have credit history; $200-400 deposit if not. National Grid gas (Brooklyn / Queens): same pattern. Spectrum or Verizon Fios internet: $50-100 installation + first month $50-90. Total: typically $150-400 unless your credit makes Con Ed require a deposit, which can push it to $500-700.",
  },
  {
    q: "Is renter's insurance actually required in NYC?",
    a: "Most NYC market-rate landlords now require it as a lease term, naming the building as 'additional insured.' Cost is $150-250/year for typical $100K personal property + $300K liability coverage from Lemonade, State Farm, or Geico. Even if your landlord doesn't require it, it's worth carrying — fire, theft, and water damage from upstairs neighbors are common NYC claims.",
  },
  {
    q: "Should I add the move-in cost to my monthly rent budget?",
    a: "Yes — the amortized monthly figure this estimator outputs is the right number to budget against your salary. For a $3,500/mo apartment with $7,000 in move-in costs on a 12-month lease, the true monthly cost is $3,792/mo. If you're using the 40× rule or a 33%-of-take-home affordability rule, compare those ceilings against the amortized figure, not the gross rent.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": TOOL_URL,
    name: "NYC Move-In Cost Estimator",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free NYC move-in cost calculator — first month, security deposit, broker fee (FARE Act-aware), movers, utilities, and renter's insurance with monthly amortization.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    isAccessibleForFree: true,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Wade Me Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${baseUrl}/tools` },
      { "@type": "ListItem", position: 3, name: "Move-In Cost Estimator", item: TOOL_URL },
    ],
  },
];

const EMBED_SNIPPET = `<iframe
  src="${EMBED_URL}"
  title="NYC Move-In Cost Estimator"
  style="width:100%; min-height:1100px; border:0;"
  loading="lazy"
></iframe>
<p><a href="${TOOL_URL}">NYC Move-In Cost Estimator</a> by Wade Me Home.</p>`;

export default function MoveInCostPage() {
  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 md:py-14">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/tools" className="hover:underline">
              Tools
            </Link>{" "}
            / <span>Move-in cost estimator</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">FARE Act-aware</Badge>
            <Badge variant="outline">Updated April 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            NYC Move-In Cost Estimator
          </h1>
          <p className="text-lg text-muted-foreground">
            How much cash do you actually need at NYC lease signing? Free tool covering first
            month, security deposit, broker fee (with FARE Act defaults), movers, utility setup,
            and renter&apos;s insurance — with monthly amortization so you know your true housing
            cost.
          </p>
        </header>

        <section aria-label="Estimator">
          <MoveInCostEstimator />
        </section>

        <section className="space-y-4" id="embed">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">
              Embed this estimator on your site
            </h2>
          </div>
          <p className="text-muted-foreground">
            Free for NYC rental bloggers, moving companies, tenant orgs, and personal-finance
            content sites.
          </p>
          <Card>
            <CardContent className="p-0">
              <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed">
                <code>{EMBED_SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
          <Button asChild variant="outline">
            <Link href="/tools/move-in-cost-estimator/embed" target="_blank">
              Preview the embed
            </Link>
          </Button>
        </section>

        <section className="space-y-4" id="faq">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <Card key={q}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{q}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {a}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Related</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">FARE Act broker fee checker</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  If your move-in includes a broker fee, run it through the checker — most NYC
                  fees post-June 2025 are illegal.
                </p>
                <Link
                  href="/tools/fare-act-broker-fee-checker"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open the checker <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">NYC affordability calculator</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Salary in, max rent out — using both the 40× rule and 33%-of-take-home with full
                  NYC tax math.
                </p>
                <Link
                  href="/tools/nyc-affordability-calculator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Check affordability <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        <footer className="text-xs text-muted-foreground">
          Educational use only — costs vary by building, neighborhood, and credit. Always confirm
          fees in writing before signing a lease.
        </footer>
      </main>
    </div>
  );
}
