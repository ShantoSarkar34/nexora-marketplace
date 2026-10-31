import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "@/types/user";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Local accounts confirm with their password; Google-only accounts have none,
// so they confirm by typing their email.
export type DeleteAccountPayload = { password: string } | { confirmEmail: string };

export const accountService = {
  updateMe: async (payload: { name: string }) => {
    const res = await apiClient.patch<AuthUser>("/users/me", payload);
    return res.data;
  },
  changePassword: async (payload: ChangePasswordPayload) => {
    await apiClient.post<void>("/auth/change-password", payload);
  },
  deleteAccount: async (payload: DeleteAccountPayload) => {
    await apiClient.delete<void>("/users/me", { body: payload });
  },
};