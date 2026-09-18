import type { IBaseResponse } from "~/types/api";
import type {
  IChangePasswordRequest,
  IChangePasswordResponse,
  ILoginRequestBody,
  ILoginResponse,
} from "~/types/auth";
import type { IUserProfile } from "~/types/userProfile";

export default function AuthService() {
  const { $api } = useNuxtApp();

  async function login(payload: ILoginRequestBody) {
    const res = await $api.post<IBaseResponse<ILoginResponse>>(
      "/merchant/auth/login",
      payload,
    );
    return res.data.data;
  }

  async function getProfile() {
    const res = await $api.get<IBaseResponse<IUserProfile>>(
      "/merchant/auth/profile",
    );
    return res.data.data;
  }

  async function changePassword(payload: IChangePasswordRequest) {
    const res = await $api.put<IBaseResponse<IChangePasswordResponse>>(
      "/merchant/auth/change-password",
      payload,
    );
    return res.data.data;
  }

  async function refreshToken(refreshToken: string) {
    const res = await $api.post<IBaseResponse<ILoginResponse>>(
      "/merchant/auth/refresh",
      { refresh_token: refreshToken },
    );
    return res.data.data;
  }

  async function logout() {
    const res = await $api.post<IBaseResponse<null>>("/merchant/auth/logout");
    return res.data.data;
  }

  return {
    login,
    logout,
    getProfile,
    changePassword,
    refreshToken,
  };
}
