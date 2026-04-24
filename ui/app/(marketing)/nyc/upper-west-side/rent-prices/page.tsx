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
    "Upper West Side Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Block & Building Type | Wade Me Home",
  description:
    "Upper West Side rent prices for 2026 by unit size, block segment (60s–80s vs. 80s–96th vs. 96th–110th), and building type (pre-war doorman, post-war, walkup, brownstone). Central Park West premium, Riverside Drive discount, school-district rent lift, and concession-adjusted net effective rent math.",
  keywords: [
    "upper west side rent prices",
    "uws rent prices",
    "upper west side rent",
    "uws rent",
    "upper west side studio rent",
    "upper west side 1 bedroom rent",
    "upper west side 2 bedroom rent",
    "upper west side 3 bedroom rent",
    "average rent upper west side",
    "central park west rent",
    "riverside drive rent",
    "west end avenue rent",
    "columbus avenue rent",
    "amsterdam avenue rent",
    "upper west side pre-war rent",
    "upper west side doorman rent",
    "upper west side brownstone rent",
    "uws vs upper east side rent",
    "uws school district rent",
    "upper west side net effective rent",
    "morningside heights rent",
    "manhattan valley rent",
  ],
  openGraph: {
    title:
      "Upper West Side Rent Prices (2026): Studio, 1BR, 2BR & 3BR Breakdown",
    description:
      "Complete Upper West Side rent price breakdown by unit size, block segment, and building type, with Central Park West premium and net-effective rent math.",
    url: `${baseUrl}/nyc/upper-west-side/rent-prices`,
    type: "article",
  },
  alternates: {
    canonical: `${baseUrl}/nyc/upper-west-side/rent-prices`,
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Upper West Side Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Block & Building Type",
    description:
      "2026 Upper West Side rent prices by unit size, block segment, and building type, with Central Park West premium, historical trends, and net-effective rent math.",
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
    mainEntityOfPage: `${baseUrl}/nyc/upper-west-side/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent on the Upper West Side in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 2026 Upper West Side averages are approximately $2,400 for a studio, $3,500 for a 1-bedroom, $4,800 for a 2-bedroom, $6,700 for a 3-bedroom, and $9,500+ for a 4-bedroom. Pre-war doorman stock on Central Park West runs the highest — 1-bedrooms $4,200, 2-bedrooms $6,000. Walkups on Amsterdam and Columbus run the lowest — 1-bedrooms $2,900. The median assumes the weighted mix across blocks 60th to 96th.",
        },
      },
      {
        "@type": "Question",
        name: "How does Upper West Side rent compare to Upper East Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upper West Side 1-bedroom median ($3,500) is $200–$400 more than comparable Upper East Side stock ($3,100–$3,300), reflecting Central Park West premium and Riverside Park access. On 2-bedrooms, UWS runs $4,800 vs. UES $4,400 — a $400 gap. The gap narrows on pre-war doorman stock and widens on newer post-war and new-construction. Subway access trade-offs: UWS has 1/2/3/A/B/C/D — more comprehensive than UES&apos;s 4/5/6 + Q.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Central Park West premium?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Central Park West (CPW) apartments with actual park views rent for approximately $800–$1,500/month more than equivalent units on West End Avenue or Columbus. A 2-bedroom on CPW with a park view runs $7,000+ vs. $5,500–$5,800 for the same floorplate on Columbus. The premium scales with view clarity — direct park frontage is highest, park-peek views command roughly half the premium, and no-view CPW units run near West End Avenue parity.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest part of the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Manhattan Valley (96th Street to 110th Street, between Central Park West and Broadway) has the cheapest UWS rent — studios from $1,900, 1-bedrooms from $2,600. Further north, Morningside Heights (110th to 125th) has similar or slightly lower pricing for walkup stock and Columbia-adjacent mid-rises. The trade-off is a longer subway ride to Midtown (96th Street express is 20 min to Columbus Circle, 110th Street is 25 min) and fewer amenities immediately adjacent.",
        },
      },
      {
        "@type": "Question",
        name: "How has UWS rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upper West Side 1-bedroom median rent dropped to approximately $3,000 during 2020 COVID, then climbed — 5% in 2022, 5% in 2023, 2% in 2024, and 1% annually since. The trajectory was gentler than Brooklyn luxury stock (Williamsburg, LIC) because UWS family and doorman inventory has structurally lower turnover. Peak-to-peak 2020–2026 is roughly +17%, well below the 25–35% rises in Greenpoint, Williamsburg, and Jersey City.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments on the Upper West Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — the Upper West Side has a substantial stock of rent-stabilized units in pre-1974 buildings of 6+ units. Older brownstone-adjacent walkups on Columbus, Amsterdam, and West End Avenue are common locations. Stabilized units can rent significantly below market — a stabilized 1-bedroom can be $2,400 vs. $3,500 market. Turnover is low and competition is fierce when a unit comes up. Watch the building&apos;s pre-1974 construction date and confirm with the landlord; ask for the current rent registration from DHCR.",
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
        name: "Upper West Side",
        item: `${baseUrl}/nyc/upper-west-side`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/upper-west-side/rent-prices`,
      },
    ],
  },
];

