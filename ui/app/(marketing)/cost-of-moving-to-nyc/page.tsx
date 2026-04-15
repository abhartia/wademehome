import type { Metadata } from "next";
import Link from "next/link";
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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "How Much Does It Cost to Move to NYC? Full 2026 Budget Breakdown",
  description:
    "Plan your NYC move-in budget for 2026. First month rent, security deposit, broker fees, movers, furniture and more — see realistic totals for studios through 2-bedrooms in every borough.",
  keywords: [
    "cost of moving to NYC",
    "how much does it cost to move to NYC",
    "NYC move-in costs",
    "NYC apartment upfront costs",
    "first apartment NYC budget",
    "NYC security deposit",
    "NYC broker fee 2026",
    "moving to New York City cost",
    "NYC apartment budget calculator",
    "first month rent NYC",
  ],
  openGraph: {
    title:
      "How Much Does It Cost to Move to NYC? Full 2026 Budget Breakdown",
    description:
      "Plan your NYC move-in budget for 2026. First month rent, security deposit, broker fees, movers, furniture and more.",
    url: `${baseUrl}/cost-of-moving-to-nyc`,
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "How Much Does It Cost to Move to NYC? Full 2026 Budget Breakdown",
    description:
      "A detailed breakdown of every cost involved in moving to New York City in 2026, from upfront apartment fees to furniture and utilities.",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    publisher: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    author: {
      "@type": "Organization",
      name: "Wade Me Home",
      url: baseUrl,
    },
    mainEntityOfPage: `${baseUrl}/cost-of-moving-to-nyc`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much money should I save before moving to NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For a studio apartment renting at $2,800 per month, plan to save at least $10,000 to $14,000 to cover first month's rent, security deposit, moving costs, and basic furnishing. For a one-bedroom at $3,500 to $4,500 per month, budget $14,000 to $20,000. Having an additional two months of rent as an emergency fund is strongly recommended.",
        },
      },
      {
        "@type": "Question",
        name: "Do I still have to pay a broker fee in NYC in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under the FARE Act, which took effect in June 2025, landlord-side brokers can no longer charge tenants a fee. However, if you hire your own broker to help you search, you may still owe a tenant-side fee. Many no-fee listings are now available directly from landlords and management companies.",
        },
      },
      {
        "@type": "Question",
        name: "What upfront costs do NYC landlords require before move-in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most NYC landlords require first month's rent and a security deposit equal to one month's rent at lease signing. Under New York State law, security deposits are capped at one month's rent. Some landlords may also require last month's rent, though this is less common. If you use a guarantor service, expect an additional fee of 60 to 90 percent of one month's rent.",
        },
      },
      {
        "@type": "Question",
        name: "How much do movers cost in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Local NYC moves (within the five boroughs) typically cost $500 to $1,500 for a studio or one-bedroom and $1,200 to $2,500 for a two-bedroom. Long-distance moves from other states range from $3,000 to $8,000 depending on distance and volume. Expect higher rates in summer months (May through September) and on weekends.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest time to move to NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Winter months from November through February are the cheapest time to move. Rents are typically 5 to 10 percent lower than peak summer prices, movers offer lower rates due to less demand, and landlords are more willing to negotiate concessions like a free month of rent. The most expensive time is May through September, especially around the September rush.",
        },
      },
    ],
  },
];

