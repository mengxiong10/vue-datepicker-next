import DatePicker from 'vue-datepicker-next';
import ro from 'date-format-parse/es/locale/ro';

const lang = {
  formatLocale: ro,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('ro', lang);

export default lang;
