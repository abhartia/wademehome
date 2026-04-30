import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { RentStabilizationChecker } from "@/components/rent-stab/RentStabilizationChecker";
import { RGBRenewalCalculator } from "@/components/rent-stab/RGBRenewalCalculator";
import Link from "next/link";

export default function NycRentStabilizationGuide() {
  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle>April 2026 update: what&apos;s changed since the last review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong>RGB pre-vote watch:</strong> The next Rent Guidelines Board
            preliminary vote is in early May 2026, with the final vote in
            mid-to-late June. Staff projections for the 2026–2027 cycle (leases
            starting October 1, 2026) currently point at roughly 2.75%–4.5% for
            1-year renewals and 4.5%–6.0% for 2-year renewals — broadly in line
            with the 2025–2026 cycle. Final numbers always shift between
            preliminary and final votes.
          </p>
          <p>
            <strong>FARE Act intersection:</strong> The Fairness in Apartment
            Rentals Act took full effect on June 11, 2025. For stabilized
            tenants this means the landlord cannot pass a broker fee onto you,
            even on a renewal where the landlord uses a broker for re-leasing
            adjacent vacant units. See our{" "}
            <Link href="/blog/nyc-fare-act-broker-fee-ban" className="text-primary underline">
              FARE Act guide
            </Link>{" "}
            for the full breakdown.
          </p>
          <p>
            <strong>HSTPA enforcement update:</strong> Through Q1 2026, DHCR has
            issued ~1,800 overcharge orders since HSTPA 2019 took effect, with
            the median overcharge refund now ~$8,400 plus interest. Long-tenured
            stabilized renters who never ordered a rent history are still the
            single largest population of likely-overcharge cases — order yours
            for free at hcr.ny.gov.
          </p>
        </CardContent>
      </Card>

      <RentStabilizationChecker />

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
            in 2015 and 2016) to over 5% in years with high inflation. See the full
            historical table below.
          </p>
        </CardContent>
      </Card>

      <Card id="nyc-annual-rent-increase-history">
        <CardHeader>
          <CardTitle>
            NYC Annual Rent Increase History (2015&ndash;2026): Full RGB Rate Table
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The table below shows the NYC annual rent increase percentages voted
            by the Rent Guidelines Board for every lease cycle from 2015 through
            the current 2025&ndash;2026 cycle. These are the legal maximum
            increases a landlord can apply at your lease renewal on a
            rent-stabilized apartment. Each cycle starts October 1 and runs
            through September 30 of the following year.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RGB Lease Cycle</TableHead>
                <TableHead className="text-right">1-Year Renewal</TableHead>
                <TableHead className="text-right">2-Year Renewal</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2015 &ndash; Sep 2016
                </TableCell>
                <TableCell className="text-right">0%</TableCell>
                <TableCell className="text-right">2%</TableCell>
                <TableCell>Rent freeze (1yr)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2016 &ndash; Sep 2017
                </TableCell>
                <TableCell className="text-right">0%</TableCell>
                <TableCell className="text-right">2%</TableCell>
                <TableCell>Second straight 1yr freeze</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2017 &ndash; Sep 2018
                </TableCell>
                <TableCell className="text-right">1.25%</TableCell>
                <TableCell className="text-right">2%</TableCell>
                <TableCell>End of rent-freeze era</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2018 &ndash; Sep 2019
                </TableCell>
                <TableCell className="text-right">1.5%</TableCell>
                <TableCell className="text-right">2.5%</TableCell>
                <TableCell>Pre-HSTPA baseline</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2019 &ndash; Sep 2020
                </TableCell>
                <TableCell className="text-right">1.5%</TableCell>
                <TableCell className="text-right">2.5%</TableCell>
                <TableCell>HSTPA takes effect mid-cycle</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2020 &ndash; Sep 2021
                </TableCell>
                <TableCell className="text-right">0%</TableCell>
                <TableCell className="text-right">
                  0% yr 1 / 1% yr 2
                </TableCell>
                <TableCell>COVID rent freeze</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2021 &ndash; Sep 2022
                </TableCell>
                <TableCell className="text-right">0% / 1.5%*</TableCell>
                <TableCell className="text-right">2.5%</TableCell>
                <TableCell>*0% first 6 mo, then 1.5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2022 &ndash; Sep 2023
                </TableCell>
                <TableCell className="text-right">3.25%</TableCell>
                <TableCell className="text-right">5%</TableCell>
                <TableCell>Largest increase in a decade</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2023 &ndash; Sep 2024
                </TableCell>
                <TableCell className="text-right">3%</TableCell>
                <TableCell className="text-right">2.75% / 3.2%*</TableCell>
                <TableCell>*Split: 2.75% yr 1, 3.2% yr 2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2024 &ndash; Sep 2025
                </TableCell>
                <TableCell className="text-right">2.75%</TableCell>
                <TableCell className="text-right">5.25%</TableCell>
                <TableCell>Inflation-anchored</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Oct 2025 &ndash; Sep 2026 (current)
                </TableCell>
                <TableCell className="text-right">3%</TableCell>
                <TableCell className="text-right">4.5%</TableCell>
                <TableCell>Current cycle</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p>
            Historical averages: the 1-year lease renewal increase has averaged
            roughly 1.6% per year across the last decade (dragged down by the
            2015&ndash;2016 freeze and the 2020 COVID freeze). The 2-year
            renewal has averaged roughly 2.8% per year. In high-inflation years
            (2022&ndash;2025), both tracks have trended above the 10-year mean.
          </p>
          <p>
            How to use the table: find the cycle your lease <em>renewal</em>
            falls into (not when you originally signed), and multiply your
            current legal regulated rent by (1 + the percentage). For the
            current 2025&ndash;2026 cycle, a $2,000 stabilized rent becomes
            $2,060 on a 1-year renewal and $2,090 on a 2-year renewal.
          </p>
          <p>
            The next Rent Guidelines Board vote is typically held in
            mid-to-late June. The 2026&ndash;2027 cycle rates will be announced
            at that time and will govern lease renewals starting October 1,
            2026.
          </p>
          <p className="text-xs italic">
            Rates above are the plain 1-year and 2-year renewal increases
            voted by the Rent Guidelines Board. They do not include Individual
            Apartment Improvement (IAI) surcharges, Major Capital Improvement
            (MCI) increases, or any fuel cost adjustments that may apply to
            specific buildings. Always verify your specific rent using your
            DHCR rent history.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            2026–2027 RGB forecast: what increase to expect for leases starting October 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The 2026–2027 cycle covers stabilized lease renewals starting
            between October 1, 2026 and September 30, 2027. The Rent Guidelines
            Board votes in two stages: a preliminary vote in early May, followed
            by a final vote in mid-to-late June. Below are the inputs the Board
            weighs and the staff-published ranges as of the April 2026 staff
            report.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Input</TableHead>
                <TableHead>Latest reading</TableHead>
                <TableHead>Direction vs. 2025</TableHead>
                <TableHead>Effect on increase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Price Index of Operating Costs (PIOC)
                </TableCell>
                <TableCell>+5.4% (April 2026 release)</TableCell>
                <TableCell>Up vs. +3.9% prior year</TableCell>
                <TableCell>Pushes increases higher</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Fuel costs (heating oil + gas)</TableCell>
                <TableCell>+2.1% YoY</TableCell>
                <TableCell>Modest up</TableCell>
                <TableCell>Marginal up</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Property tax (mostly Class 2)</TableCell>
                <TableCell>+4.0% effective</TableCell>
                <TableCell>Up</TableCell>
                <TableCell>Up</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Tenant household income</TableCell>
                <TableCell>+2.8% nominal</TableCell>
                <TableCell>Below inflation</TableCell>
                <TableCell>Pulls increases lower</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">CPI-W (NY-NJ region)</TableCell>
                <TableCell>+3.1% YoY</TableCell>
                <TableCell>Cooling</TableCell>
                <TableCell>Slight pull down</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Staff-modeled &ldquo;commensurate&rdquo; range
                </TableCell>
                <TableCell>2.75%–4.5% (1-yr) / 4.5%–6.0% (2-yr)</TableCell>
                <TableCell>Slightly above 2025</TableCell>
                <TableCell>Reference range only</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p>
            Three things to track between now and the June final vote: (1) the
            preliminary vote in early May, which usually sets the upper bound
            for the final vote; (2) DHCR&apos;s 2025 testimony from owners arguing
            for higher increases citing operating-cost stress; (3) tenant-side
            testimony in late May from groups like Met Council and Tenants PAC
            arguing for a freeze. The final vote almost always lands within the
            preliminary range and almost never above the staff-modeled
            &ldquo;commensurate&rdquo; upper bound. For 2026, lock-in 1-year planning at 4%
            and 2-year planning at 5.5% as a conservative ceiling.
          </p>
          <p>
            <strong>Practical timing implication:</strong> if your stabilized
            renewal lands in the October 2026 cycle and you have flexibility,
            the 2-year renewal at the 2025–2026 cycle (4.5%) is locked in for
            you only if your renewal anniversary is before October 1, 2026.
            Renewals after that date take the new 2026–2027 rate. If projections
            hold at 5.5% for 2-year, the two-year renewal you take this fall
            costs $1,200 more over the lease on a $2,000 base than waiting
            until October 2026 — but waiting risks a higher number. Most
            tenants signing now should default to the 2-year unless rent is
            already at a level they expect to leave at the next anniversary.
          </p>
        </CardContent>
      </Card>

      <RGBRenewalCalculator />

      <Card>
        <CardHeader>
          <CardTitle>
            IAI &amp; MCI math: when the legal rent jumps beyond the RGB rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The RGB percentage is the headline rate, but two other adjustments
            can lift your stabilized rent at lease renewal: Individual Apartment
            Improvement (IAI) surcharges and Major Capital Improvement (MCI)
            increases. Both were tightened by HSTPA 2019, but they remain the
            most common reason a stabilized rent rises above the simple RGB
            calculation.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adjustment</TableHead>
                <TableHead>Cap (2026)</TableHead>
                <TableHead>Monthly add</TableHead>
                <TableHead>Permanent?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  IAI — building 35 or fewer units
                </TableCell>
                <TableCell>$15,000 over any 15-yr period</TableCell>
                <TableCell>Cost ÷ 168 (post-2019)</TableCell>
                <TableCell>30-yr amortization, then drops off</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  IAI — building 36+ units
                </TableCell>
                <TableCell>$15,000 over any 15-yr period</TableCell>
                <TableCell>Cost ÷ 180 (post-2019)</TableCell>
                <TableCell>30-yr amortization, then drops off</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">MCI surcharge</TableCell>
                <TableCell>2% per year of legal rent (cap)</TableCell>
                <TableCell>Spread across all units in the building</TableCell>
                <TableCell>Now temporary (drops off in 30 yrs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Preferential rent rollback (HSTPA)
                </TableCell>
                <TableCell>Cannot revert to higher legal at renewal</TableCell>
                <TableCell>n/a</TableCell>
                <TableCell>Permanent protection for current tenant</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Vacancy bonus (eliminated)
                </TableCell>
                <TableCell>$0 (eliminated 2019)</TableCell>
                <TableCell>$0</TableCell>
                <TableCell>Removed from the rent-stab formula</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p>
            <strong>Worked example:</strong> Your stabilized 1-year renewal at
            $2,000 with the current 3% guideline takes the rent to $2,060. If
            the landlord legally completes a $9,000 IAI in a 36+ unit building,
            the IAI surcharge is $9,000 ÷ 180 = $50/mo, taking the rent to
            $2,110. If the building has an active MCI of 1.5% of legal rent,
            that adds another $30, bringing the renewal to $2,140 — a 7% lift
            vs. the headline 3% RGB. Always ask for the IAI itemization and the
            MCI order number; both are required to be disclosed.
          </p>
          <p>
            <strong>Common dispute:</strong> landlords sometimes apply IAI
            surcharges based on pre-2019 cost ÷ 60 or 84 divisors. Those
            divisors are no longer legal post-HSTPA. If the surcharge looks
            high, do the math: any IAI add that exceeds (cost ÷ 168 for ≤35
            units, cost ÷ 180 for 36+ units) is overcharged.
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
            calculated by dividing the cost by a factor set by the DHCR (currently 168
            for buildings with 35 or fewer units, 180 for larger buildings) and now
            drops off the rent after a 30-year amortization window.
          </p>
          <p>
            <strong>What is the 2026–2027 RGB rate going to be?</strong>
            <br />
            The 2026–2027 cycle covers leases starting October 1, 2026. The
            preliminary RGB vote happens in early May 2026 and the final vote
            in mid-to-late June. Staff projections as of April 2026 point at
            roughly 2.75%–4.5% (1-year) and 4.5%–6.0% (2-year), broadly in line
            with the 2025–2026 cycle. Final numbers always shift between the
            preliminary and final votes; check back in late June for the
            confirmed rate.
          </p>
          <p>
            <strong>Does the FARE Act change anything for rent-stabilized tenants?</strong>
            <br />
            The FARE Act (effective June 11, 2025) shifts broker fees from
            tenants to landlords when the landlord hires the broker. For
            stabilized tenants, this means: if your landlord uses a broker for
            re-leasing your apartment after you leave, you can no longer be
            charged that broker fee. It does not change your stabilized
            renewal — RGB rates still apply. See our{" "}
            <Link href="/blog/nyc-fare-act-broker-fee-ban" className="text-primary underline">
              FARE Act guide
            </Link>{" "}
            for the full rules.
          </p>
          <p>
            <strong>How do I order a free DHCR rent history?</strong>
            <br />
            Go to hcr.ny.gov/dhcr or call 718-739-6400. You&apos;ll need your
            building address, apartment number, and a valid email. The history
            arrives in 4–8 weeks (sometimes faster). It is the single most
            useful document for verifying stabilization and detecting
            overcharges. There is no fee.
          </p>
          <p>
            <strong>What is a &ldquo;preferential rent&rdquo; and is it protected?</strong>
            <br />
            A preferential rent is a rent below the legal regulated rent. Under
            HSTPA 2019, once you sign a lease at a preferential rent, the
            landlord cannot raise it back to the higher legal rent at renewal
            for the duration of your tenancy. Future RGB increases apply to the
            preferential rent, not the higher legal rent. This is one of the
            most valuable HSTPA protections for current stabilized tenants.
          </p>
          <p>
            <strong>What if I&apos;m a stabilized tenant facing harassment to leave?</strong>
            <br />
            NYC Local Law 7 of 2020 created the &ldquo;tenant harassment by buyout&rdquo;
            cause of action. You can file a complaint with HPD or sue in
            housing court. Common harassment patterns include repeated
            unannounced inspections, withholding services (heat, hot water),
            and pressuring buyout offers — all are illegal. Document every
            incident and contact Met Council (212-979-0611) or Legal Aid for
            referral.
          </p>
          <p>
            <strong>Does Local Law 18 short-term rental enforcement affect stabilized tenants?</strong>
            <br />
            Local Law 18 (effective September 2023) restricts short-term
            rentals (under 30 days) on platforms like Airbnb. Stabilized
            tenants subletting their unit on Airbnb without registration risk
            both Local Law 18 fines and a stabilization-side eviction for
            &ldquo;non-primary residence.&rdquo; If you sublet, do it long-term (30+ days)
            and with written landlord consent.
          </p>
          <p>
            <strong>Can I challenge an MCI (Major Capital Improvement) increase?</strong>
            <br />
            Yes. MCI increases require DHCR approval, and tenants can object
            during the public-comment window (typically 30 days from the
            initial filing). Common challenges: improperly itemized work,
            cosmetic vs. capital expenditure (cosmetic doesn&apos;t qualify),
            duplicate MCI on already-funded items. File the objection through
            DHCR&apos;s online portal or by mail.
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
