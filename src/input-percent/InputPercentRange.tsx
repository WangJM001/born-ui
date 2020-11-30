import { SwapRightOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import useMergeValue from 'use-merge-value';
import { CLASS_NAME_PREFIX } from '../constants';
import InputPercent, { InputPercentProps } from './InputPercent';

export interface InputPercentRangeProps extends Omit<InputPercentProps, 'value' | 'onChange'> {
  value?: [number | undefined, number | undefined];
  onChange?: (value: [number | undefined, number | undefined]) => void;
}

const InputPercentRange: FC<InputPercentRangeProps> = ({
  value: propsValue,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useMergeValue<[number | undefined, number | undefined]>(
    [undefined, undefined],
    {
      value: propsValue,
      onChange,
    },
  );

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const className = `${CLASS_NAME_PREFIX}-input-number-range`;
  return (
    <Input.Group
      compact
      className={classNames(`${className}-group`, { [`${className}-group-focused`]: focused })}
    >
      <InputPercent
        value={value[0]}
        placeholder="最小值"
        {...restProps}
        id="input-number-min"
        className={`${className}-min`}
        onChange={(v) => setValue([v as number, value[1]])}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <span className={`${className}-separator`}>
        <SwapRightOutlined />
      </span>
      <InputPercent
        value={value[1]}
        placeholder="最大值"
        {...restProps}
        id="input-number-max"
        className={`${className}-max`}
        onChange={(v) => setValue([value[0], v as number])}
      />
    </Input.Group>
  );
};

export default InputPercentRange;
