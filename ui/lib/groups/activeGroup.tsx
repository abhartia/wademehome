"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "wdmh.activeGroupId";

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

function writeStored(value: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, value);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota */
  }
}

type ActiveGroupContextValue = {
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
};

const ActiveGroupContext = createContext<ActiveGroupContextValue | null>(null);

export function ActiveGroupProvider({ children }: { children: React.ReactNode }) {
  const [storedId, setStoredId] = useState<string | null>(null);

  useEffect(() => {
    setStoredId(readStored());
  }, []);

  const setActiveGroupId = useCallback((id: string | null) => {
    writeStored(id);
    setStoredId(id);
  }, []);

  const value = useMemo(
    () => ({ activeGroupId: storedId, setActiveGroupId }),
    [storedId, setActiveGroupId],
  );

  return (
    <ActiveGroupContext.Provider value={value}>
      {children}
    </ActiveGroupContext.Provider>
  );
}

export function useActiveGroup(): ActiveGroupContextValue {
  const ctx = useContext(ActiveGroupContext);
  if (!ctx) {
    throw new Error("useActiveGroup must be used within ActiveGroupProvider");
  }
  return ctx;
}

/**
 * Reads the active group id, preferring `?g=` URL param when present so shared
 * links override persisted state without writing to localStorage.
 */
export function useActiveGroupId(): string | null {
  const { activeGroupId } = useActiveGroup();
  const searchParams = useSearchParams();
  const fromUrl = searchParams?.get("g") ?? null;
  return fromUrl && fromUrl.length > 0 ? fromUrl : activeGroupId;
}
