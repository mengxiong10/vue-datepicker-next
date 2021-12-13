import DatePicker from 'vue-datepicker-next';
import af from 'date-format-parse/es/locale/af';

const lang = {
  formatLocale: af,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('af', lang);

export default lang;
