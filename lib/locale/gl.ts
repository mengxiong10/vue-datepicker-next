import DatePicker from 'vue-datepicker-next';
import gl from 'date-format-parse/es/locale/gl';

const lang = {
  formatLocale: gl,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('gl', lang);

export default lang;
