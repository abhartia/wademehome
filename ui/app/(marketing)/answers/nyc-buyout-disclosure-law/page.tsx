import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-buyout-disclosure-law";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Buyout-Offer Disclosure Law — What Landlords Must Tell You (2026)",
  description:
    "NYC Admin Code § 27-2004(a)(48) requires landlords offering tenants money to vacate to disclose in writing the tenant's right to refuse, the right to consult an attorney, and a 180-day no-contact period after rejection. Failure = harassment with $1,000–$10,000 statutory damages.",
  keywords: [
    "NYC buyout offer disclosure",
    "NYC buyout law tenant",
    "NYC Admin Code 27-2004 buyout",
    "NYC tenant buyout right to refuse",
    "NYC tenant harassment buyout",
    "NYC 180 day buyout cool-off",
    "NYC stabilized buyout disclosure",
    "NYC buyout written disclosure form",
    "NYC tenant buyout attorney consultation",
    "NYC buyout harassment damages",
  ],
  openGraph: {
    title: "What does NYC's buyout-offer disclosure law require?",
    description:
      "Written disclosure of the right to refuse, the right to attorney consultation, and a 180-day no-contact period after rejection. § 27-2004(a)(48).",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What does NYC's buyout-offer disclosure law require?"
      jurisdictionTag="NYC"
      badges={["§ 27-2004(a)(48)", "180-day no contact"]}
      reviewedAt="2026-05-04"
      shortAnswer="NYC's tenant-buyout disclosure law (NYC Admin Code § 27-2004(a)(48), added by Local Law 77 of 2017 and strengthened in 2019) makes it harassment for a NYC landlord to offer a tenant money or other consideration to vacate without first making three disclosures in writing: (1) the tenant has a right to refuse the offer and remain in the unit, (2) the tenant has a right to consult with an attorney before accepting, (3) if the tenant refuses, the landlord cannot contact the tenant about a buyout for at least 180 days. The disclosures must be in writing, separate from any other lease document, and served at the same time as or before the buyout offer. Failure to comply makes the buyout offer itself an act of harassment under § 27-2005, recoverable in NYC Housing Court for compensatory damages, civil penalties of $1,000–$10,000 per occurrence, plus attorney's fees and costs."
      bottomLine="If a NYC landlord offers you money to leave — at any tenancy length, in any building size, for any reason — they MUST give you the three written disclosures (right to refuse, right to attorney consultation, 180-day no-contact period after rejection) at or before the offer. Verbal-only buyout offers are themselves a § 27-2005 harassment violation. Save every email, text, voicemail, in-person note from the landlord. If you reject and the landlord contacts you again within 180 days, that's a separate harassment violation. Most NYC tenant-rights firms take buyout-harassment cases on contingency because the statutory damages and fees make them economically viable."
      sections={[
        {
          heading: "What § 27-2004(a)(48) actually requires",
          body: [
            "The statute defines harassment to include: 'offering money or other valuable consideration to a covered tenant to induce that tenant to vacate a unit, or to surrender or waive any rights regarding the tenant's occupancy, without first making the disclosures required by paragraph 49 of this subdivision.' Paragraph 49 lays out the disclosure requirements.",
            "The required written disclosures are:",
          ],
          bullets: [
            "Statement that the tenant has the right to refuse the buyout offer and continue to occupy the unit.",
            "Statement that the tenant has the right to consult with an attorney before accepting any buyout, and that an attorney can review the lease, the tenancy status, and the proposed buyout terms.",
            "Statement that if the tenant refuses, the landlord cannot make additional buyout offers or contact the tenant about a buyout for at least 180 days.",
            "The disclosures must be in writing, in plain language, and provided to the tenant in the tenant's primary language if known to the landlord, or in English with translation references.",
            "The disclosures must be on a document SEPARATE from the buyout offer itself — not a paragraph buried in a longer document.",
            "The disclosures must be served at or before the buyout offer — not after, and not as a 'reply if you want to know your rights' afterthought.",
          ],
        },
        {
          heading: "Who counts as a 'covered tenant'",
          body: [
            "The statute applies broadly to NYC residential tenants — but it's worth knowing the specific scope:",
          ],
          bullets: [
            "Rent-stabilized tenants — fully covered.",
            "Rent-controlled tenants — fully covered.",
            "Free-market tenants — fully covered. The buyout-disclosure law applies regardless of regulatory status.",
            "SRO and rooming-house occupants — covered if they've occupied the unit as a primary residence for any duration.",
            "Loft Law tenants — covered.",
            "NYCHA tenants — generally not subject to private buyout offers (NYCHA can't sell out from under tenants), but if a private developer is offering a buyout for a NYCHA-adjacent rights waiver, the disclosure rule attaches.",
            "Sublessees and roommates — covered if they've established primary residence in the unit for 30+ consecutive days.",
            "The law does NOT apply to commercial tenancies, hotel-stay-only occupants, or buyouts negotiated through litigation (court-supervised settlements are exempt).",
          ],
        },
        {
          heading: "The 180-day no-contact rule",
          body: [
            "If a tenant rejects a buyout offer, the landlord (or any agent of the landlord — managing agent, attorney, contractor, family member acting on landlord's behalf) cannot contact the tenant about a buyout for 180 days from the date of rejection. That includes:",
          ],
          bullets: [
            "New or revised offers — even with better terms.",
            "Phone calls, texts, emails, in-person conversations, letters, or notes left at the unit asking 'are you sure?' or 'we have new numbers'.",
            "Communications through third parties — neighbors, building staff, family members.",
            "'Informational' messages about the buyout that are functionally re-offers.",
            "Each contact within the 180-day window is a separate § 27-2005 violation. A landlord who contacts a rejecting tenant 5 times in 180 days has 5 violations, each carrying $1,000–$10,000 statutory damages. Cumulative recovery in egregious cases can exceed $100,000 plus attorney's fees.",
            "What the landlord CAN do during 180 days: routine landlord-tenant communications (rent collection, repairs, lease renewals, regulatory notices) — provided those communications don't reference or hint at a buyout.",
          ],
        },
        {
          heading: "How to document a buyout-disclosure violation",
          body: [
            "Five evidence types that build a § 27-2005 case:",
          ],
          bullets: [
            "The buyout offer itself — written or recorded verbal. NY is a one-party-consent state for recordings, so a tenant can record a phone call or in-person conversation about a buyout without notifying the landlord. NY Penal Law § 250.05 applies.",
            "The disclosure form — or its absence. If the landlord made the offer without the three written disclosures, that absence is itself the violation.",
            "Communication records after rejection — every text, email, voicemail, in-person interaction noted with date and time.",
            "Witness names — building staff, neighbors, anyone present during in-person conversations.",
            "Any relocation agreement, surrender agreement, or modification of lease the landlord proposed — these often double as buyout offers and trigger the disclosure requirement.",
          ],
        },
        {
          heading: "How to enforce — three paths",
          body: [
            "Three remedies that can be pursued in parallel:",
          ],
          bullets: [
            "311 / HPD complaint — file a 'Tenant Harassment' complaint. HPD can refer to the NYC Office of the Tenant Advocate (OTA) for investigation. Findings are public and create regulatory record.",
            "NYC Housing Court HP-action for harassment under NYC Admin Code § 27-2115 — petition for civil penalties and injunctive relief. Filing fee $45, waivable. Statutory damages $1,000–$10,000 per occurrence plus attorney's fees.",
            "Private suit in NYC Civil / Supreme Court — for tenants with substantial damages (e.g., relocation expenses, mental anguish, lost rent-stabilized rights), private suits include broader compensatory damages on top of statutory.",
            "NYS AG Housing Protection Unit complaint (ag.ny.gov) — for pattern cases (multiple tenants in the same building / same landlord). The AG has prosecuted multi-tenant buyout-harassment cases with multi-million-dollar settlements.",
            "Most tenant-rights firms (Legal Aid Society NYC, Mobilization for Justice, MFY Legal Services, private firms in the NYC tenant-rights bar) take buyout-disclosure cases on contingency because the statutory fees make them viable.",
          ],
        },
        {
          heading: "Buyout offers tenants should think hardest about",
          body: [
            "Some buyout offers are entirely legitimate — a landlord redeveloping a building has a genuine reason to offer money to a long-term tenant. The disclosure law doesn't ban buyouts; it bans buyouts without disclosures and follow-up harassment after rejection. Three considerations before accepting:",
          ],
          bullets: [
            "The math. A rent-stabilized tenant paying $1,500 below market in a unit they could keep for 20+ years is sitting on $360,000+ of value. Most buyouts offered to stabilized tenants are 5–10% of that value — undervalued.",
            "Successor rights. A long-term stabilized tenant who plans to pass the unit to family (succession rights) is giving up a multi-generational asset, not just a current tenancy.",
            "Tax treatment. Buyouts are taxable income (1099-MISC). The headline number after federal + NYS + NYC tax is roughly 60–65% of the gross.",
            "Negotiation. The first offer is rarely the last. Stabilized tenants who consult an attorney before accepting frequently negotiate 2–5x improvements over the initial offer.",
            "Attorney fees in negotiation are commonly 5–10% of the buyout, paid out of the buyout itself — frame the fee as transaction cost, not overhead.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants get the highest economic value in buyout negotiations — confirm status first.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Calculate the lifetime value of a stabilized tenancy before evaluating any buyout.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "is-my-nyc-apartment-rent-stabilized",
          question: "How do I find out if my NYC apartment is rent-stabilized?",
        },
        {
          slug: "succession-rights-rent-stabilized-nyc",
          question:
            "Who has succession rights to a NYC rent-stabilized apartment?",
        },
        {
          slug: "nyc-illegal-lockout-damages",
          question:
            "What can I do if my NYC landlord illegally locks me out?",
        },
        {
          slug: "nyc-tenant-blacklist-housing-court",
          question:
            "Is the NYC tenant blacklist legal — can a landlord deny me for an old Housing Court case?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC tenant rights — buyouts, succession, and stabilization in 2026"
    />
  );
}
