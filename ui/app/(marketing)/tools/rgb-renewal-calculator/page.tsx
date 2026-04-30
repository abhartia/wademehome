import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { RGBRenewalCalculator } from "@/components/rent-stab/RGBRenewalCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const TOOL_URL = `${baseUrl}/tools/rgb-renewal-calculator`;

export const metadata: Metadata = {
  title:
    "NYC RGB Renewal Calculator (2026): 1-Year vs. 2-Year Rent Stabilized Lease | Wade Me Home",
  description:
    "Free NYC Rent Guidelines Board renewal calculator. Compare the 1-year (3.0%) vs. 2-year (4.5%) renewal under the 2025–2026 cycle, see the crossover point, and get a recommendation based on your move plans and your 2026–2027 RGB forecast.",
  keywords: [
    "RGB renewal calculator",
    "NYC RGB calculator",
    "NYC 1 year vs 2 year lease renewal",
    "rent stabilized renewal NYC",
    "rent stabilized lease renewal calculator",
    "NYC rent renewal math",
    "2025 RGB rent increase",
    "2026 RGB rent increase",
    "NYC rent guidelines board",
    "stabilized lease renewal",
    "rent stabilized 1 year vs 2 year",
    "should I take 1 year or 2 year renewal",
    "NYC stabilized 3.0% vs 4.5%",
    "RGB 3.0 4.5 renewal math",
    "NYC rent renewal 2026",
    "stabilized renewal NYC 2026",
    "NYC rent guidelines forecast 2026 2027",
    "rent stabilized renewal calculator",
    "rent guidelines board renewal",
    "NYC stabilized lease 2 year",
    "RGB cap NYC",
  ],
  openGraph: {
    title:
      "NYC RGB Renewal Calculator: 1-Year vs. 2-Year (2025–2026 Cycle)",
    description:
      "Should you take the 1-year or 2-year RGB renewal? Free calculator with 24-month total-rent comparison, crossover point, and 2026–2027 RGB forecast.",
    url: TOOL_URL,
    type: "website",
  },
  alternates: { canonical: TOOL_URL },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "NYC RGB Renewal Calculator",
    url: TOOL_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "Interactive 1-year vs. 2-year renewal comparator for NYC rent-stabilized tenants. Computes 24-month total rent under each path using the 2025–2026 RGB caps (3.0% / 4.5%), shows the crossover next-year RGB rate at which the choice flips, and recommends a path based on the tenant's move plans and 2026–2027 RGB expectation.",
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
        name: "What are the 2025–2026 NYC RGB renewal caps?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For NYC rent-stabilized leases starting between October 1, 2025 and September 30, 2026, the Rent Guidelines Board approved a 3.0% cap on 1-year renewals and a 4.5% cap on 2-year renewals. These caps apply to the legal regulated rent, not preferential rent. IAI/MCI surcharges can stack on top of these caps and are not subject to them.",
        },
      },
      {
        "@type": "Question",
        name: "Is a 1-year or 2-year RGB renewal better?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It depends on three factors: (1) whether you plan to move inside 12 months — if yes, the 1-year always wins because the 2-year cap doesn't apply to you; (2) what next year's RGB cap turns out to be — under the 2025–2026 caps, the crossover is at approximately 2.91%. If you expect the 2026–2027 1-year cap to land above 2.91%, the 2-year (locking 4.5% across both years) saves money over the 1-year (3.0% then a higher number); (3) the option value of being able to leave at month 12. The calculator on this page runs the math for your specific rent.",
        },
      },
      {
        "@type": "Question",
        name: "What is the crossover point between 1-year and 2-year RGB renewals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under the 2025–2026 caps (3.0% / 4.5%), the crossover next-year 1-year RGB cap is approximately 2.91%. If the 2026–2027 1-year cap lands above that, the 2-year renewal saves money over the 1-year on total 24-month rent. If it lands below 2.91%, the 1-year wins. The current RGB staff range for 2026–2027 is 2.75%–4.5%, which means the choice is genuinely close and depends on your forecast.",
        },
      },
      {
        "@type": "Question",
        name: "When does the RGB vote the 2026–2027 cycle?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Rent Guidelines Board holds a preliminary vote in early May 2026 (range only) and a final vote in late June 2026. The final caps apply to leases starting October 1, 2026. If you renew between now and Sept 30, 2026, you're locked into the 2025–2026 caps (3.0% / 4.5%); after Oct 1, 2026 you'll be subject to whatever the 2026–2027 cycle caps end up being.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator handle preferential rent step-ups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — the calculator assumes the rent on your lease is the legal regulated rent (LRR). If you have a preferential rent (a discount off the LRR), the HSTPA 2019 rules say the landlord can only raise your preferential rent by the RGB cap, not all the way back to the LRR — but only if you've held continuous tenancy. If your situation is preferential-rent-with-step-up, the math depends on the specific landlord policy and is best handled with a DHCR rent history in hand.",
        },
      },
      {
        "@type": "Question",
        name: "Are IAI and MCI surcharges included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — the calculator only models the RGB renewal cap. IAI (individual apartment improvement) and MCI (major capital improvement) surcharges can stack on top of the RGB cap. Under HSTPA 2019, IAI surcharges are capped at $89.45/mo (apartments with ≤35 units) or $83.33/mo (>35 units) and MCI surcharges are capped at 2% of legal rent annually. If you've been hit with a recent IAI or MCI, the actual renewal will be the RGB cap plus the surcharge — see our rent stabilization guide for the full math.",
        },
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "RGB Renewal Calculator",
        item: TOOL_URL,
      },
    ],
  },
];

