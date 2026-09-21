import type { PermissionRequirement } from "~/constants";

declare module "#app" {
  interface PageMeta {
    permission?: PermissionRequirement;
  }
}

export {};
