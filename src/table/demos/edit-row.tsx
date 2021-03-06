import React, { useRef } from 'react';
import { Table, Button } from '@utech/born-ui';
import type { ColumnsType, ActionType } from '@utech/born-ui/table';
import type { TableListItem } from './service';
import { getTableListData } from './service';

export default () => {
  const actionRef = useRef<ActionType<TableListItem>>();

  const columns: ColumnsType<TableListItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      editor: true,
    },
    {
      title: '百分比',
      dataIndex: 'percent',
      dataType: 'percent',
      width: 140,
      editor: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updatedAt',
      dataType: 'date',
      width: 160,
      editor: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      dataType: {
        type: 'enum',
        values: {
          close: '关闭',
          running: '运行中',
          online: '已上线',
          error: '异常',
        },
      },
      width: 150,
      editor: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 125,
      dataType: {
        type: 'option',
        actions: (record) => [
          <a key="option-0" onClick={() => actionRef.current?.edit(record)}>
            编辑
          </a>,
        ],
      },
    },
  ];

  const handleEditSave = (values: TableListItem, originalRecord: TableListItem, index: number) => {
    console.log(values, originalRecord, index);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  return (
    <Table<TableListItem>
      actionRef={actionRef}
      columns={columns}
      request={getTableListData}
      headerTitle="表格标题"
      options={{ search: true, reload: true, setting: true, fullScreen: true }}
      toolbar={[
        <Button key="new" type="primary">
          新增
        </Button>,
        <Button key="export">导出</Button>,
      ]}
      onEditSave={handleEditSave}
    />
  );
};
