import DatePicker from 'vue-datepicker-next';
import ka from 'date-format-parse/es/locale/ka';

const lang = {
  formatLocale: ka,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ka', lang);

export default lang;
