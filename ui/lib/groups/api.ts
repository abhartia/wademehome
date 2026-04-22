"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInviteInvitesAcceptPost,
  createGroupGroupsPost,
  createInviteGroupsGroupIdInvitesPost,
  deleteGroupGroupsGroupIdDelete,
  getGroupGroupsGroupIdGet,
  leaveGroupGroupsGroupIdLeavePost,
  listInvitesGroupsGroupIdInvitesGet,
  listMembersGroupsGroupIdMembersGet,
  removeMemberGroupsGroupIdMembersUserIdDelete,
  renameGroupGroupsGroupIdPatch,
  revokeInviteGroupsGroupIdInvitesInviteIdDelete,
  updateGroupPreferencesGroupsGroupIdPreferencesPatch,
  updateMemberRoleGroupsGroupIdMembersUserIdRolePatch,
} from "@/lib/api/generated/sdk.gen";
import {
  getGroupGroupsGroupIdGetQueryKey,
  listGroupsGroupsGetOptions,
  listGroupsGroupsGetQueryKey,
  listInvitesGroupsGroupIdInvitesGetQueryKey,
  listMembersGroupsGroupIdMembersGetQueryKey,
  previewInviteInvitesTokenGetOptions,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type {
  GroupInviteResponse,
  GroupPreferences,
  GroupPreferencesUpdate,
  GroupResponse,
  InviteAcceptResponse,
  InvitePreviewResponse,
} from "@/lib/api/generated/types.gen";

export function useMyGroups(options?: { enabled?: boolean }) {
  return useQuery({
    ...listGroupsGroupsGetOptions({}),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<GroupResponse> => {
      const { data } = await createGroupGroupsPost({
        body: { name },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useGroup(groupId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: getGroupGroupsGroupIdGetQueryKey({
      path: { group_id: groupId ?? "" },
    }),
    queryFn: async () => {
      const { data } = await getGroupGroupsGroupIdGet({
        path: { group_id: groupId! },
        throwOnError: true,
      });
      return data!;
    },
    enabled: Boolean(groupId) && (options?.enabled ?? true),
  });
}

export function useUpdateGroupPreferences(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      body: GroupPreferencesUpdate,
    ): Promise<GroupResponse> => {
      const { data } =
        await updateGroupPreferencesGroupsGroupIdPreferencesPatch({
          path: { group_id: groupId },
          body,
          throwOnError: true,
        });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: getGroupGroupsGroupIdGetQueryKey({
          path: { group_id: groupId },
        }),
      });
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useRenameGroup(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string): Promise<GroupResponse> => {
      const { data } = await renameGroupGroupsGroupIdPatch({
        path: { group_id: groupId },
        body: { name },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string): Promise<void> => {
      await deleteGroupGroupsGroupIdDelete({
        path: { group_id: groupId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useLeaveGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: string): Promise<void> => {
      await leaveGroupGroupsGroupIdLeavePost({
        path: { group_id: groupId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useGroupMembers(groupId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: listMembersGroupsGroupIdMembersGetQueryKey({
      path: { group_id: groupId ?? "" },
    }),
    queryFn: async () => {
      const { data } = await listMembersGroupsGroupIdMembersGet({
        path: { group_id: groupId! },
        throwOnError: true,
      });
      return data!;
    },
    enabled: Boolean(groupId) && (options?.enabled ?? true),
  });
}

export function useRemoveMember(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await removeMemberGroupsGroupIdMembersUserIdDelete({
        path: { group_id: groupId, user_id: userId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listMembersGroupsGroupIdMembersGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useUpdateMemberRole(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      userId: string;
      role: "owner" | "member";
    }): Promise<void> => {
      await updateMemberRoleGroupsGroupIdMembersUserIdRolePatch({
        path: { group_id: groupId, user_id: input.userId },
        body: { role: input.role },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listMembersGroupsGroupIdMembersGetQueryKey({
          path: { group_id: groupId },
        }),
      });
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export function useGroupInvites(groupId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: listInvitesGroupsGroupIdInvitesGetQueryKey({
      path: { group_id: groupId ?? "" },
    }),
    queryFn: async () => {
      const { data } = await listInvitesGroupsGroupIdInvitesGet({
        path: { group_id: groupId! },
        throwOnError: true,
      });
      return data!;
    },
    enabled: Boolean(groupId) && (options?.enabled ?? true),
  });
}

export function useCreateInvite(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      kind: "email" | "link";
      email?: string | null;
    }): Promise<GroupInviteResponse> => {
      const { data } = await createInviteGroupsGroupIdInvitesPost({
        path: { group_id: groupId },
        body: { kind: input.kind, email: input.email ?? null },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listInvitesGroupsGroupIdInvitesGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useRevokeInvite(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inviteId: string): Promise<void> => {
      await revokeInviteGroupsGroupIdInvitesInviteIdDelete({
        path: { group_id: groupId, invite_id: inviteId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listInvitesGroupsGroupIdInvitesGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useInvitePreview(token: string | null) {
  return useQuery({
    ...previewInviteInvitesTokenGetOptions({ path: { token: token ?? "" } }),
    enabled: Boolean(token),
  });
}

export function useAcceptInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (token: string): Promise<InviteAcceptResponse> => {
      const { data } = await acceptInviteInvitesAcceptPost({
        body: { token },
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: listGroupsGroupsGetQueryKey({}) });
    },
  });
}

export type {
  GroupResponse,
  GroupInviteResponse,
  InvitePreviewResponse,
  GroupPreferences,
  GroupPreferencesUpdate,
};
