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
import { RGBRenewalCalculator } from "@/components/rent-stab/RGBRenewalCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "Apartments for Rent in East Village, Manhattan (2026): Rent Prices, Transit & Neighborhood Guide | Wade Me Home",
  description:
    "East Village rent prices 2026, April Concession Watch, L/6/F/M transit, Alphabet City vs. Tompkins Square vs. St. Marks, embedded rent stabilization eligibility checker, FARE Act negotiation playbook, and 2026 summer hunting plan.",
  keywords: [
    "East Village apartments",
    "East Village Manhattan apartments",
    "East Village apartments for rent",
    "apartments for rent in East Village",
    "East Village rent",
    "East Village rent prices 2026",
    "East Village studio rent",
    "East Village 1 bedroom rent",
    "East Village 2 bedroom rent",
    "East Village 3 bedroom rent",
    "Alphabet City apartments",
    "Alphabet City rent prices",
    "apartments near Tompkins Square Park",
    "St Marks Place apartments",
    "East Village rent stabilized",
    "affordable East Village apartments",
    "no fee East Village apartments",
    "East Village vs Lower East Side",
    "East Village vs Williamsburg",
    "East Village walkup apartments",
    "East Village luxury apartments",
    "apartments 10003 10009",
    "L train Manhattan apartments",
    "moving to East Village NYC",
    "East Village concessions 2026",
    "East Village FARE Act",
    "East Village no broker fee",
    "is my east village apartment stabilized",
    "East Village rent stabilized checker",
    "Avenue A apartments",
    "Avenue B apartments",
    "Avenue C apartments",
    "Avenue D apartments",
    "Tompkins Square apartments",
    "East Village free month rent",
    "East Village summer 2026",
    "East Village net effective rent",
    "First Avenue East Village apartments",
    "East Village 421a",
    "East Village J51 abatement",
  ],
  openGraph: {
    title:
      "Apartments for Rent in East Village, Manhattan (2026): Rent, Transit & Neighborhood Guide",
    description:
      "2026 rent prices, subway access, best blocks, and apartment-hunting tips for the East Village — one of Manhattan's most in-demand rental markets with demand up 168% year-over-year.",
    url: `${baseUrl}/nyc/east-village`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/east-village` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in East Village, Manhattan (2026): Rent Prices, Transit & Neighborhood Guide",
    description:
      "A comprehensive 2026 guide to renting an apartment in the East Village, Manhattan — covering rent prices by unit size and sub-area, L/6/F/M subway access, Alphabet City and Tompkins Square character, rent stabilization, and practical tips for apartment hunters.",
    datePublished: "2026-04-13",
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
    mainEntityOfPage: `${baseUrl}/nyc/east-village`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a one-bedroom apartment cost in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of early 2026, the median asking rent for a one-bedroom apartment in the East Village is approximately $3,500 to $4,000 per month. Studios typically start around $2,500 to $3,000, two-bedrooms range from $4,500 to $5,500, and three-bedrooms $5,800 to $8,000 or more. Prices vary significantly based on the specific block, building amenities, and whether the unit is in a walkup or elevator building. Alphabet City (Avenues B through D) is 10 to 15 percent cheaper than the western blocks near Third Avenue.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The East Village is served by multiple lines. The L train stops at First Avenue and Third Avenue, providing direct access to Union Square (2 minutes) and Williamsburg in Brooklyn (10 to 15 minutes). The 6 train runs along the western edge at Astor Place. The F and M trains stop at Second Avenue (Houston Street). The N, R, and W trains are accessible at 8th Street-NYU. Most of Manhattan and Brooklyn is reachable within 20 to 30 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Is the East Village a good neighborhood for young professionals?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The East Village is one of the most popular neighborhoods in NYC for young professionals aged 22 to 35. It offers a dense concentration of restaurants, bars, live music venues, and independent shops. The neighborhood has a strong community feel despite being in Manhattan, with regular events in Tompkins Square Park and a thriving local business scene. Google search demand for East Village apartments is up 168 percent year-over-year in 2026 — the fastest-growing NYC neighborhood by this measure. The main trade-off is price — expect to pay a premium compared to outer-borough neighborhoods with similar energy like Williamsburg or Bushwick.",
        },
      },
      {
        "@type": "Question",
        name: "What is the income requirement to rent in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most East Village landlords follow the standard NYC 40x rule: your annual gross income must be at least 40 times the monthly rent. For a $3,500 one-bedroom, that means you need to earn at least $140,000 per year. For a $5,000 two-bedroom, you need $200,000. If your income falls short, you can use a guarantor who earns at least 80 times the monthly rent, or use a guarantor service like Rhino or TheGuarantor for a one-time fee.",
        },
      },
      {
        "@type": "Question",
        name: "When is the best time to look for apartments in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The best time to find deals in the East Village is during winter months, from November through February. Inventory is lower, but landlords are more likely to offer concessions like one or two months free rent. Avoid the peak season from May through September, especially around August and September when competition from students and new graduates is highest. East Village listings typically move within days during peak season, so be prepared to act fast regardless of the month.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in the East Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The East Village has one of Manhattan's highest concentrations of rent-stabilized apartments, concentrated in pre-1974 walkup tenement buildings with six or more units. Many buildings along Avenues A, B, C, and D, plus the tenement stock on 5th through 12th Streets, contain stabilized units. Rent-stabilized tenants get lease-renewal rights and annual rent increases capped by the NYC Rent Guidelines Board (typically 2 to 3.5 percent). Always ask the landlord whether a unit is stabilized before you sign, and verify via the NYC DHCR rent registration database.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between East Village and Alphabet City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Alphabet City is the eastern sub-area of the East Village, covering the avenues named with letters (Avenues A, B, C, and D). It runs from Avenue A east to the FDR Drive. Alphabet City has cheaper rents (roughly 10 to 15 percent less than the western blocks), a quieter residential feel, and more community gardens. The trade-off is a longer walk to the subway — 10 to 15 minutes to the L at First Avenue or the 6 at Astor Place. The rest of the East Village (west of Avenue A) is denser with subway access and commercial activity, but at a rent premium.",
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
        name: "East Village",
        item: `${baseUrl}/nyc/east-village`,
      },
    ],
  },
];

export default function EastVillageGuidePage() {
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
              <Badge variant="secondary">Manhattan</Badge>
              <Badge>Rising Demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in East Village, Manhattan (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              The East Village is the fastest-growing NYC neighborhood by
              search demand in 2026 — apartment searches are up more than
              168% year-over-year per Google Trends. This complete guide
              covers rent prices by unit size, L/6/F/M subway access,
              Alphabet City vs. Tompkins Square vs. St. Marks, rent
              stabilization in pre-war tenements, and practical tips for
              finding an apartment in Manhattan&apos;s most in-demand
              downtown neighborhood.
            </p>
            <p className="text-xs text-muted-foreground">
              Updated April 29, 2026 &middot; Concession Watch live &middot;
              Rent ranges reflect median asking rents across ZIP codes 10003
              and 10009 for market-rate apartments
            </p>
          </header>

          {/* ── Quick Facts ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village at a Glance</CardTitle>
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
                  <p className="text-lg font-semibold">$2,500 &ndash; $3,200</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 1-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$3,500 &ndash; $4,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Median 2-Bedroom Rent
                  </p>
                  <p className="text-lg font-semibold">$4,500 &ndash; $5,500</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Income Needed (1BR)
                  </p>
                  <p className="text-lg font-semibold">~$140,000 &ndash; $160,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Subway Lines
                  </p>
                  <p className="text-lg font-semibold">L, 6, F, M, N, R, W</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    ZIP Codes
                  </p>
                  <p className="text-lg font-semibold">10003, 10009</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Rising Demand Callout ─────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Why the East Village Right Now</CardTitle>
              <CardDescription>
                The data on why this neighborhood leads 2026 demand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Google search demand: up 168.6% year-over-year.
                </span>{" "}
                The East Village is the #1 fastest-growing NYC neighborhood
                search term in 2026 — more than 2.5x the same period in 2025.
                For context, Williamsburg (a perennially hot market) is up
                only 24.1% over the same period.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Peak search month: March 2026.
                </span>{" "}
                Unusually, East Village demand peaked earlier than the
                typical NYC rental cycle — March instead of July. This means
                starting in April puts you right after the peak with
                inventory still turning over quickly.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  The demand driver: post-pandemic return to density.
                </span>{" "}
                Young professionals who moved out of Manhattan during
                2020-2022 are cycling back. The East Village combines the
                nightlife and walkability they want with comparatively
                smaller price premiums vs. the West Village or SoHo.
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  The supply story: effectively flat.
                </span>{" "}
                The East Village has almost no new construction (historic
                district zoning and tenement preservation). This means rising
                demand hits a fixed supply — listings move in days and
                concessions are rare outside deep winter.
              </p>
            </CardContent>
          </Card>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName="East Village"
            latitude={40.7265}
            longitude={-73.9815}
            radiusMiles={0.8}
            limit={6}
            searchQuery="East Village Manhattan apartments"
          />

          {/* ── Neighborhood Character ────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>What the East Village Is Like</CardTitle>
              <CardDescription>
                Culture, food, nightlife, and daily life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The East Village sits between 14th Street and Houston Street,
                roughly from the Bowery east to the East River. It has one
                of the highest densities of restaurants, bars, and
                independent shops per block in all of Manhattan. The
                neighborhood is known for its mix of old-school NYC character
                — walk-up tenements, community gardens, and long-running
                dive bars — alongside newer luxury developments and craft
                cocktail spots.
              </p>
              <p>
                Tompkins Square Park is the neighborhood&apos;s green anchor,
                hosting farmers markets, live music, and community events
                throughout the year. The surrounding blocks (Avenues A and
                B) are among the most desirable for renters who want to be
                close to the action without living directly on a major
                commercial strip.
              </p>
              <p>
                The food scene ranges from legendary cheap eats — dollar
                dumplings on St. Marks Place, late-night pizza on First
                Avenue, the iconic Veselka diner — to Michelin-starred
                restaurants scattered along quieter side streets. For
                nightlife, the neighborhood offers everything from jazz
                clubs and comedy shows to rooftop bars and underground music
                venues.
              </p>
              <p>
                The main trade-off is noise and space. The East Village is
                loud, especially on weekend nights along Avenue A, St. Marks
                Place, and Second Avenue. Apartments tend to be smaller and
                older than what you would find in newer buildings in Long
                Island City or Downtown Brooklyn. If you prioritize space
                and quiet over walkability and culture density, consider
                neighborhoods like{" "}
                <Link
                  href="/nyc/long-island-city"
                  className="text-primary underline underline-offset-2"
                >
                  Long Island City
                </Link>{" "}
                or{" "}
                <Link
                  href="/nyc/park-slope"
                  className="text-primary underline underline-offset-2"
                >
                  Park Slope
                </Link>{" "}
                instead.
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Unit Size ─────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village Rent Prices by Unit Size (2026)</CardTitle>
              <CardDescription>
                Range from walkup studios to elevator 3-bedrooms
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
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$2,850</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell className="text-right">$114,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell className="text-right">$3,200</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$150,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell className="text-right">$6,500</TableCell>
                    <TableCell className="text-right">$200,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell className="text-right">$6,800</TableCell>
                    <TableCell className="text-right">$8,500</TableCell>
                    <TableCell className="text-right">$272,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                &ldquo;Low&rdquo; reflects pre-war walkups in Alphabet City;
                &ldquo;Median&rdquo; is weighted average across inventory;
                &ldquo;High&rdquo; reflects elevator buildings with in-unit
                laundry on the western blocks near Astor Place and 3rd
                Avenue. Income figures apply the standard NYC 40x annual-
                gross-income rule.
              </p>
              <p>
                For a deeper breakdown with historical trends and price-per-
                square-foot benchmarks, see our{" "}
                <Link
                  href="/nyc/east-village/rent-prices"
                  className="text-primary underline underline-offset-2"
                >
                  East Village rent prices spoke
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* ── Rent by Sub-Area ──────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village Rent by Sub-Area</CardTitle>
              <CardDescription>
                Alphabet City vs. Tompkins Square vs. St. Marks vs. Stuy Town
                border
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
                    <TableCell className="font-medium">Alphabet City</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell className="text-right">$3,300</TableCell>
                    <TableCell className="text-right">$4,500</TableCell>
                    <TableCell>Cheapest, walk to subway 10–15 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tompkins Square
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,700</TableCell>
                    <TableCell className="text-right">$5,000</TableCell>
                    <TableCell>Heart of neighborhood, park adjacent</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      St. Marks / Astor
                    </TableCell>
                    <TableCell className="text-right">$2,900</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,300</TableCell>
                    <TableCell>Busiest blocks, best subway access</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      14th St / Stuy Town Edge
                    </TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                    <TableCell className="text-right">$4,100</TableCell>
                    <TableCell className="text-right">$5,800</TableCell>
                    <TableCell>Newer buildings, L train, larger units</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-xs">
                Sub-area boundaries are approximate. The Stuy Town Edge row
                refers to the northern strip of the East Village along 13th
                and 14th Streets where newer-construction buildings dominate.
              </p>
            </CardContent>
          </Card>

          {/* ── 2026 Concession Watch ───────────────────────────────── */}
          <Card className="border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600">Live April 2026</Badge>
                <Badge variant="outline">Page-1 ranked</Badge>
                <Badge variant="outline">+168% YoY search demand</Badge>
              </div>
              <CardTitle>East Village Concession Watch (April 2026)</CardTitle>
              <CardDescription>
                The East Village is one of the few Manhattan submarkets where
                landlords are still offering meaningful concessions in spring
                2026 — driven by post-2019 mid-rise lease-ups along First/Second
                Avenue and along the 13th–14th Street Stuy Town Edge. Below
                is the active concession structure across the four main tier
                tiers, plus 2026-specific negotiation points for tenement-stock
                tenants where stabilized-walkup eligibility is the real win.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building tier</TableHead>
                    <TableHead>Active concession</TableHead>
                    <TableHead className="text-right">1BR net-effective</TableHead>
                    <TableHead>Window</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Stuy Town Edge new-con (2nd–3rd Ave, 13th–14th)
                    </TableCell>
                    <TableCell>
                      1–1.5 mo free + waived application fee on 14-mo lease
                    </TableCell>
                    <TableCell className="text-right">~$4,200</TableCell>
                    <TableCell>Strong through Memorial Day</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Avenue A / 1st Ave doorman mid-rise
                    </TableCell>
                    <TableCell>
                      0.5–1 mo free + reduced security on 12–13 mo lease
                    </TableCell>
                    <TableCell className="text-right">~$3,950</TableCell>
                    <TableCell>Compresses by mid-June</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Pre-war tenement walkup (5th–10th Streets)
                    </TableCell>
                    <TableCell>
                      Stabilized stock common; concessions rare. Broker fee
                      waived under FARE Act (landlord-paid).
                    </TableCell>
                    <TableCell className="text-right">~$3,500</TableCell>
                    <TableCell>Year-round (low turnover)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Alphabet City walkup (Aves B, C, D)
                    </TableCell>
                    <TableCell>
                      Small-landlord stock; 0–0.5 mo free occasional. Many
                      gut-renovated stabilized walkups.
                    </TableCell>
                    <TableCell className="text-right">~$3,150</TableCell>
                    <TableCell>Year-round</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      St Marks / Astor Pl trophy new-con
                    </TableCell>
                    <TableCell>
                      0.5 mo free max; concessions tight given proximity to NYU
                    </TableCell>
                    <TableCell className="text-right">~$4,800</TableCell>
                    <TableCell>Tight after July 4</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                <strong>2026-specific negotiation points to bring to a tour:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1.5">
                <li>
                  <strong>FARE Act broker-fee waiver in writing.</strong> Any
                  East Village listing on StreetEasy / Zillow defaults to a
                  landlord-paid broker fee under the June 2025 FARE Act. Get
                  the waiver written into the lease, not just in the listing.
                </li>
                <li>
                  <strong>Rent-stabilized eligibility on pre-war
                  walkups.</strong> Any East Village or Alphabet City walkup
                  built before 1974 with 6+ units is likely stabilized. RGB
                  caps 2025–2026 renewals at 3.0% (1-year) / 4.5% (2-year).
                  Run the building through the embedded checker below before
                  signing — it&apos;s the single biggest financial win
                  available in this neighborhood.
                </li>
                <li>
                  <strong>421a / J-51 abatement check on mid-rise
                  inventory.</strong> Mid-rises along Stuy Town Edge and 1st
                  Avenue built 2007–2018 may be 421a-stabilized. Ask the
                  landlord directly for the building&apos;s active tax
                  abatement and DHCR registration status.
                </li>
                <li>
                  <strong>14-month lease structure to avoid August
                  renewal.</strong> Mid-rise lease-ups prefer 14-month leases
                  to align renewals with the August/September peak — bad for
                  the renter at renewal. Push for 13 or 18 months instead.
                </li>
                <li>
                  <strong>Concession compression as June approaches.</strong>{" "}
                  The 1.5-month-free offers at Stuy Town Edge shrink to 1
                  month by Memorial Day and to 0.5 month by July 4. Tour
                  Apr–early May to lock the best terms.
                </li>
              </ul>
              <p className="text-xs italic">
                Concession data reflects active StreetEasy and direct-landlord
                listings as of late April 2026. Specific incentives vary
                building-to-building and disappear quickly when a building
                hits ~92% leased.
              </p>
            </CardContent>
          </Card>

          {/* ── Summer 2026 Hunting Plan ───────────────────────────────── */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-amber-600">2026 Hunting Plan</Badge>
                <Badge variant="outline">May–Aug 2026</Badge>
              </div>
              <CardTitle>Summer 2026 East Village Hunting Plan</CardTitle>
              <CardDescription>
                Move-in window × concession outlook × inventory depth. The
                East Village is one of the fastest-clearing Manhattan markets
                — a unit listed at 9 a.m. is often in application by noon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Move-in month</TableHead>
                    <TableHead>Best search-start</TableHead>
                    <TableHead>Concession outlook</TableHead>
                    <TableHead>Inventory depth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">May 2026</TableCell>
                    <TableCell>Apr 1 – Apr 20</TableCell>
                    <TableCell>1–1.5 mo free common (mid-rise)</TableCell>
                    <TableCell>Thin (best units already pre-leased)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">June 2026</TableCell>
                    <TableCell>Apr 25 – May 15</TableCell>
                    <TableCell>0.5–1 mo free; reduced security</TableCell>
                    <TableCell>Strong (peak supply window)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">July 2026</TableCell>
                    <TableCell>May 20 – Jun 10</TableCell>
                    <TableCell>0–0.5 mo free; FARE-Act waivers only</TableCell>
                    <TableCell>Strong but heavy NYU/Cooper Union competition</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">August 2026</TableCell>
                    <TableCell>Jun 25 – Jul 10</TableCell>
                    <TableCell>None on prime inventory</TableCell>
                    <TableCell>Peak demand — lowest leverage</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p>
                The East Village has the highest concentration of pre-1974
                tenement stock in Manhattan, which means the rent-stabilized
                walkup pool is the structural alpha here — it doesn&apos;t
                compress with the seasonal cycle. If you find a stabilized
                Avenue B or 7th Street walkup at any time of year, the lifetime
                value of the lease (with 3.0% / 4.5% RGB caps compounding) is
                $30–60k over 10 years vs. equivalent market-rate inventory.
              </p>
            </CardContent>
          </Card>

          {/* ── Transit ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Around: Subway &amp; Transit</CardTitle>
              <CardDescription>
                Commute times from the East Village
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The East Village has solid subway access, though coverage
                varies by block. The western side of the neighborhood (near
                Third Avenue) is well served, while the eastern edge near
                Avenue D requires a longer walk to the nearest station.
              </p>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-foreground">L train</span>{" "}
                  — First Avenue and Third Avenue stations. Your fastest
                  route to Union Square (2 minutes), Chelsea/Meatpacking (5
                  minutes), and Williamsburg/Bushwick in Brooklyn (10 to 15
                  minutes).
                </div>
                <div>
                  <span className="font-semibold text-foreground">6 train</span>{" "}
                  — Astor Place station at the neighborhood&apos;s western
                  edge. Direct access to Midtown East (15 minutes), Grand
                  Central (12 minutes), and the Upper East Side (20 minutes).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    F and M trains
                  </span>{" "}
                  — Second Avenue station (at Houston). Connects to the
                  Lower East Side, West Village, and Midtown. The F
                  continues to Brooklyn (Carroll Gardens, Park Slope).
                </div>
                <div>
                  <span className="font-semibold text-foreground">
                    N, R, W trains
                  </span>{" "}
                  — 8th Street-NYU station. Direct to SoHo, Canal Street,
                  and Downtown Brooklyn (15 minutes).
                </div>
                <div>
                  <span className="font-semibold text-foreground">Buses</span>{" "}
                  — The M14A and M14D buses run crosstown along 14th Street
                  for access to the West Side. The M15 SBS runs north-south
                  along First and Second Avenues for fast Upper East Side
                  and Lower Manhattan trips without a subway transfer.
                </div>
              </div>
              <p>
                Citi Bike stations are plentiful throughout the East
                Village, and many residents bike along the protected lanes
                on First and Second Avenues. The Williamsburg Bridge
                (accessible from Delancey) puts Brooklyn 20 minutes away by
                bike.
              </p>
            </CardContent>
          </Card>

          {/* ── Best Blocks ──────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Best Blocks &amp; Micro-Neighborhoods</CardTitle>
              <CardDescription>
                Where to focus your apartment search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Alphabet City (Avenues A through D)
                </h3>
                <p>
                  The eastern stretch of the East Village, between Avenue A
                  and the FDR Drive. This area offers the most affordable
                  rents in the neighborhood, with studios starting under
                  $2,500 on Avenues C and D. The trade-off is a longer walk
                  to the subway (10 to 15 minutes to the L or 6). Community
                  gardens, local bodegas, and a quieter residential feel
                  distinguish this area from the busier western blocks.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Tompkins Square Area (7th to 10th Streets, A to B)
                </h3>
                <p>
                  The heart of the neighborhood. This is the most walkable
                  and lively section, with Tompkins Square Park as the
                  anchor. Rents here are at the neighborhood median or
                  slightly above. Expect strong foot traffic, excellent
                  restaurant options on every block, and noise on weekend
                  nights. Ideal for renters who prioritize walkability and
                  community over quiet.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  St. Marks Place &amp; Astor Place Corridor
                </h3>
                <p>
                  The western commercial strip. St. Marks Place (8th Street
                  between Third Avenue and Avenue A) is the busiest,
                  loudest block in the East Village — famous for its mix of
                  shops, food stalls, and nightlife. Apartments directly on
                  St. Marks are noisy but relatively affordable. The blocks
                  just north and south (9th and 7th Streets) offer a good
                  balance of access and livability.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Stuyvesant Town Border (14th Street Edge)
                </h3>
                <p>
                  The northern boundary of the East Village sits along 14th
                  Street, adjacent to Stuyvesant Town. This area offers
                  easy access to the L train, Union Square, and Trader
                  Joe&apos;s. Rents are slightly higher due to the newer
                  building stock along 13th and 14th Streets, but you get
                  more square footage and modern amenities compared to the
                  older walkups further south.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Rent Stabilization Callout ────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Rent Stabilization in the East Village</CardTitle>
              <CardDescription>
                The neighborhood with Manhattan&apos;s highest share of
                stabilized units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The East Village&apos;s pre-war tenement stock (buildings
                constructed before 1974 with six or more units) contains a
                high share of rent-stabilized apartments — one of the
                highest concentrations in Manhattan. Rent-stabilized status
                caps annual rent increases at the rate set by the NYC Rent
                Guidelines Board (typically 2 to 3.5% for 1-year leases)
                and gives you lease-renewal rights.
              </p>
              <p>
                Stabilized units often rent at or slightly below market in
                the first year, with the real value accruing over multiple
                renewals as your rent grows 2-3% annually vs. the 5-8% typical
                market increases.
              </p>
              <p>
                How to find one: (1) ask the landlord directly whether a
                unit is stabilized before applying, (2) check the NYC DHCR
                rent registration history, and (3) look at smaller walkup
                tenements on Avenues A, B, C, D and on 5th through 12th
                Streets. See our{" "}
                <Link
                  href="/blog/nyc-rent-stabilization-guide"
                  className="text-primary underline underline-offset-2"
                >
                  NYC rent stabilization guide
                </Link>{" "}
                for full details — or run a specific East Village address
                through the eligibility checker below.
              </p>
            </CardContent>
          </Card>

          {/* ── Embedded Rent Stabilization Checker ─────────────────── */}
          <RentStabilizationChecker />
          <div className="text-xs text-muted-foreground -mt-4 px-2">
            Results are guidance based on the rules in 9 NYCRR §2520. The
            authoritative answer is the building&apos;s DHCR rent
            registration — request a free rent history at{" "}
            <a
              href="https://hcr.ny.gov/rent-administration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              hcr.ny.gov/rent-administration
            </a>
            .
          </div>

          {/* ── Embedded RGB Renewal Calculator ─────────────────── */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>If your East Village apartment is rent stabilized,
              the 1-year vs. 2-year renewal decision is real money</strong>{" "}
              — at the 2025–2026 RGB caps (3.0% / 4.5%) it works out to a
              ~2.91% crossover next-year RGB. Run your specific rent
              through the calculator below.
            </p>
            <RGBRenewalCalculator />
          </div>

          {/* ── Apartment Hunting Tips ─────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Apartment Hunting Tips for the East Village</CardTitle>
              <CardDescription>
                Practical advice for the 2026 market
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">
                    1. Have your documents ready before you tour.
                  </span>{" "}
                  East Village apartments move fast — often within 24 to 48
                  hours of listing given 2026&apos;s rising demand. Prepare
                  your application package in advance: two recent pay stubs,
                  tax returns, bank statements, photo ID, and a reference
                  letter from a previous landlord. Our{" "}
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="text-primary underline underline-offset-2"
                  >
                    rental application guide
                  </Link>{" "}
                  walks through everything landlords look for.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    2. Consider walk-ups east of Avenue A for the best value.
                  </span>{" "}
                  The biggest price drops in the East Village happen as you
                  move east. A fifth-floor walkup on Avenue C can be $500
                  to $800 cheaper per month than a similar unit near Third
                  Avenue. If you are comfortable with stairs and a longer
                  subway walk, Alphabet City offers genuine value.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    3. Search during winter for concessions.
                  </span>{" "}
                  November through February is when landlords are most
                  likely to offer one or two months free rent. These
                  concessions effectively lower your monthly cost by 8% to
                  16% over the lease term. Check our{" "}
                  <Link
                    href="/blog/negotiating-rent-and-lease-terms"
                    className="text-primary underline underline-offset-2"
                  >
                    lease negotiation guide
                  </Link>{" "}
                  for tactics that work in NYC.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    4. Watch out for scams on no-fee listings.
                  </span>{" "}
                  The East Village&apos;s popularity makes it a target for
                  rental scams. Never send money before seeing an apartment
                  in person, and verify that the person showing you the
                  unit is authorized by the building. Read our{" "}
                  <Link
                    href="/blog/nyc-apartment-scams"
                    className="text-primary underline underline-offset-2"
                  >
                    apartment scams guide
                  </Link>{" "}
                  to protect yourself.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    5. Know your rights under the FARE Act.
                  </span>{" "}
                  As of 2025, NYC&apos;s FARE Act shifted broker fees from
                  tenants to landlords in most cases. This can save you
                  $3,000 to $6,000 on an East Village apartment. Learn more
                  in our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>
                  .
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    6. Ask about rent stabilization status on pre-war
                    buildings.
                  </span>{" "}
                  The East Village has Manhattan&apos;s highest share of
                  rent-stabilized units, but they are often not advertised
                  as such. Ask every landlord directly. A stabilized 1BR at
                  $3,500 locks in annual increases under 3.5% vs. 5-8%
                  typical market growth — a 5-year rent savings of $8,000
                  to $15,000.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    7. Tour 10-15 buildings in one day during the off-peak.
                  </span>{" "}
                  East Village walkups are clustered — you can efficiently
                  tour 10 to 15 in a Saturday. Do your blitz tour in
                  February or October (off-peak inventory) rather than
                  July/August peak when everyone else is also touring.
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    8. Use AI-powered search to find unlisted inventory.
                  </span>{" "}
                  Many smaller East Village landlords list directly through
                  property management portals rather than major listing
                  sites. Wade Me Home aggregates these listings and lets you
                  search by natural language — describe what you want and
                  our AI finds matching apartments.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── East Village vs Neighbors ───────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>East Village vs. Similar Neighborhoods</CardTitle>
              <CardDescription>
                How the East Village compares on price, transit, and vibe
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
                    <TableCell className="font-medium">East Village</TableCell>
                    <TableCell className="text-right">$3,750</TableCell>
                    <TableCell>L, 6, F/M, N/R/W</TableCell>
                    <TableCell>Dense downtown, tenement walkups</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">West Village</TableCell>
                    <TableCell className="text-right">$4,600</TableCell>
                    <TableCell>1, 2/3, A/C/E, F/M</TableCell>
                    <TableCell>Residential, more expensive, quieter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lower East Side</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell>F, J/M/Z</TableCell>
                    <TableCell>Similar vibe, slightly cheaper</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                    <TableCell>L, G, J/M/Z</TableCell>
                    <TableCell>Bigger units, Brooklyn trade-off</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bushwick</TableCell>
                    <TableCell className="text-right">$2,600</TableCell>
                    <TableCell>L, J/M/Z</TableCell>
                    <TableCell>Budget pick, longer commute</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. West Village
                </h3>
                <p>
                  The West Village is quieter, more residential, and
                  significantly more expensive (median one-bedroom: $4,200
                  to $5,000). The East Village offers a similar density of
                  restaurants and nightlife at roughly 15% to 25% lower
                  rents, with better L-train access to Brooklyn.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  vs. Lower East Side
                </h3>
                <p>
                  The LES (below Houston Street) has a similar gritty
                  energy and nightlife scene, with slightly lower rents —
                  roughly $200 to $400 less per month. The trade-off is
                  fewer subway options and a longer commute to Midtown. If
                  you work south of 34th Street, the LES is worth
                  considering.
                </p>
              </div>
              <Separator />
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
                  Williamsburg in Brooklyn offers a similar cultural scene
                  with more space for the price. One-bedrooms average
                  $3,000 to $3,800, and apartments tend to be larger. The L
                  train connects the two neighborhoods in about 10 minutes.
                  The main difference is that Williamsburg feels more spread
                  out and residential, while the East Village is dense and
                  walking-centric.
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
                  Bushwick is the budget alternative, with one-bedrooms
                  starting around $2,000 to $2,500. The arts and food
                  scene is growing fast, but the commute to Manhattan is 30
                  to 45 minutes. If price is your top priority and you
                  work remotely or in Brooklyn, Bushwick is hard to beat.
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
                  How much does a one-bedroom apartment cost in the East
                  Village?
                </h3>
                <p>
                  The median asking rent for a one-bedroom is approximately
                  $3,500 to $4,000 per month as of early 2026. Studios
                  start around $2,500 to $3,000, and two-bedrooms range
                  from $4,500 to $5,500. Prices vary significantly based on
                  block, building type, and amenities.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  What subway lines serve the East Village?
                </h3>
                <p>
                  The L train (First Avenue, Third Avenue), 6 train (Astor
                  Place), F and M trains (Second Avenue at Houston), and N,
                  R, W trains (8th Street-NYU). Most of Manhattan and
                  Brooklyn is reachable within 20 to 30 minutes.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Is the East Village safe?
                </h3>
                <p>
                  The East Village is generally considered safe by NYC
                  standards. The area around Tompkins Square Park and the
                  commercial corridors are well-trafficked at all hours. As
                  with any dense urban neighborhood, standard precautions
                  apply — be aware of your surroundings, especially late at
                  night on quieter blocks east of Avenue B.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there rent-stabilized apartments in the East Village?
                </h3>
                <p>
                  Yes. Many of the pre-war walkups in the East Village
                  contain rent-stabilized units, especially in buildings
                  with six or more units built before 1974. These units
                  offer regulated rent increases and stronger tenant
                  protections. See our{" "}
                  <Link
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    rent stabilization guide
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  When is the best time to look for apartments in the East
                  Village?
                </h3>
                <p>
                  Winter months (November through February) offer the best
                  deals, with landlords more willing to offer free months
                  and other concessions. Avoid the May-through-September
                  peak season when competition is highest. See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent guide
                  </Link>
                  .
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  Are there no-fee apartments in the East Village?
                </h3>
                <p>
                  Yes, though they are less common than in waterfront
                  Brooklyn or LIC. After the 2025 FARE Act, most new
                  listings no longer require tenants to pay broker fees
                  (the landlord pays instead when they hire the broker).
                  Verify upfront costs before you apply. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act explainer
                  </Link>{" "}
                  for specifics.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find Your East Village Apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our AI what you&apos;re looking for — a rent-stabilized
                1BR off Tompkins Square, an Alphabet City walkup under
                $3,000, a 2BR share near the L — and it will search
                hundreds of East Village listings in seconds.
              </p>
              <Button asChild size="lg">
                <Link href="/">Start Searching</Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Related Guides ────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>Related NYC Renting Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/nyc/east-village/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    East Village Rent Prices: Studio, 1BR, 2BR &amp; 3BR
                    Breakdown
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
                    href="/nyc-apartment-search-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Apartment Search Guide
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
                    href="/blog/nyc-apartment-scams"
                    className="text-primary underline underline-offset-2"
                  >
                    How to Spot NYC Apartment Scams
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
                <li>
                  <Link
                    href="/blog/broker-fees-and-upfront-costs"
                    className="text-primary underline underline-offset-2"
                  >
                    Understanding Broker Fees &amp; Upfront Costs
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
                    href="/nyc/astoria"
                    className="text-primary underline underline-offset-2"
                  >
                    Astoria Apartments: Rent Prices, Transit &amp;
                    Neighborhood Guide
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
                    href="/nyc/upper-west-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Apartments: Rent Prices, Transit &amp; Guide
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
