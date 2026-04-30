"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateAnalyticsConsent } from "@/lib/analytics/ga";

const CONSENT_STORAGE_KEY = "wademehome_analytics_consent";
const NOTICE_DISMISSED_KEY = "wademehome_consent_notice_dismissed";

type ConsentStatus = "granted" | "denied";

interface AnalyticsConsentContextValue {
  hasConsent: boolean;
  hydrated: boolean;
  grantConsent: () => void;
  denyConsent: () => void;
  openPreferences: () => void;
}

const AnalyticsConsentContext =
  createContext<AnalyticsConsentContextValue | null>(null);

function detectGpc() {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl === true;
}

export function AnalyticsConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("granted");
  const [hydrated, setHydrated] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    const noticeDismissed =
      localStorage.getItem(NOTICE_DISMISSED_KEY) === "true";

    let initial: ConsentStatus;
    if (stored === "granted" || stored === "denied") {
      initial = stored;
    } else if (detectGpc()) {
      initial = "denied";
    } else {
      initial = "granted";
    }

    setConsentStatus(initial);
    updateAnalyticsConsent(initial === "granted");
    setNoticeVisible(stored === null && !noticeDismissed);
    setHydrated(true);
  }, []);

  const grantConsent = useCallback(() => {
    setConsentStatus("granted");
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    localStorage.setItem(NOTICE_DISMISSED_KEY, "true");
    setNoticeVisible(false);
    updateAnalyticsConsent(true);
  }, []);

  const denyConsent = useCallback(() => {
    setConsentStatus("denied");
    localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
    localStorage.setItem(NOTICE_DISMISSED_KEY, "true");
    setNoticeVisible(false);
    updateAnalyticsConsent(false);
  }, []);

  const dismissNotice = useCallback(() => {
    localStorage.setItem(NOTICE_DISMISSED_KEY, "true");
    setNoticeVisible(false);
  }, []);

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      hasConsent: consentStatus === "granted",
      hydrated,
      grantConsent,
      denyConsent,
      openPreferences,
    }),
    [consentStatus, hydrated, grantConsent, denyConsent, openPreferences],
  );

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
      {hydrated && noticeVisible && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4">
          <Card className="pointer-events-auto mx-auto max-w-2xl border-primary/20 bg-background/95 shadow-lg backdrop-blur">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                We use cookies and product analytics (Google Analytics and
                PostHog) to improve the product. You can opt out anytime via
                Your Privacy Choices.
              </p>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={openPreferences}>
                  Manage
                </Button>
                <Button size="sm" onClick={dismissNotice}>
                  Got it
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Privacy Choices</DialogTitle>
            <DialogDescription>
              Wade Me Home uses Google Analytics (GA4) and PostHog product
              analytics to understand product usage and improve reliability.
              You can opt out of analytics at any time. Your choice is stored
              in this browser.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border p-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">
                  Analytics cookies
                </p>
                <p className="mt-1 text-muted-foreground">
                  Currently{" "}
                  <span className="font-medium text-foreground">
                    {consentStatus === "granted" ? "allowed" : "blocked"}
                  </span>
                  .
                </p>
              </div>
              {consentStatus === "granted" ? (
                <Button size="sm" variant="outline" onClick={denyConsent}>
                  Opt out
                </Button>
              ) : (
                <Button size="sm" onClick={grantConsent}>
                  Allow
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            If your browser sends a Global Privacy Control signal, analytics
            are blocked by default. Personal information is not sold.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreferencesOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent() {
  const ctx = useContext(AnalyticsConsentContext);
  if (!ctx) {
    throw new Error(
      "useAnalyticsConsent must be used within AnalyticsConsentProvider",
    );
  }
  return ctx;
}
