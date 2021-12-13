import { padNumber } from '../util/base';
import { ColumnOption } from './Columns';
import { FixedListItem } from './FixedList';
import { TimePanelProps } from './TimePanel';

function generateList({
  length,
  step = 1,
  options,
}: {
  length: number;
  step?: number;
  options?: number[];
}): number[] {
  if (Array.isArray(options)) {
    return options.filter((v) => v >= 0 && v < length);
  }
  if (step <= 0) {
    step = 1;
  }
  const arr = [];
  for (let i = 0; i < length; i += step) {
    arr.push(i);
  }
  return arr;
}

export function getColumnOptions(date: Date, options: TimePanelProps) {
  let { showHour, showMinute, showSecond, use12h } = options;
  const format = options.format || 'HH:mm:ss';
  showHour = typeof showHour === 'boolean' ? showHour : /[HhKk]/.test(format);
  showMinute = typeof showMinute === 'boolean' ? showMinute : /m/.test(format);
  showSecond = typeof showSecond === 'boolean' ? showSecond : /s/.test(format);
  use12h = typeof use12h === 'boolean' ? use12h : /a/i.test(format);

  const columns: ColumnOption[] = [];
  const isPM = use12h && date.getHours() >= 12;

  if (showHour) {
    columns.push({
      type: 'hour',
      list: generateList({
        length: use12h ? 12 : 24,
        step: options.hourStep,
        options: options.hourOptions,
      }).map((num) => {
        const text = num === 0 && use12h ? '12' : padNumber(num);
        const value = new Date(date);
        value.setHours(isPM ? num + 12 : num);
        return { value, text };
      }),
    });
  }

  if (showMinute) {
    columns.push({
      type: 'minute',
      list: generateList({
        length: 60,
        step: options.minuteStep,
        options: options.minuteOptions,
      }).map((num) => {
        const value = new Date(date);
        value.setMinutes(num);
        return { value, text: padNumber(num) };
      }),
    });
  }

  if (showSecond) {
    columns.push({
      type: 'second',
      list: generateList({
        length: 60,
        step: options.secondStep,
        options: options.secondOptions,
      }).map((num) => {
        const value = new Date(date);
        value.setSeconds(num);
        return { value, text: padNumber(num) };
      }),
    });
  }

  if (use12h) {
    columns.push({
      type: 'ampm',
      list: ['AM', 'PM'].map((text, i) => {
        const value = new Date(date);
        value.setHours((value.getHours() % 12) + i * 12);
        return { text, value };
      }),
    });
  }

  return columns;
}

function parseOption(time = '') {
  const values = time.split(':');
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10);
    const minutes = parseInt(values[1], 10);
    return {
      hours,
      minutes,
    };
  }
  return null;
}

interface TimePickerFormat {
  start?: string;
  end?: string;
  step?: string;
  format?: string;
}

type TimePickerFunction = () => Array<{ value: Date; text: string }>;

export type TimePickerOptions = TimePickerFormat | TimePickerFunction;

export function getFixedOptions({
  date,
  option,
  format,
  formatDate,
}: {
  date: Date;
  option: TimePickerOptions;
  format: string;
  formatDate: (v: Date, fmt: string) => string;
}) {
  const result: FixedListItem[] = [];
  if (typeof option === 'function') {
    return option() || [];
  }
  const start = parseOption(option.start);
  const end = parseOption(option.end);
  const step = parseOption(option.step);
  const fmt = option.format || format;
  if (start && end && step) {
    const startMinutes = start.minutes + start.hours * 60;
    const endMinutes = end.minutes + end.hours * 60;
    const stepMinutes = step.minutes + step.hours * 60;
    const len = Math.floor((endMinutes - startMinutes) / stepMinutes);
    for (let i = 0; i <= len; i++) {
      const timeMinutes = startMinutes + i * stepMinutes;
      const hours = Math.floor(timeMinutes / 60);
      const minutes = timeMinutes % 60;
      const value = new Date(date);
      value.setHours(hours, minutes, 0);
      result.push({
        value,
        text: formatDate(value, fmt),
      });
    }
  }
  return result;
}
