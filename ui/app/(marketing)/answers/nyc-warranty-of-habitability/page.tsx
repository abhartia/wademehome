import type { Metadata } from "next";
import { AnswerPageTemplate } from "@/components/answers/AnswerPageTemplate";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

const SLUG = "nyc-warranty-of-habitability";
const URL = `${baseUrl}/answers/${SLUG}`;

export const metadata: Metadata = {
  title: "NYC Warranty of Habitability — What RPL § 235-b Covers (2026)",
  description:
    "RPL § 235-b makes every NYC residential lease implicitly warranty that the unit is fit for human habitation. Heat, hot water, electricity, water, freedom from vermin, structural soundness — all covered. Cannot be waived. Three remedies: abatement, repair, repair-and-deduct.",
  keywords: [
    "NYC warranty of habitability",
    "RPL 235-b NYC",
    "NYC implied warranty habitability",
    "NYC habitable apartment definition",
    "NYC tenant rent abatement habitability",
    "NYC habitability breach remedies",
    "Park West Mgmt v Mitchell habitability",
    "NYC warranty habitability cannot waive",
    "NYC habitability mold pest infestation",
    "NYC warranty habitability heat",
  ],
  openGraph: {
    title: "What does the NYC warranty of habitability cover?",
    description:
      "RPL § 235-b — fit for habitation, fit for intended uses, free of life-or-safety hazards. Cannot be waived. Three remedies for breach.",
    url: URL,
    type: "article",
  },
  alternates: { canonical: URL },
};

