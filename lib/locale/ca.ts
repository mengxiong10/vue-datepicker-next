import DatePicker from 'vue-datepicker-next';
import ca from 'date-format-parse/es/locale/ca';

const lang = {
  formatLocale: ca,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ca', lang);

export default lang;
