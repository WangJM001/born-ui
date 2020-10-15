import React from 'react';
import InputNumber, { InputNumberProps } from '../input-number';
import InputPercentRange from './InputPercentRange';

export interface InputPercentProps extends InputNumberProps {}

const InputPercent = ({
  min = 0,
  max = 100,
  suffix = '%',
  precision = 1,
  defaultValue,
  value,
  onChange,
  ...restProps
}: InputPercentProps) => {
  const handleChange = (v: string | number | undefined) => {
    if (onChange) {
      onChange(v && typeof v === 'number' ? v / 100 : v);
    }
  };

  return (
    <InputNumber
      defaultValue={defaultValue ? defaultValue * 100 : defaultValue}
      value={value ? value * 100 : value}
      min={min}
      max={max}
      precision={precision}
      onChange={handleChange}
      suffix={suffix}
      {...restProps}
    />
  );
};

InputPercent.InputPercentRange = InputPercentRange;

export default InputPercent;
