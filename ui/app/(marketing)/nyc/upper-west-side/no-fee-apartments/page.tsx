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
import { BrokerFeeLawTimeline } from "@/components/fare-act/BrokerFeeLawTimeline";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "No-Fee Upper West Side Apartments (May 2026): FARE Act Inventory, Verified No-Broker-Fee Buildings | Wade Me Home",
  description:
    "No-fee Upper West Side apartments in May 2026. Under the FARE Act (June 11, 2025), landlord-hired brokers cannot charge tenants — and as the UWS flips to +36.2% YoY demand, this guide tracks no-broker-fee inventory by tier (Equity, AvalonBay, Related, Glenwood, Stonehenge), the small-landlord walkup gotchas above 96th Street, and how to verify no-fee on every individual listing before applying.",
  keywords: [
    "upper west side apartments for rent no fee",
    "uws no fee apartments",
    "no fee apartments upper west side",
    "no broker fee upper west side",
    "no fee 1 bedroom upper west side",
    "no fee studio upper west side",
    "FARE Act upper west side",
    "Equity Residential UWS",
    "AvalonBay UWS no fee",
    "Glenwood UWS no fee",
    "Related Companies UWS",
    "Stonehenge UWS",
    "no fee 10023",
    "no fee 10024",
    "no fee 10025",
    "no fee Manhattan Valley",
    "no fee Lincoln Square",
    "no fee Riverside Drive",
    "no fee Central Park West",
    "Upper West Side May 2026 no fee",
    "FARE Act compliant UWS landlords",
    "how to find no fee UWS apartment",
    "is my UWS apartment FARE Act covered",
    "no fee doorman building UWS",
    "no fee pre-war UWS",
    "broker fee refund UWS",
    "apartments near Central Park no fee",
    "Lincoln Center no fee apartments",
    "Manhattan Valley no fee",
    "Morningside Heights no fee",
    "Columbia spillover no fee",
    "no fee apartments NYC May 2026",
    "FARE Act enforcement Upper West Side",
    "DCWP UWS broker fee",
  ],
  openGraph: {
    title:
      "No-Fee Upper West Side Apartments (May 2026): FARE Act Inventory & Verified No-Broker-Fee Buildings",
    description:
      "Under the FARE Act, landlord-hired brokers cannot charge tenants. This guide tracks no-broker-fee UWS inventory by building tier, the small-landlord walkup gotchas above 96th, and how to verify no-fee on every listing.",
    url: `${baseUrl}/nyc/upper-west-side/no-fee-apartments`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/upper-west-side/no-fee-apartments`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "No-Fee Upper West Side Apartments (May 2026): FARE Act Inventory & Verified No-Broker-Fee Buildings",
    description:
      "Complete May 2026 guide to no-broker-fee Upper West Side apartments under the FARE Act. Building tier breakdown, no-fee verification process, small-landlord walkup gotchas above 96th Street, and how the +32,850% rising query maps to actual on-market inventory.",
    datePublished: "2026-05-03",
    dateModified: "2026-05-03",
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
    mainEntityOfPage: `${baseUrl}/nyc/upper-west-side/no-fee-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all Upper West Side apartments no-fee under the FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — the FARE Act only requires that the party who hired the broker pay the broker. If the landlord hired the broker (the typical large-management-company UWS scenario), the tenant cannot be charged. If you separately hire a tenant-broker to help you search, you pay that broker. Most UWS rental inventory in 2026 is landlord-hired-broker, so most listings are no-fee — but small-landlord walkups north of 96th Street sometimes engage a marketing agent and structure the relationship as 'tenant came to us through this broker' to try to push the fee back. The test is: who initiated the broker relationship, in writing? If the listing was on StreetEasy or RentHop with the broker shown as the listing agent, that is landlord-hired and the tenant cannot be charged.",
        },
      },
      {
        "@type": "Question",
        name: "Which Upper West Side buildings are reliably no-fee in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Large management companies that lease directly through their own offices are reliably no-fee. On the UWS in 2026 the consistent ones are Equity Residential (Longacre House, Trump Place, 808 Columbus), AvalonBay (Avalon Riverside, Avalon West Chelsea spillover), Related Companies (TF Cornerstone partnerships), Glenwood Management (their three UWS towers along Riverside), and Stonehenge NYC (eight UWS pre-war doorman buildings between 72nd and 96th). Smaller mid-rise post-war buildings owned by single-asset LLCs are typically marketed by a third-party broker — those are the ones to verify per-listing. Verify the FARE Act status by checking who is on the listing flyer or StreetEasy listing as the contact: if it is the landlord directly or a leasing office of the management company, no-fee is automatic; if it is a brokerage, ask in writing who hired them.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify a UWS apartment is no-fee before I apply?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three steps. (1) Check the listing source. If it is on the management company's own website or the building's leasing-office portal, it is no-fee by definition. (2) If the listing is on StreetEasy, RentHop, or Zillow with a broker contact, look at the 'Listed by' field — if the broker is identified as 'representing the landlord' or the listing agent has the building exclusive, the tenant cannot be charged under the FARE Act. (3) Get it in writing. Email or text the broker before viewing: 'Confirming this is a landlord-paid listing under the FARE Act and there is no fee to me as the tenant.' If they push back or try to label a fee as 'administrative,' 'marketing,' 'application processing' over $20, or 'move-in', screenshot the conversation and run it through our FARE Act Violation Reporter — those labels are exactly what DCWP has been flagging in 2026 enforcement actions.",
        },
      },
      {
        "@type": "Question",
        name: "Are no-fee UWS apartments typically more expensive?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Slightly. The post-FARE-Act adjustment is well-documented: StreetEasy and Zillow rental indices show NYC asking rents up 5–7% YoY in landlord-listed market-rate units, with industry analysts attributing 2–3 percentage points of that to broker-fee pass-through into rent. On a $4,200 UWS 1BR, that is roughly $100–$130/mo. The math still favors tenants on a 1–2 year tenancy: $1,200/yr in higher rent vs. the $5,040 broker fee that no longer applies = ~$3,800 saved year one, $2,600 saved year two. The structural gotcha is that the rent bump rolls into your renewal baseline while the fee was one-time; on a 5+ year tenancy, the math eventually flips. Negotiate the asking rent hard and watch RGB-eligible buildings (pre-1974 6+ unit walkups) for the structurally underpriced no-fee tier.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Upper West Side no-fee search up so much in May 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Two compounding factors. First, UWS apartment search demand on Google Trends just flipped from -38.2% YoY (April 28) to +36.2% YoY today (May 3) — the second-largest single-week sentiment shift in NYC after Hoboken. That is a +74.4-point swing in five days. Second, the rising-query data shows 'upper west side apartments for rent no fee' surfaced as a +32,850% rising query in NY-geo Trends, the strongest commercial-intent rising query we are tracking this week. The reading is that the FARE Act is now well-known enough that searchers are explicitly filtering for no-fee inventory rather than just 'Upper West Side apartments,' and the cohort that initially rotated to East Village (now -56% calmed) and Williamsburg (still +55%) is circling back to the Manhattan-side $3,500–$4,200 1BR tier where UWS pre-war stock and Manhattan Valley lease-up towers compete directly.",
        },
      },
      {
        "@type": "Question",
        name: "What if a UWS broker tries to charge me a fee anyway?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three options. (1) Refuse and walk — the FARE Act gives you the leverage. There is more no-fee UWS inventory than ever and the broker knows it. (2) If you already paid, file a DCWP complaint. The agency has been issuing $5,000 repeat-offender penalties since January 2026 and has refunded over 1,500 fees since June 2025. Most refunds resolve in 6–10 weeks. Use our FARE Act Violation Reporter to draft a copy-paste complaint with the right legal citations. (3) If the amount is large (over $5,000) or the broker contests, parallel-track to small-claims court — small-claims judgments in 2026 have routinely awarded the full fee plus interest and the $50 filing fee. The DCWP and small-claims tracks can run simultaneously.",
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
        name: "NYC Neighborhoods",
        item: `${baseUrl}/nyc-rent-by-neighborhood`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Upper West Side",
        item: `${baseUrl}/nyc/upper-west-side`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "No-Fee Apartments",
        item: `${baseUrl}/nyc/upper-west-side/no-fee-apartments`,
      },
    ],
  },
];

