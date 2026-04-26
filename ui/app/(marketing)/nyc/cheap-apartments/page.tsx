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
    "Cheap Apartments NYC (2026): Where to Find Rent Under $1,500, $2,000 & $2,500 | Wade Me Home",
  description:
    "Real 2026 guide to finding cheap apartments in NYC. Where studios still rent under $1,500, where 1-bedrooms rent under $2,000, the cheapest neighborhoods by subway line, the truth about 'NYC apartments under $1,000', plus how rent stabilization, NYCHA, room shares and the FARE Act fit in.",
  keywords: [
    "cheap apartments nyc",
    "cheap apartments nyc under $1,000",
    "cheap apartments nyc under $1500",
    "cheap apartments nyc under $2000",
    "cheap apartments nyc under $2500",
    "cheap apartments in nyc",
    "cheap apartments new york",
    "cheap apartments new york city",
    "affordable apartments nyc",
    "cheap nyc apartments for rent",
    "cheap studios nyc",
    "cheap 1 bedroom nyc",
    "cheap apartments brooklyn",
    "cheap apartments queens",
    "cheap apartments bronx",
    "cheap apartments manhattan",
    "cheap apartments uptown manhattan",
    "cheap apartments inwood",
    "cheap apartments washington heights",
    "cheap apartments bay ridge",
    "cheap apartments crown heights",
    "cheap apartments ridgewood",
    "rent stabilized cheap nyc",
  ],
  openGraph: {
    title:
      "Cheap Apartments NYC (2026): Real Sub-$2,000 Listings by Neighborhood",
    description:
      "Where you can actually rent a NYC apartment under $1,500, $2,000, or $2,500 in 2026 — by neighborhood, subway line, building type and unit size.",
    url: `${baseUrl}/nyc/cheap-apartments`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/cheap-apartments` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Cheap Apartments NYC (2026): Where to Find Rent Under $1,500, $2,000 & $2,500",
    description:
      "A 2026 guide to the actually-cheap NYC neighborhoods, including the truth about 'apartments under $1,000', the role of rent stabilization and NYCHA, and where on the subway map cheap stock still exists.",
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
    mainEntityOfPage: `${baseUrl}/nyc/cheap-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are there really apartments in NYC under $1,000?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stand-alone studio or 1-bedroom apartments under $1,000 in 2026 are essentially limited to three categories: long-held rent-stabilized leases (legal regulated rents that have been below market for decades — these almost never go on the open market and when they do they go through tenant networks, not StreetEasy), NYCHA public housing (income-tested, 8–14 year waitlists), and the rare deep-outer-borough single-room occupancy. For a renter searching today, the realistic 'cheap' floor in NYC is roughly $1,400–$1,700 for a small studio in Inwood, Washington Heights, deep Bronx (along the 2/4/5/6/D), or far-east Brooklyn (along the L, J, or 3). Anything advertised under $1,000 in a popular neighborhood is almost always either a room-share, a scam, or income-restricted housing.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest neighborhood in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By 2026 median 1-bedroom asking rent, the cheapest subway-accessible NYC neighborhoods are: Norwood/Bedford Park (Bronx, D/4) at $1,650, Wakefield (Bronx, 2) at $1,700, East Tremont (Bronx, 2/5) at $1,700, Far Rockaway (Queens, A) at $1,650, Brownsville (Brooklyn, 3/L) at $1,750, East New York (Brooklyn, A/C/J) at $1,800, Inwood (Manhattan, A/1) at $1,900, and Washington Heights (Manhattan, A/1) at $1,950. These are real subway-accessible options — adding a 30-minute commute past the Bronx or Queens 'last stop' typically buys $400–$700/month in rent.",
        },
      },
      {
        "@type": "Question",
        name: "Where can I find a 1-bedroom under $2,000 in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In 2026 the realistic 1-bedroom-under-$2,000 zones are: Manhattan north of 168th Street (Inwood, Washington Heights), the Bronx along the 2/4/5/6/D north of 167th Street, Brooklyn along the 3 train past Crown Heights into Brownsville, the L past Halsey into Bushwick's far end, the A/C past Utica into Bed-Stuy/East New York, and Queens along the A south of Howard Beach (Far Rockaway). Add Crown Heights, Sunset Park, and Ridgewood for the upper end of that price band ($1,950–$2,100). Most of these neighborhoods have substantial rent-stabilized stock — a leasable rent-stabilized 1BR is typically 10–25% under the market 1BR in the same building.",
        },
      },
      {
        "@type": "Question",
        name: "Is rent stabilization a path to a cheaper NYC apartment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — but only on the 'cheaper than the market would dictate' axis, not the 'cheap' axis. Rent stabilization caps annual rent increases (3.0% for 1-year and 4.5% for 2-year leases under the 2025–2026 RGB order) and gives tenants near-automatic lease renewal rights. Most regulated stock was built before 1974 in 6+ unit buildings. Today the typical regulated 1-bedroom in Brooklyn or Queens leases at $2,200–$3,200 — meaningfully below the market for the same building, but not 'cheap' in absolute terms. The big benefit compounds over time: a stabilized renter who stays 5 years pays substantially less than a market-rate renter at the same address.",
        },
      },
      {
        "@type": "Question",
        name: "How do I avoid broker fees on a cheap NYC apartment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Since the FARE Act took effect on June 11, 2025, the party that hires the broker pays the fee — meaning if the landlord listed the apartment with a broker, the tenant should not pay a broker fee. This applies city-wide to all rentals. On a $1,800 1BR, avoiding a 12% (one-month) broker fee saves $1,800 upfront, or about $150/month over a year. Always confirm in writing before signing: 'Per the FARE Act, no tenant-paid broker fee applies to this listing.' If a broker insists on a fee, get the lease and the broker-tenant agreement in writing and review with the DCWP complaint process. Cheap rentals are disproportionately direct-from-landlord, so most cheap stock has always been no-fee.",
        },
      },
      {
        "@type": "Question",
        name: "Are cheap NYC apartments getting cheaper or more expensive in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Search demand for 'cheap apartments NYC' is up 37% year-over-year as of April 2026 (Google Trends), reflecting tightening affordability — not lower asking rents. Citywide median rent rose 4–6% over the past 12 months. The 'cheap' end of the market has held flatter than luxury (which is up double digits in Tribeca, Hudson Yards, and Brooklyn Heights) because it's anchored by rent-stabilized stock and outer-borough subway-distance limits. Practically: the floor of the rental market is $50–$100/month higher than a year ago in the cheapest zones, and the 'reach' rentals ($2,500–$3,000) have stayed roughly flat or moved up only slightly.",
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
        name: "Cheap Apartments",
        item: `${baseUrl}/nyc/cheap-apartments`,
      },
    ],
  },
];

