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
import { RentStabilizationChecker } from "@/components/rent-stab/RentStabilizationChecker";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Apartments for Rent on the Lower East Side, NYC (2026): Rent Prices, F/J/M/Z Subway & Tenement-Walkup Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting on the Lower East Side, Manhattan. Median rent by unit size, F/J/M/Z train access, Tenement Core vs Two Bridges vs Essex Crossing vs East Broadway, walkup vs new-construction stock, and why LES search demand peaked again in late April 2026.",
  keywords: [
    "lower east side apartments",
    "lower east side apartments for rent",
    "LES apartments",
    "LES apartments NYC",
    "lower east side rent",
    "lower east side rent prices 2026",
    "lower east side studio rent",
    "lower east side 1 bedroom rent",
    "lower east side 2 bedroom rent",
    "essex crossing apartments",
    "two bridges apartments",
    "east broadway apartments",
    "ludlow street apartments",
    "orchard street apartments",
    "delancey street apartments",
    "apartments 10002",
    "apartments 10003",
    "F train Manhattan apartments",
    "J train Manhattan apartments",
    "lower east side no fee apartments",
    "moving to lower east side",
    "LES tenement apartments",
    "lower east side walkup",
  ],
  openGraph: {
    title:
      "Apartments for Rent on the Lower East Side, NYC (2026): Rent, Subway & Neighborhood Guide",
    description:
      "2026 rent prices, F/J/M/Z subway access, sub-area breakdown, and apartment-hunting tips for the Lower East Side — Manhattan's largest pre-war walkup district below 14th Street.",
    url: `${baseUrl}/nyc/lower-east-side`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/lower-east-side` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent on the Lower East Side, NYC (2026): Rent Prices, F/J/M/Z Subway & Tenement-Walkup Guide",
    description:
      "A 2026 guide to renting on the Lower East Side — rent prices by unit size, F/J/M/Z access, Tenement Core vs Two Bridges vs Essex Crossing vs East Broadway, walkup vs new-construction stock, and tips for apartment hunters.",
    datePublished: "2026-04-25",
    dateModified: "2026-04-30",
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
    mainEntityOfPage: `${baseUrl}/nyc/lower-east-side`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent on the Lower East Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median rent on the Lower East Side runs approximately $2,500 for a studio, $3,400 for a 1-bedroom, $4,700 for a 2-bedroom, and $6,200 for a 3-bedroom. The neighborhood has the widest building-stock spread in lower Manhattan — a 5-story walkup tenement studio at $2,200 sits a block from a $4,200 1-bedroom in an Essex Crossing or new-construction tower. Expect substantial price variance even on the same block.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the Lower East Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The LES is served by the F train (Delancey/Essex, East Broadway, 2 Av), the J/M/Z (Essex Street, Bowery), the B/D (Grand Street), and at the southern end the F to East Broadway. Six subway lines total. The F at Delancey is the workhorse — 6 minutes to West 4th, 12 to Bryant Park, 14 to Rockefeller Center. The J/M/Z runs over the Williamsburg Bridge — fast access to Bushwick and Williamsburg.",
        },
      },
      {
        "@type": "Question",
        name: "What is Essex Crossing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Essex Crossing is the 9-building, 1.9 million-square-foot mixed-use development built 2018-2024 on the former SPURA site. It includes The Artisan, The Rollins, 145 Clinton, 180 Broome, 202 Broome, and Market Line — adding roughly 1,000 rental units (a mix of market-rate and below-market) plus the relocated Essex Street Market and Trader Joe's. New-construction 1-bedrooms here run $4,000–$5,500 with full doorman amenities and concessions of 1–2 months free common. It is the single biggest housing addition the LES has seen in a generation.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between the LES and the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Houston Street is the dividing line. South of Houston is the Lower East Side; north of Houston is the East Village. The LES has more pre-war tenement walkups (5-story, 200–500 sq ft units, no elevator), more new-construction towers (Essex Crossing, Two Bridges waterfront), and lower median rents than the East Village. The East Village skews slightly more polished — more 6-story pre-war elevator buildings, 1st Avenue retail strip, Tompkins Square Park. The LES is grittier, denser, and 5–15% cheaper at every unit size for comparable stock.",
        },
      },
      {
        "@type": "Question",
        name: "Is Two Bridges part of the Lower East Side?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Two Bridges is the southernmost LES sub-area, between the Manhattan and Brooklyn bridges along the East River. It includes the new luxury Two Bridges towers (One Manhattan Square at 252 South, the under-construction Cherry Street and Rutgers towers), the older NYCHA developments, and the East Broadway/Chinatown overlap. Pricing here is bimodal — luxury new-con at $4,000+ 1BR vs. older walkup stock at $2,800–$3,200. F train at East Broadway is the only nearby subway; many residents bike or walk to the J/M/Z at Essex.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Lower East Side rent demand spiking in April 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Google Trends shows 'lower east side apartments' search demand peaked on April 19, 2026 — within the last week. Three drivers: (1) Essex Crossing's final two phases (180 Broome, 202 Broome) hit full lease-up with concessions, drawing renters who'd been waiting on inventory; (2) East Village/Williamsburg renters priced out of those neighborhoods crossing into the LES at a 10–20% rent discount for comparable walkup stock; (3) the spring search cycle (peak rental search in NYC runs April–July). Combine with the FARE Act tilting walkup landlords toward landlord-paid broker fees and the LES becomes one of the rare Manhattan zones where renters can avoid both the broker fee and luxury new-con prices.",
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
        name: "Lower East Side",
        item: `${baseUrl}/nyc/lower-east-side`,
      },
    ],
  },
];

export default function LowerEastSidePage() {
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
              <Badge variant="outline">F · J/M/Z · B/D</Badge>
              <Badge className="bg-emerald-600">Demand peak Apr 19, 2026</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent on the Lower East Side, NYC (2026): Rent
              Prices, Subway &amp; Neighborhood Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              The Lower East Side is Manhattan&apos;s largest pre-war walkup
              district below 14th Street, plus the biggest new-construction
              footprint in lower Manhattan (Essex Crossing). Rent runs 5–15%
              below the East Village for comparable stock with the same F and
              J/M/Z subway access. Google Trends shows LES search demand
              peaked on April 19, 2026 — the freshest demand signal in lower
              Manhattan.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 25, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Lower East Side"
            latitude={40.7186}
            longitude={-73.9879}
            radiusMiles={0.7}
            limit={6}
            searchQuery="Lower East Side apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>
                Lower East Side Rent Prices by Unit Size (2026)
              </CardTitle>
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
                    <TableCell>$2,500</TableCell>
                    <TableCell>$2,100 – $3,200</TableCell>
                    <TableCell>$100,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$3,400</TableCell>
                    <TableCell>$2,800 – $4,700</TableCell>
                    <TableCell>$136,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$4,700</TableCell>
                    <TableCell>$3,800 – $6,500</TableCell>
                    <TableCell>$188,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$6,200</TableCell>
                    <TableCell>$5,000 – $9,000</TableCell>
                    <TableCell>$248,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Tenement walkup stock (5-story, no elevator, 1900–1925
                construction) prices 15–25% below the median. Essex Crossing
                and Two Bridges new-construction towers price 20–35% above the
                median.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lower East Side Sub-Areas</CardTitle>
              <CardDescription>
                The LES is roughly a half-square-mile — these are the four
                functional sub-areas renters shop separately
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
                      Tenement Core
                    </TableCell>
                    <TableCell>$3,200</TableCell>
                    <TableCell>
                      Houston–Delancey, Bowery to Essex
                    </TableCell>
                    <TableCell>
                      Orchard/Ludlow nightlife, 5-story walkups
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Essex Crossing
                    </TableCell>
                    <TableCell>$4,400</TableCell>
                    <TableCell>
                      Delancey–Grand, Essex to Norfolk
                    </TableCell>
                    <TableCell>
                      9 new towers (2018–2024), Trader Joe&apos;s
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East Broadway / Chinatown overlap
                    </TableCell>
                    <TableCell>$2,900</TableCell>
                    <TableCell>
                      Grand–Madison, Bowery to East Broadway
                    </TableCell>
                    <TableCell>
                      Asian dining, F at East Broadway, denser tenement stock
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Two Bridges</TableCell>
                    <TableCell>$3,600</TableCell>
                    <TableCell>
                      Madison–FDR, East Broadway to South St
                    </TableCell>
                    <TableCell>
                      Waterfront new towers + older NYCHA + walkup
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lower East Side Transit</CardTitle>
              <CardDescription>
                Six subway lines plus the M14 SBS make the LES one of the
                best-connected lower-Manhattan rental zones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>F (Delancey/Essex, East Broadway, 2 Av):</strong>{" "}
                The LES workhorse. Delancey to West 4th in 6 minutes, to
                Bryant Park in 12, to Rockefeller Center in 14. Runs every
                4–5 minutes peak.
              </p>
              <p>
                <strong>J/M/Z (Essex Street, Bowery):</strong> Crosses the
                Williamsburg Bridge to Marcy Avenue (Williamsburg) in 4
                minutes, then Bushwick. Express M and J runs to Wall Street.
              </p>
              <p>
                <strong>B/D (Grand Street):</strong> The B local is a quick
                ride to West 4th and 34th Street; the D express continues
                to Yankee Stadium. The Grand Street stop is at the southern
                edge of Essex Crossing.
              </p>
              <p>
                <strong>M14 SBS bus:</strong> Crosstown to the West Village
                via 14th Street. Faster than expected — dedicated bus lane.
              </p>
              <p>
                <strong>Citi Bike:</strong> The LES has the highest Citi Bike
                station density in lower Manhattan. Bike Williamsburg Bridge
                to Williamsburg in 6 minutes when subways are slow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The LES Tenement Walkup Market</CardTitle>
              <CardDescription>
                The largest pre-war walkup district below 14th Street — what
                renting one means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The LES has roughly 1,500 surviving tenement-style walkup
                buildings — 5-story, ~25-foot-wide, 4-units-per-floor pre-war
                stock built 1880–1925, originally for immigrant families.
                Most have been gutted and renovated since 2000 with new
                kitchens and baths, but core constraints remain: no elevator,
                galley kitchens, small rooms.
              </p>
              <p>
                Typical pricing for renovated tenement walkups (rough 2026
                medians):
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong>Studio (250–400 sq ft):</strong> $2,200–$2,800
                </li>
                <li>
                  <strong>1-Bedroom (400–550 sq ft):</strong> $2,900–$3,500
                </li>
                <li>
                  <strong>2-Bedroom (650–850 sq ft):</strong> $4,000–$5,000
                </li>
                <li>
                  <strong>4th/5th floor walkup discount:</strong>{" "}
                  $200–$400/month vs. 2nd floor in the same building
                </li>
              </ul>
              <p>
                Trade-offs vs. an Essex Crossing tower: no doorman, no gym,
                no laundry in unit (basement share or laundromat), tubs in
                kitchens not uncommon, climbing 4 flights with groceries.
                Upside: a Houston-Stanton block in a real tenement is among
                the most quintessentially-Manhattan rental experiences left,
                rent increases stay below institutional landlords, and the
                stock is heavily rent-stabilized (built before 1974, often
                6+ units).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lower East Side Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Walkup floor matters more than the address.</strong>{" "}
                  A 4th-floor walkup studio rents for $200–$400/month less
                  than the same 2nd-floor studio in the same building. If
                  you can climb stairs, the 4th floor is often the value
                  play of the block.
                </li>
                <li>
                  <strong>Essex Crossing concessions are real.</strong>{" "}
                  The 2026 leasing wave at 180 Broome and 202 Broome is
                  offering 1–2 months free on 12-month leases. A $4,500
                  gross 1BR with 2 months free has a net effective rent of
                  $3,750 — competitive with non-Essex Crossing stock at the
                  same address quality.
                </li>
                <li>
                  <strong>Rent-stabilized stock concentrates here.</strong>{" "}
                  Many LES walkups are rent-stabilized (built before 1974,
                  6+ units). 2026 RGB renewal caps are 3.0% for 1-year and
                  4.5% for 2-year leases. Ask the landlord, and check DHCR
                  for the unit&apos;s rent registration history.
                </li>
                <li>
                  <strong>Houston is the Manhattan dividing line.</strong>{" "}
                  South of Houston: Lower East Side. North of Houston: East
                  Village. Brokers will sometimes mark a Houston-block
                  building as &ldquo;East Village&rdquo; to add 5–10% to the
                  rent. Verify with the actual address.
                </li>
                <li>
                  <strong>Two Bridges is bimodal.</strong> Either you&apos;re
                  in a luxury tower (One Manhattan Square, the new Cherry
                  Street tower) at $4,000+ 1BR with full amenities, or
                  you&apos;re in a walkup at $2,800–$3,200 with no amenities.
                  There is almost no middle market here.
                </li>
                <li>
                  <strong>F train at Delancey vs East Broadway.</strong>{" "}
                  Both are F. Delancey is more crowded but has the J/M/Z
                  transfer; East Broadway has fewer transfers but is
                  closer to the Two Bridges towers and the Manhattan Bridge
                  pedestrian path.
                </li>
                <li>
                  <strong>FARE Act = landlord pays the broker.</strong>{" "}
                  When the landlord hired the broker, the tenant should not
                  be paying a fee. Confirm on every listing — fees can add
                  10–15% to first-year cost. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act guide
                  </Link>
                  .
                </li>
                <li>
                  <strong>
                    LES vs. East Village pricing on the same walkup type.
                  </strong>{" "}
                  A renovated tenement 1BR at Stanton + Suffolk (LES) runs
                  $3,200; the same building one block north on Houston
                  (East Village) runs $3,500. The 5–10% premium for the EV
                  zip is the only real difference at the walkup tier.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* ── Embedded Rent-Stabilization Checker ────── */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>LES has the highest concentration of rent-stabilized
              walkups in Manhattan</strong> — the pre-1974 6+ unit tenement
              tier is overwhelmingly stabilized even when landlords don&apos;t
              advertise it. Run your specific LES address through the
              eligibility checker below; if it&apos;s stabilized, your max
              legal renewal is capped by RGB at 3.0% (1-year) or 4.5%
              (2-year).
            </p>
            <RentStabilizationChecker />
          </div>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live Lower East Side apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge which LES sub-area (Tenement Core, Essex
                Crossing, East Broadway, Two Bridges), which subway, and your
                budget — we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Lower+East+Side+apartments">
                  Search Lower East Side Apartments
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
                    href="/nyc/lower-east-side/apartments-under-3000"
                    className="text-primary underline underline-offset-2"
                  >
                    LES Apartments Under $3,000
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/lower-east-side/apartments-under-3500"
                    className="text-primary underline underline-offset-2"
                  >
                    LES Apartments Under $3,500
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/lower-east-side/apartments-under-4000"
                    className="text-primary underline underline-offset-2"
                  >
                    LES Apartments Under $4,000
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
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Guide (J/M/Z next stop)
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
