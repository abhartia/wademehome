import type { PropertyDataItem } from "@/components/annotations/UIEventsTypes";

const RULES: { re: RegExp; hints: string[] }[] = [
  {
    re: /\bpet\b|pets|dog|cat/i,
    hints: ["Confirm monthly pet rent, one-time pet fee, weight/breed rules, and where pets relieve themselves."],
  },
  {
    re: /parking|garage|covered parking|carport/i,
    hints: ["Ask whether parking is assigned, gated, tandem, EV-ready, and if guest parking exists."],
  },
  {
    re: /washer|dryer|w\/d|laundry/i,
    hints: ["Clarify in-unit vs floor laundry, costs per load, and hours if shared."],
  },
  {
    re: /utilit|all bills|included/i,
    hints: ["Get in writing which utilities are included and typical RUBS or caps if split."],
  },
  {
    re: /furnish/i,
    hints: ["Inventory what stays, replacement policy, and whether you can remove landlord furniture."],
  },
  {
    re: /short[\s-]?term|month[\s-]?to[\s-]?month|corporate/i,
    hints: ["Short-term often carries premium rent—confirm notice period and renewal terms."],
  },
  {
    re: /gym|fitness|pool/i,
    hints: ["Ask hours, crowding, fob access, and whether amenities are included or an extra fee."],
  },
];

export function amenityTourHints(property: PropertyDataItem): string[] {
  const blob = [...(property.amenities ?? []), ...(property.main_amenities ?? [])].join(" ");
  const out: string[] = [];
  const seen = new Set<string>();
  for (const { re, hints } of RULES) {
    if (re.test(blob)) {
      for (const h of hints) {
        if (!seen.has(h)) {
          seen.add(h);
          out.push(h);
        }
      }
    }
  }
  if (out.length === 0) {
    return [
      "Ask about maintenance response time, package handling, quiet hours, and guest policies.",
    ];
  }
  return out;
}
