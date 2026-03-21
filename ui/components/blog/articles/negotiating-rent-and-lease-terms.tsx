import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NegotiatingRentAndLeaseTerms() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What is negotiable—and what usually is not</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Negotiation power rises when inventory sits: units on the market for weeks,
            seasonal slowdowns, or new buildings filling remaining floors. In those
            conditions, owners may accept lower base rent, more free months, reduced move-in
            fees, or flexibility on lease start date. In tight markets, &quot;negotiation&quot;
            often shifts to clarity—getting promised repairs, parking, or pet approval in
            writing—rather than a lower number on the first page of the lease.
          </p>
          <p>
            Approach professionally: compare similar nearby listings, cite days on market if
            public, and propose a specific number or concession rather than asking vaguely
            for &quot;a better deal.&quot; Large institutional landlords may have little
            room to deviate from policy; smaller owners sometimes have more discretion. Either
            way, politeness costs nothing and burned bridges follow you in small rental
            markets.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Beyond base rent: dates, term length, and inclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Lease start date can matter as much as monthly rent if you are paying double
            housing or storage. A 13- or 14-month lease might unlock a concession that a
            12-month lease does not; run the total cost over the full term. Parking spaces,
            storage lockers, bike rooms, and amenity fees sometimes have wiggle room or
            promotional waivers. Pet rent and deposits are regulated in some places—know local
            caps before you argue.
          </p>
          <p>
            Get material concessions in the signed lease or a dated addendum signed by the
            landlord—not in email alone. If you need specific repairs or paint before
            move-in, list them with deadlines. If negotiation fails, walking away is
            sometimes the best financial decision even after sunk tour time. This article is
            practical guidance, not legal representation; rent regulation may govern what
            can be charged or changed in your city.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>When to walk away—and how to keep relationships intact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Walking away is rational when total cost, lease terms, or building quality fail
            your minimum standards—even after hours invested. Markets with churn replenish
            inventory; scarcity feelings are often temporary. Thank agents and managers
            politely when you decline; small rental worlds remember rudeness.
          </p>
          <p>
            If you counter-offer and the landlord refuses, ask whether they will keep your
            application on file if pricing changes next week—sometimes inventory shifts
            fast. Do not burn bridges you might need if your second choice falls through.
            Negotiation is a process, not a single conversation; patience paired with clarity
            wins more often than             ultimatums.
          </p>
          <p>
            In competitive buildings, ask whether waitlist priority or future transfer options
            exist if you need a different line later—some owners document internal moves at
            reduced fees for reliable tenants. It is not guaranteed, but worth asking once
            rapport exists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
