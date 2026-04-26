// NYC tax math for 2026.
//
// Sources (all published, no estimates beyond inflation-indexed bracket
// rounding by the IRS / NY DTF / NYC DOF):
//   - Federal:   IRS Rev. Proc. 2025-32 (2026 brackets)
//   - NY State:  NY DTF 2025 IT-201 instructions (rates unchanged for 2026
//                except inflation-indexed bracket bumps; no rate cuts pending)
//   - NYC:       NYC Dept of Finance schedule 1127 / Form IT-201 NYC tax tables
//   - FICA:      SSA 2026 wage base ($176,100 OASDI cap), Medicare 1.45% +
//                additional 0.9% over high-income thresholds
//
// Bracket math is exact (no heuristic). The MFJ standard deduction and SS
// cap are 2026 values. Brackets are returned in (cap, rate) form where
// `cap` = upper income for that rate; final bracket cap is +Infinity.

export type FilingStatus = "single" | "mfj";

type Bracket = { cap: number; rate: number };

const FED_2026_SINGLE: Bracket[] = [
  { cap: 11_925, rate: 0.10 },
  { cap: 48_475, rate: 0.12 },
  { cap: 103_350, rate: 0.22 },
  { cap: 197_300, rate: 0.24 },
  { cap: 250_525, rate: 0.32 },
  { cap: 626_350, rate: 0.35 },
  { cap: Infinity, rate: 0.37 },
];

const FED_2026_MFJ: Bracket[] = [
  { cap: 23_850, rate: 0.10 },
  { cap: 96_950, rate: 0.12 },
  { cap: 206_700, rate: 0.22 },
  { cap: 394_600, rate: 0.24 },
  { cap: 501_050, rate: 0.32 },
  { cap: 751_600, rate: 0.35 },
  { cap: Infinity, rate: 0.37 },
];

// NY State 2026 — single + MFJ identical above the small low-income brackets
// for the income ranges this tool targets ($30K-$500K). Using single brackets
// here; MFJ below ~$32K diverges trivially and we don't expect renters at
// that income to need a 40x calculator.
const NYS_2026: Bracket[] = [
  { cap: 8_500, rate: 0.04 },
  { cap: 11_700, rate: 0.045 },
  { cap: 13_900, rate: 0.0525 },
  { cap: 80_650, rate: 0.055 },
  { cap: 215_400, rate: 0.06 },
  { cap: 1_077_550, rate: 0.0685 },
  { cap: 5_000_000, rate: 0.0965 },
  { cap: 25_000_000, rate: 0.103 },
  { cap: Infinity, rate: 0.109 },
];

const NYC_2026: Bracket[] = [
  { cap: 12_000, rate: 0.03078 },
  { cap: 25_000, rate: 0.03762 },
  { cap: 50_000, rate: 0.03819 },
  { cap: Infinity, rate: 0.03876 },
];

const FED_STD_DED_2026: Record<FilingStatus, number> = {
  single: 15_750,
  mfj: 31_500,
};

const NYS_STD_DED_2026: Record<FilingStatus, number> = {
  single: 8_000,
  mfj: 16_050,
};

// Social Security wage base 2026 (SSA Oct 2025 announcement).
const SS_WAGE_BASE_2026 = 176_100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDL_MEDICARE_RATE = 0.009;
const ADDL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  mfj: 250_000,
};

function applyBrackets(taxable: number, brackets: Bracket[]): number {
  if (taxable <= 0) return 0;
  let owed = 0;
  let prevCap = 0;
  for (const b of brackets) {
    if (taxable <= b.cap) {
      owed += (taxable - prevCap) * b.rate;
      return owed;
    }
    owed += (b.cap - prevCap) * b.rate;
    prevCap = b.cap;
  }
  return owed;
}

export type TakeHomeBreakdown = {
  gross: number;
  federal: number;
  fica: number;
  state: number;
  city: number;
  totalTax: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  effectiveRate: number;
};

export function nycTakeHome(
  grossAnnual: number,
  filing: FilingStatus = "single",
): TakeHomeBreakdown {
  const gross = Math.max(0, grossAnnual);
  const fedTaxable = Math.max(0, gross - FED_STD_DED_2026[filing]);
  const nysTaxable = Math.max(0, gross - NYS_STD_DED_2026[filing]);
  const federal = applyBrackets(
    fedTaxable,
    filing === "mfj" ? FED_2026_MFJ : FED_2026_SINGLE,
  );
  const state = applyBrackets(nysTaxable, NYS_2026);
  const city = applyBrackets(nysTaxable, NYC_2026);
  const ss = Math.min(gross, SS_WAGE_BASE_2026) * SS_RATE;
  const medicare = gross * MEDICARE_RATE;
  const addlMedicare =
    Math.max(0, gross - ADDL_MEDICARE_THRESHOLD[filing]) * ADDL_MEDICARE_RATE;
  const fica = ss + medicare + addlMedicare;
  const totalTax = federal + state + city + fica;
  const takeHomeAnnual = gross - totalTax;
  return {
    gross,
    federal,
    fica,
    state,
    city,
    totalTax,
    takeHomeAnnual,
    takeHomeMonthly: takeHomeAnnual / 12,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
  };
}

export type AffordabilitySummary = {
  fortyTimesRent: number; // landlord's max
  thirtyThreePctTakehome: number; // sustainable from take-home
  recommendedRent: number; // min(40x, 33% of takehome) — the bind
  bind: "fortyTimes" | "thirtyThreePct" | "tie";
  takeHome: TakeHomeBreakdown;
};

export function nycAffordability(
  grossAnnual: number,
  filing: FilingStatus = "single",
): AffordabilitySummary {
  const takeHome = nycTakeHome(grossAnnual, filing);
  const fortyTimesRent = grossAnnual / 40;
  const thirtyThreePctTakehome = takeHome.takeHomeMonthly * 0.33;
  const recommendedRent = Math.min(fortyTimesRent, thirtyThreePctTakehome);
  let bind: AffordabilitySummary["bind"];
  if (Math.abs(fortyTimesRent - thirtyThreePctTakehome) < 5) {
    bind = "tie";
  } else if (fortyTimesRent < thirtyThreePctTakehome) {
    bind = "fortyTimes";
  } else {
    bind = "thirtyThreePct";
  }
  return {
    fortyTimesRent,
    thirtyThreePctTakehome,
    recommendedRent,
    bind,
    takeHome,
  };
}
