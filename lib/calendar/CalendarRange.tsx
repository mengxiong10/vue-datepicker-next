import { computed, ref, watchEffect } from 'vue';
import { usePrefixClass } from '../context';
import {
  diffCalendarMonths,
  isValidDate,
  isValidRangeDate,
  setMonth,
  startOfDay,
} from '../util/date';
import Calendar, { CalendarProps, calendarProps } from './Calendar';
import { defineVueComponent, withDefault } from '../vueUtil';
import { PickerType } from '../type';

export type DateRange = [Date, Date];

export interface CalendarRangeProps
  extends Omit<CalendarProps, 'value' | 'defaultValue' | 'onUpdate:value'> {
  value?: Date[];
  defaultValue?: Date | Date[];
  ['onUpdate:value']?: (v: Date[], type: string) => void;
}

const inRange = (date: Date, range: [Date, Date]) => {
  const value = date.getTime();
  let [min, max] = range.map((v) => v.getTime());
  if (min > max) {
    [min, max] = [max, min];
  }
  return value > min && value < max;
};

function CalendarRange(originalProps: CalendarRangeProps) {
  const props = withDefault(originalProps, {
    defaultValue: new Date(),
    type: 'date' as PickerType,
  });

  const prefixClass = usePrefixClass();

  const defaultValues = computed(() => {
    let values = Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue, props.defaultValue];
    values = values.map((v) => startOfDay(v));
    if (isValidRangeDate(values)) {
      return values;
    }
    return [new Date(), new Date()].map((v) => startOfDay(v)) as [Date, Date];
  });

  const innerValue = ref<DateRange>([new Date(NaN), new Date(NaN)]);
  watchEffect(() => {
    if (isValidRangeDate(props.value)) {
      innerValue.value = props.value;
    }
  });

  const handlePick = (date: Date, type: string) => {
    const [startValue, endValue] = innerValue.value;
    if (isValidDate(startValue) && !isValidDate(endValue)) {
      if (startValue.getTime() > date.getTime()) {
        innerValue.value = [date, startValue];
      } else {
        innerValue.value = [startValue, date];
      }
      props['onUpdate:value']?.(innerValue.value, type);
    } else {
      innerValue.value = [date, new Date(NaN)];
    }
  };
  const calendars = ref<[Date, Date]>([new Date(), new Date()]);
  const calendarMinDiff = computed(() => {
    if (props.type === 'year') return 10 * 12; // type:year  min 10 year
    if (props.type === 'month') return 1 * 12; //type:month min 1 year
    return 1; // type:date  min 1 month
  });

  const adjustCalendars = (calendars: [Date, Date], index: 0 | 1) => {
    const diff = diffCalendarMonths(calendars[0], calendars[1]);
    const gap = calendarMinDiff.value - diff;
    if (gap > 0) {
      const values = calendars.slice(0, 2) as [Date, Date];
      values[index] = setMonth(values[index], (v) => v + (index === 0 ? -gap : gap));
      return values;
    }
    return calendars;
  };

  const updateCalendarStart = (date: Date) => {
    calendars.value = adjustCalendars([date, calendars.value[1]], 1);
  };
  const updateCalendarEnd = (date: Date) => {
    calendars.value = adjustCalendars([calendars.value[0], date], 0);
  };

  watchEffect(() => {
    const dates = isValidRangeDate(props.value) ? props.value : defaultValues.value;
    calendars.value = adjustCalendars(dates, 1);
  });

  const hoveredValue = ref<Date | null>(null);
  const handleMouseEnter = (v: Date) => (hoveredValue.value = v);
  const handleMouseLeave = () => (hoveredValue.value = null);

  const getRangeClasses = (cellDate: Date, currentDates: Date[], classnames: string) => {
    const outerClasses = props.getClasses
      ? props.getClasses(cellDate, currentDates, classnames)
      : [];
    const classes: string[] = Array.isArray(outerClasses) ? outerClasses : [outerClasses];
    if (
      !/disabled|active/.test(classnames) &&
      currentDates.length === 2 &&
      inRange(cellDate, currentDates as [Date, Date])
    ) {
      classes.push('in-range');
    }
    if (
      currentDates.length === 1 &&
      hoveredValue.value &&
      inRange(cellDate, [currentDates[0], hoveredValue.value])
    ) {
      return classes.concat('hover-in-range');
    }
    return classes;
  };

  return () => {
    const calendarRange = calendars.value.map((calendar, index) => {
      const calendarProps = {
        ...props,
        calendar,
        value: innerValue.value,
        defaultValue: defaultValues.value[index],
        getClasses: getRangeClasses,
        // don't update when range is true
        partialUpdate: false,
        multiple: false,
        ['onUpdate:value']: handlePick,
        onCalendarChange: index === 0 ? updateCalendarStart : updateCalendarEnd,
        onDateMouseLeave: handleMouseLeave,
        onDateMouseEnter: handleMouseEnter,
      };
      return <Calendar {...calendarProps}></Calendar>;
    });
    return <div class={`${prefixClass}-calendar-range`}>{calendarRange}</div>;
  };
}

export const calendarRangeProps = calendarProps;

export default defineVueComponent(CalendarRange, calendarRangeProps);
