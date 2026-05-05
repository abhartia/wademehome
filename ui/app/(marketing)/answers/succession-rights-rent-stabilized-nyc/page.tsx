import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "succession-rights-rent-stabilized-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Rent-Stabilized Succession Rights — Who Inherits the Lease? (2026)",
  description:
    "Family members who lived with a rent-stabilized tenant for at least 2 years (or 1 year for seniors / disabled occupants) can succeed to the tenancy at the existing legal regulated rent. 9 NYCRR § 2523.5(b). Documentation rules and DHCR procedure.",
  keywords: [
    "NYC rent stabilization succession",
    "rent stabilized succession rights NYC",
    "9 NYCRR 2523.5 succession",
    "DHCR succession claim",
    "rent stabilized lease inheritance NYC",
    "NYC family member succession",
    "rent stabilized senior succession 1 year",
    "rent stabilized non-traditional family succession",
    "Braschi succession NYC",
    "NYC stabilized partner succession",
  ],
  openGraph: {
    title: "Who can succeed to a NYC rent-stabilized lease?",
    description:
      "2-year co-residency for family members, 1-year for seniors / disabled. 9 NYCRR § 2523.5(b). Documentation and DHCR procedure.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Who has succession rights to a NYC rent-stabilized apartment?"
      jurisdictionTag="NYS / NYC"
      badges={["9 NYCRR § 2523.5(b)", "Braschi (1989)"]}
      reviewedAt="2026-05-04"
      shortAnswer="A family member who has lived in the rent-stabilized unit with the named tenant as their primary residence for at least two years immediately before the named tenant moves out or dies — or one year if the family member is a senior (62+) or disabled — can succeed to the tenancy at the existing legal regulated rent. The rule is in DHCR's Rent Stabilization Code 9 NYCRR § 2523.5(b). 'Family' is defined broadly under § 2520.6(o) and Braschi v. Stahl Associates (NY 1989) — it includes spouses, parents, children, siblings, grandparents, grandchildren, in-laws, and any non-traditional family member who can show emotional and financial commitment. Succession transfers the lease at the same regulated rent — there is no vacancy increase, no new market-rate lease, and no charge for transferring the tenancy."
      bottomLine="If you've lived with a rent-stabilized tenant for 2+ years (or 1+ year if you're 62+ or disabled), document the co-residency now — bills, taxes, mail, leases, joint accounts in the unit's address — and notify the landlord in writing when the named tenant moves out or dies. The landlord cannot deny succession to a qualified family member. If the landlord serves a holdover petition, raise succession as a defense in Housing Court and request DHCR's review of the lease. Non-traditional family members (long-term partners, chosen family, caregivers) are explicitly covered under Braschi — courts look at the totality of the relationship, not just blood or marriage."
      sections={[
        {
          heading: "The 2-year / 1-year co-residency rule",
          body: [
            "9 NYCRR § 2523.5(b) — DHCR's Rent Stabilization Code — gives a family member who has lived with the named rent-stabilized tenant in the unit as a primary residence for two consecutive years immediately preceding the named tenant's permanent vacating of the unit (move-out, death, or transfer to a nursing home) the right to succeed to the tenancy on a renewal lease at the existing legal regulated rent. The 2-year clock includes any period the tenant was on active military duty, in the hospital, in a nursing home, or otherwise temporarily absent.",
            "If the successor is a senior (age 62+) or has a disability as defined under § 2523.5(b)(2), the co-residency requirement drops to one year. The same one-year rule applies to a senior or disabled spouse who establishes residency before becoming a senior.",
          ],
          bullets: [
            "Co-residency must be in the same unit. Living next door does not count.",
            "Co-residency must be primary residence — not a part-time arrangement or a 'crash pad.'",
            "Co-residency must be continuous through the named tenant's vacatur. Moving out for school or work mid-period typically breaks the chain (with exceptions for temporary absences enumerated by DHCR).",
            "Co-residency is documented through utility bills, voter registration, tax returns, driver's license, bank statements, lease (if any), W-2s, employment records, professional licenses, all listing the unit's address during the period.",
            "The named tenant must move out or die — not just stop paying rent. Eviction by the landlord for cause (e.g., non-payment) does NOT trigger succession rights.",
          ],
        },
        {
          heading: "Who counts as 'family' — the Braschi rule",
          body: [
            "9 NYCRR § 2520.6(o) defines 'family' for rent-stabilization purposes as: spouse, parent, child, stepparent, stepchild, brother, sister, grandparent, grandchild, parent-in-law, son-in-law, daughter-in-law, OR 'any other person residing with the tenant in the housing accommodation as a primary residence, who can prove emotional and financial commitment, and interdependence between such person and the tenant.' That last clause comes from Braschi v. Stahl Associates Co. (74 NY2d 201, 1989) — the Court of Appeals held that an unmarried gay partner could succeed to a rent-controlled lease because the relationship met the 'functional family' standard.",
            "Following Braschi, DHCR adopted a non-exhaustive multi-factor test to determine non-traditional family status. Courts consider:",
          ],
          bullets: [
            "Length and exclusivity of the relationship.",
            "Joint financial arrangements (shared bank accounts, joint ownership of property, named beneficiary on insurance/retirement, shared expenses).",
            "Shared household activities and presence at family/social events.",
            "Reliance for emotional and financial support.",
            "Public holding-out as a family unit (introductions, social media, joint travel, holiday cards).",
            "Care during illness or disability.",
            "Formalized commitments (registered domestic partnership, jointly executed wills, healthcare proxies, powers of attorney).",
            "No single factor is dispositive. Courts look at the totality of the relationship.",
          ],
        },
        {
          heading: "What rent does the successor inherit?",
          body: [
            "The successor inherits the unit at the same legal regulated rent the named tenant was paying. There is no vacancy increase. There is no 'first rent' or new-tenant adjustment. The HSTPA 2019 amendments closed the loophole that let landlords charge a 'longevity bonus' or 'vacancy bonus' on succession; succession is now a continuation of the existing tenancy, not a new tenancy.",
            "If the named tenant was paying a preferential rent below the legal regulated rent, the successor inherits the preferential rent for the duration of the renewal lease. At the next renewal after that, the landlord can raise to the legal regulated rent under HSTPA § 6-419 only if the original lease language preserved that right — most pre-2019 preferential-rent leases contain language that lets the landlord do this; most 2019-onward leases do not, because HSTPA changed the default rule.",
          ],
        },
        {
          heading: "How to assert succession rights",
          body: [
            "Three steps when the named tenant moves out or dies:",
          ],
          bullets: [
            "Notify the landlord in writing within 30 days of the named tenant's vacatur. State that you are claiming succession rights under 9 NYCRR § 2523.5(b), provide the date the named tenant vacated, and request a renewal lease in your name at the existing regulated rent.",
            "Compile co-residency documentation. The strongest case has 4–6 different document types covering the full 2-year (or 1-year) period: tax returns showing the unit's address, voter registration, driver's license, bank statements, employer records, utility bills in your name at the unit, joint bank accounts with the named tenant, a lease addendum or rider naming you, NYS personal income tax returns showing the unit address.",
            "If the landlord refuses to issue a renewal lease, file a complaint with NYS HCR (DHCR) using Form RA-22 (or via DHCR's online portal at hcr.ny.gov). DHCR will investigate and issue an order. If the landlord starts a holdover proceeding in Housing Court, raise succession as an affirmative defense — the case will be transferred to DHCR or held pending DHCR's determination.",
          ],
        },
        {
          heading: "Common reasons succession is denied (and how to fix them)",
          body: [
            "DHCR and Housing Court denials usually come down to documentation gaps or co-residency disputes. The fixable problems:",
          ],
          bullets: [
            "Insufficient address documentation. Solution: pull old tax returns from the IRS (Form 4506-T, free), DMV records (NY DMV abstract via dmv.ny.gov), and bank statements going back 2 years. Voter registration records are public — pull from the NYC Board of Elections.",
            "Brief absences during the 2-year period. Solution: document the temporary nature of the absence (school transcripts, military orders, hospital records). DHCR allows reasonable temporary absences without breaking the co-residency chain.",
            "Landlord did not know you lived there. Solution: succession rights do not require the landlord's knowledge or consent. Even if you weren't on the lease and the landlord never met you, the co-residency is what matters. Bills and taxes in your name at the address rebut any 'never lived here' argument.",
            "Named tenant did not move out — they died. Solution: succession on death works the same way. Bring the death certificate plus your co-residency documentation. The 2-year (or 1-year) period is calculated backward from the date of death.",
            "Multiple family members claim succession. Solution: § 2523.5(b) gives DHCR discretion to issue the lease to one successor or to issue a joint lease to multiple. Document who actually lived in the unit during the relevant period.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Confirm the unit is stabilized — succession rights only attach to stabilized tenancies.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Run the lawful renewal increase the successor lease will get.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "dhcr-rent-history-request-nyc",
          question:
            "How do I request a NYC apartment's rent history from DHCR?",
        },
        {
          slug: "rent-stabilization-vacancy-decontrol-nyc",
          question: "Did HSTPA end vacancy decontrol in NYC?",
        },
        {
          slug: "vacancy-lease-rent-stabilized-nyc",
          question:
            "What happens to a NYC rent-stabilized rent when the unit goes vacant?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent-stabilization 2026 guide — how the system works"
    />
  );
}
