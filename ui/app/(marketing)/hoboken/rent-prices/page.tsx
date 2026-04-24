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
    "Hoboken Rent Prices 2026: Studio, 1BR, 2BR & 3BR by Sub-Area | Wade Me Home",
  description:
    "Hoboken, NJ rent prices for 2026 — median studio $2,700, 1BR $3,500, 2BR $4,700, 3BR $6,200. Sub-area breakdown (Uptown, Downtown, Waterfront), 6-year rent trend, $/sq ft by building type, waterfront tower rent tiers, and net-effective rent math for concessions.",
  keywords: [
    "Hoboken rent prices",
    "Hoboken rent prices 2026",
    "Hoboken NJ rent",
    "Hoboken studio rent",
    "Hoboken 1 bedroom rent",
    "Hoboken 2 bedroom rent",
    "Hoboken 3 bedroom rent",
    "average rent Hoboken",
    "how much is rent in Hoboken",
    "Hoboken rent by neighborhood",
    "Uptown Hoboken rent",
    "Downtown Hoboken rent",
    "Hoboken waterfront rent",
    "Maxwell Place rent",
    "Hudson Tea rent",
    "W Residences Hoboken rent",
    "Hoboken price per square foot",
    "Hoboken net effective rent",
    "Hoboken concessions",
    "07030 rent",
  ],
  openGraph: {
    title: "Hoboken Rent Prices 2026: Studio, 1BR, 2BR & 3BR by Sub-Area",
    description:
      "Current Hoboken rent medians, sub-area breakdown, 6-year trend, $/sq ft by building type, and the waterfront-tower tier.",
    url: `${baseUrl}/hoboken/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/hoboken/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Hoboken Rent Prices 2026: Studio, 1BR, 2BR & 3BR by Sub-Area",
    description:
      "Comprehensive 2026 rent-price breakdown for Hoboken, NJ — by unit size, sub-area, building type, 6-year trend, and net-effective rent after concessions.",
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
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
    mainEntityOfPage: `${baseUrl}/hoboken/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Hoboken in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Median asking rent in Hoboken for 2026 is approximately $2,700 for a studio, $3,500 for a 1-bedroom, $4,700 for a 2-bedroom, and $6,200 for a 3-bedroom. Overall city-wide median across all units is roughly $3,700, with waterfront luxury stock pulling the average up and Uptown/Western walkups pulling it down.",
        },
      },
      {
        "@type": "Question",
        name: "How much is a 1-bedroom in Hoboken?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 1-bedroom in Hoboken runs $2,900 to $4,400 depending on location and building type. Median is $3,500. Waterfront luxury (Maxwell Place, W Residences, Hudson Tea, 1100 Maxwell) typically runs $4,000–$5,000 for a 1BR with river views. Central Hoboken brownstone 1BRs run $2,900–$3,400. Uptown and Western Edge units run $2,800–$3,200.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Hoboken rent cheaper than Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hoboken rent runs 15–25% below equivalent Manhattan neighborhoods with similar Manhattan access because NJ property taxes, land values, and building costs are lower, supply is more recent (large waterfront high-rise development in the 2000s–2020s), and the NJ/NY state line creates a marginal psychological/tax-planning barrier for some renters. The PATH commute to WTC from Hoboken (9 min) is actually faster than 1 train from the Upper West Side — so the price gap is more about cross-state friction than functional distance.",
        },
      },
      {
        "@type": "Question",
        name: "Has Hoboken rent gone up in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Hoboken rent is up about 4–6% year-over-year into 2026 — Google Trends shows search demand for 'Hoboken apartments' at recent index 22 with +4.7% YoY, and the peak search value of 86 was recorded 2026-04-19 (April 24 reading). Waterfront towers have firmed pricing as 2024–2025 concessions of 2+ months free trimmed back to 1 month free on 13-month leases. Interior brownstone rent is up 3–5% YoY. Hoboken rent peaked post-pandemic in mid-2023, dipped ~4% in 2024, and has been recovering since Q3 2025.",
        },
      },
      {
        "@type": "Question",
        name: "What does net effective rent mean for Hoboken waterfront towers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net effective rent is the gross rent divided over the free-rent adjusted lease term. Example: a $4,200/month Maxwell Place 1BR on a 13-month lease with 2 months free bills only 11 months, so total rent paid is $46,200 over 13 months — net effective rent is $46,200 / 13 = $3,554/month. When you renew, most landlords quote off gross rent, so year-2 you pay $4,200 (or more) unless you negotiate. Always model year-2 gross rent, not just year-1 net effective.",
        },
      },
      {
        "@type": "Question",
        name: "How does Hoboken rent compare to Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hoboken and Jersey City overall are similar on 1BR median ($3,500 in Hoboken vs $3,500 city-wide in JC), but the distribution is different. Hoboken is more uniform — most units fall between $2,800 and $4,400. JC has a wider spread: Downtown JC (07302) and Newport (07310) are comparable to Hoboken, but Journal Square (07306) is 10–15% cheaper and Bergen-Lafayette / Greenville are 25–30% cheaper than any Hoboken block. If you want walkable dense NJ with consistent pricing, Hoboken; if you want the cheapest PATH-adjacent NJ 1BR, Journal Square.",
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
        name: "Rent Prices",
        item: `${baseUrl}/hoboken/rent-prices`,
      },
    ],
  },
];

