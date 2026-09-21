import type { PermissionAction, PermissionModule } from "~/constants";

export function usePermission() {
  const { profile } = useAuthProfile();

  function canAccess(module: PermissionModule) {
    return hasModulePermission(profile.value ?? undefined, module);
  }

  function canPerform(module: PermissionModule, action: PermissionAction) {
    return hasActionPermission(profile.value ?? undefined, module, action);
  }

  return {
    canAccess,
    canPerform,
  };
}
