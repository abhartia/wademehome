import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonthToMonthAfterLease() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What happens when the fixed term ends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Some leases convert to month-to-month tenancy automatically at the end of the
            term; others require a signed renewal for any continued occupancy. Your lease
            language and state law together define what happens if you stay past the end date
            without a new document—do not assume you are month-to-month without verifying;
            in some cases you could be an unauthorized holdover with serious consequences.
            Read the termination and holdover sections carefully.
          </p>
          <p>
            Month-to-month arrangements trade flexibility for uncertainty: rent can change
            with proper notice where law allows, and either party can usually terminate with
            shorter notice than a one-year lease—exact periods vary by jurisdiction and
            sometimes by building type or regulation. In rent-stabilized or rent-controlled
            contexts, different rules may apply entirely.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notice, rent increases, and planning your next step</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Calendar landlord and tenant notice requirements symmetrically. Missing a window
            can auto-renew you for another year in some leases or leave you without an
            apartment if you intended to leave. If you need stability, a new fixed term may
            be worth a slightly lower rent than volatile month-to-month pricing.
          </p>
          <p>
            If you are month-to-month while house-hunting to buy, keep liquidity for overlap
            months. If you are waiting for a job transfer, negotiate end dates with employers
            and landlords in the same conversation. Local tenant organizations publish
            notice-period cheat sheets—use them. This article is general information, not
            legal advice for your city.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>How month-to-month affects rent increases and rent regulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            In many markets, rent can rise with advance notice on month-to-month tenancies,
            but the percentage allowed and the form of notice depend on local law. Some
            cities have rent caps or just-cause eviction protections that apply only to
            covered buildings; others exempt newer construction. If you are unsure whether
            your building is regulated, pull registration records or ask a tenant group—
            assumptions cost money.
          </p>
          <p>
            If you prefer a new fixed term for stability, compare the offered renewal rent
            to the risk of month-to-month increases over the same horizon. Sometimes a
            modest premium for a locked year is worth predictability for budgeting or
            childcare planning. Always get material changes in signed writing; verbal
            assurances about &quot;we will not raise you&quot; rarely hold up.
          </p>
          <p>
            If you inherit a month-to-month situation from a predecessor roommate, verify
            your name and rent amount on every renewal notice—informal sublets sometimes
            drift from what the landlord believes is current. A single email confirming
            terms saves arguments when someone moves out mid-year.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
