import { apiClient } from "@/lib/api-client";
import type { AuthUser, UserRole } from "@/types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const authService = {
  me: async () => {
    const res = await apiClient.get<AuthUser>("/auth/me");
    return res.data;
  },
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<AuthUser>("/auth/login", payload);
    return res.data;
  },
  register: async (payload: RegisterPayload) => {
    const res = await apiClient.post<AuthUser>("/auth/register", payload);
    return res.data;
  },
  logout: async () => {
    await apiClient.post<void>("/auth/logout");
  },
  googleLogin: async (idToken: string, role?: UserRole) => {
    const res = await apiClient.post<AuthUser>("/auth/google", {
      idToken,
      role,
    });
    return res.data;
  },
  sendVerificationOtp: async () => {
    await apiClient.post<void>("/auth/send-verification-otp");
  },
  verifyOtp: async (otp: string) => {
    await apiClient.post<void>("/auth/verify-otp", { otp });
  },
  forgotPassword: async (email: string) => {
    await apiClient.post<void>("/auth/forgot-password", { email });
  },
  resetPassword: async (token: string, newPassword: string) => {
    await apiClient.post<void>("/auth/reset-password", { token, newPassword });
  },
};
