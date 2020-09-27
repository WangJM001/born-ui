import React from 'react';
import { Dayjs } from 'dayjs';
import { PickerTimeProps } from 'antd/lib/date-picker/generatePicker';
import { Omit } from 'antd/lib/_util/type';
import DatePicker from '../date-picker';

export interface TimePickerProps
  extends Omit<PickerTimeProps<Dayjs>, 'picker' | 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
