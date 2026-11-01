"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { applicationsService } from "@/services/applications";
import type { ApplyJobFormValues } from "@/features/applications/schemas";
import type { ApplicationStatus } from "@/types/enums";

export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      values,
    }: {
      jobId: string;
      values: ApplyJobFormValues;
    }) => applicationsService.apply(jobId, values),
    onSuccess: () => {
      // Every job list and detail carries a hasApplied flag, so refresh them all.
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useMyApplications(
  params: {
    status?: ApplicationStatus | "ALL";
    page?: number;
    limit?: number;
  } = {},
) {
  const { status, ...rest } = params;
  return useQuery({
    queryKey: ["applications", "mine", params],
    queryFn: () =>
      applicationsService.myApplications({
        ...rest,
        status: status && status !== "ALL" ? status : undefined,
      }),
  });
}

export function useApplication(applicationId: string) {
  return useQuery({
    queryKey: ["applications", "detail", applicationId],
    queryFn: () => applicationsService.getById(applicationId),
    enabled: !!applicationId,
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationsService.withdraw(applicationId),
    onSuccess: (_data, applicationId) => {
      qc.invalidateQueries({ queryKey: ["applications", "mine"] });
      qc.invalidateQueries({
        queryKey: ["applications", "detail", applicationId],
      });
      // hasApplied on jobs may change after a withdrawal.
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useJobApplicants(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: () => applicationsService.forJob(jobId),
    enabled: !!jobId,
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: "SHORTLISTED" | "REJECTED";
    }) => applicationsService.updateStatus(applicationId, status),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["applications", "job", data.jobId] });
      qc.invalidateQueries({ queryKey: ["applications", "detail", data.id] });
    },
  });
}
