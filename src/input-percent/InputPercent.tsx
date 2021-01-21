import React from 'react';
import type { InputNumberProps } from '../input-number';
import InputNumber from '../input-number';

export type InputPercentProps = InputNumberProps;

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
