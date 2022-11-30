import DatePicker from 'vue-datepicker-next';
import ta from 'date-format-parse/es/locale/ta';

const lang = {
  formatLocale: ta,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ta', lang);

export default lang;
