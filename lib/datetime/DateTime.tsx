import { ref, watchEffect } from 'vue';
import Calendar, { calendarProps, CalendarProps } from '../calendar/Calendar';
import TimePanel, { timePanelProps, TimePanelProps } from '../time/TimePanel';
import { usePrefixClass } from '../context';
import { pick } from '../util/base';
import { assignTime, getValidDate, startOfDay } from '../util/date';
import { keys, withDefault, defineVueComponent } from '../vueUtil';
import { useTimePanelVisible } from './useTimePanelVisible';

export interface DateTimeBaseProps {
  showTimePanel?: boolean;
  onShowTimePanelChange?: (v: boolean) => void;
}

export type DateTimeProps = DateTimeBaseProps & CalendarProps & TimePanelProps;

function DateTime(originalProps: DateTimeProps) {
  const props = withDefault(originalProps, {
    disabledTime: () => false,
    defaultValue: startOfDay(new Date()),
  });

  const currentValue = ref(props.value);

  watchEffect(() => {
    currentValue.value = props.value;
  });

  const { openTimePanel, closeTimePanel, timeVisible } = useTimePanelVisible(props);

  const handleSelect = (date: Date, type: string) => {
    if (type === 'date') {
      openTimePanel();
    }
    let datetime = assignTime(date, getValidDate(props.value, props.defaultValue));
    if (props.disabledTime(new Date(datetime))) {
      // set the time of defalutValue;
      datetime = assignTime(date, props.defaultValue);
      if (props.disabledTime(new Date(datetime))) {
        // if disabled don't emit date
        currentValue.value = datetime;
        return;
      }
    }
    props['onUpdate:value']?.(datetime, type);
  };

  return () => {
    const prefixClass = usePrefixClass();

    const calendarProp = {
      ...pick(props, calendarProps),
      multiple: false,
      type: 'date' as const,
      value: currentValue.value,
      ['onUpdate:value']: handleSelect,
    };
    const timeProps = {
      ...pick(props, timePanelProps),
      showTimeHeader: true,
      value: currentValue.value,
      ['onUpdate:value']: props['onUpdate:value'],
      onClickTitle: closeTimePanel,
    };

    return (
      <div class={`${prefixClass}-date-time`}>
        <Calendar {...calendarProp} />
        {timeVisible.value && <TimePanel {...timeProps} />}
      </div>
    );
  };
}

export const datetimeBaseProps = keys<DateTimeBaseProps>()([
  'showTimePanel',
  'onShowTimePanelChange',
]);

export const datetimeProps = [...datetimeBaseProps, ...calendarProps, ...timePanelProps];

export default defineVueComponent(DateTime, datetimeProps);
