"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { invitationsService } from "@/services/invitations";
import type { InvitationStatus } from "@/types/enums";

export function useMyInvitations(
  params: {
    status?: InvitationStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, ...rest } = params;
  return useQuery({
    queryKey: ["invitations", "mine", params],
    queryFn: () =>
      invitationsService.mine({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useSentInvitations(
  params: {
    jobId?: string;
    status?: InvitationStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, jobId, ...rest } = params;
  return useQuery({
    queryKey: ["invitations", "sent", params],
    queryFn: () =>
      invitationsService.sent({
        ...rest,
        jobId: jobId && jobId !== "ALL" ? jobId : undefined,
        status: status && status !== "ALL" ? status : undefined,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      jobId: string;
      freelancerId: string;
      message?: string;
    }) => invitationsService.create(payload),
    meta: {
      rateLimitMessage:
        "You've reached today's limit of 20 invitations. You can send more tomorrow.",
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitations"] }),
  });
}

export function useRespondToInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      invitationId,
      status,
    }: {
      invitationId: string;
      status: "ACCEPTED" | "DECLINED";
    }) => invitationsService.respond(invitationId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitations"] }),
  });
}

export function useCancelInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      invitationsService.cancel(invitationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invitations"] }),
  });
}