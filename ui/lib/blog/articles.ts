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
    title: "How to Choose Where to Move: Best Rental Markets 2026",
    description:
      "Compare cities by jobs, taxes, commute, and cost of living to find the best place to rent in 2026.",
    publishedAt: "2026-02-10",
    keywords: ["best cities to rent", "where to move 2026", "relocating for work", "cost of living comparison", "rental market comparison", "best rental markets"],
  },
  {
    slug: "neighborhood-research-for-renters",
    title: "How to Research a Neighborhood Before Renting",
    description:
      "Check commute times, safety, walkability, and amenities before signing a lease in any neighborhood.",
    publishedAt: "2026-02-12",
    keywords: ["research neighborhood before renting", "is this neighborhood safe", "apartment neighborhood guide", "commute time calculator", "walkability score", "neighborhood amenities"],
  },
  {
    slug: "rent-budget-from-take-home-pay",
    title: "How Much Rent Can I Afford? Budget Calculator Guide",
    description:
      "Calculate your max rent from take-home pay using the 30% rule, then adjust for debt and savings.",
    publishedAt: "2026-02-14",
    keywords: ["how much rent can I afford", "rent budget calculator", "30 percent rule rent", "rent to income ratio", "apartment affordability", "rent budget from salary"],
  },
  {
    slug: "roommate-vs-solo-living",
    title: "Roommates vs Living Alone: Cost, Pros, and Cons",
    description:
      "Compare the real costs and tradeoffs of shared vs solo apartments to make the right choice.",
    publishedAt: "2026-02-15",
    keywords: ["roommates vs living alone", "should I get a roommate", "splitting rent with roommates", "cost of living alone", "shared apartment pros cons", "roommate cost savings"],
  },
  {
    slug: "rental-listings-fees-net-effective-rent",
    title: "Net Effective Rent Explained: How to Read Apartment Listings",
    description:
      "Understand how free months, concessions, and fees change what you actually pay each month.",
    publishedAt: "2026-02-17",
    keywords: ["net effective rent", "what is net effective rent", "apartment listing fees", "rent concessions explained", "free month rent deal", "gross rent vs net rent"],
  },
  {
    slug: "apartment-search-tips",
    title: "Apartment Search Tips: How to Find an Apartment Fast",
    description:
      "Stay organized across listing sites, avoid burnout, and move quickly in competitive markets.",
    publishedAt: "2026-02-18",
    keywords: ["how to find an apartment", "apartment search tips", "apartment hunting guide", "find apartment fast", "best apartment search sites", "apartment search organized"],
  },
  {
    slug: "apartment-tour-checklist",
    title: "Apartment Tour Checklist: What to Look For",
    description:
      "Check water pressure, storage, outlets, noise, and 20+ items during your apartment viewing.",
    publishedAt: "2026-02-20",
    keywords: ["apartment tour checklist", "what to look for apartment tour", "apartment viewing checklist", "apartment inspection checklist", "questions to ask apartment tour", "red flags apartment"],
  },
  {
    slug: "rental-application-screening-basics",
    title: "What Do Landlords Look For in a Rental Application?",
    description:
      "Income verification, rental history, credit checks, and background screening explained simply.",
    publishedAt: "2026-02-21",
    keywords: ["what do landlords look for", "rental application requirements", "tenant screening process", "rental background check", "rental application tips", "how to pass rental screening"],
  },
  {
    slug: "credit-and-rental-applications",
    title: "What Credit Score Do You Need to Rent an Apartment?",
    description:
      "Minimum credit scores, how landlords use FICO and DTI, and what to do with bad credit.",
    publishedAt: "2026-02-22",
    keywords: ["credit score to rent apartment", "minimum credit score renting", "rent with bad credit", "credit check rental application", "debt to income ratio renting", "improve credit for renting"],
  },
  {
    slug: "renters-insurance-basics",
    title: "Renters Insurance: What It Covers and Why You Need It",
    description:
      "Personal property, liability, and additional living expenses coverage explained for tenants.",
    publishedAt: "2026-02-24",
    keywords: ["renters insurance what does it cover", "do I need renters insurance", "renters insurance cost", "renters insurance requirements", "best renters insurance", "liability coverage renters"],
  },
  {
    slug: "guarantors-and-co-signers",
    title: "Guarantor for an Apartment: Who Qualifies and How It Works",
    description:
      "Income requirements, guarantor services, and how co-signers help when your application falls short.",
    publishedAt: "2026-02-25",
    keywords: ["guarantor for apartment", "apartment guarantor requirements", "co-signer vs guarantor", "guarantor service", "how to get a guarantor", "apartment guarantor income"],
  },
  {
    slug: "negotiating-rent-and-lease-terms",
    title: "How to Negotiate Rent: Tips That Actually Work",
    description:
      "Use market data, timing, and lease length to negotiate lower rent or better lease terms.",
    publishedAt: "2026-02-26",
    keywords: ["how to negotiate rent", "negotiate rent renewal", "negotiate lease terms", "ask for lower rent", "rent negotiation tips", "negotiate rent concessions"],
  },
  {
    slug: "security-deposits-move-in-fees",
    title: "Security Deposit Rules by State: How Much Can Landlords Charge?",
    description:
      "State-by-state deposit caps, refund timelines, and move-in fee rules every renter should know.",
    publishedAt: "2026-02-28",
    keywords: ["security deposit rules by state", "how much security deposit", "move-in fees apartment", "security deposit maximum", "first month last month deposit", "security deposit refund law"],
  },
  {
    slug: "lease-signing-key-clauses",
    title: "Lease Agreement Red Flags: Clauses to Read Before Signing",
    description:
      "Early termination fees, auto-renewal traps, subletting rules, and hidden lease clauses explained.",
    publishedAt: "2026-03-01",
    keywords: ["lease agreement red flags", "lease clauses to watch for", "rental lease tips", "early termination clause lease", "subletting clause", "lease renewal clause"],
  },
  {
    slug: "utilities-internet-move-in",
    title: "How to Set Up Utilities When Moving to a New Apartment",
    description:
      "Schedule electric, gas, water, and internet transfers so everything works on move-in day.",
    publishedAt: "2026-03-02",
    keywords: ["set up utilities new apartment", "utilities when moving", "transfer utilities new address", "set up internet new apartment", "electric gas water setup", "utility activation timeline"],
  },
  {
    slug: "move-in-day-documentation",
    title: "Move-In Day Checklist: Photos, Inspection, and First Week Tasks",
    description:
      "Document apartment condition with photos to protect your security deposit from unfair deductions.",
    publishedAt: "2026-03-03",
    keywords: ["move-in day checklist", "move-in inspection photos", "apartment condition report", "protect security deposit", "move-in apartment what to do", "first week new apartment"],
  },
  {
    slug: "maintenance-habitability-requests",
    title: "How to Request Apartment Repairs: Tenant Maintenance Guide",
    description:
      "Report heating, plumbing, pest, and safety issues in writing and know your habitability rights.",
    publishedAt: "2026-03-04",
    keywords: ["how to request apartment repairs", "tenant maintenance rights", "landlord won't fix", "habitability standards", "apartment repair request letter", "tenant rights maintenance"],
  },
  {
    slug: "shared-leases-and-roommates",
    title: "How to Split Rent and Bills with Roommates Fairly",
    description:
      "Joint lease liability, utility splitting methods, and apps that make roommate finances simple.",
    publishedAt: "2026-03-05",
    keywords: ["how to split rent roommates", "split utilities roommates", "joint lease roommates", "roommate bill splitting app", "fair rent split by room size", "roommate agreement"],
  },
  {
    slug: "lease-renewal-vs-moving",
    title: "Should I Renew My Lease or Move? How to Decide",
    description:
      "Compare renewal rate vs market rent, factor in moving costs, and make the right financial call.",
    publishedAt: "2026-03-06",
    keywords: ["should I renew my lease", "lease renewal vs moving", "is it worth renewing lease", "compare market rent", "moving costs vs rent increase", "lease renewal negotiation"],
  },
  {
    slug: "move-out-security-deposit-return",
    title: "How to Get Your Security Deposit Back When Moving Out",
    description:
      "Give proper notice, document condition, clean thoroughly, and know state refund timelines.",
    publishedAt: "2026-03-07",
    keywords: ["how to get security deposit back", "security deposit return timeline", "move-out cleaning checklist", "security deposit deductions", "move-out inspection tips", "landlord keeping deposit"],
  },
  {
    slug: "broker-fees-and-upfront-costs",
    title: "Apartment Broker Fees Explained: What to Expect Upfront",
    description:
      "How broker fees work, where they still apply, and total move-in costs to budget for.",
    publishedAt: "2026-03-08",
    keywords: ["apartment broker fee", "how much is broker fee", "no fee apartments", "NYC broker fee", "move-in costs apartment", "upfront rental costs total"],
  },
  {
    slug: "conditional-approval-higher-deposit",
    title: "Conditional Apartment Approval: What It Means and What to Do",
    description:
      "When landlords ask for extra deposit or guarantor instead of rejecting your application outright.",
    publishedAt: "2026-03-09",
    keywords: ["conditional apartment approval", "landlord wants extra deposit", "higher security deposit", "conditional lease approval", "apartment application conditional", "extra deposit instead of rejection"],
  },
  {
    slug: "month-to-month-after-lease",
    title: "Month-to-Month Lease: Rights, Risks, and Notice Periods",
    description:
      "Understand holdover tenancy, notice requirements, and rent changes after your fixed lease ends.",
    publishedAt: "2026-03-10",
    keywords: ["month to month lease", "holdover tenant rights", "month to month notice period", "lease expired now what", "month to month rent increase", "tenancy at will"],
  },
  {
    slug: "noise-neighbors-and-building-rules",
    title: "Noisy Neighbors? Apartment Noise Rules and What You Can Do",
    description:
      "Quiet hours, noise complaints, building policies, and practical ways to resolve neighbor issues.",
    publishedAt: "2026-03-11",
    keywords: ["noisy neighbors apartment", "apartment noise rules", "quiet hours apartment", "how to file noise complaint", "noise complaint apartment", "neighbor noise solutions"],
  },
];

export function getArticleMeta(slug: string): BlogArticleMeta | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogArticles.map((a) => a.slug);
}
