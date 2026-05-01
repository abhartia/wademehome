import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { FAREActViolationReporter } from "@/components/fare-act/FAREActViolationReporter";
import Link from "next/link";

export default function NycFareActBrokerFeeBan() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>2026 update: what a year of the FARE Act has actually meant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong>Reviewed April 2026.</strong> The FARE Act turned ten months old
            this spring and the early-return data is now in. The NYC Department of
            Consumer and Worker Protection (DCWP) has logged well over 1,500 tenant
            complaints since June 2025, with the overwhelming majority alleging a
            landlord-hired broker tried to charge the tenant. Most of those
            complaints have resolved with the fee refunded and a warning letter, but
            DCWP has also issued the first round of $2,000-per-violation fines
            against repeat-offender brokerages.
          </p>
          <p>
            The market response is what Reddit threads keep asking about. The
            StreetEasy and Zillow rental indices both show NYC asking rents up
            roughly 5 to 7 percent year-over-year in landlord-listed market-rate
            units, which industry observers have attributed in part to landlords
            pricing the broker fee into monthly rent rather than absorbing it.
            That is real, but the math still favors tenants: a $200/month rent
            bump on a $3,500 unit costs $2,400 over a year, versus the $4,200 to
            $5,250 broker fee it replaced. You come out ahead by roughly a month
            of rent in year one, and the rent bump is the one that rolls into
            your renewal baseline, so compound carefully.
          </p>
          <p>
            The other 2026 development: the law survived the Real Estate Board of
            New York (REBNY) federal appeal. The Second Circuit kept the law in
            place while the litigation plays out, and state legislators in Albany
            have introduced companion bills that would extend similar protections
            statewide. New Jersey (Hoboken, Jersey City, Newark) has seen
            advocacy groups push for a local version, but as of April 2026 no
            equivalent law has passed outside the five boroughs.
          </p>
        </CardContent>
      </Card>

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
            <li>
              <strong>Use a no-fee-only search.</strong> Our{" "}
              <Link
                href="/nyc/no-fee-apartments"
                className="text-foreground underline underline-offset-4"
              >
                NYC no-fee apartments guide
              </Link>{" "}
              walks through the post-FARE-Act move-in cost sheet (rent +
              security + $20 application fee, period), how to spot a
              disguised &ldquo;marketing fee,&rdquo; and where the deepest
              landlord-direct inventory sits. Pair it with our{" "}
              <Link
                href="/nyc/cheap-apartments"
                className="text-foreground underline underline-offset-4"
              >
                cheap NYC apartments
              </Link>{" "}
              guide if budget is the gating constraint, or our{" "}
              <Link
                href="/nyc/luxury-apartments"
                className="text-foreground underline underline-offset-4"
              >
                luxury NYC apartments
              </Link>{" "}
              guide for the FARE-Act savings on $20K+/month trophy stock
              (a 12% fee on $300K annual rent is $36K).
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-emerald-300 bg-emerald-50">
        <CardHeader>
          <CardTitle>What NYC tenants are asking on r/AskNYC about the FARE Act (April 2026)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            We monitor r/AskNYC, r/NYCApartments, and r/AskNYC threads daily for
            FARE Act questions. Here are the patterns that come up most in
            April 2026, paraphrased from real tenant posts (with names and
            buildings stripped). If your situation matches any of these,
            run it through the violation reporter below — it will tell you
            whether you have a complaint and draft the DCWP filing for you.
          </p>
          <p>
            <strong>&quot;The broker who showed me the apartment is asking
            for a 12% fee. The listing was on StreetEasy posted by that same
            broker. Is this legal?&quot;</strong> No. If the broker posted the
            listing, the broker has keys, and the broker showed you the
            unit, the landlord engaged them and you are not on the hook.
            The fee demand is a textbook FARE Act violation. Save the
            StreetEasy listing screenshot — it is your strongest exhibit.
          </p>
          <p>
            <strong>&quot;I already paid a broker fee in November 2025 because
            I didn&apos;t know about the FARE Act. Can I get it back?&quot;</strong>{" "}
            Yes, if the broker was landlord-engaged. DCWP has been ordering
            refunds in 2025 and 2026 cases with this fact pattern. You are
            still inside the typical 12-month DCWP administrative window for
            a November 2025 demand. File at nyc.gov/dcwp first; if no
            resolution within 30–60 days, file in NYC Small Claims (no
            lawyer required, $20 filing fee, $10,000 cap).
          </p>
          <p>
            <strong>&quot;The broker is calling it an &lsquo;administrative
            fee&rsquo; or &lsquo;application processing fee&rsquo; instead of a
            broker fee. Does that get around the law?&quot;</strong> No. NYC
            application fees are capped at $20 by state law (separate from
            FARE Act). DCWP has explicitly flagged rebranded broker fees —
            &quot;administrative,&quot; &quot;marketing,&quot; &quot;agency,&quot;
            &quot;processing&quot; — as violations when the broker was
            landlord-hired. The label does not change the legal analysis.
          </p>
          <p>
            <strong>&quot;The broker says the landlord refuses to pay the
            fee, and if I want the apartment I have to. What do I do?&quot;</strong>{" "}
            Refuse in writing. Tell the broker by text or email that the FARE
            Act prohibits the demand and that you will report any further
            request to DCWP. If the landlord then refuses to lease to you, that
            is itself a separate enforcement issue — you preserve the right
            to file. In practice, most brokers back down once the tenant
            cites the law in writing.
          </p>
          <p>
            <strong>&quot;The asking rent is $300 higher than comparable
            units. Is the landlord pricing in the broker fee?&quot;</strong> Possibly.
            StreetEasy and Zillow indices show market-rate rents up 5–7% YoY
            in 2025-2026, with some of that being broker-fee pass-through.
            But the math still favors tenants: a $300/month bump on a
            $3,500 unit costs $3,600/year vs. the $4,200–$5,250 broker fee
            it replaced. You are still ahead by roughly a month. The
            structural gotcha is that the rent bump rolls into your
            renewal baseline, while the broker fee was one-time — so on a
            5+ year tenancy, the math eventually flips. Negotiate hard on
            the asking rent, not on hidden fees.
          </p>
          <p>
            <strong>&quot;Does the FARE Act help me if I&apos;m looking in
            Hoboken or Jersey City?&quot;</strong> No. The FARE Act is a New
            York City ordinance only. In NJ — Hoboken, Jersey City, Newark
            — tenant-paid broker fees of one-month-to-one-month-plus are
            still standard. That is one reason no-fee Jersey listings
            command a premium and why NJ-side advocacy groups are pushing
            for a state-level version.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Were you charged a fee illegally? Run the situation through our reporter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The interactive tool below classifies your situation against the
            FARE Act&apos;s landlord-engagement test, walks through the small-
            claims and DCWP enforcement options, and drafts a copy-paste DCWP
            complaint with your details inserted. Nothing you type is
            stored — the analysis runs entirely in your browser.
          </p>
          <FAREActViolationReporter bare />
          <p className="text-xs">
            See also our{" "}
            <Link
              href="/tools/fare-act-broker-fee-checker"
              className="text-foreground underline underline-offset-4"
            >
              FARE Act broker-fee savings checker
            </Link>{" "}
            (estimates the dollars saved on a no-fee lease) and the
            standalone{" "}
            <Link
              href="/tools/fare-act-violation-reporter"
              className="text-foreground underline underline-offset-4"
            >
              FARE Act violation reporter
            </Link>
            .
          </p>
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
          <p>
            <strong>Did the FARE Act raise NYC rents?</strong> Market-rate asking
            rents ticked up 5 to 7 percent year-over-year in 2025-2026, and some
            of that is broker-fee pass-through. But even at the high end of that
            bump, a tenant signing a $3,500 lease still comes out ahead by
            roughly one month of rent in year one versus paying a 15 percent
            broker fee. Rent-stabilized units cannot absorb the fee this way
            because their increases are capped by the Rent Guidelines Board.
          </p>
          <p>
            <strong>Is the FARE Act still in effect in 2026?</strong> Yes. The
            Second Circuit kept the law on the books while REBNY&apos;s federal
            appeal proceeds. Landlord-side fees remain illegal for tenants to be
            charged as of April 2026.
          </p>
          <p>
            <strong>Does the FARE Act apply to Hoboken, Jersey City, or
            Newark?</strong> No. The law is a New York City ordinance. In New
            Jersey cities across the Hudson, tenant-paid broker fees of
            one-month-to-one-month-plus are still common for landlord-listed
            units. That is one reason no-fee listings on{" "}
            <Link
              href="/jersey-city"
              className="text-foreground underline underline-offset-4"
            >
              Jersey City
            </Link>{" "}
            and{" "}
            <Link
              href="/hoboken"
              className="text-foreground underline underline-offset-4"
            >
              Hoboken
            </Link>{" "}
            command a premium.
          </p>
          <p>
            <strong>What counts as a landlord hiring a broker?</strong> If the
            listing was posted by the broker, if the broker has keys to the
            unit, if the broker is the person showing the apartment, or if the
            broker is paid a commission by the landlord on lease-up—any of these
            means the landlord hired them. You should not be charged.
          </p>
          <p>
            <strong>Can a landlord charge a &quot;marketing fee&quot; or
            &quot;application fee&quot; instead of a broker fee?</strong> No.
            Application fees in NYC are capped at $20 by state law, and DCWP has
            already flagged &quot;administrative&quot; or &quot;marketing&quot;
            fees that look like rebranded broker fees as violations. If a fee
            is above $20 and is not a security deposit, push back.
          </p>
          <p>
            <strong>What should I do if a broker demands a fee over text or
            email?</strong> Screenshot everything. File a complaint with NYC
            DCWP with the screenshots attached. You can also sue in small
            claims court for amounts under $10,000. Tenants have won these cases
            in 2025-2026 with the text-message evidence alone.
          </p>
        </CardContent>
      </Card>

      <ArticleCTA />
    </div>
  );
}
