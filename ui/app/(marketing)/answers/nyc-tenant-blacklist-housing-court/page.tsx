import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-tenant-blacklist-housing-court";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Tenant Blacklist — Housing-Court Records and HSTPA's Ban (2026)",
  description:
    "HSTPA 2019 banned NYC landlords from using tenant-screening reports based on Housing Court records. RPL § 227-f makes it unlawful to deny a tenancy because of past Housing Court appearance. Plus how the FCRA 7-year purge interacts with NYC tenant-screening services.",
  keywords: [
    "NYC tenant blacklist",
    "NYC tenant screening housing court",
    "HSTPA RPL 227-f tenant blacklist",
    "NYC tenant screening report ban",
    "NYC housing court records blacklist",
    "NYC TenantSure SafeRent",
    "NYC fair credit reporting tenant",
    "NYC eviction record 7 year FCRA",
    "NYC tenant screening discrimination",
    "NYC blacklist law HSTPA 2019",
  ],
  openGraph: {
    title: "Is the NYC tenant blacklist illegal?",
    description:
      "Yes — HSTPA 2019 banned NYC landlords from refusing to rent based on prior Housing Court appearance under RPL § 227-f. $500–$1,000 statutory damages.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="Is the NYC tenant blacklist legal — can a landlord deny me for an old Housing Court case?"
      jurisdictionTag="NYS / NYC"
      badges={["RPL § 227-f", "HSTPA 2019"]}
      reviewedAt="2026-05-04"
      shortAnswer="No — and HSTPA 2019 specifically banned the practice. NY Real Property Law § 227-f, added by HSTPA, prohibits NYC landlords (and landlords statewide) from refusing to rent to a tenant 'because the person was involved in a past or pending landlord-tenant action or summary proceeding.' That ban applies whether the landlord pulls a tenant-screening report from a private vendor (TenantSure, SafeRent, RentTrack, CoreLogic SafeRent), checks NYS court records directly, or learns of a Housing Court case from any other source. Statutory damages are $500–$1,000 per violation, plus attorney's fees. Federal law (Fair Credit Reporting Act, 15 USC § 1681 et seq.) separately requires tenant-screening companies to drop most adverse information older than 7 years from reports — eviction records included."
      bottomLine="If a NYC landlord told you 'we found you in Housing Court records' or 'a tenant-screening report shows an eviction,' that's likely an RPL § 227-f violation. Document it: ask in writing for the specific reason for denial, request a copy of any tenant-screening report used (federal FCRA right under 15 USC § 1681m), and file with the NYS AG Housing Protection Unit (ag.ny.gov) plus a private suit for statutory damages and attorney's fees. The blacklist practice — once industry-standard — is now actively prosecuted, with NYS AG settlements totaling tens of millions of dollars across landlord groups since 2019."
      sections={[
        {
          heading: "What HSTPA's § 227-f actually says",
          body: [
            "RPL § 227-f, enacted by HSTPA on June 14, 2019, has three operative subsections:",
          ],
          bullets: [
            "(a) — It is unlawful for any landlord, lessor, sub-lessor, or grantor to refuse to rent or offer to rent housing accommodations to a person because the person was involved in a past or pending landlord-tenant action or summary proceeding under Article 7 of the RPAPL.",
            "(b) — A rebuttable presumption of liability arises if the landlord requests information from a tenant-screening agency that includes Housing Court records, and the prospective tenant is not offered the unit. The burden shifts to the landlord to prove a non-discriminatory reason.",
            "(c) — Statutory damages of $500–$1,000 per violation, plus attorney's fees and costs, plus potential punitive damages for willful violations. Available to private plaintiffs and to the NYS AG.",
            "The ban applies to all rentals statewide, not just rent-stabilized units. Co-op boards, condo boards screening lessors, and individual private landlords are all covered.",
          ],
        },
        {
          heading: "How the practice used to work — and how it still leaks",
          body: [
            "Before HSTPA, multiple companies — TenantSure, SafeRent, CoreLogic, RentTrack, Yardi — sold tenant-screening reports to NYC landlords that included a Housing Court records search. Any tenant who had been a respondent in a non-payment or holdover proceeding showed up flagged regardless of outcome. Tenants who won, settled favorably, or were named in cases dropped before judgment all got blacklisted alongside tenants who actually lost.",
            "After HSTPA, several patterns persist that tenants should watch for:",
          ],
          bullets: [
            "Vendor reports that still include Housing Court data with a 'check before using' caveat — putting the legal risk on the landlord, but the screening still happens.",
            "Landlords who pull NYS court records directly via NYSCEF (free public access) instead of paying a vendor.",
            "Landlords who require tenant references from prior landlords and ask 'has this tenant ever sued or been sued by a landlord?'",
            "Landlords who require credit reports — Housing Court money judgments may appear as civil-judgment line items, though FCRA's 7-year purge limits visibility.",
            "Insurance company underwriting that flags tenants — landlord's renters' insurance or umbrella coverage can have screening hooks the landlord didn't request directly.",
          ],
        },
        {
          heading: "FCRA's 7-year purge — federal backstop",
          body: [
            "The federal Fair Credit Reporting Act (15 USC § 1681c) limits what consumer-reporting agencies can include in reports about consumers. The relevant rules for NYC tenants:",
          ],
          bullets: [
            "Civil suits, civil judgments, records of arrests — generally cannot appear after 7 years from the date of entry. Eviction records and Housing Court records are 'civil suits' for FCRA purposes.",
            "Bankruptcies — 10 years from the case filing date for Chapter 7 (longer for Chapter 13).",
            "Adverse-action notice — when a landlord uses a consumer report to deny tenancy, FCRA § 1681m requires the landlord to give the applicant a written notice with the screening agency's name, address, and toll-free phone, plus a statement of the applicant's right to dispute information and request a free report.",
            "If you got denied without an adverse-action notice, the landlord's screening compliance is suspect — both an FCRA violation (federal, $1,000+ statutory damages per violation) and an § 227-f violation (NY, $500–$1,000 per violation).",
          ],
        },
        {
          heading: "What to do if you suspect a blacklist denial",
          body: [
            "Six steps that build a case:",
          ],
          bullets: [
            "Ask for the specific reason for denial in writing. Most landlords will give a vague 'we went with another applicant' answer — push for specifics. Email creates a record.",
            "Request a copy of any tenant-screening report used. Under FCRA § 1681j, you have a federal right to a free copy from the screening company within 60 days of any adverse action. The screening company must comply; the landlord must give you the company's contact info.",
            "Pull your NYSCEF / NY State Courts records yourself (free at iapps.courts.state.ny.us / unified court system) — see exactly what a screening company would see. If there are old Housing Court cases, this is what the landlord likely saw.",
            "Document the timeline. Application date, denial date, any communications, the unit's status (relisted? rented to someone else?). Pattern matters.",
            "File with the NYS Attorney General's Housing Protection Unit (ag.ny.gov/complaint-forms/tenant-harassment) — the AG actively litigates blacklist cases and has won multi-million-dollar settlements from landlord groups (Pinnacle Group 2019; A&E Real Estate 2021; multiple ongoing).",
            "Sue privately. § 227-f and FCRA both authorize private rights of action with statutory damages and attorney's fees. Most NYC tenant-rights firms take blacklist cases on contingency.",
          ],
        },
        {
          heading: "What this changes for tenants applying in 2026",
          body: [
            "Three takeaways that affect today's NYC rental search:",
          ],
          bullets: [
            "Old Housing Court appearances are no longer a barrier in NYC — but you may still need to assert RPL § 227-f to bad-actor landlords who don't know (or don't care) about the law.",
            "Settlements with the NYS AG have made the major landlord groups (Pinnacle, A&E, Stellar, etc.) much more compliant — first-call denials based on Housing Court records are now rare from those groups.",
            "Smaller NYC landlords (1–10 units) and out-of-state owners are the most common offenders today. They often outsource screening to vendors that don't update for NYS law and don't issue adverse-action notices.",
            "If you have a history that includes a Housing Court appearance, write a one-paragraph cover letter for your applications explaining the situation and citing § 227-f. Most landlords will accept the application; the cite signals you know your rights and will not be a soft target for blacklist-driven denial.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb:
            "Many tenants who hit blacklist denials also experienced unlawful broker-fee charges — flag them.",
        },
        {
          href: "/tools/move-in-cost-estimator",
          title: "Move-in Cost Estimator",
          blurb:
            "Plan move-in costs without illegal fees baked in.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-application-fee-cap",
          question:
            "What's the maximum application or credit-check fee a NYC landlord can charge?",
        },
        {
          slug: "first-last-security-deposit-legal-nyc",
          question: "Is asking for first, last, and security legal in NYC?",
        },
        {
          slug: "nyc-eviction-notice-timeline",
          question: "How long does NYC eviction take?",
        },
        {
          slug: "nyc-buyout-disclosure-law",
          question: "What does NYC's buyout-offer disclosure law require?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act and tenant-protection landscape — 2026 update"
    />
  );
}
