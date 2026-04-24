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
    "Park Slope Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Slope | Wade Me Home",
  description:
    "Park Slope, Brooklyn rent prices for 2026 by unit size and sub-neighborhood. North Slope, Center Slope, South Slope, Gowanus edge — with school-district rent premium, brownstone floor-through rent, F/G/R train commute context, and Prospect Park proximity math.",
  keywords: [
    "park slope rent prices",
    "park slope brooklyn rent prices",
    "park slope rent",
    "park slope brooklyn rent",
    "park slope apartment rent",
    "park slope studio rent",
    "park slope 1 bedroom rent",
    "park slope 2 bedroom rent",
    "park slope 3 bedroom rent",
    "park slope 4 bedroom rent",
    "average rent park slope",
    "north slope rent",
    "south slope rent",
    "center slope rent",
    "gowanus rent",
    "park slope brownstone rent",
    "park slope floor through rent",
    "park slope school district rent",
    "park slope vs cobble hill rent",
    "park slope vs prospect heights rent",
    "park slope family apartment",
    "park slope vs williamsburg rent",
  ],
  openGraph: {
    title:
      "Park Slope Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Slope",
    description:
      "Complete Park Slope rent price breakdown by unit size and sub-area, with school-district rent premium and brownstone floor-through analysis.",
    url: `${baseUrl}/nyc/park-slope/rent-prices`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/park-slope/rent-prices` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Park Slope Rent Prices (2026): Studio, 1BR, 2BR & 3BR by Sub-Slope",
    description:
      "2026 Park Slope rent prices by unit size and sub-area, historical rent trends, brownstone floor-through market, and school-district rent premium.",
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
    mainEntityOfPage: `${baseUrl}/nyc/park-slope/rent-prices`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the average rent in Park Slope in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope 2026 averages approximately $2,400 for a studio, $3,200 for a 1-bedroom, $4,300 for a 2-bedroom, $5,800 for a 3-bedroom, and $7,800 for a 4-bedroom. North Slope (closest to Prospect Park west and Grand Army Plaza) runs the highest — 1-bedrooms around $3,400. South Slope (below 9th Street) runs the lowest — 1-bedrooms around $2,900. Gowanus-edge runs $2,700 for a 1-bedroom and has the newest construction.",
        },
      },
      {
        "@type": "Question",
        name: "How much more do you pay for the PS 321 school district?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PS 321 zones the blocks from 1st Street to 9th Street between 4th Avenue and Prospect Park West. Apartments inside the PS 321 zone rent for approximately $400–$600/month more than comparable units two blocks outside the zone — a school-district premium of roughly 12–18% on a 2-bedroom. The premium applies year-round but is steepest for families searching in April–July ahead of the school year. Non-family renters can exploit this by intentionally renting outside the zone and saving $5,000–$7,000/year on a comparable 2-bedroom.",
        },
      },
      {
        "@type": "Question",
        name: "What is a Park Slope brownstone floor-through rent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A floor-through is a full floor of a Park Slope brownstone — typically 800–1,200 sq ft with original moldings, hardwood floors, high ceilings, and street + garden exposures. Floor-throughs rent for approximately $3,800–$5,500 for a 2-bedroom and $5,000–$7,500 for a 3-bedroom, depending on sub-area and finish level. They are rarely listed on third-party portals — most change hands through word-of-mouth, neighborhood brokers, or the landlord's direct network. Walk your target blocks and check 'For Rent' signs posted on brownstone stoops.",
        },
      },
      {
        "@type": "Question",
        name: "How has Park Slope rent changed over the last 5 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope median 1-bedroom rent dropped to approximately $2,500 in 2020 during COVID, then rebounded — 10% in 2022 as families returned to the city, 5% in 2023, and 2–3% annually since. The recovery trajectory was gentler than Williamsburg or LIC because Park Slope never had the same luxury-tower construction wave. From 2020 trough to 2026 peak, 1-bedroom rent is up roughly 28%.",
        },
      },
      {
        "@type": "Question",
        name: "Is Park Slope cheaper than Williamsburg or Cobble Hill?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Park Slope 1-bedroom median ($3,200) is slightly cheaper than Williamsburg ($3,400) and noticeably cheaper than Cobble Hill ($3,700). On 2-bedrooms, the gap widens — Park Slope 2BR median ($4,300) vs. Williamsburg ($4,400) and Cobble Hill ($4,800). Park Slope's advantage grows on 3+ bedrooms because of the brownstone floor-through inventory that neither Williamsburg nor Cobble Hill offer in the same volume.",
        },
      },
      {
        "@type": "Question",
        name: "What's the cheapest part of Park Slope?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "South Slope, below 9th Street and extending toward Windsor Terrace, has the cheapest Park Slope rent — studios from $2,000, 1-bedrooms from $2,700, 2-bedrooms from $3,500. The F train at 15th Street-Prospect Park is your primary commute. Gowanus-edge (between 4th Avenue and the canal) is also value-priced but trending up as new construction delivers. The cheapest blocks are around 20th Street-22nd Street on the southern border, where you get more space and sometimes outdoor areas for the money.",
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
        name: "Park Slope",
        item: `${baseUrl}/nyc/park-slope`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rent Prices",
        item: `${baseUrl}/nyc/park-slope/rent-prices`,
      },
    ],
  },
];

export default function ParkSlopeRentPricesPage() {
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
              <Badge variant="outline">Park Slope</Badge>
              <Badge variant="secondary">Rent Prices</Badge>
              <Badge className="bg-emerald-600">Family AOV</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Park Slope Rent Prices (2026): Studio, 1BR, 2BR &amp; 3BR by
              Sub-Slope
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete 2026 rent price breakdown for Park Slope, Brooklyn —
              by unit size, by sub-area (North Slope, Center Slope, South
              Slope, Gowanus edge), with school-district rent premium math,
              brownstone floor-through market, and Prospect Park proximity
              pricing. Companion reference to our full{" "}
              <Link
                href="/nyc/park-slope"
                className="text-primary underline underline-offset-2"
              >
                Park Slope apartment guide
              </Link>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Park Slope is Brooklyn&apos;s
              family-rental benchmark with the highest 3BR/4BR supply outside
              the UWS
            </p>
          </header>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Park Slope Rent at a Glance (2026)</CardTitle>
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
                  <p className="text-lg font-semibold">$3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 2-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$4,300</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Average 3-Bedroom
                  </p>
                  <p className="text-lg font-semibold">$5,800</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Park Slope Rent Prices by Unit Size</CardTitle>
              <CardDescription>
                Full range from walkup 1BRs to 4BR brownstone floor-throughs
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
                    <TableCell className="text-right">$2,000</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,100</TableCell>
                    <TableCell className="text-right">380–500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">550–750</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">800–1,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$7,800</TableCell>
                    <TableCell className="text-right">1,050–1,450</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4+ Bedroom</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$7,800</TableCell>
                    <TableCell className="text-right">$11,000+</TableCell>
                    <TableCell className="text-right">1,400+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Park Slope has the deepest 3BR and 4BR inventory of any
                Brooklyn neighborhood outside of select Bed-Stuy and Crown
                Heights pockets — courtesy of the brownstone floor-through
                market. Low-end pricing reflects South Slope walkups and
                older mid-rise stock. High-end pricing reflects pre-war
                doorman stock on Prospect Park West and renovated brownstone
                floor-throughs on the North Slope historic district blocks.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Park Slope Rent Prices by Sub-Slope</CardTitle>
              <CardDescription>
                Where you live inside Park Slope means $400–$700/month
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
                      North Slope (1st–9th St, PPW to 5th Ave)
                    </TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Center Slope (9th–15th St)
                    </TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,150</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      South Slope (below 15th St)
                    </TableCell>
                    <TableCell className="text-right">$2,150</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Gowanus Edge (4th Ave corridor)
                    </TableCell>
                    <TableCell className="text-right">$2,250</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Prospect Park West (PPW)
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  North Slope (1st Street to 9th Street, PPW to 5th Avenue)
                </h3>
                <p>
                  The premium Park Slope zone. Brownstones on the side
                  streets, pre-war doorman buildings on Prospect Park West
                  and 8th Avenue, walking distance to Grand Army Plaza
                  (2/3/B/Q/S) and 7th Avenue F/G. PS 321 elementary school
                  zone blocks (1st–9th between 4th Ave and PPW) carry the
                  full school-district premium — 1-bedrooms run $3,400,
                  2-bedrooms $4,700.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Center Slope (9th Street to 15th Street)
                </h3>
                <p>
                  The balanced middle. Less of the full brownstone
                  experience, more mid-rise walkup and 4–6 story rental
                  stock on 5th and 6th Avenues. 7th Avenue F/G at 15th
                  Street-Prospect Park is central. 1-bedrooms $3,150,
                  2-bedrooms $4,200. The restaurant and retail density on
                  5th Avenue here is some of the best in Brooklyn.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  South Slope (below 15th Street to Greenwood)
                </h3>
                <p>
                  Park Slope&apos;s best-value sub-area. The F at
                  15th-Prospect Park is the primary commute. Studios run
                  $2,150, 1-bedrooms $2,900, 2-bedrooms $3,800. Prospect
                  Park access is slightly further (10–15 min walk), and the
                  neighborhood feel shifts more residential vs. the North
                  Slope&apos;s restaurant-and-stroller energy. Better for
                  budget-sensitive renters who still want brownstone
                  Brooklyn character.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Gowanus Edge (west of 4th Avenue)
                </h3>
                <p>
                  The emerging new-construction pocket. 4th Avenue has seen
                  multiple mid-rise rental deliveries since 2020 at a
                  $300–$500/month discount vs. comparable stock east of 5th
                  Avenue. Upside: new amenity buildings, shorter wait for
                  move-in. Downside: you&apos;re closer to the Gowanus
                  Canal, which still has environmental remediation
                  underway. Rents: Studios $2,250, 1-bedrooms $2,950.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Prospect Park West (the doorman row)
                </h3>
                <p>
                  The iconic pre-war doorman buildings along Prospect Park
                  West (1 PPW, The Litchfield, Prospect Park South, etc.)
                  are the most expensive Park Slope stock. Studios $2,900,
                  1-bedrooms $3,800, 2-bedrooms $5,200. Park views add
                  roughly $300–$500/month on top. Turnover is low because
                  these buildings have long-tenured residents — plan for
                  patience in your search.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                The PS 321 School-District Rent Premium
              </CardTitle>
              <CardDescription>
                The most defined school-driven rent premium in Brooklyn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Type</TableHead>
                    <TableHead className="text-right">
                      PS 321 Zone (inside)
                    </TableHead>
                    <TableHead className="text-right">
                      Just Outside Zone
                    </TableHead>
                    <TableHead className="text-right">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">1-Bedroom</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">+$400/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-Bedroom</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">+$600/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-Bedroom</TableCell>
                    <TableCell className="text-right">$6,300</TableCell>
                    <TableCell className="text-right">$5,400</TableCell>
                    <TableCell className="text-right">+$900/mo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      4-Bedroom Floor-Through
                    </TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$7,200</TableCell>
                    <TableCell className="text-right">+$1,300/mo</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                PS 321 zones 1st Street to 9th Street, 4th Avenue to
                Prospect Park West — the historic North Slope. The
                school-district premium scales with bedroom count: a 2BR in
                the zone runs $600 more than a comparable 2BR two blocks
                outside, while a 3BR runs $900 more and a 4BR runs $1,300
                more. Annualized on a 3BR, that is $10,800/year — roughly
                equivalent to 1–2 years of private preschool tuition. Family
                renters should budget this tradeoff explicitly. Non-family
                renters can exploit it — a 1BR at 13th Street rents for
                $400 less than the same layout at 5th Street with no
                material commute or amenity difference.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Park Slope Brownstone Floor-Through Market
              </CardTitle>
              <CardDescription>
                The off-portal inventory you only find by walking the blocks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor-Through Type</TableHead>
                    <TableHead className="text-right">Rent Range</TableHead>
                    <TableHead className="text-right">Typical Sq Ft</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Parlor Floor (2BR, main level)
                    </TableCell>
                    <TableCell className="text-right">$3,800–$5,500</TableCell>
                    <TableCell className="text-right">800–1,100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Garden Floor (2BR, ground + yard)
                    </TableCell>
                    <TableCell className="text-right">$3,500–$4,800</TableCell>
                    <TableCell className="text-right">750–1,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Top Floor (3BR, penthouse-style)
                    </TableCell>
                    <TableCell className="text-right">$4,500–$7,000</TableCell>
                    <TableCell className="text-right">900–1,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Duplex (3–4BR across 2 floors)
                    </TableCell>
                    <TableCell className="text-right">$6,500–$11,000</TableCell>
                    <TableCell className="text-right">1,400–2,000+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                The brownstone floor-through market is Park Slope&apos;s
                most distinctive housing stock — original moldings, wood
                floors, high ceilings (10–12 ft), non-functional fireplaces,
                street + garden exposures, and space at rents you
                can&apos;t find in comparable condition anywhere else in
                NYC. Catches: most are listed off-portal via small
                Park-Slope-specialist brokers and word-of-mouth; most have
                unpredictable utility costs (single-meter brownstones pass
                costs through); most have below-code closet and kitchen
                layouts that reflect 1890s design. Walk your target blocks
                on Saturday afternoons and check the &quot;For Rent&quot;
                cards posted in windows and on stoops.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Park Slope Rent Trend (2020–2026)</CardTitle>
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
                    <TableCell className="font-medium">2020 (COVID)</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">&minus;8%</TableCell>
                    <TableCell>Pandemic family outflow</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2021</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">+8%</TableCell>
                    <TableCell>Families returning</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2022</TableCell>
                    <TableCell className="text-right">$2,970</TableCell>
                    <TableCell className="text-right">+10%</TableCell>
                    <TableCell>School-year surge</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2023</TableCell>
                    <TableCell className="text-right">$3,120</TableCell>
                    <TableCell className="text-right">+5%</TableCell>
                    <TableCell>Supply tight</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2024</TableCell>
                    <TableCell className="text-right">$3,170</TableCell>
                    <TableCell className="text-right">+2%</TableCell>
                    <TableCell>Gentler cycle</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2025</TableCell>
                    <TableCell className="text-right">$3,190</TableCell>
                    <TableCell className="text-right">+1%</TableCell>
                    <TableCell>Flat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2026 (YTD)</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">+0%</TableCell>
                    <TableCell>Steady, family-stable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Park Slope&apos;s rent trajectory is gentler than
                Williamsburg (31% peak-to-peak) or LIC (38%). The
                neighborhood never had the same luxury-tower supply swing,
                and family demand is structurally stickier than the
                young-professional churn in LIC or Williamsburg. Expect
                annual rent changes in the 1–3% range going forward unless
                something structural changes (e.g., school re-zoning).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Park Slope vs. Adjacent Brooklyn Hoods</CardTitle>
              <CardDescription>
                How Park Slope rent compares to Cobble Hill, Prospect
                Heights, Carroll Gardens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead className="text-right">Studio</TableHead>
                    <TableHead className="text-right">1BR</TableHead>
                    <TableHead className="text-right">2BR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Park Slope</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cobble Hill</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Prospect Heights
                    </TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Carroll Gardens
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,600</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell className="text-right">$4,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Windsor Terrace
                    </TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                Park Slope is cheaper than Cobble Hill and Carroll Gardens
                and roughly on par with Prospect Heights and Williamsburg at
                the 1-bedroom level. The differentiator is 3BR/4BR supply —
                Park Slope&apos;s brownstone floor-through market has no
                direct equivalent in Williamsburg or Prospect Heights. For
                families, that is the deciding factor. For 1-bedroom
                seekers, the neighborhoods are more interchangeable on
                price.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Search Park Slope Apartments by Price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe your budget, sub-slope, and school-district
                preferences — our AI will surface Park Slope listings
                matching your rent cap across North Slope, Center Slope,
                South Slope, and Gowanus edge.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Park Slope &amp; NYC Rent Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/park-slope"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Apartments: Full Neighborhood Guide
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
                    href="/nyc/bushwick/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Rent Prices Breakdown
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
