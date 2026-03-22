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
import { Tour, TourNote, TourProperty, TourStatus } from "@/lib/types/tours";
import { SEED_TOURS } from "@/lib/mock/tours";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  readToursPortalToursGetOptions,
  readToursPortalToursGetQueryKey,
  syncToursPortalToursPutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type { ToursStatePayload } from "@/lib/api/generated/types.gen";
import { toursFromApi, toursToApiPayload } from "@/lib/api/portalMappers";

const STORAGE_KEY = "wademehome_tours";

function toursSyncFingerprint(list: Tour[]): string {
  return JSON.stringify(toursToApiPayload(list));
}

interface ToursContextValue {
  tours: Tour[];
  addTour: (
    property: TourProperty,
    status: TourStatus,
    date?: string,
    time?: string,
  ) => void;
  updateTour: (tourId: string, partial: Partial<Tour>) => void;
  updateNote: (tourId: string, note: TourNote) => void;
  removeTour: (tourId: string) => void;
  getTourByPropertyId: (propertyId: string) => Tour | undefined;
}

const ToursContext = createContext<ToursContextValue | null>(null);

export function ToursProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tours, setTours] = useState<Tour[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const toursRef = useRef(tours);
  toursRef.current = tours;
  const lastSyncedToursJson = useRef<string | null>(null);
  const syncMutateRef = useRef<
    (opts: { body: ToursStatePayload }) => void
  >(() => {});

  const syncMutation = useMutation({
    ...syncToursPortalToursPutMutation(),
    onSuccess: (data) => {
      skipSave.current = true;
      const next = toursFromApi(data);
      setTours(next);
      lastSyncedToursJson.current = toursSyncFingerprint(next);
      queryClient.setQueryData(readToursPortalToursGetQueryKey({}), data);
    },
  });
  syncMutateRef.current = syncMutation.mutate;

  const { data: serverTours } = useQuery({
    ...readToursPortalToursGetOptions({}),
    enabled: Boolean(user),
    queryKey: readToursPortalToursGetQueryKey({}),
  });

  useEffect(() => {
    if (user) {
      setHydrated(true);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTours(JSON.parse(stored) as Tour[]);
      } else {
        setTours(SEED_TOURS);
      }
    } catch {
      setTours(SEED_TOURS);
    }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || serverTours === undefined) return;
    skipSave.current = true;
    const next = toursFromApi(serverTours);
    setTours(next);
    lastSyncedToursJson.current = toursSyncFingerprint(next);
  }, [user, serverTours]);

  useEffect(() => {
    if (!hydrated || user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
  }, [tours, hydrated, user]);

  useEffect(() => {
    if (!user || !hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const list = toursRef.current;
      const body = toursToApiPayload(list) as unknown as ToursStatePayload;
      const fp = JSON.stringify(body);
      if (fp === lastSyncedToursJson.current) return;
      syncMutateRef.current({ body });
    }, 600);
    return () => window.clearTimeout(debounceRef.current);
  }, [tours, user, hydrated]);

  const addTour = useCallback(
    (
      property: TourProperty,
      status: TourStatus,
      date?: string,
      time?: string,
    ) => {
      const newTour: Tour = {
        id: typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `tour-${Date.now()}`,
        property,
        status,
        scheduledDate: date ?? "",
        scheduledTime: time ?? "",
        note: null,
        createdAt: new Date().toISOString(),
      };
      setTours((prev) => [newTour, ...prev]);
    },
    [],
  );

  const updateTour = useCallback(
    (tourId: string, partial: Partial<Tour>) => {
      setTours((prev) =>
        prev.map((t) => (t.id === tourId ? { ...t, ...partial } : t)),
      );
    },
    [],
  );

  const updateNote = useCallback((tourId: string, note: TourNote) => {
    setTours((prev) =>
      prev.map((t) =>
        t.id === tourId
          ? { ...t, note: { ...note, updatedAt: new Date().toISOString() } }
          : t,
      ),
    );
  }, []);

  const removeTour = useCallback((tourId: string) => {
    setTours((prev) => prev.filter((t) => t.id !== tourId));
  }, []);

  const getTourByPropertyId = useCallback(
    (propertyId: string) => tours.find((t) => t.property.id === propertyId),
    [tours],
  );

  if (!hydrated) return null;

  return (
    <ToursContext.Provider
      value={{ tours, addTour, updateTour, updateNote, removeTour, getTourByPropertyId }}
    >
      {children}
    </ToursContext.Provider>
  );
}

export function useTours() {
  const ctx = useContext(ToursContext);
  if (!ctx) throw new Error("useTours must be used within ToursProvider");
  return ctx;
}
