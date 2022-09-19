import DatePicker from 'vue-datepicker-next';
import az from 'date-format-parse/es/locale/az';

const lang = {
  formatLocale: az,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('az', lang);

export default lang;
