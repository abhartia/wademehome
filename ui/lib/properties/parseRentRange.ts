/**
 * Best-effort parse of a monthly rent midpoint from display strings like "$2,000-$2,500" or "$1800".
 */
export function parseRentRangeMidpoint(rentRange: string): number | null {
  const s = rentRange.replace(/,/g, "");
  const nums = s.match(/\$?\s*(\d+(?:\.\d+)?)/g);
  if (!nums || nums.length === 0) return null;
  const values = nums
    .map((n) => Number.parseFloat(n.replace("$", "").trim()))
    .filter((n) => Number.isFinite(n));
  if (values.length === 0) return null;
  if (values.length === 1) return values[0];
  return (values[0] + values[values.length - 1]) / 2;
}
