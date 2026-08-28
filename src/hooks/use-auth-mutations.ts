"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKey } from "@/hooks/use-auth";
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth";
import type { UserRole } from "@/types/user";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (user) => qc.setQueryData(authQueryKey, user),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      qc.setQueryData(authQueryKey, null);
      qc.clear();
    },
  });
}

export function useGoogleLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idToken, role }: { idToken: string; role?: UserRole }) =>
      authService.googleLogin(idToken, role),
    onSuccess: (user) => qc.setQueryData(authQueryKey, user),
  });
}

export function useSendVerificationOtp() {
  return useMutation({ mutationFn: () => authService.sendVerificationOtp() });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (otp: string) => authService.verifyOtp(otp),
    onSuccess: () => qc.invalidateQueries({ queryKey: authQueryKey }),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
  });
}
