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
    "Williamsburg Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown | Wade Me Home",
  description:
    "Williamsburg, Brooklyn rent prices for 2026 by unit size and sub-neighborhood. Studio, 1-bedroom, 2-bedroom, and 3-bedroom rent ranges for North, South, and East Williamsburg plus price-per-square-foot benchmarks and concession-adjusted net rent.",
  keywords: [
    "williamsburg rent prices",
    "williamsburg brooklyn rent prices",
    "williamsburg rent",
    "williamsburg brooklyn rent",
    "williamsburg apartment rent",
    "williamsburg ny rent prices",
    "williamsburg studio rent",
    "williamsburg 1 bedroom rent",
    "williamsburg 2 bedroom rent",
    "williamsburg 3 bedroom rent",
    "north williamsburg rent prices",
    "south williamsburg rent prices",
    "east williamsburg rent prices",
    "williamsburg rent trends",
    "average rent williamsburg",
    "williamsburg price per square foot",
    "williamsburg net effective rent",
  ],
  openGraph: {
    title:
      "Williamsburg Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete Williamsburg, Brooklyn rent price breakdown by unit size and sub-neighborhood, with trends and price-per-square-foot benchmarks.",
    url: `${baseUrl}/nyc/williamsburg/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/williamsburg/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Williamsburg Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "2026 Williamsburg rent prices by unit size and sub-neighborhood, historical rent trends, price-per-square-foot benchmarks, and concession-adjusted net effective rent math.",
    datePublished: "2026-04-20",
    dateModified: "2026-04-20",
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
    mainEntityOfPage: `${baseUrl}/nyc/williamsburg/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Williamsburg, Brooklyn in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent for a Williamsburg apartment in 2026 is approximately $2,700 for a studio, $3,400 for a 1-bedroom, $4,400 for a 2-bedroom, and $6,000 for a 3-bedroom — combining all sub-neighborhoods. Weighted toward North Williamsburg, which has the largest share of listings, the 1-bedroom average rises to roughly $3,600. Sub-neighborhood differences are significant: a North Williamsburg waterfront 1-bedroom averages $4,100, while an East Williamsburg 1-bedroom averages $2,800.",
        },
      },
      {
        "@type": "Question",
        name: "How has Williamsburg rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Williamsburg median 1-bedroom rent dropped sharply in 2020–2021 (to roughly $2,600) before rebounding in 2022 and reaching new highs in 2023–2024. From 2021 lows to 2026 asking rents, 1-bedroom median rent has increased approximately 35% — one of the steepest rebounds of any NYC neighborhood. Growth has flattened in 2025–2026 as new supply along the waterfront absorbs demand, and concessions have returned to the luxury segment.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Williamsburg rent averages roughly $75 to $95 per square foot per year across the whole neighborhood. Waterfront luxury buildings along Kent Avenue and Wythe Avenue push $100 to $115 per square foot per year. Older walkups on interior blocks and in South or East Williamsburg run $60 to $80 per square foot per year. Compared to Manhattan equivalents, Williamsburg is roughly 15–25% cheaper per square foot than the East Village and Chelsea.",
        },
      },
      {
        "@type": "Question",
        name: "What is net effective rent in Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net effective rent is the gross rent minus the value of landlord concessions (free months) spread over the lease term. In Williamsburg waterfront buildings, a listing at $4,200/month with one month free on a 12-month lease has a net effective rent of $3,850 — 8% below the headline number. Two months free (common in winter) brings net effective rent roughly 16% below gross. When your lease renews, landlords typically quote the gross rent, so budget for potential increases at renewal.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of Williamsburg has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "East Williamsburg (east of the Brooklyn-Queens Expressway, bordering Bushwick) has the cheapest Williamsburg rent — studios start at $2,200 and 1-bedrooms at $2,500. The L train at Montrose Avenue and Graham Avenue keeps the commute competitive with North Williamsburg. South Williamsburg (south of the Williamsburg Bridge) is the second-cheapest area, with 1-bedrooms averaging $2,900 and the J/M/Z trains at Marcy Avenue for Manhattan access.",
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
        name: "Rent Prices",
        item: `${baseUrl}/nyc/williamsburg/rent-prices`,
      },
    ],
  },
];

