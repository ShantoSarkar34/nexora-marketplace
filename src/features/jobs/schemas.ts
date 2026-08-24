import { z } from "zod";

export const createJobSchema = z
  .object({
    title: z.string().min(10, "Title should be at least 10 characters"),
    description: z
      .string()
      .min(50, "Description should be at least 50 characters"),
    category: z.enum([
      "Web Development",
      "Mobile Development",
      "Design",
      "Writing",
      "Marketing",
      "Data Science",
    ]),
    skills: z.string().min(2, "List at least one skill"),
    budgetType: z.enum(["FIXED", "HOURLY"]),
    budgetMin: z.coerce.number().positive("Enter a valid amount"),
    budgetMax: z.coerce.number().positive("Enter a valid amount"),
    experienceLevel: z.enum(["Entry", "Intermediate", "Expert"]),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Max budget must be greater than min budget",
    path: ["budgetMax"],
  });

// Shape BEFORE coercion runs — what react-hook-form actually manages internally
// (budgetMin/budgetMax are typed as their raw input, since the <input type="number">
// gives back a value coerce will parse).
export type CreateJobFormInput = z.input<typeof createJobSchema>;

// Shape AFTER coercion/validation — what onSubmit receives
export type CreateJobFormValues = z.output<typeof createJobSchema>;
