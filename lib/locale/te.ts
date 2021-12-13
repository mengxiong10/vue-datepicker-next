import DatePicker from 'vue-datepicker-next';
import te from 'date-format-parse/es/locale/te';

const lang = {
  formatLocale: te,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('te', lang);

export default lang;
