import DatePicker from 'vue-datepicker-next';
import hu from 'date-format-parse/es/locale/hu';

const lang = {
  formatLocale: hu,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
  buddhistYear: false,
};

DatePicker.locale('hu', lang);

export default lang;
