import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RentalListingsFeesNetEffectiveRent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gross rent, net effective rent, and what your bank account sees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Landlords in competitive markets often advertise concessions—one or more free
            months spread across the lease term—to attract attention without lowering the
            nominal rent on paper. The &quot;net effective&quot; monthly figure divides total
            rent owed over the lease (after free months) by the number of months in the
            term. It is a useful comparison tool between offers, but it is not always what you
            wire each month. Many leases still charge the higher &quot;gross&quot; rent in
            eleven or twelve installments, with the concession applied as a credit or
            upfront discount. Before you budget, read the lease summary and ask the leasing
            office which number hits your account in a typical month.
          </p>
          <p>
            Confusion between net and gross causes real stress at the first payment. If you
            shop using only net effective figures, build your cash-flow model using the
            actual monthly charge plus any months where a larger payment is due if the
            concession is front-loaded or back-loaded. When comparing two apartments, compare
            total cost over the full term—including any months you might not stay if you
            break the lease—rather than only the advertised monthly rate.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Application fees, admin fees, and the true first-year cost</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Beyond base rent, listings may omit or bury move-in fees, amenity fees, package
            locker subscriptions, and non-refundable administrative charges. In some
            markets, broker fees shift who pays depending on regulation and representation;
            always confirm in writing whether you owe a broker and how much before you tour
            extensively with an agent. Application fees are often non-refundable and can add
            up if you apply to many buildings—be selective once you understand screening
            criteria.
          </p>
          <p>
            A simple spreadsheet helps: list monthly rent times months in the lease, add
            one-time fees, divide by months if you want a personal &quot;amortized&quot;
            monthly cost for comparison. That number is what answers whether Apartment A is
            really cheaper than B. Rules on which fees are legal and how they must be
            disclosed vary by state and city; when something seems out of line, check local
            tenant resources. This overview is educational, not legal advice.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reading the fine print on incentives and lease riders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Free-month promotions sometimes require you to repay the concession if you break
            the lease early—check the rider for clawback language. Other buildings offer
            gift cards or waived amenity fees instead of rent discounts; value those in your
            total first-year cost comparison. Student-focused properties may bundle furniture
            or utilities; verify whether those renew at higher rates in year two.
          </p>
          <p>
            When syndicated listings disagree on price, trust the source tied to the leasing
            office. Third-party sites can lag by days during fast markets. If two prices
            appear, screenshot both and ask for clarification before applying—surprises at
            lease signing are harder to unwind than questions at inquiry time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
