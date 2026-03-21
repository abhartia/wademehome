"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useAnalyticsConsent } from "@/components/providers/AnalyticsConsentProvider";
import {
  initializeGa,
  trackPageView,
  updateAnalyticsConsent,
} from "@/lib/analytics/ga";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function AnalyticsBootstrap() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasConsent, hydrated } = useAnalyticsConsent();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hydrated) return;

    updateAnalyticsConsent(hasConsent);
    if (hasConsent) {
      initializeGa(GA_MEASUREMENT_ID);
    }
  }, [hasConsent, hydrated]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hydrated || !hasConsent) return;

    const query = searchParams.toString();
    const pathWithQuery = query ? `${pathname}?${query}` : pathname;

    if (lastTrackedPathRef.current === pathWithQuery) return;
    lastTrackedPathRef.current = pathWithQuery;
    trackPageView(pathWithQuery, document.title);
  }, [pathname, searchParams, hasConsent, hydrated]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  );
}
