import type { DatePickerProps } from './DatePicker';
import InternalDatePicker from './DatePicker';
import type { RangePickerProps } from './RangePicker';
import RangePicker from './RangePicker';

type InternalDatePickType = typeof InternalDatePicker;

interface DatePickerInterface extends InternalDatePickType {
  RangePicker: typeof RangePicker;
}

const DatePicker = InternalDatePicker as DatePickerInterface;

DatePicker.RangePicker = RangePicker;

export type { DatePickerProps, RangePickerProps };

export default DatePicker;
