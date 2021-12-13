import DatePicker from 'vue-datepicker-next';
import lv from 'date-format-parse/es/locale/lv';

const lang = {
  formatLocale: lv,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('lv', lang);

export default lang;
