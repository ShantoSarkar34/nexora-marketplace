import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(1000, "Comment is too long").optional(),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;
