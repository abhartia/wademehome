import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "vacancy-lease-rent-stabilized-nyc";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "What Happens to a NYC Rent-Stabilized Rent When the Unit Goes Vacant? (2026)",
  description:
    "After HSTPA 2019, vacancy lease rent equals the prior tenant's legal regulated rent — no 20% vacancy bonus, no longevity adjustment, no high-rent vacancy decontrol. The new tenant inherits the stabilized rent and the protections that come with it.",
  keywords: [
    "NYC rent stabilized vacancy lease",
    "rent stabilized vacancy increase NYC",
    "HSTPA vacancy bonus eliminated",
    "9 NYCRR 2522.8 vacancy lease",
    "rent stabilized first lease new tenant",
    "NYC rent stabilized vacancy rent",
    "HSTPA longevity adjustment ended",
    "rent stabilized vacancy decontrol ended",
    "preferential rent vacancy lease",
    "NYC stabilized rent on vacancy",
  ],
  openGraph: {
    title:
      "What happens to a rent-stabilized rent when the unit goes vacant?",
    description:
      "Vacancy lease rent equals the prior tenant's legal regulated rent. HSTPA 2019 ended the 20% vacancy bonus and longevity adjustment.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What happens to a NYC rent-stabilized rent when the unit goes vacant?"
      jurisdictionTag="NYS / NYC"
      badges={["HSTPA 2019", "9 NYCRR § 2522.8"]}
      reviewedAt="2026-05-04"
      shortAnswer="A NYC rent-stabilized unit's legal regulated rent does NOT reset on vacancy. Since HSTPA's June 14, 2019 changes, the new tenant's vacancy lease starts at the same legal regulated rent the prior tenant was paying — there is no 20% vacancy bonus, no longevity adjustment, and no high-rent vacancy decontrol. The new tenant gets a 1-year or 2-year vacancy lease at that rent, with the RGB-set vacancy lease guidelines (currently 0% additional, since HSTPA eliminated the increase). Individual Apartment Improvement (IAI) increases are still possible if the landlord did substantial renovations, but capped at $89/month over 15 years (HSTPA § 6-446). Once stabilized, always stabilized — the unit cannot leave the system through vacancy."
      bottomLine="If you're renting a NYC stabilized unit after a prior tenant moved out, the rent on your vacancy lease should match the legal regulated rent the prior tenant was paying — not a 'market rate' the landlord set. Pull the rent history from DHCR (free, online) before signing. Any rent above the prior legal regulated rent (plus a documented IAI increase capped at $89/month) is overcharge — recoverable via DHCR complaint with treble damages for willful violations. Prior to HSTPA, vacancy increases used to add 20%+ on every turnover and were the main path units took out of stabilization; that loophole is now permanently closed."
      sections={[
        {
          heading: "What HSTPA changed for vacancy leases",
          body: [
            "Before HSTPA (2019), a stabilized unit going vacant triggered three increases: a 20% statutory vacancy bonus, a 0.6% longevity adjustment per year over 8 years (capped at the bonus), and an Individual Apartment Improvement passthrough that was uncapped if the landlord submitted documentation. On a $1,500/month unit, a 6-year longevity vacancy could legally raise the next tenant's rent to roughly $2,000+. After 1993, if the rent crossed the high-rent vacancy decontrol threshold (~$2,775 in 2019), the unit left stabilization permanently.",
            "HSTPA, signed June 14, 2019, eliminated all three of those mechanisms:",
          ],
          bullets: [
            "20% vacancy bonus — repealed entirely. New vacancy leases get 0% statutory increase on top of the prior legal regulated rent.",
            "Longevity adjustment — repealed entirely. Length of prior tenancy no longer affects the next tenant's rent.",
            "High-rent vacancy decontrol — repealed entirely. There is no longer ANY rent threshold that allows a stabilized unit to leave stabilization through vacancy. Once stabilized, always stabilized.",
            "RGB vacancy guidelines — RGB previously set a separate vacancy lease guideline; since HSTPA, that authority is gone. Vacancy leases follow the same renewal guideline as a tenant in possession.",
            "IAI increases — still allowed but capped at $89/month over 15 years (RSL § 26-511(c)(13)) with documented work. Repairs/maintenance are not IAIs.",
          ],
        },
        {
          heading: "How the vacancy lease rent is calculated today",
          body: [
            "The rent on a vacancy lease is built from three components — the prior tenant's last legal regulated rent (not the prior tenant's preferential rent if those differed; the legal rent governs the stabilization framework, but see the preferential-rent note below), plus the current RGB-set increase guideline that applies during the lease term, plus any documented IAI increase up to the cap.",
          ],
          bullets: [
            "Step 1: Pull the prior tenant's last registered rent from DHCR's annual rent registration. Use Form RA-90 (paper) or DHCR's online portal at hcr.ny.gov.",
            "Step 2: Apply the RGB guideline for the lease term you're signing. For Oct 2025 – Sep 2026 (RGB Order 56), 1-year leases: 2.75%; 2-year leases: 5.25%. These are the same percentages a tenant-in-possession renewal gets — vacancy adds nothing extra.",
            "Step 3: If the landlord did documented Individual Apartment Improvements between the prior tenancy and yours, they can pass through 1/180th of the cost per month for buildings with ≤35 units, or 1/180th for >35 units, capped at $89/month total. The landlord must submit DHCR Form RA-79 with itemized invoices and proof of payment. IAIs are NOT repairs (e.g., new floors are an IAI, refinishing existing floors is a repair).",
            "Step 4: The result is the legal regulated rent on your vacancy lease. The landlord can offer you a lower preferential rent if they want, but they cannot offer you a higher rent.",
          ],
        },
        {
          heading: "Preferential rent on the vacancy lease",
          body: [
            "If the prior tenant had a preferential rent (a rent below the legal regulated rent that the landlord agreed to), the new vacancy lease starts from the prior tenant's LEGAL regulated rent, not the prior preferential rent. This is the only common situation where the new tenant's rent appears to 'jump' — but it's not a vacancy increase, it's the natural reset to the legal rent the landlord was always entitled to charge.",
            "If the landlord offers YOU a preferential rent, HSTPA § 6-419 says the preferential rent attaches for the duration of your tenancy — the landlord cannot raise you to the legal regulated rent at renewal unless your original lease language preserved that right (most 2019-onward leases do not preserve it; some pre-2019 holdover leases do). Read your lease before signing.",
          ],
        },
        {
          heading: "Verifying the vacancy lease rent isn't an overcharge",
          body: [
            "If you're signing or recently signed a vacancy lease on a stabilized unit, run this 4-step check:",
          ],
          bullets: [
            "Pull the building's rent registration from DHCR. The annual registration shows every legal regulated rent on every stabilized unit since at least 2009. Free request via the online portal — typically 2–6 weeks for a paper response.",
            "Identify the prior tenant's last legal regulated rent (not preferential). The DHCR registration shows both columns side by side.",
            "Compare your vacancy lease rent to: prior legal regulated rent + RGB renewal guideline + any documented IAI cap ($89/month max). Anything above that is potential overcharge.",
            "If you find an overcharge, file Form RA-89 with DHCR within 6 years of the first overcharged rent payment. HSTPA extended the lookback to 6 years and authorizes treble damages for willful overcharges. Recovery includes a refund of the excess plus 9% interest plus attorneys' fees.",
          ],
        },
        {
          heading: "What HSTPA did NOT change about vacancy leases",
          body: [
            "Three things still work the same way:",
          ],
          bullets: [
            "Length of lease — the new tenant still picks 1-year or 2-year and gets the corresponding RGB guideline.",
            "Renewal lease offer — the landlord must offer a renewal at the lawful guideline 90–150 days before the lease ends (RPL § 226-c(2)).",
            "Major Capital Improvement (MCI) increases — passed through building-wide for major capital work, with HSTPA caps now at 2% per year (down from 6%) and a 30-year amortization (up from 7).",
            "Succession rights — a family member who lived with the new tenant for 2 years (1 year if senior or disabled) succeeds to the lease at the same legal regulated rent.",
            "Stabilization status — the unit remains stabilized for as long as the building's stabilization basis (number of units + construction year, or 421-a / J-51 abatement) holds.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Confirm the unit is stabilized before checking the vacancy rent calc.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Run the lawful guideline that applies to your vacancy lease term.",
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
          slug: "succession-rights-rent-stabilized-nyc",
          question: "Who has succession rights to a NYC rent-stabilized apartment?",
        },
        {
          slug: "how-much-can-rent-stabilized-rent-go-up-2026",
          question: "How much can NYC rent-stabilized rent go up in 2026?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent-stabilization 2026 guide — every rule that survived HSTPA"
    />
  );
}