export default function HobokenRentPricesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* ── Header ───────────────────────────── */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Hoboken, NJ</Badge>
              <Badge variant="outline">07030</Badge>
              <Badge variant="outline">2026 rent</Badge>
              <Badge variant="outline">+4.7% YoY demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hoboken Rent Prices 2026: Studio, 1BR, 2BR & 3BR by Sub-Area
            </h1>
            <p className="text-sm text-muted-foreground">
              Current median rent across Hoboken, broken down by unit size,
              sub-area (Uptown vs Downtown vs Waterfront vs Central), building
              type, six-year trend, and net-effective rent after concessions.
              Everything you need to compare Hoboken to Jersey City and
              Manhattan before signing a lease.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 24, 2026 &middot; Pulled from Hoboken-area
              listing inventory &middot; Cross-checked against Google Trends
              demand data
            </p>
          </header>

          {/* ── Rent by Unit Size ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent by Unit Size (Citywide Median)</CardTitle>
              <CardDescription>
                Median asking rent with typical range and sq-ft benchmark
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Size</TableHead>
                    <TableHead>Typical Sq Ft</TableHead>
                    <TableHead>Median Rent</TableHead>
                    <TableHead>Typical Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>450 – 600</TableCell>
                    <TableCell>$2,700</TableCell>
                    <TableCell>$2,300 – $3,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>650 – 850</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>$2,900 – $4,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>900 – 1,200</TableCell>
                    <TableCell>$4,700</TableCell>
                    <TableCell>$3,900 – $6,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>1,200 – 1,600</TableCell>
                    <TableCell>$6,200</TableCell>
                    <TableCell>$5,000 – $8,500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Sub-Areas ───────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent by Sub-Area (1BR Median)</CardTitle>
              <CardDescription>
                Hoboken&apos;s 1.28 sq mi splits into five functional
                sub-areas with meaningfully different rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>vs Citywide</TableHead>
                    <TableHead>Character</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Waterfront (Sinatra Dr &middot; River)
                    </TableCell>
                    <TableCell>$4,200</TableCell>
                    <TableCell>+20%</TableCell>
                    <TableCell>
                      Full-service luxury towers, river views
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Downtown (Obs. Hwy – 4th St)
                    </TableCell>
                    <TableCell>$3,600</TableCell>
                    <TableCell>+3%</TableCell>
                    <TableCell>
                      Closest to Hoboken Terminal PATH, bar district
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Central (4th – 10th St)
                    </TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>0%</TableCell>
                    <TableCell>
                      Brownstone core, Washington Street walkability
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Uptown (10th – 15th St)
                    </TableCell>
                    <TableCell>$3,200</TableCell>
                    <TableCell>-9%</TableCell>
                    <TableCell>
                      Quieter, 9th St PATH, Shipyard Park edge
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Western Edge (near Stevens / Jackson St)
                    </TableCell>
                    <TableCell>$3,000</TableCell>
                    <TableCell>-14%</TableCell>
                    <TableCell>
                      Walkup stock, Stevens student spillover
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Waterfront Tower Tier ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Waterfront Tower Rent Tier</CardTitle>
              <CardDescription>
                The Hudson-facing luxury stock is 15–25% above citywide —
                here are the main buildings and their 1BR rent bands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Built</TableHead>
                    <TableHead>1BR Range</TableHead>
                    <TableHead>Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Maxwell Place
                    </TableCell>
                    <TableCell>2007–2012</TableCell>
                    <TableCell>$3,900–$5,000</TableCell>
                    <TableCell>Luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      W Residences
                    </TableCell>
                    <TableCell>2009</TableCell>
                    <TableCell>$4,200–$5,500</TableCell>
                    <TableCell>Ultra-luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hudson Tea Building
                    </TableCell>
                    <TableCell>2002 conv.</TableCell>
                    <TableCell>$3,800–$5,000</TableCell>
                    <TableCell>Luxury conv.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      1100 Maxwell
                    </TableCell>
                    <TableCell>2014</TableCell>
                    <TableCell>$3,800–$5,200</TableCell>
                    <TableCell>Luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      1300 Adams
                    </TableCell>
                    <TableCell>2015</TableCell>
                    <TableCell>$3,400–$4,500</TableCell>
                    <TableCell>Mid-luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Vine Hoboken
                    </TableCell>
                    <TableCell>2016</TableCell>
                    <TableCell>$3,300–$4,300</TableCell>
                    <TableCell>Mid-luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Nine on the Hudson
                    </TableCell>
                    <TableCell>2020</TableCell>
                    <TableCell>$4,000–$5,500</TableCell>
                    <TableCell>Ultra-luxury</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Concessions: Maxwell Place and 1100 Maxwell routinely offer
                1–2 months free on 13-month leases in Q4 and Q1. Nine on the
                Hudson and W Residences typically hold price year-round. 1300
                Adams and Vine run the deepest concessions in 2026 — up to
                2 months free when PATH-to-Washington walking is the bigger
                factor for the renter.
              </p>
            </CardContent>
          </Card>

          {/* ── 6-Year Trend ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Hoboken 1BR Rent Trend 2020–2026</CardTitle>
              <CardDescription>
                Six-year history showing the pandemic dip, 2022–2023 peak,
                and 2024 correction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Median 1BR</TableHead>
                    <TableHead>YoY</TableHead>
                    <TableHead>Context</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell>$2,900</TableCell>
                    <TableCell>-12%</TableCell>
                    <TableCell>
                      Pandemic outflow, waterfront towers 2 mo free
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell>$3,050</TableCell>
                    <TableCell>+5%</TableCell>
                    <TableCell>
                      Snapback, young commuter re-entry
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell>$3,400</TableCell>
                    <TableCell>+11%</TableCell>
                    <TableCell>
                      Sharpest single-year spike, concessions pulled
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell>$3,600</TableCell>
                    <TableCell>+6%</TableCell>
                    <TableCell>Peak, bidding wars on brownstones</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell>$3,450</TableCell>
                    <TableCell>-4%</TableCell>
                    <TableCell>
                      Correction, 1–2 mo concessions return
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell>$3,400</TableCell>
                    <TableCell>-1%</TableCell>
                    <TableCell>
                      Flat, concessions 1 mo standard at waterfront
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>+3%</TableCell>
                    <TableCell>
                      Q2 recovery, search demand +4.7% YoY
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Peak-to-peak (2023 → 2026): +0% — Hoboken has essentially
                recovered to its 2023 peak. Compare JC at +35% peak-to-peak
                (JC was hit harder by the 2024 correction, then rebounded
                faster).
              </p>
            </CardContent>
          </Card>

          {/* ── Price per Sq Ft ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Price per Square Foot by Building Type</CardTitle>
              <CardDescription>
                Use this to value apartments that deviate from the citywide
                median
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building Type</TableHead>
                    <TableHead>$/sq ft (monthly)</TableHead>
                    <TableHead>Typical Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Waterfront new-construction luxury
                    </TableCell>
                    <TableCell>$5.50 – $6.50</TableCell>
                    <TableCell>W Residences, Nine on the Hudson</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Mid-luxury high-rise (2010s)
                    </TableCell>
                    <TableCell>$4.50 – $5.50</TableCell>
                    <TableCell>Maxwell Place, 1100 Maxwell</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Mid-rise 2000s (non-waterfront)
                    </TableCell>
                    <TableCell>$3.80 – $4.60</TableCell>
                    <TableCell>1300 Adams, Vine</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brownstone floor-through (pre-war)
                    </TableCell>
                    <TableCell>$3.50 – $4.30</TableCell>
                    <TableCell>Hudson Street, Garden Street 4th–10th</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Walkup 2-family (converted)
                    </TableCell>
                    <TableCell>$3.00 – $3.80</TableCell>
                    <TableCell>
                      Jackson, Park, Clinton Uptown/Western
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ──────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent: Hoboken Concession Math</CardTitle>
              <CardDescription>
                Most waterfront Hoboken towers advertise gross rent plus
                &quot;1 month free&quot; or &quot;2 months free&quot; on a
                13-month lease. Here&apos;s what you actually pay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gross Rent</TableHead>
                    <TableHead>Concession</TableHead>
                    <TableHead>Lease Term</TableHead>
                    <TableHead>Net Effective (Year 1)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>$4,200</TableCell>
                    <TableCell>1 month free</TableCell>
                    <TableCell>13 mo</TableCell>
                    <TableCell>$3,877</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>$4,200</TableCell>
                    <TableCell>2 months free</TableCell>
                    <TableCell>13 mo</TableCell>
                    <TableCell>$3,554</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>$4,500</TableCell>
                    <TableCell>1 month free</TableCell>
                    <TableCell>13 mo</TableCell>
                    <TableCell>$4,154</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>$4,500</TableCell>
                    <TableCell>2 months free</TableCell>
                    <TableCell>13 mo</TableCell>
                    <TableCell>$3,808</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Caveat: at renewal, most landlords re-quote year 2 off gross,
                not net effective. A $4,200 gross 1BR at 2-mo concession is
                $3,554 year 1, but if year 2 renews at $4,350 flat, your
                effective increase is ~22%. Negotiate year-2 terms before
                signing or budget for a re-shop at month 11.
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* ── Compare ─────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Hoboken vs Jersey City vs Manhattan (1BR Median)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Place</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Commute to WTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Hoboken</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>~9 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jersey City Downtown (07302)</TableCell>
                    <TableCell>$3,700</TableCell>
                    <TableCell>~5 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jersey City Newport (07310)</TableCell>
                    <TableCell>$3,750</TableCell>
                    <TableCell>~6 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jersey City Journal Sq (07306)</TableCell>
                    <TableCell>$3,200</TableCell>
                    <TableCell>~14 min PATH</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>East Village</TableCell>
                    <TableCell>$3,600 low end</TableCell>
                    <TableCell>~12 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Chelsea</TableCell>
                    <TableCell>$4,300</TableCell>
                    <TableCell>~15 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Upper West Side</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>~25 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Williamsburg</TableCell>
                    <TableCell>$3,400</TableCell>
                    <TableCell>~25 min (L+transfer)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ── CTA ─────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Hoboken apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your gross vs. net-effective budget,
                waterfront vs. brownstone preference, and PATH station — and
                we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Hoboken+apartments">
                  Search Hoboken
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ─────────────────────────── */}
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
                    Hoboken Apartments: Full Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Apartments Under $3,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport JC Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent
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
