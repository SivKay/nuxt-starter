export default defineNuxtRouteMiddleware((to) => {
  const requiredModule = to.meta.permission;

  if (!requiredModule) {
    return;
  }

  const { profile } = useAuthProfile();

  if (!profile.value) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      fatal: true,
    });
  }

  const hasPermission = hasRequiredPermission(profile.value, requiredModule);

  if (!hasPermission) {
    return abortNavigation(
      createError({
        statusCode: 403,
        statusMessage: "Forbidden",
        fatal: true,
      }),
    );
  }
});
