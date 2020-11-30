import InternalInputNumber, { InputNumberProps } from './InputNumber';
import InputNumberRange, { InputNumberRangeProps } from './InputNumberRange';

type InternalInputNumberType = typeof InternalInputNumber;

interface InputNumberInterface extends InternalInputNumberType {
  Range: typeof InputNumberRange;
}

const InputNumber = InternalInputNumber as InputNumberInterface;

InputNumber.Range = InputNumberRange;

export type { InputNumberProps, InputNumberRangeProps };

export default InputNumber;
