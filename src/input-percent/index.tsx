import type { InputPercentProps } from './InputPercent';
import InternalInputPercent from './InputPercent';
import type { InputPercentRangeProps } from './InputPercentRange';
import InputPercentRange from './InputPercentRange';

type InternalInputPercentType = typeof InternalInputPercent;

interface InputPercentInterface extends InternalInputPercentType {
  Range: typeof InputPercentRange;
}

const InputPercent = InternalInputPercent as InputPercentInterface;

InputPercent.Range = InputPercentRange;

export type { InputPercentProps, InputPercentRangeProps };

export default InputPercent;
