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
import { BrokerFeeLawTimeline } from "@/components/fare-act/BrokerFeeLawTimeline";
import { NeighborhoodLiveListings } from "@/components/neighborhoods/NeighborhoodLiveListings";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title:
    "No Fee Apartments NYC (2026): Post-FARE Act Guide to Broker-Fee-Free Rentals | Wade Me Home",
  description:
    "What 'no fee apartment' means in NYC after the FARE Act took effect on June 11, 2025. Real 2026 guide: which listings are legally no-fee, how to spot a tenant-side fee disguised as a marketing fee, what to do if a broker still demands a fee, and where the deepest no-fee inventory actually sits.",
  keywords: [
    "no fee apartments nyc",
    "no fee apartments new york",
    "no fee apartments manhattan",
    "no fee apartments brooklyn",
    "no fee apartments queens",
    "no broker fee nyc",
    "no broker fee apartments",
    "fare act no fee",
    "nyc apartments no broker fee",
    "no fee studios nyc",
    "no fee 1 bedroom nyc",
    "no fee rental nyc",
    "tenant paid no broker fee nyc",
    "fare act 2025",
    "fare act 2026",
    "broker fee ban nyc",
    "nyc no fee listings",
    "no fee landlord paid broker nyc",
    "directly from landlord nyc",
    "rent without broker fee nyc",
    "nyc broker fee law",
    "nyc broker fee law 2025",
    "nyc broker fee law 2026",
    "nyc broker fee law timeline",
    "FARE Act timeline",
    "FARE Act effective date",
    "FARE Act passage date",
    "FARE Act 2024 passage",
    "is my lease covered by FARE Act",
    "REBNY lawsuit FARE Act",
    "DCWP repeat offender broker fee",
    "Local Law 169 of 2024",
  ],
  openGraph: {
    title:
      "No Fee Apartments NYC (2026): Post-FARE Act Guide",
    description:
      "Since June 11, 2025 the landlord pays the broker — so what 'no fee' really means now, and where the deepest no-fee inventory sits.",
    url: `${baseUrl}/nyc/no-fee-apartments`,
    type: "article",
  },
  alternates: { canonical: `${baseUrl}/nyc/no-fee-apartments` },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "No Fee Apartments NYC (2026): Post-FARE Act Guide to Broker-Fee-Free Rentals",
    description:
      "What 'no fee' actually means in NYC under the FARE Act, where the deepest no-fee inventory sits, and how to verify before signing.",
    datePublished: "2026-04-26",
    dateModified: "2026-05-01",
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
    mainEntityOfPage: `${baseUrl}/nyc/no-fee-apartments`,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all NYC apartments no-fee in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Effectively yes for any apartment listed by a broker the landlord hired. The FARE Act took effect June 11, 2025 and shifted the broker fee to whoever hired the broker — meaning if the landlord listed the apartment with a broker, the tenant cannot legally be charged a broker fee. The fee can only land on the tenant if the tenant separately hired a buyer's-side broker to find an apartment for them. Practically, the vast majority of public NYC rental listings are now no-fee from the renter's perspective. The exceptions are: (1) tenant-hired broker arrangements, (2) sub-leases where a tenant is brokering their own departure, and (3) niche cases like furnished short-term rentals.",
        },
      },
      {
        "@type": "Question",
        name: "Did the FARE Act actually reduce broker fees in NYC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, but with measurable rent-side adjustment. As of April 2026, roughly 1,500+ DCWP complaints have been filed in the law's first year and the city has issued first-round fines (~$2,000 per violation, escalating with repeat offenders). The headline impact: tenants no longer pay the typical 12–15% broker fee on landlord-listed rentals. The countervailing impact: many landlords raised asking rents 5–7% in late 2025 to recoup what they used to pass through. Net for the renter: still meaningfully better — a 12–15% upfront fee is much heavier than a 5–7% spread-over-12-months rent bump, especially on shorter stays.",
        },
      },
      {
        "@type": "Question",
        name: "What's the difference between 'no fee' and 'landlord paid'?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Functionally for a renter, there is no difference under the FARE Act. 'No fee' means the tenant doesn't pay a broker fee at signing. 'Landlord paid' means the landlord is paying the broker (because the landlord hired the broker). Both descriptions are legally compliant and accurate. Some listings still use older language like 'OP' (owner pays) or 'NO BROKER FEE' — they all mean the same thing post-FARE Act. What you should verify: (a) no broker fee on your move-in cost sheet, and (b) no separate 'marketing fee', 'listing fee', or 'application processing fee' over the lawful $20 application fee cap.",
        },
      },
      {
        "@type": "Question",
        name: "Can a NYC landlord charge a 'marketing fee' or 'admin fee' instead?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The FARE Act prohibits passing the broker fee through under any name — 'marketing fee', 'listing fee', 'lease prep fee', etc. The only fees a landlord can legally charge a residential tenant in NYC at signing are: (a) first month's rent, (b) one month's security deposit (capped by the Housing Stability and Tenant Protection Act of 2019), (c) up to $20 in application/credit-check fees, and (d) move-in/move-out fees only if the building's condo or co-op rules require them and they apply equally to all tenants. Anything else — particularly anything called a 'fee' tied to the broker or the listing — is a FARE Act violation. File a DCWP complaint at on.nyc.gov/fareact.",
        },
      },
      {
        "@type": "Question",
        name: "How do I find no-fee NYC apartments in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three approaches: (1) Search any major rental site — most listings are now no-fee by default after the FARE Act, so the 'no fee' filter mostly identifies listings the landlord hired a broker to advertise (vs. self-listed). (2) Search direct from landlords for the deepest savings — large landlords like Stonehenge NYC, A&E Real Estate, Glenwood Management, Related Rentals, and the new-construction lease-up offices typically don't use brokers at all. (3) Use a tenant concierge that aggregates landlord-direct listings (like Wade Me Home) — same inventory without the broker layer. Watch for properties where a broker is involved 'on behalf of the landlord' but the listing is technically no-fee — these are still legitimate, and the broker's services (touring, application help, lease review) come at no cost to you.",
        },
      },
      {
        "@type": "Question",
        name: "Does the FARE Act apply to renewals or only new leases?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lease renewals don't typically involve a broker, so the FARE Act has no direct effect on a renewal. The Act applies whenever a broker is involved in a rental transaction — the question is who hired the broker. On a renewal you're dealing directly with your existing landlord, no broker, and there's no fee to begin with. The Act does apply to transfers (e.g., moving from one unit to another in the same building) when a broker handles the placement.",
        },
      },
      {
        "@type": "Question",
        name: "Does the FARE Act apply in Hoboken, Jersey City, or Newark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The FARE Act is a New York City local law and applies only to rentals within the five boroughs of NYC. Hoboken, Jersey City, Newark, and the rest of New Jersey are governed by separate state and municipal rules. NJ has historically had broker-fee norms much closer to direct-from-landlord (broker fees are uncommon in JC and Hoboken) and many large NJ landlords self-list without a broker. The cross-river renter still gets broker-fee-free outcomes most of the time, just under different rules.",
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
        name: "No Fee Apartments",
        item: `${baseUrl}/nyc/no-fee-apartments`,
      },
    ],
  },
];

