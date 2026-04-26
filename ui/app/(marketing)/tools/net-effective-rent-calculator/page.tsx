import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Code2, FileText } from "lucide-react";

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
import { NetEffectiveRentCalculator } from "@/components/widgets/NetEffectiveRentCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/net-effective-rent-calculator`;
const EMBED_URL = `${baseUrl}/tools/net-effective-rent-calculator/embed`;

export const metadata: Metadata = {
  title: "Net Effective Rent Calculator (NYC, 2026): Free Months, Broker Fees",
  description:
    "Free calculator for NYC concession-adjusted rent. See your true monthly cost after free months and broker fees, or compare two listings side-by-side.",
  keywords: [
    "net effective rent calculator",
    "concession adjusted rent NYC",
    "free month rent NYC",
    "net effective rent NYC",
    "rent concession calculator",
    "NYC rent comparison tool",
    "NYC apartment compare",
    "NYC rent free month math",
    "amortized broker fee",
    "net effective rent formula",
  ],
  openGraph: {
    title: "Net Effective Rent Calculator — NYC",
    description:
      "Compare two NYC listings on a real apples-to-apples basis. Factor in free months and broker fees in seconds.",
    url: TOOL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Net Effective Rent Calculator — NYC",
    description:
      "Free NYC tool for concession-adjusted rent. Stop comparing gross rents — compare what you actually pay.",
  },
  alternates: { canonical: TOOL_URL },
};

const FAQ = [
  {
    q: "What is net effective rent?",
    a: "Net effective rent is the gross monthly rent reduced by any concessions (typically free months) spread evenly across the entire lease. It's the number you should compare between listings — comparing gross asking rents alone hides the value of one or two months free, which is the most common NYC concession in 2026.",
  },
  {
    q: "How is net effective rent calculated?",
    a: "Net effective rent equals (gross monthly rent × paid months) divided by total lease months. Example: a 13-month lease at $4,000/mo gross with 1 month free = ($4,000 × 12) / 13 = $3,692/mo net effective. The savings ($308/mo) is real but only if you stay the full 13 months — if you break the lease early, the landlord typically claws the concession back.",
  },
  {
    q: "Why does my landlord quote 'net effective' instead of gross?",
    a: "Free-month concessions let landlords advertise a low net-effective rent without permanently lowering the gross rent on file. At lease renewal you renew at the gross rent, not the net — so a $3,692 net-effective tenant typically faces a +8.3% jump back to $4,000 even with no rent increase. Always confirm both numbers before signing, and budget for the gross at renewal.",
  },
  {
    q: "Should I include the broker fee in net effective rent?",
    a: "Standard real-estate convention is no — net effective tracks rent only. But for personal budgeting, amortizing one-time costs (broker fee where legal, application fee, move-in deposit) over the lease length gives you the true monthly outlay. This calculator shows both numbers separately so you can pick the comparison that matches the question you're asking.",
  },
  {
    q: "How common are free-month concessions in NYC?",
    a: "Concessions cycle with market conditions. In soft markets (winter, post-2020 lockdown, oversupplied luxury submarkets) 1-2 months free is widespread. In tight markets (peak summer, supply-constrained sub-markets like Brooklyn brownstones) concessions disappear. As of early 2026, roughly 25-35% of NYC market-rate listings carry a concession at any given time, with luxury new-construction running highest.",
  },
  {
    q: "Does the FARE Act change the broker fee math?",
    a: "Yes — for any NYC apartment listed on a public site (StreetEasy, Zillow, etc.) the landlord now pays the broker, not you. So the broker-fee field in this calculator should generally be $0 for post-June 15, 2025 NYC leases unless you separately hired a tenant-side broker. Check our free FARE Act broker fee checker if you were charged a fee anyway.",
  },
  {
    q: "Are concessions still 'real' if I stay only 12 months on a 13-month lease?",
    a: "If you fulfill the full lease term you keep the concession. If you break the lease early most NYC concession riders include a clawback — you owe the prorated value of the free month back. Always read the concession rider; if it has no clawback, the free month is yours regardless of how long you stay.",
  },
  {
    q: "Is this calculator NYC-only?",
    a: "The math works for any market that uses gross rent + free-month concessions (Boston, Chicago, DC, SF, LA all use the same convention). The FAQ context above is NYC-specific because that's where Wade Me Home operates and where concession use is most aggressive.",
  },
];

