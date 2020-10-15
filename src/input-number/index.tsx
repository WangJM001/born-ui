import React from 'react';
import classNames from 'classnames';
import { InputNumberProps as AInputNumberProps } from 'antd/lib/input-number';
import { InputNumber as AInputNumber } from 'antd';
import { CLASS_NAME_PREFIX } from '../constants';
import InputNumberRange from './InputNumberRange';

export interface InputNumberProps extends AInputNumberProps {
  suffix?: React.ReactNode;
  /** 设置千分位标识符 */
  groupSeparator?: string;
}

const InputNumber = ({
  groupSeparator = ',',
  suffix,
  style,
  disabled,
  ...restProps
}: InputNumberProps) => (
  <div
    className={classNames(`${CLASS_NAME_PREFIX}-input-number`, {
      [`${CLASS_NAME_PREFIX}-input-number-disabled`]: disabled,
    })}
    style={style}
  >
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
      disabled={disabled}
      {...restProps}
    />
    <div className={`${CLASS_NAME_PREFIX}-input-number-suffix`}>{suffix}</div>
  </div>
);

InputNumber.InputNumberRange = InputNumberRange;

export default InputNumber;
