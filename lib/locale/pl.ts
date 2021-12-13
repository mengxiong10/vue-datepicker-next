import DatePicker from 'vue-datepicker-next';
import pl from 'date-format-parse/es/locale/pl';

const lang = {
  formatLocale: pl,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('pl', lang);

export default lang;
