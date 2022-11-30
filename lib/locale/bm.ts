import DatePicker from 'vue-datepicker-next';
import bm from 'date-format-parse/es/locale/bm';

const lang = {
  formatLocale: bm,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('bm', lang);

export default lang;
