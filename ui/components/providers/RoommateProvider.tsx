"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultMyRoommateProfile,
  MyRoommateProfile,
  RoommateConnection,
  RoommateProfile,
  RoommateMessage,
} from "@/lib/types/roommate";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  createRoommateConnectionRoommatesConnectionsPostMutation,
  createRoommateMessageRoommatesConnectionsConnectionIdMessagesPostMutation,
  deleteRoommateConnectionRoommatesConnectionsConnectionIdDeleteMutation,
  patchMyRoommateProfileRoommatesProfilePatchMutation,
  readMyRoommateProfileRoommatesProfileGetOptions,
  readMyRoommateProfileRoommatesProfileGetQueryKey,
  readRoommateConnectionsRoommatesConnectionsGetOptions,
  readRoommateConnectionsRoommatesConnectionsGetQueryKey,
} from "@/lib/api/generated/@tanstack/react-query.gen";

interface RoommateContextValue {
  myProfile: MyRoommateProfile;
  updateMyProfile: (partial: Partial<MyRoommateProfile>) => void;
  resetMyProfile: () => void;
  connections: RoommateConnection[];
  addConnection: (roommate: RoommateProfile) => void;
  removeConnection: (roommateId: string) => void;
  addMessage: (roommateId: string, message: RoommateMessage) => void;
  isConnected: (roommateId: string) => boolean;
}

const RoommateContext = createContext<RoommateContextValue | null>(null);

