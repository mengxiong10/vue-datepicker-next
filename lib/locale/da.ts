import DatePicker from 'vue-datepicker-next';
import da from 'date-format-parse/es/locale/da';

const lang = {
  formatLocale: da,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('da', lang);

export default lang;
