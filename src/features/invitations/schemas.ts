import { z } from "zod";

export const inviteSchema = z.object({
  jobId: z.string().min(1, "Choose a job"),
  message: z
    .string()
    .max(500, "Keep the message under 500 characters")
    .optional(),
});
export type InviteFormValues = z.infer<typeof inviteSchema>;
