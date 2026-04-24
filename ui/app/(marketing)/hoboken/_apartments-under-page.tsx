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
import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";
import { NeighborhoodLiveListings } from "@/components/neighborhoods/NeighborhoodLiveListings";
import { HOBOKEN_AREA } from "@/lib/neighborhoods/hobokenNeighborhoods";
import { UNDER_PRICE_TIERS } from "@/lib/neighborhoods/nycNeighborhoods";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export function buildMetadata(priceNum: number): Metadata {
  const priceDollar = `$${priceNum.toLocaleString()}`;
  const title = `Hoboken Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide | Wade Me Home`;
  const description = `Find Hoboken, NJ apartments for rent under ${priceDollar}/month. Live listings matching your rent cap, PATH commute context, what you can expect at this price tier vs Manhattan and Jersey City, and how to search Hoboken inventory efficiently.`;

  return {
    title,
    description,
    keywords: [
      `hoboken apartments under ${priceNum}`,
      `hoboken apartments under $${priceNum}`,
      `cheap hoboken apartments`,
      `affordable hoboken rent`,
      `hoboken 1 bedroom under ${priceNum}`,
      `hoboken studio under ${priceNum}`,
      `hoboken rentals under ${priceNum}`,
      `apartments for rent hoboken under ${priceNum}`,
      `hoboken nj under ${priceNum}`,
      `hoboken apartments for rent under ${priceNum}`,
    ],
    openGraph: {
      title: `Hoboken Apartments Under ${priceDollar} (2026)`,
      description,
      url: `${baseUrl}/hoboken/apartments-under-${priceNum}`,
      type: "article",
    },
    alternates: {
      canonical: `${baseUrl}/hoboken/apartments-under-${priceNum}`,
    },
  };
}

function tierCommentary(tier: number, median1BR: number): string {
  const gap = tier - median1BR;
  if (gap >= 400) {
    return `At this rent cap you have strong selection across Hoboken. The city-wide median 1-bedroom is $${median1BR.toLocaleString()}, so $${tier.toLocaleString()} covers most 1-bedroom stock including newer mid-rise and a good slice of waterfront towers during concession windows.`;
  }
  if (gap >= 0) {
    return `This rent cap is around the Hoboken 1-bedroom median. Expect a mix of older brownstone conversions, mid-block 4-story walkups, and the value end of waterfront-tower concessions. The $${median1BR.toLocaleString()} median is within reach.`;
  }
  if (gap >= -400) {
    return `This rent cap is slightly below the Hoboken 1-bedroom median ($${median1BR.toLocaleString()}). You'll see mostly older brownstone floor-throughs, walkups on the western and uptown edges, and smaller studios. Waterfront towers are mostly out of reach at this tier without deep concessions.`;
  }
  return `This is a value-tier rent cap for Hoboken — well below the $${median1BR.toLocaleString()} 1-bedroom median. Inventory concentrates in studios, railroad 1-bedrooms, and older walkup stock on the uptown and western edges (farther from Hoboken Terminal). If you want more selection, consider raising the budget by $300–$500 or broadening to Journal Square and Jersey City Heights.`;
}

