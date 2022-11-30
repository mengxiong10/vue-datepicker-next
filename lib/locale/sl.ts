import DatePicker from 'vue-datepicker-next';
import sl from 'date-format-parse/es/locale/sl';

const lang = {
  formatLocale: sl,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('sl', lang);

export default lang;
