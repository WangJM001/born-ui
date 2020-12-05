import React, { ReactNode } from 'react';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import { ColumnEmptyText } from './Table';
import { FormatSymbolType } from '../config-provider/context';

export type ColumnsDataType<T> =
  | ColumnsDataBaseType
  | ColumnsDataEnumType
  | ColumnsDataOptionType<T>
  | ColumnsDataTypeFunction<T>;

/**
 * currency 金额
 * textarea 文本框
 * option 操作 需要返回一个数组
 * date 日期 YYYY/MM/DD
 * dateRange 日期范围 YYYY/MM/DD[]
 * dateTime 日期和时间 YYYY/MM/DD HH:mm:ss
 * dateTimeRange 范围日期和时间 YYYY/MM/DD HH:mm:ss[]
 * percent: 百分比
 * number: 数值
 */
export type ColumnsDataBaseType =
  | 'currency'
  | 'textarea'
  | 'option'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'text'
  | 'percent'
  | 'number';

export type ColumnsDataEnumType = {
  type: 'enum';
  values: { [key: string]: ReactNode };
};

export type ColumnsDataOptionType<T> = {
  type: 'option';
  actions: React.ReactNode[] | ((record: T) => React.ReactNode[]);
};

export type ColumnsDataTypeFunction<T> = (
  item: T,
) => ColumnsDataBaseType | ColumnsDataEnumType | ColumnsDataOptionType<T>;

/**
 * render dataType object
 * @param text string | number
 * @param dataType ColumnsValueObjectType
 */
const defaultRenderTextByObject = <T, U = {}>(
  text: string | number,
  dataType: ColumnsDataEnumType | ColumnsDataOptionType<T>,
  item: T,
  columnEmptyText?: ColumnEmptyText,
) => {
  if (dataType.type === 'enum' && dataType.values) {
    const result = dataType.values[text];
    if (typeof result !== 'boolean' && typeof result !== 'number' && !result && columnEmptyText) {
      return columnEmptyText;
    }
    return result;
  }
  if (dataType.type === 'option' && dataType.actions && dataType.actions.length) {
    const options: ReactNode[] = [];
    (typeof dataType.actions === 'function' ? dataType.actions(item) : dataType.actions).forEach(
      (option, index) => {
        if (options.length) {
          // eslint-disable-next-line react/no-array-index-key
          options.push(<Divider key={`divider-${index}`} type="vertical" />);
        }
        options.push(option);
      },
    );
    return options;
  }
  return text;
};

/**
 * 根据不同的类型来转化数值
 * @param text
 * @param dataType
 */
const defaultRenderText = <T, U = {}>(
  text: string | number,
  dataType: ColumnsDataType<T>,
  index: number,
  formatSymbol: FormatSymbolType,
  item: T,
  columnEmptyText?: ColumnEmptyText,
): React.ReactNode => {
  // when dataType == function
  // item always not null
  if (typeof dataType === 'function' && item) {
    return defaultRenderText<T>(text, dataType(item), index, formatSymbol, item, columnEmptyText);
  }

  /**
   * 如果是枚举/选项的值
   */
  if (typeof dataType === 'object') {
    return defaultRenderTextByObject<T>(text as string, dataType, item, columnEmptyText);
  }

  /**
   * 如果是金额的值
   */
  if (dataType === 'currency' && (text || text === 0)) {
    return numeral(text).format(formatSymbol.currency);
  }

  /**
   *如果是日期的值
   */
  if (dataType === 'date' && text) {
    return dayjs(text).format(formatSymbol.date);
  }

  /**
   *如果是日期范围的值
   */
  if (dataType === 'dateRange' && text && Array.isArray(text) && text.length === 2) {
    // 值不存在的时候显示 "-"
    const [startText, endText] = text;
    return (
      <div>
        <span>{startText ? dayjs(startText).format(formatSymbol.date) : columnEmptyText}</span>
        <span>~</span>
        <span>{endText ? dayjs(endText).format(formatSymbol.date) : columnEmptyText}</span>
      </div>
    );
  }

  /**
   *如果是日期加时间类型的值
   */
  if (dataType === 'dateTime' && text) {
    return dayjs(text).format(formatSymbol.dateTime);
  }

  /**
   *如果是日期加时间类型的值的值
   */
  if (dataType === 'dateTimeRange' && text && Array.isArray(text) && text.length === 2) {
    // 值不存在的时候显示 "-"
    const [startText, endText] = text;
    return (
      <div>
        <span>{startText ? dayjs(startText).format(formatSymbol.dateTime) : columnEmptyText}</span>
        <span>~</span>
        <span>{endText ? dayjs(endText).format(formatSymbol.dateTime) : columnEmptyText}</span>
      </div>
    );
  }

  /**
   * 如果是数字
   */
  if (dataType === 'number' && (text || text === 0)) {
    return numeral(text).format(formatSymbol.number);
  }

  /**
   * 如果是百分比
   */
  if (dataType === 'percent' && (text || text === 0)) {
    return numeral(text).format(formatSymbol.percent);
  }

  if (columnEmptyText) {
    if (typeof text !== 'boolean' && typeof text !== 'number' && !text) {
      return typeof columnEmptyText === 'string' ? columnEmptyText : '-';
    }
  }

  return text;
};

export default defaultRenderText;
