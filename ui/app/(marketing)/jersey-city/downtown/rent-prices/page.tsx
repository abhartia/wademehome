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
    "Downtown Jersey City Rent Prices (2026): 07302 Studio, 1BR, 2BR & 3BR by Sub-Area | Wade Me Home",
  description:
    "Downtown Jersey City (07302) rent prices for 2026 by unit size, sub-area (Grove Street / Newport edge / Paulus Hook / Hamilton Park / Van Vorst), and building type (luxury new-con, pre-war brownstone, post-war mid-rise). Grove Street PATH commute math, vs-Manhattan savings, and 6-year trend.",
  keywords: [
    "downtown jersey city rent",
    "downtown jersey city rent prices",
    "07302 rent",
    "07302 apartments",
    "downtown jersey city studio rent",
    "downtown jersey city 1 bedroom rent",
    "downtown jersey city 2 bedroom rent",
    "grove street apartments",
    "paulus hook rent",
    "hamilton park rent",
    "van vorst park apartments",
    "jersey city downtown rent",
    "jersey city brownstone rent",
    "downtown jc apartments",
    "downtown jc rent",
    "07302 1 bedroom",
    "07302 studio",
    "grove street PATH apartments",
    "exchange place apartments",
    "downtown jersey city net effective rent",
    "downtown jersey city 6 year trend",
    "downtown jersey city luxury rent",
  ],
  openGraph: {
    title:
      "Downtown Jersey City Rent Prices (2026): 07302 Studio, 1BR, 2BR & 3BR by Sub-Area",
    description:
      "Complete Downtown JC rent breakdown by unit size, sub-area, building type, with Grove Street PATH commute math and vs-Manhattan savings.",
    url: `${baseUrl}/jersey-city/downtown/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/jersey-city/downtown/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Downtown Jersey City Rent Prices (2026): 07302 Studio, 1BR, 2BR & 3BR by Sub-Area",
    description:
      "2026 Downtown Jersey City (07302) rent prices by unit size, sub-area, and building type, with Grove Street PATH commute math, vs-Manhattan savings, and 6-year trend.",
    datePublished: "2026-04-25",
    dateModified: "2026-04-25",
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
    mainEntityOfPage: `${baseUrl}/jersey-city/downtown/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Downtown Jersey City in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 Downtown JC averages are approximately $3,100 for a studio, $3,700 for a 1-bedroom, $5,200 for a 2-bedroom, and $7,000 for a 3-bedroom. Downtown is the most expensive Jersey City sub-neighborhood — roughly 15–25% above Journal Square and 10–15% above Newport for comparable stock. Grove Street PATH access (8 minutes to World Trade Center) is the dominant driver of the premium.",
        },
      },
      {
        "@type": "Question",
        name: "How does Downtown JC rent compare to Lower Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downtown JC 1-bedroom median ($3,700) runs roughly 30% below Financial District 1-bedroom median ($5,200) for new-construction stock. On 2-bedrooms, Downtown JC ($5,200) is approximately 28% below FiDi ($7,200). The trade-off: Grove Street PATH to WTC is 8 minutes vs. a 0-minute walk-to-office for FiDi residents. The PATH commute is the rent-savings price — about $1,500/month differential for a 16-minute round-trip daily commute, valued at ~$280/hour of commute time.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the cheapest part of Downtown JC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hamilton Park and Van Vorst Park sub-areas, west of Grove Street, are typically 10–15% below the Downtown JC median for comparable building stock. Pre-war brownstone floor-throughs in Hamilton Park run $3,000–$3,500 1BR vs. $3,800–$4,300 in Paulus Hook for an equivalent floor. The trade-off: Grove Street PATH adds a 5–8 minute walk vs. a 0–3 minute walk from Paulus Hook.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Downtown JC brownstone market like?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hamilton Park, Van Vorst Park, and Paulus Hook contain roughly 1,200 brownstone-style row houses, mostly built 1860–1900. A substantial fraction have been split into 2–3 rental units. Floor-through 1-bedrooms run $3,000–$3,800 in Hamilton Park, $3,400–$4,200 in Paulus Hook. Compared to Brooklyn brownstones, Downtown JC brownstones tend to be slightly smaller (narrower lots) but typically have more recent renovations.",
        },
      },
      {
        "@type": "Question",
        name: "How has Downtown JC rent changed over the last 6 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Downtown JC 1-bedroom median rent dropped to approximately $2,700 during 2020 COVID, then climbed: ~9% in 2022, ~7% in 2023, ~4% in 2024, and ~3% annually since. Peak-to-peak 2020–2026 is approximately +37% — the highest 6-year rent growth of any Jersey City sub-neighborhood and one of the highest in the metro. Google Trends shows 'jersey city apartments' demand up 38.1% YoY through April 2026 with peak interest April 19, 2026 — suggesting continued upward pressure.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in Downtown JC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New Jersey does NOT have a state-level rent-stabilization framework comparable to NYC's RGB system. However, Jersey City has a local rent control ordinance for buildings constructed before 1987 with 5+ units that are not condos/co-ops. The annual cap is the lesser of CPI or 4%. Most pre-1987 walkup and pre-war elevator buildings in Hamilton Park and Van Vorst Park qualify; new-construction towers (Newport, Exchange Place new towers) do not. Confirm with the landlord and check the JC Rent Leveling Board records.",
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
        name: "Jersey City",
        item: `${baseUrl}/jersey-city`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Downtown",
        item: `${baseUrl}/jersey-city/downtown`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/jersey-city/downtown/rent-prices`,
      },
    ],
  },
];

export default function DowntownJcRentPricesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Downtown Jersey City</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">07302 · +38% YoY demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Downtown Jersey City Rent Prices (2026): 07302 Studio, 1BR,
              2BR &amp; 3BR by Sub-Area
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Downtown Jersey City
              (zip 07302) — by unit size, by sub-area (Grove Street, Paulus
              Hook, Hamilton Park, Van Vorst Park, Newport edge), and by
              building type (luxury new-con, pre-war brownstone, post-war
              mid-rise). Grove Street PATH commute math, vs-Manhattan
              savings, 6-year trend, and net-effective rent math. Companion
              to our full{" "}
              <Link
                href="/jersey-city/downtown"
                className="text-primary underline underline-offset-2"
              >
                Downtown JC apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Jersey City search demand is
              up 38.1% YoY with peak interest April 19, 2026
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Downtown JC Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$3,100</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,700</p>
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
                  <p className="text-lg font-semibold">$7,000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downtown JC Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                From Hamilton Park brownstone studios to Paulus Hook
                3-bedroom new-con
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
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">450–650</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">650–950</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                    <TableCell className="text-right">900–1,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">$7,000</TableCell>
                    <TableCell className="text-right">$11,000</TableCell>
                    <TableCell className="text-right">1,200–1,800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low-end pricing reflects Hamilton Park and Van Vorst Park
                brownstone floor-through stock and pre-war walkup units.
                High-end pricing reflects Paulus Hook waterfront new-con
                and the newer Newport-edge towers (90 Christopher Columbus,
                Park &amp; Shore).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downtown JC Rent Prices by Sub-Area</CardTitle>
              <CardDescription>
                07302 sorts into 5 sub-areas with $400–$700/month spreads
                between them
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
                      Paulus Hook (waterfront)
                    </TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Grove Street core
                    </TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Newport edge (north of 6th)
                    </TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hamilton Park
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Van Vorst Park
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Paulus Hook (waterfront)
                </h3>
                <p>
                  The most expensive Downtown JC sub-area. Waterfront
                  blocks south of Grand, east of Washington. New-con
                  towers like 70 Greene, 99 Hudson, and 50 Columbus list
                  1-bedrooms $4,000–$5,200. 2 minute walk to Exchange
                  Place PATH (4 minutes to WTC).
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Grove Street core
                </h3>
                <p>
                  The Downtown JC heartland. Around the Grove Street PATH
                  station, with restaurants and bars on Newark Avenue. Mix
                  of pre-war 6-story buildings and 2010s new-con
                  mid-rise. Median 1-bedroom $3,800. PATH to WTC: 8 min.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Newport edge (north of 6th Street)
                </h3>
                <p>
                  Transition into Newport. Sub-area between Grove and
                  Newport, north of 6th. New-con towers like 90
                  Christopher Columbus and Park &amp; Shore. Pricing close
                  to Newport but with shorter walks to Grove Street PATH.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hamilton Park
                </h3>
                <p>
                  The brownstone heart of Downtown JC. West of Erie, south
                  of 14th. Tree-lined blocks of 1860–1900 brownstones,
                  many split into 2–3 rental units. Floor-through
                  1-bedrooms $3,000–$3,800. 5–8 minute walk to Grove
                  Street PATH.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Van Vorst Park
                </h3>
                <p>
                  South of Hamilton, west of Grove. Smaller historic
                  district around Van Vorst Park itself. Lowest median
                  1BR in Downtown JC ($3,300). Pre-war walkups dominate;
                  some 2-family brownstone conversions. 7-10 minute walk
                  to Grove Street PATH.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downtown JC vs. Lower Manhattan</CardTitle>
              <CardDescription>
                What you save by crossing the Hudson — and what you give up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Downtown JC</TableHead>
                    <TableHead className="text-right">FiDi</TableHead>
                    <TableHead className="text-right">Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">
                      $700/mo · 18%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">
                      $1,500/mo · 29%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                    <TableCell className="text-right">
                      $2,000/mo · 28%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$7,000</TableCell>
                    <TableCell className="text-right">$10,500</TableCell>
                    <TableCell className="text-right">
                      $3,500/mo · 33%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                <strong>PATH commute math:</strong> Grove Street to WTC is
                8 minutes; Exchange Place to WTC is 4 minutes. Round-trip
                daily commute is 16 minutes. At $1,500/month savings on a
                1-bedroom, the rent-savings price for the commute is
                roughly $280/hour of commute time — well above NYC median
                hourly wage.
              </p>
              <p>
                <strong>Trade-offs:</strong> 1) PATH service is reliable
                but less frequent than NYC subway (every 6–10 min off-peak
                vs. every 4–6 min). 2) Late-night PATH is every 20 minutes.
                3) PATH does not run to Midtown East — for offices in
                Midtown North/East, the commute is PATH + subway transfer,
                30+ minutes. 4) Citi Bike Jersey City is integrated but
                does not bridge the river.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6-Year Downtown JC Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                Among the steepest 6-year rent growth in the NYC metro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">YoY</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">−10%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$4,150</TableCell>
                    <TableCell className="text-right">+9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">+9%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">$4,850</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$5,050</TableCell>
                    <TableCell className="text-right">+4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,050</TableCell>
                    <TableCell className="text-right">$3,650</TableCell>
                    <TableCell className="text-right">$5,150</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Peak-to-peak 2020–2026: studios +35%, 1-bedrooms +37%,
                2-bedrooms +37%. Tied with the broader Jersey City market
                for the highest 6-year rent growth in the NYC metro.
                Trends YoY +38.1% with peak demand April 19, 2026 suggests
                continued upward pressure into 2026.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Downtown JC apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, your sub-area preference
                (Grove Street, Paulus Hook, Hamilton Park, Van Vorst,
                Newport edge), and your budget — we&apos;ll surface
                matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Downtown+Jersey+City+apartments">
                  Search Downtown JC Apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Full Downtown JC Apartment Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown JC Apartments Under $3,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown JC Apartments Under $4,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices (full)
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
                    href="/jersey-city/journal-square/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Rent Prices (cross-river alternative)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act &amp; Broker Fees (NYC, not NJ)
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
