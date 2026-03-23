"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tour, TourNote, TourProperty, TourStatus } from "@/lib/types/tours";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createTourRouteToursPostMutation,
  deleteTourRouteToursTourIdDeleteMutation,
  readToursToursGetOptions,
  readToursToursGetQueryKey,
  updateTourRouteToursTourIdPatchMutation,
  upsertTourNoteRouteToursTourIdNotePutMutation,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import { toursFromApi } from "@/lib/api/portalMappers";

interface ToursContextValue {
  tours: Tour[];
  isReadOnly: boolean;
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

  const { data: serverTours } = useQuery({
    ...readToursToursGetOptions({
      query: { limit: 200, offset: 0, sort: "created_at_desc" },
    }),
    enabled: Boolean(user),
    queryKey: readToursToursGetQueryKey({
      query: { limit: 200, offset: 0, sort: "created_at_desc" },
    }),
  });
  const tours = useMemo(() => (user ? toursFromApi(serverTours) : []), [serverTours, user]);
  const isReadOnly = !user;

  const refreshTours = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: readToursToursGetQueryKey({
        query: { limit: 200, offset: 0, sort: "created_at_desc" },
      }),
    });
  }, [queryClient]);

  const createTourMutation = useMutation({
    ...createTourRouteToursPostMutation(),
    onSuccess: refreshTours,
  });
  const updateTourMutation = useMutation({
    ...updateTourRouteToursTourIdPatchMutation(),
    onSuccess: refreshTours,
  });
  const deleteTourMutation = useMutation({
    ...deleteTourRouteToursTourIdDeleteMutation(),
    onSuccess: refreshTours,
  });
  const upsertNoteMutation = useMutation({
    ...upsertTourNoteRouteToursTourIdNotePutMutation(),
    onSuccess: refreshTours,
  });

  const addTour = useCallback(
    (
      property: TourProperty,
      status: TourStatus,
      date?: string,
      time?: string,
    ) => {
      if (!user) return;
      createTourMutation.mutate({
        body: {
          property: {
            id: property.id,
            name: property.name,
            address: property.address,
            rent: property.rent,
            beds: property.beds,
            image: property.image,
            tags: property.tags,
          },
          status,
          scheduled_date: date ?? "",
          scheduled_time: time ?? "",
          note: null,
        },
      });
    },
    [createTourMutation, user],
  );

  const updateTour = useCallback(
    (tourId: string, partial: Partial<Tour>) => {
      if (!user) return;
      updateTourMutation.mutate({
        path: { tour_id: tourId },
        body: {
          status: partial.status,
          scheduled_date: partial.scheduledDate,
          scheduled_time: partial.scheduledTime,
          property: partial.property
            ? {
              id: partial.property.id,
              name: partial.property.name,
              address: partial.property.address,
              rent: partial.property.rent,
              beds: partial.property.beds,
              image: partial.property.image,
              tags: partial.property.tags,
            }
            : undefined,
        },
      });
    },
    [updateTourMutation, user],
  );

  const updateNote = useCallback((tourId: string, note: TourNote) => {
    if (!user) return;
    upsertNoteMutation.mutate({
      path: { tour_id: tourId },
      body: {
        note: {
          ratings: {
            overall: note.ratings.overall,
            cleanliness: note.ratings.cleanliness,
            naturalLight: note.ratings.naturalLight,
            noiseLevel: note.ratings.noiseLevel,
            condition: note.ratings.condition,
          },
          pros: note.pros,
          cons: note.cons,
          general_notes: note.generalNotes,
          would_apply: note.wouldApply,
          photo_checklist: note.photoChecklist,
          updated_at: note.updatedAt,
        },
      },
    });
  }, [upsertNoteMutation, user]);

  const removeTour = useCallback((tourId: string) => {
    if (!user) return;
    deleteTourMutation.mutate({ path: { tour_id: tourId } });
  }, [deleteTourMutation, user]);

  const getTourByPropertyId = useCallback(
    (propertyId: string) => tours.find((t) => t.property.id === propertyId),
    [tours],
  );

  return (
    <ToursContext.Provider
      value={{
        tours,
        isReadOnly,
        addTour,
        updateTour,
        updateNote,
        removeTour,
        getTourByPropertyId,
      }}
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
