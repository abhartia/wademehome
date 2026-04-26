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
    "Apartments for Rent in SoHo, NYC (2026): Cast-Iron Loft Rent Prices, R/W/6/B/D/F/M Subway & Building Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in SoHo, Manhattan. Cast-iron loft rent prices by unit size, R/W, 6, B/D/F/M, A/C/E, N/Q subway access, the Cast-Iron Historic District, sub-areas (West Broadway, Greene/Mercer, Spring/Prince, South SoHo), trophy buildings, and how SoHo compares to Tribeca and West Village.",
  keywords: [
    "soho apartments",
    "soho apartments for rent",
    "soho lofts",
    "soho loft rent",
    "soho rent prices 2026",
    "soho studio rent",
    "soho 1 bedroom rent",
    "soho 2 bedroom rent",
    "soho 3 bedroom rent",
    "soho cast iron",
    "soho historic district",
    "west broadway apartments",
    "greene street apartments",
    "mercer street apartments",
    "spring street apartments",
    "prince street apartments",
    "soho luxury rentals",
    "downtown manhattan luxury",
    "manhattan loft rentals",
    "apartments 10012",
    "apartments 10013",
    "soho lofts for rent",
    "moving to soho",
  ],
  openGraph: {
    title:
      "Apartments for Rent in SoHo, NYC (2026): Cast-Iron Lofts, Subway & Rent Guide",
    description:
      "2026 rent prices, subway access, sub-area breakdown, and apartment-hunting tips for SoHo — Manhattan's largest cast-iron historic district.",
    url: `${baseUrl}/nyc/soho`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/soho` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in SoHo, NYC (2026): Cast-Iron Loft Rent Prices, Subway & Building Guide",
    description:
      "A 2026 guide to renting in SoHo — cast-iron loft rent by unit size, subway access, the Historic District, sub-areas, and tips for apartment hunters.",
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
    mainEntityOfPage: `${baseUrl}/nyc/soho`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in SoHo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median asking rent in SoHo runs roughly $4,400 for a studio (rare), $10,200 for a 1-bedroom, $16,500 for a 2-bedroom, and $24,000 for a 3-bedroom. Per square foot, SoHo is $85–$130/sq ft annually — slightly below Tribeca on average but with a wider distribution: prime cast-iron lofts on Greene/Mercer/Spring rent at Tribeca-equivalent levels, while the eastern South SoHo blocks rent 15–20% lower.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve SoHo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SoHo is served by the R/W (Prince Street), the 6 (Spring Street, Bleecker Street), the B/D/F/M (Broadway-Lafayette Street), the A/C/E (Spring Street, Canal Street), the N/Q/R/W (Canal Street), and the 1 at Houston/Varick on the western edge. Eight subway lines accessible — among the most subway-dense neighborhoods in Manhattan.",
        },
      },
      {
        "@type": "Question",
        name: "What is the SoHo Cast-Iron Historic District?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Designated in 1973, the SoHo Cast-Iron Historic District is the largest concentration of cast-iron facade buildings in the world (about 250 surviving buildings on roughly 26 blocks). Built primarily 1860–1890 for textile and dry-goods warehousing, the buildings have ornate cast-iron facades, oversized windows, and 12–14 ft ceilings. The 1971 'AIR' (Artist in Residence) law allowed legal residential conversion of these manufacturing buildings; today the buildings are dominated by residential lofts (most converted between 1975 and 2010), high-end retail at street level, and a handful of remaining gallery/showroom spaces.",
        },
      },
      {
        "@type": "Question",
        name: "How does SoHo compare to Tribeca?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both are loft-conversion luxury districts with similar building stock and rent tiers, but they differ on three axes: (1) Density — SoHo has heavy retail and weekend tourism, while Tribeca is much quieter. (2) Building grain — SoHo has more uniform 6-story cast-iron blocks; Tribeca mixes pre-war loft with some 12+ story trophy new-con. (3) Rent per sq ft — Tribeca is 5–15% higher on average due to the lower density premium. For a renter who values walking out the door into restaurants, retail, and street life, SoHo. For a renter who values quiet, riverfront access, and access to the financial district, Tribeca.",
        },
      },
      {
        "@type": "Question",
        name: "What are SoHo's most desirable streets?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The premier SoHo blocks are Greene Street, Mercer Street, and the Spring Street/Prince Street axis — these have the highest concentration of intact cast-iron facades, the lowest tourist foot traffic, and the highest rent. West Broadway is the gallery/restaurant spine and rents at the same tier with more retail noise. The South SoHo blocks (Broome and below toward Canal) are 15–20% cheaper and noisier (Canal Street tourist traffic, fewer restored facades). Wooster Street is the wildcard — restored cobblestones, art galleries, premium pricing on the southern blocks.",
        },
      },
      {
        "@type": "Question",
        name: "Are SoHo apartments rent-stabilized?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A meaningful portion of SoHo's pre-1974 loft conversions in 6+ unit buildings are rent-stabilized. Because most of the original conversions happened in the late 1970s and 1980s under the AIR provisions, the legal regulated rent on those units can be substantially below market — sometimes 30–50% below. These units rarely come up but they exist; ask for the unit's DHCR rent registration before signing. Newer conversions (post-1995) and most condo-style new construction in SoHo are typically free-market.",
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
        name: "SoHo",
        item: `${baseUrl}/nyc/soho`,
      },
    ],
  },
];

export default function SoHoPage() {
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
              <Badge variant="outline">R/W · 6 · B/D/F/M · A/C/E · N/Q</Badge>
              <Badge className="bg-emerald-600">Cast-Iron Historic District</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in SoHo, NYC (2026): Cast-Iron Loft Rent
              Prices, Subway &amp; Building Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              SoHo is the world&apos;s largest cast-iron facade district —
              about 250 surviving buildings on 26 blocks, originally built
              1860–1890 for textile warehousing and converted to residential
              lofts under the 1971 AIR (Artist In Residence) law. The
              neighborhood mixes prime cast-iron loft conversions ($110–$130/
              sq ft) with high-end retail at street level and a handful of
              remaining gallery spaces. Eight subway lines and the densest
              ground-floor restaurant/retail mix in lower Manhattan.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 26, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="SoHo"
            latitude={40.7233}
            longitude={-74.0029}
            radiusMiles={0.4}
            limit={6}
            searchQuery="SoHo apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>SoHo Rent Prices by Unit Size (2026)</CardTitle>
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
                    <TableCell>$4,400</TableCell>
                    <TableCell>$3,500 – $6,000</TableCell>
                    <TableCell>$92</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$10,200</TableCell>
                    <TableCell>$6,500 – $18,000</TableCell>
                    <TableCell>$105</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$16,500</TableCell>
                    <TableCell>$11,000 – $28,000</TableCell>
                    <TableCell>$115</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$24,000</TableCell>
                    <TableCell>$17,000 – $60,000</TableCell>
                    <TableCell>$125</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Loft / 4BR+</TableCell>
                    <TableCell>$38,000</TableCell>
                    <TableCell>$28,000 – $150,000</TableCell>
                    <TableCell>$135+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Studios are scarce — the cast-iron loft footprint biases
                toward 1,000+ sq ft layouts. Greene/Mercer/Spring blocks
                price 10–20% above the median; South SoHo (Broome and below)
                prices 15–20% below.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SoHo Sub-Areas</CardTitle>
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
                      Greene/Mercer Core
                    </TableCell>
                    <TableCell>$12,000</TableCell>
                    <TableCell>Greene + Mercer, Houston to Spring</TableCell>
                    <TableCell>Most intact cast-iron, lowest tourism</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Spring/Prince Spine
                    </TableCell>
                    <TableCell>$11,000</TableCell>
                    <TableCell>Spring &amp; Prince, West B&apos;way to Lafayette</TableCell>
                    <TableCell>Restaurant/retail core, weekend tourism</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">West Broadway</TableCell>
                    <TableCell>$11,500</TableCell>
                    <TableCell>West Broadway, Houston to Canal</TableCell>
                    <TableCell>Gallery spine, premium new-con + lofts</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">South SoHo</TableCell>
                    <TableCell>$8,500</TableCell>
                    <TableCell>Broome to Canal, Crosby to West Broadway</TableCell>
                    <TableCell>Less restored, Canal Street tourism noise</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">East SoHo</TableCell>
                    <TableCell>$9,500</TableCell>
                    <TableCell>Crosby/Lafayette, Houston to Broome</TableCell>
                    <TableCell>Mix of loft + new-con, Lafayette retail</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SoHo Cast-Iron Loft Stock</CardTitle>
              <CardDescription>
                What renting a cast-iron loft actually means
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Defining attributes of the SoHo loft stock (which is roughly
                85% of residential SoHo inventory):
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>12–14 ft ceilings.</strong> The original
                  manufacturing-floor stack. A 1BR loft visually reads as
                  1.5–2× the footprint.
                </li>
                <li>
                  <strong>Oversized windows.</strong> Original 6-foot-tall
                  steel-frame industrial windows; restored conversions retain
                  these rather than replacing with smaller residential units.
                </li>
                <li>
                  <strong>Cast-iron columns.</strong> Visible cast-iron
                  structural columns at roughly 12-foot spacing through the
                  unit — preserved as the defining loft aesthetic.
                </li>
                <li>
                  <strong>Open floor plates.</strong> Most lofts have minimal
                  interior walls beyond the bedroom enclosure and bathroom.
                  Kitchen-living is uniformly open.
                </li>
                <li>
                  <strong>Limited storage and pre-war quirks.</strong> The
                  original buildings had no closets — most conversions add
                  closet build-outs but storage is meaningfully tighter than
                  a contemporary apartment of the same square footage.
                </li>
                <li>
                  <strong>Walk-up vs elevator split.</strong> Many SoHo lofts
                  in 4–6 story buildings are walk-up. Elevator buildings
                  command a 12–18% rent premium for the same square footage.
                </li>
                <li>
                  <strong>Doorman is rare.</strong> SoHo is a low-density
                  loft district, not a Class A doorman tower district. Most
                  buildings are self-managed or have a part-time super; a
                  doorman cuts the available inventory by ~80%.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SoHo Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Greene/Mercer is the price floor for intact
                  cast-iron.</strong> If the marketing emphasizes
                  &ldquo;original cast-iron facade&rdquo; and the rent is
                  meaningfully below $11K for a 1BR, verify the address.
                  Many South SoHo buildings retain partial cast-iron but in
                  worse condition.
                </li>
                <li>
                  <strong>The pioneer wave is rent-stabilized.</strong>{" "}
                  1975–1995 AIR conversions in 6+ unit buildings are mostly
                  rent-stabilized; the legal regulated rent can be 30–50%
                  below market for the same building. Ask for DHCR rent
                  registration before signing.
                </li>
                <li>
                  <strong>Walk-up discount is real.</strong> A 5th-floor
                  walk-up loft prices 15–25% below a 2nd-floor unit in the
                  same building. If you can climb stairs, the upper floors
                  are typically the value play.
                </li>
                <li>
                  <strong>Weekend foot traffic is a real downside.</strong>{" "}
                  Spring/Prince/West Broadway gets heavy tourist traffic
                  Saturday and Sunday. Greene and Mercer are quieter (less
                  retail). South SoHo is hit by Canal Street traffic.
                  Weekend-tour any apartment near retail axes before
                  signing.
                </li>
                <li>
                  <strong>Building services skew lighter than uptown
                  luxury.</strong> Above $10K rent, you&apos;re paying for
                  the loft and the address, not for staff. SoHo has very few
                  full-service buildings — if doorman/concierge is required,
                  expect to pay 20–30% more or look at SoHo-adjacent
                  Tribeca.
                </li>
                <li>
                  <strong>Per-sq-ft is the comparison metric.</strong> A
                  $9K SoHo 1BR at 950 sq ft ($114/sq ft/yr) is meaningfully
                  cheaper per square foot than a $9K Hudson Yards 1BR at 700
                  sq ft ($154/sq ft/yr). Always normalize.
                </li>
                <li>
                  <strong>Loft conversion permits matter.</strong> Some
                  buildings still sit on the original AIR permit which
                  technically restricts non-artist residents. In practice
                  this is rarely enforced for free-market tenants but is
                  worth confirming in writing with the landlord — landlords
                  on the original AIR cert can sometimes have stricter
                  eligibility paperwork.
                </li>
                <li>
                  <strong>FARE Act applies — even at $20K trophy
                  units.</strong> Landlord-hired broker = no tenant fee. On a
                  $15K SoHo loft, avoiding a 12% fee saves $21,600. See our{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act guide
                  </Link>
                  .
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live SoHo apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, sub-area (Greene/Mercer,
                West Broadway, South SoHo), and budget — we&apos;ll surface
                matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=SoHo+apartments">
                  Search SoHo Apartments
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
                    href="/nyc/west-village"
                    className="text-primary underline underline-offset-2"
                  >
                    West Village Guide
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
                    href="/nyc/lower-east-side"
                    className="text-primary underline underline-offset-2"
                  >
                    Lower East Side Guide
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
                    href="/blog/nyc-rent-stabilization-guide"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Rent Stabilization Guide
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
