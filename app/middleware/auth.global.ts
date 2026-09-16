export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();
  const isLoginPage = to.path === "/login";

  if (!isAuthenticated.value && !isLoginPage) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  if (isAuthenticated.value && isLoginPage) {
    return navigateTo("/");
  }
});
