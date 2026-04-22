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
    "Astoria Rent Prices (2026): Average Rent in Astoria, Queens | Wade Me Home",
  description:
    "Average rent in Astoria, Queens for 2026. Studio, 1-bedroom, 2-bedroom, and 3-bedroom rent prices across Ditmars, Astoria Heights, the waterfront, and Steinway — plus price-per-square-foot benchmarks and how-much-is-rent-in-Astoria context.",
  keywords: [
    "astoria rent prices",
    "astoria average rent",
    "average rent in astoria",
    "how much is rent in astoria",
    "astoria apartment rent",
    "astoria queens rent prices",
    "astoria queens rent",
    "astoria ny rent prices",
    "astoria rent",
    "astoria studio rent",
    "astoria 1 bedroom rent",
    "astoria 2 bedroom rent",
    "astoria 3 bedroom rent",
    "ditmars rent prices",
    "astoria heights rent",
    "steinway rent prices",
    "astoria rent trends",
    "astoria price per square foot",
    "astoria net effective rent",
    "cheap apartments astoria",
    "no fee astoria apartments",
  ],
  openGraph: {
    title:
      "Astoria Rent Prices (2026): Average Rent in Astoria, Queens",
    description:
      "Complete Astoria, Queens rent price breakdown by unit size and sub-neighborhood (Ditmars, Astoria Heights, Waterfront, Steinway), with trends and price-per-square-foot benchmarks.",
    url: `${baseUrl}/nyc/astoria/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/astoria/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Astoria Rent Prices (2026): Average Rent in Astoria, Queens",
    description:
      "2026 Astoria, Queens rent prices by unit size and sub-neighborhood, historical rent trends, price-per-square-foot benchmarks, and concession-adjusted net effective rent math.",
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
    mainEntityOfPage: `${baseUrl}/nyc/astoria/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Astoria, Queens in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent in Astoria in 2026 is approximately $1,950 for a studio, $2,500 for a 1-bedroom, $3,200 for a 2-bedroom, and $4,200 for a 3-bedroom. Ditmars and the waterfront run above average; east of Steinway Street and south of Broadway run below. Astoria is typically $800–$1,000/month cheaper than a comparable Williamsburg unit and $900–$1,300/month cheaper than LIC for similar apartment sizes.",
        },
      },
      {
        "@type": "Question",
        name: "How much is rent in Astoria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rent in Astoria ranges from $1,600 for a cheap studio in an older building east of Steinway Street up to $4,500 for a 3-bedroom in a new-construction building near the waterfront or Ditmars. The median 1-bedroom is $2,500, the median 2-bedroom is $3,200. Walkup stock (5-story buildings without elevators or doormen) consistently runs $300–$500/month cheaper than mid-rise buildings in the same area.",
        },
      },
      {
        "@type": "Question",
        name: "How has Astoria rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Astoria median 1-bedroom rent dropped to roughly $1,800 during the 2020–2021 pandemic low, then recovered steadily: up 14% in 2022, 8% in 2023, and roughly 4% annually since. 2026 asking rents are approximately 38% above 2021 lows. Unlike luxury-tower neighborhoods (LIC, Williamsburg), Astoria didn't overshoot: most of the gain reflects genuine demand for walkup and mid-rise stock, not developer concession games.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in Astoria?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Astoria rent averages roughly $55 to $70 per square foot per year across all building types. New-construction mid-rises along 31st Avenue and the waterfront run $65–$80/sq ft. Converted lofts and newer walkup stock run $55–$65/sq ft. Older pre-war walkups east of Steinway Street run $45–$55/sq ft. For comparison, Astoria is 30–40% cheaper per square foot than LIC and 25–35% cheaper than Williamsburg.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of Astoria has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "East of Steinway Street (especially around the M/R stop and south toward Broadway) has the cheapest Astoria rent. Studios start below $1,600 and 1-bedrooms start below $2,000 in older walkup stock. The trade-off is a longer commute — the R train adds 10–15 minutes to Midtown vs. the N/W at 30th Avenue. South of 34th Avenue (Astoria Heights) is the second-cheapest area, with 1-bedrooms averaging $2,100.",
        },
      },
      {
        "@type": "Question",
        name: "Is Astoria cheaper than Williamsburg and LIC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — significantly. A 1-bedroom in Astoria averages $2,500, vs. $3,400 in Williamsburg and $3,500 in LIC. The monthly savings are $800–$1,000 for a comparable walkup unit, and $1,000–$1,500 if you compare amenity building to amenity building (Astoria simply has far fewer doorman/gym towers). Astoria also keeps your commute competitive: the N/W from 30th Avenue reaches Times Square in 25 minutes, vs. 18 minutes from Court Square LIC and 15 minutes from Bedford Williamsburg.",
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
        name: "Astoria",
        item: `${baseUrl}/nyc/astoria`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/astoria/rent-prices`,
      },
    ],
  },
];

export default function AstoriaRentPricesPage() {
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
              <Badge variant="outline">Astoria</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Astoria Rent Prices (2026): Average Rent in Astoria, Queens
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Astoria, Queens — by
              unit size, by sub-neighborhood (Ditmars, Astoria Heights, the
              Waterfront, and east of Steinway), with 6-year historical
              trend context, price-per-square-foot benchmarks, and Astoria
              vs. LIC/Williamsburg comparison. This is the companion
              reference to our full{" "}
              <Link
                href="/nyc/astoria"
                className="text-primary underline underline-offset-2"
              >
                Astoria apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP codes 11102, 11103, 11105, 11106
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Astoria Average Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$1,950</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$2,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range from older walkups to new construction
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
                    <TableCell className="text-right">$1,600</TableCell>
                    <TableCell className="text-right">$1,950</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">350–475</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">500–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">750–1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">1,000–1,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                    <TableCell className="text-right">1,300+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end reflects older 4- and 5-story walkup stock east of
                Steinway Street or south of Broadway. High end reflects
                new-construction mid-rise buildings along 31st Avenue, near
                Ditmars, or at the waterfront (Hallets Cove). Under NYC&apos;s
                40× income rule, the median 1-bedroom requires roughly
                $100,000/year — Astoria is one of the few NYC neighborhoods
                where a solo earner under $100k can qualify on their own.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Neighborhood ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria Rent Prices by Sub-Neighborhood</CardTitle>
              <CardDescription>
                Where you live inside Astoria can mean $400–$800/month
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
                      Ditmars / 30th Avenue
                    </TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">2–6 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Waterfront (Hallets Cove / Vernon)
                    </TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">8–14 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Central Astoria (31st St)
                    </TableCell>
                    <TableCell className="text-right">$1,950</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">4–8 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Astoria Heights
                    </TableCell>
                    <TableCell className="text-right">$1,750</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">6–12 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East of Steinway
                    </TableCell>
                    <TableCell className="text-right">$1,650</TableCell>
                    <TableCell className="text-right">$2,050</TableCell>
                    <TableCell className="text-right">$2,750</TableCell>
                    <TableCell className="text-right">3–7 min (M/R)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Ditmars / 30th Avenue (N/W Corridor)
                </h3>
                <p>
                  The most expensive Astoria rent bracket. Ditmars Blvd and
                  30th Avenue are the classic restaurant-and-bar corridors
                  of Astoria, with the strongest walk-to-subway score on the
                  N/W. Expect studios around $2,100, 1-bedrooms around
                  $2,700, and 2-bedrooms around $3,400. Newer mid-rise
                  construction concentrates on 31st Street and 21st Street.
                  Pre-war brownstones and 4-story walkups dominate the
                  residential side streets.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Astoria Waterfront (Hallets Cove, Vernon Blvd)
                </h3>
                <p>
                  The waterfront has the newest construction — mid-rise
                  rentals with amenity packages (gym, rooftop deck, package
                  room) overlooking the East River and Manhattan. Rents
                  slightly exceed Ditmars: studios $2,200, 1-bedrooms
                  $2,800. The trade-off is a 10–14 minute walk to the N/W
                  at Broadway or the NYC Ferry stop at Hallets Point. Best
                  for renters who prioritize modern finishes and water
                  views over subway-door convenience.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Central Astoria (31st Street / Broadway)
                </h3>
                <p>
                  The heart of residential Astoria. Studios $1,950 and
                  1-bedrooms $2,500. Good N/W access at 30th Ave and 36th
                  Ave stations, plus Broadway-line M/R via Steinway Street
                  within 10 minutes. Small-landlord walkups dominate.
                  Strong rent-stabilized density — roughly 25–30% of units
                  in 6+ unit pre-1974 buildings are stabilized. Best value
                  bracket for a typical Astoria lifestyle.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Astoria Heights
                </h3>
                <p>
                  South of 34th Avenue, Astoria slopes up toward Queens
                  Blvd / Sunnyside. Studios $1,750 and 1-bedrooms $2,200 —
                  roughly $300/month cheaper than central Astoria. The N/W
                  at 36th Ave and Steinway St is 6–12 minutes. Best fit
                  for renters who want Astoria rents but don&apos;t need to
                  be in the Ditmars bar crawl.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  East of Steinway Street
                </h3>
                <p>
                  The cheapest Astoria rents. Studios start $1,650 and
                  1-bedrooms at $2,050. Older 4-story walkups dominate, and
                  the blocks near the M/R at Steinway Street still feel
                  residential with neighborhood stores. The R train is
                  slower than the N/W to Midtown (10–15 minute penalty),
                  but the monthly rent savings ($400–$500 vs. Ditmars) are
                  meaningful over a year. Also consider our{" "}
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    LIC guide
                  </Link>
                  {" "}for a cross-comparison — the LIC border is a short
                  walk south.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria Rent Trend (2020–2026)</CardTitle>
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
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">&minus;8%</TableCell>
                    <TableCell>1-month free common on mid-rises</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$1,800</TableCell>
                    <TableCell className="text-right">&minus;5%</TableCell>
                    <TableCell>Walkup stock dropped less than towers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,050</TableCell>
                    <TableCell className="text-right">+14%</TableCell>
                    <TableCell>Return-to-office surge</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$2,215</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                    <TableCell>Value-seekers priced out of LIC/Williamsburg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$2,350</TableCell>
                    <TableCell className="text-right">+6%</TableCell>
                    <TableCell>Walkup rent stabilization gap widens</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$2,450</TableCell>
                    <TableCell className="text-right">+4%</TableCell>
                    <TableCell>FARE Act shifts broker fees to landlords</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                    <TableCell>Steady climb; low concession activity</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Astoria rent recovered more steadily than LIC or
                Williamsburg — the COVID trough was shallower (walkup stock
                doesn&apos;t concede as aggressively as luxury towers), and
                the rebound compounded at 4–8% per year. 2026 asking rents
                are roughly 38% above 2021 lows. Unlike LIC, Astoria
                rarely shows net-effective-rent discounts — the quoted
                monthly number is typically what you pay.
              </p>
              <p>
                For timing strategy — when to search, when to negotiate —
                see our{" "}
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

          {/* ── Astoria vs. Neighbors ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria vs. Nearby Neighborhoods (2026)</CardTitle>
              <CardDescription>
                How Astoria rent compares to Queens and Brooklyn alternatives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead className="text-right">1BR Median</TableHead>
                    <TableHead className="text-right">vs. Astoria</TableHead>
                    <TableHead>Commute to Midtown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Astoria</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell>25 min (N/W)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Long Island City</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">+$1,000</TableCell>
                    <TableCell>6–8 min (7)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">+$900</TableCell>
                    <TableCell>15–20 min (L)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sunnyside</TableCell>
                    <TableCell className="text-right">$2,150</TableCell>
                    <TableCell className="text-right">&minus;$350</TableCell>
                    <TableCell>12–18 min (7)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Woodside</TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">&minus;$500</TableCell>
                    <TableCell>15–22 min (7)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jackson Heights</TableCell>
                    <TableCell className="text-right">$1,950</TableCell>
                    <TableCell className="text-right">&minus;$550</TableCell>
                    <TableCell>20–25 min (7/E/F/M/R)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bushwick</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">+$100</TableCell>
                    <TableCell>25–35 min (L)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Astoria sits at the sweet spot of Queens: $800–$1,000
                cheaper than LIC or Williamsburg for a comparable unit,
                but closer to Midtown and with richer nightlife than
                Sunnyside or Woodside. The only meaningful &quot;price
                equivalent&quot; is Bushwick — but Bushwick commutes on
                the L add 10+ minutes vs. the N/W from Astoria.
              </p>
            </CardContent>
          </Card>

          {/* ── Price Per Square Foot ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria Price Per Square Foot</CardTitle>
              <CardDescription>
                How to compare Astoria listings apples-to-apples
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
                      Waterfront Mid-Rise
                    </TableCell>
                    <TableCell className="text-right">$65–$80</TableCell>
                    <TableCell className="text-right">500–650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Newer Mid-Rise (31st Ave)
                    </TableCell>
                    <TableCell className="text-right">$60–$75</TableCell>
                    <TableCell className="text-right">500–650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-War Walkup (Ditmars)
                    </TableCell>
                    <TableCell className="text-right">$50–$65</TableCell>
                    <TableCell className="text-right">550–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Older Walkup (East of Steinway)
                    </TableCell>
                    <TableCell className="text-right">$45–$55</TableCell>
                    <TableCell className="text-right">600–750</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Price per square foot reveals actual value. A $2,500/month
                1-bedroom at 500 sq ft costs $60/sq ft/year. The same rent
                at 650 sq ft in a pre-war walkup costs $46/sq ft/year — 23%
                better value per square foot. Older Astoria walkups
                consistently offer the most space for the dollar; newer
                buildings charge an amenity premium that compresses unit
                sizes. If you value space over doormen, the pre-war stock
                east of Steinway wins on $/sq ft.
              </p>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Astoria Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and unit size in plain English — our
                AI will surface Astoria listings matching your rent
                ceiling across Ditmars, the waterfront, Astoria Heights,
                and east of Steinway.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Astoria Rent FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the average rent in Astoria in 2026?
                </h3>
                <p>
                  Approximately $1,950 for a studio, $2,500 for a
                  1-bedroom, $3,200 for a 2-bedroom, and $4,200 for a
                  3-bedroom. Ditmars and the waterfront run above average;
                  east of Steinway Street runs below.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How much is rent in Astoria vs. LIC?
                </h3>
                <p>
                  Astoria is $800–$1,000/month cheaper than LIC for a
                  comparable 1-bedroom — Astoria averages $2,500 vs. LIC
                  $3,500. LIC has luxury amenities and 6-minute Midtown
                  commutes; Astoria has character, density, and better
                  value. Most renters comparing the two pick Astoria for
                  value or LIC for amenities.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Astoria cheaper than Williamsburg?
                </h3>
                <p>
                  Yes — a 1-bedroom in Astoria averages $2,500 vs. $3,400
                  in Williamsburg, a savings of $900/month ($10,800/year).
                  Astoria trades fewer bars and less nightlife for a
                  significantly cheaper rent and comparable N/W commute to
                  Midtown.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Which part of Astoria is cheapest?
                </h3>
                <p>
                  East of Steinway Street — studios start $1,650 and
                  1-bedrooms at $2,050. Astoria Heights (south of 34th
                  Avenue) is second-cheapest. Ditmars is the most
                  expensive, followed by the waterfront.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How much income do I need for an Astoria apartment?
                </h3>
                <p>
                  Under NYC&apos;s 40× income rule, a $2,500 1-bedroom
                  requires $100,000/year annual income. A $1,950 studio
                  requires $78,000/year. If you don&apos;t qualify on your
                  own, a guarantor earning 80× works. Astoria is one of
                  the few NYC neighborhoods where a solo earner under
                  $100k can qualify for a 1-bedroom without a guarantor.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are Astoria apartments rent-stabilized?
                </h3>
                <p>
                  Roughly 25–30% of Astoria apartments in 6+ unit pre-1974
                  buildings are rent-stabilized — one of the highest
                  stabilization shares in Queens. See our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>{" "}
                  for how to verify status, check DHCR rent history, and
                  understand your renewal rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Astoria &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Full Neighborhood Guide
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
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City (LIC) Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    LIC Rent Prices (2026)
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
