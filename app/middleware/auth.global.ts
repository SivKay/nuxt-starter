export default defineNuxtRouteMiddleware((to) => {
  const { hasSession } = useAuth();
  const isLoginPage = to.path === "/login";

  if (!hasSession.value && !isLoginPage) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  if (hasSession.value && isLoginPage) {
    return navigateTo("/");
  }
});
