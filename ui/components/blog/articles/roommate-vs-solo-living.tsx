import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCTA } from "@/components/blog/ArticleCTA";

export default function RoommateVsSoloLiving() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What splitting rent actually buys—and what it costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Sharing an apartment is the most common way renters access neighborhoods,
            building amenities, or bedroom counts they could not afford alone. The tradeoff
            is not only privacy but joint responsibility: on a joint lease, each signer is
            typically liable for the full rent if a roommate defaults, regardless of
            informal agreements about who pays what. That legal reality should frame how you
            choose roommates and how you document expectations about guests, noise, cleaning,
            and shared purchases before anyone signs.
          </p>
          <p>
            Living alone trades money for control: your schedule, your mess, your guest
            policy—without negotiation. For people who need quiet to work from home,
            irregular hours, or have sensory sensitivities, solo living can be worth a
            smaller unit or a longer commute. For others, isolation or the full cost of
            utilities and furniture makes solo living unsustainable. Be honest about which
            stress you tolerate better: interpersonal friction or financial stretch.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>House rules, compatibility, and exit plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            The best roommate situations rest on explicit expectations: how common spaces
            stay clean, how food and supplies work, how often guests stay over, and how you
            resolve conflict before it festers. A short written agreement—even informal—can
            prevent resentment when someone&apos;s partner effectively moves in or when one
            person travels for weeks and stops contributing to chores. Discuss what happens
            if someone needs to leave mid-lease: subletting rules vary by lease and by state;
            assuming a friend can &quot;take over&quot; without landlord approval is risky.
          </p>
          <p>
            If you are on the fence, try a shorter initial commitment where possible, or
            sublet a room before signing a year-long joint lease with someone you have not
            lived with. No article can replace knowing your own boundaries; the goal is to
            pick the arrangement that matches your finances and mental health for the term of
            the lease, not just the first month&apos;s excitement of a new place.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hybrid arrangements and exit ramps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Some renters start solo and add a partner later; others begin with roommates and
            eventually earn enough to live alone. Plan transitions with lease timelines—
            adding someone may require screening and a new agreement; removing someone may
            require landlord approval for replacement tenants. Subletting while you travel
            can offset rent but carries legal and trust risk; read your lease before Airbnb
            fantasies become lease violations.
          </p>
          <p>
            If you try roommates and discover it is not for you, note the lesson without
            self-judgment—many people cycle between arrangements as careers and relationships
            evolve. The right answer at twenty-two may differ at thirty-two; flexibility is
            a feature, not a failure.
          </p>
        </CardContent>
      </Card>
      <ArticleCTA />
    </div>
  );
}
