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
    "Apartments for Rent in Greenpoint, Brooklyn (2026): Rent Prices, G Train & Neighborhood Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Greenpoint, Brooklyn. Average rent by unit size, G train and ferry access, waterfront luxury vs. interior walkups, Franklin Street vs. Manhattan Avenue, Polish heritage, and how to find apartments in one of NYC's fastest-growing neighborhoods.",
  keywords: [
    "Greenpoint apartments",
    "Greenpoint Brooklyn apartments",
    "Greenpoint apartments for rent",
    "apartments for rent in Greenpoint",
    "Greenpoint rent",
    "Greenpoint rent prices 2026",
    "Greenpoint studio rent",
    "Greenpoint 1 bedroom rent",
    "Greenpoint 2 bedroom rent",
    "Greenpoint 3 bedroom rent",
    "Greenpoint Landing apartments",
    "Eagle and West apartments",
    "One Blue Slip apartments",
    "Greenpoint waterfront apartments",
    "apartments near McCarren Park",
    "Franklin Street Greenpoint apartments",
    "Manhattan Avenue Greenpoint",
    "Greenpoint vs Williamsburg",
    "G train Brooklyn apartments",
    "Greenpoint ferry apartments",
    "apartments 11222",
    "Polish Greenpoint apartments",
    "moving to Greenpoint Brooklyn",
    "Greenpoint no fee apartments",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Greenpoint, Brooklyn (2026): Rent, Transit & Neighborhood Guide",
    description:
      "2026 rent prices, G train and ferry access, waterfront vs. interior, and apartment-hunting tips for Greenpoint, Brooklyn — one of NYC's fastest-growing rental markets.",
    url: `${baseUrl}/nyc/greenpoint`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/greenpoint` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Greenpoint, Brooklyn (2026): Rent Prices, G Train & Neighborhood Guide",
    description:
      "A comprehensive 2026 guide to renting an apartment in Greenpoint, Brooklyn — covering rent prices by unit size and sub-area, G train and ferry access, the Greenpoint Landing waterfront development, Polish heritage, McCarren Park, and practical tips for apartment hunters.",
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
    mainEntityOfPage: `${baseUrl}/nyc/greenpoint`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Greenpoint, Brooklyn?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, studios in Greenpoint range from $2,400 to $3,200 per month, one-bedrooms from $2,900 to $4,200, two-bedrooms from $3,800 to $5,800, and three-bedrooms from $5,000 to $8,500. Waterfront luxury towers (Greenpoint Landing, Eagle and West, One Blue Slip) sit at the top of each range. Interior walkups on Manhattan Avenue, Franklin Street, and around Nassau Avenue come in 15 to 25 percent cheaper than waterfront new construction.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Greenpoint?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenpoint is served by the G train at Greenpoint Avenue and Nassau Avenue stations. The G is the only subway that runs entirely outside Manhattan — it connects Greenpoint to Williamsburg, Fort Greene, Clinton Hill, Bed-Stuy, Park Slope, and Long Island City. For Manhattan access, most residents walk or bike to the Bedford Avenue L train (10 to 15 minutes south in Williamsburg) or take the NYC Ferry from the Greenpoint Avenue landing. The East River Ferry reaches Midtown East in 20 to 25 minutes and Wall Street in 30 to 35 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Is Greenpoint the same as Williamsburg?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenpoint sits directly north of Williamsburg and shares much of its character, but it is its own neighborhood with distinct identity. Greenpoint has a stronger Polish heritage (bakeries, delis, and community institutions concentrated along Manhattan Avenue), quieter residential streets, and a slower pace than North Williamsburg. Rents are typically 5 to 15 percent lower than equivalent Williamsburg apartments, though the gap is closing as waterfront development brings luxury-tier buildings. The main trade-off is transit: Greenpoint has only the G train directly, while Williamsburg has the L train for fast Manhattan access.",
        },
      },
      {
        "@type": "Question",
        name: "What are the best blocks in Greenpoint for renters?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best blocks depend on priorities. Franklin Street (between Greenpoint Avenue and Eagle Street) offers the neighborhood's densest restaurant and cafe row with residential upper-floor apartments. Manhattan Avenue carries most of the commercial core — Polish bakeries, hardware stores, and local businesses — with mixed-use buildings above. Waterfront blocks (West Street, Commercial Street, around Newtown Creek) have the new luxury towers with ferry access and river views. Interior blocks between McGuinness Boulevard and Manhattan Avenue offer the best value with a 5 to 10 minute walk to the G train.",
        },
      },
      {
        "@type": "Question",
        name: "What is Greenpoint Landing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Greenpoint Landing is a 22-acre waterfront development on the East River at Greenpoint's northern edge, delivering roughly 5,500 new residential units across 10 buildings when complete. Key buildings include Eagle and West (the two-tower complex at 30 and 37 Eagle Street), One Blue Slip, Two Blue Slip, and 2 and 3 Bell Slip. These buildings bring high-end amenities — rooftop pools, coworking spaces, pet spas, children's playrooms — at rents that now rival waterfront Williamsburg. The development also added public waterfront esplanade, a new school, and significantly altered the Greenpoint skyline visible from Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "Why are Greenpoint searches growing so fast?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Google Trends data shows year-over-year search demand for Greenpoint apartments has more than doubled — up over 100 percent in 2026 compared to the same period in 2025. The drivers are the continued delivery of Greenpoint Landing inventory, spillover demand from Williamsburg tenants priced out at renewal, growing ferry ridership connecting Greenpoint to Midtown and Wall Street, and the Manhattan skyline views from waterfront towers. Listings here move in days during the peak summer rental season — April and May are the ideal months to start a Greenpoint search before peak demand hits in July.",
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
        name: "Greenpoint",
        item: `${baseUrl}/nyc/greenpoint`,
      },
    ],
  },
];

export default function GreenpointGuidePage() {
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
              <Badge variant="outline">NYC Neighborhoods</Badge>
              <Badge variant="secondary">Brooklyn</Badge>
              <Badge>Rising Demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Greenpoint, Brooklyn (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              Greenpoint is one of NYC&apos;s fastest-growing rental markets,
              with Google search demand up more than 100% year-over-year. This
              complete 2026 guide covers rent prices by unit size, the G train
              and NYC Ferry, waterfront luxury towers vs. interior walkups,
              best blocks around Franklin Street and Manhattan Avenue, Polish
              heritage, McCarren Park access, and practical tips for finding an
              apartment in Brooklyn&apos;s northern waterfront neighborhood.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 2026 &middot; Rent ranges reflect median asking
              rents in ZIP code 11222 for market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint at a Glance</CardTitle>
              <CardDescription>
                Key numbers for apartment hunters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median Studio Rent
                  </p>
                  <p className="text-lg font-semibold">$2,400 &ndash; $3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$2,900 &ndash; $4,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,800 &ndash; $5,800</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">~$116,000 &ndash; $168,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">G (+ L at Bedford)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Code
                  </p>
                  <p className="text-lg font-semibold">11222</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rising Demand Callout ─────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Why Greenpoint Right Now</CardTitle>
              <CardDescription>
                The data on why this neighborhood is heating up
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Google search demand: up 108.7% year-over-year.
                </span>{" "}
                Greenpoint is one of the fastest-growing neighborhood search
                terms in New York City, more than doubling from the same period
                in 2025. For context, the next-fastest-growing Brooklyn
                neighborhood in our data is Williamsburg at +24.1%.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Peak search month: July.
                </span>{" "}
                Greenpoint listings peak in July at roughly 3x winter demand.
                Starting your search in April or May puts you 2 to 3 months
                ahead of the peak — typically the sweet spot for inventory
                selection without the summer bidding pressure.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  The supply driver: Greenpoint Landing.
                </span>{" "}
                The 22-acre waterfront development has added thousands of new
                luxury units over the last 3 years, with more coming. This is
                the primary reason you&apos;ll see both high-end waterfront
                buildings and falling prices on interior pre-war walkups as
                tenants chase amenities.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  The demand driver: Williamsburg spillover.
                </span>{" "}
                Many current Greenpoint tenants moved from Williamsburg at lease
                renewal — same L/G train access (via a 10-minute walk), 5 to
                15% lower rent, and a less touristy weekend scene.
              </p>
            </CardContent>
          </Card>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="Greenpoint"
            latitude={40.7295}
            longitude={-73.9555}
            radiusMiles={1.0}
            limit={6}
            searchQuery="Greenpoint Brooklyn apartments"
          />

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What Greenpoint Is Like</CardTitle>
              <CardDescription>
                Culture, food, Polish heritage, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Greenpoint sits at the northernmost tip of Brooklyn, bounded by
                Newtown Creek to the north (the Queens border), the East River
                to the west, McCarren Park and Williamsburg to the south, and
                the Brooklyn-Queens Expressway to the east. It is roughly a
                mile long by half a mile wide — walkable end-to-end in 20
                minutes.
              </p>
              <p>
                The neighborhood&apos;s Polish character is still the strongest
                cultural signature. Manhattan Avenue is the commercial spine:
                Polish bakeries (Peter Pan Donuts, Old Poland, Syrena),
                pierogi-forward restaurants, Polish-language signage, Catholic
                churches with Polish-language services, and multi-generational
                family-run shops. This gives the neighborhood a grounding
                texture that waterfront new construction has not displaced.
              </p>
              <p>
                Franklin Street is the hipper, newer commercial axis — a dense
                row of cafes, natural wine bars, specialty grocers, and date-
                night restaurants that skew young-professional. The
                Franklin–Manhattan–McGuinness triangle is where most Greenpoint
                transplants spend their evenings.
              </p>
              <p>
                McCarren Park straddles the Greenpoint–Williamsburg border — a
                35-acre park with a running track, pool, tennis courts, and a
                weekend greenmarket. The north side of McCarren is Greenpoint;
                the south side is Williamsburg. Apartments bordering the park
                on either side command a premium for park views and immediate
                outdoor access.
              </p>
              <p>
                The main trade-offs: transit is thinner than Williamsburg (one
                subway line vs. two), and the G train has shorter platforms and
                less frequent service. For renters who work remotely, mostly
                stay in Brooklyn, or prioritize a quieter residential feel,
                these are non-issues. For daily Manhattan commuters, factor in
                either a 10-minute walk to the Bedford L or a ferry commute.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent Prices Table ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Range from interior walkups to waterfront luxury
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
                    <TableHead className="text-right">Income Needed (40x)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$112,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$4,200</TableCell>
                    <TableCell className="text-right">$140,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$4,600</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$184,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$6,200</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$248,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &ldquo;Low&rdquo; reflects pre-war walkups on interior blocks;
                &ldquo;Median&rdquo; is weighted average across mixed inventory;
                &ldquo;High&rdquo; reflects waterfront luxury buildings
                (Greenpoint Landing, Eagle &amp; West, One Blue Slip). Income
                figures apply the standard NYC 40x annual-gross-income
                guideline.
              </p>
              <p>
                For a deeper breakdown including price-per-square-foot,
                sub-area tables (Waterfront vs. Franklin St vs. Manhattan
                Ave vs. McGuinness), 6-year historical trend, and a direct
                comparison vs. Williamsburg, see our{" "}
                <Link
                  href="/nyc/greenpoint/rent-prices"
                  className="text-primary underline underline-offset-2"
                >
                  Greenpoint rent prices spoke
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Area ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint Rent by Sub-Area</CardTitle>
              <CardDescription>
                Waterfront vs. Manhattan Ave vs. Nassau Ave vs. McGuinness side
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
                    <TableHead>Character</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Waterfront</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                    <TableCell className="text-right">$5,500</TableCell>
                    <TableCell>Luxury towers, ferry, skyline views</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Franklin Corridor
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,600</TableCell>
                    <TableCell className="text-right">$4,700</TableCell>
                    <TableCell>Cafes, bars, mixed-use low-rise</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Manhattan Avenue
                    </TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,300</TableCell>
                    <TableCell>Polish commercial core, walkups</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      McGuinness / East Side
                    </TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell>Quieter, cheaper, industrial edges</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Sub-area boundaries are approximate. The Waterfront row includes
                Greenpoint Landing, Eagle &amp; West, One Blue Slip, and related
                buildings between West Street and the East River.
              </p>
            </CardContent>
          </Card>

          {/* ── Transit ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: Subway, Ferry &amp; Bike</CardTitle>
              <CardDescription>
                Commute times from Greenpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Transit is the biggest difference between Greenpoint and its
                Williamsburg neighbor. You have one subway line directly (the
                G), but the NYC Ferry and a short walk to the L open up fast
                Manhattan options.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">G train</span>{" "}
                  — Greenpoint Avenue and Nassau Avenue stations. The G is the
                  only NYC subway that never enters Manhattan. Direct to
                  Williamsburg (Metropolitan/Lorimer, 2 min), Bed-Stuy, Fort
                  Greene, Clinton Hill, Park Slope, and Long Island City. The
                  Metropolitan/Lorimer stop is the cross-platform transfer to
                  the L for Manhattan.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    L train (via walk)
                  </span>{" "}
                  — Bedford Avenue L is a 10 to 15 minute walk south into
                  Williamsburg. From Bedford, you reach Union Square in 8
                  minutes, Midtown in 15, and crosstown to the West Side in 20.
                  Many Greenpoint residents treat the L as their primary
                  Manhattan line.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    NYC Ferry
                  </span>{" "}
                  — Greenpoint Avenue Ferry Landing. The East River Ferry stops
                  at Long Island City, Roosevelt Island, East 34th Street (20
                  min to Midtown East), and Wall Street (30 to 35 min). The
                  Astoria route and South Brooklyn route also dock here.
                  Waterfront buildings actively market ferry access as a
                  primary commute option.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Buses
                  </span>{" "}
                  — The B24, B32, B43, B48, and B62 serve Greenpoint, with the
                  B62 providing a direct route to downtown Brooklyn and the
                  B43 connecting to Crown Heights.
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    Biking
                  </span>{" "}
                  — Greenpoint is flat and bike-friendly. Kent Avenue and the
                  protected bike lane on McGuinness Boulevard connect directly
                  to Williamsburg and across the Williamsburg Bridge to
                  Manhattan (20 minutes to Delancey Street). Citi Bike
                  stations are dense throughout the neighborhood.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Best Blocks ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Best Blocks &amp; Sub-Neighborhoods</CardTitle>
              <CardDescription>
                Where to focus your Greenpoint apartment search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  The Waterfront (Commercial, West, &amp; Eagle Streets)
                </h3>
                <p>
                  The blocks between West Street and the East River are
                  dominated by the Greenpoint Landing development. This is
                  where Eagle &amp; West (30 and 37 Eagle Street), One Blue
                  Slip, Two Blue Slip, and 2 and 3 Bell Slip are located.
                  Expect elevator buildings with rooftop amenities, doorman
                  service, in-unit washer/dryer, river views, and rents $4,000+
                  for 1BR, $5,500+ for 2BR. Ferry access from your lobby is
                  the defining selling point.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Franklin Street Corridor
                </h3>
                <p>
                  Franklin Street between Greenpoint Avenue and Eagle Street is
                  the neighborhood&apos;s restaurant row — think natural wine
                  bars, cafes, specialty grocers, and weekend brunch spots.
                  Apartments here are typically mixed-use: ground-floor
                  commercial with residential above, or small multi-unit
                  buildings. Good walk scores to food, a 5-minute walk to the G
                  at Greenpoint Avenue, and slightly cheaper than waterfront
                  inventory.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Manhattan Avenue &amp; the Polish Core
                </h3>
                <p>
                  Manhattan Avenue is the commercial spine of Greenpoint&apos;s
                  Polish community. Walkups above Polish bakeries, hardware
                  stores, and delis offer the most authentic neighborhood
                  experience and some of the best value. Expect older buildings
                  with radiators, hardwood floors, and no elevator. 1-bedrooms
                  here can start at $2,800 to $3,200 for a walk-up unit in
                  good condition.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Nassau Avenue &amp; McCarren Park Edge
                </h3>
                <p>
                  The blocks around the Nassau Avenue G station and extending
                  south to McCarren Park are the best Greenpoint option for
                  renters who want park access. Immediate walk to the G,
                  5-minute walk to McCarren, and a mix of pre-war row houses
                  and mid-rise new construction. This is the most family-
                  friendly part of Greenpoint.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  East Greenpoint / McGuinness Side
                </h3>
                <p>
                  East of McGuinness Boulevard, toward the Brooklyn-Queens
                  Expressway and the industrial edge near Newtown Creek. This
                  is the cheapest sub-area — 1-bedrooms can be found for
                  $2,600 to $3,000. Trade-offs: longer walks to the G (8 to
                  12 minutes), industrial zoning on several blocks, and quieter
                  streets at night. Best for renters who prioritize price and
                  don&apos;t mind a longer walk or who commute via the Long
                  Island Rail Road at Hunterspoint Avenue (a 15-minute walk
                  north into Long Island City).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Apartment Hunting Tips ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for Greenpoint</CardTitle>
              <CardDescription>
                Practical advice tuned to this market in 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Start in April or May, not July.
                  </span>{" "}
                  Google search demand peaks in July, but listings get
                  replaced and prices firm up as the peak approaches. Starting
                  your search in April or May gives you 2 to 3 months of
                  inventory and more negotiating leverage.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Have your documents ready before you tour.
                  </span>{" "}
                  Greenpoint apartments move in 3 to 7 days on average. Prepare
                  your package in advance: two recent pay stubs, last
                  year&apos;s tax returns, bank statements, photo ID, and a
                  reference letter from a previous landlord. See our{" "}
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="text-primary underline underline-offset-2"
                  >
                    rental application screening guide
                  </Link>{" "}
                  for the full list.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Compare gross rent to net effective rent on waterfront
                    buildings.
                  </span>{" "}
                  Greenpoint Landing buildings often offer 1 to 2 months free
                  on 12- to 14-month leases. A $4,200 gross 1BR with 2 months
                  free on a 14-month lease is a net effective rent of $3,600
                  — 14% below the headline number. At renewal, landlords
                  typically quote the gross rent, so model the renewal scenario
                  before you sign.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Use the FARE Act to avoid broker fees.
                  </span>{" "}
                  NYC&apos;s FARE Act (in effect since 2025) shifted broker
                  fees from tenants to landlords when the landlord hires the
                  broker. On a Greenpoint 1-bedroom at $3,500, this saves you
                  $4,200 to $4,900 in upfront costs. Read our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>{" "}
                  for the details.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Check rent stabilization on pre-war walkups.
                  </span>{" "}
                  Manhattan Avenue and the blocks around Nassau Avenue have
                  many pre-1974 walkup buildings, many of which contain rent-
                  stabilized units. A rent-stabilized 1BR caps annual increases
                  at the Rent Guidelines Board rate (typically 2 to 3.5%) and
                  offers lease-renewal rights. Ask the landlord directly, or
                  check the NYC DHCR registration rent database. See our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>
                  .
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. If your commute is Midtown East, seriously consider the
                    ferry.
                  </span>{" "}
                  The Greenpoint ferry to East 34th Street is 20 minutes,
                  door-to-door, often faster than the subway. A Ferry
                  monthly pass is $132 (as of 2026). Factor this into your
                  waterfront rent premium math — the premium may be worth it
                  if it saves 30+ minutes daily.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    7. Budget for the G train&apos;s realities.
                  </span>{" "}
                  The G has 4-car trains (shorter than standard 8-car trains),
                  less frequent service, and occasional shuttle buses during
                  weekend work. If your commute requires reliable peak-hour
                  service, either live on Nassau Avenue (close to Bedford L
                  transfer) or budget a ferry backup.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    8. Use AI search to find off-market inventory.
                  </span>{" "}
                  Many Greenpoint landlords list through smaller portals and
                  property-manager websites rather than major aggregator sites.
                  Wade Me Home aggregates these listings and lets you search by
                  natural language — describe what you want and our AI finds
                  matches. Especially effective for the Polish-heritage walkup
                  segment, which is under-indexed on major listing sites.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Greenpoint vs Neighbors ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Greenpoint vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                How Greenpoint compares on rent, transit, and vibe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead className="text-right">1BR Median</TableHead>
                    <TableHead>Primary Transit</TableHead>
                    <TableHead>Vibe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Greenpoint</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell>G + ferry</TableCell>
                    <TableCell>Polish core, waterfront luxury</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell>L, G, J/M/Z</TableCell>
                    <TableCell>Trendy, dense nightlife</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bushwick</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell>L, J/M/Z</TableCell>
                    <TableCell>Arts-heavy, cheapest of the three</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Long Island City</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell>7, E, M, G, N/W + ferry</TableCell>
                    <TableCell>Luxury high-rise, commute-optimized</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Astoria</TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell>N, W, R</TableCell>
                    <TableCell>Greek heritage, family-friendly</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs.{" "}
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg
                  </Link>
                </h3>
                <p>
                  Greenpoint is 5 to 15% cheaper than Williamsburg for
                  equivalent inventory, with a slower pace and stronger
                  residential feel. The main trade-off is transit: Williamsburg
                  has the L train directly, while Greenpoint has the G plus a
                  walk. If your commute is Midtown or the West Side, Bedford L
                  or ferry from Greenpoint are both viable.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs.{" "}
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City
                  </Link>
                </h3>
                <p>
                  LIC and Greenpoint&apos;s waterfront are comparable on rent
                  and both have ferry access. LIC has significantly better
                  subway options (7, E, M, G, N, W) and faster Manhattan
                  commutes. Greenpoint wins on pre-war walkup inventory,
                  Polish neighborhood character, and proximity to the
                  Williamsburg food and nightlife scene.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs.{" "}
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick
                  </Link>
                </h3>
                <p>
                  Bushwick is the budget option — roughly 25% cheaper than
                  Greenpoint for equivalent square footage. Bushwick has a
                  younger, artsier scene and the L train directly. Greenpoint
                  offers more mature inventory, waterfront views, and better
                  walk-score. Choose Greenpoint if you want a settled
                  neighborhood with amenity density; choose Bushwick if you
                  prioritize price and creative-industry proximity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── FAQ ───────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  How much is rent in Greenpoint, Brooklyn?
                </h3>
                <p>
                  Studios range from $2,400 to $3,200. 1-bedrooms run $2,900
                  to $4,200. 2-bedrooms $3,800 to $5,800. 3-bedrooms $5,000 to
                  $8,500. Waterfront luxury sits at the top of each range,
                  interior walkups at the bottom.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve Greenpoint?
                </h3>
                <p>
                  The G train (Greenpoint Ave and Nassau Ave stations) is the
                  only subway directly in Greenpoint. The Bedford L in
                  Williamsburg is a 10 to 15 minute walk south. NYC Ferry
                  from the Greenpoint Avenue landing connects to Midtown East
                  (20 min) and Wall Street (30 to 35 min).
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Greenpoint expensive?
                </h3>
                <p>
                  Greenpoint is moderate-to-high for Brooklyn. It is cheaper
                  than Williamsburg and LIC, more expensive than Bushwick and
                  Bed-Stuy. Waterfront luxury buildings rival North
                  Williamsburg rents; interior walkups are 20 to 30% cheaper
                  than waterfront new construction.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is Greenpoint still Polish?
                </h3>
                <p>
                  Yes, though changing. The Polish community remains anchored
                  along Manhattan Avenue with bakeries, delis, restaurants,
                  and Catholic churches with Polish-language services.
                  Transplants have diversified the neighborhood significantly
                  over the last decade, especially around Franklin Street and
                  the waterfront, but the Polish core is visible and active.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What is the best time to look for apartments in Greenpoint?
                </h3>
                <p>
                  April, May, and October. Listings peak in July (highest
                  volume and pricing), dip in winter (best concessions, less
                  inventory). April and May give you good inventory and
                  pre-peak prices. October is the winter opportunity window
                  before inventory dries up. See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent in NYC
                  </Link>{" "}
                  guide for more.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there no-fee apartments in Greenpoint?
                </h3>
                <p>
                  Yes. Greenpoint Landing buildings (Eagle &amp; West, One
                  Blue Slip, etc.) typically list as no-fee directly from
                  landlord leasing offices. Interior walkups are more
                  variable — but the FARE Act has shifted most broker fees to
                  landlords in 2025, so even when a broker is involved, the
                  fee usually isn&apos;t yours. Verify upfront costs before
                  you apply.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your Greenpoint Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe what you want — 1BR under $3,500 near the Bedford L,
                a 2BR with in-unit laundry at Greenpoint Landing, a rent-
                stabilized walkup on Manhattan Avenue — and our AI searches
                current Greenpoint listings in seconds.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related NYC Renting Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/greenpoint/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Greenpoint Rent Prices: Studio, 1BR, 2BR &amp; 3BR Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg"
                    className="text-primary underline underline-offset-2"
                  >
                    Apartments for Rent in Williamsburg, Brooklyn (2026)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/williamsburg/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Williamsburg Rent Prices: Studio, 1BR, 2BR &amp; 3BR Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Apartments: Rent Prices, Transit &amp; Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/long-island-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Long Island City (LIC) Apartments: Luxury Towers &amp; Rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Rent Prices, Transit &amp; Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent by Neighborhood: Prices, Commutes &amp; Tips
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
                    href="/nyc-moving-checklist"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Moving Checklist
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
                <li>
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Guide
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
