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
    "Apartments for Rent in Tribeca, NYC (2026): Loft Conversion Rent Prices, 1/A/C/E Subway & Trophy Building Guide | Wade Me Home",
  description:
    "Complete 2026 guide to renting in Tribeca, Manhattan. Loft conversion rent prices by unit size, 1/A/C/E/2/3/N/Q/R/W subway access, the Greenwich/Hudson/Reade/Franklin/Walker grid, trophy buildings (56 Leonard, 443 Greenwich, 108 Leonard, 70 Vestry), pre-war cast-iron context, and why Tribeca is one of the highest $/sq ft rental tiers in the city.",
  keywords: [
    "tribeca apartments",
    "tribeca apartments for rent",
    "tribeca lofts",
    "tribeca loft for rent",
    "tribeca rent",
    "tribeca rent prices 2026",
    "tribeca studio rent",
    "tribeca 1 bedroom rent",
    "tribeca 2 bedroom rent",
    "tribeca 3 bedroom rent",
    "tribeca penthouse",
    "56 leonard apartments",
    "443 greenwich apartments",
    "108 leonard apartments",
    "70 vestry apartments",
    "sterling mason apartments",
    "tribeca luxury rentals",
    "lower manhattan luxury",
    "nyc loft rentals",
    "apartments 10013",
    "apartments 10007",
    "1 train tribeca",
    "moving to tribeca",
  ],
  openGraph: {
    title:
      "Apartments for Rent in Tribeca, NYC (2026): Loft Conversions, Trophy Buildings & Rent Guide",
    description:
      "2026 rent prices, subway access, building tier breakdown, and apartment-hunting tips for Tribeca — Manhattan's flagship loft-conversion luxury district.",
    url: `${baseUrl}/nyc/tribeca`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/tribeca` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Apartments for Rent in Tribeca, NYC (2026): Loft Conversion Rent Prices, Subway & Trophy Building Guide",
    description:
      "A 2026 guide to renting in Tribeca — loft conversion rent by unit size, subway access, the Greenwich/Hudson/Reade/Franklin/Walker grid, trophy buildings, and tips for apartment hunters.",
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
    mainEntityOfPage: `${baseUrl}/nyc/tribeca`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is rent in Tribeca?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As of 2026, median asking rent in Tribeca runs roughly $4,800 for a studio (when one is available — Tribeca has very few), $11,500 for a 1-bedroom, $18,500 for a 2-bedroom, and $26,000 for a 3-bedroom. Per-square-foot, Tribeca runs $90–$140/sq ft annually — among the highest in NYC, comparable to Billionaires' Row trophy stock and West Village townhouse rentals. Trophy buildings (56 Leonard, 443 Greenwich, 108 Leonard, 70 Vestry, the Sterling Mason) clear $14K–$22K for a 1-bedroom and routinely list 3-bedroom units at $35K–$80K.",
        },
      },
      {
        "@type": "Question",
        name: "What subway lines serve Tribeca?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tribeca is served by the 1 (Franklin Street, Canal Street), the A/C/E (Canal Street), the 2/3 (Chambers Street, Park Place), the N/Q/R/W (Canal Street), the J/Z (Chambers Street), and the 4/5/6 at Brooklyn Bridge–City Hall on the eastern edge. Eight subway lines accessible within the neighborhood, plus the PATH at WTC for direct New Jersey commute. Tribeca is one of the four most subway-dense neighborhoods in Manhattan (with West Village, Union Square, and Times Square).",
        },
      },
      {
        "@type": "Question",
        name: "What defines a Tribeca loft?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Tribeca loft is typically a residential conversion of a pre-1925 cast-iron or masonry warehouse building, with: 11–14 ft ceilings, 6–8 ft tall steel-frame windows, exposed cast-iron columns, exposed brick walls, oversized open layouts (often 1,500–4,000 sq ft for what's marketed as a 'loft 1BR'), and original heavy plank or terrazzo floors. The neighborhood has roughly 200 surviving pre-war loft buildings, of which about 120 are residentially converted. The conversion era splits into two waves: the 1975–1995 pioneer wave (raw conversions, sometimes still AIR-certified — Artist In Residence) and the 1998–2015 polished wave (full luxury fit-out with new mechanicals, doorman, full amenity package).",
        },
      },
      {
        "@type": "Question",
        name: "What are Tribeca's trophy buildings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The current 'trophy tier' in Tribeca consists of: 56 Leonard (the Herzog & de Meuron 'Jenga building,' 2017), 443 Greenwich (1995 conversion polished in 2017, the building Goldman Sachs's senior leadership lived in — known for paparazzi-proof entrance), 108 Leonard (2018 luxury conversion of the former NY Life Insurance HQ, with sales staff led by Ryan Serhant), the Sterling Mason (2015, two-tower contemporary new-construction next to a brick conversion), 70 Vestry (2018, Robert A.M. Stern, the most expensive new-construction building in lower Manhattan). 1-bedrooms in these buildings clear $14K–$22K; full-floor units lease $50K+.",
        },
      },
      {
        "@type": "Question",
        name: "Is Tribeca quieter than SoHo or West Village?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — substantially. Tribeca has very low residential density compared to neighboring downtown neighborhoods (about 15,000 residents in the neighborhood proper) and most ground-floor retail is restaurants, galleries, and services rather than the heavy retail/tourism of SoHo. Sidewalks and streets are notably emptier on weekends. The Greenwich/Hudson/Reade/Franklin/Walker grid is intentionally low-rise (mostly 6–12 stories) which keeps the streetscape feel intimate. Tribeca's low density is a major draw for renters seeking 'Manhattan core but not downtown chaos' — and is one of the reasons it commands a 5–15% per-square-foot premium over Tribeca's nearby loft-conversion neighbors.",
        },
      },
      {
        "@type": "Question",
        name: "Are Tribeca rentals more expensive than condos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Per-month, no — Tribeca condos sell at $2,500–$4,500/sq ft and trophy buildings can clear $5,000+/sq ft, far above what a renter would pay net for the same square footage. But the rental supply is dominated by owner sub-leases of condo units rather than purpose-built rental towers, which means Tribeca rental inventory is structurally low and often comes with sub-lease quirks (board approval requirements, restricted lease terms, owner's-hand finishes). For a renter, the practical rule of thumb: target purpose-built rental conversions (most of the 1980–1995 wave) for stable inventory, or accept condo sub-lease rules for trophy buildings.",
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
        name: "Tribeca",
        item: `${baseUrl}/nyc/tribeca`,
      },
    ],
  },
];

export default function TribecaPage() {
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
              <Badge variant="outline">1 · A/C/E · 2/3 · N/Q/R/W · J/Z</Badge>
              <Badge className="bg-emerald-600">Luxury tier · loft conversion</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apartments for Rent in Tribeca, NYC (2026): Loft Conversion
              Rent Prices, Subway &amp; Trophy Building Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Tribeca is Manhattan&apos;s flagship loft-conversion luxury
              district — pre-1925 cast-iron and masonry warehouses converted
              into oversized residential lofts with 11–14 ft ceilings,
              6–8 ft windows, and exposed cast-iron columns. The neighborhood
              runs $90–$140/sq ft annually, among the highest tier in NYC,
              and is anchored by trophy buildings (56 Leonard, 443
              Greenwich, 108 Leonard, 70 Vestry) plus 120+ purpose-built
              loft conversions.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed April 26, 2026 &middot; Written by the Wade Me
              Home research team
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Tribeca"
            latitude={40.7195}
            longitude={-74.0094}
            radiusMiles={0.5}
            limit={6}
            searchQuery="Tribeca apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>Tribeca Rent Prices by Unit Size (2026)</CardTitle>
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
                    <TableCell>$4,800</TableCell>
                    <TableCell>$3,800 – $6,500</TableCell>
                    <TableCell>$95</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1 Bedroom</TableCell>
                    <TableCell>$11,500</TableCell>
                    <TableCell>$7,500 – $22,000</TableCell>
                    <TableCell>$110</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">2 Bedroom</TableCell>
                    <TableCell>$18,500</TableCell>
                    <TableCell>$13,000 – $32,000</TableCell>
                    <TableCell>$120</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3 Bedroom</TableCell>
                    <TableCell>$26,000</TableCell>
                    <TableCell>$19,000 – $80,000</TableCell>
                    <TableCell>$130</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Loft / 4BR+</TableCell>
                    <TableCell>$45,000</TableCell>
                    <TableCell>$32,000 – $200,000</TableCell>
                    <TableCell>$140+</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Studios are scarce — Tribeca&apos;s loft footprint biases
                toward larger layouts. The trophy tier (56 Leonard, 443
                Greenwich, 108 Leonard, 70 Vestry, Sterling Mason) prices
                15–35% above the median at every unit size.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trophy Building Tier</CardTitle>
              <CardDescription>
                The five buildings that define rental pricing in Tribeca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Building</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>1BR Asking</TableHead>
                    <TableHead>Defining Feature</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">56 Leonard</TableCell>
                    <TableCell>2017</TableCell>
                    <TableCell>$18,500</TableCell>
                    <TableCell>Herzog &amp; de Meuron, the &ldquo;Jenga&rdquo; cantilever</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">70 Vestry</TableCell>
                    <TableCell>2018</TableCell>
                    <TableCell>$22,000</TableCell>
                    <TableCell>Robert A.M. Stern, riverfront, paparazzi-proof entrance</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">443 Greenwich</TableCell>
                    <TableCell>1995/2017</TableCell>
                    <TableCell>$16,500</TableCell>
                    <TableCell>Loft conversion, courtyard pool, celebrity tenant pedigree</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">108 Leonard</TableCell>
                    <TableCell>2018</TableCell>
                    <TableCell>$15,500</TableCell>
                    <TableCell>Former NY Life HQ conversion, McKim Mead &amp; White</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sterling Mason</TableCell>
                    <TableCell>2015</TableCell>
                    <TableCell>$14,000</TableCell>
                    <TableCell>Twin-tower brick + contemporary, cobblestone block</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">25 N Moore</TableCell>
                    <TableCell>2017</TableCell>
                    <TableCell>$13,500</TableCell>
                    <TableCell>Boutique condo conversion, 11&apos; ceilings</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tribeca Sub-Areas</CardTitle>
              <CardDescription>
                The five functional zones — character and pricing differ
                meaningfully block-to-block
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
                    <TableCell className="font-medium">North Tribeca</TableCell>
                    <TableCell>$10,500</TableCell>
                    <TableCell>Canal–Franklin, Hudson to Broadway</TableCell>
                    <TableCell>Boutique loft buildings, low-key retail</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca West</TableCell>
                    <TableCell>$13,500</TableCell>
                    <TableCell>Greenwich/Hudson, Franklin to Chambers</TableCell>
                    <TableCell>Riverfront, 70 Vestry, the trophy core</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">South Tribeca</TableCell>
                    <TableCell>$11,000</TableCell>
                    <TableCell>Reade/Chambers, Greenwich to Broadway</TableCell>
                    <TableCell>Mix of loft + new-con (Beekman tower)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tribeca East</TableCell>
                    <TableCell>$9,500</TableCell>
                    <TableCell>Broadway to Lafayette</TableCell>
                    <TableCell>Lower-density, transitional toward Civic Center</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cobblestone Core</TableCell>
                    <TableCell>$14,000</TableCell>
                    <TableCell>Franklin/Harrison/Hubert blocks</TableCell>
                    <TableCell>Sterling Mason, intact cobblestone, smallest density</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tribeca Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Distinguish loft conversion from new-con.</strong>{" "}
                  A &ldquo;loft 1BR&rdquo; in a 1985 conversion can be 1,400
                  sq ft with 12-ft ceilings; a 1-bedroom in a 2018 new-con is
                  often 750 sq ft with 9-ft ceilings. Both are luxury, but
                  for very different reasons. Tour both before fixating on
                  one.
                </li>
                <li>
                  <strong>The pioneer wave is rent-stabilized stock.</strong>{" "}
                  Many 1975–1995 loft conversions in 6+ unit buildings are
                  rent-stabilized — the legal regulated rent can be 25–40%
                  below the market for the same building. Ask for the rent
                  registration before signing.
                </li>
                <li>
                  <strong>Owner sub-leases of condo units have quirks.</strong>{" "}
                  Many trophy buildings (56 Leonard, 70 Vestry, 108 Leonard)
                  rent primarily as condo owner sub-leases. Expect: condo
                  board approval (4–8 weeks), restricted lease terms (often
                  no shorter than 12 months), owner-finished kitchens that
                  may not match the marketing photos. Build in 6 weeks to
                  signing on a trophy unit.
                </li>
                <li>
                  <strong>Per-sq-ft is the comparison metric, not
                  rent.</strong> A $13K Tribeca 1BR at 1,300 sq ft is $120/
                  sq ft/yr — actually slightly cheaper than a $9K Hudson
                  Yards 1BR at 700 sq ft ($154/sq ft/yr). Always normalize
                  for size at the luxury tier.
                </li>
                <li>
                  <strong>Tribeca West vs. Tribeca East.</strong> Same zip,
                  $4K/month rent difference. The Greenwich/Hudson/Vestry
                  axis is the trophy band; the eastern blocks (Broadway and
                  east) trade for materially less because they read more
                  Civic Center than Tribeca to most renters.
                </li>
                <li>
                  <strong>Cobblestone blocks command a premium.</strong> The
                  intact cobblestone segments around Franklin, Harrison,
                  Hubert, and Jay command roughly 8–12% over equivalent
                  buildings on paved streets. Cobblestone is a real
                  inventory signal — much of the Tribeca aesthetic depends
                  on the streetscape.
                </li>
                <li>
                  <strong>Subway density is the underrated benefit.</strong>{" "}
                  Eight subway lines in Tribeca proper, plus the WTC PATH
                  and the 4/5/6 just east. Even a $15K rental can be
                  effectively car-free with this connectivity.
                </li>
                <li>
                  <strong>FARE Act applies even at the trophy tier.</strong>{" "}
                  If the building or owner hired the broker, the tenant
                  doesn&apos;t pay a fee. On a $20K Tribeca 1BR, avoiding a
                  12% fee saves $28,800 — meaningful even at this tier. See
                  our{" "}
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
                See live Tribeca apartments at your price
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your unit size, target sub-area
                (Tribeca West, South, Cobblestone Core), and budget — we&apos;ll
                surface matching live inventory.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=Tribeca+apartments">
                  Search Tribeca Apartments
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
                    href="/nyc/soho"
                    className="text-primary underline underline-offset-2"
                  >
                    SoHo Guide
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
                    href="/nyc/chelsea"
                    className="text-primary underline underline-offset-2"
                  >
                    Chelsea Guide
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
                    href="/tools/net-effective-rent-calculator"
                    className="text-primary underline underline-offset-2"
                  >
                    Net Effective Rent Calculator
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
