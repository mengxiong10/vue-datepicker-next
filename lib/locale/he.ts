import DatePicker from 'vue-datepicker-next';
import he from 'date-format-parse/es/locale/he';

const lang = {
  formatLocale: he,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('he', lang);

export default lang;
