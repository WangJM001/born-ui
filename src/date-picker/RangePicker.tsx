import React, { memo, useCallback, useContext, forwardRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker, {
  RangePickerBaseProps,
  RangePickerDateProps,
  RangePickerTimeProps,
} from 'antd/lib/date-picker/generatePicker';
import { ConfigContext } from '../config-provider';

const ADatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

type MergeProps<Props> = Omit<Props, 'value' | 'onChange'> & {
  value?: [string, string];
  onChange?: (value: [string, string]) => void;
};

export declare type RangePickerProps =
  | MergeProps<RangePickerBaseProps<Dayjs>>
  | MergeProps<RangePickerDateProps<Dayjs>>
  | MergeProps<RangePickerTimeProps<Dayjs>>;

const RangePicker = forwardRef<any, RangePickerProps>(
  ({ value, onChange, picker = 'date', ...restProps }, ref) => {
    const { formatSymbol } = useContext(ConfigContext);
    let format = formatSymbol[picker];
    // @ts-ignore
    if (picker === 'date' && restProps.showTime) {
      format = formatSymbol.dateTime;
    }

    const newValue = value ? value.map((item) => (item ? dayjs(item) : undefined)) : undefined;

    const handleChange = useCallback(
      (_, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
      [onChange],
    );

    return (
      <ADatePicker.RangePicker
        ref={ref}
        value={newValue as any}
        onChange={handleChange}
        picker={picker}
        format={format}
        {...restProps}
      />
    );
  },
);

export default memo(RangePicker);
