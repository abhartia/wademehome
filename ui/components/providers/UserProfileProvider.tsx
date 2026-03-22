"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultProfile,
  JourneyStage,
  UserProfile,
} from "@/lib/types/userProfile";
import { inferJourneyStage } from "@/lib/journeyStage";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  readProfilePortalProfileGetOptions,
  readProfilePortalProfileGetQueryKey,
  updateProfilePortalProfilePatchMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import {
  profileFromApi,
  userProfileToProfilePatch,
} from "@/lib/api/portalMappers";

const STORAGE_KEY = "wademehome_user_profile";

function profilePatchFingerprint(p: UserProfile): string {
  return JSON.stringify(userProfileToProfilePatch(p));
}

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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const lastSyncedPatchJson = useRef<string | null>(null);
  const patchMutateRef = useRef<
    (opts: { body: ReturnType<typeof userProfileToProfilePatch> }) => void
  >(() => {});

  const patchMutation = useMutation({
    ...updateProfilePortalProfilePatchMutation(),
    onSuccess: (data) => {
      skipSave.current = true;
      const next = profileFromApi(data);
      setProfile(next);
      lastSyncedPatchJson.current = profilePatchFingerprint(next);
      queryClient.setQueryData(readProfilePortalProfileGetQueryKey({}), data);
    },
  });
  patchMutateRef.current = patchMutation.mutate;

  const {
    data: serverProfile,
    isSuccess: profileQuerySuccess,
    isPending: profileQueryPending,
    isFetching: profileQueryFetching,
  } = useQuery({
    ...readProfilePortalProfileGetOptions({}),
    enabled: Boolean(user),
    queryKey: readProfilePortalProfileGetQueryKey({}),
  });

  /** Never debounce-sync until /portal/profile has settled; avoids PATCHing defaults over real server state. */
  const portalReadyForAutosync =
    Boolean(user) && profileQuerySuccess && !profileQueryPending && !profileQueryFetching;

  useEffect(() => {
    if (user) {
      setHydrated(true);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile({ ...defaultProfile, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || !serverProfile) return;
    skipSave.current = true;
    const next = profileFromApi(serverProfile);
    setProfile(next);
    lastSyncedPatchJson.current = profilePatchFingerprint(next);
  }, [user, serverProfile]);

  useEffect(() => {
    if (!hydrated || user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated, user]);

  useEffect(() => {
    if (!user || !hydrated || !portalReadyForAutosync) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const p = profileRef.current;
      const body = userProfileToProfilePatch(p);
      const fp = JSON.stringify(body);
      if (fp === lastSyncedPatchJson.current) return;
      patchMutateRef.current({ body });
    }, 600);
    return () => window.clearTimeout(debounceRef.current);
  }, [profile, user, hydrated, portalReadyForAutosync]);

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
    lastSyncedPatchJson.current = profilePatchFingerprint(defaultProfile);
    if (user) {
      skipSave.current = true;
      patchMutateRef.current({
        body: userProfileToProfilePatch(defaultProfile),
      });
    }
  }, [user]);

  const journeyStage = useMemo(
    () =>
      hydrated ? inferJourneyStage(profile.journeyStageOverride) : null,
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
