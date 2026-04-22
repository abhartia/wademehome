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
    "LIC Rent Prices (2026): Studio, 1BR, 2BR & 3BR in Long Island City | Wade Me Home",
  description:
    "Long Island City (LIC) rent prices for 2026 by unit size and sub-neighborhood. Studio, 1-bedroom, 2-bedroom, and 3-bedroom rent ranges for Court Square, Hunters Point, and Hallets Point plus price-per-square-foot benchmarks and concession-adjusted net effective rent.",
  keywords: [
    "LIC rent prices",
    "long island city rent prices",
    "long island city rent",
    "LIC rent",
    "LIC apartment rent",
    "long island city apartment rent",
    "LIC ny rent prices",
    "LIC studio rent",
    "LIC 1 bedroom rent",
    "LIC 2 bedroom rent",
    "LIC 3 bedroom rent",
    "court square rent prices",
    "hunters point rent prices",
    "hallets point rent prices",
    "LIC rent trends",
    "average rent LIC",
    "average rent long island city",
    "LIC price per square foot",
    "LIC net effective rent",
    "LIC concession",
    "no fee LIC apartments",
  ],
  openGraph: {
    title:
      "LIC Rent Prices (2026): Studio, 1BR, 2BR & 3BR in Long Island City",
    description:
      "Complete Long Island City (LIC) rent price breakdown by unit size and sub-neighborhood, with trends and price-per-square-foot benchmarks.",
    url: `${baseUrl}/nyc/long-island-city/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/long-island-city/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "LIC Rent Prices (2026): Studio, 1BR, 2BR & 3BR in Long Island City",
    description:
      "2026 Long Island City (LIC) rent prices by unit size and sub-neighborhood, historical rent trends, price-per-square-foot benchmarks, and concession-adjusted net effective rent math.",
    datePublished: "2026-04-21",
    dateModified: "2026-04-21",
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
    mainEntityOfPage: `${baseUrl}/nyc/long-island-city/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Long Island City (LIC) in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent in LIC in 2026 is approximately $2,900 for a studio, $3,500 for a 1-bedroom, $5,200 for a 2-bedroom, and $7,200 for a 3-bedroom — combining Court Square, Hunters Point, and Hallets Point. LIC is dominated by new-construction luxury towers, which pulls the average above most of Queens. Weighted toward Hunters Point waterfront, the 1-bedroom average rises to roughly $3,800, with view units commonly at $4,000–$4,400.",
        },
      },
      {
        "@type": "Question",
        name: "How has LIC rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LIC median 1-bedroom rent dropped to roughly $2,900 during the 2020–2021 pandemic low as luxury-tower occupancy softened and concessions of 2–3 months free became standard. The 2022 rebound was sharp (+17%), and 2023 continued climbing (+8%). 2024 and 2025 growth flattened to 1–3% annually as new waterfront supply (Hunters Point South, Hallets Point towers) absorbed demand. 2026 asking rents are approximately 25% above 2021 lows.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in LIC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LIC rent averages roughly $70 to $90 per square foot per year across all building types. Waterfront luxury towers in Hunters Point (1 Gotham Center, The Hayden, Hunters Point South) push $90 to $105 per square foot per year for skyline-facing units. Court Square interior towers average $75–$90/sq ft. Older walkup stock in inner LIC runs $55–$70/sq ft. For comparison, LIC is typically 15–20% cheaper per square foot than Midtown East and FiDi for equivalent amenity quality.",
        },
      },
      {
        "@type": "Question",
        name: "What is net effective rent in LIC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net effective rent is the gross rent minus the value of landlord concessions (free months) spread over the lease term. LIC has deeper concessions than almost any NYC neighborhood — waterfront lease-ups commonly offer 1 to 2 months free on 12- or 13-month leases. A listing at $3,800 gross with 2 months free on a 13-month lease has a net effective rent of $3,215 — 15.4% below the headline number. At renewal, landlords quote the gross rent, so budget for a potential increase if your lease bakes in a concession.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of LIC has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Older walkup stock on the inner blocks of Court Square (north of 36th Avenue, east of 21st Street) has the cheapest LIC rent — 1-bedrooms starting around $2,400–$2,800. These buildings lack amenities but offer $800–$1,200 monthly savings versus new construction. Among luxury towers, Hallets Point (at the northern LIC / Astoria border) averages $200–$400/month less than Hunters Point waterfront towers. Hunters Point skyline-view units command the highest LIC rents.",
        },
      },
      {
        "@type": "Question",
        name: "Are there no-fee apartments in LIC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — LIC has one of the highest concentrations of no-fee apartments in NYC. Most luxury towers have in-house leasing offices that don't charge broker fees. Under the 2025 NYC FARE Act, landlords now pay broker fees on most rentals regardless of building type. Expect transparent rent quotes with net effective math already calculated, plus standard move-in costs: first month, security deposit (one month max under NYC law), and a $100–$250 application fee.",
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
        name: "Long Island City",
        item: `${baseUrl}/nyc/long-island-city`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/long-island-city/rent-prices`,
      },
    ],
  },
];

export default function LICRentPricesPage() {
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
              <Badge variant="outline">Long Island City</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              LIC Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR in Long
              Island City
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Long Island City (LIC),
              Queens — by unit size, by sub-neighborhood (Court Square,
              Hunters Point, and Hallets Point), with 6-year historical trend
              context, price-per-square-foot benchmarks, and
              concession-adjusted net effective rent math. This is the
              companion reference to our full{" "}
              <Link
                href="/nyc/long-island-city"
                className="text-primary underline underline-offset-2"
              >
                Long Island City apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP codes 11101 and 11109
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>LIC Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$2,900</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$7,200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>LIC Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range from older walkups to waterfront towers
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
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">400–550</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">550–750</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">850–1,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                    <TableCell className="text-right">$9,500</TableCell>
                    <TableCell className="text-right">1,100–1,450</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Penthouse</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$11,000</TableCell>
                    <TableCell className="text-right">$18,000+</TableCell>
                    <TableCell className="text-right">1,200–2,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end reflects older walkup stock in inner Court Square
                without amenities. High end reflects waterfront skyline-view
                towers in Hunters Point. The median blends new construction
                and older stock, weighted toward the luxury-tower share that
                dominates LIC supply. Under NYC&apos;s 40× income rule, the
                median 1-bedroom requires roughly $140,000/year.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Neighborhood ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>LIC Rent Prices by Sub-Neighborhood</CardTitle>
              <CardDescription>
                Where you live inside LIC can mean $500–$1,000/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Neighborhood</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">Walk to Subway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hunters Point Waterfront
                    </TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">6–10 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Court Square (Inner)
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,900</TableCell>
                    <TableCell className="text-right">2–5 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Queens Plaza
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                    <TableCell className="text-right">3–6 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hallets Point (North)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">10–14 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Older Walkup Stock
                    </TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">5–10 min</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hunters Point Waterfront (Center Blvd / 48th Ave)
                </h3>
                <p>
                  The most expensive LIC rent bracket. Kent Avenue-style
                  luxury construction — full amenity packages (doorman, gym,
                  rooftop pool, coworking, pet spa), floor-to-ceiling windows,
                  and direct skyline views. Expect studios around $3,100,
                  1-bedrooms around $3,900, and 2-bedrooms around $5,800.
                  Concessions of 1–2 months free are common during lease-up
                  phases (Nov–Feb), effectively reducing rents 8–16%.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Court Square (Inner LIC)
                </h3>
                <p>
                  Court Square is LIC&apos;s transit hub — the 7, E, M, and G
                  converge at the same station. Rents here run $400–$500
                  below Hunters Point waterfront, and commutes are the
                  fastest (Grand Central in 6 minutes). 1-bedrooms average
                  $3,400. Best fit for renters who prioritize subway access
                  and commute speed over skyline views or waterfront lifestyle.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Queens Plaza (Under the Bridge)
                </h3>
                <p>
                  Queens Plaza has some of LIC&apos;s tallest towers and the
                  best multi-line subway access (N, W, E, M, R, 7 all within
                  5 minutes). Rents are comparable to Court Square at $3,500
                  for a 1-bedroom. The feel is more commercial than
                  residential, with heavier foot traffic and bridge views.
                  Good fit for commute-first renters.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hallets Point (North LIC / Astoria Border)
                </h3>
                <p>
                  Hallets Point sits on a peninsula at LIC&apos;s northern
                  edge. Newer waterfront towers offer waterfront walking
                  paths and NYC Ferry access. Rents undercut Hunters Point by
                  $200–$400 on comparable units (studios $2,700, 1-bedrooms
                  $3,300). The trade-off: longer walks to the subway (the
                  N/W at Astoria Blvd is 10+ minutes), so most residents
                  rely on the ferry or buses. If value per waterfront square
                  foot matters, Hallets Point wins.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Older Walkup Stock
                </h3>
                <p>
                  Pre-rezoning LIC has pockets of older walkup and small
                  apartment stock, particularly in the inner blocks north of
                  36th Avenue and east of 21st Street. Studios $2,200 and
                  1-bedrooms $2,600. These buildings lack modern amenities
                  but offer $800–$1,200 monthly savings versus new
                  construction. Most are managed by small landlords, so
                  listings rarely hit the major portals — in-person scouting
                  or AI-powered listing aggregation is the way to find them.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>LIC Rent Trend (2020–2026)</CardTitle>
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
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">&minus;14%</TableCell>
                    <TableCell>3-month free concessions standard</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">&minus;3%</TableCell>
                    <TableCell>Luxury tower occupancy softest</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">+17%</TableCell>
                    <TableCell>Post-pandemic return surge</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,675</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                    <TableCell>Peak luxury demand</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                    <TableCell>Waterfront supply absorbs demand</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>FARE Act shifts fees to landlords</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">&minus;2% (blended)</TableCell>
                    <TableCell>Concessions rising; blended avg pulled down</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                LIC rent tracked the steepest post-COVID rebound in Queens —
                luxury towers bottomed in 2021 and recovered 27% over two
                years. 2024–2026 growth has flattened as new Hunters Point
                South and Hallets Point towers have added thousands of
                lease-up-stage units, bringing back 1- and 2-month free
                concessions. 2026 blended asking rents reflect that
                concession re-entry: the gross quote is roughly $3,700, but
                net effective averages $3,500 on 12-month leases.
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
              <CardTitle>LIC Price Per Square Foot</CardTitle>
              <CardDescription>
                How to compare LIC listings apples-to-apples
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
                    <TableCell className="font-medium">
                      Waterfront Skyline Tower
                    </TableCell>
                    <TableCell className="text-right">$90–$105</TableCell>
                    <TableCell className="text-right">550–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Court Square Luxury Tower
                    </TableCell>
                    <TableCell className="text-right">$75–$90</TableCell>
                    <TableCell className="text-right">550–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Converted Industrial Loft
                    </TableCell>
                    <TableCell className="text-right">$65–$80</TableCell>
                    <TableCell className="text-right">700–1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Older Walkup (Inner LIC)
                    </TableCell>
                    <TableCell className="text-right">$55–$70</TableCell>
                    <TableCell className="text-right">450–600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Price per square foot reveals actual value. A $3,800/month
                1-bedroom at 550 sq ft costs $83/sq ft/year. The same rent
                at 700 sq ft in a converted loft costs $65/sq ft/year — 22%
                better value on a per-square-foot basis. Converted
                industrial buildings generally offer the most space for the
                dollar in LIC. Skyline-facing Hunters Point units are the
                highest $/sq ft bracket, and the skyline premium over
                side-facing units averages $300–$600/month.
              </p>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in LIC</CardTitle>
              <CardDescription>
                LIC has the deepest concessions in NYC — here&apos;s the math
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                LIC luxury towers routinely advertise &quot;net effective
                rent&quot; — the monthly rent averaged over the lease term
                after spreading out free months. Gross rent is what you pay
                each month the landlord bills. Net effective is the true
                economic cost. At renewal, landlords typically quote gross
                rent, so budget for a potential increase if your lease bakes
                in a concession.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gross Rent</TableHead>
                    <TableHead>Free Months / Lease</TableHead>
                    <TableHead className="text-right">Net Effective</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>1 month / 12-mo</TableCell>
                    <TableCell className="text-right">$3,483</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>2 months / 12-mo</TableCell>
                    <TableCell className="text-right">$3,167</TableCell>
                    <TableCell className="text-right">16.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,800</TableCell>
                    <TableCell>2 months / 13-mo</TableCell>
                    <TableCell className="text-right">$3,215</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200</TableCell>
                    <TableCell>1 month / 12-mo</TableCell>
                    <TableCell className="text-right">$3,850</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200</TableCell>
                    <TableCell>2 months / 12-mo</TableCell>
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
                . A 13-month lease with 2 months free on $4,200 gross
                delivers a $3,554 net effective rent (15.4% discount). LIC
                offers the deepest concessions in NYC, especially in
                November–February. Walkup stock rarely offers concessions —
                deep discounts are a luxury-tower-only phenomenon.
              </p>
              <p>
                Read our{" "}
                <Link
                  href="/blog/negotiating-rent-and-lease-terms"
                  className="text-primary underline underline-offset-2"
                >
                  lease negotiation guide
                </Link>{" "}
                for tactics to surface or extend concessions at LIC lease-up
                offices.
              </p>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>LIC Rent FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the average rent in Long Island City in 2026?
                </h3>
                <p>
                  Approximately $2,900 for a studio, $3,500 for a
                  1-bedroom, $5,200 for a 2-bedroom, and $7,200 for a
                  3-bedroom — averaging all sub-neighborhoods. Weighted
                  toward Hunters Point waterfront (which has more listings
                  and higher prices), the 1-bedroom average is closer to
                  $3,800.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How has LIC rent changed over the last 5 years?
                </h3>
                <p>
                  LIC 1-bedroom median rent fell to $2,900 during the
                  2020–2021 pandemic low, then recovered sharply: up 17% in
                  2022, 8% in 2023, and roughly 1–2% annually since. 2026
                  blended asking rent has softened slightly as concessions
                  return at Hunters Point South and Hallets Point lease-ups.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the price per square foot in LIC?
                </h3>
                <p>
                  Roughly $70 to $90 per square foot per year on average.
                  Waterfront Hunters Point skyline towers run $90–$105/sq
                  ft. Court Square luxury towers run $75–$90/sq ft. Older
                  walkups and converted lofts run $55–$80/sq ft. Converted
                  industrial units are usually the best value on a
                  per-square-foot basis.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Which part of LIC has the cheapest rent?
                </h3>
                <p>
                  Older walkup stock in inner Court Square (north of 36th
                  Avenue, east of 21st Street) has the cheapest rent —
                  1-bedrooms starting at $2,600. Among luxury towers,
                  Hallets Point is $200–$400/month cheaper than Hunters
                  Point waterfront on comparable units.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Why is LIC more expensive than Astoria?
                </h3>
                <p>
                  LIC is dominated by post-2010 luxury towers; Astoria is
                  dominated by pre-war walkups and mid-rise buildings. The
                  amenity-and-construction premium is built into LIC rents
                  — a luxury 1-bedroom with doorman, gym, rooftop, and
                  in-unit laundry in LIC runs $3,500–$3,900, versus
                  $2,600–$3,000 for a walkup 1-bedroom in Astoria with the
                  same square footage. LIC also has faster Midtown commutes
                  (6 min to Grand Central on the 7) than most Astoria
                  stops (15–25 min via the N/W).
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there no-fee apartments in LIC?
                </h3>
                <p>
                  Yes — LIC has the highest concentration of no-fee
                  apartments in NYC. Most luxury towers have in-house
                  leasing offices that don&apos;t charge broker fees. Under
                  the 2025 NYC FARE Act, landlords now pay broker fees on
                  most rentals, including older walkup stock. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>{" "}
                  for what fees you can and cannot be charged.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search LIC Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and unit size in plain English — our
                AI will surface LIC listings matching your rent ceiling
                across Court Square, Hunters Point, and Hallets Point.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related LIC &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City Apartments: Full Neighborhood Guide
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
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Rent &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Rent Prices (2026)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices (2026)
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
                    href="/cost-of-moving-to-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Cost of Moving to NYC (2026)
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
