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
  JC_NEIGHBORHOODS,
  UNDER_PRICE_TIERS,
  getJcNeighborhoodBySlug,
} from "@/lib/neighborhoods/jerseyCityNeighborhoods";
import { isValidUnderPriceTier } from "@/lib/neighborhoods/nycNeighborhoods";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

type Params = { hood: string; price: string };

export function generateStaticParams(): Params[] {
  const params: Params[] = [];
  for (const hood of JC_NEIGHBORHOODS) {
    for (const price of UNDER_PRICE_TIERS) {
      params.push({ hood: hood.slug, price: String(price) });
    }
  }
  return params;
}

function parsePrice(price: string): number | null {
  const n = Number.parseInt(price, 10);
  if (!Number.isFinite(n)) return null;
  return isValidUnderPriceTier(n) ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { hood, price } = await params;
  const hoodMeta = getJcNeighborhoodBySlug(hood);
  const priceNum = parsePrice(price);
  if (!hoodMeta || priceNum === null) return {};

  const priceDollar = `$${priceNum.toLocaleString()}`;
  const title = `${hoodMeta.name} Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide | Wade Me Home`;
  const description = `Find ${hoodMeta.name}, Jersey City apartments for rent under ${priceDollar}/month. Live listings matching your rent cap, PATH commute context, what you can expect at this price tier vs Manhattan, and how to search ${hoodMeta.name} inventory efficiently.`;

  return {
    title,
    description,
    keywords: [
      `${hoodMeta.name.toLowerCase()} apartments under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} apartments under $${priceNum}`,
      `jersey city apartments under ${priceNum}`,
      `cheap jersey city apartments`,
      `affordable jersey city rent`,
      `${hoodMeta.name.toLowerCase()} 1 bedroom under ${priceNum}`,
      `${hoodMeta.name.toLowerCase()} studio under ${priceNum}`,
      `jersey city rentals under ${priceNum}`,
      `apartments for rent jersey city under ${priceNum}`,
      `jersey city under ${priceNum}`,
    ],
    openGraph: {
      title: `${hoodMeta.name} Apartments Under ${priceDollar} (2026)`,
      description,
      url: `${baseUrl}/jersey-city/${hood}/apartments-under-${price}`,
      type: "article",
    },
    alternates: {
      canonical: `${baseUrl}/jersey-city/${hood}/apartments-under-${price}`,
    },
  };
}

function tierCommentary(hood: string, tier: number, median1BR: number): string {
  const gap = tier - median1BR;
  if (gap >= 400) {
    return `At this rent cap you have strong selection across ${hood}. The neighborhood median 1-bedroom is $${median1BR.toLocaleString()}, so $${tier.toLocaleString()} covers roughly 70–80% of all listed 1-bedroom stock — including newer mid-rise with partial amenities.`;
  }
  if (gap >= 0) {
    return `This rent cap is around the ${hood} neighborhood median. Expect a mix of older mid-rise, PATH-adjacent walkups, and the value end of new-construction high-rise concessions. The $${median1BR.toLocaleString()} median 1-bedroom is within reach.`;
  }
  if (gap >= -400) {
    return `This rent cap is slightly below the ${hood} 1-bedroom median ($${median1BR.toLocaleString()}). You'll see mostly older mid-rise, 2-family conversions, and smaller studios/1-bedrooms. Expect limited amenities but bigger layouts than comparable-price Manhattan units.`;
  }
  return `This is a value-tier rent cap for ${hood} — well below the $${median1BR.toLocaleString()} 1-bedroom median. Inventory will concentrate in studios and smaller 1-bedrooms in older walkup or 2-family stock. If you want more selection, consider raising your budget by $300–$500 or expanding to Journal Square / Bergen-Lafayette.`;
}

function pathContext(hood: string): string {
  if (hood === "downtown")
    return "Grove Street PATH runs under 3 minutes to World Trade Center / Exchange Place — the single fastest waterfront-to-Manhattan commute in the metro.";
  if (hood === "newport")
    return "Newport PATH is ~6 minutes to World Trade Center, ~12 minutes to 33rd Street (Herald Square) with a transfer — direct access to Midtown without crossing Manhattan twice.";
  if (hood === "journal-square")
    return "Journal Square PATH is the system's only direct Manhattan express — ~14 minutes to 33rd Street on the JSQ-33 line, ~20 minutes to WTC. Deepest PATH stop inland but best price-per-minute to Midtown.";
  return "";
}

export default async function JcApartmentsUnderPricePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { hood, price } = await params;
  const hoodMeta = getJcNeighborhoodBySlug(hood);
  const priceNum = parsePrice(price);
  if (!hoodMeta || priceNum === null) notFound();

  const priceDollar = `$${priceNum.toLocaleString()}`;
  const commentary = tierCommentary(
    hoodMeta.name,
    priceNum,
    hoodMeta.medianRent1BR
  );
  const pathNote = pathContext(hood);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${hoodMeta.name} Apartments Under ${priceDollar} (2026): Live Listings & Rent Guide`,
      description: `Live ${hoodMeta.name}, Jersey City listings under ${priceDollar}/month with PATH commute context and rent-tier guidance.`,
      datePublished: "2026-04-23",
      dateModified: "2026-04-23",
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
      mainEntityOfPage: `${baseUrl}/jersey-city/${hood}/apartments-under-${price}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Jersey City",
          item: `${baseUrl}/jersey-city`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: hoodMeta.name,
          item: `${baseUrl}/jersey-city/${hood}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: `Apartments Under ${priceDollar}`,
          item: `${baseUrl}/jersey-city/${hood}/apartments-under-${price}`,
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
          {/* ── Header ────────────────────────────────── */}
          <header className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{hoodMeta.name}</Badge>
              <Badge variant="secondary">Under {priceDollar}</Badge>
              <Badge variant="outline">Jersey City</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {hoodMeta.name} Apartments Under {priceDollar} (2026)
            </h1>
            <p className="text-sm text-muted-foreground">
              Live {hoodMeta.name}, Jersey City apartment listings for rent
              under {priceDollar}/month, pulled from real inventory.{" "}
              {commentary}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated April 2026 &middot; Results refresh continuously as
              landlords post and remove listings
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
            searchQuery={`${hoodMeta.name} Jersey City apartments`}
          />

          {/* ── Price Tier Context ────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle>
                What {priceDollar}/month Gets You in {hoodMeta.name}
              </CardTitle>
              <CardDescription>
                How your rent cap compares to the {hoodMeta.name} neighborhood
                median
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

          {/* ── PATH Context ──────────────────────────── */}
          {pathNote && (
            <Card>
              <CardHeader>
                <CardTitle>PATH Commute from {hoodMeta.name}</CardTitle>
                <CardDescription>
                  Why at {priceDollar}/month, {hoodMeta.name} beats equivalent
                  Manhattan options on all-in cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{pathNote}</p>
                <p>
                  A Manhattan 1-bedroom at {hoodMeta.name}&apos;s $
                  {priceNum.toLocaleString()} cap mostly clears in the East
                  Village, East Harlem, or Inwood — all further from Midtown
                  or FiDi by transit minutes than {hoodMeta.name}. For a
                  commuter working in Lower Manhattan or Midtown, {priceDollar}
                  /month here buys faster Manhattan access than the same rent
                  in Manhattan itself.
                </p>
                <p>
                  PATH fare is $2.75 one-way (matches NYC subway). A 30-day
                  Unlimited PATH card is $109. Budget about $240/month for
                  transit including PATH + occasional MTA transfers.
                </p>
              </CardContent>
            </Card>
          )}

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
                  <strong>
                    Ask about net effective rent — JC has the deepest
                    concessions in the metro.
                  </strong>{" "}
                  A $
                  {(priceNum + 400).toLocaleString()}/month gross rent with 2
                  months free on a 13-month lease has a net effective rent of ~$
                  {Math.round(
                    ((priceNum + 400) * 11) / 13
                  ).toLocaleString()}
                  /month — which may fit under your {priceDollar} cap on a
                  true-cost basis. New high-rises at Newport and Journal Square
                  routinely offer 1–2 months free.
                </li>
                <li>
                  <strong>Sort by price-per-square-foot, not rent.</strong> JC
                  units are typically 15–25% larger than Manhattan equivalents
                  at the same rent — factor that into value comparison.
                </li>
                <li>
                  <strong>Price the commute, not just the rent.</strong> PATH
                  + occasional MTA is roughly $240/month. If you work in Lower
                  Manhattan, {hoodMeta.name} adds 0–15 minutes over a
                  comparable Manhattan unit — often at $500–$1,000/month less
                  in rent.
                </li>
                <li>
                  <strong>
                    Filter out broker fees — NJ doesn&apos;t have the NYC
                    FARE Act, but most JC landlords list no-fee anyway.
                  </strong>{" "}
                  Confirm on every listing. A fee-paying Manhattan unit at a
                  similar rent can cost 8–15% more in year one.
                </li>
                <li>
                  <strong>Check building year.</strong> Pre-2010 JC stock is
                  often comparable to NYC pre-war in price and layout. Post-
                  2017 new-construction is where the concessions show up.
                </li>
                <li>
                  <strong>Time your search.</strong> See our{" "}
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="text-primary underline underline-offset-2"
                  >
                    best time to rent guide
                  </Link>
                  . December–February listings often come with bigger
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
                PATH station preference, must-have amenities, move-in timing —
                and our AI assistant will search {hoodMeta.name} inventory and
                surface only the listings that actually match.
              </p>
              <Button asChild size="lg">
                <Link
                  href={`/search?q=${encodeURIComponent(
                    `${hoodMeta.name} Jersey City apartments under $${priceNum}`
                  )}`}
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
                      href={`/jersey-city/${hood}/apartments-under-${t}`}
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
                Related {hoodMeta.name} &amp; Jersey City Rent Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={`/jersey-city/${hood}`}
                    className="text-primary underline underline-offset-2"
                  >
                    {hoodMeta.name} Apartments: Full Neighborhood Guide
                  </Link>
                </li>
                {(hood === "newport" || hood === "journal-square") && (
                  <li>
                    <Link
                      href={`/jersey-city/${hood}/rent-prices`}
                      className="text-primary underline underline-offset-2"
                    >
                      {hoodMeta.name} Rent Prices Breakdown
                    </Link>
                  </li>
                )}
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
