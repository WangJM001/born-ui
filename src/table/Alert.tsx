import React from 'react';
import { Space } from 'antd';
import { CLASS_NAME_PREFIX } from '../constants';

export interface TableAlertProps<T> {
  selectedRowKeys: (number | string)[];
  selectedRows: T[];
  alertInfoRender?:
    | ((props: { selectedRowKeys: (number | string)[]; selectedRows: T[] }) => React.ReactNode)
    | false;
  onCleanSelected: () => void;
  alertOptionRender?:
    | false
    | ((props: {
        onCleanSelected: () => void;
        selectedRowKeys: (number | string)[];
        selectedRows: T[];
      }) => React.ReactNode);
}

const TableAlert = <T,>({
  selectedRowKeys = [],
  onCleanSelected,
  selectedRows = [],
  alertInfoRender = () => (
    <Space>
      已选择
      <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>项
      <a onClick={onCleanSelected} key="0">
        清空选择
      </a>
    </Space>
  ),
  alertOptionRender,
}: TableAlertProps<T>) => {
  if (alertInfoRender === false) {
    return null;
  }

  const dom = alertInfoRender({ selectedRowKeys, selectedRows });
  if (dom === false) {
    return null;
  }

  return (
    <div className={`${CLASS_NAME_PREFIX}-table-alert`}>
      {alertInfoRender({ selectedRowKeys, selectedRows })}
      <Space>
        {alertOptionRender &&
          alertOptionRender({
            onCleanSelected,
            selectedRowKeys,
            selectedRows,
          })}
      </Space>
    </div>
  );
};

export default TableAlert;
