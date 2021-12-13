import DatePicker from 'vue-datepicker-next';
import hr from 'date-format-parse/es/locale/hr';

const lang = {
  formatLocale: hr,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('hr', lang);

export default lang;
