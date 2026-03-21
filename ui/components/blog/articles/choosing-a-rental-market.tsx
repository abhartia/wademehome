import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChoosingARentalMarket() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Why market choice matters before you fall in love with a city</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Choosing where to rent in the United States is rarely a pure lifestyle decision.
            Your employer&apos;s location, visa or work-authorization rules, family
            caregiving, school districts if you have children, and your partner&apos;s career
            often narrow the map before you ever open a listings site. The most expensive
            mistake is to fixate on a metro because of culture or weather before confirming
            that your income, timeline, and legal status align with actually securing a lease
            there. Landlords in competitive markets move quickly; you need a realistic
            picture of what you can qualify for and how long the search will take before you
            book flights or give notice elsewhere.
          </p>
          <p>
            Start by writing down non-negotiable constraints: maximum one-way commute time,
            whether you must be within transit of a specific office, remote-work policy
            limits, and any state licensing or certification that ties you to a region.
            Layer in cost-of-living math using take-home pay, not salary headlines—state
            income tax, sales tax, and typical rents for the bedroom count you need all shift
            what &quot;affordable&quot; means. Remember that vacancy rates and listing churn
            vary enormously: in some metros, tens of thousands of units turn over monthly,
            which creates opportunity but also pressure to decide quickly once you tour.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Building a short list of metros you can actually afford</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Once constraints are clear, compare a small set of cities using the same unit
            type—comparing a two-bedroom in one place to a studio in another hides the
            tradeoffs. Use recent asking rents for comparable neighborhoods, not citywide
            averages alone, because rent dispersion within a metro can exceed dispersion
            between cities. Factor one-time relocation costs: moving trucks, broker or
            application fees where applicable, security deposits, and overlapping rent if you
            cannot align move-out and move-in perfectly. If you will not own a car, map
            transit realistically for your actual hours, not midday map estimates.
          </p>
          <p>
            Climate and quality-of-life preferences still matter, but validate them against
            budget. Winter heating bills, summer AC needs, and car insurance premiums shift
            the monthly picture. If possible, visit finalists for at least a few days in
            season—not only to tour apartments but to experience commute crowding, grocery
            access, and whether the &quot;fun&quot; neighborhoods you researched online feel
            livable at your price point. None of this replaces professional advice for
            immigration, tax, or custody questions, but it keeps your rental search grounded
            in numbers and constraints before you commit emotionally to a place that your
            application may not support.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Healthcare, childcare, and elder support as geographic anchors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Specialized medical care, trusted pediatricians, and elder-care networks often
            anchor families to specific metros even when remote work would allow cheaper
            housing elsewhere. Before relocating for a job alone, map whether your
            household&apos;s care needs can be met within acceptable distance and insurance
            networks—those costs and stressors belong in the same spreadsheet as rent.
          </p>
          <p>
            If you are single or flexible, revisit market choice every few years. Industries
            consolidate, remote policies tighten, and relationships evolve. The best rental
            market at thirty may not be the best at forty; treat location as a strategic
            decision you can revisit rather than a permanent identity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
