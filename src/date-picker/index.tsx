import InternalDatePicker, { DatePickerProps } from './DatePicker';
import RangePicker, { RangePickerProps } from './RangePicker';

type InternalDatePickType = typeof InternalDatePicker;

interface DatePickerInterface extends InternalDatePickType {
  RangePicker: typeof RangePicker;
}

const DatePicker = InternalDatePicker as DatePickerInterface;

DatePicker.RangePicker = RangePicker;

export type { DatePickerProps, RangePickerProps };

export default DatePicker;