export default function CheapApartmentsPage() {
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
              <Badge variant="secondary">All 5 Boroughs</Badge>
              <Badge variant="outline">2/3/4/5/6 · A/C · D · L · J/M/Z</Badge>
              <Badge className="bg-emerald-600">
                +37% YoY search demand · peak Apr 26, 2026
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Cheap Apartments NYC (2026): Where to Find Rent Under $1,500,
              $2,000 &amp; $2,500
            </h1>
            <p className="text-sm text-muted-foreground">
              Where the cheapest NYC apartments actually exist in 2026 —
              neighborhood by neighborhood, subway line by subway line, with
              the truth about &ldquo;apartments under $1,000,&rdquo; the role
              of rent-stabilized stock, and how the FARE Act changed what
              &ldquo;cheap&rdquo; means after broker fees come out of the math.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 26, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Cheap NYC"
            latitude={40.7831}
            longitude={-73.9712}
            radiusMiles={8}
            limit={9}
            maxRent={2000}
            searchQuery="Cheap NYC apartments under $2,000"
          />

          <Card>
            <CardHeader>
              <CardTitle>The Actually-Cheap NYC Tier (2026)</CardTitle>
              <CardDescription>
                Median 1-bedroom asking rent in the cheapest subway-accessible
                neighborhoods, ranked by absolute rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead>Borough</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Subway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Far Rockaway</TableCell>
                    <TableCell>Queens</TableCell>
                    <TableCell>$1,650</TableCell>
                    <TableCell>A (60+ min to Midtown)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Norwood / Bedford Park
                    </TableCell>
                    <TableCell>Bronx</TableCell>
                    <TableCell>$1,650</TableCell>
                    <TableCell>D, 4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Wakefield</TableCell>
                    <TableCell>Bronx</TableCell>
                    <TableCell>$1,700</TableCell>
                    <TableCell>2 (last stop)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">East Tremont</TableCell>
                    <TableCell>Bronx</TableCell>
                    <TableCell>$1,700</TableCell>
                    <TableCell>2, 5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Brownsville</TableCell>
                    <TableCell>Brooklyn</TableCell>
                    <TableCell>$1,750</TableCell>
                    <TableCell>3, L</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      East New York
                    </TableCell>
                    <TableCell>Brooklyn</TableCell>
                    <TableCell>$1,800</TableCell>
                    <TableCell>A/C, J, L</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inwood</TableCell>
                    <TableCell>Manhattan</TableCell>
                    <TableCell>$1,900</TableCell>
                    <TableCell>A, 1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Washington Heights
                    </TableCell>
                    <TableCell>Manhattan</TableCell>
                    <TableCell>$1,950</TableCell>
                    <TableCell>A, 1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Crown Heights (East)
                    </TableCell>
                    <TableCell>Brooklyn</TableCell>
                    <TableCell>$2,000</TableCell>
                    <TableCell>3, 4, A/C</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ridgewood</TableCell>
                    <TableCell>Queens</TableCell>
                    <TableCell>$2,050</TableCell>
                    <TableCell>L, M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sunset Park</TableCell>
                    <TableCell>Brooklyn</TableCell>
                    <TableCell>$2,100</TableCell>
                    <TableCell>D, N, R</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bay Ridge</TableCell>
                    <TableCell>Brooklyn</TableCell>
                    <TableCell>$2,200</TableCell>
                    <TableCell>R</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Studios in these neighborhoods typically run $250–$400 below
                the 1BR median. Rent-stabilized stock can lease 10–25% below
                the market median in the same building.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The &ldquo;Under $1,000&rdquo; Question</CardTitle>
              <CardDescription>
                The honest version, since this is the most-searched cheap-NYC
                query
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Stand-alone NYC apartments under $1,000/month in 2026 fall into
                three buckets, none of which are accessible through normal
                rental search:
              </p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Long-held rent-stabilized leases.</strong> A legal
                  regulated rent that&apos;s been below market for 30+ years
                  may sit at $700–$900. These almost never reach the open
                  market — when the tenant of record vacates, the landlord
                  often withdraws the unit, renovates it, and re-lists at the
                  legal regulated rent (which is still typically below market,
                  but in the $1,800–$2,400 range now, not under $1,000).
                </li>
                <li>
                  <strong>NYCHA public housing.</strong> Income-tested with
                  rent capped at 30% of household income. Waitlists are
                  effectively closed for most developments — last open list
                  cycles were 2007 (Section 8) and 2010 (NYCHA proper).
                  Rotating priority categories (homeless transition, domestic
                  violence) are the realistic path in.
                </li>
                <li>
                  <strong>SROs and faith/non-profit housing.</strong> Single
                  room occupancy and a handful of mission-based housing
                  programs (HRA, Common Ground, Project Renewal, Bowery
                  Residents&apos; Committee) provide rooms at $300–$700 with
                  shared bath and kitchen. Most require referral or income
                  qualification.
                </li>
              </ol>
              <p>
                <strong>Practical floor for a market-rate search today:</strong>{" "}
                roughly $1,400 for a small studio in Wakefield, Norwood, or
                Far Rockaway. Anything advertised on a public site under
                $1,000 in a recognizable neighborhood is almost always either
                a room-share, a misclassified listing, or a scam.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cheap NYC Rent by Subway Line</CardTitle>
              <CardDescription>
                The subway is the affordability axis — every line has a
                &ldquo;cheap stop&rdquo; if you go far enough out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line</TableHead>
                    <TableHead>Cheap End</TableHead>
                    <TableHead>1BR Median</TableHead>
                    <TableHead>Min to Midtown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">1</TableCell>
                    <TableCell>Inwood (Dyckman, 207 St, 215 St)</TableCell>
                    <TableCell>$1,950</TableCell>
                    <TableCell>40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2/5</TableCell>
                    <TableCell>Wakefield, East Tremont, Pelham</TableCell>
                    <TableCell>$1,700</TableCell>
                    <TableCell>50–60</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3</TableCell>
                    <TableCell>Brownsville, East NY (Junius)</TableCell>
                    <TableCell>$1,800</TableCell>
                    <TableCell>40–45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">4/D</TableCell>
                    <TableCell>Norwood, Bedford Park, Concourse</TableCell>
                    <TableCell>$1,750</TableCell>
                    <TableCell>35–45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">A</TableCell>
                    <TableCell>Far Rockaway, Howard Beach, Inwood</TableCell>
                    <TableCell>$1,650</TableCell>
                    <TableCell>45–70</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">A/C</TableCell>
                    <TableCell>East NY, Cypress Hills, Ozone Park</TableCell>
                    <TableCell>$1,850</TableCell>
                    <TableCell>40–50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">L</TableCell>
                    <TableCell>Halsey/Wilson (deep Bushwick)</TableCell>
                    <TableCell>$2,100</TableCell>
                    <TableCell>30–35</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">J/M/Z</TableCell>
                    <TableCell>Cypress Hills, Crescent St</TableCell>
                    <TableCell>$1,950</TableCell>
                    <TableCell>35–40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">M</TableCell>
                    <TableCell>Forest Hills border / Ridgewood</TableCell>
                    <TableCell>$2,050</TableCell>
                    <TableCell>30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">N/R/D</TableCell>
                    <TableCell>Sunset Park, Bay Ridge</TableCell>
                    <TableCell>$2,100</TableCell>
                    <TableCell>35–45</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Rule of thumb: every additional 10 minutes of commute past the
                30-minute ring buys roughly $150–$250/month in rent. The
                cheapest tier sits at the 45–60 minute ring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What &ldquo;Cheap&rdquo; Means After the FARE Act</CardTitle>
              <CardDescription>
                June 11, 2025 changed the cheap-NYC math more than any single
                policy in a decade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Before the FARE Act, a $1,800 &ldquo;no-fee&rdquo; advertised
                rental could quietly become $1,800 + 12% broker fee + first
                month&apos;s rent + last + security = $9,000+ to move in. The
                broker fee alone was effectively a 13th-month rent. After June
                11, 2025, the party that hires the broker pays the fee —
                meaning landlord-listed apartments cannot legally charge the
                tenant.
              </p>
              <p>
                <strong>For cheap rentals, the practical impact is large:</strong>{" "}
                small landlords in the Bronx, Queens, and outer Brooklyn —
                where most cheap stock sits — were already mostly direct-list
                or no-fee. The FARE Act made the legal default match what was
                already common practice. The clearest beneficiaries are
                renters in the $1,500–$2,500 band, where a 12% fee was a
                substantial fraction of monthly income.
              </p>
              <p>
                <strong>Watch for two patterns:</strong> (1) some landlords
                quietly raised asking rents 5–7% in late 2025 to recoup the
                broker fee they used to pass through; (2) some brokers market
                a &ldquo;tenant-side&rdquo; engagement letter to charge a fee
                anyway. If you didn&apos;t hire the broker, you don&apos;t owe
                a fee — see our{" "}
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  FARE Act guide
                </Link>{" "}
                for the full mechanics, or use the{" "}
                <Link
                  href="/tools/fare-act-broker-fee-checker"
                  className="text-primary underline underline-offset-2"
                >
                  FARE Act broker-fee checker
                </Link>{" "}
                to verify your situation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cheap-NYC Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Search by the last 4 stops, not the neighborhood.</strong>{" "}
                  &ldquo;Cheap Brooklyn&rdquo; rarely shows what you want.
                  Search the actual subway stops: Junius St, Sutter Av,
                  Saratoga Av, Pennsylvania Av (3 train), or Wilson Av,
                  Bushwick Av, Halsey St (L). The cheapest available stock
                  sits at the line&apos;s tail, not in the middle.
                </li>
                <li>
                  <strong>Walkup discount is real and large.</strong> A
                  4th-floor walkup studio is typically $200–$400/month cheaper
                  than the same 2nd-floor unit in the same building. Cheap
                  rental stock in NYC is overwhelmingly walkup — if you can
                  climb 4 flights, you have 30–40% more inventory.
                </li>
                <li>
                  <strong>Rent-stabilized regulated rents are a tier on
                  their own.</strong> Many pre-1974, 6+-unit buildings are
                  rent-stabilized. The legal regulated rent is filed with DHCR
                  and the landlord cannot legally exceed it. Ask for the rent
                  registration before signing — a regulated 1BR in deep
                  Brooklyn or the Bronx can lease at $1,800 when market is
                  $2,400.
                </li>
                <li>
                  <strong>NYCHA Section 8 is technically still open in
                  rotation.</strong> The Family Voucher waitlist closed in
                  2007 and re-opens in narrow windows; check{" "}
                  <span className="font-mono">on.nyc.gov/section-8</span>{" "}
                  monthly. The Senior and Mobility-impaired waitlists rotate
                  more often. NYCHA Public Housing accepts new applications
                  for Senior, Working Families, and General Family categories
                  on a rolling basis with priority points.
                </li>
                <li>
                  <strong>Roommate sharing is usually cheaper than the
                  cheapest 1BR.</strong> A bedroom in a 3BR Bushwick or East
                  Harlem share typically runs $1,000–$1,400 — below the median
                  studio in the same neighborhood. The L, J/M/Z, and 6 train
                  zones have the deepest share market.
                </li>
                <li>
                  <strong>Concessions hide cheap rent.</strong> A new-con
                  building advertising &ldquo;$3,000/mo, 2 months free on a
                  13-month lease&rdquo; has a net effective rent of $2,538 —
                  often cheaper than the older walkup at the same address.
                  Use our{" "}
                  <Link
                    href="/tools/net-effective-rent-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    net effective rent calculator
                  </Link>{" "}
                  to compare gross-vs-net before deciding.
                </li>
                <li>
                  <strong>The 30× / 40× income rule is enforced unevenly.</strong>{" "}
                  Most NYC landlords require 40× the monthly rent in annual
                  income (so $1,800/mo = $72,000/yr). Smaller landlords often
                  accept 30× ($54,000), or a guarantor at 80×. If you&apos;re
                  marginally short, ask before disqualifying yourself — and
                  see our{" "}
                  <Link
                    href="/tools/nyc-affordability-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC affordability calculator
                  </Link>{" "}
                  for what target rent fits your income.
                </li>
                <li>
                  <strong>Long commutes are negotiable. Long buildings
                  aren&apos;t.</strong> A 50-minute Wakefield commute is
                  arguably worth $700/month vs. a 25-minute Crown Heights
                  commute. A walkup with a tub in the kitchen is worth less.
                  Tour before you sign — listing photos understate building
                  age in the cheapest tier of the market.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Find your actual cheap NYC apartment
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your budget, the subway lines you can take,
                and your absolute commute ceiling — we&apos;ll surface live
                inventory in the cheapest viable subway-zone stops in the city.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Cheap+NYC+apartments+under+%242%2C000">
                  Search Cheap NYC Apartments
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
                    href="/nyc/bushwick"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick (cheap end of the L)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bushwick/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Bushwick Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/flatbush"
                    className="text-primary underline underline-offset-2"
                  >
                    Flatbush Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/bed-stuy"
                    className="text-primary underline underline-offset-2"
                  >
                    Bed-Stuy Guide
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
                <li>
                  <Link
                    href="/tools/nyc-affordability-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Affordability Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/net-effective-rent-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    Net Effective Rent Calculator
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
