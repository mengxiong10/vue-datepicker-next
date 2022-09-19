import DatePicker from 'vue-datepicker-next';
import ar from 'date-format-parse/es/locale/ar';

const lang = {
  formatLocale: ar,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ar', lang);

export default lang;
