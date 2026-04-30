import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, Gavel, Home, Scale, ShieldCheck, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "Free NYC Renter Tools — Wade Me Home",
  description:
    "Free, unbiased calculators and checkers for NYC renters: FARE Act broker fee verdicts, net-effective rent, affordability, move-in cost, rent stabilization eligibility, and 1-yr vs 2-yr RGB renewal math.",
  openGraph: {
    title: "Free NYC Renter Tools",
    description:
      "FARE Act broker fee checker, net-effective rent calculator, NYC affordability tools, rent stabilization eligibility, RGB renewal calculator — all free.",
    url: `${baseUrl}/tools`,
    type: "website",
  },
  alternates: { canonical: `${baseUrl}/tools` },
};

type ToolCard = {
  href: string;
  title: string;
  description: string;
  badge?: string;
  status: "live" | "coming-soon";
  icon: typeof Calculator;
};

const TOOLS: ToolCard[] = [
  {
    href: "/tools/fare-act-broker-fee-checker",
    title: "FARE Act Broker Fee Checker",
    description:
      "Was your NYC broker fee legal? Get an instant verdict, DCWP complaint link, and refund script.",
    badge: "New",
    status: "live",
    icon: Gavel,
  },
  {
    href: "/tools/net-effective-rent-calculator",
    title: "Net Effective Rent Calculator",
    description:
      "Compare two listings with different free-month concessions on a real apples-to-apples basis. Amortize broker fees too.",
    badge: "New",
    status: "live",
    icon: Calculator,
  },
  {
    href: "/tools/nyc-affordability-calculator",
    title: "NYC Rent Affordability Calculator",
    description:
      "Translate your gross salary into max rent under the NYC 40× rule and the 33%-of-take-home rule. Real 2026 NYC tax math.",
    badge: "New",
    status: "live",
    icon: Home,
  },
  {
    href: "/tools/move-in-cost-estimator",
    title: "NYC Move-In Cost Estimator",
    description:
      "First + last + security + movers + setup, FARE Act-aware. Lump sum + monthly amortization.",
    badge: "New",
    status: "live",
    icon: Wrench,
  },
  {
    href: "/tools/rent-stabilization-checker",
    title: "NYC Rent Stabilization Checker",
    description:
      "Is your apartment rent stabilized? Year built, unit count, tax abatement → instant verdict, 2025–2026 RGB renewal math, DHCR next steps.",
    badge: "New",
    status: "live",
    icon: ShieldCheck,
  },
  {
    href: "/tools/rgb-renewal-calculator",
    title: "NYC RGB Renewal Calculator (1-yr vs 2-yr)",
    description:
      "Stabilized lease coming up for renewal? Compare the 1-year (3.0%) vs. 2-year (4.5%) cap on real 24-month total cost, see the crossover, and decide.",
    badge: "New",
    status: "live",
    icon: Scale,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free NYC Renter Tools",
  url: `${baseUrl}/tools`,
  hasPart: TOOLS.filter((t) => t.status === "live").map((t) => ({
    "@type": "WebApplication",
    name: t.title,
    url: `${baseUrl}${t.href}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  })),
};

export default function ToolsIndexPage() {
  return (
    <div className="bg-background">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:py-14">
        <header className="space-y-3">
          <Badge variant="secondary">Free</Badge>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Free tools for NYC renters
          </h1>
          <p className="text-lg text-muted-foreground">
            Calculators and checkers we built because the existing ones either cost money, lock data
            behind signups, or aren&apos;t updated for the FARE Act and 2026 rent rules.
          </p>
        </header>

        <section className="grid gap-3 md:grid-cols-2">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isLive = t.status === "live";
            const inner = (
              <Card
                className={isLive ? "transition-shadow hover:shadow-md" : "opacity-70"}
              >
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                      <h2 className="text-base font-semibold">{t.title}</h2>
                    </div>
                    {t.badge ? <Badge variant="default">{t.badge}</Badge> : null}
                    {!isLive ? <Badge variant="outline">Coming soon</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open tool <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </CardContent>
              </Card>
            );
            return isLive ? (
              <Link key={t.href} href={t.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={t.href}>{inner}</div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
