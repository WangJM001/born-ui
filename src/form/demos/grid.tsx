import React from 'react';
import { Form, Slider } from '@utech/born-ui';

export default () => (
  <Form
    style={{ maxWidth: 800 }}
    layout="vertical"
    column={3}
    items={[
      {
        label: '名称',
        name: 'name',
        rules: [{ required: true }],
        span: 2,
      },
      {
        label: '金额',
        name: 'currency',
        dataType: 'currency',
      },
      {
        label: '数字',
        name: 'number',
        dataType: 'number',
      },
      {
        label: '百分比',
        name: 'percent',
        dataType: 'percent',
      },
      {
        label: '日期',
        name: 'date',
        dataType: 'date',
      },
      {
        label: '时间',
        name: 'dateTime',
        dataType: 'dateTime',
      },
      {
        label: '日期范围',
        name: 'dateRange',
        dataType: 'dateRange',
      },
      {
        label: '时间范围',
        name: 'dateTimeRange',
        dataType: 'dateTimeRange',
      },
      {
        label: '文本框',
        name: 'textarea',
        dataType: 'textarea',
        span: 3,
      },
      {
        label: '自定义',
        name: 'custom',
        render: () => <Slider />,
        span: 3,
      },
    ]}
  />
);
