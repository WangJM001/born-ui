import React from 'react';
import InputNumber, { InputNumberProps } from '../input-number';

export interface InputPercentProps extends InputNumberProps {}

const InputPercent = React.forwardRef<unknown, InputPercentProps>(
  (
    {
      min = 0,
      max = 100,
      suffix = '%',
      precision = 1,
      defaultValue,
      value,
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (v: string | number | undefined) => {
      if (onChange) {
        onChange(v && typeof v === 'number' ? v / 100 : v);
      }
    };

    return (
      <InputNumber
        ref={ref}
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
  },
);

export default InputPercent;
