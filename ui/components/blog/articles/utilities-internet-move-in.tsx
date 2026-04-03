import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function UtilitiesInternetMoveIn() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Electric, gas, and water: whose name is on the bill?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Leases specify which utilities are included in rent, which are tenant-paid, and
            whether water or sewer is master-billed back to units. Before move-in day, open
            accounts in your name where required—electric and gas often need advance
            scheduling so service starts the day you get keys. Last-minute calls can leave
            you in the dark literally, with fees to expedite. Ask whether the unit has its own
            meter or a submeter; submetering rules affect how you budget and dispute bills.
          </p>
          <p>
            If heat is tenant-controlled, learn the system—radiators, forced air, heat pump—
            and where shutoffs live. In cold climates, failing to maintain minimum heat can
            risk pipes and liability. Window AC versus central air changes summer costs and
            installation rules; some buildings prohibit certain equipment or require brackets.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Broadband, working from home, and building wiring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Internet quality can make or break remote work. Check which providers serve the
            address and whether the building has exclusive wiring deals that limit choice.
            Ask existing residents about peak-hour speeds and outages. If you need symmetric
            upload for video, consumer cable may disappoint compared to fiber where available.
            Schedule installation early—technician windows often stretch past move-in week.
          </p>
          <p>
            Document starting meter readings where applicable and keep confirmation numbers
            for every account. If utilities are included up to a cap, understand how
            overages appear on your ledger and how to dispute them. A few hours of planning
            before move-in beats weeks of billing fights after.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>When bills spike: disputes, estimates, and submetering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            First bills after move-in can surprise you—partial months, connection fees, or
            estimated reads before true meters register. Compare usage to similar-sized units
            if your bill seems wildly high; leaks and stuck toilets waste water fast. For
            electric heat or older AC, seasonal swings are normal; budget averaging plans
            from utilities can smooth payments if available.
          </p>
          <p>
            Submetered water or master-billed gas sometimes includes administrative fees;
            review the allocation method in your lease. If you believe you are overcharged,
            gather usage history and contact the utility or landlord in writing. Document
            every call. Escalate to public utility commissions or consumer boards when
            appropriate—processes vary by state.
          </p>
          <p>
            If you work from home, consider a small UPS for your modem and router to bridge
            brief outages during storms. Label power strips so you are not guessing which
            switch controls entertainment versus essentials during troubleshooting calls with
            ISPs—support sessions go faster when you can reboot deliberately.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA variant="movein" />
    </div>
  );
}
