import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-sublet-rules-lease-assignment";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Can I Sublet My NYC Apartment? (RPL § 226-b, 2026 Rules)",
  description:
    "Yes — most NYC tenants in buildings with 4+ units have a statutory right to sublet under NY Real Property Law § 226-b. Landlord consent is required but cannot be unreasonably withheld. Lease assignment is different and requires explicit consent.",
  keywords: [
    "NYC sublet rules",
    "RPL 226-b sublet",
    "NYC sublet rights",
    "lease assignment NYC",
    "NYC sublet without permission",
    "rent stabilized sublet rules",
    "NYC sublet 10% surcharge",
    "Real Property Law 226-b",
    "Airbnb NYC legal",
    "NYC short-term rental ban",
  ],
  openGraph: {
    title: "Can I sublet my NYC apartment?",
    description:
      "Yes for most 4+ unit buildings under RPL § 226-b. Consent required but cannot be unreasonably withheld.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can I sublet my NYC apartment?"
      jurisdictionTag="NYS / NYC"
      badges={["RPL § 226-b", "4+ unit buildings"]}
      reviewedAt="2026-05-03"
      shortAnswer="Yes — if your NYC building has 4 or more units, NY Real Property Law § 226-b gives you a statutory right to sublet that the lease cannot waive. The landlord's consent is required, but it cannot be unreasonably withheld. The procedure is statutory: written request, 30-day landlord response window, and (if denied without reason) the right to sublet anyway. Buildings with 3 or fewer units are not covered by § 226-b — your lease language controls. Lease ASSIGNMENT (transferring the entire lease to a new tenant) is different — it requires explicit landlord consent and the landlord can refuse for any reason."
      bottomLine="In a 4+ unit NYC building you have a real, statutory right to sublet. Send the landlord a § 226-b-compliant written request by certified mail. The landlord has 10 days to ask follow-up questions and 30 days from your original request (or 30 days from receiving answers to follow-ups, whichever is later) to consent or reasonably refuse. Silence = consent. A § 226-b sublet does NOT give you the right to charge the subletter more than your rent (10% furnished surcharge max) — overcharging the subletter is itself a § 226-b violation."
      sections={[
        {
          heading: "What § 226-b actually says",
          body: [
            "NY Real Property Law § 226-b applies to any tenant in a building of 4 or more units, including rent-stabilized, rent-controlled, and free-market tenants. The statute creates a non-waivable right to sublet 'subject to the written consent of the landlord in advance of the subletting,' with consent that 'shall not be unreasonably withheld.'",
            "What 'reasonable' means in practice: the landlord can refuse if the proposed subletter has poor credit, fails normal screening criteria, or has a documented history that would justify rejecting any new tenant. The landlord cannot refuse on grounds that aren't the subletter's individual qualifications — for example, a blanket 'no sublets ever' rule is unenforceable in a 4+ unit building.",
          ],
        },
        {
          heading: "The § 226-b procedure (verbatim from the statute)",
          body: [
            "Mail certified return-receipt to the landlord at least 30 days before the proposed sublet start date. Include:",
          ],
          bullets: [
            "The proposed sublet start and end dates.",
            "The reason for the sublet (e.g., 'temporary out-of-state job').",
            "The address you'll be at during the sublet (the statute requires you to keep this as a primary residence in some way — sublets are not assignments).",
            "The proposed subletter's full name, current address, and a written sublet agreement signed by you and the subletter.",
            "The names and addresses of all tenants on the original lease.",
            "Within 10 days of receiving your request, the landlord can ask for additional information (credit, references). Within 30 days of your original request (or 30 days of getting all the additional info, if requested), the landlord must consent or refuse with reasons. Silence past that 30-day window = consent under § 226-b.",
          ],
        },
        {
          heading: "Sublet vs. assignment vs. roommate — three different things",
          body: [
            "These get conflated; § 226-b only covers one of them:",
          ],
          bullets: [
            "Sublet — you remain the tenant on the lease, and a third party temporarily occupies the unit and pays you. § 226-b applies in 4+ unit buildings.",
            "Assignment — you transfer the entire lease to a new tenant, who becomes the lease-holder and pays the landlord directly. § 226-a (separate statute) applies and the landlord can refuse for ANY reason. There is no 'unreasonably withheld' standard for assignments.",
            "Roommate (Roommate Law, RPL § 235-f) — you continue to live in the unit and add a roommate. Different statute, different rules. The lease cannot bar you from having one additional adult roommate plus that roommate's dependent children.",
          ],
        },
        {
          heading: "Rent stabilization adds extra rules",
          body: [
            "If your unit is rent-stabilized, additional § 226-b sublet rules layer on top:",
          ],
          bullets: [
            "Maximum 2 years of sublet within any 4-year period.",
            "You must intend to return at the end of the sublet — the unit must remain your primary residence.",
            "You can charge the subletter up to your legal regulated rent. If the unit is fully furnished, you can add a 10% furnished surcharge — that's the max.",
            "Charging the subletter MORE than your rent + 10% surcharge is a § 226-b violation. The subletter can recover the overcharge, plus treble damages if willful, plus attorneys' fees.",
            "Failure to give § 226-b notice and obtain consent can result in eviction proceedings. Don't sublet without going through the procedure in a stabilized unit.",
          ],
        },
        {
          heading: "Short-term rentals (Airbnb) — separate ban",
          body: [
            "§ 226-b sublets must be for at least 30 consecutive days. Anything shorter is governed by NYC's short-term rental rules (NYC Admin Code § 26-2101 et seq., enforced via Local Law 18 / 2022 registration). Most short-term rentals in Class A multiple dwellings are illegal in NYC unless the host is present during the stay AND the unit is registered with the Office of Special Enforcement.",
            "Landlord lease language banning Airbnb is enforceable independent of § 226-b. Most NYC leases explicitly bar short-term rentals — and even where they don't, NYC law typically does. Don't list a NYC apartment on Airbnb without confirming registration eligibility first.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Confirm whether your sublet is governed by stabilized rules.",
        },
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-Effective Rent Calculator",
          blurb:
            "Make sure the sublet rent doesn't exceed your legal rent + 10%.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "break-lease-renovation-nyc",
          question: "Can my NYC landlord break my lease for renovations?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "free-market-rent-increase-renewal-nyc",
          question:
            "How much can a NYC landlord raise my rent at renewal if I'm not rent-stabilized?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent stabilization — full 2026 guide"
    />
  );
}
