import type { Metadata } from "next";

import { FareActChecker } from "@/components/widgets/FareActChecker";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://wademehome.com";

export const metadata: Metadata = {
  title: "FARE Act Broker Fee Checker (embed)",
  description:
    "Embeddable widget — was that NYC broker fee legal under the FARE Act?",
  alternates: { canonical: `${baseUrl}/tools/fare-act-broker-fee-checker/embed` },
  robots: { index: false, follow: true },
};

export default function FareActCheckerEmbedPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            FARE Act Broker Fee Checker
          </h1>
          <p className="text-sm text-muted-foreground">
            Free NYC tool — answer four questions to see if your broker fee was legal.
          </p>
        </header>
        <FareActChecker bare showAttribution />
      </div>
    </div>
  );
}
