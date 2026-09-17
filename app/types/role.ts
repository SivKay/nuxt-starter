import type { IBaseListFilter, IBaseListResponse, IBaseResponse } from "./api";

export type TRoleStatus = "ACTIVE" | "INACTIVE";

export interface IRoleFilter extends IBaseListFilter {
  status?: TRoleStatus;
  search?: string;
}

export interface IPermission {
  action: string;
  description: string;
  id: number;
  module: string;
  name: string;
}

export interface IPermissionModule {
  module: string;
  permissions: IPermission[];
}

export interface IRole {
  code: string;
  created_at: string;
  description: string;
  is_default: boolean;
  name: string;
  permissions: IPermissionModule[];
  status: TRoleStatus;
  updated_at: string;
  uuid: string;
}

export interface IRoleCreateReq {
  description: string;
  name: string;
  permission_ids: number[];
  status: TRoleStatus;
}
