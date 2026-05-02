import type { Metadata } from "next";

import { PathCommuteRoiCalculator } from "@/components/widgets/PathCommuteRoiCalculator";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "PATH Commute ROI Calculator (embed)",
  description:
    "Embeddable calculator: NJ rent savings vs. PATH commute time priced at $/hour.",
  alternates: { canonical: `${baseUrl}/tools/path-commute-roi-calculator/embed` },
  robots: { index: false, follow: true },
};

export default function PathCommuteRoiEmbedPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            PATH Commute ROI Calculator
          </h1>
          <p className="text-sm text-muted-foreground">
            NJ rent savings vs. annualized PATH commute time, priced at $/hour. Free tool.
          </p>
        </header>
        <PathCommuteRoiCalculator bare showAttribution />
      </div>
    </div>
  );
}
