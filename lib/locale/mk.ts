import DatePicker from 'vue-datepicker-next';
import mk from 'date-format-parse/es/locale/mk';

const lang = {
  formatLocale: mk,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('mk', lang);

export default lang;
