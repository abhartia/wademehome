import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SharedLeasesAndRoommates() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Joint liability: what the lease says matters more than Venmo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            When everyone signs one lease, the landlord can usually pursue any roommate for
            the full unpaid rent if others stop paying. Internal split agreements—whether
            tracked in Splitwise or a spreadsheet—do not change that liability. Before you
            sign, be sure you trust your roommates&apos; financial stability and
            communication. Discuss what happens if someone loses a job, moves out early, or
            stops paying their share: will you cover temporarily, evict them, or break the
            lease together? Hope is not a plan.
          </p>
          <p>
            Some buildings allow lease replacement or roommate addendum processes; others
            require everyone to sign new paperwork. Subletting without permission can breach
            the lease and expose you to eviction. Read the lease and ask management before
            assuming a friend can move in mid-term.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Household systems that reduce conflict</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Agree on how shared groceries, cleaning rotations, and guest policies work.
            Decide whether utilities are split equally or by room size and usage. Apps help,
            but periodic check-ins matter more than software—schedules change, and silent
            resentment builds faster than mold in a neglected fridge.
          </p>
          <p>
            If you are the only one whose name is on the lease while others pay you
            informally, you carry outsized risk. If you are subletting from a master tenant,
            understand whether the landlord approved you and what notice you have for
            eviction. Roommate situations are where handshake deals fail; put material
            agreements in writing when money and housing security are at stake.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>When the dynamic shifts mid-lease</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Relationships change: someone couples up and spends most nights elsewhere,
            another works nights and sleeps days, a new pet arrives. Revisit household
            agreements when stress appears—small adjustments to chore rotations or utility
            splits prevent blowups. If someone must leave, explore lease assignment or
            roommate replacement early; waiting until the last week leaves everyone exposed.
            Management may charge fees for changes; factor that into who pays.
          </p>
          <p>
            Document security deposit expectations at move-out if roommates depart on
            different dates. Who gets the walk-through? Who pays for final cleaning? If only
            one name remains on the lease, clarify how the deposit refund will be split when
            the tenancy eventually ends. Ambiguity here has destroyed friendships; clarity
            preserves them.
          </p>
          <p>
            Finally, celebrate small wins—shared meals, chore streaks, respectful conflict
            resolution—that make cohabitation feel human. The lease is a legal backstop; the
            relationship is what you build week to week. Invest in both and you reduce the
            odds of an expensive, stressful mid-lease breakup.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
