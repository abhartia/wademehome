import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MoveInDayDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Photos, video, and the move-in inspection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Move-in day is when you create the baseline that will be compared to move-out
            condition months or years later. Complete the landlord&apos;s inspection
            checklist if provided, but also take your own dated photos or video of every
            room, including inside closets, cabinets, appliances, and windows. Capture
            existing scuffs, carpet stains, and countertop chips—otherwise you may be blamed
            for them later. Email yourself a cloud backup or store files with the lease
            folder.
          </p>
          <p>
            Test smoke and carbon monoxide detectors immediately; replace batteries or request
            maintenance if they fail. Locate the electrical panel and water shutoff. Check
            that locks and window latches work; request rekeying if policy allows and you
            have security concerns. Note HVAC filter size for future replacements—landlords
            sometimes require tenant-changed filters on a schedule.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>First-week logistics: elevators, mail, and neighbors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            High-rise moves may need elevator reservations and proof of insurance for movers;
            book early and confirm load-in hours. Register for mail forwarding with USPS and
            update banks, payroll, subscriptions, and government IDs on your own timeline—
            spread the task list so you are not doing everything the night before a deadline.
          </p>
          <p>
            Introduce yourself to neighbors you share walls with; a note under the door about
            move-in noise goes a long way. Keep a list of issues you discover after unpacking—
            loose outlets, dripping faucets—and submit them in writing through the channel
            your lease specifies. Good documentation on day one prevents ambiguous disputes
            on day three hundred.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Insurance, renters policy, and updating your address everywhere</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Activate your renters insurance policy effective move-in day so liability and
            property coverage begin when your belongings arrive. Update the policy address
            and notify your carrier if you add roommates. If you drive, update your driver
            license and vehicle registration timelines per state law—some states give
            grace periods after a move.
          </p>
          <p>
            Employers, payroll, health insurance, and student loan servicers all need your
            new address; missing one can delay tax forms or benefits. Keep a checklist and
            knock out two items per evening rather than scrambling at year-end. The same
            discipline applies to voter registration and local jury duty—democracy and civic
            duties follow you to the             new ZIP code.
          </p>
          <p>
            Keep a printed copy of emergency contacts—building super, utility outages, and
            poison control—in a kitchen drawer; phones die when you need them most. Small
            preparation steps feel tedious on move-in day but pay off the first time
            something breaks at midnight.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