export default function UpperWestSideNoFeePage() {
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
              <Badge variant="outline">Upper West Side</Badge>
              <Badge variant="secondary">Manhattan</Badge>
              <Badge variant="default">FARE Act compliant</Badge>
              <Badge variant="default">+32,850% rising query</Badge>
              <Badge variant="outline">Updated 2026-05-03</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              No-Fee Upper West Side Apartments: May 2026 FARE Act Inventory
              Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              The Upper West Side flipped from -38.2% YoY apartment search
              demand on April 28 to{" "}
              <span className="font-semibold text-foreground">
                +36.2% YoY today
              </span>{" "}
              — and the rising-query data shows{" "}
              <span className="font-semibold text-foreground">
                &quot;upper west side apartments for rent no fee&quot; up
                +32,850%
              </span>{" "}
              as the strongest commercial-intent NY-geo rising query this
              week. Translation: New Yorkers are explicitly filtering UWS
              inventory for FARE Act-compliant, no-broker-fee listings. This
              guide breaks down which UWS buildings are reliably no-fee,
              the small-landlord walkup gotchas above 96th Street, the
              broker-fee-pass-through math after one year of the FARE Act,
              and how to verify no-fee on every individual listing before
              you apply.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed May 3, 2026 &middot; Inventory tier data reflects
              May 2026 lease-up activity from the major UWS management
              companies
            </p>
          </header>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Upper West Side"
            latitude={40.787}
            longitude={-73.9754}
            radiusMiles={0.8}
            limit={6}
            searchQuery="Upper West Side no fee apartments"
          />

          {/* ── FARE Act + UWS Quick Read ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>The 60-second read on FARE Act + UWS</CardTitle>
              <CardDescription>
                What changed, what the law actually says, and what it means
                for your UWS search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The{" "}
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  Fairness in Apartment Rental Expenses (FARE) Act
                </Link>{" "}
                took effect June 11, 2025. The rule is one sentence:
                whoever hires the broker pays the broker. For decades, NYC
                tenants paid 12–15% of annual rent (about $4,200–$5,250 on
                a $3,500/mo UWS 1BR) even when the landlord was the one
                who listed the unit. The FARE Act reverses that default.
              </p>
              <p>
                The Upper West Side&apos;s rental stock skews heavily toward{" "}
                <span className="font-semibold text-foreground">
                  large-management-company landlord-listed buildings
                </span>{" "}
                — Equity, AvalonBay, Related, Glenwood, Stonehenge — which
                means the FARE Act maps cleanly to most active UWS
                inventory. The exception is the small-landlord pre-war
                walkup tier above 96th Street, where individual owners
                sometimes still try to push fees back to tenants under
                fee labels (&quot;administrative,&quot; &quot;application,&quot;
                &quot;marketing&quot;) that DCWP has been actively
                penalizing in 2026.
              </p>
              <p>
                As of May 2026, DCWP has refunded over 1,500 wrongly-charged
                broker fees since the law took effect, issued the first
                round of $5,000 repeat-offender penalties (January 2026),
                and added roughly 25 brokerage names per month to its
                public enforcement docket. The Second Circuit affirmed
                the law in September 2025; REBNY&apos;s appeal failed.
                The law is settled.
              </p>
            </CardContent>
          </Card>

          {/* ── No-Fee Building Tier Table ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>UWS No-Fee Building Tier (May 2026)</CardTitle>
              <CardDescription>
                Reliable no-fee management companies, by building cohort,
                with typical 1BR asking and concession status
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
                      Equity Residential (Longacre House, Trump Place,
                      808 Columbus)
                    </TableCell>
                    <TableCell>$4,400 – $5,200</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0 – 0.5 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Glenwood Management (Riverside Drive towers)
                    </TableCell>
                    <TableCell>$4,200 – $5,800</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0 mo (sold-out)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      AvalonBay (Avalon Riverside, Avalon West Chelsea
                      spillover)
                    </TableCell>
                    <TableCell>$4,000 – $4,800</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0.5 – 1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Stonehenge NYC (8 pre-war doorman, 72nd–96th)
                    </TableCell>
                    <TableCell>$3,800 – $4,600</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Manhattan Valley lease-up tower (96th–110th)
                    </TableCell>
                    <TableCell>$3,500 – $4,200</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 – 1.5 mo on 13 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Small-landlord pre-war walkup (96th–110th)
                    </TableCell>
                    <TableCell>$2,800 – $3,400</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verify per-listing</Badge>
                    </TableCell>
                    <TableCell>0 mo; RGB-cap renewals</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brokered single-asset post-war (66th–96th)
                    </TableCell>
                    <TableCell>$3,600 – $4,400</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verify per-listing</Badge>
                    </TableCell>
                    <TableCell>Variable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &quot;Reliably no-fee&quot; tiers list directly from the
                management company&apos;s own leasing office or website,
                so the FARE Act maps cleanly. &quot;Verify per-listing&quot;
                tiers are landlord-hired-broker arrangements where the
                FARE Act technically applies but where some brokers
                attempt fee labels (&quot;administrative,&quot;
                &quot;marketing,&quot; &quot;application&quot; over $20)
                that DCWP has been flagging.
              </p>
            </CardContent>
          </Card>

          {/* ── Verification Process ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>How to verify no-fee on a UWS listing</CardTitle>
              <CardDescription>
                Three checks that take 30 seconds each, before you apply
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-3 pl-6">
                <li>
                  <strong>Check the listing source.</strong> If the listing
                  is on the management company&apos;s own website or the
                  building&apos;s leasing-office portal (eqr.com,
                  glenwoodnyc.com, avaloncommunities.com, stonehengenyc.com,
                  related.com), the FARE Act compliance is automatic.
                </li>
                <li>
                  <strong>Identify who is on the listing.</strong> On
                  StreetEasy, RentHop, or Zillow, look at the &quot;Listed
                  by&quot; or &quot;Posted by&quot; field. If the broker
                  is shown as &quot;representing the landlord&quot; or has
                  the building&apos;s exclusive, the tenant cannot be
                  charged under the FARE Act regardless of who you saw the
                  apartment through.
                </li>
                <li>
                  <strong>Get it in writing before you tour.</strong> Email
                  or text the broker:{" "}
                  <span className="italic">
                    &quot;Confirming this is a landlord-paid listing under
                    the FARE Act and there is no fee to me as the
                    tenant.&quot;
                  </span>{" "}
                  If they push back or try to label a fee as
                  &quot;administrative,&quot; &quot;marketing,&quot;
                  &quot;application processing&quot; over $20, or
                  &quot;move-in,&quot; screenshot the conversation. Those
                  labels are precisely what DCWP has been flagging in
                  2026 enforcement actions, and the screenshot is your
                  evidence package.
                </li>
              </ol>
              <Separator />
              <p className="text-xs">
                If you have already been charged, the{" "}
                <Link
                  href="/tools/fare-act-violation-reporter"
                  className="text-primary underline underline-offset-2"
                >
                  FARE Act Violation Reporter
                </Link>{" "}
                drafts a copy-paste DCWP complaint based on what you paid
                and who charged you. Most refunds resolve in 6–10 weeks
                once DCWP opens the file.
              </p>
            </CardContent>
          </Card>

          {/* ── Broker Fee Law Timeline (embed) ───────── */}
          <Card>
            <CardHeader>
              <CardTitle>NYC Broker Fee Law Timeline (2019 → 2026)</CardTitle>
              <CardDescription>
                Confirm which enforcement window covers your lease — that
                determines DCWP vs. small-claims vs. both
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Use the lease-date check to map your specific situation
                onto the four enforcement windows: pre-FARE (before June
                11, 2025), early enforcement (June 2025–October 2025),
                DCWP guidance era (October 2025–January 2026), and
                repeat-offender era (January 2026–present, $5,000
                penalties live).
              </p>
              <BrokerFeeLawTimeline bare />
            </CardContent>
          </Card>

          {/* ── CTA ────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Ready to find a no-fee UWS apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI concierge your budget, doorman vs. pre-war
                preference, and which UWS sub-area (72nd–79th, 79th–96th,
                Manhattan Valley) — we&apos;ll surface only FARE Act-
                compliant, landlord-listed inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Upper+West+Side+no+fee+apartments">
                  Search no-fee UWS apartments
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
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    UWS Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Full 13-Event Timeline
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/fare-act-violation-reporter"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act Violation Reporter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/fare-act-broker-fee-checker"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act Savings Checker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/rent-stabilization-checker"
                    className="text-primary underline underline-offset-2"
                  >
                    Rent Stabilization Checker
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
