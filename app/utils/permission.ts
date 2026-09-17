import type {
  PermissionAction,
  PermissionModule,
  PermissionRequirement,
} from "~/constants";
import type { IUserProfile } from "~/types/userProfile";

export function hasModulePermission(
  profile: IUserProfile | undefined,
  module: PermissionModule,
) {
  return profile?.permissions?.some((group) => group.module === module) ?? false;
}

export function hasActionPermission(
  profile: IUserProfile | undefined,
  module: PermissionModule,
  action: PermissionAction,
) {
  return (
    profile?.permissions
      ?.find((group) => group.module === module)
      ?.permissions.some((permission) => permission.action === action) ?? false
  );
}

export function hasRequiredPermission(
  profile: IUserProfile | undefined,
  requirement: PermissionRequirement,
) {
  return requirement.action
    ? hasActionPermission(profile, requirement.module, requirement.action)
    : hasModulePermission(profile, requirement.module);
}
