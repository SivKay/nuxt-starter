import type { PermissionAction, PermissionModule } from "~/constants";

export function usePermission() {
  const { data: profile, isPending } = useProfileService();

  function canAccess(module: PermissionModule) {
    return hasModulePermission(profile.value, module);
  }

  function canPerform(module: PermissionModule, action: PermissionAction) {
    return hasActionPermission(profile.value, module, action);
  }

  return {
    canAccess,
    canPerform,
    isPending,
  };
}
