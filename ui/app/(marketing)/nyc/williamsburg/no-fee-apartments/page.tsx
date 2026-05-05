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
    "No-Fee Williamsburg Apartments (May 2026): Two Trees, Domino, Edge & FARE Act Inventory | Wade Me Home",
  description:
    "No-fee Williamsburg apartments under the FARE Act, May 2026. Two Trees Domino & Williamsburg portfolio, 184 Kent, The Edge, Greenpoint Landing spillover, Two Trees North 6th — which buildings are reliably no-broker-fee, the South Williamsburg pre-war walkup gotchas, and how to verify no-fee on every listing before you tour.",
  keywords: [
    "williamsburg apartments no fee",
    "no fee apartments williamsburg",
    "williamsburg no broker fee",
    "no fee 11211",
    "no fee 11249",
    "no fee 11206",
    "Two Trees Williamsburg",
    "Domino Sugar no fee",
    "184 Kent no fee",
    "The Edge Williamsburg no fee",
    "Williamsburg waterfront no fee",
    "north williamsburg no fee",
    "south williamsburg no fee",
    "east williamsburg no fee",
    "Bedford Avenue no fee",
    "no fee Bedford stop",
    "no fee Marcy Avenue",
    "no fee Metropolitan G",
    "no fee L train williamsburg",
    "Williamsburg studio no fee",
    "Williamsburg 1 bedroom no fee",
    "FARE Act williamsburg",
    "Greenpoint Landing spillover",
    "Greystar williamsburg",
    "TF Cornerstone williamsburg",
    "no fee doorman williamsburg",
    "Williamsburg pre-war walkup no fee",
    "Williamsburg luxury no fee",
    "Williamsburg lease-up tower",
    "no fee Berry Street",
    "no fee Wythe Avenue",
    "no fee Driggs Avenue",
    "broker fee refund williamsburg",
    "DCWP williamsburg",
  ],
  openGraph: {
    title:
      "No-Fee Williamsburg Apartments (May 2026): Two Trees, Domino, Edge & FARE Act Inventory",
    description:
      "Under the FARE Act, landlord-hired brokers cannot charge tenants. This guide tracks no-broker-fee Williamsburg inventory — Two Trees Domino & North 6th portfolio, 184 Kent, The Edge, Greenpoint Landing spillover — plus the South Williamsburg pre-war walkup gotchas and how to verify no-fee on every listing.",
    url: `${baseUrl}/nyc/williamsburg/no-fee-apartments`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/williamsburg/no-fee-apartments`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "No-Fee Williamsburg Apartments (May 2026): Two Trees, Domino, The Edge & FARE Act Inventory",
    description:
      "Complete May 2026 guide to no-broker-fee Williamsburg apartments under the FARE Act. Two Trees Domino & North 6th, 184 Kent, The Edge, Greenpoint Landing spillover, sub-area breakdown (north / waterfront / south / east), pre-war walkup gotchas, and verification process.",
    datePublished: "2026-05-05",
    dateModified: "2026-05-05",
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
    mainEntityOfPage: `${baseUrl}/nyc/williamsburg/no-fee-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all Williamsburg apartments no-fee under the FARE Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No — the FARE Act only requires that whoever hired the broker pay the broker. The good news for Williamsburg specifically is that the dominant rental stock — Two Trees' Domino and North 6th portfolio, The Edge, 184 Kent, Williamsburg Walk, and the new Greenpoint Landing spillover towers — is owned by large management companies that lease directly through their own offices. That means no broker is involved at all and the FARE Act is automatic. Where Williamsburg gets murky is the South Williamsburg pre-war walkup tier (Berry / Driggs / Roebling east of South 4th) and the East Williamsburg warehouse conversions — small-landlord buildings sometimes hire a marketing broker and try to label the fee as 'admin', 'application', or 'move-in' to push it back to the tenant. Those labels are exactly what DCWP has been penalizing in 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Which Williamsburg buildings are reliably no-fee in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Five reliable no-fee tiers in Williamsburg as of May 2026. (1) Two Trees Management (Domino Sugar towers — One South First, 325 Kent; plus 60 South 11th, 60 Frost) leases directly through twotreesny.com — automatic no-fee. (2) The Edge (TF Cornerstone — 22 North 6th, 34 North 7th) leases through tfcornerstone.com — automatic no-fee. (3) Greenpoint Landing waterfront spillover (Park Tower at 30 Commercial, One Blue Slip, 50 Commercial) is reliably no-fee through Brookfield's leasing office, just over the Greenpoint border but Williamsburg-adjacent for renter-search purposes. (4) 184 Kent (Hudson at the Park) leases directly through Equity Residential — automatic no-fee. (5) Williamsburg Walk (Greystar / Stillwater portfolio along Roebling and Wythe) — reliably no-fee through Greystar's leasing platform. The 'verify per-listing' tier is the small-landlord brownstone walkups in South Williamsburg and the East Williamsburg warehouse conversions north of Metropolitan, which are landlord-hired-broker arrangements where the FARE Act technically applies but where some brokers still attempt fee labels.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify a Williamsburg apartment is no-fee before I apply?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three checks, each takes 30 seconds. (1) Check the listing source. If it's on Two Trees, TF Cornerstone, Greystar, Equity Residential, or Brookfield's own website, no-fee is guaranteed — no broker is involved at all. (2) On StreetEasy, RentHop, or Zillow, look at the 'Listed by' or 'Posted by' field. If the broker is shown as 'representing the landlord' or has the building's exclusive (typical for Two Trees Domino, The Edge, 184 Kent listings on StreetEasy), the tenant cannot be charged under the FARE Act — even though a broker is on the listing card. (3) Get it in writing before touring. Email or text the broker: 'Confirming this is a landlord-paid listing under the FARE Act and there is no fee to me as the tenant.' If they push back or label any fee 'administrative' or 'application processing' over $20, screenshot the conversation. Those are exactly the labels DCWP has been flagging in 2026 enforcement actions, and the screenshot is your evidence package for the Violation Reporter.",
        },
      },
      {
        "@type": "Question",
        name: "Are no-fee Williamsburg apartments more expensive than fee-charging ones?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Slightly. The post-FARE-Act rent adjustment is well-documented in Brooklyn-North: StreetEasy and Zillow rental indices show Williamsburg asking rents up 6–8% YoY in landlord-listed market-rate units, with industry analysts attributing 2–3 percentage points of that to broker-fee pass-through into rent. On a $4,000 Williamsburg 1BR, that's roughly $100/mo. The math still favors tenants on a 1–2 year tenancy: $1,200/yr in higher rent vs. the $4,800 broker fee that no longer applies = ~$3,600 saved year one, $2,400 saved year two. Williamsburg has unusually deep no-fee inventory because Two Trees alone runs ~3,000+ units that lease directly without any broker, so unlike some neighborhoods you're not really choosing between 'no-fee at higher rent' and 'fee-charging at lower rent' — you're mostly choosing between large-management no-fee and small-landlord pre-war where fees are likely contested anyway. Negotiate the asking rent hard during May 2026 lease-ups; Two Trees has been giving 1 month free on 13-month leases at Domino.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Williamsburg apartment search rising in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three compounding factors. First, the FARE-Act-priced-out cohort that initially considered Manhattan ($4,200+ 1BR, broker fees) is rotating to Brooklyn-North where the same money buys a comparable apartment in a doorman waterfront tower without the fee — Williamsburg Domino at $3,600–$4,000 1BR is hitting that price band exactly. Second, the L-train post-2019-shutdown stigma is fully gone; 5-year-out-from-the-shutdown narrative has reset Williamsburg's transit reliability score to peer-Manhattan. Third, the new 2025–2026 lease-up wave (Greenpoint Landing's last three towers, Two Trees' final Domino phase, McCarren-adjacent 568 Driggs) is putting fresh inventory into the no-fee pipeline at exactly the moment FARE Act awareness peaks. The cumulative effect: 'williamsburg apartments' has been a +55% YoY query through April–May 2026.",
        },
      },
      {
        "@type": "Question",
        name: "What if a Williamsburg broker tries to charge me a fee anyway?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three options, in order of leverage. (1) Refuse and walk — Williamsburg has more no-fee inventory than ever (~3,000 Two Trees units alone) and the broker knows it. The South Williamsburg pre-war walkup tier is where the most contested fees show up; if you're willing to substitute to a Domino or Edge unit for the same money, you have all the leverage. (2) If you already paid, file a DCWP complaint. The agency has been issuing $5,000 repeat-offender penalties since January 2026 and has refunded over 1,500 fees since the law took effect. Most Williamsburg complaints have resolved in 6–10 weeks because the pattern (small-landlord broker, fee labeled 'admin' or 'application processing') is exactly what DCWP fast-tracks. Use our FARE Act Violation Reporter to draft a copy-paste DCWP complaint. (3) Parallel-track to small-claims court if the fee is over $5,000 — small-claims judgments in Brooklyn have routinely awarded the full fee plus interest plus the $50 filing fee. DCWP and small-claims tracks can run simultaneously.",
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
        name: "Williamsburg",
        item: `${baseUrl}/nyc/williamsburg`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "No-Fee Apartments",
        item: `${baseUrl}/nyc/williamsburg/no-fee-apartments`,
      },
    ],
  },
];

