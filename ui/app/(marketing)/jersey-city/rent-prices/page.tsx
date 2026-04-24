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
    "Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Zip Code & PATH Stop | Wade Me Home",
  description:
    "Jersey City rent prices for 2026 by unit size and zip code. Downtown (07302), Newport (07310), Journal Square (07306), Exchange Place, The Heights (07307), Bergen-Lafayette (07304), and Greenville (07305) with PATH commute penalty math, Manhattan alternatives, and net-effective rent calculations.",
  keywords: [
    "jersey city rent prices",
    "jersey city rent",
    "jersey city nj rent prices",
    "downtown jersey city rent",
    "newport jersey city rent",
    "journal square rent",
    "exchange place rent",
    "jersey city heights rent",
    "jersey city studio rent",
    "jersey city 1 bedroom rent",
    "jersey city 2 bedroom rent",
    "jersey city 3 bedroom rent",
    "average rent jersey city",
    "jersey city rent per square foot",
    "jersey city net effective rent",
    "jersey city vs manhattan rent",
    "jersey city vs brooklyn rent",
    "path commute jersey city",
    "hudson house jersey city",
    "07302 rent",
    "07310 rent",
    "07306 rent",
  ],
  openGraph: {
    title:
      "Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Zip Code",
    description:
      "Complete Jersey City rent price breakdown by unit size and zip code, with PATH commute context and Manhattan rent comparison.",
    url: `${baseUrl}/jersey-city/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/jersey-city/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Jersey City Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Zip Code & PATH Stop",
    description:
      "2026 Jersey City rent prices by unit size and zip code, PATH commute penalty math, vs-Manhattan pricing, historical rent trends, and concession-adjusted net effective rent.",
    datePublished: "2026-04-23",
    dateModified: "2026-04-23",
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
    mainEntityOfPage: `${baseUrl}/jersey-city/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Jersey City in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 Jersey City average asking rent is approximately $3,030 for a studio, $3,500 for a 1-bedroom, $4,790 for a 2-bedroom, and $6,200 for a 3-bedroom — city-wide across all zip codes. Downtown Jersey City (07302) and Newport (07310) are the most expensive at roughly $3,600–$3,800 for a 1-bedroom. Journal Square (07306) sits around $3,200. The Heights (07307), Bergen-Lafayette (07304), and Greenville (07305) run $2,500–$2,800 for a 1-bedroom.",
        },
      },
      {
        "@type": "Question",
        name: "How much cheaper is Jersey City than Manhattan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Downtown Jersey City 1-bedroom at $3,500–$3,800 rents for $4,500–$5,000 in the Financial District and $4,200–$4,800 in Midtown East for comparable luxury stock. That is an $800–$1,500/month discount. Exchange Place is 4 minutes from World Trade Center by PATH — faster than most Manhattan subway commutes to Lower Manhattan. The discount is largest on new construction with similar finishes and amenities.",
        },
      },
      {
        "@type": "Question",
        name: "What is the PATH commute penalty on Jersey City rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The PATH ride itself costs $3.00 per ride — slightly more than the $2.90 MTA fare — and PATH does not share unlimited-ride passes with the subway. If you commute 22 days a month round-trip, that is $132/month versus $132 for the MTA's 30-day pass (which also covers buses and the subway for non-commute trips). The real commute penalty is not time — Exchange Place to WTC is 4 minutes, faster than most Manhattan subway rides. The penalty is optionality: you need the MTA pass too if you want to use the subway for non-commute trips. Factor $30–$60/month into your Jersey City rent budget for the cross-system gap.",
        },
      },
      {
        "@type": "Question",
        name: "How has Jersey City rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jersey City median 1-bedroom rent fell to approximately $2,600 in 2020 during the pandemic, then rebounded aggressively — up 14% in 2022 as Newport and Journal Square supply leased up, 7% in 2023, and 4–5% annually since. From 2020 lows to 2026, Jersey City 1-bedroom rent has risen roughly 35% — the steepest percentage increase of any major rental market in the NYC metro area. Journal Square in particular saw rapid appreciation as the 2020–2024 construction wave (nine new towers) absorbed Manhattan-price-displaced demand.",
        },
      },
      {
        "@type": "Question",
        name: "Is the FARE Act in effect in Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The FARE Act is a New York City law that went into effect in 2025 — it only covers listings inside NYC. Jersey City falls under New Jersey's rental rules, which allow broker fees to be charged to tenants if disclosed in advance. That said, most Jersey City luxury buildings (Newport, Downtown, Journal Square) are owner-represented and do not carry a tenant-paid fee. When you apply directly to a building's leasing office, no fee. When you apply through a third-party agent, always confirm the fee upfront before touring.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest part of Jersey City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenville (07305) is the cheapest Jersey City zip code — 1-bedrooms start around $1,900 and 2-bedrooms around $2,400. Bergen-Lafayette (07304) is the next tier — $2,500 for a 1-bedroom, with the added upside of Liberty State Park access and the Hudson-Bergen Light Rail. The Heights (07307) runs $2,600–$2,800 for a 1-bedroom. These are all 15–25 minutes further from Manhattan than Downtown JC by PATH + connection, which is the tradeoff.",
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
        name: "Rent Prices",
        item: `${baseUrl}/jersey-city/rent-prices`,
      },
    ],
  },
];

