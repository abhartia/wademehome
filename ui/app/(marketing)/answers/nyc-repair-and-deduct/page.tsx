import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-repair-and-deduct";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Repair-and-Deduct — When You Can (and When You Should) (2026)",
  description:
    "NYC tenants can hire a third-party repair vendor and deduct the cost from rent IF the landlord ignored the repair request, the issue is a warranty-of-habitability breach, the repair is reasonable, and you have written documentation. The safer path is HP-action.",
  keywords: [
    "NYC repair and deduct",
    "NYC tenant repair deduct",
    "NYC warranty of habitability repair",
    "NYC RPL 235-b repair deduct",
    "NYC Jangla repair deduct",
    "NYC HP action vs repair deduct",
    "NYC tenant repair rent withholding",
    "NYC self-help repair tenant",
    "NYC tenant fix and deduct",
    "NYC repair receipt deduct rent",
  ],
  openGraph: {
    title: "Can NYC tenants repair and deduct from rent?",
    description:
      "Yes — under common-law doctrine and RPL § 235-b — but only after written notice, proven habitability breach, and reasonable cost. HP-action is safer.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can I repair and deduct from rent in NYC?"
      jurisdictionTag="NYS / NYC"
      badges={["RPL § 235-b", "Common law"]}
      reviewedAt="2026-05-04"
      shortAnswer="Yes — NYC tenants can hire a third-party vendor to make a repair the landlord refused to make and deduct the cost from rent, but the doctrine is fact-specific and risky if not done correctly. The legal basis is the implied warranty of habitability under RPL § 235-b combined with NY common-law repair-and-deduct (sometimes called Jangla v. Tahmer). To use the doctrine safely you need: (1) written notice to the landlord that gave a reasonable opportunity to fix the problem, (2) a documented warranty-of-habitability breach (not a cosmetic issue — heat, hot water, water leaks, electricity, pest infestations, structural defects, broken appliances that came with the unit), (3) the repair done by a licensed vendor at a reasonable cost (no DIY without strong documentation), and (4) all receipts, invoices, before/after photos, and the prior written-notice trail kept on file. The safer alternative for most tenants is filing an HP-action in NYC Housing Court — free, judge-ordered, and the landlord pays."
      bottomLine="Repair-and-deduct is legal in NYC but is the riskiest of the three habitability remedies. If the landlord disputes the deduction, you may face a non-payment proceeding in Housing Court where the burden shifts to you to prove every element of the doctrine. The two safer alternatives — (1) filing an HP-action ($45 filing fee, judge orders the landlord to repair plus civil penalties, no money from you), and (2) filing a 311 / HPD complaint that brings an inspector who issues violations — both work better in practice. Reserve repair-and-deduct for emergencies (no heat in January, raw sewage backup) where waiting for a court date is itself a habitability harm."
      sections={[
        {
          heading: "The legal basis — RPL § 235-b plus common-law doctrine",
          body: [
            "NY Real Property Law § 235-b (the implied warranty of habitability, enacted 1975) is the foundation. Every residential lease in NYS contains an implied warranty that the unit is fit for human habitation, fit for the uses reasonably intended, and free of conditions that endanger life, health, or safety. The warranty cannot be waived, even with lease language saying so.",
            "Three remedies for breach of § 235-b are recognized:",
          ],
          bullets: [
            "Rent abatement — sue or counterclaim for partial rent refund matching the percentage of habitability lost (e.g., 25% abatement during a 3-month no-heat period). Calculated retroactively.",
            "Specific performance — court orders the landlord to repair (HP-action procedure).",
            "Repair-and-deduct — tenant pays for the repair from a third-party vendor and deducts the cost from rent, after giving the landlord written notice and reasonable opportunity. The common-law foundation is centuries-old; modern NYC application traces to Jangla v. Tahmer (NY 1979) and follow-on Housing Court decisions.",
            "Of the three, repair-and-deduct is the most aggressive and the most fact-dependent. Courts review every deduction case skeptically — the burden of proof is on the tenant.",
          ],
        },
        {
          heading: "When repair-and-deduct works",
          body: [
            "Five elements every successful repair-and-deduct case has:",
          ],
          bullets: [
            "Written notice to the landlord. Email, certified mail, or DocuSign-style timestamped delivery — anything that creates a record. Phone calls and verbal complaints are insufficient. Specify the condition, the date you noticed it, and request repair within a reasonable time (typically 14 days for non-emergencies, 24–48 hours for heat / hot water / no electricity / water main).",
            "Reasonable opportunity ignored. The landlord must have failed to repair after the notice — not 'didn't repair fast enough,' but 'made no good-faith effort.' If a contractor came and started work, you generally cannot pivot to repair-and-deduct.",
            "Habitability-level condition. RPL § 235-b reaches: no heat / hot water, water leaks affecting the unit, no electricity, broken essential appliances that came with the unit, vermin / rodent infestation, structural defects (sagging floors, broken stairs), broken windows, mold (sometimes), broken locks. Cosmetic or convenience issues (faded paint, slow drains, kitchen cabinet hinges) typically do not qualify.",
            "Reasonable cost and licensed vendor. The repair must cost roughly what a market-rate licensed contractor would charge. Hire a licensed plumber, electrician, exterminator, etc. — not a friend, not yourself, not the cheapest unlicensed option. Save the invoice with the contractor's license number, contact info, and detailed line items.",
            "Documentation. Photos before and after, the written notice trail with delivery confirmation, the invoice, proof of payment (bank statement, credit card receipt), and a written notice to the landlord that you've completed the repair and are deducting the amount from next month's rent.",
          ],
        },
        {
          heading: "The HP-action alternative",
          body: [
            "An HP-action is a special Housing Court proceeding where a tenant petitions for orders directing the landlord to make repairs and to comply with HPD violations. It's faster, cheaper, and lower-risk than repair-and-deduct.",
          ],
          bullets: [
            "Filing fee: $45, waivable for low-income tenants.",
            "Where: NYC Housing Court in your borough. Pro se filings are common and the court has Help Centers on every floor.",
            "Timeline: 2–4 weeks from filing to first appearance, often a hearing within a week if there's a 'pattern of harassment' allegation.",
            "Outcome: judge-issued Order to Correct directing the landlord to fix specified violations within 14 days (faster for emergencies). Failure to comply = civil contempt, fines, and possible Article 7-A administrator (court-appointed manager who collects rent and pays for repairs).",
            "Cost to tenant: $0 in repairs (the landlord pays). Compare to repair-and-deduct, where the tenant fronts the money and risks a non-payment dispute over the deduction.",
            "When NOT to use HP-action: emergencies that cannot wait for a court date (no heat in winter, water main broken, raw sewage) — that's where repair-and-deduct or 311 / HPD inspector-issued violations work faster.",
          ],
        },
        {
          heading: "The 311 / HPD complaint path",
          body: [
            "311 / HPD is the lowest-friction first step for habitability complaints. It's free, generates an inspector visit, and puts violations on the building's HPD record (visible to lenders, insurers, and FIRE/HPD if violations accumulate).",
          ],
          bullets: [
            "Call 311 or use the NYC311 app. Specify the condition (no heat, water leak, vermin, broken window, broken lock).",
            "HPD inspector typically visits within 1–10 days. They issue Class A (non-hazardous), Class B (hazardous), or Class C (immediately hazardous) violations.",
            "Class C violations require correction within 24 hours (heat / hot water) or 5–7 days (other immediately hazardous).",
            "Most landlords repair fast once a Class C violation is on record, because Class Cs trigger HPD's emergency repair program where HPD can hire a contractor and bill the landlord at premium rates.",
            "Best workflow: 311 first to create a paper trail, HP-action second if landlord ignores violations, repair-and-deduct as a last resort for emergencies that cannot wait.",
          ],
        },
        {
          heading: "What to do if the landlord disputes a repair-and-deduct",
          body: [
            "If you deducted and the landlord serves a 14-day rent demand or non-payment petition for the deducted amount, your defenses in court are:",
          ],
          bullets: [
            "Affirmative defense: § 235-b warranty breach. Show the documentation — written notice, before/after photos, invoice, proof of payment.",
            "Counterclaim for additional rent abatement covering the period before the repair-and-deduct.",
            "Counterclaim for attorney's fees under RPL § 234 (mutual fees clause).",
            "Counterclaim for any harassment / anti-retaliation damages if the non-payment was retaliatory under RPL § 223-b.",
            "Most repair-and-deduct cases settle in stipulation — the landlord accepts the deduction in exchange for the tenant withdrawing the abatement counterclaim. If the case goes to trial, the burden of proof is on the tenant to establish each of the five elements above.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Plan ahead — emergency repairs are easier when move-in budget includes a buffer.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants have additional remedies including DHCR rent reduction for service breaches.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-warranty-of-habitability",
          question:
            "What does the NYC warranty of habitability cover?",
        },
        {
          slug: "nyc-heat-hot-water-complaint",
          question:
            "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
        },
        {
          slug: "nyc-illegal-lockout-damages",
          question:
            "What can I do if my NYC landlord illegally locks me out?",
        },
        {
          slug: "nyc-bedbug-disclosure-law",
          question: "What does NYC's bedbug-disclosure law require?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC tenant rights — every protection that survived 2019 HSTPA"
    />
  );
}
