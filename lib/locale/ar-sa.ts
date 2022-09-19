import DatePicker from 'vue-datepicker-next';
import arSA from 'date-format-parse/es/locale/ar-sa';

const lang = {
  formatLocale: arSA,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ar-sa', lang);

export default lang;
