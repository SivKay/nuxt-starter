export const COOKIE_KEYS = {
  accessToken: "auth_access_token",
  refreshToken: "auth_refresh_token",
  locale: "i18n_redirected",
} as const;

export const PERMISSION_MODULES = {
  deposit: "DEPOSIT",
  withdrawal: "WITHDRAWAL",
  role: "ROLE",
  user: "USER",
  credential: "CREDENTIAL",
  webhook: "WEBHOOK",
} as const;

export const PERMISSION_ACTIONS = {
  create: "create",
  update: "update",
  delete: "delete",
  read: "read",
} as const;

export type PermissionModule =
  (typeof PERMISSION_MODULES)[keyof typeof PERMISSION_MODULES];

export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];

export interface PermissionRequirement {
  module: PermissionModule;
  action?: PermissionAction;
}
