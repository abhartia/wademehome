import type { Metadata } from "next";

import { NycAffordabilityCalculator } from "@/components/widgets/NycAffordabilityCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "NYC Affordability Calculator (embed)",
  description:
    "Embeddable NYC rent affordability calculator — 40× rule + 33% of take-home.",
  alternates: {
    canonical: `${baseUrl}/tools/nyc-affordability-calculator/embed`,
  },
  robots: { index: false, follow: true },
};

export default function NycAffordabilityEmbedPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            NYC Rent Affordability Calculator
          </h1>
          <p className="text-sm text-muted-foreground">
            Free NYC tool — 40× rule + 33%-of-take-home. Real 2026 tax math.
          </p>
        </header>
        <NycAffordabilityCalculator bare showAttribution />
      </div>
    </div>
  );
}
