import DatePicker from 'vue-datepicker-next';
import lt from 'date-format-parse/es/locale/lt';

const lang = {
  formatLocale: lt,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('lt', lang);

export default lang;
