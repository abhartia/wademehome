"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Tour, TourNote, TourProperty, TourStatus } from "@/lib/types/tours";
import { SEED_TOURS } from "@/lib/mock/tours";

const STORAGE_KEY = "brightplace_tours";

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
  const [tours, setTours] = useState<Tour[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Tour[] = JSON.parse(stored);
        setTours(parsed);
      } else {
        setTours(SEED_TOURS);
      }
    } catch {
      setTours(SEED_TOURS);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
    }
  }, [tours, hydrated]);

  const addTour = useCallback(
    (
      property: TourProperty,
      status: TourStatus,
      date?: string,
      time?: string,
    ) => {
      const newTour: Tour = {
        id: `tour-${Date.now()}`,
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
