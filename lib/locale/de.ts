import DatePicker from 'vue-datepicker-next';
import de from 'date-format-parse/es/locale/de';

const lang = {
  formatLocale: de,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('de', lang);

export default lang;
