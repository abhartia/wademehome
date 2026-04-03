import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function RentBudgetFromTakeHomePay() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Start from net pay, not the number on your offer letter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Your lease competes with every other claim on your bank account: federal and
            state taxes, payroll deductions for health insurance and retirement, student
            loans, car payments, credit card minimums, and the savings you need for
            emergencies and goals. Gross salary is a poor guide to what you can safely spend on
            rent. Work from an average month of take-home pay—if your income varies, use a
            conservative month or a trailing average and build in a buffer for slow periods.
            Many financial planners suggest treating rent as one line in a full budget rather
            than applying a single percentage rule, because debt loads and family obligations
            differ too much for one-size-fits-all ratios to hold across the country.
          </p>
          <p>
            Non-rent housing costs add up: renter&apos;s insurance, utilities not included in
            rent, parking, pet fees, and seasonal heating or cooling. A unit with
            &quot;lower&quot; rent but high parking and utility bills can cost more than a
            higher rent that bundles heat or internet. When comparing listings, estimate an
            all-in monthly number and compare that, not headline rent alone. Leave room for
            moving expenses, furniture, and the security deposit and first month&apos;s rent
            that often hit in the same thirty-day window when you relocate.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stress-testing the budget before you sign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Before you commit to a lease, stress-test two scenarios: a month with an
            unexpected expense (car repair, medical bill) and a month where rent increases
            at renewal. If the apartment only works when nothing goes wrong, it is too
            tight. If you are new to an area, add a slush line for &quot;learning the
            market&quot; costs—replacing items you could not move, buying weather-appropriate
            gear, or eating out more during the first hectic weeks.
          </p>
          <p>
            Credit health matters for approval and for your own resilience: carrying high
            balances relative to limits can hurt scores and increase stress when landlords
            run screening. Improving credit and paying down high-interest debt before a move
            can widen your options and reduce monthly obligations competing with rent. This
            article is general education, not financial or tax advice; if your situation is
            complex, a certified planner or counselor can help you align rent with the rest
            of your plan.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Emergency funds and income volatility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Gig workers, commissioned salespeople, and anyone on variable hours should model
            worst-case months, not averages alone. A rent payment that works in a bumper
            quarter may fail in a slow one—maintain a larger emergency fund or choose a lower
            rent tier to absorb swings. Some landlords average multiple months of bank
            statements; prepare clean PDFs without unrelated account noise.
          </p>
          <p>
            If you expect a raise or job change mid-lease, do not spend the increase before
            it clears probation periods. Lifestyle creep after a promotion is common; direct
            part of new income to savings before upgrading apartment size. Rent is sticky—
            easy to raise your standard of living, harder to downshift without another move.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