export default function NoFeeApartmentsPage() {
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
              <Badge variant="outline">Post-FARE Act</Badge>
              <Badge className="bg-emerald-600">
                Effective June 11, 2025 · still in force 2026
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              No Fee Apartments NYC (2026): Post-FARE Act Guide to Broker-Fee-Free
              Rentals
            </h1>
            <p className="text-sm text-muted-foreground">
              Since June 11, 2025, the FARE Act has shifted the broker fee in
              NYC to whoever hires the broker — meaning landlord-listed
              apartments cannot charge the tenant a broker fee. This is what
              that means in practice in 2026: which listings really are
              no-fee, how to spot a fee disguised as a &ldquo;marketing
              charge,&rdquo; where the deepest no-fee inventory sits, and what
              to do if a broker tries to charge you anyway.
            </p>
            <p className="text-xs text-muted-foreground">
              Last reviewed 2026-05-01 &middot; Written by the Wade Me
              Home research team. The FARE Act is now in its
              <strong> repeat-offender enforcement era</strong> — DCWP
              issued the first $5,000 enhanced penalty on January 15, 2026
              after a midtown brokerage was caught charging a $4,200
              &ldquo;marketing fee&rdquo; on a landlord-listed Murray
              Hill unit despite a prior $1,000 violation in October 2025.
              See the full law timeline below.
            </p>
          </header>

          <NeighborhoodLiveListings
            neighborhoodName="No Fee NYC"
            latitude={40.7484}
            longitude={-73.9967}
            radiusMiles={6}
            limit={9}
            searchQuery="No fee NYC apartments"
          />

          <Card>
            <CardHeader>
              <CardTitle>The FARE Act in 60 Seconds</CardTitle>
              <CardDescription>
                What changed on June 11, 2025 and why every NYC rental
                conversation now starts here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The Fairness in Apartment Rental Expenses (FARE) Act
                (Local Law 89 of 2024) made the long-standing NYC broker-fee
                norm illegal: prior practice had the renter pay 12–15% of
                annual rent (roughly one month or more) to the broker the
                landlord hired. Effective June 11, 2025, only the party that
                hires the broker pays — meaning landlord-listed rentals
                cannot legally charge the tenant.
              </p>
              <p>
                Practical effect in 2026: the overwhelming majority of public
                NYC rental listings are now no-fee from the renter&apos;s
                perspective. The Act applies to all five boroughs (Manhattan,
                Brooklyn, Queens, Bronx, Staten Island). It does not apply
                across the river in Hoboken, Jersey City, or Newark — see our{" "}
                <Link
                  href="/blog/nyc-fare-act-broker-fee-ban"
                  className="text-primary underline underline-offset-2"
                >
                  full FARE Act guide
                </Link>{" "}
                for mechanics, exemptions, and the 2026 update on enforcement.
              </p>
            </CardContent>
          </Card>

          {/* Broker Fee Law Timeline — embedded May 2026 */}
          <BrokerFeeLawTimeline />

          <Card>
            <CardHeader>
              <CardTitle>What Counts as &ldquo;No Fee&rdquo;</CardTitle>
              <CardDescription>
                The complete list of legitimate move-in costs in 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Charge</TableHead>
                    <TableHead>Legal in 2026</TableHead>
                    <TableHead>Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">First month&apos;s rent</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>One month</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Security deposit</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>One month max (HSTPA 2019)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Application/credit-check fee</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>$20 max</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Broker fee (landlord-hired broker)</TableCell>
                    <TableCell className="text-rose-600 font-semibold">No</TableCell>
                    <TableCell>FARE Act prohibits</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing / listing / lease-prep fee</TableCell>
                    <TableCell className="text-rose-600 font-semibold">No</TableCell>
                    <TableCell>FARE Act prohibits</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Last month&apos;s rent</TableCell>
                    <TableCell className="text-amber-600 font-semibold">Negotiable</TableCell>
                    <TableCell>
                      Common but not legally required
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Move-in / move-out fee</TableCell>
                    <TableCell className="text-amber-600 font-semibold">Conditional</TableCell>
                    <TableCell>
                      Only if condo/co-op rules require, applied equally
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pet deposit</TableCell>
                    <TableCell className="text-rose-600 font-semibold">No</TableCell>
                    <TableCell>
                      HSTPA prohibits separate pet deposits
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Broker fee (tenant-hired broker)</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>
                      Negotiated between tenant and broker
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="mt-4 text-xs text-muted-foreground">
                Total legitimate upfront cost on a $3,000/mo no-fee NYC rental:
                $3,000 (1st) + $3,000 (security) + $20 (app fee) = $6,020.
                Any line beyond that — particularly anything called a
                &ldquo;fee&rdquo; — is worth questioning before signing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Where the Deepest No-Fee Inventory Sits</CardTitle>
              <CardDescription>
                Landlord categories that have always self-listed (highest
                no-fee yield) vs. the broker-heavy tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Landlord Type</TableHead>
                    <TableHead>No-Fee Yield</TableHead>
                    <TableHead>Where to Look</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Large institutional landlords
                    </TableCell>
                    <TableCell>Very high (~95%)</TableCell>
                    <TableCell>
                      Stonehenge NYC, Glenwood Management, A&amp;E Real
                      Estate, Related Rentals, Brookfield, Equity Residential
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      New-con lease-up
                    </TableCell>
                    <TableCell>Very high (~95%)</TableCell>
                    <TableCell>
                      On-site lease-up office at any post-2020 tower
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Small landlords (1–4 buildings)
                    </TableCell>
                    <TableCell>High (~80%)</TableCell>
                    <TableCell>
                      Direct outreach, Craigslist, neighborhood Facebook
                      groups
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Public listing sites with FARE-Act-compliant filters
                    </TableCell>
                    <TableCell>High (~85%)</TableCell>
                    <TableCell>
                      Major rental sites&apos; &ldquo;no fee&rdquo; toggle
                      now reliable
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Mid-size mom-and-pop landlords (5–50 buildings)
                    </TableCell>
                    <TableCell>Mixed (~60%)</TableCell>
                    <TableCell>
                      Often work with a single neighborhood broker; ask
                      whether the broker is landlord-paid before signing
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Tenant-hired buyer&apos;s-side brokers
                    </TableCell>
                    <TableCell>By definition fee</TableCell>
                    <TableCell>
                      Engage only if the broker delivers value the listing
                      sites don&apos;t (off-market access, white-glove
                      coordination, niche luxury or commercial)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spotting a Disguised Fee</CardTitle>
              <CardDescription>
                The most common ways a broker fee shows up under a different
                name in 2026
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>&ldquo;Marketing fee&rdquo; on the move-in
                  sheet.</strong> A FARE Act violation. The broker fee cannot
                  be re-labeled as a marketing fee. File a DCWP complaint
                  before paying.
                </li>
                <li>
                  <strong>&ldquo;Application processing fee&rdquo; over
                  $20.</strong> NYS caps tenant-screening fees at $20.
                  Anything higher is unlawful regardless of FARE Act framing.
                </li>
                <li>
                  <strong>&ldquo;Lease prep&rdquo; or &ldquo;legal fee&rdquo;
                  on the move-in sheet.</strong> Generally not allowed unless
                  rare condo/co-op exceptions apply. Push back.
                </li>
                <li>
                  <strong>&ldquo;Broker engagement letter&rdquo; presented
                  after touring.</strong> Some brokers will hand the renter a
                  document at touring saying the renter has retained the
                  broker. Don&apos;t sign anything that retains a broker on
                  your behalf unless you&apos;re actually engaging the broker
                  to find apartments for you (not just the one you&apos;re
                  touring).
                </li>
                <li>
                  <strong>&ldquo;Move-in fee&rdquo; on a non-condo
                  rental.</strong> Move-in fees are conditional — they require
                  building rules that apply equally to all tenants. A
                  &ldquo;move-in fee&rdquo; on a rental walkup is suspicious.
                </li>
                <li>
                  <strong>Asking rent quietly raised 5–7%.</strong> Legal but
                  worth recognizing. Many landlords baked the former broker
                  fee into the asking rent in late 2025. Compare the rental
                  to comps in the same building from before June 11, 2025 if
                  StreetEasy history shows it.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What to Do If a Broker Demands a Fee Anyway</CardTitle>
              <CardDescription>
                The DCWP complaint process and your enforcement options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>Get the demand in writing.</strong> Text or email is
                  ideal. A verbal demand is harder to enforce. If a broker
                  insists verbally, follow up with &ldquo;just to confirm in
                  writing — you&apos;re saying I owe a $X broker fee on
                  [unit]?&rdquo;
                </li>
                <li>
                  <strong>Ask: who hired you?</strong> If the broker is
                  representing the landlord (LL hired you to find a tenant),
                  the FARE Act applies and the tenant cannot legally be
                  charged. Document the answer.
                </li>
                <li>
                  <strong>Don&apos;t pay.</strong> The Act prohibits the
                  charge. Paying then trying to recover is messier than
                  refusing in the first place. Be willing to walk if the
                  broker won&apos;t comply.
                </li>
                <li>
                  <strong>File a DCWP complaint.</strong> NYC Department of
                  Consumer and Worker Protection accepts FARE Act complaints
                  online at on.nyc.gov/fareact. Include the listing, the
                  broker&apos;s name and license number, the written demand,
                  and the date of contact. First-violation fines are
                  ~$1,000–$2,000 per incident, escalating with repeat
                  offenders.
                </li>
                <li>
                  <strong>Use the listing site&apos;s reporting flow.</strong>{" "}
                  Major rental sites have FARE Act compliance reporting flows
                  that can result in the listing being delisted and the
                  broker being suspended from the platform.
                </li>
                <li>
                  <strong>Use our verification tool.</strong>{" "}
                  <Link
                    href="/tools/fare-act-broker-fee-checker"
                    className="text-primary underline underline-offset-2"
                  >
                    Wade Me Home&apos;s FARE Act broker-fee checker
                  </Link>{" "}
                  walks through the same who-hired-the-broker decision tree
                  and flags whether a charge is lawful.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>No-Fee NYC Hunting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong>The &ldquo;no fee&rdquo; filter is now baseline.</strong>{" "}
                  Most listings are no-fee post-FARE Act. The filter mostly
                  identifies listings the landlord hired a broker for vs.
                  self-listed. Either way, no fee for you.
                </li>
                <li>
                  <strong>Direct from landlord saves the most.</strong> The
                  rent itself tends to be 5–7% lower from a self-listed large
                  landlord than from the same landlord through a broker, even
                  post-FARE Act. The broker still charges the landlord, and
                  that cost makes its way into asking rent.
                </li>
                <li>
                  <strong>New-construction lease-up is the deepest no-fee
                  inventory.</strong> Post-2020 towers run their own on-site
                  leasing offices. Expect 1–2 months of free rent as a
                  concession on top of no fee.
                </li>
                <li>
                  <strong>Verify on the move-in cost sheet, not just the
                  listing.</strong> &ldquo;No fee&rdquo; in the listing
                  description is meaningless if the cost sheet has a
                  &ldquo;marketing fee&rdquo; line. Always get the full
                  itemized move-in cost sheet before signing.
                </li>
                <li>
                  <strong>Ask explicitly: &ldquo;What do I owe at lease
                  signing?&rdquo;</strong> Compare the answer to the table
                  above. The legitimate sum is rent + security + $20.
                  Anything else is worth questioning.
                </li>
                <li>
                  <strong>Hoboken and Jersey City are different.</strong> The
                  FARE Act doesn&apos;t apply across the river. NJ has its
                  own rules; broker fees are uncommon in JC and Hoboken in
                  practice (most large landlords self-list), but the legal
                  framework is different.
                </li>
                <li>
                  <strong>Last-month rent is often negotiable.</strong> Some
                  landlords still ask for last month&apos;s rent at signing.
                  This is legal but not legally required. On a no-fee, your
                  position is stronger to push back.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Separator />

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <h2 className="text-xl font-bold">
                See live no-fee NYC apartments
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Tell our concierge your neighborhood, budget, and unit size
                — every result we surface is verified no-fee under the FARE
                Act, with an itemized move-in cost preview.
              </p>
              <Button asChild size="lg">
                <Link href="/search?q=No+fee+NYC+apartments">
                  Search No Fee NYC Apartments
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
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="text-primary underline underline-offset-2"
                  >
                    Full FARE Act &amp; Broker Fees Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/fare-act-broker-fee-checker"
                    className="text-primary underline underline-offset-2"
                  >
                    FARE Act Broker-Fee Checker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/move-in-cost-estimator"
                    className="text-primary underline underline-offset-2"
                  >
                    NYC Move-In Cost Estimator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/cheap-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    Cheap NYC Apartments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc/luxury-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    Luxury NYC Apartments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/security-deposits-move-in-fees"
                    className="text-primary underline underline-offset-2"
                  >
                    Security Deposits &amp; Move-In Fees
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
                <li>
                  <Link
                    href="/nyc/upper-west-side/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    No-Fee Upper West Side Apartments (May 2026): FARE Act
                    Inventory Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoboken/no-fee-apartments"
                    className="text-primary underline underline-offset-2"
                  >
                    No-Fee Hoboken Apartments (May 2026): Landlord-Direct
                    Inventory (+136.7% YoY)
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