export default function CostOfMovingToNYCPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: "Guides",
                item: `${baseUrl}/blog`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Cost of Moving to NYC",
                item: `${baseUrl}/cost-of-moving-to-nyc`,
              },
            ],
          }),
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">NYC Moving Guide</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              How Much Does It Cost to Move to NYC? A Complete 2026 Budget
            </h1>
            <p className="text-sm text-muted-foreground">
              Moving to New York City is exciting, but the upfront costs can
              catch you off guard. Between first month&rsquo;s rent, security
              deposits, movers, and furnishing a new place, the total bill
              adds up fast. This guide walks through every expense category
              so you can plan a realistic budget before signing a lease.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Prices based on current NYC market
              data
            </p>
          </header>

          {/* ── Quick Summary ──────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>The Bottom Line: Total Move-In Costs</CardTitle>
              <CardDescription>
                What to expect depending on your apartment size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Most people moving to NYC need between <strong>$8,000 and
                $20,000</strong> in savings to cover upfront costs, depending
                on the apartment size and whether they&rsquo;re moving locally
                or from out of state. Here&rsquo;s a realistic range:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apartment type</TableHead>
                    <TableHead>Typical monthly rent</TableHead>
                    <TableHead>Total move-in budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>$2,400 &ndash; $3,800</TableCell>
                    <TableCell>$8,000 &ndash; $13,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell>$2,800 &ndash; $4,700</TableCell>
                    <TableCell>$10,000 &ndash; $17,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell>$3,500 &ndash; $6,500</TableCell>
                    <TableCell>$13,000 &ndash; $23,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground">
                Ranges reflect borough-level variation. Manhattan skews
                toward the high end; outer-borough neighborhoods like
                Astoria, Bushwick, and Washington Heights fall on the lower
                end. See our{" "}
                <Link
                  href="/nyc-rent-by-neighborhood"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  rent-by-neighborhood guide
                </Link>{" "}
                for detailed pricing.
              </p>
            </CardContent>
          </Card>

          {/* ── 1. Rent & Security Deposit ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>1. First Month&rsquo;s Rent &amp; Security Deposit</CardTitle>
              <CardDescription>
                The biggest check you&rsquo;ll write at lease signing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Nearly every NYC landlord requires <strong>first month&rsquo;s
                rent plus a security deposit</strong> before handing over the
                keys. Under New York State Housing Stability and Tenant
                Protection Act, the security deposit is capped at one
                month&rsquo;s rent &mdash; no landlord can legally ask for
                more.
              </p>
              <p className="text-sm">
                For a $3,200/month one-bedroom, that means $6,400 due at
                signing. Some landlords also request last month&rsquo;s rent,
                which is legal but less common in Manhattan and Brooklyn.
              </p>
              <p className="text-sm">
                If you earn less than 40 times the monthly rent, most
                landlords will require a{" "}
                <Link
                  href="/blog/guarantors-and-co-signers"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  guarantor or co-signer
                </Link>
                . Institutional guarantor services like Insurent or TheGuarantors
                typically charge 60&ndash;90% of one month&rsquo;s rent as a
                one-time fee. For a $3,200 apartment, budget an extra $1,900 to
                $2,900.
              </p>
              <p className="text-sm">
                Learn more about{" "}
                <Link
                  href="/blog/security-deposits-move-in-fees"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  security deposits and move-in fees
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* ── 2. Broker Fees ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>2. Broker Fees After the FARE Act</CardTitle>
              <CardDescription>
                How the 2025 law changed apartment costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                The{" "}
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  FARE Act
                </Link>{" "}
                took effect in June 2025 and prohibits landlord-side brokers
                from charging tenants a fee. This is a significant change &mdash;
                previously, tenants routinely paid 12&ndash;15% of annual rent
                (roughly $4,600 to $8,600 on a $3,200/month apartment) just for
                the privilege of signing a lease.
              </p>
              <p className="text-sm">
                In 2026, most renters searching on their own or through
                landlord-listed apartments will <strong>not owe a broker
                fee</strong>. However, if you hire your own tenant-side broker
                to help with your search, you may still negotiate a fee with
                them. The practical effect: far more &ldquo;no-fee&rdquo; listings
                are available than before.
              </p>
              <p className="text-sm">
                For most renters, this saves thousands of dollars on move-in
                costs compared to even two years ago.
              </p>
            </CardContent>
          </Card>

          {/* ── 3. Application & Credit Check ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>3. Application &amp; Credit Check Fees</CardTitle>
              <CardDescription>
                Small charges that add up across multiple applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                New York State caps application fees at <strong>$20 per
                application</strong>. This covers the cost of a credit check
                and background screening. While $20 sounds trivial, many
                renters apply to 3&ndash;8 apartments before landing one,
                which means $60 to $160 in application fees.
              </p>
              <p className="text-sm">
                Some landlords and management companies have waived
                application fees entirely &mdash; ask before you apply. Read
                our{" "}
                <Link
                  href="/blog/rental-application-screening-basics"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  rental application guide
                </Link>{" "}
                to understand what landlords look for and how to strengthen
                your application.
              </p>
            </CardContent>
          </Card>

          {/* ── 4. Moving Costs ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>4. Hiring Movers or Renting a Truck</CardTitle>
              <CardDescription>
                The price of physically getting your stuff to the new place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Moving costs vary widely based on distance, apartment size,
                and whether you hire full-service movers or go the DIY route.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead>Studio / 1BR</TableHead>
                    <TableHead>2BR+</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Local move (within NYC)
                    </TableCell>
                    <TableCell>$500 &ndash; $1,500</TableCell>
                    <TableCell>$1,200 &ndash; $2,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Regional (NJ, CT, PA)
                    </TableCell>
                    <TableCell>$800 &ndash; $2,500</TableCell>
                    <TableCell>$2,000 &ndash; $4,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Long distance (500+ mi)
                    </TableCell>
                    <TableCell>$2,500 &ndash; $5,000</TableCell>
                    <TableCell>$4,000 &ndash; $8,000+</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      DIY truck rental
                    </TableCell>
                    <TableCell>$150 &ndash; $400</TableCell>
                    <TableCell>$300 &ndash; $700</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-sm">
                Summer weekends (May&ndash;September) are peak season &mdash;
                expect rates 20&ndash;30% higher. Booking a mid-week or
                winter move can save hundreds. Check our{" "}
                <Link
                  href="/nyc-apartment-movers"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  NYC apartment movers comparison
                </Link>{" "}
                for vetted companies and pricing details.
              </p>
              <p className="text-sm">
                NYC-specific wrinkle: if your new building requires a{" "}
                <strong>Certificate of Insurance (COI)</strong> from movers
                and elevator reservations, factor in the extra coordination
                time. Most professional movers handle COIs routinely.
              </p>
            </CardContent>
          </Card>

          {/* ── 5. Furnishing ──────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>5. Furnishing Your Apartment</CardTitle>
              <CardDescription>
                From bare essentials to a comfortable setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Furnishing costs depend on whether you&rsquo;re starting from
                scratch or bringing items from a previous home. Here are
                realistic ranges for a studio or one-bedroom:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget range</TableHead>
                    <TableHead>Mid-range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Mattress &amp; bed frame
                    </TableCell>
                    <TableCell>$300 &ndash; $600</TableCell>
                    <TableCell>$600 &ndash; $1,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Sofa / seating
                    </TableCell>
                    <TableCell>$200 &ndash; $500</TableCell>
                    <TableCell>$500 &ndash; $1,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Desk, table &amp; chairs
                    </TableCell>
                    <TableCell>$100 &ndash; $300</TableCell>
                    <TableCell>$300 &ndash; $800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Kitchen essentials
                    </TableCell>
                    <TableCell>$100 &ndash; $250</TableCell>
                    <TableCell>$250 &ndash; $500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Bedding, towels, basics
                    </TableCell>
                    <TableCell>$100 &ndash; $200</TableCell>
                    <TableCell>$200 &ndash; $400</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-sm">
                <strong>Total for a minimal setup: $800&ndash;$1,800.</strong>{" "}
                A mid-range setup runs $1,800&ndash;$4,000. NYC has a
                thriving secondhand market &mdash; Facebook Marketplace,
                Craigslist, and stoopsales can cut furnishing costs by 50% or
                more.
              </p>
            </CardContent>
          </Card>

          {/* ── 6. Utilities ──────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>6. Utilities &amp; Internet Setup</CardTitle>
              <CardDescription>
                Monthly recurring costs that start on day one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Utility costs depend on whether your building includes heat
                and hot water in the rent (common in older buildings and
                rent-stabilized units) or bills them separately.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utility</TableHead>
                    <TableHead>Monthly estimate</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Electricity</TableCell>
                    <TableCell>$60 &ndash; $150</TableCell>
                    <TableCell>Higher with window AC</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gas (cooking)</TableCell>
                    <TableCell>$15 &ndash; $30</TableCell>
                    <TableCell>If not included in rent</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Internet</TableCell>
                    <TableCell>$40 &ndash; $80</TableCell>
                    <TableCell>Spectrum, Verizon Fios, or Optimum</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Renter&rsquo;s insurance
                    </TableCell>
                    <TableCell>$15 &ndash; $30</TableCell>
                    <TableCell>Required by many landlords</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-sm">
                Budget <strong>$130&ndash;$290/month</strong> for utilities on
                top of rent. Con Edison typically requires a small deposit
                ($50&ndash;$200) if you have no prior account history in NYC.
                Read our{" "}
                <Link
                  href="/blog/utilities-internet-move-in"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  utilities setup guide
                </Link>{" "}
                and{" "}
                <Link
                  href="/blog/renters-insurance-basics"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  renter&rsquo;s insurance basics
                </Link>{" "}
                for details.
              </p>
            </CardContent>
          </Card>

          {/* ── 7. Move-In Cleaning ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>7. Move-In Cleaning</CardTitle>
              <CardDescription>
                Start fresh in your new space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                Even &ldquo;broom-clean&rdquo; apartments benefit from a deep
                clean before you unpack. Professional move-in cleaning in NYC
                runs <strong>$150&ndash;$400</strong> for a studio or
                one-bedroom, depending on the condition of the unit.
              </p>
              <p className="text-sm">
                DIY cleaning supplies cost $30&ndash;$60 if you prefer to do
                it yourself. See our{" "}
                <Link
                  href="/nyc-move-in-cleaning"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  NYC move-in cleaning guide
                </Link>{" "}
                for a room-by-room checklist.
              </p>
            </CardContent>
          </Card>

          {/* ── 8. Sample Budgets ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>8. Putting It All Together: Sample Budgets</CardTitle>
              <CardDescription>
                Three realistic scenarios for different apartment sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Scenario A: Studio in Astoria ($2,400/month)
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>First month&rsquo;s rent</TableCell>
                      <TableCell className="text-right">$2,400</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Security deposit</TableCell>
                      <TableCell className="text-right">$2,400</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Local movers</TableCell>
                      <TableCell className="text-right">$600</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Basic furnishing</TableCell>
                      <TableCell className="text-right">$1,200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cleaning + supplies</TableCell>
                      <TableCell className="text-right">$200</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Application fees (3 apps)</TableCell>
                      <TableCell className="text-right">$60</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Utility deposits</TableCell>
                      <TableCell className="text-right">$150</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">~$7,010</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Scenario B: 1-Bedroom in Williamsburg ($3,500/month)
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>First month&rsquo;s rent</TableCell>
                      <TableCell className="text-right">$3,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Security deposit</TableCell>
                      <TableCell className="text-right">$3,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Guarantor service fee</TableCell>
                      <TableCell className="text-right">$2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Long-distance movers</TableCell>
                      <TableCell className="text-right">$3,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mid-range furnishing</TableCell>
                      <TableCell className="text-right">$2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cleaning</TableCell>
                      <TableCell className="text-right">$250</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Application fees + utilities</TableCell>
                      <TableCell className="text-right">$300</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">~$16,050</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Scenario C: 2-Bedroom in East Village ($5,000/month, split
                  with roommate)
                </h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Your share: first month</TableCell>
                      <TableCell className="text-right">$2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Your share: security deposit</TableCell>
                      <TableCell className="text-right">$2,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Local movers</TableCell>
                      <TableCell className="text-right">$800</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bedroom furnishing</TableCell>
                      <TableCell className="text-right">$1,500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Shared items (kitchen, living)</TableCell>
                      <TableCell className="text-right">$500</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cleaning + apps + utilities</TableCell>
                      <TableCell className="text-right">$350</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                      <TableCell>Total per person</TableCell>
                      <TableCell className="text-right">~$8,150</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground">
                  Splitting with a{" "}
                  <Link
                    href="/blog/roommate-vs-solo-living"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    roommate
                  </Link>{" "}
                  is one of the most effective ways to reduce NYC move-in costs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── 9. Money-Saving Tips ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>9. Tips to Reduce Your Move-In Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc space-y-2 pl-6 text-sm">
                <li>
                  <strong>Move in winter.</strong> Rents drop 5&ndash;10% and
                  movers charge less between November and February. Landlords
                  are more likely to offer a free month or waive fees.
                </li>
                <li>
                  <strong>Search for no-fee apartments.</strong> Thanks to the{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    FARE Act
                  </Link>
                  , most landlord-listed apartments no longer charge broker
                  fees. Use{" "}
                  <Link
                    href="/"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Wade Me Home&rsquo;s AI search
                  </Link>{" "}
                  to filter by no-fee listings.
                </li>
                <li>
                  <strong>Negotiate lease concessions.</strong> In slower
                  months, landlords may offer one or two months free (net
                  effective rent). This won&rsquo;t reduce upfront costs but
                  lowers your effective monthly payment. See our{" "}
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    lease negotiation guide
                  </Link>
                  .
                </li>
                <li>
                  <strong>Buy secondhand furniture.</strong> Facebook
                  Marketplace and NYC stoopsales are goldmines. Many people
                  leaving the city sell barely-used furniture for a fraction
                  of retail.
                </li>
                <li>
                  <strong>DIY your move.</strong> If you&rsquo;re moving
                  locally with minimal belongings, renting a cargo van
                  ($80&ndash;$150/day) and recruiting friends can save
                  $500+.
                </li>
                <li>
                  <strong>Look at outer boroughs.</strong> Neighborhoods like{" "}
                  <Link
                    href="/nyc/astoria"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Astoria
                  </Link>
                  ,{" "}
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Washington Heights, and Bushwick
                  </Link>{" "}
                  offer significantly lower rents with good transit access.
                </li>
                <li>
                  <strong>Watch out for{" "}
                  <Link
                    href="/blog/nyc-apartment-scams"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    scams
                  </Link>
                  .</strong>{" "}
                  Never wire money or pay a deposit before seeing an apartment
                  in person and verifying the landlord&rsquo;s identity.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* ── 10. Rent-Stabilized Savings ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>10. The Rent-Stabilized Advantage</CardTitle>
              <CardDescription>
                Long-term savings that affect your total cost of living
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">
                While not directly a move-in cost, finding a{" "}
                <Link
                  href="/blog/nyc-rent-stabilization-guide"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  rent-stabilized apartment
                </Link>{" "}
                can save you thousands per year in rent increases. Stabilized
                units limit annual increases to rates set by the NYC Rent
                Guidelines Board (typically 2&ndash;5%), compared to
                market-rate apartments where landlords can raise rent by any
                amount at renewal.
              </p>
              <p className="text-sm">
                Over a 3-year stay, the cumulative savings from a stabilized
                unit versus a comparable market-rate apartment can reach
                $5,000&ndash;$15,000 or more.
              </p>
            </CardContent>
          </Card>

          {/* ── FAQ ──────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">
                  How much money should I save before moving to NYC?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  For a studio at $2,800/month, plan to save at least $10,000
                  to $14,000 for move-in costs. For a one-bedroom at $3,500
                  to $4,500/month, budget $14,000 to $20,000. Having an
                  additional two months of rent as an emergency fund is
                  strongly recommended.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold">
                  Do I still have to pay a broker fee in NYC in 2026?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Under the{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    FARE Act
                  </Link>
                  , landlord-side brokers can no longer charge tenants a fee.
                  If you hire your own broker, you may still owe a
                  tenant-side fee. Many no-fee listings are now available
                  directly from landlords and management companies.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold">
                  What upfront costs do NYC landlords require before move-in?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Most landlords require first month&rsquo;s rent and a
                  security deposit equal to one month&rsquo;s rent. Under New
                  York law, deposits are capped at one month&rsquo;s rent.
                  Some landlords also require last month&rsquo;s rent. If you
                  use a guarantor service, expect an additional 60&ndash;90%
                  of one month&rsquo;s rent.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold">
                  How much do movers cost in NYC?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Local moves cost $500&ndash;$1,500 for a studio/1BR and
                  $1,200&ndash;$2,500 for a 2BR. Long-distance moves from
                  other states run $3,000&ndash;$8,000+. Rates are higher May
                  through September and on weekends.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold">
                  What is the cheapest time to move to NYC?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  November through February offers the lowest rents, cheapest
                  mover rates, and the most landlord concessions. The most
                  expensive time is May through September, especially
                  around the September rush when students and graduates flood
                  the market.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Related Guides ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related NYC Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent Prices by Neighborhood (2026)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-apartment-movers"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Best NYC Apartment Movers Compared
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-moving-checklist"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Moving Checklist: Step-by-Step Timeline
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-move-in-cleaning"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Move-In Cleaning Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC FARE Act: What It Means for Broker Fees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent Stabilization Explained
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Search NYC apartments with Wade Me Home
              </Link>
            </Button>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Planning your NYC budget?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Try our AI-powered apartment search
            </Link>{" "}
            to find apartments that fit your budget.
          </p>
        </div>
      </div>
    </div>
  );
}
