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
  const accessTokenCookie = useCookie<string | null>(
    COOKIE_KEYS.accessToken,
    accessTokenCookieOptions,
  );
  const refreshTokenCookie = useCookie<string | null>(
    COOKIE_KEYS.refreshToken,
    refreshTokenCookieOptions,
  );

  const accessToken = useState<string | null>(
    "auth-access-token",
    () => accessTokenCookie.value ?? null,
  );
  const refreshToken = useState<string | null>(
    "auth-refresh-token",
    () => refreshTokenCookie.value ?? null,
  );

  const isAuthenticated = computed(() => Boolean(accessToken.value));

  const hasSession = computed(() =>
    Boolean(accessToken.value || refreshToken.value),
  );

  function setTokens(tokens: ILoginResponse) {
    accessToken.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;
    accessTokenCookie.value = tokens.access_token;
    refreshTokenCookie.value = tokens.refresh_token;
  }

  function clearTokens() {
    accessToken.value = null;
    refreshToken.value = null;
    accessTokenCookie.value = null;
    refreshTokenCookie.value = null;
  }

  function logout() {
    clearTokens();
  }

  return {
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isAuthenticated,
    hasSession,
    setTokens,
    clearTokens,
    logout,
  };
}
