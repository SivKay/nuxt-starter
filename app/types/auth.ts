export interface ILoginRequestBody {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
}

export interface IChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface IChangePasswordResponse {
  data: string;
}
