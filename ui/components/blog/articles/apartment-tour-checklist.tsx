import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function ApartmentTourChecklist() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model units, actual units, and what you are really leasing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Showrooms are staged to impress: higher floors, premium finishes, and furniture
            that masks awkward layouts. If your tour is only of a model, insist on seeing
            the exact unit or an identical line and floor plan on a real floor, or get written
            confirmation of what differs—carpet versus hardwood, appliance brands, and
            window count. Ask which way the unit faces; light and noise change dramatically by
            exposure. If the building is under construction, clarify move-in date slippage and
            what happens if delivery delays.
          </p>
          <p>
            Bring a phone charger to test outlets where your desk or bed will sit. Check
            cellular signal if you rely on mobile data for work. Open kitchen cabinets and
            closets; storage is easy to underestimate in empty units. Measure for your
            furniture if you are moving large pieces—narrow stairs and tight turns have
            stranded many sofas.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Water, climate, pests, and building systems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Run hot and cold water in kitchen and bath; look under sinks for leaks or water
            stains. Flush toilets and listen for runs. Note whether windows seal well—drafts
            hit heating bills and sleep quality. In humid climates, ask about dehumidification
            and whether the unit has ever had mold remediation. Look for pest control traps
            in corners and ask about building-wide treatment schedules; a few traps can be
            routine maintenance or a red flag depending on context.
          </p>
          <p>
            Tour common areas: laundry, mail and package rooms, bike storage, elevators at
            rush hour if you depend on them. Ask about maintenance response times and whether
            there is overnight security or a lockout policy. None of this replaces a licensed
            inspector for a purchase, but for a rental it helps you avoid obvious regrets and
            gives you specific questions to raise before you apply. If something feels off,
            trust that instinct and keep looking—inventory exists, even when it does not feel
            that way in week one of your search.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Questions to ask before you leave the tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Ask about package handling, guest policies, and whether window AC units are
            allowed. Confirm guest suite or parking guest policies if you entertain often.
            Inquire about planned capital projects—roof work, facade restoration, elevator
            modernization—because scaffolding and noise follow. Ask how maintenance requests
            are triaged after hours and whether there is a live person or only voicemail.
          </p>
          <p>
            Request a sample lease redacted of personal data if management shares it; some
            refuse, but it helps you spot unusual clauses before you pay application fees.
            If you tour multiple units in one building, note unit numbers and features in
            your spreadsheet immediately—memory blends similar floor plans quickly.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA variant="search" />
    </div>
  );
}
