import DatePicker from 'vue-datepicker-next';
import sr from 'date-format-parse/es/locale/sr';

const lang = {
  formatLocale: sr,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('sr', lang);

export default lang;
