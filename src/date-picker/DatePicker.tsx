import React, { useContext, forwardRef } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import type {
  PickerBaseProps,
  PickerDateProps,
  PickerTimeProps,
} from 'antd/lib/date-picker/generatePicker';
import generatePicker from 'antd/lib/date-picker/generatePicker';
import { ConfigContext } from '../config-provider';

const ADatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

declare type MergeProps<Props> = Omit<
  Props,
  'value' | 'onChange' | 'defaultValue' | 'defaultPickerValue'
> & {
  defaultValue?: string;
  defaultPickerValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export declare type DatePickerProps =
  | MergeProps<PickerBaseProps<Dayjs>>
  | MergeProps<PickerDateProps<Dayjs>>
  | MergeProps<PickerTimeProps<Dayjs>>;

const DatePicker = forwardRef<any, DatePickerProps>(
  ({ value, defaultValue, defaultPickerValue, onChange, picker = 'date', ...restProps }, ref) => {
    const { formatSymbol } = useContext(ConfigContext);
    let format = formatSymbol[picker];
    // @ts-ignore
    if (picker === 'date' && restProps.showTime) {
      format = formatSymbol.dateTime;
    }

    const formattedValue = value ? dayjs(value) : undefined;
    const formattedDefaultValue = defaultValue ? dayjs(defaultValue) : undefined;
    const formattedDefaultPickerValue = defaultPickerValue ? dayjs(defaultPickerValue) : undefined;

    const handleChange = (_: Dayjs | null, dateStr: string) => {
      if (onChange) {
        onChange(dateStr);
      }
    };

    return (
      <ADatePicker
        ref={ref}
        value={formattedValue}
        defaultValue={formattedDefaultValue}
        defaultPickerValue={formattedDefaultPickerValue}
        onChange={handleChange}
        picker={picker}
        format={format}
        {...restProps}
      />
    );
  },
);

export default DatePicker;
