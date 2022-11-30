import DatePicker from 'vue-datepicker-next';
import tr from 'date-format-parse/es/locale/tr';

const lang = {
  formatLocale: tr,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('tr', lang);

export default lang;
