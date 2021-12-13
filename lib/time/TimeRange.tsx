import { watchEffect, ref } from 'vue';
import { usePrefixClass } from '../context';
import { isValidRangeDate, startOfDay } from '../util/date';
import { defineVueComponent, withDefault } from '../vueUtil';
import TimePanel, { timePanelProps, TimePanelProps } from './TimePanel';

export interface TimeRangeProps
  extends Omit<TimePanelProps, 'onUpdate:value' | 'value' | 'defaultValue'> {
  value?: Date[];
  defaultValue?: Date | Date[];
  ['onUpdate:value']?: (value: Date[], type: string, index?: number) => void;
}

function TimeRange(originalProps: TimeRangeProps) {
  const props = withDefault(originalProps, {
    defaultValue: startOfDay(new Date()),
    disabledTime: () => false,
  });

  const prefixClass = usePrefixClass();

  const innerValue = ref([new Date(NaN), new Date(NaN)]);

  watchEffect(() => {
    if (isValidRangeDate(props.value)) {
      innerValue.value = props.value;
    } else {
      innerValue.value = [new Date(NaN), new Date(NaN)];
    }
  });

  const emitChange = (type: string, index: number) => {
    props['onUpdate:value']?.(innerValue.value, type === 'time' ? 'time-range' : type, index);
  };

  const handleSelectStart = (date: Date, type: string) => {
    innerValue.value[0] = date;
    // check the NaN
    if (!(innerValue.value[1].getTime() >= date.getTime())) {
      innerValue.value[1] = date;
    }
    emitChange(type, 0);
  };
  const handleSelectEnd = (date: Date, type: string) => {
    innerValue.value[1] = date;
    // check the NaN
    if (!(innerValue.value[0].getTime() <= date.getTime())) {
      innerValue.value[0] = date;
    }
    emitChange(type, 1);
  };

  const disabledStartTime = (date: Date) => {
    return props.disabledTime(date, 0);
  };

  const disabledEndTime = (date: Date) => {
    return date.getTime() < innerValue.value[0].getTime() || props.disabledTime(date, 1);
  };

  return () => {
    const defaultValues = Array.isArray(props.defaultValue)
      ? props.defaultValue
      : [props.defaultValue, props.defaultValue];

    return (
      <div class={`${prefixClass}-time-range`}>
        <TimePanel
          {...{ ...props, ['onUpdate:value']: handleSelectStart }}
          value={innerValue.value[0]}
          defaultValue={defaultValues[0]}
          disabledTime={disabledStartTime}
        />
        <TimePanel
          {...{ ...props, ['onUpdate:value']: handleSelectEnd }}
          value={innerValue.value[1]}
          defaultValue={defaultValues[1]}
          disabledTime={disabledEndTime}
        />
      </div>
    );
  };
}

export const timeRangeProps = timePanelProps;
export default defineVueComponent(TimeRange, timeRangeProps);