export default function JerseyCityRentPricesPage() {
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
              <Badge variant="outline">Jersey City</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">+34.3% YoY Demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Jersey City Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR by
              Zip Code &amp; PATH Stop
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 Jersey City rent price breakdown by unit size and
              zip code — Downtown (07302), Newport (07310), Journal Square
              (07306), The Heights (07307), Bergen-Lafayette (07304), and
              Greenville (07305) — with PATH commute context, vs-Manhattan
              price comparison, historical trend, and concession-adjusted
              net effective rent. Companion reference to our full{" "}
              <Link
                href="/jersey-city"
                className="text-primary underline underline-offset-2"
              >
                Jersey City apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Google Trends shows Jersey
              City apartment search demand at +34.3% YoY, peaking 2026-04-19
            </p>
          </header>

          {/* ── Summary ───────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Jersey City Rent at a Glance (2026)</CardTitle>
              <CardDescription>
                Average asking rents across the whole city
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$3,030</p>
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
                  <p className="text-lg font-semibold">$4,790</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$6,200</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range from older walkups in The Heights to new towers in
                Newport
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
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$3,030</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">420–560</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">550–780</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$4,790</TableCell>
                    <TableCell className="text-right">$6,700</TableCell>
                    <TableCell className="text-right">850–1,150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$6,200</TableCell>
                    <TableCell className="text-right">$9,000</TableCell>
                    <TableCell className="text-right">1,100–1,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$12,000+</TableCell>
                    <TableCell className="text-right">1,400+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low end represents walkup stock in Greenville (07305) and the
                older building stock in Bergen-Lafayette (07304). High end
                represents luxury doorman towers in Newport (07310) and
                Exchange Place along the waterfront — Harborside Plaza,
                Newport Tower, and the 99 Hudson block. The median weights
                the city-wide distribution including Journal Square
                new-construction mid-rises.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Zip Code ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Rent Prices by Zip Code</CardTitle>
              <CardDescription>
                Zip code is the single strongest price predictor in Jersey
                City
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zip / Area</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1BR</TableHead>
                    <TableHead className="text-right">2BR</TableHead>
                    <TableHead>PATH Stop</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      07302 (Downtown / Exchange Place)
                    </TableCell>
                    <TableCell className="text-right">$3,250</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                    <TableCell>Grove St / Exchange Place</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07310 (Newport)
                    </TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                    <TableCell>Newport</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07306 (Journal Square / McGinley Square)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell>Journal Square</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07307 (The Heights)
                    </TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell>HBLR + bus to Journal Sq</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07304 (Bergen-Lafayette)
                    </TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,550</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell>HBLR (Liberty State Park)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07305 (Greenville / West Side)
                    </TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,350</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell>HBLR + PATH transfer</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Downtown &amp; Exchange Place (07302)
                </h3>
                <p>
                  Downtown Jersey City is the core historic + luxury mix —
                  brownstones on the grid streets, new towers on the
                  waterfront (77 Hudson, Trump Plaza, 99 Hudson). The 4-minute
                  PATH to World Trade Center makes Exchange Place effectively
                  closer to Lower Manhattan jobs than most of Manhattan.
                  Studios average $3,250, 1-bedrooms $3,800. See our{" "}
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City guide
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Newport (07310)
                </h3>
                <p>
                  Newport is a planned waterfront development with large
                  family-friendly towers, a mall, and marina access. Clustered
                  around Newport PATH — 18 minutes to 33rd Street Midtown.
                  Studios average $3,300, 1-bedrooms $3,750. See our{" "}
                  <Link
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Jersey City guide
                  </Link>
                  {" "}and{" "}
                  <Link
                    href="/jersey-city/newport/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport rent-prices breakdown
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Journal Square (07306)
                </h3>
                <p>
                  Journal Square is the geographic center of JC, anchored by
                  the Journal Square Transportation Center (PATH + bus
                  terminal). It has seen a major construction wave since 2020
                  (90 Columbus, Journal Squared towers, Hudson Exchange) with
                  new buildings at a $600–$800/month discount to Downtown JC
                  for a slightly longer PATH ride (25 min to 33rd St).
                  Studios average $2,700, 1-bedrooms $3,200. See our{" "}
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square guide
                  </Link>
                  {" "}and{" "}
                  <Link
                    href="/jersey-city/journal-square/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square rent-prices breakdown
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The Heights (07307)
                </h3>
                <p>
                  The Heights sits atop the Palisades, connected to the rest
                  of JC by the 9th Street HBLR station and buses to Journal
                  Square PATH. Brownstones, pre-war apartment buildings, and
                  a handful of new mid-rises on Central Avenue. Studios
                  average $2,200, 1-bedrooms $2,700 — a sub-Journal-Square
                  price with Manhattan skyline views from the eastern
                  blocks.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Bergen-Lafayette (07304)
                </h3>
                <p>
                  Bergen-Lafayette runs south of Journal Square to Liberty
                  State Park. HBLR access at West Side Avenue and Liberty
                  State Park stations. Older brownstones, recent infill
                  townhouse and small-rental development. Studios average
                  $2,100, 1-bedrooms $2,550. Liberty State Park is the
                  largest green space within a 10-minute walk of any JC
                  neighborhood.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Greenville / West Side (07305)
                </h3>
                <p>
                  Greenville is the southernmost JC zip code and the cheapest
                  — 1-bedrooms from $1,900. Transit is HBLR + PATH transfer
                  at Liberty State Park, which adds 10–15 minutes to any
                  Manhattan commute vs. Downtown JC. Larger apartments and
                  townhouse conversions give substantial value on a
                  $/sq ft basis.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── PATH Commute Penalty ──────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                PATH Commute Penalty: How Transit Changes Your Rent Math
              </CardTitle>
              <CardDescription>
                Commute time and cost by zip code — what you actually pay in
                time + money
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zip / Area</TableHead>
                    <TableHead className="text-right">PATH to WTC</TableHead>
                    <TableHead className="text-right">PATH to 33rd St</TableHead>
                    <TableHead className="text-right">Monthly Transit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      07302 (Exchange Place)
                    </TableCell>
                    <TableCell className="text-right">4 min</TableCell>
                    <TableCell className="text-right">20 min</TableCell>
                    <TableCell className="text-right">$132</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07302 (Grove St)
                    </TableCell>
                    <TableCell className="text-right">7 min</TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                    <TableCell className="text-right">$132</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07310 (Newport)
                    </TableCell>
                    <TableCell className="text-right">9 min</TableCell>
                    <TableCell className="text-right">18 min</TableCell>
                    <TableCell className="text-right">$132</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07306 (Journal Sq)
                    </TableCell>
                    <TableCell className="text-right">13 min</TableCell>
                    <TableCell className="text-right">25 min</TableCell>
                    <TableCell className="text-right">$132</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07307 (Heights)
                    </TableCell>
                    <TableCell className="text-right">20–25 min</TableCell>
                    <TableCell className="text-right">32–37 min</TableCell>
                    <TableCell className="text-right">$132 + bus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07304 (Bergen-Lafayette)
                    </TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                    <TableCell className="text-right">40 min</TableCell>
                    <TableCell className="text-right">$132 + HBLR</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      07305 (Greenville)
                    </TableCell>
                    <TableCell className="text-right">30 min</TableCell>
                    <TableCell className="text-right">48 min</TableCell>
                    <TableCell className="text-right">$132 + HBLR</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                PATH costs $3.00 per ride and does not share an unlimited
                pass with the MTA subway. If you want subway access on top
                of PATH (for non-commute trips into Manhattan or to
                Brooklyn/Queens), add a $132 MTA 30-day pass on top. A
                reasonable Jersey City transit budget for a Manhattan
                commuter who also travels for non-work is $150–$200/month
                vs. $132/month for a Manhattan resident who only needs the
                MTA.
              </p>
            </CardContent>
          </Card>

          {/* ── vs Manhattan ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City vs. Manhattan Rent</CardTitle>
              <CardDescription>
                What you save at each JC zip code versus comparable Manhattan
                stock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comparison</TableHead>
                    <TableHead className="text-right">Jersey City 1BR</TableHead>
                    <TableHead className="text-right">Manhattan Equiv.</TableHead>
                    <TableHead className="text-right">Savings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Luxury Waterfront (JC 07302 vs. FiDi)
                    </TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$1,000/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Newport Tower (JC 07310 vs. Midtown East)
                    </TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$750/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New-Construction Mid-Rise (JC 07306 vs. UES)
                    </TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$900/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-War Walkup (JC 07307 vs. UWS)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$800/mo</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Annualized, Jersey City saves $9,000–$12,000/year on
                equivalent apartments vs. Manhattan, offset by roughly
                $360–$720/year in cross-system PATH+MTA costs and, for some
                renters, fewer weeknight dining options within a 10-minute
                walk. The waterfront lineup around Exchange Place and
                Newport closes that gap — Harborside, Newport, and the Pier
                13 food hall are on your doorstep.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Trend ────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Rent Trend (2020–2026)</CardTitle>
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
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">&minus;14%</TableCell>
                    <TableCell>Pandemic dip, concessions everywhere</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                    <TableCell>WFH flight from Manhattan to JC</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">+14%</TableCell>
                    <TableCell>Newport + Journal Sq lease-up</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">+6%</TableCell>
                    <TableCell>Return-to-office stabilizes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Supply catches up briefly</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,480</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Flat absorption year</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Demand surging — Trends +34% YoY</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Jersey City has run the hottest rent-appreciation trajectory
                in the NYC metro: a 35% cumulative rise from 2020 lows,
                compared with roughly 26% in Greenpoint and 31% in
                Williamsburg. Google Trends data shows searches for
                &quot;jersey city apartments&quot; peaking the week of
                2026-04-19 at a 52-week high — suggesting the 2026 spring
                leasing cycle is running at maximum demand right now. If
                you&apos;re hunting in Jersey City this May–July, expect
                fewer concessions and faster decisions than historic norms.
              </p>
            </CardContent>
          </Card>

          {/* ── Price Per Square Foot ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Jersey City Price Per Square Foot</CardTitle>
              <CardDescription>
                Apples-to-apples comparison across JC building types
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
                      Waterfront Luxury (07302 / 07310)
                    </TableCell>
                    <TableCell className="text-right">$68–$82</TableCell>
                    <TableCell className="text-right">600–780</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Journal Sq New Construction (07306)
                    </TableCell>
                    <TableCell className="text-right">$55–$68</TableCell>
                    <TableCell className="text-right">580–720</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-War Mid-Rise (07302 / 07307)
                    </TableCell>
                    <TableCell className="text-right">$48–$60</TableCell>
                    <TableCell className="text-right">600–800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brownstone / Townhouse Conversion
                    </TableCell>
                    <TableCell className="text-right">$40–$55</TableCell>
                    <TableCell className="text-right">650–950</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Walkup (07304 / 07305)
                    </TableCell>
                    <TableCell className="text-right">$32–$48</TableCell>
                    <TableCell className="text-right">550–750</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Jersey City $/sq ft runs roughly 30% below Manhattan and
                15–20% below Brooklyn waterfront. Per-square-foot value is
                strongest in the townhouse conversions scattered across
                Bergen-Lafayette and the Heights — 800+ sq ft 1-bedrooms for
                $2,600–$2,900 are common, putting them at $40/sq ft/year or
                less. The Journal Square new-construction wave offers
                branded luxury amenities at a $/sq ft price roughly
                equivalent to older Brooklyn stock.
              </p>
            </CardContent>
          </Card>

          {/* ── Net Effective Rent ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent in Jersey City</CardTitle>
              <CardDescription>
                What Journal Square and Newport concessions actually save you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Jersey City luxury buildings — especially Journal Squared,
                99 Hudson, Columbus Collection, and the Hudson Exchange
                towers — routinely advertise &quot;net effective rent&quot;
                rather than gross rent. Net effective = gross rent minus the
                prorated value of free months. Gross is what the landlord
                bills monthly; net effective is the true economic cost of
                the lease.
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
                    <TableCell className="font-medium">$3,500</TableCell>
                    <TableCell>1 month</TableCell>
                    <TableCell className="text-right">$3,208</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$3,500</TableCell>
                    <TableCell>2 months</TableCell>
                    <TableCell className="text-right">$2,917</TableCell>
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
                Concessions in Jersey City historically run deeper than
                Manhattan — in weaker seasons, Newport and Journal Square
                advertise 1–2 months free on top of gross rents that already
                include amenity fees. Note: at renewal, landlords quote
                gross rent, so your second-year rent can jump 8–17% on
                paper without any formal increase. Ask the leasing office to
                quote both the 13-month and 12-month scenarios in writing
                before signing.
              </p>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Jersey City Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget, zip code, and must-have amenities —
                our AI assistant will surface Jersey City listings matching
                your rent ceiling across Downtown, Newport, Journal Square,
                Heights, Bergen-Lafayette, and Greenville.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Related Jersey City &amp; NYC Rent Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/jersey-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Apartments: Full Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/downtown"
                    className="text-primary underline underline-offset-2"
                  >
                    Downtown Jersey City (07302) Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Jersey City (07310) Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/newport/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Newport Rent Prices Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square (07306) Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/journal-square/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Journal Square Rent Prices Breakdown
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
                    Best Time to Rent NYC
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    NJ vs NY Landlord Protections
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
