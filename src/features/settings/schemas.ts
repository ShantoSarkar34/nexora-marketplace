import { z } from "zod";

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
});
export type UpdateNameFormValues = z.infer<typeof updateNameSchema>;

// Same rule as registration and reset-password.
const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current one",
    path: ["newPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// One field, two meanings: the password for local accounts, the account email
// for Google-only accounts.
export const deleteAccountSchema = z.object({
  confirmation: z.string().min(1, "This field is required"),
});
export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;
