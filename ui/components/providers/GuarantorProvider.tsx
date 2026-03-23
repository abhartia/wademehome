"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GuarantorRequest,
  GuarantorRequestStatus,
  LeaseInfo,
  SavedGuarantor,
} from "@/lib/types/guarantor";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createGuarantorRequestRouteGuarantorsRequestsPostMutation,
  createSavedGuarantorRouteGuarantorsPostMutation,
  deleteGuarantorRequestRouteGuarantorsRequestsRequestIdDeleteMutation,
  deleteSavedGuarantorRouteGuarantorsGuarantorIdDeleteMutation,
  patchGuarantorRequestRouteGuarantorsRequestsRequestIdPatchMutation,
  patchSavedGuarantorRouteGuarantorsGuarantorIdPatchMutation,
  readGuarantorRequestsGuarantorsRequestsGetOptions,
  readGuarantorRequestsGuarantorsRequestsGetQueryKey,
  readSavedGuarantorsGuarantorsGetOptions,
  readSavedGuarantorsGuarantorsGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";

interface GuarantorContextValue {
  savedGuarantors: SavedGuarantor[];
  addGuarantor: (
    info: Omit<SavedGuarantor, "id" | "createdAt">,
  ) => Promise<string>;
  updateGuarantor: (id: string, partial: Partial<SavedGuarantor>) => Promise<void>;
  removeGuarantor: (id: string) => Promise<void>;

  requests: GuarantorRequest[];
  addRequest: (guarantorId: string, lease: LeaseInfo) => Promise<string>;
  sendRequest: (requestId: string) => Promise<void>;
  updateRequest: (requestId: string, partial: Partial<GuarantorRequest>) => Promise<void>;
  removeRequest: (requestId: string) => Promise<void>;
  simulateGuarantorAction: (requestId: string) => Promise<void>;
}

const GuarantorContext = createContext<GuarantorContextValue | null>(null);

