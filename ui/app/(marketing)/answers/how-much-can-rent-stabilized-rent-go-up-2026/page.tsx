import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "how-much-can-rent-stabilized-rent-go-up-2026";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "How Much Can Rent-Stabilized Rent Go Up in NYC in 2026?",
  description:
    "For renewals from Oct 1 2025 – Sep 30 2026: 2.75% on a 1-year, 5.25% on a 2-year. Caps are statutory. The exact dollar amount depends on your current rent.",
  keywords: [
    "rent stabilization increase NYC 2026",
    "RGB increase NYC 2026",
    "2025-2026 rent guidelines",
    "NYC rent increase cap",
    "stabilized renewal increase",
    "1-year stabilized renewal",
    "2-year stabilized renewal",
    "RGB renewal calculator",
  ],
  openGraph: {
    title: "How much can rent-stabilized rent go up in NYC in 2026?",
    description:
      "RGB authorized 2.75% on 1-year and 5.25% on 2-year renewals for the Oct 2025 – Sep 2026 cycle. Use the calculator to compute the exact dollar amount.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="How much can NYC rent-stabilized rent go up in 2026?"
      jurisdictionTag="NYC only"
      badges={["Rent stabilization 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="For renewals signed in the October 1, 2025 – September 30, 2026 cycle, the NYC Rent Guidelines Board authorized 2.75% on a 1-year renewal and 5.25% on a 2-year renewal. The cap is statutory — your landlord cannot lawfully demand more, regardless of market conditions or improvements."
      bottomLine="Run your current rent through the RGB Renewal Calculator below for the exact dollar amount. If your landlord demands more than 2.75% / 5.25%, that demand is a stabilization violation and DHCR is the enforcement body."
      sections={[
        {
          heading: "What the 2025–2026 RGB Order says",
          body: [
            "The Rent Guidelines Board, an appointed nine-member NYC body, sets renewal caps each summer. The order takes effect October 1 and governs every renewal lease that begins between October 1 and the following September 30. Order #57 (issued June 2025) authorized:",
          ],
          bullets: [
            "1-year renewal: 2.75%",
            "2-year renewal: 5.25%",
            "Vacancy / mid-lease changes: governed by separate vacancy increase rules — typically zero for in-place tenants, with narrow exceptions.",
          ],
        },
        {
          heading: "How the calculation works",
          body: [
            "Start with the current legal regulated rent — the rent on your most recent renewal lease, not any preferential rent. Multiply by 1.0275 for a 1-year renewal or 1.0525 for a 2-year. Round to the nearest cent.",
            "Example: $2,400/month current legal rent → $2,466/month on a 1-year renewal, $2,526/month on a 2-year renewal.",
            "If you have a 'preferential rent' (a discount below the legal regulated rent your landlord agreed to give you), the renewal increase applies to whichever rent figure your lease specifies the increase will be calculated on. Read the lease.",
          ],
        },
        {
          heading: "What landlords sometimes try to add (and can't)",
          body: [
            "Common attempted add-ons that are not lawful in 2025–2026:",
          ],
          bullets: [
            "FARE Act 'recovery' fee — the broker fee is not a tenant cost on a stabilized renewal.",
            "MCI (Major Capital Improvement) increases — these were largely curbed by the 2019 HSTPA. New MCI orders cannot exceed 2% per year of any individual tenant's rent and have a 30-year sunset.",
            "IAI (Individual Apartment Improvement) increases — capped under HSTPA at 1/15 of $15,000 per month for buildings with ≤35 units; 1/12 of $15,000 for ≤35 units that take a one-time IAI.",
            "Administrative fees, processing fees, lease-prep fees on stabilized renewals — none lawful.",
          ],
        },
        {
          heading: "What to do if your landlord demands more",
          body: [
            "First, confirm the unit is stabilized via the rent-stabilization checker. Then run the RGB calculator on your specific rent. If the renewal offer is above the cap, write the landlord, cite RGB Order #57 and the lawful amount, and ask for a corrected renewal lease.",
            "If they refuse, file an Administrative Complaint with DHCR. DHCR will investigate and issue a finding. Successful overcharge complaints can include treble damages (3×) on willful overcharges in addition to the refund.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb: "Plug in your current rent for the exact dollar increase.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb: "Confirm the unit is stabilized first.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question:
            "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "can-landlord-raise-rent-after-fare-act",
          question:
            "Can my NYC landlord raise the rent to cover the broker fee?",
        },
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "can-broker-charge-administrative-fee-nyc",
          question:
            "Can a NYC broker charge an 'administrative fee' under the FARE Act?",
        },
        {
          slug: "fare-act-broker-fee-refund",
          question:
            "Can I get my NYC broker fee refunded under the FARE Act?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC rent stabilization — complete tenant guide"
    />
  );
}
