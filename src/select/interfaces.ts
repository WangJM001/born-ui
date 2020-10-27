import { SelectProps as ASelectProps, SelectValue } from 'antd/lib/select';
import { OptionsType } from 'rc-select/lib/interface';
import { RequestListData, RequestPagingData } from '../interface';

export declare type RawValue = string | number;

export declare type ValueType<T> = RawValue | RawValue[] | T | T[];

export interface SelectBaseProps<T>
  extends Omit<ASelectProps<SelectValue>, 'onChange' | 'value' | 'showSearch' | 'defaultValue'> {
  /**
   * 代替showSearch
   * string 值为分页远程请求时属性名
   */
  search?: string | false;
  defaultValue?: ValueType<T>;
  value?: ValueType<T>;
  onChange?: (value: ValueType<T>, options: OptionsType | OptionsType[number]) => void;
}

export interface RequestBaseProps<T> extends Omit<SelectBaseProps<T>, 'options'> {
  /**
   * 值为false时，不执行request
   */
  requestReady?: boolean;
  /**
   * 对数据进行一些处理
   */
  formatData?: (data: T[]) => any[];
  /**
   * 自定义渲染Option
   */
  renderOption?: (data: T) => React.ReactNode;
  /**
   * 值转换
   * eq: value=>T[transform.value]
   */
  transform?: {
    value: string;
    label: string;
    disabled?: string;
  };
}

export interface SelectRequestWithPaginationProps<T, U extends Record<string, any>>
  extends RequestBaseProps<T> {
  /**
   * 一个获得 dataSource 的方法
   */
  request: (
    params: U & {
      pageSize: number;
      pageNumber: number;
    },
  ) => Promise<RequestPagingData<T>>;
  /**
   * 请求接口参数
   */
  params?: U;
  /**
   * 分页加载数据，滚动加载
   */
  pagination: true;
}

export interface SelectRequestWithoutPaginationWithParamsProps<T, U extends Record<string, any>>
  extends RequestBaseProps<T> {
  /**
   * 一个获得 dataSource 的方法
   */
  request: (params: U) => Promise<RequestListData<T>>;
  /**
   * 请求参数
   */
  params: U;
  /**
   * 分页加载数据，滚动加载
   */
  pagination?: false;
}

export interface SelectRequestWithoutPaginationWithoutParamsProps<T> extends RequestBaseProps<T> {
  /**
   * 一个获得 dataSource 的方法
   */
  request: () => Promise<RequestListData<T>>;
  /**
   * 分页加载数据，滚动加载
   */
  pagination?: false;
}
