import { z } from "zod";

export const createJobSchema = z
  .object({
    title: z.string().min(10, "Title should be at least 10 characters"),
    description: z
      .string()
      .min(50, "Description should be at least 50 characters"),
    category: z.enum([
      "WEB_DEVELOPMENT",
      "MOBILE_DEVELOPMENT",
      "DESIGN",
      "WRITING",
      "MARKETING",
      "DATA_SCIENCE",
      "DEVOPS",
      "OTHER",
    ]),
    skills: z.string().min(2, "List at least one skill"),
    budgetType: z.enum(["FIXED", "HOURLY"]),
    budgetMin: z.coerce.number().positive("Enter a valid amount"),
    budgetMax: z.coerce.number().positive("Enter a valid amount"),
    experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]),
    deadline: z.string().optional(),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "Max budget must be greater than min budget",
    path: ["budgetMax"],
  });

export type CreateJobFormInput = z.input<typeof createJobSchema>;
export type CreateJobFormValues = z.output<typeof createJobSchema>;
