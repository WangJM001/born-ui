import React from 'react';
import { Button, Radio, Table, Card, Select } from '@utech/born-ui';
import { ColumnsType } from '@utech/born-ui/table';
import { getTableListData, TableListItem } from './service';

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
  <div style={{ padding: 24, margin: '-40px -24px', backgroundColor: '#f0f2f5' }}>
    <Table<TableListItem>
      columns={columns}
      request={getTableListData}
      headerTitle="表格标题"
      toolbar={[
        <Button key="new" type="primary">
          新增
        </Button>,
      ]}
      extraRender={(params) => {
        console.log('params:', params);
        return <Card>Extra Content</Card>;
      }}
      searchForm={{
        initialValues: { status: '1', other: '2' },
        items: [
          [
            {
              label: '关键字',
              name: 'keyword',
              width: '100%',
            },
            {
              label: '状态',
              name: 'status',
              render: () => (
                <Radio.Group>
                  <Radio.Button value="0">关闭</Radio.Button>
                  <Radio.Button value="1">运行中</Radio.Button>
                  <Radio.Button value="2">已上线</Radio.Button>
                  <Radio.Button value="3">异常</Radio.Button>
                </Radio.Group>
              ),
            },
            {
              label: '其他',
              name: 'other',
              render: () => (
                <Select
                  options={[
                    { value: '1', label: '一' },
                    { value: '2', label: '二' },
                  ]}
                />
              ),
              width: 300,
            },
          ],
          [
            {
              label: '更新日期',
              name: 'updatedAt',
              dataType: 'dateRange',
              width: 300,
            },
          ],
        ],
      }}
    />
  </div>
);
