import DatePicker from 'vue-datepicker-next';
import nlBE from 'date-format-parse/es/locale/nl-be';

const lang = {
  formatLocale: nlBE,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('nl-be', lang);

export default lang;
