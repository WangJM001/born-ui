import React from 'react';
import { Button, Table } from '@utech/born-ui';

import { ColumnsType } from '@utech/born-ui/table';
import { tableListDataSource, TableListItem } from './service';

const columns: ColumnsType<TableListItem> = [
  {
    title: '名称',
    dataIndex: 'name',
    filters: true,
  },
  {
    title: '百分比',
    dataIndex: 'percent',
    dataType: 'percent',
    width: 130,
    sorter: true,
  },
  {
    title: '更新日期',
    dataIndex: 'updatedAt',
    dataType: 'date',
    width: 140,
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
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'option',
    width: 120,
    dataType: { type: 'option', actions: [<a key="option-0">操作</a>, <a key="option-1">删除</a>] },
  },
];

export default () => (
  <Table<TableListItem>
    columns={columns}
    dataSource={tableListDataSource}
    headerTitle="表格标题"
    options={{ search: true, reload: false, setting: true, fullScreen: true }}
    toolbar={[
      <Button key="new" type="primary">
        新增
      </Button>,
      <Button key="export">导出</Button>,
    ]}
    rowSelection={{
      alertOptionRender: () => <Button key="export">删除</Button>,
    }}
  />
);
