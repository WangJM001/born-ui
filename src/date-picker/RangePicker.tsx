import React, { useContext, forwardRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker, {
  RangePickerBaseProps,
  RangePickerDateProps,
  RangePickerTimeProps,
} from 'antd/lib/date-picker/generatePicker';
import { ConfigContext } from '../config-provider';

const ADatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

type MergeProps<Props> = Omit<
  Props,
  'value' | 'onChange' | 'defaultValue' | 'defaultPickerValue'
> & {
  defaultValue?: [string, string];
  defaultPickerValue?: [string, string];
  value?: [string, string];
  onChange?: (value: [string, string]) => void;
};

export declare type RangePickerProps =
  | MergeProps<RangePickerBaseProps<Dayjs>>
  | MergeProps<RangePickerDateProps<Dayjs>>
  | MergeProps<RangePickerTimeProps<Dayjs>>;

const RangePicker = forwardRef<any, RangePickerProps>(
  ({ value, defaultValue, defaultPickerValue, onChange, picker = 'date', ...restProps }, ref) => {
    const { formatSymbol } = useContext(ConfigContext);
    let format = formatSymbol[picker];
    // @ts-ignore
    if (picker === 'date' && restProps.showTime) {
      format = formatSymbol.dateTime;
    }

    const formattedValue = value
      ? value.map((item) => (item ? dayjs(item) : undefined))
      : undefined;
    const formattedDefaultValue = defaultValue
      ? defaultValue.map((item) => (item ? dayjs(item) : undefined))
      : undefined;
    const formattedDefaultPickerValue = defaultPickerValue
      ? defaultPickerValue.map((item) => (item ? dayjs(item) : undefined))
      : undefined;

    const handleChange = (_: any, dateStr: [string, string]) => {
      if (onChange) {
        onChange(dateStr);
      }
    };

    return (
      <ADatePicker.RangePicker
        ref={ref}
        value={formattedValue as any}
        defaultValue={formattedDefaultValue as any}
        defaultPickerValue={formattedDefaultPickerValue as any}
        onChange={handleChange}
        picker={picker}
        format={format}
        {...restProps}
      />
    );
  },
);

export default RangePicker;
