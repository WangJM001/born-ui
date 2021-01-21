import type { InputNumberProps } from './InputNumber';
import InternalInputNumber from './InputNumber';
import type { InputNumberRangeProps } from './InputNumberRange';
import InputNumberRange from './InputNumberRange';

type InternalInputNumberType = typeof InternalInputNumber;

interface InputNumberInterface extends InternalInputNumberType {
  Range: typeof InputNumberRange;
}

const InputNumber = InternalInputNumber as InputNumberInterface;

InputNumber.Range = InputNumberRange;

export type { InputNumberProps, InputNumberRangeProps };

export default InputNumber;