export function HobokenApartmentsUnderPriceContent({
  priceNum,
}: {
  priceNum: number;
}) {
  const priceDollar = `$${priceNum.toLocaleString()}`;
  const commentary = tierCommentary(priceNum, HOBOKEN_AREA.medianRent1BR);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Hoboken Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide`,
      description: `Live Hoboken, NJ listings under ${priceDollar}/month with PATH commute context and rent-tier guidance.`,
      datePublished: "2026-04-24",
      dateModified: "2026-04-24",
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
      mainEntityOfPage: `${baseUrl}/hoboken/apartments-under-${priceNum}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hoboken",
          item: `${baseUrl}/hoboken`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Apartments Under ${priceDollar}`,
          item: `${baseUrl}/hoboken/apartments-under-${priceNum}`,
        },
      ],
    },
  ];

  const otherTiers = UNDER_PRICE_TIERS.filter((t) => t !== priceNum);

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
            <div className="flex items-center gap-2">
              <Badge variant="outline">Hoboken</Badge>
              <Badge variant="secondary">Under {priceDollar}</Badge>
              <Badge variant="outline">Hudson County</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hoboken Apartments Under {priceDollar} (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              Live Hoboken, NJ apartment listings for rent under {priceDollar}
              /month, pulled from real inventory. {commentary}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Results refresh continuously as
              landlords post and remove listings
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="Hoboken"
            latitude={HOBOKEN_AREA.latitude}
            longitude={HOBOKEN_AREA.longitude}
            radiusMiles={HOBOKEN_AREA.radiusMiles}
            limit={9}
            maxRent={priceNum}
            searchQuery={`Hoboken apartments under ${priceDollar}`}
          />

          <Card>
            <CardHeader>
              <CardTitle>
                What {priceDollar}/month Gets You in Hoboken
              </CardTitle>
              <CardDescription>
                How your rent cap compares to the Hoboken city-wide median
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Your rent cap
                  </p>
                  <p className="text-lg font-semibold">{priceDollar}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Hoboken 1BR median
                  </p>
                  <p className="text-lg font-semibold">
                    ${HOBOKEN_AREA.medianRent1BR.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Hoboken studio median
                  </p>
                  <p className="text-lg font-semibold">
                    ${HOBOKEN_AREA.medianStudio.toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator />
              <p>{commentary}</p>
              <p>About Hoboken: {HOBOKEN_AREA.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PATH Commute from Hoboken</CardTitle>
              <CardDescription>
                Why at {priceDollar}/month, Hoboken can beat equivalent
                Manhattan options on all-in cost
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Hoboken PATH (at Hoboken Terminal) runs ~9 minutes to World
                Trade Center on the HOB-WTC line and ~12 minutes to 33rd Street
                on the HOB-33 line. NJ Transit at Hoboken Terminal adds access
                to Secaucus, Newark, and points west. Most of Hoboken is
                walkable to the terminal — the farthest northwest corner is
                about 18 minutes on foot, and there&apos;s a local Hop bus
                circulator.
              </p>
              <p>
                A Manhattan 1-bedroom at Hoboken&apos;s $
                {priceNum.toLocaleString()} cap mostly clears in Inwood,
                Washington Heights, East Harlem, or deep Brooklyn — all farther
                from Midtown or FiDi by transit minutes than Hoboken. For a
                commuter working in Lower Manhattan or Midtown, {priceDollar}
                /month here often buys faster Manhattan access than the same
                rent in Manhattan itself.
              </p>
              <p>
                PATH fare is $2.75 one-way (matches NYC subway). A 30-day
                Unlimited PATH card is $109. Budget about $240/month for
                transit including PATH + occasional MTA transfers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                How to Search Hoboken Under {priceDollar} Efficiently
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>
                    Ask about net effective rent on waterfront towers.
                  </strong>{" "}
                  Maxwell Place, W Residences, Hudson Tea, and Nine on the
                  Hudson routinely run 1–2 months free during winter lease-up.
                  A $
                  {(priceNum + 400).toLocaleString()}/month gross rent with 2
                  months free on a 13-month lease nets to ~$
                  {Math.round(((priceNum + 400) * 11) / 13).toLocaleString()}
                  /month — which may fit under your {priceDollar} cap.
                </li>
                <li>
                  <strong>
                    Target brownstone floor-throughs west of Washington Street.
                  </strong>{" "}
                  The 800–1,100 sq ft parlor-floor 1BRs on Garden, Park, and
                  Bloomfield are where value-tier Hoboken lives. Older
                  hardwood, no gym, but real room counts.
                </li>
                <li>
                  <strong>
                    Filter out broker fees — NJ does NOT have the NYC FARE Act.
                  </strong>{" "}
                  One-month broker fees on landlord-listed Hoboken units are
                  still common. Confirm no-fee before touring. A fee-paying
                  unit at a similar rent can cost 8–10% more in year one.
                </li>
                <li>
                  <strong>Price the commute, not just the rent.</strong> PATH
                  from Hoboken Terminal + occasional MTA is roughly $240/month.
                  If you work in Lower Manhattan or Midtown West, Hoboken adds
                  0–10 minutes over a comparable Manhattan unit — often at
                  $500–$1,000/month less in rent.
                </li>
                <li>
                  <strong>
                    Uptown Hoboken (north of 11th St) trades rent for distance
                    from the terminal.
                  </strong>{" "}
                  You save $200–$500/month versus the Terminal-adjacent
                  southern blocks but add 10–15 minutes of walking to PATH. If
                  you&apos;re set on {priceDollar}, uptown is where selection
                  concentrates.
                </li>
                <li>
                  <strong>Time your search.</strong> See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent guide
                  </Link>
                  . December–February Hoboken listings come with bigger
                  concessions, which effectively lowers your cap.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Not finding the right Hoboken apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe what you&apos;re looking for — budget, unit size, PATH
                walk time, must-have amenities, move-in timing — and our AI
                assistant will search Hoboken inventory and surface only the
                listings that actually match.
              </p>
              <Button asChild size="lg">
                <Link
                  href={`/search?q=${encodeURIComponent(
                    `Hoboken apartments under $${priceNum}`
                  )}`}
                >
                  Search Hoboken Apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Try a Different Hoboken Rent Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {otherTiers.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/hoboken/apartments-under-${t}`}
                      className="text-primary underline underline-offset-2"
                    >
                      Hoboken apartments under ${t.toLocaleString()}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Hoboken &amp; Hudson County Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/hoboken"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Apartments: Full City Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Hoboken Rent Prices: Tower and Sub-Area Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Apartments: Full City Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/jersey-city/rent-prices"
                    className="text-primary underline underline-offset-2"
                  >
                    Jersey City Rent Prices: Zip-Code Breakdown
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent an Apartment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bad-landlord-nj-ny"
                    className="text-primary underline underline-offset-2"
                  >
                    How to Check a New Jersey / NYC Landlord Before Signing
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
