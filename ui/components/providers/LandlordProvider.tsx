"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/providers/AuthProvider";
import type {
  LandlordApplicationCreate,
  LandlordApplicationUpdate,
  LandlordLeaseOfferAction,
  LandlordLeaseOfferCreate,
  LandlordLeadCreate,
  LandlordLeadUpdate,
  LandlordPropertyCreate,
  LandlordPropertyUpdate,
  LandlordTourBookingCreate,
  LandlordTourBookingUpdate,
  LandlordTourSlotCreate,
  LandlordUnitCreate,
} from "@/lib/api/generated/types.gen";
import {
  createApplicationRouteLandlordApplicationsPostMutation,
  createLeadRouteLandlordLeadsPostMutation,
  createLeaseOfferRouteLandlordLeaseOffersPostMutation,
  createPropertyRouteLandlordPropertiesPostMutation,
  createTourBookingRouteLandlordToursBookingsPostMutation,
  createTourSlotRouteLandlordToursSlotsPostMutation,
  createUnitRouteLandlordPropertiesPropertyIdUnitsPostMutation,
  patchApplicationLandlordApplicationsApplicationIdPatchMutation,
  patchLeadLandlordLeadsLeadIdPatchMutation,
  patchLeaseOfferActionLandlordLeaseOffersLeaseOfferIdPatchMutation,
  patchPropertyLandlordPropertiesPropertyIdPatchMutation,
  patchTourBookingLandlordToursBookingsBookingIdPatchMutation,
  publishPropertyLandlordPropertiesPropertyIdPublishPostMutation,
  readApplicationsLandlordApplicationsGetOptions,
  readLeaseOffersLandlordLeaseOffersGetOptions,
  readLeadsLandlordLeadsGetOptions,
  readProfileLandlordProfileGetOptions,
  readPropertiesLandlordPropertiesGetOptions,
  readTourBookingsLandlordToursBookingsGetOptions,
  readTourSlotsLandlordToursSlotsGetOptions,
  unpublishPropertyLandlordPropertiesPropertyIdUnpublishPostMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type {
  LandlordApplication,
  LandlordLead,
  LandlordLeaseOffer,
  LandlordProfile,
  LandlordProperty,
  LandlordTourBooking,
  LandlordTourSlot,
} from "@/lib/types/landlord";

type LandlordContextValue = {
  profile: LandlordProfile | null;
  properties: LandlordProperty[];
  leads: LandlordLead[];
  slots: LandlordTourSlot[];
  bookings: LandlordTourBooking[];
  applications: LandlordApplication[];
  leaseOffers: LandlordLeaseOffer[];
  refreshAll: () => Promise<void>;
  createProperty: (payload: LandlordPropertyCreate) => Promise<void>;
  updateProperty: (propertyId: string, payload: LandlordPropertyUpdate) => Promise<void>;
  publishProperty: (propertyId: string, publish: boolean) => Promise<void>;
  createUnit: (propertyId: string, payload: LandlordUnitCreate) => Promise<void>;
  createLead: (payload: LandlordLeadCreate) => Promise<void>;
  updateLead: (leadId: string, payload: LandlordLeadUpdate) => Promise<void>;
  createSlot: (payload: LandlordTourSlotCreate) => Promise<void>;
  createBooking: (payload: LandlordTourBookingCreate) => Promise<void>;
  updateBooking: (bookingId: string, payload: LandlordTourBookingUpdate) => Promise<void>;
  createApplication: (payload: LandlordApplicationCreate) => Promise<void>;
  updateApplication: (applicationId: string, payload: LandlordApplicationUpdate) => Promise<void>;
  createLeaseOffer: (payload: LandlordLeaseOfferCreate) => Promise<void>;
  leaseOfferAction: (leaseOfferId: string, action: LandlordLeaseOfferAction["action"]) => Promise<void>;
};

const LandlordContext = createContext<LandlordContextValue | null>(null);

function isLandlordQueryKey(queryKey: readonly unknown[]): boolean {
  const head = queryKey[0];
  if (!head || typeof head !== "object") return false;
  const id = (head as { _id?: string })._id;
  return typeof id === "string" && id.includes("Landlord");
}

export function LandlordProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const role = typeof user?.role === "string" ? user.role.trim().toLowerCase() : "";
  const enabled = Boolean(user) && (role === "landlord" || role === "admin");

  const { data: profileResponse } = useQuery({
    ...readProfileLandlordProfileGetOptions({}),
    enabled,
  });
  const { data: propertiesResponse } = useQuery({
    ...readPropertiesLandlordPropertiesGetOptions({}),
    enabled,
  });
  const { data: leadsResponse } = useQuery({
    ...readLeadsLandlordLeadsGetOptions({}),
    enabled,
  });
  const { data: slotsResponse } = useQuery({
    ...readTourSlotsLandlordToursSlotsGetOptions({}),
    enabled,
  });
  const { data: bookingsResponse } = useQuery({
    ...readTourBookingsLandlordToursBookingsGetOptions({}),
    enabled,
  });
  const { data: applicationsResponse } = useQuery({
    ...readApplicationsLandlordApplicationsGetOptions({}),
    enabled,
  });
  const { data: leaseOffersResponse } = useQuery({
    ...readLeaseOffersLandlordLeaseOffersGetOptions({}),
    enabled,
  });

  const refreshAll = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: (q) => isLandlordQueryKey(q.queryKey),
    });
  }, [queryClient]);

  const createPropertyMutation = useMutation({
    ...createPropertyRouteLandlordPropertiesPostMutation(),
    onSuccess: refreshAll,
  });
  const updatePropertyMutation = useMutation({
    ...patchPropertyLandlordPropertiesPropertyIdPatchMutation(),
    onSuccess: refreshAll,
  });
  const publishPropertyMutation = useMutation({
    ...publishPropertyLandlordPropertiesPropertyIdPublishPostMutation(),
    onSuccess: refreshAll,
  });
  const unpublishPropertyMutation = useMutation({
    ...unpublishPropertyLandlordPropertiesPropertyIdUnpublishPostMutation(),
    onSuccess: refreshAll,
  });
  const createUnitMutation = useMutation({
    ...createUnitRouteLandlordPropertiesPropertyIdUnitsPostMutation(),
    onSuccess: refreshAll,
  });
  const createLeadMutation = useMutation({
    ...createLeadRouteLandlordLeadsPostMutation(),
    onSuccess: refreshAll,
  });
  const updateLeadMutation = useMutation({
    ...patchLeadLandlordLeadsLeadIdPatchMutation(),
    onSuccess: refreshAll,
  });
  const createSlotMutation = useMutation({
    ...createTourSlotRouteLandlordToursSlotsPostMutation(),
    onSuccess: refreshAll,
  });
  const createBookingMutation = useMutation({
    ...createTourBookingRouteLandlordToursBookingsPostMutation(),
    onSuccess: refreshAll,
  });
  const updateBookingMutation = useMutation({
    ...patchTourBookingLandlordToursBookingsBookingIdPatchMutation(),
    onSuccess: refreshAll,
  });
  const createApplicationMutation = useMutation({
    ...createApplicationRouteLandlordApplicationsPostMutation(),
    onSuccess: refreshAll,
  });
  const updateApplicationMutation = useMutation({
    ...patchApplicationLandlordApplicationsApplicationIdPatchMutation(),
    onSuccess: refreshAll,
  });
  const createLeaseOfferMutation = useMutation({
    ...createLeaseOfferRouteLandlordLeaseOffersPostMutation(),
    onSuccess: refreshAll,
  });
  const leaseOfferActionMutation = useMutation({
    ...patchLeaseOfferActionLandlordLeaseOffersLeaseOfferIdPatchMutation(),
    onSuccess: refreshAll,
  });

  const value = useMemo<LandlordContextValue>(
    () => ({
      profile: profileResponse?.profile ?? null,
      properties: propertiesResponse?.properties ?? [],
      leads: leadsResponse?.leads ?? [],
      slots: slotsResponse?.slots ?? [],
      bookings: bookingsResponse?.bookings ?? [],
      applications: applicationsResponse?.applications ?? [],
      leaseOffers: leaseOffersResponse?.lease_offers ?? [],
      refreshAll,
      createProperty: async (body) => {
        await createPropertyMutation.mutateAsync({ body });
      },
      updateProperty: async (propertyId, body) => {
        await updatePropertyMutation.mutateAsync({ path: { property_id: propertyId }, body });
      },
      publishProperty: async (propertyId, publish) => {
        if (publish) {
          await publishPropertyMutation.mutateAsync({ path: { property_id: propertyId } });
        } else {
          await unpublishPropertyMutation.mutateAsync({ path: { property_id: propertyId } });
        }
      },
      createUnit: async (propertyId, body) => {
        await createUnitMutation.mutateAsync({ path: { property_id: propertyId }, body });
      },
      createLead: async (body) => {
        await createLeadMutation.mutateAsync({ body });
      },
      updateLead: async (leadId, body) => {
        await updateLeadMutation.mutateAsync({ path: { lead_id: leadId }, body });
      },
      createSlot: async (body) => {
        await createSlotMutation.mutateAsync({ body });
      },
      createBooking: async (body) => {
        await createBookingMutation.mutateAsync({ body });
      },
      updateBooking: async (bookingId, body) => {
        await updateBookingMutation.mutateAsync({ path: { booking_id: bookingId }, body });
      },
      createApplication: async (body) => {
        await createApplicationMutation.mutateAsync({ body });
      },
      updateApplication: async (applicationId, body) => {
        await updateApplicationMutation.mutateAsync({
          path: { application_id: applicationId },
          body,
        });
      },
      createLeaseOffer: async (body) => {
        await createLeaseOfferMutation.mutateAsync({ body });
      },
      leaseOfferAction: async (leaseOfferId, action) => {
        await leaseOfferActionMutation.mutateAsync({
          path: { lease_offer_id: leaseOfferId },
          body: { action },
        });
      },
    }),
    [
      applicationsResponse?.applications,
      bookingsResponse?.bookings,
      createApplicationMutation,
      createBookingMutation,
      createLeadMutation,
      createLeaseOfferMutation,
      createPropertyMutation,
      createSlotMutation,
      createUnitMutation,
      leaseOfferActionMutation,
      leaseOffersResponse?.lease_offers,
      leadsResponse?.leads,
      profileResponse?.profile,
      propertiesResponse?.properties,
      publishPropertyMutation,
      refreshAll,
      slotsResponse?.slots,
      unpublishPropertyMutation,
      updateApplicationMutation,
      updateBookingMutation,
      updateLeadMutation,
      updatePropertyMutation,
    ],
  );

  return <LandlordContext.Provider value={value}>{children}</LandlordContext.Provider>;
}

export function useLandlord() {
  const ctx = useContext(LandlordContext);
  if (!ctx) {
    throw new Error("useLandlord must be used within LandlordProvider");
  }
  return ctx;
}
