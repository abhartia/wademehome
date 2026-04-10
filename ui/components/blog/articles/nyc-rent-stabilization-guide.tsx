import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import Link from "next/link";

export default function NycRentStabilizationGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What is rent stabilization in NYC?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rent stabilization is a regulatory system that limits how much landlords
            can raise rent on approximately one million apartments across New York
            City&apos;s five boroughs. Each year, the NYC Rent Guidelines Board sets
            the maximum allowable increase for lease renewals. The system has been in
            place since 1969 and covers buildings with six or more units that were
            built between February 1, 1947, and January 1, 1974, as well as newer
            buildings that received tax abatements such as 421-a or J-51.
          </p>
          <p>
            If your apartment is rent stabilized, your landlord cannot raise your
            rent beyond the guideline percentage when you renew your lease. You also
            have the right to a lease renewal and cannot be evicted without just
            cause. Understanding whether your apartment qualifies—and what your
            rights are—can save you thousands of dollars a year.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rent stabilization vs. rent control: what&apos;s the difference?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong>Rent stabilization</strong> covers roughly one million units in
            NYC. Rents are adjusted annually by the Rent Guidelines Board, and
            tenants have the right to renew their leases. Most regulated apartments
            in the city fall under this category.
          </p>
          <p>
            <strong>Rent control</strong> is an older and much stricter form of
            regulation that covers only about 24,000 apartments. These units are
            generally occupied by tenants (or their family members) who have lived in
            buildings with three or more units continuously since before July 1, 1971.
            Rent increases are governed by the Maximum Base Rent system rather than
            the Rent Guidelines Board.
          </p>
          <p>
            In practice, if you&apos;re searching for a new apartment today, the
            regulated unit you find will almost certainly be rent stabilized, not rent
            controlled. Rent-controlled apartments rarely turn over because tenants
            have strong incentives to keep them.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2025&ndash;2026 rent guidelines: how much can your landlord raise rent?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            For rent-stabilized leases beginning between October 1, 2025, and
            September 30, 2026, the Rent Guidelines Board approved:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>One-year lease renewal:</strong> 3% increase
            </li>
            <li>
              <strong>Two-year lease renewal:</strong> 4.5% increase
            </li>
          </ul>
          <p>
            These percentages apply to your current legal regulated rent. For example,
            if your stabilized rent is $2,000 per month, a one-year renewal would
            raise it to $2,060, and a two-year renewal to $2,090 per month. Your
            landlord cannot charge more than the guideline increase unless they have
            approval for an Individual Apartment Improvement (IAI) surcharge or a
            Major Capital Improvement (MCI) increase.
          </p>
          <p>
            The Rent Guidelines Board meets every spring to vote on new guidelines.
            Historically, increases have ranged from 0% (a rent freeze, which happened
            in 2015 and 2016) to over 5% in years with high inflation.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to check if your apartment is rent stabilized</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Landlords are required to provide a rent stabilization rider with your
            lease, but not all do. Here are reliable ways to check:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Check your lease.</strong> Look for a rent stabilization lease
              rider or addendum. Your rent may appear as an irregular number (such as
              $2,176.43 rather than a round figure) because it reflects guideline
              increases applied over years.
            </li>
            <li>
              <strong>Request your rent history.</strong> File a request with the NYS
              Division of Housing and Community Renewal (DHCR) to get a complete
              history of registered rents for your apartment. You can do this online
              through the DHCR portal or by calling 718-739-6400.
            </li>
            <li>
              <strong>Check the building registration.</strong> The DHCR maintains a
              database of registered rent-stabilized buildings. Search your building
              address on the Rent Stabilization Association or the NYC Automated City
              Register Information System (ACRIS).
            </li>
            <li>
              <strong>Call 311.</strong> Ask for the Tenant Helpline. The NYC
              Tenant Support Unit can help determine your stabilization status and
              check if you are being overcharged.
            </li>
          </ol>
          <p>
            If your building received a 421-a or J-51 tax benefit, your apartment
            may be stabilized even if it was built after 1974. Check whether the
            building has an active tax abatement through the NYC Department of Finance
            property records.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your rights as a rent-stabilized tenant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Right to a lease renewal.</strong> Your landlord must offer you a
              renewal lease 90 to 150 days before your current lease expires. You have
              60 days to accept it.
            </li>
            <li>
              <strong>Limited rent increases.</strong> Your rent can only go up by the
              guideline percentage set by the Rent Guidelines Board each year.
            </li>
            <li>
              <strong>Protection from eviction.</strong> You can only be evicted for
              specific causes defined by law, such as non-payment of rent or using the
              apartment for illegal purposes.
            </li>
            <li>
              <strong>Succession rights.</strong> If you move out or pass away, a
              family member who has lived with you for at least two years (one year for
              seniors or disabled tenants) may succeed to your lease.
            </li>
            <li>
              <strong>Right to essential services.</strong> Your landlord must maintain
              all services that were provided when you moved in, including heat, hot
              water, and building maintenance.
            </li>
            <li>
              <strong>Right to file complaints.</strong> You can file overcharge
              complaints with the DHCR if you believe your rent exceeds the legal
              regulated amount.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common ways tenants lose rent stabilization protections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Before the Housing Stability and Tenant Protection Act of 2019,
            apartments could be deregulated when the legal rent crossed a high-rent
            threshold (currently $2,900 to $2,950 depending on the year) and the unit
            became vacant. The 2019 law closed most of these loopholes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>High-rent vacancy deregulation:</strong> eliminated in 2019.
              Apartments no longer leave stabilization when rent crosses a threshold.
            </li>
            <li>
              <strong>Luxury decontrol:</strong> eliminated in 2019 for both vacant and
              occupied apartments.
            </li>
            <li>
              <strong>421-a or J-51 expiration:</strong> if the building&apos;s tax
              benefit expires and the rent has crossed the deregulation threshold, the
              apartment could still be destabilized. This is the main remaining path
              to deregulation.
            </li>
            <li>
              <strong>Condo and co-op conversions:</strong> when a building converts,
              existing tenants keep stabilization, but once they leave, the unit may be
              deregulated.
            </li>
          </ul>
          <p>
            The bottom line: since 2019, it is much harder for landlords to remove
            apartments from rent stabilization. If your apartment is currently
            stabilized, it is very likely to remain so.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to find a rent-stabilized apartment in NYC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rent-stabilized apartments are not always labeled as such on listing sites.
            Here are strategies to find them:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Search buildings built between 1947 and 1974.</strong> Buildings
              with six or more units from this era are very likely to be stabilized.
              Pre-war and mid-century buildings in neighborhoods like the Upper West
              Side, Washington Heights, Astoria, and Park Slope often qualify.
            </li>
            <li>
              <strong>Look for 421-a buildings.</strong> Newer luxury developments that
              received 421-a tax abatements must keep a portion of units rent
              stabilized for the duration of the benefit (typically 25 to 35 years).
            </li>
            <li>
              <strong>Use WadeMeHome&apos;s AI search.</strong> Describe what you&apos;re
              looking for — including budget, neighborhood, and preferences — and our
              AI agent will find matching listings from real NYC inventory. You can
              ask specifically about stabilized units and we&apos;ll factor that into
              your search.
            </li>
            <li>
              <strong>Ask the broker or landlord directly.</strong> Before signing a
              lease, ask whether the unit is rent stabilized. Under NYC law, landlords
              must provide a rent stabilization rider if the unit qualifies.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What to do if you think you&apos;re being overcharged</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Rent overcharges are more common than most tenants realize. If your rent
            increased by more than the guideline amount, or if your apartment was
            destabilized improperly, you may be owed a refund plus interest.
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Get your rent history</strong> from the DHCR. This document shows
              every registered rent for your apartment and any increases applied.
            </li>
            <li>
              <strong>Compare the rent history to guideline increases.</strong> Add up
              the allowable increases year by year. If the current registered rent is
              higher than what the guidelines allow, you may have an overcharge.
            </li>
            <li>
              <strong>File a complaint with the DHCR.</strong> You can file an
              overcharge complaint within four years of the overcharge (six years under
              certain circumstances). The DHCR will investigate and can order the
              landlord to refund excess rent with interest.
            </li>
            <li>
              <strong>Contact a tenant rights organization.</strong> Groups like the
              Met Council on Housing, Legal Aid Society, and Housing Court Help Centers
              offer free assistance.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently asked questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong>Can my landlord refuse to renew my rent-stabilized lease?</strong>
            <br />
            No. Landlords are required by law to offer a renewal lease 90 to 150 days
            before your current lease expires. If they fail to do so, you can file a
            complaint with the DHCR.
          </p>
          <p>
            <strong>Does rent stabilization apply to all NYC apartments?</strong>
            <br />
            No. It applies primarily to buildings with six or more units built before
            1974, and to newer buildings with certain tax abatements. Small buildings,
            condos, and co-ops are generally not stabilized.
          </p>
          <p>
            <strong>Can I sublet a rent-stabilized apartment?</strong>
            <br />
            Yes, with your landlord&apos;s written permission. You can sublet for up to
            two years out of any four-year period. Your landlord can charge a 10%
            surcharge on the regulated rent during the sublet period.
          </p>
          <p>
            <strong>What happens if my building&apos;s 421-a benefit expires?</strong>
            <br />
            Under the 2019 law, apartments that were stabilized under 421-a generally
            remain stabilized after the benefit expires, unless the apartment was
            already above the deregulation threshold when the benefit ended. This area
            of law is evolving, so check with a tenant attorney if you&apos;re in this
            situation.
          </p>
          <p>
            <strong>Are rent increases cumulative?</strong>
            <br />
            Yes. Each year&apos;s guideline increase is applied on top of the previous
            year&apos;s legal rent. Over many years, even small percentage increases
            compound significantly.
          </p>
          <p>
            <strong>Can my landlord add Individual Apartment Improvement (IAI) surcharges?</strong>
            <br />
            Yes, but the 2019 law capped IAI increases. Landlords can add up to $15,000
            in improvement costs over any 15-year period. The monthly surcharge is
            calculated by dividing the cost by a factor set by the DHCR (currently 180
            for buildings with 35 or fewer units, 150 for larger buildings).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources for NYC rent-stabilized tenants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>NYC Tenant Helpline:</strong> call 311 and ask for the Tenant
              Support Unit
            </li>
            <li>
              <strong>NYS Division of Housing and Community Renewal (DHCR):</strong>{" "}
              718-739-6400, handles rent history requests and overcharge complaints
            </li>
            <li>
              <strong>NYC Rent Guidelines Board:</strong> publishes annual guidelines
              and meeting schedules
            </li>
            <li>
              <strong>Met Council on Housing:</strong> tenant hotline at 212-979-0611,
              free counseling
            </li>
            <li>
              <strong>Legal Aid Society:</strong> free legal representation for
              qualifying tenants
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Understanding your rent stabilization status is one of the most
            financially impactful things you can do as an NYC renter. Whether
            you&apos;re looking for a new stabilized apartment or confirming that your
            current rent is within legal limits, the resources above can help you
            protect your housing costs.
          </p>
          <p>
            Ready to search for apartments in NYC? Try{" "}
            <Link href="/" className="text-primary underline underline-offset-2">
              WadeMeHome&apos;s AI-powered apartment search
            </Link>{" "}
            to find listings that match your budget, neighborhood, and preferences.
            You can also explore our guides on{" "}
            <Link
              href="/nyc-rent-by-neighborhood"
              className="text-primary underline underline-offset-2"
            >
              NYC rent by neighborhood
            </Link>
            ,{" "}
            <Link
              href="/blog/nyc-fare-act-broker-fee-ban"
              className="text-primary underline underline-offset-2"
            >
              the FARE Act broker fee ban
            </Link>
            , and{" "}
            <Link
              href="/blog/negotiating-rent-and-lease-terms"
              className="text-primary underline underline-offset-2"
            >
              how to negotiate your lease renewal
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <ArticleCTA />
    </div>
  );
}
