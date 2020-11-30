import useRequest from '@ahooksjs/use-request';
import { Spin } from 'antd';
import ASelect from 'antd/lib/select';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { stringify } from 'use-json-comparison';
import { CLASS_NAME_PREFIX } from '../constants';
import { RequestData, RequestPagingData } from '../interface';
import {
  ValueType,
  SelectBaseProps,
  RequestBaseProps,
  SelectRequestWithoutPaginationWithParamsProps,
  SelectRequestWithPaginationProps,
  SelectRequestWithoutPaginationWithoutParamsProps,
} from './interfaces';

export type SelectPropsType<T, U> =
  | SelectBaseProps<T>
  | SelectRequestWithPaginationProps<T, U>
  | SelectRequestWithoutPaginationWithParamsProps<T, U>
  | SelectRequestWithoutPaginationWithoutParamsProps<T>;

const { Option } = ASelect;

const PAGE_SIZE = 30;
// 下拉自动加载，距离底部距离阈值
const THRESHOLD = 10;

const filterOption = (input: string, option: any) => {
  if (option && option.label && typeof option.label === 'string') {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  if (option && option.children && typeof option.children === 'string') {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  return false;
};

const transferValue = <T, U = any>(
  value: T | T[],
  transform?: RequestBaseProps<T>['transform'],
  labelInValue?: boolean,
) => {
  if (!value) return value;

  if (transform && labelInValue) {
    if (Array.isArray(value)) {
      return value.map((v: ValueType<T>) => ({
        label: v[transform.label],
        value: v[transform.value],
        disabled: transform.disabled && !!v[transform.disabled],
      }));
    }
    return {
      label: value[transform.label],
      value: value[transform.value],
      disabled: transform.disabled && !!value[transform.disabled],
    };
  }

  return value;
};

const Select = <T extends {}, U extends Record<string, any> = {}>(props: SelectPropsType<T, U>) => {
  const {
    request,
    params: propsParams,
    formatData,
    requestReady = true,
    search = 'keyword',
    pagination,
    defaultValue,
    value,
    onChange,
    transform,
    renderOption,
    labelInValue: propsLabelInValue,
    onPopupScroll,
    listHeight = 256,
    onSearch,
    onBlur,
    children,
    options: propsOptions,
    ...restProps
  } = props as any;
  const [searchValue, setSearchValue] = useState<string>();
  const { data, loading, loadingMore, loadMore, noMore, reload } = useRequest<any, RequestData<T>>(
    (d) => {
      const pageNumber = d ? d.list.length / PAGE_SIZE + 1 : 1;
      let searchName = 'keyword';
      if (search) {
        searchName = search;
      } else if (transform) {
        searchName = transform.label;
      }

      let params = propsParams as U;
      if (pagination) {
        params = {
          pageNumber,
          pageSize: PAGE_SIZE,
          ...params,
          [searchName]: searchValue,
        };
      }

      return request ? request(params) : null;
    },
    {
      manual: true,
      loadMore: true,
      formatResult: (x): { total: number; list: T[] } => {
        const list = pagination ? (x as RequestPagingData<T>).data.items : x.data;
        return {
          total: pagination ? (x as RequestPagingData<T>).data.totalRow : x.data.length,
          list: formatData ? formatData(list) : list,
        };
      },
      isNoMore: (d) => (d ? d.list.length >= d.total : false),
    },
  );

  useEffect(() => {
    if (request && requestReady) {
      reload();
    }
  }, [stringify(propsParams || {}), searchValue, requestReady]);

  const { list = [] } = data || {};

  // 分页加载强制开启，防止设置默认值出问题
  const labelInValue = pagination ? true : propsLabelInValue;

  const handlePopupScroll = (event: any) => {
    if (onPopupScroll) onPopupScroll(event);
    if (noMore || loadingMore) return;

    const { scrollTop, scrollHeight } = event.target;
    if (scrollTop + listHeight + THRESHOLD >= scrollHeight) {
      loadMore();
    }
  };

  const handleSearch = debounce((v: string) => {
    setSearchValue(v.length ? v : undefined);

    if (onSearch) onSearch(v);
  }, 500);

  const handleValueChange = (selectedValue: any, option: any) => {
    if (onChange) {
      let finalValue = selectedValue;
      if (request && labelInValue) {
        const key = transform ? transform.value : 'value';
        if (Array.isArray(selectedValue)) {
          const values = selectedValue.map((v) => v.value);
          // 多选模式
          const originalValues = list.filter((item: T) => values.includes(item[key]));
          if (originalValues && originalValues.length > 0) finalValue = originalValues;
        } else {
          const originalValue = list.find((item: T) => item[key] === selectedValue.value);
          if (originalValue) finalValue = originalValue;
        }
      }
      onChange(finalValue, option);
    }
  };

  const handleBlur = (event: any) => {
    setSearchValue(undefined);

    if (onBlur) onBlur(event);
  };

  let options = propsOptions;
  if (transform && !propsOptions) {
    options = list.map((item: T) => ({
      label: item[transform.label],
      value: item[transform.value],
      disabled: transform.disabled && !!item[transform.disabled],
    }));
  }

  if (loadingMore && options) {
    options.push({
      label: <Spin spinning size="small" className={`${CLASS_NAME_PREFIX}-select-spin`} />,
      value: 'spinning',
      disabled: true,
    });
  }

  return (
    <ASelect<any>
      {...restProps}
      showSearch={!!search}
      loading={loading}
      placeholder="请选择"
      filterOption={pagination ? () => true : filterOption}
      defaultValue={transferValue(defaultValue, transform, labelInValue)}
      value={transferValue(value, transform, labelInValue)}
      onChange={handleValueChange}
      labelInValue={labelInValue}
      options={options}
      onPopupScroll={pagination ? handlePopupScroll : undefined}
      onSearch={pagination ? handleSearch : undefined}
      onBlur={handleBlur}
    >
      {renderOption ? (
        <>
          {list.map((option: T) => renderOption(option))}
          {loadingMore && (
            <Option key="spinning" value="spinning" disabled>
              <Spin spinning size="small" className={`${CLASS_NAME_PREFIX}-select-spin`} />
            </Option>
          )}
        </>
      ) : null}
    </ASelect>
  );
};

export default Select;
