import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, FileText, Train } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { PathCommuteRoiCalculator } from "@/components/widgets/PathCommuteRoiCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/path-commute-roi-calculator`;
const EMBED_URL = `${baseUrl}/tools/path-commute-roi-calculator/embed`;

export const metadata: Metadata = {
  title: "PATH Commute ROI Calculator: Is JC or Hoboken Worth the Commute? (2026)",
  description:
    "Free PATH commute calculator. Compare NJ rent savings vs. annualized commute time priced at $/hour. Hoboken, Newport, Exchange Place, JSQ, Harrison → WTC, 14th, 33rd.",
  keywords: [
    "PATH commute calculator",
    "Jersey City vs Manhattan rent",
    "Hoboken vs Manhattan rent",
    "is Jersey City worth the commute",
    "is Hoboken worth the commute",
    "PATH train commute time",
    "Hoboken to 33rd Street time",
    "Newport to WTC PATH",
    "Journal Square PATH commute",
    "PATH SmartLink monthly cost",
    "NJ vs NYC rent calculator",
    "value of time commute calculator",
    "NJ commute cost calculator",
    "PATH train calculator",
    "WTC PATH commute",
    "Jersey City rent savings",
    "Hoboken rent savings",
  ],
  openGraph: {
    title: "PATH Commute ROI Calculator — Wade Me Home",
    description:
      "Compare NJ rent savings vs. commute time priced at $/hour. PATH stations, walks, transfers, SmartLink — all factored in.",
    url: TOOL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PATH Commute ROI Calculator",
    description:
      "Free tool: is JC or Hoboken worth the commute vs. Manhattan? Real PATH ride times, real $/hour math.",
  },
  alternates: { canonical: TOOL_URL },
};

const FAQ = [
  {
    q: "How long is the PATH commute from Hoboken to Manhattan?",
    a: "Off-peak weekday: Hoboken to Christopher St ~7 min, to 14th St ~11 min, to 23rd St ~13 min, to 33rd St (Herald Sq) ~15 min, to WTC ~11 min on the peak HOB-WTC line (off-peak requires a transfer at Newport). Add ~5 min average wait between trains and your walks on each end. A typical Hoboken commuter doing Hoboken Terminal → 33rd St with an 8-min walk to the station and a 5-min walk to the office sees a ~33-min one-way door-to-door commute.",
  },
  {
    q: "How long is the PATH commute from Jersey City Newport (Pavonia) to Manhattan?",
    a: "Off-peak weekday: Newport to Christopher St ~5 min, to 14th St ~9 min, to 33rd St (Herald Sq) ~13 min, to WTC ~8 min on the peak HOB-WTC line. Newport is the fastest Hudson-side JC neighborhood for both 33rd and WTC because the JSQ-33S line runs direct off-peak and HOB-WTC stops there at peak. Door-to-door, plan ~28 min Newport → 33rd or ~22 min Newport → WTC with normal walks.",
  },
  {
    q: "How long is the PATH commute from Journal Square to Manhattan?",
    a: "Off-peak weekday: Journal Square to WTC ~11 min on the NWK-WTC line direct, to 33rd St ~21 min on the JSQ-33S line direct. JSQ is the fastest WTC-direction PATH origin from Jersey City interior because all NWK-WTC trains stop there. A typical JSQ commuter doing JSQ → 33rd with normal walks sees ~38 min door-to-door.",
  },
  {
    q: "How do I price the value of my commute time?",
    a: "Rule of thumb for working-age renters in NYC: divide your annual gross salary by 2,000 (work hours per year) to get an hourly equivalent. $100K salary ≈ $50/hour; $150K ≈ $75/hour; $200K ≈ $100/hour. Some economists use 50% of that (people don't fully value commute time the way they value paid work) but the calculator above uses the full figure as the conservative upper bound — if the move pencils out at the full hourly rate, it definitely pencils out at half.",
  },
  {
    q: "Does the PATH SmartLink monthly pass save money vs. pay-per-ride?",
    a: "$106/month (2025 rate) breaks even at ~37 rides/month. Most 5-day-a-week commuters hit ~44 rides/month, so SmartLink is the right call. The calculator above includes SmartLink as a default annual cost. If you only commute hybrid (2-3 days/week), pay-per-ride at $3.00 may be cheaper — the calculator lets you toggle SmartLink off.",
  },
  {
    q: "Is Jersey City cheaper than Manhattan for an equivalent apartment?",
    a: "Generally yes — JC waterfront luxury (Newport, Exchange Place) trades at roughly 75-85% of Hudson Yards / FiDi rent for similar amenities and finish. JC interior (JSQ, Bergen-Lafayette) trades at ~60-70%. Hoboken brownstone walkups trade at ~85-90% of West Village walkups. Whether that 15-40% rent savings is worth the commute is exactly what this calculator answers — commute time has to be priced at $/hour to compare apples-to-apples.",
  },
  {
    q: "Does the FARE Act apply to Jersey City and Hoboken?",
    a: "No — the FARE Act is a New York City Local Law (NYC Admin Code 20-699.21) and applies only inside the five boroughs. Jersey City, Hoboken, and Harrison are governed by New Jersey state law. Most JC/Hoboken luxury complexes are direct-leased (no broker, no fee) anyway because institutional landlords prefer in-house leasing teams. Older walkup stock in either city may still charge tenant-side broker fees. NJ's pending A-2978 (Renters Fees Transparency Act) would change this but has not passed as of mid-2026.",
  },
  {
    q: "How accurate are the PATH ride times in this calculator?",
    a: "Off-peak weekday baselines from PANYNJ published schedules (panynj.gov/path). Peak service can be 1-2 min faster on direct routes (more frequent trains = less wait) but slightly worse on transfer routes due to longer transfer waits. The calculator adds 5 min average wait between trains and 5 min for transfers when required. Early-morning and late-night PATH service has wider headways — actual late-night commutes can be 10-15 min longer than the calculator shows.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": TOOL_URL,
    name: "PATH Commute ROI Calculator",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free PATH commute ROI calculator — compares Jersey City / Hoboken / Newark rent savings vs. extra commute time priced at $/hour, with PATH ride times, walk times, transfer time, and SmartLink monthly factored in.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@type": "Organization", name: "Wade Me Home", url: baseUrl },
    isAccessibleForFree: true,
    audience: {
      "@type": "Audience",
      name: "NYC and NJ renters considering a Hudson-side move",
    },
    featureList: [
      "Six PATH origins: Hoboken, Newport, Exchange Place, Grove St, Journal Square, Harrison",
      "Six PATH destinations: WTC, Christopher St, 9th St, 14th St, 23rd St, 33rd St",
      "Door-to-door commute timing including walk + wait + ride + transfer + walk",
      "Annual rent-savings vs. annualized commute cost at user-specified $/hour",
      "Break-even hourly value of time",
      "Optional PATH SmartLink monthly fold-in ($106/mo, 2025 rate)",
    ],
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
        name: "PATH Commute ROI Calculator",
        item: TOOL_URL,
      },
    ],
  },
];

