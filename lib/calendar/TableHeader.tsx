import { SetupContext } from 'vue';
import { ButtonIcon } from './ButtonIcon';
import { setMonth, setYear } from '../util/date';
import { usePrefixClass } from '../context';
export interface TableHeaderProps {
  type: 'date' | 'month' | 'year';
  calendar: Date;
  onUpdateCalendar: (value: Date) => void;
}

export function TableHeader(
  { type, calendar, onUpdateCalendar }: TableHeaderProps,
  { slots }: SetupContext
) {
  const prefixClass = usePrefixClass();

  const lastMonth = () => {
    onUpdateCalendar(setMonth(calendar, (v) => v - 1));
  };
  const nextMonth = () => {
    onUpdateCalendar(setMonth(calendar, (v) => v + 1));
  };
  const lastYear = () => {
    onUpdateCalendar(setYear(calendar, (v) => v - 1));
  };
  const nextYear = () => {
    onUpdateCalendar(setYear(calendar, (v) => v + 1));
  };

  const lastDecade = () => {
    onUpdateCalendar(setYear(calendar, (v) => v - 10));
  };

  const nextDecade = () => {
    onUpdateCalendar(setYear(calendar, (v) => v + 10));
  };

  return (
    <div class={`${prefixClass}-calendar-header`}>
      <ButtonIcon
        value="double-left"
        onClick={type === 'year' ? lastDecade : lastYear}
      ></ButtonIcon>
      {type === 'date' && <ButtonIcon value="left" onClick={lastMonth}></ButtonIcon>}
      <ButtonIcon
        value="double-right"
        onClick={type === 'year' ? nextDecade : nextYear}
      ></ButtonIcon>
      {type === 'date' && <ButtonIcon value="right" onClick={nextMonth}></ButtonIcon>}
      <span class={`${prefixClass}-calendar-header-label`}>{slots.default?.()}</span>
    </div>
  );
}
