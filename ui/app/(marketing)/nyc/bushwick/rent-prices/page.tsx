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
    "Bushwick Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown | Wade Me Home",
  description:
    "Bushwick, Brooklyn rent prices for 2026 by unit size and sub-area. Studio, 1-bedroom, 2-bedroom, and 3-bedroom rent ranges for Morgan/Jefferson, Central Bushwick, Ridgewood border, and Broadway corridor, with price-per-square-foot benchmarks and loft market analysis.",
  keywords: [
    "bushwick rent prices",
    "bushwick brooklyn rent prices",
    "bushwick rent",
    "bushwick brooklyn rent",
    "bushwick apartment rent",
    "bushwick ny rent prices",
    "bushwick studio rent",
    "bushwick 1 bedroom rent",
    "bushwick 2 bedroom rent",
    "bushwick 3 bedroom rent",
    "average rent bushwick",
    "morgan l train rent",
    "jefferson l train rent",
    "bushwick loft rent",
    "bushwick rent trends",
    "bushwick price per square foot",
    "bushwick net effective rent",
    "bushwick vs williamsburg rent",
    "cheap bushwick apartments",
    "affordable bushwick rent",
  ],
  openGraph: {
    title:
      "Bushwick Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete Bushwick, Brooklyn rent price breakdown by unit size and sub-area, with historical trends and loft market benchmarks.",
    url: `${baseUrl}/nyc/bushwick/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/bushwick/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Bushwick Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "2026 Bushwick rent prices by unit size and sub-area, 6-year historical rent trends, price-per-square-foot benchmarks, loft-market math, and concession-adjusted net effective rent.",
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
    mainEntityOfPage: `${baseUrl}/nyc/bushwick/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Bushwick, Brooklyn in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent for a Bushwick apartment in 2026 is approximately $2,100 for a studio, $2,700 for a 1-bedroom, $3,400 for a 2-bedroom, and $4,500 for a 3-bedroom — across the whole neighborhood. Weighted toward the Morgan/Jefferson L-train corridor (the most-rented zone), the 1-bedroom average rises to around $2,900. Deeper in central Bushwick and toward the Ridgewood border, a 1-bedroom averages closer to $2,500.",
        },
      },
      {
        "@type": "Question",
        name: "How has Bushwick rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bushwick median 1-bedroom rent dropped to approximately $2,150 during the 2020 pandemic, then rebounded steeply as Williamsburg renters migrated east for space and lofts — up 15% in 2022 and 8% in 2023. Growth slowed to 2–3% annually through 2025–2026 as Ridgewood and deeper Brooklyn absorbed price-sensitive demand. From 2020 lows to 2026 asking rents, Bushwick 1-bedroom rent has risen roughly 26%.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in Bushwick?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bushwick rent averages roughly $55 to $80 per square foot per year across the whole neighborhood. New-construction amenity buildings near Morgan and Jefferson L stops push $80 to $95 per square foot per year. Converted industrial lofts (the neighborhood's defining stock) run $45 to $65 per square foot per year — the best $/sq ft value on the L train. On a per-square-foot basis, Bushwick is roughly 25–35% cheaper than Williamsburg.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a Bushwick loft cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bushwick converted industrial lofts range from $2,400 for a small 650 sq ft 1-bedroom to $6,500+ for a 2,000+ sq ft 3- or 4-bedroom loft with roof access. The median 2-bedroom loft rents for roughly $3,600. The defining stock in Bushwick sits along the L train between Morgan Avenue and Halsey Street — former knitting mills, industrial bakeries, and printing plants converted to residential lofts. Ceiling heights of 12–16 feet and floor plates of 700–1,500+ sq ft are common.",
        },
      },
      {
        "@type": "Question",
        name: "Is Bushwick cheaper than Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Bushwick is approximately 20–25% cheaper than Williamsburg on comparable units. The 1-bedroom median in Bushwick is $2,700 versus $3,400 in Williamsburg. The gap widens when comparing East Williamsburg to central Bushwick: a 1-bedroom on the Morgan L is often $800–$1,000/month cheaper than a comparable Bedford L apartment, despite being only 2 stops apart on the same train line. Bushwick is the best-value L-train neighborhood for Manhattan commuters.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of Bushwick has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Ridgewood border (east of Wyckoff Avenue, south of Myrtle Avenue) and the Broadway corridor (J/M/Z trains rather than L) have the cheapest Bushwick rent — studios start at $1,800 and 1-bedrooms at $2,200. These sub-areas are 15–20 minutes deeper into Brooklyn than the Morgan L corridor and have less concentrated nightlife/restaurant density, but the rent discount is substantial.",
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
        name: "Bushwick",
        item: `${baseUrl}/nyc/bushwick`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/bushwick/rent-prices`,
      },
    ],
  },
];

export default function BushwickRentPricesPage() {
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
              <Badge variant="outline">Bushwick</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Bushwick Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR Breakdown
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Bushwick, Brooklyn —
              by unit size, by sub-area (Morgan/Jefferson L corridor,
              Central Bushwick, Ridgewood border, Broadway J/M/Z corridor),
              with 6-year historical trend context, loft-market pricing,
              price-per-square-foot benchmarks, and concession-adjusted
              net effective rent math. This is the companion reference to
              our full{" "}
              <Link
                href="/nyc/bushwick"
                className="text-primary underline underline-offset-2"
              >
                Bushwick apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP codes 11221, 11237, and 11207
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Bushwick Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$2,100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$2,700</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range including walkups, lofts, and new-construction
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
                    <TableCell className="text-right">$1,700</TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">350–500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">500–750</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,600</TableCell>
                    <TableCell className="text-right">700–1,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                    <TableCell className="text-right">950–1,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom / Large Loft</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                    <TableCell className="text-right">$9,500+</TableCell>
                    <TableCell className="text-right">1,300+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end represents pre-war walkups on interior blocks near
                the Ridgewood border or deeper into Broadway. High end
                represents new-construction amenity buildings near Morgan
                Avenue and Jefferson Street or renovated loft buildings
                with roof access. Bushwick 4+ bedroom stock is heavily
                loft-dominated — these are converted industrial spaces with
                3,000+ sq ft floor plates and 12–16 ft ceilings.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Area ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Rent Prices by Sub-Area</CardTitle>
              <CardDescription>
                Where you live inside Bushwick can mean $700+/month
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
                      Morgan / Jefferson L Corridor
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Central Bushwick (Knickerbocker / Wilson Ave)
                    </TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Ridgewood Border (Halsey / Wyckoff)
                    </TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Broadway J/M/Z Corridor
                    </TableCell>
                    <TableCell className="text-right">$1,800</TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Morgan / Jefferson L Corridor (The Defining Bushwick Zone)
                </h3>
                <p>
                  The most rented and most expensive Bushwick zone. This is
                  where the converted industrial lofts, new-construction
                  amenity buildings, and restaurant/nightlife density all
                  cluster. Expect studios around $2,300, 1-bedrooms around
                  $2,900, and 2-bedrooms around $3,700. The L train at
                  Morgan and Jefferson puts you 2 stops from Bedford
                  (Williamsburg) and 4 stops from 14th Street–Union Square.
                  Concessions (typically 0.5–1 month free) appear in
                  newer-construction amenity buildings, especially in
                  winter months.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Central Bushwick (Knickerbocker / Wilson Avenue)
                </h3>
                <p>
                  The residential interior — Knickerbocker Avenue, Wilson
                  Avenue, and the side streets between them. Mostly older
                  Brooklyn walkup stock with smaller floor plates. Studios
                  average $2,000 and 1-bedrooms $2,600. The DeKalb L and
                  Halsey L stations serve this area. No amenities, more
                  character, and a stronger sense of the legacy
                  neighborhood before Bushwick&apos;s 2015+ transformation.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Ridgewood Border (Halsey / Wyckoff / Myrtle)
                </h3>
                <p>
                  East of Wyckoff Avenue, Bushwick transitions into
                  Ridgewood (Queens). Studios average $1,900 and 1-bedrooms
                  $2,400 — the second-cheapest Bushwick zone. The Halsey L
                  stop is the main commute option. If you want Bushwick
                  rents with Ridgewood-adjacent quieter streets, this is
                  the target area. Also consider our{" "}
                  <Link
                    href="/nyc/greenpoint/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint rent prices
                  </Link>{" "}
                  guide for a Brooklyn waterfront comparison.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Broadway J/M/Z Corridor
                </h3>
                <p>
                  The Broadway spine (southern Bushwick along the elevated
                  J/M/Z tracks) has the cheapest Bushwick rents — studios
                  from $1,800 and 1-bedrooms from $2,300. The J/M/Z
                  commute to Manhattan is slower than the L but lands you
                  at Essex-Delancey (Lower East Side) or Fulton Street.
                  The area is working-class residential with older
                  Brooklyn walkups. This corridor is the true value play
                  for renters prioritizing absolute price over amenities
                  or nightlife access.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Rent Trend (2020–2026)</CardTitle>
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
                    <TableCell className="text-right">$2,150</TableCell>
                    <TableCell className="text-right">&minus;9%</TableCell>
                    <TableCell>Pandemic dip</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,250</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Recovery begins</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,580</TableCell>
                    <TableCell className="text-right">+15%</TableCell>
                    <TableCell>Williamsburg spillover</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$2,780</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                    <TableCell>New construction lease-up</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$2,680</TableCell>
                    <TableCell className="text-right">&minus;4%</TableCell>
                    <TableCell>Supply outpaced demand</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$2,680</TableCell>
                    <TableCell className="text-right">0%</TableCell>
                    <TableCell>Stabilized</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Flat growth</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Bushwick is the only Brooklyn neighborhood in our tracking
                set where 2024 median rents actually declined year-over-year
                — new-construction supply along the L corridor temporarily
                outpaced demand. 2025 stabilized, and 2026 YTD shows flat
                1% growth. This is a pro-tenant market right now with
                concessions more common than they were in 2022–2023.
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

          {/* ── Loft Market ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Loft Rent: What to Expect</CardTitle>
              <CardDescription>
                Converted industrial stock is Bushwick&apos;s defining rental product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Bushwick has more converted industrial lofts than any other
                NYC neighborhood. These are former knitting mills, printing
                plants, industrial bakeries, and warehouse buildings —
                mostly along the L train between Morgan Avenue and
                Halsey Street. Ceiling heights of 12–16 feet, exposed
                brick, timber columns, and concrete floors are standard.
                Floor plates range from 700 sq ft (shared live/work
                arrangements) to 3,000+ sq ft (group-house or commercial
                loft conversions).
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loft Type</TableHead>
                    <TableHead className="text-right">Median Rent</TableHead>
                    <TableHead className="text-right">Typical Sq Ft</TableHead>
                    <TableHead className="text-right">$/sq ft / year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Small Loft (studio/1BR)</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">650</TableCell>
                    <TableCell className="text-right">$44</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mid Loft (2BR)</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">1,000</TableCell>
                    <TableCell className="text-right">$43</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Large Loft (3BR)</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">1,400</TableCell>
                    <TableCell className="text-right">$43</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mega Loft (4BR+)</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">2,000+</TableCell>
                    <TableCell className="text-right">$39</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Bushwick loft $/sq ft is roughly half of what comparable
                Manhattan loft product costs. Important caveats: not all
                Bushwick lofts are legal residential (some are classified
                as commercial with a Loft Law residential allowance — ask
                for the building&apos;s Certificate of Occupancy). Heating
                and cooling large industrial floor plates can add $200–$400
                to monthly utility costs versus standard walkup stock.
              </p>
            </CardContent>
          </Card>

          {/* ── Price Per Square Foot ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Price Per Square Foot</CardTitle>
              <CardDescription>
                How to compare Bushwick listings apples-to-apples
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
                      New Construction (Morgan / Jefferson)
                    </TableCell>
                    <TableCell className="text-right">$80–$95</TableCell>
                    <TableCell className="text-right">450–600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Renovated Loft
                    </TableCell>
                    <TableCell className="text-right">$55–$75</TableCell>
                    <TableCell className="text-right">600–900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Raw / Semi-Raw Loft
                    </TableCell>
                    <TableCell className="text-right">$40–$55</TableCell>
                    <TableCell className="text-right">700–1,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-War Walkup</TableCell>
                    <TableCell className="text-right">$50–$70</TableCell>
                    <TableCell className="text-right">450–600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Raw and semi-raw lofts offer the best $/sq ft in Bushwick —
                $40–$55/sq ft/year. These tend to be less polished (exposed
                rough surfaces, shared utility infrastructure, landlord
                allows tenant-financed improvements) but you trade finish
                for 40–60% more floor area than equivalent-priced new
                construction.
              </p>
            </CardContent>
          </Card>

          {/* ── Bushwick vs. Williamsburg ─────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick vs. Williamsburg Rent</CardTitle>
              <CardDescription>
                The L-train arbitrage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparison</TableHead>
                    <TableHead className="text-right">Bushwick</TableHead>
                    <TableHead className="text-right">Williamsburg</TableHead>
                    <TableHead className="text-right">Diff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio median</TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">&minus;$600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1BR median</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">&minus;$700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2BR median</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">&minus;$1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      L-train stop (14th St)
                    </TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                    <TableCell className="text-right">12 min</TableCell>
                    <TableCell className="text-right">+10 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$/sq ft (avg)</TableCell>
                    <TableCell className="text-right">$55–$80</TableCell>
                    <TableCell className="text-right">$75–$95</TableCell>
                    <TableCell className="text-right">25% cheaper</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                The Bushwick-vs-Williamsburg trade is 10 extra minutes on
                the L train for $700/month in savings on a 1-bedroom.
                Annualized, that&apos;s $8,400 of rent savings for
                approximately 4,300 extra minutes of commute time per year
                — roughly $117/hour implicit value. For most renters, the
                trade is favorable until you start valuing the shorter
                commute highly (for parents with school-age children,
                early-hours workers, or people who commute 4–5 days per
                week into Manhattan).
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

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Bushwick</CardTitle>
              <CardDescription>
                What Morgan/Jefferson new-construction concessions save you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Bushwick new-construction amenity buildings (the post-2020
                stock near Morgan Avenue and Jefferson Street) routinely
                advertise &quot;net effective rent&quot; — the monthly rent
                averaged over the lease term after spreading out free
                months. Gross rent is what you pay each month the landlord
                bills. Net effective is the true economic cost.
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
                    <TableCell className="font-medium">$3,200</TableCell>
                    <TableCell>1 month</TableCell>
                    <TableCell className="text-right">$2,933</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,200</TableCell>
                    <TableCell>2 months</TableCell>
                    <TableCell className="text-right">$2,667</TableCell>
                    <TableCell className="text-right">16.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,600</TableCell>
                    <TableCell>1 month</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,600</TableCell>
                    <TableCell>2 months</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">16.7%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Raw and renovated lofts (the defining Bushwick product)
                rarely offer concessions — landlord margins are thinner
                on loft conversions. Walkup stock on Knickerbocker/Wilson
                also rarely offers concessions. Concessions concentrate
                in new-construction amenity buildings on the Morgan/Jefferson
                L corridor, especially in winter months.
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

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Bushwick Rent FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the average rent in Bushwick, Brooklyn in 2026?
                </h3>
                <p>
                  Approximately $2,100 for a studio, $2,700 for a
                  1-bedroom, $3,400 for a 2-bedroom, and $4,500 for a
                  3-bedroom — averaging all sub-areas. Weighted toward
                  Morgan/Jefferson (more listings), the 1-bedroom average
                  rises to roughly $2,900.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How has Bushwick rent changed over the last 5 years?
                </h3>
                <p>
                  Bushwick 1-bedroom median rent dropped to $2,150 during
                  the 2020 pandemic, then rebounded: up 15% in 2022, 8%
                  in 2023, and actually declined 4% in 2024 as new
                  construction supply outpaced demand. 2025 stabilized
                  and 2026 YTD is +1%. Peak-to-trough-to-peak swing is
                  about 26%.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the price per square foot in Bushwick?
                </h3>
                <p>
                  Roughly $55 to $80 per square foot per year on average.
                  New-construction near Morgan/Jefferson runs $80–$95.
                  Converted lofts — Bushwick&apos;s defining stock — run
                  $45–$65, the best $/sq ft on the L train.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How much does a Bushwick loft cost?
                </h3>
                <p>
                  Small lofts (studio/1BR, 650 sq ft) rent for roughly
                  $2,400. 2-bedroom lofts (1,000 sq ft) average $3,600.
                  Large 3-bedroom lofts (1,400 sq ft) rent for around
                  $5,000. Mega lofts (4BR+, 2,000+ sq ft) start at
                  $6,500.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Bushwick cheaper than Williamsburg?
                </h3>
                <p>
                  Yes — approximately 20–25% cheaper on comparable units.
                  A 1-bedroom on the Morgan L is often $800–$1,000/month
                  cheaper than a comparable Bedford L apartment, despite
                  being only 2 stops apart.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Which part of Bushwick has the cheapest rent?
                </h3>
                <p>
                  The Broadway J/M/Z corridor has the cheapest Bushwick
                  rent — studios from $1,800, 1-bedrooms from $2,300.
                  The Ridgewood border (Halsey/Wyckoff) is the
                  second-cheapest zone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Bushwick Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and unit size in plain English — our AI
                will surface Bushwick listings matching your rent ceiling
                across Morgan/Jefferson, Central Bushwick, the Ridgewood
                border, and the Broadway corridor.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Bushwick &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Apartments: Full Neighborhood Guide
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
                    href="/nyc/greenpoint/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint Rent Prices Breakdown
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
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Explained
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
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
