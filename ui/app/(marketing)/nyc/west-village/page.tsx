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
import { NeighborhoodLiveListings } from "@/components/neighborhoods/NeighborhoodLiveListings";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Apartments for Rent in West Village, NYC (2026): Townhouse Rent Prices, 1/A/C/E/L Subway & Brownstone Block Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in the West Village, Manhattan. Townhouse and brownstone rent prices by unit size, 1/A/C/E/L/N/Q/R/W subway access, the Greenwich Village Historic District, sub-areas (Bleecker/Bedford, Christopher/Hudson, Far West, Meatpacking border), boutique elevator buildings, and the Hudson River Park frontage premium.",
  keywords: [
    "west village apartments",
    "west village apartments for rent",
    "west village rent",
    "west village rent prices 2026",
    "west village studio rent",
    "west village 1 bedroom rent",
    "west village 2 bedroom rent",
    "west village 3 bedroom rent",
    "west village townhouse",
    "west village brownstone",
    "bleecker street apartments",
    "bedford street apartments",
    "hudson street apartments",
    "christopher street apartments",
    "perry street apartments",
    "greenwich village historic district",
    "west village luxury rentals",
    "downtown manhattan luxury",
    "boutique elevator building west village",
    "apartments 10014",
    "moving to west village",
    "hudson river park apartments",
    "meatpacking apartments",
  ],
  openGraph: {
    title:
      "Apartments for Rent in West Village, NYC (2026): Townhouses, Brownstones & Rent Guide",
    description:
      "2026 rent prices, subway access, sub-area breakdown, and apartment-hunting tips for the West Village — Manhattan's most picturesque townhouse + brownstone district.",
    url: `${baseUrl}/nyc/west-village`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/west-village` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in West Village, NYC (2026): Townhouse Rent Prices, Subway & Brownstone Block Guide",
    description:
      "A 2026 guide to renting in the West Village — townhouse + brownstone rent by unit size, subway access, the Historic District, sub-areas, and tips for apartment hunters.",
    datePublished: "2026-04-26",
    dateModified: "2026-04-26",
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
    mainEntityOfPage: `${baseUrl}/nyc/west-village`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in the West Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median asking rent in the West Village runs roughly $4,200 for a studio, $10,800 for a 1-bedroom, $17,000 for a 2-bedroom, and $25,500 for a 3-bedroom. Per square foot, the West Village runs $100–$140/sq ft annually — comparable to Tribeca and slightly above SoHo. Townhouse floor-throughs and parlor-floor units in restored brownstones can clear $20K–$45K/month for 2–3 bedroom layouts; full townhouse rentals (rare) routinely list $50K–$150K/month.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the West Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The West Village is served by the 1 (Christopher Street, Houston Street), the A/C/E (West 4th Street, 14th Street), the L (8th Avenue, 6th Avenue), the F/M (West 4th Street, 14th Street), the N/Q/R/W (Union Square at the eastern edge), and the PATH at 9th Street + Christopher Street. Eight subway lines plus PATH — among the most subway-dense neighborhoods in Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "What defines the West Village versus the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The West Village is structurally a townhouse and brownstone district — pre-1900 row houses on a famously irregular street grid (Bleecker, Bedford, Hudson, Bank, Charles, Perry, Grove, Barrow). The East Village is a tenement walkup and pre-war elevator district on the standard NYC grid. The West Village is more expensive (15–25% premium over the East Village at every unit size), quieter, more residential, and dominated by townhouse-scale buildings of 4–6 stories. The East Village skews denser, louder, and more nightlife-centric. Both are dominated by pre-war stock; both have FARE-Act-protected no-fee status.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Greenwich Village Historic District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Designated in 1969, the Greenwich Village Historic District covers most of the West Village and Greenwich Village (about 100 blocks). It includes 2,200+ landmarked buildings — the largest concentration of pre-1900 residential architecture in Manhattan. Defining features: irregular street grid (legacy of pre-1811 cow-path layouts), 4–6 story brick row houses with stoops and ironwork, occasional Greek Revival and Federal-style townhouses, and the famously tree-lined blocks (Perry, Charles, Bank, West 11th). Landmark designation means significant exterior changes require Landmarks Preservation Commission approval — preserving the streetscape but limiting some renovation flexibility for landlords.",
        },
      },
      {
        "@type": "Question",
        name: "What is renting a West Village brownstone like?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "West Village brownstone rentals split into four typologies, by floor: garden floor (street level + sub-grade, often with private outdoor space, $4,500–$7,500 1BR equivalent), parlor floor (the original main floor, 11–13 ft ceilings, often the highest rent at $8,500–$14,000 1BR equivalent), middle floors (9–10 ft ceilings, $6,500–$10,500 1BR equivalent), and top floor (often a duplex or skylight unit, $7,500–$15,000+). Most are walk-up, no doorman, no in-building gym, no laundry in unit. The trade-offs: extraordinary architectural character + tree-lined block + intimate scale, vs. zero amenity package + walking up 4 flights + smaller storage. Renters either love or pass on the brownstone aesthetic; there is rarely a middle ground.",
        },
      },
      {
        "@type": "Question",
        name: "Are Hudson River Park-frontage apartments worth the premium?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Apartments on the Far West blocks of the West Village (Greenwich Street, Washington Street, West Street facing Hudson River Park) command a 15–30% rent premium for direct or peek river views. The premium is largest at the higher floors and the southern blocks (Charles to Bank). The amenity is real: Hudson River Park is one of the most-used parks in Manhattan, the High Line is a 10-minute walk, and bike infrastructure on the Hudson River Greenway is the best in the city. The downside is West Side Highway noise — even on a 12th-floor apartment, traffic noise from the highway is audible. Renters who weigh the river view above noise pay the premium; renters who don't tour them and find the noise bigger than expected.",
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
        name: "NYC",
        item: `${baseUrl}/nyc-rent-by-neighborhood`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "West Village",
        item: `${baseUrl}/nyc/west-village`,
      },
    ],
  },
];

export default function WestVillagePage() {
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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Manhattan, NY</Badge>
              <Badge variant="outline">1 · A/C/E · L · F/M · N/Q · PATH</Badge>
              <Badge className="bg-emerald-600">Townhouse + brownstone tier</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in the West Village, NYC (2026): Townhouse
              Rent Prices, Subway &amp; Brownstone Block Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              The West Village is Manhattan&apos;s flagship townhouse +
              brownstone district — pre-1900 row houses on an irregular
              pre-grid street layout (Bleecker, Bedford, Hudson, Bank,
              Charles, Perry, Grove, Barrow), preserved as the Greenwich
              Village Historic District since 1969. Median rent runs
              $100–$140/sq ft annually, peer with Tribeca. Defining
              attributes: tree-lined blocks, walk-up brownstones, intimate
              scale, eight subway lines plus PATH, and the Hudson River Park
              frontage on the western edge.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 26, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="West Village"
            latitude={40.7359}
            longitude={-74.0048}
            radiusMiles={0.5}
            limit={6}
            searchQuery="West Village apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>West Village Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent + typical range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Size</TableHead>
                    <TableHead>Median Rent</TableHead>
                    <TableHead>Typical Range</TableHead>
                    <TableHead>$/sq ft / yr</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>$4,200</TableCell>
                    <TableCell>$3,200 – $5,800</TableCell>
                    <TableCell>$95</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$10,800</TableCell>
                    <TableCell>$5,800 – $18,000</TableCell>
                    <TableCell>$110</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$17,000</TableCell>
                    <TableCell>$11,000 – $32,000</TableCell>
                    <TableCell>$120</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$25,500</TableCell>
                    <TableCell>$17,000 – $65,000</TableCell>
                    <TableCell>$130</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Townhouse</TableCell>
                    <TableCell>$75,000</TableCell>
                    <TableCell>$50,000 – $150,000</TableCell>
                    <TableCell>$140+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Townhouse and parlor-floor pricing skews above the median;
                walk-up brownstone studios and 1BRs price 10–25% below.
                Hudson River Park frontage adds 15–30% to comparable units.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>West Village Sub-Areas</CardTitle>
              <CardDescription>
                The five functional zones — character and pricing differ
                materially block-to-block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Area</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Boundaries</TableHead>
                    <TableHead>Character</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Bleecker / Bedford Core
                    </TableCell>
                    <TableCell>$11,500</TableCell>
                    <TableCell>Bleecker + Bedford, 7th to Hudson</TableCell>
                    <TableCell>Most photographed blocks, restaurant spine</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Christopher / Hudson
                    </TableCell>
                    <TableCell>$10,500</TableCell>
                    <TableCell>Christopher St, Hudson to West St</TableCell>
                    <TableCell>Subway anchor, Stonewall, retail mix</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Far West / Riverfront
                    </TableCell>
                    <TableCell>$13,500</TableCell>
                    <TableCell>Greenwich/Washington/West, Charles to Bank</TableCell>
                    <TableCell>Hudson Park premium, river views</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Charles / Perry / 11th
                    </TableCell>
                    <TableCell>$12,000</TableCell>
                    <TableCell>Tree-lined blocks W of 7th, S of 14th</TableCell>
                    <TableCell>Premier brownstone blocks</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Meatpacking border
                    </TableCell>
                    <TableCell>$10,000</TableCell>
                    <TableCell>Gansevoort to Horatio, west of 8th</TableCell>
                    <TableCell>Standard Hotel area, retail/nightlife</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brownstone Floor Tier</CardTitle>
              <CardDescription>
                Renting different floors of a brownstone is renting four
                meaningfully different products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Floor</TableHead>
                    <TableHead>1BR Equivalent</TableHead>
                    <TableHead>Defining Trait</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Garden</TableCell>
                    <TableCell>$4,500 – $7,500</TableCell>
                    <TableCell>
                      Street + sub-grade, often outdoor space, lower light
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Parlor</TableCell>
                    <TableCell>$8,500 – $14,000</TableCell>
                    <TableCell>
                      11–13 ft ceilings, original moldings, premier rent
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Middle (2nd–3rd)</TableCell>
                    <TableCell>$6,500 – $10,500</TableCell>
                    <TableCell>
                      9–10 ft ceilings, mid-stair, the typical floor-through
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Top (4th–5th)</TableCell>
                    <TableCell>$7,500 – $15,000+</TableCell>
                    <TableCell>
                      Often duplex with skylight, premium for the climb
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>West Village vs Tribeca vs SoHo</CardTitle>
              <CardDescription>
                The three downtown luxury districts — when each one fits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead>Building Type</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Best For</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">West Village</TableCell>
                    <TableCell>Brownstone + townhouse</TableCell>
                    <TableCell>$10,800</TableCell>
                    <TableCell>Tree-lined blocks, intimate scale, character</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca</TableCell>
                    <TableCell>Pre-war loft + trophy new-con</TableCell>
                    <TableCell>$11,500</TableCell>
                    <TableCell>Quietest density, riverfront, tallest ceilings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SoHo</TableCell>
                    <TableCell>Cast-iron loft</TableCell>
                    <TableCell>$10,200</TableCell>
                    <TableCell>Heavy retail/restaurant density, walkability</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                All three within 0.5 mile of each other. Tour all three
                before signing if you&apos;re luxury-shopping downtown — they
                are completely different aesthetic and density experiences
                at very similar price points.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>West Village Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Tree-lined Charles/Perry/11th = trophy
                  blocks.</strong> Same building stock as the Bleecker/
                  Bedford restaurant spine, materially quieter, tree
                  canopy, lower foot traffic. The blocks west of 7th and
                  south of 14th between Christopher and Bank are the
                  premier brownstone band.
                </li>
                <li>
                  <strong>Walk-up brownstones are mostly
                  rent-stabilized.</strong> Pre-1974 6+ unit buildings,
                  which describes most of the West Village brownstone
                  stock, are typically rent-stabilized. Legal regulated
                  rent can be 25–40% below market for the same building.
                  Ask for DHCR rent registration before signing.
                </li>
                <li>
                  <strong>Hudson River Park premium has a noise
                  trade-off.</strong> Far West blocks (Greenwich, Washington,
                  West) command 15–30% over interior West Village blocks
                  for park frontage and river views. West Side Highway
                  noise is real even on upper floors. Tour with windows
                  open.
                </li>
                <li>
                  <strong>Boutique elevator buildings are the West Village
                  doorman compromise.</strong> Most West Village stock is
                  walk-up brownstone with no doorman. A handful of
                  10–14-story boutique elevator buildings (the Greenwich
                  Lane, 70 Greenwich Avenue, the Charles, the Saint
                  Vincent&apos;s site) offer doorman + amenity at a 25–40%
                  premium over comparable brownstone stock.
                </li>
                <li>
                  <strong>The 4th-floor walkup is the value play.</strong>{" "}
                  In a 5-story brownstone, the 4th-floor unit is
                  typically $400–$800/month cheaper than the 2nd-floor
                  unit of identical size. If you can climb stairs, this is
                  the West Village price arbitrage.
                </li>
                <li>
                  <strong>Subway density is underrated.</strong> Eight
                  subway lines plus PATH within the neighborhood. A West
                  Village renter is effectively car-free even at trophy
                  rent.
                </li>
                <li>
                  <strong>FARE Act applies even at $20K trophy
                  units.</strong> Landlord-hired broker = no tenant fee.
                  See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act guide
                  </Link>
                  .
                </li>
                <li>
                  <strong>Tour the actual unit, not the listing
                  photo.</strong> West Village brownstone units vary
                  enormously within the same building — same floor plan can
                  be transformed by which side faces the street, original
                  moldings vs. mid-century renovation, presence/absence of
                  fireplace, exposed brick. Photos seldom capture this;
                  tour before deciding.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live West Village apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, sub-area (Bleecker/
                Bedford, Charles/Perry, Far West riverfront), and budget —
                we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=West+Village+apartments">
                  Search West Village Apartments
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
                    href="/nyc/luxury-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    Luxury NYC Apartments Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/tribeca"
                    className="text-primary underline underline-offset-2"
                  >
                    Tribeca Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/soho"
                    className="text-primary underline underline-offset-2"
                  >
                    SoHo Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/east-village"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/chelsea"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Guide
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
