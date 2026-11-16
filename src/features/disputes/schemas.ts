import { z } from "zod";

export const DISPUTE_REASON_MIN = 20;
export const DISPUTE_REASON_MAX = 2000;

export const openDisputeSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(
      DISPUTE_REASON_MIN,
      `Describe the problem in at least ${DISPUTE_REASON_MIN} characters`
    )
    .max(DISPUTE_REASON_MAX, `Keep it under ${DISPUTE_REASON_MAX} characters`),
});
export type OpenDisputeFormValues = z.infer<typeof openDisputeSchema>;
