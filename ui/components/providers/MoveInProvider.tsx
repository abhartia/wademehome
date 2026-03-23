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
  ChecklistItem,
  MoveInPlan,
  VendorCategory,
  VendorOrder,
} from "@/lib/types/movein";
import {
  SEED_PLAN,
  SEED_ORDERS,
  SEED_CHECKLIST,
} from "@/lib/mock/movein";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  readMoveInPortalMoveInGetOptions,
  readMoveInPortalMoveInGetQueryKey,
  syncMoveInPortalMoveInPutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type { MoveInStatePayload } from "@/lib/api/generated/types.gen";
import { moveInFromApi, moveInToApiPayload } from "@/lib/api/portalMappers";

const STORAGE_KEY = "wademehome_movein";

function moveInSyncFingerprint(
  plan: MoveInPlan,
  orders: VendorOrder[],
  checklist: ChecklistItem[],
): string {
  return JSON.stringify(moveInToApiPayload(plan, orders, checklist));
}

interface PersistedState {
  plan: MoveInPlan;
  orders: VendorOrder[];
  checklist: ChecklistItem[];
}

interface MoveInProgress {
  checklistDone: number;
  checklistTotal: number;
  vendorsSetUp: number;
  vendorsTotal: number;
}

interface MoveInContextValue {
  plan: MoveInPlan;
  updatePlan: (partial: Partial<MoveInPlan>) => void;

  orders: VendorOrder[];
  addOrder: (order: Omit<VendorOrder, "id" | "createdAt">) => string;
  updateOrder: (id: string, partial: Partial<VendorOrder>) => void;
  removeOrder: (id: string) => void;
  getOrderByCategory: (cat: VendorCategory) => VendorOrder | undefined;

  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  resetChecklist: () => void;

  progress: MoveInProgress;
}

const MoveInContext = createContext<MoveInContextValue | null>(null);

export function MoveInProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [plan, setPlan] = useState<MoveInPlan>(SEED_PLAN);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(false);
  const debounceRef = useRef<number | undefined>(undefined);
  const lastSyncedMoveInJson = useRef<string | null>(null);
  const planRef = useRef(plan);
  const ordersRef = useRef(orders);
  const checklistRef = useRef(checklist);
  planRef.current = plan;
  ordersRef.current = orders;
  checklistRef.current = checklist;
  const syncMutateRef = useRef<(opts: { body: MoveInStatePayload }) => void>(
    () => {},
  );

  const syncMutation = useMutation({
    ...syncMoveInPortalMoveInPutMutation(),
    onSuccess: (data) => {
      skipSave.current = true;
      const parsed = moveInFromApi(data);
      lastSyncedMoveInJson.current = moveInSyncFingerprint(
        parsed.plan,
        parsed.orders,
        parsed.checklist,
      );
      setPlan(parsed.plan);
      setOrders(parsed.orders);
      setChecklist(parsed.checklist);
      queryClient.setQueryData(readMoveInPortalMoveInGetQueryKey({}), data);
    },
  });
  syncMutateRef.current = syncMutation.mutate;

  const { data: serverState } = useQuery({
    ...readMoveInPortalMoveInGetOptions({}),
    enabled: Boolean(user),
    queryKey: readMoveInPortalMoveInGetQueryKey({}),
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
        setPlan(parsed.plan ?? SEED_PLAN);
        setOrders(parsed.orders ?? []);
        setChecklist(parsed.checklist ?? SEED_CHECKLIST);
      } else {
        setPlan(SEED_PLAN);
        setOrders(SEED_ORDERS);
        setChecklist(SEED_CHECKLIST);
      }
    } catch {
      setPlan(SEED_PLAN);
      setOrders(SEED_ORDERS);
      setChecklist(SEED_CHECKLIST);
    }
    setHydrated(true);
  }, [user]);

  useEffect(() => {
    if (!user || serverState === undefined) return;
    skipSave.current = true;
    const parsed = moveInFromApi(serverState);
    lastSyncedMoveInJson.current = moveInSyncFingerprint(
      parsed.plan,
      parsed.orders,
      parsed.checklist,
    );
    setPlan(parsed.plan);
    setOrders(parsed.orders);
    setChecklist(parsed.checklist);
  }, [user, serverState]);

  useEffect(() => {
    if (!hydrated || user) return;
    const state: PersistedState = { plan, orders, checklist };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [plan, orders, checklist, hydrated, user]);

  useEffect(() => {
    if (!user || !hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const p = planRef.current;
      const o = ordersRef.current;
      const c = checklistRef.current;
      const body = moveInToApiPayload(p, o, c) as unknown as MoveInStatePayload;
      const fp = JSON.stringify(body);
      if (fp === lastSyncedMoveInJson.current) return;
      syncMutateRef.current({ body });
    }, 600);
    return () => window.clearTimeout(debounceRef.current);
  }, [plan, orders, checklist, user, hydrated]);

  const updatePlan = useCallback((partial: Partial<MoveInPlan>) => {
    setPlan((prev) => ({ ...prev, ...partial }));
  }, []);

  const addOrder = useCallback(
    (order: Omit<VendorOrder, "id" | "createdAt">): string => {
      const id = `ord-${Date.now()}`;
      const newOrder: VendorOrder = {
        ...order,
        id,
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => {
        const filtered = prev.filter(
          (o) => o.category !== order.category || o.status === "cancelled",
        );
        return [newOrder, ...filtered];
      });
      return id;
    },
    [],
  );

  const updateOrder = useCallback(
    (id: string, partial: Partial<VendorOrder>) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...partial } : o)),
      );
    },
    [],
  );

  const removeOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const getOrderByCategory = useCallback(
    (cat: VendorCategory) =>
      orders.find((o) => o.category === cat && o.status !== "cancelled"),
    [orders],
  );

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }, []);

  const resetChecklist = useCallback(() => {
    setChecklist(SEED_CHECKLIST.map((i) => ({ ...i, completed: false })));
  }, []);

  const progress = useMemo<MoveInProgress>(() => {
    const checklistDone = checklist.filter((c) => c.completed).length;
    const categories: VendorCategory[] = [
      "electric",
      "gas",
      "internet",
      "movers",
    ];
    const vendorsSetUp = categories.filter((cat) =>
      orders.some(
        (o) =>
          o.category === cat &&
          o.status !== "cancelled" &&
          o.status !== "researching",
      ),
    ).length;
    return {
      checklistDone,
      checklistTotal: checklist.length,
      vendorsSetUp,
      vendorsTotal: 4,
    };
  }, [checklist, orders]);

  if (!hydrated) return null;

  return (
    <MoveInContext.Provider
      value={{
        plan,
        updatePlan,
        orders,
        addOrder,
        updateOrder,
        removeOrder,
        getOrderByCategory,
        checklist,
        toggleChecklistItem,
        resetChecklist,
        progress,
      }}
    >
      {children}
    </MoveInContext.Provider>
  );
}

export function useMoveIn() {
  const ctx = useContext(MoveInContext);
  if (!ctx) throw new Error("useMoveIn must be used within MoveInProvider");
  return ctx;
}
