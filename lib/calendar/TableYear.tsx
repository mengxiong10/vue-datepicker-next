import { usePrefixClass, useLocale } from '../context';
import { chunk, last } from '../util/base';
import { createDate } from '../util/date';
import { TableHeader, TableHeaderProps } from './TableHeader';
export interface TableYearProps extends Omit<TableHeaderProps, 'type'> {
  getCellClasses?: (v: Date) => string[] | string;
  getYearPanel?: (v: Date, l: any) => number[][];
  onSelect: (v: Date) => void;
}

const getDefaultYears = (calendar: Date, locale: any) => {
  let firstYear;
  if (locale.buddhistYear) {
    firstYear = Math.floor((calendar.getFullYear() + 543) / 10) * 10 - 543;
  } else {
    firstYear = Math.floor(calendar.getFullYear() / 10) * 10;
  }
  const years = [];
  for (let i = 0; i < 10; i++) {
    years.push(firstYear + i);
  }
  return chunk(years, 2);
};

export function TableYear({
  calendar,
  getCellClasses = () => [],
  getYearPanel = getDefaultYears,
  onSelect,
  onUpdateCalendar,
}: TableYearProps) {
  const prefixClass = usePrefixClass();
  const locale = useLocale().value;

  const getDate = (year: number) => {
    return createDate(year, 0);
  };

  const handleClick = (evt: MouseEvent) => {
    const target = evt.currentTarget as HTMLElement;
    const year = target.getAttribute('data-year')!;
    onSelect(getDate(parseInt(year, 10)));
  };

  const years = getYearPanel(new Date(calendar), locale);
  const firstYear = locale.buddhistYear ? 543 + years[0][0] : years[0][0];
  const lastYear = locale.buddhistYear ? 543 + (last(last(years)) ?? 0) : last(last(years));

  return (
    <div class={`${prefixClass}-calendar ${prefixClass}-calendar-panel-year`}>
      <TableHeader type="year" calendar={calendar} onUpdateCalendar={onUpdateCalendar}>
        <span>{firstYear}</span>
        <span class={`${prefixClass}-calendar-decade-separator`}></span>
        <span>{lastYear}</span>
      </TableHeader>
      <div class={`${prefixClass}-calendar-content`}>
        <table class={`${prefixClass}-table ${prefixClass}-table-year`}>
          {years.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  class={['cell', getCellClasses(getDate(cell))]}
                  data-year={cell}
                  onClick={handleClick}
                >
                  <div>{locale.buddhistYear ? 543 + cell : cell}</div>
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
