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
    "East Village Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown | Wade Me Home",
  description:
    "Complete East Village, Manhattan rent prices for 2026 by unit size and sub-area. Studio, 1BR, 2BR, and 3BR rent ranges for Alphabet City, Tompkins Square, St. Marks, and the Stuy Town border, plus price-per-square-foot, 6-year historical trend, and concession-adjusted net effective rent.",
  keywords: [
    "east village rent prices",
    "east village manhattan rent prices",
    "east village rent",
    "east village apartment rent",
    "east village ny rent prices",
    "east village studio rent",
    "east village 1 bedroom rent",
    "east village 2 bedroom rent",
    "east village 3 bedroom rent",
    "alphabet city rent prices",
    "alphabet city rent",
    "tompkins square rent prices",
    "st marks rent prices",
    "east village rent trends",
    "average rent east village",
    "east village price per square foot",
    "east village net effective rent",
    "east village rent history",
  ],
  openGraph: {
    title: "East Village Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete East Village, Manhattan rent price breakdown by unit size and sub-area, with 6-year trends and price-per-square-foot benchmarks.",
    url: `${baseUrl}/nyc/east-village/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/east-village/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "East Village Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "2026 East Village rent prices by unit size and sub-area, historical rent trends, price-per-square-foot benchmarks, and concession-adjusted net effective rent math.",
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
    mainEntityOfPage: `${baseUrl}/nyc/east-village/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in the East Village in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The average asking rent for an East Village apartment in 2026 is approximately $2,850 for a studio, $3,750 for a 1-bedroom, $5,000 for a 2-bedroom, and $6,800 for a 3-bedroom — combining all sub-areas. Weighted toward the St. Marks and Stuy Town Edge sub-areas (which have more listing volume), the 1-bedroom average rises to roughly $3,900. Sub-area differences are significant: an Alphabet City walkup 1-bedroom averages $3,300, while a Stuy Town Edge new-construction 1-bedroom averages $4,100.",
        },
      },
      {
        "@type": "Question",
        name: "How has East Village rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "East Village median 1-bedroom rent dropped sharply in 2020-2021 (to roughly $2,700) as residents temporarily left Manhattan, then rebounded aggressively. From 2021 lows to 2026 asking rents, 1-bedroom median rent has increased approximately 40 percent — one of the steepest rebounds in Manhattan. In 2026, Google search demand for East Village apartments is up 168 percent year-over-year, the fastest growth of any tracked NYC neighborhood, which is keeping prices firm despite broader Manhattan softening.",
        },
      },
      {
        "@type": "Question",
        name: "What is the price per square foot in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "East Village rent averages roughly $80 to $110 per square foot per year across the whole neighborhood. New-construction elevator buildings along 13th and 14th Streets push $95 to $115 per square foot per year. Older pre-war walkups in Alphabet City and on the cross streets run $70 to $90 per square foot per year. Compared to Manhattan equivalents, the East Village is roughly 15-20 percent cheaper than the West Village and Chelsea on a per-square-foot basis, but smaller unit sizes narrow the gap on total rent.",
        },
      },
      {
        "@type": "Question",
        name: "What is net effective rent in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Net effective rent is the gross rent minus the value of landlord concessions (free months) spread across the lease term. In East Village new-construction buildings, a listing at $4,000/month with one month free on a 13-month lease has a net effective rent of $3,692 — 8 percent below the headline number. Concessions are less common on pre-war walkups, where demand is consistently high. When your lease renews, landlords typically quote the gross rent, so budget for potential increases at renewal.",
        },
      },
      {
        "@type": "Question",
        name: "Which part of the East Village has the cheapest rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Alphabet City (Avenues A through D, and especially Avenues C and D) has the cheapest East Village rent — walkup studios start at $2,500 and 1-bedrooms at $3,000 to $3,200. The trade-off is a 10- to 15-minute walk to the nearest subway (L at First Avenue or 6 at Astor Place). The blocks east of Avenue B on 2nd through 5th Streets have the deepest inventory of rent-stabilized tenement units, some of which are the best genuine value in Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in the East Village and how much cheaper are they?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The East Village has one of Manhattan's highest concentrations of rent-stabilized apartments. Stabilized 1-bedrooms often rent at market or slightly below in the first year (typically $3,200 to $3,800 for a unit that would otherwise be $3,800 to $4,200), but the real value compounds over renewals. Annual rent increases are capped by the NYC Rent Guidelines Board at roughly 2 to 3.5 percent for 1-year renewals, vs. 5 to 8 percent market increases. Over a 5-year tenancy, this saves $8,000 to $15,000 in cumulative rent.",
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
        name: "East Village",
        item: `${baseUrl}/nyc/east-village`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/east-village/rent-prices`,
      },
    ],
  },
];

export default function EastVillageRentPricesPage() {
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
              <Badge variant="outline">East Village</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              East Village Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR
              Breakdown
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for the East Village,
              Manhattan — by unit size, by sub-area (Alphabet City,
              Tompkins Square, St. Marks, and Stuy Town Edge), with 6-year
              historical trend context, price-per-square-foot benchmarks,
              and concession-adjusted net effective rent math. This is the
              companion reference to our full{" "}
              <Link
                href="/nyc/east-village"
                className="text-primary underline underline-offset-2"
              >
                East Village apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Rent ranges based on median
              asking rents across ZIP codes 10003 and 10009
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>East Village Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$2,850</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,750</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$6,800</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range from pre-war walkups to new-construction
                elevator
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
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$2,850</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">300–450</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">500–700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">700–1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">900–1,300</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &ldquo;Low&rdquo; reflects pre-war walkups in Alphabet City;
                &ldquo;Median&rdquo; is weighted across all inventory;
                &ldquo;High&rdquo; reflects elevator buildings along the 13th
                and 14th Street edge and near Astor Place.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Area ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village Rent by Sub-Area</CardTitle>
              <CardDescription>
                Alphabet City vs. Tompkins Square vs. St. Marks vs. 14th
                Street Edge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1BR</TableHead>
                    <TableHead className="text-right">2BR</TableHead>
                    <TableHead className="text-right">Walk to Subway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Alphabet City</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">10–15 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tompkins Square
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">5–10 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      St. Marks / Astor
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                    <TableCell className="text-right">2–5 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      14th Street Edge
                    </TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">2–5 min</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Sub-area boundaries are approximate. Rent-stabilized units
                are most concentrated in Alphabet City and on the 2nd–5th
                Street cross streets.
              </p>
            </CardContent>
          </Card>

          {/* ── 6-Year Trend Table ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village 1-Bedroom Rent: 6-Year Trend</CardTitle>
              <CardDescription>
                Median asking rent, year-over-year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
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
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell>Pre-pandemic baseline</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">-12.9%</TableCell>
                    <TableCell>Pandemic trough</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">+18.5%</TableCell>
                    <TableCell>Return to Manhattan surge</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">+7.8%</TableCell>
                    <TableCell>New peak passes 2020</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">+4.3%</TableCell>
                    <TableCell>Growth decelerates</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,650</TableCell>
                    <TableCell className="text-right">+1.4%</TableCell>
                    <TableCell>Near-flat; FARE Act effect</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">+2.7%</TableCell>
                    <TableCell>Demand surge meets fixed supply</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                From 2021 lows to 2026, East Village 1-bedroom rent has
                increased approximately 39%. The 2025-2026 plateau reflects
                a combination of broader Manhattan softening (partly offset
                by East Village-specific demand) and FARE Act effects
                shifting broker fee costs to landlords.
              </p>
            </CardContent>
          </Card>

          {/* ── Price per Square Foot ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Price Per Square Foot by Building Type</CardTitle>
              <CardDescription>
                Annualized rent / square foot benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building Type</TableHead>
                    <TableHead className="text-right">
                      Typical $/Sq Ft/Yr
                    </TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war walkup
                    </TableCell>
                    <TableCell className="text-right">$70 – $90</TableCell>
                    <TableCell>Tenement stock, no elevator, best value</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war elevator
                    </TableCell>
                    <TableCell className="text-right">$80 – $100</TableCell>
                    <TableCell>Rare in East Village, concentrated near Astor</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      2000s conversion
                    </TableCell>
                    <TableCell className="text-right">$85 – $105</TableCell>
                    <TableCell>Converted tenements with modern kitchens/baths</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New construction
                    </TableCell>
                    <TableCell className="text-right">$95 – $115</TableCell>
                    <TableCell>14th Street edge, full amenity buildings</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Compare to West Village ($110-140/sq ft) and Chelsea
                ($100-125/sq ft). The East Village is roughly 15-20% cheaper
                per square foot than West Village, though unit sizes are
                smaller.
              </p>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent: The Concession Math</CardTitle>
              <CardDescription>
                How to compare listings with different concession offers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Net effective rent is the gross asking rent minus the value
                of any free months, spread across the lease term. In the
                East Village, concessions are most common on 14th Street
                Edge new-construction buildings during winter months.
                Rarely seen on pre-war walkups where demand is consistent.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scenario</TableHead>
                    <TableHead className="text-right">Gross Rent</TableHead>
                    <TableHead className="text-right">Concession</TableHead>
                    <TableHead className="text-right">Net Effective</TableHead>
                    <TableHead className="text-right">Discount %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">No concession</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">—</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">0%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      1 month free / 13-month lease
                    </TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$3,692</TableCell>
                    <TableCell className="text-right">-7.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      1 month free / 12-month lease
                    </TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$3,667</TableCell>
                    <TableCell className="text-right">-8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      2 months free / 14-month lease
                    </TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$8,000</TableCell>
                    <TableCell className="text-right">$3,429</TableCell>
                    <TableCell className="text-right">-14.3%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                At renewal, landlords typically quote the gross rent ($4,000
                in these examples), so model the renewal scenario before
                signing. A seemingly cheap net-effective deal can become a
                large effective rent increase at month 13.
              </p>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village Rent Prices FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Why is East Village rent growing so fast in 2026?
                </h3>
                <p>
                  Google Trends data shows East Village apartment search
                  demand is up 168% year-over-year in 2026 — the fastest of
                  any tracked NYC neighborhood. The driver is a mix of
                  post-pandemic return to Manhattan, relative affordability
                  vs. West Village/SoHo, and a nearly fixed supply (historic
                  zoning limits new construction). Demand outpacing supply =
                  firm rents.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Where are the cheapest East Village apartments?
                </h3>
                <p>
                  Alphabet City (Avenues A-D), especially Avenues C and D
                  and the 2nd-5th Street cross streets. Walkup studios
                  start at $2,500 here, and rent-stabilized tenement units
                  can be even cheaper. Trade-off: 10-15 minute walk to the
                  nearest subway.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is it better to rent a pre-war walkup or new
                  construction in the East Village?
                </h3>
                <p>
                  Depends on priorities. Pre-war walkups offer character
                  (exposed brick, hardwood floors, tenement charm), lower
                  rent, and higher odds of rent stabilization — but no
                  elevator, older kitchens, and radiator heat. New
                  construction along the 14th Street edge offers in-unit
                  laundry, central HVAC, elevators, and gyms — at a 15 to
                  25% rent premium. For long-term tenancy, pre-war walkups
                  with rent-stabilized status are the best value.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How does East Village rent compare to Lower East Side?
                </h3>
                <p>
                  The Lower East Side (below Houston Street) runs $200 to
                  $400/month cheaper than the East Village for equivalent
                  inventory. The neighborhoods share a similar gritty
                  energy and food/nightlife density. The East Village wins
                  on subway coverage (L, 6, F/M, N/R/W vs. LES&apos;s F,
                  J/M/Z). If you work south of 34th Street, the LES is a
                  strong alternative.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are concessions still available on East Village apartments?
                </h3>
                <p>
                  Rare on pre-war walkups (demand is too high). More
                  common on 14th Street edge new-construction buildings,
                  especially in December-February. Typical concessions: 1
                  month free on a 13-month lease, sometimes 2 months free
                  on a 14-month lease. Always calculate net effective rent
                  AND model the renewal scenario before signing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search East Village Apartments by Rent
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget and priorities — &ldquo;rent-
                stabilized 1BR under $3,500&rdquo;, &ldquo;Alphabet City
                walkup under $3,000&rdquo;, &ldquo;2BR near the L with
                laundry&rdquo; — and our AI searches current East Village
                listings in seconds.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    Apartments for Rent in East Village, Manhattan (2026)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Rent Prices: Studio, 1BR, 2BR &amp; 3BR
                    Breakdown
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
                    NYC Rent Stabilization Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC FARE Act Explained
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    Negotiating Rent &amp; Lease Terms
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
