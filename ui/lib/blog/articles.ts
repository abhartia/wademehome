export type BlogArticleMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  keywords?: string[];
};

export const blogArticles: BlogArticleMeta[] = [
  {
    slug: "choosing-a-rental-market",
    title: "How to choose a rental market when you can relocate",
    description:
      "Jobs, taxes, commute, and cost of living—how renters narrow down where to search.",
    publishedAt: "2026-02-10",
    keywords: ["relocating", "city choice", "rental search"],
  },
  {
    slug: "neighborhood-research-for-renters",
    title: "Neighborhood research: commute, safety, and daily life",
    description:
      "What to validate before you fall in love with a unit—transit, amenities, and tradeoffs.",
    publishedAt: "2026-02-12",
    keywords: ["neighborhood", "commute", "renters"],
  },
  {
    slug: "rent-budget-from-take-home-pay",
    title: "Setting a rent budget from your take-home pay",
    description:
      "A practical way to back into max rent after taxes, debt, and savings goals.",
    publishedAt: "2026-02-14",
    keywords: ["budget", "affordability", "rent"],
  },
  {
    slug: "roommate-vs-solo-living",
    title: "Roommates vs. living alone: practical tradeoffs",
    description:
      "Privacy, cost, and household dynamics—what changes when you split rent.",
    publishedAt: "2026-02-15",
    keywords: ["roommates", "shared apartment"],
  },
  {
    slug: "rental-listings-fees-net-effective-rent",
    title: "Reading listings: fees, concessions, and net effective rent",
    description:
      "How free months and advertised rent interact with what you actually pay per month.",
    publishedAt: "2026-02-17",
    keywords: ["net effective rent", "listing fees", "concessions"],
  },
  {
    slug: "apartment-search-tips",
    title: "Searching efficiently in a fragmented market",
    description:
      "Why listings churn and how to stay organized across sites without burning out.",
    publishedAt: "2026-02-18",
    keywords: ["apartment search", "ILS", "listings"],
  },
  {
    slug: "apartment-tour-checklist",
    title: "Apartment tour checklist: what to notice",
    description:
      "Model vs. actual unit, water pressure, odors, storage, and building quirks.",
    publishedAt: "2026-02-20",
    keywords: ["apartment tour", "inspection", "renting"],
  },
  {
    slug: "rental-application-screening-basics",
    title: "What rental applications screen for",
    description:
      "Income verification, rental history, and background checks at a high level.",
    publishedAt: "2026-02-21",
    keywords: ["rental application", "screening", "landlord"],
  },
  {
    slug: "credit-and-rental-applications",
    title: "Credit, income, and rental applications",
    description:
      "How FICO and debt-to-income often fit into landlord decisions—without myths.",
    publishedAt: "2026-02-22",
    keywords: ["credit score", "DTI", "rental application"],
  },
  {
    slug: "renters-insurance-basics",
    title: "Renters insurance: why landlords ask for it",
    description:
      "Liability and personal property coverage—what a policy usually includes.",
    publishedAt: "2026-02-24",
    keywords: ["renters insurance", "lease requirements"],
  },
  {
    slug: "guarantors-and-co-signers",
    title: "Guarantors and co-signers: when they apply",
    description:
      "Students, thin credit files, and income shortfalls—how guarantor products work in outline.",
    publishedAt: "2026-02-25",
    keywords: ["guarantor", "co-signer", "lease"],
  },
  {
    slug: "negotiating-rent-and-lease-terms",
    title: "Negotiating rent and lease terms",
    description:
      "Soft markets, days on market, and what is sometimes negotiable besides base rent.",
    publishedAt: "2026-02-26",
    keywords: ["negotiate rent", "lease terms"],
  },
  {
    slug: "security-deposits-move-in-fees",
    title: "Security deposits and move-in fees (varies by state)",
    description:
      "Caps, timelines, and disclosures differ by jurisdiction—what to verify locally.",
    publishedAt: "2026-02-28",
    keywords: ["security deposit", "move-in fees", "renters rights"],
  },
  {
    slug: "lease-signing-key-clauses",
    title: "Before you sign: lease clauses worth reading",
    description:
      "Renewal, subletting, early termination, and fees—where surprises hide.",
    publishedAt: "2026-03-01",
    keywords: ["lease agreement", "DocuSign", "renters"],
  },
  {
    slug: "utilities-internet-move-in",
    title: "Utilities and internet before move-in",
    description:
      "Electric, gas, water, and broadband—scheduling transfers so move-in isn’t dark.",
    publishedAt: "2026-03-02",
    keywords: ["utilities", "internet", "move-in"],
  },
  {
    slug: "move-in-day-documentation",
    title: "Move-in day: photos, inspections, and first-week tasks",
    description:
      "Documenting condition protects you later; smoke detectors and locks matter too.",
    publishedAt: "2026-03-03",
    keywords: ["move-in inspection", "security deposit"],
  },
  {
    slug: "maintenance-habitability-requests",
    title: "Maintenance requests and basic habitability",
    description:
      "Heat, water, pests, and leaks—how to report issues in writing and keep records.",
    publishedAt: "2026-03-04",
    keywords: ["maintenance", "repairs", "habitability"],
  },
  {
    slug: "shared-leases-and-roommates",
    title: "Shared leases and splitting costs with roommates",
    description:
      "Joint liability, household rules, and apps that reduce awkward money talks.",
    publishedAt: "2026-03-05",
    keywords: ["roommates", "joint lease", "utilities split"],
  },
  {
    slug: "lease-renewal-vs-moving",
    title: "Renewal vs. moving: comparing market rent",
    description:
      "When to ask for a renewal rate, compare comps, and budget for switching costs.",
    publishedAt: "2026-03-06",
    keywords: ["lease renewal", "market rent"],
  },
  {
    slug: "move-out-security-deposit-return",
    title: "Move-out: notice, cleaning, and security deposit returns",
    description:
      "Timelines for itemized deductions vary by state—plan ahead and document everything.",
    publishedAt: "2026-03-07",
    keywords: ["move out", "security deposit return"],
  },
  {
    slug: "broker-fees-and-upfront-costs",
    title: "Broker fees and upfront rental costs",
    description:
      "Where broker fees still apply and how to line up cash for first month and deposit.",
    publishedAt: "2026-03-08",
    keywords: ["broker fee", "upfront costs", "renting"],
  },
  {
    slug: "conditional-approval-higher-deposit",
    title: "Conditional approvals and larger deposits",
    description:
      "When landlords ask for extra months upfront or a higher deposit—and what to ask.",
    publishedAt: "2026-03-09",
    keywords: ["conditional approval", "security deposit"],
  },
  {
    slug: "month-to-month-after-lease",
    title: "Month-to-month tenancies after the lease term",
    description:
      "How holdover and month-to-month rent differ from a fixed term—read your notice rules.",
    publishedAt: "2026-03-10",
    keywords: ["month to month", "tenancy", "notice"],
  },
  {
    slug: "noise-neighbors-and-building-rules",
    title: "Noise, neighbors, and building rules",
    description:
      "Quiet hours, amenities policies, and good-faith ways to resolve friction.",
    publishedAt: "2026-03-11",
    keywords: ["apartment noise", "building rules", "neighbors"],
  },
];

export function getArticleMeta(slug: string): BlogArticleMeta | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogArticles.map((a) => a.slug);
}
