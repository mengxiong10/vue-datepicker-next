import DatePicker from 'vue-datepicker-next';
import fi from 'date-format-parse/es/locale/fi';

const lang = {
  formatLocale: fi,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('fi', lang);

export default lang;
