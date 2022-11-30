import DatePicker from 'vue-datepicker-next';
import is from 'date-format-parse/es/locale/is';

const lang = {
  formatLocale: is,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('is', lang);

export default lang;
