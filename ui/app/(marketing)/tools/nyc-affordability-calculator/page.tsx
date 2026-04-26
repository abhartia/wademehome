import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { NycAffordabilityCalculator } from "@/components/widgets/NycAffordabilityCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/nyc-affordability-calculator`;
const EMBED_URL = `${baseUrl}/tools/nyc-affordability-calculator/embed`;

export const metadata: Metadata = {
  title: "NYC Rent Affordability Calculator (40× Rule + Take-Home, 2026)",
  description:
    "Free NYC tool: enter your salary, get max rent under the 40× landlord rule and the 33%-of-take-home affordability rule. Real 2026 federal + NY + NYC tax math.",
  keywords: [
    "NYC affordability calculator",
    "40x rent NYC",
    "NYC rent calculator salary",
    "NYC take home pay",
    "NYC rent budget",
    "max rent NYC salary",
    "how much rent can I afford NYC",
    "NYC tax calculator",
    "33 percent rent rule",
    "NYC apartment income requirement",
  ],
  openGraph: {
    title: "NYC Rent Affordability Calculator",
    description:
      "Salary in, max rent out. Both the 40× landlord rule and the 33%-of-take-home rule, with full NYC tax math.",
    url: TOOL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Rent Affordability Calculator",
    description:
      "Free NYC tool — what's the most you can afford to rent? 40× rule and 33% of take-home.",
  },
  alternates: { canonical: TOOL_URL },
};

const FAQ = [
  {
    q: "What is the 40× rent rule in NYC?",
    a: "The 40× rule is the de facto NYC landlord underwriting standard: your gross annual salary divided by 40 must equal or exceed the monthly rent. Example: $100,000 salary ÷ 40 = $2,500 max monthly rent. If you don't meet 40× on your own, most landlords will accept a guarantor at 80× or two roommates whose combined incomes meet 40×.",
  },
  {
    q: "Is the 40× rule actually law?",
    a: "No — it's a private underwriting convention, not statute. Some landlords use 35× or 45×, and rent-stabilized buildings sometimes ignore the rule entirely if your prior rent history is clean. But across NYC market-rate rentals, 40× is the modal requirement, so plan around it as if it were a rule.",
  },
  {
    q: "Why does the 33% take-home rule give a lower number?",
    a: "Because the 40× rule is based on gross salary while the 33% rule is based on take-home. NYC has the heaviest combined federal + state + city + FICA tax load in the country — a single filer at $100K nets roughly $69K take-home, so 33% of that is $1,890/mo, well below the 40×-implied $2,500. For most NYC tenants under $200K, the take-home rule binds before the landlord rule does.",
  },
  {
    q: "Does this calculator account for federal, state, and NYC tax?",
    a: "Yes. It uses the published 2026 IRS brackets (Rev. Proc. 2025-32), 2026 NY State brackets (NY DTF), the four NYC city brackets, and FICA (Social Security up to the 2026 wage base of $176,100 plus Medicare and the additional Medicare surcharge over $200K single / $250K MFJ). Standard deduction is applied for federal and NY State.",
  },
  {
    q: "What if I have a guarantor?",
    a: "NYC landlords typically ask guarantors to meet 80× the rent in gross annual salary. Insurit / The Guarantors / Rhino-style institutional guarantors charge 5-7% of annual rent and let you skip the 80× requirement. If you're looking at $3,000/mo rent and your salary is $90,000 (only 30×), a guarantor at $240K (80×) bridges the gap.",
  },
  {
    q: "Should I use bonus income in the calculation?",
    a: "Most NYC landlords will accept guaranteed bonus income (e.g., a contractually-stipulated 10% bonus) as part of your gross salary, but discretionary bonus is typically excluded. RSUs and equity vest are usually excluded for underwriting and rarely included for budgeting either. When in doubt, run the calculator with base salary only — that's the conservative read.",
  },
  {
    q: "What if I'm self-employed or 1099?",
    a: "Bring two years of tax returns and most landlords will accept the average of your AGI as your 'gross salary' equivalent. Some require 6-12 months of bank statements showing consistent deposits at the level you're claiming. Self-employment tax (15.3% SE tax) lowers your take-home harder than W-2 FICA — this calculator's W-2 model will overstate your true take-home if you're 1099. Subtract roughly another 7% from take-home for self-employment.",
  },
  {
    q: "Is this NYC-only?",
    a: "The 40× rule is universal in NYC, common in Boston / SF / Chicago, and rare elsewhere. The take-home math here uses NYC-specific city tax brackets — for non-NYC NY State residents subtract the NYC line item. For NJ residents (Hoboken / Jersey City) NJ income tax replaces NY State; the take-home figure will be off by roughly $1-3K/year on a $100K salary.",
  },
];

