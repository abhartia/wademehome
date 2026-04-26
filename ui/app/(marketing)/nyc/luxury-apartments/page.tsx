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
    "Luxury Apartments NYC (2026): Tribeca, SoHo, Hudson Yards, West Village, Billionaires' Row Rent Guide | Wade Me Home",
  description:
    "2026 guide to luxury rentals in NYC. Median rent and concession trends in Tribeca, SoHo, West Village, Hudson Yards, Billionaires' Row, Brooklyn Heights and DUMBO — building tier breakdowns, the $5K / $10K / $20K / $50K+ tiers, doorman/amenity standards, and why luxury demand is up 76% YoY.",
  keywords: [
    "luxury apartments nyc",
    "luxury apartments new york",
    "luxury apartments new york city",
    "luxury apartment rentals nyc",
    "luxury rentals manhattan",
    "luxury apartments manhattan",
    "luxury apartments brooklyn",
    "high end apartments nyc",
    "high end rentals nyc",
    "tribeca luxury apartments",
    "soho luxury apartments",
    "west village luxury apartments",
    "hudson yards luxury apartments",
    "billionaires row apartments",
    "central park south apartments",
    "57th street apartments",
    "central park west apartments",
    "fifth avenue rentals",
    "park avenue rentals",
    "brooklyn heights luxury",
    "dumbo luxury apartments",
    "luxury full service building nyc",
    "doorman apartments nyc",
    "supertall apartments nyc",
  ],
  openGraph: {
    title:
      "Luxury Apartments NYC (2026): Tribeca, SoHo, Hudson Yards & Billionaires' Row Rent Guide",
    description:
      "Where luxury renters actually shop in 2026 — by neighborhood, building tier, and price band ($5K to $50K+/month).",
    url: `${baseUrl}/nyc/luxury-apartments`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/luxury-apartments` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Luxury Apartments NYC (2026): Tribeca, SoHo, Hudson Yards & Billionaires' Row Rent Guide",
    description:
      "A 2026 guide to NYC luxury rentals — building tier, neighborhood, and price band — with the supertall and trophy-building landscape mapped end-to-end.",
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
    mainEntityOfPage: `${baseUrl}/nyc/luxury-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What counts as a luxury apartment in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In 2026 NYC the working definition of 'luxury' starts at roughly $6,000–$7,000 for a 1-bedroom in a full-service doorman building (24-hour concierge, gym, package room, lounge, often pool/spa) — putting it in roughly the top 10% of asking rents. The 'high-end luxury' tier — Tribeca, SoHo, West Village, Hudson Yards trophy buildings, Brooklyn Heights waterfront — starts at $9,000–$11,000 for a 1BR. The 'trophy luxury' tier (Central Park South, Billionaires' Row, 432 Park, One57, Steinway, 220 CPS) clears $20,000 for a 1BR and routinely lists 3-bedroom units at $50,000–$150,000/month.",
        },
      },
      {
        "@type": "Question",
        name: "Where are NYC's most luxurious apartment neighborhoods in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By 2026 median 1-bedroom asking rent in luxury full-service stock: Billionaires' Row / Central Park South ($22,000+), Tribeca ($11,500), West Village ($10,800), SoHo ($10,200), Hudson Yards ($9,800), Brooklyn Heights ($9,400), DUMBO ($8,900), Upper East Side (Park/Fifth corridor) ($8,500), and Battery Park City ($8,200). The defining attributes that put a building in the luxury tier: full-time doorman/concierge, full amenity package (gym, lounge, package room, often pool/spa/screening room), high-end finishes, oversized layouts (650+ sq ft for a 1BR), and recent or recent-feeling new construction or trophy pre-war.",
        },
      },
      {
        "@type": "Question",
        name: "What is Billionaires' Row?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Billionaires' Row is the corridor along West 57th Street between Sixth and Eighth Avenues, plus the Central Park South frontage from Fifth to Eighth. It is anchored by the post-2010 supertalls — One57 (157 W 57th, Christian de Portzamparc, 2014), 432 Park Avenue (Rafael Vinoly, 2015, 1,396 ft), 220 Central Park South (Robert A.M. Stern, 2018), 111 West 57th (SHoP, 2022, 1,428 ft, the world's most slender tower), and Central Park Tower (AS+GG, 2020, 1,550 ft, the tallest residential building in the world). Available rentals here are rare; when they list, 1-bedrooms run $25,000–$45,000/month and 3-bedrooms can clear $100,000–$250,000.",
        },
      },
      {
        "@type": "Question",
        name: "How do Hudson Yards luxury rentals compare to Tribeca?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hudson Yards is a 2018-and-later master-planned development with 5+ luxury towers (15 Hudson Yards, 35 Hudson Yards, One Manhattan West, the Eugene, 555TEN, Lantern House) — uniformly newer, higher floors with river views, full amenity packages, and integrated retail (the Shops at HY, Edge observation deck). Tribeca is the inverse: low-rise (mostly 6–12 story) loft conversions of pre-war warehouse buildings (1875–1925) with 12+ ft ceilings, 14+ ft windows, and exposed cast-iron columns. Hudson Yards is for renters who want polish, view, and amenity density. Tribeca is for renters who want scale, history, and the Greenwich/Hudson/Reade/Franklin/Walker Street intimate-grid feel. Per-square-foot, Tribeca is typically 5–15% more expensive at the trophy tier.",
        },
      },
      {
        "@type": "Question",
        name: "Are luxury NYC apartments getting more expensive in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, sharply. Google Trends shows search demand for 'luxury apartments NYC' is up 76% year-over-year as of April 2026 — the largest YoY jump of any NYC rental segment we track. Median asking rent in the luxury tier (top 10% of inventory) is up 9–12% over the last 12 months, with the steepest movement in Tribeca and Hudson Yards. The drivers: concession reductions across the trophy stock as 2024–2025 lease-up incentives burned off, return-to-office accelerating Manhattan-core demand, and finance/AI hiring concentrating in Hudson Yards and Tribeca. Net-effective rent (advertised rent minus concession value) is up roughly 14% in the luxury tier — meaningfully outpacing the citywide 4–6%.",
        },
      },
      {
        "@type": "Question",
        name: "Should I expect concessions on luxury NYC rentals in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Concessions are still common on new-construction lease-up and on shoulder-season (Nov–Feb) listings, but they have shrunk meaningfully from the 2023 peak. Typical 2026 concessions: 1 month free on a 13-month lease at Hudson Yards (15 Hudson Yards, 35 Hudson Yards, One Manhattan West) when a unit lingers more than 30 days; 2 weeks free at Tribeca trophy buildings; rarely anything at Billionaires' Row trophy stock (where the seller doesn't need to clear inventory at any cost). Always do the net-effective math — a $9,000 1BR with 1 month free on a 13-month lease has a net-effective rent of $8,308. Use our net-effective rent calculator linked below.",
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
        name: "Luxury Apartments",
        item: `${baseUrl}/nyc/luxury-apartments`,
      },
    ],
  },
];

