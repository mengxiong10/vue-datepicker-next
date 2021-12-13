/* istanbul ignore file */
import { App } from 'vue';
import DatePicker from './DatePicker';
import Calendar from './calendar/Calendar';
import CalendarRange from './calendar/CalendarRange';
import TimePanel from './time/TimePanel';
import TimeRange from './time/TimeRange';
import DateTime from './datetime/DateTime';
import DateTimeRange from './datetime/DateTimeRange';
import { locale } from './locale';

const api = {
  locale,
  install: (app: App) => {
    app.component('date-picker', DatePicker);
  },
};

export default Object.assign(DatePicker, api, {
  Calendar,
  CalendarRange,
  TimePanel,
  TimeRange,
  DateTime,
  DateTimeRange,
});
