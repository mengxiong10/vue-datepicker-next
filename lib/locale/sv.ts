import DatePicker from 'vue-datepicker-next';
import sv from 'date-format-parse/es/locale/sv';

const lang = {
  formatLocale: sv,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('sv', lang);

export default lang;
