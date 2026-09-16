import { COOKIE_KEYS } from "~/constants";
import type { ILoginResponse } from "~/types/auth";

const accessTokenCookieOptions = {
  maxAge: 60 * 60,
  sameSite: "lax" as const,
  secure: !import.meta.dev,
};

const refreshTokenCookieOptions = {
  maxAge: 60 * 60 * 24 * 30,
  sameSite: "lax" as const,
  secure: !import.meta.dev,
};

export function useAuth() {
  const accessToken = useCookie<string | null>(
    COOKIE_KEYS.accessToken,
    accessTokenCookieOptions,
  );
  const refreshToken = useCookie<string | null>(
    COOKIE_KEYS.refreshToken,
    refreshTokenCookieOptions,
  );

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  function setTokens(tokens: ILoginResponse) {
    accessToken.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
  }

  function logout() {
    clearTokens();
  }

  return {
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isAuthenticated,
    setTokens,
    clearTokens,
    logout,
  };
}
