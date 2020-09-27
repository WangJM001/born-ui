import React, { memo } from 'react';
import { InputNumberProps as AInputNumberProps } from 'antd/lib/input-number';
import { InputNumber as AInputNumber } from 'antd';
import { CLASS_NAME_PREFIX } from '../constants';
import InputNumberRange from './InputNumberRange';

export interface InputNumberProps extends AInputNumberProps {
  suffix?: React.ReactNode;
  /** 设置千分位标识符 */
  groupSeparator?: string;
}

const InputNumber = ({ groupSeparator = ',', suffix, style, ...restProps }: InputNumberProps) => (
  <div className={`${CLASS_NAME_PREFIX}-input-number`} style={style}>
    <AInputNumber
      {...(groupSeparator && {
        formatter: (value) => {
          const [integer, decimal] = `${value}`.split('.');
          let result = integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
          if (typeof decimal !== 'undefined') {
            result += `.${decimal}`;
          }
          return result;
        },
        parser: (value) => `${value}`.replace(new RegExp(`(${groupSeparator}*)`, 'g'), ''),
      })}
      placeholder="请输入"
      {...restProps}
    />
    <div className={`${CLASS_NAME_PREFIX}-input-number-suffix`}>{suffix}</div>
  </div>
);

InputNumber.InputNumberRange = InputNumberRange;

export default memo(InputNumber);
