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
import type { HudsonYardsTower } from "@/lib/buildings/hudsonYardsTowers";
import type { BuildingLiveData } from "@/lib/buildings/serverBuildingData";
import { buildPropertyKey } from "@/lib/properties/propertyKey";
import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

type Props = {
  tower: HudsonYardsTower;
  others: HudsonYardsTower[];
  /**
   * Optional server-side fetched live data: building review aggregates from
   * `/buildings/{id}` plus currently-listed nearby units from
   * `/listings/nearby`. Pages that pass this prop get a "Live data" block
   * rendered above the static content; pages that don't (or where the API
   * is unreachable) render the static-only version.
   */
  liveData?: BuildingLiveData;
};

function formatRating(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

function shortAddress(addr: string | null | undefined): string {
  if (!addr) return "Listing";
  // Trim trailing ", New York, NY, 10018" type suffixes for table display
  // — keep just street + unit.
  const parts = addr.split(",").map((s) => s.trim());
  return parts.slice(0, 2).join(", ") || addr;
}

export function buildJsonLd(tower: HudsonYardsTower) {
  const neighborhood = tower.neighborhood;
  const url = `${baseUrl}/buildings/${tower.slug}`;

  const apartmentComplex = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: tower.name,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: tower.address.split(",")[0]?.trim() ?? tower.address,
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: tower.address.match(/\b\d{5}\b/)?.[0] ?? undefined,
      addressCountry: "US",
    },
    description: tower.description,
    yearBuilt: tower.yearCompleted,
    numberOfAccommodationUnits: tower.unitCount > 0 ? tower.unitCount : undefined,
    amenityFeature: tower.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
    })),
    containedInPlace: [
      {
        "@type": "Place",
        name: neighborhood,
        address: {
          "@type": "PostalAddress",
          addressLocality: "New York",
          addressRegion: "NY",
          addressCountry: "US",
        },
      },
      {
        "@type": "City",
        name: "New York",
        address: {
          "@type": "PostalAddress",
          addressLocality: "New York",
          addressRegion: "NY",
          addressCountry: "US",
        },
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tower.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const breadcrumbs = {
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
        name: neighborhood,
        item: `${baseUrl}/nyc/chelsea`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tower.name,
        item: url,
      },
    ],
  };

  return [apartmentComplex, faqPage, breadcrumbs];
}

