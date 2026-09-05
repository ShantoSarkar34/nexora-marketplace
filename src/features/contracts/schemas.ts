import { z } from "zod";

export const cancelContractSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide a reason (at least 10 characters)"),
});
export type CancelContractFormValues = z.infer<typeof cancelContractSchema>;
