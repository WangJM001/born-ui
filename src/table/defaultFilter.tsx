import React from 'react';
import dayjs from 'dayjs';
import { Button, Input } from 'antd';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import { ColumnsDataEnumType, ColumnsDataOptionType } from './defaultRender';
import { ColumnType } from './Table';
import { CLASS_NAME_PREFIX } from '../constants';
import InputNumberRange from '../input-number/InputNumberRange';
import InputPercentRange from '../input-percent/InputPercentRange';
import get from '../_utils/get';
import DatePicker from '../date-picker';

type FilterDropdownSelectedKeyType = [
  [string | number | undefined, string | number | undefined] | string,
];

const defaultOnFilter = <T, U = {}>(
  dataType: ColumnType<T>['dataType'],
  value: string | [number | undefined, number | undefined],
  record: T,
  dataIndex: string | string[],
) => {
  const itemValue = Array.isArray(dataIndex)
    ? get(record, dataIndex as string[])
    : record[dataIndex];

  if (
    (dataType === 'currency' || dataType === 'number' || dataType === 'percent') &&
    Array.isArray(value)
  ) {
    return (!value[0] || itemValue >= value[0]) && (!value[1] || itemValue <= value[1]);
  }

  if (
    (dataType === 'date' || dataType === 'dateTime') &&
    Array.isArray(value) &&
    value.length === 2
  ) {
    const unit = dataType === 'date' ? 'day' : 'second';
    const searchStart = dayjs(value[0]);
    const searchEnd = dayjs(value[1]);
    const source = dayjs(itemValue);
    return (
      (source.isAfter(searchStart, unit) || source.isSame(searchStart, unit)) &&
      (source.isBefore(searchEnd, unit) || source.isSame(searchEnd, unit))
    );
  }

  if (
    (dataType === 'dateRange' || dataType === 'dateTimeRange') &&
    Array.isArray(value) &&
    value.length === 2 &&
    Array.isArray(itemValue) &&
    itemValue.length === 2
  ) {
    const unit = dataType === 'dateRange' ? 'day' : 'second';
    const searchStart = dayjs(value[0]);
    const searchEnd = dayjs(value[1]);
    const sourceStart = dayjs(itemValue[0]);
    const sourceEnd = dayjs(itemValue[1]);
    return (
      (sourceStart.isAfter(searchStart, unit) || sourceStart.isSame(searchStart, unit)) &&
      (sourceEnd.isBefore(searchEnd, unit) || sourceEnd.isSame(searchEnd, unit))
    );
  }

  if (typeof dataType === 'object' && dataType.type === 'enum') {
    return String(itemValue) === String(value);
  }

  return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
};

const defaultColumnsFilterByObject = <T, U = {}>(
  dataType: ColumnsDataEnumType | ColumnsDataOptionType<T>,
) => {
  if (dataType.type === 'enum' && dataType.values) {
    return {
      filters: Object.entries(dataType.values).map(([key, value]) => ({
        text: value,
        value: key,
      })),
    };
  }
  return undefined;
};

/**
 * 根据dataType生成过滤组件
 * @param dataType
 * @param request false 则认为是本地模式，采用前端过滤
 */
const defaultColumnsFilter = <T, U = {}>(
  dataIndex: string | string[],
  dataType: ColumnType<T>['dataType'],
  request: boolean,
) => {
  /**
   * 类型不确定无法生成统一的filter
   */
  if (typeof dataType === 'function') {
    return undefined;
  }
  const onFilter = request
    ? undefined
    : (value: string, record: T) => defaultOnFilter(dataType, value, record, dataIndex);

  /**
   * 如果是枚举的值
   */
  if (typeof dataType === 'object') {
    return { ...defaultColumnsFilterByObject(dataType), onFilter };
  }

  const filterDropdown = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps & {
    selectedKeys: FilterDropdownSelectedKeyType;
    setSelectedKeys: (selectedKeys: FilterDropdownSelectedKeyType) => void;
  }) => {
    const className = `${CLASS_NAME_PREFIX}-table-column-filter`;

    const btnNode = [
      <Button
        key="filter-btn-search"
        type="primary"
        onClick={confirm}
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        搜索
      </Button>,
      <Button key="filter-btn-reset" onClick={clearFilters} size="small" style={{ width: 90 }}>
        重置
      </Button>,
    ];

    let content;

    switch (dataType) {
      case 'currency':
      case 'number':
        content = (
          <>
            <div className={`${className}-pane`}>
              <InputNumberRange
                value={selectedKeys[0] as [number, number]}
                onChange={(value) => setSelectedKeys([value])}
              />
            </div>
            {btnNode}
          </>
        );
        break;
      case 'percent':
        content = (
          <>
            <div className={`${className}-pane`}>
              <InputPercentRange
                value={selectedKeys[0] as [number, number]}
                onChange={(value) => setSelectedKeys([value])}
              />
            </div>
            {btnNode}
          </>
        );
        break;
      case 'date':
      case 'dateRange':
      case 'dateTime':
      case 'dateTimeRange':
        content = (
          <>
            <div className={`${className}-pane`}>
              <DatePicker.RangePicker
                key="editor-datepicker"
                value={selectedKeys[0] as any}
                onChange={((value) => setSelectedKeys([value])) as (values: any) => void}
                showTime={dataType === 'dateTime'}
              />
            </div>
            {btnNode}
          </>
        );
        break;
      default:
        content = (
          <>
            <div className={`${className}-pane`}>
              <Input
                placeholder="请输入"
                value={selectedKeys[0] as string}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={confirm}
                style={{ width: 188 }}
              />
            </div>
            {btnNode}
          </>
        );
        break;
    }

    return <div style={{ padding: 8, textAlign: 'center' }}>{content}</div>;
  };

  return { filters: undefined, filterDropdown, onFilter };
};

export default defaultColumnsFilter;
