import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "can-landlord-raise-rent-after-fare-act";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Can NYC Landlords Raise Rent to Cover the Broker Fee? (2026)",
  description:
    "On free-market units: yes, but the new rent is the new rent — pricing is set by market, not by lease. On rent-stabilized units: no, RGB caps the renewal increase regardless of broker fee.",
  keywords: [
    "FARE Act rent increase",
    "landlord raise rent broker fee NYC",
    "FARE Act rent pass-through",
    "NYC rent increase 2026",
    "free market rent NYC",
    "rent stabilized rent increase 2026",
    "FARE Act loophole rent",
    "broker fee priced into rent",
  ],
  openGraph: {
    title: "Can my NYC landlord raise the rent to cover the broker fee?",
    description:
      "On free-market units, asking rents drift to whatever the market bears — including the FARE Act effect. On rent-stabilized units, RGB caps it.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Can my NYC landlord raise the rent to cover the broker fee?"
      jurisdictionTag="NYC only"
      badges={["FARE Act 2026"]}
      reviewedAt="2026-04-30"
      shortAnswer="It depends on whether the unit is free-market or rent-stabilized. On a free-market unit, asking rents are set by the market — landlords can quote any number, and a portion of NYC's 2025–2026 rent increases reflects landlords pricing in the cost of paying the broker themselves. On a rent-stabilized unit, the answer is firmly no: RGB-set caps govern renewal increases and the broker fee is irrelevant."
      bottomLine="Free-market: yes, in the form of higher asking rents. Rent-stabilized: no — the RGB renewal cap is what governs your increase, regardless of who pays the broker."
      sections={[
        {
          heading: "Free-market units: market sets the price",
          body: [
            "About half of NYC's rental stock is unregulated (free-market). On those units, the landlord can ask any rent the market will support. After the FARE Act took effect in June 2025, many landlords priced the cost of paying the broker themselves into the next year's asking rent.",
            "REBNY and StreetEasy data through April 2026 estimate the FARE Act effect adds roughly 1–2% to free-market asking rent on average — much smaller than the 12–15% one-time broker fee tenants used to pay. Net: tenants are still ahead, just by less than a literal one-time fee elimination would suggest.",
            "Within an active free-market lease, your rent is fixed for the term. The landlord cannot raise it mid-lease. They can raise it at renewal — and they can refuse to renew (with proper notice) if you decline a renewal offer.",
          ],
        },
        {
          heading: "Rent-stabilized units: RGB rules govern, broker fee is irrelevant",
          body: [
            "On a rent-stabilized unit, the NYC Rent Guidelines Board sets a maximum renewal increase each October that runs from October 1 through September 30 of the following year. For the 2025–2026 cycle the RGB authorized 2.75% on a 1-year renewal and 5.25% on a 2-year renewal.",
            "Those caps are statutory. A landlord cannot tack on a broker fee, an administrative fee, or any 'recovery' on top of the RGB increase. If they try, that is itself a stabilization violation and DHCR is the enforcement body.",
            "Use the RGB Renewal Calculator below to compute the exact dollar increase your landlord can lawfully charge.",
          ],
        },
        {
          heading: "How to know which kind of unit you have",
          body: [
            "If your building was built before 1974 and has six or more units, the unit is rent-stabilized unless it has been deregulated through specific legal mechanisms (most of which were closed by the 2019 HSTPA). Newer buildings receiving 421-a or J-51 tax abatements are stabilized for the abatement term.",
            "If you are not sure, the rent-stabilization checker below runs your building's facts past the standard test and tells you whether the unit is likely stabilized. You can also order an official rent history from DHCR — free, takes 4–8 weeks.",
          ],
        },
        {
          heading: "What to do if the new asking rent feels like a FARE Act pass-through",
          body: [
            "On a free-market renewal, your only leverage is to negotiate or to walk. Use the net-effective rent calculator to compare your renewal against the actual market-asking rate on comparable units in your neighborhood — landlords often quote a higher headline rent and offer a concession (a free month, etc.) that lowers the effective rate.",
            "On a stabilized unit, run the RGB calculator and refuse anything above the cap. If the landlord demands more, file with DHCR.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb: "Exact dollar cap on your stabilized renewal.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb: "Find out whether your unit is stabilized.",
        },
        {
          href: "/tools/net-effective-rent-calculator",
          title: "Net-effective rent calculator",
          blurb: "Compare a renewal offer against market.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "who-pays-broker-fee-nyc-fare-act",
          question: "Who pays the broker fee in NYC under the FARE Act?",
        },
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question:
            "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "how-much-can-rent-stabilized-rent-go-up-2026",
          question:
            "How much can NYC rent-stabilized rent go up in 2026?",
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
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act broker fee ban — full guide"
    />
  );
}