export function GuarantorProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: savedData } = useQuery({
    ...readSavedGuarantorsGuarantorsGetOptions({}),
    enabled: Boolean(user),
    queryKey: readSavedGuarantorsGuarantorsGetQueryKey({}),
  });
  const { data: requestsData } = useQuery({
    ...readGuarantorRequestsGuarantorsRequestsGetOptions({}),
    enabled: Boolean(user),
    queryKey: readGuarantorRequestsGuarantorsRequestsGetQueryKey({}),
  });

  const savedGuarantors = useMemo<SavedGuarantor[]>(
    () =>
      (savedData?.saved_guarantors ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        email: g.email,
        phone: g.phone,
        relationship: g.relationship as SavedGuarantor["relationship"],
        createdAt: g.created_at,
      })),
    [savedData],
  );
  const requests = useMemo<GuarantorRequest[]>(
    () =>
      (requestsData?.requests ?? []).map((r) => ({
        id: r.id,
        guarantorId: r.guarantor_id,
        guarantorSnapshot: {
          name: r.guarantor_snapshot?.name ?? "",
          email: r.guarantor_snapshot?.email ?? "",
        },
        lease: {
          propertyName: r.lease.property_name,
          propertyAddress: r.lease.property_address,
          monthlyRent: r.lease.monthly_rent,
          leaseStart: r.lease.lease_start ?? "",
          leaseTerm: r.lease.lease_term ?? "",
        },
        status: r.status as GuarantorRequestStatus,
        verificationStatus: r.verification_status as GuarantorRequest["verificationStatus"],
        createdAt: r.created_at ?? "",
        sentAt: r.sent_at ?? "",
        viewedAt: r.viewed_at ?? "",
        signedAt: r.signed_at ?? "",
        expiresAt: r.expires_at ?? "",
        statusHistory: (r.status_history ?? []).map((h) => ({
          status: h.status,
          timestamp: h.timestamp,
          note: h.note ?? "",
        })),
      })),
    [requestsData],
  );

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: readSavedGuarantorsGuarantorsGetQueryKey({}),
      }),
      queryClient.invalidateQueries({
        queryKey: readGuarantorRequestsGuarantorsRequestsGetQueryKey({}),
      }),
    ]);
  }, [queryClient]);

  const createGuarantorMut = useMutation({
    ...createSavedGuarantorRouteGuarantorsPostMutation(),
    onSuccess: refresh,
  });
  const patchGuarantorMut = useMutation({
    ...patchSavedGuarantorRouteGuarantorsGuarantorIdPatchMutation(),
    onSuccess: refresh,
  });
  const deleteGuarantorMut = useMutation({
    ...deleteSavedGuarantorRouteGuarantorsGuarantorIdDeleteMutation(),
    onSuccess: refresh,
  });
  const createRequestMut = useMutation({
    ...createGuarantorRequestRouteGuarantorsRequestsPostMutation(),
    onSuccess: refresh,
  });
  const patchRequestMut = useMutation({
    ...patchGuarantorRequestRouteGuarantorsRequestsRequestIdPatchMutation(),
    onSuccess: refresh,
  });
  const deleteRequestMut = useMutation({
    ...deleteGuarantorRequestRouteGuarantorsRequestsRequestIdDeleteMutation(),
    onSuccess: refresh,
  });

  const addGuarantor = useCallback(
    async (info: Omit<SavedGuarantor, "id" | "createdAt">) => {
      if (!user) return "";
      const out = await createGuarantorMut.mutateAsync({
        body: {
          name: info.name,
          email: info.email,
          phone: info.phone,
          relationship: info.relationship,
        },
      });
      return out.id;
    },
    [createGuarantorMut, user],
  );

  const updateGuarantor = useCallback(
    async (id: string, partial: Partial<SavedGuarantor>) => {
      if (!user) return;
      await patchGuarantorMut.mutateAsync({
        path: { guarantor_id: id },
        body: {
          name: partial.name,
          email: partial.email,
          phone: partial.phone,
          relationship: partial.relationship,
        },
      });
    },
    [patchGuarantorMut, user],
  );

  const removeGuarantor = useCallback(async (id: string) => {
    if (!user) return;
    await deleteGuarantorMut.mutateAsync({ path: { guarantor_id: id } });
  }, [deleteGuarantorMut, user]);

  const addRequest = useCallback(
    async (guarantorId: string, lease: LeaseInfo): Promise<string> => {
      if (!user) return "";
      const out = await createRequestMut.mutateAsync({
        body: {
          guarantor_id: guarantorId,
          lease: {
            property_name: lease.propertyName,
            property_address: lease.propertyAddress,
            monthly_rent: lease.monthlyRent,
            lease_start: lease.leaseStart,
            lease_term: lease.leaseTerm,
          },
        },
      });
      return out.id;
    },
    [createRequestMut, user],
  );

  const sendRequest = useCallback(async (requestId: string) => {
    if (!user) return;
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await patchRequestMut.mutateAsync({
      path: { request_id: requestId },
      body: {
        status: "sent",
        sent_at: now,
        expires_at: expires,
        status_note: "Sent to guarantor",
      },
    });
  }, [patchRequestMut, user]);

  const updateRequest = useCallback(
    async (requestId: string, partial: Partial<GuarantorRequest>) => {
      if (!user) return;
      await patchRequestMut.mutateAsync({
        path: { request_id: requestId },
        body: {
          status: partial.status,
          verification_status: partial.verificationStatus,
          lease: partial.lease
            ? {
              property_name: partial.lease.propertyName,
              property_address: partial.lease.propertyAddress,
              monthly_rent: partial.lease.monthlyRent,
              lease_start: partial.lease.leaseStart,
              lease_term: partial.lease.leaseTerm,
            }
            : undefined,
          status_note: "Updated by renter",
        },
      });
    },
    [patchRequestMut, user],
  );

  const removeRequest = useCallback(async (requestId: string) => {
    if (!user) return;
    await deleteRequestMut.mutateAsync({ path: { request_id: requestId } });
  }, [deleteRequestMut, user]);

  const simulateGuarantorAction = useCallback(async (requestId: string) => {
    if (!user) return;
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;
    const now = new Date().toISOString();
    if (req.status === "sent") {
      await patchRequestMut.mutateAsync({
        path: { request_id: requestId },
        body: { status: "viewed", viewed_at: now, status_note: "Opened by guarantor" },
      });
      return;
    }
    if (req.status === "viewed") {
      await patchRequestMut.mutateAsync({
        path: { request_id: requestId },
        body: {
          status: "signed",
          verification_status: "verified",
          signed_at: now,
          status_note: "Agreement signed",
        },
      });
    }
  }, [patchRequestMut, requests, user]);

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