export default function RgbRenewalCalculatorPage() {
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
            <Badge variant="secondary">Free tool</Badge>
            <Badge variant="outline">2025–2026 RGB cycle</Badge>
            <Badge variant="outline">Stabilized leases only</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            NYC RGB Renewal Calculator: 1-Year vs. 2-Year
          </h1>
          <p className="text-lg text-muted-foreground">
            For NYC rent-stabilized tenants choosing between the 1-year (3.0%)
            and 2-year (4.5%) renewal cap under the 2025–2026 RGB cycle. Run
            your specific rent through the comparator to see the 24-month
            total cost on each path, the crossover next-year RGB at which
            the answer flips, and a clear recommendation.
          </p>
        </header>

        <RGBRenewalCalculator />

        <Separator />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            How this calculator works
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The 2025–2026 RGB caps apply to NYC rent-stabilized leases
            starting between October 1, 2025 and September 30, 2026. Under
            this cycle, you can renew at 3.0% (1-year) or 4.5% (2-year) over
            your current legal regulated rent. The 1-year is cheaper now but
            re-prices you into the 2026–2027 cycle next October — which could
            be lower or higher. The 2-year locks 4.5% across both years.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Running the math: under the current caps, the crossover is at
            approximately <strong>2.91% next-year RGB</strong>. If you expect
            the 2026–2027 1-year cap to land above 2.91%, the 2-year saves
            money over 24 months. Below 2.91%, the 1-year wins. The current
            RGB staff range for the 2026–2027 cycle is{" "}
            <strong>2.75%–4.5%</strong>, putting the decision genuinely on
            the knife&apos;s edge.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              The 1-year vs. 2-year decision factors
            </CardTitle>
            <CardDescription>
              Beyond the headline rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <div>
              <strong className="text-foreground">
                Move flexibility (year-2 option value).
              </strong>{" "}
              The 1-year keeps your option to leave at month 12 for free. The
              2-year locks you in: leaving at month 12 means breaking the
              lease (typically 1–2 months&apos; rent in penalty). If you have
              any meaningful chance of moving — new job, partner change,
              upgrade — the 1-year&apos;s embedded option is worth real money.
            </div>
            <div>
              <strong className="text-foreground">
                RGB volatility.
              </strong>{" "}
              The RGB cycle since 2019 has been: 1.5% / 2.5% / 0% / 0% / 3.25% /
              3.0% / 3.0%. Recent staff inputs suggest 2026–2027 will land
              meaningfully higher than the 2020–2022 zero-percent COVID
              cycle. The 2-year hedges against an above-trend 2026 outcome.
            </div>
            <div>
              <strong className="text-foreground">
                Preferential rent.
              </strong>{" "}
              If you&apos;re paying preferential rent (less than the legal
              regulated rent on your lease), HSTPA 2019 caps the increase at
              the RGB rate while you remain in the apartment — not all the
              way back to LRR. This calculator assumes you&apos;re on the
              LRR; if you&apos;re on preferential, the protection narrows
              the gap between the 1-year and 2-year paths.
            </div>
            <div>
              <strong className="text-foreground">
                IAI / MCI stacking.
              </strong>{" "}
              IAI (individual apartment improvement, capped at $89.45/mo for
              buildings ≤35 units) and MCI (major capital improvement, capped
              at 2% of legal rent annually) can stack on top of the RGB cap.
              If your landlord just filed an IAI or MCI, your actual renewal
              will be RGB + surcharge. The calculator only models the RGB
              cap; surcharges shift both paths up by the same amount, so the
              relative comparison still holds.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              When does the 2026–2027 cycle vote?
            </CardTitle>
            <CardDescription>
              Timing matters because Oct 1, 2026 is the cutover
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RGB milestone</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>What happens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Preliminary vote
                  </TableCell>
                  <TableCell>Early May 2026</TableCell>
                  <TableCell>
                    Range-only vote (sets the floor + ceiling for the final)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Final vote</TableCell>
                  <TableCell>Late June 2026</TableCell>
                  <TableCell>
                    Sets the actual 1-yr / 2-yr caps for 2026–2027
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cutover date</TableCell>
                  <TableCell>October 1, 2026</TableCell>
                  <TableCell>
                    Leases signed Oct 1, 2026 onward use the new caps; leases
                    signed before use the 3.0% / 4.5% caps
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p>
              <strong className="text-foreground">
                Practical implication for your renewal letter.
              </strong>{" "}
              If your renewal letter arrives before October 1, 2026, you are
              locked into the 2025–2026 caps regardless of when you sign.
              Don&apos;t panic-sign the 2-year just because the 2026–2027
              cycle is uncertain — the cap on a renewal letter is determined
              by when the letter was issued, not when you sign.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Related guides &amp; tools
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/rent-stabilization-checker">
                <span>Is my apartment stabilized?</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/blog/nyc-rent-stabilization-guide">
                <span>Full rent stabilization guide</span>
                <FileText className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/net-effective-rent-calculator">
                <span>Net-effective rent calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link href="/tools/nyc-affordability-calculator">
                <span>NYC affordability calculator</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
