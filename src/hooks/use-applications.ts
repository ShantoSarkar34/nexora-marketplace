"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { applicationsService } from "@/services/applications";
import type { ApplyJobFormValues } from "@/features/applications/schemas";

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
    onSuccess: (_data, { jobId }) => {
      qc.invalidateQueries({ queryKey: ["jobs", "detail", jobId] });
      qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
