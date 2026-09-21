import { useMutation } from "@tanstack/vue-query";
import AuthService from "~/services/authService";
import type { IChangePasswordRequest, ILoginRequestBody } from "~/types/auth";

export function useLoginService() {
  const authService = AuthService();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload: ILoginRequestBody) =>
      authService.login(payload),
  });
}

export function useChangePasswordService() {
  const authService = AuthService();
  return useMutation({
    mutationKey: ["profile-change-password"],
    mutationFn: async (payload: IChangePasswordRequest) =>
      authService.changePassword(payload),
  });
}

export function useLogoutService() {
  const authService = AuthService();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => authService.logout(),
  });
}
