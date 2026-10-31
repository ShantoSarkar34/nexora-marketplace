"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKey } from "@/hooks/use-auth";
import {
  accountService,
  type ChangePasswordPayload,
  type DeleteAccountPayload,
} from "@/services/account";
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth";
import type { AuthUser, UserRole } from "@/types/user";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    meta: {
      rateLimitMessage:
        "Too many login attempts. Please wait about 15 minutes and try again.",
    },
    onSuccess: (user) => qc.setQueryData(authQueryKey, user),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    meta: {
      rateLimitMessage:
        "Too many sign-up attempts from this network. Please try again in an hour.",
    },
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
  return useMutation({
    mutationFn: () => authService.sendVerificationOtp(),
    meta: {
      rateLimitMessage:
        "You've requested too many verification codes. You can ask for another in about an hour.",
    },
  });
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
    meta: {
      rateLimitMessage:
        "Too many reset requests. Please wait about 15 minutes before trying again.",
    },
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

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string }) => accountService.updateMe(payload),
    // Refetch /auth/me rather than trusting the shape of the PATCH response.
    onSuccess: () => qc.invalidateQueries({ queryKey: authQueryKey }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      accountService.changePassword(payload),
    meta: {
      rateLimitMessage:
        "Too many password change attempts. Please wait about 15 minutes and try again.",
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteAccountPayload) =>
      accountService.deleteAccount(payload),
    meta: {
      rateLimitMessage:
        "Too many attempts. Please wait about 15 minutes and try again.",
    },
    onSuccess: () => {
      // The server clears the cookie; drop everything we cached for this user.
      qc.setQueryData(authQueryKey, null);
      qc.clear();
    },
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (blob: Blob) => authService.uploadAvatar(blob),
    onSuccess: ({ imageUrl }) => {
      qc.setQueryData(authQueryKey, (old: AuthUser | null | undefined) =>
        old ? { ...old, imageUrl } : old,
      );
    },
  });
}