const EMBED_SNIPPET = `<iframe
  src="${EMBED_URL}"
  title="PATH Commute ROI Calculator"
  style="width:100%; min-height:1400px; border:0;"
  loading="lazy"
></iframe>
<p><a href="${TOOL_URL}">PATH Commute ROI Calculator</a> by Wade Me Home.</p>`;

export default function PathCommuteRoiCalculatorPage() {
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
            / <span>PATH commute ROI calculator</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">PANYNJ schedules</Badge>
            <Badge variant="outline">JC + Hoboken + Newark</Badge>
            <Badge variant="outline">Updated May 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            PATH Commute ROI Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Is Jersey City or Hoboken really cheaper than Manhattan once you price your commute?
            Free tool that puts six PATH origins, six Manhattan destinations, real door-to-door
            timing, and annualized $/hour value of time into one apples-to-apples ROI number.
          </p>
        </header>

        <section aria-label="Calculator">
          <PathCommuteRoiCalculator />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">
              Why most JC vs. NYC rent calculators are wrong
            </h2>
          </div>
          <Card>
            <CardContent className="space-y-3 p-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                The standard pitch — &ldquo;JC is 20% cheaper than Manhattan&rdquo; — quietly
                ignores commute time. A 25-minute one-way commute differential, five days a week,
                fifty work weeks a year, is{" "}
                <strong className="text-foreground">208 hours / year</strong>. At $50/hour
                (the rate for a $100K salary) that&apos;s{" "}
                <strong className="text-foreground">$10,400 / year</strong> — eating into the rent
                savings on a typical 1BR comparison.
              </p>
              <p>
                The calculator above does the math both ways. If your real Manhattan alternative is
                a Hudson Yards 1BR at $4,500 and your JC equivalent is at $3,200, that&apos;s
                $15,600/year saved on rent. Subtract the $1,272 PATH SmartLink and the $10,400
                commute cost and net ROI is $3,928 — positive but tighter than the headline
                suggests. Most PATH commute estimates omit either the SmartLink or the value-of-
                time math; this one includes both, plus walk time and transfer time.
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
            Free for NJ relocation bloggers, real estate agents, tenant orgs, financial-planning
            sites, and PATH commuter forums.
          </p>
          <Card>
            <CardContent className="p-0">
              <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed">
                <code>{EMBED_SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
          <Button asChild variant="outline">
            <Link href="/tools/path-commute-roi-calculator/embed" target="_blank">
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
                  <h3 className="text-base font-medium">Net effective rent calculator</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comparing two listings with different free-month concessions? Get the real
                  apples-to-apples monthly.
                </p>
                <Link
                  href="/tools/net-effective-rent-calculator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open the calculator <ArrowRight className="h-3.5 w-3.5" />
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
                  Salary in, max rent out — the 40× rule and 33%-of-take-home with full NYC tax
                  math.
                </p>
                <Link
                  href="/tools/nyc-affordability-calculator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Check affordability <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">Move-in cost estimator</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  First + last + security + movers + setup. JC and Hoboken landlords often demand
                  first + last + security legally — NYC can&apos;t.
                </p>
                <Link
                  href="/tools/move-in-cost-estimator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Estimate move-in cost <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">
                    Does the FARE Act apply to JC and Hoboken?
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quick answer on the NJ-side broker fee question — and what NJ&apos;s pending
                  A-2978 could change.
                </p>
                <Link
                  href="/answers/does-fare-act-apply-to-jersey-city-hoboken"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read the answer <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">Jersey City rent guide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Newport, Downtown, Journal Square, and the rest — current 2026 rents and
                  neighborhood comparison.
                </p>
                <Link
                  href="/jersey-city"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See JC rentals <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">Hoboken rent guide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Brownstone walkups, Maxwell Place, Hudson Tea — what 2026 1BRs and 2BRs cost.
                </p>
                <Link
                  href="/hoboken"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See Hoboken rentals <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        <footer className="text-xs text-muted-foreground">
          Educational use only — PATH ride times are off-peak weekday baselines from PANYNJ. Always
          verify with{" "}
          <a
            href="https://www.panynj.gov/path/en/index.html"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2"
          >
            PANYNJ
          </a>{" "}
          and check current SmartLink pricing before signing a lease. This calculator does not
          include NJ Transit, NY Waterway ferry, or commuter buses.
        </footer>
      </main>
    </div>
  );
}
