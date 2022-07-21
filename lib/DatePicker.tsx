import { FunctionalComponent, h, SetupContext } from 'vue';
import { Assign, PickByValueExact } from 'utility-types';
import Picker, { PickerProps, SlotProps } from './Picker';
import Calendar from './calendar/Calendar';
import CalendarRange from './calendar/CalendarRange';
import TimePanel from './time/TimePanel';
import TimeRange from './time/TimeRange';
import DateTime, { DateTimeProps } from './datetime/DateTime';
import DateTimeRange, { DateTimeRangeProps } from './datetime/DateTimeRange';
import { pick } from './util/base';
import { IconCalendar, IconTime } from './svg';
import { keys, resolveProps } from './vueUtil';

type DatePickerProps = Assign<DateTimeProps, PickerProps>;

type DatePickerRangeProps = {
  range: true;
} & Assign<DateTimeRangeProps, PickerProps>;

export type DatePickerComponentProps = DatePickerProps | DatePickerRangeProps;

const booleanKeys = keys<PickByValueExact<Required<DatePickerComponentProps>, boolean>>()([
  'range',
  'open',
  'appendToBody',
  'clearable',
  'confirm',
  'disabled',
  'editable',
  'multiple',
  'partialUpdate',
  'showHour',
  'showMinute',
  'showSecond',
  'showTimeHeader',
  'showTimePanel',
  'showWeekNumber',
  'use12h',
  'holidayClickable',
]);

const formatMap = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  year: 'YYYY',
  month: 'YYYY-MM',
  time: 'HH:mm:ss',
  week: 'w',
};

function DatePicker(originalProps: DatePickerComponentProps, { slots }: SetupContext) {
  const type = originalProps.type || 'date';
  const format = originalProps.format || formatMap[type] || formatMap.date;
  const props = { ...resolveProps(originalProps, booleanKeys), type, format };

  return (
    <Picker {...pick(props, Picker.props)}>
      {{
        content: (slotProps: SlotProps) => {
          if (props.range) {
            const Content =
              type === 'time' ? TimeRange : type === 'datetime' ? DateTimeRange : CalendarRange;
            return h(Content, pick({ ...props, ...slotProps }, Content.props));
          } else {
            const Content = type === 'time' ? TimePanel : type === 'datetime' ? DateTime : Calendar;
            return h(Content, pick({ ...props, ...slotProps }, Content.props));
          }
        },
        ['icon-calendar']: () => (type === 'time' ? <IconTime /> : <IconCalendar />),
        ...slots,
      }}
    </Picker>
  );
}

export default DatePicker as FunctionalComponent<DatePickerComponentProps, any>;
