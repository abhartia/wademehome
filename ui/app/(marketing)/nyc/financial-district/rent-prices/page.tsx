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
    "Financial District (FiDi) Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tier & Sub-Zone | Wade Me Home",
  description:
    "Financial District rent prices for 2026 by unit size, sub-zone (Battery Park City, FiDi Core, Seaport, Stone Street, Two Bridges), and building tier (office conversion, pre-war loft, trophy new-con). Office-to-residential conversion stock, 421-g grandfathered stabilized units, and net-effective rent math.",
  keywords: [
    "financial district rent prices",
    "fidi rent prices",
    "fidi rent 2026",
    "fidi rent prices 2026",
    "fidi studio rent",
    "fidi 1 bedroom rent",
    "fidi 2 bedroom rent",
    "fidi 3 bedroom rent",
    "battery park city rent",
    "battery park city rent prices",
    "south street seaport rent",
    "stone street rent",
    "wall street rent",
    "10004 rent prices",
    "10005 rent prices",
    "10006 rent prices",
    "10038 rent prices",
    "70 pine rent",
    "100 wall rent",
    "25 water rent",
    "office conversion rent nyc",
    "421g stabilized fidi",
    "fidi net effective rent",
    "fidi pre war loft rent",
    "fidi trophy tower rent",
    "fidi vs tribeca rent",
    "fidi vs jersey city rent",
    "fidi rent stabilized",
    "fidi six year rent trend",
  ],
  openGraph: {
    title:
      "Financial District (FiDi) Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete FiDi rent price breakdown by unit size, sub-zone, and building tier — office-conversion vs. pre-war loft vs. trophy new-con — with 421-g stabilized notes and net-effective rent math.",
    url: `${baseUrl}/nyc/financial-district/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/financial-district/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Financial District (FiDi) Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Tier & Sub-Zone",
    description:
      "2026 Financial District rent prices by unit size, sub-zone, and building tier — office-conversion stock, pre-war loft buildings, trophy new-construction towers, plus 421-g stabilized notes and net-effective rent math.",
    datePublished: "2026-04-28",
    dateModified: "2026-04-28",
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
    mainEntityOfPage: `${baseUrl}/nyc/financial-district/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in the Financial District (FiDi) in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "FiDi 2026 medians are approximately $3,400 for a studio, $4,800 for a 1-bedroom, $6,800 for a 2-bedroom, and $9,500 for a 3-bedroom. Office-conversion stock (70 Pine, 100 Wall, 25 Water, 180 Water) typically lists 5–10% below comparable Tribeca pricing because layouts retain office-floorplate quirks (deeper interior, smaller bedrooms relative to total square footage, fewer corners). Trophy new-construction (15 Park Row, 50 West) and Battery Park City stock command premium pricing.",
        },
      },
      {
        "@type": "Question",
        name: "How does FiDi rent compare to Tribeca and Jersey City Downtown?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "FiDi 1-bedroom median ($4,800) vs. Tribeca ($11,500) is the cleanest direct trade — same Lower Manhattan footprint, ~58% lower rent, ~6 minutes farther on 4/5 to Midtown. FiDi vs. Jersey City Downtown ($3,700) is the cross-river comparison: ~$1,100/mo more for FiDi but PATH commute drops from 12 min to subway-on-block and you keep NYC tax residency. Battery Park City is FiDi's premium sub-zone, with 1-bedrooms running $5,500–$7,000.",
        },
      },
      {
        "@type": "Question",
        name: "What is 421-g and which FiDi buildings have it?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "421-g was a tax-abatement program from 1995 that incentivized office-to-residential conversion in Lower Manhattan. Buildings converted under 421-g were rent-stabilized for the duration of the abatement (typically 12–14 years). Most 421-g abatements have now expired (the program closed to new entrants in 2006), but some buildings — including 25 Broad, 90 West, 67 Wall, and 100 William — kept stabilized units past expiration through the 2009 Roberts v. Tishman Speyer line of cases. Always order a DHCR rent history before signing in any FiDi pre-2010 conversion.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest part of FiDi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Two Bridges (south of Wall, east of Pearl, around Cherry Street and Two Bridges) has FiDi's cheapest stock — studios from $2,800, 1-bedrooms from $3,500. The trade-off is a 12–15 minute walk to the 4/5/2/3 trains at Wall Street and a denser, less-amenitized block environment. Stone Street historic district (between Hanover Square and Pearl) has small-floorplate pre-war stock at FiDi Core minus 10–15%. The lowest-PSF stock per square foot is in the office-conversion buildings at the southern edge (25 Water, 180 Water) — large floorplates, lower per-sqft pricing.",
        },
      },
      {
        "@type": "Question",
        name: "How has FiDi rent changed over the last 6 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "FiDi 1-bedroom median dropped to ~$3,400 during 2020 COVID (worst-hit Manhattan submarket), then climbed steeply: +12% 2021, +14% 2022, +6% 2023, +3% 2024, +4% 2025, and ~+2% YTD 2026. Peak-to-peak 2020–2026 is approximately +41%, the steepest Manhattan recovery of any submarket. The recovery was driven by office-to-residential conversion adding ~5,000 units between 2020 and 2026, the post-COVID return-to-office wave, and the FARE Act's 2025 effect on broker-fee economics.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in FiDi?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — though it requires research. Three sources of stabilized stock: (1) pre-1974 buildings of 6+ units (rare in FiDi, mostly Stone Street historic district and Pearl Street walkups); (2) 421-g grandfathered stabilization in some 1990s–2000s office conversions (25 Broad, 90 West, 67 Wall, 100 William partial); (3) active 421-a buildings, which exist in trace amounts post-2017. Use our rent stabilization checker before signing — a stabilized 1-bedroom in FiDi can run $2,400 vs. $4,800 market.",
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
        name: "Financial District",
        item: `${baseUrl}/nyc/financial-district`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/financial-district/rent-prices`,
      },
    ],
  },
];

export default function FinancialDistrictRentPricesPage() {
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
              <Badge variant="outline">Financial District</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">Office conversion +41% post-COVID</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Financial District (FiDi) Rent Prices (2026): Studio, 1BR, 2BR &amp;
              3BR by Tier &amp; Sub-Zone
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 FiDi rent breakdown — by unit size, by sub-zone
              (Battery Park City vs. FiDi Core vs. Seaport vs. Stone Street
              vs. Two Bridges), and by building tier (office conversion,
              pre-war loft, trophy new-construction). 421-g stabilized
              grandfathering, the post-COVID rent recovery, and net-effective
              rent math. Companion to our full{" "}
              <Link
                href="/nyc/financial-district"
                className="text-primary underline"
              >
                FiDi neighborhood guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Reviewed 2026-04-28 &middot; FiDi is the steepest post-COVID
              recovery submarket in Manhattan with the largest active office-to-
              residential conversion pipeline in the U.S.
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>FiDi Rent at a Glance (2026)</CardTitle>
              <CardDescription>Median asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio
                  </p>
                  <p className="text-lg font-semibold">$3,400</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$6,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$9,500</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FiDi Rent by Unit Size &amp; Building Tier</CardTitle>
              <CardDescription>
                Office conversion vs. pre-war loft vs. trophy new-construction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Office conversion</TableHead>
                    <TableHead className="text-right">Pre-war loft</TableHead>
                    <TableHead className="text-right">Trophy new-con</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-bedroom</TableCell>
                    <TableCell className="text-right">$6,400</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                    <TableCell className="text-right">$8,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-bedroom</TableCell>
                    <TableCell className="text-right">$8,800</TableCell>
                    <TableCell className="text-right">$9,500</TableCell>
                    <TableCell className="text-right">$12,500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                <strong>Office conversion</strong> = buildings like 70 Pine,
                100 Wall, 25 Water, 180 Water, 20 Broad, 116 John, 25 Broad
                (post-2010 conversion projects). Floorplates retain quirks:
                deeper interior, smaller bedrooms relative to total sqft,
                fewer corners — but extremely high amenity stock.{" "}
                <strong>Pre-war loft</strong> = early-1900s commercial-to-
                residential converted small-floorplate buildings, typically on
                Pearl, Stone, or Front. <strong>Trophy new-con</strong> = 15
                Park Row, 50 West, 50 Murray, the few ground-up FiDi
                residential developments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FiDi Rent by Sub-Zone</CardTitle>
              <CardDescription>
                Battery Park City vs. FiDi Core vs. Seaport vs. Stone Street vs.
                Two Bridges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-zone</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1BR</TableHead>
                    <TableHead className="text-right">2BR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Battery Park City
                    </TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$8,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">FiDi Core</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">South Street Seaport</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Stone Street historic</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Two Bridges / South of Wall
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FiDi Office Conversion Trophy Stock — 1BR &amp; 2BR Pricing</CardTitle>
              <CardDescription>
                The largest U.S. office-to-residential conversion wave is
                concentrated in Lower Manhattan. Tower-by-tower pricing for the
                buildings that dominate FiDi listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Year converted</TableHead>
                    <TableHead className="text-right">1BR median</TableHead>
                    <TableHead className="text-right">2BR median</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">70 Pine</TableCell>
                    <TableCell>2016 (Cetra Ruddy)</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$7,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">100 Wall</TableCell>
                    <TableCell>2022 (Vanbarton)</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">25 Water</TableCell>
                    <TableCell>2024 (GFP)</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">180 Water</TableCell>
                    <TableCell>2017 (MetroLoft)</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">20 Broad</TableCell>
                    <TableCell>2018 (MetroLoft)</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">116 John</TableCell>
                    <TableCell>2014 (MetroLoft)</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$6,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">25 Broad (421-g)</TableCell>
                    <TableCell>1997 (421-g)</TableCell>
                    <TableCell className="text-right">$3,800 (some stabilized)</TableCell>
                    <TableCell className="text-right">$5,500 (some stabilized)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs italic">
                25 Broad and 90 West are the FiDi buildings most likely to have
                grandfathered 421-g stabilization. Always request a DHCR rent
                history before signing — it&apos;s free and conclusive.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FiDi 6-Year Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                The steepest Manhattan submarket recovery — driven by office-
                conversion supply, return-to-office, and FARE Act pricing reset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">1BR median</TableHead>
                    <TableHead className="text-right">YoY change</TableHead>
                    <TableHead>Driver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">−18%</TableCell>
                    <TableCell>COVID exodus, worst-hit submarket</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">+12%</TableCell>
                    <TableCell>Initial recovery</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">+14%</TableCell>
                    <TableCell>Return-to-office wave + early conversions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$4,550</TableCell>
                    <TableCell className="text-right">+6%</TableCell>
                    <TableCell>Steady demand, conversion supply growing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">+3%</TableCell>
                    <TableCell>Conversion supply absorbed; cooling</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$4,750</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>FARE Act pricing reset</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 YTD</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Stabilizing post-FARE Act</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Peak-to-peak 2020–2026: <strong>+41%</strong> on 1-bedrooms.
                That&apos;s the steepest recovery of any Manhattan submarket and
                materially above Tribeca (+22%) and West Village (+18%) over
                the same window. The drivers were a low base (FiDi was
                disproportionately hit by COVID), supply additions from the
                largest U.S. office-conversion pipeline, and the post-2023
                return-to-office wave.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>$/sqft by Building Tier (2026)</CardTitle>
              <CardDescription>
                Per-square-foot pricing makes the office-conversion value
                proposition explicit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead className="text-right">Typical sqft (1BR)</TableHead>
                    <TableHead className="text-right">$/sqft</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Office conversion</TableCell>
                    <TableCell className="text-right">800–1,000</TableCell>
                    <TableCell className="text-right">$5.00–$5.50</TableCell>
                    <TableCell>Largest floorplates, deepest interior</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-war loft</TableCell>
                    <TableCell className="text-right">650–800</TableCell>
                    <TableCell className="text-right">$5.80–$6.20</TableCell>
                    <TableCell>Higher per-sqft, more character</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trophy new-con</TableCell>
                    <TableCell className="text-right">700–850</TableCell>
                    <TableCell className="text-right">$6.50–$7.20</TableCell>
                    <TableCell>Highest per-sqft; full amenity stack</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Battery Park City</TableCell>
                    <TableCell className="text-right">750–950</TableCell>
                    <TableCell className="text-right">$6.80–$7.50</TableCell>
                    <TableCell>Park view + waterfront premium</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs italic">
                Office-conversion buildings deliver the largest absolute square
                footage per dollar in FiDi — 800–1,000 sqft on a 1BR vs.
                650–800 in pre-war stock. The trade-off is layout: deeper
                floorplates with smaller bedrooms relative to overall size.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net-Effective Rent Math</CardTitle>
              <CardDescription>
                FiDi tower lease-ups push 1.5–2 months free. Here&apos;s how to think
                about it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Most FiDi office-conversion buildings advertise gross asking
                rent, then list a concession (commonly 1.5 or 2 months free) at
                the bottom of the listing. The headline gross rent is what
                you&apos;ll pay each month; the net-effective rent is the rate
                amortized across all 12 (or 14) months including the free
                period. Brokers and StreetEasy listings sometimes show
                net-effective only — always ask which is which.
              </p>
              <p>
                <strong>Worked example:</strong> 100 Wall lists a 1-bedroom at
                $5,400/mo gross with 1.5 months free on a 14-month lease. Net
                effective = (5,400 × 12.5) ÷ 14 = $4,821/mo amortized. You pay
                $5,400 monthly when you do pay; you owe the gross rent on a
                renewal unless the new offer also includes concessions. Always
                run the math before comparing two listings — a $5,400 with 1.5
                free beats a $5,000 gross with no concession.
              </p>
              <p>
                Try the math with our{" "}
                <Link
                  href="/tools/net-effective-rent-calculator"
                  className="text-primary underline"
                >
                  net-effective rent calculator
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FiDi vs. Tribeca vs. JC Downtown — Direct Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submarket</TableHead>
                    <TableHead className="text-right">1BR median</TableHead>
                    <TableHead className="text-right">2BR median</TableHead>
                    <TableHead>Stabilized share</TableHead>
                    <TableHead>Subway access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Financial District</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                    <TableCell>~12% (421-g + pre-1974)</TableCell>
                    <TableCell>4/5/2/3/J/Z/R/W/A/C/E + PATH + 3 ferries</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca</TableCell>
                    <TableCell className="text-right">$11,500</TableCell>
                    <TableCell className="text-right">$18,500</TableCell>
                    <TableCell>~5%</TableCell>
                    <TableCell>1/2/3/A/C/E</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">JC Downtown</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell>~3% (NJ rent control limited)</TableCell>
                    <TableCell>PATH (Grove St / Exchange Pl)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SoHo</TableCell>
                    <TableCell className="text-right">$10,200</TableCell>
                    <TableCell className="text-right">$16,500</TableCell>
                    <TableCell>~7%</TableCell>
                    <TableCell>R/W/N/Q + 6/B/D/F/M nearby</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs italic">
                FiDi delivers Lower Manhattan trophy-tier amenities at roughly
                42% of Tribeca pricing on 1BR. The trade-off is fewer street-
                level food/retail options below Wall Street, though Stone
                Street and the Seaport have closed much of that gap since 2021.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Related guides &amp; tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc/financial-district">
                  <span>Full FiDi neighborhood guide</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc/tribeca">
                  <span>Tribeca apartments</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/jersey-city/downtown/rent-prices">
                  <span>JC Downtown rent prices</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/tools/rent-stabilization-checker">
                  <span>Rent stabilization checker</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/tools/net-effective-rent-calculator">
                  <span>Net-effective rent calculator</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc/luxury-apartments">
                  <span>NYC luxury apartments hub</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
