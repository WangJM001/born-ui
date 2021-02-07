import { useState, useRef } from 'react';
import { createContainer } from 'unstated-next';
import useMergeValue from 'use-merge-value';
import type { FormInstance } from 'antd/lib/form';
import type { UseFetchDataAction } from './hooks/useFetchData';
import type { ColumnsState, ColumnType, TableProps } from './Table';
import { getRowKey } from './utils';

export interface UseCounterProps {
  columnsStateMap?: Record<string, ColumnsState>;
  onColumnsStateChange?: (map: Record<string, ColumnsState>) => void;
}

function useCounter(props: UseCounterProps = {}) {
  const actionRef = useRef<UseFetchDataAction<any>>();
  const [columns, setColumns] = useState<ColumnType<any>[]>([]);
  const propsRef = useRef<TableProps<any, any>>();
  const editFormRef = useRef<FormInstance>(null);
  /** 开启行编辑 */
  const [editable, setEditable] = useState(false);
  const [editingKey, setEditingKey] = useState<React.Key>();
  // 用于排序的数组
  const [sortKeyColumns, setSortKeyColumns] = useState<(string | number)[]>([]);

  const [columnsMap, setColumnsMap] = useMergeValue<Record<string, ColumnsState>>(
    props.columnsStateMap || {},
    {
      value: props.columnsStateMap,
      onChange: props.onColumnsStateChange,
    },
  );
  return {
    action: actionRef,
    setAction: (newAction: UseFetchDataAction<any>) => {
      actionRef.current = newAction;
    },
    sortKeyColumns,
    setSortKeyColumns,
    columns,
    setColumns,
    propsRef,
    columnsMap,
    setColumnsMap,
    editFormRef,
    editable,
    setEditable,
    editingKey,
    setEditingKey,
    isEditing: (record: any) => getRowKey(record, propsRef.current?.rowKey) === editingKey,
  };
}

const Counter = createContainer<ReturnType<typeof useCounter>, UseCounterProps>(useCounter);

export { useCounter };

export default Counter;
