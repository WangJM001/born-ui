import React, { FC } from 'react';
import { Input } from 'antd';
import useMergeValue from 'use-merge-value';
import InputNumber, { InputNumberProps } from '.';
import { CLASS_NAME_PREFIX } from '../constants';

export interface InputNumberRangeProps extends Omit<InputNumberProps, 'value' | 'onChange'> {
  value?: [number | undefined, number | undefined];
  onChange?: (value: [number | undefined, number | undefined]) => void;
}

const InputNumberRange: FC<InputNumberRangeProps> = ({
  value: propsValue,
  onChange,
  ...restProps
}) => {
  const [value, setValue] = useMergeValue<[number | undefined, number | undefined]>(
    [undefined, undefined],
    {
      value: propsValue,
      onChange,
    },
  );
  const className = `${CLASS_NAME_PREFIX}-input-number-range`;
  return (
    <Input.Group compact>
      <InputNumber
        value={value[0]}
        placeholder="最小值"
        {...restProps}
        id="input-number-min"
        className={`${className}-left`}
        onChange={(v) => setValue([v as number, value[1]])}
      />
      <Input placeholder="~" disabled className={`${className}-split`} />
      <InputNumber
        value={value[1]}
        placeholder="最大值"
        {...restProps}
        id="input-number-max"
        className={`${className}-right`}
        onChange={(v) => setValue([value[0], v as number])}
      />
    </Input.Group>
  );
};

export default InputNumberRange;
