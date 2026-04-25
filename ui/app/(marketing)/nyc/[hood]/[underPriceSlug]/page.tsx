import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
  NYC_NEIGHBORHOODS,
  UNDER_PRICE_TIERS,
  getNeighborhoodBySlug,
  isValidUnderPriceTier,
} from "@/lib/neighborhoods/nycNeighborhoods";
import { fetchNearbyListingsServer } from "@/lib/listings/serverNearbyListings";
import { parseRentRangeMidpoint } from "@/lib/properties/parseRentRange";
import { buildPropertyKey } from "@/lib/properties/propertyKey";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

type Params = { hood: string; underPriceSlug: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const hood of NYC_NEIGHBORHOODS) {
    for (const price of UNDER_PRICE_TIERS) {
      params.push({
        hood: hood.slug,
        underPriceSlug: `apartments-under-${price}`,
      });
    }
  }
  return params;
}

function parseUnderPriceSlug(slug: string): number | null {
  const m = slug.match(/^apartments-under-(\d+)$/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  if (!Number.isFinite(n)) return null;
  return isValidUnderPriceTier(n) ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { hood, underPriceSlug } = await params;
  const hoodMeta = getNeighborhoodBySlug(hood);
  const priceNum = parseUnderPriceSlug(underPriceSlug);
  if (!hoodMeta || priceNum === null) return {};

  const priceDollar = `$${priceNum.toLocaleString()}`;
  const title = `${hoodMeta.name} Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide | Wade Me Home`;
  const description = `Find ${hoodMeta.name}, ${hoodMeta.borough} apartments for rent under ${priceDollar}/month. Live listings matching your rent cap, sub-neighborhood breakdown, what you can expect at this price tier, and how to search ${hoodMeta.name} inventory efficiently.`;

  return {
    title,
    description,
    keywords: [
      `${hoodMeta.name.toLowerCase()} apartments under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} apartments under $${priceNum}`,
      `cheap ${hoodMeta.name.toLowerCase()} apartments`,
      `affordable ${hoodMeta.name.toLowerCase()} rent`,
      `${hoodMeta.name.toLowerCase()} 1 bedroom under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} studio under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} rentals under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} apartment rent cap`,
      `apartments for rent ${hoodMeta.name.toLowerCase()} under ${priceNum}`,
      `${hoodMeta.borough.toLowerCase()} apartments under ${priceNum}`,
    ],
    openGraph: {
      title: `${hoodMeta.name} Apartments Under ${priceDollar} (2026)`,
      description,
      url: `${baseUrl}/nyc/${hood}/apartments-under-${priceNum}`,
      type: "article",
    },
    alternates: {
      canonical: `${baseUrl}/nyc/${hood}/apartments-under-${priceNum}`,
    },
  };
}

function tierCommentary(hood: string, tier: number, median1BR: number): string {
  const gap = tier - median1BR;
  if (gap >= 400) {
    return `At this rent cap you have strong selection across ${hood}. The neighborhood median 1-bedroom is $${median1BR.toLocaleString()}, so $${tier.toLocaleString()} covers roughly 70–80% of all listed 1-bedroom stock — including new-construction mid-rise with partial amenities.`;
  }
  if (gap >= 0) {
    return `This rent cap is around the ${hood} neighborhood median. Expect a solid mix of pre-war walkups, older mid-rise stock, and the value end of new-construction listings. The $${median1BR.toLocaleString()} median 1-bedroom is within reach.`;
  }
  if (gap >= -400) {
    return `This rent cap is slightly below the ${hood} 1-bedroom median ($${median1BR.toLocaleString()}). You'll see mostly pre-war walkups and smaller studios/1-bedrooms on interior blocks. Expect limited amenities but more character and space in older stock.`;
  }
  return `This is a value-tier rent cap for ${hood} — well below the $${median1BR.toLocaleString()} 1-bedroom median. Inventory will concentrate in studios and shared spaces in older walkups. If you want more selection, consider raising your budget by $300–$500 or looking at nearby neighborhoods with lower medians.`;
}

export default async function ApartmentsUnderPricePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { hood, underPriceSlug } = await params;
  const hoodMeta = getNeighborhoodBySlug(hood);
  const priceNum = parseUnderPriceSlug(underPriceSlug);
  if (!hoodMeta || priceNum === null) notFound();

  const priceDollar = `$${priceNum.toLocaleString()}`;
  const commentary = tierCommentary(
    hoodMeta.name,
    priceNum,
    hoodMeta.medianRent1BR
  );

  // Server-side fetch of nearby listings under the price cap so we can emit
  // AggregateOffer + ItemList structured data. Returns null when the API base
  // isn't configured for server-side calls (e.g. `next build` without backend).
  const nearby = await fetchNearbyListingsServer({
    latitude: hoodMeta.latitude,
    longitude: hoodMeta.longitude,
    radiusMiles: hoodMeta.radiusMiles,
    maxRent: priceNum,
    limit: 30,
  });

  const offerStats = (() => {
    if (!nearby || !Array.isArray(nearby.properties) || nearby.properties.length === 0) {
      return null;
    }
    const rents = nearby.properties
      .map((p) => parseRentRangeMidpoint(p.rent_range || ""))
      .filter((n): n is number => typeof n === "number" && Number.isFinite(n) && n > 0);
    if (rents.length === 0) return null;
    return {
      lowPrice: Math.min(...rents),
      highPrice: Math.max(...rents),
      offerCount: nearby.total_in_radius || rents.length,
      properties: nearby.properties,
    };
  })();

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${hoodMeta.name} Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide`,
      description: `Live ${hoodMeta.name}, ${hoodMeta.borough} listings under ${priceDollar}/month, with rent-tier context and sub-neighborhood guidance.`,
      datePublished: "2026-04-22",
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
      mainEntityOfPage: `${baseUrl}/nyc/${hood}/apartments-under-${priceNum}`,
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
          name: hoodMeta.name,
          item: `${baseUrl}/nyc/${hood}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: `Apartments Under ${priceDollar}`,
          item: `${baseUrl}/nyc/${hood}/apartments-under-${priceNum}`,
        },
      ],
    },
  ];

  if (offerStats) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${hoodMeta.name} Apartments Under ${priceDollar}`,
      description: `Live rental listings in ${hoodMeta.name}, ${hoodMeta.borough} priced at or below ${priceDollar}/month.`,
      url: `${baseUrl}/nyc/${hood}/apartments-under-${priceNum}`,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.round(offerStats.lowPrice),
        highPrice: Math.round(offerStats.highPrice),
        offerCount: offerStats.offerCount,
        availability: "https://schema.org/InStock",
      },
    });

    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${hoodMeta.name} Apartments Under ${priceDollar}`,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: offerStats.properties.length,
      itemListElement: offerStats.properties.slice(0, 12).map((p, i) => {
        const rent = parseRentRangeMidpoint(p.rent_range || "");
        const propertyKey = buildPropertyKey({
          name: p.name,
          address: p.address,
          latitude: p.latitude ?? undefined,
          longitude: p.longitude ?? undefined,
          // The remaining required fields aren't used by buildPropertyKey,
          // but we satisfy the type with safe defaults.
          rent_range: p.rent_range || "",
          bedroom_range: p.bedroom_range || "",
          amenities: [],
          main_amenities: [],
          images_urls: [],
        });
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Apartment",
            name: p.name,
            url: `${baseUrl}/properties/${encodeURIComponent(propertyKey)}`,
            address: p.address,
            ...(typeof rent === "number" && Number.isFinite(rent)
              ? {
                  offers: {
                    "@type": "Offer",
                    price: Math.round(rent),
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                  },
                }
              : {}),
          },
        };
      }),
    });
  }

  const otherTiers = UNDER_PRICE_TIERS.filter((t) => t !== priceNum);
  const hasRentPricesSpoke = [
    "williamsburg",
    "greenpoint",
    "east-village",
    "bushwick",
    "astoria",
    "long-island-city",
    "park-slope",
    "upper-west-side",
    "harlem",
    "chelsea",
  ].includes(hood);

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
              <Badge variant="outline">{hoodMeta.name}</Badge>
              <Badge variant="secondary">Under {priceDollar}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {hoodMeta.name} Apartments Under {priceDollar} (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              Live {hoodMeta.name}, {hoodMeta.borough} apartment listings
              for rent under {priceDollar}/month, pulled from real
              inventory. {commentary}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Results refresh continuously
              as landlords post and remove listings
            </p>
          </header>

          {/* ── Live Listings ─────────────────────────── */}
          <NeighborhoodLiveListings
            neighborhoodName={hoodMeta.name}
            latitude={hoodMeta.latitude}
            longitude={hoodMeta.longitude}
            radiusMiles={hoodMeta.radiusMiles}
            limit={9}
            maxRent={priceNum}
            searchQuery={`${hoodMeta.name} apartments`}
          />

          {/* ── Price Tier Context ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                What {priceDollar}/month Gets You in {hoodMeta.name}
              </CardTitle>
              <CardDescription>
                How your rent cap compares to the {hoodMeta.name}{" "}
                neighborhood median
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
                    {hoodMeta.name} 1BR median
                  </p>
                  <p className="text-lg font-semibold">
                    ${hoodMeta.medianRent1BR.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {hoodMeta.name} studio median
                  </p>
                  <p className="text-lg font-semibold">
                    ${hoodMeta.medianStudio.toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator />
              <p>{commentary}</p>
              <p>
                About {hoodMeta.name}: {hoodMeta.summary}
              </p>
            </CardContent>
          </Card>

          {/* ── Tips ─────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                How to Search {hoodMeta.name} Under {priceDollar} Efficiently
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Sort by price-per-square-foot, not by rent.</strong>{" "}
                  A $
                  {(priceNum - 100).toLocaleString()}
                  /month 1-bedroom at 450 sq ft costs more per square foot
                  than a $
                  {priceNum.toLocaleString()} 1-bedroom at 650 sq ft. Value
                  is about $/sq ft, not headline rent.
                </li>
                <li>
                  <strong>Filter out fees.</strong> Under the{" "}
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act
                  </Link>
                  , tenants no longer pay broker fees when the landlord
                  hired the broker. Confirm this on any listing at your
                  price cap — fees can add 10–15% to first-year cost.
                </li>
                <li>
                  <strong>
                    Ask about net effective rent and concessions.
                  </strong>{" "}
                  A $
                  {(priceNum + 300).toLocaleString()}
                  /month gross rent with 1 month free on a 12-month lease
                  has a net effective rent of ~$
                  {Math.round(((priceNum + 300) * 11) / 12).toLocaleString()}
                  /month — which may actually fit under your{" "}
                  {priceDollar} cap on a true-cost basis.
                </li>
                <li>
                  <strong>Expand your radius.</strong> {hoodMeta.name}
                  &apos;s border blocks (listed above) often have the
                  cheapest rent — a 5-minute walk can mean $200–$400/month
                  savings.
                </li>
                <li>
                  <strong>Time your search.</strong> See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent NYC guide
                  </Link>
                  . November–February listings often come with bigger
                  concessions, which effectively lowers your cap.
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* ── CTA ───────────────────────────────────── */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                Not finding the right {hoodMeta.name} apartment?
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Describe what you&apos;re looking for — budget, unit size,
                must-have amenities, move-in timing — and our AI assistant
                will search {hoodMeta.name} inventory and surface only the
                listings that actually match.
              </p>
              <Button asChild size="lg">
                <Link
                  href={`/search?q=${encodeURIComponent(`${hoodMeta.name} apartments under $${priceNum}`)}`}
                >
                  Search {hoodMeta.name} Apartments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* ── Other Tiers ───────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Try a Different {hoodMeta.name} Rent Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {otherTiers.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/nyc/${hood}/apartments-under-${t}`}
                      className="text-primary underline underline-offset-2"
                    >
                      {hoodMeta.name} apartments under ${t.toLocaleString()}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ── Related ───────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                Related {hoodMeta.name} &amp; NYC Rent Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/nyc/${hood}`}
                    className="text-primary underline underline-offset-2"
                  >
                    {hoodMeta.name} Apartments: Full Neighborhood Guide
                  </Link>
                </li>
                {hasRentPricesSpoke && (
                  <li>
                    <Link
                      href={`/nyc/${hood}/rent-prices`}
                      className="text-primary underline underline-offset-2"
                    >
                      {hoodMeta.name} Rent Prices Breakdown
                    </Link>
                  </li>
                )}
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
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    Best Time to Rent an Apartment in NYC
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
                    NYC Rent Stabilization Explained
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
