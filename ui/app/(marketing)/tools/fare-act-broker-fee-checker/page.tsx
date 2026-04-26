import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2, FileText } from "lucide-react";

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
import { FareActChecker } from "@/components/widgets/FareActChecker";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/fare-act-broker-fee-checker`;
const EMBED_URL = `${baseUrl}/tools/fare-act-broker-fee-checker/embed`;

export const metadata: Metadata = {
  title: "FARE Act Broker Fee Checker (NYC, 2026): Was Your Fee Legal?",
  description:
    "Free NYC FARE Act calculator. Enter your rent, broker fee, and how you found the apartment — get an instant verdict, DCWP complaint link, and refund script.",
  keywords: [
    "FARE Act checker",
    "FARE Act calculator",
    "NYC broker fee illegal",
    "FARE Act broker fee",
    "is my broker fee illegal NYC",
    "DCWP broker fee complaint",
    "NYC broker fee refund",
    "FARE Act 2026",
    "NYC Local Law 119",
    "broker fee tool",
  ],
  openGraph: {
    title: "FARE Act Broker Fee Checker — NYC",
    description:
      "Free instant verdict on whether the broker fee you were charged in NYC is legal under the FARE Act. Built by Wade Me Home.",
    url: TOOL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FARE Act Broker Fee Checker — NYC",
    description:
      "Was that NYC broker fee legal? Run it through the free FARE Act checker.",
  },
  alternates: { canonical: TOOL_URL },
};

const FAQ = [
  {
    q: "What is the FARE Act?",
    a: "The Fairness in Apartment Rental Expenses (FARE) Act is NYC Local Law 119 of 2024, signed Dec 17, 2024 and effective June 15, 2025. It prohibits real-estate brokers from charging a fee to a residential tenant when the broker was hired by the landlord — including any broker who lists a unit on a public site like StreetEasy or Zillow. Civil penalties start at $1,000 per violation and are enforced by NYC Department of Consumer & Worker Protection (DCWP).",
  },
  {
    q: "Who pays the broker fee in NYC now?",
    a: "Whoever hires the broker pays the broker. In practice, almost all NYC rental listings are landlord-side (the landlord retains an exclusive agent or the broker markets the unit on a public listing site). For those listings the landlord pays the fee — the tenant cannot be charged. The narrow exception is when a tenant signs a separate written agreement engaging a broker to find them an apartment.",
  },
  {
    q: "How do I know who hired the broker?",
    a: "Three quick tests. (1) Did you find the listing on StreetEasy / Zillow / Apartments.com / Naked Apartments? Then the broker is landlord-side — you cannot be charged. (2) Did you sign a written buyer's-side agency agreement with the broker before they showed you any units? If yes, the broker is yours and a fee can be legal. (3) If you're not sure, ask the agent in writing: 'Who is your principal on this listing — the landlord or me?' Their answer is the answer.",
  },
  {
    q: "What can I do if I was charged an illegal broker fee?",
    a: "First, file a complaint with NYC Department of Consumer & Worker Protection (DCWP) at portal.311.nyc.gov. DCWP issues fines starting at $1,000 per violation and can order restitution. Second, demand a refund in writing from the broker, citing NYC Admin Code §20-699.21 (the FARE Act). Third, if they refuse, file in NYC Civil Court (small claims hears claims up to $10,000) — these cases have been tenant-friendly since the law took effect.",
  },
  {
    q: "Does the FARE Act apply outside NYC?",
    a: "No. The FARE Act is a New York City local law and only applies to apartments inside the five boroughs. Hoboken, Jersey City, and Newark are governed by the New Jersey Real Estate Commission's separate (and weaker) disclosure rules. Westchester, Long Island, and upstate New York have no equivalent law — landlord-side broker fees are still legal there if disclosed.",
  },
  {
    q: "Can a landlord raise rent to recover the broker fee?",
    a: "Free-market apartments: yes — landlords are pricing in the broker commission they now pay. NYC market data through early 2026 suggests new asking rents on previously-broker-fee listings rose 5-7% on average, while the tenant saved a one-time fee that previously ran 12-15% of annual rent. Net: most renters still come out ahead, especially on shorter stays. Rent-stabilized apartments: no — the renewal cap is set by the Rent Guidelines Board and cannot include a broker-fee pass-through.",
  },
  {
    q: "Does the FARE Act apply to renewal leases?",
    a: "There is no broker fee on a lease renewal in the first place — a renewal is between the landlord and the existing tenant, with no broker involved. The FARE Act is about the initial lease signing, when a broker is the one who showed you the unit and processed your application.",
  },
  {
    q: "Is this checker legal advice?",
    a: "No. It is a plain-English read of the statute and the NYC market norms. For complex situations — disputed agency, multi-broker transactions, or large fees you want to recover via litigation — talk to a tenant's-rights attorney. Free options include the Met Council on Housing hotline and the Legal Aid Society's Housing Help Program.",
  },
];

const SCENARIOS = [
  {
    title: "Found on StreetEasy, charged 15% of annual rent",
    verdict: "Illegal",
    color: "text-red-700",
    why: "Broker who lists on a public site is hired by the landlord under the FARE Act.",
  },
  {
    title: "Listing agent quoted you a 'broker fee' over text",
    verdict: "Illegal",
    color: "text-red-700",
    why: "If they're the listing agent, the landlord is their principal — fee belongs to the landlord.",
  },
  {
    title: "Hired a broker yourself, signed a buyer's-side agreement",
    verdict: "Legal",
    color: "text-emerald-700",
    why: "Tenant-engaged broker is the one narrow case the FARE Act still permits.",
  },
  {
    title: "Landlord rebrands the fee as 'admin fee' or 'marketing fee'",
    verdict: "Illegal",
    color: "text-red-700",
    why: "Rebranded broker fees are explicitly covered by the law — DCWP has issued violations on this.",
  },
  {
    title: "Apartment is in Hoboken or Jersey City",
    verdict: "Outside FARE Act",
    color: "text-slate-700",
    why: "FARE Act is NYC-only. NJ has separate disclosure rules but allows tenant-paid broker fees.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": TOOL_URL,
    name: "FARE Act Broker Fee Checker",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "Free NYC tool that determines whether a broker fee charged to a residential tenant is legal under the FARE Act (NYC Local Law 119, eff. June 15, 2025).",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
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
        name: "FARE Act Broker Fee Checker",
        item: TOOL_URL,
      },
    ],
  },
];

const EMBED_SNIPPET = `<iframe
  src="${EMBED_URL}"
  title="FARE Act Broker Fee Checker"
  style="width:100%; min-height:780px; border:0;"
  loading="lazy"
