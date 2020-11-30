import InternalInputPercent, { InputPercentProps } from './InputPercent';
import InputPercentRange, { InputPercentRangeProps } from './InputPercentRange';

type InternalInputPercentType = typeof InternalInputPercent;

interface InputPercentInterface extends InternalInputPercentType {
  Range: typeof InputPercentRange;
}

const InputPercent = InternalInputPercent as InputPercentInterface;

InputPercent.Range = InputPercentRange;

export type { InputPercentProps, InputPercentRangeProps };

export default InputPercent;