const SAMPLES = [
  {
    salary: 80_000,
    fortyTimes: 2_000,
    takeHome33: 1_605,
    bind: "Take-home (you can afford less than the landlord allows)",
  },
  {
    salary: 120_000,
    fortyTimes: 3_000,
    takeHome33: 2_271,
    bind: "Take-home (most renters in this band)",
  },
  {
    salary: 180_000,
    fortyTimes: 4_500,
    takeHome33: 3_243,
    bind: "Take-home (still binding even at high incomes)",
  },
  {
    salary: 280_000,
    fortyTimes: 7_000,
    takeHome33: 4_829,
    bind: "Take-home (NYC tax load keeps you under 40×)",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": TOOL_URL,
    name: "NYC Rent Affordability Calculator",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free NYC rent affordability tool: gross salary in, max rent under 40× landlord rule and 33%-of-take-home rule out. Uses 2026 IRS, NY DTF, and NYC DOF tax brackets.",
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
      { "@type": "ListItem", position: 3, name: "NYC Affordability Calculator", item: TOOL_URL },
    ],
  },
];

const EMBED_SNIPPET = `<iframe
  src="${EMBED_URL}"
  title="NYC Rent Affordability Calculator"
  style="width:100%; min-height:880px; border:0;"
  loading="lazy"
></iframe>
<p><a href="${TOOL_URL}">NYC Rent Affordability Calculator</a> by Wade Me Home.</p>`;

export default function NycAffordabilityPage() {
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
            / <span>NYC affordability calculator</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">2026 NYC tax math</Badge>
            <Badge variant="outline">Updated April 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            NYC Rent Affordability Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            What&apos;s the most you can afford to rent in NYC? Enter your gross salary and get
            both the 40× landlord underwriting ceiling and the 33%-of-take-home affordability
            ceiling. Full federal + NY State + NYC + FICA tax math, 2026 brackets.
          </p>
        </header>

        <section aria-label="Calculator">
          <NycAffordabilityCalculator />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Quick reference</h2>
          <p className="text-muted-foreground">
            For a single filer in NYC, here&apos;s what 40× and 33% give at common salary points:
          </p>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30 text-left">
                  <tr>
                    <th className="p-3">Gross salary</th>
                    <th className="p-3">40× ceiling</th>
                    <th className="p-3">33% take-home</th>
                    <th className="p-3">Binding rule</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLES.map((s) => (
                    <tr key={s.salary} className="border-b last:border-b-0">
                      <td className="p-3 font-medium">${s.salary.toLocaleString()}</td>
                      <td className="p-3">${s.fortyTimes.toLocaleString()}/mo</td>
                      <td className="p-3 font-semibold text-emerald-700">
                        ${s.takeHome33.toLocaleString()}/mo
                      </td>
                      <td className="p-3 text-muted-foreground">{s.bind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            Numbers above are approximate — run your exact salary through the calculator above for
            precision.
          </p>
        </section>

        <section className="space-y-4" id="embed">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">
              Embed this calculator on your site
            </h2>
          </div>
          <p className="text-muted-foreground">
            Free for NYC rental bloggers, brokers, financial bloggers, and personal-finance content
            sites.
          </p>
          <Card>
            <CardContent className="p-0">
              <pre className="overflow-x-auto rounded-md bg-muted/60 p-4 text-xs leading-relaxed">
                <code>{EMBED_SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
          <Button asChild variant="outline">
            <Link href="/tools/nyc-affordability-calculator/embed" target="_blank">
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
                  <h3 className="text-base font-medium">Move-in cost estimator</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Once you know your max rent, see what moving in actually costs up front.
                </p>
                <Link
                  href="/tools/move-in-cost-estimator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open estimator <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">Net effective rent calculator</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Compare two listings on a real apples-to-apples basis with concession math.
                </p>
                <Link
                  href="/tools/net-effective-rent-calculator"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Compare listings <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        <footer className="text-xs text-muted-foreground">
          Educational use only — not tax or financial advice. Tax brackets update each year; this
          tool reflects 2026 published brackets. Confirm exact figures with a tax professional for
          your situation.
        </footer>
      </main>
    </div>
  );
}
