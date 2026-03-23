"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { landlordRequest } from "@/lib/api/landlordClient";
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
  createProperty: (payload: Record<string, unknown>) => Promise<void>;
  updateProperty: (propertyId: string, payload: Record<string, unknown>) => Promise<void>;
  publishProperty: (propertyId: string, publish: boolean) => Promise<void>;
  createUnit: (propertyId: string, payload: Record<string, unknown>) => Promise<void>;
  createLead: (payload: Record<string, unknown>) => Promise<void>;
  updateLead: (leadId: string, payload: Record<string, unknown>) => Promise<void>;
  createSlot: (payload: Record<string, unknown>) => Promise<void>;
  createBooking: (payload: Record<string, unknown>) => Promise<void>;
  updateBooking: (bookingId: string, payload: Record<string, unknown>) => Promise<void>;
  createApplication: (payload: Record<string, unknown>) => Promise<void>;
  updateApplication: (applicationId: string, payload: Record<string, unknown>) => Promise<void>;
  createLeaseOffer: (payload: Record<string, unknown>) => Promise<void>;
  leaseOfferAction: (leaseOfferId: string, action: string) => Promise<void>;
};

const LandlordContext = createContext<LandlordContextValue | null>(null);

const keys = {
  profile: ["landlord", "profile"] as const,
  properties: ["landlord", "properties"] as const,
  leads: ["landlord", "leads"] as const,
  slots: ["landlord", "tour-slots"] as const,
  bookings: ["landlord", "tour-bookings"] as const,
  applications: ["landlord", "applications"] as const,
  leaseOffers: ["landlord", "lease-offers"] as const,
};

export function LandlordProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: profileResponse } = useQuery({
    queryKey: keys.profile,
    queryFn: () => landlordRequest<{ profile: LandlordProfile }>("/landlord/profile"),
  });
  const { data: propertiesResponse } = useQuery({
    queryKey: keys.properties,
    queryFn: () =>
      landlordRequest<{ properties: LandlordProperty[] }>("/landlord/properties"),
  });
  const { data: leadsResponse } = useQuery({
    queryKey: keys.leads,
    queryFn: () => landlordRequest<{ leads: LandlordLead[] }>("/landlord/leads"),
  });
  const { data: slotsResponse } = useQuery({
    queryKey: keys.slots,
    queryFn: () => landlordRequest<{ slots: LandlordTourSlot[] }>("/landlord/tours/slots"),
  });
  const { data: bookingsResponse } = useQuery({
    queryKey: keys.bookings,
    queryFn: () =>
      landlordRequest<{ bookings: LandlordTourBooking[] }>("/landlord/tours/bookings"),
  });
  const { data: applicationsResponse } = useQuery({
    queryKey: keys.applications,
    queryFn: () =>
      landlordRequest<{ applications: LandlordApplication[] }>("/landlord/applications"),
  });
  const { data: leaseOffersResponse } = useQuery({
    queryKey: keys.leaseOffers,
    queryFn: () =>
      landlordRequest<{ lease_offers: LandlordLeaseOffer[] }>("/landlord/lease-offers"),
  });

  const refreshAll = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: keys.profile }),
      queryClient.invalidateQueries({ queryKey: keys.properties }),
      queryClient.invalidateQueries({ queryKey: keys.leads }),
      queryClient.invalidateQueries({ queryKey: keys.slots }),
      queryClient.invalidateQueries({ queryKey: keys.bookings }),
      queryClient.invalidateQueries({ queryKey: keys.applications }),
      queryClient.invalidateQueries({ queryKey: keys.leaseOffers }),
    ]);
  }, [queryClient]);

  const createPropertyMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/properties", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const updatePropertyMutation = useMutation({
    mutationFn: ({ propertyId, payload }: { propertyId: string; payload: Record<string, unknown> }) =>
      landlordRequest(`/landlord/properties/${propertyId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const publishPropertyMutation = useMutation({
    mutationFn: ({ propertyId, publish }: { propertyId: string; publish: boolean }) =>
      landlordRequest(`/landlord/properties/${propertyId}/${publish ? "publish" : "unpublish"}`, {
        method: "POST",
      }),
    onSuccess: refreshAll,
  });
  const createUnitMutation = useMutation({
    mutationFn: ({ propertyId, payload }: { propertyId: string; payload: Record<string, unknown> }) =>
      landlordRequest(`/landlord/properties/${propertyId}/units`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const createLeadMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/leads", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: refreshAll,
  });
  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, payload }: { leadId: string; payload: Record<string, unknown> }) =>
      landlordRequest(`/landlord/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const createSlotMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/tours/slots", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const createBookingMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/tours/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const updateBookingMutation = useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: Record<string, unknown> }) =>
      landlordRequest(`/landlord/tours/bookings/${bookingId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const createApplicationMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const updateApplicationMutation = useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: Record<string, unknown>;
    }) =>
      landlordRequest(`/landlord/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const createLeaseOfferMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      landlordRequest("/landlord/lease-offers", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: refreshAll,
  });
  const leaseOfferActionMutation = useMutation({
    mutationFn: ({ leaseOfferId, action }: { leaseOfferId: string; action: string }) =>
      landlordRequest(`/landlord/lease-offers/${leaseOfferId}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      }),
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
      createProperty: async (payload) => createPropertyMutation.mutateAsync(payload),
      updateProperty: async (propertyId, payload) =>
        updatePropertyMutation.mutateAsync({ propertyId, payload }),
      publishProperty: async (propertyId, publish) =>
        publishPropertyMutation.mutateAsync({ propertyId, publish }),
      createUnit: async (propertyId, payload) => createUnitMutation.mutateAsync({ propertyId, payload }),
      createLead: async (payload) => createLeadMutation.mutateAsync(payload),
      updateLead: async (leadId, payload) => updateLeadMutation.mutateAsync({ leadId, payload }),
      createSlot: async (payload) => createSlotMutation.mutateAsync(payload),
      createBooking: async (payload) => createBookingMutation.mutateAsync(payload),
      updateBooking: async (bookingId, payload) =>
        updateBookingMutation.mutateAsync({ bookingId, payload }),
      createApplication: async (payload) => createApplicationMutation.mutateAsync(payload),
      updateApplication: async (applicationId, payload) =>
        updateApplicationMutation.mutateAsync({ applicationId, payload }),
      createLeaseOffer: async (payload) => createLeaseOfferMutation.mutateAsync(payload),
      leaseOfferAction: async (leaseOfferId, action) =>
        leaseOfferActionMutation.mutateAsync({ leaseOfferId, action }),
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
      publishPropertyMutation,
      propertiesResponse?.properties,
      refreshAll,
      slotsResponse?.slots,
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
