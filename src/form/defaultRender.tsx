import type { ReactNode } from 'react';
import React from 'react';
import Input from '../input';
import InputNumber from '../input-number';
import DatePicker from '../date-picker';
import type { DataType } from './Form';
import Select from '../select';
import InputPercent from '../input-percent';

function defaultRender(dataType?: DataType): ReactNode {
  /**
   * 如果是枚举的值
   */
  if (typeof dataType === 'object' && dataType.type === 'enum') {
    return (
      <Select
        options={Object.entries(dataType.values).map(([key, value]) => ({
          label: value,
          value: key,
        }))}
      />
    );
  }

  /**
   * 如果是金额的值
   */
  if (dataType === 'currency') {
    return <InputNumber min={0} precision={2} suffix="元" />;
  }

  /**
   *如果是日期的值
   */
  if (dataType === 'date') {
    return <DatePicker />;
  }

  /**
   *如果是日期范围的值
   */
  if (dataType === 'dateRange') {
    return <DatePicker.RangePicker />;
  }

  /**
   *如果是日期加时间类型的值
   */
  if (dataType === 'dateTime') {
    return <DatePicker showTime />;
  }

  /**
   *如果是日期加时间类型的值的值
   */
  if (dataType === 'dateTimeRange') {
    return <DatePicker.RangePicker showTime />;
  }

  /**
   * 如果是数字
   */
  if (dataType === 'number') {
    return <InputNumber />;
  }

  /**
   * 如果是百分比
   */
  if (dataType === 'percent') {
    return <InputPercent />;
  }

  /**
   * 如果是文本框
   */
  if (dataType === 'textarea') {
    return <Input.TextArea />;
  }

  return <Input />;
}

export default defaultRender;
