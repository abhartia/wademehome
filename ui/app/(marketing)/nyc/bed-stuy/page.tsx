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
    "Apartments for Rent in Bedford-Stuyvesant, Brooklyn (2026): Rent Prices, A/C/G/J Subway & Brownstone Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Bed-Stuy, Brooklyn. Median rent by unit size, A/C/G/J/M/Z subway access, Stuyvesant Heights vs Bedford vs Tompkins vs Crown Heights border, Brooklyn's biggest brownstone-rental district, and which blocks have the most rent-stabilized walkup stock.",
  keywords: [
    "bed stuy apartments",
    "bed stuy apartments for rent",
    "bedford stuyvesant apartments",
    "bed stuy rent",
    "bed stuy rent prices 2026",
    "bedford stuyvesant rent",
    "bed stuy studio rent",
    "bed stuy 1 bedroom rent",
    "bed stuy 2 bedroom rent",
    "stuyvesant heights apartments",
    "bedford apartments brooklyn",
    "tompkins avenue apartments",
    "bed stuy brownstone apartments",
    "bed stuy walkup",
    "apartments 11216",
    "apartments 11221",
    "apartments 11233",
    "A train Brooklyn apartments",
    "C train Brooklyn apartments",
    "G train apartments",
    "bed stuy no fee apartments",
    "moving to bed stuy",
    "brooklyn brownstone rentals",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Bed-Stuy, Brooklyn (2026): Rent Prices, Subway & Brownstone Guide",
    description:
      "2026 rent prices, A/C/G/J/M subway access, sub-area breakdown, and apartment-hunting tips for Bedford-Stuyvesant — Brooklyn's biggest brownstone rental district.",
    url: `${baseUrl}/nyc/bed-stuy`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/bed-stuy` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Bedford-Stuyvesant, Brooklyn (2026): Rent Prices, A/C/G/J Subway & Brownstone Guide",
    description:
      "A 2026 guide to renting in Bed-Stuy, Brooklyn — rent prices by unit size, A/C/G/J/M/Z subway access, sub-area differences, brownstone stock, rent-stabilized supply, and tips for apartment hunters.",
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
    mainEntityOfPage: `${baseUrl}/nyc/bed-stuy`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Bed-Stuy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median rent in Bed-Stuy runs approximately $1,950 for a studio, $2,700 for a 1-bedroom, $3,500 for a 2-bedroom, and $4,400 for a 3-bedroom. Bed-Stuy is the largest brownstone-rental neighborhood in NYC — floor-through 1-bedrooms in a Stuyvesant Heights brownstone often rent for the same as a smaller studio in Williamsburg or Greenpoint. Pricing depends heavily on which subway and which sub-area: Bedford-line A/C blocks command 10–15% over G-train Tompkins-line blocks.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Bed-Stuy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bed-Stuy is served by the A/C local on Fulton Street (Nostrand, Kingston-Throop, Utica, Ralph), the G on Bedford-Nostrand and Classon, and the J/M/Z elevated on Broadway (Myrtle-Broadway, Halsey, Chauncey). The A express skips Kingston-Throop and Ralph. The Nostrand Avenue A/C stop is the fastest route to Manhattan — about 22 minutes to West 4th Street. The G-only blocks (Bedford-Nostrand stop) trade longer Manhattan commutes for $200–$400/month rent discounts.",
        },
      },
      {
        "@type": "Question",
        name: "Is Bed-Stuy a safe neighborhood?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bed-Stuy's safety has improved meaningfully over the past 15 years — the 79th, 81st, and 73rd precincts (covering different parts of the neighborhood) all show declining violent crime year-over-year per NYPD CompStat. Stuyvesant Heights and the western Bedford blocks generally feel quieter; the eastern Tompkins/Throop blocks vary block-to-block. As anywhere in NYC, walk your target blocks at night before signing.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between Stuyvesant Heights and Bedford?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stuyvesant Heights is the landmarked eastern half of Bed-Stuy — roughly Tompkins to Patchen, MacDonough to Chauncey — with the densest concentration of preserved 1880s–1900s brownstones. The Bedford section sits west, roughly Bedford to Throop — also brownstone but with more pre-war 6-story walkups mixed in, and faster A/C access via Nostrand. Stuyvesant Heights commands a 5–10% rent premium for the historic-district stock; Bedford commands a 5–10% transit premium for the Nostrand A/C express.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in Bed-Stuy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — Bed-Stuy has the largest concentration of rent-stabilized 6+ unit walkups of any Brooklyn neighborhood. Buildings built before 1974 with 6 or more units are typically stabilized; this describes a substantial portion of the 6-story pre-war walkups along Tompkins, Marcus Garvey, Stuyvesant, and Lewis Avenues. Brownstones with 4 units (typical for a converted single-family) generally are NOT stabilized. Always ask the landlord and check DHCR rent registration history.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Bed-Stuy on rising-demand lists in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three factors: (1) Bed-Stuy median 1BR rent ($2,700) is roughly 25–35% below Williamsburg and Greenpoint while sharing G-train and J-train access, drawing renters who priced out of those neighborhoods; (2) the Stuyvesant Heights historic district is the largest preserved brownstone block of its character in NYC, attracting renters who want the architectural experience without Manhattan or Park Slope pricing; (3) the FARE Act has made small landlords in Bed-Stuy walkups (where many listings used to require a tenant-paid broker fee) more transparent on landlord-paid fees, lowering search friction.",
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
        name: "Bedford-Stuyvesant",
        item: `${baseUrl}/nyc/bed-stuy`,
      },
    ],
  },
];

export default function BedStuyPage() {
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
              <Badge variant="secondary">Brooklyn, NY</Badge>
              <Badge variant="outline">A/C · G · J/M/Z</Badge>
              <Badge className="bg-emerald-600">Brownstone capital</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Bedford-Stuyvesant, Brooklyn (2026): Rent
              Prices, Subway &amp; Neighborhood Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Bed-Stuy is Brooklyn&apos;s largest brownstone neighborhood and
              the best-value rental zone with direct Manhattan A/C subway
              access. The 2026 1-bedroom median ($2,700) sits 25–35% below
              Williamsburg and Greenpoint with the same G-train access. The
              Stuyvesant Heights landmark district contains the densest
              preserved 1880s–1900s brownstone blocks anywhere in NYC.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 25, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Bedford-Stuyvesant"
            latitude={40.6872}
            longitude={-73.9418}
            radiusMiles={1.2}
            limit={6}
            searchQuery="Bedford-Stuyvesant apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>Bed-Stuy Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent, typical range, and income needed (40× rule)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit Size</TableHead>
                    <TableHead>Median Rent</TableHead>
                    <TableHead>Typical Range</TableHead>
                    <TableHead>Income Needed (40×)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell>$1,950</TableCell>
                    <TableCell>$1,600 – $2,400</TableCell>
                    <TableCell>$78,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$2,700</TableCell>
                    <TableCell>$2,200 – $3,400</TableCell>
                    <TableCell>$108,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$3,500</TableCell>
                    <TableCell>$2,800 – $4,500</TableCell>
                    <TableCell>$140,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$4,400</TableCell>
                    <TableCell>$3,400 – $6,000</TableCell>
                    <TableCell>$176,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Brownstone floor-throughs in Stuyvesant Heights run
                $300–$700/month above the median for the historic-district
                stock and parlor-floor ceilings. G-train-only blocks
                (Tompkins-line east of Marcy) run 10–15% below the median.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed-Stuy Sub-Areas</CardTitle>
              <CardDescription>
                Bed-Stuy is one of NYC&apos;s biggest neighborhoods (~3 sq mi)
                — these are the five functional sub-areas renters shop
                separately
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
                      Stuyvesant Heights
                    </TableCell>
                    <TableCell>$2,950</TableCell>
                    <TableCell>
                      Tompkins–Patchen, MacDonough–Chauncey
                    </TableCell>
                    <TableCell>
                      Landmark district, preserved 1880s brownstones
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Bedford / Nostrand corridor
                    </TableCell>
                    <TableCell>$2,800</TableCell>
                    <TableCell>
                      Bedford–Throop, Atlantic–Halsey
                    </TableCell>
                    <TableCell>
                      Nostrand A/C express, mixed brownstone + 6-story
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tompkins / Throop
                    </TableCell>
                    <TableCell>$2,500</TableCell>
                    <TableCell>
                      Throop–Lewis, Atlantic–Greene
                    </TableCell>
                    <TableCell>
                      G-only blocks, deepest value tier
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Crown Heights border
                    </TableCell>
                    <TableCell>$2,650</TableCell>
                    <TableCell>
                      Atlantic–Fulton, Bedford–Ralph
                    </TableCell>
                    <TableCell>
                      A/C express + 4 train transfer at Franklin
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Ocean Hill border
                    </TableCell>
                    <TableCell>$2,300</TableCell>
                    <TableCell>
                      Patchen–Saratoga, Fulton–Bushwick
                    </TableCell>
                    <TableCell>
                      Cheapest sub-area, A/C at Ralph + Utica
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed-Stuy Transit</CardTitle>
              <CardDescription>
                Three subway corridors plus the J/M/Z make Bed-Stuy
                one of the best-connected non-Manhattan rental zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>A/C local on Fulton (Nostrand, Kingston-Throop,
                Utica, Ralph):</strong> The Bed-Stuy workhorse. Nostrand to
                West 4th Street in 22 minutes on the A express, 28 on the C
                local. The A skips Kingston-Throop and Ralph — only the C
                stops there.
              </p>
              <p>
                <strong>G (Bedford-Nostrand, Classon):</strong> Crosstown to
                Williamsburg in 7 minutes, to LIC in 25. The G is the only
                non-Manhattan crosstown — an underrated commute if your
                office is in Williamsburg/Greenpoint or LIC.
              </p>
              <p>
                <strong>J/M/Z elevated on Broadway (Myrtle-Broadway,
                Halsey, Chauncey):</strong> Quick crossing of the
                Williamsburg Bridge to Lower East Side. Z is rush-only
                express. The J is a 25-minute ride to Wall Street.
              </p>
              <p>
                <strong>B25 / B43 / B44 SBS / B46 SBS:</strong> Bus network
                covers the gaps between subway lines. B44 SBS on Nostrand
                is fast — Nostrand to Sheepshead Bay in ~30 minutes.
              </p>
              <p>
                <strong>Citi Bike + bike infrastructure:</strong> Tompkins
                Avenue and Lewis Avenue have protected bike lanes. Bike to
                Williamsburg in 12 minutes; to DUMBO in 18.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Bed-Stuy Brownstone Market</CardTitle>
              <CardDescription>
                Brooklyn&apos;s biggest concentration of rent-available
                brownstone stock — what renting one means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Bed-Stuy contains roughly 8,800 brownstone-style row houses,
                most built 1880–1910 — the largest concentration in NYC. A
                substantial fraction (most in Stuyvesant Heights, many on
                Bedford and Lewis) have been split into 2–4 rental units by
                small owner-operator landlords. You can rent a parlor-floor
                1-bedroom in a Stuyvesant Heights brownstone for the same
                rent as a 350-sq-ft studio in Long Island City.
              </p>
              <p>
                Floor-through typology (rough 2026 medians):
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Garden / Ground floor:</strong> $2,200–$2,800 1BR
                  with private back-yard access, lower ceilings
                </li>
                <li>
                  <strong>Parlor (2nd floor):</strong> $2,700–$3,500 full
                  floor with 11-ft ceilings and original details
                </li>
                <li>
                  <strong>Top floor (3rd/4th):</strong> $2,500–$3,200,
                  often skylights, 4-story walkup
                </li>
                <li>
                  <strong>Duplex:</strong> $3,800–$5,200 for 2-floor units
                  combining parlor + adjacent floor
                </li>
              </ul>
              <p>
                Trade-offs vs. a Williamsburg new-con tower: smaller
                landlords, slower maintenance response, basement-share
                laundry, no gym/rooftop. Upside: bigger rooms, original
                woodwork, smaller rent increases, the architectural
                experience is irreplaceable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed-Stuy Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Subway line choice = rent tier.</strong> Nostrand
                  A/C express blocks rent for 10–15% over Tompkins G-only
                  blocks for comparable stock. Decide which line you need
                  before walking blocks.
                </li>
                <li>
                  <strong>
                    Stuyvesant Heights brownstones are the trophy stock.
                  </strong>{" "}
                  The landmark district (Tompkins to Patchen, MacDonough to
                  Chauncey) preserves the most intact 1880s blocks. Expect a
                  $300–$700/month premium over equivalent stock outside the
                  district.
                </li>
                <li>
                  <strong>Pre-1974, 6+ units = often stabilized.</strong>{" "}
                  Bed-Stuy 6-story pre-war walkups are commonly
                  rent-stabilized. 2026 RGB renewal caps are 3.0% (1-yr) /
                  4.5% (2-yr). Ask the landlord for DHCR registration.
                </li>
                <li>
                  <strong>4-unit brownstones generally are NOT
                  stabilized.</strong> A typical brownstone split into 4
                  rental units doesn&apos;t hit the 6+ threshold — those
                  rent at market with no rent-increase cap. Don&apos;t
                  assume.
                </li>
                <li>
                  <strong>Halsey J/M/Z is faster than people
                  think.</strong> 22 minutes to Essex Street (Lower East
                  Side), 28 to Wall Street. The elevated J is much faster
                  than the G to Manhattan.
                </li>
                <li>
                  <strong>FARE Act benefits Bed-Stuy renters
                  most.</strong> Small landlords in walkups historically
                  pushed broker fees onto tenants. Under the FARE Act, when
                  the landlord hires the broker, the tenant doesn&apos;t
                  pay. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act guide
                  </Link>
                  .
                </li>
                <li>
                  <strong>Crown Heights border is the value
                  spread.</strong> South of Atlantic, the same brownstone
                  stock rents 10–15% below Stuyvesant Heights and adds the
                  4 train at Franklin. If you&apos;re commuting to Lower
                  Manhattan or Wall Street, the 4 express beats the A.
                </li>
                <li>
                  <strong>Walk your block at night.</strong> Bed-Stuy varies
                  block-to-block more than most NYC neighborhoods. The same
                  rent on two adjacent blocks can mean very different
                  street-life. Walk Friday night and Tuesday night before
                  signing.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Bed-Stuy apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge which Bed-Stuy sub-area (Stuyvesant
                Heights, Bedford-Nostrand, Tompkins, Crown Heights border),
                which subway, and your budget — we&apos;ll surface matching
                live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Bedford-Stuyvesant+apartments">
                  Search Bed-Stuy Apartments
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
                    href="/nyc/bed-stuy/apartments-under-2500"
                    className="text-primary underline underline-offset-2"
                  >
                    Bed-Stuy Apartments Under $2,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bed-stuy/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    Bed-Stuy Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bed-stuy/apartments-under-2000"
                    className="text-primary underline underline-offset-2"
                  >
                    Bed-Stuy Apartments Under $2,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Guide (J/M/Z continuation)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Guide (G-train next stop)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/park-slope"
                    className="text-primary underline underline-offset-2"
                  >
                    Park Slope Guide (brownstone alternative)
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
