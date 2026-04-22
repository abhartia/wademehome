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
    "Greenpoint Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown | Wade Me Home",
  description:
    "Greenpoint, Brooklyn rent prices for 2026 by unit size and sub-neighborhood. Studio, 1-bedroom, 2-bedroom, and 3-bedroom rent ranges for the Waterfront, Franklin Street, Manhattan Avenue, and Nassau/Norman blocks, with price-per-square-foot benchmarks and concession-adjusted net effective rent.",
  keywords: [
    "greenpoint rent prices",
    "greenpoint brooklyn rent prices",
    "greenpoint rent",
    "greenpoint brooklyn rent",
    "greenpoint apartment rent",
    "greenpoint ny rent prices",
    "greenpoint studio rent",
    "greenpoint 1 bedroom rent",
    "greenpoint 2 bedroom rent",
    "greenpoint 3 bedroom rent",
    "average rent greenpoint",
    "greenpoint waterfront rent",
    "greenpoint landing rent",
    "eagle and west rent",
    "one blue slip rent",
    "franklin street greenpoint rent",
    "manhattan avenue rent",
    "greenpoint rent trends",
    "greenpoint price per square foot",
    "greenpoint net effective rent",
    "greenpoint vs williamsburg rent",
  ],
  openGraph: {
    title:
      "Greenpoint Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete Greenpoint, Brooklyn rent price breakdown by unit size and sub-area, with historical trends and price-per-square-foot benchmarks.",
    url: `${baseUrl}/nyc/greenpoint/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/greenpoint/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Greenpoint Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "2026 Greenpoint rent prices by unit size and sub-area, historical rent trends, price-per-square-foot benchmarks, and concession-adjusted net effective rent math.",
    datePublished: "2026-04-22",
    dateModified: "2026-04-22",
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
    mainEntityOfPage: `${baseUrl}/nyc/greenpoint/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Greenpoint, Brooklyn in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent for a Greenpoint apartment in 2026 is approximately $2,400 for a studio, $3,100 for a 1-bedroom, $4,300 for a 2-bedroom, and $5,800 for a 3-bedroom — across the whole neighborhood. Weighted toward the Greenpoint Waterfront (Greenpoint Landing, Eagle + West, One Blue Slip), 1-bedroom averages rise to around $3,500. On interior blocks off Manhattan Avenue and in older walkups, a 1-bedroom averages closer to $2,800.",
        },
      },
      {
        "@type": "Question",
        name: "How has Greenpoint rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenpoint median 1-bedroom rent dropped to approximately $2,450 in 2020 during the pandemic, then rebounded sharply — up 12% in 2022 as the waterfront towers Greenpoint Landing and Eagle + West leased up. Growth settled at 3–5% in 2023 and has flattened to 1–2% annually through 2026 as new supply (One Blue Slip, Huron Street towers) absorbed demand. From 2020 lows to 2026, Greenpoint 1-bedroom rent has risen roughly 26%.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in Greenpoint?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenpoint rent averages roughly $65 to $90 per square foot per year across the whole neighborhood. Waterfront luxury buildings (Greenpoint Landing, Eagle + West, One Blue Slip) push $95 to $110 per square foot per year. Older Brooklyn walkups and mid-rise rentals along Nassau and Norman Avenues run $55 to $75 per square foot per year. On a per-square-foot basis, Greenpoint is roughly 10–15% cheaper than comparable Williamsburg stock.",
        },
      },
      {
        "@type": "Question",
        name: "What is net effective rent in Greenpoint?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net effective rent is the gross rent minus the value of landlord concessions (free months) spread over the lease term. In Greenpoint waterfront buildings, a listing at $3,800/month with one month free on a 12-month lease has a net effective rent of $3,483 — an 8.3% discount. Two months free brings net effective rent roughly 16.7% below gross. When your lease renews, landlords typically quote the gross rent, so budget for potential increases at renewal.",
        },
      },
      {
        "@type": "Question",
        name: "Is Greenpoint cheaper than Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Greenpoint is approximately 8–10% cheaper than Williamsburg on comparable units. The 1-bedroom median in Greenpoint is about $3,100 versus roughly $3,400 in Williamsburg. The gap is biggest on the waterfront, where Williamsburg's Kent and Wythe Avenue towers run $400–$600/month more than equivalent Greenpoint Landing or One Blue Slip units. Greenpoint's subway access is also G-train only (no direct Manhattan), which functions as a permanent $300–$400/month discount.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of Greenpoint has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The interior blocks around Nassau Avenue, Norman Avenue, and the Russell Street corridor have the cheapest Greenpoint rent — studios start at $2,000 and 1-bedrooms at $2,600. These are older Brooklyn walkups with smaller floor plates and no amenities. The McGuinness Boulevard corridor is also a value area, though noise from the traffic is a trade-off.",
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
        name: "Greenpoint",
        item: `${baseUrl}/nyc/greenpoint`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/greenpoint/rent-prices`,
      },
    ],
  },
];

export default function GreenpointRentPricesPage() {
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
            <div className="flex items-center gap-2">
              <Badge variant="outline">Greenpoint</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Greenpoint Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR Breakdown
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Greenpoint, Brooklyn —
              by unit size, by sub-area (Waterfront, Franklin Street,
              Manhattan Avenue, and Nassau/Norman interior), with 6-year
              historical trend context, price-per-square-foot benchmarks,
              and concession-adjusted net effective rent math. This is the
              companion reference to our full{" "}
              <Link
                href="/nyc/greenpoint"
                className="text-primary underline underline-offset-2"
              >
                Greenpoint apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP code 11222
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Greenpoint Rent at a Glance (2026)</CardTitle>
              <CardDescription>
                Average asking rents across the whole neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$2,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,800</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range including interior walkups and waterfront towers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">Low</TableHead>
                    <TableHead className="text-right">Median</TableHead>
                    <TableHead className="text-right">High</TableHead>
                    <TableHead className="text-right">Typical Sq Ft</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">380–480</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">500–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">700–950</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$7,800</TableCell>
                    <TableCell className="text-right">950–1,250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$8,000</TableCell>
                    <TableCell className="text-right">$10,500+</TableCell>
                    <TableCell className="text-right">1,200+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end represents pre-war walkups on interior blocks off
                Manhattan Avenue and Nassau Avenue without amenities. High
                end represents full-service waterfront towers at Greenpoint
                Landing, Eagle + West, and One Blue Slip. The median
                reflects the weighted neighborhood average across all
                sub-areas. Studios under $2,200 are almost exclusively in
                older walkup stock; every new-construction studio rents
                above $2,500.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Area ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent Prices by Sub-Area</CardTitle>
              <CardDescription>
                Where you live inside Greenpoint can mean $800+/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Greenpoint Waterfront
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Franklin Street Corridor
                    </TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Manhattan Avenue
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Nassau / Norman (Interior)
                    </TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,750</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      McGuinness Corridor
                    </TableCell>
                    <TableCell className="text-right">$2,050</TableCell>
                    <TableCell className="text-right">$2,650</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Greenpoint Waterfront (Commercial St / Box St / India St /
                  Greenpoint Landing)
                </h3>
                <p>
                  The most expensive Greenpoint rent bracket. This is where
                  the post-2018 luxury construction concentrates —
                  Greenpoint Landing (a 10-building master-plan site along
                  Commercial Street and Newtown Creek), Eagle + West (two
                  towers at 470 Kent Street), and One Blue Slip (the first
                  Greenpoint Landing tower). Full amenity packages
                  (doorman, gym, rooftop, coworking, pet spa), sweeping
                  Manhattan skyline views across the East River, and NYC
                  Ferry service at the India Street landing.
                  Studios average $2,900, 1-bedrooms $3,700, and
                  2-bedrooms $5,100. Concessions of 1–2 months free are
                  common in winter months.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Franklin Street Corridor
                </h3>
                <p>
                  Franklin Street is Greenpoint&apos;s artisanal retail
                  spine — coffee roasters, natural-wine bars, Polish
                  bakeries, and vintage stores. Rents are $400–$500 lower
                  than the waterfront but still concentrate newer mid-rise
                  stock (boutique 20–40 unit buildings with roof decks).
                  Studios average $2,500 and 1-bedrooms $3,200. Walking
                  distance to McCarren Park and the Bedford L is 10–15
                  minutes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Manhattan Avenue (Central Greenpoint)
                </h3>
                <p>
                  Manhattan Avenue is the everyday commercial spine —
                  pharmacies, grocery stores, the Greenpoint G stop at
                  Manhattan Ave and Greenpoint Ave, and most of the
                  Polish-community businesses. Older 4–6 story mid-rise and
                  walkup stock dominates. Studios average $2,300 and
                  1-bedrooms $2,950. This is the best-value sub-area with
                  full neighborhood services within 2 blocks.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Nassau / Norman / Russell (Interior Residential)
                </h3>
                <p>
                  The quietest part of Greenpoint — purely residential
                  Brooklyn walkups on tree-lined streets between Nassau
                  Avenue and McCarren Park. Studios average $2,100 and
                  1-bedrooms $2,750. The Nassau G station is central.
                  No amenities in most buildings, but character: original
                  moldings, wood floors, old-Brooklyn stoops, and the
                  cheapest Greenpoint rents outside McGuinness.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  McGuinness Boulevard Corridor
                </h3>
                <p>
                  McGuinness is a six-lane traffic spine — loud, but the
                  cheapest Greenpoint rent. Studios average $2,050 and
                  1-bedrooms $2,650. If you&apos;re budget-sensitive and
                  can tolerate street noise on the west-facing units, this
                  corridor offers the best $/sq ft in the neighborhood.
                  Northwest-facing units toward Newtown Creek are quieter.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                Median 1-bedroom asking rent over the past 6 years
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Median 1BR Rent</TableHead>
                    <TableHead className="text-right">YoY Change</TableHead>
                    <TableHead>Context</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020 (COVID)</TableCell>
                    <TableCell className="text-right">$2,450</TableCell>
                    <TableCell className="text-right">&minus;10%</TableCell>
                    <TableCell>Pandemic dip</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,550</TableCell>
                    <TableCell className="text-right">+4%</TableCell>
                    <TableCell>Recovery begins</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,850</TableCell>
                    <TableCell className="text-right">+12%</TableCell>
                    <TableCell>Eagle + West lease-up</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$2,980</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Greenpoint Landing expands</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,050</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                    <TableCell>Supply absorbing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,080</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Flat growth</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Concessions returning</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Greenpoint rent dropped less than Williamsburg during
                2020–2021 because the neighborhood had less high-rise
                luxury supply at the time (Greenpoint Landing&apos;s Eagle +
                West and One Blue Slip leased up after 2021). The 2022
                rebound was amplified by waterfront supply finally coming
                online. 2024–2026 growth has flattened as additional
                Greenpoint Landing phases (Huron Street towers,
                Commercial Street infill) absorbed demand.
              </p>
              <p>
                For timing strategy — when to search, when to negotiate,
                when concessions are deepest — see our{" "}
                <Link
                  href="/best-time-to-rent-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  best time to rent NYC guide
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* ── Price Per Square Foot ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Price Per Square Foot</CardTitle>
              <CardDescription>
                How to compare Greenpoint listings apples-to-apples
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building Type</TableHead>
                    <TableHead className="text-right">$/sq ft / year</TableHead>
                    <TableHead className="text-right">Typical Sq Ft (1BR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Waterfront Luxury</TableCell>
                    <TableCell className="text-right">$95–$110</TableCell>
                    <TableCell className="text-right">550–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New Construction (Interior)
                    </TableCell>
                    <TableCell className="text-right">$80–$95</TableCell>
                    <TableCell className="text-right">500–650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Mid-Rise Rental (Franklin / Manhattan Ave)
                    </TableCell>
                    <TableCell className="text-right">$65–$85</TableCell>
                    <TableCell className="text-right">550–750</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-War Walkup</TableCell>
                    <TableCell className="text-right">$55–$75</TableCell>
                    <TableCell className="text-right">450–600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Price per square foot reveals actual value. A $3,400/month
                1-bedroom at 500 sq ft costs $82/sq ft/year. The same rent
                at 650 sq ft in an older mid-rise costs $63/sq ft/year —
                23% better value on a per-square-foot basis. Pre-war walkups
                on Nassau and Norman Avenues generally offer the most space
                for the dollar in Greenpoint.
              </p>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Greenpoint</CardTitle>
              <CardDescription>
                What waterfront concessions actually save you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Greenpoint waterfront buildings (Greenpoint Landing, Eagle +
                West, One Blue Slip) routinely advertise &quot;net
                effective rent&quot; — the monthly rent averaged over the
                lease term after spreading out free months. Gross rent is
                what you pay each month the landlord bills. Net effective
                is the true economic cost. At renewal, landlords typically
                quote gross rent, so budget for a potential increase if
                your lease bakes in a concession.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gross Rent</TableHead>
                    <TableHead>Free Months (12-mo lease)</TableHead>
                    <TableHead className="text-right">Net Effective</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>1 month</TableCell>
                    <TableCell className="text-right">$3,483</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>2 months</TableCell>
                    <TableCell className="text-right">$3,167</TableCell>
                    <TableCell className="text-right">16.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200</TableCell>
                    <TableCell>1 month</TableCell>
                    <TableCell className="text-right">$3,850</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200</TableCell>
                    <TableCell>2 months</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">16.7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Concession math:{" "}
                <span className="font-mono">
                  net = (gross × (lease months − free)) / lease months
                </span>
                . A 13-month lease with 2 months free on $3,800 gross
                delivers a $3,215 net effective rent (15.4% discount).
                Greenpoint Landing buildings offer the deepest concessions
                in the neighborhood, especially in November–February when
                demand is lowest. Walkup stock on Nassau and Norman rarely
                offers concessions.
              </p>
              <p>
                Read our{" "}
                <Link
                  href="/blog/negotiating-rent-and-lease-terms"
                  className="text-primary underline underline-offset-2"
                >
                  lease negotiation guide
                </Link>{" "}
                for tactics to surface or extend concessions.
              </p>
            </CardContent>
          </Card>

          {/* ── Greenpoint vs Williamsburg ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint vs. Williamsburg Rent</CardTitle>
              <CardDescription>
                Where Greenpoint wins on price, Williamsburg on amenities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparison</TableHead>
                    <TableHead className="text-right">Greenpoint</TableHead>
                    <TableHead className="text-right">Williamsburg</TableHead>
                    <TableHead className="text-right">Diff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Studio median
                    </TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">&minus;$300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1BR median</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">&minus;$300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2BR median</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">&minus;$100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Waterfront 1BR
                    </TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">&minus;$400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Subway lines
                    </TableCell>
                    <TableCell className="text-right">G only</TableCell>
                    <TableCell className="text-right">L, J, M, Z</TableCell>
                    <TableCell className="text-right">—</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Greenpoint&apos;s G-train-only subway access functions as a
                permanent $300–$400/month discount versus Williamsburg. If
                your commute terminates in Midtown or Downtown Manhattan,
                you need a transfer (G to L at Lorimer, or NYC Ferry). If
                you work in Downtown Brooklyn, Long Island City, or
                remotely, the G train is usually fine, and Greenpoint
                becomes the best-value neighborhood on the Brooklyn
                waterfront.
              </p>
              <p>
                See our full{" "}
                <Link
                  href="/nyc/williamsburg/rent-prices"
                  className="text-primary underline underline-offset-2"
                >
                  Williamsburg rent prices breakdown
                </Link>
                {" "}for a side-by-side comparison.
              </p>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the average rent in Greenpoint, Brooklyn in 2026?
                </h3>
                <p>
                  Approximately $2,400 for a studio, $3,100 for a
                  1-bedroom, $4,300 for a 2-bedroom, and $5,800 for a
                  3-bedroom — averaging all sub-areas. Weighted toward the
                  Greenpoint Waterfront (Greenpoint Landing, Eagle + West,
                  One Blue Slip), the 1-bedroom average rises to roughly
                  $3,500.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How has Greenpoint rent changed over the last 5 years?
                </h3>
                <p>
                  Greenpoint 1-bedroom median rent fell to approximately
                  $2,450 during the 2020 pandemic, then rebounded: up 12%
                  in 2022 as Eagle + West leased up, 5% in 2023, and
                  roughly 1–2% annually since. Peak-to-trough-to-peak
                  swing is about 26% — steep but less volatile than
                  Williamsburg&apos;s 31%.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the price per square foot in Greenpoint?
                </h3>
                <p>
                  Roughly $65 to $90 per square foot per year on average.
                  Waterfront luxury stock (Greenpoint Landing, Eagle + West,
                  One Blue Slip) runs $95–$110/sq ft. Older walkups and
                  mid-rise on Nassau, Norman, and Manhattan Avenue run
                  $55–$75/sq ft. Converted industrial lofts and loft-style
                  walkups are usually the best value.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Greenpoint cheaper than Williamsburg?
                </h3>
                <p>
                  Yes — approximately 8–10% cheaper on comparable units.
                  Greenpoint 1-bedroom median is $3,100 versus $3,400 in
                  Williamsburg. The gap is largest on the waterfront,
                  where Williamsburg towers run $400–$600/month more than
                  equivalent Greenpoint Landing units. G-train-only
                  subway access adds another permanent $300–$400/month
                  discount.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Which part of Greenpoint has the cheapest rent?
                </h3>
                <p>
                  Nassau Avenue, Norman Avenue, and the Russell Street
                  corridor (interior residential Greenpoint) have the
                  cheapest rent — studios starting at $2,000 and
                  1-bedrooms at $2,600. The McGuinness Boulevard corridor
                  is also value-priced, though traffic noise on
                  west-facing units is a trade-off.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Why is the Greenpoint Waterfront so much more expensive?
                </h3>
                <p>
                  The Greenpoint Waterfront has the newest building stock
                  (all post-2018), the best amenities (rooftop pools,
                  coworking, dog spas), Manhattan skyline views, NYC
                  Ferry service at India Street, and Transmitter Park
                  directly adjacent. Supply is constrained by the
                  waterfront footprint and the Greenpoint Landing phasing
                  schedule. The combination pushes rent $700–$900/month
                  above interior Greenpoint on comparable unit sizes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Greenpoint Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and unit size in plain English — our AI
                will surface Greenpoint listings matching your rent
                ceiling across all sub-areas, from the waterfront to
                Manhattan Avenue.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Greenpoint &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/greenpoint"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint Apartments: Full Neighborhood Guide
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
                    href="/nyc/long-island-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Prices, Commutes &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Apartments: Full Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent an Apartment in NYC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act: Broker Fee Ban Explained
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    Negotiating Rent &amp; Lease Terms in NYC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Explained
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
