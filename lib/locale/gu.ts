import DatePicker from 'vue-datepicker-next';
import gu from 'date-format-parse/es/locale/gu';

const lang = {
  formatLocale: gu,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('gu', lang);

export default lang;
