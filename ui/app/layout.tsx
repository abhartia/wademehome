import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { MIDDLEWARE_PATHNAME_HEADER } from "@/lib/middlewareHeaders";
import { isMarketingPath, normalizePathname } from "@/lib/routes/marketingPaths";
import { UserProfileProvider } from "@/components/providers/UserProfileProvider";
import { RoommateProvider } from "@/components/providers/RoommateProvider";
import { ToursProvider } from "@/components/providers/ToursProvider";
import { GuarantorProvider } from "@/components/providers/GuarantorProvider";
import { MoveInProvider } from "@/components/providers/MoveInProvider";
import { AppShell } from "@/components/navigation/AppShell";
import { AnalyticsConsentProvider } from "@/components/providers/AnalyticsConsentProvider";
import { AnalyticsBootstrap } from "@/components/analytics/AnalyticsBootstrap";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wade Me Home",
  description:
    "Renter-first rental search and tools for the full rental lifecycle: discovery, tours, applications, and move-in.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const path = normalizePathname(headerList.get(MIDDLEWARE_PATHNAME_HEADER) ?? "/");
  const marketing = isMarketingPath(path);

  const content = marketing ? (
    <main className="min-h-screen">{children}</main>
  ) : (
    <AppShell>{children}</AppShell>
  );

  return (
    <html lang="en">
      <head>
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', { analytics_storage: 'denied' });`}
        </Script>
      </head>
      <body className={`${workSans.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <AnalyticsConsentProvider>
              <Suspense fallback={null}>
                <AnalyticsBootstrap />
              </Suspense>
              <UserProfileProvider>
                <RoommateProvider>
                  <ToursProvider>
                    <GuarantorProvider>
                      <MoveInProvider>{content}</MoveInProvider>
                    </GuarantorProvider>
                  </ToursProvider>
                </RoommateProvider>
              </UserProfileProvider>
            </AnalyticsConsentProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
