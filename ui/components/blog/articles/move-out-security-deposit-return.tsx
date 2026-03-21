import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoveOutSecurityDepositReturn() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notice, cleaning, and matching move-in condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Move-out starts with proper notice under your lease—wrong dates can cost you a
            month of rent or forfeit deposit rights. Clean to a standard consistent with your
            move-in photos: normal wear is expected; excessive dirt, pet damage, or unpatched
            holes are not. If you painted walls, check whether you must return them to an
            original color. Return all keys, fobs, and parking passes; fees for missing items
            add up.
          </p>
          <p>
            Schedule a walk-through if offered; take your own photos after cleaning. If the
            landlord points out issues, address what is reasonable before surrendering keys.
            If you dispute charges later, dated evidence will matter.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Timelines for deposit return and disputing deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Many states require landlords to return the deposit or send an itemized
            statement of deductions within a set number of days after move-out and tenant
            surrender of possession. Missing that deadline can trigger statutory penalties—
            again, state-specific. Review the list for legitimacy: cleaning charges for
            ordinary wear, vague &quot;repair&quot; lines, or inflated vendor quotes deserve
            written questions and receipts requests.
          </p>
          <p>
            If negotiation fails, small claims court, mediation, or attorney demand letters
            may be options depending on amount and local practice. Tenant organizations often
            publish template letters. This overview is not legal advice; preserve all
            documentation from move-in through move-out to support any claim you pursue.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mail forwarding, final utilities, and closing the loop</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Deposit disputes get easier when you have already forwarded mail, canceled or
            transferred utilities, and removed your name from shared accounts. A forwarding
            order with USPS catches stragglers; update your address with banks, payroll,
            subscriptions, and state motor vehicle agencies on your own schedule so refunds
            or deposit checks reach you. If the landlord mails the deposit to your old
            address because you forgot to update the forwarding contact, delays compound
            frustration.
          </p>
          <p>
            When you receive deductions, compare them line-by-line to your move-in archive.
            Normal wear—faded paint from sunlight, minor carpet compression from
            furniture—should not be billed as damage. If you painted an approved color,
            confirm whether repainting charges exceed what move-out standards require. Photo
            evidence from both move-in and move-out is your best defense in any informal
            negotiation or formal proceeding.
          </p>
          <p>
            If you share a unit, coordinate who attends the final walk-through and how
            refund checks will be split when they arrive—many disputes arise between
            roommates after the landlord has already closed the file. Agree in writing on
            percentages before keys go back.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