export default function WilliamsburgNoFeePage() {
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
              <Badge variant="outline">Williamsburg</Badge>
              <Badge variant="secondary">Brooklyn</Badge>
              <Badge variant="default">FARE Act compliant</Badge>
              <Badge variant="default">+55% YoY demand</Badge>
              <Badge variant="outline">Updated 2026-05-05</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              No-Fee Williamsburg Apartments: May 2026 FARE Act Inventory
              Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Williamsburg has unusually deep no-fee inventory because{" "}
              <span className="font-semibold text-foreground">
                Two Trees Management alone runs ~3,000 units across the
                Domino Sugar and North 6th portfolios
              </span>{" "}
              that lease directly without any broker — the FARE Act is
              automatic on every one of them. Add The Edge (TF Cornerstone),
              184 Kent (Equity), Williamsburg Walk (Greystar), and the
              Greenpoint Landing spillover towers, and the reliably-no-fee
              tier covers most of the active waterfront and North Side
              market-rate inventory in May 2026. This guide breaks down
              which Williamsburg buildings are reliably no-fee, the South
              Williamsburg pre-war walkup gotchas, the broker-fee-pass-
              through math after one year of the FARE Act, and how to
              verify no-fee on every listing before you tour.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed May 5, 2026 &middot; Inventory tier data
              reflects May 2026 lease-up activity from the major
              Williamsburg management companies and Brooklyn-North leasing
              offices
            </p>
          </header>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Williamsburg"
            latitude={40.7081}
            longitude={-73.9571}
            radiusMiles={0.9}
            limit={6}
            searchQuery="Williamsburg no fee apartments"
          />

          {/* ── FARE Act + Williamsburg Quick Read ────── */}
          <Card>
            <CardHeader>
              <CardTitle>The 60-second read on FARE Act + Williamsburg</CardTitle>
              <CardDescription>
                Why Williamsburg has more no-fee inventory than almost any
                other NYC neighborhood, and where the gotchas are
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
                tenants paid 12–15% of annual rent (about $4,800–$6,000 on
                a $4,000/mo Williamsburg 1BR) even when the landlord was
                the one who listed the unit. The FARE Act reverses that
                default.
              </p>
              <p>
                Williamsburg&apos;s structure makes the FARE Act
                particularly clean here:{" "}
                <span className="font-semibold text-foreground">
                  Two Trees, TF Cornerstone, Equity, Greystar, and
                  Brookfield collectively run more than half of the active
                  waterfront and North Side market-rate stock
                </span>{" "}
                — and they all lease directly through their own offices,
                so no broker is ever involved. The exception is the South
                Williamsburg pre-war walkup tier (Berry / Driggs / Roebling
                east of South 4th) and the East Williamsburg warehouse
                conversions, where small landlords sometimes engage a
                marketing broker and then try to push the fee back to the
                tenant under labels (&quot;administrative,&quot;
                &quot;application,&quot; &quot;move-in&quot;) that DCWP
                has been actively penalizing in 2026.
              </p>
              <p>
                As of May 2026, DCWP has refunded over 1,500 wrongly-charged
                broker fees since the law took effect, issued $5,000
                repeat-offender penalties (January 2026 onward), and added
                roughly 25 brokerage names per month to its public
                enforcement docket. The Second Circuit affirmed the law in
                September 2025; REBNY&apos;s appeal failed. The law is
                settled.
              </p>
            </CardContent>
          </Card>

          {/* ── No-Fee Building Tier Table ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg No-Fee Building Tier (May 2026)</CardTitle>
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
                      Two Trees Domino (One South First, 325 Kent, 60 South
                      11th)
                    </TableCell>
                    <TableCell>$3,800 – $4,400</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 mo on 13 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      The Edge (TF Cornerstone — 22 N 6th, 34 N 7th)
                    </TableCell>
                    <TableCell>$3,900 – $4,600</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0.5 – 1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      184 Kent (Hudson at the Park — Equity Residential)
                    </TableCell>
                    <TableCell>$4,000 – $4,700</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0 – 0.5 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Williamsburg Walk (Greystar — Roebling/Wythe portfolio)
                    </TableCell>
                    <TableCell>$3,500 – $4,200</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>0.5 mo on 12 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Greenpoint Landing spillover (Brookfield — Park Tower,
                      One Blue Slip)
                    </TableCell>
                    <TableCell>$3,700 – $4,500</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 – 1.5 mo on 13 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Two Trees North 6th portfolio (60 Frost, 568 Driggs)
                    </TableCell>
                    <TableCell>$3,400 – $4,000</TableCell>
                    <TableCell>
                      <Badge variant="default">Reliably no-fee</Badge>
                    </TableCell>
                    <TableCell>1 mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Williamsburg pre-war walkup (Berry / Driggs east
                      of S 4th)
                    </TableCell>
                    <TableCell>$2,800 – $3,400</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verify per-listing</Badge>
                    </TableCell>
                    <TableCell>
                      0 mo; many RGB-cap renewals (pre-1974)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Williamsburg warehouse conversion (Metropolitan/
                      Morgan)
                    </TableCell>
                    <TableCell>$3,000 – $3,800</TableCell>
                    <TableCell>
                      <Badge variant="outline">Verify per-listing</Badge>
                    </TableCell>
                    <TableCell>Variable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &quot;Reliably no-fee&quot; tiers list directly from the
                management company&apos;s own leasing office or website
                (twotreesny.com, tfcornerstone.com, eqr.com, greystar.com,
                brookfield.com), so no broker is involved at all and the
                FARE Act is automatic. &quot;Verify per-listing&quot; tiers
                are landlord-hired-broker arrangements where the FARE Act
                technically applies but where some brokers attempt fee
                labels (&quot;administrative,&quot; &quot;marketing,&quot;
                &quot;application&quot; over $20) that DCWP has been
                flagging.
              </p>
            </CardContent>
          </Card>

          {/* ── Sub-Area Map ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg Sub-Area No-Fee Map</CardTitle>
              <CardDescription>
                Where the reliably-no-fee buildings cluster, by ZIP and
                subway stop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-area</TableHead>
                    <TableHead>ZIP</TableHead>
                    <TableHead>Subway</TableHead>
                    <TableHead>No-fee density</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Williamsburg waterfront (Domino, 184 Kent, North 5th
                      Pier)
                    </TableCell>
                    <TableCell>11249</TableCell>
                    <TableCell>Bedford L · Greenpoint G</TableCell>
                    <TableCell>
                      <Badge variant="default">High</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      North Williamsburg / Bedford (The Edge, North 6th)
                    </TableCell>
                    <TableCell>11211</TableCell>
                    <TableCell>Bedford L</TableCell>
                    <TableCell>
                      <Badge variant="default">High</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Williamsburg / Marcy (pre-war walkup)
                    </TableCell>
                    <TableCell>11211 / 11249</TableCell>
                    <TableCell>Marcy J/M/Z · Hewes J/M</TableCell>
                    <TableCell>
                      <Badge variant="outline">Mixed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Williamsburg (warehouse conversion)
                    </TableCell>
                    <TableCell>11206 / 11211</TableCell>
                    <TableCell>Lorimer L · Graham L</TableCell>
                    <TableCell>
                      <Badge variant="outline">Mixed</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Williamsburg/Greenpoint border (Greenpoint Landing
                      spillover)
                    </TableCell>
                    <TableCell>11222 / 11249</TableCell>
                    <TableCell>Greenpoint G · ferry Pier 11</TableCell>
                    <TableCell>
                      <Badge variant="default">High</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Renter-search behavior treats the Williamsburg/Greenpoint
                border as a single market for waterfront 1BR shopping; the
                Greenpoint Landing towers (One Blue Slip, Park Tower at 30
                Commercial) are walkable to Bedford L and consistently
                appear in &quot;williamsburg apartments&quot; searches.
              </p>
            </CardContent>
          </Card>

          {/* ── Verification Process ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>How to verify no-fee on a Williamsburg listing</CardTitle>
              <CardDescription>
                Three checks that take 30 seconds each, before you apply
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-3 pl-6">
                <li>
                  <strong>Check the listing source.</strong> If the listing
                  is on the management company&apos;s own website
                  (twotreesny.com, tfcornerstone.com, eqr.com,
                  greystar.com, brookfield.com), there is no broker
                  involved at all and FARE Act compliance is automatic.
                  Two Trees alone has roughly 3,000 Williamsburg units that
                  lease through their own portal — start there before you
                  ever look at StreetEasy.
                </li>
                <li>
                  <strong>Identify who is on the listing.</strong> On
                  StreetEasy, RentHop, or Zillow, look at the &quot;Listed
                  by&quot; or &quot;Posted by&quot; field. If the broker is
                  shown as &quot;representing the landlord&quot; or holds
                  the building&apos;s exclusive (typical for Two Trees
                  Domino, The Edge, 184 Kent listings on the major
                  aggregators), the tenant cannot be charged under the
                  FARE Act regardless of which broker showed you the unit.
                </li>
                <li>
                  <strong>Get it in writing before you tour.</strong> Email
                  or text the broker:{" "}
                  <span className="italic">
                    &quot;Confirming this is a landlord-paid listing under
                    the FARE Act and there is no fee to me as the
                    tenant.&quot;
                  </span>{" "}
                  If they push back or try to label any fee
                  &quot;administrative,&quot; &quot;marketing,&quot;
                  &quot;application processing&quot; over $20, or
                  &quot;move-in,&quot; screenshot the conversation. Those
                  labels are precisely what DCWP has been flagging in
                  2026 enforcement actions, and the screenshot is your
                  evidence package for our{" "}
                  <Link
                    href="/tools/fare-act-violation-reporter"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act Violation Reporter
                  </Link>
                  .
                </li>
              </ol>
              <Separator />
              <p className="text-xs">
                If you have already been charged, the Violation Reporter
                drafts a copy-paste DCWP complaint based on what you paid
                and who charged you. Most refunds resolve in 6–10 weeks
                once DCWP opens the file.
              </p>
            </CardContent>
          </Card>

          {/* ── Why Williamsburg No-Fee Search Is Up ──── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Why Williamsburg apartment search is up +55% YoY in May 2026
              </CardTitle>
              <CardDescription>
                Three compounding factors driving Brooklyn-North demand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>FARE-Act-priced-out Manhattan rotation.</strong>{" "}
                  The cohort initially looking at $4,200+ Manhattan 1BR
                  with broker fees is rotating to Brooklyn-North where the
                  same money buys a comparable apartment in a doorman
                  waterfront tower without the fee. Williamsburg Domino at
                  $3,600–$4,000 1BR hits that price band exactly, with
                  views and amenities that compete directly with UWS or
                  East Village.
                </li>
                <li>
                  <strong>L-train post-shutdown stigma fully gone.</strong>{" "}
                  Five years out from the 2019 shutdown, the L-train
                  reliability narrative has fully reset to peer-Manhattan
                  trunk-line standards. Bedford L is now treated as
                  equivalent to a 14th Street stop for renter-search
                  purposes.
                </li>
                <li>
                  <strong>Lease-up wave timing.</strong> The 2025–2026
                  delivery wave (Greenpoint Landing&apos;s last three
                  towers, Two Trees&apos; final Domino phase, McCarren-
                  adjacent 568 Driggs) is putting fresh inventory into the
                  no-fee pipeline at exactly the moment FARE Act awareness
                  peaks. Memorial Day–Labor Day is when Brooklyn-North
                  lease-ups historically compress hardest.
                </li>
                <li>
                  <strong>Sub-area arbitrage.</strong> Renters who
                  initially target North Williamsburg (11211) but hit
                  $4,400+ asking rents are increasingly substituting to
                  Greenpoint Landing waterfront (Park Tower at 30
                  Commercial) or East Williamsburg warehouse conversions
                  (Lorimer L) for $400–$600/mo savings while still hitting
                  the same Bedford-L commute.
                </li>
                <li>
                  <strong>Concession depth.</strong> Two Trees has been
                  giving 1 month free on 13-month leases at Domino in the
                  May 2026 lease-up wave, which is unusually deep for a
                  building this central — net effective rent on a
                  $4,000/mo gross lease comes in at roughly $3,690/mo
                  after the concession spreads.
                </li>
              </ul>
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
                Ready to find a no-fee Williamsburg apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI concierge your budget, waterfront vs. North
                Side preference, and which Williamsburg sub-area
                (Bedford L, waterfront, South, East, Greenpoint border) —
                we&apos;ll surface only FARE Act-compliant, landlord-
                listed inventory with the exact concession terms.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Williamsburg+no+fee+apartments&lat=40.7081&lng=-73.9571&maxRent=4500">
                  Search no-fee Williamsburg apartments
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
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/greenpoint"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    No-Fee Upper West Side Apartments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    No-Fee Hoboken Apartments
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
