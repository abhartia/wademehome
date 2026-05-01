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
    "Apartments for Rent in Forest Hills, Queens (2026): Rent Prices, E/F/M/R Express & Tudor Garden Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Forest Hills, Queens. E/F/M/R express trains 12 minutes to Midtown, Forest Hills Gardens Tudor historic district, Austin Street spine, art-deco doorman stock, and rent-stabilized pre-war buildings — central Queens' family-and-commuter luxury submarket.",
  keywords: [
    "forest hills apartments",
    "forest hills queens apartments",
    "forest hills apartments for rent",
    "apartments for rent forest hills queens",
    "forest hills rent",
    "forest hills rent 2026",
    "forest hills studio rent",
    "forest hills 1 bedroom rent",
    "forest hills 2 bedroom rent",
    "forest hills 3 bedroom rent",
    "11375 apartments",
    "forest hills gardens apartments",
    "austin street apartments",
    "forest hills queens vs astoria",
    "forest hills queens vs jackson heights",
    "forest hills tudor apartments",
    "forest hills doorman apartments",
    "forest hills no fee apartments",
    "forest hills rent stabilized",
    "queens boulevard apartments",
    "67th avenue apartments queens",
    "metropolitan avenue forest hills",
    "forest hills E train apartments",
    "forest hills F train apartments",
    "forest hills M train apartments",
    "forest hills R train apartments",
    "kew gardens border apartments",
    "forest hills family apartments",
    "forest hills LIRR apartments",
    "moving to forest hills queens",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Forest Hills, Queens (2026): Rent, E/F/M/R Express & Garden Guide",
    description:
      "2026 rent prices, E/F/M/R express access (12 min to Midtown), Forest Hills Gardens Tudor district, Austin Street retail, doorman pre-war stock, and rent-stabilized inventory in central Queens' commuter luxury submarket.",
    url: `${baseUrl}/nyc/forest-hills`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/forest-hills` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Forest Hills, Queens (2026): Rent Prices, E/F/M/R Express & Tudor Garden Guide",
    description:
      "A 2026 guide to renting in Forest Hills, Queens — covering rent prices by unit size, the Forest Hills Gardens Tudor historic district, Austin Street retail spine, art-deco doorman pre-war stock, rent-stabilized buildings, and E/F/M/R express subway access.",
    datePublished: "2026-04-28",
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
    mainEntityOfPage: `${baseUrl}/nyc/forest-hills`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Forest Hills, Queens in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Forest Hills 2026 medians are approximately $1,850 for a studio, $2,400 for a 1-bedroom, $3,300 for a 2-bedroom, and $4,500+ for a 3-bedroom. Pre-war doorman stock on Queens Boulevard runs the highest — 1-bedrooms $2,800–$3,200. Walk-up stock north of the Long Island Expressway runs the lowest — 1-bedrooms $2,000–$2,300. Forest Hills Gardens Tudor singles and duplexes (the historic district between Austin Street and the LIRR) start at $4,500 for a 2-bedroom and reach $9,000+ for a 4-bedroom Tudor townhouse.",
        },
      },
      {
        "@type": "Question",
        name: "How long is the commute from Forest Hills to Midtown?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "12 minutes to 53rd Street/Lexington on the E or F express from Forest Hills/71st Avenue. The E train continues to the WTC in another 22 minutes. The F train continues to Lower Manhattan via 14th–6th and Houston, reaching Delancey in 28 minutes total. The local M and R also stop here for cross-Manhattan and Brooklyn access. Forest Hills/Kew Gardens LIRR offers a 17-minute alternative to Penn Station for Manhattan-side commuters willing to pay the LIRR fare.",
        },
      },
      {
        "@type": "Question",
        name: "What is Forest Hills Gardens?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Forest Hills Gardens is a private, gated 142-acre Tudor-style residential community designed by Frederick Law Olmsted Jr. in 1909. Streets are privately owned (the Forest Hills Gardens Corporation maintains them), residents pay a separate maintenance fee, and architectural rules require Tudor-style exteriors. Homes are mostly Tudor singles, doubles, and townhouses. Rentals are uncommon and command 30–50% premium vs. the surrounding Forest Hills market — a 3-bedroom Tudor townhouse rental runs $7,500–$9,000.",
        },
      },
      {
        "@type": "Question",
        name: "Is Forest Hills cheaper than Astoria?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Forest Hills 1-bedroom median ($2,400) is comparable to or slightly below Astoria's ($2,500), but the unit type differs significantly. Forest Hills inventory skews larger and pre-war — more 2-bedrooms with formal dining rooms, more pre-war doorman stock, more rent-stabilized buildings. Astoria has more new-construction studios and 1-bedrooms in mid-rises. The express trains (E/F at Forest Hills) cut commute time below Astoria's N/W local — Forest Hills is 12 minutes to Midtown vs. Astoria's 18–22 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Are there rent-stabilized apartments in Forest Hills?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Forest Hills has substantial rent-stabilized stock — most pre-1974 buildings of 6+ units along Queens Boulevard, 67th Avenue, 108th Street, and 71st Avenue qualify. Common stabilized building types: art-deco 1920s–1930s elevator buildings, post-war brick walk-ups, and a small number of mid-1960s mid-rises. Stabilized 1-bedrooms can rent significantly below market — $1,800 vs. $2,400 market. Use our rent stabilization checker to test eligibility before signing.",
        },
      },
      {
        "@type": "Question",
        name: "Where is the cheapest part of Forest Hills?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "North of the Long Island Expressway (around 62nd Drive, Booth Street, and 102nd Street up to Yellowstone Boulevard) has the cheapest Forest Hills stock — studios from $1,500, 1-bedrooms from $2,000. The trade-off is a longer walk to the express stops at Forest Hills/71st Avenue (15+ minutes) or reliance on the local M/R at 67th Avenue. The Rego Park border is the value sweet spot for renters who want Forest Hills schools and retail at near-Rego Park prices.",
        },
      },
      {
        "@type": "Question",
        name: "How does Austin Street compare to Queens Boulevard for renting?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Austin Street (between Yellowstone Blvd and Continental Ave) is the retail spine — restaurants, boutiques, the Forest Hills Stadium concert venue, and walkable proximity to the Forest Hills/71st Avenue express station. Premium for Austin-Street-adjacent buildings is roughly $200–$300/mo on 1-bedrooms vs. equivalent units 4–6 blocks north. Queens Boulevard has the doorman stock, larger floorplates, and direct subway entrances at Forest Hills/71st and Continental Ave — Queens Boulevard buildings command the highest absolute rents but get more highway noise. Both are walkable to the same subway station.",
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
        name: "Forest Hills",
        item: `${baseUrl}/nyc/forest-hills`,
      },
    ],
  },
];

export default function ForestHillsPage() {
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
              <Badge variant="outline">Forest Hills</Badge>
              <Badge variant="secondary">Queens</Badge>
              <Badge className="bg-emerald-600">+76% YoY search demand</Badge>
              <Badge variant="outline">Express subway</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Forest Hills, Queens (2026): Rent Prices,
              E/F/M/R Express &amp; Tudor Garden Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Forest Hills is central Queens&apos; commuter-luxury submarket —
              12 minutes to Midtown on the E/F express, the private
              Tudor-styled Forest Hills Gardens historic district, the Austin
              Street retail spine, and one of the largest concentrations of
              pre-war doorman and rent-stabilized stock in Queens. This is the
              2026 rent guide.
            </p>
            <p className="text-xs text-muted-foreground">
              Reviewed 2026-04-28 by Wade Me Home Editorial. Methodology and
              sources documented in our{" "}
              <Link
                href="/nyc-rent-by-neighborhood"
                className="text-primary underline"
              >
                NYC neighborhood rent index
              </Link>
              .
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Forest Hills"
            latitude={40.7196}
            longitude={-73.8448}
            radiusMiles={1.0}
            limit={6}
            searchQuery="Forest Hills Queens apartments"
          />

          <Separator />

          <section className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Median 1BR rent</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">$2,400</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Express to Midtown</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">12 min</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trends YoY demand</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">+76%</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg unit size</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">775 sqft</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stabilized share</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">~38%</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Subway lines</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">E/F/M/R</CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Forest Hills Rent by Unit Size (2026)</CardTitle>
              <CardDescription>
                Median asking rent across the Forest Hills market — pre-war
                walk-up to art-deco doorman to Tudor townhouse — from inventory
                seen in early 2026.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit size</TableHead>
                    <TableHead className="text-right">Walk-up median</TableHead>
                    <TableHead className="text-right">Doorman median</TableHead>
                    <TableHead className="text-right">Tudor / townhouse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Studio</TableCell>
                    <TableCell className="text-right">$1,650</TableCell>
                    <TableCell className="text-right">$2,100</TableCell>
                    <TableCell className="text-right">n/a</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-bedroom</TableCell>
                    <TableCell className="text-right">$2,150</TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                    <TableCell className="text-right">$3,400</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2-bedroom</TableCell>
                    <TableCell className="text-right">$2,950</TableCell>
                    <TableCell className="text-right">$3,800</TableCell>
                    <TableCell className="text-right">$4,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-bedroom</TableCell>
                    <TableCell className="text-right">$3,900</TableCell>
                    <TableCell className="text-right">$5,200</TableCell>
                    <TableCell className="text-right">$7,500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4-bedroom Tudor</TableCell>
                    <TableCell className="text-right">n/a</TableCell>
                    <TableCell className="text-right">n/a</TableCell>
                    <TableCell className="text-right">$9,000+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs italic text-muted-foreground">
                Doorman medians reflect Queens Boulevard art-deco and post-war
                stock. Tudor / townhouse refers to Forest Hills Gardens
                inventory inside the private Tudor historic district.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forest Hills Sub-Areas (2026)</CardTitle>
              <CardDescription>
                Same neighborhood, very different submarkets — Tudor Gardens to
                Queens Boulevard doorman to north-of-LIE walk-up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-area</TableHead>
                    <TableHead>Character</TableHead>
                    <TableHead className="text-right">1BR median</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Forest Hills Gardens (private Tudor district)
                    </TableCell>
                    <TableCell>
                      Olmsted-designed 1909 historic district. Gated streets
                      (private corp), Tudor singles + townhouses, lowest
                      rental turnover in the area.
                    </TableCell>
                    <TableCell className="text-right">$3,400 (rare)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Austin Street spine
                    </TableCell>
                    <TableCell>
                      Retail and walkable amenity — restaurants, boutiques,
                      Forest Hills Stadium. 4–6 story art-deco and post-war
                      apartment buildings above retail. Highest dwell time.
                    </TableCell>
                    <TableCell className="text-right">$2,700</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Queens Boulevard (doorman tier)
                    </TableCell>
                    <TableCell>
                      Largest doorman buildings in Queens — 1930s art-deco,
                      1960s mid-rises, Continental Towers. Direct subway entry,
                      LIE noise.
                    </TableCell>
                    <TableCell className="text-right">$2,800</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      67th Avenue / 67th Drive corridor
                    </TableCell>
                    <TableCell>
                      Tree-lined pre-war walkups + mid-rise. Closest to
                      Continental Ave subway. Heavy rent-stabilized stock.
                    </TableCell>
                    <TableCell className="text-right">$2,300</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      North of the LIE (62nd Dr / Booth / 102nd)
                    </TableCell>
                    <TableCell>
                      Cheapest part of Forest Hills. Walk-up stock,
                      single-family border with Rego Park. 12–15 min walk to
                      the express trains.
                    </TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subway &amp; Commute Detail</CardTitle>
              <CardDescription>
                Forest Hills is one of only a handful of NYC neighborhoods with
                full express service to Midtown.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line</TableHead>
                    <TableHead>Stop</TableHead>
                    <TableHead>Express?</TableHead>
                    <TableHead className="text-right">To 53rd/Lex</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">E</TableCell>
                    <TableCell>Forest Hills / 71st Av</TableCell>
                    <TableCell>Yes (rush)</TableCell>
                    <TableCell className="text-right">12 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">F</TableCell>
                    <TableCell>Forest Hills / 71st Av</TableCell>
                    <TableCell>Yes (rush)</TableCell>
                    <TableCell className="text-right">12 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>Forest Hills / 71st Av (terminal)</TableCell>
                    <TableCell>No (local)</TableCell>
                    <TableCell className="text-right">22 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">R</TableCell>
                    <TableCell>Forest Hills / 71st Av (terminal)</TableCell>
                    <TableCell>No (local)</TableCell>
                    <TableCell className="text-right">28 min</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">LIRR</TableCell>
                    <TableCell>Forest Hills / Kew Gardens</TableCell>
                    <TableCell>n/a</TableCell>
                    <TableCell className="text-right">17 min to Penn</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Q23 / Q60</TableCell>
                    <TableCell>Bus connections to Rego Park / Jackson Heights</TableCell>
                    <TableCell>n/a</TableCell>
                    <TableCell className="text-right">Cross-Queens</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-3 text-xs italic text-muted-foreground">
                E and F run rush-hour express through the Queens trunk;
                weekends and off-peak run local. Travel times are average
                weekday morning peak.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forest Hills vs. Other Queens Neighborhoods</CardTitle>
              <CardDescription>
                If Forest Hills is on your shortlist, here&apos;s the apples-to-apples
                comparison with the other major Queens rental submarkets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead className="text-right">1BR median</TableHead>
                    <TableHead>Subway</TableHead>
                    <TableHead className="text-right">To Midtown</TableHead>
                    <TableHead>Stock type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Forest Hills
                    </TableCell>
                    <TableCell className="text-right">$2,400</TableCell>
                    <TableCell>E/F/M/R + LIRR</TableCell>
                    <TableCell className="text-right">12 min express</TableCell>
                    <TableCell>Pre-war doorman + Tudor</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Astoria</TableCell>
                    <TableCell className="text-right">$2,500</TableCell>
                    <TableCell>N/W</TableCell>
                    <TableCell className="text-right">18 min local</TableCell>
                    <TableCell>Mid-rise + walk-up</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">LIC</TableCell>
                    <TableCell className="text-right">$3,500</TableCell>
                    <TableCell>7/E/M/G/N/W</TableCell>
                    <TableCell className="text-right">8 min</TableCell>
                    <TableCell>New-construction tower</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sunnyside</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell className="text-right">12 min local</TableCell>
                    <TableCell>Pre-war walk-up</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rego Park</TableCell>
                    <TableCell className="text-right">$2,200</TableCell>
                    <TableCell>M/R</TableCell>
                    <TableCell className="text-right">22 min local</TableCell>
                    <TableCell>Mid-century mid-rise</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Kew Gardens</TableCell>
                    <TableCell className="text-right">$2,150</TableCell>
                    <TableCell>E/F</TableCell>
                    <TableCell className="text-right">17 min express</TableCell>
                    <TableCell>Tudor + co-op heavy</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forest Hills 2026 Hunting Tips</CardTitle>
              <CardDescription>
                Submarket-specific advice for renters running their search this
                spring/summer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Test for rent stabilization on every pre-war
                  walk-up.</strong> Forest Hills has one of the highest
                  rent-stabilized shares in Queens. Use our{" "}
                  <Link href="/tools/rent-stabilization-checker" className="text-primary underline">
                    rent stabilization checker
                  </Link>{" "}
                  before signing — a stabilized 1-bedroom can rent $1,800 vs.
                  $2,400 market.
                </li>
                <li>
                  <strong>Walk Austin Street twice.</strong> Once in the
                  morning (subway flow), once on a Saturday evening (concert
                  crowds at Forest Hills Stadium). The Stadium adds 8–12
                  events/year that affect Austin/Yellowstone block noise.
                </li>
                <li>
                  <strong>Confirm building&apos;s Queens Boulevard frontage vs.
                  side-street access.</strong> Queens Boulevard noise is
                  significant — buildings with the entrance on a side street
                  trade $100–$200/mo lower for materially better sleep
                  quality.
                </li>
                <li>
                  <strong>Verify Forest Hills Gardens private-corp fees.</strong>{" "}
                  If you rent inside the gated Tudor district, the landlord
                  collects a private-corp maintenance fee (~$200–$400/mo
                  depending on lot). Confirm whether it&apos;s bundled in the rent or
                  passed through separately.
                </li>
                <li>
                  <strong>Test subway distance honestly.</strong> Anywhere
                  more than 4 blocks north of Queens Boulevard means a
                  10–15-minute walk to the express stops in summer humidity or
                  winter snow. The Q23/Q60 buses help marginally.
                </li>
                <li>
                  <strong>Use the LIRR if your office is at Penn.</strong> If
                  you&apos;re going to Penn Station daily, the LIRR Forest Hills
                  station is 17 minutes — beats the subway for time but costs
                  $260+/mo on a CityTicket monthly. Worth it for $50K+ jobs at
                  Hudson Yards / Penn / Madison Square Garden.
                </li>
                <li>
                  <strong>Watch FARE Act compliance.</strong> Many Forest Hills
                  brokerages still default to charging tenants. Under the FARE
                  Act, if the broker is hired by the landlord, the tenant
                  cannot be charged. See{" "}
                  <Link href="/blog/nyc-fare-act-broker-fee-ban" className="text-primary underline">
                    our FARE Act guide
                  </Link>{" "}
                  for the rules.
                </li>
                <li>
                  <strong>Negotiate with art-deco landlords directly.</strong>{" "}
                  The 1930s buildings on Queens Boulevard and 67th Avenue often
                  list through small private brokerages. They are more flexible
                  on lease length and concessions than the Continental Towers /
                  Park Lane chain.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently asked: Forest Hills 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <div>
                <p className="font-semibold">Is Forest Hills a good neighborhood for families?</p>
                <p className="text-muted-foreground">
                  Yes — PS 196, PS 144, JHS 157, and Forest Hills HS all rank
                  in the top tier for Queens. Forest Hills Stadium hosts
                  concerts, but the surrounding residential streets are quiet.
                  Tudor singles in Forest Hills Gardens are popular with
                  families who want suburban-style detached housing inside the
                  city limits.
                </p>
              </div>
              <div>
                <p className="font-semibold">Is parking available?</p>
                <p className="text-muted-foreground">
                  Many doorman buildings on Queens Boulevard have garages
                  ($300–$450/mo). Street parking inside Forest Hills Gardens is
                  reserved for residents (private streets). Outside the
                  Gardens, alternate-side parking applies on most blocks.
                </p>
              </div>
              <div>
                <p className="font-semibold">How much should I budget for utilities?</p>
                <p className="text-muted-foreground">
                  Pre-war buildings often include heat and hot water. Tenant
                  pays electric (~$80–$150/mo summer for AC, $40–$80/mo
                  winter) and internet (~$60/mo). Newer buildings often
                  separate gas and submeter individual electric, adding
                  $120–$200/mo total.
                </p>
              </div>
              <div>
                <p className="font-semibold">When does inventory peak?</p>
                <p className="text-muted-foreground">
                  Forest Hills follows the citywide pattern — listings peak
                  June–August (summer move season). Off-season (December–February)
                  has the best concessions but thinnest selection.
                </p>
              </div>
              <div>
                <p className="font-semibold">Are there any active 421-a buildings in Forest Hills?</p>
                <p className="text-muted-foreground">
                  Limited. Most Forest Hills new-construction predates the
                  current 421-a era. The most recent stabilized-via-abatement
                  stock is in nearby Rego Park (the Crossings, the Aurora) and
                  LIC. If you find a 421-a building in Forest Hills, the unit
                  is stabilized for the duration of the abatement (typically
                  25–35 years from completion).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ── Embedded Rent Stabilization Checker ─────────────────── */}
          <RentStabilizationChecker />
          <p className="text-xs text-muted-foreground -mt-4 px-2">
            Forest Hills has ~38% rent-stabilized share — among the highest
            in Queens. Run a Queens Boulevard, 67th Avenue, 108th Street, or
            71st Avenue pre-1974 building through the checker before signing.
          </p>

          {/* ── Embedded RGB Renewal Calculator ─────────────────── */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If your Forest Hills lease is rent stabilized — and given the
              ~38% stabilized share, the odds are real — the 1-year vs.
              2-year renewal math is worth running. The 2025–2026 caps are
              3.0% (1-year) and 4.5% (2-year), with a ~2.91% crossover
              next-year RGB.
            </p>
            <RGBRenewalCalculator />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Related guides &amp; tools</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button asChild variant="outline" className="justify-between">
                <Link href="/tools/rent-stabilization-checker">
                  <span>Rent stabilization checker</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc/astoria">
                  <span>Astoria</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc/long-island-city">
                  <span>Long Island City</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/blog/nyc-rent-stabilization-guide">
                  <span>NYC rent stabilization guide</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/nyc-rent-by-neighborhood">
                  <span>NYC rent by neighborhood</span>
                  <span aria-hidden>→</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/blog/nyc-fare-act-broker-fee-ban">
                  <span>FARE Act broker fee ban</span>
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
