import React from 'react';
import { Form, InputNumber, Slider } from '@utech/born-ui';

export default () => (
  <Form
    style={{ maxWidth: 650 }}
    items={[
      {
        label: '名称',
        name: 'name',
        rules: [{ required: true }],
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
        rules: [{ required: true }],
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
      },
      {
        label: '金额范围',
        name: 'currencyRange',
        render: () => <InputNumber.Range suffix="万" />,
      },
      {
        label: '自定义',
        name: 'custom',
        render: () => <Slider />,
      },
    ]}
  />
);
