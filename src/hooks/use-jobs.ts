"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { jobsService } from "@/services/jobs";
import type { CreateJobFormValues } from "@/features/jobs/schemas";
import type { JobListParams } from "@/types/job";
import type { JobStatus } from "@/types/enums";

export function useJobs(params: JobListParams) {
  return useQuery({
    queryKey: ["jobs", "list", params],
    queryFn: () => jobsService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => jobsService.getById(jobId),
    enabled: !!jobId,
  });
}

export function useMyJobs(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["jobs", "mine", params],
    queryFn: () => jobsService.myJobs(params),
    placeholderData: keepPreviousData,
  });
}

export function useSavedJobs(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["jobs", "saved", params],
    queryFn: () => jobsService.savedJobs(params),
    placeholderData: keepPreviousData,
  });
}

function toPayload(values: CreateJobFormValues) {
  const { skills, deadline, ...rest } = values;
  const skillsArray = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    ...rest,
    skills: skillsArray,
    ...(deadline ? { deadline: new Date(deadline).toISOString() } : {}),
  };
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CreateJobFormValues) =>
      jobsService.create(toPayload(values)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs", "mine"] }),
  });
}

export function useUpdateJob(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CreateJobFormValues) =>
      jobsService.update(jobId, toPayload(values)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs", "mine"] });
      qc.invalidateQueries({ queryKey: ["jobs", "detail", jobId] });
    },
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: JobStatus }) =>
      jobsService.updateStatus(jobId, status),
    onSuccess: (_data, { jobId }) => {
      qc.invalidateQueries({ queryKey: ["jobs", "mine"] });
      qc.invalidateQueries({ queryKey: ["jobs", "detail", jobId] });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.remove(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs", "mine"] }),
  });
}

export function useSaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.save(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs", "list"] });
      qc.invalidateQueries({ queryKey: ["jobs", "saved"] });
    },
  });
}

export function useUnsaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.unsave(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs", "list"] });
      qc.invalidateQueries({ queryKey: ["jobs", "saved"] });
    },
  });
}