const SCENARIOS = [
  {
    label: "1 free month on a 13-month lease at $4,000/mo",
    out: "$3,692/mo net effective (-7.7% vs gross)",
  },
  {
    label: "2 free months on a 14-month lease at $5,500/mo",
    out: "$4,714/mo net effective (-14.3% vs gross)",
  },
  {
    label: "1 free month on a 12-month lease at $3,000/mo + $5,000 broker fee",
    out: "$2,750/mo net rent · $3,167/mo amortized w/ fee",
  },
  {
    label: "12-mo lease at $3,800/mo no concessions, vs 13-mo at $4,100/mo with 1 free",
    out: "Concession listing wins by $15/mo ($185/yr) on net basis",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": TOOL_URL,
    name: "Net Effective Rent Calculator",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free NYC calculator for concession-adjusted (net effective) rent and side-by-side listing comparison.",
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Net Effective Rent Calculator",
        item: TOOL_URL,
      },
    ],
  },
];

const EMBED_SNIPPET = `<iframe
  src="${EMBED_URL}"
  title="Net Effective Rent Calculator"
  style="width:100%; min-height:820px; border:0;"
  loading="lazy"
></iframe>
<p><a href="${TOOL_URL}">Net Effective Rent Calculator</a> by Wade Me Home.</p>`;

export default function NetEffectiveRentPage() {
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
            / <span>Net effective rent calculator</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">NYC-tuned</Badge>
            <Badge variant="outline">Updated April 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Net Effective Rent Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            See your true monthly cost after free months and broker fees, or compare two NYC
            listings side-by-side. Net effective rent is the only fair way to compare a listing
            with concessions against one without.
          </p>
        </header>

        <section aria-label="Calculator">
          <NetEffectiveRentCalculator />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
          <p className="text-muted-foreground">
            Quick reference for the four most common NYC concession patterns.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {SCENARIOS.map((s) => (
              <Card key={s.label}>
                <CardContent className="space-y-1.5 p-5">
                  <div className="flex items-start gap-2">
                    <Calculator
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <p className="text-sm font-medium">{s.label}</p>
                  </div>
                  <p className="pl-6 text-sm text-emerald-700">{s.out}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why net effective matters at renewal
          </h2>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed">
              <p>
                The number on your lease is the <em>gross</em> rent. Concessions are written into a
                separate rider, and they typically expire at lease renewal. So if you signed at
                $4,000 gross with 1 month free on a 13-month lease, you paid an effective $3,692
                — but at renewal the landlord renews at $4,000 (or higher). That&apos;s a 8.3% jump
                with no actual rent increase. Plan for it.
              </p>
              <p>
                If you negotiate a renewal, ask for the same concession structure to be carried
                forward. In a soft market many landlords will agree; in a tight one, you may need to
                accept the gross or move. Either way, knowing the math lets you decide.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" id="embed">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">
              Embed this calculator on your site
            </h2>
          </div>
          <p className="text-muted-foreground">
            Free for tenant orgs, NYC rental bloggers, brokers, and journalists. Paste the snippet
            below — works on any CMS.
          </p>
          <Card>
            <CardContent className="p-0">
              <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed">
                <code>{EMBED_SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/tools/net-effective-rent-calculator/embed" target="_blank">
                Preview the embed
              </Link>
            </Button>
          </div>
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
                  If your fee field is non-zero, run it through the FARE Act checker — most NYC
                  broker fees post-June 2025 are illegal.
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
                  <h3 className="text-base font-medium">Best time to rent in NYC</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Concessions cluster in November–February. Time your move and stack savings on
                  top of net-effective math.
                </p>
                <Link
                  href="/best-time-to-rent-nyc"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read the guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        <footer className="text-xs text-muted-foreground">
          Educational use only — not financial or legal advice. Always confirm the gross rent and
          any concession rider in writing before signing a lease.
        </footer>
      </main>
    </div>
  );
}
