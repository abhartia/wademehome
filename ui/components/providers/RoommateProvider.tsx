"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultMyRoommateProfile,
  MyRoommateProfile,
  RoommateConnection,
  RoommateProfile,
  RoommateMessage,
} from "@/lib/types/roommate";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  readRoommatesPortalRoommatesGetOptions,
  readRoommatesPortalRoommatesGetQueryKey,
  syncRoommatesPortalRoommatesPutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type { RoommateStatePayload } from "@/lib/api/generated/types.gen";
import { roommatesFromApi, roommatesToApiPayload } from "@/lib/api/portalMappers";

const STORAGE_KEY = "wademehome_roommate_profile";

interface RoommateContextValue {
  myProfile: MyRoommateProfile;
  updateMyProfile: (partial: Partial<MyRoommateProfile>) => void;
  resetMyProfile: () => void;
  connections: RoommateConnection[];
  addConnection: (roommate: RoommateProfile) => void;
  removeConnection: (roommateId: string) => void;
  addMessage: (roommateId: string, message: RoommateMessage) => void;
  isConnected: (roommateId: string) => boolean;
}

const RoommateContext = createContext<RoommateContextValue | null>(null);

interface PersistedState {
  myProfile: MyRoommateProfile;
  connections: RoommateConnection[];
}

export function RoommateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [myProfile, setMyProfile] = useState<MyRoommateProfile>(
    defaultMyRoommateProfile,
  );
  const [connections, setConnections] = useState<RoommateConnection[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const syncMutateRef = useRef<(opts: { body: RoommateStatePayload }) => void>(
    () => {},
  );

  const syncMutation = useMutation({
    ...syncRoommatesPortalRoommatesPutMutation(),
    onSuccess: (data) => {
      skipSave.current = true;
      const parsed = roommatesFromApi(data);
      setMyProfile(parsed.myProfile);
      setConnections(parsed.connections);
      queryClient.setQueryData(readRoommatesPortalRoommatesGetQueryKey({}), data);
    },
  });
  syncMutateRef.current = syncMutation.mutate;

  const { data: serverState } = useQuery({
    ...readRoommatesPortalRoommatesGetOptions({}),
    enabled: Boolean(user),
    queryKey: readRoommatesPortalRoommatesGetQueryKey({}),
  });

  useEffect(() => {
    if (user) {
      setHydrated(true);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: PersistedState = JSON.parse(stored);
        if (parsed.myProfile)
          setMyProfile({ ...defaultMyRoommateProfile, ...parsed.myProfile });
        if (parsed.connections) setConnections(parsed.connections);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || serverState === undefined) return;
    skipSave.current = true;
    const parsed = roommatesFromApi(serverState);
    setMyProfile(parsed.myProfile);
    setConnections(parsed.connections);
  }, [user, serverState]);

  useEffect(() => {
    if (!hydrated || user) return;
    const state: PersistedState = { myProfile, connections };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [myProfile, connections, hydrated, user]);

  useEffect(() => {
    if (!user || !hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const body = roommatesToApiPayload(
        myProfile,
        connections,
      ) as unknown as RoommateStatePayload;
      syncMutateRef.current({ body });
    }, 600);
    return () => window.clearTimeout(debounceRef.current);
  }, [myProfile, connections, user, hydrated]);

  const updateMyProfile = useCallback(
    (partial: Partial<MyRoommateProfile>) => {
      setMyProfile((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const resetMyProfile = useCallback(() => {
    setMyProfile(defaultMyRoommateProfile);
    setConnections([]);
    localStorage.removeItem(STORAGE_KEY);
    if (user) {
      skipSave.current = true;
      const body = roommatesToApiPayload(
        defaultMyRoommateProfile,
        [],
      ) as unknown as RoommateStatePayload;
      syncMutateRef.current({ body });
    }
  }, [user]);

  const addConnection = useCallback(
    (roommate: RoommateProfile) => {
      setConnections((prev) => {
        if (prev.some((c) => c.roommate.id === roommate.id)) return prev;
        return [
          ...prev,
          {
            roommate,
            connectedAt: new Date().toISOString(),
            messages: [
              {
                role: "them" as const,
                content: `Hey! I saw we matched on wademehome. Nice to meet you!`,
                time: new Date().toISOString(),
              },
            ],
          },
        ];
      });
    },
    [],
  );

  const removeConnection = useCallback((roommateId: string) => {
    setConnections((prev) => prev.filter((c) => c.roommate.id !== roommateId));
  }, []);

  const addMessage = useCallback(
    (roommateId: string, message: RoommateMessage) => {
      setConnections((prev) =>
        prev.map((c) =>
          c.roommate.id === roommateId
            ? { ...c, messages: [...c.messages, message] }
            : c,
        ),
      );
    },
    [],
  );

  const isConnected = useCallback(
    (roommateId: string) => connections.some((c) => c.roommate.id === roommateId),
    [connections],
  );

  if (!hydrated) return null;

  return (
    <RoommateContext.Provider
      value={{
        myProfile,
        updateMyProfile,
        resetMyProfile,
        connections,
        addConnection,
        removeConnection,
        addMessage,
        isConnected,
      }}
    >
      {children}
    </RoommateContext.Provider>
  );
}

export function useRoommate() {
  const ctx = useContext(RoommateContext);
  if (!ctx)
    throw new Error("useRoommate must be used within RoommateProvider");
  return ctx;
}
