export default defineNuxtRouteMiddleware(async (to) => {
  const { hasSession, clearTokens } = useAuth();
  const { fetchProfile, clearProfile } = useAuthProfile();
  const isLoginPage = to.path === "/login";

  if (!hasSession.value) {
    clearProfile();

    if (isLoginPage) {
      return;
    }

    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  try {
    await fetchProfile();
  } catch (error: unknown) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? error.status
        : undefined;

    if (status === 401) {
      clearTokens();
      clearProfile();

      if (isLoginPage) {
        return;
      }

      return navigateTo({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }

    throw createError({
      statusCode: typeof status === "number" ? status : 500,
      statusMessage:
        error instanceof Error ? error.message : "Something went wrong",
      cause: error,
      fatal: true,
    });
  }

  if (isLoginPage) {
    return navigateTo("/");
  }
});
