import DatePicker from 'vue-datepicker-next';
import cs from 'date-format-parse/es/locale/cs';

const lang = {
  formatLocale: cs,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('cs', lang);

export default lang;
