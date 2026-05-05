import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-lead-paint-disclosure";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Lead Paint Disclosure — What Local Law 1 Requires (2026)",
  description:
    "NYC Local Law 1 of 2004 requires landlords to investigate and remediate lead paint in pre-1960 buildings where a child under 6 resides. Annual notice, EPA pamphlet, HPD Form OCS-1, and XRF testing on turnover. Class C violation for non-compliance.",
  keywords: [
    "NYC lead paint disclosure",
    "NYC Local Law 1 lead paint",
    "NYC HPD lead paint Form OCS-1",
    "NYC EPA lead paint pamphlet",
    "pre-1960 NYC apartment lead",
    "NYC lead paint child under 6",
    "NYC lead paint XRF turnover testing",
    "NYC lead paint Class C violation",
    "NYC HPD lead violation",
    "Title X lead disclosure NYC",
  ],
  openGraph: {
    title: "What does NYC's lead-paint disclosure law require?",
    description:
      "Pre-1960 NYC building + child under 6 = Local Law 1 obligations: annual notice, EPA pamphlet, OCS-1 form, XRF on turnover. Class C violations.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What does NYC's lead-paint disclosure law require?"
      jurisdictionTag="NYC"
      badges={["Local Law 1 of 2004", "HPD Form OCS-1"]}
      reviewedAt="2026-05-04"
      shortAnswer="Two laws stack in NYC. (1) Federal Title X (Residential Lead-Based Paint Hazard Reduction Act, 42 USC § 4852d) requires every landlord of a pre-1978 building, anywhere in the US, to disclose any known lead paint, give the tenant the EPA's 'Protect Your Family from Lead in Your Home' pamphlet, and attach a federal disclosure form to every lease and renewal. (2) NYC Local Law 1 of 2004 (NYC Admin Code § 27-2056 et seq.) goes much further for pre-1960 buildings where a child under age 6 resides — landlords must investigate annually using HPD Form OCS-1, remediate identified hazards within strict timelines, and conduct XRF testing on every turnover before re-leasing the unit. Failure is a Class C immediately hazardous HPD violation with daily fines."
      bottomLine="If you live in a pre-1960 NYC building and have a child under 6, your landlord MUST send you the OCS-1 annual notice, ask about the child's residency, inspect annually, and remediate any peeling/chipping/intact-but-deteriorating paint within 21 days (or 24 hours for emergencies). At every lease and renewal, the landlord must disclose any known lead presence and give you the EPA pamphlet — and on turnover, conduct XRF testing in the unit before re-leasing. If the landlord skips any step, file 311. Each missed step is a Class C violation with $250–$2,000 daily fines plus potential personal-injury exposure if a child develops elevated blood-lead levels."
      sections={[
        {
          heading: "Federal Title X — applies to every pre-1978 lease in the US",
          body: [
            "42 USC § 4852d (Residential Lead-Based Paint Hazard Reduction Act, 1992) requires every landlord of a 'target housing' unit — defined as housing built before 1978, with limited exceptions — to do three things at every new lease and renewal:",
          ],
          bullets: [
            "Provide the EPA / HUD pamphlet 'Protect Your Family from Lead in Your Home' (English / Spanish / other languages available at epa.gov/lead).",
            "Disclose any known lead-based paint or lead-based paint hazards in the unit, plus any reports or records concerning lead in the unit. The disclosure must be in writing.",
            "Attach the EPA / HUD federal lead disclosure form to the lease, signed by both landlord and tenant, including a 10-day right-of-inspection clause if the tenant chooses.",
            "Civil penalties up to $19,507 per violation (adjusted annually). Triple actual damages plus attorney's fees if a tenant sues. The form is a federal compliance document; missing it is a strict-liability violation independent of any actual harm.",
          ],
        },
        {
          heading: "NYC Local Law 1 of 2004 — much stronger for pre-1960 buildings",
          body: [
            "NYC Local Law 1 of 2004 (codified at NYC Admin Code § 27-2056.1 et seq.) creates a presumption that paint in a pre-1960 NYC building contains lead. The presumption shifts the burden of proof — the landlord must rebut by XRF testing showing the paint is lead-free, not the tenant.",
            "The triggering condition for the most demanding obligations is: pre-1960 NYC building + a child under age 6 resides in the unit. When both apply, the landlord owes:",
          ],
          bullets: [
            "Annual notice (HPD Form OCS-1) sent to every unit between January 1 and February 15 each year, asking whether a child under 6 resides. The form must be returned by the tenant. If the tenant doesn't respond, the landlord must conduct a face-to-face visit and document the response.",
            "Annual inspection by an EPA-certified lead inspector. The inspection covers all painted surfaces — walls, ceilings, doors, windows, trim. Any peeling, chipping, or deteriorated lead-based paint identified must be remediated.",
            "Remediation within 21 days for non-emergency conditions; 24 hours for immediately hazardous conditions (loose chips a child could ingest).",
            "Lead-safe work practices for any repair / renovation in the unit (HUD-style containment, HEPA cleanup, dust-wipe clearance testing).",
            "Turnover XRF testing — every time a unit becomes vacant, the landlord must perform XRF testing in friction surfaces (door jambs, window stools, sashes) and remediate identified lead before re-leasing. The new tenant gets a remediation certificate at lease signing.",
            "Recordkeeping for 10 years — copies of every notice, inspection report, remediation work order, and XRF result must be kept and produced on request to HPD.",
          ],
        },
        {
          heading: "What Local Law 1 does NOT require",
          body: [
            "Common confusions worth clearing up:",
          ],
          bullets: [
            "It does NOT require landlords to abate lead paint in every pre-1960 unit. The trigger is presence of a child under 6 — units occupied only by adults are not covered by the most demanding Local Law 1 obligations (though Title X disclosure still applies).",
            "It does NOT apply to post-1960 NYC buildings. Title X covers pre-1978 buildings, but the NYC presumption and remediation-on-turnover regime is pre-1960 only.",
            "It does NOT require lead-paint-free certification for every unit. A landlord can leave intact, undamaged lead paint in place — the obligation is to remediate paint that is peeling, chipping, or deteriorated, and to remediate any friction surfaces on turnover.",
            "It does NOT shift to the tenant. The tenant has no obligation to test, remediate, or certify anything — the entire compliance burden is on the landlord.",
          ],
        },
        {
          heading: "What to do if your landlord isn't complying",
          body: [
            "Three escalating paths:",
          ],
          bullets: [
            "311 / HPD complaint. Call 311 and file a 'Lead Paint' or 'Peeling Paint' complaint. HPD inspector arrives within 1–10 days. If lead is present and unremediated, HPD issues a Class C immediately hazardous violation with 21-day correction order (24 hours if a child is at imminent risk).",
            "HP-action in NYC Housing Court. File a petition for repair plus civil penalties. Filing fee $45. Judge orders remediation plus statutory penalties under NYC Admin Code § 27-2115. Adds attorney's fees and possible Article 7-A administrator if the landlord chronically ignores violations.",
            "Personal-injury suit if a child is harmed. Children with documented elevated blood-lead levels (≥3.5 µg/dL under current CDC guidance) tied to a non-compliant pre-1960 NYC building have strong personal-injury cases. Statute of limitations runs from the child's 18th birthday, then 3 years. NYC has a specialized lead-paint personal-injury bar that takes these on contingency.",
            "Preserve evidence: take photos of all peeling / chipping paint, save the OCS-1 form (or document its absence), keep blood-lead test results, preserve any HPD violation records (visible at hpdonline.hpdnyc.org by searching the building address).",
          ],
        },
        {
          heading: "What to ask before signing a lease in a pre-1960 NYC building",
          body: [
            "Three questions that protect you at lease signing:",
          ],
          bullets: [
            "Has the landlord performed XRF testing on this unit since the prior tenant moved out, and can they provide the certificate? (Required by Local Law 1 if there will be a child under 6 in the unit.)",
            "Has any lead-based paint been identified in this unit, and if so, when was it last remediated? (Required to be disclosed under federal Title X.)",
            "Will you send me the OCS-1 annual notice between January 1 and February 15? (Required by Local Law 1 if there's a child under 6.)",
            "Compliant landlords answer all three in writing without hesitation. Non-compliant landlords either skip the question or get defensive — both are red flags worth documenting.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Pre-1960 NYC buildings often have additional inspection costs to budget for.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Pre-1960 NYC buildings with 6+ units are usually rent-stabilized — confirm before lease.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-warranty-of-habitability",
          question:
            "What does the NYC warranty of habitability cover?",
        },
        {
          slug: "nyc-bedbug-disclosure-law",
          question: "What does NYC's bedbug-disclosure law require?",
        },
        {
          slug: "nyc-heat-hot-water-complaint",
          question:
            "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
        },
        {
          slug: "nyc-repair-and-deduct",
          question: "Can I repair and deduct from rent in NYC?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC pre-1960 housing — rent stabilization, lead, and habitability rules"
    />
  );
}
