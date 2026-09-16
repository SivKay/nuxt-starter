export interface IMetaData {
  has_next: boolean;
  has_prev: boolean;
  total_page: number;
  current_page: number;
  limit: number;
  total_count: number;
}

interface IResponse {
  traceId: string;
  status_code: number;
  message: string;
}

export interface IBaseResponse<T> extends IResponse {
  data: T;
}

export interface IBaseListResponse<T> extends IResponse {
  data: T[];
  metadata: IMetaData;
}

export interface IBaseListFilter {
  page: number;
  limit: number;
}

export interface IBaseItem {
  id: string;
  created_at: string;
  updated_at: string;
}