></iframe>
<p><a href="${TOOL_URL}">FARE Act Broker Fee Checker</a> by Wade Me Home.</p>`;

export default function FareActCheckerPage() {
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
            / <span>FARE Act broker fee checker</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">NYC only</Badge>
            <Badge variant="outline">Updated April 2026</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            FARE Act Broker Fee Checker
          </h1>
          <p className="text-lg text-muted-foreground">
            Was the broker fee you were charged in NYC actually legal? Answer four questions and get
            an instant verdict, a DCWP complaint link, and a refund-demand script — built on the
            FARE Act (NYC Local Law 119, effective June 15, 2025).
          </p>
        </header>

        <section aria-label="Checker tool">
          <FareActChecker />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Common scenarios at a glance
          </h2>
          <p className="text-muted-foreground">
            The five fact patterns we see most often when renters reach out about broker fees.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {SCENARIOS.map((s) => (
              <Card key={s.title}>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-medium">{s.title}</h3>
                    <span className={`text-sm font-semibold ${s.color}`}>{s.verdict}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.why}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">How the checker decides</h2>
          <Card>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed">
              <p>
                The FARE Act does not ban broker fees outright — it bans charging a tenant for a
                broker the tenant did not hire. So the checker walks through the four questions a
                DCWP investigator would ask:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Is the apartment in NYC?</strong> The FARE Act is a city law. Outside the
                  five boroughs it does not apply.
                </li>
                <li>
                  <strong>Was the fee charged on or after June 15, 2025?</strong> The statute is not
                  retroactive. Pre-effective-date fees are governed by the prior regime.
                </li>
                <li>
                  <strong>How did you find the listing?</strong> Public listing sites, the
                  building&apos;s leasing office, and open houses all signal a landlord-side broker.
                  A separate buyer&apos;s-side engagement signals a tenant-side broker.
                </li>
                <li>
                  <strong>Who hired the broker?</strong> If the landlord did, the landlord pays. If
                  you did (in writing, before the showing), you can be charged.
                </li>
              </ol>
              <p>
                If the answers point to a landlord-side broker and you were charged anything, the
                fee is illegal under §20-699.21 of the NYC Administrative Code regardless of what
                the broker calls it (&quot;application fee,&quot; &quot;admin fee,&quot;
                &quot;marketing fee&quot;).
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4" id="embed">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">
              Embed this checker on your site
            </h2>
          </div>
          <p className="text-muted-foreground">
            Free for tenant-organizations, university housing pages, journalists, and bloggers. No
            account, no API key. Just paste the snippet below.
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
              <Link href="/tools/fare-act-broker-fee-checker/embed" target="_blank">
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
                  <h3 className="text-base font-medium">
                    NYC FARE Act guide (full background)
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  How the broker fee ban came to be, what changed in 2026, and the policy debate one
                  year in.
                </p>
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read the guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" aria-hidden />
                  <h3 className="text-base font-medium">No-fee NYC apartments by neighborhood</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Browse current NYC listings filtered by your budget and target hood.
                </p>
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  See neighborhoods <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />
        <footer className="text-xs text-muted-foreground">
          Source: NYC Local Law 119 of 2024, codified at NYC Administrative Code §20-699.21. This
          page is informational and not legal advice. Wade Me Home is not affiliated with the City
          of New York.
        </footer>
      </main>
    </div>
  );
}