export default function LuxuryApartmentsPage() {
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
              <Badge variant="secondary">Manhattan + Brooklyn waterfront</Badge>
              <Badge variant="outline">Tribeca · SoHo · Hudson Yards · CPS</Badge>
              <Badge className="bg-emerald-600">+76% YoY search demand</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Luxury Apartments NYC (2026): Tribeca, SoHo, Hudson Yards &amp;
              Billionaires&apos; Row Rent Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Where luxury renters actually shop in 2026 — full-service
              buildings, trophy supertalls, loft-conversion landmarks, and the
              waterfront new-construction towers — with median rent, concession
              status, and the building-tier vocabulary you need to compare a
              Hudson Yards 1BR against a Tribeca loft against a Billionaires&apos;
              Row trophy unit. Search demand for &ldquo;luxury apartments NYC&rdquo;
              is up <strong>76% year-over-year</strong> — the steepest YoY climb
              of any NYC rental segment we track.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 26, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Luxury NYC"
            latitude={40.7484}
            longitude={-73.9967}
            radiusMiles={3}
            limit={9}
            minRent={6000}
            searchQuery="Luxury NYC apartments $6,000+"
          />

          <Card>
            <CardHeader>
              <CardTitle>NYC Luxury Tier Map (2026)</CardTitle>
              <CardDescription>
                Median 1-bedroom rent in full-service luxury stock by
                neighborhood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead>1BR Median (luxury stock)</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Defining Building Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Billionaires&apos; Row / CPS
                    </TableCell>
                    <TableCell>$22,000+</TableCell>
                    <TableCell>Trophy</TableCell>
                    <TableCell>Supertall (One57, 432 Park, 220 CPS)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca</TableCell>
                    <TableCell>$11,500</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Pre-war loft conversion</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">West Village</TableCell>
                    <TableCell>$10,800</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Townhouse + boutique elevator</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SoHo</TableCell>
                    <TableCell>$10,200</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Cast-iron loft conversion</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hudson Yards</TableCell>
                    <TableCell>$9,800</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Post-2018 supertall new-con</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Brooklyn Heights
                    </TableCell>
                    <TableCell>$9,400</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>
                      Pre-war doorman + waterfront new-con (Pierhouse)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">DUMBO</TableCell>
                    <TableCell>$8,900</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>
                      Pre-war factory conversion + waterfront new-con
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      UES Park / Fifth
                    </TableCell>
                    <TableCell>$8,500</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Pre-war white-glove doorman</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Battery Park City
                    </TableCell>
                    <TableCell>$8,200</TableCell>
                    <TableCell>High-end</TableCell>
                    <TableCell>Post-1985 high-rise (Hudson views)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      UWS / Lincoln Square
                    </TableCell>
                    <TableCell>$7,800</TableCell>
                    <TableCell>Luxury</TableCell>
                    <TableCell>
                      Pre-war Central Park West + post-2000 Lincoln Sq towers
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Chelsea</TableCell>
                    <TableCell>$7,400</TableCell>
                    <TableCell>Luxury</TableCell>
                    <TableCell>High Line corridor new-con</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Williamsburg waterfront</TableCell>
                    <TableCell>$6,800</TableCell>
                    <TableCell>Luxury</TableCell>
                    <TableCell>Domino + Northside new-con</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                &ldquo;Luxury stock&rdquo; here means a full-service doorman
                building with at minimum 24-hour concierge, gym, and package
                room. The luxury tier is roughly the top 10% of asking rents
                in each neighborhood; trophy tier is roughly the top 1%.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luxury Price Bands</CardTitle>
              <CardDescription>
                The $5K / $10K / $20K / $50K+ split — what each tier actually
                buys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>1BR Tier</TableHead>
                    <TableHead>Building Standard</TableHead>
                    <TableHead>Typical Layout</TableHead>
                    <TableHead>Where</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">$5K – $7K</TableCell>
                    <TableCell>
                      Doorman, gym, package room
                    </TableCell>
                    <TableCell>550–700 sq ft, 1 bath</TableCell>
                    <TableCell>
                      UWS, UES, Chelsea, Williamsburg waterfront
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$7K – $10K</TableCell>
                    <TableCell>
                      Concierge, full amenity (pool/spa typical)
                    </TableCell>
                    <TableCell>700–900 sq ft</TableCell>
                    <TableCell>
                      Hudson Yards, Battery Park City, Brooklyn Heights, DUMBO
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$10K – $15K</TableCell>
                    <TableCell>
                      White-glove staff, full amenity, building services
                    </TableCell>
                    <TableCell>800–1,200 sq ft, often 1.5 bath</TableCell>
                    <TableCell>Tribeca, SoHo, West Village</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$15K – $25K</TableCell>
                    <TableCell>
                      Trophy building, often pre-1930 or post-2018 supertall
                    </TableCell>
                    <TableCell>1,200–2,000 sq ft, 2 bath</TableCell>
                    <TableCell>
                      Tribeca penthouse, 220 CPS, Hudson Yards mid-floor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$25K – $50K</TableCell>
                    <TableCell>
                      Supertall trophy, full white-glove
                    </TableCell>
                    <TableCell>2,000+ sq ft, 2–3 bath</TableCell>
                    <TableCell>
                      One57 mid-tower, 432 Park, Central Park Tower
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">$50K+</TableCell>
                    <TableCell>
                      Penthouse / full-floor trophy
                    </TableCell>
                    <TableCell>3,000+ sq ft, 3+ bath</TableCell>
                    <TableCell>
                      Penthouses across the supertall belt and Tribeca
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                The clearest single price-tier signal is amenity density. Below
                $7K: doorman + gym. $7K–$10K: concierge + pool/spa typical.
                $10K+: building services (housekeeping, dry cleaning, package
                receipt). $15K+: trophy address.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>The Hudson Yards Tower Tier</CardTitle>
              <CardDescription>
                Six post-2018 supertall buildings — the largest single
                concentration of new-construction luxury rental stock in NYC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>1BR Mid-Floor Asking</TableHead>
                    <TableHead>Defining Feature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/35-hudson-yards"
                        className="text-primary underline underline-offset-2"
                      >
                        35 Hudson Yards
                      </Link>
                    </TableCell>
                    <TableCell>2019</TableCell>
                    <TableCell>$11,800</TableCell>
                    <TableCell>SOM, Equinox Hotel-managed amenities</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/15-hudson-yards"
                        className="text-primary underline underline-offset-2"
                      >
                        15 Hudson Yards
                      </Link>
                    </TableCell>
                    <TableCell>2018</TableCell>
                    <TableCell>$10,200</TableCell>
                    <TableCell>Diller Scofidio + Renfro, Vessel-adjacent</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/one-manhattan-west"
                        className="text-primary underline underline-offset-2"
                      >
                        One Manhattan West
                      </Link>
                    </TableCell>
                    <TableCell>2019</TableCell>
                    <TableCell>$9,500</TableCell>
                    <TableCell>SOM, Penn Station-adjacent</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/the-eugene"
                        className="text-primary underline underline-offset-2"
                      >
                        The Eugene
                      </Link>
                    </TableCell>
                    <TableCell>2017</TableCell>
                    <TableCell>$7,800</TableCell>
                    <TableCell>Brookfield, full amenity</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/lantern-house"
                        className="text-primary underline underline-offset-2"
                      >
                        Lantern House
                      </Link>
                    </TableCell>
                    <TableCell>2021</TableCell>
                    <TableCell>$8,400</TableCell>
                    <TableCell>Heatherwick Studio, High Line frontage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/555ten"
                        className="text-primary underline underline-offset-2"
                      >
                        555TEN
                      </Link>
                    </TableCell>
                    <TableCell>2016</TableCell>
                    <TableCell>$7,600</TableCell>
                    <TableCell>Extell, 56-story, indoor pool</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <Link
                        href="/buildings/the-henry"
                        className="text-primary underline underline-offset-2"
                      >
                        The Henry
                      </Link>
                    </TableCell>
                    <TableCell>2020</TableCell>
                    <TableCell>$7,400</TableCell>
                    <TableCell>Related, condo-quality finishes</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billionaires&apos; Row &amp; Trophy Stock</CardTitle>
              <CardDescription>
                The supertall corridor of West 57th Street + Central Park South
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The post-2010 supertall era reshaped Central Park&apos;s
                southern skyline with five trophy towers. Most stock is sold
                as condos; what does come up for rent is primarily owner
                sub-leases at trophy pricing.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>One57 (157 W 57th, 2014, 1,005 ft).</strong>{" "}
                  Christian de Portzamparc. Park Hyatt amenities. 1BR rents
                  $25K–$35K when listed; the famous penthouse sale was $100M.
                </li>
                <li>
                  <strong>432 Park Avenue (2015, 1,396 ft).</strong> Rafael
                  Vinoly. Full-floor units (4,000 sq ft) at $50K–$120K/month
                  when listed. Square 96-window grid is the building&apos;s
                  visual signature.
                </li>
                <li>
                  <strong>220 Central Park South (2018, 950 ft).</strong>{" "}
                  Robert A.M. Stern. The most prestigious post-2015 address —
                  rentals essentially never list publicly. Penthouse trades at
                  $200M+.
                </li>
                <li>
                  <strong>111 West 57th (2022, 1,428 ft).</strong> SHoP. The
                  world&apos;s most slender residential tower (24:1 ratio).
                  Rare full-floor rentals at $40K+.
                </li>
                <li>
                  <strong>Central Park Tower (2020, 1,550 ft).</strong>{" "}
                  Adrian Smith + Gordon Gill. The world&apos;s tallest
                  residential building. Mid-floor 3BR rentals start ~$50K when
                  listed.
                </li>
                <li>
                  <strong>15 Central Park West (2008, the predecessor).</strong>{" "}
                  Robert A.M. Stern&apos;s first Central Park trophy. Limestone
                  pre-supertall era; consistently the highest $/sq ft secondary
                  market in NYC.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tribeca Loft Conversions</CardTitle>
              <CardDescription>
                The opposite tier of the luxury market — pre-war scale, high
                ceilings, and the Greenwich/Hudson/Reade/Franklin/Walker grid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Tribeca is roughly 16 square blocks of pre-1925 cast-iron and
                masonry warehouse buildings, converted to residential in two
                waves: the loft-pioneer wave of 1975–1995 (raw conversions,
                often AIR — Artist In Residence — certified) and the polished
                wave of 1998–2015 (full luxury fit-out with new mechanicals,
                concierge, amenities). Defining attributes:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>11–14 ft ceilings.</strong> The pre-war
                  warehouse-floor stack. A 1BR with 12-ft ceilings reads
                  visually as 1.5x the footprint.
                </li>
                <li>
                  <strong>Oversized windows.</strong> Pre-war manufacturing
                  buildings needed daylight; the surviving buildings have
                  6-foot-tall steel-frame windows that contemporary new-con
                  cannot replicate.
                </li>
                <li>
                  <strong>Cast-iron columns and exposed brick.</strong> The
                  defining Tribeca aesthetic, preserved in most polished
                  conversions.
                </li>
                <li>
                  <strong>Trophy buildings.</strong> 56 Leonard (2017,
                  Herzog &amp; de Meuron, the &ldquo;Jenga building&rdquo;),
                  443 Greenwich (1995/2017 conversion, Goldman Sachs lobby),
                  108 Leonard (2018), the Sterling Mason (2015), and 70 Vestry
                  (2018). 1BRs at trophy buildings clear $14K–$20K.
                </li>
                <li>
                  <strong>Lower-tier loft buildings.</strong> Pre-1990
                  conversion stock at the western edge (Greenwich/Washington)
                  and northern edge (toward Canal) lists at $7K–$11K for a
                  1BR.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luxury-NYC Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Net-effective rent vs. gross rent matters most
                  in luxury.</strong> Trophy and high-end buildings still
                  offer concessions at lease-up — 1 month free on a 13-month
                  lease at Hudson Yards is common, occasional 2 months at the
                  weakest-leased buildings. A $9,000 gross 1BR with 1 month
                  free has a net-effective rent of $8,308.
                </li>
                <li>
                  <strong>Tour the unstaged unit, not the model.</strong> The
                  staged model unit at the lobby gallery is always the best
                  layout in the line. Ask to see your specific unit before
                  signing — light, view, and corner exposure vary widely
                  within a 50-story tower.
                </li>
                <li>
                  <strong>Building services are the luxury moat.</strong> Above
                  $10K, what you&apos;re paying for is staff: 24/7 doorman,
                  on-site super, concierge package handling, dry-cleaning
                  pickup, often in-unit housekeeping at additional cost.
                  Compare staffing levels building-to-building, not just
                  amenity lists.
                </li>
                <li>
                  <strong>Loft conversions vs. new construction is a real
                  taste choice.</strong> 12-ft pre-war ceilings and exposed
                  brick is one luxury aesthetic; 9-ft contemporary ceilings
                  with floor-to-ceiling glass and a Hudson view is a different
                  one. Tour both before deciding the tier — a Tribeca 1BR and
                  a Hudson Yards 1BR at the same price are completely
                  different products.
                </li>
                <li>
                  <strong>Pet policies are tighter than you&apos;d expect.</strong>{" "}
                  Many trophy pre-war buildings cap pets at 25 lb or restrict
                  breeds. New-con post-2015 buildings are generally
                  pet-friendly with weight caps at 50–75 lb. Verify before
                  signing — pet-related lease violations are the #1 reason
                  luxury landlords decline lease renewal.
                </li>
                <li>
                  <strong>Building financial health for sub-leases.</strong>{" "}
                  Many Billionaires&apos; Row units are owner sub-leases. Ask
                  about the building&apos;s reserve fund and any pending
                  assessments — a $50K/mo trophy lease can come with
                  surprise common-charge increases or special assessments
                  that, while paid by the landlord, can affect lease
                  negotiation room.
                </li>
                <li>
                  <strong>The FARE Act applies even at the top.</strong> If
                  the building or owner hired the broker, the tenant
                  doesn&apos;t pay a fee — even on a $25K/mo Tribeca unit.
                  The savings (a 12% fee on $300K annual rent is $36K) is
                  meaningful even at the trophy tier.
                </li>
                <li>
                  <strong>Income/financial documentation is heavy.</strong>{" "}
                  Most luxury landlords require 80–100x the monthly rent in
                  liquid assets, two years of tax returns, and bank
                  statements. Prepare the package before touring; the trophy
                  market clears quickly.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live luxury NYC apartments
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your target neighborhood, building tier
                (high-end full-service, trophy supertall, Tribeca loft) and
                budget — we&apos;ll surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Luxury+NYC+apartments">
                  Search Luxury NYC Apartments
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
                    href="/nyc/tribeca"
                    className="text-primary underline underline-offset-2"
                  >
                    Tribeca Guide (loft conversions + trophy buildings)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/soho"
                    className="text-primary underline underline-offset-2"
                  >
                    SoHo Guide (cast-iron lofts)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/west-village"
                    className="text-primary underline underline-offset-2"
                  >
                    West Village Guide (townhouses + brownstones)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/chelsea/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Rent Prices (Hudson Yards tier)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/upper-west-side/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Upper West Side Rent Prices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/lantern-house"
                    className="text-primary underline underline-offset-2"
                  >
                    Lantern House
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/35-hudson-yards"
                    className="text-primary underline underline-offset-2"
                  >
                    35 Hudson Yards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/one-manhattan-west"
                    className="text-primary underline underline-offset-2"
                  >
                    One Manhattan West
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/the-eugene"
                    className="text-primary underline underline-offset-2"
                  >
                    The Eugene
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/the-henry"
                    className="text-primary underline underline-offset-2"
                  >
                    The Henry
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buildings/555ten"
                    className="text-primary underline underline-offset-2"
                  >
                    555TEN
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
