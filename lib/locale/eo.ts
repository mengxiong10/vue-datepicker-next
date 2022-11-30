import DatePicker from 'vue-datepicker-next';
import eo from 'date-format-parse/es/locale/eo';

const lang = {
  formatLocale: eo,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('eo', lang);

export default lang;
