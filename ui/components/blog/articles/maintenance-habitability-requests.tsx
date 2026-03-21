import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MaintenanceHabitabilityRequests() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reporting issues the right way</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Most leases require tenants to notify landlords of maintenance problems and to
            avoid causing additional damage through neglect. Use the official portal or email
            address specified in your lease so requests are timestamped. For urgent issues—
            no heat in freezing weather, major water leaks, gas smells—call emergency lines
            immediately, then follow up in writing with photos. Keep copies of every message.
            That paper trail matters if a dispute arises about habitability or deposit
            deductions later.
          </p>
          <p>
            Habitability is a legal standard: safe wiring, running water, heat, and
            functioning locks, among other basics, with specifics defined by state and local
            housing codes. Landlords generally must repair conditions that affect health and
            safety; cosmetic issues may have longer timelines. Do not withhold rent without
            understanding local procedures—many jurisdictions require escrow or court
            processes; self-help remedies can backfire.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pests, mold, and recurring problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Document pest sightings with dates and photos; building-wide treatment may be
            needed instead of single-unit sprays. Mold from leaks needs source repair, not
            just surface cleaning. If you have allergies or asthma, ask about prior water
            incidents and remediation. If a landlord ignores serious problems, tenant unions,
            code enforcement, and attorneys can explain remedies where you live—this article
            is not legal advice.
          </p>
          <p>
            Be reasonable about access: landlords must give notice before entry except
            emergencies, but refusing all access can delay repairs. Schedule mutually
            workable times and keep a log of visits. Professional communication protects you
            while keeping the home safe.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preventive habits that protect your deposit and health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Replace HVAC filters on schedule if your lease assigns that duty; clogged filters
            strain systems and can lead to charges if equipment fails from neglect. Run
            bathroom fans during showers to reduce mold risk; wipe standing water from window
            sills in humid seasons. Report slow leaks immediately—a drip under a sink is
            cheaper to fix today than cabinet replacement next quarter.
          </p>
          <p>
            If you travel often, arrange for someone to check the unit during freezes or
            storms so burst pipes are caught early. Smart leak detectors are inexpensive and
            may lower insurance premiums. None of this shifts legal repair duties away from
            landlords for structural issues, but it demonstrates good-faith care if a dispute
            ever questions your housekeeping.
          </p>
          <p>
            Seasonal maintenance—gutter clearing where relevant, balcony drainage, dryer vent
            cleaning if in-unit—keeps small problems from becoming emergencies. If your lease
            assigns these tasks to you, calendar them; if they belong to the landlord, submit
            timely requests before rainy season or freezing weather arrives.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
