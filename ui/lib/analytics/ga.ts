"use client";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    __WMH_GA_READY__?: boolean;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export type OnboardingEventName =
  | "onboarding_started"
  | "onboarding_step_viewed"
  | "onboarding_answer_submitted"
  | "onboarding_summary_viewed"
  | "onboarding_completed"
  | "onboarding_reset"
  | "onboarding_abandoned";

function hasGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function initializeGa(measurementId: string) {
  if (!hasGtag() || !measurementId || window.__WMH_GA_READY__) return;

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
  });
  window.__WMH_GA_READY__ = true;
}

export function updateAnalyticsConsent(granted: boolean) {
  if (!hasGtag()) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

export function trackPageView(path: string, title?: string) {
  if (!hasGtag() || !window.__WMH_GA_READY__) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export function trackOnboardingEvent(
  eventName: OnboardingEventName,
  params?: EventParams,
) {
  if (!hasGtag() || !window.__WMH_GA_READY__) return;
  window.gtag("event", eventName, params ?? {});
}
