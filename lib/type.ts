import { Locale as FormatLocale } from 'date-format-parse/es/locale';

export interface Locale {
  formatLocale: FormatLocale;
  // the calendar header, default formatLocale.weekdaysMin
  days?: string[];
  // the calendar months, default formatLocale.monthsShort
  months?: string[];
  // the calendar title of year
  yearFormat: string;
  // the calendar title of month
  monthFormat: string;
  // the calendar title of month before year
  monthBeforeYear: boolean;
  // the calendar show year format as Buddhist calendar (AD + 543)
  buddhistYear: boolean;
}

export type PlainObject = Record<string, any>;

export type ClassValue = string | Record<string, boolean> | Array<ClassValue>;

export type DateValue = string | number | Date | null | undefined | Array<DateValue>;

export type PickerType = 'date' | 'year' | 'month' | 'week' | 'datetime' | 'time';

export type Valuetype = 'date' | 'format' | 'timestamp' | string;

export type PanelType = 'date' | 'month' | 'year';

export interface Formatter {
  stringify?: (v: Date, fmt: string) => string;
  parse?: (v: string, fmt: string) => Date;
  getWeek?: (v: Date) => number;
}
