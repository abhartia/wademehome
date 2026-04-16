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

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "How to Find an Apartment in NYC | Wade Me Home",
  description:
    "Everything you need to know about finding an apartment in New York City. Timing, broker fees, required documents, income requirements, and how to move fast.",
  openGraph: {
    title: "How to Find an Apartment in NYC | Wade Me Home",
    description:
      "Everything you need to know about finding an apartment in New York City. Timing, broker fees, required documents, income requirements, and how to move fast.",
    url: `${baseUrl}/nyc-apartment-search-guide`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Find an Apartment in NYC",
  description:
    "A comprehensive guide to apartment searching in New York City, covering timing, broker fees, documents, income requirements, and strategies for a competitive market.",
  publisher: {
    "@type": "Organization",
    name: "Wade Me Home",
    url: baseUrl,
  },
};

export default function NYCApartmentSearchGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
              { "@type": "ListItem", position: 2, name: "Guides", item: `${baseUrl}/blog` },
              { "@type": "ListItem", position: 3, name: "NYC Apartment Search Guide", item: `${baseUrl}/nyc-apartment-search-guide` },
            ],
          }),
        }}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          <header className="space-y-3">
            <Badge variant="outline">Apartment search</Badge>
            <h1 className="text-3xl font-bold tracking-tight">
              How to Find an Apartment in NYC
            </h1>
            <p className="text-sm text-muted-foreground">
              Finding an apartment in New York City is a skill unto itself. The
              market moves fast, the paperwork is extensive, and the competition
              is relentless. Whether you are moving to the city for the first
              time or just switching neighborhoods, this guide covers everything
              from search timing to application strategy.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>When to Search</CardTitle>
              <CardDescription>
                Timing matters more than you think
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The NYC rental market has a pronounced seasonal cycle. Peak
                season runs roughly from May through September, when inventory
                is highest but so is competition. You will see the most
                listings during this window, but apartments go fast and
                landlords are less likely to negotiate on price. If you have
                flexibility on your move date, the off-peak months (November
                through February) often bring lower rents and more willing
                landlords, though inventory is thinner.
              </p>
              <p>
                Most apartments in NYC are listed 30 to 45 days before they
                become available. This means if you need to move on June 1, you
                should start actively searching in mid-April to early May. Start
                earlier than that and you will be looking at apartments that
                will be gone by the time you need them. Start later and the best
                options will already be taken.
              </p>
              <p>
                Inventory patterns also vary by day of the week. New listings
                tend to appear on weekdays, particularly Tuesday through
                Thursday. If you are serious about a specific neighborhood or
                price range, check listings daily and be prepared to schedule a
                viewing the same day a listing appears. In hot neighborhoods,
                apartments can receive multiple applications within 24 hours of
                being posted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Broker vs No-Fee vs Direct</CardTitle>
              <CardDescription>
                Understanding who you are paying and why
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                In a broker-fee apartment, the tenant pays a broker commission,
                typically 12 to 15 percent of the annual rent (one month&apos;s
                rent being the most common). On a $3,000/month apartment, that
                is roughly $4,300 to $5,400 on top of your first month and
                security deposit. The broker represents the landlord, shows you
                the apartment, and processes your application. Whether that fee
                feels worth it depends on the apartment and your alternatives.
              </p>
              <p>
                No-fee apartments mean the landlord pays the broker commission
                instead of the tenant. These listings are genuinely free to the
                renter at signing, though the cost is sometimes baked into a
                slightly higher monthly rent. Still, no-fee deals save thousands
                upfront and are worth prioritizing if cash on hand is tight.
                The NYC FARE Act (effective June 2025) shifts broker fee
                responsibility to the party who hired the broker, which is
                reshaping how fees work across the market.
              </p>
              <p>
                Direct-from-landlord listings skip brokers entirely. Smaller
                landlords and some management companies list directly on their
                own websites or platforms. These apartments often have no broker
                fee and the application process can be simpler, though you lose
                the convenience of having someone coordinate viewings. Wade Me
                Home surfaces both brokered and direct listings so you can
                compare side by side.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents You Need Ready</CardTitle>
              <CardDescription>
                Have these in a folder before you start looking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                NYC rental applications are notoriously document-heavy. At a
                minimum, expect to provide three recent pay stubs, your most
                recent federal tax return (or the first two pages), two to three
                months of bank statements, a letter from your employer
                confirming your position and salary, a government-issued photo
                ID, and references from your last one or two landlords.
              </p>
              <p>
                If you are self-employed, you will typically need two years of
                tax returns, a CPA letter confirming your income, and six months
                of bank statements. Some landlords also request a profit-and-loss
                statement. The bar is higher for self-employed applicants
                because income can be less predictable, so having clean, well-
                organized financials helps your application stand out.
              </p>
              <p>
                Prepare digital copies of everything. Most applications are now
                submitted online, and management companies use screening
                services that accept PDF uploads. Having everything scanned and
                organized in a cloud folder means you can submit an application
                within minutes of deciding you want a place. In a competitive
                market, being the first complete application can be the
                difference between getting the apartment and losing it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income Requirements</CardTitle>
              <CardDescription>
                The 40x rule and what to do if you fall short
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                The standard income requirement in NYC is that your gross annual
                income must be at least 40 times the monthly rent. For a $2,500
                apartment, that means you need to earn at least $100,000 per
                year. This ratio is not a suggestion; it is a hard threshold
                that most landlords and management companies enforce through
                their screening process.
              </p>
              <p>
                If your income falls below the 40x threshold, you have a few
                options. A guarantor (sometimes called a co-signer) is the most
                common solution. The guarantor typically needs to earn 80 times
                the monthly rent and be a resident of the tristate area (New
                York, New Jersey, or Connecticut), though some landlords accept
                out-of-state guarantors. Institutional guarantor services are
                another option and accept applicants from anywhere, usually
                for a fee of around one month&apos;s rent.
              </p>
              <p>
                Some landlords will accept alternative proofs of financial
                stability: a larger security deposit (where legally permitted),
                several months of rent paid upfront, or substantial liquid
                assets shown through bank statements. These arrangements vary
                by landlord and are more common with smaller, independent
                owners than with large management companies that have rigid
                screening criteria.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moving Fast in a Hot Market</CardTitle>
              <CardDescription>
                How to compete when everyone else wants the same apartment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                In competitive neighborhoods, you should be prepared to apply
                the same day you see an apartment. That means having all your
                documents ready, your application fee available (usually $20
                per applicant for a credit check, the legal maximum in New
                York), and a clear sense of your budget and deal-breakers. If
                you are on the fence, someone else will not be.
              </p>
              <p>
                Bring a checkbook or be ready to pay electronically. Many
                landlords require a good-faith deposit to hold an apartment
                while they process your application. This deposit is typically
                applied to your first month&apos;s rent or security deposit if
                you are approved. Know your maximum rent before you start
                looking and do not let the pressure of the moment push you
                above it.
              </p>
              <p>
                Responsiveness matters. If a broker or landlord emails you,
                reply immediately. If they ask for an additional document,
                provide it within the hour. Landlords are choosing between
                multiple qualified applicants, and the applicant who
                communicates fastest and most professionally often wins. Treat
                the apartment search like a job interview, because in NYC,
                that is essentially what it is.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Related guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>
                  <Link
                    href="/blog/apartment-search-tips"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Apartment Search Tips
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/rental-application-screening-basics"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Rental Application Screening Basics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/credit-and-rental-applications"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Credit and Rental Applications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/guarantors-and-co-signers"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Guarantors and Co-Signers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/broker-fees-and-upfront-costs"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Broker Fees and Upfront Costs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/nyc-fare-act-broker-fee-ban"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Broker Fee Ban (FARE Act) Explained
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-rent-by-neighborhood"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Rent by Neighborhood Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-apartment-movers"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Apartment Movers Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nyc-moving-checklist"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    NYC Moving Checklist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-time-to-rent-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Best Time to Rent in NYC: Month-by-Month Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cost-of-moving-to-nyc"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Cost of Moving to NYC: Full Budget Breakdown
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Start your apartment search
              </Link>
            </Button>
          </div>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Looking for a place to rent?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Start on the home page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
