import React, { memo, useCallback, useContext, forwardRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker, {
  PickerBaseProps,
  PickerDateProps,
  PickerTimeProps,
} from 'antd/lib/date-picker/generatePicker';
import { ConfigContext } from '../config-provider';

const ADatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

declare type MergeProps<Props> = Omit<Props, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
};

export declare type DatePickerProps =
  | MergeProps<PickerBaseProps<Dayjs>>
  | MergeProps<PickerDateProps<Dayjs>>
  | MergeProps<PickerTimeProps<Dayjs>>;

const DatePicker = forwardRef<any, DatePickerProps>(
  ({ value, onChange, picker = 'date', ...restProps }, ref) => {
    const { formatSymbol } = useContext(ConfigContext);
    let format = formatSymbol[picker];
    // @ts-ignore
    if (picker === 'date' && restProps.showTime) {
      format = formatSymbol.dateTime;
    }

    const newValue = value ? dayjs(value) : undefined;

    const handleChange = useCallback(
      (_, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
      [onChange],
    );

    return (
      <ADatePicker
        ref={ref}
        value={newValue}
        onChange={handleChange}
        picker={picker}
        format={format}
        {...restProps}
      />
    );
  },
);

export default memo(DatePicker);
