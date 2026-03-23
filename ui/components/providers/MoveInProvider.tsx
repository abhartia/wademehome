"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChecklistItem,
  MoveInPlan,
  VendorCategory,
  VendorOrder,
} from "@/lib/types/movein";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createMoveInChecklistItemMoveInChecklistPostMutation,
  createMoveInOrderMoveInOrdersPostMutation,
  deleteMoveInOrderMoveInOrdersOrderIdDeleteMutation,
  patchMoveInChecklistItemMoveInChecklistItemIdPatchMutation,
  patchMoveInOrderMoveInOrdersOrderIdPatchMutation,
  patchMoveInPlanMoveInPlanPatchMutation,
  readMoveInChecklistMoveInChecklistGetOptions,
  readMoveInChecklistMoveInChecklistGetQueryKey,
  readMoveInOrdersMoveInOrdersGetOptions,
  readMoveInOrdersMoveInOrdersGetQueryKey,
  readMoveInPlanMoveInPlanGetOptions,
  readMoveInPlanMoveInPlanGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";

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
  const { data: planData } = useQuery({
    ...readMoveInPlanMoveInPlanGetOptions({}),
    enabled: Boolean(user),
    queryKey: readMoveInPlanMoveInPlanGetQueryKey({}),
  });
  const { data: ordersData } = useQuery({
    ...readMoveInOrdersMoveInOrdersGetOptions({}),
    enabled: Boolean(user),
    queryKey: readMoveInOrdersMoveInOrdersGetQueryKey({}),
  });
  const { data: checklistData } = useQuery({
    ...readMoveInChecklistMoveInChecklistGetOptions({}),
    enabled: Boolean(user),
    queryKey: readMoveInChecklistMoveInChecklistGetQueryKey({}),
  });

  const plan = useMemo<MoveInPlan>(
    () => ({
      targetAddress: planData?.target_address ?? "",
      moveDate: planData?.move_date ?? "",
      moveFromAddress: planData?.move_from_address ?? "",
    }),
    [planData],
  );
  const orders = useMemo<VendorOrder[]>(
    () =>
      (ordersData?.orders ?? []).map((o) => ({
        id: o.id,
        vendorId: o.vendor_id ?? "",
        vendorName: o.vendor_name ?? "",
        planId: o.plan_id ?? "",
        planName: o.plan_name ?? "",
        category: o.category as VendorOrder["category"],
        status: o.status as VendorOrder["status"],
        scheduledDate: o.scheduled_date ?? "",
        accountNumber: o.account_number ?? "",
        notes: o.notes ?? "",
        monthlyCost: o.monthly_cost ?? "",
        createdAt: o.created_at ?? "",
      })),
    [ordersData],
  );
  const checklist = useMemo<ChecklistItem[]>(
    () =>
      (checklistData?.checklist ?? []).map((c) => ({
        id: c.id,
        category: c.category as ChecklistItem["category"],
        label: c.label,
        completed: c.completed,
      })),
    [checklistData],
  );

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: readMoveInPlanMoveInPlanGetQueryKey({}) }),
      queryClient.invalidateQueries({ queryKey: readMoveInOrdersMoveInOrdersGetQueryKey({}) }),
      queryClient.invalidateQueries({ queryKey: readMoveInChecklistMoveInChecklistGetQueryKey({}) }),
    ]);
  }, [queryClient]);

  const patchPlanMut = useMutation({
    ...patchMoveInPlanMoveInPlanPatchMutation(),
    onSuccess: refresh,
  });
  const createOrderMut = useMutation({
    ...createMoveInOrderMoveInOrdersPostMutation(),
    onSuccess: refresh,
  });
  const patchOrderMut = useMutation({
    ...patchMoveInOrderMoveInOrdersOrderIdPatchMutation(),
    onSuccess: refresh,
  });
  const deleteOrderMut = useMutation({
    ...deleteMoveInOrderMoveInOrdersOrderIdDeleteMutation(),
    onSuccess: refresh,
  });
  const createChecklistMut = useMutation({
    ...createMoveInChecklistItemMoveInChecklistPostMutation(),
    onSuccess: refresh,
  });
  const patchChecklistMut = useMutation({
    ...patchMoveInChecklistItemMoveInChecklistItemIdPatchMutation(),
    onSuccess: refresh,
  });

  const updatePlan = useCallback((partial: Partial<MoveInPlan>) => {
    if (!user) return;
    patchPlanMut.mutate({
      body: {
        target_address: partial.targetAddress,
        move_date: partial.moveDate,
        move_from_address: partial.moveFromAddress,
      },
    });
  }, [patchPlanMut, user]);

  const addOrder = useCallback(
    (order: Omit<VendorOrder, "id" | "createdAt">): string => {
      if (!user) return "";
      createOrderMut.mutate({
        body: {
          vendor_id: order.vendorId,
          vendor_name: order.vendorName,
          plan_id: order.planId,
          plan_name: order.planName,
          category: order.category,
          status: order.status,
          scheduled_date: order.scheduledDate,
          account_number: order.accountNumber,
          notes: order.notes,
          monthly_cost: order.monthlyCost,
        },
      });
      return crypto.randomUUID?.() ?? `ord-${Date.now()}`;
    },
    [createOrderMut, user],
  );

  const updateOrder = useCallback(
    (id: string, partial: Partial<VendorOrder>) => {
      if (!user) return;
      patchOrderMut.mutate({
        path: { order_id: id },
        body: {
          vendor_id: partial.vendorId,
          vendor_name: partial.vendorName,
          plan_id: partial.planId,
          plan_name: partial.planName,
          category: partial.category,
          status: partial.status,
          scheduled_date: partial.scheduledDate,
          account_number: partial.accountNumber,
          notes: partial.notes,
          monthly_cost: partial.monthlyCost,
        },
      });
    },
    [patchOrderMut, user],
  );

  const removeOrder = useCallback((id: string) => {
    if (!user) return;
    deleteOrderMut.mutate({ path: { order_id: id } });
  }, [deleteOrderMut, user]);

  const getOrderByCategory = useCallback(
    (cat: VendorCategory) =>
      orders.find((o) => o.category === cat && o.status !== "cancelled"),
    [orders],
  );

  const toggleChecklistItem = useCallback((id: string) => {
    if (!user) return;
    const item = checklist.find((c) => c.id === id);
    if (!item) return;
    patchChecklistMut.mutate({
      path: { item_id: id },
      body: { completed: !item.completed },
    });
  }, [checklist, patchChecklistMut, user]);

  const resetChecklist = useCallback(() => {
    if (!user) return;
    checklist.forEach((item) => {
      if (item.completed) {
        patchChecklistMut.mutate({
          path: { item_id: item.id },
          body: { completed: false },
        });
      }
    });
    if (checklist.length === 0) {
      createChecklistMut.mutate({
        body: { category: "pre-move", label: "Set up electricity", completed: false },
      });
    }
  }, [checklist, createChecklistMut, patchChecklistMut, user]);

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
