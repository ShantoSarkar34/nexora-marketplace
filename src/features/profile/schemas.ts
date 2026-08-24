import { z } from "zod";

export const freelancerBasicsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(3, "Title is required"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  hourlyRate: z.coerce.number().positive("Enter a valid rate"),
  location: z.string().min(2, "Location is required"),
});
export type FreelancerBasicsInput = z.input<typeof freelancerBasicsSchema>;
export type FreelancerBasicsValues = z.output<typeof freelancerBasicsSchema>;

export const clientBasicsSchema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().min(2, "Company name is required"),
  companyDescription: z
    .string()
    .min(20, "Description should be at least 20 characters"),
  industry: z.string().min(2, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type ClientBasicsInput = z.input<typeof clientBasicsSchema>;
export type ClientBasicsValues = z.output<typeof clientBasicsSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
});
export type SkillInput = z.infer<typeof skillSchema>;

export const experienceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  company: z.string().min(2, "Company is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

export const portfolioSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  link: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type PortfolioInput = z.infer<typeof portfolioSchema>;
