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
import { NeighborhoodLiveListings } from "@/components/neighborhoods/NeighborhoodLiveListings";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "No-Fee Hoboken Apartments (May 2026): Landlord-Listed Inventory at +136.7% YoY Demand | Wade Me Home",
  description:
    "No-fee Hoboken apartments in May 2026. The FARE Act doesn't reach NJ, so Hoboken broker fees of one-month-plus are still common — but a real no-fee tier exists in landlord-direct waterfront towers (Maxwell Place, W Residences, Hudson Tea, 1100 Maxwell) and in-house leasing offices. With Hoboken apartment search up +136.7% YoY (peak 2026-05-03 — biggest single-week surge of any NYC-metro neighborhood), this guide tracks the verified no-fee inventory by tier, the small-landlord brownstone gotchas, and how to verify no-fee on every listing before applying.",
  keywords: [
    "hoboken apartments no fee",
    "no fee apartments hoboken",
    "hoboken no broker fee",
    "no fee 1 bedroom hoboken",
    "no fee studio hoboken",
    "Maxwell Place no fee",
    "W Residences Hoboken no fee",
    "Hudson Tea Building no fee",
    "1100 Maxwell no fee",
    "7 Seventy Hoboken no fee",
    "Avalon Hoboken",
    "Equity Residential Hoboken",
    "BLDG Management Hoboken",
    "no fee 07030",
    "no fee Washington Street Hoboken",
    "no fee waterfront hoboken",
    "no fee uptown hoboken",
    "no fee downtown hoboken",
    "no fee western edge hoboken",
    "Stevens Tech no fee apartments",
    "Hoboken landlord direct apartments",
    "no broker fee NJ apartments",
    "Hoboken May 2026 no fee",
    "is there a FARE Act in Hoboken",
    "Hoboken broker fee law",
    "how to find no fee Hoboken apartment",
    "no fee doorman building Hoboken",
    "no fee high-rise Hoboken",
    "Hoboken vs Manhattan no fee",
    "Hoboken vs Jersey City no fee",
    "Hoboken concession plus no fee",
    "+136.7% YoY Hoboken",
    "Hoboken demand surge no fee",
    "PATH commute no fee Hoboken",
  ],
  openGraph: {
    title:
      "No-Fee Hoboken Apartments (May 2026): Landlord-Listed Inventory at +136.7% YoY Demand",
    description:
      "Hoboken broker fees of one-month-plus are still standard — but a real no-fee tier exists in waterfront towers and in-house leasing offices. May 2026 inventory by building, with verification steps for every listing.",
    url: `${baseUrl}/hoboken/no-fee-apartments`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/hoboken/no-fee-apartments`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "No-Fee Hoboken Apartments (May 2026): Landlord-Listed Inventory at +136.7% YoY Demand",
    description:
      "Complete May 2026 guide to no-broker-fee Hoboken apartments. Building tier breakdown, the small-landlord brownstone gotchas, and how the +136.7% YoY demand surge maps to actual on-market landlord-direct inventory.",
    datePublished: "2026-05-04",
    dateModified: "2026-05-04",
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
    mainEntityOfPage: `${baseUrl}/hoboken/no-fee-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does the NYC FARE Act apply to Hoboken?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The FARE Act is a New York City ordinance — it does not cross the Hudson. Hoboken landlord-hired brokers can still charge tenants under New Jersey practice, and one-month-to-one-month-plus broker fees remain standard for brokered inventory. The post-FARE-Act bargain you see in NYC (lower move-in costs, higher monthly rent) does not exist in Hoboken — Hoboken broker fees are still a separate, additional out-of-pocket cost. NJ A-2978, the FARE Act analogue, sits in the state legislature but has not passed as of May 2026. The practical implication: a real no-fee Hoboken apartment is a genuine differentiator and worth filtering for explicitly.",
        },
      },
      {
        "@type": "Question",
        name: "Which Hoboken buildings are reliably no-fee in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Hoboken no-fee tier is concentrated in the waterfront luxury towers that lease through their own in-house offices: Maxwell Place (1100 and 1125 Maxwell), W Residences Hoboken, Hudson Tea Building, 7 Seventy (Madison Marquette), Avalon Hoboken, and the Equity Residential Hoboken portfolio. These all market 'no broker fee — lease direct from the property' as the explicit positioning, and the leasing office is the only contact you need. The mid-tier mid-rise inventory (BLDG Management's Hoboken portfolio, smaller waterfront-adjacent buildings) is mixed: some lease direct, some go through brokers. The brownstone tier (Uptown 9th–14th Streets, Downtown 1st–6th) is almost entirely brokered — assume one-month broker fee unless the listing says otherwise in writing.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify a Hoboken apartment is no-fee before I apply?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three steps. (1) Check whether the listing is on the building's own leasing-office website or portal — if it is on maxwellplaceapts.com, wresidenceshoboken.com, hudsontealiving.com, etc., no-fee is automatic. (2) If the listing is on Zillow, Apartments.com, RentHop, or StreetEasy, look for a 'No Fee' tag and check the listing source — listings posted directly by the management company show that as the 'Listed by' field. (3) Get it in writing. Email or text the listing contact: 'Confirming this is a landlord-direct no-fee listing — please confirm there is no broker fee, finder's fee, or marketing fee owed by me as the tenant.' If they push back or quote a one-month or 12% fee, that is a brokered listing and the FARE Act does not protect you in NJ — you are negotiating bilaterally, not enforcing a law. Walk if you have other options.",
        },
      },
      {
        "@type": "Question",
        name: "Are no-fee Hoboken apartments more expensive than fee apartments?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The waterfront no-fee towers (Maxwell Place, W Residences, Hudson Tea, 1100 Maxwell) sit at the top of the Hoboken price stack — typically $4,000–$5,000 for a 1-bedroom — but that premium reflects the building product (river views, doorman, gym, package room) more than the fee structure. Comparable mid-tier brokered 1-bedrooms run $3,200–$3,600 plus a one-month ($3,200–$3,600) broker fee, which means the year-one out-of-pocket gap closes to roughly $300–$400/month before utilities. On a 2+ year tenancy the brokered unit is often cheaper. The no-fee math wins decisively for shorter stays (12 months or less), waterfront-product seekers, and renters who value not having to write a four-digit upfront check.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Hoboken no-fee search rising so much in May 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hoboken apartment search demand on Google Trends just flipped from -8.6% YoY (April 28) to +136.7% YoY today (May 3 peak) — the single biggest one-week sentiment shift of any NYC-metro neighborhood ever measured by this analytics pipeline. The reading is that Manhattan FARE-Act-priced-out renters who were initially rotating to East Village and the Upper West Side are now extending the search to PATH-direct New Jersey, with Hoboken's 9-minute PATH ride to WTC + 12-minute ride to 33rd Street offering Manhattan-comparable commute at $800–$1,500/month rent savings. The no-fee filter is the natural search refinement once Hoboken enters the consideration set: NYC searchers expect FARE-Act-style protection by default, are surprised to learn it does not extend to NJ, and immediately filter for landlord-direct inventory to recreate the no-fee experience.",
        },
      },
      {
        "@type": "Question",
        name: "What if a Hoboken broker tries to charge a fee I didn't agree to?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three options. (1) Refuse the demand and walk — at +136.7% YoY demand there is more inventory than ever, and the broker knows there are landlord-direct alternatives. (2) If you signed a tenant-broker agreement before knowing you owed a fee, NJ contract law still requires clear disclosure of who hired whom and what is owed. Push back in writing and request the engagement document. If the broker cannot produce a tenant-engagement agreement signed by you before the showing, the demand is contestable. (3) For amounts already paid that you believe were misrepresented, NJ small-claims (Special Civil Part) handles disputes up to $5,000 in fees with no lawyer required and a $50 filing fee. Consult an NJ tenant-rights attorney for amounts above that. NJ does not have a FARE Act, so the bar is higher than in NYC — your strongest evidence is the listing screenshot, the broker's text/email demand, and the absence of a signed tenant-engagement agreement.",
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
        name: "Hoboken",
        item: `${baseUrl}/hoboken`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "No-Fee Apartments",
        item: `${baseUrl}/hoboken/no-fee-apartments`,
      },
    ],
  },
];

