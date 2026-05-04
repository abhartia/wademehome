import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-pet-fee-legality";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "Are Pet Fees and Pet Deposits Legal in NYC? (2026)",
  description:
    "Non-refundable pet fees: not allowed under HSTPA's deposit cap (one month max, total). Monthly pet rent: contested but often unenforceable for free-market units, illegal for rent-stabilized. ESAs and service animals can never be charged.",
  keywords: [
    "NYC pet fee legal",
    "NYC pet deposit legal",
    "NYC monthly pet rent",
    "HSTPA pet deposit",
    "NYC service animal fee",
    "NYC ESA pet fee",
    "rent stabilized pet rent",
    "NYC pet fee illegal",
    "Pet Law NYC 1983",
    "NYC three-month pet rule",
  ],
  openGraph: {
    title: "Are pet fees and pet deposits legal in NYC?",
    description:
      "Non-refundable pet fees: no. Monthly pet rent: contested for free-market, illegal for stabilized. Service animals: never chargeable.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Are pet fees and pet deposits legal in NYC?"
      jurisdictionTag="NYS / NYC"
      badges={["HSTPA § 7-108(1-a)", "Pet Law 1983"]}
      reviewedAt="2026-05-03"
      shortAnswer="The clear rules: (1) Non-refundable pet fees are NOT allowed under HSTPA's deposit cap — total move-in deposits are limited to one month's rent, and a separate non-refundable pet fee on top exceeds that cap. (2) Refundable pet deposits separate from a regular security deposit are also unlawful for the same reason — only one deposit, capped at one month, total. (3) Monthly pet rent on a free-market unit is contested and often unenforceable; on a rent-stabilized unit, it's illegal because it raises the legal regulated rent above the RGB-set ceiling. (4) Emotional support animals and service animals can never be charged a fee under federal Fair Housing Act and NY State Human Rights Law."
      bottomLine="If a NYC landlord asks for a non-refundable pet fee, an additional pet deposit, or monthly pet rent on a stabilized unit — push back, citing HSTPA § 7-108(1-a). They cannot charge it as a separate item beyond the one-month total deposit cap. Free-market monthly pet rent is technically the only category with any legal traction, and it's still contested. ESA and service animal owners — get the documentation in writing (HUD-style ESA letter or trained-service-animal documentation) and the landlord cannot charge any pet-related fee under federal law that preempts state law."
      sections={[
        {
          heading: "The HSTPA deposit cap that swallows pet fees",
          body: [
            "NY General Obligations Law § 7-108(1-a), added by HSTPA in 2019, caps all upfront tenant deposits at one month's rent total. The statute uses the phrase 'no deposit or advance shall exceed the amount of one month's rent.' Courts have read 'deposit or advance' broadly to include:",
          ],
          bullets: [
            "Last month's rent (illegal as a separate line item — collapses into the one-month cap).",
            "Refundable pet deposits (illegal as a separate line item).",
            "Non-refundable pet fees (functionally a second deposit; illegal under the cap).",
            "Cleaning fees, key deposits, move-in fees not actually paid to the building (often illegal).",
            "Application fees over $20 (illegal under RPL § 238-a).",
            "What IS allowed: a refundable security deposit up to one month's rent, period. The pet status of the tenant doesn't unlock additional capacity — it's still one month, total.",
          ],
        },
        {
          heading: "Monthly pet rent — the only category with any legal traction",
          body: [
            "Monthly pet rent is structurally different from a deposit: it's a rent line item, not a deposit. Two separate analyses:",
          ],
          bullets: [
            "Free-market unit: monthly pet rent is technically possible because there's no regulated rent ceiling. But it must be in the lease as a rent line item, and it cannot be retroactively imposed mid-lease. If the lease lists 'monthly pet rent: $50' it's enforceable as part of the rent. Some courts have rejected this as a rebrand of an illegal fee — outcomes depend on lease language.",
            "Rent-stabilized unit: monthly pet rent is illegal. The regulated rent is set by the RGB cap and the registered legal rent. Adding pet rent on top raises the rent above the legal regulated rent, which is the definition of an overcharge. Tenants who paid pet rent on a stabilized unit can recover it (plus treble damages for willful overcharge).",
          ],
        },
        {
          heading: "ESAs and service animals — never chargeable",
          body: [
            "Under the federal Fair Housing Act (42 U.S.C. § 3604) and NY State Human Rights Law (NYS Executive Law § 296), reasonable accommodations for tenants with disabilities — including emotional support animals (ESAs) and service animals — cannot be charged for. Specifically:",
          ],
          bullets: [
            "No pet fee, pet deposit, or monthly pet rent for ESAs or service animals.",
            "No 'no pets' policy enforcement against ESAs or service animals (the policy is overridden by the reasonable-accommodation requirement).",
            "Documentation: a HUD-style letter from a licensed mental health provider establishing the ESA need is sufficient under federal guidance. For service animals, no documentation is required by law — the animal's training and behavior are the standard.",
            "If a landlord refuses to accommodate or attempts to charge for an ESA/service animal, file with HUD (federal complaint) or NY State Division of Human Rights (state complaint). Both are free and tenant-friendly.",
          ],
        },
        {
          heading: "The 1983 NYC Pet Law — different but worth knowing",
          body: [
            "The NYC Pet Law (Local Law 52 of 1983, NYC Admin Code § 27-2009.1) is unrelated to fees but matters for any pet-in-the-apartment situation. It says: in any building of 3+ units, if a landlord knows a tenant is openly and notoriously keeping a pet for 3+ months and does not begin a lawsuit to enforce a no-pet clause within those 3 months, the no-pet clause is waived for the duration of that tenancy.",
            "Translation: even in a building with a no-pet lease, if the landlord saw your dog in the lobby every day for 3+ months and did nothing, the no-pet clause cannot be enforced later. This is a defense, not a loophole — the landlord must KNOW about the pet, and the open-and-notorious standard is fact-specific.",
          ],
        },
        {
          heading: "What to do if you're being charged improperly",
          body: [
            "Three steps:",
          ],
          bullets: [
            "Refuse to pay the disputed fee at lease signing. Request the amount be removed from the lease. Most landlords will accept the deletion when challenged in writing — they know it's not enforceable.",
            "If already paid, send a written demand for refund citing § 7-108(1-a). Most NYC landlords return the money rather than litigate.",
            "If the demand is refused: Small Claims Court for amounts up to $10,000 (NYC Civil Court). Filing fee is $15–$20 and the case typically resolves within 60–90 days. Stabilized tenants have an additional path — DHCR overcharge complaint with treble damages for willful violations.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Run move-in costs WITHOUT illegal pet fees baked in.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Pet rent is illegal on stabilized units — confirm your status.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "nyc-application-fee-cap",
          question:
            "What's the maximum application or credit-check fee a NYC landlord can charge?",
        },
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "free-market-rent-increase-renewal-nyc",
          question:
            "How much can a NYC landlord raise my rent at renewal if I'm not rent-stabilized?",
        },
      ]}
      relatedReadingHref="/cost-of-moving-to-nyc"
      relatedReadingLabel="NYC move-in cost guide — what's actually legal to charge"
    />
  );
}
