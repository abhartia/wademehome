import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import Link from "next/link";

export default function BrokerFeesAndUpfrontCosts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Who pays the broker in your market—and when</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            In some U.S. cities, tenants traditionally paid broker fees equal to a
            percentage of annual rent; in others, owners paid exclusively; regulation has
            shifted the default in several jurisdictions. The only reliable approach is to
            ask before you tour: whether a fee applies, who owes it, and whether it is
            refundable if the deal falls through. Get the answer in writing when possible.
            Misunderstanding a four-figure fee after you have invested weekends touring is a
            painful surprise that can derail a lease you thought you could afford.
          </p>
          <p>
            Brokers provide value when they know inventory, schedule efficiently, and
            negotiate concessions—but you should understand what you are buying. If you find
            a unit yourself on a public listing, confirm whether a fee still attaches due
            to agency relationships. Dual agency situations deserve extra clarity on who
            represents whom.
          </p>
          <p>
            <strong>NYC renters:</strong> the FARE Act changed who pays broker fees
            in New York City starting June 2025. Read our{" "}
            <Link
              href="/blog/nyc-fare-act-broker-fee-ban"
              className="text-foreground underline underline-offset-4"
            >
              complete guide to the NYC broker fee ban
            </Link>{" "}
            for details on how the law works and what it means for your apartment search.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stacking first month, deposit, and moving cash</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Landlords often require certified funds or ACH for move-in; personal checks may
            not clear fast enough to hold a unit. Banks sometimes limit daily transfers—plan
            ahead if you are pulling from investment accounts. Application fees, holding
            deposits, and move-in administrative charges layer on top of rent and security.
            Model the full stack in one spreadsheet so you are not surprised the week before
            keys.
          </p>
          <p>
            If you are relocating from far away, consider whether temporary housing reduces
            pressure to wire large sums on short notice to the first available unit. Fraud
            exists in rental markets—verify wire instructions by phone to a known management
            number before sending money. This article is practical guidance, not legal or
            brokerage advice for your specific transaction.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>International wires, timing, and fraud awareness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Relocating from abroad adds FX spreads, international wire fees, and multi-day
            settlement windows. Start moving funds early and confirm with your bank whether
            incoming wires from foreign accounts trigger holds. Some landlords accept credit
            card payments through portals with convenience fees—compare total cost against
            wire fees when time is tight.
          </p>
          <p>
            Rental scams often pressure victims to wire deposits to fake accounts. Verify
            management phone numbers independently from the listing, never pay before seeing
            a legitimate lease, and be skeptical of below-market deals that demand instant
            cash. If something feels rushed, pause—legitimate landlords understand that large
            transfers require             verification.
          </p>
          <p>
            For a deeper look at common tactics used by fraudulent listings, read our guide to{" "}
            <Link
              href="/blog/nyc-apartment-scams"
              className="text-foreground underline underline-offset-4"
            >
              spotting apartment scams in NYC
            </Link>
            —many of the red flags apply nationwide.
          </p>
          <p>
            Roommates splitting broker fees should agree on shares before anyone wires—
            unequal bedrooms or incomes often justify unequal splits; put it in writing to
            avoid Venmo disputes after move-in stress peaks.
          </p>
          <p>
            Want to see how broker fees fit into the full picture? Our{" "}
            <Link
              href="/cost-of-moving-to-nyc"
              className="text-foreground underline underline-offset-4"
            >
              complete NYC move-in cost breakdown
            </Link>{" "}
            covers every expense from security deposits to furniture.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA variant="movein" />
    </div>
  );
}
