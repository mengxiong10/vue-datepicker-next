import DatePicker from 'vue-datepicker-next';
import nb from 'date-format-parse/es/locale/nb';

const lang = {
  formatLocale: nb,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('nb', lang);

export default lang;
