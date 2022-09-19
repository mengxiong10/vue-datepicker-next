import DatePicker from 'vue-datepicker-next';
import kk from 'date-format-parse/es/locale/kk';

const lang = {
  formatLocale: kk,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('kk', lang);

export default lang;
