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

const InternalInputNumber = React.forwardRef<unknown, InputNumberProps>(
  ({ groupSeparator = ',', suffix, style, disabled, ...restProps }, ref) => (
    <div
      className={classNames(`${CLASS_NAME_PREFIX}-input-number`, {
        [`${CLASS_NAME_PREFIX}-input-number-disabled`]: disabled,
      })}
      style={style}
    >
      <AInputNumber
        ref={ref}
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
  ),
);

type InternalInputNumberType = typeof InternalInputNumber;

interface InputNumberInterface extends InternalInputNumberType {
  InputNumberRange: typeof InputNumberRange;
}

const InputNumber = InternalInputNumber as InputNumberInterface;

InputNumber.InputNumberRange = InputNumberRange;

export default InputNumber;
