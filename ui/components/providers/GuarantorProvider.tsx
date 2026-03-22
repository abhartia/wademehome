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
  GuarantorRequest,
  GuarantorRequestStatus,
  LeaseInfo,
  SavedGuarantor,
} from "@/lib/types/guarantor";
import { SEED_GUARANTORS, SEED_REQUESTS } from "@/lib/mock/guarantors";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  readGuarantorsPortalGuarantorsGetOptions,
  readGuarantorsPortalGuarantorsGetQueryKey,
  syncGuarantorsPortalGuarantorsPutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type { GuarantorStatePayload } from "@/lib/api/generated/types.gen";
import { guarantorStateFromApi, guarantorStateToApiPayload } from "@/lib/api/portalMappers";

const STORAGE_KEY = "wademehome_guarantor";

interface PersistedState {
  savedGuarantors: SavedGuarantor[];
  requests: GuarantorRequest[];
}

interface GuarantorContextValue {
  savedGuarantors: SavedGuarantor[];
  addGuarantor: (
    info: Omit<SavedGuarantor, "id" | "createdAt">,
  ) => string;
  updateGuarantor: (id: string, partial: Partial<SavedGuarantor>) => void;
  removeGuarantor: (id: string) => void;

  requests: GuarantorRequest[];
  addRequest: (guarantorId: string, lease: LeaseInfo) => string;
  sendRequest: (requestId: string) => void;
  updateRequest: (requestId: string, partial: Partial<GuarantorRequest>) => void;
  removeRequest: (requestId: string) => void;
  simulateGuarantorAction: (requestId: string) => void;
}

const GuarantorContext = createContext<GuarantorContextValue | null>(null);

export function GuarantorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [savedGuarantors, setSavedGuarantors] = useState<SavedGuarantor[]>([]);
  const [requests, setRequests] = useState<GuarantorRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const syncMutateRef = useRef<(opts: { body: GuarantorStatePayload }) => void>(
    () => {},
  );

  const syncMutation = useMutation({
    ...syncGuarantorsPortalGuarantorsPutMutation(),
    onSuccess: (data) => {
      skipSave.current = true;
      const parsed = guarantorStateFromApi(data);
      setSavedGuarantors(parsed.savedGuarantors);
      setRequests(parsed.requests);
      queryClient.setQueryData(readGuarantorsPortalGuarantorsGetQueryKey({}), data);
    },
  });
  syncMutateRef.current = syncMutation.mutate;

  const { data: serverState } = useQuery({
    ...readGuarantorsPortalGuarantorsGetOptions({}),
    enabled: Boolean(user),
    queryKey: readGuarantorsPortalGuarantorsGetQueryKey({}),
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
        setSavedGuarantors(parsed.savedGuarantors ?? []);
        setRequests(parsed.requests ?? []);
      } else {
        setSavedGuarantors(SEED_GUARANTORS);
        setRequests(SEED_REQUESTS);
      }
    } catch {
      setSavedGuarantors(SEED_GUARANTORS);
      setRequests(SEED_REQUESTS);
    }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || serverState === undefined) return;
    skipSave.current = true;
    const parsed = guarantorStateFromApi(serverState);
    setSavedGuarantors(parsed.savedGuarantors);
    setRequests(parsed.requests);
  }, [user, serverState]);

  useEffect(() => {
    if (!hydrated || user) return;
    const state: PersistedState = { savedGuarantors, requests };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [savedGuarantors, requests, hydrated, user]);

  useEffect(() => {
    if (!user || !hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const body = guarantorStateToApiPayload(
        savedGuarantors,
        requests,
      ) as unknown as GuarantorStatePayload;
      syncMutateRef.current({ body });
    }, 600);
    return () => window.clearTimeout(debounceRef.current);
  }, [savedGuarantors, requests, user, hydrated]);

  const addGuarantor = useCallback(
    (info: Omit<SavedGuarantor, "id" | "createdAt">) => {
      const id = `gtor-${Date.now()}`;
      const newG: SavedGuarantor = {
        ...info,
        id,
        createdAt: new Date().toISOString(),
      };
      setSavedGuarantors((prev) => [...prev, newG]);
      return id;
    },
    [],
  );

  const updateGuarantor = useCallback(
    (id: string, partial: Partial<SavedGuarantor>) => {
      setSavedGuarantors((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...partial } : g)),
      );
    },
    [],
  );

  const removeGuarantor = useCallback((id: string) => {
    setSavedGuarantors((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addRequest = useCallback(
    (guarantorId: string, lease: LeaseInfo): string => {
      const guarantor = savedGuarantors.find((g) => g.id === guarantorId);
      const now = new Date().toISOString();
      const id = `greq-${Date.now()}`;
      const newReq: GuarantorRequest = {
        id,
        guarantorId,
        guarantorSnapshot: {
          name: guarantor?.name ?? "",
          email: guarantor?.email ?? "",
        },
        lease,
        status: "draft",
        verificationStatus: "pending",
        createdAt: now,
        sentAt: "",
        viewedAt: "",
        signedAt: "",
        expiresAt: "",
        statusHistory: [{ status: "draft", timestamp: now, note: "Request created" }],
      };
      setRequests((prev) => [newReq, ...prev]);
      return id;
    },
    [savedGuarantors],
  );

  const sendRequest = useCallback((requestId: string) => {
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          status: "sent" as GuarantorRequestStatus,
          sentAt: now,
          expiresAt: expires,
          statusHistory: [
            ...r.statusHistory,
            { status: "sent", timestamp: now, note: `Sent to ${r.guarantorSnapshot.email}` },
          ],
        };
      }),
    );
  }, []);

  const updateRequest = useCallback(
    (requestId: string, partial: Partial<GuarantorRequest>) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, ...partial } : r)),
      );
    },
    [],
  );

  const removeRequest = useCallback((requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const simulateGuarantorAction = useCallback((requestId: string) => {
    const now = new Date().toISOString();
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        if (r.status === "sent") {
          return {
            ...r,
            status: "viewed" as GuarantorRequestStatus,
            viewedAt: now,
            statusHistory: [
              ...r.statusHistory,
              { status: "viewed", timestamp: now, note: "Opened by guarantor" },
            ],
          };
        }
        if (r.status === "viewed") {
          return {
            ...r,
            status: "signed" as GuarantorRequestStatus,
            verificationStatus: "verified" as const,
            signedAt: now,
            statusHistory: [
              ...r.statusHistory,
              { status: "signed", timestamp: now, note: "Agreement signed" },
            ],
          };
        }
        return r;
      }),
    );
  }, []);

  if (!hydrated) return null;

  return (
    <GuarantorContext.Provider
      value={{
        savedGuarantors,
        addGuarantor,
        updateGuarantor,
        removeGuarantor,
        requests,
        addRequest,
        sendRequest,
        updateRequest,
        removeRequest,
        simulateGuarantorAction,
      }}
    >
      {children}
    </GuarantorContext.Provider>
  );
}

export function useGuarantor() {
  const ctx = useContext(GuarantorContext);
  if (!ctx)
    throw new Error("useGuarantor must be used within GuarantorProvider");
  return ctx;
}