export function RoommateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const autoReplyTimeouts = useRef<Record<string, number>>({});
  const { data: profileData } = useQuery({
    ...readMyRoommateProfileRoommatesProfileGetOptions({}),
    enabled: Boolean(user),
    queryKey: readMyRoommateProfileRoommatesProfileGetQueryKey({}),
  });
  const { data: connectionsData } = useQuery({
    ...readRoommateConnectionsRoommatesConnectionsGetOptions({}),
    enabled: Boolean(user),
    queryKey: readRoommateConnectionsRoommatesConnectionsGetQueryKey({}),
  });

  const myProfile = useMemo<MyRoommateProfile>(
    () => ({
      name: profileData?.name ?? "",
      age: profileData?.age ?? 0,
      occupation: profileData?.occupation ?? "",
      sleepSchedule: profileData?.sleep_schedule ?? "",
      cleanlinessLevel: profileData?.cleanliness_level ?? "",
      noiseLevel: profileData?.noise_level ?? "",
      guestPolicy: profileData?.guest_policy ?? "",
      smoking: profileData?.smoking ?? "",
      languagesSpoken: profileData?.languages_spoken ?? [],
      preferredLanguages: profileData?.preferred_languages ?? [],
      mustHavePreferredLanguages:
        profileData?.must_have_preferred_languages ?? false,
      interests: profileData?.interests ?? [],
      bio: profileData?.bio ?? "",
      profileCompleted: profileData?.profile_completed ?? false,
    }),
    [profileData],
  );
  const connections = useMemo<RoommateConnection[]>(
    () =>
      (connectionsData?.connections ?? []).map((c) => ({
        roommate: {
          id: c.roommate.id,
          name: c.roommate.name ?? "",
          age: c.roommate.age ?? 0,
          occupation: c.roommate.occupation ?? "",
          bio: c.roommate.bio ?? "",
          avatarInitials: c.roommate.avatar_initials ?? "",
          sleepSchedule: c.roommate.sleep_schedule as RoommateProfile["sleepSchedule"],
          cleanlinessLevel: c.roommate.cleanliness_level as RoommateProfile["cleanlinessLevel"],
          noiseLevel: c.roommate.noise_level as RoommateProfile["noiseLevel"],
          guestPolicy: c.roommate.guest_policy as RoommateProfile["guestPolicy"],
          smoking: c.roommate.smoking as RoommateProfile["smoking"],
          languagesSpoken: c.roommate.languages_spoken ?? [],
          targetCity: c.roommate.target_city ?? "",
          maxBudget: c.roommate.max_budget ?? "",
          moveTimeline: c.roommate.move_timeline ?? "",
          bedroomsWanted: c.roommate.bedrooms_wanted ?? "",
          hasPets: c.roommate.has_pets ?? false,
          petDetails: c.roommate.pet_details ?? "",
          interests: c.roommate.interests ?? [],
          university: c.roommate.university ?? undefined,
          compatibilityScore: c.roommate.compatibility_score ?? undefined,
          compatibilityReasons: c.roommate.compatibility_reasons ?? [],
        },
        connectedAt: c.connected_at ?? "",
        messages: (c.messages ?? []).map((m) => ({
          role: m.role as RoommateMessage["role"],
          content: m.content ?? "",
          time: m.time ?? "",
        })),
      })),
    [connectionsData],
  );

  const refresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: readMyRoommateProfileRoommatesProfileGetQueryKey({}),
      }),
      queryClient.invalidateQueries({
        queryKey: readRoommateConnectionsRoommatesConnectionsGetQueryKey({}),
      }),
    ]);
  }, [queryClient]);

  const patchProfileMut = useMutation({
    ...patchMyRoommateProfileRoommatesProfilePatchMutation(),
    onSuccess: refresh,
  });
  const createConnMut = useMutation({
    ...createRoommateConnectionRoommatesConnectionsPostMutation(),
    onSuccess: refresh,
  });
  const deleteConnMut = useMutation({
    ...deleteRoommateConnectionRoommatesConnectionsConnectionIdDeleteMutation(),
    onSuccess: refresh,
  });
  const addMessageMut = useMutation({
    ...createRoommateMessageRoommatesConnectionsConnectionIdMessagesPostMutation(),
    onSuccess: refresh,
  });

  const updateMyProfile = useCallback(
    (partial: Partial<MyRoommateProfile>) => {
      if (!user) return;
      patchProfileMut.mutate({
        body: {
          sleep_schedule: partial.sleepSchedule,
          name: partial.name,
          age: partial.age,
          occupation: partial.occupation,
          cleanliness_level: partial.cleanlinessLevel,
          noise_level: partial.noiseLevel,
          guest_policy: partial.guestPolicy,
          smoking: partial.smoking,
          languages_spoken: partial.languagesSpoken,
          preferred_languages: partial.preferredLanguages,
          must_have_preferred_languages: partial.mustHavePreferredLanguages,
          interests: partial.interests,
          bio: partial.bio,
          profile_completed: partial.profileCompleted,
        },
      });
    },
    [patchProfileMut, user],
  );

  const resetMyProfile = useCallback(() => {
    if (!user) return;
    patchProfileMut.mutate({
      body: {
        sleep_schedule: defaultMyRoommateProfile.sleepSchedule,
        name: defaultMyRoommateProfile.name,
        age: defaultMyRoommateProfile.age,
        occupation: defaultMyRoommateProfile.occupation,
        cleanliness_level: defaultMyRoommateProfile.cleanlinessLevel,
        noise_level: defaultMyRoommateProfile.noiseLevel,
        guest_policy: defaultMyRoommateProfile.guestPolicy,
        smoking: defaultMyRoommateProfile.smoking,
        languages_spoken: defaultMyRoommateProfile.languagesSpoken,
        preferred_languages: defaultMyRoommateProfile.preferredLanguages,
        must_have_preferred_languages:
          defaultMyRoommateProfile.mustHavePreferredLanguages,
        interests: defaultMyRoommateProfile.interests,
        bio: defaultMyRoommateProfile.bio,
        profile_completed: defaultMyRoommateProfile.profileCompleted,
      },
    });
    connections.forEach((c) => {
      deleteConnMut.mutate({ path: { connection_id: c.roommate.id } });
    });
  }, [connections, deleteConnMut, patchProfileMut, user]);

  const isConnected = useCallback(
    (roommateId: string) => connections.some((c) => c.roommate.id === roommateId),
    [connections],
  );

  const addConnection = useCallback(
    (roommate: RoommateProfile) => {
      if (!user || isConnected(roommate.id)) return;
      createConnMut.mutate({
        body: {
          roommate: {
            id: roommate.id,
            name: roommate.name,
            age: roommate.age,
            occupation: roommate.occupation,
            bio: roommate.bio,
            avatar_initials: roommate.avatarInitials,
            sleep_schedule: roommate.sleepSchedule,
            cleanliness_level: roommate.cleanlinessLevel,
            noise_level: roommate.noiseLevel,
            guest_policy: roommate.guestPolicy,
            smoking: roommate.smoking,
            languages_spoken: roommate.languagesSpoken,
            target_city: roommate.targetCity,
            max_budget: roommate.maxBudget,
            move_timeline: roommate.moveTimeline,
            bedrooms_wanted: roommate.bedroomsWanted,
            has_pets: roommate.hasPets,
            pet_details: roommate.petDetails,
            interests: roommate.interests,
            university: roommate.university,
            compatibility_score: roommate.compatibilityScore ?? null,
            compatibility_reasons: roommate.compatibilityReasons ?? [],
          },
        },
      });
    },
    [createConnMut, isConnected, user],
  );

  const removeConnection = useCallback((roommateId: string) => {
    if (!user) return;
    const conn = connections.find((c) => c.roommate.id === roommateId);
    if (!conn) return;
    deleteConnMut.mutate({ path: { connection_id: conn.roommate.id } });
  }, [connections, deleteConnMut, user]);

  const addMessage = useCallback(
    (roommateId: string, message: RoommateMessage) => {
      if (!user) return;
      const conn = connections.find((c) => c.roommate.id === roommateId);
      if (!conn) return;
      addMessageMut.mutate({
        path: { connection_id: conn.roommate.id },
        body: {
          role: message.role,
          content: message.content,
          time: message.time,
        },
      });
      if (message.role === "user") {
        window.clearTimeout(autoReplyTimeouts.current[roommateId]);
        autoReplyTimeouts.current[roommateId] = window.setTimeout(() => {
          const replies = [
            "That sounds great! When works for you to check out some places?",
            "Nice, I'm on the same page. Let's figure out a budget that works for both of us.",
            "Awesome! I think we'd be a solid match. Want to set up a time to video chat?",
            "Cool, I'm flexible on that. What neighbourhood are you leaning towards?",
            "Sounds good to me! I'll send over some listings I've been looking at.",
          ];
          const reply = replies[Math.floor(Math.random() * replies.length)];
          addMessageMut.mutate({
            path: { connection_id: conn.roommate.id },
            body: {
              role: "them",
              content: reply,
              time: new Date().toISOString(),
            },
          });
        }, 1200);
      }
    },
    [addMessageMut, connections, user],
  );

  return (
    <RoommateContext.Provider
      value={{
        myProfile,
        updateMyProfile,
        resetMyProfile,
        connections,
        addConnection,
        removeConnection,
        addMessage,
        isConnected,
      }}
    >
      {children}
    </RoommateContext.Provider>
  );
}

export function useRoommate() {
  const ctx = useContext(RoommateContext);
  if (!ctx)
    throw new Error("useRoommate must be used within RoommateProvider");
  return ctx;
}
