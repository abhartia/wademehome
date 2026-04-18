import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { UserProfileProvider } from "@/components/providers/UserProfileProvider";
import { RoommateProvider } from "@/components/providers/RoommateProvider";
import { ToursProvider } from "@/components/providers/ToursProvider";
import { GuarantorProvider } from "@/components/providers/GuarantorProvider";
import { MoveInProvider } from "@/components/providers/MoveInProvider";
import { AnalyticsConsentProvider } from "@/components/providers/AnalyticsConsentProvider";
import { AnalyticsBootstrap } from "@/components/analytics/AnalyticsBootstrap";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { LandlordProvider } from "@/components/providers/LandlordProvider";
import { ActiveGroupProvider } from "@/lib/groups/activeGroup";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
  wait_for_update: 500,
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
try {
  var stored = localStorage.getItem('wademehome_analytics_consent');
  var gpc = navigator.globalPrivacyControl === true;
  if (stored === 'denied' || (stored === null && gpc)) {
    gtag('consent', 'update', { analytics_storage: 'denied' });
  }
} catch (e) {}`}
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
                  <ActiveGroupProvider>
                    <ToursProvider>
                      <GuarantorProvider>
                        <MoveInProvider>
                          <LandlordProvider>{children}</LandlordProvider>
                        </MoveInProvider>
                      </GuarantorProvider>
                    </ToursProvider>
                  </ActiveGroupProvider>
                </RoommateProvider>
              </UserProfileProvider>
            </AnalyticsConsentProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
