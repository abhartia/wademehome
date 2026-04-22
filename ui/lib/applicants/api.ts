"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplicantGroupsGroupIdApplicantsPost,
  createSelfRegistrationLinkGroupsGroupIdApplicantsSelfRegistrationLinkPost,
  deleteApplicantGroupsGroupIdApplicantsApplicantIdDelete,
  listApplicantsGroupsGroupIdApplicantsGet,
  previewPublicApplicantPublicApplicantsTokenGet,
  submitPublicApplicantPublicApplicantsTokenPost,
  updateApplicantGroupsGroupIdApplicantsApplicantIdPatch,
} from "@/lib/api/generated/sdk.gen";
import {
  listApplicantsGroupsGroupIdApplicantsGetQueryKey,
  previewPublicApplicantPublicApplicantsTokenGetOptions,
} from "@/lib/api/generated/@tanstack/react-query.gen";
import type {
  ApplicantCreateRequest,
  ApplicantResponse,
  ApplicantUpdateRequest,
  PublicApplicantSubmitRequest,
  PublicApplicantSubmitResponse,
  SelfRegLinkCreateRequest,
  SelfRegLinkResponse,
} from "@/lib/api/generated/types.gen";

export function useGroupApplicants(
  groupId: string | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: listApplicantsGroupsGroupIdApplicantsGetQueryKey({
      path: { group_id: groupId ?? "" },
    }),
    queryFn: async () => {
      const { data } = await listApplicantsGroupsGroupIdApplicantsGet({
        path: { group_id: groupId! },
        throwOnError: true,
      });
      return data!;
    },
    enabled: Boolean(groupId) && (options?.enabled ?? true),
  });
}

export function useCreateApplicant(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ApplicantCreateRequest): Promise<ApplicantResponse> => {
      const { data } = await createApplicantGroupsGroupIdApplicantsPost({
        path: { group_id: groupId },
        body,
        throwOnError: true,
      });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listApplicantsGroupsGroupIdApplicantsGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useUpdateApplicant(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      applicantId: string;
      body: ApplicantUpdateRequest;
    }): Promise<ApplicantResponse> => {
      const { data } =
        await updateApplicantGroupsGroupIdApplicantsApplicantIdPatch({
          path: { group_id: groupId, applicant_id: input.applicantId },
          body: input.body,
          throwOnError: true,
        });
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listApplicantsGroupsGroupIdApplicantsGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useDeleteApplicant(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (applicantId: string): Promise<void> => {
      await deleteApplicantGroupsGroupIdApplicantsApplicantIdDelete({
        path: { group_id: groupId, applicant_id: applicantId },
        throwOnError: true,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listApplicantsGroupsGroupIdApplicantsGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function useCreateSelfRegLink(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      body: SelfRegLinkCreateRequest,
    ): Promise<SelfRegLinkResponse> => {
      const { data } =
        await createSelfRegistrationLinkGroupsGroupIdApplicantsSelfRegistrationLinkPost(
          {
            path: { group_id: groupId },
            body,
            throwOnError: true,
          },
        );
      return data!;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: listApplicantsGroupsGroupIdApplicantsGetQueryKey({
          path: { group_id: groupId },
        }),
      });
    },
  });
}

export function usePublicApplicantPreview(token: string | null) {
  return useQuery({
    ...previewPublicApplicantPublicApplicantsTokenGetOptions({
      path: { token: token ?? "" },
    }),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useSubmitPublicApplicant() {
  return useMutation({
    mutationFn: async (input: {
      token: string;
      body: PublicApplicantSubmitRequest;
    }): Promise<PublicApplicantSubmitResponse> => {
      const { data } = await submitPublicApplicantPublicApplicantsTokenPost({
        path: { token: input.token },
        body: input.body,
        throwOnError: true,
      });
      return data!;
    },
  });
}

export type {
  ApplicantResponse,
  ApplicantCreateRequest,
  ApplicantUpdateRequest,
  SelfRegLinkResponse,
};