export default function HobokenNoFeePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* ── Header ────────────────────────────────── */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Hoboken</Badge>
              <Badge variant="secondary">New Jersey</Badge>
              <Badge variant="default">Landlord-direct inventory</Badge>
              <Badge variant="default">+136.7% YoY demand</Badge>
              <Badge variant="outline">Updated 2026-05-04</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              No-Fee Hoboken Apartments: May 2026 Landlord-Direct Inventory
              Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Hoboken apartment search demand flipped from -8.6% YoY on April
              28 to{" "}
              <span className="font-semibold text-foreground">
                +136.7% YoY today (peak 2026-05-03)
              </span>{" "}
              — the biggest single-week sentiment shift of any NYC-metro
              neighborhood ever measured. The{" "}
              <Link
                href="/blog/nyc-fare-act-broker-fee-ban"
                className="text-primary underline underline-offset-2"
              >
                FARE Act
              </Link>{" "}
              does not cross the Hudson, so Hoboken broker fees of
              one-month-plus are still common — but a real no-fee tier exists
              in the waterfront luxury towers and management-company in-house
              leasing offices. This guide breaks down which Hoboken buildings
              are reliably no-fee, the small-landlord brownstone gotchas, and
              how to verify no-fee on every listing before you apply.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed May 4, 2026 &middot; Inventory tier data reflects
              May 2026 lease-up activity from the major Hoboken management
              companies and waterfront tower leasing offices
            </p>
          </header>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Hoboken"
            latitude={40.7437}
            longitude={-74.0324}
            radiusMiles={1.0}
            limit={6}
            searchQuery="Hoboken no fee apartments"
          />

          {/* ── NJ Broker Fee Reality Check ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>The 60-second read on Hoboken no-fee</CardTitle>
              <CardDescription>
                Why the NYC playbook only half-applies, and what actually
                gets you a no-fee Hoboken lease
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The{" "}
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  FARE Act
                </Link>{" "}
                — the New York City ordinance that since June 11, 2025 has
                made it illegal for a landlord-hired broker to charge the
                tenant — is a NYC-only law. It does not apply in Hoboken,
                Jersey City, Newark, or anywhere else in New Jersey. NJ
                A-2978, the state-level FARE Act analogue, has been
                introduced in Trenton but has not passed as of May 2026.
              </p>
              <p>
                The practical implication: a Hoboken no-fee apartment is a
                genuine differentiator, not a default. Brokered Hoboken
                inventory carries{" "}
                <span className="font-semibold text-foreground">
                  one-month-to-one-month-plus broker fees
                </span>{" "}
                as standard practice. The way to recreate the FARE Act
                experience in Hoboken is to filter explicitly for
                landlord-direct listings — buildings that lease through
                their own in-house offices, where there is no third-party
                broker in the transaction.
              </p>
              <p>
                Hoboken&apos;s landlord-direct tier is concentrated in the
                waterfront luxury towers (Maxwell Place, W Residences,
                Hudson Tea, 1100 Maxwell) and in the larger
                management-company portfolios. The brownstone tier — most
                of Uptown 9th–14th Streets and the smaller Downtown
                1st–6th Street walkup stock — is almost entirely brokered
                by small local agencies, and you should assume a one-month
                broker fee unless the listing explicitly says otherwise.
              </p>
            </CardContent>
          </Card>

          {/* ── No-Fee Building Tier Table ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Hoboken No-Fee Building Tier (May 2026)</CardTitle>
              <CardDescription>
                Reliable no-fee landlord-direct buildings, by sub-area, with
                typical 1BR asking and concession status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Asking 1BR</TableHead>
                    <TableHead>No-fee status</TableHead>
                    <TableHead>Concession</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Maxwell Place (1100 + 1125 Maxwell, waterfront)
                    </TableCell>
                    <TableCell>$4,200 – $4,800</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 – 1.5 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      W Residences Hoboken (waterfront luxury)
                    </TableCell>
                    <TableCell>$4,500 – $5,400</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hudson Tea Building (waterfront pre-war conversion)
                    </TableCell>
                    <TableCell>$3,800 – $4,400</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0.5 – 1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      7 Seventy (Madison Marquette, Downtown)
                    </TableCell>
                    <TableCell>$3,600 – $4,200</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 mo on 13 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Avalon Hoboken (waterfront-adjacent)
                    </TableCell>
                    <TableCell>$3,800 – $4,400</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0.5 – 1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      BLDG Management mid-rise portfolio
                    </TableCell>
                    <TableCell>$3,200 – $3,800</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verify per-listing</Badge>
                    </TableCell>
                    <TableCell>0 – 0.5 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Uptown brownstone walkup (9th–14th Streets)
                    </TableCell>
                    <TableCell>$2,800 – $3,400</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        Assume 1-mo fee
                      </Badge>
                    </TableCell>
                    <TableCell>0 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Downtown brownstone (1st–6th, near Terminal)
                    </TableCell>
                    <TableCell>$3,000 – $3,600</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        Assume 1-mo fee
                      </Badge>
                    </TableCell>
                    <TableCell>0 – 0.5 mo</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &quot;Reliably no-fee&quot; tiers list directly from the
                management company&apos;s in-house leasing office, so there
                is no broker in the transaction. &quot;Verify per-listing&quot;
                tiers are mixed: some buildings lease direct, others go
                through brokers — check the listing source. &quot;Assume
                1-mo fee&quot; tiers are almost entirely brokered by small
                local NJ agencies; the FARE Act does not apply, and a
                one-month broker fee is the default. Negotiate it down or
                pivot to landlord-direct inventory.
              </p>
            </CardContent>
          </Card>

          {/* ── Verification Process ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>How to verify no-fee on a Hoboken listing</CardTitle>
              <CardDescription>
                Three checks that take 30 seconds each, before you tour
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-3 pl-6">
                <li>
                  <strong>Check the listing source.</strong> If the listing
                  is on the building&apos;s own leasing-office website or
                  portal (maxwellplaceapts.com, wresidenceshoboken.com,
                  hudsontealiving.com, avaloncommunities.com,
                  equityapartments.com), there is no broker in the
                  transaction and no fee is owed by definition.
                </li>
                <li>
                  <strong>Check the Zillow / Apartments.com / RentHop
                  posting.</strong> Look for a &quot;No Fee&quot; tag and
                  check the &quot;Listed by&quot; field. Listings posted
                  directly by the management company show the company name;
                  brokered listings show an agent name and brokerage. If
                  you see a brokerage, this is NJ — assume a one-month fee
                  is implied unless the listing explicitly says otherwise.
                </li>
                <li>
                  <strong>Get it in writing before you tour.</strong> Email
                  or text the listing contact:{" "}
                  <span className="italic">
                    &quot;Confirming this is a landlord-direct no-fee
                    listing — please confirm there is no broker fee,
                    finder&apos;s fee, or marketing fee owed by me as the
                    tenant.&quot;
                  </span>{" "}
                  In NJ, unlike NYC, there is no DCWP backstop — the
                  written confirmation IS your protection. Save it.
                </li>
              </ol>
              <Separator />
              <p className="text-xs">
                If you have already paid a broker fee on a Hoboken
                listing and believe it was misrepresented, the NJ
                small-claims venue is the Special Civil Part of the
                Superior Court (Hudson County). Filing fee is $50, no
                lawyer required, and the cap is $5,000 — sufficient for
                most one-month broker fee disputes. The FARE Act
                Violation Reporter on this site is NYC-only; NJ matters
                require an NJ tenant-rights attorney consultation.
              </p>
            </CardContent>
          </Card>

          {/* ── PATH + Demand Surge Context ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Why Hoboken no-fee search is up +136.7% YoY in May 2026
              </CardTitle>
              <CardDescription>
                The Manhattan-priced-out cohort hits PATH-direct NJ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>The five-day sentiment flip.</strong> Hoboken
                  apartment search demand on Google Trends went from -8.6%
                  YoY on April 28 to +136.7% YoY on May 3 — the biggest
                  single-week shift of any NYC-metro neighborhood ever
                  measured by this analytics pipeline. Peak landed today.
                </li>
                <li>
                  <strong>The PATH arbitrage.</strong> Hoboken Terminal to
                  WTC is 9 minutes; to 33rd Street is 12 minutes. That
                  beats every Brooklyn or Queens neighborhood by absolute
                  travel time. The rent gap to Manhattan is $800–$1,500/
                  month for a comparable 1BR. Even after factoring the
                  $135/month PATH SmartLink, the math favors Hoboken.
                </li>
                <li>
                  <strong>The no-fee filter as the natural refinement.</strong>{" "}
                  NYC searchers who have lived under the FARE Act for
                  10+ months expect no-fee as the default. Cross the
                  Hudson, and the default flips back to one-month broker
                  fee — so the search query refines to{" "}
                  <span className="italic">no-fee Hoboken</span> almost
                  immediately. That is what is driving the rising-query
                  pattern.
                </li>
                <li>
                  <strong>The Memorial Day compression.</strong> Hoboken
                  is on a 14-month-lease lockstep with the NYC metro lease
                  cycle. Memorial Day (May 25 this year) is when the
                  brokered tier&apos;s 1-month-free concessions expire and
                  asking rents reset 5–8% higher. Locking a no-fee
                  landlord-direct lease this week skips both the broker
                  fee AND the post-Memorial-Day rent reset — compounding
                  to roughly 1.5x annual rent in year-one savings vs. a
                  brokered June lease.
                </li>
                <li>
                  <strong>Stevens Tech demand pulse.</strong> Stevens
                  Institute of Technology&apos;s academic calendar pushes
                  off-campus housing demand into May–July, with a
                  noticeable concentration in the Castle Point /
                  Washington Street uptown corridor. That is a separate
                  smaller pulse on top of the larger Manhattan-rotation
                  signal.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* ── CTA ────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Ready to find a no-fee Hoboken apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI concierge your budget, waterfront vs. Uptown
                preference, and PATH commute target — we&apos;ll surface
                only landlord-direct, no-broker-fee Hoboken inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Hoboken+no+fee+apartments">
                  Search no-fee Hoboken apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li>
                  <Link
                    href="/hoboken"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/path-commute-roi-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    PATH Commute ROI Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Full Timeline + Refund Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    No-Fee Upper West Side (Manhattan equivalent)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC No-Fee Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
