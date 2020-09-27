import get from '../_utils/get';
import { ColumnType } from './Table';

/**
 * 根据dataType生成默认排序方法
 * @param dataType
 */
const defaultColumnsSorter = <T, U = {}>(
  dataIndex: string | string[],
  dataType: ColumnType<T>['dataType'],
) => {
  function getValue(record: T) {
    return Array.isArray(dataIndex) ? get(record, dataIndex as string[]) : record[dataIndex];
  }

  if (typeof dataType === 'object' && dataType.type === 'enum') {
    return (a: T, b: T) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      return (dataType.values[aValue] || '') > (dataType.values[bValue] || '') ? 1 : -1;
    };
  }
  if (dataType === 'dateRange' || dataType === 'dateTimeRange') {
    return (a: T, b: T) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      return (aValue[0] || '') > (bValue[0] || '') ? 1 : -1;
    };
  }

  return (a: T, b: T) => {
    const aValue = getValue(a);
    const bValue = getValue(b);
    return (aValue || '') > (bValue || '') ? 1 : -1;
  };
};

export default defaultColumnsSorter;
