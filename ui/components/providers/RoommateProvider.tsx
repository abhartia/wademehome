"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  defaultMyRoommateProfile,
  MyRoommateProfile,
  RoommateConnection,
  RoommateProfile,
  RoommateMessage,
} from "@/lib/types/roommate";

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
  const [myProfile, setMyProfile] = useState<MyRoommateProfile>(
    defaultMyRoommateProfile,
  );
  const [connections, setConnections] = useState<RoommateConnection[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (hydrated) {
      const state: PersistedState = { myProfile, connections };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [myProfile, connections, hydrated]);

  const updateMyProfile = useCallback(
    (partial: Partial<MyRoommateProfile>) => {
      setMyProfile((prev) => ({ ...prev, ...partial }));
    },
    [],
  );

  const resetMyProfile = useCallback(() => {
    setMyProfile(defaultMyRoommateProfile);
    setConnections([]);
  }, []);

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
