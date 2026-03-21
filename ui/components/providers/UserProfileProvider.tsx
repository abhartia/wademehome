"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  defaultProfile,
  JourneyStage,
  UserProfile,
} from "@/lib/types/userProfile";
import { inferJourneyStage } from "@/lib/journeyStage";

const STORAGE_KEY = "wademehome_user_profile";

interface UserProfileContextValue {
  profile: UserProfile;
  journeyStage: JourneyStage | null;
  updateProfile: (partial: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile({ ...defaultProfile, ...JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, hydrated]);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...partial,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const journeyStage = useMemo(
    () =>
      hydrated
        ? inferJourneyStage(profile.journeyStageOverride)
        : null,
    [hydrated, profile],
  );

  if (!hydrated) return null;

  return (
    <UserProfileContext.Provider
      value={{ profile, journeyStage, updateProfile, resetProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx)
    throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
