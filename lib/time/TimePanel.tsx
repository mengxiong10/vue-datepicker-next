import { format } from 'date-format-parse';
import { ref, onMounted, watch, watchEffect } from 'vue';
import { useLocale, usePrefixClass } from '../context';
import { getValidDate, startOfDay } from '../util/date';
import { getScrollParent } from '../util/dom';
import { Columns } from './Columns';
import { FixedList } from './FixedList';
import { getColumnOptions, getFixedOptions, TimePickerOptions } from './getOptions';
import { defineVueComponent, keys, withDefault } from '../vueUtil';

export interface TimePanelProps {
  value?: Date;
  defaultValue?: Date;
  format?: string;
  timeTitleFormat?: string;
  showTimeHeader?: boolean;
  disabledTime?: (v: Date, i?: number) => boolean;
  timePickerOptions?: TimePickerOptions;
  hourOptions?: number[];
  minuteOptions?: number[];
  secondOptions?: number[];
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  use12h?: boolean;
  scrollDuration?: number;
  onClickTitle?: (payload: MouseEvent) => void;
  ['onUpdate:value']?: (value: Date, type: string, index?: number) => void;
}

const scrollTo = (element: Element, to: number, duration = 0) => {
  // jump to target if duration zero
  if (duration <= 0) {
    requestAnimationFrame(() => {
      element.scrollTop = to;
    });
    return;
  }
  const difference = to - element.scrollTop;
  const tick = (difference / duration) * 10;
  requestAnimationFrame(() => {
    const scrollTop = element.scrollTop + tick;
    if (scrollTop >= to) {
      element.scrollTop = to;
      return;
    }
    element.scrollTop = scrollTop;
    scrollTo(element, to, duration - 10);
  });
};

function TimePanel(originalProps: TimePanelProps) {
  const props = withDefault(originalProps, {
    defaultValue: startOfDay(new Date()),
    format: 'HH:mm:ss',
    timeTitleFormat: 'YYYY-MM-DD',
    disabledTime: () => false,
    scrollDuration: 100,
  });
  const prefixClass = usePrefixClass();
  const locale = useLocale();

  const formatDate = (date: Date, fmt: string) => {
    return format(date, fmt, { locale: locale.value.formatLocale });
  };

  const innerValue = ref<Date>(new Date());
  watchEffect(() => {
    innerValue.value = getValidDate(props.value!, props.defaultValue);
  });

  const isDisabledTimes = (value: Array<number | Date> | number | Date) => {
    if (Array.isArray(value)) {
      return value.every((v) => props.disabledTime(new Date(v)));
    }
    return props.disabledTime(new Date(value));
  };

  const isDisabledHour = (date: Date) => {
    const value = new Date(date);
    return isDisabledTimes([
      value.getTime(),
      value.setMinutes(0, 0, 0),
      value.setMinutes(59, 59, 999),
    ]);
  };
  const isDisabledMinute = (date: Date) => {
    const value = new Date(date);
    return isDisabledTimes([value.getTime(), value.setSeconds(0, 0), value.setSeconds(59, 999)]);
  };
  const isDisabledAMPM = (date: Date) => {
    const value = new Date(date);
    const minHour = value.getHours() < 12 ? 0 : 12;
    const maxHour = minHour + 11;
    return isDisabledTimes([
      value.getTime(),
      value.setHours(minHour, 0, 0, 0),
      value.setHours(maxHour, 59, 59, 999),
    ]);
  };
  const isDisabled = (date: Date, type: string) => {
    if (type === 'hour') {
      return isDisabledHour(date);
    }
    if (type === 'minute') {
      return isDisabledMinute(date);
    }
    if (type === 'ampm') {
      return isDisabledAMPM(date);
    }
    return isDisabledTimes(date);
  };

  const handleSelect = (value: Date, type: string) => {
    if (!isDisabled(value, type)) {
      const date = new Date(value);
      innerValue.value = date;
      if (!isDisabledTimes(date)) {
        props['onUpdate:value']?.(date, type);
      }
    }
  };

  const getClasses = (cellDate: Date, type: string) => {
    if (isDisabled(cellDate, type)) {
      return 'disabled';
    }
    if (cellDate.getTime() === innerValue.value.getTime()) {
      return 'active';
    }
    return '';
  };

  const container = ref<HTMLDivElement>();

  const scrollToSelected = (duration: number) => {
    if (!container.value) return;
    const elements = container.value.querySelectorAll('.active');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;
      const scrollElement = getScrollParent(element, container.value);
      if (scrollElement) {
        const to = element.offsetTop;
        scrollTo(scrollElement, to, duration);
      }
    }
  };

  onMounted(() => scrollToSelected(0));

  watch(innerValue, () => scrollToSelected(props.scrollDuration), { flush: 'post' });

  return () => {
    let content: JSX.Element;
    if (props.timePickerOptions) {
      content = (
        <FixedList
          onSelect={handleSelect}
          getClasses={getClasses}
          options={getFixedOptions({
            date: innerValue.value,
            format: props.format,
            option: props.timePickerOptions,
            formatDate,
          })}
        />
      );
    } else {
      content = (
        <Columns
          options={getColumnOptions(innerValue.value, props)}
          onSelect={handleSelect}
          getClasses={getClasses}
        />
      );
    }
    return (
      <div class={`${prefixClass}-time`} ref={container}>
        {props.showTimeHeader && (
          <div class={`${prefixClass}-time-header`}>
            <button
              type="button"
              class={`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-time-header-title`}
              onClick={props.onClickTitle}
            >
              {formatDate(innerValue.value, props.timeTitleFormat)}
            </button>
          </div>
        )}
        <div class={`${prefixClass}-time-content`}>{content}</div>
      </div>
    );
  };
}

export const timePanelProps = keys<TimePanelProps>()([
  'value',
  'defaultValue',
  'format',
  'timeTitleFormat',
  'showTimeHeader',
  'disabledTime',
  'timePickerOptions',
  'hourOptions',
  'minuteOptions',
  'secondOptions',
  'hourStep',
  'minuteStep',
  'secondStep',
  'showHour',
  'showMinute',
  'showSecond',
  'use12h',
  'scrollDuration',
  'onClickTitle',
  'onUpdate:value',
]);

export default defineVueComponent(TimePanel, timePanelProps);