export default function Page() {
  return (
    <AnswerPageTemplate
      slug={SLUG}
      question="What does the NYC warranty of habitability cover?"
      jurisdictionTag="NYS / NYC"
      badges={["RPL § 235-b", "Cannot be waived"]}
      reviewedAt="2026-05-04"
      shortAnswer="Every NYC residential lease — written, oral, regulated, free-market, single-family, multifamily — contains an implied warranty under NY Real Property Law § 235-b that the unit is (1) fit for human habitation, (2) fit for the uses reasonably intended by the parties (i.e., as a home), and (3) free of conditions that would be dangerous, hazardous, or detrimental to the life, health, or safety of the occupants. The warranty cannot be waived by lease language — any clause attempting to waive § 235-b is void as against public policy. Breach of warranty entitles the tenant to remedies including (a) rent abatement (refund or counterclaim against rent for the percentage of habitability lost), (b) specific performance via HP-action or DHCR complaint, and (c) repair-and-deduct under common law. The framework was set by the Court of Appeals in Park West Management Corp. v. Mitchell (47 NY2d 316, 1979)."
      bottomLine="If your landlord fails to provide heat, hot water, electricity, water, working appliances that came with the unit, freedom from vermin, freedom from structural defects, freedom from mold, freedom from severe noise (from the building, not neighbors), or any other essential life-or-safety condition, that's a § 235-b breach and you have remedies. The strongest framework is: (1) document the condition, (2) give written notice to the landlord with a reasonable opportunity to repair, (3) if no repair, file 311 / HPD to create violations, (4) file an HP-action for specific performance plus rent abatement, OR offset rent and assert § 235-b as a defense if the landlord brings a non-payment proceeding. The warranty applies to every NYC tenancy regardless of stabilization status."
      sections={[
        {
          heading: "What § 235-b covers",
          body: [
            "RPL § 235-b reaches three categories. Fit for human habitation — the unit must meet basic minimums for human living. Fit for intended uses — a residential lease implies use as a home, with the basic services that go with that use. Free of dangerous / hazardous / detrimental conditions — affirmative obligation to keep the unit safe.",
            "Specific conditions courts have held to breach § 235-b:",
          ],
          bullets: [
            "No heat below NYC's Heat Season thresholds (68°F day / 62°F night when outside <55°F, Oct 1 – May 31).",
            "No hot water (NYC requires 120°F year-round under NYC Admin Code § 27-2031).",
            "No electricity, gas, or water — utility shutoffs caused by the landlord, not the tenant.",
            "Water leaks, ceiling collapse, structural cracks, sagging floors, broken stairs.",
            "Pest infestations — bedbugs (with NYC Admin Code § 27-2018.1 disclosure on top), rats, mice, cockroaches at chronic levels.",
            "Mold — particularly black mold (Stachybotrys chartarum) tied to moisture infiltration the landlord won't address.",
            "Lead paint hazards in pre-1960 buildings under Local Law 1 of 2004.",
            "Severe noise from the building itself — boiler vibration, broken HVAC, water hammer — at hours that disrupt sleep.",
            "Broken essential appliances that came with the unit — refrigerator, stove, dishwasher (if listed in lease), heating system.",
            "Inoperable locks, broken doors, broken windows, unsecured entryways.",
            "Smoke or carbon monoxide hazards (broken alarms, gas leaks, ventilation issues).",
          ],
        },
        {
          heading: "What § 235-b does NOT cover",
          body: [
            "Not every annoyance is a habitability breach. Conditions courts have generally NOT held to violate § 235-b:",
          ],
          bullets: [
            "Cosmetic issues — paint chips not from lead, faded walls, scuffed floors that don't affect safety.",
            "Convenience-only appliance failures — slow drains that don't back up, dishwasher that's slow but works, AC unit that's underpowered (unless the lease specifically warrants AC).",
            "Neighbor-caused noise — the landlord's duty is to remediate building-caused noise; neighbor noise is generally a tenant-vs-tenant issue unless the landlord's enforcement of building rules is unreasonable.",
            "Aesthetic issues — color of carpet, dated finishes, lack of modern amenities.",
            "Conditions caused by the tenant — tenant-caused damage doesn't trigger § 235-b liability.",
            "Conditions disclosed at lease signing that the tenant accepted — e.g., a unit explicitly leased without a working dishwasher cannot then be subject to a § 235-b claim about the missing dishwasher.",
          ],
        },
        {
          heading: "How rent abatement is calculated",
          body: [
            "When § 235-b is breached, rent abatement is calculated as a percentage of habitability lost during the breach period. There's no statutory formula — it's case-by-case based on severity, duration, and impact.",
            "Range of typical Housing Court awards from reported cases:",
          ],
          bullets: [
            "Total loss (no heat in winter, water main broken, structural collapse): 100% abatement (rent fully refunded for the period).",
            "Severe partial loss (no heat one room of multi-room apartment, intermittent hot water, persistent vermin): 25–60%.",
            "Moderate loss (broken appliance that came with the unit, water leak in one area, recurring noise from boiler): 10–25%.",
            "Minor loss (single repair issue resolved promptly after notice): 5–15%.",
            "Calculation: monthly rent × abatement percentage × number of months breach lasted = total abatement. Asserted as counterclaim against unpaid rent in non-payment cases, or as affirmative claim in tenant-initiated suits.",
            "Park West Mgmt v. Mitchell — the foundational 1979 case — set the percentage-of-habitability-lost framework that NYC Housing Court still uses 45+ years later.",
          ],
        },
        {
          heading: "How to assert a § 235-b breach",
          body: [
            "Pre-litigation steps that strengthen any § 235-b claim:",
          ],
          bullets: [
            "Written notice to the landlord. Email, certified mail, text — anything timestamped. Specify the condition, the date noticed, and request repair within a reasonable time.",
            "311 / HPD complaint. Generates inspector visit and Class A/B/C violations on the building's HPD record. Violations are public, dated, and impossible for the landlord to dispute later.",
            "Photo and video documentation. Time-stamp every photo, capture wide shots and close-ups, repeat over time to show the condition is ongoing.",
            "HP-action filing in Housing Court if the landlord doesn't repair. $45 filing fee, judge orders specific performance plus civil penalties.",
            "Rent abatement claim — file as plaintiff (tenant-initiated suit) for retroactive abatement, or assert as counterclaim if the landlord brings non-payment proceedings.",
            "Repair-and-deduct as a last resort for emergencies — see the dedicated repair-and-deduct answer page for the elements and risks.",
          ],
        },
        {
          heading: "§ 235-b interactions with other tenant protections",
          body: [
            "The warranty stacks with other NYC and NYS tenant protections:",
          ],
          bullets: [
            "Rent stabilization — stabilized tenants can file DHCR rent reduction applications under 9 NYCRR § 2523.4 for service breaches. Recovery: rent frozen at pre-breach level until repairs are made, plus refund of overpayments.",
            "HSTPA anti-retaliation — RPL § 223-b prohibits retaliation against tenants who assert habitability rights. Eviction proceedings, rent increases, or service reductions within 1 year of a tenant's habitability complaint create a presumption of retaliation.",
            "NYC harassment law (NYC Admin Code § 27-2004(a)(48)) — pattern of conduct that interferes with quiet enjoyment to force a tenant out can give rise to harassment claims with statutory damages of $1,000–$10,000 per occurrence.",
            "Constructive eviction — if the breach is so severe the tenant must vacate to remain safe, the tenant can vacate and stop paying rent without owing future rent (constructive-eviction defense). The condition must objectively force vacatur, not just be uncomfortable.",
            "Federal civil-rights protections — fair housing laws add additional remedies if the habitability breach is selective by race, family status, disability, etc.",
          ],
        },
      ]}
      relatedTools={[
        {
          href: "/tools/rent-stabilization-checker",
          title: "Rent Stabilization Checker",
          blurb:
            "Stabilized tenants get DHCR rent-reduction remedies on top of § 235-b.",
        },
        {
          href: "/tools/rgb-renewal-calculator",
          title: "RGB Renewal Calculator",
          blurb:
            "Confirm renewal increases — rent abatement counterclaims often surface during renewal disputes.",
        },
      ]}
      relatedQuestions={[
        {
          slug: "nyc-repair-and-deduct",
          question: "Can I repair and deduct from rent in NYC?",
        },
        {
          slug: "nyc-heat-hot-water-complaint",
          question:
            "What are NYC's heat-and-hot-water rules and how do I file a complaint?",
        },
        {
          slug: "nyc-illegal-lockout-damages",
          question:
            "What can I do if my NYC landlord illegally locks me out?",
        },
        {
          slug: "nyc-lead-paint-disclosure",
          question:
            "What does NYC's lead-paint disclosure law require?",
        },
        {
          slug: "nyc-bedbug-disclosure-law",
          question: "What does NYC's bedbug-disclosure law require?",
        },
      ]}
      relatedReadingHref="/blog/nyc-rent-stabilization-guide"
      relatedReadingLabel="NYC tenant protections — habitability, harassment, and HSTPA in 2026"
    />
  );
}
