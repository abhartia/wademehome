import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-eviction-notice-timeline";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "How Long Does NYC Eviction Take? (2026 Timeline)",
  description:
    "From first late rent to physical eviction, the NYC process takes 4–18+ months. 14-day rent demand, then non-payment petition, court appearance, judgment, warrant, marshal notice. No self-help — only an NYC marshal can lock you out.",
  keywords: [
    "NYC eviction timeline",
    "how long NYC eviction",
    "NYC 14-day rent demand",
    "NYC nonpayment eviction",
    "NYC holdover eviction",
    "NYC marshal eviction notice",
    "RPAPL 711 NYC",
    "NYC eviction self-help illegal",
    "NYC tenant eviction defense",
    "right to counsel NYC eviction",
  ],
  openGraph: {
    title: "How long does NYC eviction take?",
    description:
      "4–18+ months from first late rent to physical eviction. Only an NYC marshal can lock you out.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How long does NYC eviction take?"
      jurisdictionTag="NYS / NYC"
      badges={["RPAPL Article 7", "No self-help"]}
      reviewedAt="2026-05-03"
      shortAnswer="From first late rent to physical eviction, NYC's process typically runs 4–18+ months. The statutory steps in a non-payment case: a 14-day rent demand (RPAPL § 711(2)), then filing a non-payment petition in NYC Housing Court, a court appearance, possible answer/trial, judgment, warrant of eviction, a 14-day marshal's notice, and finally the physical eviction by an NYC city marshal. Holdover (lease-end / lease-violation) cases run a different but parallel track. Self-help eviction — changing locks, removing belongings, shutting off utilities — is illegal in NYC under RPAPL § 768 and exposes the landlord to civil and criminal penalties."
      bottomLine="If your landlord threatens to lock you out, change the locks, or shut off utilities, that is illegal — only an NYC city marshal with a court-issued warrant can physically evict you. NYC has a Right to Counsel program (Universal Access to Counsel, NYC Admin Code § 26-1301) — qualifying tenants get a free attorney in Housing Court. Call 311 or contact Legal Aid Society NYC the day you receive any eviction notice. Most NYC eviction cases that go to court end in a stipulation (settlement), not a marshal lockout."
      sections={[
        {
          heading: "Step 1 — 14-day rent demand (non-payment cases)",
          body: [
            "If you're behind on rent, the landlord starts the clock with a 14-day demand for rent under RPAPL § 711(2). It must be in writing, must state the exact amount and the period it covers, and must be properly served (personal delivery, substituted service, or — most commonly — posting the notice on the door AND mailing a copy by both regular and certified mail).",
            "If you pay the full amount within the 14 days, the case ends there. If you don't, the landlord can file a non-payment petition in Housing Court. Most non-payment cases reach court 2–4 weeks after the demand.",
          ],
        },
        {
          heading: "Step 2 — petition + court appearance",
          body: [
            "The petition is filed in NYC Housing Court (the borough where the building sits). A court date is set typically 3–8 weeks out. You will be served with the petition and a notice of petition; you have 5 days to file a written answer (for non-payment) or 10 days (for holdover).",
            "On the court date, most cases go to a settlement conference first. NYC's Right to Counsel program assigns a free attorney if your household income is at or below 200% of the federal poverty line. The attorney can negotiate a Stipulation of Settlement — typically a payment plan plus a probationary 'pay-or-vacate' clause. ~80% of NYC non-payment cases resolve at this stage.",
          ],
        },
        {
          heading: "Step 3 — judgment + warrant of eviction",
          body: [
            "If the case doesn't settle, it goes to trial. If the landlord wins (or you default by not appearing), the court issues a judgment of possession plus a warrant of eviction. The warrant is then sent to an NYC city marshal — only marshals (not sheriffs, not the police, not the landlord) can physically execute residential evictions in NYC.",
          ],
        },
        {
          heading: "Step 4 — marshal's 14-day notice + physical eviction",
          body: [
            "The marshal is required to serve a 14-day notice of eviction (sometimes called a Marshal's Notice or 14-Day Notice) before scheduling the physical eviction. This notice must include the eviction date and the marshal's contact information.",
          ],
          bullets: [
            "Within those 14 days you can apply to the court for an Order to Show Cause (OSC) to stay the eviction — common grounds: the rent is paid in full, the case had a procedural defect, you weren't properly served, or you have a hardship.",
            "Hardship stays under RPAPL § 753 can extend the timeline up to 12 months for tenants who can show diligent good-faith efforts to find new housing — particularly in extreme weather, with school-age children, or with serious medical conditions.",
            "If no OSC is filed and granted, on the scheduled date the marshal physically removes the tenant. Belongings can be temporarily stored or removed under court supervision.",
          ],
        },
        {
          heading: "Holdover cases vs. non-payment cases",
          body: [
            "Two parallel tracks. Holdover cases (lease-end, lease-violation, illegal-occupancy) start with a different predicate notice — typically a 30-day, 60-day, or 90-day notice of termination scaled to tenancy length under RPL § 226-c, or a 10-day Notice to Cure followed by a 7-day Notice of Termination for lease violations.",
            "Holdover cases are usually slower than non-payment cases — the landlord must prove the alleged violation, and rent-stabilized tenants have substantive defenses (e.g., the landlord didn't follow DHCR procedure, the cited violation isn't a violation of an enforceable lease term).",
          ],
        },
        {
          heading: "Self-help eviction is illegal in NYC",
          body: [
            "Under RPAPL § 768 and NYC Admin Code § 26-521, landlords cannot evict tenants without going through the court process. Specifically illegal:",
          ],
          bullets: [
            "Changing the locks without a court order.",
            "Removing the tenant's belongings.",
            "Shutting off utilities (heat, hot water, electricity, gas) to force the tenant out.",
            "Threats, harassment, or repeated 'nuisance' visits to pressure the tenant to leave.",
            "If any of these happen, call 911 (lockouts), 311 (HPD complaint for utility shut-offs), or contact Legal Aid Society NYC the same day. Civil damages of up to $10,000 per violation under NYC Admin Code § 26-521(c), plus attorneys' fees.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants have stronger defenses — confirm your status first.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "break-lease-renovation-nyc",
          question: "Can my NYC landlord break my lease for renovations?",
        },
        {
          slug: "free-market-rent-increase-renewal-nyc",
          question:
            "How much can a NYC landlord raise my rent at renewal if I'm not rent-stabilized?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "nyc-heat-hot-water-complaint",
          question:
            "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
        },
      ]}
      relatedReadingHref="/bad-landlord-nj-ny"
      relatedReadingLabel="NYC bad-landlord guide — when to escalate"
    />
  );
}
