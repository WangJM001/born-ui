/* eslint-disable @typescript-eslint/naming-convention */
import { DataIndex } from 'rc-table/lib/interface';
import { TableProps } from '.';
import { ColumnType } from './Table';

export const genDataIndexStr = (dataIndex: string | string[]) =>
  Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex;

/**
 *  根据 key 和 dataIndex 生成唯一 id
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (
  key?: string | number | undefined,
  dataIndex?: DataIndex,
  index?: number,
) => {
  if (key) {
    return key;
  }
  if (dataIndex) {
    if (Array.isArray(dataIndex)) {
      return dataIndex.join('-');
    }
    return dataIndex;
  }
  return `${index}`;
};

export const getRowKey = <T, U = {}>(record: T, rowKey: TableProps<any, any>['rowKey'] = 'id') =>
  typeof rowKey === 'function' ? rowKey(record) : record[rowKey];

/**
 * 根据dataType判断是否为操作列
 * @param dataType
 */
export const isOptionColumn = <T, U = {}>(record: T, dataType: ColumnType['dataType']): boolean => {
  if (typeof dataType === 'function' && record) {
    return isOptionColumn(record, dataType(record));
  }

  return (typeof dataType === 'object' && dataType.type === 'option') || dataType === 'option';
};

/**
 * desc->descend
 * asc->ascend
 * descend->desc
 * ascend->asc
 */
export const transformSortOrder = (direction?: 'desc' | 'descend' | 'asc' | 'ascend') => {
  if (!direction) {
    return undefined;
  }

  if (direction.endsWith('end')) {
    return direction.replace('end', '');
  }

  return `${direction}end`;
};