export default function UpperWestSideRentPricesPage() {
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
              <Badge variant="outline">Upper West Side</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">Family AOV</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Upper West Side Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR
              by Block &amp; Building Type
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for the Upper West Side —
              by unit size, by block segment (60s–80s, 80s–96th, 96th–110th
              Manhattan Valley), and by building type (pre-war doorman,
              post-war, walkup, brownstone). Central Park West premium,
              Riverside Drive positioning, rent-stabilized stock, and
              net-effective rent math. Companion to our full{" "}
              <Link
                href="/nyc/upper-west-side"
                className="text-primary underline underline-offset-2"
              >
                Upper West Side apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; UWS is Manhattan&apos;s
              largest family-rental zone with substantial pre-war
              rent-stabilized stock
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Upper West Side Rent at a Glance (2026)</CardTitle>
              <CardDescription>Average asking rents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average Studio
                  </p>
                  <p className="text-lg font-semibold">$2,400</p>
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
                  <p className="text-lg font-semibold">$4,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$6,700</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UWS Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                From Columbus walkup studios to Central Park West 4BR
                doorman classics
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
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">400–550</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">550–800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                    <TableCell className="text-right">850–1,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$6,700</TableCell>
                    <TableCell className="text-right">$10,500</TableCell>
                    <TableCell className="text-right">1,200–1,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                    <TableCell className="text-right">$9,500</TableCell>
                    <TableCell className="text-right">$15,000+</TableCell>
                    <TableCell className="text-right">1,500+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Low-end pricing reflects Manhattan Valley (96th–110th)
                walkups without amenities. High-end pricing reflects
                Central Park West pre-war doorman buildings (The Beresford,
                The Dakota, The Eldorado, 15 Central Park West, 101 West
                78th) with park views. The median reflects the weighted UWS
                mix across blocks 60th to 96th, which is where the bulk of
                rental inventory lives.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UWS Rent Prices by Block Segment</CardTitle>
              <CardDescription>
                North-south block position drives price more than avenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block Segment</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Lincoln Square (60s–72nd)
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Core UWS (72nd–86th)
                    </TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Upper UWS (86th–96th)
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Manhattan Valley (96th–110th)
                    </TableCell>
                    <TableCell className="text-right">$1,900</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Morningside Heights (110th–125th)
                    </TableCell>
                    <TableCell className="text-right">$1,850</TableCell>
                    <TableCell className="text-right">$2,550</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Lincoln Square (60s–72nd)
                </h3>
                <p>
                  The most expensive UWS block segment. Lincoln Center,
                  Columbus Circle, Time Warner Center, and the doorman
                  buildings along 72nd Street (The Dakota, San Remo just
                  north). Rents: Studios from $2,700, 1-bedrooms from
                  $3,900. Subway: 1/2/3 at 66th/72nd, A/B/C/D at Columbus
                  Circle, 1 at 59th.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Core UWS (72nd–86th)
                </h3>
                <p>
                  The historic UWS heartland. Central Park West&apos;s most
                  iconic pre-war co-ops and rentals (Eldorado, Beresford,
                  Kenilworth, San Remo). West End Avenue&apos;s pre-war
                  doorman rentals. Columbus and Amsterdam mid-rise and
                  walkup stock. Subway: 1/2/3 at 79th and 86th, B/C at 81st
                  (Natural History Museum). This is the densest rental
                  inventory zone.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Upper UWS (86th–96th)
                </h3>
                <p>
                  The transition zone. Still strong pre-war doorman supply
                  along Central Park West and West End Avenue, but prices
                  soften $300–$400/month vs. the 72nd–86th core. Best
                  value for families who prefer quieter blocks. The Seville,
                  The Turin, and other mid-size pre-war buildings offer
                  larger floorplates at lower monthly rents.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Manhattan Valley (96th–110th)
                </h3>
                <p>
                  UWS&apos;s value zone. Pre-war walkups on Columbus and
                  Amsterdam mixed with post-war mid-rise stock. Studios
                  from $1,900, 1-bedrooms from $2,700, 2-bedrooms from
                  $3,700. A substantial portion of the stock is
                  rent-stabilized — worth asking the landlord or checking
                  DHCR. Subway access: 1/2/3 at 96th and 103rd, B/C at
                  96th and 103rd.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Morningside Heights (110th–125th)
                </h3>
                <p>
                  Columbia-adjacent pre-war and mid-century stock. Studios
                  from $1,850, 1-bedrooms from $2,550. The best $/sq ft on
                  the Upper West Side. Trade-off: 25-minute subway to
                  Midtown, and a quieter feel during Columbia&apos;s summer
                  break. Morningside Park offers a different green-space
                  character vs. Riverside or Central Park.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UWS Rent Prices by Building Type</CardTitle>
              <CardDescription>
                The pre-war vs. post-war vs. new-construction rent gap
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
                      Pre-War Doorman (CPW / WEA)
                    </TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$6,000</TableCell>
                    <TableCell className="text-right">$60–$78</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-War Walkup (Columbus / Amsterdam)
                    </TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$48–$60</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Post-War Doorman (1960s–80s)
                    </TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$55–$68</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New Construction (post-2010)
                    </TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$70–$90</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brownstone Conversion
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$50–$65</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Per-square-foot value is best in pre-war walkups and
                brownstone conversions ($48–$65/sq ft/yr). New-construction
                post-2010 ($70–$90/sq ft/yr) commands a significant premium
                despite smaller floorplates. If you value amenities and
                newer kitchens, the premium is worth it; if you value space
                and character, pre-war walkups and brownstones give you
                more per dollar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Central Park West View Premium</CardTitle>
              <CardDescription>
                What the park view actually costs you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>View Tier</TableHead>
                    <TableHead className="text-right">1-Bedroom</TableHead>
                    <TableHead className="text-right">2-Bedroom</TableHead>
                    <TableHead className="text-right">Premium vs No-View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Direct CPW Park Frontage
                    </TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$7,000+</TableCell>
                    <TableCell className="text-right">+$1,200–$1,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      CPW Park Peek (angle view)
                    </TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">$6,300</TableCell>
                    <TableCell className="text-right">+$700–$900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      CPW No-View (rear-facing)
                    </TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                    <TableCell className="text-right">baseline</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      West End Avenue (CPW-equivalent floorplate)
                    </TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$5,100</TableCell>
                    <TableCell className="text-right">−$200 vs CPW no-view</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                The Central Park West park-view premium is real and
                scales with view clarity. A direct-frontage 2-bedroom
                commands $1,200–$1,500/month more than a rear-facing unit
                in the same building. Rear-facing CPW stock is only
                modestly priced above West End Avenue equivalents — if you
                want the CPW address but not the premium, target
                rear-facing units. Confirm view with an in-person tour;
                photos overstate park visibility.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UWS Rent Trend (2020–2026)</CardTitle>
              <CardDescription>
                Median 1-bedroom asking rent over the past 6 years
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Median 1BR</TableHead>
                    <TableHead className="text-right">YoY</TableHead>
                    <TableHead>Context</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">2020</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">&minus;12%</TableCell>
                    <TableCell>Pandemic exodus</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$3,150</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Recovery begins</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Return to office</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,450</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Family demand steady</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,480</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Flattening</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Stable</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">0%</TableCell>
                    <TableCell>Flat</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                UWS has the gentlest rent trajectory of any major Manhattan
                rental neighborhood — +17% cumulative from 2020 lows to
                2026, vs. 25–35% elsewhere. The mix of rent-stabilized
                stock, long-tenured doorman-building residents, and family
                renters who move less frequently structurally dampens
                rent-growth volatility. Expect continued 1–3% annual
                changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UWS vs. Upper East Side Rent Comparison</CardTitle>
              <CardDescription>
                The two Manhattan uptown family neighborhoods side by side
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">Upper West Side</TableHead>
                    <TableHead className="text-right">Upper East Side</TableHead>
                    <TableHead className="text-right">UWS Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell className="text-right">+$200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">+$300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                    <TableCell className="text-right">+$400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$6,700</TableCell>
                    <TableCell className="text-right">$5,900</TableCell>
                    <TableCell className="text-right">+$800</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                UWS runs $200–$800/month more than comparable Upper East
                Side stock, with the gap widening on larger units. The
                premium buys: Riverside Park access, more extensive subway
                (1/2/3 + B/C + A/D at Columbus Circle), Central Park West
                character, and a denser restaurant/retail spine on Columbus
                and Amsterdam. The UES is relatively underserved by subway
                (4/5/6 + Q only) and pricier at the UES 2nd Avenue luxury
                tier specifically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Effective Rent on the Upper West Side</CardTitle>
              <CardDescription>
                Concession practice across UWS building types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gross Rent</TableHead>
                    <TableHead>Free Months</TableHead>
                    <TableHead className="text-right">Net Effective</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">$3,500</TableCell>
                    <TableCell>1 mo (12-mo)</TableCell>
                    <TableCell className="text-right">$3,208</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200 (CPW)</TableCell>
                    <TableCell>1 mo (12-mo)</TableCell>
                    <TableCell className="text-right">$3,850</TableCell>
                    <TableCell className="text-right">8.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$4,200 (new-construction)</TableCell>
                    <TableCell>2 mo (13-mo)</TableCell>
                    <TableCell className="text-right">$3,554</TableCell>
                    <TableCell className="text-right">15.4%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Concessions on the UWS are most common in new-construction
                (post-2015) and in fall/winter months. Pre-war doorman
                stock on CPW and West End Avenue rarely offers
                concessions — if you see 1 month free on an Eldorado or
                Beresford rental, that tells you the specific unit or
                lease term has a reason (mid-floor air-shaft, fall renewal
                cycle). Walkup stock on Columbus and Amsterdam also rarely
                offers concessions because supply/demand is tighter.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search UWS Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget, block preference, and building-type
                preference — our AI will surface Upper West Side listings
                matching your rent cap across Lincoln Square, Core UWS,
                Manhattan Valley, and Morningside Heights.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related UWS &amp; Manhattan Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Apartments: Full Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices Breakdown
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
                    NYC Rent Stabilization Explained
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
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    Negotiating Rent &amp; Lease Terms in NYC
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
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
