export interface IRole {
  id: number;
  code: string;
  name: string;
}

export interface IPermissionItem {
  id: number;
  name: string;
  module: string;
  action: string;
}

export interface IPermissionGroup {
  module: string;
  permissions: IPermissionItem[];
}

export interface IUserProfile {
  user: IUser;
  role?: IRole;
  roles?: IRole[];
  permissions?: IPermissionGroup[];
}

export interface IUser {
  merchant_id: number;
  merchant_code: string;
  merchant_name: string;
  id: number;
  uuid: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}
