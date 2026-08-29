import { apiClient } from "@/lib/api-client";
import type { ApplyJobFormValues } from "@/features/applications/schemas";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  proposedBudget: number;
  estimatedDeliveryDays: number;
  status: "PENDING" | "SHORTLISTED" | "REJECTED" | "HIRED" | "WITHDRAWN";
  createdAt: string;
}

export const applicationsService = {
  apply: async (jobId: string, payload: ApplyJobFormValues) => {
    const res = await apiClient.post<Application>("/applications", {
      jobId,
      ...payload,
    });
    return res.data;
  },
};
