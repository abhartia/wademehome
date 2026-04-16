import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import Link from "next/link";

export default function NycFareActBrokerFeeBan() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What is the FARE Act?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The Fairness in Apartment Rental Expenses (FARE) Act is a New York City
            law that took effect on June 11, 2025. It establishes a simple rule:
            whoever hires a real estate broker pays that broker&apos;s fee. For decades,
            NYC renters shouldered broker fees of 12 to 15 percent of annual rent
            even when the landlord was the one who listed the unit. The FARE Act
            reverses that default.
          </p>
          <p>
            The law was passed by the NYC City Council in late 2024 and survived
            legal challenges before taking effect in mid-2025. It applies to all
            residential rental transactions in the five boroughs: Manhattan,
            Brooklyn, Queens, the Bronx, and Staten Island.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How the FARE Act changes who pays the broker fee</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong>Before the FARE Act:</strong> landlords would hire a broker to
            market and lease their apartment, but tenants were expected to pay that
            broker&apos;s commission—typically one month&apos;s rent or 12 to 15 percent of
            the annual lease value. On a $3,000/month apartment, that meant $3,000
            to $5,400 in broker fees alone, on top of first month&apos;s rent and
            security deposit.
          </p>
          <p>
            <strong>After the FARE Act:</strong> if the landlord or property manager
            engages a broker to market or lease a unit, the landlord pays the fee.
            The tenant cannot be charged for a broker they did not hire. This
            applies regardless of whether the tenant interacts directly with that
            broker during the apartment search.
          </p>
          <p>
            The one exception: if a tenant independently hires their own broker to
            help them search for apartments or negotiate lease terms, the tenant
            pays that broker. The key question is who initiated the broker
            relationship.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How much do NYC renters save?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The financial impact is significant. Before the FARE Act, average
            upfront move-in costs in NYC—including broker fees, first month, and
            security deposit—were close to $13,000. Without the broker fee, that
            drops to roughly $7,500. For many renters, this is the difference
            between affording a move and being priced out.
          </p>
          <p>
            This is especially meaningful for first-time renters, recent graduates,
            and anyone relocating to NYC without substantial savings. If you are
            budgeting for a move to New York, check our{" "}
            <Link
              href="/blog/rent-budget-from-take-home-pay"
              className="text-foreground underline underline-offset-4"
            >
              rent budget calculator guide
            </Link>{" "}
            to figure out what you can realistically afford.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When tenants still pay a broker fee</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The FARE Act does not eliminate broker fees entirely. You may still owe
            a fee if you proactively hire a broker to help you find an apartment.
            This is called tenant-initiated brokerage. In this scenario, you and
            the broker agree to terms before the search begins, and the broker
            works on your behalf rather than the landlord&apos;s.
          </p>
          <p>
            Be cautious: some brokers may try to frame landlord-side listings as
            tenant-initiated arrangements. If a broker contacts you about a
            specific unit, or if you respond to a listing that was posted by the
            landlord&apos;s broker, the landlord should be paying. If you are unsure
            about a fee, ask for written confirmation of who hired the broker
            before signing anything.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enforcement: what happens if a broker violates the law</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The NYC Department of Consumer and Worker Protection (DCWP) enforces
            the FARE Act. Violations can result in fines of up to $2,000 per
            offense. Tenants who were charged illegal fees have a private right of
            action—they can sue in civil court to recover the fee plus damages.
          </p>
          <p>
            In the first several months after the law took effect, DCWP received
            over 1,100 complaints from tenants who believed they were charged
            illegal broker fees. If you believe you were wrongly charged, file a
            complaint with DCWP and consult with a tenant rights attorney.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How landlords are responding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Some landlords have absorbed the broker cost; others are passing it
            through in the form of higher monthly rent. Early data suggests a
            mixed picture: in competitive neighborhoods, landlords who list
            without a broker or who absorb the fee are attracting tenants faster.
            In tighter markets, some monthly rents have ticked up by $100 to $200.
          </p>
          <p>
            No-fee listings—which were already marketed as a perk before the law—are
            now effectively the default for landlord-listed units. This makes
            platforms that aggregate listings and let you search without a broker
            more valuable than ever. Our{" "}
            <Link
              href="/"
              className="text-foreground underline underline-offset-4"
            >
              AI-powered apartment search
            </Link>{" "}
            helps you find and compare NYC listings without broker fees.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips for NYC apartment hunting under the FARE Act</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong>Ask upfront who hired the broker.</strong> Before touring any
              unit, confirm whether the broker represents the landlord or you. Get
              this in writing.
            </li>
            <li>
              <strong>Never sign a tenant-broker agreement you did not initiate.</strong>{" "}
              If a broker asks you to sign an agreement stating you hired them,
              but you found the listing through the landlord, refuse.
            </li>
            <li>
              <strong>Search directly on landlord and management company sites.</strong>{" "}
              Many large NYC landlords list units directly. Searching these
              listings eliminates broker involvement entirely.
            </li>
            <li>
              <strong>Use AI-powered search tools.</strong> Tools like{" "}
              <Link
                href="/"
                className="text-foreground underline underline-offset-4"
              >
                Wade Me Home
              </Link>{" "}
              aggregate real listings from property managers so you can search by
              neighborhood, budget, and preferences without a broker.
            </li>
            <li>
              <strong>Report violations.</strong> If a landlord or broker charges
              you a fee they should be paying, file a complaint with NYC DCWP.
              You may also be entitled to recover the fee in court.
            </li>
            <li>
              <strong>Budget the savings wisely.</strong> Without a broker fee,
              you may have $3,000 to $5,000 more in your pocket. Consider putting
              that toward a better neighborhood, furniture, or an emergency fund.
              See our{" "}
              <Link
                href="/blog/security-deposits-move-in-fees"
                className="text-foreground underline underline-offset-4"
              >
                security deposit and move-in fees guide
              </Link>{" "}
              for a full cost breakdown.
            </li>
            <li>
              <strong>Target neighborhoods with in-house leasing.</strong> Luxury
              high-rise neighborhoods like{" "}
              <Link
                href="/nyc/long-island-city"
                className="text-foreground underline underline-offset-4"
              >
                Long Island City
              </Link>{" "}
              have been largely no-fee for years because buildings lease
              directly through in-house offices. LIC also has the deepest
              concession stack in NYC (one to two months free is common), so
              the FARE Act savings compound.
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
            <strong>Does the FARE Act apply to lease renewals?</strong> No. The
            law applies to new leases and initial rental transactions. Lease
            renewals between existing tenants and landlords are not covered.
          </p>
          <p>
            <strong>Does it apply outside NYC?</strong> No. The FARE Act is a New
            York City law. It does not apply in other parts of New York State or
            other states. However, similar legislation has been proposed in other
            jurisdictions.
          </p>
          <p>
            <strong>Can a landlord raise rent to cover the broker fee?</strong>{" "}
            Rent-stabilized units have regulated increases set by the Rent
            Guidelines Board — see our{" "}
            <Link
              href="/blog/nyc-rent-stabilization-guide"
              className="text-foreground underline underline-offset-4"
            >
              NYC rent stabilization guide
            </Link>{" "}
            for current rates. For market-rate units,
            landlords can set prices freely, so some may factor broker costs into
            the monthly rent. Compare listings carefully to spot inflated prices.
          </p>
          <p>
            <strong>What if I already paid a broker fee after June 2025?</strong>{" "}
            If the broker was hired by the landlord, you may be able to recover
            the fee. File a complaint with DCWP and consider consulting a tenant
            rights attorney.
          </p>
          <p>
            <strong>Are there any apartments exempt from the FARE Act?</strong>{" "}
            Owner-occupied buildings with fewer than five units may have different
            rules. Condo and co-op sales are not covered—the law applies to
            rentals only.
          </p>
        </CardContent>
      </Card>

      <ArticleCTA />
    </div>
  );
}
