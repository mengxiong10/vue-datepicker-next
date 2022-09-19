import DatePicker from 'vue-datepicker-next';
import uk from 'date-format-parse/es/locale/uk';

const lang = {
  formatLocale: uk,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('uk', lang);

export default lang;
