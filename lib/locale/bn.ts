import DatePicker from 'vue-datepicker-next';
import bn from 'date-format-parse/es/locale/bn';

const lang = {
  formatLocale: bn,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('bn', lang);

export default lang;
