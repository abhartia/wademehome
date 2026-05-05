import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-illegal-lockout-damages";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Illegal Lockout — What to Do and What Damages You Can Recover (2026)",
  description:
    "If a NYC landlord changes locks, removes belongings, or shuts off utilities to force you out, that's an illegal eviction under RPAPL § 768 and NYC Admin Code § 26-521. Triple damages, NYPD-enforced re-entry, and criminal penalties.",
  keywords: [
    "NYC illegal lockout",
    "NYC self-help eviction illegal",
    "RPAPL 768 NYC",
    "NYC Admin Code 26-521",
    "NYC unlawful eviction damages",
    "NYC illegal eviction NYPD",
    "NYC tenant lockout treble damages",
    "NYC change locks tenant illegal",
    "NYC utility shutoff tenant",
    "NYC illegal eviction Class A misdemeanor",
  ],
  openGraph: {
    title: "What to do if your NYC landlord locks you out illegally",
    description:
      "RPAPL § 768 and NYC Admin Code § 26-521 ban self-help eviction. Treble damages, NYPD re-entry, and criminal exposure for the landlord.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What can I do if my NYC landlord illegally locks me out?"
      jurisdictionTag="NYS / NYC"
      badges={["RPAPL § 768", "NYC Admin Code § 26-521"]}
      reviewedAt="2026-05-04"
      shortAnswer="Self-help eviction — changing locks, removing belongings, shutting off utilities, or otherwise forcing a tenant out without a court-issued warrant — is illegal in NYC under RPAPL § 768 (Class A misdemeanor) and NYC Admin Code § 26-521 (the Unlawful Eviction Law). The only person who can legally evict a NYC tenant is an NYC city marshal carrying a warrant of eviction issued by Housing Court after a non-payment or holdover proceeding. If a landlord locks you out, the immediate steps are: (1) call 911, NYPD will respond and order re-entry; (2) call 311 to report a Class A illegal eviction; (3) file an order to show cause in NYC Housing Court (free, same-day) for restoration of possession plus damages. Recoverable damages include treble compensatory damages, attorney's fees, replacement of any removed property, and the value of any time displaced from the home. Landlords face civil penalties up to $10,000 per violation and possible criminal charges."
      bottomLine="If you have signed a lease OR have lived in the unit for 30+ consecutive days as a primary residence, you cannot be locked out without a court warrant — period. Even if you stopped paying rent, even if the lease ended months ago, even if the landlord 'just wants you out,' the only lawful path is Housing Court. NYPD will physically restore you to the unit if a landlord refuses to unlock. Document everything (photos of changed locks, missing belongings, witness names, time-stamped messages) and file an OSC the same day — Housing Court hears emergency lockout cases on the day of filing. Do not negotiate with the landlord while locked out; restoration first, settlement after."
      sections={[
        {
          heading: "What counts as an illegal lockout in NYC",
          body: [
            "NYC Admin Code § 26-521 — the Unlawful Eviction Law — prohibits any of the following acts when committed by a landlord to a tenant who has occupied the unit for 30+ consecutive days, or to any lawful occupant including holdover tenants and licensees:",
          ],
          bullets: [
            "Changing or adding a lock to deny entry, without giving the tenant a working key.",
            "Removing the tenant's belongings from the unit without a court-issued warrant.",
            "Shutting off heat, electricity, gas, water, or other essential services to force the tenant to leave.",
            "Removing doors, windows, or appliances to make the unit uninhabitable.",
            "Threatening or using force, or threatening or using to engage anyone else to use force, to make the tenant leave.",
            "Engaging in 'a course of conduct that interferes with the tenant's quiet enjoyment of the unit and is intended to cause the tenant to leave' — the harassment standard.",
            "What does NOT count as an illegal lockout: physical eviction by an NYC city marshal carrying a warrant of eviction issued after a Housing Court judgment in a non-payment or holdover case. That's the only lawful eviction path.",
          ],
        },
        {
          heading: "Step 1 — Call 911 and document the lockout",
          body: [
            "NYPD has standing instructions to enforce RPAPL § 768 and NYC Admin Code § 26-521 — officers will order the landlord to restore access to a tenant who has lived in the unit 30+ consecutive days. NYPD does not adjudicate lease disputes; their job is to confirm tenancy (any of: lease, prior rent receipts, mail addressed to you at the unit, government ID listing the address, statements from neighbors) and order re-entry.",
          ],
          bullets: [
            "Call 911 from outside the unit. Tell the dispatcher: 'I'm being illegally evicted from my apartment. The landlord changed the locks.'",
            "When officers arrive, show any tenancy documentation. A lease is strongest, but bills, mail, ID, even a delivery app showing your address as a delivery destination is acceptable evidence of residency.",
            "Photograph everything: changed locks, removed belongings, shut-off utilities, the front door, any notes the landlord left.",
            "Get the police report (DD-5) reference number. NYPD will issue a complaint number — write it down. The complaint can be referenced in any subsequent civil suit.",
            "If officers refuse to restore re-entry (occasionally happens with newer officers unfamiliar with the law), ask politely for a sergeant. Reference NYC Admin Code § 26-521 by name if needed.",
          ],
        },
        {
          heading: "Step 2 — File an order to show cause in Housing Court",
          body: [
            "An order to show cause (OSC) is a same-day emergency motion. Tenants file pro se (without an attorney) regularly; NYC Housing Court has a free Tenant Help Center on every floor that walks tenants through the OSC paperwork. Filing fee is waived for indigent tenants (Form OCA 1015 — free).",
          ],
          bullets: [
            "Where: NYC Housing Court at 111 Centre St (Manhattan), 141 Livingston St (Brooklyn), 89-17 Sutphin Blvd (Queens), 1118 Grand Concourse (Bronx), 927 Castleton Ave (Staten Island).",
            "What to file: Order to Show Cause to Restore Possession. The court has a fill-in-the-blank form. State that the landlord changed the locks (or removed belongings, or shut off utilities), the date this happened, and that you've lived in the unit 30+ days.",
            "What you ask for: (1) immediate restoration of possession, (2) damages including treble compensatory damages under § 26-521, (3) attorney's fees, (4) costs and disbursements. Most OSCs are returnable the same day or next business day.",
            "What happens at the hearing: a Housing Court judge will sign an order directing NYPD to restore you to the unit, often by the end of the day. If the landlord doesn't comply, the order is enforced by NYPD or the city marshal.",
            "Tip: file the OSC AS SOON AS POSSIBLE. Same-day filings are heard same-day in most NYC boroughs. A delay of even 24 hours can be argued as 'acquiescence' and weaken the case for emergency restoration.",
          ],
        },
        {
          heading: "Step 3 — Recover damages",
          body: [
            "NYC Admin Code § 26-521(a) and § 26-523 authorize:",
          ],
          bullets: [
            "Treble compensatory damages — three times the actual financial loss (hotel costs, lost workdays, replacement of removed property, food spoiled by utility shutoff, value of time displaced, mental anguish documented).",
            "Civil penalties up to $10,000 per occurrence, plus $1,000 per day the violation continues — paid to the City, but assessed at the OSC hearing.",
            "Attorney's fees and costs — RPL § 234 makes attorney's fees mutual in NYC tenancies; in lockout cases, fees are routinely awarded to the tenant.",
            "Punitive damages — available where the landlord acted maliciously or with reckless disregard for the law. Standard NYC awards: $5,000–$25,000 for willful lockouts.",
            "Criminal charges — RPAPL § 768 makes self-help eviction a Class A misdemeanor punishable by up to 1 year in jail and/or a $1,000 fine. The Manhattan and Brooklyn DA Tenant Harassment Units occasionally prosecute. Tenants can request a referral via 311.",
          ],
        },
        {
          heading: "Special situations",
          body: [
            "Three lockout fact patterns that come up often:",
          ],
          bullets: [
            "Roommate / non-tenant occupant: if you've lived in the unit 30+ days as a primary residence, you have illegal-eviction protections under § 26-521 even if you're not on the lease. The landlord cannot lock out a roommate any more than they can lock out the leaseholder. NYPD enforces 30-day occupancy as the floor.",
            "Lease ended / holdover tenant: even after a lease has expired, the landlord must go through Housing Court to evict. Holdover proceedings exist exactly for this purpose. A self-help lockout is illegal even if the lease ended months ago.",
            "Hotel / boarding house: NYC Admin Code § 26-521 explicitly covers SROs, transient hotels where the occupant has lived 30+ days, and rooming houses. The 30-day floor matters because NYS Real Property Law §§ 711-c and 232-a give 30-day occupants tenant status.",
            "Domestic violence: NY Real Property Law § 227-c gives domestic-violence survivors additional lockout protections and the right to break the lease without penalty after providing documentation (police report, order of protection, or DV agency letter). Local DV organizations (Safe Horizon: 800-621-4673) coordinate emergency Housing Court filings.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/fare-act-violation-reporter",
          title: "FARE Act Violation Reporter",
          blurb:
            "Tenants experiencing illegal-lockout retaliation often started after disputing an unlawful broker fee.",
        },
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants have additional anti-harassment / anti-eviction protections under HSTPA.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-eviction-notice-timeline",
          question: "How long does NYC eviction take?",
        },
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
          slug: "nyc-buyout-disclosure-law",
          question:
            "What does NYC's buyout-offer disclosure law require?",
        },
      ]}
      relatedReadingHref="/blog/nyc-fare-act-broker-fee-ban"
      relatedReadingLabel="NYC FARE Act and tenant-protection landscape — 2026 update"
    />
  );
}
