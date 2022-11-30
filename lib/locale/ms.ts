import DatePicker from 'vue-datepicker-next';
import ms from 'date-format-parse/es/locale/ms';

const lang = {
  formatLocale: ms,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ms', lang);

export default lang;
