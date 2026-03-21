"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CONSENT_STORAGE_KEY = "wademehome_analytics_consent";

type ConsentStatus = "granted" | "denied";

interface AnalyticsConsentContextValue {
  hasConsent: boolean;
  hydrated: boolean;
  grantConsent: () => void;
  denyConsent: () => void;
}

const AnalyticsConsentContext =
  createContext<AnalyticsConsentContextValue | null>(null);

export function AnalyticsConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("denied");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsentStatus(stored);
    }
    setHydrated(true);
  }, []);

  const grantConsent = () => {
    setConsentStatus("granted");
    localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
  };

  const denyConsent = () => {
    setConsentStatus("denied");
    localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
  };

  const value = useMemo(
    () => ({
      hasConsent: consentStatus === "granted",
      hydrated,
      grantConsent,
      denyConsent,
    }),
    [consentStatus, hydrated],
  );

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
      {hydrated && consentStatus !== "granted" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4">
          <Card className="pointer-events-auto mx-auto max-w-2xl border-primary/20 bg-background/95 shadow-lg backdrop-blur">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                We use Google Analytics to improve onboarding and product
                experience. Accept to enable analytics tracking.
              </p>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={denyConsent}>
                  Decline
                </Button>
                <Button size="sm" onClick={grantConsent}>
                  Accept
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