export default function WilliamsburgRentPricesPage() {
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
              <Badge variant="outline">Williamsburg</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Williamsburg Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR Breakdown
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Williamsburg, Brooklyn —
              by unit size, by sub-neighborhood (North, South, East, and
              Waterfront), with 5-year historical trend context,
              price-per-square-foot benchmarks, and concession-adjusted net
              effective rent math. This is the companion reference to our
              full{" "}
              <Link
                href="/nyc/williamsburg"
                className="text-primary underline underline-offset-2"
              >
                Williamsburg apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP codes 11211, 11249, and 11206
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Williamsburg Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$2,700</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$6,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range including low-end walkups and high-end waterfront
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$12,000+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end represents walkup stock in South or East Williamsburg
                without amenities. High end represents full-service waterfront
                towers on Kent or Wythe Avenue. The median reflects the
                weighted neighborhood average across all sub-areas.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Neighborhood ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg Rent Prices by Sub-Neighborhood</CardTitle>
              <CardDescription>
                Where you live inside Williamsburg can mean $1,000+/month
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      North Williamsburg Waterfront
                    </TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      North Williamsburg (Bedford)
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Williamsburg
                    </TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Williamsburg
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Williamsburg Waterfront (Kent Ave / Wythe Ave / North 1st–14th)
                </h3>
                <p>
                  The most expensive Williamsburg rent bracket. This is where
                  the post-2015 luxury construction concentrates — full
                  amenity packages (doorman, gym, rooftop, coworking, pet
                  spa), floor-to-ceiling windows, and concierge services.
                  Expect studios around $3,100, 1-bedrooms around $4,100, and
                  2-bedrooms around $5,400. Landlords in this segment often
                  offer 1–2 months free as a concession, which effectively
                  reduces rents by 8–16%.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Williamsburg (Bedford &amp; Interior)
                </h3>
                <p>
                  The interior blocks off Bedford Avenue — walkups,
                  mid-sized condos, and converted industrial buildings.
                  Rents are $400–$500 lower than waterfront but you trade
                  amenities for character and better access to the Bedford
                  L station. Studios average $2,800 and 1-bedrooms $3,600.
                  This is the sweet spot for renters who want North
                  Williamsburg lifestyle without paying for a rooftop pool.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Williamsburg (Below Grand Street)
                </h3>
                <p>
                  South of Grand Street, rents drop sharply. Studios average
                  $2,500 and 1-bedrooms $2,900. The area has a strong
                  Hasidic Jewish community presence, a quieter residential
                  feel, and subway access via the J/M/Z at Marcy Avenue.
                  The South Williamsburg ferry stop adds a Manhattan option.
                  Good for renters who want Williamsburg&apos;s ZIP at
                  roughly 75% of North Williamsburg cost.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  East Williamsburg (Beyond the BQE)
                </h3>
                <p>
                  East of the Brooklyn-Queens Expressway, Williamsburg
                  blends into Bushwick. Studios average $2,300 and
                  1-bedrooms $2,800 — the cheapest Williamsburg rents.
                  Converted industrial lofts are common, and the L stops at
                  Montrose and Graham Avenues keep commutes competitive.
                  If you&apos;re price-sensitive but want the Williamsburg
                  ZIP code, this is the best value area. Also consider our{" "}
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick guide
                  </Link>{" "}
                  — East Williamsburg is the transition zone and overlaps
                  heavily.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg Rent Trend (2020–2026)</CardTitle>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020 (COVID)</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">&minus;12%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">&minus;7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">+19%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">+6%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,350</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,380</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Williamsburg rent dropped hardest in 2020–2021 as
                professionals left NYC during the pandemic. The 2022–2023
                rebound was one of the fastest in NYC — a 27% two-year
                increase. 2024–2026 growth has flattened as waterfront
                supply (Domino, One South First, The Level) has absorbed
                demand, and concessions returned to the luxury segment.
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
              <CardTitle>Williamsburg Price Per Square Foot</CardTitle>
              <CardDescription>
                How to compare Williamsburg listings apples-to-apples
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
                    <TableCell className="text-right">$100–$115</TableCell>
                    <TableCell className="text-right">550–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New Construction (Interior)
                    </TableCell>
                    <TableCell className="text-right">$85–$100</TableCell>
                    <TableCell className="text-right">500–650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Converted Loft
                    </TableCell>
                    <TableCell className="text-right">$70–$85</TableCell>
                    <TableCell className="text-right">700–1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-War Walkup</TableCell>
                    <TableCell className="text-right">$60–$80</TableCell>
                    <TableCell className="text-right">450–600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Price per square foot reveals actual value. A $3,800/month
                1-bedroom at 500 sq ft costs $91/sq ft/year. The same rent at
                700 sq ft in a converted loft costs $65/sq ft/year — 28%
                better value on a per-square-foot basis. Loft-style
                Williamsburg apartments generally offer the most space for
                the dollar.
              </p>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Williamsburg</CardTitle>
              <CardDescription>
                What concessions actually save you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Williamsburg waterfront buildings often advertise
                &quot;net effective rent&quot; — the monthly rent averaged
                over the lease term after spreading out free months. Gross
                rent is what you pay each month the landlord bills. Net
                effective is the true economic cost. At renewal, landlords
                typically quote gross rent, so budget for a potential
                increase if your lease bakes in a concession.
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
                </TableBody>
              </Table>
              <p>
                Concession math:{" "}
                <span className="font-mono">
                  net = (gross × (lease months − free)) / lease months
                </span>
                . A 13-month lease with 2 months free on $4,200 gross
                delivers a $3,554 net effective rent (15.4% discount).
                Waterfront buildings offer the deepest concessions,
                especially in November–February. Walkup stock rarely
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

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Williamsburg Rent FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the average rent in Williamsburg, Brooklyn in 2026?
                </h3>
                <p>
                  Approximately $2,700 for a studio, $3,400 for a
                  1-bedroom, $4,400 for a 2-bedroom, and $6,000 for a
                  3-bedroom — averaging all sub-neighborhoods. Weighted
                  toward North Williamsburg (which has more listings), the
                  1-bedroom average is closer to $3,600.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How has Williamsburg rent changed over the last 5 years?
                </h3>
                <p>
                  Williamsburg 1-bedroom median rent fell to roughly $2,600
                  during the 2020–2021 pandemic low, then recovered
                  sharply: up 19% in 2022, 6% in 2023, and roughly 1–2%
                  annually since. Peak-to-trough-to-peak swing is about
                  31% — one of the steepest in NYC.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the price per square foot in Williamsburg?
                </h3>
                <p>
                  Roughly $75 to $95 per square foot per year on average.
                  Waterfront luxury stock runs $100–$115/sq ft. Older
                  walkups and lofts in South/East Williamsburg run
                  $60–$80/sq ft. Loft-style converted-industrial units are
                  usually the best value on a per-square-foot basis.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Which part of Williamsburg has the cheapest rent?
                </h3>
                <p>
                  East Williamsburg (east of the Brooklyn-Queens Expressway)
                  has the cheapest rent — studios starting at $2,200 and
                  1-bedrooms at $2,500. South Williamsburg (south of the
                  Williamsburg Bridge) is the second-cheapest.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Why is North Williamsburg so much more expensive?
                </h3>
                <p>
                  North Williamsburg waterfront has the newest building
                  stock, the best amenities, the shortest walk to the
                  Bedford L station, and the tightest restaurant and
                  retail cluster. Supply is constrained by the waterfront
                  footprint. Demand is inflated by relocators from
                  Manhattan and tech workers. The combination pushes rent
                  $1,000+/month above East Williamsburg on comparable
                  unit sizes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Williamsburg Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and unit size in plain English — our AI
                will surface Williamsburg listings matching your rent
                ceiling across all sub-neighborhoods.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Williamsburg &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
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
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Prices, Commutes &amp; Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/greenpoint/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint Rent Prices: G-Train Discount vs. Williamsburg
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Rent Prices: Lofts &amp; L-Train Arbitrage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Apartments: Rent &amp; Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    LIC Rent Prices: Waterfront Towers &amp; Net-Effective Rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City (LIC) Apartments: Towers &amp; Waterfront
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
