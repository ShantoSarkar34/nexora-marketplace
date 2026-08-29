import { z } from "zod";

export const applyJobSchema = z.object({
  coverLetter: z
    .string()
    .min(50, "Cover letter should be at least 50 characters"),
  proposedBudget: z.coerce.number().positive("Enter a valid amount"),
  estimatedDeliveryDays: z.coerce
    .number()
    .int()
    .positive("Enter a valid number of days"),
});
export type ApplyJobFormInput = z.input<typeof applyJobSchema>;
export type ApplyJobFormValues = z.output<typeof applyJobSchema>;
