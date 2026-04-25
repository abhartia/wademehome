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
    "Harlem Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Area & Building Type | Wade Me Home",
  description:
    "Harlem rent prices for 2026 by unit size, sub-area (Central Harlem, South Harlem/SoHa, East Harlem/El Barrio, West Harlem/Hamilton Heights/Sugar Hill), and building type (brownstone floor-through, pre-war walkup, post-war doorman, new construction). Brownstone tier breakdown, RGB rent-stabilized stock context, and 6-year rent trend.",
  keywords: [
    "harlem rent prices",
    "harlem rent",
    "harlem rent prices 2026",
    "harlem studio rent",
    "harlem 1 bedroom rent",
    "harlem 2 bedroom rent",
    "harlem 3 bedroom rent",
    "average rent harlem",
    "central harlem rent",
    "south harlem rent",
    "east harlem rent",
    "west harlem rent",
    "hamilton heights rent",
    "sugar hill rent",
    "morningside heights rent",
    "harlem brownstone rent",
    "harlem pre-war rent",
    "harlem doorman rent",
    "el barrio rent",
    "soha rent prices",
    "harlem net effective rent",
    "harlem $/sq ft",
  ],
  openGraph: {
    title:
      "Harlem Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Area Breakdown",
    description:
      "Complete Harlem rent breakdown by unit size, sub-area, and building type, with brownstone floor-through tier and rent-stabilized stock context.",
    url: `${baseUrl}/nyc/harlem/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/harlem/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Harlem Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Area & Building Type",
    description:
      "2026 Harlem rent prices by unit size, sub-area, building type, brownstone floor-through tier, RGB rent-stabilized context, and 6-year trend.",
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
    mainEntityOfPage: `${baseUrl}/nyc/harlem/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Harlem in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 Harlem averages are approximately $1,900 for a studio, $2,600 for a 1-bedroom, $3,500 for a 2-bedroom, and $4,500 for a 3-bedroom. South Harlem (110th–125th, Central Park to St. Nicholas) runs 30–40% above this median for new-construction stock; East Harlem and Hamilton Heights walkup stock runs 10–15% below. Brownstone floor-throughs in Central Harlem and Hamilton Heights price between the median and South Harlem premium depending on floor and condition.",
        },
      },
      {
        "@type": "Question",
        name: "How does Harlem rent compare to the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harlem 1-bedroom median ($2,600) is approximately 25% below Upper West Side 1-bedroom median ($3,500). On 2-bedrooms, Harlem ($3,500) is roughly 30% below UWS ($4,800). The narrowest gap is at the South Harlem new-construction tier, where buildings on Central Park North below 120th routinely list 1-bedrooms at $3,800–$4,800 — within 15% of Manhattan Valley UWS pricing. The widest gap is on walkup pre-war stock — Hamilton Heights walkup 1-bedrooms ($2,400–$2,800) run roughly 35% below Manhattan Valley UWS walkups ($3,200–$3,500).",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest part of Harlem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "East Harlem above 116th Street and Hamilton Heights above 145th Street are the cheapest sub-areas. East Harlem 1-bedrooms in older walkup stock list $2,200–$2,500 with 6 train at 116th and 125th. Hamilton Heights 1-bedrooms in the 145th–155th range run $2,300–$2,700 with 1 train at Broadway and A/B/C/D at St. Nicholas. The trade-offs: East Harlem east of Lexington has more uneven block-to-block character; Hamilton Heights above 155th adds 4–6 minutes to a Midtown commute.",
        },
      },
      {
        "@type": "Question",
        name: "How has Harlem rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harlem 1-bedroom median rent dropped to approximately $2,200 during 2020 COVID, then climbed: ~5% in 2022, ~6% in 2023, ~3% in 2024, and ~3% annually since. The trajectory was steeper than Upper West Side because Harlem inventory turns over faster (more walkup stock, smaller landlords). Peak-to-peak 2020–2026 is approximately +18%, in line with UWS but well below Greenpoint or Williamsburg luxury stock. Google Trends shows Harlem search demand up 38.6% year-over-year through April 2026 — the fastest-rising Manhattan signal — suggesting continued upward pressure into 2026.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in Harlem?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Harlem has a substantial concentration of rent-stabilized stock. Buildings built before 1974 with 6+ units are typically stabilized; this describes most 6-story pre-war walkups across Lenox Avenue, 7th Avenue, St. Nicholas Avenue, and Frederick Douglass Boulevard. Brownstones with 4 or fewer rental units typically are NOT stabilized. 2026 RGB renewal caps are 3.0% for 1-year and 4.5% for 2-year leases. Always ask the landlord for DHCR rent registration history.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Harlem brownstone floor-through premium?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Brownstone floor-throughs in Harlem command pricing roughly between standard 1-bedroom and standard 2-bedroom rates depending on floor. A parlor-floor (2nd floor) 1-bedroom in a Central Harlem brownstone with 11-foot ceilings and original details runs $2,800–$3,400, vs. $2,400–$2,800 for an equivalent-square-foot 1-bedroom in a 6-story walkup. The premium reflects the original architectural detail and the larger room sizes — brownstone parlor-floor units are typically 700–950 sq ft vs. 500–650 sq ft for walkup 1-bedrooms.",
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
        name: "Harlem",
        item: `${baseUrl}/nyc/harlem`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/harlem/rent-prices`,
      },
    ],
  },
];

export default function HarlemRentPricesPage() {
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
              <Badge variant="outline">Harlem</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">+38.6% YoY demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Harlem Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR by
              Sub-Area &amp; Building Type
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Harlem — by unit size,
              by sub-area (Central / South / East / West Harlem / Hamilton
              Heights), and by building type (brownstone floor-through,
              pre-war walkup, post-war, new-construction). Includes the
              rent-stabilized stock context, 6-year trend, $/sq ft by
              building type, and net-effective rent math. Companion to our
              full{" "}
              <Link
                href="/nyc/harlem"
                className="text-primary underline underline-offset-2"
              >
                Harlem apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Harlem search demand is up
              38.6% YoY — the fastest-rising signal in Manhattan
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Harlem Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$1,900</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 1-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$2,600</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$3,500</p>
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

          <Card>
            <CardHeader>
              <CardTitle>Harlem Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                From Hamilton Heights walkup studios to South Harlem new-con
                3-bedrooms
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
                    <TableCell className="text-right">$1,500</TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">350–500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">500–800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell className="text-right">700–1,150</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                    <TableCell className="text-right">950–1,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$6,200</TableCell>
                    <TableCell className="text-right">$10,000+</TableCell>
                    <TableCell className="text-right">1,300+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low-end pricing reflects East Harlem walkups above 116th and
                Hamilton Heights walkups above 145th. High-end pricing
                reflects South Harlem new-construction towers on Central
                Park North (1280 Fifth, the Adeline, the new Lenox 145
                rentals). Median reflects the weighted Harlem mix.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Harlem Rent Prices by Sub-Area</CardTitle>
              <CardDescription>
                Sub-area placement drives Harlem pricing more than block
                position
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
                      South Harlem / SoHa (110th–125th)
                    </TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Central Harlem (125th–145th)
                    </TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      West Harlem / Morningside (110th–125th)
                    </TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Harlem / El Barrio (96th–125th)
                    </TableCell>
                    <TableCell className="text-right">$1,800</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Hamilton Heights / Sugar Hill (135th–155th)
                    </TableCell>
                    <TableCell className="text-right">$1,750</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Harlem / SoHa
                </h3>
                <p>
                  The new-construction premium tier. South of 125th, Central
                  Park North to St. Nicholas. Buildings like 1280 Fifth, the
                  Adeline, and several 2020s rentals on 110th–115th list
                  1-bedrooms $3,400–$4,800 — UWS pricing with a Harlem zip.
                  2/3 express on Lenox at 110th and 116th, B/C local on
                  Central Park West.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Central Harlem
                </h3>
                <p>
                  The brownstone heart. 125th–145th, 5th Ave to St. Nicholas.
                  Hancock Pl, Astor Row, Strivers&apos; Row 138th/139th are
                  the trophy preserved blocks. Pre-war walkup 1-bedrooms run
                  $2,300–$2,700; brownstone parlor floor-throughs run
                  $2,800–$3,400. 2/3 + A/B/C/D + 4/5/6 service.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  West Harlem / Morningside Heights
                </h3>
                <p>
                  Columbia and Barnard adjacency. 110th–125th, Morningside
                  to Riverside. 1 train on Broadway, A/B/C/D at St.
                  Nicholas. Pre-war 6-story walkups dominate; some 2010s
                  Columbia housing additions. 1-bedrooms $2,500–$3,200.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  East Harlem / El Barrio
                </h3>
                <p>
                  Lexington corridor. 96th–125th, 5th Ave east to FDR. 4/5/6
                  on Lexington at 96th, 103rd, 110th, 116th, 125th. Older
                  tenement stock plus rezoning new builds (Lex + 125th, Lex
                  + 116th). 1-bedrooms $2,200–$2,800 in older stock,
                  $3,000–$3,800 in new construction.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Hamilton Heights / Sugar Hill
                </h3>
                <p>
                  The hill above 135th. 1 on Broadway, A/B/C/D at St.
                  Nicholas. Pre-war 6-story walkups on Hamilton, Convent,
                  St. Nicholas, and Edgecombe. Studios $1,650–$2,000,
                  1-bedrooms $2,300–$2,700. Lowest $/sq ft on Manhattan
                  with subway access.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Harlem Rent Prices by Building Type</CardTitle>
              <CardDescription>
                Brownstone floor-through is the underrated tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building Type</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">$/sq ft / yr</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war walkup (5–6 story)
                    </TableCell>
                    <TableCell className="text-right">$1,750</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$58–66</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brownstone floor-through
                    </TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$48–58</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Post-war doorman
                    </TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$60–70</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New construction (post-2015)
                    </TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$72–84</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Brownstone floor-through is the lowest $/sq ft tier — you
                get 700–950 sq ft of parlor-floor space with original
                details for $2,800–$3,400 1BR pricing. The trade-off: small
                landlord, basement-share laundry, no doorman/gym.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Harlem Brownstone Floor-Through Tier</CardTitle>
              <CardDescription>
                The hidden value tier — what each floor of a Harlem brownstone
                rents for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor</TableHead>
                    <TableHead className="text-right">1BR Range</TableHead>
                    <TableHead>What You Get</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Garden / Ground
                    </TableCell>
                    <TableCell className="text-right">
                      $2,000–$2,800
                    </TableCell>
                    <TableCell>
                      Private back-yard, lower ceilings, often more recent reno
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Parlor (2nd floor)
                    </TableCell>
                    <TableCell className="text-right">
                      $2,500–$3,400
                    </TableCell>
                    <TableCell>
                      11-ft ceilings, original details, biggest rooms
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Top floor (3rd/4th)
                    </TableCell>
                    <TableCell className="text-right">
                      $2,300–$3,000
                    </TableCell>
                    <TableCell>
                      Skylights common, lower ceilings, 4-story walkup
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Duplex</TableCell>
                    <TableCell className="text-right">
                      $3,200–$4,500
                    </TableCell>
                    <TableCell>
                      Parlor + adjacent floor, often kitchen on parlor
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6-Year Harlem Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                COVID dip, recovery, and steady mid-single-digit growth
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
                    <TableHead className="text-right">YoY Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$1,650</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">−4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$1,700</TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">+3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$1,800</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,250</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$1,820</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,350</TableCell>
                    <TableCell className="text-right">+4%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$1,850</TableCell>
                    <TableCell className="text-right">$2,550</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$1,880</TableCell>
                    <TableCell className="text-right">$2,575</TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026</TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Peak-to-peak 2020–2026: studios +15%, 1-bedrooms +18%,
                2-bedrooms +17%. With Google Trends showing Harlem search
                demand up 38.6% YoY through April 2026, expect continued
                3–5% rent growth into 2027.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net-Effective Rent on Harlem Concessions</CardTitle>
              <CardDescription>
                How to compute true monthly cost when a landlord offers free
                months
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                South Harlem and East Harlem new-construction commonly offer
                concessions on initial 12-month leases. Net-effective rent
                is the gross rent times 11 (or 10), divided by 12 — your
                actual average monthly cost.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>$3,800 1BR with 1 month free:</strong>{" "}
                  3,800 × 11 / 12 = <strong>$3,483 net effective</strong>
                </li>
                <li>
                  <strong>$3,800 1BR with 2 months free:</strong>{" "}
                  3,800 × 10 / 12 = <strong>$3,167 net effective</strong>
                </li>
                <li>
                  <strong>$4,400 2BR with 1.5 months free:</strong>{" "}
                  4,400 × 10.5 / 12 = <strong>$3,850 net effective</strong>
                </li>
              </ul>
              <p>
                Most lease applications and payment portals show gross rent
                only. Verify in writing whether the concession is a free
                month at lease start or pro-rated across all 12 months —
                this affects your move-in cash but not the math.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Harlem apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, your sub-area preference
                (Central, South, East, West, Hamilton Heights), and your
                budget — we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Harlem+apartments">
                  Search Harlem Apartments
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
                    href="/nyc/harlem"
                    className="text-primary underline underline-offset-2"
                  >
                    Full Harlem Apartment Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/harlem/apartments-under-2500"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Apartments Under $2,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/harlem/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Harlem Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    UWS Rent Prices (next neighborhood south)
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
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood
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
                    FARE Act &amp; Broker Fees
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
