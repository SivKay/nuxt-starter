import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import AuthService from "~/services/authService";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshSubscriber {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

function isErrorPayload(value: unknown): value is { message?: string } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { accessToken, refreshToken, logout, setTokens } = useAuth();
  const { $i18n } = useNuxtApp();

  const api = axios.create({
    baseURL: config.public.apiBase + "/v1",
    headers: {
      Accept: "application/json",
    },
  });

  let isRefreshing = false;
  let refreshSubscribers: RefreshSubscriber[] = [];

  const subscribeTokenRefresh = (
    resolve: (token: string) => void,
    reject: (error: unknown) => void,
  ) => {
    refreshSubscribers.push({ resolve, reject });
  };

  const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb.resolve(token));
    refreshSubscribers = [];
  };

  const onRefreshFailed = (error: unknown) => {
    refreshSubscribers.forEach((subscriber) => subscriber.reject(error));
    refreshSubscribers = [];
  };

  const redirectToLogin = () => {
    logout();

    if (import.meta.client) {
      window.location.replace(`${config.app.baseURL}login`);
    }
  };

  const normalizeApiError = (
    error: AxiosError<unknown>,
    fallbackMessage: string,
  ) => {
    const payload = error.response?.data;
    const message =
      isErrorPayload(payload) && typeof payload.message === "string"
        ? payload.message
        : fallbackMessage;
    const apiError = new Error(message, { cause: error });

    Object.assign(apiError, {
      status: error.response?.status,
      data: payload,
    });

    return apiError;
  };

  api.interceptors.request.use((request) => {
    if (accessToken.value) {
      request.headers.Authorization = `Bearer ${accessToken.value}`;
    }

    request.headers["Accept-Language"] = $i18n.locale.value;

    return request;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown>) => {
      const t = $i18n.t;
      const originalRequest = error.config as RetryRequestConfig | undefined;

      // Network failure or a request that Axios cannot safely retry.
      if (!error.response) {
        return Promise.reject(
          normalizeApiError(error, t("networkErrorUnableTo")),
        );
      }

      if (!originalRequest) {
        return Promise.reject(
          normalizeApiError(error, t("somethingWentWrong")),
        );
      }

      // Login and refresh endpoints must never trigger another refresh attempt.
      const publicApi = ["/merchant/auth/login", "/merchant/auth/refresh"];
      const isPublicApi = publicApi.includes(originalRequest.url || "");

      if (
        error.response.status === 401 &&
        !isPublicApi &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        if (!refreshToken.value) {
          const authError = normalizeApiError(error, t("somethingWentWrong"));
          onRefreshFailed(authError);
          redirectToLogin();
          return Promise.reject(authError);
        }

        if (isRefreshing) {
          // Wait for token refresh
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              resolve(api(originalRequest));
            }, reject);
          });
        }

        try {
          isRefreshing = true;

          // Attempt to refresh token
          const newTokens = await AuthService().refreshToken(
            refreshToken.value,
          );

          // Persist the rotated access and refresh tokens.
          setTokens(newTokens);

          onTokenRefreshed(newTokens.access_token);

          originalRequest.headers.set(
            "Authorization",
            `Bearer ${newTokens.access_token}`,
          );

          return api(originalRequest);
        } catch (refreshError: unknown) {
          onRefreshFailed(refreshError);
          redirectToLogin();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(normalizeApiError(error, t("somethingWentWrong")));
    },
  );

  return {
    provide: {
      api,
    },
  };
});