export function BuildingLandingTemplate({ tower, others, liveData }: Props) {
  const jsonLd = buildJsonLd(tower);
  const detail = liveData?.detail ?? null;
  const nearbyProperties = liveData?.nearby?.properties ?? [];
  const totalInRadius = liveData?.nearby?.total_in_radius ?? 0;
  const reviewCount = detail?.aggregates?.review_count ?? 0;
  const avgRating = formatRating(detail?.aggregates?.avg_overall_rating);
  const verifiedReviewCount =
    detail?.aggregates?.verified_tenant_review_count ?? 0;
  const currentOwner = detail?.current_owner ?? null;
  const currentManager = detail?.current_manager ?? null;
  const reviewToolHref = `/buildings/${tower.buildingId}`;
  const hasAnyLiveSignal =
    Boolean(detail) || nearbyProperties.length > 0 || totalInRadius > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {/* Breadcrumb-ish header */}
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{tower.neighborhood}</Badge>
              <Badge variant="secondary">Building Profile</Badge>
              <Badge className="bg-emerald-600">
                Completed {tower.yearCompleted}
              </Badge>
              {tower.unitCount > 0 && (
                <Badge variant="outline">{tower.unitCount} units</Badge>
              )}
              <Badge variant="outline">{tower.floors} floors</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tower.name} — {tower.neighborhood} Apartments for Rent (2026)
            </h1>
            <p className="text-base text-muted-foreground">{tower.tagline}</p>
            <p className="text-sm text-muted-foreground">{tower.address}</p>
          </header>

          {/* Quick facts */}
          <Card>
            <CardHeader>
              <CardTitle>About {tower.name}</CardTitle>
              <CardDescription>
                Developed by {tower.developer} · Completed {tower.yearCompleted}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{tower.description}</p>
            </CardContent>
          </Card>

          {/* Live data block — only renders when API base is configured AND
              the backend returned something. Per server fetcher spec, it
              gracefully no-ops if the API is unreachable, so the page
              always renders the static portion below. */}
          {hasAnyLiveSignal ? (
            <Card>
              <CardHeader>
                <CardTitle>Live data</CardTitle>
                <CardDescription>
                  Pulled from the Wade Me Home buildings + listings index in
                  real time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {/* Reviews + ownership stats from /buildings/{id} */}
                {detail ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border bg-muted/30 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Tenant reviews
                      </div>
                      {reviewCount > 0 ? (
                        <>
                          <div className="mt-1 text-lg font-semibold">
                            {avgRating ?? "—"}
                            <span className="text-sm font-normal text-muted-foreground">
                              {" "}
                              / 5 · {reviewCount}{" "}
                              {reviewCount === 1 ? "review" : "reviews"}
                            </span>
                          </div>
                          {verifiedReviewCount > 0 ? (
                            <div className="text-xs text-muted-foreground">
                              {verifiedReviewCount} from verified tenants
                            </div>
                          ) : null}
                          <Link
                            href={reviewToolHref}
                            className="mt-2 inline-block text-xs text-primary underline underline-offset-2"
                          >
                            Read all reviews →
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="mt-1 text-sm text-muted-foreground">
                            No reviews yet — be the first.
                          </div>
                          <Link
                            href={reviewToolHref}
                            className="mt-2 inline-block text-xs text-primary underline underline-offset-2"
                          >
                            Write a review →
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="rounded-md border bg-muted/30 p-3">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Ownership
                      </div>
                      {currentOwner ? (
                        <div className="mt-1">
                          <div className="font-medium">
                            {currentOwner.canonical_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {currentOwner.kind} · current owner
                            {currentOwner.portfolio_size_cached
                              ? ` · ${currentOwner.portfolio_size_cached} buildings`
                              : ""}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-muted-foreground">
                          Not yet recorded.
                        </div>
                      )}
                      {currentManager &&
                      currentManager.canonical_name !==
                        currentOwner?.canonical_name ? (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Managed by {currentManager.canonical_name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {/* Currently-listed units near this building */}
                {nearbyProperties.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Currently listed nearby
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {totalInRadius} listing
                        {totalInRadius === 1 ? "" : "s"} within{" "}
                        {liveData?.nearby?.radius_miles ?? 0.05} mi
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Listing</TableHead>
                            <TableHead>Beds</TableHead>
                            <TableHead className="text-right">
                              Asking rent
                            </TableHead>
                            <TableHead className="text-right">View</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {nearbyProperties.slice(0, 8).map((p, idx) => {
                            // The /listings/nearby payload doesn't include
                            // property_key directly — derive it the same way
                            // the rest of the codebase does.
                            const propertyKey = (() => {
                              try {
                                return buildPropertyKey(p as PropertyDataItem);
                              } catch {
                                return null;
                              }
                            })();
                            const addr = (p as unknown as { address?: string | null }).address;
                            const beds = (p as unknown as { bedroom_range?: string | null }).bedroom_range;
                            const rent = (p as unknown as { rent_range?: string | null }).rent_range;
                            return (
                              <TableRow key={propertyKey ?? `${addr ?? "row"}-${idx}`}>
                                <TableCell className="font-medium">
                                  {shortAddress(addr)}
                                </TableCell>
                                <TableCell>{beds ?? "—"}</TableCell>
                                <TableCell className="text-right">
                                  {rent ?? "—"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {propertyKey ? (
                                    <Link
                                      href={`/properties/${encodeURIComponent(propertyKey)}`}
                                      className="text-xs text-primary underline underline-offset-2"
                                    >
                                      Open →
                                    </Link>
                                  ) : null}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Listings refreshed at page render. Cross-reference asking
                      rent with the unit-mix table below — large gaps usually
                      mean a concession is in play (run the{" "}
                      <Link
                        href="/tools/net-effective-rent-calculator"
                        className="text-primary underline underline-offset-2"
                      >
                        net-effective calculator
                      </Link>
                      ).
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {/* No-fee callout — FARE Act */}
          <Card className="border-emerald-500/40 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="text-emerald-700 dark:text-emerald-400">
                No-fee under the NYC FARE Act
              </CardTitle>
              <CardDescription>
                Landlord-side listings cannot charge tenants a broker fee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                {tower.name} is leased directly by {tower.developer} or by
                landlord-side brokers. Under New York City&apos;s FARE Act
                (effective June 2025), tenants cannot be charged a broker fee
                on landlord-side listings — so renting at {tower.name} through
                any official channel is no-fee to the tenant.
              </p>
              <p>
                <Link
                  href="/tools/fare-act-broker-fee-checker"
                  className="text-primary underline underline-offset-2"
                >
                  Check whether a specific listing should be no-fee under the
                  FARE Act →
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Transit */}
          <Card>
            <CardHeader>
              <CardTitle>Transit &amp; Walkability</CardTitle>
              <CardDescription>
                Walking distance from {tower.name}&apos;s main entrance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Lines</TableHead>
                      <TableHead className="text-right">Walk (min)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tower.transit.map((stop) => (
                      <TableRow key={`${stop.station}-${stop.lines}`}>
                        <TableCell className="font-medium">
                          {stop.station}
                        </TableCell>
                        <TableCell>{stop.lines}</TableCell>
                        <TableCell className="text-right">
                          {stop.walkMinutes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>
                Publicly published building amenities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {tower.amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Unit mix table */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Mix &amp; Typical Rent (2026)</CardTitle>
              <CardDescription>
                Asking-rent ranges based on publicly-listed units in the
                building over the last 12 months. Net-effective rent is
                typically 7-15% lower after concessions on initial leases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit Type</TableHead>
                      <TableHead>Sq Ft (typical)</TableHead>
                      <TableHead>Asking Rent (gross)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tower.unitMix.map((row) => (
                      <TableRow key={row.type}>
                        <TableCell className="font-medium">{row.type}</TableCell>
                        <TableCell>{row.sqftRange}</TableCell>
                        <TableCell>{row.rentRange}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Use our{" "}
                <Link
                  href="/tools/net-effective-rent-calculator"
                  className="text-primary underline underline-offset-2"
                >
                  net-effective-rent calculator
                </Link>{" "}
                to convert a gross-rent listing with months-free into the
                actual monthly cost you&apos;ll experience, and our{" "}
                <Link
                  href="/tools/nyc-affordability-calculator"
                  className="text-primary underline underline-offset-2"
                >
                  NYC affordability calculator
                </Link>{" "}
                to check whether you meet the 40x-rent income rule for a
                specific unit at {tower.name}.
              </p>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {tower.faqs.map((f, i) => (
                <div key={f.question}>
                  <h3 className="mb-1 font-semibold text-foreground">
                    {f.question}
                  </h3>
                  <p>{f.answer}</p>
                  {i < tower.faqs.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compare with nearby buildings */}
          <Card>
            <CardHeader>
              <CardTitle>Compare with Nearby Buildings</CardTitle>
              <CardDescription>
                Other named rental towers in Hudson Yards / West Chelsea
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/buildings/${o.slug}`}
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      {o.name}
                    </Link>{" "}
                    <span className="text-muted-foreground">
                      — {o.address.split(",")[0]?.trim()}, {o.neighborhood} ·{" "}
                      Completed {o.yearCompleted} ·{" "}
                      {o.unitCount > 0 ? `${o.unitCount} units` : "office tower"}
                    </span>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {o.tagline}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Browse Chelsea / Hudson Yards listings CTA */}
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Browse Live Chelsea &amp; Hudson Yards Listings</CardTitle>
              <CardDescription>
                See all currently-available rentals in the neighborhood — not
                just {tower.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/nyc/chelsea">Browse Chelsea apartments</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/nyc/chelsea/rent-prices">
                    Chelsea rent prices (2026)
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Search with AI</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Wade Me Home aggregates Chelsea and Hudson Yards listings from
                multiple sources, with a chat-style AI search that filters by
                budget, must-haves, and neighborhood preferences in seconds.
              </p>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Helpful Tools for Renting at {tower.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <Link
                  href="/tools/net-effective-rent-calculator"
                  className="text-primary underline underline-offset-2"
                >
                  Net-effective rent calculator
                </Link>{" "}
                — convert a Hudson Yards &quot;1 month free on a 13-month
                lease&quot; offer into the actual monthly cost you&apos;ll pay,
                and into the gross rent that anchors your renewal.
              </p>
              <p>
                <Link
                  href="/tools/nyc-affordability-calculator"
                  className="text-primary underline underline-offset-2"
                >
                  NYC affordability calculator
                </Link>{" "}
                — check whether your income clears the 40x-rent rule that{" "}
                {tower.developer} (and most NYC landlords) use, or how much
                guarantor income you need.
              </p>
              <p>
                <Link
                  href="/tools/fare-act-broker-fee-checker"
                  className="text-primary underline underline-offset-2"
                >
                  FARE Act broker-fee checker
                </Link>{" "}
                — confirm whether a specific {tower.name} listing should be
                no-fee under the June 2025 FARE Act.
              </p>
              <p>
                <Link
                  href="/tools/move-in-cost-estimator"
                  className="text-primary underline underline-offset-2"
                >
                  NYC move-in cost estimator
                </Link>{" "}
                — full upfront-cost breakdown (first month, security, broker
                fee if any, movers).
              </p>
            </CardContent>
          </Card>

          {/* Related pages */}
          <Card>
            <CardHeader>
              <CardTitle>Related Reading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <Link
                  href="/nyc/chelsea/rent-prices"
                  className="text-primary underline underline-offset-2"
                >
                  Chelsea rent prices (2026)
                </Link>{" "}
                — full sub-area rent breakdown including the Hudson Yards
                tower tier and the High Line premium.
              </p>
              <p>
                <Link
                  href="/best-time-to-rent-nyc"
                  className="text-primary underline underline-offset-2"
                >
                  Best time to rent in NYC
                </Link>{" "}
                — when {tower.developer} and other Hudson Yards landlords
                typically offer the deepest concessions.
              </p>
              <p>
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  NYC FARE Act broker-fee ban explained
                </Link>{" "}
                — what changed in June 2025 and how it applies to
                Hudson-Yards-tier rentals.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
