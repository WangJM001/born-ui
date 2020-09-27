export type RequestData<T> = RequestListData<T> | RequestPagingData<T>;

/**
 * 不分页请求接口
 */
export interface RequestListData<T> {
  data: T[];
  success?: boolean;
  [key: string]: any;
}

/**
 * 分页请求接口
 */
export interface RequestPagingData<T> {
  data: { items: T[]; totalRow?: number; [key: string]: any };
  success?: boolean;
  [key: string]: any;
}
