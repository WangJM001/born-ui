import type { ReactNode } from 'react';
import React from 'react';
import { Link } from 'umi';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import type { ColumnEmptyText } from './Table';
import type { FormatSymbolType } from '../config-provider/context';

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

export interface ColumnsDataEnumType {
  type: 'enum';
  values: Record<string, ReactNode>;
}

export interface ColumnsDataOptionType<T> {
  type: 'option';
  actions: React.ReactNode[] | ((record: T) => React.ReactNode[]);
}

export type ColumnsDataTypeFunction<T> = (
  item: T,
) => ColumnsDataBaseType | ColumnsDataEnumType | ColumnsDataOptionType<T>;

/**
 * render dataType object
 * @param text string | number
 * @param dataType ColumnsValueObjectType
 */
const defaultRenderTextByObject = <T,>(
  text: string | number,
  dataType: ColumnsDataEnumType | ColumnsDataOptionType<T>,
  item: T,
) => {
  if (dataType.type === 'enum' && dataType.values) {
    return dataType.values[text];
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
const defaultRenderText = <T,>(
  text: string | number,
  dataType: ColumnsDataType<T>,
  index: number,
  formatSymbol: FormatSymbolType,
  item: T,
  columnEmptyText?: ColumnEmptyText,
  link?: (record: T) => string,
): React.ReactNode => {
  let finalText: any = text;
  // when dataType == function
  // item always not null
  if (typeof dataType === 'function' && item) {
    finalText = defaultRenderText<T>(
      text,
      dataType(item),
      index,
      formatSymbol,
      item,
      columnEmptyText,
    );
  } else if (typeof dataType === 'object') {
    /**
     * 如果是枚举/选项的值
     */
    finalText = defaultRenderTextByObject<T>(text as string, dataType, item);
  } else if (dataType === 'currency' && (text || text === 0)) {
    /**
     * 如果是金额的值
     */
    finalText = numeral(text).format(formatSymbol.currency);
  } else if (dataType === 'date' && text) {
    /**
     *如果是日期的值
     */
    finalText = dayjs(text).format(formatSymbol.date);
  } else if (dataType === 'dateRange' && text && Array.isArray(text) && text.length === 2) {
    /**
     *如果是日期范围的值
     */
    // 值不存在的时候显示 "-"
    const [startText, endText] = text;
    finalText = (
      <div>
        <span>{startText ? dayjs(startText).format(formatSymbol.date) : columnEmptyText}</span>
        <span>~</span>
        <span>{endText ? dayjs(endText).format(formatSymbol.date) : columnEmptyText}</span>
      </div>
    );
  } else if (dataType === 'dateTime' && text) {
    /**
     *如果是日期加时间类型的值
     */
    finalText = dayjs(text).format(formatSymbol.dateTime);
  } else if (dataType === 'dateTimeRange' && text && Array.isArray(text) && text.length === 2) {
    /**
     *如果是日期加时间类型的值的值
     */
    // 值不存在的时候显示 "-"
    const [startText, endText] = text;
    finalText = (
      <div>
        <span>{startText ? dayjs(startText).format(formatSymbol.dateTime) : columnEmptyText}</span>
        <span>~</span>
        <span>{endText ? dayjs(endText).format(formatSymbol.dateTime) : columnEmptyText}</span>
      </div>
    );
  } else if (dataType === 'number' && (text || text === 0)) {
    /**
     * 如果是数字
     */
    finalText = numeral(text).format(formatSymbol.number);
  } else if (dataType === 'percent' && (text || text === 0)) {
    /**
     * 如果是百分比
     */
    finalText = numeral(text).format(formatSymbol.percent);
  }

  if (
    columnEmptyText &&
    typeof finalText !== 'boolean' &&
    typeof finalText !== 'number' &&
    !finalText
  ) {
    return typeof columnEmptyText === 'string' ? columnEmptyText : '-';
  }

  if (link) {
    return <Link to={link(item)}>{finalText}</Link>;
  }

  return finalText;
};

export default defaultRenderText;
